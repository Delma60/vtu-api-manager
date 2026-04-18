import DeleteButton from '@/components/delete-button';
import InputError from '@/components/input-error';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

//
export default function PricingManager({ initialServices, networks, network_types, airtime_discounts, data_plans }) {
    // get tab frpm url
    const url = new URL(window.location.href);
    // const [activeTab, setActiveTab] = /useState(url.searchParams.get('tab') || 'network');
    const [services, setServices] = useState(
        initialServices || [
            { id: 1, network_name: 'MTN', type: 'data_plan', name: '1GB SME', cost: 235, price: 245, is_active: true },
            { id: 2, network_name: 'MTN', type: 'data_plan', name: '2GB SME', cost: 470, price: 490, is_active: true },
            { id: 3, network_name: 'Airtel', type: 'data_plan', name: '1.5GB Corporate', cost: 340, price: 350, is_active: true },
            { id: 4, network_name: 'MTN', type: 'data_pin', name: '1.5GB Data PIN', cost: 340, price: 360, is_active: true },
        ],
    );

    // const [networkTypes, setNetworkTypes] = useState([
    //     { id: 1, name: 'SME', code: 'sme', description: 'Small and Medium Enterprise', is_active: true },
    //     { id: 2, name: 'SMS', code: 'sms', description: 'SMS Services', is_active: true },
    //     { id: 3, name: 'Gifting', code: 'gifting', description: 'Gift Card Services', is_active: true },
    //     { id: 4, name: 'VUT', code: 'vut', description: 'Voucher & Top-up', is_active: true },
    // ]);

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
        // setNetworkTypes(networkTypes.map((nt) => (nt.id === id ? { ...nt, [field]: value } : nt)));
    };

    // Helper for network dots
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
                .replace(/\s+/g, '_') // Replace spaces with underscores
                .replace(/[^a-z0-9_]/g, ''); // Remove special characters
            setData('code', generatedCode);
        }
    }, [data.name]);

    const handleChangeTabs = (tabName: string) => {
        // url persistant
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', tabName);
        window.history.pushState({}, '', newUrl);
        setActiveTab(tabName);
    };

    return (
        <AppLayout>
            <div className="flex min-h-screen flex-1 flex-col font-sans">
                {/* Sticky Header */}
                <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-slate-300 px-8 py-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-600 dark:text-white">Pricing & Routing Rules</h1>
                        <p className="mt-0.5 text-xs text-slate-400">Manage global discounts and specific service margins.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">Discard Changes</button>
                        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                />
                            </svg>
                            Save Configuration
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex w-full flex-1 flex-col p-8">
                    {/* The Requested Tabs */}
                    <div className="custom-scrollbar mb-8 flex shrink-0 items-center gap-2 overflow-x-auto border-b border-slate-300 pb-px dark:border-slate-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleChangeTabs(tab.id)}
                                className={`border-b-2 px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Container */}
                    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                        {/* TAB 1: Network Status */}
                        {activeTab === 'network' && (
                            <div className="flex-1 overflow-x-auto">
                                <div className="flex items-center justify-between border-b border-[hsl(218,36%,18%)] bg-slate-900/50 p-5">
                                    <div>
                                        <h2 className="text-base font-semibold text-white">Global Network Toggles</h2>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Turn off an entire network if the upstream provider is having global downtime.
                                        </p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger>
                                            <button
                                                // onClick={() => setIsNetworkModalOpen(true)}
                                                className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Network
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="overflow-hidden border-slate-800 bg-[#0f172a] p-0 text-white sm:max-w-md">
                                            {/* Header */}
                                            <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5">
                                                <h3 className="text-lg font-semibold text-white">Add New Network</h3>
                                                <p className="mt-1 text-xs text-slate-400">Configure global discounts for a new provider.</p>
                                            </div>

                                            {/* Body / Form */}
                                            <div className="space-y-5 px-6 py-5">
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Network Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Smile Data"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                    <InputError message={errors.name} />
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Internal Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Auto-generated from name"
                                                        value={data.code}
                                                        readOnly
                                                        className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 font-mono text-sm text-slate-400"
                                                    />
                                                    <InputError message={errors.code} />
                                                    <p className="mt-1.5 text-[10px] tracking-wider text-slate-500 uppercase">
                                                        Auto-generated from name. Lowercase letters, numbers, and underscores only.
                                                    </p>
                                                </div>

                                                {/* add api ids */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Airtime API ID</label>
                                                        <input
                                                            type="number"
                                                            placeholder="e.g., Smile Data"
                                                            value={data.airtime_api_id}
                                                            onChange={(e) => setData('airtime_api_id', e.target.value)}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                        <InputError message={errors.airtime_api_id} />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Airtime Pin API ID</label>
                                                        <input
                                                            type="number"
                                                            placeholder="e.g., Smile Data"
                                                            value={data.airtime_pin_api_id}
                                                            onChange={(e) => setData('airtime_pin_api_id', e.target.value)}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                        <InputError message={errors.airtime_pin_api_id} />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Data API ID</label>
                                                        <input
                                                            type="number"
                                                            placeholder="e.g., Smile Data"
                                                            value={data.data_api_id}
                                                            onChange={(e) => setData('data_api_id', e.target.value)}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                        <InputError message={errors.data_api_id} />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Data Pin API ID</label>
                                                        <input
                                                            type="number"
                                                            placeholder="e.g., Smile Data"
                                                            value={data.data_pin_api_id}
                                                            onChange={(e) => setData('data_pin_api_id', e.target.value)}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                        <InputError message={errors.data_pin_api_id} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4">
                                                {/* If using shadcn/ui, you can wrap this Cancel button in a <DialogClose asChild> */}
                                                <button
                                                    type="button"
                                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={processing}
                                                    onClick={() =>
                                                        post(route('networks.store'), {
                                                            onSuccess: () => {
                                                                reset();
                                                            },
                                                        })
                                                    }
                                                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:bg-indigo-900"
                                                >
                                                    {processing ? 'Creating Network...' : 'Create Network'}
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="border-b border-slate-800 bg-[#0f172a] text-[11px] font-semibold text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Network</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {networks.map((net) => (
                                            <tr key={net.id}>
                                                <td className="flex items-center gap-3 px-6 py-5">
                                                    <span className={`h-3 w-3 rounded-full ${getNetworkColor(net.name)}`}></span>
                                                    <span className="text-base font-semibold text-white">{net.name}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-6">
                                                        {/* EDIT NETWORK DIALOG */}
                                                        <EditNetwork network={net} />

                                                        <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
                                                            <DeleteButton
                                                                route={route('networks.destroy', net.id)}
                                                                resourceName="network"
                                                                className="m-0 bg-transparent p-0 text-xs font-medium text-red-500 transition-colors hover:bg-transparent hover:text-red-400"
                                                                // onSuccess={() => (window.location.href = route('login'))}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
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
                                {/* {JSON.stringify(network_types)} */}
                                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 p-5">
                                    <div>
                                        <h2 className="text-base font-semibold text-white">Network Service Types</h2>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Manage service categories like SME, SMS, Gifting, VUT, and more.
                                        </p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger>
                                            <button className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-500">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Type
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="overflow-hidden border-slate-800 bg-[#0f172a] p-0 text-white sm:max-w-md">
                                            {/* Header */}
                                            <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5">
                                                <h3 className="text-lg font-semibold text-white">Add New Service Type</h3>
                                                <p className="mt-1 text-xs text-slate-400">Create a new service category for networks.</p>
                                            </div>

                                            {/* Body / Form */}
                                            <div className="space-y-5 px-6 py-5">
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Type Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Enterprise, Corporate"
                                                        value={typeData.name}
                                                        onChange={(e) => setTypeData('name', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                    <InputError message={typeErrors.name} />
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Associated Network</label>
                                                    <Select value={typeData.network_id || ''} onValueChange={(e) => setTypeData('network_id', e)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Network" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {networks.map((network) => (
                                                                <SelectItem disabled={!network.is_active} key={network.id} value={network.id}>
                                                                    {network.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={typeErrors.network_id} />
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Associated Network</label>
                                                    <Select
                                                        value={typeData.type || ''}
                                                        onValueChange={(e) => setTypeData('type', e)}
                                                        // className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                    >
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

                                                <div>
                                                    <label className="mb-1.5 flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={typeData.is_active}
                                                            onChange={(e) => setTypeData('is_active', e.target.checked)}
                                                            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm font-medium text-slate-300">Active</span>
                                                    </label>
                                                    <InputError message={typeErrors.is_active} />
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
                                                    onClick={() => postType(route('network-types.store'), { onSuccess: () => resetType() })}
                                                    disabled={typeProcessing}
                                                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:bg-indigo-900"
                                                >
                                                    {typeProcessing ? 'Creating...' : 'Create Type'}
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="border-b border-slate-800 bg-[#0f172a] text-[11px] font-semibold text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Type Name</th>
                                            <th className="px-6 py-3">Service Type</th>
                                            {/* <th className="px-6 py-3">Description</th> */}
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {network_types.map((type) => (
                                            <tr key={type.id} className="hover:bg-slate-800/30">
                                                <td className="px-6 py-5">
                                                    <span className="font-semibold text-white">{type.name}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="rounded-md border border-slate-700 bg-slate-900/50 px-2 py-1 font-mono text-xs text-slate-400">
                                                        {type.type}|{type.typeable.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-6">
                                                        <EditNetworkType network_type={type} networks={networks} />

                                                        <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
                                                            <DeleteButton
                                                                route={route('network-types.destroy', type.id)}
                                                                resourceName="network type"
                                                                className="m-0 bg-transparent p-0 text-xs font-medium text-red-500 transition-colors hover:bg-transparent hover:text-red-400"
                                                                // onSuccess={() => (window.location.href = route('login'))}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
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

                        {/* TAB 3 & 4: Airtime & Airtime PINs (Using same table structure) */}
                        {(activeTab === 'airtime' || activeTab === 'airtime_pin') && (
                            <Card className="h-min flex-1 overflow-x-auto border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                            {activeTab === 'airtime' ? 'Direct Airtime Discounts' : 'Airtime PIN Discounts'}
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Set the percentage discount you offer your API users. Lower numbers equal higher profit for you.
                                        </p>
                                    </div>
                                    {activeTab === 'airtime' && (
                                        <Link
                                            href={route('pricing.airtime-plan.create')}
                                            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-emerald-400"
                                        >
                                            + Create Airtime Plan
                                        </Link>
                                    )}
                                </div>
                                <CardContent className="m-0 p-0">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="border-b border-slate-200 bg-slate-300 text-[11px] font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-[#0f172a]">
                                            <tr>
                                                <th className="px-6 py-3">Network</th>
                                                <th className="px-6 py-3">Network</th>
                                                <th className="px-6 py-3">Min/Max</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-400/60 dark:divide-slate-200/60">
                                            {/* {JSON.stringify(airtime_discounts)} */}
                                            {airtime_discounts.map((net) => {
                                                const field = activeTab === 'airtime' ? 'airtime_discount' : 'airtime_pin_discount';
                                                return (
                                                    <tr
                                                        key={net.id}
                                                        className={net.is_active ? 'hover:bg-slate-300/30 dark:hover:bg-slate-700/30' : 'opacity-50'}
                                                    >
                                                        <td className="flex items-center gap-3 px-6 py-5">
                                                            {/* <span className={`h-3 w-3 rounded-full ${getNetworkColor(net.name)}`}></span> */}
                                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {net.plan_type.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="rounded-md border border-slate-300 bg-slate-100/50 px-2 py-1 font-mono text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900/50">
                                                                {net.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="rounded-md border border-slate-300 bg-slate-100/50 px-2 py-1 font-mono text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900/50">
                                                                {net.min_amount}|{net.max_amount}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    onClick={() => router.get(route('pricing.airtime-plan.edit', net.id))}
                                                                    className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-400"
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Separator
                                                                    orientation="vertical"
                                                                    className="mr-2 h-5 bg-slate-800 dark:bg-slate-200"
                                                                />
                                                                <div className="flex items-center gap-2 pr-1">
                                                                    <DeleteButton
                                                                        className="m-0 bg-transparent p-0 text-sm text-red-400 hover:text-red-400"
                                                                        route={route('discounts.destroy', net.id)}
                                                                        resourceName={'discount plan'}
                                                                        buttonSize="sm"
                                                                        variant="link"
                                                                    >
                                                                        Delete
                                                                    </DeleteButton>
                                                                </div>
                                                                <Separator
                                                                    orientation="vertical"
                                                                    className="mr-2 h-5 bg-slate-800 dark:bg-slate-200"
                                                                />

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
                                <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/50 p-5">
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            {activeTab === 'data_plan' ? 'Direct Data Plans' : 'Printable Data PINs'}
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-400">Configure your cost price and your selling price.</p>
                                    </div>
                                    <Link
                                        href={route('data-plans.create')}
                                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
                                    >
                                        + Add New Plan
                                    </Link>
                                </div>
                                <div className="custom-scrollbar flex-1 overflow-y-auto">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="sticky top-0 z-10 border-b border-slate-800 bg-[#0f172a] text-[11px] font-semibold text-slate-500 uppercase shadow-sm">
                                            <tr>
                                                <th className="px-6 py-3">Network</th>
                                                <th className="w-32 px-6 py-3">Plan Type</th>
                                                <th className="px-6 py-3">Plan</th>
                                                {/* <th className="w-32 px-6 py-3">Selling Price (₦)</th> */}
                                                {/* <th className="w-24 px-6 py-3">Margin</th> */}
                                                <th className="px-6 py-3 text-right">Active</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {data_plans
                                                // .filter((s) => s.type === activeTab)
                                                .map((service) => {
                                                    const profit = service.price - service.cost;
                                                    return (
                                                        <tr key={service.id} className={service.is_active ? 'hover:bg-slate-800/30' : 'opacity-50'}>
                                                            <td className="px-6 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className={`h-2 w-2 rounded-full ${getNetworkColor(service.network)}`}
                                                                    ></span>
                                                                    <span className="font-medium text-slate-300">{service.network}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-3 font-semibold text-white uppercase">{service.plan_name}</td>
                                                            <td className="px-6 py-3">{service.plan_type}</td>

                                                            <td className="px-6 py-3 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Link
                                                                        href={route('data-plans.edit', service.id)}
                                                                        className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-400"
                                                                    >
                                                                        Edit plan
                                                                    </Link>
                                                                    <Separator
                                                                        orientation="vertical"
                                                                        className="mr-2 h-5 bg-slate-800 dark:bg-slate-200"
                                                                    />
                                                                    <div className="flex items-center gap-2 pr-1">
                                                                        <DeleteButton
                                                                            className="m-0 bg-transparent p-0 text-sm text-red-400 hover:text-red-400"
                                                                            route={route('data-plans.destroy', { data_plan: service.id })}
                                                                            resourceName={'data plan'}
                                                                            buttonSize="sm"
                                                                            variant="link"
                                                                        >
                                                                            Delete
                                                                        </DeleteButton>
                                                                    </div>
                                                                    <Separator
                                                                        orientation="vertical"
                                                                        className="mr-2 h-5 bg-slate-800 dark:bg-slate-200"
                                                                    />

                                                                    <div className="flex items-center gap-2">
                                                                        <IsActiveSwitch
                                                                            checked={service.is_active}
                                                                            onCheckedChange={(checked) =>
                                                                                updateService(service.id, 'is_active', checked)
                                                                            }
                                                                            label=""
                                                                            className="justify-end"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* <IsActiveSwitch
                                                                    checked={service.is_active}
                                                                    onCheckedChange={(checked) => updateService(service.id, 'is_active', checked)}
                                                                    label=""
                                                                    className="justify-end"
                                                                /> */}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            {services.filter((s) => s.type === activeTab).length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
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

const EditNetwork = ({ network }) => {
    const { setData, data, processing, errors, patch } = useForm(network);
    return (
        <Dialog>
            <DialogTrigger>
                <button
                    onClick={() => {
                        // Optional: If using a global Inertia useForm, you would populate it here:
                        // setData({ name: net.name, code: net.code, airtime_api_id: net.airtime_api_id, ... })
                    }}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-400"
                >
                    Edit
                </button>
            </DialogTrigger>
            <DialogContent className="overflow-hidden border-slate-800 bg-[#0f172a] p-0 text-white sm:max-w-md">
                {/* Header */}
                <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5">
                    <h3 className="text-lg font-semibold text-white">Add New Network</h3>
                    <p className="mt-1 text-xs text-slate-400">Configure global discounts for a new provider.</p>
                </div>

                {/* Body / Form */}
                <div className="space-y-5 px-6 py-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Network Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Smile Data"
                            // value={data.name}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Internal Code</label>
                        <input
                            type="text"
                            placeholder="Auto-generated from name"
                            // value={data.code}
                            readOnly
                            value={data.code}
                            className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 font-mono text-sm text-slate-400"
                        />
                        <InputError message={errors.code} />
                        <p className="mt-1.5 text-[10px] tracking-wider text-slate-500 uppercase">
                            Auto-generated from name. Lowercase letters, numbers, and underscores only.
                        </p>
                    </div>

                    {/* add api ids */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-300">Airtime API ID</label>
                            <input
                                type="number"
                                placeholder="e.g., Smile Data"
                                value={data.airtime_api_id}
                                onChange={(e) => setData('airtime_api_id', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <InputError message={errors.airtime_api_id} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-300">Airtime Pin API ID</label>
                            <input
                                type="number"
                                placeholder="e.g., Smile Data"
                                value={data.airtime_pin_api_id}
                                onChange={(e) => setData('airtime_pin_api_id', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <InputError message={errors.airtime_pin_api_id} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-300">Data API ID</label>
                            <input
                                type="number"
                                placeholder="e.g., Smile Data"
                                value={data.data_api_id}
                                onChange={(e) => setData('data_api_id', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <InputError message={errors.data_api_id} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-300">Data Pin API ID</label>
                            <input
                                type="number"
                                placeholder="e.g., Smile Data"
                                value={data.data_pin_api_id}
                                onChange={(e) => setData('data_pin_api_id', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <InputError message={errors.data_pin_api_id} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4">
                    {/* If using shadcn/ui, you can wrap this Cancel button in a <DialogClose asChild> */}
                    <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => patch(route('networks.update', data.id))}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:bg-indigo-900"
                    >
                        {processing ? 'Updating Network...' : 'Update Network'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const EditNetworkType = ({ network_type, networks }) => {
    const { setData, data, processing, errors, patch } = useForm({
        ...network_type,
        network_id: network_type.typeable?.id || '',
    });
    return (
        <Dialog>
            <DialogTrigger>
                <button
                    onClick={() => {
                        // Optional: If using a global Inertia useForm, you would populate it here:
                        // setData({ name: net.name, code: net.code, airtime_api_id: net.airtime_api_id, ... })
                    }}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-400"
                >
                    Edit
                </button>
            </DialogTrigger>
            <DialogContent className="overflow-hidden border-slate-800 bg-[#0f172a] p-0 text-white sm:max-w-md">
                {/* Header */}
                <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-5">
                    <h3 className="text-lg font-semibold text-white">Add New Network</h3>
                    <p className="mt-1 text-xs text-slate-400">Configure global discounts for a new provider.</p>
                </div>

                {/* Body / Form */}
                <div className="space-y-5 px-6 py-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Type Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Enterprise, Corporate"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Associated Network</label>
                        <Select value={data.network_id} onValueChange={(e) => setData('network_id', e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Network" />
                            </SelectTrigger>
                            <SelectContent>
                                {networks.map((network) => (
                                    <SelectItem key={network.id} value={network.id}>
                                        {network.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.network_id} />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-300">Associated Network</label>
                        <Select
                            value={data.type || ''}
                            onValueChange={(e) => setData('type', e)}
                            // className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
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
                    {/* If using shadcn/ui, you can wrap this Cancel button in a <DialogClose asChild> */}
                    <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => patch(route('network-types.update', data.id))}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:bg-indigo-900"
                    >
                        {processing ? 'Updating Network...' : 'Update Network'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
