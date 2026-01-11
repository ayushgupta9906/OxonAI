"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function VisualShowcaseSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const showcaseItems = [
        {
            title: "Intelligent Processing",
            description: "Neural networks that understand context and intent",
            gradient: "from-violet-500/10 to-purple-500/10",
        },
        {
            title: "Seamless Transformation",
            description: "Convert any input into structured outputs",
            gradient: "from-blue-500/10 to-cyan-500/10",
        },
        {
            title: "Enterprise Scale",
            description: "Built for teams that need reliability",
            gradient: "from-indigo-500/10 to-blue-500/10",
        },
    ];

    return (
        <section
            id="visual-showcase"
            ref={ref}
            className="py-section-mobile md:py-section px-6 md:px-12 lg:px-24 relative overflow-hidden"
        >
            {/* Decorative gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-600/10 via-blue-600/10 to-cyan-600/10 rounded-full blur-3xl -z-0" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Title */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-display text-display-sm md:text-display-md mb-4">
                        Intelligence meets execution
                    </h2>
                    <p className="text-body-lg text-foreground-secondary max-w-2xl mx-auto">
                        Advanced AI infrastructure designed for real-world delivery
                    </p>
                </motion.div>

                {/* Showcase Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {showcaseItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            className="group relative"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            {/* Card */}
                            <div className="relative bg-background-secondary/80 backdrop-blur-sm border border-border rounded-2xl p-8 hover:shadow-2xl hover:border-border-light transition-all duration-300 overflow-hidden">
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0`} />

                                {/* Icon placeholder */}
                                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-violet-600/20 to-blue-600/20 rounded-xl flex items-center justify-center relative z-10">
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg" />
                                </div>

                                <h3 className="font-display text-heading-lg mb-3 relative z-10">
                                    {item.title}
                                </h3>
                                <p className="text-body-md text-foreground-secondary relative z-10">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
