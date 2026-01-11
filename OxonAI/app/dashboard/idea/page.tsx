"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
    { id: "general", name: "General", icon: "💡" },
    { id: "business", name: "Business", icon: "💼" },
    { id: "content", name: "Content", icon: "📝" },
    { id: "product", name: "Product", icon: "🚀" },
    { id: "marketing", name: "Marketing", icon: "📈" },
];

export default function IdeaPage() {
    const [topic, setTopic] = useState("");
    const [category, setCategory] = useState("general");
    const [count, setCount] = useState(5);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim() || loading) return;

        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/ai/idea", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, category, count }),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data.content);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult("Failed to generate ideas. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border bg-background-secondary/50">
                <h1 className="font-display text-2xl">💡 Idea Generator</h1>
                <p className="text-foreground-secondary text-sm">Brainstorm creative ideas for any project</p>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Category</label>
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-3 rounded-xl border text-center transition-all ${category === cat.id
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-border hover:border-border-light"
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">{cat.icon}</span>
                                        <span className="text-xs">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Number of Ideas */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Number of Ideas: {count}</label>
                            <input
                                type="range"
                                min="3"
                                max="10"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-foreground-secondary mt-1">
                                <span>3</span>
                                <span>10</span>
                            </div>
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Topic / Challenge</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full h-32 px-4 py-3 bg-background-tertiary border border-border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                                placeholder="What do you need ideas for? e.g., 'Mobile app for fitness tracking' or 'Content ideas for a tech blog'"
                            />
                        </div>

                        {/* Generate Button */}
                        <motion.button
                            onClick={handleGenerate}
                            disabled={loading || !topic.trim()}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-xl disabled:opacity-50 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "Brainstorming..." : "Generate Ideas"}
                        </motion.button>
                    </div>

                    {/* Output Section */}
                    <div className="bg-background-secondary border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Generated Ideas</h3>
                            {result && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(result)}
                                    className="px-3 py-1 text-sm bg-background-tertiary hover:bg-border rounded-lg transition-colors"
                                >
                                    📋 Copy
                                </button>
                            )}
                        </div>
                        <div className="min-h-[400px] max-h-[500px] overflow-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            ) : result ? (
                                <div className="whitespace-pre-wrap text-foreground-secondary">{result}</div>
                            ) : (
                                <p className="text-foreground-secondary text-center py-20">
                                    Your creative ideas will appear here ✨
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
