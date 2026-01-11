import { MessageSquare, FileText, Code, Lightbulb, FileSearch, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
    onNavigate: (page: string) => void;
    hasApiKey: boolean;
}

const tools = [
    { id: 'chat', name: 'Chat', icon: MessageSquare, gradient: 'from-purple-500 to-purple-600', description: 'AI conversations' },
    { id: 'content', name: 'Content', icon: FileText, gradient: 'from-blue-500 to-blue-600', description: 'Generate text' },
    { id: 'code', name: 'Code', icon: Code, gradient: 'from-emerald-500 to-emerald-600', description: 'Code assistant' },
    { id: 'ideas', name: 'Ideas', icon: Lightbulb, gradient: 'from-amber-500 to-orange-500', description: 'Brainstorm' },
    { id: 'summarize', name: 'Summarize', icon: FileSearch, gradient: 'from-pink-500 to-rose-500', description: 'Condense text' },
    { id: 'rewrite', name: 'Rewrite', icon: RefreshCw, gradient: 'from-cyan-500 to-teal-500', description: 'Transform text' },
];

export default function WelcomeScreen({ onNavigate, hasApiKey }: WelcomeScreenProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in overflow-auto">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="text-center mb-12 relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                    <Sparkles size={36} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-3">
                    Welcome to <span className="gradient-text">OxonAI</span>
                </h1>
                <p className="text-[#71717a] text-base max-w-md">
                    Your AI-powered assistant for content, code, and creativity.
                </p>
            </div>

            {/* Status Badge */}
            {hasApiKey ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Connected to OpenAI</span>
                </div>
            ) : (
                <button
                    onClick={() => onNavigate('settings')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8 hover:bg-amber-500/20 transition-colors"
                >
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Add API key to get started</span>
                    <ArrowRight size={14} />
                </button>
            )}

            {/* Tool Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full relative z-10">
                {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                        <button
                            key={tool.id}
                            onClick={() => onNavigate(tool.id)}
                            className="group p-4 bg-[#0f0f12] hover:bg-[#18181b] border border-[#1f1f23] hover:border-[#27272a] rounded-xl transition-all duration-300 text-left animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className={`w-10 h-10 mb-3 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                <Icon size={20} className="text-white" />
                            </div>
                            <h3 className="font-medium text-sm text-[#fafafa] mb-0.5">{tool.name}</h3>
                            <p className="text-xs text-[#52525b]">{tool.description}</p>
                        </button>
                    );
                })}
            </div>

            {/* Keyboard Hint */}
            <div className="mt-10 text-center">
                <p className="text-[#3f3f46] text-xs">
                    Press <kbd className="px-1.5 py-0.5 bg-[#18181b] border border-[#27272a] rounded text-[#71717a] text-[10px]">⌘</kbd>
                    <span className="mx-0.5">+</span>
                    <kbd className="px-1.5 py-0.5 bg-[#18181b] border border-[#27272a] rounded text-[#71717a] text-[10px]">1-6</kbd>
                    <span className="ml-1">to switch tools</span>
                </p>
            </div>
        </div>
    );
}
