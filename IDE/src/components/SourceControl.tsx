import { useState, useEffect } from 'react';
import { GitBranch, Plus, Minus, Check, ChevronDown, RefreshCw, FileText, FolderGit } from 'lucide-react';

interface GitFile {
    path: string;
    index: string;
    working_dir: string;
}

interface SourceControlProps {
    rootPath: string | null;
}

export default function SourceControl({ rootPath }: SourceControlProps) {
    const [branch, setBranch] = useState('');
    const [branches, setBranches] = useState<string[]>([]);
    const [files, setFiles] = useState<GitFile[]>([]);
    const [stagedFiles, setStagedFiles] = useState<string[]>([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRepo, setIsRepo] = useState(false);
    const [showBranches, setShowBranches] = useState(false);

    useEffect(() => {
        if (rootPath) {
            checkGitStatus();
        }
    }, [rootPath]);

    const checkGitStatus = async () => {
        if (!rootPath || !window.electronAPI) return;

        setLoading(true);
        try {
            const result = await window.electronAPI.gitStatus(rootPath);
            if (result.success && result.isRepo) {
                setIsRepo(true);
                setBranch(result.branch || 'main');
                setFiles(result.files || []);

                const branchResult = await window.electronAPI.gitBranches(rootPath);
                if (branchResult.success) {
                    setBranches(branchResult.branches || []);
                }
            } else {
                setIsRepo(false);
            }
        } catch (error) {
            console.error('Git status error:', error);
        }
        setLoading(false);
    };

    const stageFile = async (filePath: string) => {
        if (!rootPath || !window.electronAPI) return;
        await window.electronAPI.gitStage(rootPath, [filePath]);
        setStagedFiles(prev => [...prev, filePath]);
        checkGitStatus();
    };

    const unstageFile = async (filePath: string) => {
        if (!rootPath || !window.electronAPI) return;
        await window.electronAPI.gitUnstage(rootPath, [filePath]);
        setStagedFiles(prev => prev.filter(f => f !== filePath));
        checkGitStatus();
    };

    const stageAll = async () => {
        if (!rootPath || !window.electronAPI) return;
        const allPaths = files.map(f => f.path);
        await window.electronAPI.gitStage(rootPath, allPaths);
        setStagedFiles(allPaths);
        checkGitStatus();
    };

    const commit = async () => {
        if (!commitMessage.trim() || !rootPath || !window.electronAPI) return;

        await window.electronAPI.gitCommit(rootPath, commitMessage);
        setCommitMessage('');
        setStagedFiles([]);
        checkGitStatus();
    };

    const checkoutBranch = async (branchName: string) => {
        if (!rootPath || !window.electronAPI) return;
        await window.electronAPI.gitCheckout(rootPath, branchName);
        setBranch(branchName);
        setShowBranches(false);
        checkGitStatus();
    };

    const initRepo = async () => {
        if (!rootPath || !window.electronAPI) return;
        await window.electronAPI.gitInit(rootPath);
        checkGitStatus();
    };

    const getStatusIcon = (file: GitFile) => {
        const status = file.index || file.working_dir;
        switch (status) {
            case 'M': return <span className="text-amber-400 text-[10px] font-bold">M</span>;
            case 'A': return <span className="text-green-400 text-[10px] font-bold">A</span>;
            case 'D': return <span className="text-red-400 text-[10px] font-bold">D</span>;
            case '?': return <span className="text-gray-400 text-[10px] font-bold">U</span>;
            default: return <span className="text-gray-400 text-[10px] font-bold">{status}</span>;
        }
    };

    if (!rootPath) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <GitBranch size={32} className="text-[#3f3f46] mb-3" />
                <p className="text-xs text-[#71717a] mb-2">No folder open</p>
                <p className="text-[10px] text-[#52525b]">Open a folder to use source control</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="loading-dots"><span /><span /><span /></div>
            </div>
        );
    }

    if (!isRepo) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <FolderGit size={32} className="text-[#3f3f46] mb-3" />
                <p className="text-xs text-[#71717a] mb-3">Not a git repository</p>
                <button onClick={initRepo} className="btn-primary py-2 px-4 text-xs">
                    Initialize Repository
                </button>
            </div>
        );
    }

    const unstagedFiles = files.filter(f => !stagedFiles.includes(f.path));
    const staged = files.filter(f => stagedFiles.includes(f.path));

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 flex items-center justify-between border-b border-[#27272a]">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Source Control</span>
                <button onClick={checkGitStatus} className="p-1 text-[#71717a] hover:text-white transition-colors">
                    <RefreshCw size={12} />
                </button>
            </div>

            {/* Branch */}
            <div className="px-3 py-2 border-b border-[#27272a] relative">
                <button
                    onClick={() => setShowBranches(!showBranches)}
                    className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-white transition-colors"
                >
                    <GitBranch size={14} />
                    <span>{branch}</span>
                    <ChevronDown size={12} />
                </button>

                {showBranches && (
                    <div className="absolute top-full left-0 right-0 mt-1 mx-2 bg-[#252526] border border-[#454545] rounded-lg shadow-xl z-10 max-h-40 overflow-auto">
                        {branches.map(b => (
                            <button
                                key={b}
                                onClick={() => checkoutBranch(b)}
                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#094771] ${b === branch ? 'text-purple-400' : 'text-[#d4d4d4]'}`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Commit Message */}
            <div className="p-3 border-b border-[#27272a]">
                <textarea
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Commit message..."
                    className="textarea h-16 text-xs"
                />
                <button
                    onClick={commit}
                    disabled={!commitMessage.trim() || staged.length === 0}
                    className="btn-primary w-full py-2 mt-2 text-xs"
                >
                    <Check size={14} />
                    Commit ({staged.length})
                </button>
            </div>

            {/* Changes */}
            <div className="flex-1 overflow-auto">
                {/* Staged */}
                {staged.length > 0 && (
                    <div>
                        <div className="px-3 py-2 flex items-center justify-between bg-[#18181b]">
                            <span className="text-[10px] font-medium text-[#71717a]">STAGED ({staged.length})</span>
                            <button onClick={() => setStagedFiles([])} className="p-1 text-[#52525b] hover:text-white" title="Unstage All">
                                <Minus size={12} />
                            </button>
                        </div>
                        {staged.map(file => (
                            <div key={file.path} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#18181b] group">
                                <FileText size={14} className="text-[#52525b]" />
                                <span className="flex-1 text-xs text-[#a1a1aa] truncate">{file.path.split('/').pop()}</span>
                                {getStatusIcon(file)}
                                <button onClick={() => unstageFile(file.path)} className="opacity-0 group-hover:opacity-100 p-1">
                                    <Minus size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Unstaged */}
                {unstagedFiles.length > 0 && (
                    <div>
                        <div className="px-3 py-2 flex items-center justify-between bg-[#18181b]">
                            <span className="text-[10px] font-medium text-[#71717a]">CHANGES ({unstagedFiles.length})</span>
                            <button onClick={stageAll} className="p-1 text-[#52525b] hover:text-white" title="Stage All">
                                <Plus size={12} />
                            </button>
                        </div>
                        {unstagedFiles.map(file => (
                            <div key={file.path} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#18181b] group">
                                <FileText size={14} className="text-[#52525b]" />
                                <span className="flex-1 text-xs text-[#a1a1aa] truncate">{file.path.split('/').pop()}</span>
                                {getStatusIcon(file)}
                                <button onClick={() => stageFile(file.path)} className="opacity-0 group-hover:opacity-100 p-1">
                                    <Plus size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {files.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Check size={24} className="text-green-500 mb-2" />
                        <p className="text-xs text-[#71717a]">No changes</p>
                    </div>
                )}
            </div>
        </div>
    );
}
