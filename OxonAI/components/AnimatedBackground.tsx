"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
    // Generate random particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
    }));

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
            {/* Large animated gradient orbs - darker for dark mode */}
            <motion.div
                className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl"
                animate={{
                    x: [0, 150, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-1/4 -right-1/4 w-[700px] h-[700px] bg-gradient-to-bl from-cyan-600/20 via-blue-600/15 to-transparent rounded-full blur-3xl"
                animate={{
                    x: [0, -120, 0],
                    y: [0, 150, 0],
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute -bottom-1/4 left-1/3 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/18 via-purple-600/12 to-transparent rounded-full blur-3xl"
                animate={{
                    x: [0, -80, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.25, 1],
                    rotate: [0, 120, 0],
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Additional smaller orbs for depth */}
            <motion.div
                className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-pink-600/15 via-rose-600/10 to-transparent rounded-full blur-2xl"
                animate={{
                    x: [0, 60, 0],
                    y: [0, -80, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-gradient-to-tl from-teal-600/15 via-cyan-600/12 to-transparent rounded-full blur-2xl"
                animate={{
                    x: [0, -70, 0],
                    y: [0, 90, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 23,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Floating particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-gradient-to-br from-purple-400/30 to-blue-400/30"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 15, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                />
            ))}

            {/* Mesh gradient overlay */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
          `,
                }}
            />

            {/* Refined grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Noise texture for depth */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                }}
            />
        </div>
    );
}
