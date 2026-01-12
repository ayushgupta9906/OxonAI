"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Failed to get response. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border bg-background-secondary/50">
                <h1 className="font-display text-2xl">💬 Chat Assistant</h1>
                <p className="text-foreground-secondary text-sm">Ask me anything - I&apos;m here to help!</p>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">💬</p>
                        <h2 className="text-xl font-medium mb-2">Start a Conversation</h2>
                        <p className="text-foreground-secondary max-w-md mx-auto">
                            I can help with questions, research, writing, coding, and much more. Just type your message below!
                        </p>
                        <div className="mt-8 flex flex-wrap gap-2 justify-center">
                            {["Explain quantum computing", "Write a poem about AI", "Help me plan a project"].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => setInput(suggestion)}
                                    className="px-4 py-2 bg-background-secondary hover:bg-background-tertiary border border-border rounded-full text-sm transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div
                            className={`max-w-3xl px-4 py-3 rounded-2xl ${message.role === "user"
                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                                : "bg-background-secondary border border-border"
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="bg-background-secondary border border-border px-4 py-3 rounded-2xl">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background-secondary/50">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-background-tertiary border border-border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        disabled={loading}
                    />
                    <motion.button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-xl disabled:opacity-50 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Send
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
