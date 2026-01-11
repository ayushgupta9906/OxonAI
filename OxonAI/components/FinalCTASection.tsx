"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Button from "./Button";

export default function FinalCTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const handleGetAccess = () => {
        // Placeholder for Get Early Access action
        console.log("Get Early Access clicked");
    };

    return (
        <section
            id="final-cta"
            ref={ref}
            className="py-section-mobile md:py-section px-6 md:px-12 lg:px-24 relative overflow-hidden"
        >
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
                        Ready to transform your workflow?
                    </h2>
                    <p className="text-heading-md text-foreground-secondary mb-12 max-w-2xl mx-auto">
                        Join forward-thinking teams using OxonAI to execute faster and deliver better.
                    </p>
                    <Button variant="primary" onClick={handleGetAccess}>
                        Get Started Today
                    </Button>
                </motion.div>
            </div>
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/50 via-transparent to-transparent -z-0" />
        </section>
    );
}
