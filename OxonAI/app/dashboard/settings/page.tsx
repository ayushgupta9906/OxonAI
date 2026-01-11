"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SettingsPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const planInfo: Record<string, { name: string; credits: number; features: string[] }> = {
        FREE: {
            name: "Free",
            credits: 100,
            features: ["100 credits/month", "Basic AI tools", "Standard response time"],
        },
        SEED: {
            name: "Oxon Seed",
            credits: 1500,
            features: ["1,500 credits/month", "All AI tools", "Adaptive Intelligence Memory", "Basic Support"],
        },
        EDGE: {
            name: "Oxon Edge",
            credits: 4000,
            features: ["4,000 credits/month", "99+ Integrations", "Personalization", "Priority Support"],
        },
        QUANTUM: {
            name: "Oxon Quantum",
            credits: 8000,
            features: ["8,000 credits/month", "Advanced Analytics", "Dedicated Support", "Custom Integrations"],
        },
    };

    const currentPlan = planInfo[user?.plan || "FREE"];

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border bg-background-secondary/50">
                <h1 className="font-display text-2xl">⚙️ Settings</h1>
                <p className="text-foreground-secondary text-sm">Manage your account and preferences</p>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Profile Section */}
                    <motion.div
                        className="bg-background-secondary border border-border rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="font-display text-lg mb-4">Profile</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                                {user?.name?.[0] || user?.email?.[0] || "U"}
                            </div>
                            <div>
                                <p className="font-medium text-lg">{user?.name || "User"}</p>
                                <p className="text-foreground-secondary">{user?.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">Name</label>
                                <p className="px-4 py-2 bg-background-tertiary rounded-lg">{user?.name || "Not set"}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">Email</label>
                                <p className="px-4 py-2 bg-background-tertiary rounded-lg truncate">{user?.email}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Plan Section */}
                    <motion.div
                        className="bg-background-secondary border border-border rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-display text-lg">Current Plan</h2>
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm rounded-full">
                                {currentPlan.name}
                            </span>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Credits Used</span>
                                <span>{currentPlan.credits - (user?.credits || 0)} / {currentPlan.credits}</span>
                            </div>
                            <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                                    style={{ width: `${((currentPlan.credits - (user?.credits || 0)) / currentPlan.credits) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            {currentPlan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <span className="text-purple-500">✓</span>
                                    <span className="text-foreground-secondary">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/pricing">
                            <motion.button
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-xl transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Upgrade Plan
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Usage Statistics */}
                    <motion.div
                        className="bg-background-secondary border border-border rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="font-display text-lg mb-4">Quick Stats</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-background-tertiary rounded-xl">
                                <p className="text-3xl font-bold text-purple-500">{user?.credits || 0}</p>
                                <p className="text-sm text-foreground-secondary">Credits Left</p>
                            </div>
                            <div className="text-center p-4 bg-background-tertiary rounded-xl">
                                <p className="text-3xl font-bold text-blue-500">6</p>
                                <p className="text-sm text-foreground-secondary">AI Tools</p>
                            </div>
                            <div className="text-center p-4 bg-background-tertiary rounded-xl">
                                <p className="text-3xl font-bold text-green-500">∞</p>
                                <p className="text-sm text-foreground-secondary">Templates</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
