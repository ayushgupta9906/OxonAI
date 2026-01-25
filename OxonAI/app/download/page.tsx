"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function DownloadPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 flex items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl -z-10" />

            <motion.div
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-background-secondary/80 backdrop-blur-md border border-border rounded-3xl p-10 md:p-14 shadow-2xl">
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-500/20"
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ type: "spring", duration: 1 }}
                    >
                        <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Beta Access Coming Soon
                    </h1>
                    <p className="text-lg text-foreground-secondary mb-10 leading-relaxed">
                        The OxonAI IDE is currently in private beta development.
                        <br className="hidden sm:block" />
                        We are working hard to bring you the future of AI-powered coding.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <motion.button
                            onClick={() => router.push("/")}
                            className="group flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </motion.button>

                        <motion.button
                            onClick={() => router.push("/#services")}
                            className="px-6 py-3 bg-transparent border border-border text-foreground font-medium rounded-full hover:bg-background-tertiary transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Services
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
