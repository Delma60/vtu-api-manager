import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';

interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
    user: { name: string };
    business: { name: string };
}

interface Props {
    tickets: Ticket[];
}

export default function SuperAdminTicketIndex({ tickets }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <div className="flex w-full flex-col gap-6 p-4 sm:p-6 md:p-8">
                <Head title="Support Tickets - Super Admin" />

                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight">Support Tickets</h1>
                    <p className="text-muted-foreground text-sm">Manage and respond to tenant support requests.</p>
                </div>

                <div className="border-border bg-card rounded-xl border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Business / User</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Date Opened</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
                                        No support tickets found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-foreground font-medium">{ticket.business?.name || 'Unknown Business'}</span>
                                                <span className="text-muted-foreground text-xs">{ticket.user?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate font-medium">{ticket.subject}</TableCell>
                                        <TableCell>
                                            <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'} className="rounded-md">
                                                {ticket.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-md shadow-sm">
                                                {ticket.priority.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{formatDate(ticket.created_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={route('super-admin.tickets.show', ticket.id)}>
                                                <Button variant="secondary" size="sm" className="rounded-md shadow-sm">
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
