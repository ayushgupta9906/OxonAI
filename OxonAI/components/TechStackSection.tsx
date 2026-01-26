"use client";

import { motion } from "framer-motion";
import {
    Cpu, Globe, Layout, Database, Server, Cloud, Code, Smartphone
} from "lucide-react";

const techCategories = [
    {
        name: "AI Models & ML",
        icon: <Cpu className="w-6 h-6 text-purple-400" />,
        techs: ["GPT-4", "Gemini 1.5", "Llama 3", "Claude 3.5", "OpenAI API", "Hugging Face"]
    },
    {
        name: "Frontend",
        icon: <Layout className="w-6 h-6 text-blue-400" />,
        techs: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"]
    },
    {
        name: "Backend",
        icon: <Server className="w-6 h-6 text-emerald-400" />,
        techs: ["Node.js", "Python", "FastAPI", "Express", "Prisma", "Supabase"]
    },
    {
        name: "Deployment & Cloud",
        icon: <Cloud className="w-6 h-6 text-sky-400" />,
        techs: ["Vercel", "AWS", "Google Cloud", "Docker", "Kubernetes", "MongoDB Atlas"]
    }
];

export function TechStackSection() {
    return (
        <section className="py-24 bg-background-secondary border-y border-border/50">
            <div className="container mx-auto px-6">
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                        Technologies We Master
                    </h2>
                    <p className="text-lg text-foreground-secondary">
                        We leverage the most advanced and reliable technologies to build scalable, future-proof solutions.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {techCategories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            className="bg-background border border-border rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-foreground/5 rounded-lg">
                                    {category.icon}
                                </div>
                                <h3 className="font-semibold text-lg">{category.name}</h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {category.techs.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 bg-foreground/5 text-foreground-secondary text-sm rounded-full border border-border/50"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
