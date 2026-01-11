import { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, FileText, Code, Lightbulb, FileSearch, RefreshCw, Settings, X } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: string) => void;
}

const commands = [
    { id: 'chat', name: 'Chat', description: 'AI assistant', icon: MessageSquare, shortcut: '⌘1' },
    { id: 'content', name: 'Content Generator', description: 'Create content', icon: FileText, shortcut: '⌘2' },
    { id: 'code', name: 'Code Assistant', description: 'Write & debug code', icon: Code, shortcut: '⌘3' },
    { id: 'ideas', name: 'Idea Generator', description: 'Brainstorm ideas', icon: Lightbulb, shortcut: '⌘4' },
    { id: 'summarize', name: 'Summarizer', description: 'Condense text', icon: FileSearch, shortcut: '⌘5' },
    { id: 'rewrite', name: 'Rewriter', description: 'Transform text', icon: RefreshCw, shortcut: '⌘6' },
    { id: 'templates', name: 'Templates', description: 'Saved prompts', icon: FileText, shortcut: '⌘T' },
    { id: 'settings', name: 'Settings', description: 'Configure IDE', icon: Settings, shortcut: '⌘,' },
];

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.name.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    onNavigate(filteredCommands[selectedIndex].id);
                    onClose();
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="w-[560px] bg-[#0f0f12] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#27272a]">
                    <Search size={18} className="text-[#52525b]" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search commands..."
                        className="flex-1 bg-transparent text-white placeholder-[#52525b] text-sm outline-none"
                    />
                    <button onClick={onClose} className="p-1 text-[#52525b] hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-auto py-2">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-6 text-center text-[#52525b] text-sm">
                            No commands found
                        </div>
                    ) : (
                        filteredCommands.map((cmd, index) => {
                            const Icon = cmd.icon;
                            return (
                                <button
                                    key={cmd.id}
                                    onClick={() => {
                                        onNavigate(cmd.id);
                                        onClose();
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${index === selectedIndex ? 'bg-purple-500/10 text-white' : 'text-[#a1a1aa] hover:bg-[#18181b]'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === selectedIndex ? 'bg-purple-500/20' : 'bg-[#18181b]'
                                        }`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium">{cmd.name}</p>
                                        <p className="text-xs text-[#52525b]">{cmd.description}</p>
                                    </div>
                                    <span className="text-[10px] text-[#52525b] bg-[#18181b] px-2 py-1 rounded">
                                        {cmd.shortcut}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-[#27272a] flex items-center gap-4 text-[10px] text-[#52525b]">
                    <span><kbd className="px-1 bg-[#18181b] rounded">↑↓</kbd> to navigate</span>
                    <span><kbd className="px-1 bg-[#18181b] rounded">↵</kbd> to select</span>
                    <span><kbd className="px-1 bg-[#18181b] rounded">esc</kbd> to close</span>
                </div>
            </div>
        </div>
    );
}
