import { getContextEngine } from '../context/context-engine';
import { CodeSearch, SearchResult } from '../context/code-search';
import { CORE_SYSTEM_PROMPT } from '../prompts';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    metadata?: {
        referencedFiles?: string[];
        codeSnippets?: SearchResult[];
    };
}

export class IntelligentChatEngine {
    private codeSearch: CodeSearch;
    private conversationHistory: ChatMessage[] = [];

    constructor() {
        this.codeSearch = new CodeSearch();
    }

    /**
     * Process user query with full codebase context
     */
    async processQuery(userQuery: string): Promise<ChatMessage> {
        // Detect query intent
        const intent = this.detectIntent(userQuery);

        // Gather relevant context
        const context = await this.gatherContext(userQuery, intent);

        // Build prompt with context
        const prompt = this.buildContextualPrompt(userQuery, context);

        // Store user message
        this.conversationHistory.push({
            role: 'user',
            content: userQuery,
            timestamp: Date.now()
        });

        // For now, return context-aware response structure
        // In production, this would call the AI API
        const response: ChatMessage = {
            role: 'assistant',
            content: this.generateContextualResponse(userQuery, context, intent),
            timestamp: Date.now(),
            metadata: {
                referencedFiles: context.referencedFiles,
                codeSnippets: context.codeSnippets
            }
        };

        this.conversationHistory.push(response);
        return response;
    }

    /**
     * Detect what the user is asking about
     */
    private detectIntent(query: string): string {
        const lower = query.toLowerCase();

        if (lower.includes('where') && (lower.includes('api') || lower.includes('endpoint'))) {
            return 'findEndpoints';
        }
        if (lower.includes('where') && (lower.includes('auth') || lower.includes('login'))) {
            return 'findAuth';
        }
        if (lower.includes('database') || lower.includes('query') || lower.includes('sql')) {
            return 'findDatabase';
        }
        if (lower.includes('bug') || lower.includes('error') || lower.includes('debug')) {
            return 'debug';
        }
        if (lower.includes('explain') || lower.includes('what does') || lower.includes('how does')) {
            return 'explain';
        }
        if (lower.includes('optimize') || lower.includes('improve') || lower.includes('performance')) {
            return 'optimize';
        }
        if (lower.includes('refactor')) {
            return 'refactor';
        }
        if (lower.includes('security') || lower.includes('vulnerability')) {
            return 'security';
        }

        return 'general';
    }

    /**
     * Gather relevant code context for the query
     */
    private async gatherContext(query: string, intent: string): Promise<{
        projectSummary: string;
        referencedFiles: string[];
        codeSnippets: SearchResult[];
        intent: string;
    }> {
        const engine = getContextEngine();
        const projectSummary = engine.getProjectSummary();
        const referencedFiles: string[] = [];
        let codeSnippets: SearchResult[] = [];

        // Gather context based on intent
        switch (intent) {
            case 'findEndpoints':
                codeSnippets = await this.codeSearch.findApiEndpoints();
                break;

            case 'findAuth':
                codeSnippets = await this.codeSearch.searchByContent('auth');
                break;

            case 'findDatabase':
                codeSnippets = await this.codeSearch.findDatabaseQueries();
                break;

            default:
                // Search for keywords in the query
                const keywords = this.extractKeywords(query);
                for (const keyword of keywords) {
                    const results = await this.codeSearch.searchByContent(keyword);
                    codeSnippets.push(...results.slice(0, 5));
                }
        }

        // Extract file paths
        referencedFiles = [...new Set(codeSnippets.map(s => s.file.path))];

        return {
            projectSummary,
            referencedFiles,
            codeSnippets: codeSnippets.slice(0, 10), // Limit to top 10
            intent
        };
    }

    /**
     * Build AI prompt with full context
     */
    private buildContextualPrompt(query: string, context: any): string {
        let prompt = `${CORE_SYSTEM_PROMPT}\n\n`;
        prompt += `# Project Context\n`;
        prompt += `${context.projectSummary}\n\n`;

        if (context.codeSnippets.length > 0) {
            prompt += `# Relevant Code Snippets\n`;
            for (const snippet of context.codeSnippets) {
                prompt += `\nFile: ${snippet.file.path}\n`;
                if (snippet.lineNumber) {
                    prompt += `Line: ${snippet.lineNumber}\n`;
                }
                if (snippet.snippet) {
                    prompt += `\`\`\`${snippet.file.language}\n${snippet.snippet}\n\`\`\`\n`;
                }
            }
        }

        prompt += `\n# User Question\n${query}\n`;
        prompt += `\nProvide a precise, code-aware answer. Reference specific files and line numbers when relevant.`;

        return prompt;
    }

    /**
     * Generate context-aware response (placeholder)
     */
    private generateContextualResponse(query: string, context: any, intent: string): string {
        let response = '';

        switch (intent) {
            case 'findEndpoints':
                response = `I found ${context.codeSnippets.length} API endpoints in your project:\n\n`;
                context.codeSnippets.forEach((snippet: SearchResult, i: number) => {
                    response += `${i + 1}. **${snippet.file.name}** (Line ${snippet.lineNumber})\n`;
                    response += `\`\`\`\n${snippet.snippet}\n\`\`\`\n\n`;
                });
                break;

            case 'findAuth':
                response = `Here's where authentication is handled:\n\n`;
                context.codeSnippets.forEach((snippet: SearchResult) => {
                    response += `**${snippet.file.path}** (Line ${snippet.lineNumber})\n`;
                    response += `\`\`\`\n${snippet.snippet}\n\`\`\`\n\n`;
                });
                break;

            case 'findDatabase':
                response = `Database queries found:\n\n`;
                context.codeSnippets.forEach((snippet: SearchResult) => {
                    response += `**${snippet.file.name}** (Line ${snippet.lineNumber})\n`;
                    response += `\`\`\`\n${snippet.snippet}\n\`\`\`\n\n`;
                });
                break;

            default:
                response = `Based on your codebase:\n\n`;
                response += context.projectSummary;
                if (context.codeSnippets.length > 0) {
                    response += `\n\nRelevant files:\n`;
                    context.codeSnippets.forEach((snippet: SearchResult) => {
                        response += `- ${snippet.file.path}\n`;
                    });
                }
        }

        return response;
    }

    /**
     * Extract keywords from query
     */
    private extractKeywords(query: string): string[] {
        const stopWords = ['what', 'where', 'how', 'why', 'when', 'is', 'are', 'the', 'a', 'an', 'in', 'on', 'at'];
        const words = query.toLowerCase().split(/\s+/);
        return words.filter(w => w.length > 3 && !stopWords.includes(w));
    }

    getConversationHistory(): ChatMessage[] {
        return this.conversationHistory;
    }

    clearHistory(): void {
        this.conversationHistory = [];
    }
}
