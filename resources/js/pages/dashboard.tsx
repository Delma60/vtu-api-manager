import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
        hourlyVolume: number;
        todayVolume: number;
        successRate: number;
        activeProviders: number;
        totalProviders: number;
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
    const stats = metrics;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* Swapped bg-slate-950 and text-slate-200 for bg-background and text-foreground */}
            <div className="bg-background text-foreground min-h-screen flex-1 p-8 font-sans">
                <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                        {/* Swapped text-slate-400 for text-muted-foreground */}
                        <p className="text-muted-foreground text-sm">Welcome back. Here is what's happening with your API today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Swapped borders and bg for theme variables */}
                        <Button variant="outline">
                            Download Report
                        </Button>
                        <Button>
                            Top Up Wallet
                        </Button>
                    </div>
                </header>

                {/* Top KPIs Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Metric 1: Balance - Swapped bg-[#0f172a] and border-slate-800 for bg-card and border-border */}
                    <div className="group bg-card text-card-foreground relative overflow-hidden rounded-xl border p-6 shadow-sm">
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
                        <p className="text-muted-foreground mb-1 text-sm font-medium">Total Available Balance</p>
                        <h2 className="text-3xl font-bold">₦{stats?.totalBalance.toLocaleString()}</h2>
                        <div className="mt-4 flex items-center text-xs font-medium text-emerald-500 dark:text-emerald-400">
                            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span>+2.4% from yesterday</span>
                        </div>
                    </div>

                    {/* Metric 2: Volume */}
                    <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">Today's API Requests</p>
                        <h2 className="text-3xl font-bold">{stats?.todayVolume.toLocaleString()}</h2>
                        <div className="mt-4 flex items-center text-xs font-medium text-indigo-500 dark:text-indigo-400">
                            <span>~{stats?.hourlyVolume} requests / hour</span>
                        </div>
                    </div>

                    {/* Metric 3: Success Rate */}
                    <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">API Success Rate</p>
                        <h2 className="text-3xl font-bold">{stats?.successRate}%</h2>
                        <div className="bg-secondary mt-4 h-1.5 w-full rounded-full">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${stats?.successRate}%` }}></div>
                        </div>
                    </div>

                    {/* Metric 4: Providers */}
                    <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">Active Providers</p>
                        <h2 className="text-3xl font-bold">
                            {stats?.activeProviders} / {stats?.totalProviders}
                        </h2>
                        <div className="mt-4 flex items-center text-xs font-medium text-amber-500 dark:text-amber-400">
                            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
                            Airtel experiencing high latency
                        </div>
                    </div>
                </div>

                {/* Middle Section: Chart & Provider Health */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Chart Area */}
                    <div className="bg-card text-card-foreground flex flex-col rounded-xl border p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-base font-semibold">Transaction Volume</h3>
                            <select className="border-input bg-background text-foreground rounded border px-2 py-1 text-xs outline-none">
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="border-border bg-muted/30 flex flex-1 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-muted-foreground font-mono text-sm">[ Line Chart Component Mounts Here ]</p>
                        </div>
                    </div>

                    {/* Provider Health Sidebar */}
                    <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
                        <h3 className="mb-6 text-base font-semibold">Provider Health</h3>
                        <div className="space-y-4">
                            {providerHealth?.map((provider) => (
                                <div className="flex items-center justify-between" key={provider.name}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded border border-yellow-500/20 bg-yellow-500/10 text-xs font-bold text-yellow-600 dark:text-yellow-500">
                                            {provider.name.substring(0, 3).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">{provider.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span
                                            className={`text-xs font-semibold ${provider.status === 'operational' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}
                                        >
                                            {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                                        </span>
                                        <span className="text-muted-foreground text-[10px]">{provider.latency}ms latency</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="border-input bg-background hover:bg-accent hover:text-accent-foreground mt-6 w-full rounded-lg border py-2 text-xs font-medium transition-colors">
                            Configure Failover Rules
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Real-time Transaction Log */}
                <div className="bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
                    <div className="border-border flex items-center justify-between border-b p-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-semibold">Live Transactions</h3>
                            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span> Streaming
                            </span>
                        </div>
                        <Link
                            href={route('transactions.index')}
                            className="text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-400"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-border bg-muted/50 text-muted-foreground border-b text-xs font-semibold uppercase">
                                <tr>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Network/Service</th>
                                    <th className="px-6 py-4">Destination</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-border divide-y">
                                {recentTransactions?.map((txn) => (
                                    <tr key={txn.reference} className="hover:bg-muted/50 transition-colors">
                                        <td className="text-muted-foreground px-6 py-4 font-mono">{txn.reference}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-yellow-500"></span> {txn.network}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-6 py-4 font-mono">{txn.destination}</td>
                                        <td className="px-6 py-4 font-medium">₦{txn.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-6 py-4 text-right text-xs">Just now</td>
                                    </tr>
                                ))}

                                {(!recentTransactions || recentTransactions.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-6 py-8 text-center text-sm">
                                            No recent transactions to display.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
