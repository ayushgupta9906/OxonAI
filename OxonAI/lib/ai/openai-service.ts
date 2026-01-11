import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

export async function generateAIResponse(options: AIRequestOptions): Promise<AIResponse> {
    const {
        systemPrompt,
        userPrompt,
        temperature = 0.7,
        maxTokens = 2000,
        model = 'gpt-4o-mini',
    } = options;

    try {
        const response = await openai.chat.completions.create({
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
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate AI response');
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
        const stream = await openai.chat.completions.create({
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

        // Estimate tokens (rough approximation for streaming)
        const estimatedTokens = Math.ceil(totalContent.length / 4);
        return { tokens: estimatedTokens };
    } catch (error) {
        console.error('OpenAI Streaming Error:', error);
        throw new Error('Failed to stream AI response');
    }
}

export default openai;
