// Express API Template
module.exports = {
    name: 'Express API',
    description: 'RESTful API with Express.js and TypeScript',
    icon: '🚀',
    language: 'typescript',

    files: {
        'package.json': JSON.stringify({
            name: 'express-api',
            version: '1.0.0',
            description: 'Express API with TypeScript',
            main: 'dist/index.js',
            scripts: {
                dev: 'ts-node-dev --respawn src/index.ts',
                build: 'tsc',
                start: 'node dist/index.js'
            },
            dependencies: {
                express: '^4.18.2',
                cors: '^2.8.5',
                dotenv: '^16.3.1'
            },
            devDependencies: {
                '@types/express': '^4.17.21',
                '@types/cors': '^2.8.17',
                '@types/node': '^20.10.6',
                typescript: '^5.3.3',
                'ts-node-dev': '^2.0.0'
            }
        }, null, 2),

        'src/index.ts': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`,

        'tsconfig.json': JSON.stringify({
            compilerOptions: {
                target: 'ES2020',
                module: 'commonjs',
                lib: ['ES2020'],
                outDir: './dist',
                rootDir: './src',
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
                resolveJsonModule: true,
                moduleResolution: 'node'
            },
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist']
        }, null, 2),

        '.env.example': `PORT=3000
NODE_ENV=development`,

        '.gitignore': `# Dependencies
node_modules/

# Environment
.env

# Build
dist/

# Logs
logs
*.log
npm-debug.log*

# OS
.DS_Store

# IDE
.vscode/
.idea/`,

        'README.md': `# Express API

RESTful API built with Express.js and TypeScript.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run in development
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Endpoints

- \`GET /\` - Welcome message
- \`GET /api/health\` - Health check`
    }
};
