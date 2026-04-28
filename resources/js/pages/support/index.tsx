import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, HelpCircle, MessageSquare, Plus } from 'lucide-react';

interface Ticket {
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
    user: {
        name: string;
    };
}

interface Props {
    tickets: Ticket[];
}

export default function SupportIndex({ tickets }: Props) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'in_progress':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'resolved':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'closed':
                return <CheckCircle className="h-4 w-4 text-gray-500" />;
            default:
                return <HelpCircle className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'destructive';
            case 'in_progress':
                return 'default';
            case 'resolved':
                return 'secondary';
            case 'closed':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <AppLayout>
            <Head title="Support Tickets" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">Support</p>
                        <h1 className="text-3xl font-semibold tracking-tight">My Tickets</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            View and manage your support tickets. Get help with account issues, billing, or product questions.
                        </p>
                    </div>
                    <Link href={route('tickets.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Ticket
                        </Button>
                    </Link>
                </div>

                {tickets.length === 0 ? (
                    <Card className="border-border mx-auto max-w-2xl text-center">
                        <CardHeader>
                            <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                            <CardTitle>No tickets yet</CardTitle>
                            <CardDescription>
                                You haven't created any support tickets. If you need help, create a new ticket to get started.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={route('support')}>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Your First Ticket
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {tickets.map((ticket) => (
                            <Link key={ticket.id} href={route('tickets.show', ticket.id)}>
                                <Card className="border-border cursor-pointer transition-shadow hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(ticket.status)}
                                                    <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    Ticket #{ticket.id} • Created {new Date(ticket.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getStatusColor(ticket.status)} className="capitalize">
                                                    {ticket.status.replace('_', ' ')}
                                                </Badge>
                                                <span className={`text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
