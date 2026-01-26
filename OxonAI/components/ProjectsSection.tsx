"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Database, ShoppingBag, Cpu } from "lucide-react";
import Link from "next/link";

const projects = [
    {
        id: "oxon-ai",
        title: "Oxon AI",
        category: "AI Tooling",
        description: "An AI-native IDE that autonomously plans, codes, and assembles full-stack applications.",
        icon: <Cpu className="w-6 h-6" />,
        color: "from-purple-500 to-blue-500",
        link: "https://oxonai.tech"
    },
    {
        id: "bosdb",
        title: "BosDB",
        category: "Database Infrastructure",
        description: "High-performance, scalable database architecture designed for next-gen data heavy applications.",
        icon: <Database className="w-6 h-6" />,
        color: "from-emerald-400 to-cyan-500",
        link: "https://bosdb.tech"
    },
    {
        id: "laserx",
        title: "LaserX Clothing",
        category: "E-Commerce",
        description: "A premium digital fashion experience combining modern aesthetics with high-speed performance.",
        icon: <ShoppingBag className="w-6 h-6" />,
        color: "from-pink-500 to-rose-500",
        link: "https://laserxclothingstore.vercel.app/"
    }
];

export function ProjectsSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden" id="projects">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6">
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        Our Portfolio
                    </h2>
                    <p className="text-lg text-foreground-secondary">
                        We don&apos;t just build software; we engineer success. Check out some of the impactful projects we&apos;ve delivered.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            className="group relative bg-background-secondary border border-border rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                                {project.icon}
                            </div>

                            <div className="mb-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary/70 bg-foreground/5 px-3 py-1 rounded-full">
                                    {project.category}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all">
                                {project.title}
                            </h3>

                            <p className="text-foreground-secondary mb-6 leading-relaxed">
                                {project.description}
                            </p>

                            <Link
                                href={project.link}
                                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"
                            >
                                View Case Study <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
