"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const styles = [
    { id: "concise", name: "Concise", icon: "📌" },
    { id: "detailed", name: "Detailed", icon: "📋" },
    { id: "bullets", name: "Bullet Points", icon: "🔹" },
    { id: "executive", name: "Executive", icon: "💼" },
];

const lengths = ["short", "medium", "long"];

export default function SummarizePage() {
    const [text, setText] = useState("");
    const [style, setStyle] = useState("concise");
    const [length, setLength] = useState("medium");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if (!text.trim() || loading) return;

        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/ai/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, style, length }),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data.content);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult("Failed to summarize. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border bg-background-secondary/50">
                <h1 className="font-display text-2xl">📝 Summarizer</h1>
                <p className="text-foreground-secondary text-sm">Condense long text into key points</p>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Style */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Summary Style</label>
                            <div className="grid grid-cols-2 gap-2">
                                {styles.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStyle(s.id)}
                                        className={`p-3 rounded-xl border text-left transition-all ${style === s.id
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-border hover:border-border-light"
                                            }`}
                                    >
                                        <span className="text-xl mr-2">{s.icon}</span>
                                        <span className="text-sm">{s.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Length */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Summary Length</label>
                            <div className="flex gap-2">
                                {lengths.map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLength(l)}
                                        className={`flex-1 px-4 py-2 rounded-lg text-sm capitalize transition-all ${length === l
                                            ? "bg-purple-500 text-white"
                                            : "bg-background-tertiary hover:bg-border"
                                            }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium">Text to Summarize</label>
                                <span className="text-xs text-foreground-secondary">{wordCount} words</span>
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-64 px-4 py-3 bg-background-tertiary border border-border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                                placeholder="Paste your text here..."
                            />
                        </div>

                        {/* Summarize Button */}
                        <motion.button
                            onClick={handleSummarize}
                            disabled={loading || !text.trim()}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-xl disabled:opacity-50 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "Summarizing..." : "Summarize"}
                        </motion.button>
                    </div>

                    {/* Output Section */}
                    <div className="bg-background-secondary border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Summary</h3>
                            {result && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(result)}
                                    className="px-3 py-1 text-sm bg-background-tertiary hover:bg-border rounded-lg transition-colors"
                                >
                                    📋 Copy
                                </button>
                            )}
                        </div>
                        <div className="min-h-[400px]">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            ) : result ? (
                                <p className="whitespace-pre-wrap text-foreground-secondary">{result}</p>
                            ) : (
                                <p className="text-foreground-secondary text-center py-20">
                                    Your summary will appear here
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
