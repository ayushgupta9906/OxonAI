import { useState } from 'react';
import { RefreshCw, Sparkles, Copy, Check } from 'lucide-react';
import { AIProvider, generateAI, SYSTEM_PROMPTS } from '../../services/ai';

interface RewriteProps {
    apiKey: string;
    provider?: AIProvider;
}

const tones = [
    { id: 'professional', name: 'Professional', emoji: '💼' },
    { id: 'casual', name: 'Casual', emoji: '😊' },
    { id: 'formal', name: 'Formal', emoji: '📜' },
    { id: 'friendly', name: 'Friendly', emoji: '🤝' },
    { id: 'persuasive', name: 'Persuasive', emoji: '🎯' },
    { id: 'simple', name: 'Simple', emoji: '✨' },
];

const actions = ['Paraphrase', 'Simplify', 'Expand', 'Shorten', 'Improve'];

export default function Rewrite({ apiKey, provider }: RewriteProps) {
    const [text, setText] = useState('');
    const [tone, setTone] = useState('professional');
    const [action, setAction] = useState('Paraphrase');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRewrite = async () => {
        if (!text.trim() || loading) return;
        setLoading(true);
        setResult('');

        try {
            const fullPrompt = `${action} the following text with a ${tone} tone:\n\n${text}\n\nProvide only the rewritten text.`;
            const response = await generateAI(apiKey, SYSTEM_PROMPTS.rewrite, fullPrompt, { provider });
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

    return (
        <div className="flex-1 flex flex-col animate-fade-in">
            {/* Header */}
            <header className="px-6 py-4 border-b border-[#18181b] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                    <RefreshCw size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-[15px]">Rewriter</h1>
                    <p className="text-[#52525b] text-xs">Transform text with different tones</p>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">

                    {/* Input Panel */}
                    <div className="space-y-5">
                        {/* Tone */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Tone</label>
                            <div className="grid grid-cols-3 gap-2">
                                {tones.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTone(t.id)}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${tone === t.id
                                            ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                                            : 'bg-[#0f0f12] border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                                            }`}
                                    >
                                        <span className="text-base mr-1">{t.emoji}</span>
                                        <span className="text-xs">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Style</label>
                            <div className="flex flex-wrap gap-2">
                                {actions.map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAction(a)}
                                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${action === a ? 'chip-active' : 'chip-default hover:border-[#3f3f46]'
                                            }`}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Original Text</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="textarea h-36"
                                placeholder="Enter text to rewrite..."
                            />
                        </div>

                        {/* Rewrite Button */}
                        <button
                            onClick={handleRewrite}
                            disabled={loading || !text.trim()}
                            className="btn-primary w-full py-3"
                        >
                            <Sparkles size={16} />
                            {loading ? 'Rewriting...' : 'Rewrite'}
                        </button>
                    </div>

                    {/* Output Panel */}
                    <div className="card flex flex-col">
                        <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between">
                            <span className="text-sm font-medium text-[#a1a1aa]">Rewritten</span>
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
                                    Rewritten text will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
