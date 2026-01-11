"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        number: "01",
        title: "Input",
        description: "Text, data, instructions",
    },
    {
        number: "02",
        title: "Reasoning",
        description: "System understands structure, intent, and context",
    },
    {
        number: "03",
        title: "Output",
        description: "Professional-grade deliverables",
    },
];

export default function SystemFlowSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const lineVariants = {
        hidden: { scaleX: 0 },
        visible: {
            scaleX: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <section
            id="system-flow"
            ref={ref}
            className="py-section-mobile md:py-section px-6 md:px-12 lg:px-24 bg-gradient-to-br from-background-secondary via-background-tertiary/50 to-background-secondary relative overflow-hidden"
        >
            {/* Decorative gradient accent */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-purple-600/10 via-transparent to-transparent blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent blur-3xl -z-0" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Section Title */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-display text-display-sm md:text-display-md mb-4">
                        How it works
                    </h2>
                    <p className="text-body-lg text-foreground-secondary max-w-2xl mx-auto">
                        A seamless flow from instruction to execution
                    </p>
                </motion.div>

                {/* Flow Steps */}
                <motion.div
                    className="relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative">
                            <motion.div
                                className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 mb-12 md:mb-16"
                                variants={itemVariants}
                            >
                                {/* Step Number */}
                                <div className="flex-shrink-0">
                                    <span className="font-display text-6xl md:text-7xl font-bold text-foreground/10">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Step Content */}
                                <div className="flex-grow">
                                    <h3 className="font-display text-heading-lg md:text-display-sm mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-body-lg text-foreground-secondary">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Connecting Line (except for last item) */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    className="h-px bg-gradient-to-r from-foreground/20 via-foreground/40 to-foreground/20 mb-12 md:mb-16 origin-left"
                                    variants={lineVariants}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
