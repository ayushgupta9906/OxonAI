import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X, ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface Problem {
    id: number;
    type: 'error' | 'warning' | 'info';
    message: string;
    file: string;
    line: number;
    column: number;
    source: string;
}

interface ProblemsPanelProps {
    onFileClick: (path: string, line: number) => void;
}

const demoProblems: Problem[] = [
    { id: 1, type: 'error', message: "Cannot find module 'react'", file: 'src/App.tsx', line: 1, column: 18, source: 'ts(2307)' },
    { id: 2, type: 'warning', message: "'unused' is defined but never used", file: 'src/components/Chat.tsx', line: 45, column: 7, source: 'eslint' },
    { id: 3, type: 'info', message: "Consider using 'const' instead of 'let'", file: 'src/utils/helpers.ts', line: 12, column: 1, source: 'eslint' },
];

export default function ProblemsPanel({ onFileClick }: ProblemsPanelProps) {
    const [problems] = useState<Problem[]>(demoProblems);
    const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

    const grouped = problems.reduce((acc, p) => {
        if (!acc[p.file]) acc[p.file] = [];
        acc[p.file].push(p);
        return acc;
    }, {} as Record<string, Problem[]>);

    const filteredProblems = filter === 'all' ? problems : problems.filter(p => p.type === filter);
    const errorCount = problems.filter(p => p.type === 'error').length;
    const warningCount = problems.filter(p => p.type === 'warning').length;
    const infoCount = problems.filter(p => p.type === 'info').length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'error': return <AlertCircle size={14} className="text-red-400 flex-shrink-0" />;
            case 'warning': return <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />;
            case 'info': return <Info size={14} className="text-blue-400 flex-shrink-0" />;
            default: return null;
        }
    };

    const toggleFile = (file: string) => {
        const next = new Set(collapsed);
        if (next.has(file)) next.delete(file);
        else next.add(file);
        setCollapsed(next);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e]">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#3c3c3c]">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-white">PROBLEMS</span>
                    <div className="flex items-center gap-2 text-[10px]">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-2 py-0.5 rounded ${filter === 'all' ? 'bg-[#3c3c3c] text-white' : 'text-[#71717a]'}`}
                        >
                            All ({problems.length})
                        </button>
                        <button
                            onClick={() => setFilter('error')}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded ${filter === 'error' ? 'bg-red-500/20 text-red-400' : 'text-[#71717a]'}`}
                        >
                            <AlertCircle size={10} /> {errorCount}
                        </button>
                        <button
                            onClick={() => setFilter('warning')}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded ${filter === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'text-[#71717a]'}`}
                        >
                            <AlertTriangle size={10} /> {warningCount}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto text-xs">
                {Object.entries(grouped).map(([file, fileProblems]) => {
                    const filteredFileProblems = filter === 'all' ? fileProblems : fileProblems.filter(p => p.type === filter);
                    if (filteredFileProblems.length === 0) return null;

                    const isCollapsed = collapsed.has(file);
                    return (
                        <div key={file}>
                            <button
                                onClick={() => toggleFile(file)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-[#2d2d30] text-left"
                            >
                                {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                                <FileText size={12} className="text-[#52525b]" />
                                <span className="text-[#e4e4e7]">{file}</span>
                                <span className="text-[#52525b]">({filteredFileProblems.length})</span>
                            </button>
                            {!isCollapsed && filteredFileProblems.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => onFileClick(p.file, p.line)}
                                    className="w-full flex items-start gap-2 pl-8 pr-2 py-1 hover:bg-[#2d2d30] text-left"
                                >
                                    {getIcon(p.type)}
                                    <span className="text-[#d4d4d4] flex-1">{p.message}</span>
                                    <span className="text-[#52525b]">[{p.line},{p.column}]</span>
                                    <span className="text-[#52525b]">{p.source}</span>
                                </button>
                            ))}
                        </div>
                    );
                })}
                {filteredProblems.length === 0 && (
                    <div className="flex items-center justify-center h-full text-[#52525b]">
                        No problems detected
                    </div>
                )}
            </div>
        </div>
    );
}
