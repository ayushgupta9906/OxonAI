import { useState, useRef, useEffect } from 'react';
import { Trash2, ChevronDown, Copy, Download } from 'lucide-react';

interface OutputLine {
    timestamp: Date;
    channel: string;
    message: string;
    type: 'info' | 'error' | 'warning' | 'debug';
}

const channels = ['Log (Output)', 'Tasks', 'Extensions', 'Git', 'TypeScript'];

export default function OutputPanel() {
    const [activeChannel, setActiveChannel] = useState('Log (Output)');
    const [lines, setLines] = useState<OutputLine[]>([
        { timestamp: new Date(), channel: 'Log (Output)', message: 'OxonAI IDE started', type: 'info' },
        { timestamp: new Date(), channel: 'Log (Output)', message: 'Loading extensions...', type: 'info' },
        { timestamp: new Date(), channel: 'Log (Output)', message: 'Activated extension: Python', type: 'debug' },
        { timestamp: new Date(), channel: 'Log (Output)', message: 'Activated extension: Prettier', type: 'debug' },
        { timestamp: new Date(), channel: 'TypeScript', message: 'TypeScript 5.3.0 initialized', type: 'info' },
        { timestamp: new Date(), channel: 'Git', message: 'Watching repository: OxonAI', type: 'info' },
    ]);
    const outputRef = useRef<HTMLDivElement>(null);

    const filteredLines = lines.filter(l => l.channel === activeChannel);

    const clearOutput = () => {
        setLines(prev => prev.filter(l => l.channel !== activeChannel));
    };

    const copyOutput = () => {
        const text = filteredLines.map(l => `[${l.timestamp.toLocaleTimeString()}] ${l.message}`).join('\n');
        navigator.clipboard.writeText(text);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'error': return 'text-red-400';
            case 'warning': return 'text-amber-400';
            case 'debug': return 'text-[#52525b]';
            default: return 'text-[#d4d4d4]';
        }
    };

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e]">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#3c3c3c]">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">OUTPUT</span>
                    <div className="relative">
                        <select
                            value={activeChannel}
                            onChange={(e) => setActiveChannel(e.target.value)}
                            className="text-xs bg-[#3c3c3c] text-white px-2 py-1 rounded border-none outline-none appearance-none pr-6 cursor-pointer"
                        >
                            {channels.map(ch => (
                                <option key={ch} value={ch}>{ch}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={copyOutput} className="p-1 text-[#71717a] hover:text-white transition-colors" title="Copy">
                        <Copy size={14} />
                    </button>
                    <button onClick={clearOutput} className="p-1 text-[#71717a] hover:text-white transition-colors" title="Clear">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div ref={outputRef} className="flex-1 overflow-auto p-2 font-mono text-xs">
                {filteredLines.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[#52525b]">
                        No output
                    </div>
                ) : (
                    filteredLines.map((line, i) => (
                        <div key={i} className="flex gap-2 py-0.5 hover:bg-[#2d2d30]">
                            <span className="text-[#52525b]">[{line.timestamp.toLocaleTimeString()}]</span>
                            <span className={getTypeColor(line.type)}>{line.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
