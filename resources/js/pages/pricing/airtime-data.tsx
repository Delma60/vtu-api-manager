import DeleteButton from '@/components/delete-button';
import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PricingManager({ initialServices, networks, network_types, airtime_discounts, data_plans }: any) {
    // get tab from url
    const url = new URL(window.location.href);
    const [services, setServices] = useState(
        initialServices || [
            { id: 1, network_name: 'MTN', type: 'data_plan', name: '1GB SME', cost: 235, price: 245, is_active: true },
            { id: 2, network_name: 'MTN', type: 'data_plan', name: '2GB SME', cost: 470, price: 490, is_active: true },
            { id: 3, network_name: 'Airtel', type: 'data_plan', name: '1.5GB Corporate', cost: 340, price: 350, is_active: true },
            { id: 4, network_name: 'MTN', type: 'data_pin', name: '1.5GB Data PIN', cost: 340, price: 360, is_active: true },
        ],
    );

    // Tab State
    const tabs = [
        { id: 'network', label: 'Networks Status' },
        { id: 'network_type', label: 'Network Types' },
        { id: 'airtime', label: 'Airtime Discounts' },
        { id: 'airtime_pin', label: 'Airtime PINs' },
        { id: 'data_plan', label: 'Data Plans' },
        { id: 'data_pin', label: 'Data PINs' },
    ];
    const [activeTab, setActiveTab] = useState(url.searchParams.get('tab') ?? 'network');

    // Input Handlers
    const updateNetwork = (id: string, field: string, value: any) => {
        router.patch(route('networks.update', id), { [field]: value });
    };

    const updateDiscount = (id: string, field: string, value: any) => {
        router.patch(route('discounts.update', id), { [field]: value });
    };

    const updateService = (id: string, field: string, value: any) => {
        router.patch(route('data-plans.update', id), { [field]: value });
    };

    const updateNetworkType = (id: string, field: string, value: any) => {
        router.patch(route('network-types.update', id), { [field]: value });
    };

    // Helper for network dots (Brand colors stay static)
    const getNetworkColor = (name: string) => {
        switch (name?.toLowerCase()) {
            case 'mtn':
                return 'bg-yellow-500';
            case 'airtel':
                return 'bg-red-500';
            case 'glo':
                return 'bg-green-500';
            case '9mobile':
                return 'bg-emerald-800';
            default:
                return 'bg-slate-500';
        }
    };

    const { setData, data, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        airtime_api_id: '0',
        airtime_pin_api_id: '0',
        data_api_id: '0',
        data_pin_api_id: '0',
    });

    const {
        setData: setTypeData,
        data: typeData,
        post: postType,
        processing: typeProcessing,
        errors: typeErrors,
        reset: resetType,
    } = useForm({
        name: '',
        network_id: '',
        is_active: true,
        type: 'airtime',
    });

    // Auto-generate code from name
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

    const handleChangeTabs = (tabName: string) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', tabName);
        window.history.pushState({}, '', newUrl);
        setActiveTab(tabName);
    };

    return (
        <AppLayout>
            <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col font-sans">
                {/* Sticky Header */}
                <header className="border-border bg-background/80 sticky top-0 z-20 flex shrink-0 items-center justify-between border-b px-8 py-5 backdrop-blur-md">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Pricing & Routing Rules</h1>
                        <p className="text-muted-foreground mt-0.5 text-xs">Manage global discounts and specific service margins.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                            Discard Changes
                        </Button>
                        <Button className="shadow-primary/20 gap-2 shadow-lg">
                            <Save className="h-4 w-4" />
                            Save Configuration
                        </Button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex w-full flex-1 flex-col p-8">
                    {/* The Requested Tabs */}
                    <div className="custom-scrollbar border-border mb-8 flex shrink-0 items-center gap-2 overflow-x-auto border-b pb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleChangeTabs(tab.id)}
                                className={`border-b-2 px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'text-muted-foreground hover:border-border hover:text-foreground border-transparent'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Container */}
                    <div className="border-border bg-card text-card-foreground flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm">
                        {/* TAB 1: Network Status */}
                        {activeTab === 'network' && (
                            <div className="flex-1 overflow-x-auto">
                                <div className="border-border bg-muted/50 flex items-center justify-between border-b p-5">
                                    <div>
                                        <h2 className="text-base font-semibold">Global Network Toggles</h2>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Turn off an entire network if the upstream provider is having global downtime.
                                        </p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-1.5">
                                                <Plus className="h-4 w-4" />
                                                Add Network
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                                                <h3 className="text-lg font-semibold">Add New Network</h3>
                                                <p className="text-muted-foreground mt-1 text-xs">Configure global discounts for a new provider.</p>
                                            </div>

                                            <div className="space-y-5 py-2">
                                                <div>
                                                    <Label className="mb-1.5 block">Network Name</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="e.g., Smile Data"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                    />
                                                    <InputError message={errors.name} />
                                                </div>

                                                <div>
                                                    <Label className="mb-1.5 block">Internal Code</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Auto-generated from name"
                                                        value={data.code}
                                                        readOnly
                                                        className="bg-muted text-muted-foreground cursor-not-allowed font-mono"
                                                    />
                                                    <InputError message={errors.code} />
                                                    <p className="text-muted-foreground mt-1.5 text-[10px] tracking-wider uppercase">
                                                        Auto-generated from name. Lowercase letters, numbers, and underscores only.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="mb-1.5 block">Airtime API ID</Label>
                                                        <Input
                                                            type="number"
                                                            value={data.airtime_api_id}
                                                            onChange={(e) => setData('airtime_api_id', e.target.value)}
                                                        />
                                                        <InputError message={errors.airtime_api_id} />
                                                    </div>
                                                    <div>
                                                        <Label className="mb-1.5 block">Airtime Pin API ID</Label>
                                                        <Input
                                                            type="number"
                                                            value={data.airtime_pin_api_id}
                                                            onChange={(e) => setData('airtime_pin_api_id', e.target.value)}
                                                        />
                                                        <InputError message={errors.airtime_pin_api_id} />
                                                    </div>
                                                    <div>
                                                        <Label className="mb-1.5 block">Data API ID</Label>
                                                        <Input
                                                            type="number"
                                                            value={data.data_api_id}
                                                            onChange={(e) => setData('data_api_id', e.target.value)}
                                                        />
                                                        <InputError message={errors.data_api_id} />
                                                    </div>
                                                    <div>
                                                        <Label className="mb-1.5 block">Data Pin API ID</Label>
                                                        <Input
                                                            type="number"
                                                            value={data.data_pin_api_id}
                                                            onChange={(e) => setData('data_pin_api_id', e.target.value)}
                                                        />
                                                        <InputError message={errors.data_pin_api_id} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                                                <Button variant="ghost" type="button">
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    disabled={processing}
                                                    onClick={() => post(route('networks.store'), { onSuccess: () => reset() })}
                                                >
                                                    {processing ? 'Creating Network...' : 'Create Network'}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="border-border bg-muted/50 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Network</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-border divide-y">
                                        {networks.map((net: any) => (
                                            <tr key={net.id} className="hover:bg-muted/30">
                                                <td className="flex items-center gap-3 px-6 py-5">
                                                    <span className={`h-3 w-3 rounded-full ${getNetworkColor(net.name)}`}></span>
                                                    <span className="text-base font-semibold">{net.name}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-6">
                                                        <EditNetwork network={net} />

                                                        <div className="border-border flex items-center gap-2 border-l pl-6">
                                                            <DeleteButton
                                                                route={route('networks.destroy', net.id)}
                                                                resourceName="network"
                                                                className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-xs font-medium transition-colors hover:bg-transparent"
                                                            />
                                                        </div>
                                                        <div className="border-border flex items-center gap-2 border-l pl-6">
                                                            <IsActiveSwitch
                                                                checked={net.is_active}
                                                                onCheckedChange={(checked) => updateNetwork(net.id, 'is_active', checked)}
                                                                label=""
                                                                className="justify-end"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* TAB 2: Network Types */}
                        {activeTab === 'network_type' && (
                            <div className="flex-1 overflow-x-auto">
                                <div className="border-border bg-muted/50 flex items-center justify-between border-b p-5">
                                    <div>
                                        <h2 className="text-base font-semibold">Network Service Types</h2>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Manage service categories like SME, SMS, Gifting, VUT, and more.
                                        </p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="gap-1.5">
                                                <Plus className="h-4 w-4" />
                                                Add Type
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                                                <h3 className="text-lg font-semibold">Add New Service Type</h3>
                                                <p className="text-muted-foreground mt-1 text-xs">Create a new service category for networks.</p>
                                            </div>

                                            <div className="space-y-5 py-2">
                                                <div>
                                                    <Label className="mb-1.5 block">Type Name</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="e.g., Enterprise, Corporate"
                                                        value={typeData.name}
                                                        onChange={(e) => setTypeData('name', e.target.value)}
                                                    />
                                                    <InputError message={typeErrors.name} />
                                                </div>

                                                <div>
                                                    <Label className="mb-1.5 block">Associated Network</Label>
                                                    <Select value={typeData.network_id || ''} onValueChange={(e) => setTypeData('network_id', e)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Network" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {networks.map((network: any) => (
                                                                <SelectItem disabled={!network.is_active} key={network.id} value={network.id}>
                                                                    {network.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={typeErrors.network_id} />
                                                </div>

                                                <div>
                                                    <Label className="mb-1.5 block">Service Type</Label>
                                                    <Select value={typeData.type || ''} onValueChange={(e) => setTypeData('type', e)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Service Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="airtime">Airtime</SelectItem>
                                                            <SelectItem value="data">Data</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={typeErrors.type} />
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={typeData.is_active}
                                                        onCheckedChange={(checked) => setTypeData('is_active', checked)}
                                                    />
                                                    <Label className="text-sm font-medium">Active</Label>
                                                    <InputError message={typeErrors.is_active} />
                                                </div>
                                            </div>

                                            <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                                                <Button variant="ghost" type="button">
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => postType(route('network-types.store'), { onSuccess: () => resetType() })}
                                                    disabled={typeProcessing}
                                                >
                                                    {typeProcessing ? 'Creating...' : 'Create Type'}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="border-border bg-muted/50 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Type Name</th>
                                            <th className="px-6 py-3">Service Type</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-border divide-y">
                                        {network_types.map((type: any) => (
                                            <tr key={type.id} className="hover:bg-muted/30">
                                                <td className="px-6 py-5">
                                                    <span className="font-semibold">{type.name}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 font-mono text-xs">
                                                        {type.type}|{type.typeable.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-6">
                                                        <EditNetworkType network_type={type} networks={networks} />

                                                        <div className="border-border flex items-center gap-2 border-l pl-6">
                                                            <DeleteButton
                                                                route={route('network-types.destroy', type.id)}
                                                                resourceName="network type"
                                                                className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-xs font-medium transition-colors hover:bg-transparent"
                                                            />
                                                        </div>
                                                        <div className="border-border flex items-center gap-2 border-l pl-6">
                                                            <IsActiveSwitch
                                                                checked={type.is_active}
                                                                onCheckedChange={(checked) => updateNetworkType(type.id, 'is_active', checked)}
                                                                label=""
                                                                className="justify-end"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* TAB 3 & 4: Airtime & Airtime PINs */}
                        {(activeTab === 'airtime' || activeTab === 'airtime_pin') && (
                            <Card className="h-min flex-1 overflow-x-auto rounded-none border-0 bg-transparent shadow-none">
                                <div className="border-border bg-muted/50 flex items-center justify-between border-b p-5">
                                    <div>
                                        <h2 className="text-base font-semibold">
                                            {activeTab === 'airtime' ? 'Direct Airtime Discounts' : 'Airtime PIN Discounts'}
                                        </h2>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Set the percentage discount you offer your API users. Lower numbers equal higher profit for you.
                                        </p>
                                    </div>
                                    {activeTab === 'airtime' && (
                                        <Link
                                            href={route('pricing.airtime-plan.create')}
                                            // className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-emerald-500"
                                        >
                                            <Button size="sm">
                                                <Plus />
                                                <span>Create Airtime Plan</span>
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                                <CardContent className="m-0 p-0">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-border bg-muted/50 text-muted-foreground border-b text-[11px] font-semibold uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Network Type</th>
                                                <th className="px-6 py-3">Network</th>
                                                <th className="px-6 py-3">Min/Max</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-border divide-y">
                                            {airtime_discounts.map((net: any) => {
                                                return (
                                                    <tr key={net.id} className={net.is_active ? 'hover:bg-muted/30' : 'opacity-50'}>
                                                        <td className="px-6 py-5">
                                                            <span className="font-semibold">{net.plan_type.name}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 font-mono text-xs">
                                                                {net.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 font-mono text-xs">
                                                                {net.min_amount}|{net.max_amount}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => router.get(route('pricing.airtime-plan.edit', net.id))}
                                                                    className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors"
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Separator orientation="vertical" className="mr-2 h-5" />
                                                                <div className="flex items-center gap-2 pr-1">
                                                                    <DeleteButton
                                                                        className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-sm"
                                                                        route={route('discounts.destroy', net.id)}
                                                                        resourceName={'discount plan'}
                                                                        buttonSize="sm"
                                                                        variant="link"
                                                                    >
                                                                        Delete
                                                                    </DeleteButton>
                                                                </div>
                                                                <Separator orientation="vertical" className="mr-2 h-5" />
                                                                <div className="flex items-center gap-2">
                                                                    <Switch
                                                                        checked={net.is_active}
                                                                        onCheckedChange={(check) => updateDiscount(net.id, 'is_active', check)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        )}

                        {/* TAB 5 & 6: Data Plans & Data PINs */}
                        {(activeTab === 'data_plan' || activeTab === 'data_pin') && (
                            <div className="flex flex-1 flex-col overflow-x-auto">
                                <div className="border-border bg-muted/50 flex shrink-0 items-center justify-between border-b p-5">
                                    <div>
                                        <h2 className="text-base font-semibold">
                                            {activeTab === 'data_plan' ? 'Direct Data Plans' : 'Printable Data PINs'}
                                        </h2>
                                        <p className="text-muted-foreground mt-1 text-xs">Configure your cost price and your selling price.</p>
                                    </div>
                                    <Link href={route('data-plans.create')}>
                                        <Button size="sm" className="gap-1.5">
                                            <Plus className="h-4 w-4" /> Add New Plan
                                        </Button>
                                    </Link>
                                </div>
                                <div className="custom-scrollbar flex-1 overflow-y-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-border bg-muted/80 text-muted-foreground sticky top-0 z-10 border-b text-[11px] font-semibold uppercase backdrop-blur-sm">
                                            <tr>
                                                <th className="px-6 py-3">Network</th>
                                                <th className="w-32 px-6 py-3">Plan Type</th>
                                                <th className="px-6 py-3">Plan</th>
                                                <th className="px-6 py-3 text-right">Active</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-border divide-y">
                                            {data_plans.map((service: any) => {
                                                return (
                                                    <tr key={service.id} className={service.is_active ? 'hover:bg-muted/30' : 'opacity-50'}>
                                                        <td className="px-6 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`h-2 w-2 rounded-full ${getNetworkColor(service.network)}`}></span>
                                                                <span className="font-medium">{service.network}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 font-semibold uppercase">{service.plan_name}</td>
                                                        <td className="text-muted-foreground px-6 py-3">{service.plan_type}</td>

                                                        <td className="px-6 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={route('data-plans.edit', service.id)}
                                                                    className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors"
                                                                >
                                                                    Edit plan
                                                                </Link>
                                                                <Separator orientation="vertical" className="mr-2 h-5" />
                                                                <div className="flex items-center gap-2 pr-1">
                                                                    <DeleteButton
                                                                        className="text-destructive hover:text-destructive/80 m-0 bg-transparent p-0 text-sm"
                                                                        route={route('data-plans.destroy', { data_plan: service.id })}
                                                                        resourceName={'data plan'}
                                                                        buttonSize="sm"
                                                                        variant="link"
                                                                    >
                                                                        Delete
                                                                    </DeleteButton>
                                                                </div>
                                                                <Separator orientation="vertical" className="mr-2 h-5" />
                                                                <div className="flex items-center gap-2">
                                                                    <IsActiveSwitch
                                                                        checked={service.is_active}
                                                                        onCheckedChange={(checked) => updateService(service.id, 'is_active', checked)}
                                                                        label=""
                                                                        className="justify-end"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {data_plans.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center">
                                                        No {activeTab.replace('_', ' ')}s configured yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

const EditNetwork = ({ network }: any) => {
    const { setData, data, processing, errors, patch } = useForm(network);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors">Edit</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                    <h3 className="text-lg font-semibold">Edit Network</h3>
                    <p className="text-muted-foreground mt-1 text-xs">Update configuration for {network.name}.</p>
                </div>

                <div className="space-y-5 py-2">
                    <div>
                        <Label className="mb-1.5 block">Network Name</Label>
                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Internal Code</Label>
                        <Input type="text" readOnly value={data.code} className="bg-muted text-muted-foreground cursor-not-allowed font-mono" />
                        <InputError message={errors.code} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-1.5 block">Airtime API ID</Label>
                            <Input type="number" value={data.airtime_api_id} onChange={(e) => setData('airtime_api_id', e.target.value)} />
                            <InputError message={errors.airtime_api_id} />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Airtime Pin API ID</Label>
                            <Input type="number" value={data.airtime_pin_api_id} onChange={(e) => setData('airtime_pin_api_id', e.target.value)} />
                            <InputError message={errors.airtime_pin_api_id} />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Data API ID</Label>
                            <Input type="number" value={data.data_api_id} onChange={(e) => setData('data_api_id', e.target.value)} />
                            <InputError message={errors.data_api_id} />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Data Pin API ID</Label>
                            <Input type="number" value={data.data_pin_api_id} onChange={(e) => setData('data_pin_api_id', e.target.value)} />
                            <InputError message={errors.data_pin_api_id} />
                        </div>
                    </div>
                </div>

                <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                    <Button type="button" variant="ghost">
                        Cancel
                    </Button>
                    <Button type="button" disabled={processing} onClick={() => patch(route('networks.update', data.id))}>
                        {processing ? 'Updating...' : 'Update Network'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const EditNetworkType = ({ network_type, networks }: any) => {
    const { setData, data, processing, errors, patch } = useForm({
        ...network_type,
        network_id: network_type.typeable?.id || '',
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors">Edit</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="border-border bg-muted/50 -mx-6 -mt-6 border-b px-6 py-5">
                    <h3 className="text-lg font-semibold">Edit Service Type</h3>
                    <p className="text-muted-foreground mt-1 text-xs">Update configuration for {network_type.name}.</p>
                </div>

                <div className="space-y-5 py-2">
                    <div>
                        <Label className="mb-1.5 block">Type Name</Label>
                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Associated Network</Label>
                        <Select value={data.network_id} onValueChange={(e) => setData('network_id', e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Network" />
                            </SelectTrigger>
                            <SelectContent>
                                {networks.map((network: any) => (
                                    <SelectItem key={network.id} value={network.id}>
                                        {network.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.network_id} />
                    </div>

                    <div>
                        <Label className="mb-1.5 block">Service Type</Label>
                        <Select value={data.type || ''} onValueChange={(e) => setData('type', e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Service Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="airtime">Airtime</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                        <Label className="text-sm font-medium">Active</Label>
                        <InputError message={errors.is_active} />
                    </div>
                </div>

                <div className="border-border bg-muted/50 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t px-6 py-4">
                    <Button type="button" variant="ghost">
                        Cancel
                    </Button>
                    <Button type="button" disabled={processing} onClick={() => patch(route('network-types.update', data.id))}>
                        {processing ? 'Updating...' : 'Update Type'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
