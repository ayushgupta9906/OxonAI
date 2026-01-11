import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    path: string;
    onNavigate: (path: string) => void;
}

export default function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
    const parts = path.split(/[\\/]/).filter(Boolean);

    const buildPath = (index: number) => {
        return parts.slice(0, index + 1).join('/');
    };

    return (
        <div className="flex items-center gap-1 px-3 py-1 bg-[#252526] border-b border-[#3c3c3c] text-xs text-[#9d9d9d] overflow-x-auto hide-scrollbar">
            {parts.map((part, index) => (
                <div key={index} className="flex items-center gap-1 flex-shrink-0">
                    {index > 0 && <ChevronRight size={12} className="text-[#5a5a5a]" />}
                    <button
                        onClick={() => onNavigate(buildPath(index))}
                        className={`hover:text-white transition-colors ${index === parts.length - 1 ? 'text-white' : ''
                            }`}
                    >
                        {part}
                    </button>
                </div>
            ))}
        </div>
    );
}
