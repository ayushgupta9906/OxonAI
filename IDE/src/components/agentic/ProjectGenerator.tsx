import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentEvent } from '../../types';

const MODELS = [
    { id: 'gemini-pro', name: '🟢 Gemini Pro (Google API)' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (OpenRouter)' },
    { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS-120B Free (OpenRouter)' },
    { id: 'deepseek/deepseek-v3.2-speciale', name: 'DeepSeek V3.2 (OpenRouter)' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (OpenAI Direct)' },
];

export default function ProjectGenerator() {
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState('gemini-pro'); // Changed to Gemini (you have GOOGLE_API_KEY)
    const [isGenerating, setIsGenerating] = useState(false);
    const [events, setEvents] = useState<AgentEvent[]>([]);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const eventsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load user credits
        window.electronAPI.getSettings().then((settings: any) => {
            if (settings?.user?.credits) {
                setUserCredits(settings.user.credits);
            }
        });

        // Listen for agent events
        const cleanup = window.electronAPI.onAgentEvent((event: AgentEvent) => {
            setEvents(prev => [...prev, event]);

            // Update credits if returned in event
            if (event.type === 'complete' && event.data.creditsRemaining !== undefined) {
                setUserCredits(event.data.creditsRemaining);
            }
        });

        return cleanup;
    }, []);

    useEffect(() => {
        eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    const handleGenerate = async () => {
        if (!prompt.trim() || isGenerating) return;

        setIsGenerating(true);
        setEvents([]);

        try {
            const result = await window.electronAPI.agentGenerateProject({
                prompt,
                model,
            });

            if (!result.success) {
                setEvents(prev => [...prev, {
                    type: 'error',
                    data: { message: result.error || 'Generation failed' },
                    timestamp: Date.now(),
                }]);
            }
        } catch (error: any) {
            setEvents(prev => [...prev, {
                type: 'error',
                data: { message: error.message || 'Unknown error' },
                timestamp: Date.now(),
            }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'thought': return '🤔';
            case 'tool_call': return '⚡';
            case 'tool_result': return '✅';
            case 'error': return '❌';
            case 'progress': return '📊';
            case 'complete': return '🎉';
            default: return '•';
        }
    };

    return (
        <div className="h-full flex flex-col bg-background-secondary">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    AI Project Generator
                </h1>
                <p className="text-sm text-foreground-secondary">
                    Describe your project and watch it build automatically
                </p>
            </div>

            {/* Input Section */}
            <div className="p-6 space-y-4 border-b border-border">
                <div>
                    <label className="block text-xs font-medium mb-2 text-foreground-secondary">
                        AI Model
                    </label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isGenerating}
                    >
                        {MODELS.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                {userCredits !== null && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-200">
                        💎 Credits: {userCredits} | Cost: 10 credits per generation
                    </div>
                )}

                {userCredits !== null && userCredits < 10 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-200">
                        ⚠️ Low credits! Buy more at oxonai.com/pricing
                    </div>
                )}

                <div>
                    <label className="block text-xs font-medium mb-2 text-foreground-secondary">
                        What do you want to build?
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Create a todo app with React and TypeScript, with dark mode and local storage..."
                        className="w-full h-32 px-3 py-2 bg-background border border-border rounded text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isGenerating}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating || (userCredits !== null && userCredits < 10)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                    {isGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating Project...
                        </span>
                    ) : (
                        '🚀 Generate Project'
                    )}
                </button>
            </div>

            {/* Events Stream */}
            <div className="flex-1 overflow-y-auto p-6">
                {events.length > 0 ? (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {events.map((event, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-2 text-sm"
                                >
                                    <span className="text-lg">{getEventIcon(event.type)}</span>
                                    <div className="flex-1">
                                        {event.type === 'thought' && (
                                            <p className="text-foreground-secondary">{event.data.content}</p>
                                        )}
                                        {event.type === 'tool_call' && (
                                            <p className="text-blue-400">
                                                <span className="font-semibold">{event.data.tool}</span>
                                                <span className="text-foreground-secondary text-xs ml-2">
                                                    {event.data.args?.path || ''}
                                                </span>
                                            </p>
                                        )}
                                        {event.type === 'tool_result' && (
                                            <p className="text-xs text-green-400">
                                                {event.data.result.success ? '✓ Success' : `✗ ${event.data.result.error}`}
                                            </p>
                                        )}
                                        {event.type === 'error' && (
                                            <p className="text-red-400 font-semibold">Error: {event.data.message}</p>
                                        )}
                                        {event.type === 'progress' && (
                                            <div>
                                                <p className="text-xs text-foreground-secondary mb-1">
                                                    {event.data.status} ({event.data.current}/{event.data.total})
                                                </p>
                                                <div className="w-full bg-background rounded-full h-1.5">
                                                    <div
                                                        className="bg-purple-500 h-1.5 rounded-full transition-all"
                                                        style={{ width: `${(event.data.current / event.data.total) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {event.type === 'complete' && (
                                            <div className="text-green-400">
                                                <p className="font-semibold">🎉 Project Generated!</p>
                                                <p className="text-xs text-foreground-secondary mt-1">
                                                    📁 {event.data.projectPath}
                                                </p>
                                                <p className="text-xs text-foreground-secondary">
                                                    📄 Files: {event.data.filesCreated}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={eventsEndRef} />
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-foreground-secondary text-sm">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🤖</div>
                            <p>Enter your project idea above to get started</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
