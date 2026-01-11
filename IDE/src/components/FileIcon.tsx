import { Folder, FolderOpen, FileText, File, Code, FileJson, FileType, Image, Video, Music, Archive, Database, Settings, Terminal } from 'lucide-react';

type FileIconType = 'file' | 'folder' | 'folder-open' |
    'ts' | 'tsx' | 'js' | 'jsx' | 'json' | 'html' | 'css' | 'scss' |
    'md' | 'py' | 'go' | 'rs' | 'java' | 'c' | 'cpp' | 'rb' | 'php' |
    'sql' | 'sh' | 'yml' | 'xml' | 'svg' | 'png' | 'jpg' | 'gif' |
    'mp4' | 'mp3' | 'zip' | 'tar' | 'db' | 'env' | 'gitignore' | 'dockerfile' | 'lock';

interface FileIconProps {
    name: string;
    isDirectory?: boolean;
    isOpen?: boolean;
    size?: number;
}

const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
    ts: { icon: '🔷', color: '#3178c6' },
    tsx: { icon: '⚛️', color: '#61dafb' },
    js: { icon: '🟨', color: '#f7df1e' },
    jsx: { icon: '⚛️', color: '#61dafb' },
    json: { icon: '📦', color: '#cbcb41' },
    html: { icon: '🌐', color: '#e34c26' },
    css: { icon: '🎨', color: '#1572b6' },
    scss: { icon: '🎨', color: '#c6538c' },
    md: { icon: '📝', color: '#519aba' },
    py: { icon: '🐍', color: '#3572A5' },
    go: { icon: '🔵', color: '#00ADD8' },
    rs: { icon: '🦀', color: '#dea584' },
    java: { icon: '☕', color: '#b07219' },
    c: { icon: '©️', color: '#555555' },
    cpp: { icon: '🔷', color: '#f34b7d' },
    rb: { icon: '💎', color: '#701516' },
    php: { icon: '🐘', color: '#4F5D95' },
    sql: { icon: '🗄️', color: '#e38c00' },
    sh: { icon: '💻', color: '#89e051' },
    bash: { icon: '💻', color: '#89e051' },
    yml: { icon: '⚙️', color: '#cb171e' },
    yaml: { icon: '⚙️', color: '#cb171e' },
    xml: { icon: '📄', color: '#e44d26' },
    svg: { icon: '🖼️', color: '#ffb13b' },
    png: { icon: '🖼️', color: '#a074c4' },
    jpg: { icon: '🖼️', color: '#a074c4' },
    jpeg: { icon: '🖼️', color: '#a074c4' },
    gif: { icon: '🖼️', color: '#a074c4' },
    mp4: { icon: '🎬', color: '#9b59b6' },
    mp3: { icon: '🎵', color: '#e74c3c' },
    zip: { icon: '📦', color: '#f39c12' },
    tar: { icon: '📦', color: '#f39c12' },
    gz: { icon: '📦', color: '#f39c12' },
    db: { icon: '🗃️', color: '#3498db' },
    sqlite: { icon: '🗃️', color: '#3498db' },
    env: { icon: '🔐', color: '#ecd53f' },
    gitignore: { icon: '🚫', color: '#f05032' },
    dockerfile: { icon: '🐳', color: '#2496ed' },
    lock: { icon: '🔒', color: '#8e44ad' },
};

const specialFiles: Record<string, { icon: string; color: string }> = {
    'package.json': { icon: '📦', color: '#cb3837' },
    'package-lock.json': { icon: '🔒', color: '#cb3837' },
    'tsconfig.json': { icon: '🔷', color: '#3178c6' },
    'tailwind.config.js': { icon: '💨', color: '#38bdf8' },
    'vite.config.ts': { icon: '⚡', color: '#646cff' },
    'next.config.js': { icon: '▲', color: '#000000' },
    '.gitignore': { icon: '🚫', color: '#f05032' },
    '.env': { icon: '🔐', color: '#ecd53f' },
    '.env.local': { icon: '🔐', color: '#ecd53f' },
    'README.md': { icon: '📖', color: '#519aba' },
    'LICENSE': { icon: '📜', color: '#97ca00' },
    'Dockerfile': { icon: '🐳', color: '#2496ed' },
    'docker-compose.yml': { icon: '🐳', color: '#2496ed' },
};

export default function FileIcon({ name, isDirectory, isOpen, size = 16 }: FileIconProps) {
    if (isDirectory) {
        const IconComponent = isOpen ? FolderOpen : Folder;
        return <IconComponent size={size} className="text-amber-400" />;
    }

    // Check special files first
    const lowerName = name.toLowerCase();
    if (specialFiles[name] || specialFiles[lowerName]) {
        const special = specialFiles[name] || specialFiles[lowerName];
        return <span style={{ fontSize: size * 0.9 }}>{special.icon}</span>;
    }

    // Check by extension
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const iconInfo = iconMap[ext];

    if (iconInfo) {
        return <span style={{ fontSize: size * 0.9 }}>{iconInfo.icon}</span>;
    }

    return <File size={size} className="text-[#71717a]" />;
}
