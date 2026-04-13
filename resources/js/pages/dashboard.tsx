import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    metrics,
    providerHealth,
    recentTransactions,
}: {
    metrics?: {
        totalBalance: number;
        todayVolume: number;
        successRate: number;
        activeProviders: number;
    };
    providerHealth?: {
        name: string;
        status: 'operational' | 'degraded' | 'partial' | 'major';
        latency: number; // in ms
    }[];
    recentTransactions?: {
        reference: string;
        network: string;
        destination: string;
        amount: number;
        status: 'success' | 'processing' | 'failed';
        time: string; // ISO timestamp
    }[];
}) {
    const stats = metrics || {
        totalBalance: 1250450.5,
        todayVolume: 8432,
        successRate: 99.2,
        activeProviders: 4,
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen flex-1 bg-slate-950 p-8 font-sans text-slate-200">
                <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
                        <p className="text-sm text-slate-400">Welcome back. Here is what's happening with your API today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-slate-800">
                            Download Report
                        </button>
                        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500">
                            Top Up Wallet
                        </button>
                    </div>
                </header>

                {/* Top KPIs Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Metric 1: Balance */}
                    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                            <svg className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                        </div>
                        <p className="mb-1 text-sm font-medium text-slate-400">Total Available Balance</p>
                        <h2 className="text-3xl font-bold text-white">₦{stats.totalBalance.toLocaleString()}</h2>
                        <div className="mt-4 flex items-center text-xs font-medium text-emerald-400">
                            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span>+2.4% from yesterday</span>
                        </div>
                    </div>

                    {/* Metric 2: Volume */}
                    <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm">
                        <p className="mb-1 text-sm font-medium text-slate-400">Today's API Requests</p>
                        <h2 className="text-3xl font-bold text-white">{stats.todayVolume.toLocaleString()}</h2>
                        <div className="mt-4 flex items-center text-xs font-medium text-indigo-400">
                            <span>~350 requests / hour</span>
                        </div>
                    </div>

                    {/* Metric 3: Success Rate */}
                    <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm">
                        <p className="mb-1 text-sm font-medium text-slate-400">API Success Rate</p>
                        <h2 className="text-3xl font-bold text-white">{stats.successRate}%</h2>
                        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-800">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${stats.successRate}%` }}></div>
                        </div>
                    </div>

                    {/* Metric 4: Providers */}
                    <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm">
                        <p className="mb-1 text-sm font-medium text-slate-400">Active Providers</p>
                        <h2 className="text-3xl font-bold text-white">{stats.activeProviders} / 5</h2>
                        <div className="mt-4 flex items-center text-xs font-medium text-amber-400">
                            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
                            Airtel experiencing high latency
                        </div>
                    </div>
                </div>

                {/* Middle Section: Chart & Provider Health */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Chart Area (Mocked visually for Tailwind) */}
                    <div className="flex flex-col rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Transaction Volume</h3>
                            <select className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 outline-none">
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/50">
                            {/* In production, mount Recharts or Chart.js here */}
                            <p className="font-mono text-sm text-slate-500">[ Line Chart Component Mounts Here ]</p>
                        </div>
                    </div>

                    {/* Provider Health Sidebar */}
                    <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm">
                        <h3 className="mb-6 text-base font-semibold text-white">Provider Health</h3>
                        <div className="space-y-4">
                            {/* Health Row 1 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded border border-yellow-500/20 bg-yellow-500/10 text-xs font-bold text-yellow-500">
                                        MTN
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">MTN Corporate</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-semibold text-emerald-400">Operational</span>
                                    <span className="text-[10px] text-slate-500">120ms latency</span>
                                </div>
                            </div>

                            {/* Health Row 2 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded border border-red-500/20 bg-red-500/10 text-xs font-bold text-red-500">
                                        AIR
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">Airtel Direct</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-semibold text-amber-400">Degraded</span>
                                    <span className="text-[10px] text-slate-500">850ms latency</span>
                                </div>
                            </div>

                            {/* Health Row 3 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded border border-green-500/20 bg-green-500/10 text-xs font-bold text-green-500">
                                        GLO
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">Glo API v2</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-semibold text-emerald-400">Operational</span>
                                    <span className="text-[10px] text-slate-500">95ms latency</span>
                                </div>
                            </div>
                        </div>

                        <button className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-900 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800">
                            Configure Failover Rules
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Real-time Transaction Log */}
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-800 p-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-semibold text-white">Live Transactions</h3>
                            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-400 uppercase">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span> Streaming
                            </span>
                        </div>
                        <a href="/transactions" className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                            View All
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="border-b border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Network/Service</th>
                                    <th className="px-6 py-4">Destination</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 bg-[#0f172a]">
                                {/* Row 1 */}
                                <tr className="transition-colors hover:bg-slate-800/30">
                                    <td className="px-6 py-4 font-mono text-slate-300">txn_982374a</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span> MTN Airtime
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">0803***1234</td>
                                    <td className="px-6 py-4 font-medium text-white">₦1,000</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                                            Success
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs">Just now</td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="transition-colors hover:bg-slate-800/30">
                                    <td className="px-6 py-4 font-mono text-slate-300">txn_982373b</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-red-500"></span> Airtel Data (1GB)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">0802***5678</td>
                                    <td className="px-6 py-4 font-medium text-white">₦280</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                                            Processing
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs">12 sec ago</td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="transition-colors hover:bg-slate-800/30">
                                    <td className="px-6 py-4 font-mono text-slate-300">txn_982372c</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-purple-500"></span> IKEDC Prepaid
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">0422***8901</td>
                                    <td className="px-6 py-4 font-medium text-white">₦5,000</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-md bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">Failed</span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs">45 sec ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
