"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        totalRequests: 0,
        tokensUsed: 0,
    });

    const user = session?.user as any;

    useEffect(() => {
        if (status === "authenticated" && user?.role !== "ADMIN") {
            router.push("/dashboard/chat");
        }
    }, [status, user, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (user?.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl mb-4">🔒</p>
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-foreground-secondary">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="font-display text-display-sm mb-2">Admin Dashboard</h1>
                    <p className="text-foreground-secondary">Monitor and manage your OxonAI platform</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Users", value: stats.totalUsers || "—", icon: "👥", color: "purple" },
                        { label: "Active Today", value: stats.activeToday || "—", icon: "📊", color: "blue" },
                        { label: "Total Requests", value: stats.totalRequests || "—", icon: "📈", color: "green" },
                        { label: "Tokens Used", value: stats.tokensUsed?.toLocaleString() || "—", icon: "⚡", color: "orange" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-background-secondary border border-border rounded-xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl">{stat.icon}</span>
                                <span className={`text-xs px-2 py-1 rounded-full bg-${stat.color}-500/20 text-${stat.color}-400`}>
                                    Live
                                </span>
                            </div>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-foreground-secondary text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <motion.div
                        className="bg-background-secondary border border-border rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="font-display text-lg mb-4">Recent Users</h2>
                        <div className="text-center py-12 text-foreground-secondary">
                            <p className="text-4xl mb-2">📭</p>
                            <p>Connect to database to view users</p>
                            <p className="text-sm mt-2">Run `npx prisma db push` to set up</p>
                        </div>
                    </motion.div>

                    {/* Tool Usage */}
                    <motion.div
                        className="bg-background-secondary border border-border rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="font-display text-lg mb-4">Tool Usage</h2>
                        <div className="space-y-4">
                            {[
                                { name: "Chat", icon: "💬", usage: 45 },
                                { name: "Content", icon: "✍️", usage: 28 },
                                { name: "Code", icon: "💻", usage: 35 },
                                { name: "Ideas", icon: "💡", usage: 18 },
                                { name: "Summarize", icon: "📝", usage: 22 },
                                { name: "Rewrite", icon: "🔄", usage: 15 },
                            ].map((tool) => (
                                <div key={tool.name} className="flex items-center gap-4">
                                    <span className="text-xl">{tool.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{tool.name}</span>
                                            <span className="text-foreground-secondary">{tool.usage}%</span>
                                        </div>
                                        <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                                                style={{ width: `${tool.usage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Plan Distribution */}
                    <motion.div
                        className="bg-background-secondary border border-border rounded-xl p-6 lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="font-display text-lg mb-4">Plan Distribution</h2>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { name: "Free", users: "—", color: "gray" },
                                { name: "Seed", users: "—", color: "purple" },
                                { name: "Edge", users: "—", color: "blue" },
                                { name: "Quantum", users: "—", color: "green" },
                            ].map((plan) => (
                                <div key={plan.name} className="text-center p-4 bg-background-tertiary rounded-xl">
                                    <p className={`text-3xl font-bold text-${plan.color}-500`}>{plan.users}</p>
                                    <p className="text-sm text-foreground-secondary">{plan.name}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
