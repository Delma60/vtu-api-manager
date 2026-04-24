import DocsTableOfContents from '@/components/docs-table-of-contents';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, BookOpen, Code2, KeyRound, Menu, Settings, Shield, Terminal, X, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface DocsLayoutProps {
    children: React.ReactNode;
    title: string;
    currentPath: string;
    nextPage?: { title: string; path: string };
    previousPage?: { title: string; path: string };
}

export default function DocsLayout({ children, title, currentPath, nextPage, previousPage }: DocsLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const links = [
        {
            title: 'Getting Started',
            icon: BookOpen,
            sublinks: [
                { title: 'Introduction', path: '/docs/introduction', icon: BookOpen },
                { title: 'Quick Start', path: '/docs/quick-start', icon: Zap },
            ],
        },
        {
            title: 'Authentication & Security',
            icon: Shield,
            sublinks: [
                { title: 'Authentication', path: '/docs/authentication', icon: Code2 },
                { title: 'API Keys', path: '/docs/api-keys', icon: Settings },
            ],
        },
        {
            title: 'Endpoints',
            icon: Terminal,
            sublinks: [
                { title: 'Buy Airtime', path: '/docs/airtime', icon: Terminal },
                { title: 'Buy Data', path: '/docs/data', icon: Terminal },
                { title: 'Data Bundles', path: '/docs/data-plans', icon: Terminal },
                { title: 'Cable TV', path: '/docs/cable', icon: Terminal },
                { title: 'Utilities', path: '/docs/utilities', icon: Terminal },
                { title: 'PINs & Vouchers', url: route("docs.pins"), icon: KeyRound },
            ],
        },
    ];

    const allLinks = links.flatMap((section) => section.sublinks || []);
    const currentIndex = allLinks.findIndex((link) => link.path === currentPath);
    const prevPage = previousPage || (currentIndex > 0 ? allLinks[currentIndex - 1] : null);
    const nextPageLink = nextPage || (currentIndex < allLinks.length - 1 ? allLinks[currentIndex + 1] : null);

    return (
        <div className="scroll-smooth">
            <Head title={`${title} - API Docs`} />

            {/* UPGRADED BACKGROUND: Gradient + Subtle CSS Grid Pattern */}
            <div className="fixed inset-0 -z-20 bg-slate-950"></div>
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/80 to-slate-950"></div>
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="relative mx-auto flex min-h-screen max-w-screen-2xl">
                {/* MOBILE OVERLAY */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`fixed top-0 left-0 z-40 h-screen w-72 transform border-r border-slate-800/40 bg-slate-950/50 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* customized scrollbar class can be added here */}
                    <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800 h-full space-y-6 overflow-y-auto p-6">
                        {/* Close button for mobile */}
                        <div className="mb-4 flex items-center justify-between lg:hidden">
                            <span className="text-sm font-bold text-white">Menu</span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Sidebar Header */}
                        <div>
                            <p className="mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase">📚 Documentation</p>
                        </div>

                        {/* Navigation Sections */}
                        <nav className="space-y-8">
                            {links.map((section) => (
                                <div key={section.title}>
                                    <div className="mb-3 flex items-center gap-2">
                                        {section.icon && <section.icon className="h-4 w-4 text-indigo-400/80" />}
                                        <h4 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">{section.title}</h4>
                                    </div>
                                    <ul className="ml-2 space-y-1 border-l-2 border-slate-800/30 pl-4">
                                        {section.sublinks?.map((link) => {
                                            const isActive = currentPath === link.path;
                                            return (
                                                <li key={link.path}>
                                                    <Link
                                                        href={link.path}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={`relative block rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                                            isActive
                                                                ? 'bg-indigo-500/10 text-indigo-300'
                                                                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                                                        }`}
                                                    >
                                                        {isActive && (
                                                            <span className="absolute top-1/2 -left-[19px] h-5 w-[2px] -translate-y-1/2 rounded-r bg-indigo-500" />
                                                        )}
                                                        {link.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>
                {/* MAIN CONTENT */}

                <main className="flex min-w-0 flex-1 flex-col xl:pr-72">
                    {/* Top Bar */}
                    <div className="sticky top-0 z-20 border-b border-slate-800/30 bg-slate-950/70 px-6 py-3 backdrop-blur-xl lg:px-12">
                        <div className="mx-auto flex max-w-7xl items-center justify-between">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-slate-400 transition-colors hover:text-white lg:hidden"
                            >
                                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                            <h1 className="text-sm font-semibold text-slate-300">{title}</h1>
                            <div className="w-6" /> {/* Placeholder for alignment */}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 px-6 py-12 lg:px-12">
                        {/* You can increase max-w-3xl to max-w-4xl if the text feels too squeezed now */}
                        <div className="mx-auto max-w-4xl">
                            {/* Custom prose styles */}
                            <div className="prose prose-invert prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-5xl prose-h1:mb-2 prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800/30 prose-h2:pb-2 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-strong:text-slate-100 prose-strong:font-semibold prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-emerald-300 prose-pre:bg-slate-950/50 prose-pre:border prose-pre:border-slate-800 prose-blockquote:border-l-indigo-400 prose-blockquote:text-slate-300 prose-hr:border-slate-800/30 max-w-none">
                                {children}
                            </div>

                            {/* Navigation Footer */}
                            {/* ... (Keep your existing footer code here) ... */}
                            <div className="mt-12 flex items-center justify-between border-t border-slate-800/30 pt-6">
                                {prevPage ? (
                                    <Link
                                        href={prevPage.path}
                                        className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        {prevPage.title}
                                    </Link>
                                ) : (
                                    <div />
                                )}
                                {nextPageLink ? (
                                    <Link
                                        href={nextPageLink.path}
                                        className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
                                    >
                                        {nextPageLink.title}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* TABLE OF CONTENTS */}
                <DocsTableOfContents />
            </div>
        </div>
    );
}
