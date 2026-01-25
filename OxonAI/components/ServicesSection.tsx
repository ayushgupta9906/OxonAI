"use client";

import { Code, Smartphone, Globe, ArrowRight, Database, Layout, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function ServicesSection() {
    const services = [
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Web Development",
            description: "Custom websites tailored to your brand. From landing pages to complex web applications, we build fast, responsive, and SEO-friendly sites.",
            features: ['Next.js & React', 'E-commerce', 'Interactive UI']
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: "Mobile App Development",
            description: "Native and cross-platform mobile applications that provide seamless user experiences on iOS and Android devices.",
            features: ['React Native', 'iOS & Android', 'Performance Optimization']
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Custom Software",
            description: "Tailor-made software solutions to automate your business processes and solve complex problems efficiently.",
            features: ['Backend Systems', 'API Integration', 'Cloud Solutions']
        },
        {
            icon: <Layout className="w-8 h-8" />,
            title: "UI/UX Design",
            description: "User-centric design that combines aesthetics with functionality. We create intuitive interfaces that users love.",
            features: ['Prototyping', 'Design Systems', 'User Research']
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: "Backend Architecture",
            description: "Robust and scalable server-side solutions. We ensure your data is secure, accessible, and handled efficiently.",
            features: ['Database Design', 'Microservices', 'API Development']
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "AI Integration",
            description: "Leverage the power of AI in your business. We integrate LLMs and machine learning models into your applications.",
            features: ['Chatbots', 'Predictive Analysis', 'Automation']
        }
    ];

    return (
        <section id="services" className="container mx-auto px-6 py-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

            <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                >
                    Software Development Services
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-foreground-secondary leading-relaxed"
                >
                    Beyond our AI tools, we offer professional development services to bring your unique ideas to life.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {services.map((service, index) => (
                    <ServiceCard key={index} {...service} index={index} />
                ))}
            </div>
        </section>
    );
}

function ServiceCard({ icon, title, description, features, index }: { icon: React.ReactNode; title: string; description: string; features: string[], index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-8 bg-background-secondary/50 border border-border backdrop-blur-sm rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
        >
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-foreground-secondary mb-8 leading-relaxed">
                {description}
            </p>
            <ul className="space-y-3">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {feature}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
