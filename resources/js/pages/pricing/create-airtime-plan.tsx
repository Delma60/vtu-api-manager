import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
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
        // provider_id: '',
        // vendor_api_code: '',
        // discount_percentage: '',
        // pin_discount_percentage: '',
        type: 'airtime',
        is_active: true,
        // provider: '1',
        plan_type: '',
        providerable_cost_price: '0.00',
        use_provider_as_providerable: false,
        min_amount: '50',
        max_amount: '5000',
        providerable: {
            provider_id: 1,
            cost_price: '0.00',
            server_id: '',
            margin_value: '0.00',
            margin_type: 'fixed',
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting Airtime Plan:', data);
        post(route('discounts.store'));
    };

    console.log(errors);

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
                        href={route('pricing.airtime-data', { tab: 'airtime' })}
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Direct VTU Discount */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2 space-y-2">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g., 2.5"
                                                value={data.providerable.margin_value}
                                                onChange={(e) => setData('providerable', { ...data.providerable, margin_value: e.target.value })}
                                            />

                                            {errors.providerable && <p className="text-xs text-red-400">{errors.providerable}</p>}
                                        </div>
                                        <div className="">
                                            <Select
                                                value={data.providerable.margin_type}
                                                onValueChange={(value) => setData('providerable', { ...data.providerable, margin_type: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select discount type" />
                                                    <SelectContent>
                                                        <SelectItem value="fixed">Fixed</SelectItem>
                                                        <SelectItem value="percentage">Percentage</SelectItem>
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Column 2: Financials & Margins */}
                        <div className="space-y-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Range</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Min Amount</Label>
                                        <Input
                                            placeholder="e.g. 100"
                                            value={data.min_amount}
                                            onChange={(e) => setData('min_amount', e.target.value)}
                                        />
                                        <InputError message={errors.min_amount} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Max Amount</Label>
                                        <Input
                                            placeholder="e.g. 1000"
                                            value={data.max_amount}
                                            onChange={(e) => setData('max_amount', e.target.value)}
                                        />
                                        <InputError message={errors.max_amount} />
                                    </div>
                                    {/* <PriceField name="min" register={register} /> */}
                                    {/* <PriceField name="max" register={register} /> */}
                                </CardContent>
                            </Card>
                            <Card title="Server">
                                <CardHeader>
                                    <CardTitle>Servers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Select
                                        value={data.providerable.provider_id?.toString() || ''}
                                        onValueChange={(value) => setData('providerable', { ...data.providerable, provider_id: parseInt(value) })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {providers.map((provider) => (
                                                <SelectItem key={provider.id} disabled={!provider.is_active} value={provider.id.toString()}>
                                                    {provider.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                                <InputError message={errors?.['providerable.provider_id']} />

                                    {data.providerable.provider_id && (
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
                                                <InputError message={errors?.['providerable.server_id']} />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <Label className="text-sm font-medium">Provider Cost Price</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. 101 or mt_500"
                                                    value={data.providerable.cost_price ?? costPrice ?? ''}
                                                    onChange={(e) => setData('providerable', { ...data.providerable, cost_price: e.target.value })}
                                                />
                                                <InputError message={errors?.['providerable.cost_price']} />
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
                                                    setData('providerable', { ...data.providerable, provider_id: parseInt(data.provider) });
                                                    if (!data.providerable.cost_price) {
                                                        setData('providerable', { ...data.providerable, cost_price: String(costPrice) });
                                                    }
                                                } else {
                                                    setData('providerable', { ...data.providerable, provider_id: 0 });
                                                }
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <IsActiveSwitch
                                        checked={data.is_active}
                                        onCheckedChange={(v: boolean) => setData('is_active', v)}
                                        className="px-3 py-2"
                                    />
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
