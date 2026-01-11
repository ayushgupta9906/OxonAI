'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [token, setToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const generateToken = () => {
        // For MVP, we'll use a simple token format: user_id:timestamp:signature
        const userId = (session?.user as any)?.id || 'demo';
        const timestamp = Date.now();
        const signature = btoa(`${userId}:${timestamp}`);
        const newToken = `oxon_${signature}`;
        setToken(newToken);
        setShowToken(true);
    };

    const copyToken = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const user = session.user as any;
    const plan = user?.plan || 'FREE';
    const credits = user?.credits || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, {user?.name || user?.email}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">Current Plan</h3>
                            <span className="text-2xl">💎</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">{plan}</p>
                        {plan === 'FREE' && (
                            <Link href="/pricing" className="text-purple-400 text-sm hover:text-purple-300">
                                Upgrade →
                            </Link>
                        )}
                    </motion.div>

                    <motion.div
                        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">Credits</h3>
                            <span className="text-2xl">⚡</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">{credits}</p>
                        <p className="text-gray-500 text-sm">Available for AI tools</p>
                    </motion.div>

                    <motion.div
                        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">Account Status</h3>
                            <span className="text-2xl">✓</span>
                        </div>
                        <p className="text-3xl font-bold text-green-400 mb-2">Active</p>
                        <p className="text-gray-500 text-sm">All systems operational</p>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Download IDE */}
                    <motion.div
                        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🚀</span>
                            <h2 className="text-2xl font-bold text-white">Download OxonAI IDE</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Get the powerful desktop IDE with AI-powered coding assistance, chat, and more.
                        </p>
                        <div className="space-y-3">
                            <a
                                href="/download?platform=windows"
                                className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg text-center transition"
                            >
                                Download for Windows
                            </a>
                            <a
                                href="/download?platform=mac"
                                className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg text-center transition"
                            >
                                Download for macOS
                            </a>
                            <a
                                href="/download?platform=linux"
                                className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg text-center transition"
                            >
                                Download for Linux
                            </a>
                        </div>
                    </motion.div>

                    {/* IDE Access Token */}
                    <motion.div
                        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🔑</span>
                            <h2 className="text-2xl font-bold text-white">IDE Access Token</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Generate a token to sync your account with the OxonAI IDE and unlock your plan features.
                        </p>

                        {!showToken ? (
                            <button
                                onClick={generateToken}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition"
                            >
                                Generate Access Token
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                                    <p className="text-gray-400 text-sm mb-2">Your Access Token:</p>
                                    <code className="text-purple-400 text-sm break-all">{token}</code>
                                </div>
                                <button
                                    onClick={copyToken}
                                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <span>✓</span>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <span>📋</span>
                                            Copy Token
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-gray-500">
                                    Paste this token in the IDE Settings → Account section to sync your plan and features.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Quick Links */}
                <motion.div
                    className="mt-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/dashboard/chat" className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition">
                            <span className="text-2xl mb-2 block">💬</span>
                            <p className="text-white font-medium">Chat</p>
                        </Link>
                        <Link href="/dashboard/code" className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition">
                            <span className="text-2xl mb-2 block">👨‍💻</span>
                            <p className="text-white font-medium">Code</p>
                        </Link>
                        <Link href="/dashboard/idea" className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition">
                            <span className="text-2xl mb-2 block">💡</span>
                            <p className="text-white font-medium">Ideas</p>
                        </Link>
                        <Link href="/pricing" className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-center transition">
                            <span className="text-2xl mb-2 block">💳</span>
                            <p className="text-white font-medium">Pricing</p>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
