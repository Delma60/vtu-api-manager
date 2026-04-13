import AppLayout from '@/layouts/app-layout';
import { Transaction } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface PaginationData {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
}

interface Props {
    transactions: {
        data: Transaction[];
        links: any;
    } & PaginationData;
    filters: {
        search?: string;
        status?: string;
        network?: string;
    };
}

const statusColors: Record<string, { border: string; bg: string; text: string }> = {
    successful: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    failed: { border: 'border-rose-500/20', bg: 'bg-rose-500/10', text: 'text-rose-400' },
    processing: { border: 'border-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    pending: { border: 'border-yellow-500/20', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    refunded: { border: 'border-slate-500/20', bg: 'bg-slate-500/10', text: 'text-slate-400' },
};

const networkColors: Record<string, string> = {
    mtn: 'bg-yellow-500',
    airtel: 'bg-red-500',
    glo: 'bg-green-500',
    '9mobile': 'bg-purple-500',
    utilities: 'bg-blue-500',
};

export default function TransactionsPage({ transactions, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [networkFilter, setNetworkFilter] = useState(filters?.network || 'all');

    // Handle filter changes with debouncing for search
    const handleFilter = (key: string, value: string) => {
        const newFilters = { ...filters };
        if (value === 'all') {
            delete newFilters[key as keyof typeof newFilters];
        } else {
            newFilters[key as keyof typeof newFilters] = value;
        }
        router.get('/transactions', newFilters, { preserveState: true });
    };

    // Format the network display name
    const getNetworkName = (network: string) => {
        return network.charAt(0).toUpperCase() + network.slice(1).toLowerCase();
    };

    // Format the service/type display
    const getServiceName = (type: string, network: string) => {
        const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
        return `${getNetworkName(network)} ${typeCapitalized}`;
    };

    // Format currency
    const formatCurrency = (value: number | null) => {
        if (value === null) return '--';
        return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NG', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen flex-1 bg-slate-950 p-8 font-sans text-slate-200">
                {/* Header & Actions */}
                <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Transactions</h1>
                        <p className="text-sm text-slate-400">View and debug all API requests and financial ledgers.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-slate-800">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </header>

                {/* Filter Bar */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-t-xl border border-b-0 border-slate-800 bg-[#0f172a] p-4 shadow-sm md:flex-row">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pr-3 pl-10 leading-5 text-slate-300 placeholder-slate-500 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                            placeholder="Search Reference, Phone, or Vendor ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter('search', searchTerm)}
                        />
                    </div>

                    {/* Dropdown Filters */}
                    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 md:w-auto md:pb-0">
                        <select
                            className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                handleFilter('status', e.target.value);
                            }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="successful">Successful</option>
                            <option value="failed">Failed</option>
                            <option value="processing">Processing</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refunded</option>
                        </select>

                        <select
                            className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
                            value={networkFilter}
                            onChange={(e) => {
                                setNetworkFilter(e.target.value);
                                handleFilter('network', e.target.value);
                            }}
                        >
                            <option value="all">All Networks</option>
                            <option value="mtn">MTN</option>
                            <option value="airtel">Airtel</option>
                            <option value="glo">Glo</option>
                            <option value="9mobile">9mobile</option>
                            <option value="utilities">Utilities</option>
                        </select>

                        <button
                            className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-400 transition-all hover:bg-slate-800"
                            title="More Filters (Date Range)"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="overflow-hidden rounded-b-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap text-slate-400">
                            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Destination</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Profit</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {transactions?.data && transactions.data.length > 0 ? (
                                    transactions.data.map((transaction) => {
                                        const statusStyle = statusColors[transaction.status] || statusColors.pending;
                                        const networkColor = networkColors[transaction.network] || 'bg-slate-500';
                                        const isRefunded = transaction.status === 'refunded';

                                        return (
                                            <tr key={transaction.reference} className="group transition-colors hover:bg-slate-800/30">
                                                <td className="px-6 py-4">
                                                    <div className={`font-mono text-slate-300 ${isRefunded ? 'line-through opacity-70' : ''}`}>
                                                        {transaction.reference}
                                                    </div>
                                                    <div className={`mt-0.5 font-mono text-[10px] text-slate-500 ${isRefunded ? 'opacity-70' : ''}`}>
                                                        {transaction.vendor_reference || '--'}
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 ${isRefunded ? 'opacity-70' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`h-2 w-2 rounded-full ${networkColor}`}></span>
                                                        <span className="font-medium text-slate-300">
                                                            {getServiceName(transaction.type, transaction.network)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 font-mono ${isRefunded ? 'opacity-70' : ''}`}>{transaction.destination}</td>
                                                <td className={`px-6 py-4 font-medium text-white ${isRefunded ? 'opacity-70' : ''}`}>
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className={`px-6 py-4 ${transaction.profit > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {formatCurrency(transaction.profit)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-md border ${statusStyle.border} ${statusStyle.bg} px-2.5 py-1 text-xs font-semibold ${statusStyle.text}`}
                                                    >
                                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-xs ${isRefunded ? 'opacity-70' : ''}`}>
                                                    {formatDate(transaction.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={`/transactions/${transaction.reference.toLowerCase()}`}
                                                        className="text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-indigo-300"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 p-4 text-sm">
                        <div className="text-slate-500">
                            Showing <span className="font-medium text-slate-300">{transactions?.from || 0}</span> to{' '}
                            <span className="font-medium text-slate-300">{transactions?.to || 0}</span> of{' '}
                            <span className="font-medium text-slate-300">{transactions?.total || 0}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="rounded-md border border-slate-700 bg-[#0f172a] px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
                                disabled={transactions?.current_page === 1}
                                onClick={() => {
                                    const newPage = transactions!.current_page - 1;
                                    router.get('/transactions', { ...filters, page: newPage }, { preserveState: true });
                                }}
                            >
                                Previous
                            </button>
                            <button
                                className="rounded-md border border-slate-700 bg-[#0f172a] px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
                                disabled={transactions?.current_page === transactions?.last_page}
                                onClick={() => {
                                    const newPage = transactions!.current_page + 1;
                                    router.get('/transactions', { ...filters, page: newPage }, { preserveState: true });
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
