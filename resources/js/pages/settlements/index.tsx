import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Adjust based on your layout path
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Wallet, ArrowRightLeft } from 'lucide-react';

interface Settlement {
    id: number;
    reference: string;
    description: string;
    amount: string;
    is_settled: boolean;
    settles_at: string;
    created_at: string;
}

interface Props {
    balances: {
        available: string;
        pending: string;
    };
    nextSettlement: {
        amount: string;
        settles_at: string;
        exact_date: string;
    } | null;
    settlements: {
        data: Settlement[];
        links: any[]; // Inertia pagination links
    };
}

export default function SettlementsIndex({ balances, nextSettlement, settlements }: Props) {
    
    // Helper to format currency
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(Number(amount));
    };

    // Helper to format dates
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <AppLayout>
            <Head title="Settlements" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Settlements</h2>
                </div>

                {/* Metrics Cards - Flutterwave Style */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(balances.available)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Cleared and ready for payout
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-500">
                                {formatCurrency(balances.pending)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Currently on probation
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Next Expected Settlement</CardTitle>
                            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {nextSettlement ? formatCurrency(nextSettlement.amount) : formatCurrency(0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {nextSettlement ? `Clears ${nextSettlement.settles_at} (${nextSettlement.exact_date})` : 'No pending settlements'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Ledger / History Table */}
                <Card className="col-span-4 mt-6">
                    <CardHeader>
                        <CardTitle>Settlement History</CardTitle>
                        <CardDescription>
                            A ledger of all your incoming funds and their clearance status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Expected Date</TableHead>
                                        <TableHead>Date Earned</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {settlements.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                                No settlements found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {settlements.data.map((settlement) => (
                                        <TableRow key={settlement.id}>
                                            <TableCell className="font-mono text-xs font-medium">
                                                {settlement.reference}
                                            </TableCell>
                                            <TableCell>{settlement.description}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(settlement.amount)}
                                            </TableCell>
                                            <TableCell>
                                                {settlement.is_settled ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex w-fit items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Settled
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex w-fit items-center gap-1">
                                                        <Clock className="w-3 h-3" /> Pending
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(settlement.settles_at)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(settlement.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}