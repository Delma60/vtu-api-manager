import AppLayout  from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, CreditCard, Activity, Users, Wallet, Globe, Bot } from 'lucide-react';
import { SharedData } from '@/types';

interface BusinessShowProps extends SharedData {
    business: {
        id: number;
        name: string;
        support_email: string;
        is_active: boolean;
        mode: string;
        created_at: string;
        owner: { name: string; email: string; phone: string };
        telegram_is_active: boolean;
    };
    metrics: {
        lifetime_volume: string;
        total_transactions: number;
        active_customers: number;
        wallet_balance: string;
    };
    transactions: {
        data: Array<{
            id: number;
            reference: string;
            type: string;
            service: string;
            amount: string;
            destination: string;
            status: string;
            date: string;
        }>;
        links: any[];
    };
}

export default function BusinessShow({ business, metrics, transactions }: BusinessShowProps) {
    return (
        <AppLayout>
            <Head title={`Tenant: ${business.name}`} />
            
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* 1. Header & Navigation */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={route('super-admin.businesses.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">{business.name}</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                business.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                            }`}>
                                {business.is_active ? 'Active' : 'Suspended'}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
                                {business.mode} Mode
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                            <Building2 className="h-3 w-3" /> Tenant Profile & Ledger
                        </p>
                    </div>
                </div>

                {/* 2. Top Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tenant Wallet</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦{metrics.wallet_balance}</div>
                            <p className="text-xs text-muted-foreground mt-1">Current available balance</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lifetime Volume</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦{metrics.lifetime_volume}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total processed value</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total_transactions.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">API & Web hits</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.active_customers}</div>
                            <p className="text-xs text-muted-foreground mt-1">End-users connected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Middle Section: Config & Owner Details */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Owner Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Ownership Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                                <div>
                                    <dt className="text-muted-foreground font-medium">Owner Name</dt>
                                    <dd className="mt-1 font-semibold">{business.owner?.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground font-medium">Contact Email</dt>
                                    <dd className="mt-1">{business.owner?.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground font-medium">Support Email</dt>
                                    <dd className="mt-1">{business.support_email}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground font-medium">Phone</dt>
                                    <dd className="mt-1">{business.owner?.phone || 'Not provided'}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Technical Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Technical Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-md">
                                            <Globe className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Webhooks</p>
                                            <p className="text-xs text-muted-foreground">Tenant's callback URL</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => router.get(route("api-logs.index", { id:business?.id }))}>Inspect Logs</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-md">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Telegram Bot</p>
                                            <p className="text-xs text-muted-foreground">
                                                {business.telegram_is_active ? 'Active and routing' : 'Disabled by tenant'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`h-2 w-2 rounded-full ${business.telegram_is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Bottom Section: Tenant Ledger */}
                <Card>
                    <CardHeader className="border-b bg-muted/20 pb-4">
                        <CardTitle className="text-lg">Isolated Transaction Ledger</CardTitle>
                        <CardDescription>All VTU operations strictly scoped to {business.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Reference</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No transactions recorded for this tenant yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.data.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="pl-6 font-mono text-xs">{tx.reference}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{tx.service}</div>
                                                <div className="text-xs text-muted-foreground uppercase">{tx.type}</div>
                                            </TableCell>
                                            <TableCell className="text-sm">{tx.destination}</TableCell>
                                            <TableCell className="font-semibold text-sm">₦{tx.amount}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    tx.status === 'successful' ? 'bg-emerald-500/10 text-emerald-600' : 
                                                    tx.status === 'failed' ? 'bg-rose-500/10 text-rose-600' : 
                                                    'bg-amber-500/10 text-amber-600'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 text-sm text-muted-foreground whitespace-nowrap">
                                                {tx.date}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}