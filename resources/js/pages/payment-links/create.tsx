import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, CreditCard, Link as LinkIcon, Mail, Receipt, User } from 'lucide-react';
import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreatePaymentLink() {
    // Assuming you have the authenticated user available in props to show their business name in the preview
    const { auth, networks, dataPlans, cablePlans, cableNetworks } = usePage().props as unknown as {
        auth: { user: { name: string; business_name?: string } };
    };
    const merchantName = auth.user.business_name || auth.user.name || 'Your Business';

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
        customer_name: '',
        customer_email: '',
        is_reusable: false,
        service_type: '', // '', 'airtime', 'data', 'cable'
        meta: {} as any,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payment-links.store'));
    };

    const updateMeta = (key: string, value: any) => {
        setData('meta', { ...data.meta, [key]: value });
    };

    const networkTypes = useMemo(function(){
        // for airtime only
        if(data.service_type === 'airtime') {
            // console.log(networks, data.meta);
            return networks.find((n: any) => n.name === data.meta.network)
            ?.network_types.filter((nt: any) => {
                return nt.type === data.service_type
            }) || [];
        }
    }, [data.meta.network_id, data.service_type, data.meta])

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Payment Links', href: route('payment-links.index') },
                { title: 'Create Link', href: '#' },
            ]}
        >
            <div className="mx-auto max-w-6xl p-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create a Payment Link</h1>
                    <p className="mt-1 text-sm text-slate-500">Generate a secure link to accept payments from anyone, anywhere.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: FORM */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <form onSubmit={submit} className="space-y-8">
                            {/* Section 1: Payment Details */}
                            <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                        <Receipt className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Details</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Amount <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <span className="font-semibold text-slate-500 sm:text-sm">₦</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-slate-900 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900"
                                                placeholder="0.00"
                                                
                                            />
                                        </div>
                                        <InputError message={errors.amount} className="mt-1" />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            placeholder="e.g., Logo Design Deposit"
                                            required
                                        />
                                        <InputError message={errors.description} className="mt-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Link Behavior (Reusable vs One-time) */}
                            <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        <LinkIcon className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Link Type</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* One-Time Option */}
                                    <div
                                        onClick={() => setData('is_reusable', false)}
                                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${!data.is_reusable ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
                                    >
                                        {!data.is_reusable && (
                                            <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        )}
                                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">One-Time Payment</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Link expires immediately after a single successful payment.
                                        </p>
                                    </div>

                                    {/* Reusable Option */}
                                    <div
                                        onClick={() => setData('is_reusable', true)}
                                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${data.is_reusable ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
                                    >
                                        {data.is_reusable && (
                                            <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        )}
                                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">Reusable Link</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Link stays active. Ideal for selling standard services or products.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Customer Details (Optional) */}
                            <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Customer Details <span className="text-sm font-normal text-slate-500">(Optional)</span>
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    If you leave this blank, we will ask the customer to enter their details on the checkout page. If you fill it out,
                                    the fields will be locked for them.
                                </p>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-slate-900 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                placeholder="e.g., John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Customer Email</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <input
                                                type="email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-slate-900 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                placeholder="e.g., john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Attach Automation (Optional)</h2>
                                        <p className="text-xs text-slate-500">Automatically deliver a service when this link is paid.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Action on Payment</label>
                                        <Select
                                            value={data.service_type}
                                            onValueChange={(v) => {
                                                setData('service_type', v);
                                                setData('meta', {});
                                            }}
                                        >
                                            <SelectTrigger className="h-12 w-full rounded-xl">
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
                                        <div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Select Network
                                                </label>
                                                <Select value={data.meta.network || ''} onValueChange={(v) => updateMeta('network', v)}>
                                                    <SelectTrigger className="h-12 w-full rounded-xl">
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

                                            {/* Network type */}
                                            <div className="mt-4">
                                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Network Type
                                                </label>
                                                <Select
                                                    value={data.meta.network_type || ''}
                                                    onValueChange={(v) => updateMeta('network_type', v)}
                                                >
                                                    <SelectTrigger className="h-12 w-full rounded-xl">
                                                        <SelectValue placeholder="Choose Network Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {networks.length > 0 &&
                                                        networkTypes?.map((nt: any) => (
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
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Select Data Plan to Deliver
                                            </label>
                                            <Select
                                                value={data.meta.data_plan_id?.toString() || ''}
                                                onValueChange={(v) => updateMeta('data_plan_id', v)}
                                            >
                                                <SelectTrigger className="h-12 w-full rounded-xl">
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
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Decoder</label>
                                                <Select
                                                    value={data.meta.cable_network || ''}
                                                    onValueChange={(v) => updateMeta('cable_network', v)}
                                                >
                                                    <SelectTrigger className="h-12 w-full rounded-xl">
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
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Bouquet</label>
                                                <Select
                                                    value={data.meta.cable_plan_id?.toString() || ''}
                                                    onValueChange={(v) => updateMeta('cable_plan_id', v)}
                                                >
                                                    <SelectTrigger className="h-12 w-full rounded-xl">
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
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl px-8 py-6 text-base shadow-lg transition-transform active:scale-[0.98]"
                                >
                                    {processing ? 'Generating Link...' : 'Create Payment Link'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: LIVE PREVIEW */}
                    <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
                        <div className="sticky top-6">
                            <h3 className="mb-4 text-sm font-semibold tracking-wider text-slate-500 uppercase">Live Preview</h3>

                            {/* Simulated Checkout Card */}
                            <div className="pointer-events-none w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
                                <div className="relative overflow-hidden bg-slate-900 px-6 py-8 text-center text-white">
                                    {/* Abstract background pattern for polish */}
                                    <div
                                        className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                            backgroundSize: '16px 16px',
                                        }}
                                    ></div>
                                    <div className="relative z-10">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold uppercase shadow-lg">
                                            {merchantName.charAt(0)}
                                        </div>
                                        <p className="mb-1 text-sm text-slate-400">You are paying</p>
                                        <h2 className="text-xl font-medium">{merchantName}</h2>
                                    </div>
                                </div>

                                <div className="px-6 py-8">
                                    <div className="mb-8 text-center">
                                        <p className="mb-2 text-xs font-semibold tracking-widest text-slate-500 uppercase">Total Amount</p>
                                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                            <span className="mr-1 align-top text-xl">₦</span>
                                            {data.amount ? parseFloat(data.amount).toLocaleString() : '0.00'}
                                        </h1>
                                        <div className="mt-3 inline-block rounded-lg bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            {data.description || 'Payment Description'}
                                        </div>
                                    </div>

                                    <div className="space-y-3 opacity-60 grayscale filter">
                                        <div className="flex h-12 w-full items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                                            {data.customer_name || 'Full Name'}
                                        </div>
                                        <div className="flex h-12 w-full items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                                            {data.customer_email || 'Email Address'}
                                        </div>
                                        <div className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white">
                                            Pay ₦{data.amount ? parseFloat(data.amount).toLocaleString() : '0.00'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
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
