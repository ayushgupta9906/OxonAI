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

        const { prompt, language = 'auto', action = 'write' } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const plan = (session.user as any).plan || 'FREE';

        // Check rate limit
        const rateLimit = await checkRateLimit(userId, plan, 'code', prisma);
        if (!rateLimit.allowed) {
            return NextResponse.json({
                error: 'Rate limit exceeded',
                remaining: rateLimit.remaining,
                resetAt: rateLimit.resetAt,
            }, { status: 429 });
        }

        const actionPrompts: Record<string, string> = {
            write: 'Write code for the following request. Include comments explaining the logic.',
            debug: 'Debug the following code. Identify issues and provide the corrected version with explanations.',
            explain: 'Explain the following code in detail. Break down what each part does.',
            optimize: 'Optimize the following code for better performance and readability.',
            convert: `Convert the following code to ${language}. Maintain the same functionality.`,
        };

        const fullPrompt = `${actionPrompts[action] || actionPrompts.write}

${language !== 'auto' ? `Target language: ${language}` : ''}

${prompt}`;

        // Generate AI response
        const response = await generateAIResponse({
            systemPrompt: SYSTEM_PROMPTS.code,
            userPrompt: fullPrompt,
            temperature: 0.3, // Lower temperature for more precise code
            maxTokens: 3000,
        });

        // Record usage
        await recordUsage(userId, 'code', response.tokens, prompt, response.content, prisma);

        return NextResponse.json({
            content: response.content,
            tokens: response.tokens,
            remaining: rateLimit.remaining - 2,
        });
    } catch (error) {
        console.error('Code API Error:', error);
        return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
    }
}
