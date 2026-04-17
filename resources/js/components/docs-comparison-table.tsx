import { CheckCircle, XCircle } from 'lucide-react';

interface ComparisonRow {
    feature: string;
    [key: string]: string | boolean | undefined;
}

interface DocsComparisonTableProps {
    title?: string;
    columns: string[];
    rows: ComparisonRow[];
}

export default function DocsComparisonTable({ title, columns, rows }: DocsComparisonTableProps) {
    return (
        <div className="not-prose my-6">
            {title && <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>}
            <div className="overflow-x-auto rounded-lg border border-slate-800/50 bg-slate-900/50">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800/50 bg-slate-800/30">
                            <th className="px-4 py-3 text-left font-semibold text-slate-300">Feature</th>
                            {columns.map((col) => (
                                <th key={col} className="px-4 py-3 text-center font-semibold whitespace-nowrap text-slate-300">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-800/30 transition-colors hover:bg-slate-800/20">
                                <td className="px-4 py-3 font-medium text-slate-300">{row.feature}</td>
                                {columns.map((col) => {
                                    const value = row[col];
                                    return (
                                        <td key={col} className="px-4 py-3 text-center">
                                            {typeof value === 'boolean' ? (
                                                value ? (
                                                    <CheckCircle className="mx-auto h-5 w-5 text-emerald-400" />
                                                ) : (
                                                    <XCircle className="mx-auto h-5 w-5 text-slate-500" />
                                                )
                                            ) : (
                                                <span className="text-slate-300">{value || '-'}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
