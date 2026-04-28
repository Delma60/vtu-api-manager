import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, HelpCircle, MessageSquare } from 'lucide-react';

export default function SupportPage() {
    return (
        <AppLayout>
            <Head title="Support" />

            <div className="space-y-6 p-6">
                <div className="space-y-2">
                    <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">Support</p>
                    <h1 className="text-3xl font-semibold tracking-tight">Need help?</h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Contact our support team for account questions, billing issues, or product help.
                    </p>
                </div>

                <Card className="border-border max-w-3xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Support Tickets
                        </CardTitle>
                        <CardDescription>Manage your support tickets with our modern ticketing system.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="border-border bg-background rounded-xl border p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-foreground flex items-center gap-3 text-base font-semibold">
                                        <MessageSquare className="h-5 w-5" />
                                        View My Tickets
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Check the status of your existing support tickets and continue conversations.
                                    </p>
                                </div>
                                <Link href={route('tickets.index')}>
                                    <Button variant="outline" className="gap-2">
                                        View Tickets
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="border-border bg-background rounded-xl border p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-foreground flex items-center gap-3 text-base font-semibold">
                                        <HelpCircle className="h-5 w-5" />
                                        Create New Ticket
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Open a new support ticket for account issues, billing questions, or technical help.
                                    </p>
                                </div>
                                <Link href={route('tickets.create')}>
                                    <Button className="gap-2">
                                        <HelpCircle className="h-4 w-4" />
                                        New Ticket
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
