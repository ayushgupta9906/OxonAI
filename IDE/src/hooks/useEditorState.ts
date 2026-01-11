import { useState, useCallback } from 'react';

interface EditorState {
    openFiles: string[];
    activeFile: string | null;
    dirtyFiles: Set<string>;
    fileContents: Map<string, string>;
}

export function useEditorState() {
    const [openFiles, setOpenFiles] = useState<string[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());
    const [fileContents, setFileContents] = useState<Map<string, string>>(new Map());
    const [recentFiles, setRecentFiles] = useState<string[]>([]);

    const openFile = useCallback(async (path: string) => {
        if (!openFiles.includes(path)) {
            setOpenFiles(prev => [...prev, path]);

            // Add to recent files
            setRecentFiles(prev => {
                const filtered = prev.filter(f => f !== path);
                return [path, ...filtered].slice(0, 20);
            });

            // Load content
            if (window.electronAPI && !fileContents.has(path)) {
                const result = await window.electronAPI.readFile(path);
                if (result.success && result.content !== undefined) {
                    setFileContents(prev => new Map(prev).set(path, result.content!));
                }
            }
        }
        setActiveFile(path);
    }, [openFiles, fileContents]);

    const closeFile = useCallback((path: string) => {
        setOpenFiles(prev => prev.filter(f => f !== path));
        if (activeFile === path) {
            const remaining = openFiles.filter(f => f !== path);
            setActiveFile(remaining.length > 0 ? remaining[remaining.length - 1] : null);
        }
        setDirtyFiles(prev => {
            const next = new Set(prev);
            next.delete(path);
            return next;
        });
    }, [activeFile, openFiles]);

    const updateContent = useCallback((path: string, content: string) => {
        setFileContents(prev => new Map(prev).set(path, content));
        setDirtyFiles(prev => new Set(prev).add(path));
    }, []);

    const saveFile = useCallback(async (path: string) => {
        const content = fileContents.get(path);
        if (content !== undefined && window.electronAPI) {
            await window.electronAPI.writeFile(path, content);
            setDirtyFiles(prev => {
                const next = new Set(prev);
                next.delete(path);
                return next;
            });
            return true;
        }
        return false;
    }, [fileContents]);

    const saveAll = useCallback(async () => {
        const promises = Array.from(dirtyFiles).map(path => saveFile(path));
        await Promise.all(promises);
    }, [dirtyFiles, saveFile]);

    const isFileDirty = useCallback((path: string) => {
        return dirtyFiles.has(path);
    }, [dirtyFiles]);

    const getFileContent = useCallback((path: string) => {
        return fileContents.get(path) || '';
    }, [fileContents]);

    return {
        openFiles,
        activeFile,
        recentFiles,
        openFile,
        closeFile,
        setActiveFile,
        updateContent,
        saveFile,
        saveAll,
        isFileDirty,
        getFileContent,
    };
}
