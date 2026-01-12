import { useAgent } from '../../providers/AgentProvider';
import { Sparkles, X, RotateCcw, LayoutDashboard } from 'lucide-react';
import TaskView from './TaskView';
import RecentActionsList from './RecentActionsList';
import FileChangeList from './FileChangeList';

interface AgentSidebarProps {
    onClose: () => void;
}

export default function AgentSidebar({ onClose }: AgentSidebarProps) {
    const { currentTask, recentActions, fileChanges, resetAgent } = useAgent();

    return (
        <div className="w-80 h-full border-l border-[#3c3c3c] bg-[#18181b] flex flex-col shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="h-12 px-4 border-b border-[#3c3c3c] flex items-center justify-between bg-[#1f1f23]">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white tracking-tight">Agent Workspace</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={resetAgent}
                        className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#27272a] rounded-md transition-colors"
                        title="Clear all"
                    >
                        <RotateCcw size={14} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#27272a] rounded-md transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-4 space-y-8 custom-scrollbar">
                {/* Active Task Section */}
                {currentTask && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <LayoutDashboard size={14} className="text-purple-400" />
                            <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Active Task</span>
                        </div>
                        <TaskView
                            taskName={currentTask.name}
                            summary={currentTask.summary}
                            status={currentTask.status}
                            items={currentTask.items}
                        />
                    </div>
                )}

                {/* Recent Actions Section */}
                <div className="space-y-1">
                    <RecentActionsList actions={recentActions} />
                </div>

                {/* File Changes Section */}
                <div className="space-y-1">
                    <FileChangeList changes={fileChanges} />
                </div>
            </div>

            {/* Footer / Stats */}
            <div className="p-3 border-t border-[#3c3c3c] bg-[#1f1f23] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#52525b] uppercase font-bold">Actions</span>
                        <span className="text-xs font-mono text-[#a1a1aa]">{recentActions.length}</span>
                    </div>
                    <div className="w-px h-6 bg-[#3c3c3c]" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#52525b] uppercase font-bold">Files</span>
                        <span className="text-xs font-mono text-[#a1a1aa]">{fileChanges.length}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-[#71717a] font-medium font-mono uppercase tracking-tighter">System Ready</span>
                </div>
            </div>
        </div>
    );
}
