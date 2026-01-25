import * as fs from 'fs/promises';
import * as path from 'path';

export interface FileNode {
    path: string;
    name: string;
    type: 'file' | 'directory';
    size?: number;
    extension?: string;
    language?: string;
    lastModified?: number;
    content?: string; // Cached for frequently accessed files
}

export interface ProjectIndex {
    rootPath: string;
    files: Map<string, FileNode>;
    totalFiles: number;
    totalSize: number;
    languages: Set<string>;
    lastIndexed: number;
}

const IGNORE_PATTERNS = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage',
    '.vscode',
    '.idea',
    '*.log',
    '.DS_Store'
];

const LANGUAGE_MAP: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescriptreact',
    '.js': 'javascript',
    '.jsx': 'javascriptreact',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.go': 'go',
    '.rs': 'rust',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.json': 'json',
    '.md': 'markdown',
    '.sql': 'sql',
    '.sh': 'shell',
    '.yml': 'yaml',
    '.yaml': 'yaml'
};

export class FileIndexer {
    private index: ProjectIndex;

    constructor(rootPath: string) {
        this.index = {
            rootPath,
            files: new Map(),
            totalFiles: 0,
            totalSize: 0,
            languages: new Set(),
            lastIndexed: Date.now()
        };
    }

    async indexProject(): Promise<ProjectIndex> {
        console.log('🔍 Starting project indexing...');
        await this.scanDirectory(this.index.rootPath);
        this.index.lastIndexed = Date.now();
        console.log(`✅ Indexed ${this.index.totalFiles} files`);
        return this.index;
    }

    private async scanDirectory(dirPath: string): Promise<void> {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                // Skip ignored patterns
                if (this.shouldIgnore(entry.name, fullPath)) {
                    continue;
                }

                if (entry.isDirectory()) {
                    // Recursively scan subdirectories
                    await this.scanDirectory(fullPath);
                } else if (entry.isFile()) {
                    await this.indexFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error scanning ${dirPath}:`, error);
        }
    }

    private async indexFile(filePath: string): Promise<void> {
        try {
            const stats = await fs.stat(filePath);
            const extension = path.extname(filePath);
            const language = LANGUAGE_MAP[extension] || 'plaintext';

            const fileNode: FileNode = {
                path: filePath,
                name: path.basename(filePath),
                type: 'file',
                size: stats.size,
                extension,
                language,
                lastModified: stats.mtimeMs
            };

            // Cache content for small files (<100KB)
            if (stats.size < 100 * 1024) {
                try {
                    fileNode.content = await fs.readFile(filePath, 'utf-8');
                } catch (err) {
                    // Binary file or encoding error, skip content
                }
            }

            this.index.files.set(filePath, fileNode);
            this.index.totalFiles++;
            this.index.totalSize += stats.size;
            this.index.languages.add(language);

        } catch (error) {
            console.error(`Error indexing file ${filePath}:`, error);
        }
    }

    private shouldIgnore(name: string, fullPath: string): boolean {
        return IGNORE_PATTERNS.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '.*'));
                return regex.test(name);
            }
            return name === pattern || fullPath.includes(`/${pattern}/`);
        });
    }

    getIndex(): ProjectIndex {
        return this.index;
    }

    getFilesByLanguage(language: string): FileNode[] {
        return Array.from(this.index.files.values())
            .filter(file => file.language === language);
    }

    searchFiles(query: string): FileNode[] {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.index.files.values())
            .filter(file =>
                file.name.toLowerCase().includes(lowerQuery) ||
                file.path.toLowerCase().includes(lowerQuery)
            );
    }

    async getFileContent(filePath: string): Promise<string | null> {
        const fileNode = this.index.files.get(filePath);
        if (!fileNode) return null;

        if (fileNode.content) {
            return fileNode.content;
        }

        try {
            return await fs.readFile(filePath, 'utf-8');
        } catch (error) {
            return null;
        }
    }
}
