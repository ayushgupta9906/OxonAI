import { GitBranch, AlertCircle, CheckCircle, Wifi, Bell } from 'lucide-react';

interface StatusBarProps {
    currentFile: string | null;
    line?: number;
    column?: number;
}

export default function StatusBar({ currentFile, line = 1, column = 1 }: StatusBarProps) {
    const language = currentFile ? getLanguageLabel(currentFile) : 'Plain Text';

    return (
        <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-xs text-white select-none">
            {/* Left */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <GitBranch size={12} />
                    <span>main</span>
                </div>
                <div className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    <span>0 Problems</span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <span>Ln {line}, Col {column}</span>
                <span>{language}</span>
                <span>UTF-8</span>
                <div className="flex items-center gap-1">
                    <Wifi size={12} />
                    <span>Connected</span>
                </div>
                <Bell size={12} className="cursor-pointer hover:opacity-80" />
            </div>
        </div>
    );
}

function getLanguageLabel(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const labels: Record<string, string> = {
        js: 'JavaScript',
        jsx: 'JavaScript React',
        ts: 'TypeScript',
        tsx: 'TypeScript React',
        py: 'Python',
        json: 'JSON',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        md: 'Markdown',
        sql: 'SQL',
        go: 'Go',
        rs: 'Rust',
        java: 'Java',
    };
    return labels[ext] || 'Plain Text';
}
