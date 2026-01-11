import { MessageSquare, FileText, Code, Lightbulb, FileSearch, RefreshCw } from 'lucide-react';

interface AIToolsPanelProps {
    onToolSelect: (tool: string) => void;
    apiKey: string;
}

const tools = [
    { id: 'chat', name: 'Chat', icon: MessageSquare, gradient: 'from-purple-500 to-purple-600', description: 'AI conversations' },
    { id: 'content', name: 'Content', icon: FileText, gradient: 'from-blue-500 to-blue-600', description: 'Generate text' },
    { id: 'code', name: 'Code', icon: Code, gradient: 'from-emerald-500 to-emerald-600', description: 'Code assistant' },
    { id: 'ideas', name: 'Ideas', icon: Lightbulb, gradient: 'from-amber-500 to-orange-500', description: 'Brainstorm' },
    { id: 'summarize', name: 'Summarize', icon: FileSearch, gradient: 'from-pink-500 to-rose-500', description: 'Condense text' },
    { id: 'rewrite', name: 'Rewrite', icon: RefreshCw, gradient: 'from-cyan-500 to-teal-500', description: 'Transform text' },
];

export default function AIToolsPanel({ onToolSelect, apiKey }: AIToolsPanelProps) {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-[#27272a]">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">AI Tools</span>
            </div>

            {/* API Key Status */}
            {!apiKey && (
                <div className="mx-3 mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-400">⚠️ Add API key in Settings</p>
                </div>
            )}

            {/* Tools Grid */}
            <div className="flex-1 overflow-auto p-3">
                <div className="grid gap-2">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => onToolSelect(tool.id)}
                                className="flex items-center gap-3 p-3 bg-[#18181b] hover:bg-[#1f1f23] border border-[#27272a] hover:border-[#3f3f46] rounded-lg transition-all text-left group"
                            >
                                <div className={`w-9 h-9 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}>
                                    <Icon size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{tool.name}</p>
                                    <p className="text-xs text-[#52525b]">{tool.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-[#27272a]">
                <p className="text-[10px] text-[#52525b] text-center">
                    Press <kbd className="px-1 bg-[#27272a] rounded">⌘1-6</kbd> for quick access
                </p>
            </div>
        </div>
    );
}
