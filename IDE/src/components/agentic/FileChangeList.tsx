import { FileChange } from '../../types';
import { Plus, FileEdit, Trash2, Eye } from 'lucide-react';

interface FileChangeListProps {
    changes: FileChange[];
    onPreview?: (change: FileChange) => void;
}

export default function FileChangeList({ changes, onPreview }: FileChangeListProps) {
    if (changes.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2 pt-4 border-t border-[#1a1a1f]">
                <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Files with Changes</span>
                <span className="text-[10px] bg-[#1a1a1f] px-1.5 py-0.5 rounded text-[#52525b]">{changes.length}</span>
            </div>
            <div className="space-y-1">
                {changes.map((change, i) => (
                    <div
                        key={i}
                        className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#18181b] cursor-default transition-all"
                        onClick={() => onPreview?.(change)}
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${change.type === 'new' ? 'bg-emerald-500/10 text-emerald-500' :
                                change.type === 'delete' ? 'bg-rose-500/10 text-rose-500' :
                                    'bg-blue-500/10 text-blue-500'
                                }`}>
                                {change.type === 'new' ? <Plus size={12} /> :
                                    change.type === 'delete' ? <Trash2 size={12} /> :
                                        <FileEdit size={12} />}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[12px] text-[#e4e4e7] truncate">{change.path.split('/').pop()}</span>
                                <span className="text-[9px] text-[#52525b] truncate">{change.path}</span>
                            </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#27272a] rounded transition-all text-[#71717a] hover:text-[#a1a1aa]">
                            <Eye size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
