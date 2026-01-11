"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const capabilities = [
    { name: "Reports", icon: "📊" },
    { name: "PDF", icon: "📄" },
    { name: "CSV", icon: "📈" },
    { name: "Dashboards", icon: "📉" },
    { name: "Website", icon: "🌐" },
    { name: "Research", icon: "🔍" },
    { name: "Web App", icon: "💻" },
    { name: "Image", icon: "🖼️" },
    { name: "Video", icon: "🎬" },
    { name: "Voice", icon: "🎙️" },
];

export default function CapabilitiesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <section
            id="capabilities"
            ref={ref}
            className="py-section-mobile md:py-section px-6 md:px-12 lg:px-24"
        >
            <div className="max-w-6xl mx-auto">
                {/* Section Title */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-display text-display-sm md:text-display-md mb-4">
                        Capabilities
                    </h2>
                    <p className="text-body-lg text-foreground-secondary max-w-2xl mx-auto">
                        Transform your inputs into professional-grade outputs across multiple formats.
                    </p>
                </motion.div>

                {/* Capabilities Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {capabilities.map((capability) => (
                        <motion.div
                            key={capability.name}
                            className="group relative bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-8 text-center hover:shadow-2xl hover:border-border-light hover:bg-background-tertiary transition-all duration-300 cursor-default overflow-hidden"
                            variants={itemVariants}
                            whileHover={{
                                y: -4,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeOut",
                                },
                            }}
                        >
                            {/* Gradient accent on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gradient-purple/5 via-gradient-blue/5 to-gradient-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />

                            {/* Icon */}
                            <div className="text-5xl mb-4 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 relative z-10">
                                {capability.icon}
                            </div>

                            {/* Name */}
                            <h3 className="font-medium text-foreground relative z-10">
                                {capability.name}
                            </h3>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
