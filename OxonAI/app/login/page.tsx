"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center px-6 py-24 text-white">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </main>
        }>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const authError = searchParams.get("error");

    useEffect(() => {
        if (authError === "OAuthSignin") {
            setError("Google sign in failed. Please try again or use email/password.");
        } else if (authError) {
            setError(`Authentication error: ${authError}`);
        }
    }, [authError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push(callbackUrl);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await signIn("google", { callbackUrl });
        } catch (err) {
            setError("Google sign in failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-24 text-white">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-400">
                        Sign in to continue to OxonAI
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <motion.div
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-700"></div>
                        <span className="px-4 text-gray-500 text-sm">or</span>
                        <div className="flex-1 border-t border-gray-700"></div>
                    </div>

                    {/* Google Sign In */}
                    <motion.button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white font-medium rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </motion.button>

                    {/* Register Link */}
                    <p className="text-center text-foreground-secondary mt-6">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-purple-500 hover:text-purple-400 font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
