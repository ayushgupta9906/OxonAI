import { useState } from 'react';
import { FileSearch, Sparkles, Copy, Check } from 'lucide-react';
import { AIProvider, generateAI, SYSTEM_PROMPTS } from '../../services/ai';

interface SummarizeProps {
    apiKey: string;
    provider?: AIProvider;
}

const styles = [
    { id: 'concise', name: 'Concise', emoji: '📌' },
    { id: 'detailed', name: 'Detailed', emoji: '📋' },
    { id: 'bullets', name: 'Bullets', emoji: '🔹' },
    { id: 'executive', name: 'Executive', emoji: '💼' },
];

export default function Summarize({ apiKey, provider }: SummarizeProps) {
    const [text, setText] = useState('');
    const [style, setStyle] = useState('concise');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSummarize = async () => {
        if (!text.trim() || loading) return;
        setLoading(true);
        setResult('');

        try {
            const styleText = style === 'bullets' ? 'as bullet points' : style === 'executive' ? 'as an executive summary' : `in a ${style} manner`;
            const fullPrompt = `Summarize the following text ${styleText}:\n\n${text}`;
            const response = await generateAI(apiKey, SYSTEM_PROMPTS.summarize, fullPrompt, { provider });
            setResult(response);
        } catch (error: any) {
            setResult(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return (
        <div className="flex-1 flex flex-col animate-fade-in">
            {/* Header */}
            <header className="px-6 py-4 border-b border-[#18181b] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <FileSearch size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-[15px]">Summarizer</h1>
                    <p className="text-[#52525b] text-xs">Condense long text into key points</p>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">

                    {/* Input Panel */}
                    <div className="space-y-5">
                        {/* Style */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Style</label>
                            <div className="grid grid-cols-4 gap-2">
                                {styles.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStyle(s.id)}
                                        className={`p-3 rounded-xl border text-center transition-all ${style === s.id
                                            ? 'bg-pink-500/10 border-pink-500/50 text-white'
                                            : 'bg-[#0f0f12] border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                                            }`}
                                    >
                                        <span className="text-lg block mb-1">{s.emoji}</span>
                                        <span className="text-xs">{s.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div>
                            <div className="flex justify-between mb-2.5">
                                <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Text</label>
                                <span className="text-xs text-[#52525b]">{wordCount} words</span>
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="textarea h-52"
                                placeholder="Paste your text here..."
                            />
                        </div>

                        {/* Summarize Button */}
                        <button
                            onClick={handleSummarize}
                            disabled={loading || !text.trim()}
                            className="btn-primary w-full py-3"
                        >
                            <Sparkles size={16} />
                            {loading ? 'Summarizing...' : 'Summarize'}
                        </button>
                    </div>

                    {/* Output Panel */}
                    <div className="card flex flex-col">
                        <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between">
                            <span className="text-sm font-medium text-[#a1a1aa]">Summary</span>
                            {result && (
                                <button onClick={handleCopy} className="btn-ghost py-1 px-2 text-xs">
                                    {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 p-4 overflow-auto min-h-[300px]">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="loading-dots"><span /><span /><span /></div>
                                </div>
                            ) : result ? (
                                <p className="whitespace-pre-wrap text-sm text-[#d4d4d8] leading-relaxed">{result}</p>
                            ) : (
                                <div className="h-full flex items-center justify-center text-[#3f3f46] text-sm">
                                    Summary will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
