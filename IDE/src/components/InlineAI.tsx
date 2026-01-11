import { Sparkles, X, Wand2, MessageSquare, Code, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface InlineAIProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCode: string;
    onApply: (code: string) => void;
    position: { x: number; y: number };
}

const actions = [
    { id: 'explain', label: 'Explain', icon: <MessageSquare size={14} />, prompt: 'Explain this code:' },
    { id: 'fix', label: 'Fix bugs', icon: <Wand2 size={14} />, prompt: 'Fix bugs in this code:' },
    { id: 'improve', label: 'Improve', icon: <Lightbulb size={14} />, prompt: 'Improve this code:' },
    { id: 'docs', label: 'Add docs', icon: <Code size={14} />, prompt: 'Add documentation to:' },
];

export default function InlineAI({ isOpen, onClose, selectedCode, onApply, position }: InlineAIProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [customPrompt, setCustomPrompt] = useState('');

    const handleAction = async (action: typeof actions[0]) => {
        setLoading(true);
        // Simulated AI response
        setTimeout(() => {
            setResult(`// AI generated response for "${action.label}"\n${selectedCode}\n\n// TODO: Implement ${action.label.toLowerCase()}`);
            setLoading(false);
        }, 1000);
    };

    const handleCustomPrompt = async () => {
        if (!customPrompt.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setResult(`// Custom response for: "${customPrompt}"\n${selectedCode}`);
            setLoading(false);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className="fixed z-50 w-80 bg-[#252526] border border-[#454545] rounded-xl shadow-2xl overflow-hidden animate-slide-up"
                style={{ left: position.x, top: position.y }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#454545] bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-xs font-medium text-white">AI Assistant</span>
                    </div>
                    <button onClick={onClose} className="p-1 text-[#71717a] hover:text-white transition-colors">
                        <X size={12} />
                    </button>
                </div>

                {/* Actions */}
                {!result && !loading && (
                    <div className="p-2 space-y-1">
                        {actions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => handleAction(action)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#d4d4d4] hover:bg-[#094771] rounded-lg transition-colors"
                            >
                                {action.icon}
                                {action.label}
                            </button>
                        ))}
                        <div className="pt-2 border-t border-[#454545]">
                            <input
                                type="text"
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCustomPrompt()}
                                placeholder="Custom instruction..."
                                className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#454545] rounded-lg text-xs text-white placeholder-[#71717a] outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="p-4 flex items-center justify-center">
                        <div className="loading-dots"><span /><span /><span /></div>
                    </div>
                )}

                {/* Result */}
                {result && !loading && (
                    <div className="p-2 space-y-2">
                        <pre className="p-2 bg-[#1e1e1e] rounded-lg text-xs text-[#d4d4d4] overflow-auto max-h-48">
                            {result}
                        </pre>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { onApply(result); onClose(); }}
                                className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors"
                            >
                                Apply
                            </button>
                            <button
                                onClick={() => setResult(null)}
                                className="flex-1 py-2 bg-[#3c3c3c] hover:bg-[#454545] text-white text-xs rounded-lg transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
