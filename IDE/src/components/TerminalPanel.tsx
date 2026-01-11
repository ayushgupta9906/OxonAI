import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Plus, X, Terminal as TermIcon, Trash2 } from 'lucide-react';
import 'xterm/css/xterm.css';

interface TerminalTab {
    id: number;
    name: string;
    backendId: number | null;
}

interface TerminalPanelProps {
    height: number;
    onClose: () => void;
    cwd?: string;
}

export default function TerminalPanel({ height, onClose, cwd }: TerminalPanelProps) {
    const [tabs, setTabs] = useState<TerminalTab[]>([]);
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const terminalRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const terminalsRef = useRef<Map<number, XTerminal>>(new Map());
    const fitAddonsRef = useRef<Map<number, FitAddon>>(new Map());
    const nextTabId = useRef(1);

    useEffect(() => {
        // Create default terminal on mount
        if (tabs.length === 0) {
            createNewTerminal();
        }

        // Listen for terminal output from backend
        if (window.electronAPI) {
            window.electronAPI.onTerminalData(({ id, data }: { id: number; data: string }) => {
                // Find which tab has this backend ID
                const tab = tabs.find(t => t.backendId === id);
                if (tab) {
                    const term = terminalsRef.current.get(tab.id);
                    if (term) {
                        term.write(data);
                    }
                }
            });

            window.electronAPI.onTerminalExit(({ id }: { id: number }) => {
                // Terminal process exited
                console.log('Terminal exited:', id);
            });
        }

        return () => {
            // Cleanup terminals
            tabs.forEach(tab => {
                if (tab.backendId && window.electronAPI) {
                    window.electronAPI.terminalKill(tab.backendId);
                }
            });
        };
    }, []);

    useEffect(() => {
        // Initialize terminal UI for active tab
        if (activeTab !== null) {
            initTerminalUI(activeTab);
        }
    }, [activeTab]);

    useEffect(() => {
        // Resize terminals when height changes
        setTimeout(() => {
            fitAddonsRef.current.forEach((addon, id) => {
                try {
                    addon.fit();
                    const term = terminalsRef.current.get(id);
                    const tab = tabs.find(t => t.id === id);
                    if (term && tab?.backendId && window.electronAPI) {
                        window.electronAPI.terminalResize(tab.backendId, term.cols, term.rows);
                    }
                } catch { }
            });
        }, 100);
    }, [height]);

    const createNewTerminal = async () => {
        const tabId = nextTabId.current++;
        const newTab: TerminalTab = {
            id: tabId,
            name: `Terminal ${tabId}`,
            backendId: null,
        };

        // Create backend PTY
        if (window.electronAPI) {
            const result = await window.electronAPI.terminalCreate({ cwd });
            newTab.backendId = result.id;
        }

        setTabs(prev => [...prev, newTab]);
        setActiveTab(tabId);
    };

    const initTerminalUI = (tabId: number) => {
        if (terminalsRef.current.has(tabId)) return;

        const container = terminalRefs.current.get(tabId);
        if (!container) return;

        const term = new XTerminal({
            theme: {
                background: '#0f0f12',
                foreground: '#e4e4e7',
                cursor: '#a855f7',
                cursorAccent: '#0f0f12',
                selectionBackground: '#3f3f46',
                black: '#18181b',
                red: '#ef4444',
                green: '#22c55e',
                yellow: '#eab308',
                blue: '#3b82f6',
                magenta: '#a855f7',
                cyan: '#06b6d4',
                white: '#e4e4e7',
                brightBlack: '#52525b',
                brightRed: '#f87171',
                brightGreen: '#4ade80',
                brightYellow: '#facc15',
                brightBlue: '#60a5fa',
                brightMagenta: '#c084fc',
                brightCyan: '#22d3ee',
                brightWhite: '#fafafa',
            },
            fontFamily: "'Cascadia Code', 'Fira Code', Menlo, Monaco, monospace",
            fontSize: 13,
            cursorBlink: true,
            cursorStyle: 'bar',
            allowTransparency: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(container);
        fitAddon.fit();

        terminalsRef.current.set(tabId, term);
        fitAddonsRef.current.set(tabId, fitAddon);

        // Send input to backend
        const tab = tabs.find(t => t.id === tabId);
        term.onData((data) => {
            if (tab?.backendId && window.electronAPI) {
                window.electronAPI.terminalInput(tab.backendId, data);
            }
        });

        // Resize backend when terminal resizes
        term.onResize(({ cols, rows }) => {
            if (tab?.backendId && window.electronAPI) {
                window.electronAPI.terminalResize(tab.backendId, cols, rows);
            }
        });
    };

    const closeTab = (tabId: number) => {
        const tab = tabs.find(t => t.id === tabId);
        if (tab?.backendId && window.electronAPI) {
            window.electronAPI.terminalKill(tab.backendId);
        }

        // Cleanup UI
        const term = terminalsRef.current.get(tabId);
        if (term) {
            term.dispose();
            terminalsRef.current.delete(tabId);
            fitAddonsRef.current.delete(tabId);
        }

        const newTabs = tabs.filter(t => t.id !== tabId);
        setTabs(newTabs);

        if (activeTab === tabId) {
            setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
        }
    };

    const clearTerminal = () => {
        if (activeTab !== null) {
            const term = terminalsRef.current.get(activeTab);
            if (term) {
                term.clear();
            }
        }
    };

    return (
        <div className="flex flex-col bg-[#0f0f12] border-t border-[#27272a]" style={{ height }}>
            {/* Header */}
            <div className="h-9 flex items-center justify-between bg-[#18181b] border-b border-[#27272a] px-2">
                <div className="flex items-center gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${activeTab === tab.id
                                    ? 'bg-[#27272a] text-white'
                                    : 'text-[#71717a] hover:text-[#a1a1aa]'
                                }`}
                        >
                            <TermIcon size={12} />
                            {tab.name}
                            {tabs.length > 1 && (
                                <X
                                    size={10}
                                    onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                                    className="hover:text-red-400"
                                />
                            )}
                        </button>
                    ))}
                    <button onClick={createNewTerminal} className="p-1 text-[#52525b] hover:text-white transition-colors">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={clearTerminal} className="p-1 text-[#52525b] hover:text-white transition-colors" title="Clear">
                        <Trash2 size={14} />
                    </button>
                    <button onClick={onClose} className="p-1 text-[#52525b] hover:text-white transition-colors" title="Close">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 relative">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        ref={(el) => { if (el) terminalRefs.current.set(tab.id, el); }}
                        className={`absolute inset-0 p-2 ${activeTab === tab.id ? 'block' : 'hidden'}`}
                    />
                ))}
            </div>
        </div>
    );
}
