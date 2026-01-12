import { TableData } from '../../types';

interface TableProps {
    data: TableData;
}

export default function Table({ data }: TableProps) {
    if (!data || !data.headers || !data.rows) return null;

    return (
        <div className="my-4 border border-[#27272a] rounded-lg overflow-hidden bg-[#09090b]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-[#18181b] border-b border-[#27272a]">
                            {data.headers.map((header, i) => (
                                <th key={i} className="px-3 py-2 font-semibold text-[#71717a] uppercase tracking-wider whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1f]">
                        {data.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-[#18181b]/50 transition-colors">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-3 py-2 text-[#a1a1aa]">
                                        {typeof cell === 'boolean' ? (cell ? '✅' : '❌') : String(cell)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
