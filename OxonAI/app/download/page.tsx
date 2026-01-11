"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DownloadPage() {
    const router = useRouter();
    const [downloading, setDownloading] = useState(false);

    const handleDownload = () => {
        setDownloading(true);
        // Simulate download - replace with actual file download
        setTimeout(() => {
            alert("OxonAI IDE download will start here.\n\nFile: OxonAI-IDE-Setup.exe\nYou'll integrate your IDE file later.");
            setDownloading(false);
        }, 1500);
    };

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 flex items-center justify-center">
            <motion.div
                className="max-w-3xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-12">
                    {/* Icon */}
                    <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                    </motion.div>

                    <h1 className="font-display text-display-sm mb-4">
                        Download OxonAI IDE
                    </h1>
                    <p className="text-body-lg text-foreground-secondary mb-8">
                        Your payment was successful! Download the OxonAI IDE to start building.
                    </p>

                    {/* Download Button */}
                    <motion.button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full font-medium transition-all duration-200 shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        whileHover={{ scale: downloading ? 1 : 1.05 }}
                        whileTap={{ scale: downloading ? 1 : 0.95 }}
                    >
                        {downloading ? (
                            <span className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Preparing Download...
                            </span>
                        ) : (
                            <span className="flex items-center gap-3 justify-center">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                Download OxonAI IDE
                            </span>
                        )}
                    </motion.button>

                    {/* Info */}
                    <div className="bg-background-tertiary border border-border rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-semibold mb-3 text-foreground">System Requirements</h3>
                        <ul className="space-y-2 text-sm text-foreground-secondary">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Windows 10/11 or macOS 10.15+
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                4GB RAM minimum (8GB recommended)
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                500MB free disk space
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            onClick={() => router.push("/dashboard")}
                            className="px-6 py-3 bg-background-tertiary hover:bg-border text-foreground rounded-full font-medium transition-all duration-200 border border-border"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Go to Dashboard
                        </motion.button>
                        <motion.button
                            onClick={() => router.push("/")}
                            className="px-6 py-3 text-foreground-secondary hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            Back to Home
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
