import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { Check, Copy, ExternalLink, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface PaymentLink {
    id: string;
    amount: string;
    description: string;
    status: string;
    is_reusable: boolean;
    created_at: string;
}

export default function PaymentLinksIndex() {
    const { paymentLinks } = usePage().props as unknown as { paymentLinks: PaymentLink[] };
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (id: string) => {
        const url = route('pay.show', id);
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Payment Links', href: route('payment-links.index') }]}>
            <div className="flex flex-col gap-6 p-4 ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Payment Links</h1>
                        <p className="text-sm text-muted-foreground">Create and manage links to receive payments.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('payment-links.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Create Link
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentLinks.length > 0 ? (
                                    paymentLinks.map((link) => (
                                        <TableRow key={link.id}>
                                            <TableCell className="font-medium pl-6">{link.description}</TableCell>
                                            <TableCell>₦{parseFloat(link.amount).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{link.is_reusable ? 'Reusable' : 'One-time'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={link.status === 'successful' ? 'default' : 'secondary'} className={link.status === 'successful' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                                    {link.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-3 ">
                                                    <Button className="p-0" variant="ghost" size="sm" onClick={() => copyToClipboard(link.id)}>
                                                        {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className=" h-4 w-4" />}
                                                    </Button>
                                                    <Separator orientation="vertical" className='bg-slate-500 h-8' />
                                                    <Button className='p-0' onClick={() => router.get(route("pay.show", link.id))} variant="ghost" size="sm">
                                                        {/* < href={"#"} target="_blank" rel="noreferrer"> */}
                                                            <ExternalLink className="h-4 w-4" />
                                                        {/* </> */}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                            No payment links created yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
