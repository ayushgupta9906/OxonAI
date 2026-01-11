"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const useCases = [
    {
        title: "Business Intelligence",
        description: "Transform data into actionable insights and reports",
    },
    {
        title: "Product Teams",
        description: "Accelerate prototyping and documentation workflows",
    },
    {
        title: "Developers",
        description: "Generate code, APIs, and technical documentation",
    },
    {
        title: "Founders",
        description: "Build MVPs and deliver faster with AI execution",
    },
];

export default function UseCaseSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <section
            id="use-cases"
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
                        Built for teams that execute
                    </h2>
                    <p className="text-body-lg text-foreground-secondary max-w-2xl mx-auto">
                        From enterprises to startups, OxonAI adapts to your workflow
                    </p>
                </motion.div>

                {/* Use Cases Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={useCase.title}
                            className="group relative bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-8 hover:shadow-2xl hover:border-border-light hover:bg-background-tertiary transition-all duration-300 overflow-hidden"
                            variants={itemVariants}
                            whileHover={{
                                y: -2,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeOut",
                                },
                            }}
                        >
                            {/* Gradient border effect on hover */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-gradient-purple/10 via-gradient-blue/10 to-gradient-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"
                                style={{
                                    background: index % 2 === 0
                                        ? "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))"
                                        : "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))"
                                }}
                            />

                            <h3 className="font-display text-heading-lg mb-3 group-hover:text-accent transition-colors duration-300 relative z-10">
                                {useCase.title}
                            </h3>
                            <p className="text-body-md text-foreground-secondary relative z-10">
                                {useCase.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
