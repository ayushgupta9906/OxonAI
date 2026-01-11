import { useState } from 'react';
import { Code as CodeIcon, Play, Copy, Check } from 'lucide-react';
import { AIProvider, generateAI, SYSTEM_PROMPTS } from '../../services/ai';

interface CodeProps {
    apiKey: string;
    provider?: AIProvider;
}

const actions = [
    { id: 'write', name: 'Write', icon: '✏️' },
    { id: 'debug', name: 'Debug', icon: '🐛' },
    { id: 'explain', name: 'Explain', icon: '📖' },
    { id: 'optimize', name: 'Optimize', icon: '⚡' },
];

const languages = ['Auto', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'HTML/CSS'];

export default function Code({ apiKey, provider }: CodeProps) {
    const [prompt, setPrompt] = useState('');
    const [action, setAction] = useState('write');
    const [language, setLanguage] = useState('Auto');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setResult('');

        try {
            const actions: Record<string, string> = {
                write: 'Write clean, well-documented code for',
                debug: 'Debug and fix issues in this code',
                explain: 'Explain this code in detail',
                optimize: 'Optimize this code for performance',
            };
            const fullPrompt = `${actions[action]}:\n\n${prompt}\n\n${language !== 'Auto' ? `Language: ${language}` : ''}`;
            const response = await generateAI(apiKey, SYSTEM_PROMPTS.code, fullPrompt, { temperature: 0.2, provider });
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <CodeIcon size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-[15px]">Code Assistant</h1>
                    <p className="text-[#52525b] text-xs">Write, debug, and optimize code</p>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">

                    {/* Input Panel */}
                    <div className="space-y-5">
                        {/* Action */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Action</label>
                            <div className="flex gap-2">
                                {actions.map((a) => (
                                    <button
                                        key={a.id}
                                        onClick={() => setAction(a.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${action === a.id
                                            ? 'bg-emerald-500/15 border border-emerald-500/50 text-white'
                                            : 'bg-[#18181b] border border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                                            }`}
                                    >
                                        <span>{a.icon}</span>
                                        <span>{a.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="input py-2.5"
                            >
                                {languages.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>

                        {/* Code Input */}
                        <div>
                            <label className="block text-xs font-medium text-[#a1a1aa] mb-2.5 uppercase tracking-wider">
                                {action === 'write' ? 'Description' : 'Code'}
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="textarea h-44 font-mono text-sm"
                                placeholder={action === 'write' ? 'Describe what you want to build...' : 'Paste your code here...'}
                            />
                        </div>

                        {/* Run Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="btn-primary w-full py-3"
                        >
                            <Play size={16} />
                            {loading ? 'Processing...' : 'Run'}
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
                        <div className="flex-1 p-4 overflow-auto min-h-[380px]">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="loading-dots"><span /><span /><span /></div>
                                </div>
                            ) : result ? (
                                <pre className="whitespace-pre-wrap font-mono text-sm text-[#d4d4d8] leading-relaxed">{result}</pre>
                            ) : (
                                <div className="h-full flex items-center justify-center text-[#3f3f46] text-sm">
                                    Results will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
