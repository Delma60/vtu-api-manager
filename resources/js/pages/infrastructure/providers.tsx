import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
// import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Provider } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    providers: Provider[];
    routingConfig: {
        auto_failover: boolean;
        timeout_ms: number;
    };
    low_balance_threshold:number
}

export default function ProvidersPage({ providers, routingConfig: config, low_balance_threshold }: Props) {
    console.log(providers[0]);
    const [autoFailover, setAutoFailover] = useState(config.auto_failover);
    const [timeout, setTimeoutMs] = useState(config.timeout_ms);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const isFirstRender = useRef(true);

    // Fallback data if props are missing during UI dev
    const activeProviders = (providers || []).map((provider) => ({
        ...provider,
        // Map database fields to UI fields
        upstream_balance: parseFloat(provider.balance) || 0,
        success_rate: parseFloat(provider.success_rate_7d.toString()) || 0,
        status: provider.is_active ? (parseFloat(provider.success_rate_7d.toString()) >= 95 ? 'operational' : 'degraded') : 'disabled',
        latency: `${provider.avg_latency}ms`,
    }));

    const handleFailoverToggle = (checked: boolean) => {
        setAutoFailover(checked); // Update UI instantly for perceived performance

        // Send the update to the backend silently
        router.post(
            route('settings.update.single'),
            {
                key: 'auto_failover',
                value: checked,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    // Revert UI if the server request fails
                    setAutoFailover(!checked);
                    alert('Failed to update failover setting.');
                },
            },
        );
    };

    useEffect(() => {
        // Skip the initial render so we don't save immediately on page load
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Set a timer to save after 800ms of inactivity
        const timer = setTimeout(() => {
            router.post(
                route('settings.update.single'),
                {
                    key: 'timeout_ms',
                    value: timeout,
                },
                {
                    preserveScroll: true,
                    preserveState: true,

                },
            );
        }, 800);

        // Cleanup the timer if the user types again before 800ms finishes
        return () => clearTimeout(timer);
    }, [timeout]);

    // Helper for status colors using semantic/tailwind dynamic colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'degraded':
                return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'disabled':
                return 'text-muted-foreground bg-muted/50 border-border';
            default:
                return 'text-destructive bg-destructive/10 border-destructive/20';
        }
    };

    return (
        <AppLayout>
            <div className="bg-background text-foreground min-h-screen flex-1 p-8 font-sans">
                {/* 1. Header & Actions */}
                <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">API Providers</h1>
                        <p className="text-muted-foreground text-sm">Manage upstream connections, balances, and failover routing.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Provider
                        </Button>
                    </div>
                </header>

                {/* 2. Global Routing Settings */}
                <div className="border-border bg-card text-card-foreground mb-8 flex flex-col justify-between gap-6 rounded-xl border p-5 shadow-sm md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="border-primary/20 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg border">
                            <svg className="text-primary h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-base font-semibold">Smart Auto-Failover</h4>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Automatically route transactions to the next priority provider if the primary fails.
                            </p>
                        </div>
                    </div>

                    <div className="border-border flex items-center gap-6 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                        <div className="flex flex-col">
                            <label className="text-muted-foreground mb-1 text-xs font-medium">Global Timeout</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    defaultValue={timeout}
                                    onChange={(e) => setTimeoutMs(parseInt(e.target.value) || 0)}
                                    className="border-input bg-background text-foreground focus:border-ring focus:ring-ring w-20 rounded border px-2 py-1 text-sm transition-all outline-none focus:ring-1"
                                />
                                <span className="text-muted-foreground text-xs">ms</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-muted-foreground mb-2 text-xs font-medium">Enable Feature</label>
                            <Switch checked={autoFailover} onCheckedChange={handleFailoverToggle} />
                        </div>
                    </div>
                </div>

                {/* 3. Provider Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeProviders.map((provider) => (
                        <div
                            key={provider.id}
                            className="group border-border bg-card text-card-foreground hover:border-ring/50 flex flex-col overflow-hidden rounded-xl border shadow-sm transition-colors"
                        >
                            {/* Card Header */}
                            <div className="border-border flex items-start justify-between border-b p-5">
                                <div className="flex items-center gap-3">
                                    <div className="border-input bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold">
                                        {provider.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold">{provider.name}</h3>
                                        <p className="text-muted-foreground text-xs">Priority: {provider.priority}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span
                                        className={`rounded border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${getStatusColor(provider.status)}`}
                                    >
                                        {provider.status}
                                    </span>

                                    {/* connection badge */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${provider.connection ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
                                        ></span>
                                        <span className="text-muted-foreground text-xs">{provider.connection ? 'Connected' : 'Disconnected'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body - Metrics */}
                            {/* // resources/js/pages/infrastructure/providers.tsx */}
                            {/* // ... [around line 147] ... */}

                            {/* Card Body - Metrics */}
                            <div className="grid flex-1 grid-cols-2 gap-4 p-5">
                                <div className="border-border bg-muted/30 col-span-2 rounded-lg border p-3">
                                    <p className="text-muted-foreground mb-1 text-xs font-medium">Upstream Balance</p>
                                    {/* Visual warning if balance is low */}
                                    <p
                                        className={`font-mono text-lg font-bold ${parseFloat(provider.balance) <= low_balance_threshold ? 'text-destructive' : parseFloat(provider.balance) <= (low_balance_threshold * 2) ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}
                                    >
                                        ₦{parseFloat(provider.balance)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1 text-xs font-medium">Success Rate</p>
                                    <p className="text-sm font-medium">{provider.success_rate}%</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1 text-xs font-medium">Avg Latency</p>
                                    <p className="text-sm font-medium">{provider.latency}</p>
                                </div>
                                {/* New Webhook Callback URL Section */}
                                {/* // resources/js/pages/infrastructure/providers.tsx */}
                                {/* Webhook Callback URL Section */}
                                <div className="col-span-2 mt-2">
                                    <p className="text-muted-foreground mb-1 text-[11px] font-medium tracking-wider uppercase">
                                        Callback Webhook URL
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            readOnly
                                            value={provider.callback_url || ''}
                                            className="border-input bg-muted/30 text-muted-foreground w-full truncate rounded border px-2 py-1.5 text-xs outline-none"
                                        />

                                        {/* Copy Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-7 w-7 shrink-0 p-0"
                                            title="Copy Webhook URL"
                                            onClick={() => {
                                                navigator.clipboard.writeText(provider.callback_url || '');
                                            }}
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </Button>

                                        <Dialog>
                                            {/* Trigger Button - Just opens the modal, no logic here anymore */}
                                            <DialogTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 w-7 shrink-0 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-500 dark:hover:bg-amber-500/10"
                                                    title="Regenerate Webhook URL"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                </Button>
                                            </DialogTrigger>

                                            {/* Modal Content */}
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Regenerate Webhook URL</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to regenerate this webhook URL? The old URL will stop working
                                                        immediately.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {/* Actions */}
                                                <DialogFooter className="mt-4">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))} // Simple hack to close uncontrolled dialog, or use <DialogClose> if imported
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            router.post(
                                                                route('providers.regenerate-uuid', provider.id),
                                                                {},
                                                                {
                                                                    preserveScroll: true,
                                                                    preserveState: true,
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        Yes, Regenerate
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer - Actions */}
                            {/* // ... */}

                            {/* Card Footer - Actions */}
                            <div className="border-border bg-muted/10 flex items-center justify-between border-t p-4">
                                <div className="flex items-center gap-2">
                                    <IsActiveSwitch {...provider} />
                                </div>

                                <button
                                    onClick={() => router.get(route('providers.edit', provider.id))}
                                    className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Configure
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <CreateProvider isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} />
        </AppLayout>
    );
}

const CreateProvider = ({
    isAddDialogOpen,
    setIsAddDialogOpen,
}: {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        props: { auth },
    } = usePage();

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        base_url: '',
        api_key: '',
        api_secret: '',
        user_id: auth?.user?.id?.toString(),
    });
    const handleCreateProvider = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('providers.store'), {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                reset();
            },
        });
    };

    useEffect(() => {
        // code from name
        if (data.name) {
            const generatedCode = data.name
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '');
            setData('code', generatedCode);
        }
    }, [data.name]);

    console.log(errors);

    return (
        <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                    reset();
                    clearErrors();
                }
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateProvider}>
                    <DialogHeader>
                        <DialogTitle>Add New Provider</DialogTitle>
                        <DialogDescription>
                            Register a new upstream VTU vendor. You can configure API keys and webhooks on the next page.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Provider Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., VTpass Aggregator"
                                autoFocus
                            />
                            <p className="text-muted-foreground text-[10px]">A recognizable display name for this connection.</p>
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="base_url">
                                Base API URL <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="base_url"
                                type="url"
                                value={data.base_url}
                                onChange={(e) => setData('base_url', e.target.value)}
                                placeholder="https://api.vendor.com/v1"
                            />
                            <InputError message={errors.base_url} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="api_key">
                                Api key / Username <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="api_key"
                                type="text"
                                value={data.api_key}
                                onChange={(e) => setData('api_key', e.target.value)}
                                placeholder="Your API Key"
                            />
                            <InputError message={errors.api_key} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="api_secret">Secret Key / Password</Label>
                            <Input
                                id="api_secret"
                                type="text"
                                value={data.api_secret}
                                onChange={(e) => setData('api_secret', e.target.value)}
                                placeholder="Your Secret Key (if applicable)"
                            />
                            <InputError message={errors.api_secret} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Provider'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const IsActiveSwitch = (provider?: Provider) => {
    const handleChecked = (checked: boolean) => {
        router.put(route('providers.update', provider?.id), { is_active: checked });
    };

    return (
        <div className="border-border bg-background flex items-center justify-center gap-3 rounded-lg border px-3 py-1">
            <Label className="text-sm"> Active </Label>
            {/* small switch */}
            <Switch
                checked={!!provider?.is_active}
                onCheckedChange={handleChecked}
                className="data-[state=unchecked]:bg-destructive data-[state=checked]:bg-emerald-500"
            />
        </div>
    );
};
