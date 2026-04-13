import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

export default function ProviderConfig({ provider, services, recentErrors }) {
    // Mock Data
    const currentProvider = provider || {
        name: 'VTpass Aggregator',
        code: 'vtpass',
        base_url: 'https://vtpass.com/api/v1',
        priority: 2,
        timeout_ms: 5000,
        is_active: true,
    };

    const [activeTab, setActiveTab] = useState('credentials');

    // Inertia useForm equivalent state
    const [formData, setFormData] = useState({
        base_url: currentProvider.base_url,
        api_key: 'sk_live_1234567890abcdef', // Mocked
        api_secret: '••••••••••••••••',
        priority: currentProvider.priority,
        timeout_ms: currentProvider.timeout_ms,
    });

    return (
        <AppLayout>
            <div className="min-h-screen flex-1 bg-slate-950 font-sans text-slate-200">
                {/* Sticky Header */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-8 py-5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <a
                            href="/providers"
                            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </a>
                        <div>
                            <h1 className="flex items-center gap-3 text-xl font-bold tracking-tight text-white">
                                {currentProvider.name}
                                <span
                                    className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${currentProvider.is_active ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-slate-500/20 bg-slate-500/10 text-slate-400'}`}
                                >
                                    {currentProvider.is_active ? 'Active' : 'Disabled'}
                                </span>
                            </h1>
                            <p className="mt-0.5 font-mono text-xs text-slate-400">Code: {currentProvider.code}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">Cancel</button>
                        <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500">
                            Save Configuration
                        </button>
                    </div>
                </header>

                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-8 py-8 md:flex-row">
                    {/* Left Sidebar Navigation */}
                    <nav className="w-full shrink-0 space-y-1 md:w-64">
                        <button
                            onClick={() => setActiveTab('credentials')}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'credentials' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                            API Credentials
                        </button>
                        <button
                            onClick={() => setActiveTab('routing')}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'routing' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                            Routing & Failover
                        </button>
                        <button
                            onClick={() => setActiveTab('mapping')}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'mapping' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            Service Mapping
                        </button>
                        <button
                            onClick={() => setActiveTab('diagnostics')}
                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'diagnostics' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                Diagnostics
                            </div>
                            {recentErrors && recentErrors.length > 0 && <span className="h-2 w-2 rounded-full bg-rose-500"></span>}
                        </button>
                    </nav>

                    {/* Right Content Area */}
                    <div className="max-w-3xl flex-1">
                        {/* TAB 1: API Credentials */}
                        {activeTab === 'credentials' && (
                            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                                <div className="border-b border-slate-800 p-6">
                                    <h2 className="text-lg font-semibold text-white">Connection Details</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        These keys securely authenticate your server with the upstream provider.
                                    </p>
                                </div>
                                <div className="space-y-6 p-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Base URL</label>
                                        <input
                                            type="text"
                                            value={formData.base_url}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Public Key / Username</label>
                                        <input
                                            type="text"
                                            value={formData.api_key}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Secret Key / Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={formData.api_secret}
                                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                            />
                                            <button className="absolute top-3 right-3 text-sm font-medium text-indigo-400 hover:text-indigo-300">
                                                Reveal
                                            </button>
                                        </div>
                                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                            Stored securely using AES-256 encryption.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: Routing & Failover */}
                        {activeTab === 'routing' && (
                            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                                <div className="border-b border-slate-800 p-6">
                                    <h2 className="text-lg font-semibold text-white">Routing Intelligence</h2>
                                    <p className="mt-1 text-sm text-slate-400">Determine how and when your dispatcher utilizes this provider.</p>
                                </div>
                                <div className="space-y-8 p-6">
                                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-white">Routing Priority</h3>
                                            <p className="mt-1 max-w-sm text-xs text-slate-400">
                                                Lower numbers execute first. If Priority 1 fails, the dispatcher automatically attempts Priority 2.
                                            </p>
                                        </div>
                                        <input
                                            type="number"
                                            value={formData.priority}
                                            className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-center font-mono text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-white">Connection Timeout</h3>
                                            <p className="mt-1 max-w-sm text-xs text-slate-400">
                                                How long to wait for a response before dropping the connection and failing over to the backup
                                                provider.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={formData.timeout_ms}
                                                className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-center font-mono text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                            />
                                            <span className="text-xs font-semibold text-slate-500">ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: Service Mapping (Critical for VTU) */}
                        {activeTab === 'mapping' && (
                            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-800 p-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Service Mapping</h2>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Map your standard internal service codes to {currentProvider.name}'s specific codes.
                                        </p>
                                    </div>
                                    <button className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800">
                                        Import CSV
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Network</th>
                                                <th className="px-6 py-3">Internal Code (Yours)</th>
                                                <th className="px-6 py-3">Vendor Code (Theirs)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            <tr>
                                                <td className="px-6 py-4">
                                                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500"></span>MTN
                                                </td>
                                                <td className="px-6 py-4 font-mono text-indigo-300">data_mtn_1gb</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        defaultValue="mtn-1g-corp"
                                                        className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 font-mono text-xs text-white outline-none focus:border-indigo-500"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4">
                                                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500"></span>MTN
                                                </td>
                                                <td className="px-6 py-4 font-mono text-indigo-300">data_mtn_2gb</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        defaultValue="mtn-2g-corp"
                                                        className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 font-mono text-xs text-white outline-none focus:border-indigo-500"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4">
                                                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>Airtel
                                                </td>
                                                <td className="px-6 py-4 font-mono text-indigo-300">data_air_1.5gb</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter vendor code..."
                                                        className="w-full rounded border border-dashed border-slate-600 bg-slate-900 px-2 py-1.5 font-mono text-xs text-white outline-none focus:border-indigo-500"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: Diagnostics */}
                        {activeTab === 'diagnostics' && (
                            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-800 p-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Provider Diagnostics</h2>
                                        <p className="mt-1 text-sm text-slate-400">Recent connection errors and health checks.</p>
                                    </div>
                                    <button className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Ping Provider
                                    </button>
                                </div>

                                <div className="space-y-4 p-6">
                                    <div className="flex items-start gap-3 rounded-lg border border-rose-500/20 bg-rose-500/10 p-4">
                                        <svg className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-semibold text-rose-400">HTTP 504 Gateway Timeout</h4>
                                            <p className="mt-1 text-xs text-slate-400">
                                                The provider failed to respond within your configured 5000ms timeout window. Transaction was routed to
                                                backup provider.
                                            </p>
                                            <p className="mt-2 font-mono text-[10px] text-slate-500">10 mins ago • Endpoint: /api/b2b/vtu</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
                                        <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-semibold text-amber-400">Insufficient Balance</h4>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Vendor returned error code '03'. Please top up your wallet with {currentProvider.name}.
                                            </p>
                                            <p className="mt-2 font-mono text-[10px] text-slate-500">2 hours ago • Endpoint: /api/b2b/data</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
