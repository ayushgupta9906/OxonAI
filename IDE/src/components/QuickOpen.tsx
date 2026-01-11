import { useState, useEffect, useRef } from 'react';
import { FileText, X, Clock } from 'lucide-react';

interface QuickOpenProps {
    isOpen: boolean;
    onClose: () => void;
    onFileSelect: (path: string) => void;
    recentFiles: string[];
}

export default function QuickOpen({ isOpen, onClose, onFileSelect, recentFiles }: QuickOpenProps) {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredFiles = search
        ? recentFiles.filter(f => f.toLowerCase().includes(search.toLowerCase()))
        : recentFiles;

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
                setSelectedIndex(prev => Math.min(prev + 1, filteredFiles.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredFiles[selectedIndex]) {
                    onFileSelect(filteredFiles[selectedIndex]);
                    onClose();
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };

    const getFileName = (path: string) => path.split(/[\\/]/).pop() || path;
    const getDirectory = (path: string) => {
        const parts = path.split(/[\\/]/);
        parts.pop();
        return parts.slice(-2).join('/');
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="w-[600px] bg-[#252526] border border-[#454545] rounded-xl shadow-2xl overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#454545]">
                    <FileText size={16} className="text-[#71717a]" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search files by name..."
                        className="flex-1 bg-transparent text-white placeholder-[#71717a] text-sm outline-none"
                    />
                    <button onClick={onClose} className="p-1 text-[#71717a] hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-auto">
                    {filteredFiles.length === 0 ? (
                        <div className="px-4 py-8 text-center text-[#71717a] text-sm">
                            {search ? 'No matching files' : 'No recent files'}
                        </div>
                    ) : (
                        <>
                            {!search && (
                                <div className="px-4 py-2 text-[10px] text-[#71717a] uppercase tracking-wider flex items-center gap-2">
                                    <Clock size={10} /> Recent Files
                                </div>
                            )}
                            {filteredFiles.map((file, i) => (
                                <button
                                    key={file}
                                    onClick={() => {
                                        onFileSelect(file);
                                        onClose();
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${i === selectedIndex ? 'bg-[#094771] text-white' : 'text-[#d4d4d4] hover:bg-[#2d2d30]'
                                        }`}
                                >
                                    <FileText size={14} className="text-[#71717a] flex-shrink-0" />
                                    <span className="font-medium">{getFileName(file)}</span>
                                    <span className="text-xs text-[#71717a] truncate">{getDirectory(file)}</span>
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-[#454545] flex items-center gap-4 text-[10px] text-[#71717a]">
                    <span><kbd className="px-1 bg-[#3c3c3c] rounded">↑↓</kbd> navigate</span>
                    <span><kbd className="px-1 bg-[#3c3c3c] rounded">↵</kbd> open</span>
                    <span><kbd className="px-1 bg-[#3c3c3c] rounded">esc</kbd> close</span>
                </div>
            </div>
        </div>
    );
}
