const fetch = require('node-fetch');

const CODE_GENERATION_PROMPT = `You are an expert code generator. Generate clean, production-ready code based on the user's requirements.

Rules:
- Generate ONLY the code, no explanations
- Use modern best practices
- Include proper types and interfaces
- Add helpful comments
- Make code readable and maintainable`;

const generateCodeTool = {
    name: 'generate_code',
    description: 'Generate code using AI based on requirements',
    parameters: {
        prompt: {
            type: 'string',
            description: 'Description of what code to generate',
            required: true,
        },
        language: {
            type: 'string',
            description: 'Programming language (e.g., typescript, python, javascript)',
            required: false,
        },
        model: {
            type: 'string',
            description: 'AI model to use for generation',
            required: false,
        },
        apiKey: {
            type: 'string',
            description: 'OpenRouter API key',
            required: true,
        },
    },
    execute: async (args) => {
        try {
            const {
                prompt,
                language = 'typescript',
                model = 'openai/gpt-oss-120b:free',
                apiKey
            } = args;

            const fullPrompt = `Generate ${language} code for: ${prompt}`;

            // Call OpenRouter API directly
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: CODE_GENERATION_PROMPT },
                        { role: 'user', content: fullPrompt },
                    ],
                    temperature: 0.3,
                    max_tokens: 4000,
                }),
            });

            const data = await response.json();
            const code = data.choices?.[0]?.message?.content || '';

            return {
                success: true,
                data: {
                    code,
                    language,
                    tokens: data.usage?.total_tokens || 0,
                },
                metadata: {
                    operation: 'generate_code',
                    model: data.model || model,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Code generation failed',
            };
        }
    },
};

module.exports = { generateCodeTool };
