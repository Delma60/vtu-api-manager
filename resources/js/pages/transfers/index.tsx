import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowUpRight, Clock, Plus, Users, Wallet } from 'lucide-react';

export default function TransferIndex({
    transfers,
    beneficiaries,
    walletBalance,
}: {
    transfers: any[];
    beneficiaries: any[];
    walletBalance: number;
}) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Transfers', href: '/transfers' }]}>
            <Head title="Transfers & Payouts" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-end">
                    <div>
                        <HeadingSmall title="Transfers & Payouts" description="Manage your outgoing funds and beneficiaries." />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">Available Balance</p>
                            <p className="flex items-center justify-end gap-1 text-lg font-bold">
                                <Wallet className="text-primary h-4 w-4" /> ₦{Number(walletBalance).toLocaleString()}
                            </p>
                        </div>
                        <Link href={route('transfers.create')}>
                            <Button className="h-10 px-5 shadow-md">
                                <Plus className="mr-2 h-4 w-4" /> Make a Transfer
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="history" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="history">
                            <Clock className="mr-2 h-4 w-4" /> 30-Day History
                        </TabsTrigger>
                        <TabsTrigger value="beneficiaries">
                            <Users className="mr-2 h-4 w-4" /> Beneficiaries
                        </TabsTrigger>
                    </TabsList>

                    {/* HISTORY TAB */}
                    <TabsContent value="history" className="space-y-4 pt-4">
                        {transfers.length === 0 ? (
                            <div className="bg-muted/20 rounded-xl border-2 border-dashed py-12 text-center">
                                <p className="text-muted-foreground">No transfers made in the last 30 days.</p>
                            </div>
                        ) : (
                            transfers.map((tx) => (
                                <Card key={tx.id} className="shadow-sm">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`rounded-full p-3 ${tx.type === 'payout' ? 'bg-orange-500/10 text-orange-600' : 'bg-indigo-500/10 text-indigo-600'}`}
                                            >
                                                <ArrowUpRight className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{tx.description}</p>
                                                <p className="text-muted-foreground text-xs">
                                                    {format(new Date(tx.created_at), 'MMM dd, yyyy • h:mm a')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">₦{Number(tx.amount).toLocaleString()}</p>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                    tx.status === 'successful'
                                                        ? 'bg-emerald-500/10 text-emerald-600'
                                                        : 'bg-amber-500/10 text-amber-600'
                                                }`}
                                            >
                                                {tx.status}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* BENEFICIARIES TAB */}
                    <TabsContent value="beneficiaries" className="pt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {beneficiaries.map((user) => (
                                <Card key={user.id} className="hover:border-primary/50 shadow-sm transition-colors">
                                    <CardContent className="flex flex-col items-center p-5 text-center">
                                        <div className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <h3 className="text-sm font-semibold">{user.name}</h3>
                                        <p className="text-muted-foreground w-full truncate text-xs">{user.email}</p>
                                        <Link href={route('transfer.create', { type: 'wallet', preselect: user.id })} className="mt-4 w-full">
                                            <Button variant="outline" className="h-8 w-full text-xs">
                                                Send Money
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
