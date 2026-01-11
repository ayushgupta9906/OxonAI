import { useState, useEffect } from 'react';
import {
    Folder, FolderOpen, ChevronRight, ChevronDown,
    RefreshCw, FolderPlus, FilePlus, MoreHorizontal, Trash2, Edit, Search
} from 'lucide-react';
import FileIcon from './FileIcon';
import type { FileItem } from '../types';

interface FileExplorerProps {
    onFileSelect: (path: string) => void;
    currentFile: string | null;
}

interface TreeNode extends FileItem {
    children?: TreeNode[];
    isOpen?: boolean;
}

export default function FileExplorer({ onFileSelect, currentFile }: FileExplorerProps) {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: TreeNode } | null>(null);
    const [renaming, setRenaming] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState<{ type: 'file' | 'folder'; parentPath: string } | null>(null);
    const [createName, setCreateName] = useState('');

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onFolderOpened((path) => {
                setRootPath(path);
                loadDirectory(path);
            });
        }
    }, []);

    const loadDirectory = async (dirPath: string) => {
        if (!window.electronAPI) return;

        setLoading(true);
        const result = await window.electronAPI.readDirectory(dirPath);
        if (result.success) {
            const sorted = result.items.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });
            setTree(sorted);
        }
        setLoading(false);
    };

    const toggleDir = async (node: TreeNode) => {
        if (!node.isDirectory) return;

        const newExpanded = new Set(expandedDirs);
        if (newExpanded.has(node.path)) {
            newExpanded.delete(node.path);
        } else {
            newExpanded.add(node.path);

            // Load children if not already loaded
            if (!node.children) {
                const result = await window.electronAPI?.readDirectory(node.path);
                if (result?.success) {
                    node.children = result.items.sort((a, b) => {
                        if (a.isDirectory && !b.isDirectory) return -1;
                        if (!a.isDirectory && b.isDirectory) return 1;
                        return a.name.localeCompare(b.name);
                    });
                    setTree([...tree]);
                }
            }
        }
        setExpandedDirs(newExpanded);
    };

    const handleContextMenu = (e: React.MouseEvent, node: TreeNode) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, node });
    };

    const handleDelete = async (path: string) => {
        if (!window.electronAPI) return;
        await window.electronAPI.deletePath(path);
        if (rootPath) loadDirectory(rootPath);
        setContextMenu(null);
    };

    const handleRename = async () => {
        if (!renaming || !newName.trim() || !window.electronAPI) return;

        const dir = renaming.substring(0, renaming.lastIndexOf('\\'));
        const newPath = dir + '\\' + newName;
        await window.electronAPI.renamePath(renaming, newPath);

        setRenaming(null);
        setNewName('');
        if (rootPath) loadDirectory(rootPath);
    };

    const handleCreate = async () => {
        if (!creating || !createName.trim() || !window.electronAPI) return;

        const newPath = creating.parentPath + '\\' + createName;

        if (creating.type === 'folder') {
            await window.electronAPI.createDirectory(newPath);
        } else {
            await window.electronAPI.createFile(newPath);
        }

        setCreating(null);
        setCreateName('');
        if (rootPath) loadDirectory(rootPath);
    };

    const renderNode = (node: TreeNode, depth = 0): JSX.Element => {
        const isExpanded = expandedDirs.has(node.path);
        const isActive = currentFile === node.path;
        const isRenaming = renaming === node.path;

        return (
            <div key={node.path}>
                <div
                    className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-[#2d2d30] group ${isActive ? 'bg-[#37373d]' : ''
                        }`}
                    style={{ paddingLeft: 8 + depth * 16 }}
                    onClick={() => node.isDirectory ? toggleDir(node) : onFileSelect(node.path)}
                    onContextMenu={(e) => handleContextMenu(e, node)}
                >
                    {node.isDirectory ? (
                        <>
                            {isExpanded ? (
                                <ChevronDown size={12} className="text-[#71717a] flex-shrink-0" />
                            ) : (
                                <ChevronRight size={12} className="text-[#71717a] flex-shrink-0" />
                            )}
                            {isExpanded ? (
                                <FolderOpen size={14} className="text-amber-400 flex-shrink-0" />
                            ) : (
                                <Folder size={14} className="text-amber-400 flex-shrink-0" />
                            )}
                        </>
                    ) : (
                        <>
                            <span className="w-3" />
                            <FileIcon name={node.name} size={14} />
                        </>
                    )}

                    {isRenaming ? (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename();
                                if (e.key === 'Escape') setRenaming(null);
                            }}
                            className="flex-1 bg-[#3c3c3c] text-white text-xs px-1 py-0.5 outline-none border border-purple-500"
                            autoFocus
                        />
                    ) : (
                        <span className={`text-xs truncate ${isActive ? 'text-white' : 'text-[#d4d4d4]'}`}>
                            {node.name}
                        </span>
                    )}
                </div>

                {node.isDirectory && isExpanded && node.children && (
                    <div>
                        {node.children.map(child => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (!rootPath) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <Folder size={32} className="text-[#3f3f46] mb-3" />
                <p className="text-xs text-[#71717a] mb-3">No folder open</p>
                <button
                    onClick={() => { }}
                    className="btn-primary py-2 px-4 text-xs"
                >
                    Open Folder
                </button>
                <p className="text-[10px] text-[#52525b] mt-2">Ctrl+Shift+O</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 flex items-center justify-between border-b border-[#27272a]">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider truncate">
                    {rootPath?.split('\\').pop()}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCreating({ type: 'file', parentPath: rootPath })}
                        className="p-1 text-[#71717a] hover:text-white transition-colors"
                        title="New File"
                    >
                        <FilePlus size={14} />
                    </button>
                    <button
                        onClick={() => setCreating({ type: 'folder', parentPath: rootPath })}
                        className="p-1 text-[#71717a] hover:text-white transition-colors"
                        title="New Folder"
                    >
                        <FolderPlus size={14} />
                    </button>
                    <button
                        onClick={() => loadDirectory(rootPath)}
                        className="p-1 text-[#71717a] hover:text-white transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Create Input */}
            {creating && (
                <div className="px-2 py-1 border-b border-[#27272a]">
                    <input
                        type="text"
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        onBlur={handleCreate}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreate();
                            if (e.key === 'Escape') setCreating(null);
                        }}
                        placeholder={creating.type === 'folder' ? 'Folder name...' : 'File name...'}
                        className="w-full bg-[#3c3c3c] text-white text-xs px-2 py-1 rounded outline-none border border-purple-500"
                        autoFocus
                    />
                </div>
            )}

            {/* Tree */}
            <div className="flex-1 overflow-auto py-1">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="loading-dots"><span /><span /><span /></div>
                    </div>
                ) : (
                    tree.map(node => renderNode(node))
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
                    <div
                        className="fixed z-50 bg-[#252526] border border-[#454545] rounded-lg shadow-xl py-1 min-w-[140px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        {contextMenu.node.isDirectory && (
                            <>
                                <button
                                    onClick={() => {
                                        setCreating({ type: 'file', parentPath: contextMenu.node.path });
                                        setContextMenu(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#d4d4d4] hover:bg-[#094771]"
                                >
                                    <FilePlus size={12} /> New File
                                </button>
                                <button
                                    onClick={() => {
                                        setCreating({ type: 'folder', parentPath: contextMenu.node.path });
                                        setContextMenu(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#d4d4d4] hover:bg-[#094771]"
                                >
                                    <FolderPlus size={12} /> New Folder
                                </button>
                                <div className="my-1 border-t border-[#454545]" />
                            </>
                        )}
                        <button
                            onClick={() => {
                                setRenaming(contextMenu.node.path);
                                setNewName(contextMenu.node.name);
                                setContextMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#d4d4d4] hover:bg-[#094771]"
                        >
                            <Edit size={12} /> Rename
                        </button>
                        <button
                            onClick={() => handleDelete(contextMenu.node.path)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-400/10"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
