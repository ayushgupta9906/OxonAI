"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tones = [
    { id: "professional", name: "Professional", icon: "💼" },
    { id: "casual", name: "Casual", icon: "😊" },
    { id: "formal", name: "Formal", icon: "📜" },
    { id: "friendly", name: "Friendly", icon: "🤝" },
    { id: "persuasive", name: "Persuasive", icon: "🎯" },
    { id: "simple", name: "Simple", icon: "✨" },
];

const styles = [
    { id: "paraphrase", name: "Paraphrase" },
    { id: "simplify", name: "Simplify" },
    { id: "expand", name: "Expand" },
    { id: "shorten", name: "Shorten" },
    { id: "improve", name: "Improve" },
];

export default function RewritePage() {
    const [text, setText] = useState("");
    const [tone, setTone] = useState("professional");
    const [style, setStyle] = useState("paraphrase");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRewrite = async () => {
        if (!text.trim() || loading) return;

        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/ai/rewrite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, tone, style }),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data.content);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult("Failed to rewrite. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border bg-background-secondary/50">
                <h1 className="font-display text-2xl">🔄 Rewriter</h1>
                <p className="text-foreground-secondary text-sm">Transform text with different tones and styles</p>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Tone */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Target Tone</label>
                            <div className="grid grid-cols-3 gap-2">
                                {tones.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTone(t.id)}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${tone === t.id
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-border hover:border-border-light"
                                            }`}
                                    >
                                        <span className="text-lg mr-1">{t.icon}</span>
                                        <span className="text-xs">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Style */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Rewrite Style</label>
                            <div className="flex flex-wrap gap-2">
                                {styles.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStyle(s.id)}
                                        className={`px-4 py-2 rounded-full text-sm transition-all ${style === s.id
                                            ? "bg-purple-500 text-white"
                                            : "bg-background-tertiary hover:bg-border"
                                            }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Original Text</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-48 px-4 py-3 bg-background-tertiary border border-border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                                placeholder="Enter the text you want to rewrite..."
                            />
                        </div>

                        {/* Rewrite Button */}
                        <motion.button
                            onClick={handleRewrite}
                            disabled={loading || !text.trim()}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-xl disabled:opacity-50 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "Rewriting..." : "Rewrite Text"}
                        </motion.button>
                    </div>

                    {/* Output Section */}
                    <div className="bg-background-secondary border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Rewritten Text</h3>
                            {result && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(result)}
                                    className="px-3 py-1 text-sm bg-background-tertiary hover:bg-border rounded-lg transition-colors"
                                >
                                    📋 Copy
                                </button>
                            )}
                        </div>
                        <div className="min-h-[350px]">
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
                                    Your rewritten text will appear here
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
