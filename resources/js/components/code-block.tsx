import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ language, code }: { language: string, code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] shadow-xl">
            {/* Sleek Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? <span className="text-emerald-400">Copied!</span> : <span>Copy</span>}
                </button>
            </div>
            {/* Code Content */}
            <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={language}
                customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '0.875rem' }}
            >
                {code.trim()}
            </SyntaxHighlighter>
        </div>
    );
}
