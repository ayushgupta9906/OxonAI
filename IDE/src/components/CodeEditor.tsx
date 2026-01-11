import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { X, Circle } from 'lucide-react';

interface EditorTab {
    path: string;
    name: string;
    content: string;
    isDirty: boolean;
}

interface CodeEditorProps {
    openFiles: string[];
    currentFile: string | null;
    onFileChange: (path: string) => void;
    onFileClose: (path: string) => void;
    onSave: (path: string, content: string) => void;
}

function getLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const languages: Record<string, string> = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        json: 'json',
        html: 'html',
        css: 'css',
        scss: 'scss',
        md: 'markdown',
        sql: 'sql',
        go: 'go',
        rs: 'rust',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        yaml: 'yaml',
        yml: 'yaml',
        xml: 'xml',
        sh: 'shell',
        bash: 'shell',
    };
    return languages[ext] || 'plaintext';
}

export default function CodeEditor({ openFiles, currentFile, onFileChange, onFileClose, onSave }: CodeEditorProps) {
    const [tabs, setTabs] = useState<EditorTab[]>([]);
    const [currentContent, setCurrentContent] = useState<string>('');

    useEffect(() => {
        // Load file content when currentFile changes
        if (currentFile && window.electronAPI) {
            const tab = tabs.find(t => t.path === currentFile);
            if (tab) {
                setCurrentContent(tab.content);
            } else {
                window.electronAPI.readFile(currentFile).then(result => {
                    if (result.success && result.content !== undefined) {
                        const name = currentFile.split(/[\\/]/).pop() || currentFile;
                        setTabs(prev => [...prev, { path: currentFile, name, content: result.content!, isDirty: false }]);
                        setCurrentContent(result.content);
                    }
                });
            }
        }
    }, [currentFile]);

    useEffect(() => {
        // Handle Ctrl+S
        const handleSave = () => {
            if (currentFile) {
                const tab = tabs.find(t => t.path === currentFile);
                if (tab && tab.isDirty) {
                    onSave(currentFile, currentContent);
                    setTabs(prev => prev.map(t => t.path === currentFile ? { ...t, isDirty: false } : t));
                }
            }
        };

        if (window.electronAPI) {
            window.electronAPI.onSaveFile(handleSave);
        }
        return () => {
            if (window.electronAPI) {
                window.electronAPI.removeAllListeners('save-file');
            }
        };
    }, [currentFile, currentContent, tabs]);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined && currentFile) {
            setCurrentContent(value);
            setTabs(prev => prev.map(t => t.path === currentFile ? { ...t, content: value, isDirty: true } : t));
        }
    };

    const handleTabClose = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        setTabs(prev => prev.filter(t => t.path !== path));
        onFileClose(path);
    };

    const currentTab = tabs.find(t => t.path === currentFile);

    return (
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Tabs */}
            {tabs.length > 0 && (
                <div className="flex bg-[#252526] border-b border-[#3c3c3c] overflow-x-auto hide-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.path}
                            onClick={() => onFileChange(tab.path)}
                            className={`flex items-center gap-2 px-3 py-2 border-r border-[#3c3c3c] text-sm transition-colors min-w-0 ${currentFile === tab.path
                                    ? 'bg-[#1e1e1e] text-white'
                                    : 'text-[#9d9d9d] hover:bg-[#2d2d30]'
                                }`}
                        >
                            <span className="truncate">{tab.name}</span>
                            {tab.isDirty ? (
                                <Circle size={8} className="text-white fill-current flex-shrink-0" />
                            ) : (
                                <X
                                    size={14}
                                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 hover:bg-[#3c3c3c] rounded"
                                    onClick={(e) => handleTabClose(e, tab.path)}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Breadcrumb */}
            {currentFile && (
                <div className="px-4 py-1 bg-[#1e1e1e] border-b border-[#3c3c3c] text-xs text-[#8b8b8b]">
                    {currentFile.split(/[\\/]/).map((part, i, arr) => (
                        <span key={i}>
                            {part}
                            {i < arr.length - 1 && <span className="mx-1 text-[#5a5a5a]">/</span>}
                        </span>
                    ))}
                </div>
            )}

            {/* Editor */}
            <div className="flex-1">
                {currentTab ? (
                    <Editor
                        height="100%"
                        language={getLanguage(currentTab.name)}
                        value={currentContent}
                        onChange={handleEditorChange}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            fontFamily: "'Fira Code', 'Cascadia Code', Menlo, Monaco, monospace",
                            fontLigatures: true,
                            minimap: { enabled: true },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            padding: { top: 16 },
                            renderLineHighlight: 'all',
                            lineNumbers: 'on',
                            tabSize: 2,
                            wordWrap: 'on',
                        }}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#5a5a5a]">
                        <div className="text-6xl mb-4">💻</div>
                        <p className="text-lg mb-2">No file open</p>
                        <p className="text-sm">Open a file from the explorer or use <kbd className="px-2 py-1 bg-[#3c3c3c] rounded">Ctrl+O</kbd></p>
                    </div>
                )}
            </div>
        </div>
    );
}
