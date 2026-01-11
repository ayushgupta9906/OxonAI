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

        const { topic, category = 'general', count = 5 } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const plan = (session.user as any).plan || 'FREE';

        // Check rate limit
        const rateLimit = await checkRateLimit(userId, plan, 'idea', prisma);
        if (!rateLimit.allowed) {
            return NextResponse.json({
                error: 'Rate limit exceeded',
                remaining: rateLimit.remaining,
                resetAt: rateLimit.resetAt,
            }, { status: 429 });
        }

        const categoryPrompts: Record<string, string> = {
            general: 'creative and innovative ideas',
            business: 'business and startup ideas with market potential',
            content: 'content and creative project ideas',
            product: 'product feature and improvement ideas',
            marketing: 'marketing campaign and growth strategy ideas',
        };

        const fullPrompt = `Generate ${count} ${categoryPrompts[category] || categoryPrompts.general} for: ${topic}

For each idea:
1. Give it a catchy title
2. Provide a brief description (2-3 sentences)
3. List potential benefits or opportunities
4. Rate difficulty (Easy/Medium/Hard)

Be creative, practical, and think outside the box!`;

        // Generate AI response
        const response = await generateAIResponse({
            systemPrompt: SYSTEM_PROMPTS.idea,
            userPrompt: fullPrompt,
            temperature: 0.9, // Higher temperature for more creative ideas
            maxTokens: 2000,
        });

        // Record usage
        await recordUsage(userId, 'idea', response.tokens, topic, response.content, prisma);

        return NextResponse.json({
            content: response.content,
            tokens: response.tokens,
            remaining: rateLimit.remaining - 2,
        });
    } catch (error) {
        console.error('Idea API Error:', error);
        return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 });
    }
}
