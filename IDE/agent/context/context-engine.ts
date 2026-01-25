import { FileIndexer, ProjectIndex } from './file-indexer';
import { TechStackDetector, TechStack } from './tech-stack-detector';

export interface ProjectContext {
    rootPath: string;
    index: ProjectIndex;
    techStack: TechStack;
    metadata: {
        projectName: string;
        indexedAt: number;
        lastModified: number;
    };
}

export class ContextEngine {
    private context: ProjectContext | null = null;
    private indexer: FileIndexer | null = null;

    async buildContext(rootPath: string): Promise<ProjectContext> {
        console.log('🧠 Building project context...');
        const startTime = Date.now();

        // Initialize indexer
        this.indexer = new FileIndexer(rootPath);

        // Index all files
        const index = await this.indexer.indexProject();

        // Detect tech stack
        const detector = new TechStackDetector(rootPath);
        const techStack = await detector.detect();

        // Build context
        this.context = {
            rootPath,
            index,
            techStack,
            metadata: {
                projectName: rootPath.split('/').pop() || 'Unknown',
                indexedAt: Date.now(),
                lastModified: Date.now()
            }
        };

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Context built in ${duration}s`);
        console.log(`📊 Files: ${index.totalFiles}`);
        console.log(`🗂️ Languages: ${Array.from(index.languages).join(', ')}`);
        console.log(`🔧 Stack: ${this.getTechStackSummary()}`);

        return this.context;
    }

    getContext(): ProjectContext | null {
        return this.context;
    }

    getTechStackSummary(): string {
        if (!this.context) return 'No context';

        const { techStack } = this.context;
        const parts: string[] = [];

        if (techStack.frontend.length > 0) {
            parts.push(techStack.frontend.join(', '));
        }
        if (techStack.backend.length > 0) {
            parts.push(techStack.backend.join(', '));
        }
        if (techStack.database.length > 0) {
            parts.push(techStack.database.join(', '));
        }

        return parts.length > 0 ? parts.join(' + ') : 'Unknown stack';
    }

    searchFiles(query: string) {
        return this.indexer?.searchFiles(query) || [];
    }

    async getFileContent(filePath: string): Promise<string | null> {
        return this.indexer?.getFileContent(filePath) || null;
    }

    getProjectSummary(): string {
        if (!this.context) return 'No project loaded';

        const { index, techStack, metadata } = this.context;

        return `Project: ${metadata.projectName}
Files: ${index.totalFiles}
Languages: ${Array.from(index.languages).join(', ')}
Stack: ${this.getTechStackSummary()}
Size: ${(index.totalSize / 1024 / 1024).toFixed(2)} MB`;
    }
}

// Singleton instance
let contextEngineInstance: ContextEngine | null = null;

export function getContextEngine(): ContextEngine {
    if (!contextEngineInstance) {
        contextEngineInstance = new ContextEngine();
    }
    return contextEngineInstance;
}
