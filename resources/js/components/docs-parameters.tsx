interface Parameter {
    name: string;
    type: string;
    required?: boolean;
    description: string;
    example?: string;
}

interface DocsParametersProps {
    title?: string;
    parameters: Parameter[];
}

export default function DocsParameters({ title = 'Parameters', parameters }: DocsParametersProps) {
    return (
        <div className="not-prose my-6">
            <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800/50 bg-slate-900/50">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800/50 bg-slate-800/30">
                            <th className="px-4 py-3 text-left font-semibold text-slate-300">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-300">Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-300">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parameters.map((param, index) => (
                            <tr key={index} className="border-b border-slate-800/30 transition-colors hover:bg-slate-800/20">
                                <td className="px-4 py-3 font-mono text-emerald-300">
                                    <div className="flex items-center gap-2">
                                        {param.name}
                                        {param.required && (
                                            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-400">required</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-blue-300">{param.type}</td>
                                <td className="px-4 py-3 text-slate-300">
                                    <div>{param.description}</div>
                                    {param.example && (
                                        <div className="mt-1 text-xs text-slate-500">
                                            Example: <span className="font-mono text-slate-400">{param.example}</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
