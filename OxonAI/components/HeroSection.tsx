"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "./Button";

export default function HeroSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const handleRequestAccess = () => {
        // Placeholder for Request Access action
        console.log("Request Access clicked");
    };

    const handleExploreCapabilities = () => {
        // Scroll to capabilities section
        document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="hero"
            className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 relative overflow-hidden pt-20"
        >
            <motion.div
                className="max-w-5xl mx-auto text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Glassmorphism backdrop - dark mode */}
                <div className="absolute inset-0 -m-8 md:-m-16 bg-background-secondary/60 backdrop-blur-xl rounded-3xl border border-border shadow-2xl -z-10" />

                {/* Main Headline */}
                <motion.h1
                    className="font-display text-display-md md:text-display-lg text-balance mb-6 bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
                    variants={itemVariants}
                >
                    Build once. Output everywhere.
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    className="text-body-lg md:text-heading-md text-foreground-secondary text-balance max-w-3xl mx-auto mb-12"
                    variants={itemVariants}
                >
                    OxonAI turns instructions, data, and intent into real deliverables —
                    documents, dashboards, applications, and media.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    variants={itemVariants}
                >
                    <Link href="/register">
                        <Button variant="primary">
                            Get Started Free
                        </Button>
                    </Link>
                    <Button variant="secondary" onClick={handleExploreCapabilities}>
                        Explore Capabilities
                    </Button>
                </motion.div>
            </motion.div>

            {/* Subtle background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-background-secondary opacity-60" />
        </section>
    );
}
