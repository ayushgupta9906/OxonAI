import { Action } from '../../types';
import { Search, Code, Terminal, Beaker, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';

interface RecentActionsListProps {
    actions: Action[];
}

const IconMap = {
    research: Search,
    code: Code,
    command: Terminal,
    test: Beaker,
};

export default function RecentActionsList({ actions }: RecentActionsListProps) {
    if (actions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center opacity-40">
                <Terminal size={32} className="mb-2" />
                <p className="text-xs">No recent actions</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Recent Actions</span>
            </div>
            <div className="space-y-1">
                {actions.map((action) => {
                    const Icon = IconMap[action.type] || Terminal;
                    return (
                        <div key={action.id} className="group relative flex items-start gap-3 p-2 rounded-lg hover:bg-[#18181b] transition-all">
                            <div className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center bg-[#18181b] border border-[#27272a] text-[#71717a] group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors`}>
                                <Icon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-[12px] font-medium text-[#e4e4e7] truncate">{action.title}</h4>
                                    {action.status === 'success' ? (
                                        <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                                    ) : action.status === 'error' ? (
                                        <AlertCircle size={12} className="text-rose-500 flex-shrink-0" />
                                    ) : action.status === 'running' ? (
                                        <Loader2 size={12} className="text-blue-400 animate-spin flex-shrink-0" />
                                    ) : (
                                        <Circle size={12} className="text-[#3f3f46] flex-shrink-0" />
                                    )}
                                </div>
                                <p className="text-[10px] text-[#71717a] truncate mt-0.5 font-light">{action.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
