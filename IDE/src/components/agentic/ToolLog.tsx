import { Terminal, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToolCall {
    id: string;
    toolName: string;
    command: string;
    status: 'running' | 'success' | 'error';
    output?: string;
}

interface ToolLogProps {
    toolCall: ToolCall;
}

export default function ToolLog({ toolCall }: ToolLogProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-3 border border-[#27272a] rounded-lg overflow-hidden bg-[#09090b]">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#18181b] transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="mt-0.5">
                        {toolCall.status === 'success' ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : toolCall.status === 'error' ? (
                            <AlertCircle size={14} className="text-rose-500" />
                        ) : (
                            <Loader2 size={14} className="text-blue-400 animate-spin" />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold text-purple-400">{toolCall.toolName}</span>
                        <span className="text-[11px] text-[#52525b] truncate max-w-[150px]">{toolCall.command}</span>
                    </div>
                </div>
                {isExpanded ? <ChevronDown size={12} className="text-[#3f3f46]" /> : <ChevronRight size={12} className="text-[#3f3f46]" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-[#27272a]"
                    >
                        <div className="p-3 bg-black">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1a1a1f]">
                                <Terminal size={10} className="text-[#71717a]" />
                                <span className="text-[10px] uppercase tracking-widest text-[#71717a] font-bold">Execution Output</span>
                            </div>
                            <pre className="text-[11px] font-mono text-[#a1a1aa] whitespace-pre-wrap leading-relaxed">
                                {toolCall.output || (toolCall.status === 'running' ? 'Executing...' : 'No output available.')}
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
