import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';

export default function CreateAirtimePlan({ networks: activeNetworks, providers }: any) {
    const { data, setData, post, processing, errors } = useForm({
        network_id: '',
        provider_id: '',
        vendor_api_code: '',
        discount_percentage: '',
        pin_discount_percentage: '',
        is_active: true,
        provider: '1',
        plan_type: '',
        providerable_cost_price: '0.00',
        use_provider_as_providerable: false,
        providerable: {
            provider_id: 0,
            cost_price: '0.00',
            server_id: '',
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting Airtime Plan:', data);
        // post('/pricing/airtime-plan');
    };

    const costPrice = useMemo(() => {
        const cp = data?.providerable.cost_price;
        if (cp !== undefined && cp !== '') return parseFloat(String(cp)) || 0;
        return 0;
    }, [data.providerable.cost_price]);

    const plan_types = useMemo(() => {
        if (!data.network_id) return [];
        const selectedNetwork = activeNetworks.find((net: any) => net.id.toString() === data.network_id.toString());
        return selectedNetwork?.network_types.filter((nt) => nt.type === 'airtime') || [];
    }, [data.network_id]);

    return (
        <AppLayout>
            <div className="flex min-h-screen flex-1 flex-col space-y-6 p-6">
                <Head title="Create Airtime Plan" />
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/pricing"
                        className="group mb-2 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-indigo-400"
                    >
                        <svg
                            className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Pricing
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Create Airtime Configuration</h1>
                    <p className="mt-1 text-sm text-slate-400">Set up routing and discount margins for VTU and Airtime PINs.</p>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {/* Column 1: Identity & Vendor Routing */}
                        <div className="space-y-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Target Network */}
                                    <div className="space-y-1">
                                        <Select value={data.network_id} onValueChange={(value) => setData('network_id', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Network" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activeNetworks.map((net) => (
                                                    <SelectItem key={net.id} value={net.id.toString()}>
                                                        {net.name} {net.id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.network_id && <p className="text-xs text-red-400">{errors.network_id}</p>}
                                    </div>
                                    

                                    <div className="space-y-1">
                                        <Select value={data.plan_type} onValueChange={(value) => setData('plan_type', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Plan Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {plan_types.map((net) => (
                                                    <SelectItem key={net.id} value={net.id.toString()}>
                                                        {net.name?.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.plan_type} />
                                    </div>

                                    {/* Vendor API Code */}
                                    <div className="space-y-1">
                                        <Input
                                            placeholder="e.g., mtn_custom_vtu"
                                            value={data.vendor_api_code}
                                            onChange={(e) => setData('vendor_api_code', e.target.value)}
                                        />
                                        <p className="text-[10px] text-slate-500">The exact payload code the vendor expects.</p>
                                        {errors.vendor_api_code && <p className="text-xs text-red-400">{errors.vendor_api_code}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <Label>Active Status</Label>
                                        <Switch checked={data.is_active} onCheckedChange={(v: boolean) => setData('is_active', v)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Column 2: Financials & Margins */}
                        <div className="space-y-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Financials & Margins</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Direct VTU Discount */}
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 2.5"
                                            value={data.discount_percentage}
                                            onChange={(e) => setData('discount_percentage', e.target.value)}
                                        />
                                        <span className="block text-xs font-medium text-slate-500">
                                            User pays {100 - (Number(data.discount_percentage) || 0)}%
                                        </span>
                                        {errors.discount_percentage && <p className="text-xs text-red-400">{errors.discount_percentage}</p>}
                                    </div>

                                    {/* Airtime PIN Discount */}
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 2.0"
                                            value={data.pin_discount_percentage}
                                            onChange={(e) => setData('pin_discount_percentage', e.target.value)}
                                        />
                                        <span className="block text-xs font-medium text-slate-500">
                                            User pays {100 - (Number(data.pin_discount_percentage) || 0)}%
                                        </span>
                                        {errors.pin_discount_percentage && <p className="text-xs text-red-400">{errors.pin_discount_percentage}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card title="Server">
                                <CardHeader>
                                    <CardTitle>Servers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Select value={data.provider} onValueChange={(value) => setData('provider', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {providers.map((provider) => (
                                                <SelectItem key={provider.id} value={provider.id.toString()}>
                                                    {provider.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {data.provider && (
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="flex-1 space-y-2">
                                                <Label className="text-sm font-medium">Server Plan ID</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. 101 or mt_500"
                                                    value={data.providerable.server_id}
                                                    className="w-full"
                                                    onChange={(e) => setData('providerable', { ...data.providerable, server_id: e.target.value })}
                                                />
                                                <InputError message={errors?.providerable} />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <Label className="text-sm font-medium">Provider Cost Price</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. 101 or mt_500"
                                                    value={data.providerable_cost_price ?? costPrice ?? ''}
                                                    onChange={(e) => setData('pin_discount_percentage', e.target.value)}
                                                />
                                                <InputError message={errors?.providerable} />
                                            </div>

                                            {/* <Input
                                                
                                                label="Provider Cost Price"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={values.providerable_cost_price ?? costPrice ?? ''}
                                                onChange={handleCostPriceChange}
                                                animated
                                            /> */}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between px-3 py-2">
                                        <Label>Use provider as plan-specific provider</Label>
                                        <Switch
                                            checked={Boolean(data?.use_provider_as_providerable)}
                                            onCheckedChange={(v: boolean) => {
                                                setData('use_provider_as_providerable', v);
                                                if (v) {
                                                    setData('providerable', { ...data.providerable, provider_id: data.provider });
                                                    if (!data.providerable.cost_price) {
                                                        setData('providerable_cost_price', { ...data.providerable, cost_price: String(costPrice) });
                                                    }
                                                } else {
                                                    setData('providerable', data.providerable);
                                                }
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
                            Cancel
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Airtime Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
