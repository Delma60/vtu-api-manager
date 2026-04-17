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
    token: string; // The plain text or partially masked token
    last_used_at: string | null;
    created_at: string;
    is_live: boolean;
}

export default function ApiKeys({ keys }: { keys: ApiKey[] }) {
    const [visibleKeys, setVisibleKeys] = useState<number[]>([]);
    const [copiedKey, setCopiedKey] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const toggleVisibility = (id: number) => {
        setVisibleKeys((prev) =>
            prev.includes(id) ? prev.filter((keyId) => keyId !== id) : [...prev, id]
        );
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
            <div className="flex min-h-screen flex-1 flex-col space-y-6 p-6">
                <header className="mb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-white">API Credentials</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Manage your API keys to authenticate requests to the VTU platform.
                    </p>
                </header>

                {/* Warning Alert */}
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200">
                    <div className="flex items-center gap-3">
                        <KeySquare className="h-5 w-5 text-amber-400" />
                        <p className="text-sm">
                            <strong>Keep your keys secure.</strong> Do not share your live API keys in publicly accessible areas such as GitHub, client-side code, or public forums.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-slate-800 bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <CardTitle className="text-lg">Standard API Keys</CardTitle>
                                <CardDescription className="text-slate-400">Keys used for server-to-server integrations.</CardDescription>
                            </div>

                            {/* Generate Key Dialog */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                        <Plus className="mr-2 h-4 w-4" /> Generate New Key
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-[425px]">
                                    <form onSubmit={handleGenerateKey}>
                                        <DialogHeader>
                                            <DialogTitle>Generate API Key</DialogTitle>
                                            <DialogDescription className="text-slate-400">
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
                                                    className="border-slate-700 bg-slate-800"
                                                />
                                                <InputError message={errors.name} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-300 hover:text-white">
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-500">
                                                {processing ? 'Generating...' : 'Generate Key'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>

                        <CardContent className="p-0">
                            {keys.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                                    <KeySquare className="mb-3 h-10 w-10 opacity-20" />
                                    <p>No API keys found.</p>
                                    <p className="text-xs">Generate one to start making API requests.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800">
                                    {keys.map((key) => {
                                        const isVisible = visibleKeys.includes(key.id);
                                        const maskedToken = key.token.substring(0, 8) + '••••••••••••••••••••••••' + key.token.substring(key.token.length - 4);
                                        const displayToken = isVisible ? key.token : maskedToken;

                                        return (
                                            <div key={key.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-white">{key.name}</p>
                                                        {key.is_live ? (
                                                            <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">Live</Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">Test</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <code className="rounded bg-slate-950 px-2 py-1 font-mono text-sm text-slate-300">
                                                            {displayToken}
                                                        </code>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:bg-slate-800 hover:text-white"
                                                                onClick={() => toggleVisibility(key.id)}
                                                            >
                                                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:bg-slate-800 hover:text-white"
                                                                onClick={() => copyToClipboard(key.id, key.token)}
                                                            >
                                                                {copiedKey === key.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Created on {new Date(key.created_at).toLocaleDateString()} • Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                                                    </div>
                                                </div>

                                                <div>

                                                    <DeleteButton
                                                        variant="ghost"
                                                        route={route('api-keys.destroy', key.id)}
                                                        resourceName='api key'
                                                        requirePassword
                                                        className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
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