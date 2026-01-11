"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionData {
    plan: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    customerId: string;
}

export default function BillingDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [portalLoading, setPortalLoading] = useState(false);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);

    useEffect(() => {
        // Fetch user's subscription data from your backend
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const response = await fetch("/api/subscription");
            const data = await response.json();

            if (data.subscription) {
                setSubscription(data.subscription);
            }
        } catch (error) {
            console.error("Error fetching subscription:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        setPortalLoading(true);

        try {
            const response = await fetch("/api/create-portal-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: subscription?.customerId,
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert(`Error: ${data.error}`);
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Portal error:", error);
            alert("Error opening billing portal. Please try again.");
        } finally {
            setPortalLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-foreground-secondary">Loading subscription data...</p>
                </div>
            </main>
        );
    }

    if (!subscription) {
        return (
            <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-12"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h1 className="font-display text-display-sm mb-4">No Active Subscription</h1>
                        <p className="text-foreground-secondary mb-8">
                            You don't have an active subscription yet. Choose a plan to get started with OxonAI.
                        </p>
                        <button
                            onClick={() => router.push("/pricing")}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full font-medium transition-all duration-200 shadow-lg"
                        >
                            View Pricing Plans
                        </button>
                    </motion.div>
                </div>
            </main>
        );
    }

    const getPlanDetails = (planName: string) => {
        const plans: Record<string, any> = {
            "Oxon Seed": { price: "₹299", priceUsd: "$3.6", credits: 1500 },
            "Oxon Edge": { price: "₹499", priceUsd: "$6", credits: 4000 },
            "Oxon Quantum": { price: "₹999", priceUsd: "$12", credits: 8000 },
        };
        return plans[planName] || { price: "N/A", priceUsd: "N/A", credits: 0 };
    };

    const planDetails = getPlanDetails(subscription.plan);

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="font-display text-display-md mb-2">Billing & Subscription</h1>
                    <p className="text-foreground-secondary">Manage your plan and payment methods</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Current Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-8"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="font-display text-heading-lg mb-1">Current Plan</h2>
                                <p className="text-sm text-foreground-secondary">
                                    Managed through Stripe
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.status === "active"
                                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                                    : "bg-yellow-500/10 text-yellow-500"
                                }`}>
                                {subscription.status}
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-display text-3xl mb-2">{subscription.plan}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold">{planDetails.price}</span>
                                <span className="text-foreground-secondary">/month</span>
                                <span className="text-sm text-foreground-tertiary">({planDetails.priceUsd} USD)</span>
                            </div>
                        </div>

                        <div className="bg-background-tertiary border border-border rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-foreground-secondary">Plan Credits</span>
                                <span className="text-sm font-medium">{planDetails.credits.toLocaleString()} credits/month</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm mb-6 pb-6 border-b border-border">
                            <span className="text-foreground-secondary">Current period ends</span>
                            <span className="font-medium">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                        </div>

                        {subscription.cancelAtPeriodEnd && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                                <p className="text-yellow-500 text-sm">
                                    ⚠️ Your subscription will cancel at the end of the current period
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleManageSubscription}
                                disabled={portalLoading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {portalLoading ? "Loading..." : "Manage Subscription"}
                            </button>
                            <button
                                onClick={() => router.push("/pricing")}
                                className="flex-1 px-6 py-3 bg-background-tertiary hover:bg-border text-foreground rounded-full font-medium transition-all duration-200 border border-border"
                            >
                                Change Plan
                            </button>
                        </div>

                        <p className="text-xs text-foreground-tertiary mt-4 text-center">
                            Manage your payment methods, view invoices, and update billing details in the Stripe portal
                        </p>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-6">
                            <h3 className="text-foreground-secondary text-sm mb-2">Quick Actions</h3>
                            <div className="space-y-3 mt-4">
                                <button
                                    onClick={handleManageSubscription}
                                    className="w-full text-left px-4 py-3 bg-background-tertiary hover:bg-border rounded-xl transition-colors border border-border"
                                >
                                    <p className="font-medium text-sm">Update Payment Method</p>
                                    <p className="text-xs text-foreground-secondary">Change your card details</p>
                                </button>
                                <button
                                    onClick={handleManageSubscription}
                                    className="w-full text-left px-4 py-3 bg-background-tertiary hover:bg-border rounded-xl transition-colors border border-border"
                                >
                                    <p className="font-medium text-sm">View Invoices</p>
                                    <p className="text-xs text-foreground-secondary">Download past receipts</p>
                                </button>
                                <button
                                    onClick={() => router.push("/download")}
                                    className="w-full text-left px-4 py-3 bg-background-tertiary hover:bg-border rounded-xl transition-colors border border-border"
                                >
                                    <p className="font-medium text-sm">Download IDE</p>
                                    <p className="text-xs text-foreground-secondary">Get OxonAI IDE installer</p>
                                </button>
                            </div>
                        </div>

                        <div className="bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-6">
                            <h3 className="text-foreground-secondary text-sm mb-2">Need Help?</h3>
                            <p className="text-sm mb-4">Contact our support team for assistance</p>
                            <button className="w-full px-4 py-2 bg-background-tertiary hover:bg-border rounded-lg transition-colors border border-border text-sm">
                                Contact Support
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
