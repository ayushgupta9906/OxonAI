import { useState } from 'react';
import { ChevronDown, ChevronRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThoughtBlockProps {
    thought: string;
    isExpanded?: boolean;
}

export default function ThoughtBlock({ thought, isExpanded: initialExpanded = false }: ThoughtBlockProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    return (
        <div className="mb-4 border border-[#27272a] rounded-xl overflow-hidden bg-[#18181b]/50">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#1f1f23] transition-colors group"
            >
                <div className="flex items-center gap-2 text-[#a1a1aa] group-hover:text-purple-400">
                    <BrainCircuit size={14} />
                    <span className="text-xs font-medium">Thought for a few seconds</span>
                </div>
                {isExpanded ? <ChevronDown size={14} className="text-[#52525b]" /> : <ChevronRight size={14} className="text-[#52525b]" />}
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 py-2 border-t border-[#27272a] bg-[#09090b]">
                            <p className="text-xs text-[#71717a] leading-relaxed whitespace-pre-wrap italic">
                                {thought}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
