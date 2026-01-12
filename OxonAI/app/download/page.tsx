"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DownloadPage() {
    const router = useRouter();
    const [downloading, setDownloading] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<'windows' | 'linux' | 'mac' | null>(null);

    const handlePlatformDownload = (platform: 'windows' | 'linux' | 'mac') => {
        setSelectedPlatform(platform);
        setDownloading(true);

        const releaseBase = "https://github.com/ayushgupta9906/OxonAI/releases/download/v1.0.0";

        const fileMap: Record<string, string> = {
            windows: `${releaseBase}/OxonAI-IDE-Setup.exe`,
            linux: `${releaseBase}/OxonAI-IDE-Linux.zip`,
            mac: `${releaseBase}/OxonAI-IDE-Mac.zip`
        };

        const url = fileMap[platform];
        const name = url.split('/').pop() || 'OxonAI-IDE';

        setTimeout(() => {
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloading(false);
            setSelectedPlatform(null);
        }, 1200);
    };

    const platforms = [
        { id: 'windows', name: 'Windows', icon: '🪟' },
        { id: 'mac', name: 'macOS', icon: '🍎' },
        { id: 'linux', name: 'Linux', icon: '🐧' },
    ] as const;

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 flex items-center justify-center">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                    </motion.div>

                    <h1 className="font-display text-display-sm mb-2">Download OxonAI IDE</h1>
                    <p className="text-foreground-secondary mb-10">Your payment was successful! Select your platform to download the IDE.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {platforms.map((p) => (
                            <motion.button
                                key={p.id}
                                onClick={() => handlePlatformDownload(p.id)}
                                disabled={downloading}
                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all duration-200 ${selectedPlatform === p.id
                                    ? 'bg-purple-600/10 border-purple-500 shadow-lg'
                                    : 'bg-background-tertiary border-border hover:border-purple-500/50 hover:bg-background-tertiary/80'
                                    } disabled:opacity-50`}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-4xl mb-2">{p.icon}</span>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg text-foreground">{p.name}</h3>
                                    <span className="text-xs text-foreground-secondary">
                                        {p.id === 'windows' ? '64-bit installer' : '.zip package'}
                                    </span>
                                </div>

                                {selectedPlatform === p.id && downloading ? (
                                    <div className="mt-2 w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <div className="mt-2 px-3 py-1 bg-foreground/5 rounded-full text-[10px] uppercase font-bold tracking-wider text-foreground-secondary">
                                        Download
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <motion.button
                            onClick={() => router.push("/dashboard")}
                            className="px-6 py-2.5 bg-background-tertiary hover:bg-border text-foreground rounded-full text-sm font-medium border border-border transition-colors"
                        >
                            Go to Dashboard
                        </motion.button>
                        <motion.button
                            onClick={() => router.push("/")}
                            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
                        >
                            Back to Home
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
