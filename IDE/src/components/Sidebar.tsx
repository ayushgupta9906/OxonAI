import { MessageSquare, FileText, Code, Lightbulb, FileSearch, RefreshCw, Settings, ChevronLeft, ChevronRight, Sparkles, Bookmark, Command } from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

const tools = [
    { id: 'chat', name: 'Chat', icon: MessageSquare, shortcut: '⌘1' },
    { id: 'content', name: 'Content', icon: FileText, shortcut: '⌘2' },
    { id: 'code', name: 'Code', icon: Code, shortcut: '⌘3' },
    { id: 'ideas', name: 'Ideas', icon: Lightbulb, shortcut: '⌘4' },
    { id: 'summarize', name: 'Summarize', icon: FileSearch, shortcut: '⌘5' },
    { id: 'rewrite', name: 'Rewrite', icon: RefreshCw, shortcut: '⌘6' },
];

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
    return (
        <aside
            className={`${collapsed ? 'w-16' : 'w-56'} bg-[#0f0f12] border-r border-[#18181b] flex flex-col transition-all duration-300 ease-out`}
        >
            {/* Logo */}
            <div className={`h-14 flex items-center ${collapsed ? 'justify-center' : 'px-4'} border-b border-[#18181b]`}>
                {collapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                    </div>
                ) : (
                    <button
                        onClick={() => onNavigate('welcome')}
                        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="font-semibold text-[15px] gradient-text">OxonAI</span>
                    </button>
                )}
            </div>

            {/* Command Palette Hint */}
            {!collapsed && (
                <button
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                    className="mx-3 mt-3 px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg flex items-center gap-2 text-xs text-[#52525b] hover:border-[#3f3f46] transition-colors"
                >
                    <Command size={12} />
                    <span className="flex-1 text-left">Quick search...</span>
                    <kbd className="text-[10px] bg-[#27272a] px-1.5 py-0.5 rounded">⌘K</kbd>
                </button>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto hide-scrollbar">
                {!collapsed && (
                    <p className="px-2 py-2 text-[10px] font-semibold text-[#52525b] uppercase tracking-wider">
                        AI Tools
                    </p>
                )}

                {tools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = currentPage === tool.id;

                    return (
                        <button
                            key={tool.id}
                            onClick={() => onNavigate(tool.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                                    ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/10 text-white'
                                    : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#18181b]'
                                }`}
                        >
                            <div className={`relative ${isActive ? 'text-purple-400' : ''}`}>
                                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                                {isActive && (
                                    <div className="absolute -left-1 -top-1 -right-1 -bottom-1 bg-purple-500/20 rounded-full blur-sm" />
                                )}
                            </div>

                            {!collapsed && (
                                <>
                                    <span className={`flex-1 text-left text-sm ${isActive ? 'font-medium' : ''}`}>
                                        {tool.name}
                                    </span>
                                    <span className="text-[10px] text-[#52525b] opacity-0 group-hover:opacity-100 transition-opacity">
                                        {tool.shortcut}
                                    </span>
                                </>
                            )}

                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272a] text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                    {tool.name}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="p-2 border-t border-[#18181b] space-y-1">
                {/* Templates */}
                <button
                    onClick={() => onNavigate('templates')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${currentPage === 'templates'
                            ? 'bg-[#18181b] text-white'
                            : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#18181b]'
                        }`}
                >
                    <Bookmark size={18} strokeWidth={1.5} />
                    {!collapsed && <span className="text-sm">Templates</span>}
                </button>

                {/* Settings */}
                <button
                    onClick={() => onNavigate('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${currentPage === 'settings'
                            ? 'bg-[#18181b] text-white'
                            : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#18181b]'
                        }`}
                >
                    <Settings size={18} strokeWidth={1.5} />
                    {!collapsed && <span className="text-sm">Settings</span>}
                </button>

                {/* Collapse Button */}
                <button
                    onClick={onToggleCollapse}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#52525b] hover:text-[#71717a] hover:bg-[#18181b] transition-all duration-200"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    {!collapsed && <span className="text-xs">Collapse</span>}
                </button>
            </div>
        </aside>
    );
}
