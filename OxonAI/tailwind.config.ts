import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "rgb(var(--background) / <alpha-value>)",
                    secondary: "rgb(var(--background-secondary) / <alpha-value>)",
                    tertiary: "rgb(var(--background-tertiary) / <alpha-value>)",
                },
                foreground: {
                    DEFAULT: "rgb(var(--foreground) / <alpha-value>)",
                    secondary: "rgb(var(--foreground-secondary) / <alpha-value>)",
                    tertiary: "rgb(var(--foreground-tertiary) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "#7C3AED",
                    hover: "#8B5CF6",
                    dark: "#6D28D9",
                },
                border: {
                    DEFAULT: "rgb(var(--border) / <alpha-value>)",
                    light: "rgb(var(--border-light) / <alpha-value>)",
                },
                gradient: {
                    purple: "#7C3AED",
                    blue: "#3B82F6",
                    cyan: "#06B6D4",
                    indigo: "#6366F1",
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            backdropBlur: {
                xs: "2px",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-outfit)", "var(--font-inter)", "system-ui", "sans-serif"],
            },
            fontSize: {
                "display-lg": ["4.5rem", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
                "display-md": ["3.5rem", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
                "display-sm": ["2.5rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.01em" }],
                "heading-lg": ["2rem", { lineHeight: "1.3", fontWeight: "600" }],
                "heading-md": ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
                "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
                "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out",
                "slide-up": "slideUp 0.6s ease-out",
                "slide-up-delayed": "slideUp 0.8s ease-out 0.2s both",
                "scale-in": "scaleIn 0.4s ease-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
            spacing: {
                "section": "6rem",
                "section-mobile": "4rem",
            },
        },
    },
    plugins: [],
};

export default config;
