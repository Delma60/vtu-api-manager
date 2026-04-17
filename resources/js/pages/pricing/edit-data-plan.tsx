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

export default function EditDataPlan({ networks: activeNetworks, providers, plan }: any) {
    const { data, setData, patch, processing, errors } = useForm({
        providerable_cost_price: '0.00',
        use_provider_as_providerable: false,
        ...plan,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('data-plans.update', { data_plan: data.id }));
    };

    const plan_types = useMemo(() => {
        if (!data.network_id) return [];
        const selectedNetwork = activeNetworks.find((net: any) => net.id.toString() === data.network_id.toString());
        // Filter network types to only show Data related ones
        return selectedNetwork?.network_types.filter((nt: any) => nt.type === 'data') || [];
    }, [data.network_id, activeNetworks]);
    return (
        <AppLayout>
            <div className="flex min-h-screen flex-1 flex-col space-y-6 p-6">
                <Head title="Edit Data Plan" />
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href={route('pricing.airtime-data', { tab: 'data_plan' })}
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
                                    <div className="space-y-1">
                                        <Label>Network</Label>
                                        <Select value={data.network_id.toString()} onValueChange={(value) => setData('network_id', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Network" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activeNetworks.map((net: any) => (
                                                    <SelectItem key={net.id.toString()} value={net.id.toString()}>
                                                        {net.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.network_id} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Data Type</Label>
                                        <Select value={data.plan_type?.toString()} onValueChange={(value) => setData('plan_type', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Data Type (e.g. SME, CG)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {plan_types.map((netType: any) => (
                                                    <SelectItem key={netType.id} value={netType.id.toString()}>
                                                        {netType.name?.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.plan_type} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Volume</Label>
                                        <Input
                                            placeholder="e.g. 1, 500, 100..."
                                            value={data.volume}
                                            onChange={(e) => setData('volume', e.target.value)}
                                        />
                                        <InputError message={errors.volume} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label>Plan Size</Label>
                                            {/* Select */}
                                            <Select value={data.plan_size} onValueChange={(value) => setData('plan_size', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Plan Size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mb">MB</SelectItem>
                                                    <SelectItem value="gb">GB</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.plan_size} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Validity</Label>
                                            <Input
                                                placeholder="e.g. 30 Days"
                                                value={data.validity}
                                                onChange={(e) => setData('validity', e.target.value)}
                                            />
                                            <InputError message={errors.validity} />
                                        </div>
                                    </div>
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
                                                    // if (!data.providerable.cost_price) {
                                                    //     setData('providerable', { ...data.providerable, cost_price: String(costPrice) });
                                                    // }
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
