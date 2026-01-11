import { useState } from 'react';
import { FileText, Copy, Check, Sparkles } from 'lucide-react';
import { AIProvider, generateAI, SYSTEM_PROMPTS } from '../../services/ai';

interface ContentProps {
    apiKey: string;
    provider?: AIProvider;
}

const types = [
    { id: 'blog', name: 'Blog', emoji: '📝' },
    { id: 'social', name: 'Social', emoji: '📱' },
    { id: 'email', name: 'Email', emoji: '✉️' },
    { id: 'ad', name: 'Ad Copy', emoji: '📢' },
];

const tones = ['Professional', 'Casual', 'Friendly', 'Persuasive', 'Witty'];

export default function Content({ apiKey, provider }: ContentProps) {
    const [prompt, setPrompt] = useState('');
    const [contentType, setContentType] = useState('blog');
    const [tone, setTone] = useState('Professional');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setResult('');

        try {
            const fullPrompt = `Create a ${contentType} post about: ${prompt}\nTone: ${tone}\n\nMake it engaging and well-structured.`;
            const response = await generateAI(apiKey, SYSTEM_PROMPTS.content, fullPrompt, { temperature: 0.8, provider });
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <FileText size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-[15px]">Content Generator</h1>
                    <p className="text-[#52525b] text-xs">Create engaging content</p>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">

                    {/* Input Panel */}
                    <div className="space-y-5">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Type</label>
                            <div className="grid grid-cols-4 gap-2">
                                {types.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setContentType(t.id)}
                                        className={`p-3 rounded-xl border text-center transition-all ${contentType === t.id
                                            ? 'bg-blue-500/10 border-blue-500/50 text-white'
                                            : 'bg-[#0f0f12] border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                                            }`}
                                    >
                                        <span className="text-lg block mb-1">{t.emoji}</span>
                                        <span className="text-xs">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tone */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Tone</label>
                            <div className="flex flex-wrap gap-2">
                                {tones.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${tone === t ? 'chip-active' : 'chip-default hover:border-[#3f3f46]'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Topic</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="textarea h-28"
                                placeholder="Describe what you want to write about..."
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="btn-primary w-full py-3"
                        >
                            <Sparkles size={16} />
                            {loading ? 'Generating...' : 'Generate Content'}
                        </button>
                    </div>

                    {/* Output Panel */}
                    <div className="card flex flex-col">
                        <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between">
                            <span className="text-sm font-medium text-[#a1a1aa]">Output</span>
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
                                    Your content will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
