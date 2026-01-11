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

        const { text, tone = 'professional', style = 'paraphrase' } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const plan = (session.user as any).plan || 'FREE';

        // Check rate limit
        const rateLimit = await checkRateLimit(userId, plan, 'rewrite', prisma);
        if (!rateLimit.allowed) {
            return NextResponse.json({
                error: 'Rate limit exceeded',
                remaining: rateLimit.remaining,
                resetAt: rateLimit.resetAt,
            }, { status: 429 });
        }

        const toneDescriptions: Record<string, string> = {
            professional: 'professional and business-appropriate',
            casual: 'casual and conversational',
            formal: 'formal and academic',
            friendly: 'warm and friendly',
            persuasive: 'persuasive and compelling',
            simple: 'simple and easy to understand',
        };

        const styleInstructions: Record<string, string> = {
            paraphrase: 'Rewrite the text completely while keeping the same meaning.',
            simplify: 'Simplify the text to make it easier to understand.',
            expand: 'Expand the text with more details and examples.',
            shorten: 'Condense the text while preserving the key message.',
            improve: 'Improve the clarity, flow, and impact of the text.',
        };

        const fullPrompt = `${styleInstructions[style] || styleInstructions.paraphrase}

Target tone: ${toneDescriptions[tone] || toneDescriptions.professional}

Original text:
${text}

Provide only the rewritten text without any explanations.`;

        // Generate AI response
        const response = await generateAIResponse({
            systemPrompt: SYSTEM_PROMPTS.rewrite,
            userPrompt: fullPrompt,
            temperature: 0.7,
            maxTokens: 2000,
        });

        // Record usage
        await recordUsage(userId, 'rewrite', response.tokens, text.substring(0, 500), response.content, prisma);

        return NextResponse.json({
            content: response.content,
            tokens: response.tokens,
            remaining: rateLimit.remaining - 1,
        });
    } catch (error) {
        console.error('Rewrite API Error:', error);
        return NextResponse.json({ error: 'Failed to rewrite' }, { status: 500 });
    }
}
