import DeleteButton from '@/components/delete-button';
import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Edit2, Plus } from 'lucide-react';
import { useState } from 'react';

// Define our interfaces
interface CablePlan {
    id: number;
    network_type_id: number;
    provider_id: number;
    plan_id: string;
    name: string;
    amount: string;
    is_active: boolean;
    network_type?: { name: string };
    provider?: { name: string };
}

interface CableNetwork {
    id: number;
    name: string;
    type: string;
}

export default function CablePricing() {
    const { cablePlans, cableNetworks } = usePage().props as unknown as {
        cablePlans: CablePlan[];
        cableNetworks: CableNetwork[];
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        is_active: true,
        type: 'cable', // Hardcoded to cable for this page
    });

    const updateNetworkType = (id: string, field: string, value: any) => {
        router.patch(route('network-types.update', id), { [field]: value });
    };

    const cableAmountHandler = (cable: CablePlan) => {
        const margin_type = cable.provider?.pivot?.margin_type;
        const margin_value = cable.provider?.pivot?.margin_value;
        const cost_price = parseFloat(cable.provider?.pivot?.cost_price) || 0;
        // const    =

        if (margin_type === 'percentage') {
            return cost_price + (cost_price * margin_value) / 100;
        } else if (margin_type === 'fixed') {
            return cost_price + parseFloat(margin_value);
        }

        return cost_price;
    };

    const url = new URL(window.location.href);

    const [activeTab, setActiveTab] = useState(url.searchParams.get('tab') ?? 'networks');

    const handleChangeTabs = (tabName: string) => {
        // url persistant
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', tabName);
        window.history.pushState({}, '', newUrl);
        setActiveTab(tabName);
    };

    return (
        <AppLayout
            breadcrumbs={[
                // { title: 'Pricing & Plans', href: route('pricing.index') },
                { title: 'Cable TV', href: '#' },
            ]}
        >
            <div className="flex flex-col gap-6 p-4 pt-0">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Cable TV Plans</h1>
                        <p className="text-muted-foreground text-sm">Manage DSTV, GOTV, and Startimes packages and networks.</p>
                    </div>
                </div>

                {/* Tabbed Interface */}
                <Tabs defaultValue={activeTab} className="w-full">
                    <TabsList className="mb-4 grid w-full max-w-[400px] grid-cols-2">
                        <TabsTrigger value="networks" onClick={() => handleChangeTabs('networks')}>
                            Cable Networks
                        </TabsTrigger>
                        <TabsTrigger value="packages" onClick={() => handleChangeTabs('packages')}>
                            Subscription Packages
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Subscription Packages */}
                    <TabsContent value="packages">
                        <Card>
                            <div className="flex items-center justify-between border-b p-6">
                                <div>
                                    <h3 className="text-lg leading-none font-medium">Subscription Packages</h3>
                                    <p className="text-muted-foreground mt-1 text-sm">Manage pricing and API mapping for specific bouquets.</p>
                                </div>
                                <Button asChild>
                                    <Link href={route('cable-plans.create')}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Package
                                    </Link>
                                </Button>
                            </div>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead className="pl-6">Network</TableHead>
                                            <TableHead>Package Name</TableHead>
                                            <TableHead>Price (₦)</TableHead>
                                            <TableHead className="pr-6 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cablePlans.length > 0 ? (
                                            cablePlans.map((cable) => (
                                                <TableRow key={cable.id}>
                                                    {/* {JSON.stringify(cable.provider?.pivot)} */}
                                                    <TableCell>
                                                        <span className="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-300">
                                                            {cable.id}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pl-6 font-medium">{cable.network_type?.name}</TableCell>
                                                    <TableCell>{cable.plan_name}</TableCell>
                                                    <TableCell className="font-medium text-emerald-400">
                                                        ₦{cableAmountHandler(cable).toLocaleString()}
                                                    </TableCell>

                                                    <TableCell className="pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-6">
                                                            <Link href={route('cable-plans.edit', cable.id)}>
                                                                <Button variant="ghost" size="icon">
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
                                                                <DeleteButton
                                                                    route={route('cable-plans.destroy', cable.id)}
                                                                    resourceName="cable plan"
                                                                    className="m-0 bg-transparent p-0 text-xs font-medium text-red-500 transition-colors hover:bg-transparent hover:text-red-400"
                                                                    // onSuccess={() => (window.location.href = route('login'))}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
                                                                <IsActiveSwitch
                                                                    checked={cable.is_active}
                                                                    onCheckedChange={(checked) => router.patch(route('cable-plans.update', cable.id), { is_active: checked })}
                                                                    label=""
                                                                    className="justify-end"
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                                    No cable packages found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab 2: Cable Networks */}
                    <TabsContent value="networks">
                        <Card>
                            <div className="flex items-center justify-between border-b p-6">
                                <div>
                                    <h3 className="text-lg leading-none font-medium">Cable Networks</h3>
                                    <p className="text-muted-foreground mt-1 text-sm">Manage underlying decoders/networks.</p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" /> Add Network
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="overflow-hidden border-slate-800 bg-[#0f172a] p-0 text-white sm:max-w-md">
                                        {/* Header */}
                                        <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5">
                                            <h3 className="text-lg font-semibold text-white">Add New Cable Network</h3>
                                            <p className="mt-1 text-xs text-slate-400">Create a new cable network category.</p>
                                        </div>

                                        {/* Body / Form */}
                                        <div className="space-y-5 px-6 py-5">
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium text-slate-300">Network Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., DSTV, GOTV"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div>
                                                <label className="mb-1.5 flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_active}
                                                        onChange={(e) => setData('is_active', e.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm font-medium text-slate-300">Active</span>
                                                </label>
                                                <InputError message={errors.is_active} />
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4">
                                            <button
                                                type="button"
                                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => post(route('network-types.store'), { onSuccess: () => reset() })}
                                                disabled={processing}
                                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:bg-indigo-900"
                                            >
                                                {processing ? 'Creating...' : 'Create Network'}
                                            </button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">Network Name</TableHead>
                                            <TableHead className="pr-6 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cableNetworks.length > 0 ? (
                                            cableNetworks.map((network) => (
                                                <TableRow key={network.id}>
                                                    <TableCell className="pl-6 font-medium">{network.name}</TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-6">
                                                            {/* <EditNetworkType network_type={type} networks={networks} />
                                                             */}
                                                            <CableNetworkDialog cable={network}>
                                                                <Button variant="ghost" size="icon">
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                            </CableNetworkDialog>

                                                            <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
                                                                <DeleteButton
                                                                    route={route('network-types.destroy', network.id)}
                                                                    resourceName="network type"
                                                                    className="m-0 bg-transparent p-0 text-xs font-medium text-red-500 transition-colors hover:bg-transparent hover:text-red-400"
                                                                    // onSuccess={() => (window.location.href = route('login'))}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
                                                                <IsActiveSwitch
                                                                    checked={network.is_active}
                                                                    onCheckedChange={(checked) => updateNetworkType(type.id, 'is_active', checked)}
                                                                    label=""
                                                                    className="justify-end"
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-24 text-center text-slate-500">
                                                    No cable networks found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

const CableNetworkDialog = ({ cable, children }: { cable?: any; children?: React.ReactNode }) => {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: cable.name ?? '',
        is_active: cable.is_active ?? true,
        type: 'cable', // Hardcoded to cable for this page
    });

    const onSubmit = () => {
        if (cable) {
            patch(route('network-types.update', cable.id), { onSuccess: () => reset() });
        } else {
            post(route('network-types.store'), { onSuccess: () => reset() });
        }
    };

    console.log(errors);

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="overflow-hidden border-slate-800 bg-[#0f172a] p-0 text-white sm:max-w-md">
                {/* Header */}
                <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5">
                    <h3 className="text-lg font-semibold text-white">Add New Cable Network</h3>
                    <p className="mt-1 text-xs text-slate-400">Create a new cable network category.</p>
                </div>

                {/* Body / Form */}
                <div className="space-y-5 px-6 py-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Network Name</label>
                        <input
                            type="text"
                            placeholder="e.g., DSTV, GOTV"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <label className="mb-1.5 flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-slate-300">Active</span>
                        </label>
                        <InputError message={errors.is_active} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4">
                    <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={processing}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:bg-indigo-900"
                    >
                        {processing ? 'Creating...' : 'Create Network'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
