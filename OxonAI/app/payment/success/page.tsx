"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const isDemo = searchParams.get("demo") === "true";
    const planName = searchParams.get("plan");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isDemo) {
            // Demo mode - skip verification
            setLoading(false);
            return;
        }

        // Verify payment with backend
        if (sessionId) {
            fetch(`/api/verify-payment?session_id=${sessionId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("Payment verified:", data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Verification error:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [sessionId, isDemo]);

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 flex items-center justify-center">
            <motion.div
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-12">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-foreground-secondary">Verifying payment...</p>
                        </div>
                    ) : (
                        <>
                            {/* Success Icon */}
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                            >
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>

                            <h1 className="font-display text-display-sm mb-4">
                                {isDemo ? "Demo Subscription Confirmed!" : "Payment Successful!"}
                            </h1>
                            <p className="text-body-lg text-foreground-secondary mb-2">
                                {isDemo
                                    ? `You've selected ${planName || "a plan"}.`
                                    : "Thank you for subscribing to OxonAI. Your account has been upgraded."
                                }
                            </p>
                            {isDemo && (
                                <p className="text-sm text-foreground-tertiary mb-8">
                                    <strong>Demo Mode:</strong> No actual payment was processed. Configure Stripe keys in .env.local to enable real payments.
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                <motion.button
                                    onClick={() => router.push(isDemo ? "/dashboard" : "/download")}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full font-medium transition-all duration-200 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isDemo ? "Go to Dashboard" : "Download OxonAI IDE"}
                                </motion.button>
                                <motion.button
                                    onClick={() => router.push("/")}
                                    className="px-8 py-3 bg-background-tertiary hover:bg-border text-foreground rounded-full font-medium transition-all duration-200 border border-border"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Back to Home
                                </motion.button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
