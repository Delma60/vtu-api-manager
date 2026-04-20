import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Download, Filter, Search } from 'lucide-react';
import { useState } from 'react';

// 1. Fully mapped to your DB schema
export interface Transaction {
    id: number;
    user_id: string;
    transaction_type: string;
    provider: string | null;
    account_or_phone: string | null;
    amount: number;
    discount_amount: number;
    quantity: number;
    status: 'pending' | 'success' | 'fail';
    transaction_reference: string;
    payment_reference: string | null;
    funding_method: string | null;
    balance_before: number;
    balance_after: number;
    completed_at: string | null;
    response_message: string | null;
    service_fee: number;
    platform: string | null;
    receiver: string | null;
    plan_type: string | null;
    token: string | null;
    created_at: string;
    updated_at: string;
}

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
        provider?: string;
    };
}

// 2. Updated to strictly match DB enums ('pending', 'success', 'fail')
const statusColors: Record<string, { border: string; bg: string; text: string }> = {
    success: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    fail: { border: 'border-destructive/20', bg: 'bg-destructive/10', text: 'text-destructive' },
    pending: { border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
};

// Mapped for generic providers based on your DB
const providerColors: Record<string, string> = {
    mtn: 'bg-yellow-500',
    airtel: 'bg-red-500',
    glo: 'bg-green-500',
    '9mobile': 'bg-purple-500',
    utilities: 'bg-blue-500',
};

export default function TransactionsPage({ transactions, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [providerFilter, setProviderFilter] = useState(filters?.provider || 'all');

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

    // Format the display names cleanly
    const formatName = (str: string | null) => {
        if (!str) return 'N/A';
        return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // Format currency
    const formatCurrency = (value: number | null) => {
        if (value === null) return '--';
        return `₦${Number(value).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                            <Search className="text-muted-foreground h-4 w-4" />
                        </div>
                        <Input
                            type="text"
                            className="py-2 pr-3 pl-10 ring-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Search Tx Reference or Payment Ref..."
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
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="fail">Fail</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={providerFilter}
                            onValueChange={(e) => {
                                setProviderFilter(e);
                                handleFilter('provider', e);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Providers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Providers</SelectItem>
                                <SelectItem value="mtn">MTN</SelectItem>
                                <SelectItem value="airtel">Airtel</SelectItem>
                                <SelectItem value="glo">Glo</SelectItem>
                                <SelectItem value="9mobile">9mobile</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" title="More Filters (Date Range)">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Data Table using shadcn/ui */}
                <div className="border-border bg-card text-card-foreground overflow-hidden rounded-b-xl border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs">Reference</TableHead>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs">Type & Provider</TableHead>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs">Account / Phone</TableHead>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs">Amount</TableHead>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs">Discount</TableHead>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs">Status</TableHead>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs">Date</TableHead>
                                <TableHead className="px-6 py-4 font-semibold uppercase text-xs text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions?.data && transactions.data.length > 0 ? (
                                transactions.data.map((transaction) => {
                                    const statusStyle = statusColors[transaction.status] || statusColors.pending;
                                    const providerColor = transaction.provider ? (providerColors[transaction.provider.toLowerCase()] || 'bg-slate-500') : 'bg-slate-500';

                                    return (
                                        <TableRow key={transaction.transaction_reference} className="group hover:bg-muted/50 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="font-mono font-medium">
                                                    {transaction.transaction_reference}
                                                </div>
                                                <div className="text-muted-foreground mt-0.5 font-mono text-[10px]">
                                                    {transaction.payment_reference || 'No Payment Ref'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${providerColor}`}></span>
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground font-medium">
                                                            {formatName(transaction.transaction_type)}
                                                        </span>
                                                        <span className="text-muted-foreground text-[10px]">
                                                            {formatName(transaction.provider)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-4 font-mono">
                                                {transaction.account_or_phone || '--'}
                                            </TableCell>
                                            <TableCell className="text-foreground px-6 py-4 font-medium">
                                                {formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell className={`px-6 py-4 font-medium ${transaction.discount_amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                                                {formatCurrency(transaction.discount_amount)}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className={`rounded-md border ${statusStyle.border} ${statusStyle.bg} px-2.5 py-1 text-xs font-semibold ${statusStyle.text}`}>
                                                    {formatName(transaction.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-4 text-xs whitespace-nowrap">
                                                {formatDate(transaction.created_at)}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/transactions/${transaction.transaction_reference.toLowerCase()}`}
                                                    className="text-primary text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
                                                >
                                                    View Details
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-muted-foreground px-6 py-8 text-center">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

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
