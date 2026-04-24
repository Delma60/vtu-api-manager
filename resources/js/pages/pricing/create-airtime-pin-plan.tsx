// resources/js/pages/pricing/create-airtime-pin-plan.tsx

import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';

export default function CreateAirtimePinPlan({ networks: activeNetworks, providers, airtime_pin_discounts }: any) {
    const { data, setData, post, processing, errors, transform } = useForm({
        network_id: '',
        type: 'airtimePin',
        is_active: true,
        pin_source: 'api', // 'api' or 'local'
        amount: '', // Single denomination amount replaces min/max
        pins: '', // Store pasted PINs for local db
        providerable: {
            provider_id: 1,
            cost_price: '0.00',
            server_id: '',
            margin_value: '0.00',
            margin_type: 'fixed',
        },
    });
    console.log(errors)

    // Transform data before it gets sent to the server
    transform((data) => ({
        ...data,
        // Map the single amount to both min and max to satisfy existing DB constraints
        min_amount: data.amount,
        max_amount: data.amount,
        plan_type: null, // Send a static plan type or null if your backend allows
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('discounts.store'));
    };

    const costPrice = useMemo(() => {
        const cp = data?.providerable.cost_price;
        if (cp !== undefined && cp !== '') return parseFloat(String(cp)) || 0;
        return 0;
    }, [data.providerable.cost_price]);

    return (
        <AppLayout>
            <div className="flex min-h-screen flex-1 flex-col space-y-6 p-6">
                <Head title="Create Airtime PIN Plan" />
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href={route('pricing.airtime-data', { tab: 'airtime_pin' })}
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
                    <h1 className="text-2xl font-bold tracking-tight">Create Airtime PIN Configuration</h1>
                    <p className="mt-1 text-sm text-slate-400">Set up fixed denominations and select the source for Airtime Vouchers (PINs).</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {/* Column 1: Identity & Settings */}
                        <div className="space-y-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Config</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Source Selection (API vs Local) */}
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">PIN Source</Label>
                                        <Select value={data.pin_source} onValueChange={(value) => setData('pin_source', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select PIN Source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="api">External API Provider</SelectItem>
                                                <SelectItem value="local">Local Database Uploads</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {data.pin_source === 'api' 
                                                ? 'PINs will be fetched dynamically from a third-party API provider.' 
                                                : 'You will manually provide the PINs below.'}
                                        </p>
                                    </div>

                                    {/* Target Network */}
                                    <div className="space-y-1 pt-2">
                                        <Label className="text-sm font-medium">Target Network</Label>
                                        <Select value={data.network_id} onValueChange={(value) => setData('network_id', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Network" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activeNetworks.map((net: any) => (
                                                    <SelectItem key={net.id} value={net.id.toString()}>
                                                        {net.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.network_id} />
                                    </div>
                                    
                                    {/* Denomination (Replaces Range) */}
                                    <div className="space-y-1 pt-2">
                                        <Label className="text-sm font-medium">PIN Denomination (Amount)</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 100"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                        />
                                        <InputError message={errors.amount} />
                                        <p className="text-xs text-slate-400">The fixed value of each PIN for this specific plan.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing Margins</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2 space-y-2">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g., 2.5"
                                                value={data.providerable.margin_value}
                                                onChange={(e) => setData('providerable', { ...data.providerable, margin_value: e.target.value })}
                                            />
                                            <InputError message={errors?.['providerable.margin_value']} />
                                        </div>
                                        <div className="">
                                            <Select
                                                value={data.providerable.margin_type}
                                                onValueChange={(value) => setData('providerable', { ...data.providerable, margin_type: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Discount Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">Fixed (₦)</SelectItem>
                                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Column 2: Data Source Context */}
                        <div className="space-y-3">
                            
                            {/* Conditionally show Local PIN input if Local is selected */}
                            {data.pin_source === 'local' && (
                                <Card className="">
                                    <CardHeader>
                                        <CardTitle className="">Upload PINs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium ">Paste your raw PINs here</Label>
                                            <Textarea
                                                rows={8}
                                                placeholder="123456789012345&#10;987654321098765&#10;(One PIN per line)"
                                                value={data.pins}
                                                onChange={(e) => setData('pins', e.target.value)}
                                                className="font-mono text-sm"
                                            />
                                            <InputError message={errors.pins} />
                                            <p className="text-xs ">
                                                These will be securely encrypted and saved to the database, to be dispensed to users.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Conditionally show Server Config only if PIN Source is API */}
                            {data.pin_source === 'api' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>API Provider Routing</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium">API Provider</Label>
                                            <Select
                                                value={data.providerable.provider_id?.toString() || ''}
                                                onValueChange={(value) => setData('providerable', { ...data.providerable, provider_id: parseInt(value) })}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select external provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {providers.map((provider: any) => (
                                                        <SelectItem key={provider.id} disabled={!provider.is_active} value={provider.id.toString()}>
                                                            {provider.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors?.['providerable.provider_id']} />
                                        </div>

                                        {data.providerable.provider_id && (
                                            <div className="mt-4 flex items-center gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <Label className="text-sm font-medium">Server Plan ID</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="e.g. mt_pin_100"
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
                                                        placeholder="0.00"
                                                        value={data.providerable.cost_price ?? costPrice ?? ''}
                                                        onChange={(e) => setData('providerable', { ...data.providerable, cost_price: e.target.value })}
                                                    />
                                                    <InputError message={errors?.['providerable.cost_price']} />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2">
                                        <IsActiveSwitch
                                            checked={data.is_active}
                                            onCheckedChange={(v: boolean) => setData('is_active', v)}
                                        />
                                        <Label>Plan is active</Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/pricing?tab=airtime_pin" className="px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
                            Cancel
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create PIN Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}