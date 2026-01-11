import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';
type AccentColor = 'purple' | 'blue' | 'green' | 'pink' | 'orange';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
    resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [accentColor, setAccentColor] = useState<AccentColor>('purple');
    const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        // Load from storage
        const savedTheme = localStorage.getItem('oxonai-theme') as Theme || 'dark';
        const savedAccent = localStorage.getItem('oxonai-accent') as AccentColor || 'purple';
        setTheme(savedTheme);
        setAccentColor(savedAccent);
    }, []);

    useEffect(() => {
        localStorage.setItem('oxonai-theme', theme);

        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setResolvedTheme(isDark ? 'dark' : 'light');
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('oxonai-accent', accentColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }, [accentColor]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}
