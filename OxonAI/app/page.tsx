import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Code, Download } from 'lucide-react';
import { ServicesSection } from '../components/ServicesSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ContactSection } from '../components/ContactSection';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
            {/* Hero Section */}
            <div className="container mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">OxonAI IDE - Coming Soon</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Build Projects with AI
                    </h1>

                    <p className="text-xl md:text-2xl text-foreground-secondary mb-12 leading-relaxed">
                        The future of coding is being built. In the meantime, let our expert team build your dream project.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="#services"
                            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            Explore Services
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                            className="px-8 py-4 bg-background-secondary border border-border text-foreground/50 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                            disabled
                        >
                            <Download className="w-5 h-5" />
                            IDE Beta (Soon)
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={<Zap className="w-8 h-8" />}
                        title="Autonomous Generation"
                        description="Describe your project in plain English. The AI plans, codes, and assembles everything automatically."
                    />
                    <FeatureCard
                        icon={<Code className="w-8 h-8" />}
                        title="Multi-Model Support"
                        description="Use GPT, Gemini, DeepSeek, or OpenRouter models. Choose the best AI for your needs."
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8" />}
                        title="Real-Time Streaming"
                        description="Watch the AI think, plan, and build your project in real-time with live progress updates."
                    />
                </div>
            </div>

            {/* Services Section */}
            <ServicesSection />

            {/* Past Projects / Portfolio Section */}
            <ProjectsSection />

            {/* Contact Section */}
            <ContactSection />

            {/* CTA Section */}
            <div className="container mx-auto px-6 pb-20">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Have a project in mind?</h2>
                    <p className="text-foreground-secondary mb-8">
                        Let&apos;s discuss how we can bring your software ideas to reality.
                    </p>
                    <Link
                        href="mailto:oxonaiagent@gmail.com"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                    >
                        <ArrowRight className="w-5 h-5" />
                        Get in Touch
                    </Link>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 bg-background-secondary border border-border rounded-xl hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-foreground-secondary">{description}</p>
        </div>
    );
}
