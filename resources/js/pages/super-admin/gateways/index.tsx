import  AppLayout  from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, CreditCard, Edit2, Power, PowerOff, Building2 } from 'lucide-react';
import InputError from "@/components/input-error"


interface PaymentGateway {
    id: number;
    name: string;
    code: string;
    logo_url: string | null;
    is_active: boolean;
    tenant_count: number;
}

interface Props {
    gateways: PaymentGateway[];
}

export default function PaymentGatewaysIndex({ gateways }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        base_url: '',
        logo_url: '',
        is_active: true,
        api_key: '',
        api_secret: '',
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (gateway: PaymentGateway) => {
        clearErrors();
        setData(gateway);
        setEditingId(gateway.id);
        setIsModalOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('super-admin.payment-gateways.update', editingId), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('super-admin.payment-gateways.store'), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const toggleGlobalStatus = (id: number) => {
        router.post(route('super-admin.payment-gateways.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title="Global Payment Gateways" />

            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Payment Gateways</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage the payment processors available for tenants to use.
                        </p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Gateway
                    </Button>
                </div>

                {/* Gateway Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {gateways.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-card/50">
                            <CreditCard className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold">No Gateways Configured</h3>
                            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                                You haven't added any payment processors yet. Add a gateway so tenants can configure their checkouts.
                            </p>
                        </div>
                    ) : (
                        gateways.map((gateway) => (
                            <Card key={gateway.id} className={`flex flex-col relative overflow-hidden transition-all ${!gateway.is_active && 'opacity-75 grayscale-[0.5]'}`}>
                                {/* Status Indicator Strip */}
                                <div className={`absolute top-0 left-0 w-full h-1 ${gateway.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-background overflow-hidden shrink-0">
                                            {gateway.logo_url ? (
                                                <img src={gateway.logo_url} alt={gateway.name} className="h-full w-full object-cover p-1" />
                                            ) : (
                                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{gateway.name}</CardTitle>
                                            <p className="text-xs font-mono text-muted-foreground uppercase">{gateway.code}</p>
                                        </div>
                                    </div>

                                    {/* Quick Toggle */}
                                    <Switch
                                        checked={gateway.is_active}
                                        onCheckedChange={() => toggleGlobalStatus(gateway.id)}
                                    />
                                </CardHeader>

                                <CardContent className="flex-1 pb-4">
                                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                        <Building2 className="h-4 w-4" />
                                        <span>Used by <strong>{gateway.tenant_count}</strong> tenants</span>
                                    </div>
                                </CardContent>

                                <CardFooter className="border-t bg-muted/10 pt-4 flex items-center justify-between">
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${gateway.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {gateway.is_active ? 'Globally Active' : 'Globally Disabled'}
                                    </span>
                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(gateway)} className="h-8 text-muted-foreground hover:text-foreground">
                                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {/* Create/Edit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submitForm}>
                            <DialogHeader>
                                <DialogTitle>{editingId ? 'Edit Payment Gateway' : 'Add New Gateway'}</DialogTitle>
                                <DialogDescription>
                                    Define the core details. Tenants will provide their own API keys for this gateway in their dashboard.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-6">
                                <div className="space-y-2">
                                    <Label htmlFor="base_url">URL</Label>
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
                                    <p className="text-[10px] text-muted-foreground">Used programmatically to map API handlers.</p>
                                    {errors.code && <p className="text-xs text-rose-500">{errors.code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo_url">Logo URL (Optional)</Label>
                                    <Input
                                        id="base_url"
                                        type="url"
                                        placeholder="https://example.com/logo.png"
                                        value={data.logo_url}
                                        onChange={(e) => setData('logo_url', e.target.value)}
                                    />
                                    {errors.logo_url && <p className="text-xs text-rose-500">{errors.logo_url}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="api_key">Api Key</Label>
                                    <Input
                                        id="api_key"
                                        type="text"
                                        placeholder=""
                                        value={data.api_key}
                                        onChange={(e) => setData('api_key', e.target.value)}
                                    />
                                    <InputError message={errors.api_key} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo_url">Api Secret</Label>
                                    <Input
                                        id="secret_key"
                                        type="text"
                                        placeholder=""
                                        value={data.api_secret}
                                        onChange={(e) => setData('api_secret', e.target.value)}
                                    />
                                    <InputError message={errors.api_secret} />
                                </div>


                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {editingId ? 'Save Changes' : 'Add Gateway'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
