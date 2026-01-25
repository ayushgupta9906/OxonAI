import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenRouter } from '@openrouter/sdk';

let openaiInstance: OpenAI | null = null;
let googleGenAIInstance: GoogleGenerativeAI | null = null;
let openRouterInstance: OpenRouter | null = null;

function getOpenAI(): OpenAI {
    if (!openaiInstance) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is not set');
        }
        openaiInstance = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiInstance;
}

function getGoogleAI(): GoogleGenerativeAI {
    if (!googleGenAIInstance) {
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY environment variable is not set');
        }
        googleGenAIInstance = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }
    return googleGenAIInstance;
}

function getOpenRouter(): OpenRouter {
    if (!openRouterInstance) {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY environment variable is not set');
        }
        openRouterInstance = new OpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY,
        });
    }
    return openRouterInstance;
}

export interface AIRequestOptions {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
    model?: string;
}

export interface AIResponse {
    content: string;
    tokens: number;
    model: string;
}

// System prompts for each tool
export const SYSTEM_PROMPTS = {
    chat: `You are OxonAI, a helpful, friendly, and knowledgeable AI assistant. You provide clear, accurate, and thoughtful responses to any question or request. Be conversational but professional. If you don't know something, admit it honestly.`,

    content: `You are OxonAI Content Creator, an expert content marketing specialist. You create engaging, SEO-friendly content including:
- Blog posts with compelling headlines and structured sections
- Social media captions that drive engagement
- Marketing copy that converts
- Email campaigns that get opened and clicked
- Product descriptions that sell

Always match the requested tone and style. Format output with clear headings and bullet points when appropriate.`,

    code: `You are OxonAI Code Assistant, an expert programmer proficient in all major programming languages and frameworks. You:
- Write clean, efficient, well-documented code
- Explain complex concepts clearly
- Debug issues methodically
- Follow best practices and design patterns
- Provide complete, runnable solutions

Always include comments explaining key logic. If the request is ambiguous, ask clarifying questions.`,

    idea: `You are OxonAI Idea Generator, a creative strategist and brainstorming expert. You help users:
- Generate innovative business ideas
- Brainstorm creative solutions
- Explore new angles and perspectives
- Identify opportunities and trends
- Think outside the box

Provide multiple ideas with brief explanations. Be bold and creative while staying practical.`,

    summarize: `You are OxonAI Summarizer, an expert at distilling information. You:
- Extract key points and main ideas
- Maintain accuracy while being concise
- Preserve important details and nuances
- Structure summaries logically
- Adjust length based on content complexity

Provide clear, well-organized summaries that capture the essence of the source material.`,

    rewrite: `You are OxonAI Rewriter, a master of language transformation. You can:
- Paraphrase text while preserving meaning
- Adjust tone (professional, casual, formal, friendly)
- Change style (academic, conversational, persuasive)
- Simplify complex text or enhance simple text
- Maintain or improve clarity

Always preserve the core message while applying the requested transformation.`,
};

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export async function generateAIResponse(options: AIRequestOptions): Promise<AIResponse> {
    const {
        systemPrompt,
        userPrompt,
        temperature = 0.7,
        maxTokens = 2000,
        model = 'gpt-4o-mini',
    } = options;

    try {
        // Handle Gemini Models
        if (model?.toLowerCase().includes('gemini')) {
            const genAI = getGoogleAI();
            const geminiModel = genAI.getGenerativeModel({
                model: model, // e.g., 'gemini-pro'
                generationConfig: {
                    temperature,
                    maxOutputTokens: maxTokens,
                }
            });

            // Gemini doesn't have system prompts in the same way, usually prepended
            const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;
            const result = await geminiModel.generateContent(fullPrompt);
            const response = result.response;
            const content = response.text();
            const tokens = estimateTokens(content); // Gemini usage API is different, basic estimation for now

            return {
                content,
                tokens,
                model: model,
            };
        }

        // Handle OpenRouter Models (if explicitly 'openai/' prefix or other vendors)
        // Note: Standard 'gpt-4' etc will still go via OpenAI direct unless they have a prefix from frontend
        if (model?.toLowerCase().includes('/') && !model?.toLowerCase().startsWith('gpt')) {
            const openRouter = getOpenRouter();
            const completion = await openRouter.chat.send({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                stream: false,
            });

            const rawContent = completion.choices[0]?.message?.content;
            const contentString = Array.isArray(rawContent)
                ? rawContent.map(c => (typeof c === 'string' ? c : ('text' in c ? c.text : ''))).join('')
                : (rawContent || '');

            // OpenRouter usage might differ in type definition
            const usage = completion.usage as any;
            const tokens = usage?.total_tokens || usage?.totalTokens || estimateTokens(contentString);

            return {
                content: contentString,
                tokens,
                model: completion.model || model,
            };
        }

        // Handle OpenAI Models (Default)
        const response = await getOpenAI().chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature,
            max_tokens: maxTokens,
        });

        const content = response.choices[0]?.message?.content || '';
        const tokens = response.usage?.total_tokens || 0;

        return {
            content,
            tokens,
            model: response.model,
        };

    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function streamAIResponse(
    options: AIRequestOptions,
    onChunk: (chunk: string) => void
): Promise<{ tokens: number }> {
    const {
        systemPrompt,
        userPrompt,
        temperature = 0.7,
        maxTokens = 2000,
        model = 'gpt-4o-mini',
    } = options;

    try {
        // Handle Gemini Streaming
        if (model?.toLowerCase().includes('gemini')) {
            const genAI = getGoogleAI();
            const geminiModel = genAI.getGenerativeModel({
                model: model,
                generationConfig: {
                    temperature,
                    maxOutputTokens: maxTokens,
                }
            });

            const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;
            const result = await geminiModel.generateContentStream(fullPrompt);

            let totalContent = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                totalContent += chunkText;
                onChunk(chunkText);
            }

            const tokens = estimateTokens(totalContent);
            return { tokens };
        }

        // Handle OpenAI Streaming
        // NOTE: OpenRouter SDK doesn't natively support easy streaming iterator in this snippet style yet 
        // without custom fetch. For now, forcing OpenAI direct for stream or falling back to standard if possible.
        // If the user wants OpenRouter streaming, we might need a custom implementation. 
        // For now, let's assuming streaming defaults to OpenAI or we use OpenAI SDK client pointing to OpenRouter URL if needed.
        // BUT the user passed @openrouter/sdk. Let's see if we can just use the standard OpenAI client for OpenRouter 
        // by changing the baseURL if we really wanted to, but the SDK is cleaner.
        // However, the OpenRouter SDK `chat.send` doesn't return an async iterable for stream=true easily in the same way.
        // For this task, I will leave streaming to Default OpenAI unless specifically requested for OpenRouter.
        // (User snippet showed stream: false).

        const stream = await getOpenAI().chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature,
            max_tokens: maxTokens,
            stream: true,
        });

        let totalContent = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                totalContent += content;
                onChunk(content);
            }
        }

        const estimatedTokens = Math.ceil(totalContent.length / 4);
        return { tokens: estimatedTokens };
    } catch (error) {
        console.error('OpenAI Streaming Error:', error);
        throw new Error('Failed to stream AI response');
    }
}

export { getOpenAI, getGoogleAI, getOpenRouter };
