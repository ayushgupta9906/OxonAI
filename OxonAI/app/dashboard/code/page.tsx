"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const actions = [
    { id: "write", name: "Write Code", icon: "✏️" },
    { id: "debug", name: "Debug", icon: "🐛" },
    { id: "explain", name: "Explain", icon: "📚" },
    { id: "optimize", name: "Optimize", icon: "⚡" },
    { id: "convert", name: "Convert", icon: "🔄" },
];

const languages = ["auto", "javascript", "typescript", "python", "java", "c++", "go", "rust", "sql", "html/css"];

export default function CodePage() {
    const [prompt, setPrompt] = useState("");
    const [action, setAction] = useState("write");
    const [language, setLanguage] = useState("auto");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/ai/code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, action, language }),
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data.content);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult("Failed to generate code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border bg-background-secondary/50">
                <h1 className="font-display text-2xl">💻 Code Assistant</h1>
                <p className="text-foreground-secondary text-sm">Write, debug, explain, and optimize code</p>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Action</label>
                            <div className="flex flex-wrap gap-2">
                                {actions.map((a) => (
                                    <button
                                        key={a.id}
                                        onClick={() => setAction(a.id)}
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${action === a.id
                                            ? "bg-purple-500 text-white"
                                            : "bg-background-tertiary hover:bg-border"
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
                            <label className="block text-sm font-medium mb-3">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-4 py-3 bg-background-tertiary border border-border rounded-xl focus:border-purple-500 outline-none"
                            >
                                {languages.map((l) => (
                                    <option key={l} value={l}>
                                        {l === "auto" ? "Auto-detect" : l.charAt(0).toUpperCase() + l.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Prompt */}
                        <div>
                            <label className="block text-sm font-medium mb-3">
                                {action === "write" ? "Describe what you want to build" :
                                    action === "debug" ? "Paste your code with the issue" :
                                        action === "explain" ? "Paste the code to explain" :
                                            action === "optimize" ? "Paste the code to optimize" :
                                                "Paste the code to convert"}
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-64 px-4 py-3 bg-background-tertiary border border-border rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none font-mono text-sm resize-none"
                                placeholder={action === "write" ? "e.g., Create a React component that..." : "Paste your code here..."}
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
                            {loading ? "Processing..." : action === "write" ? "Generate Code" : `${action.charAt(0).toUpperCase() + action.slice(1)} Code`}
                        </motion.button>
                    </div>

                    {/* Output Section */}
                    <div className="bg-background-secondary border border-border rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h3 className="font-medium">Output</h3>
                            {result && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(result)}
                                    className="px-3 py-1 text-sm bg-background-tertiary hover:bg-border rounded-lg transition-colors"
                                >
                                    📋 Copy
                                </button>
                            )}
                        </div>
                        <div className="p-4 min-h-[500px] max-h-[600px] overflow-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            ) : result ? (
                                <pre className="whitespace-pre-wrap font-mono text-sm text-foreground-secondary">{result}</pre>
                            ) : (
                                <p className="text-foreground-secondary text-center py-20">
                                    Generated code will appear here
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
