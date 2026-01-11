/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: '#0a0a0f',
                    secondary: '#12121a',
                    tertiary: '#1a1a25',
                },
                border: {
                    DEFAULT: '#2a2a3a',
                    light: '#3a3a4a',
                },
                foreground: {
                    DEFAULT: '#ffffff',
                    secondary: '#a0a0b0',
                },
                accent: {
                    purple: '#a855f7',
                    blue: '#3b82f6',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
};
