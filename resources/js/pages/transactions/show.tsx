import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    Terminal,
    Smartphone,
    Wallet,
    XCircle,
    Receipt
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
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
    service_fee: number;
    platform: string | null;
    receiver: string | null;
    plan_type: string | null;
    token: string | null;
    created_at: string;
}

interface Props {
    transaction: Transaction;
    metaData: any;
    formattedDate: string;
}

export default function TransactionShow({ transaction, metaData, formattedDate }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(metaData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatCurrency = (value: number | string) => {
        return `₦${Number(value).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatName = (str: string | null) => {
        if (!str) return 'N/A';
        return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const StatusIcon = () => {
        switch (transaction.status) {
            case 'success': return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
            case 'fail': return <XCircle className="h-6 w-6 text-destructive" />;
            default: return <Clock className="h-6 w-6 text-amber-500" />;
        }
    };

    const statusColors = {
        success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
        fail: 'bg-destructive/10 text-destructive border-destructive/20',
        pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    };

    return (
        <AppLayout>
            <div className="bg-background min-h-screen flex-1 p-6 md:p-8">
                {/* Header Navigation */}
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-full">
                        <Link href="/transactions">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Transaction Details</h1>
                            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${statusColors[transaction.status]}`}>
                                {transaction.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                            Ref: <span className="font-mono text-foreground">{transaction.transaction_reference}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Human Readable Data */}
                    <div className="flex flex-col gap-6 lg:col-span-2">

                        {/* Core Details Card */}
                        <Card>
                            <CardHeader className="bg-muted/30 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Receipt className="text-muted-foreground h-5 w-5" />
                                        <CardTitle className="text-lg">Service Details</CardTitle>
                                    </div>
                                    <StatusIcon />
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Service Type</p>
                                    <p className="font-medium">{formatName(transaction.transaction_type)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Upstream Provider</p>
                                    <p className="font-medium">{formatName(transaction.provider)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Target Account / Phone</p>
                                    <p className="font-mono font-medium">{transaction.account_or_phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Plan / Package</p>
                                    <p className="font-medium">{transaction.plan_type || 'N/A'}</p>
                                </div>
                                {transaction.token && (
                                    <div className="space-y-1 sm:col-span-2 rounded-lg bg-primary/5 p-3 border border-primary/10">
                                        <p className="text-primary text-xs font-bold uppercase tracking-wider">Generated Token / PIN</p>
                                        <p className="font-mono text-lg font-bold tracking-widest text-foreground">{transaction.token}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Financial Ledger Card */}
                        <Card>
                            <CardHeader className="bg-muted/30 border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <Wallet className="text-muted-foreground h-5 w-5" />
                                    <CardTitle className="text-lg">Financial Ledger</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Amount</p>
                                        <p className="font-semibold text-lg">{formatCurrency(transaction.amount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Discount</p>
                                        <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(transaction.discount_amount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Service Fee</p>
                                        <p className="font-medium text-rose-600 dark:text-rose-400">{formatCurrency(transaction.service_fee)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Quantity</p>
                                        <p className="font-medium">{transaction.quantity}</p>
                                    </div>
                                </div>

                                <Separator className="mb-6" />

                                <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-4">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Balance Before</p>
                                        <p className="font-mono font-medium">{formatCurrency(transaction.balance_before)}</p>
                                    </div>
                                    <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 shrink-0" />
                                    <div className="space-y-1 text-right">
                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Balance After</p>
                                        <p className="font-mono font-medium">{formatCurrency(transaction.balance_after)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Developer / Metadata */}
                    <div className="flex flex-col gap-6 lg:col-span-1">

                        {/* Timeline & Meta Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Timeline & Meta</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Initiated</p>
                                        <p className="text-xs text-muted-foreground">{formattedDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Completed</p>
                                        <p className="text-xs text-muted-foreground">
                                            {transaction.completed_at ? new Date(transaction.completed_at).toLocaleString('en-NG') : 'Pending / Not Recorded'}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Payment Reference</p>
                                        <p className="text-xs font-mono text-muted-foreground break-all">
                                            {transaction.payment_reference || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Smartphone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Platform Source</p>
                                        <p className="text-xs text-muted-foreground uppercase">{transaction.platform || 'API'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Raw API Payload Block */}
                        <Card className="flex flex-col overflow-hidden">
                            <CardHeader className="bg-slate-900 flex flex-row items-center justify-between py-3 border-b border-slate-800">
                                <div className="flex items-center gap-2 text-slate-200">
                                    <Terminal className="h-4 w-4" />
                                    <CardTitle className="text-sm font-medium">Provider Response</CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-8 text-slate-400 hover:text-white hover:bg-slate-800"
                                >
                                    <Copy className="h-3 w-3 mr-2" />
                                    {copied ? 'Copied!' : 'Copy JSON'}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 bg-slate-950 text-slate-300">
                                <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                                    <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                        <code>{JSON.stringify(metaData, null, 2)}</code>
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
