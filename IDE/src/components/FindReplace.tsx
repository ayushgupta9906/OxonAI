import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, CaseSensitive, Regex } from 'lucide-react';

interface FindReplaceProps {
    isOpen: boolean;
    onClose: () => void;
    onFind: (query: string, options: FindOptions) => void;
    onReplace: (replaceText: string) => void;
    onReplaceAll: (replaceText: string) => void;
    matchCount: number;
    currentMatch: number;
    onNextMatch: () => void;
    onPrevMatch: () => void;
}

interface FindOptions {
    caseSensitive: boolean;
    wholeWord: boolean;
    regex: boolean;
}

export default function FindReplace({
    isOpen,
    onClose,
    onFind,
    onReplace,
    onReplaceAll,
    matchCount,
    currentMatch,
    onNextMatch,
    onPrevMatch,
}: FindReplaceProps) {
    const [showReplace, setShowReplace] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [options, setOptions] = useState<FindOptions>({
        caseSensitive: false,
        wholeWord: false,
        regex: false,
    });
    const findInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            findInputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (findText) {
            onFind(findText, options);
        }
    }, [findText, options]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter') {
            if (e.shiftKey) {
                onPrevMatch();
            } else {
                onNextMatch();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 right-4 z-50 bg-[#252526] border border-[#3c3c3c] rounded-b-lg shadow-xl animate-slide-up w-[420px]">
            <div className="p-2">
                {/* Toggle Replace */}
                <button
                    onClick={() => setShowReplace(!showReplace)}
                    className="p-1 text-[#71717a] hover:text-white transition-colors mb-2"
                >
                    {showReplace ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {/* Find Row */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 relative">
                        <input
                            ref={findInputRef}
                            type="text"
                            value={findText}
                            onChange={(e) => setFindText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Find"
                            className="w-full px-3 py-1.5 bg-[#3c3c3c] border border-transparent focus:border-[#007acc] rounded text-sm text-white placeholder-[#71717a] outline-none"
                        />
                        {findText && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#71717a]">
                                {matchCount > 0 ? `${currentMatch} of ${matchCount}` : 'No results'}
                            </span>
                        )}
                    </div>

                    {/* Options */}
                    <button
                        onClick={() => setOptions({ ...options, caseSensitive: !options.caseSensitive })}
                        className={`p-1.5 rounded transition-colors ${options.caseSensitive ? 'bg-[#007acc] text-white' : 'text-[#71717a] hover:text-white'}`}
                        title="Match Case"
                    >
                        <CaseSensitive size={14} />
                    </button>
                    <button
                        onClick={() => setOptions({ ...options, wholeWord: !options.wholeWord })}
                        className={`p-1.5 rounded transition-colors text-xs font-bold ${options.wholeWord ? 'bg-[#007acc] text-white' : 'text-[#71717a] hover:text-white'}`}
                        title="Match Whole Word"
                    >
                        ab
                    </button>
                    <button
                        onClick={() => setOptions({ ...options, regex: !options.regex })}
                        className={`p-1.5 rounded transition-colors ${options.regex ? 'bg-[#007acc] text-white' : 'text-[#71717a] hover:text-white'}`}
                        title="Use Regex"
                    >
                        <Regex size={14} />
                    </button>

                    {/* Navigation */}
                    <button onClick={onPrevMatch} className="p-1.5 text-[#71717a] hover:text-white transition-colors" title="Previous (Shift+Enter)">
                        <ArrowLeft size={14} />
                    </button>
                    <button onClick={onNextMatch} className="p-1.5 text-[#71717a] hover:text-white transition-colors" title="Next (Enter)">
                        <ArrowRight size={14} />
                    </button>
                    <button onClick={onClose} className="p-1.5 text-[#71717a] hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>

                {/* Replace Row */}
                {showReplace && (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={replaceText}
                            onChange={(e) => setReplaceText(e.target.value)}
                            placeholder="Replace"
                            className="flex-1 px-3 py-1.5 bg-[#3c3c3c] border border-transparent focus:border-[#007acc] rounded text-sm text-white placeholder-[#71717a] outline-none"
                        />
                        <button
                            onClick={() => onReplace(replaceText)}
                            className="px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-white bg-[#3c3c3c] hover:bg-[#4c4c4c] rounded transition-colors"
                        >
                            Replace
                        </button>
                        <button
                            onClick={() => onReplaceAll(replaceText)}
                            className="px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-white bg-[#3c3c3c] hover:bg-[#4c4c4c] rounded transition-colors"
                        >
                            Replace All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
