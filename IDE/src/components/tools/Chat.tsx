import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, History, Plus, X } from 'lucide-react';
import { AIProvider, generateAI, SYSTEM_PROMPTS } from '../../services/ai';
import type { Message } from '../../types';
import { useAgent } from '../../providers/AgentProvider';
import ThoughtBlock from '../agentic/ThoughtBlock';
import TaskView from '../agentic/TaskView';
import ToolLog from '../agentic/ToolLog';
import Table from '../agentic/Table';

interface ChatProps {
    apiKey: string;
    provider?: AIProvider;
}

const suggestions = [
    "Explain quantum computing",
    "Write a poem about code",
    "How to learn React?",
    "Demo Agentic features",
];

export default function Chat({ apiKey, provider }: ChatProps) {
    const { setCurrentTask, addAction, updateAction, addFileChange, setIsThinking } = useAgent();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [savedChats, setSavedChats] = useState<{ title: string; messages: Message[] }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        if (window.electronAPI) {
            const history = await window.electronAPI.getChatHistory();
            if (history && history.length > 0) {
                setMessages(history);
            }
        }
    };

    const saveChatHistory = async (msgs: Message[]) => {
        if (window.electronAPI && msgs.length > 0) {
            await window.electronAPI.saveChatHistory(msgs);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');

        const newUserMsg: Message = {
            id: Date.now(),
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };

        const newMessages = [...messages, newUserMsg];
        setMessages(newMessages);
        setLoading(true);

        // Special demo case
        if (userMessage.toLowerCase() === 'demo agentic features') {
            setIsThinking(true);

            const task = {
                name: "Demonstrating OxonAI Agentic Capabilities",
                summary: "I am showing off the new Thought Blocks, Task Tracking, and Tool Execution logs in the OxonAI IDE.",
                status: "Configuring Demo Environment",
                items: [
                    { id: '1', text: "Initialize agentic UI components", status: 'completed' as const },
                    { id: '2', text: "Display thought process", status: 'completed' as const },
                    { id: '3', text: "Show task progress tracker", status: 'in-progress' as const },
                    { id: '4', text: "Record tool execution logs", status: 'pending' as const },
                ]
            };

            setCurrentTask(task);

            // Simulate actions
            addAction({
                id: 'act_1',
                type: 'research',
                title: 'Analyzing Project Structure',
                description: 'Searching for React components in src/',
                status: 'success',
                timestamp: new Date().toISOString()
            });

            addAction({
                id: 'act_2',
                type: 'command',
                title: 'Running UI Tests',
                description: 'npm run test:ui',
                status: 'running',
                timestamp: new Date().toISOString()
            });

            // Simulate file changes
            addFileChange({
                path: 'IDE/src/components/agentic/AgentSidebar.tsx',
                type: 'new',
                diff: '+ New sidebar component'
            });

            setTimeout(() => {
                updateAction('act_2', 'success');
                setIsThinking(false);

                const demoMsg: Message = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    timestamp: new Date().toISOString(),
                    thought: "I need to demonstrate the new agentic features. I'll show a task breakdown, some tool executions, and internal reasoning.",
                    task: task,
                    toolCalls: [
                        {
                            id: 'tool_1',
                            toolName: 'shell_execute',
                            command: 'npm run test:ui',
                            status: 'success',
                            output: 'UI components verified: ThoughtBlock, TaskView, ToolLog. All tests passed.'
                        },
                        {
                            id: 'tool_2',
                            toolName: 'file_search',
                            command: 'find . -name "*.tsx"',
                            status: 'running'
                        }
                    ],
                    table: {
                        headers: ['Component', 'Status', 'Performance'],
                        rows: [
                            ['ThoughtBlock', 'Ready', 'Fast'],
                            ['TaskView', 'Ready', 'Smooth'],
                            ['ToolLog', 'Ready', 'Monospaced'],
                            ['Table', 'Ready', 'Structured'],
                        ]
                    },
                    content: "This is a demonstration of my new agentic features! As you can see, I can now share my internal reasoning, track complex tasks step-by-step, and show you exactly which tools I'm running in real-time. I've also populated the Agent Workspace sidebar on the right with our current progress!"
                };
                setMessages(prev => [...prev, demoMsg]);
                setLoading(false);
                saveChatHistory([...newMessages, demoMsg]);
            }, 2000);
            return;
        }

        try {
            const response = await generateAI(apiKey, SYSTEM_PROMPTS.chat, userMessage, { provider });

            const newAssistantMsg: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            };

            const updatedMessages = [...newMessages, newAssistantMsg];
            setMessages(updatedMessages);
            saveChatHistory(updatedMessages);
        } catch (error: any) {
            const errorMsg: Message = {
                id: Date.now() + 2,
                role: 'assistant',
                content: `Error: ${error.message}`,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const clearChat = async () => {
        if (messages.length > 0) {
            setSavedChats(prev => [...prev, {
                title: messages[0]?.content.slice(0, 30) || 'Chat',
                messages
            }]);
        }
        setMessages([]);
        if (window.electronAPI) {
            await window.electronAPI.clearChatHistory();
        }
    };

    const loadChat = (chat: { messages: Message[] }) => {
        setMessages(chat.messages);
        setShowHistory(false);
    };

    return (
        <div className="flex-1 flex flex-col animate-fade-in">
            {/* Header */}
            <header className="px-6 py-4 border-b border-[#18181b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-[15px]">Chat</h1>
                        <p className="text-[#52525b] text-xs">{messages.length} messages</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {savedChats.length > 0 && (
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-purple-500/20 text-purple-400' : 'text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#18181b]'}`}
                        >
                            <History size={16} />
                        </button>
                    )}
                    {messages.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="p-2 text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#18181b] rounded-lg transition-colors"
                            title="New chat"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>
            </header>

            {/* History Panel */}
            {showHistory && savedChats.length > 0 && (
                <div className="border-b border-[#18181b] p-3 flex gap-2 overflow-x-auto hide-scrollbar animate-slide-up">
                    {savedChats.map((chat, i) => (
                        <button
                            key={i}
                            onClick={() => loadChat(chat)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-[#a1a1aa] hover:border-purple-500/50 transition-colors whitespace-nowrap"
                        >
                            <span>{chat.title}...</span>
                            <X
                                size={12}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSavedChats(prev => prev.filter((_, idx) => idx !== i));
                                }}
                                className="hover:text-red-400"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-auto px-6 py-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                            <Sparkles size={28} className="text-purple-400" />
                        </div>
                        <h2 className="text-lg font-medium mb-2">How can I help?</h2>
                        <p className="text-[#52525b] text-sm mb-6 max-w-xs">
                            Ask me anything about code, ideas, writing, and more.
                        </p>
                        <div className="grid grid-cols-2 gap-2 max-w-sm">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setInput(s)}
                                    className="px-3 py-2 bg-[#18181b] border border-[#27272a] hover:border-purple-500/30 rounded-xl text-xs text-[#a1a1aa] text-left transition-all hover:bg-[#1f1f23]"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                                        : 'bg-[#18181b] border border-[#27272a] text-[#e4e4e7]'
                                        }`}
                                >
                                    {msg.thought && <ThoughtBlock thought={msg.thought} />}

                                    {msg.task && (
                                        <TaskView
                                            taskName={msg.task.name}
                                            summary={msg.task.summary}
                                            status={msg.task.status}
                                            items={msg.task.items}
                                        />
                                    )}

                                    {msg.toolCalls?.map((tool) => (
                                        <ToolLog key={tool.id} toolCall={tool} />
                                    ))}

                                    {msg.table && <Table data={msg.table} />}

                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-slide-up">
                                <div className="bg-[#18181b] border border-[#27272a] px-4 py-3 rounded-2xl">
                                    <div className="loading-dots">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-[#18181b]">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        className="textarea pr-14 min-h-[52px] max-h-32 py-3.5"
                        rows={1}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-[#27272a] disabled:text-[#52525b] text-white rounded-lg transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
