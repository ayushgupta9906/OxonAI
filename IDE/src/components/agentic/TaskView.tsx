import { CheckCircle2, Circle, Loader2, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TaskItem {
    id: string;
    text: string;
    status: 'pending' | 'in-progress' | 'completed';
}

interface TaskViewProps {
    taskName: string;
    summary: string;
    status: string;
    items?: TaskItem[];
}

export default function TaskView({ taskName, summary, status, items = [] }: TaskViewProps) {
    return (
        <div className="mb-6 p-4 border border-[#27272a] rounded-xl bg-gradient-to-br from-[#18181b] to-[#09090b] shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <ListChecks size={18} className="text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">{taskName}</h3>
                    <p className="text-[10px] text-[#71717a] uppercase tracking-widest mt-0.5">Progress Updates</p>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-4 text-xs text-[#a1a1aa] leading-relaxed">
                    {summary}
                </div>
            )}

            {/* Task Checklist */}
            {items.length > 0 && (
                <div className="space-y-2 mb-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-start gap-2.5 group">
                            <div className="mt-0.5">
                                {item.status === 'completed' ? (
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                ) : item.status === 'in-progress' ? (
                                    <Loader2 size={14} className="text-blue-400 animate-spin" />
                                ) : (
                                    <Circle size={14} className="text-[#3f3f46] group-hover:text-[#52525b] transition-colors" />
                                )}
                            </div>
                            <span className={`text-xs ${item.status === 'completed' ? 'text-[#52525b] line-through' : 'text-[#a1a1aa]'}`}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Current Status */}
            {status && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <Loader2 size={12} className="text-blue-400 animate-spin" />
                    <span className="text-[11px] font-medium text-blue-400/80 italic">{status}...</span>
                </div>
            )}
        </div>
    );
}
