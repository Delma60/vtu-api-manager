import DeleteButton from '@/components/delete-button';
import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, Copy, Eye, EyeOff, Plus, Trash2, Webhook as WebhookIcon } from 'lucide-react';
import React, { useState } from 'react';

interface Webhook {
    id: number;
    url: string;
    secret: string;
    is_active: boolean;
    created_at: string;
}

export default function Webhooks({ webhooks }: { webhooks: Webhook[] }) {
    const [visibleSecrets, setVisibleSecrets] = useState<number[]>([]);
    const [copiedSecret, setCopiedSecret] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        url: '',
    });

    const toggleVisibility = (id: number) => {
        setVisibleSecrets((prev) => (prev.includes(id) ? prev.filter((whId) => whId !== id) : [...prev, id]));
    };

    const copyToClipboard = (id: number, secret: string) => {
        navigator.clipboard.writeText(secret);
        setCopiedSecret(id);
        setTimeout(() => setCopiedSecret(null), 2000);
    };

    const handleAddWebhook = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('webhooks.store'), {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

    const toggleStatus = (webhook: Webhook) => {
        router.put(route('webhooks.update', webhook.id), {
            is_active: !webhook.is_active,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this webhook endpoint?')) {
            router.delete(route('webhooks.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Webhooks" />
            <div className="flex min-h-screen flex-1 flex-col space-y-6 p-6 bg-background font-sans text-foreground">
                <header className="mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Subscribe to real-time notifications for transaction statuses and wallet events.</p>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                            <div>
                                <CardTitle className="text-lg">Endpoints</CardTitle>
                                <CardDescription className="text-muted-foreground">URLs where we will send POST requests.</CardDescription>
                            </div>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-1.5 shadow-sm">
                                        <Plus className="h-4 w-4" /> Add Endpoint
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <form onSubmit={handleAddWebhook}>
                                        <DialogHeader>
                                            <DialogTitle>Add Webhook Endpoint</DialogTitle>
                                            <DialogDescription>
                                                Enter the URL that will receive the webhook payloads. Must be HTTPS.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="url">Endpoint URL</Label>
                                                <Input
                                                    id="url"
                                                    type="url"
                                                    placeholder="https://your-domain.com/webhook/vtu"
                                                    value={data.url}
                                                    onChange={(e) => setData('url', e.target.value)}
                                                    className="bg-background"
                                                    required
                                                />
                                                <InputError message={errors.url} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setIsDialogOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Saving...' : 'Save Endpoint'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>

                        <CardContent className="p-0">
                            {webhooks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <WebhookIcon className="mb-3 h-10 w-10 opacity-20" />
                                    <p className="font-medium text-foreground">No webhooks configured.</p>
                                    <p className="text-xs">Add an endpoint to start receiving events.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {webhooks.map((webhook) => {
                                        const isVisible = visibleSecrets.includes(webhook.id);
                                        const maskedSecret = 'whsec_' + '•'.repeat(24);
                                        const displaySecret = isVisible ? webhook.secret : maskedSecret;

                                        return (
                                            <div key={webhook.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center hover:bg-muted/30 transition-colors">
                                                <div className="flex-1 space-y-3 overflow-hidden">
                                                    <div className="flex items-center gap-3">
                                                        <span className="truncate font-medium text-foreground">{webhook.url}</span>
                                                        {webhook.is_active ? (
                                                            <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-none">Active</Badge>
                                                        ) : (
                                                            <Badge className="border-border bg-muted/50 text-muted-foreground shadow-none">Inactive</Badge>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label className="mb-1 block text-xs text-muted-foreground">Signing Secret</Label>
                                                        <div className="flex items-center gap-2">
                                                            <code className="rounded border border-border bg-muted px-2 py-1 font-mono text-sm text-muted-foreground">
                                                                {displaySecret}
                                                            </code>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                                    onClick={() => toggleVisibility(webhook.id)}
                                                                >
                                                                    {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                                    onClick={() => copyToClipboard(webhook.id, webhook.secret)}
                                                                >
                                                                    {copiedSecret === webhook.id ? (
                                                                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                                    ) : (
                                                                        <Copy className="h-3 w-3" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs text-muted-foreground">Status</Label>
                                                        <IsActiveSwitch checked={webhook.is_active} onCheckedChange={() => toggleStatus(webhook)} />
                                                    </div>

                                                    <DeleteButton
                                                        variant="ghost"
                                                        resourceName='webhook'
                                                        route={route("webhooks.destroy", webhook?.id)}
                                                        requirePassword
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </DeleteButton>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}