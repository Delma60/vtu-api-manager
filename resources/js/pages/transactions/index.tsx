import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Transaction } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Download, Filter } from 'lucide-react';
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
    successful: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    failed: { border: 'border-destructive/20', bg: 'bg-destructive/10', text: 'text-destructive' },
    processing: { border: 'border-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
    pending: { border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
    refunded: { border: 'border-border', bg: 'bg-muted/50', text: 'text-muted-foreground' },
};

// Network dots typically represent brand colors, so keeping them static is fine
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
            <div className="bg-background text-foreground min-h-screen flex-1 p-8 font-sans">
                {/* Header & Actions */}
                <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                        <p className="text-muted-foreground text-sm">View and debug all API requests and financial ledgers.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
                            {/* <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg> */}
                            <Download className="h-4 w-4 opacity-70" />
                            Export CSV
                        </Button>
                    </div>
                </header>

                {/* Filter Bar */}
                <div className="border-border bg-card flex flex-col items-center justify-between gap-4 rounded-t-xl border border-b-0 p-4 shadow-sm md:flex-row">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="text-muted-foreground h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <Input
                            type="text"
                            className="py-2 pr-3 pl-10 ring-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Search Reference, Phone, or Vendor ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter('search', searchTerm)}
                        />
                    </div>

                    {/* Dropdown Filters */}
                    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 md:w-auto md:pb-0">
                        <Select
                            value={statusFilter}
                            onValueChange={(e) => {
                                setStatusFilter(e);
                                handleFilter('status', e);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="successful">Successful</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={networkFilter}
                            onValueChange={(e) => {
                                setNetworkFilter(e);
                                handleFilter('network', e);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Networks" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Networks</SelectItem>
                                <SelectItem value="mtn">MTN</SelectItem>
                                <SelectItem value="airtel">Airtel</SelectItem>
                                <SelectItem value="glo">Glo</SelectItem>
                                <SelectItem value="9mobile">9mobile</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" title="More Filters (Date Range)">
                            <Filter />
                        </Button>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="border-border bg-card text-card-foreground overflow-hidden rounded-b-xl border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-border bg-muted/50 text-muted-foreground border-b text-xs font-semibold uppercase">
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
                            <tbody className="divide-border divide-y">
                                {transactions?.data && transactions.data.length > 0 ? (
                                    transactions.data.map((transaction) => {
                                        const statusStyle = statusColors[transaction.status] || statusColors.pending;
                                        const networkColor = networkColors[transaction.network] || 'bg-slate-500';
                                        const isRefunded = transaction.status === 'refunded';

                                        return (
                                            <tr key={transaction.reference} className="group hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className={`font-mono font-medium ${isRefunded ? 'line-through opacity-50' : ''}`}>
                                                        {transaction.reference}
                                                    </div>
                                                    <div
                                                        className={`text-muted-foreground mt-0.5 font-mono text-[10px] ${isRefunded ? 'opacity-50' : ''}`}
                                                    >
                                                        {transaction.vendor_reference || '--'}
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 ${isRefunded ? 'opacity-50' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`h-2 w-2 rounded-full ${networkColor}`}></span>
                                                        <span className="text-foreground font-medium">
                                                            {getServiceName(transaction.type, transaction.network)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={`text-muted-foreground px-6 py-4 font-mono ${isRefunded ? 'opacity-50' : ''}`}>
                                                    {transaction.destination}
                                                </td>
                                                <td className={`text-foreground px-6 py-4 font-medium ${isRefunded ? 'opacity-50' : ''}`}>
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td
                                                    className={`px-6 py-4 font-medium ${transaction.profit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'} ${isRefunded ? 'opacity-50' : ''}`}
                                                >
                                                    {formatCurrency(transaction.profit)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-md border ${statusStyle.border} ${statusStyle.bg} px-2.5 py-1 text-xs font-semibold ${statusStyle.text}`}
                                                    >
                                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className={`text-muted-foreground px-6 py-4 text-xs ${isRefunded ? 'opacity-50' : ''}`}>
                                                    {formatDate(transaction.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={`/transactions/${transaction.reference.toLowerCase()}`}
                                                        className="text-primary text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-muted-foreground px-6 py-8 text-center">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="border-border bg-muted/30 flex items-center justify-between border-t p-4 text-sm">
                        <div className="text-muted-foreground">
                            Showing <span className="text-foreground font-medium">{transactions?.from || 0}</span> to{' '}
                            <span className="text-foreground font-medium">{transactions?.to || 0}</span> of{' '}
                            <span className="text-foreground font-medium">{transactions?.total || 0}</span> results
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                disabled={transactions?.current_page === 1}
                                onClick={() => {
                                    const newPage = transactions!.current_page - 1;
                                    router.get('/transactions', { ...filters, page: newPage }, { preserveState: true });
                                }}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                disabled={transactions?.current_page === transactions?.last_page}
                                onClick={() => {
                                    const newPage = transactions!.current_page + 1;
                                    router.get('/transactions', { ...filters, page: newPage }, { preserveState: true });
                                }}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
