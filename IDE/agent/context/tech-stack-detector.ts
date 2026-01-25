import * as fs from 'fs/promises';
import * as path from 'path';

export interface TechStack {
    frontend: string[];
    backend: string[];
    database: string[];
    devops: string[];
    desktop: string[];
    languages: string[];
    buildTools: string[];
}

export class TechStackDetector {
    private rootPath: string;
    private packageJson: any = null;

    constructor(rootPath: string) {
        this.rootPath = rootPath;
    }

    async detect(): Promise<TechStack> {
        const stack: TechStack = {
            frontend: [],
            backend: [],
            database: [],
            devops: [],
            desktop: [],
            languages: [],
            buildTools: []
        };

        // Load package.json
        await this.loadPackageJson();

        // Detect from package.json
        if (this.packageJson) {
            this.detectFromDependencies(stack);
        }

        // Detect from file presence
        await this.detectFromFiles(stack);

        // Detect languages
        await this.detectLanguages(stack);

        return stack;
    }

    private async loadPackageJson(): Promise<void> {
        try {
            const packagePath = path.join(this.rootPath, 'package.json');
            const content = await fs.readFile(packagePath, 'utf-8');
            this.packageJson = JSON.parse(content);
        } catch (error) {
            // No package.json or invalid JSON
        }
    }

    private detectFromDependencies(stack: TechStack): void {
        const allDeps = {
            ...this.packageJson.dependencies,
            ...this.packageJson.devDependencies
        };

        const deps = Object.keys(allDeps || {});

        // Frontend frameworks
        if (deps.includes('react')) stack.frontend.push('React');
        if (deps.includes('next')) stack.frontend.push('Next.js');
        if (deps.includes('vue')) stack.frontend.push('Vue');
        if (deps.includes('angular')) stack.frontend.push('Angular');
        if (deps.includes('svelte')) stack.frontend.push('Svelte');
        if (deps.includes('tailwindcss')) stack.frontend.push('Tailwind CSS');

        // Backend frameworks
        if (deps.includes('express')) stack.backend.push('Express');
        if (deps.includes('nestjs')) stack.backend.push('NestJS');
        if (deps.includes('fastify')) stack.backend.push('Fastify');
        if (deps.includes('koa')) stack.backend.push('Koa');

        // Database
        if (deps.includes('prisma')) stack.database.push('Prisma');
        if (deps.includes('mongoose')) stack.database.push('MongoDB');
        if (deps.includes('pg')) stack.database.push('PostgreSQL');
        if (deps.includes('mysql2')) stack.database.push('MySQL');
        if (deps.includes('sequelize')) stack.database.push('Sequelize');

        // Desktop
        if (deps.includes('electron')) stack.desktop.push('Electron');
        if (deps.includes('tauri')) stack.desktop.push('Tauri');

        // Build tools
        if (deps.includes('vite')) stack.buildTools.push('Vite');
        if (deps.includes('webpack')) stack.buildTools.push('Webpack');
        if (deps.includes('turbopack')) stack.buildTools.push('Turbopack');
        if (deps.includes('typescript')) stack.buildTools.push('TypeScript');
    }

    private async detectFromFiles(stack: TechStack): Promise<void> {
        const files = await this.listRootFiles();

        // Docker
        if (files.includes('Dockerfile') || files.includes('docker-compose.yml')) {
            stack.devops.push('Docker');
        }

        // CI/CD
        if (files.some(f => f.startsWith('.github'))) {
            stack.devops.push('GitHub Actions');
        }
        if (files.includes('.gitlab-ci.yml')) {
            stack.devops.push('GitLab CI');
        }

        // Python frameworks
        if (files.includes('requirements.txt') || files.includes('pyproject.toml')) {
            stack.languages.push('Python');

            try {
                const reqContent = await fs.readFile(
                    path.join(this.rootPath, 'requirements.txt'),
                    'utf-8'
                );
                if (reqContent.includes('flask')) stack.backend.push('Flask');
                if (reqContent.includes('django')) stack.backend.push('Django');
                if (reqContent.includes('fastapi')) stack.backend.push('FastAPI');
            } catch (error) {
                // requirements.txt not found
            }
        }

        // Go
        if (files.includes('go.mod')) {
            stack.languages.push('Go');
        }

        // Rust
        if (files.includes('Cargo.toml')) {
            stack.languages.push('Rust');
        }

        // Java/Maven
        if (files.includes('pom.xml')) {
            stack.languages.push('Java');
            stack.buildTools.push('Maven');
        }

        // Java/Gradle  
        if (files.includes('build.gradle')) {
            stack.languages.push('Java');
            stack.buildTools.push('Gradle');
        }
    }

    private async detectLanguages(stack: TechStack): Promise<void> {
        const files = await this.listAllFiles();

        const extensions = new Set(files.map(f => path.extname(f)));

        if (extensions.has('.ts') || extensions.has('.tsx')) {
            if (!stack.languages.includes('TypeScript')) {
                stack.languages.push('TypeScript');
            }
        }
        if (extensions.has('.js') || extensions.has('.jsx')) {
            if (!stack.languages.includes('JavaScript')) {
                stack.languages.push('JavaScript');
            }
        }
        if (extensions.has('.py')) {
            if (!stack.languages.includes('Python')) {
                stack.languages.push('Python');
            }
        }
    }

    private async listRootFiles(): Promise<string[]> {
        try {
            return await fs.readdir(this.rootPath);
        } catch (error) {
            return [];
        }
    }

    private async listAllFiles(dir: string = this.rootPath): Promise<string[]> {
        const files: string[] = [];

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.name === 'node_modules' || entry.name === '.git') {
                    continue;
                }

                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    files.push(...await this.listAllFiles(fullPath));
                } else {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Ignore errors
        }

        return files;
    }
}
