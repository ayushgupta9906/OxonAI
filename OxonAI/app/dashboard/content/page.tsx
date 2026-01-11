"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const contentTypes = [
    { id: "blog", name: "Blog Post", icon: "📝" },
    { id: "social", name: "Social Media", icon: "📱" },
    { id: "email", name: "Email", icon: "✉️" },
    { id: "ad", name: "Ad Copy", icon: "📢" },
    { id: "product", name: "Product Description", icon: "🏷️" },
];

const tones = ["professional", "casual", "formal", "friendly", "persuasive"];
const lengths = ["short", "medium", "long"];

export default function ContentPage() {
    const [prompt, setPrompt] = useState("");
    const [contentType, setContentType] = useState("blog");
    const [tone, setTone] = useState("professional");
    const [length, setLength] = useState("medium");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/ai/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, contentType, tone, length }),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data.content);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult("Failed to generate content. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border bg-background-secondary/50">
                <h1 className="font-display text-2xl">✍️ Content Generator</h1>
                <p className="text-foreground-secondary text-sm">Create engaging content for any platform</p>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Content Type */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Content Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {contentTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setContentType(type.id)}
                                        className={`p-3 rounded-xl border text-center transition-all ${contentType === type.id
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-border hover:border-border-light"
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">{type.icon}</span>
                                        <span className="text-xs">{type.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tone */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Tone</label>
                            <div className="flex flex-wrap gap-2">
                                {tones.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${tone === t
                                            ? "bg-purple-500 text-white"
                                            : "bg-background-tertiary hover:bg-border"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Length */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Length</label>
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

                        {/* Prompt */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Topic / Instructions</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-32 px-4 py-3 bg-background-tertiary border border-border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                                placeholder="Describe what content you want to create..."
                            />
                        </div>

                        {/* Generate Button */}
                        <motion.button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-xl disabled:opacity-50 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "Generating..." : "Generate Content"}
                        </motion.button>
                    </div>

                    {/* Output Section */}
                    <div className="bg-background-secondary border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Generated Content</h3>
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
                                    Your generated content will appear here
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
