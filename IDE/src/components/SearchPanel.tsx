import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchPanelProps {
    onFileSelect: (path: string) => void;
}

interface SearchResult {
    path: string;
    name: string;
    line: number;
    content: string;
}

export default function SearchPanel({ onFileSelect }: SearchPanelProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Simple search - in a real app, this would search file contents
    const handleSearch = async () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        // Simulated search delay
        setTimeout(() => {
            setResults([]);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        const timeout = setTimeout(handleSearch, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-[#27272a]">
                <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Search</span>
            </div>

            {/* Search Input */}
            <div className="p-3">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search files..."
                        className="w-full pl-9 pr-8 py-2 bg-[#0f0f12] border border-[#27272a] rounded-lg text-sm text-white placeholder-[#52525b] focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#52525b] hover:text-white transition-colors"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto px-3">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="loading-dots"><span /><span /><span /></div>
                    </div>
                ) : query && results.length === 0 ? (
                    <div className="text-center py-8 text-[#52525b] text-sm">
                        <p>No results found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-1">
                        {results.map((result, i) => (
                            <button
                                key={i}
                                onClick={() => onFileSelect(result.path)}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#2d2d30] transition-colors"
                            >
                                <p className="text-sm text-white truncate">{result.name}</p>
                                <p className="text-xs text-[#52525b] truncate">Line {result.line}: {result.content}</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-[#52525b] text-xs">
                        <p>Enter a search term to find files</p>
                    </div>
                )}
            </div>
        </div>
    );
}
