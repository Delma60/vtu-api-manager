import DeleteButton from '@/components/delete-button';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Check, Copy, Eye, EyeOff, KeySquare, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface ApiKey {
    id: number;
    name: string;
    hashed_token: string; // The plain text or partially masked token
    last_used_at: string | null;
    created_at: string;
    is_active: boolean;
    prefix_plain_token:string;
}

export default function ApiKeys({ keys }: { keys: ApiKey[] }) {
    console.log(keys)
    const [visibleKeys, setVisibleKeys] = useState<number[]>([]);
    const [copiedKey, setCopiedKey] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const toggleVisibility = (id: number) => {
        setVisibleKeys((prev) => (prev.includes(id) ? prev.filter((keyId) => keyId !== id) : [...prev, id]));
    };

    const copyToClipboard = (id: number, token: string) => {
        navigator.clipboard.writeText(token);
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleGenerateKey = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('api-keys.store'), {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

    const handleRevoke = (id: number) => {
        // if (confirm('Are you sure you want to revoke this API key? Any applications using it will immediately lose access.')) {
        // }
        router.delete(route('api-keys.destroy', id));
    };

    return (
        <AppLayout>
            <Head title="API Keys" />
            <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col space-y-6 p-6 font-sans">
                <header className="mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">API Credentials</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your API keys to authenticate requests to the VTU platform.</p>
                </header>

                {/* Warning Alert */}
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-200">
                    <div className="flex items-center gap-3">
                        <KeySquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm">
                            <strong>Keep your keys secure.</strong> Do not share your live API keys in publicly accessible areas such as GitHub,
                            client-side code, or public forums.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="border-border flex flex-row items-center justify-between border-b pb-4">
                            <div>
                                <CardTitle className="text-lg">Standard API Keys</CardTitle>
                                <CardDescription className="text-muted-foreground">Keys used for server-to-server integrations.</CardDescription>
                            </div>

                            {/* Generate Key Dialog */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-1.5 shadow-sm">
                                        <Plus className="h-4 w-4" /> Generate New Key
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <form onSubmit={handleGenerateKey}>
                                        <DialogHeader>
                                            <DialogTitle>Generate API Key</DialogTitle>
                                            <DialogDescription>
                                                Provide a recognizable name for your new API key to help you track its usage.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Key Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="e.g. Production Web Server"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="bg-background"
                                                />
                                                <InputError message={errors.name} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Generating...' : 'Generate Key'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>

                        <CardContent className="p-0">
                            {keys.length === 0 ? (
                                <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                                    <KeySquare className="mb-3 h-10 w-10 opacity-20" />
                                    <p className="text-foreground font-medium">No API keys found.</p>
                                    <p className="text-xs">Generate one to start making API requests.</p>
                                </div>
                            ) : (
                                <div className="divide-border divide-y">
                                    {keys.map((key) => {
                                        const isVisible = visibleKeys.includes(key.id);

                                        // Dynamically calculate the prefix and correctly grab the last 4 characters
                                        const prefix = key.is_active ? 'VTUSECK-' : 'VTUSECK_TEST-';

                                        // Mask logic: shows prefix + dots + last 4 chars (e.g. VTUSECK_TEST-••••••••••••••••••••••••a8B3)
                                        const maskedToken =
                                            key.prefix_plain_token.length > 15
                                                ? `${prefix}••••••••••••••••••••••••${key.prefix_plain_token.slice(-4)}`
                                                : `${prefix}••••••••••••••••••••••••`;

                                        const displayToken = isVisible ? key.prefix_plain_token : maskedToken;

                                        return (
                                            <div
                                                key={key.id}
                                                className="hover:bg-muted/30 flex flex-col justify-between gap-4 p-5 transition-colors sm:flex-row sm:items-center"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-foreground font-medium">{key.name}</p>
                                                        {key.is_active ? (
                                                            <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 shadow-none hover:bg-emerald-500/20 dark:text-emerald-400">
                                                                Live
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-700 shadow-none hover:bg-amber-500/20 dark:text-amber-400">
                                                                Test
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <code className="border-border bg-muted text-muted-foreground rounded border px-2 py-1 font-mono text-sm">
                                                            {displayToken}
                                                        </code>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                                                onClick={() => toggleVisibility(key.id)}
                                                            >
                                                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                                                onClick={() => copyToClipboard(key.id, key.prefix_plain_token)}
                                                            >
                                                                {copiedKey === key.id ? (
                                                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        Created on {new Date(key.created_at).toLocaleDateString()} • Last used:{' '}
                                                        {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <DeleteButton
                                                        variant="ghost"
                                                        route={route('api-keys.destroy', key.id)}
                                                        resourceName="api key"
                                                        requirePassword
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Revoke Key
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
