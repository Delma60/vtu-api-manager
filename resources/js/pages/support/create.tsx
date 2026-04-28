import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export default function TicketCreate() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        description: '',
        priority: 'medium',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tickets.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Support Ticket" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={route('support')}>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Support
                        </Button>
                    </Link>
                </div>

                <div className="space-y-2">
                    <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">Support</p>
                    <h1 className="text-3xl font-semibold tracking-tight">Create New Ticket</h1>
                    <p className="text-muted-foreground max-w-2xl">Describe your issue in detail and we'll get back to you as soon as possible.</p>
                </div>

                <Card className="border-border max-w-3xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            New Support Ticket
                        </CardTitle>
                        <CardDescription>Please provide as much detail as possible to help us resolve your issue quickly.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder="Brief description of your issue"
                                    className="bg-white/50 backdrop-blur-sm dark:bg-black/50"
                                />
                                {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                    <SelectTrigger className="bg-white/50 backdrop-blur-sm dark:bg-black/50">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low - General questions</SelectItem>
                                        <SelectItem value="medium">Medium - Standard support</SelectItem>
                                        <SelectItem value="high">High - Important issues</SelectItem>
                                        <SelectItem value="urgent">Urgent - Critical problems</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.priority && <p className="text-sm text-red-600">{errors.priority}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or relevant information."
                                    rows={8}
                                    className="resize-none bg-white/50 backdrop-blur-sm dark:bg-black/50"
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create Ticket'}
                                </Button>
                                <Link href={route('support')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
