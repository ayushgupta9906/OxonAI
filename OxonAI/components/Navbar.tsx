"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const [activeLink, setActiveLink] = useState("home");
    const { data: session } = useSession();

    const navLinks = [
        { id: "home", label: "Home", href: "/" },
        { id: "capabilities", label: "Capabilities", href: "/#capabilities" },
        { id: "how-it-works", label: "How It Works", href: "/#system-flow" },
        { id: "use-cases", label: "Use Cases", href: "/#use-cases" },
        { id: "about", label: "About", href: "/#philosophy" },
    ];

    const handleScroll = (href: string, id: string) => {
        setActiveLink(id);
        if (href.startsWith("/#")) {
            const element = document.querySelector(href.substring(1));
            element?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/">
                        <motion.div
                            className="cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Logo />
                        </motion.div>
                    </Link>

                    {/* Navigation Links - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <motion.a
                                key={link.id}
                                href={link.href}
                                className={`text-sm font-medium transition-colors duration-200 ${activeLink === link.id
                                    ? "text-foreground"
                                    : "text-foreground-secondary hover:text-foreground"
                                    }`}
                                onClick={(e) => {
                                    if (link.href.startsWith("/#")) {
                                        e.preventDefault();
                                        handleScroll(link.href, link.id);
                                    }
                                }}
                                whileHover={{ y: -1 }}
                            >
                                {link.label}
                                {activeLink === link.id && (
                                    <motion.div
                                        className="h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 mt-1"
                                        layoutId="activeTab"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.a>
                        ))}
                    </div>

                    {/* Right Side - Theme Toggle + CTA */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {session ? (
                            // Authenticated user menu
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="hidden sm:block text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-full transition-all duration-200">
                                        {session.user?.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                className="w-6 h-6 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                {session.user?.name?.charAt(0) || "U"}
                                            </div>
                                        )}
                                        <span className="hidden sm:block text-sm font-medium">
                                            {session.user?.name || "Account"}
                                        </span>
                                    </button>
                                    {/* Dropdown menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm hover:bg-foreground/10 rounded-t-lg"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/pricing"
                                            className="block px-4 py-2 text-sm hover:bg-foreground/10"
                                        >
                                            Pricing
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-foreground/10 rounded-b-lg text-red-500"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Guest user buttons
                            <>
                                <div className="hidden sm:flex items-center gap-4">
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full transition-all duration-200 text-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </div>

                                <motion.a
                                    href="/pricing"
                                    className="hidden lg:block px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get Started
                                </motion.a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
