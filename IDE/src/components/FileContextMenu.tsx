import { useState } from 'react';
import { File, Folder, Edit, Trash2, Copy, Clipboard, FilePlus, FolderPlus, RefreshCw } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    isDirectory: boolean;
    path: string;
    onClose: () => void;
    onRename: (path: string) => void;
    onDelete: (path: string) => void;
    onCopy: (path: string) => void;
    onCut: (path: string) => void;
    onPaste: (path: string) => void;
    onNewFile: (path: string) => void;
    onNewFolder: (path: string) => void;
}

export default function FileContextMenu({
    x,
    y,
    isDirectory,
    path,
    onClose,
    onRename,
    onDelete,
    onCopy,
    onCut,
    onPaste,
    onNewFile,
    onNewFolder,
}: ContextMenuProps) {
    const menuItems = [
        ...(isDirectory
            ? [
                { label: 'New File', icon: <FilePlus size={14} />, action: () => onNewFile(path), shortcut: '' },
                { label: 'New Folder', icon: <FolderPlus size={14} />, action: () => onNewFolder(path), shortcut: '' },
                { type: 'separator' } as any,
            ]
            : []),
        { label: 'Cut', icon: <Copy size={14} />, action: () => onCut(path), shortcut: 'Ctrl+X' },
        { label: 'Copy', icon: <Copy size={14} />, action: () => onCopy(path), shortcut: 'Ctrl+C' },
        { label: 'Paste', icon: <Clipboard size={14} />, action: () => onPaste(path), shortcut: 'Ctrl+V' },
        { type: 'separator' },
        { label: 'Rename', icon: <Edit size={14} />, action: () => onRename(path), shortcut: 'F2' },
        { label: 'Delete', icon: <Trash2 size={14} />, action: () => onDelete(path), shortcut: 'Del', danger: true },
    ];

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Menu */}
            <div
                className="fixed z-50 bg-[#252526] border border-[#454545] rounded-lg shadow-xl py-1 min-w-[180px] animate-fade-in"
                style={{ left: x, top: y }}
            >
                {menuItems.map((item, i) =>
                    item.type === 'separator' ? (
                        <div key={i} className="my-1 border-t border-[#454545]" />
                    ) : (
                        <button
                            key={i}
                            onClick={() => {
                                item.action?.();
                                onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-1.5 text-xs hover:bg-[#094771] transition-colors ${item.danger ? 'text-red-400 hover:text-red-300' : 'text-[#d4d4d4]'
                                }`}
                        >
                            {item.icon}
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.shortcut && (
                                <span className="text-[#71717a] text-[10px]">{item.shortcut}</span>
                            )}
                        </button>
                    )
                )}
            </div>
        </>
    );
}
