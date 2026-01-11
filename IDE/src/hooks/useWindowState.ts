import { useEffect, useState, useCallback } from 'react';

interface WindowState {
    isMaximized: boolean;
    isFocused: boolean;
}

export function useWindowState() {
    const [windowState, setWindowState] = useState<WindowState>({
        isMaximized: false,
        isFocused: true,
    });

    useEffect(() => {
        const checkMaximized = async () => {
            if (window.electronAPI?.isMaximized) {
                const isMax = await window.electronAPI.isMaximized();
                setWindowState(prev => ({ ...prev, isMaximized: isMax }));
            }
        };

        checkMaximized();

        const handleFocus = () => setWindowState(prev => ({ ...prev, isFocused: true }));
        const handleBlur = () => setWindowState(prev => ({ ...prev, isFocused: false }));

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    const minimize = useCallback(() => {
        window.electronAPI?.minimize?.();
    }, []);

    const maximize = useCallback(async () => {
        window.electronAPI?.maximize?.();
        if (window.electronAPI?.isMaximized) {
            const isMax = await window.electronAPI.isMaximized();
            setWindowState(prev => ({ ...prev, isMaximized: isMax }));
        }
    }, []);

    const close = useCallback(() => {
        window.electronAPI?.close?.();
    }, []);

    return {
        ...windowState,
        minimize,
        maximize,
        close,
    };
}
