import { useState, useEffect } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const checkMaximized = async () => {
            if (window.electronAPI?.isMaximized) {
                const max = await window.electronAPI.isMaximized();
                setIsMaximized(max);
            }
        };
        checkMaximized();

        // Listen for window state changes
        const interval = setInterval(checkMaximized, 500);
        return () => clearInterval(interval);
    }, []);

    const handleMinimize = () => window.electronAPI?.minimize();
    const handleMaximize = () => {
        window.electronAPI?.maximize();
        setIsMaximized(!isMaximized);
    };
    const handleClose = () => window.electronAPI?.close();

    return (
        <div className="h-10 bg-[#0f0f12] border-b border-[#1a1a1f] flex items-center justify-between select-none" style={{ WebkitAppRegion: 'drag' } as any}>
            {/* Left - Logo and title */}
            <div className="flex items-center gap-3 px-4">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">O</span>
                </div>
                <span className="text-xs text-[#71717a] font-medium tracking-wide">OxonAI IDE</span>
            </div>

            {/* Right - Window controls */}
            <div className="flex items-center h-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button
                    onClick={handleMinimize}
                    className="w-12 h-full flex items-center justify-center hover:bg-[#27272a] transition-colors"
                >
                    <Minus size={14} className="text-[#71717a]" />
                </button>
                <button
                    onClick={handleMaximize}
                    className="w-12 h-full flex items-center justify-center hover:bg-[#27272a] transition-colors"
                >
                    {isMaximized ? (
                        <Square size={11} className="text-[#71717a]" />
                    ) : (
                        <Maximize2 size={12} className="text-[#71717a]" />
                    )}
                </button>
                <button
                    onClick={handleClose}
                    className="w-12 h-full flex items-center justify-center hover:bg-red-600 transition-colors group"
                >
                    <X size={14} className="text-[#71717a] group-hover:text-white" />
                </button>
            </div>
        </div>
    );
}
