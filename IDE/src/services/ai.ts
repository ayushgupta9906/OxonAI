import OpenAI from 'openai';

export type AIProvider = 'openai' | 'huggingface' | 'gemini';

// Default key provided by user for "free/keyless" mode
const DEFAULT_HF_KEY = 'YOUR_TOKEN_HERE';

export const SYSTEM_PROMPTS = {
    chat: `You are OxonAI, a helpful, friendly, and knowledgeable AI assistant. You provide clear, accurate, and thoughtful responses to any question or request.`,

    content: `You are OxonAI Content Creator, an expert content marketing specialist. Create engaging, well-structured content matching the requested format and tone.`,

    code: `You are OxonAI Code Assistant, an expert programmer. Write clean, efficient code with clear comments. Provide complete, runnable solutions.`,

    ideas: `You are OxonAI Idea Generator, a creative strategist. Generate innovative, practical ideas with clear descriptions and potential benefits.`,

    summarize: `You are OxonAI Summarizer. Extract key points and create clear, well-organized summaries while preserving important details.`,

    rewrite: `You are OxonAI Rewriter. Transform text while preserving meaning, applying the requested tone and style changes.`,
};

export async function generateAI(
    apiKey: string,
    systemPrompt: string,
    userPrompt: string,
    options: { temperature?: number; maxTokens?: number; provider?: AIProvider } = {}
): Promise<string> {
    const { temperature = 0.7, maxTokens = 2000, provider = 'openai' } = options;

    if (provider === 'huggingface') {
        const keyToUse = apiKey && apiKey.trim() !== '' ? apiKey : DEFAULT_HF_KEY;
        return generateHuggingFace(keyToUse, systemPrompt, userPrompt, { temperature, maxTokens });
    }

    if (provider === 'gemini') {
        return generateGemini(apiKey, systemPrompt, userPrompt, { temperature, maxTokens });
    }

    // Default to OpenAI
    const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature,
            max_tokens: maxTokens,
        });

        return response.choices[0]?.message?.content || '';
    } catch (error: any) {
        if (error.status === 401) {
            throw new Error('Invalid OpenAI API key. Please check your settings.');
        }
        throw new Error(error.message || 'Failed to generate response');
    }
}

async function generateHuggingFace(
    apiKey: string,
    systemPrompt: string,
    userPrompt: string,
    options: { temperature: number; maxTokens: number }
): Promise<string> {
    // Using Mistral-7B-Instruct-v0.2 as it follows instructions well
    const MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

    try {
        const fullPrompt = `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`;

        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                inputs: fullPrompt,
                parameters: {
                    max_new_tokens: options.maxTokens, // HF uses max_new_tokens
                    temperature: options.temperature,
                    return_full_text: false,
                },
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid Hugging Face API key.');
            }
            if (response.status === 503) {
                throw new Error('Model is currently loading (503). Please try again in a moment.');
            }
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate response from Hugging Face');
        }

        const result = await response.json();
        return Array.isArray(result) ? result[0].generated_text : '';

    } catch (error: any) {
        throw new Error(error.message || 'Failed to generate response from Hugging Face');
    }
}

async function generateGemini(
    apiKey: string,
    systemPrompt: string,
    userPrompt: string,
    options: { temperature: number; maxTokens: number }
): Promise<string> {
    const MODEL = 'gemini-1.5-flash';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: systemPrompt + "\n\n" + userPrompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: options.temperature,
                    maxOutputTokens: options.maxTokens,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate response from Gemini');
        }

        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    } catch (error: any) {
        throw new Error(error.message || 'Failed to generate response from Gemini');
    }
}
