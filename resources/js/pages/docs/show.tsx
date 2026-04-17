import React from 'react';
import { Head } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DocsLayout from '@/layouts/docs-layout';

// Generate safe IDs for deep linking (e.g. "Core Capabilities" -> "core-capabilities")
const generateId = (text: string) => {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const customComponents = {
    code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <div className="relative group my-6">
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 blur transition duration-500 group-hover:opacity-100"></div>
                <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="relative rounded-lg border border-slate-700/50 shadow-xl !bg-slate-900/80 backdrop-blur-sm"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded-md text-[0.875em] border border-slate-700 font-mono" {...props}>
                {children}
            </code>
        );
    },
    h1: ({ children }: any) => (
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">{children}</h1>
    ),
    h2: ({ children }: any) => {
        const id = generateId(children);
        return (
            <h2 id={id} className="group relative text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800/50 pb-3 scroll-mt-28">
                <a href={`#${id}`} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity">#</a>
                {children}
            </h2>
        );
    },
    h3: ({ children }: any) => {
        const id = generateId(children);
        return (
            <h3 id={id} className="group relative text-lg font-bold text-white mt-8 mb-3 scroll-mt-28">
                <a href={`#${id}`} className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-opacity">#</a>
                {children}
            </h3>
        );
    },
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-indigo-500 bg-indigo-500/10 py-3 pr-4 pl-5 rounded-r-lg italic text-slate-300 my-6 shadow-inner">{children}</blockquote>
    ),
    ul: ({ children }: any) => (
        <ul className="space-y-2 ml-4 list-disc text-slate-300 marker:text-slate-500 my-4">{children}</ul>
    ),
    a: ({ href, children }: any) => (
        <a href={href} className="font-medium text-indigo-400 hover:text-indigo-300 decoration-indigo-400/30 underline-offset-4 hover:decoration-indigo-300 underline transition-all">{children}</a>
    ),
};

export default function DocumentationPage({ title, content, currentSlug }: any) {
    const currentPath = `/docs/${currentSlug}`;

    return (
        <DocsLayout title={title} currentPath={currentPath}>
            <ReactMarkdown components={customComponents}>
                {content}
            </ReactMarkdown>
        </DocsLayout>
    );
}