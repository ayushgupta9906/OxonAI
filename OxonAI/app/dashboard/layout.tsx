"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const tools = [
    { name: "Chat", href: "/dashboard/chat", icon: "💬", description: "General AI assistant" },
    { name: "Content", href: "/dashboard/content", icon: "✍️", description: "Blog, ads, emails" },
    { name: "Code", href: "/dashboard/code", icon: "💻", description: "Code assistant" },
    { name: "Ideas", href: "/dashboard/idea", icon: "💡", description: "Brainstorm ideas" },
    { name: "Summarize", href: "/dashboard/summarize", icon: "📝", description: "Summarize text" },
    { name: "Rewrite", href: "/dashboard/rewrite", icon: "🔄", description: "Paraphrase text" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">Please sign in to access the dashboard</p>
                    <Link href="/login" className="text-purple-500 hover:text-purple-400">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const user = session.user as any;

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar */}
            <motion.aside
                className={`${sidebarOpen ? "w-64" : "w-20"} bg-background-secondary border-r border-border flex flex-col transition-all duration-300`}
                initial={false}
            >
                {/* Logo */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    {sidebarOpen && (
                        <Link href="/" className="font-display text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                            OxonAI
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                        {sidebarOpen ? "◀" : "▶"}
                    </button>
                </div>

                {/* Tools Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <p className={`text-xs text-foreground-secondary uppercase tracking-wider mb-4 ${!sidebarOpen && "hidden"}`}>
                        AI Tools
                    </p>
                    {tools.map((tool) => {
                        const isActive = pathname === tool.href;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-foreground"
                                    : "hover:bg-background-tertiary text-foreground-secondary hover:text-foreground"
                                    }`}
                            >
                                <span className="text-xl">{tool.icon}</span>
                                {sidebarOpen && (
                                    <div>
                                        <p className="font-medium">{tool.name}</p>
                                        <p className="text-xs opacity-70">{tool.description}</p>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-border">
                    {sidebarOpen ? (
                        <>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                    {user.name?.[0] || user.email?.[0] || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{user.name || "User"}</p>
                                    <p className="text-xs text-foreground-secondary truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-3">
                                <span className="text-foreground-secondary">Plan:</span>
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                    {user.plan || "FREE"}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href="/dashboard/settings"
                                    className="flex-1 px-3 py-2 text-sm text-center bg-background-tertiary hover:bg-border rounded-lg transition-colors"
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex-1 px-3 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Logout"
                        >
                            🚪
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
