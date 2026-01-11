import { useState } from 'react';
import { Terminal as TermIcon, AlertTriangle, FileText, X, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

type PanelTab = 'problems' | 'output' | 'terminal' | 'debug';

interface BottomPanelProps {
    activeTab: PanelTab;
    onTabChange: (tab: PanelTab) => void;
    onClose: () => void;
    onMaximize: () => void;
    isMaximized: boolean;
    problemCount: number;
    children: React.ReactNode;
}

export default function BottomPanel({
    activeTab,
    onTabChange,
    onClose,
    onMaximize,
    isMaximized,
    problemCount,
    children,
}: BottomPanelProps) {
    const tabs: { id: PanelTab; label: string; icon: React.ReactNode; badge?: number }[] = [
        { id: 'problems', label: 'Problems', icon: <AlertTriangle size={12} />, badge: problemCount > 0 ? problemCount : undefined },
        { id: 'output', label: 'Output', icon: <FileText size={12} /> },
        { id: 'terminal', label: 'Terminal', icon: <TermIcon size={12} /> },
    ];

    return (
        <div className="flex flex-col bg-[#1e1e1e] border-t border-[#3c3c3c]">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#252526] px-2">
                <div className="flex items-center">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'text-white border-purple-500'
                                    : 'text-[#71717a] border-transparent hover:text-[#d4d4d4]'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.badge !== undefined && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-400 rounded-full">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onMaximize}
                        className="p-1.5 text-[#71717a] hover:text-white transition-colors"
                        title={isMaximized ? 'Restore' : 'Maximize'}
                    >
                        {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-[#71717a] hover:text-white transition-colors"
                        title="Close"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
