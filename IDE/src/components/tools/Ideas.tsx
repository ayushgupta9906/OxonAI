import { useState } from 'react';
import { Lightbulb, Sparkles, Copy, Check } from 'lucide-react';
import { AIProvider, generateAI, SYSTEM_PROMPTS } from '../../services/ai';

interface IdeasProps {
    apiKey: string;
    provider?: AIProvider;
}

const categories = [
    { id: 'general', name: 'General', emoji: '💡' },
    { id: 'business', name: 'Business', emoji: '💼' },
    { id: 'content', name: 'Content', emoji: '📝' },
    { id: 'product', name: 'Product', emoji: '🚀' },
];

export default function Ideas({ apiKey, provider }: IdeasProps) {
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState('general');
    const [count, setCount] = useState(5);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim() || loading) return;
        setLoading(true);
        setResult('');

        try {
            const fullPrompt = `Generate ${count} creative ${category} ideas for: ${topic}\n\nFormat each idea with:\n- A catchy title\n- Brief description (1-2 sentences)\n- Why it could work`;
            const response = await generateAI(apiKey, SYSTEM_PROMPTS.ideas, fullPrompt, { temperature: 0.9, provider });
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Lightbulb size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-[15px]">Idea Generator</h1>
                    <p className="text-[#52525b] text-xs">Brainstorm creative ideas</p>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">

                    {/* Input Panel */}
                    <div className="space-y-5">
                        {/* Category */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Category</label>
                            <div className="grid grid-cols-4 gap-2">
                                {categories.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setCategory(c.id)}
                                        className={`p-3 rounded-xl border text-center transition-all ${category === c.id
                                            ? 'bg-amber-500/10 border-amber-500/50 text-white'
                                            : 'bg-[#0f0f12] border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                                            }`}
                                    >
                                        <span className="text-lg block mb-1">{c.emoji}</span>
                                        <span className="text-xs">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Number of Ideas */}
                        <div>
                            <div className="flex justify-between mb-2.5">
                                <label className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wider">Ideas</label>
                                <span className="text-sm text-white font-medium">{count}</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="10"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Topic</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="textarea h-24"
                                placeholder="What do you need ideas for?"
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic.trim()}
                            className="btn-primary w-full py-3"
                        >
                            <Sparkles size={16} />
                            {loading ? 'Brainstorming...' : 'Generate Ideas'}
                        </button>
                    </div>

                    {/* Output Panel */}
                    <div className="card flex flex-col">
                        <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between">
                            <span className="text-sm font-medium text-[#a1a1aa]">Ideas</span>
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
                                <div className="whitespace-pre-wrap text-sm text-[#d4d4d8] leading-relaxed">{result}</div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-[#3f3f46] text-sm">
                                    Your ideas will appear here ✨
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
