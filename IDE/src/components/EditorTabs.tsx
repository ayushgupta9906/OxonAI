import { useState, useRef, useEffect } from 'react';
import { Plus, X, MoreHorizontal, Columns, Columns2 } from 'lucide-react';

interface Tab {
    id: string;
    path: string;
    name: string;
    isDirty: boolean;
}

interface EditorTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabClick: (id: string) => void;
    onTabClose: (id: string) => void;
    onTabsReorder: (tabs: Tab[]) => void;
    onSplitEditor: () => void;
}

export default function EditorTabs({
    tabs,
    activeTab,
    onTabClick,
    onTabClose,
    onTabsReorder,
    onSplitEditor,
}: EditorTabsProps) {
    const [draggedTab, setDraggedTab] = useState<string | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, tabId: string) => {
        setDraggedTab(tabId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (!draggedTab) return;

        const dragIndex = tabs.findIndex(t => t.id === draggedTab);
        if (dragIndex === dropIndex) return;

        const newTabs = [...tabs];
        const [removed] = newTabs.splice(dragIndex, 1);
        newTabs.splice(dropIndex, 0, removed);
        onTabsReorder(newTabs);

        setDraggedTab(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedTab(null);
        setDragOverIndex(null);
    };

    const getFileIcon = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const icons: Record<string, string> = {
            ts: '🔷',
            tsx: '⚛️',
            js: '🟨',
            jsx: '⚛️',
            json: '📦',
            css: '🎨',
            html: '🌐',
            md: '📝',
            py: '🐍',
        };
        return icons[ext] || '📄';
    };

    return (
        <div className="flex items-center bg-[#252526] border-b border-[#3c3c3c] overflow-x-auto hide-scrollbar">
            {/* Tabs */}
            <div className="flex flex-1">
                {tabs.map((tab, index) => (
                    <div
                        key={tab.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, tab.id)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onTabClick(tab.id)}
                        className={`group flex items-center gap-2 px-3 py-2 border-r border-[#3c3c3c] cursor-pointer transition-all min-w-0 max-w-[200px] ${activeTab === tab.id
                                ? 'bg-[#1e1e1e] text-white'
                                : 'text-[#9d9d9d] hover:bg-[#2d2d30]'
                            } ${dragOverIndex === index ? 'border-l-2 border-l-purple-500' : ''}`}
                    >
                        <span className="text-xs flex-shrink-0">{getFileIcon(tab.name)}</span>
                        <span className="text-xs truncate">{tab.name}</span>
                        {tab.isDirty && (
                            <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tab.id);
                            }}
                            className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#454545] transition-all flex-shrink-0"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 px-2 flex-shrink-0">
                <button
                    onClick={onSplitEditor}
                    className="p-1.5 text-[#71717a] hover:text-white transition-colors"
                    title="Split Editor"
                >
                    <Columns2 size={14} />
                </button>
                <button className="p-1.5 text-[#71717a] hover:text-white transition-colors" title="More Actions">
                    <MoreHorizontal size={14} />
                </button>
            </div>
        </div>
    );
}
