export default function ShowcasePage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            See OxonAI in Action
                        </h1>
                        <p className="text-xl text-foreground-secondary">
                            Watch how OxonAI IDE transforms ideas into working projects
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-12">
                        <ShowcaseFeature
                            title="🤖 Autonomous Project Generation"
                            description="Simply describe what you want to build. The AI agent plans the project structure, generates all necessary files, and assembles a complete working application."
                            example='Example: "Create a todo app with React and dark mode"'
                        />

                        <ShowcaseFeature
                            title="⚡ Real-Time Streaming"
                            description="Watch the AI work in real-time. See it think, plan, create files, and execute commands. Complete transparency into the development process."
                            example="Live progress updates with visual indicators for each step"
                        />

                        <ShowcaseFeature
                            title="🎯 Multi-Model Support"
                            description="Choose from multiple AI models including GPT-4, Gemini Pro, DeepSeek, and OpenRouter models. Pick the best model for your specific needs."
                            example="Switch between models for different tasks"
                        />

                        <ShowcaseFeature
                            title="📁 Smart File Management"
                            description="Projects are organized automatically in your Documents folder. Each project includes proper structure, dependencies, and configuration files."
                            example="Projects saved to: ~/Documents/OxonAI Projects/"
                        />

                        <ShowcaseFeature
                            title="💻 Integrated Development"
                            description="Full-featured IDE with syntax highlighting, file explorer, terminal, and git integration. Everything you need in one place."
                            example="Built on Electron with modern web technologies"
                        />
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <a
                            href="/download"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                        >
                            Download OxonAI IDE
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShowcaseFeature({ title, description, example }: { title: string; description: string; example: string }) {
    return (
        <div className="p-6 bg-background-secondary border border-border rounded-xl">
            <h2 className="text-2xl font-bold mb-3">{title}</h2>
            <p className="text-foreground-secondary mb-3">{description}</p>
            <div className="p-3 bg-background rounded border border-border">
                <code className="text-sm text-purple-400">{example}</code>
            </div>
        </div>
    );
}
