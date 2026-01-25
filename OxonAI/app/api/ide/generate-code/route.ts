import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateAIResponse } from '@/lib/ai/service';
import { prisma } from '@/lib/db';

// IDE Code Generation Endpoint (Server-Side API Keys)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt, language, model } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Check user credits
        const user = await prisma.user.findUnique({
            // @ts-ignore
            where: { id: session.user.id },
            select: { credits: true, plan: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const COST_PER_GENERATION = 10; // Credits per code generation

        if (user.credits < COST_PER_GENERATION) {
            return NextResponse.json({
                error: 'Insufficient credits',
                creditsNeeded: COST_PER_GENERATION,
                currentCredits: user.credits
            }, { status: 402 });
        }

        // Generate code using server-side AI keys
        const systemPrompt = `You are an expert ${language || 'code'} developer. Generate clean, production-ready code based on the requirements.`;

        const response = await generateAIResponse({
            systemPrompt,
            userPrompt: prompt,
            model: model || 'gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 3000
        });

        // Deduct credits
        await prisma.user.update({
            // @ts-ignore
            where: { id: session.user.id },
            data: { credits: { decrement: COST_PER_GENERATION } }
        });

        // Log usage
        await prisma.usage.create({
            data: {
                // @ts-ignore
                userId: session.user.id,
                tokens: response.tokens,
                // @ts-ignore
                model: response.model,
                type: 'IDE_CODE_GEN'
            }
        });

        return NextResponse.json({
            success: true,
            code: response.content,
            tokens: response.tokens,
            creditsUsed: COST_PER_GENERATION,
            creditsRemaining: user.credits - COST_PER_GENERATION
        });

    } catch (error: any) {
        console.error('IDE Code Gen Error:', error);
        return NextResponse.json({
            error: error.message || 'Code generation failed'
        }, { status: 500 });
    }
}
