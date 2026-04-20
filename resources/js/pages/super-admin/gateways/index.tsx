import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, CreditCard, Edit2, Plus, Star, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                className={`group relative flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md ${
                                    !gateway.is_active ? 'bg-muted/20 opacity-80' : 'bg-card'
                                } ${gateway.is_default ? 'border-primary shadow-primary/10 shadow-sm' : ''}`}
                            >
                                {/* Subtle background glow for the default gateway */}
                                {gateway.is_default && (
                                    <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />
                                )}

                                <CardHeader className="relative z-10 flex flex-row items-start justify-between pt-5 pb-4">
                                    <div className="flex items-center gap-4">
                                        {/* Logo Container with Status Dot */}
                                        <div className="relative">
                                            <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-sm">
                                                {gateway.logo_url ? (
                                                    <img src={gateway.logo_url} alt={gateway.name} className="h-8 w-8 object-contain" />
                                                ) : (
                                                    <CreditCard className="text-muted-foreground h-6 w-6" />
                                                )}
                                            </div>
                                            {/* Status Dot */}
                                            <div
                                                className={`border-background absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 ${
                                                    gateway.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                                                }`}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg tracking-tight">{gateway.name}</CardTitle>
                                                {gateway.is_default && (
                                                    <span className="bg-primary text-primary-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-sm">
                                                        <Star className="h-2.5 w-2.5 fill-current" /> Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{gateway.code}</p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10 flex-1 pb-5">
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Metric 1: Usage */}
                                        <div className="bg-muted/20 flex flex-col justify-center rounded-lg border p-3">
                                            <div className="text-muted-foreground mb-1 flex items-center gap-1.5">
                                                <Building2 className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-bold tracking-wider uppercase">Usage</span>
                                            </div>
                                            <span className="text-sm font-semibold">{gateway.tenant_count} Tenants</span>
                                        </div>

                                        {/* Metric 2: Connection Status */}
                                        <div
                                            className={`flex flex-col justify-center rounded-lg border p-3 ${
                                                gateway.connected ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'
                                            }`}
                                        >
                                            <div
                                                className={`mb-1 flex items-center gap-1.5 ${
                                                    gateway.connected ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                }`}
                                            >
                                                {gateway.connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                                                <span className="text-[10px] font-bold tracking-wider uppercase">API Status</span>
                                            </div>
                                            <span
                                                className={`text-sm font-semibold ${
                                                    gateway.connected ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                                                }`}
                                            >
                                                {gateway.connected ? 'Connected' : 'Disconnected'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-muted/10 relative z-10 flex items-center justify-between border-t py-3">
                                    {/* Action 1: Toggle */}
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={gateway.is_active}
                                            onCheckedChange={() => toggleGlobalStatus(gateway.id)}
                                            className="scale-90 data-[state=checked]:bg-emerald-500"
                                        />
                                        <span className="text-muted-foreground text-xs font-medium">
                                            {gateway.is_active ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>

                                    {/* Action 2: Configure */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditDrawer(gateway)}
                                        className="hover:border-border hover:bg-background h-8 border border-transparent shadow-sm"
                                    >
                                        <Edit2 className="text-muted-foreground mr-2 h-3.5 w-3.5" /> Configure
                                    </Button>
                                </CardFooter>
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
