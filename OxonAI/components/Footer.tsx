"use client";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-border">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright */}
                    <div className="text-foreground-tertiary text-sm">
                        © {currentYear} OxonAI
                    </div>

                    {/* Footer Links */}
                    <nav className="flex gap-8">
                        <a
                            href="#"
                            className="text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200"
                        >
                            Contact
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
