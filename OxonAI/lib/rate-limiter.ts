import { Plan } from '@prisma/client';

// Credit limits per plan
export const PLAN_LIMITS: Record<Plan, number> = {
    FREE: 100,
    SEED: 1500,
    EDGE: 4000,
    QUANTUM: 8000,
};

// Cost per tool (in credits)
export const TOOL_COSTS: Record<string, number> = {
    chat: 1,
    content: 3,
    code: 2,
    idea: 2,
    summarize: 1,
    rewrite: 1,
};

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    resetAt: Date;
}

export function calculateCreditsUsed(tokens: number): number {
    // 1 credit per 100 tokens, minimum 1 credit
    return Math.max(1, Math.ceil(tokens / 100));
}

export async function checkRateLimit(
    userId: string,
    plan: Plan,
    tool: string,
    prisma: any
): Promise<RateLimitResult> {
    const limit = PLAN_LIMITS[plan];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get total tokens used this month
    const usage = await prisma.usage.aggregate({
        where: {
            userId,
            createdAt: {
                gte: startOfMonth,
                lte: now,
            },
        },
        _sum: {
            tokens: true,
        },
    });

    const tokensUsed = usage._sum.tokens || 0;
    const creditsUsed = calculateCreditsUsed(tokensUsed);
    const remaining = Math.max(0, limit - creditsUsed);
    const toolCost = TOOL_COSTS[tool] || 1;

    return {
        allowed: remaining >= toolCost,
        remaining,
        limit,
        resetAt: endOfMonth,
    };
}

export async function recordUsage(
    userId: string,
    tool: string,
    tokens: number,
    prompt: string,
    response: string,
    prisma: any
): Promise<void> {
    await prisma.usage.create({
        data: {
            userId,
            tool,
            tokens,
            prompt: prompt.substring(0, 1000), // Limit stored prompt length
            response: response.substring(0, 2000), // Limit stored response length
        },
    });

    // Update user credits
    const creditsUsed = calculateCreditsUsed(tokens);
    await prisma.user.update({
        where: { id: userId },
        data: {
            credits: {
                decrement: creditsUsed,
            },
        },
    });
}

export async function getUserUsageStats(userId: string, prisma: any) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [monthlyUsage, totalUsage, usageByTool] = await Promise.all([
        prisma.usage.aggregate({
            where: {
                userId,
                createdAt: { gte: startOfMonth },
            },
            _sum: { tokens: true },
            _count: true,
        }),
        prisma.usage.aggregate({
            where: { userId },
            _sum: { tokens: true },
            _count: true,
        }),
        prisma.usage.groupBy({
            by: ['tool'],
            where: {
                userId,
                createdAt: { gte: startOfMonth },
            },
            _sum: { tokens: true },
            _count: true,
        }),
    ]);

    return {
        monthly: {
            tokens: monthlyUsage._sum.tokens || 0,
            requests: monthlyUsage._count || 0,
        },
        total: {
            tokens: totalUsage._sum.tokens || 0,
            requests: totalUsage._count || 0,
        },
        byTool: usageByTool.map((u: any) => ({
            tool: u.tool,
            tokens: u._sum.tokens || 0,
            requests: u._count || 0,
        })),
    };
}
