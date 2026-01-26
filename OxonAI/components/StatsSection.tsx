"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "Projects Delivered", value: "50+", suffix: "" },
    { label: "Client Satisfaction", value: "98", suffix: "%" },
    { label: "Development Speed", value: "10", suffix: "x" },
    { label: "Agent Availability", value: "24/7", suffix: "" }
];

export function StatsSection() {
    return (
        <section className="py-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-y border-border/50">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2 font-mono">
                                {stat.value}<span className="text-purple-400">{stat.suffix}</span>
                            </div>
                            <div className="text-sm md:text-base text-foreground-secondary font-medium tracking-wide uppercase">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
