"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const router = useRouter();

    const handleCheckout = async (plan: any) => {
        try {
            const priceId = plan.stripePriceId?.[billingCycle];

            if (!priceId) {
                alert("This plan is not configured yet. Please contact support or try another plan.");
                return;
            }

            // Create Stripe Checkout Session
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId,
                    planName: plan.name,
                    billingCycle
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert(`Error: ${data.error}\n\nPlease make sure Stripe is configured in your environment variables.`);
                return;
            }

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Error initiating checkout. Please ensure Stripe is properly configured.");
        }
    };

    const plans = [
        {
            name: "Oxon Seed",
            description: "Start building with zero cost. Start using for free.",
            price: {
                monthly: { inr: 299, usd: 3.6 },
                yearly: { inr: 2999, usd: 36 }
            },
            stripePriceId: {
                monthly: process.env.NEXT_PUBLIC_STRIPE_SEED_MONTHLY_PRICE_ID,
                yearly: process.env.NEXT_PUBLIC_STRIPE_SEED_YEARLY_PRICE_ID,
            },
            features: [
                "1,500 credits/month",
                "Adaptive Intelligence Memory",
                "Research and Report",
                "File Creation",
                "Basic Support",
            ],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Oxon Edge",
            description: "Power your workflow with enhanced capabilities.",
            price: {
                monthly: { inr: 499, usd: 6 },
                yearly: { inr: 4999, usd: 60 }
            },
            stripePriceId: {
                monthly: process.env.NEXT_PUBLIC_STRIPE_EDGE_MONTHLY_PRICE_ID,
                yearly: process.env.NEXT_PUBLIC_STRIPE_EDGE_YEARLY_PRICE_ID,
            },
            features: [
                "4,000 credits/month",
                "99+ Integrations",
                "Personalisation",
                "AIM (Contextual Knowledge Base)",
                "Priority Support",
                "Everything in Seed",
            ],
            cta: "Upgrade to Edge",
            popular: true,
        },
        {
            name: "Oxon Quantum",
            description: "Maximum power for serious builders.",
            price: {
                monthly: { inr: 999, usd: 12 },
                yearly: { inr: 9999, usd: 120 }
            },
            stripePriceId: {
                monthly: process.env.NEXT_PUBLIC_STRIPE_QUANTUM_MONTHLY_PRICE_ID,
                yearly: process.env.NEXT_PUBLIC_STRIPE_QUANTUM_YEARLY_PRICE_ID,
            },
            features: [
                "8,000 credits/month",
                "Everything in Edge",
                "More AIM Storage",
                "Advanced Analytics",
                "Dedicated Support",
                "Custom Integrations",
            ],
            cta: "Upgrade to Quantum",
            popular: false,
        },
    ];


    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-display text-display-md md:text-display-lg mb-6">
                        Choose Your Plan
                    </h1>
                    <p className="text-body-lg text-foreground-secondary max-w-2xl mx-auto mb-12">
                        Select the perfect plan for your needs. Upgrade or downgrade anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 bg-background-secondary rounded-full p-1.5">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${billingCycle === "monthly"
                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                                : "text-foreground-secondary hover:text-foreground"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${billingCycle === "yearly"
                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                                : "text-foreground-secondary hover:text-foreground"
                                }`}
                        >
                            Yearly
                            <span className="ml-2 text-xs text-white/80">
                                Save 17%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            className={`relative bg-background-secondary/80 backdrop-blur-sm border rounded-2xl p-8 ${plan.popular
                                ? "border-purple-600 shadow-2xl scale-105"
                                : "border-border hover:border-border-light"
                                } transition-all duration-300`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className="font-display text-heading-lg mb-2">{plan.name}</h3>
                                <p className="text-foreground-secondary text-sm">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">
                                        ₹{billingCycle === "monthly" ? plan.price.monthly.inr : plan.price.yearly.inr}
                                    </span>
                                    <span className="text-foreground-secondary">
                                        /{billingCycle === "monthly" ? "mo" : "yr"}
                                    </span>
                                </div>
                                {plan.price[billingCycle].inr > 0 && (
                                    <p className="text-sm text-foreground-secondary mt-2">
                                        Billed {billingCycle === "yearly" ? `₹${plan.price.yearly.inr} annually` : "monthly"}
                                        <span className="block text-xs mt-1">
                                            Payment processed in USD (${plan.price[billingCycle].usd})
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                onClick={() => handleCheckout(plan)}
                                className={`w-full py-3 rounded-full font-medium mb-8 transition-all duration-200 ${plan.popular
                                    ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg"
                                    : "bg-background-tertiary hover:bg-border text-foreground border border-border"
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {plan.cta}
                            </motion.button>

                            {/* Features */}
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-foreground-secondary mb-4">Includes:</p>
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-foreground-secondary">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Back to Home */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        onClick={() => router.push("/")}
                        className="text-foreground-secondary hover:text-foreground transition-colors"
                    >
                        ← Back to Home
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
