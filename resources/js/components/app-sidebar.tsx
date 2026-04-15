import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Sidebar() {
    // Mock state for active tab and environment mode
    const { props, url } = usePage();
    const providerDownCount = props?.provider_down_count ?? 0;
    // const tab = url.includes();
    const [activeTab, setActiveTab] = useState(url);
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>(['pricing']);

    const handleChange = (tabName: string) => {
        setActiveTab(tabName);
        router.visit(tabName);
    };

    const toggleExpanded = (itemName: string) => {
        setExpandedItems((prev) => (prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]));
    };

    return (
        <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#0f172a] font-sans transition-all selection:bg-indigo-500 selection:text-white">
            {/* 1. Header & Logo */}
            <div className="flex h-16 shrink-0 items-center border-b border-slate-800/60 px-6">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30"></div>
                    <span className="text-lg font-bold tracking-tight text-white">NexusVTU</span>
                </div>
            </div>

            {/* 2. Environment Toggle (Test / Live) */}
            <div className="shrink-0 px-4 py-5">
                <button
                    onClick={() => setIsLiveMode(!isLiveMode)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-900 p-1"
                >
                    <div
                        className={`flex-1 rounded-md py-1.5 text-center text-xs font-semibold transition-all ${!isLiveMode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                        Test
                    </div>
                    <div
                        className={`flex-1 rounded-md py-1.5 text-center text-xs font-semibold transition-all ${isLiveMode ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                        Live
                    </div>
                </button>
            </div>

            {/* 3. Navigation Links */}
            <nav className="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-4 pb-8">
                {/* Core Menu */}
                <div className="space-y-1">
                    <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">Overview</p>

                    <NavItem
                        isActive={activeTab.includes('/dashboard')}
                        onClick={() => handleChange('/dashboard')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        }
                        label="Dashboard"
                    />
                    <NavItem
                        isActive={activeTab.includes('/transactions')}
                        onClick={() => handleChange('/transactions')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        }
                        label="Transactions"
                    />
                    <NavItem
                        isActive={activeTab.includes('/customers')}
                        onClick={() => handleChange('/customers')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 9v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1"
                            />
                        }
                        label="Customers"
                    />
                    <NavItem
                        isActive={activeTab.includes('/wallets')}
                        onClick={() => handleChange('/wallets')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        }
                        label="Wallets & Balances"
                    />
                </div>

                {/* Infrastructure Menu */}
                <div className="space-y-1">
                    <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">Infrastructure</p>
                    <NavItem
                        isActive={activeTab.includes('/providers')}
                        onClick={() => handleChange('/providers')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        }
                        label="API Providers"
                        badge={`${providerDownCount} Down`}
                    />
                    <NavItemWithChildren
                        isExpanded={expandedItems.includes('pricing')}
                        onToggle={() => toggleExpanded('pricing')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        }
                        label="Pricing & Margins"
                        children={[
                            { label: 'Airtime & Data', id: 'pricing/airtime-data' },
                            // { label: 'Data', id: 'pricing-data' },
                            { label: 'Cable', id: 'pricing-cable' },
                            { label: 'Bill Payments', id: 'pricing-bill' },
                        ]}
                        activeTab={activeTab}
                        onChildClick={(id) => handleChange(id)}
                    />
                </div>

                {/* Developer Menu */}
                <div className="space-y-1">
                    <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">Developers</p>
                    <NavItem
                        isActive={activeTab === 'apikeys'}
                        onClick={() => setActiveTab('apikeys')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        }
                        label="API Keys"
                    />
                    <NavItem
                        isActive={activeTab === 'webhooks'}
                        onClick={() => setActiveTab('webhooks')}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                        label="Webhooks"
                    />
                    <NavItem
                        isActive={activeTab === 'logs'}
                        onClick={() => setActiveTab('logs')}
                        icon={
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        }
                        label="API Logs"
                    />
                </div>
            </nav>

            {/* 4. User Profile Footer */}
            <div className="shrink-0 border-t border-slate-800/60 p-4">
                <button className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-800/50">
                    <Avatar>
                        <AvatarFallback>
                            {props?.auth?.user?.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .toUpperCase()}
                        </AvatarFallback>
                        <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(props?.auth?.user?.name || 'User')}&background=0f172a&color=ffffff&size=128`}
                            alt={props?.auth?.user?.name}
                        />
                    </Avatar>
                    <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-medium text-white">{props?.auth?.user?.name}</p>
                        <p className="truncate text-xs text-slate-500">{props?.auth?.user?.email}</p>
                    </div>
                    <svg
                        className="h-5 w-5 text-slate-500 transition-colors group-hover:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </button>
            </div>
        </aside>
    );
}

// Sub-component for navigation items to keep code clean
function NavItem({
    isActive,
    icon,
    label,
    onClick,
    badge,
}: {
    isActive: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    badge?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
        >
            <div className="flex items-center gap-3">
                <svg
                    className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {icon}
                </svg>
                {label}
            </div>
            {badge && (
                <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-400">
                    {badge}
                </span>
            )}
        </button>
    );
}

// Collapsible navigation item with children
function NavItemWithChildren({
    isExpanded,
    onToggle,
    icon,
    label,
    children,
    activeTab,
    onChildClick,
}: {
    isExpanded: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
    label: string;
    children: { label: string; id: string }[];
    activeTab: string;
    onChildClick: (id: string) => void;
}) {
    return (
        <div>
            <button
                onClick={onToggle}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isExpanded ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
                <div className="flex items-center gap-3">
                    <svg
                        className={`h-5 w-5 ${isExpanded ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {icon}
                    </svg>
                    {label}
                </div>
                <svg
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''} ${isExpanded ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>

            {/* Collapsible children */}
            {isExpanded && (
                <div className="mt-1 ml-3 space-y-1 border-l border-slate-700/50 pl-3">
                    {children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => onChildClick(child.id)}
                            className={`flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-all ${
                                activeTab.includes(child.id)
                                    ? 'bg-indigo-500/10 text-indigo-400'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                        >
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
                            {child.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
