import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ApiEndpointProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    description?: string;
}

export default function ApiEndpoint({ method, endpoint, description }: ApiEndpointProps) {
    const [copied, setCopied] = useState(false);

    const colors = {
        GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        POST: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        PATCH: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(endpoint);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="not-prose my-4 overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/50">
            <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className={`flex-shrink-0 rounded border px-3 py-1 text-sm font-bold tracking-wider ${colors[method]}`}>{method}</span>
                    <span className="truncate font-mono text-sm text-slate-300">{endpoint}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className={`flex-shrink-0 rounded p-2 transition-all ${
                        copied ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                    title="Copy endpoint"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            {description && <div className="border-t border-slate-800/30 px-4 pb-4 text-sm text-slate-400">{description}</div>}
        </div>
    );
}
