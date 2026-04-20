import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { DataPlan, Network } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, CreditCard, Link as LinkIcon, Mail, Receipt, User, Zap } from 'lucide-react';
import React, { useMemo } from 'react';

export default function CreatePaymentLink() {
    const { auth, networks, dataPlans, cablePlans, cableNetworks } = usePage().props as unknown as {
        auth: { user: { name: string; business_name?: string } };
        networks: Network[];
        dataPlans: DataPlan[];
        cablePlans: any[];
        cableNetworks: any[];
    };
    const merchantName = auth.user.business_name || auth.user.name || 'Your Business';

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
        customer_name: '',
        customer_email: '',
        is_reusable: false,
        service_type: 'none', // 'none', 'airtime', 'data', 'cable'
        meta: {} as any,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payment-links.store'));
    };

    const updateMeta = (key: string, value: any) => {
        setData('meta', { ...data.meta, [key]: value });
    };

    // Fixed dependency array to correctly track the selected network name
    const networkTypes = useMemo(() => {
        if (data.service_type === 'airtime' && data.meta.network) {
            return networks.find((n: any) => n.name === data.meta.network)
                ?.network_types.filter((nt: any) => nt.type === data.service_type) || [];
        }
        return [];
    }, [networks, data.meta.network, data.service_type]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payment Links', href: route('payment-links.index') },
                { title: 'Create Link', href: '#' },
            ]}
        >
            <div className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Create a Payment Link</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Generate a secure link to accept payments from anyone, anywhere.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: FORM */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Section 1: Payment Details */}
                            <Card className="overflow-hidden">
                                <CardHeader className="border-b bg-muted/30 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Receipt className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg">Payment Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount <span className="text-destructive">*</span></Label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="font-semibold text-muted-foreground">₦</span>
                                            </div>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className="pl-8"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <InputError message={errors.amount} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="description"
                                            type="text"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="e.g., Logo Design Deposit"
                                            required
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 2: Link Behavior */}
                            <Card className="overflow-hidden">
                                <CardHeader className="border-b bg-muted/30 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <LinkIcon className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg">Link Type</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
                                    {/* One-Time Option */}
                                    <div
                                        onClick={() => setData('is_reusable', false)}
                                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                            !data.is_reusable 
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                        }`}
                                    >
                                        {!data.is_reusable && (
                                            <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />
                                        )}
                                        <h3 className="mb-1 font-semibold text-foreground">One-Time Payment</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Link expires immediately after a single successful payment.
                                        </p>
                                    </div>

                                    {/* Reusable Option */}
                                    <div
                                        onClick={() => setData('is_reusable', true)}
                                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                            data.is_reusable 
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                        }`}
                                    >
                                        {data.is_reusable && (
                                            <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />
                                        )}
                                        <h3 className="mb-1 font-semibold text-foreground">Reusable Link</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Link stays active. Ideal for selling standard services or products.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 3: Customer Details */}
                            <Card className="overflow-hidden">
                                <CardHeader className="border-b bg-muted/30 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg">
                                            Customer Details <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        If you leave this blank, we will ask the customer to enter their details on the checkout page. If filled, the fields will be locked.
                                    </p>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="customer_name">Customer Name</Label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <Input
                                                    id="customer_name"
                                                    type="text"
                                                    value={data.customer_name}
                                                    onChange={(e) => setData('customer_name', e.target.value)}
                                                    className="pl-9"
                                                    placeholder="e.g., John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="customer_email">Customer Email</Label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <Input
                                                    id="customer_email"
                                                    type="email"
                                                    value={data.customer_email}
                                                    onChange={(e) => setData('customer_email', e.target.value)}
                                                    className="pl-9"
                                                    placeholder="e.g., john@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 4: Automations */}
                            <Card className="overflow-hidden">
                                <CardHeader className="border-b bg-muted/30 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Attach Automation <span className="text-sm font-normal text-muted-foreground">(Optional)</span></CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label>Action on Payment Confirmation</Label>
                                        <Select
                                            value={data.service_type}
                                            onValueChange={(v) => {
                                                setData('service_type', v);
                                                setData('meta', {});
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Just collect payment (No automated action)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Just collect payment</SelectItem>
                                                <SelectItem value="airtime">Send Airtime</SelectItem>
                                                <SelectItem value="data">Send Data Plan</SelectItem>
                                                <SelectItem value="cable">Subscribe Cable TV</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Conditional Airtime Config */}
                                    {data.service_type === 'airtime' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Select Network</Label>
                                                <Select value={data.meta.network || ''} onValueChange={(v) => updateMeta('network', v)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose Network" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {networks.map((n: any) => (
                                                            <SelectItem key={n.id} value={n.name}>
                                                                {n.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Network Type</Label>
                                                <Select
                                                    value={data.meta.network_type || ''}
                                                    onValueChange={(v) => updateMeta('network_type', v)}
                                                    disabled={!data.meta.network}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose Network Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {networkTypes?.map((nt: any) => (
                                                            <SelectItem key={nt.id} value={nt.name}>
                                                                {nt.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Conditional Data Config */}
                                    {data.service_type === 'data' && (
                                        <div className="space-y-2">
                                            <Label>Select Data Plan to Deliver</Label>
                                            <Select
                                                value={data.meta.data_plan_id?.toString() || ''}
                                                onValueChange={(v) => updateMeta('data_plan_id', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose Data Plan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dataPlans.map((dp: any) => (
                                                        <SelectItem key={dp.id} value={dp.id.toString()}>
                                                            {dp.network_type?.network?.name} - {dp.name} (₦{dp.amount})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Conditional Cable Config */}
                                    {data.service_type === 'cable' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Decoder</Label>
                                                <Select
                                                    value={data.meta.cable_network || ''}
                                                    onValueChange={(v) => updateMeta('cable_network', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose Decoder" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {cableNetworks.map((cn: any) => (
                                                            <SelectItem key={cn.id} value={cn.name}>
                                                                {cn.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Bouquet</Label>
                                                <Select
                                                    value={data.meta.cable_plan_id?.toString() || ''}
                                                    onValueChange={(v) => updateMeta('cable_plan_id', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose Plan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {cablePlans.map((cp: any) => (
                                                            <SelectItem key={cp.id} value={cp.id.toString()}>
                                                                {cp.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    size="lg"
                                    className="px-8 shadow-md"
                                >
                                    {processing ? 'Generating Link...' : 'Create Payment Link'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: LIVE PREVIEW */}
                    <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
                        <div className="sticky top-6">
                            <h3 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">Live Preview</h3>

                            {/* Simulated Checkout Card aligned to theme */}
                            <div className="pointer-events-none w-full overflow-hidden rounded-2xl bg-card border shadow-xl">
                                <div className="relative overflow-hidden bg-muted/50 px-6 py-8 text-center border-b">
                                    <div className="relative z-10">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold uppercase shadow-lg transform rotate-3">
                                            {merchantName.charAt(0)}
                                        </div>
                                        <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Paying Merchant</p>
                                        <h2 className="text-xl font-bold text-foreground">{merchantName}</h2>
                                    </div>
                                </div>

                                <div className="px-6 py-8">
                                    <div className="mb-8 text-center rounded-2xl bg-muted/30 border border-border/50 p-6">
                                        <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Total Amount</p>
                                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-start justify-center">
                                            <span className="mr-1 text-2xl text-muted-foreground mt-1">₦</span>
                                            {data.amount ? parseFloat(data.amount).toLocaleString() : '0.00'}
                                        </h1>
                                        <p className="mt-3 text-sm font-medium text-muted-foreground">
                                            {data.description || 'Payment Description'}
                                        </p>
                                    </div>

                                    <div className="space-y-3 opacity-60 grayscale filter">
                                        <div className="flex h-12 w-full items-center rounded-xl border bg-background px-4 text-sm text-muted-foreground">
                                            {data.customer_name || 'Full Name'}
                                        </div>
                                        <div className="flex h-12 w-full items-center rounded-xl border bg-background px-4 text-sm text-muted-foreground">
                                            {data.customer_email || 'Email Address'}
                                        </div>
                                        <div className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md">
                                            Pay ₦{data.amount ? parseFloat(data.amount).toLocaleString() : '0.00'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center border-t bg-muted/30 px-6 py-4 text-xs font-medium text-muted-foreground">
                                    <CreditCard className="mr-1.5 h-4 w-4" />
                                    Secured checkout preview
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}