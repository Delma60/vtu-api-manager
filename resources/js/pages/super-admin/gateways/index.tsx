import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, CreditCard, Edit2, Plus, Star, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentGateway {
    id: number;
    name: string;
    code: string;
    logo_url: string | null;
    base_url: string | null;
    is_active: boolean;
    is_default: boolean;
    tenant_count: number;
    api_key: string | null;
    api_secret: string | null;
    connected?: boolean;
}

interface Props {
    gateways: PaymentGateway[];
}

export default function PaymentGatewaysIndex({ gateways }: Props) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        base_url: '',
        logo_url: '',
        is_active: true,
        is_default: false,
        api_key: '',
        api_secret: '',
    });

    const openCreateDrawer = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setIsSheetOpen(true);
    };

    const openEditDrawer = (gateway: PaymentGateway) => {
        clearErrors();
        setData({
            name: gateway.name,
            code: gateway.code,
            base_url: gateway.base_url || '',
            logo_url: gateway.logo_url || '',
            is_active: gateway.is_active,
            is_default: gateway.is_default,
            api_key: gateway.api_key || '',
            api_secret: gateway.api_secret || '',
        });
        setEditingId(gateway.id);
        setIsSheetOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('super-admin.payment-gateways.update', editingId), {
                onSuccess: () => setIsSheetOpen(false),
            });
        } else {
            post(route('super-admin.payment-gateways.store'), {
                onSuccess: () => setIsSheetOpen(false),
            });
        }
    };

    const toggleGlobalStatus = (id: number) => {
        router.post(route('super-admin.payment-gateways.toggle', id), {}, { preserveScroll: true });
    };

    useEffect(() => {
        if (data.name) {
            const generatedCode = data.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '');
            setData('code', generatedCode);
        }
    }, [data.name]);

    return (
        <AppLayout>
            <Head title="Global Payment Gateways" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Payment Gateways</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage the payment processors available for tenants to use.</p>
                    </div>
                    <Button onClick={openCreateDrawer}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Gateway
                    </Button>
                </div>

                {/* Gateway Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {gateways.length === 0 ? (
                        <div className="bg-card/50 col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                            <CreditCard className="text-muted-foreground mb-4 h-10 w-10 opacity-50" />
                            <h3 className="text-lg font-semibold">No Gateways Configured</h3>
                            <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
                                You haven't added any payment processors yet. Add a gateway so tenants can configure their checkouts.
                            </p>
                        </div>
                    ) : (
                        gateways.map((gateway) => (
                            <Card
                                key={gateway.id}
                                className={`group flex flex-col transition-all duration-300 hover:shadow-md ${
                                    gateway.is_active ? 'bg-card' : 'bg-muted/30 opacity-90'
                                } ${gateway.is_default ? 'ring-primary border-primary shadow-primary/10 shadow-sm ring-1' : 'border-border'}`}
                            >
                                <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
                                    {/* Top Section: Logo, Titles & Status */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border p-1 shadow-sm">
                                                {gateway.logo_url ? (
                                                    <img src={gateway.logo_url} alt={gateway.name} className="h-full w-full object-contain" />
                                                ) : (
                                                    <CreditCard className="text-muted-foreground h-6 w-6" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-base leading-none font-semibold tracking-tight">{gateway.name}</h3>
                                                    {gateway.is_default && (
                                                        <span className="bg-primary/10 text-primary flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                                            <Star className="mr-1 h-2.5 w-2.5 fill-current" /> Default
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-muted-foreground mt-1.5 font-mono text-xs tracking-wider uppercase">
                                                    {gateway.code}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Pill */}
                                        <div
                                            className={`flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                gateway.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                            }`}
                                        >
                                            {gateway.is_active ? 'Active' : 'Disabled'}
                                        </div>
                                    </div>

                                    {/* Middle Section: Inline Metrics */}
                                    <div className="mt-2 flex items-center gap-4 text-sm">
                                        <div className="text-muted-foreground flex items-center gap-1.5">
                                            <Building2 className="h-4 w-4" />
                                            <span className="font-medium">{gateway.tenant_count} Tenants</span>
                                        </div>

                                        {/* Separator Line */}
                                        <div className="bg-border h-4 w-px" />

                                        <div
                                            className={`flex items-center gap-1.5 font-medium ${
                                                gateway.connected ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                            }`}
                                        >
                                            {gateway.connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                                            <span>{gateway.connected ? 'API Connected' : 'Disconnected'}</span>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Bottom Section: Actions */}
                                <div className="bg-muted/10 flex items-center justify-between border-t px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={gateway.is_active}
                                            onCheckedChange={() => toggleGlobalStatus(gateway.id)}
                                            className="scale-75"
                                        />
                                        <span className="text-muted-foreground text-xs font-medium">Toggle Status</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDrawer(gateway)}
                                        className="bg-background h-8 shadow-sm"
                                    >
                                        <Edit2 className="text-muted-foreground mr-2 h-3.5 w-3.5" /> Configure
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Create/Edit Slide-out Drawer */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="flex w-full flex-col sm:max-w-[450px]">
                        <SheetHeader>
                            <SheetTitle>{editingId ? 'Edit Payment Gateway' : 'Add New Gateway'}</SheetTitle>
                            <SheetDescription>
                                Define the core details. Tenants will provide their own API keys for this gateway in their dashboard.
                            </SheetDescription>
                        </SheetHeader>

                        <form onSubmit={submitForm} className="mt-4 flex flex-1 flex-col overflow-hidden">
                            <div className="-mr-4 flex-1 space-y-4 overflow-y-auto pr-4 pb-6">
                                <div className="space-y-2">
                                    <Label htmlFor="base_url">Base URL</Label>
                                    <Input
                                        id="base_url"
                                        placeholder="e.g., https://api.paystack.com"
                                        value={data.base_url}
                                        onChange={(e) => setData('base_url', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.base_url} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Paystack"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Internal Code (Unique)</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g., paystack"
                                        className="font-mono lowercase"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                        required
                                    />
                                    <p className="text-muted-foreground text-[10px]">Used programmatically to map API handlers.</p>
                                    {errors.code && <p className="text-xs text-rose-500">{errors.code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo_url">Logo URL (Optional)</Label>
                                    <Input
                                        id="logo_url"
                                        type="url"
                                        placeholder="https://example.com/logo.png"
                                        value={data.logo_url}
                                        onChange={(e) => setData('logo_url', e.target.value)}
                                    />
                                    {errors.logo_url && <p className="text-xs text-rose-500">{errors.logo_url}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="api_key">API Key</Label>
                                    <Input
                                        id="api_key"
                                        type="text"
                                        placeholder="Enter API Key"
                                        value={data.api_key}
                                        onChange={(e) => setData('api_key', e.target.value)}
                                    />
                                    <InputError message={errors.api_key} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="api_secret">API Secret</Label>
                                    <Input
                                        id="api_secret"
                                        type="text"
                                        placeholder="Enter API Secret"
                                        value={data.api_secret}
                                        onChange={(e) => setData('api_secret', e.target.value)}
                                    />
                                    <InputError message={errors.api_secret} />
                                </div>

                                {/* Default Toggle */}
                                <div className="mt-2 flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_default">Default Gateway</Label>
                                        <p className="text-muted-foreground text-[10px]">Make this the primary default payment gateway.</p>
                                    </div>
                                    <Switch id="is_default" checked={data.is_default} onCheckedChange={(checked) => setData('is_default', checked)} />
                                </div>
                            </div>

                            <SheetFooter className="mt-auto border-t pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {editingId ? 'Save Changes' : 'Add Gateway'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
