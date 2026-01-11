import { useState } from 'react';
import { Play, Pause, StepOver, StepInto, StepOut, RotateCcw, Square, ChevronDown, ChevronRight, Bug } from 'lucide-react';

interface Variable {
    name: string;
    value: string;
    type: string;
    children?: Variable[];
}

interface Breakpoint {
    file: string;
    line: number;
    enabled: boolean;
}

interface StackFrame {
    name: string;
    file: string;
    line: number;
    column: number;
}

export default function DebugPanel() {
    const [isDebugging, setIsDebugging] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [variables] = useState<Variable[]>([
        { name: 'count', value: '42', type: 'number' },
        { name: 'name', value: '"OxonAI"', type: 'string' },
        {
            name: 'items', value: 'Array(5)', type: 'array', children: [
                { name: '0', value: '"item1"', type: 'string' },
                { name: '1', value: '"item2"', type: 'string' },
            ]
        },
        {
            name: 'user', value: 'Object', type: 'object', children: [
                { name: 'id', value: '1', type: 'number' },
                { name: 'name', value: '"John"', type: 'string' },
            ]
        },
    ]);
    const [breakpoints] = useState<Breakpoint[]>([
        { file: 'src/App.tsx', line: 25, enabled: true },
        { file: 'src/components/Chat.tsx', line: 42, enabled: true },
        { file: 'src/utils/api.ts', line: 15, enabled: false },
    ]);
    const [callStack] = useState<StackFrame[]>([
        { name: 'handleClick', file: 'src/App.tsx', line: 25, column: 3 },
        { name: 'onClick', file: 'react-dom.js', line: 1234, column: 12 },
        { name: 'dispatchEvent', file: 'react-dom.js', line: 567, column: 8 },
    ]);
    const [expandedVars, setExpandedVars] = useState<Set<string>>(new Set());

    const toggleVar = (name: string) => {
        const next = new Set(expandedVars);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        setExpandedVars(next);
    };

    const renderVariable = (v: Variable, depth = 0) => {
        const hasChildren = v.children && v.children.length > 0;
        const isExpanded = expandedVars.has(v.name);

        return (
            <div key={v.name}>
                <div
                    className="flex items-center gap-1 px-2 py-0.5 hover:bg-[#2d2d30] cursor-pointer"
                    style={{ paddingLeft: 8 + depth * 16 }}
                    onClick={() => hasChildren && toggleVar(v.name)}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                    ) : (
                        <span className="w-3" />
                    )}
                    <span className="text-purple-300">{v.name}</span>
                    <span className="text-[#71717a]">:</span>
                    <span className={`${v.type === 'string' ? 'text-green-300' : v.type === 'number' ? 'text-blue-300' : 'text-[#d4d4d4]'}`}>
                        {v.value}
                    </span>
                </div>
                {hasChildren && isExpanded && v.children!.map(c => renderVariable(c, depth + 1))}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-[#27272a]">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Run and Debug</span>
            </div>

            {/* Debug Controls */}
            <div className="px-3 py-2 border-b border-[#27272a] flex items-center gap-1">
                {!isDebugging ? (
                    <button
                        onClick={() => setIsDebugging(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                    >
                        <Play size={14} />
                        Start Debugging
                    </button>
                ) : (
                    <>
                        <button className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#3c3c3c] rounded transition-colors" title="Continue">
                            <Play size={16} />
                        </button>
                        <button className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#3c3c3c] rounded transition-colors" title="Pause">
                            <Pause size={16} />
                        </button>
                        <button className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#3c3c3c] rounded transition-colors" title="Step Over">
                            <StepOver size={16} />
                        </button>
                        <button className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#3c3c3c] rounded transition-colors" title="Step Into">
                            <StepInto size={16} />
                        </button>
                        <button className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#3c3c3c] rounded transition-colors" title="Step Out">
                            <StepOut size={16} />
                        </button>
                        <button className="p-1.5 text-[#71717a] hover:text-white hover:bg-[#3c3c3c] rounded transition-colors" title="Restart">
                            <RotateCcw size={16} />
                        </button>
                        <button
                            onClick={() => setIsDebugging(false)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                            title="Stop"
                        >
                            <Square size={16} />
                        </button>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto text-xs">
                {/* Variables */}
                <div className="border-b border-[#27272a]">
                    <div className="px-3 py-2 bg-[#252526] font-medium text-[#d4d4d4]">VARIABLES</div>
                    <div className="py-1">
                        {variables.map(v => renderVariable(v))}
                    </div>
                </div>

                {/* Call Stack */}
                <div className="border-b border-[#27272a]">
                    <div className="px-3 py-2 bg-[#252526] font-medium text-[#d4d4d4]">CALL STACK</div>
                    <div className="py-1">
                        {callStack.map((frame, i) => (
                            <div key={i} className="px-3 py-1 hover:bg-[#2d2d30] cursor-pointer">
                                <span className="text-amber-300">{frame.name}</span>
                                <span className="text-[#52525b] ml-2">{frame.file}:{frame.line}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Breakpoints */}
                <div>
                    <div className="px-3 py-2 bg-[#252526] font-medium text-[#d4d4d4]">BREAKPOINTS</div>
                    <div className="py-1">
                        {breakpoints.map((bp, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1 hover:bg-[#2d2d30]">
                                <input type="checkbox" checked={bp.enabled} className="w-3 h-3 accent-purple-500" readOnly />
                                <Bug size={12} className={bp.enabled ? 'text-red-400' : 'text-[#52525b]'} />
                                <span className={bp.enabled ? 'text-[#d4d4d4]' : 'text-[#52525b]'}>
                                    {bp.file}:{bp.line}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
