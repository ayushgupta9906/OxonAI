import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateAIResponse, SYSTEM_PROMPTS } from '@/lib/ai/openai-service';
import { checkRateLimit, recordUsage } from '@/lib/rate-limiter';
import prisma from '@/lib/db';

const CONTENT_TYPE_PROMPTS: Record<string, string> = {
    blog: 'Write an engaging blog post with a compelling headline, introduction, body sections with subheadings, and a conclusion with a call-to-action.',
    social: 'Create engaging social media content optimized for the platform. Include relevant hashtag suggestions.',
    email: 'Write a professional email with a compelling subject line, personalized greeting, clear body content, and strong call-to-action.',
    ad: 'Create persuasive advertising copy with attention-grabbing headlines, benefit-focused body text, and compelling CTAs.',
    product: 'Write a product description that highlights features, benefits, and creates desire. Include specifications if relevant.',
};

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt, contentType = 'blog', tone = 'professional', length = 'medium' } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;
        const plan = (session.user as any).plan || 'FREE';

        // Check rate limit
        const rateLimit = await checkRateLimit(userId, plan, 'content', prisma);
        if (!rateLimit.allowed) {
            return NextResponse.json({
                error: 'Rate limit exceeded',
                remaining: rateLimit.remaining,
                resetAt: rateLimit.resetAt,
            }, { status: 429 });
        }

        const typePrompt = CONTENT_TYPE_PROMPTS[contentType] || CONTENT_TYPE_PROMPTS.blog;
        const lengthMap: Record<string, number> = { short: 500, medium: 1000, long: 2000 };

        const fullPrompt = `${typePrompt}

Topic/Request: ${prompt}
Tone: ${tone}
Target length: Approximately ${lengthMap[length] || 1000} words`;

        // Generate AI response
        const response = await generateAIResponse({
            systemPrompt: SYSTEM_PROMPTS.content,
            userPrompt: fullPrompt,
            temperature: 0.8,
            maxTokens: lengthMap[length] * 2 || 2000,
        });

        // Record usage
        await recordUsage(userId, 'content', response.tokens, prompt, response.content, prisma);

        return NextResponse.json({
            content: response.content,
            tokens: response.tokens,
            remaining: rateLimit.remaining - 3,
        });
    } catch (error) {
        console.error('Content API Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
