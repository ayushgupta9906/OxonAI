import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateAIResponse, SYSTEM_PROMPTS } from '@/lib/ai/openai-service';
import { checkRateLimit, recordUsage } from '@/lib/rate-limiter';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const plan = (session.user as any).plan || 'FREE';

        // Check rate limit
        const rateLimit = await checkRateLimit(userId, plan, 'chat', prisma);
        if (!rateLimit.allowed) {
            return NextResponse.json({
                error: 'Rate limit exceeded',
                remaining: rateLimit.remaining,
                resetAt: rateLimit.resetAt,
            }, { status: 429 });
        }

        // Generate AI response
        const response = await generateAIResponse({
            systemPrompt: SYSTEM_PROMPTS.chat,
            userPrompt: message,
            temperature: 0.7,
            maxTokens: 2000,
        });

        // Record usage
        await recordUsage(userId, 'chat', response.tokens, message, response.content, prisma);

        return NextResponse.json({
            content: response.content,
            tokens: response.tokens,
            remaining: rateLimit.remaining - 1,
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}
