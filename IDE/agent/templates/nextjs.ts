// Next.js 14 App Router Template
module.exports = {
    name: 'Next.js 14 App Router',
    description: 'Next.js 14 with App Router and TypeScript',
    icon: '▲',
    language: 'typescript',

    files: {
        'package.json': JSON.stringify({
            name: 'nextjs-app',
            version: '0.1.0',
            private: true,
            scripts: {
                dev: 'next dev',
                build: 'next build',
                start: 'next start',
                lint: 'next lint'
            },
            dependencies: {
                react: '^18',
                'react-dom': '^18',
                next: '14.0.4'
            },
            devDependencies: {
                typescript: '^5',
                '@types/node': '^20',
                '@types/react': '^18',
                '@types/react-dom': '^18'
            }
        }, null, 2),

        'app/layout.tsx': `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Created with Next.js 14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,

        'app/page.tsx': `export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Next.js 14
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Get started by editing <code className="bg-gray-100 px-2 py-1 rounded">app/page.tsx</code>
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://nextjs.org/docs"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Documentation
          </a>
          <a
            href="https://nextjs.org/learn"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Learn Next.js
          </a>
        </div>
      </div>
    </main>
  )
}`,

        'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`,

        'tsconfig.json': JSON.stringify({
            compilerOptions: {
                target: 'ES2017',
                lib: ['dom', 'dom.iterable', 'esnext'],
                allowJs: true,
                skipLibCheck: true,
                strict: true,
                noEmit: true,
                esModuleInterop: true,
                module: 'esnext',
                moduleResolution: 'bundler',
                resolveJsonModule: true,
                isolatedModules: true,
                jsx: 'preserve',
                incremental: true,
                plugins: [{ name: 'next' }],
                paths: { '@/*': ['./*'] }
            },
            include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
            exclude: ['node_modules']
        }, null, 2),

        'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`,

        '.gitignore': `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts`,

        'README.md': `# Next.js 14 App

This is a Next.js project bootstrapped with the App Router.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.`
    }
};
