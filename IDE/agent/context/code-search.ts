import { getContextEngine } from './context-engine';
import { FileNode } from './file-indexer';

export interface SearchResult {
    file: FileNode;
    relevance: number;
    snippet?: string;
    lineNumber?: number;
}

export class CodeSearch {
    /**
     * Search for files by name or path
     */
    searchByName(query: string): SearchResult[] {
        const engine = getContextEngine();
        const files = engine.searchFiles(query);

        return files.map(file => ({
            file,
            relevance: this.calculateNameRelevance(file.name, query)
        })).sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Search for content within files
     */
    async searchByContent(query: string): Promise<SearchResult[]> {
        const engine = getContextEngine();
        const context = engine.getContext();

        if (!context) return [];

        const results: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();

        for (const [filePath, fileNode] of context.index.files) {
            // Skip non-code files
            if (!this.isCodeFile(fileNode)) continue;

            const content = await engine.getFileContent(filePath);
            if (!content) continue;

            // Search in content
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        file: fileNode,
                        relevance: this.calculateContentRelevance(line, query),
                        snippet: this.getContextSnippet(lines, i),
                        lineNumber: i + 1
                    });
                }
            }
        }

        return results.sort((a, b) => b.relevance - a.relevance).slice(0, 20);
    }

    /**
     * Find where a function/class is defined
     */
    async findDefinition(identifier: string): Promise<SearchResult[]> {
        const engine = getContextEngine();
        const context = engine.getContext();

        if (!context) return [];

        const results: SearchResult[] = [];
        const patterns = [
            `function ${identifier}`,
            `const ${identifier} =`,
            `class ${identifier}`,
            `interface ${identifier}`,
            `type ${identifier}`,
            `export const ${identifier}`,
            `export function ${identifier}`,
            `def ${identifier}`, // Python
        ];

        for (const [filePath, fileNode] of context.index.files) {
            if (!this.isCodeFile(fileNode)) continue;

            const content = await engine.getFileContent(filePath);
            if (!content) continue;

            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (patterns.some(p => line.includes(p))) {
                    results.push({
                        file: fileNode,
                        relevance: 1.0,
                        snippet: this.getContextSnippet(lines, i),
                        lineNumber: i + 1
                    });
                }
            }
        }

        return results;
    }

    /**
     * Find API endpoints
     */
    async findApiEndpoints(): Promise<SearchResult[]> {
        const patterns = [
            'app.get(',
            'app.post(',
            'app.put(',
            'app.delete(',
            'router.get(',
            'router.post(',
            '@Get(',
            '@Post(',
            '@app.route('
        ];

        const results: SearchResult[] = [];
        const engine = getContextEngine();
        const context = engine.getContext();

        if (!context) return [];

        for (const [filePath, fileNode] of context.index.files) {
            if (!this.isCodeFile(fileNode)) continue;

            const content = await engine.getFileContent(filePath);
            if (!content) continue;

            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (patterns.some(p => line.includes(p))) {
                    results.push({
                        file: fileNode,
                        relevance: 1.0,
                        snippet: this.getContextSnippet(lines, i),
                        lineNumber: i + 1
                    });
                }
            }
        }

        return results;
    }

    /**
     * Find database queries
     */
    async findDatabaseQueries(): Promise<SearchResult[]> {
        const patterns = [
            'SELECT ',
            'INSERT INTO',
            'UPDATE ',
            'DELETE FROM',
            'findMany',
            'findUnique',
            'create(',
            'update(',
            '.find(',
            '.findOne('
        ];

        const results: SearchResult[] = [];
        const engine = getContextEngine();
        const context = engine.getContext();

        if (!context) return [];

        for (const [filePath, fileNode] of context.index.files) {
            if (!this.isCodeFile(fileNode)) continue;

            const content = await engine.getFileContent(filePath);
            if (!content) continue;

            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (patterns.some(p => line.includes(p))) {
                    results.push({
                        file: fileNode,
                        relevance: 1.0,
                        snippet: this.getContextSnippet(lines, i),
                        lineNumber: i + 1
                    });
                }
            }
        }

        return results;
    }

    // Helper methods
    private isCodeFile(file: FileNode): boolean {
        const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.rs', '.cpp', '.c'];
        return codeExtensions.some(ext => file.name.endsWith(ext));
    }

    private calculateNameRelevance(fileName: string, query: string): number {
        const lowerName = fileName.toLowerCase();
        const lowerQuery = query.toLowerCase();

        if (lowerName === lowerQuery) return 1.0;
        if (lowerName.startsWith(lowerQuery)) return 0.8;
        if (lowerName.includes(lowerQuery)) return 0.5;
        return 0.1;
    }

    private calculateContentRelevance(line: string, query: string): number {
        const lowerLine = line.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // Exact match
        if (lowerLine === lowerQuery) return 1.0;

        // Function/class definition
        if (lowerLine.includes('function') || lowerLine.includes('class')) {
            return 0.9;
        }

        // Import/export
        if (lowerLine.includes('import') || lowerLine.includes('export')) {
            return 0.7;
        }

        // Regular match
        return 0.5;
    }

    private getContextSnippet(lines: string[], lineIndex: number, contextLines: number = 2): string {
        const start = Math.max(0, lineIndex - contextLines);
        const end = Math.min(lines.length, lineIndex + contextLines + 1);

        return lines.slice(start, end)
            .map((line, i) => `${start + i + 1}: ${line}`)
            .join('\n');
    }
}
