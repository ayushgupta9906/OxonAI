import { useState, useEffect, useRef } from 'react';
import { Hash, X } from 'lucide-react';

interface GoToLineProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToLine: (line: number, column?: number) => void;
    totalLines: number;
}

export default function GoToLine({ isOpen, onClose, onGoToLine, totalLines }: GoToLineProps) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleSubmit = () => {
        const parts = value.split(':');
        const line = parseInt(parts[0], 10);
        const column = parts[1] ? parseInt(parts[1], 10) : undefined;

        if (line && line > 0 && line <= totalLines) {
            onGoToLine(line, column);
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="w-[400px] bg-[#252526] border border-[#454545] rounded-xl shadow-2xl overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 px-4 py-3">
                    <Hash size={16} className="text-[#71717a]" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Go to line (1-${totalLines}), format: line:column`}
                        className="flex-1 bg-transparent text-white placeholder-[#71717a] text-sm outline-none"
                    />
                    <button onClick={onClose} className="p-1 text-[#71717a] hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>
                <div className="px-4 py-2 border-t border-[#454545] text-[10px] text-[#71717a]">
                    <kbd className="px-1 bg-[#3c3c3c] rounded">Ctrl+G</kbd> to open • Enter line number or line:column
                </div>
            </div>
        </div>
    );
}
