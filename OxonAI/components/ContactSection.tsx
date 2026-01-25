import { Mail, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ContactSection() {
    return (
        <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-background-secondary to-background border border-border rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="p-12 md:p-16 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Ready to start your project?</h2>
                    <p className="text-xl text-foreground-secondary mb-10 max-w-2xl mx-auto">
                        Whether you need a new website, a mobile app, or a custom software solution, we&apos;re here to help you build it.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="mailto:oxonaiagent@gmail.com"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            Email Us
                        </a>
                        <Link
                            href="https://wa.me/919410430095"
                            target="_blank"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Chat on WhatsApp
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-foreground-secondary/70">
                        We typically respond within 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}
