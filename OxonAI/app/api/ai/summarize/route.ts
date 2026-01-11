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

        const { text, style = 'concise', length = 'medium' } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const plan = (session.user as any).plan || 'FREE';

        // Check rate limit
        const rateLimit = await checkRateLimit(userId, plan, 'summarize', prisma);
        if (!rateLimit.allowed) {
            return NextResponse.json({
                error: 'Rate limit exceeded',
                remaining: rateLimit.remaining,
                resetAt: rateLimit.resetAt,
            }, { status: 429 });
        }

        const styleInstructions: Record<string, string> = {
            concise: 'Create a concise summary focusing on key points only.',
            detailed: 'Create a detailed summary that preserves important nuances and context.',
            bullets: 'Summarize as bullet points for easy scanning.',
            executive: 'Create an executive summary suitable for business stakeholders.',
        };

        const lengthInstructions: Record<string, string> = {
            short: 'Keep the summary to 1-2 paragraphs or 5-7 bullet points.',
            medium: 'Keep the summary to 3-4 paragraphs or 8-12 bullet points.',
            long: 'Create a comprehensive summary that covers all major points.',
        };

        const fullPrompt = `${styleInstructions[style] || styleInstructions.concise}
${lengthInstructions[length] || lengthInstructions.medium}

Text to summarize:
${text}`;

        // Generate AI response
        const response = await generateAIResponse({
            systemPrompt: SYSTEM_PROMPTS.summarize,
            userPrompt: fullPrompt,
            temperature: 0.5,
            maxTokens: 1500,
        });

        // Record usage
        await recordUsage(userId, 'summarize', response.tokens, text.substring(0, 500), response.content, prisma);

        return NextResponse.json({
            content: response.content,
            tokens: response.tokens,
            remaining: rateLimit.remaining - 1,
        });
    } catch (error) {
        console.error('Summarize API Error:', error);
        return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
    }
}
