"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function PhilosophySection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="philosophy"
            ref={ref}
            className="py-section-mobile md:py-section px-6 md:px-12 lg:px-24 bg-gradient-to-br from-background-secondary/50 via-background-tertiary/30 to-background-secondary relative overflow-hidden"
        >
            {/* Decorative elements */}
            <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-gradient-to-r from-violet-600/8 via-transparent to-transparent blur-3xl -z-0" />
            <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-l from-indigo-600/8 via-transparent to-transparent blur-3xl -z-0" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                    <h2 className="font-display text-display-md md:text-display-lg text-balance mb-8">
                        Not a tool. A system.
                    </h2>
                    <p className="text-heading-md md:text-heading-lg text-foreground-secondary text-balance max-w-2xl mx-auto">
                        OxonAI is built to execute, structure, and deliver — not just respond.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
