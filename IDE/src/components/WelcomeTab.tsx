import { Sparkles, Folder, FileText, GitBranch, Terminal, Zap, ArrowRight, Code, MessageSquare } from 'lucide-react';

interface WelcomeTabProps {
    onOpenFolder: () => void;
    onOpenFile: () => void;
    onNavigate: (page: string) => void;
}

export default function WelcomeTab({ onOpenFolder, onOpenFile, onNavigate }: WelcomeTabProps) {
    const recentActions = [
        { icon: <Folder size={16} />, label: 'Open Folder', shortcut: 'Ctrl+Shift+O', action: onOpenFolder },
        { icon: <FileText size={16} />, label: 'Open File', shortcut: 'Ctrl+O', action: onOpenFile },
        { icon: <GitBranch size={16} />, label: 'Clone Repository', shortcut: '', action: () => { } },
        { icon: <Terminal size={16} />, label: 'New Terminal', shortcut: 'Ctrl+`', action: () => { } },
    ];

    const aiFeatures = [
        { id: 'chat', name: 'AI Chat', description: 'Conversational AI assistant', icon: <MessageSquare size={20} />, gradient: 'from-purple-500 to-purple-600' },
        { id: 'code', name: 'Code Assistant', description: 'Write, debug, and optimize code', icon: <Code size={20} />, gradient: 'from-emerald-500 to-emerald-600' },
        { id: 'content', name: 'Content Generator', description: 'Create engaging content', icon: <FileText size={20} />, gradient: 'from-blue-500 to-blue-600' },
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#1e1e1e] overflow-auto">
            <div className="max-w-3xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 mb-6 shadow-2xl shadow-purple-500/20">
                        <Sparkles size={36} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            OxonAI IDE
                        </span>
                    </h1>
                    <p className="text-[#71717a] text-lg">AI-Powered Development Environment</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-sm font-medium text-[#a1a1aa] mb-4 flex items-center gap-2">
                            <Zap size={14} /> Quick Actions
                        </h3>
                        <div className="space-y-2">
                            {recentActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={action.action}
                                    className="w-full flex items-center gap-3 p-3 bg-[#252526] hover:bg-[#2d2d30] rounded-xl transition-colors group"
                                >
                                    <div className="text-[#71717a] group-hover:text-purple-400 transition-colors">
                                        {action.icon}
                                    </div>
                                    <span className="flex-1 text-left text-sm text-[#d4d4d4]">{action.label}</span>
                                    {action.shortcut && (
                                        <kbd className="text-[10px] text-[#52525b] bg-[#3c3c3c] px-2 py-1 rounded">{action.shortcut}</kbd>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Features */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-sm font-medium text-[#a1a1aa] mb-4 flex items-center gap-2">
                            <Sparkles size={14} /> AI Features
                        </h3>
                        <div className="space-y-2">
                            {aiFeatures.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => onNavigate(feature.id)}
                                    className="w-full flex items-center gap-3 p-3 bg-[#252526] hover:bg-[#2d2d30] rounded-xl transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm text-white font-medium">{feature.name}</p>
                                        <p className="text-[10px] text-[#52525b]">{feature.description}</p>
                                    </div>
                                    <ArrowRight size={14} className="text-[#3f3f46] group-hover:text-purple-400 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20">
                    <h3 className="text-sm font-medium text-purple-300 mb-3">💡 Pro Tips</h3>
                    <ul className="text-sm text-[#a1a1aa] space-y-2">
                        <li>• Press <kbd className="px-1 bg-[#27272a] rounded text-[10px] mx-1">Ctrl+K</kbd> to open the Command Palette</li>
                        <li>• Press <kbd className="px-1 bg-[#27272a] rounded text-[10px] mx-1">Ctrl+B</kbd> to toggle the sidebar</li>
                        <li>• Press <kbd className="px-1 bg-[#27272a] rounded text-[10px] mx-1">Ctrl+`</kbd> to open the terminal</li>
                        <li>• Use <kbd className="px-1 bg-[#27272a] rounded text-[10px] mx-1">Ctrl+1-6</kbd> for quick AI tool access</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-xs text-[#52525b]">
                    OxonAI IDE v1.0.0 • Built with ❤️ using Electron + React
                </div>
            </div>
        </div>
    );
}
