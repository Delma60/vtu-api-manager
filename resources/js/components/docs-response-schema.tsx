import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ResponseField {
    name: string;
    type: string;
    description: string;
    children?: ResponseField[];
}

interface DocsResponseSchemaProps {
    title?: string;
    fields: ResponseField[];
}

function ResponseFieldRow({ field, level = 0 }: { field: ResponseField; level?: number }) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = field.children && field.children.length > 0;

    return (
        <>
            <tr className="border-b border-slate-800/30 transition-colors hover:bg-slate-800/20">
                <td className="px-4 py-3" style={{ paddingLeft: `${1 + level}rem` }}>
                    <div className="flex items-center gap-2">
                        {hasChildren && (
                            <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-300">
                                <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? '' : '-rotate-90'}`} />
                            </button>
                        )}
                        {!hasChildren && <div className="w-4" />}
                        <span className="font-mono text-emerald-300">{field.name}</span>
                    </div>
                </td>
                <td className="px-4 py-3 font-mono text-blue-300">{field.type}</td>
                <td className="px-4 py-3 text-slate-300">{field.description}</td>
            </tr>
            {expanded && field.children && field.children.map((child, index) => <ResponseFieldRow key={index} field={child} level={level + 1} />)}
        </>
    );
}

export default function DocsResponseSchema({ title = 'Response Schema', fields }: DocsResponseSchemaProps) {
    return (
        <div className="not-prose my-6">
            <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800/50 bg-slate-900/50">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800/50 bg-slate-800/30">
                            <th className="px-4 py-3 text-left font-semibold text-slate-300">Field</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-300">Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-300">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                            <ResponseFieldRow key={index} field={field} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
