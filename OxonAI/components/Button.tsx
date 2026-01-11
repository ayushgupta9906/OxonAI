"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
    variant?: "primary" | "secondary";
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function Button({
    variant = "primary",
    children,
    className = "",
    onClick,
    disabled,
}: ButtonProps) {
    const baseStyles =
        "px-8 py-4 rounded-full font-medium text-body-md transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl relative overflow-hidden group",
        secondary:
            "bg-transparent text-foreground border-2 border-border hover:border-border-light hover:bg-background-secondary focus:ring-border",
    };

    return (
        <motion.button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
            }}
        >
            {variant === "primary" && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}
