import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, Maximize2 } from 'lucide-react';

interface DiffLine {
    type: 'unchanged' | 'added' | 'removed';
    oldLineNum: number | null;
    newLineNum: number | null;
    content: string;
}

interface DiffViewerProps {
    oldContent: string;
    newContent: string;
    fileName: string;
    onClose: () => void;
}

export default function DiffViewer({ oldContent, newContent, fileName, onClose }: DiffViewerProps) {
    const [sideBySide, setSideBySide] = useState(true);

    // Simple diff algorithm
    const computeDiff = (): DiffLine[] => {
        const oldLines = oldContent.split('\n');
        const newLines = newContent.split('\n');
        const result: DiffLine[] = [];

        let oldIdx = 0, newIdx = 0;

        while (oldIdx < oldLines.length || newIdx < newLines.length) {
            if (oldIdx >= oldLines.length) {
                result.push({ type: 'added', oldLineNum: null, newLineNum: newIdx + 1, content: newLines[newIdx] });
                newIdx++;
            } else if (newIdx >= newLines.length) {
                result.push({ type: 'removed', oldLineNum: oldIdx + 1, newLineNum: null, content: oldLines[oldIdx] });
                oldIdx++;
            } else if (oldLines[oldIdx] === newLines[newIdx]) {
                result.push({ type: 'unchanged', oldLineNum: oldIdx + 1, newLineNum: newIdx + 1, content: oldLines[oldIdx] });
                oldIdx++;
                newIdx++;
            } else {
                result.push({ type: 'removed', oldLineNum: oldIdx + 1, newLineNum: null, content: oldLines[oldIdx] });
                oldIdx++;
                result.push({ type: 'added', oldLineNum: null, newLineNum: newIdx + 1, content: newLines[newIdx] });
                newIdx++;
            }
        }

        return result;
    };

    const diff = computeDiff();
    const additions = diff.filter(d => d.type === 'added').length;
    const deletions = diff.filter(d => d.type === 'removed').length;

    const getLineBg = (type: string) => {
        switch (type) {
            case 'added': return 'bg-green-500/10';
            case 'removed': return 'bg-red-500/10';
            default: return '';
        }
    };

    const getLineNumBg = (type: string) => {
        switch (type) {
            case 'added': return 'bg-green-500/20 text-green-400';
            case 'removed': return 'bg-red-500/20 text-red-400';
            default: return 'text-[#52525b]';
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#3c3c3c] bg-[#252526]">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-white">{fileName}</span>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-green-400">+{additions}</span>
                        <span className="text-red-400">-{deletions}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSideBySide(!sideBySide)}
                        className="p-1.5 text-[#71717a] hover:text-white transition-colors"
                        title={sideBySide ? 'Inline View' : 'Side by Side'}
                    >
                        <Maximize2 size={14} />
                    </button>
                    <button onClick={onClose} className="p-1.5 text-[#71717a] hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Diff Content */}
            <div className="flex-1 overflow-auto font-mono text-sm">
                {sideBySide ? (
                    <div className="flex">
                        {/* Old */}
                        <div className="flex-1 border-r border-[#3c3c3c]">
                            <div className="px-3 py-1 bg-[#252526] text-xs text-[#71717a] border-b border-[#3c3c3c]">Original</div>
                            {diff.filter(d => d.type !== 'added').map((line, i) => (
                                <div key={i} className={`flex ${getLineBg(line.type)}`}>
                                    <span className={`w-12 px-2 text-right text-xs ${getLineNumBg(line.type)}`}>
                                        {line.oldLineNum || ''}
                                    </span>
                                    <span className="flex-1 px-2 text-[#d4d4d4]">{line.content || ' '}</span>
                                </div>
                            ))}
                        </div>
                        {/* New */}
                        <div className="flex-1">
                            <div className="px-3 py-1 bg-[#252526] text-xs text-[#71717a] border-b border-[#3c3c3c]">Modified</div>
                            {diff.filter(d => d.type !== 'removed').map((line, i) => (
                                <div key={i} className={`flex ${getLineBg(line.type)}`}>
                                    <span className={`w-12 px-2 text-right text-xs ${getLineNumBg(line.type)}`}>
                                        {line.newLineNum || ''}
                                    </span>
                                    <span className="flex-1 px-2 text-[#d4d4d4]">{line.content || ' '}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        {diff.map((line, i) => (
                            <div key={i} className={`flex ${getLineBg(line.type)}`}>
                                <span className={`w-12 px-2 text-right text-xs ${line.type === 'removed' ? getLineNumBg(line.type) : 'text-[#3c3c3c]'}`}>
                                    {line.oldLineNum || ''}
                                </span>
                                <span className={`w-12 px-2 text-right text-xs ${line.type === 'added' ? getLineNumBg(line.type) : 'text-[#3c3c3c]'}`}>
                                    {line.newLineNum || ''}
                                </span>
                                <span className={`w-6 text-center text-xs ${line.type === 'added' ? 'text-green-400' : line.type === 'removed' ? 'text-red-400' : 'text-[#3c3c3c]'}`}>
                                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                                </span>
                                <span className="flex-1 px-2 text-[#d4d4d4]">{line.content || ' '}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
