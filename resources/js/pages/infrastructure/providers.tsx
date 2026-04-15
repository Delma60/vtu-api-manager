import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Provider } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
    providers: Provider[];
    routingConfig: {
        auto_failover: boolean;
        timeout_ms: number;
    };
}

export default function ProvidersPage({ providers, routingConfig }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    console.log(providers);

    // Fallback data if props are missing during UI dev
    const activeProviders = (providers || []).map((provider) => ({
        ...provider,
        // Map database fields to UI fields
        upstream_balance: parseFloat(provider.cached_balance) || 0,
        success_rate: parseFloat(provider.success_rate_7d) || 0,
        status: provider.is_active ? (parseFloat(provider.success_rate_7d) >= 95 ? 'operational' : 'degraded') : 'disabled',
        latency: `${provider.timeout_ms}ms`,
    }));

    const config = routingConfig || { auto_failover: true, timeout_ms: 5000 };

    // Helper for status colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'degraded':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'disabled':
                return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
            default:
                return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen flex-1 bg-slate-950 p-8 font-sans text-slate-200">
                {/* 1. Header & Actions */}
                <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">API Providers</h1>
                        <p className="text-sm text-slate-400">Manage upstream connections, balances, and failover routing.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Provider
                        </Button>
                    </div>
                </header>

                {/* 2. Global Routing Settings */}
                <div className="mb-8 flex flex-col justify-between gap-6 rounded-xl border border-slate-800 bg-[#0f172a] p-5 shadow-sm md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                            <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-white">Smart Auto-Failover</h4>
                            <p className="mt-0.5 text-xs text-slate-400">
                                Automatically route transactions to the next priority provider if the primary fails.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 border-t border-slate-800 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                        <div className="flex flex-col">
                            <label className="mb-1 text-xs font-medium text-slate-500">Global Timeout</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    defaultValue={config.timeout_ms}
                                    className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white outline-none focus:border-indigo-500"
                                />
                                <span className="text-xs text-slate-500">ms</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="mb-2 text-xs font-medium text-slate-500">Enable Feature</label>
                            <div
                                className={`flex h-6 w-11 cursor-pointer items-center rounded-full px-1 transition-colors ${config.auto_failover ? 'bg-indigo-500' : 'bg-slate-700'}`}
                            >
                                <div
                                    className={`h-4 w-4 transform rounded-full bg-white transition-transform ${config.auto_failover ? 'translate-x-5' : ''}`}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Provider Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeProviders.map((provider) => (
                        <div
                            key={provider.id}
                            className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm transition-colors hover:border-slate-700"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between border-b border-slate-800/60 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-sm font-bold text-slate-300">
                                        {provider.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">{provider.name}</h3>
                                        <p className="text-xs text-slate-500">Priority: {provider.priority}</p>
                                    </div>
                                </div>
                                <span
                                    className={`rounded border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${getStatusColor(provider.status)}`}
                                >
                                    {provider.status}
                                </span>
                            </div>

                            {/* Card Body - Metrics */}
                            <div className="grid flex-1 grid-cols-2 gap-4 p-5">
                                <div className="col-span-2 rounded-lg border border-slate-800/50 bg-slate-900/50 p-3">
                                    <p className="mb-1 text-xs font-medium text-slate-500">Upstream Balance</p>
                                    {/* Visual warning if balance is low */}
                                    <p
                                        className={`font-mono text-lg font-bold ${parseFloat(provider.balance) < 20000 ? 'text-rose-400' : 'text-white'}`}
                                    >
                                        ₦{parseFloat(provider.balance)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-medium text-slate-500">Success Rate</p>
                                    <p className="text-sm text-slate-300">{provider.success_rate}%</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-medium text-slate-500">Avg Latency</p>
                                    <p className="text-sm text-slate-300">{provider.latency}</p>
                                </div>
                            </div>

                            {/* Card Footer - Actions */}
                            <div className="flex items-center justify-between border-t border-slate-800/60 bg-slate-900/30 p-4">
                                <div className="flex items-center gap-2">
                                    {/* <div
                                        className={`flex h-4 w-8 cursor-pointer items-center rounded-full px-0.5 transition-colors ${provider.status !== 'disabled' ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <div
                                            className={`h-3 w-3 transform rounded-full bg-white transition-transform ${provider.status !== 'disabled' ? 'translate-x-4' : ''}`}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">
                                        {provider.status !== 'disabled' ? 'Active' : 'Offline'}
                                    </span> */}

                                    <IsActiveSwitch {...provider} />
                                </div>

                                <button
                                    onClick={() => router.get(route('providers.edit', provider.id))}
                                    className="flex items-center gap-1 text-sm font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-indigo-300"
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
        //   code from name
        if (data.name) {
            const generatedCode = data.name
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '');
            setData('code', generatedCode);
        }
    }, [data.name]);
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
                                Provider Name <span className="text-red-500">*</span>
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
                                Base API URL <span className="text-red-500">*</span>
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
                                Api key / Username <span className="text-red-500">*</span>
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
                        <Button type="submit" disabled={processing} className="bg-indigo-600 text-white hover:bg-indigo-700">
                            {processing ? 'Creating...' : 'Create Provider'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const IsActiveSwitch = (provider?: Provider) => {
    const { data, setData, patch, errors } = useForm<Provider>(provider);
    console.log(errors);
    const handleChecked = (checked: boolean) => {
        setData('is_active', checked);
        patch(route('providers.update', provider?.id));
    };

    return (
        <div className="flex items-center justify-center gap-3 rounded-lg border border-slate-800/50 bg-slate-900/50 px-3 py-1">
            <Label className='text-sm'> Active </Label>
            {/* small switch */}
            <Switch checked={data.is_active} onCheckedChange={handleChecked} className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-red-500 border" />
        </div>
    );
};
