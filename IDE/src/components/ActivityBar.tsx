import { FolderOpen, Search, Sparkles, Settings, MessageSquare, Bookmark, GitBranch, Package, Terminal as TermIcon, Bot } from 'lucide-react';

interface ActivityBarProps {
    activePanel: string;
    onPanelChange: (panel: string) => void;
    showTerminal: boolean;
    onToggleTerminal: () => void;
    showAgentSidebar: boolean;
    onToggleAgentSidebar: () => void;
}

const topPanels = [
    { id: 'explorer', icon: FolderOpen, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'ai', icon: Sparkles, label: 'AI Tools' },
    { id: 'agent', icon: Bot, label: 'Agent - Generate Project' },
    { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'templates', icon: Bookmark, label: 'Templates' },
    { id: 'extensions', icon: Package, label: 'Extensions' },
];

export default function ActivityBar({
    activePanel,
    onPanelChange,
    showTerminal,
    onToggleTerminal,
    showAgentSidebar,
    onToggleAgentSidebar
}: ActivityBarProps) {
    return (
        <div className="w-12 bg-[#0a0a0c] border-r border-[#1a1a1f] flex flex-col items-center py-2">
            {/* Top icons */}
            <div className="flex flex-col items-center gap-1">
                {topPanels.map((panel) => {
                    const Icon = panel.icon;
                    const isActive = activePanel === panel.id;
                    return (
                        <button
                            key={panel.id}
                            onClick={() => onPanelChange(panel.id)}
                            className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors group ${isActive
                                ? 'text-white'
                                : 'text-[#52525b] hover:text-[#a1a1aa]'
                                }`}
                            title={panel.label}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-500 rounded-r" />
                            )}
                            <Icon size={20} strokeWidth={1.5} />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272a] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                                {panel.label}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom icons */}
            <div className="flex flex-col items-center gap-1">
                {/* Terminal Toggle */}
                <button
                    onClick={onToggleTerminal}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors group ${showTerminal ? 'text-purple-400' : 'text-[#52525b] hover:text-[#a1a1aa]'
                        }`}
                    title="Toggle Terminal"
                >
                    <TermIcon size={20} strokeWidth={1.5} />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272a] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                        Terminal
                    </div>
                </button>

                {/* Agent Monitor Toggle */}
                <button
                    onClick={onToggleAgentSidebar}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors group ${showAgentSidebar ? 'text-purple-400' : 'text-[#52525b] hover:text-[#a1a1aa]'
                        }`}
                    title="Agent Workspace"
                >
                    <Sparkles size={20} strokeWidth={1.5} />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272a] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border border-[#3c3c3c]">
                        Agent Workspace
                    </div>
                </button>

                {/* Settings */}
                <button
                    onClick={() => onPanelChange('settings')}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors group ${activePanel === 'settings'
                        ? 'text-white'
                        : 'text-[#52525b] hover:text-[#a1a1aa]'
                        }`}
                    title="Settings"
                >
                    <Settings size={20} strokeWidth={1.5} />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272a] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                        Settings
                    </div>
                </button>
            </div>
        </div>
    );
}
