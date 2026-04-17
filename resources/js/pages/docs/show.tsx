import React from 'react';
import { Head } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DocsLayout from '@/layouts/docs-layout';
import CodeBlock from '@/components/code-block';
import Callout from '@/components/docs-callout';

const customComponents = {
    code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-md border border-slate-800"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code className="bg-slate-800/50 text-emerald-300 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
            </code>
        );
    },
    h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold text-white mb-2">{children}</h1>
    ),
    h2: ({ children }: any) => (
        <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800/30 pb-2">{children}</h2>
    ),
    h3: ({ children }: any) => (
        <h3 className="text-lg font-bold text-white mt-6 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-indigo-400 pl-4 italic text-slate-300">{children}</blockquote>
    ),
    ul: ({ children }: any) => (
        <ul className="space-y-2 ml-4 list-disc text-slate-300">{children}</ul>
    ),
    ol: ({ children }: any) => (
        <ol className="space-y-2 ml-6 list-decimal text-slate-300">{children}</ol>
    ),
    a: ({ href, children }: any) => (
        <a href={href} className="text-indigo-400 hover:text-indigo-300 underline">{children}</a>
    ),
};

export default function DocumentationPage({ title, content, currentSlug }: any) {
    // Extract the path from currentSlug to match the DocsLayout currentPath format
    const currentPath = `/docs/${currentSlug}`;

    return (
        <DocsLayout title={title} currentPath={currentPath}>
            <Head title={`${title} - API Documentation`} />
            
            <ReactMarkdown components={customComponents}>
                {content}
            </ReactMarkdown>
        </DocsLayout>
    );
}