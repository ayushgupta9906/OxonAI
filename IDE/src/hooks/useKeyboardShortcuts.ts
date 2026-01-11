import { useEffect, useCallback } from 'react';

interface Shortcut {
    keys: string[];
    action: () => void;
    description: string;
}

const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const mod = isMac ? e.metaKey : e.ctrlKey;
        const shift = e.shiftKey;
        const alt = e.altKey;
        const key = e.key.toLowerCase();

        // Build key combo string
        let combo = '';
        if (mod) combo += 'mod+';
        if (shift) combo += 'shift+';
        if (alt) combo += 'alt+';
        combo += key;

        if (shortcuts[combo]) {
            e.preventDefault();
            shortcuts[combo]();
        }
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

// Default IDE shortcuts
export const defaultShortcuts = {
    'mod+k': 'Command Palette',
    'mod+p': 'Quick Open',
    'mod+shift+p': 'Command Palette',
    'mod+b': 'Toggle Sidebar',
    'mod+`': 'Toggle Terminal',
    'mod+j': 'Toggle Bottom Panel',
    'mod+shift+e': 'Explorer',
    'mod+shift+f': 'Search',
    'mod+shift+g': 'Source Control',
    'mod+shift+x': 'Extensions',
    'mod+,': 'Settings',
    'mod+s': 'Save',
    'mod+shift+s': 'Save All',
    'mod+n': 'New File',
    'mod+o': 'Open File',
    'mod+shift+o': 'Open Folder',
    'mod+w': 'Close Tab',
    'mod+shift+w': 'Close Window',
    'mod+1': 'Chat',
    'mod+2': 'Content',
    'mod+3': 'Code',
    'mod+4': 'Ideas',
    'mod+5': 'Summarize',
    'mod+6': 'Rewrite',
    'mod+f': 'Find',
    'mod+h': 'Replace',
    'mod+shift+h': 'Replace in Files',
    'mod+g': 'Go to Line',
    'mod+shift+\\': 'Split Editor',
    'mod+\\': 'Split Editor Right',
    'f11': 'Toggle Fullscreen',
    'f5': 'Start Debugging',
    'shift+f5': 'Stop Debugging',
    'f9': 'Toggle Breakpoint',
    'f10': 'Step Over',
    'f11': 'Step Into',
    'shift+f11': 'Step Out',
};

export function formatShortcut(combo: string): string {
    return combo
        .replace('mod+', isMac ? '⌘' : 'Ctrl+')
        .replace('shift+', isMac ? '⇧' : 'Shift+')
        .replace('alt+', isMac ? '⌥' : 'Alt+')
        .toUpperCase();
}
