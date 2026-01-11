import { useState, useEffect } from 'react';
import { Package, Download, Trash2, Settings, Star, Check } from 'lucide-react';

interface Extension {
    id: string;
    name: string;
    publisher: string;
    description: string;
    version: string;
    installed: boolean;
    stars: number;
    downloads: string;
    icon: string;
}

const marketplaceExtensions: Extension[] = [
    { id: 'python', name: 'Python', publisher: 'Microsoft', description: 'Python language support with IntelliSense, linting, debugging', version: '2024.1.0', installed: false, stars: 4.8, downloads: '112M', icon: '🐍' },
    { id: 'prettier', name: 'Prettier', publisher: 'Prettier', description: 'Code formatter using prettier', version: '10.1.0', installed: false, stars: 4.9, downloads: '45M', icon: '🎨' },
    { id: 'eslint', name: 'ESLint', publisher: 'Microsoft', description: 'Integrates ESLint JavaScript into VS Code', version: '3.0.5', installed: false, stars: 4.7, downloads: '38M', icon: '📦' },
    { id: 'gitlens', name: 'GitLens', publisher: 'GitKraken', description: 'Supercharge Git within VS Code', version: '15.0.0', installed: false, stars: 4.9, downloads: '32M', icon: '🔍' },
    { id: 'copilot', name: 'GitHub Copilot', publisher: 'GitHub', description: 'AI pair programmer', version: '1.150.0', installed: false, stars: 4.6, downloads: '28M', icon: '🤖' },
    { id: 'tailwind', name: 'Tailwind CSS IntelliSense', publisher: 'Tailwind Labs', description: 'Intelligent Tailwind CSS tooling', version: '0.12.0', installed: false, stars: 4.8, downloads: '15M', icon: '💨' },
    { id: 'docker', name: 'Docker', publisher: 'Microsoft', description: 'Makes it easy to create, manage, and debug containers', version: '1.28.0', installed: false, stars: 4.7, downloads: '22M', icon: '🐳' },
    { id: 'thunder', name: 'Thunder Client', publisher: 'Thunder Client', description: 'Lightweight Rest API Client', version: '2.20.0', installed: false, stars: 4.9, downloads: '8M', icon: '⚡' },
];

export default function ExtensionsPanel() {
    const [extensions, setExtensions] = useState<Extension[]>(marketplaceExtensions);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'installed'>('all');
    const [loading, setLoading] = useState<string | null>(null);

    useEffect(() => {
        loadInstalledExtensions();
    }, []);

    const loadInstalledExtensions = async () => {
        if (!window.electronAPI) return;

        const installed = await window.electronAPI.getInstalledExtensions();
        const installedIds = installed.map((e: any) => e.id);

        setExtensions(prev => prev.map(ext => ({
            ...ext,
            installed: installedIds.includes(ext.id)
        })));
    };

    const filteredExtensions = extensions.filter(ext => {
        const matchesSearch = ext.name.toLowerCase().includes(search.toLowerCase()) ||
            ext.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || ext.installed;
        return matchesSearch && matchesFilter;
    });

    const toggleInstall = async (ext: Extension) => {
        if (!window.electronAPI) return;

        setLoading(ext.id);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));

        if (ext.installed) {
            await window.electronAPI.uninstallExtension(ext.id);
        } else {
            await window.electronAPI.installExtension(ext);
        }

        setExtensions(prev => prev.map(e =>
            e.id === ext.id ? { ...e, installed: !e.installed } : e
        ));

        setLoading(null);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-[#27272a]">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Extensions</span>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-[#27272a]">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search extensions..."
                    className="w-full px-3 py-2 bg-[#0f0f12] border border-[#27272a] rounded-lg text-sm text-white placeholder-[#52525b] focus:border-purple-500 focus:outline-none transition-colors"
                />
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${filter === 'all' ? 'bg-purple-500/20 text-purple-400' : 'text-[#71717a] hover:text-white'
                            }`}
                    >
                        Marketplace
                    </button>
                    <button
                        onClick={() => setFilter('installed')}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${filter === 'installed' ? 'bg-purple-500/20 text-purple-400' : 'text-[#71717a] hover:text-white'
                            }`}
                    >
                        Installed ({extensions.filter(e => e.installed).length})
                    </button>
                </div>
            </div>

            {/* Extensions List */}
            <div className="flex-1 overflow-auto">
                {filteredExtensions.map(ext => (
                    <div key={ext.id} className="p-3 border-b border-[#27272a] hover:bg-[#18181b] transition-colors group">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center text-xl flex-shrink-0">
                                {ext.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium text-white truncate">{ext.name}</h3>
                                    {ext.installed && (
                                        <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <Check size={8} /> Installed
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-[#52525b]">{ext.publisher} • v{ext.version}</p>
                                <p className="text-xs text-[#71717a] mt-1 line-clamp-1">{ext.description}</p>
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-[#52525b]">
                                    <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" /> {ext.stars}</span>
                                    <span className="flex items-center gap-1"><Download size={10} /> {ext.downloads}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => toggleInstall(ext)}
                                    disabled={loading === ext.id}
                                    className={`p-2 rounded-lg transition-colors ${loading === ext.id
                                            ? 'opacity-50'
                                            : ext.installed
                                                ? 'text-red-400 hover:bg-red-400/10'
                                                : 'text-green-400 hover:bg-green-400/10'
                                        }`}
                                    title={ext.installed ? 'Uninstall' : 'Install'}
                                >
                                    {loading === ext.id ? (
                                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : ext.installed ? (
                                        <Trash2 size={14} />
                                    ) : (
                                        <Download size={14} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
