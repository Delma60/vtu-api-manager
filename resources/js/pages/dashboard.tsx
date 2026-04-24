import TopupWallet from '@/components/toup-wallet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { SelectValue } from '@radix-ui/react-select';
import { Server, Users, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type TransactionRow = {
    transaction_reference?: string | number;
    id?: string | number;
    provider?: string;
    transaction_type?: string;
    account_or_phone?: string;
    receiver?: string;
    amount: string | number;
    status: 'success' | 'processing' | 'failed' | 'fail' | string;
    created_at: string;
};

type VolumeDataPoint = {
    date: string;
    requests: number;
    success: number;
};

export default function Dashboard({
    metrics,
    providerHealth,
    recentTransactions,
    volumeChartData,
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
    recentTransactions?: TransactionRow[];
    volumeChartData?: VolumeDataPoint[];
}) {
    const stats = metrics;

    // Inside your Dashboard component:
    const [isBarHovered, setIsBarHovered] = useState(false);

    const handleRangeChange = (range: string) => {
        router.get(
            route('dashboard'),
            { range },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['volumeChartData', 'filters'], // Only refresh these props
            },
        );
    };

    const apiPercentage =
        metrics.monthlyApiUsage.limit > 0 ? Math.min(100, (metrics.monthlyApiUsage.usage / metrics.monthlyApiUsage.limit) * 100) : 0;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* Swapped bg-slate-950 and text-slate-200 for bg-background and text-foreground */}
            <div className="bg-background text-foreground min-h-screen p-4 font-sans md:p-8">
                <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                        {/* Swapped text-slate-400 for text-muted-foreground */}
                        <p className="text-muted-foreground text-sm">Welcome back. Here is what's happening with your API today.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Swapped borders and bg for theme variables */}
                        <Button variant="outline" className="flex-1 sm:flex-none">
                            Download Report
                        </Button>
                        {/* <Button className="flex-1 sm:flex-none">Top Up Wallet</Button> */}
                        <TopupWallet />
                    </div>
                </header>
                <div className="space-y-4">
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                        <div className="bg-card text-card-foreground flex flex-col rounded-xl border p-6 shadow-sm lg:col-span-2">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-base font-semibold">Transaction Volume</h3>
                                <div className="w-full max-w-xs">
                                    <Select onValueChange={handleRangeChange} defaultValue="7days">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="24hours">Last 24 Hours</SelectItem>
                                            <SelectItem value="7days">Last 7 Days</SelectItem>
                                            <SelectSeparator />
                                            <SelectItem value="30days">Last 30 Days</SelectItem>
                                            <SelectItem value="90days">Last 90 Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                {volumeChartData && volumeChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={volumeChartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#94a3b8"
                                                fontSize={10}
                                                tickLine={false}
                                                axisLine={false}
                                                interval={0}
                                                height={24}
                                                tickFormatter={(value) => String(value).slice(5).replace(/-/g, '/')}
                                            />
                                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />

                                            {/* Pass the custom component to the cursor prop */}
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    border: '1px solid hsl(var(--border))',
                                                    borderRadius: '8px',
                                                }}
                                                cursor={<CustomHoverBackground />}
                                                wrapperStyle={{
                                                    visibility: isBarHovered ? 'visible' : 'hidden',
                                                    transition: 'visibility 0.1s',
                                                }}
                                            />

                                            <Bar
                                                dataKey="requests"
                                                fill="#6366f1"
                                                maxBarSize={40}
                                                activeBar={false}
                                                onMouseEnter={() => setIsBarHovered(true)}
                                                onMouseLeave={() => setIsBarHovered(false)}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-muted-foreground mb-2 text-sm">No data available</div>
                                            <p className="text-muted-foreground text-xs">Chart data will appear here as transactions are processed</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Provider Health Sidebar */}
                        <div className="bg-card text-card-foreground flex flex-col rounded-xl border p-6 shadow-sm">
                            <h3 className="mb-6 text-base font-semibold">Provider Health</h3>
                            <div className="flex-1 space-y-4">
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

                    <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-3">
                        {/* 1. Wallet Balance Card */}
                        <Card className="border-l-primary border-l-4 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available Wallet Balance</CardTitle>
                                <Wallet className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₦{Number(metrics.availableBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-muted-foreground mt-1 text-xs">Available funds for funding transactions</p>
                            </CardContent>
                        </Card>

                        {/* 2. API Limiter Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Monthly API Usage</CardTitle>
                                <Server className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {metrics.monthlyApiUsage.usage.toLocaleString()}
                                    <span className="text-muted-foreground text-sm font-normal">
                                        / {metrics.monthlyApiUsage.limit > 0 ? metrics.monthlyApiUsage.limit.toLocaleString() : 'Unlimited'}
                                    </span>
                                </div>

                                {/* Render a progress bar only if they are not on an unlimited plan */}
                                {metrics.monthlyApiUsage.limit > 0 ? (
                                    <div className="mt-3 space-y-1.5">
                                        <Progress
                                            value={apiPercentage}
                                            className={`h-2 ${apiPercentage > 90 ? 'bg-destructive/20 [&>div]:bg-destructive' : ''}`}
                                        />
                                        <p className="text-muted-foreground text-right text-xs">{apiPercentage.toFixed(1)}% used</p>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-xs font-medium text-emerald-500">No monthly limit applied</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* 3. The "Another" Card: Active Customers */}
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                                <Users className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.total_customers?.toLocaleString()}</div>
                                <p className="text-muted-foreground mt-1 text-xs">Registered users across your platform</p>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Bottom Section: Real-time Transaction Log */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-border bg-card flex flex-row items-center justify-between space-y-0 border-b px-6 py-5">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">Live Transactions</CardTitle>

                                <Badge
                                    variant="outline"
                                    className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-500 uppercase shadow-none"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                    </span>
                                    Live
                                </Badge>
                            </div>
                            <Link
                                href={route('transactions.index')}
                                className="text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-400"
                            >
                                View All
                            </Link>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="w-full overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                                Reference
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                                Service
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                                Destination
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                                Amount
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
                                                Time
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTransactions && recentTransactions.length > 0 ? (
                                            recentTransactions.map((txn: TransactionRow) => (
                                                <TableRow
                                                    key={txn.transaction_reference || txn.id}
                                                    className="group hover:bg-muted/50 transition-colors"
                                                >
                                                    {/* Reference */}
                                                    <TableCell className="px-6 py-4">
                                                        <span className="text-muted-foreground group-hover:text-foreground font-mono text-xs transition-colors">
                                                            {txn.transaction_reference}
                                                        </span>
                                                    </TableCell>

                                                    {/* Provider & Transaction Type */}
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {txn.provider && (
                                                                <span
                                                                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-sm ${getProviderColor(txn.provider)}`}
                                                                ></span>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="text-sm leading-none font-medium">{txn.provider || 'System'}</span>
                                                                <span className="text-muted-foreground mt-1 text-xs">
                                                                    {formatTransactionType(txn.transaction_type ?? '')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Destination (Account or Phone) */}
                                                    <TableCell className="px-6 py-4 font-mono text-sm">
                                                        {txn.account_or_phone || txn.receiver || 'N/A'}
                                                    </TableCell>

                                                    {/* Amount */}
                                                    <TableCell className="px-6 py-4 font-semibold">
                                                        ₦{parseFloat(String(txn.amount)).toLocaleString()}
                                                    </TableCell>

                                                    {/* Status Badge */}
                                                    <TableCell className="px-6 py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className={`gap-1 border-transparent capitalize shadow-sm ${getStatusBadge(txn.status)}`}
                                                        >
                                                            {txn.status === 'success' ? (
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={3}
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            ) : txn.status === 'fail' ? (
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={3}
                                                                        d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    className="h-3 w-3 animate-spin"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                    />
                                                                </svg>
                                                            )}
                                                            {txn.status}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Relative Time using created_at */}
                                                    <TableCell className="text-muted-foreground px-6 py-4 text-right text-xs font-medium">
                                                        {formatRelativeTime(txn.created_at)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            /* Empty State */
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center">
                                                    <div className="text-muted-foreground flex flex-col items-center justify-center space-y-3">
                                                        <svg className="h-8 w-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                        <span className="text-sm">No recent transactions to display.</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// 1. Define the custom cursor above or inside your component
type HoverBackgroundProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
};

const CustomHoverBackground = (props: HoverBackgroundProps) => {
    const { x, y, width, height } = props;
    const bgWidth = 50; // Slightly wider than your maxBarSize of 40
    const xValue = x ?? 0;
    const widthValue = width ?? bgWidth;
    const centeredX = xValue + (widthValue - bgWidth) / 2; // Centers the gray box over the bar

    return <Rectangle fill="#334155" opacity={0.2} x={centeredX} y={y ?? 0} width={bgWidth} height={height ?? 0} rx={4} />;
};

// Helper to format time relative to now
const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
};

// Helper to get brand colors for providers
const getProviderColor = (provider: string | null) => {
    if (!provider) return 'bg-slate-500';
    const p = provider.toLowerCase();
    if (p.includes('mtn')) return 'bg-yellow-400';
    if (p.includes('airtel')) return 'bg-red-500';
    if (p.includes('glo')) return 'bg-green-500';
    if (p.includes('9mobile')) return 'bg-emerald-800';
    return 'bg-indigo-500';
};

// Clean up transaction_type (e.g., 'airtime_recharge' -> 'Airtime Recharge')
const formatTransactionType = (type: string) => {
    if (!type) return '';
    return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Helper for status badge styling based on DB enums: 'pending', 'success', 'fail'
const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'success') {
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
    if (s === 'fail' || s === 'failed') {
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
    if (s === 'pending') {
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
    return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
};
