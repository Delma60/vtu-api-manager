import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
// Add these imports at the top
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

export default function TransferCreate({ type, banks, customers, walletBalance, settings }: any) {
    console.log(settings)
    const [accountName, setAccountName] = useState<string | null>(null);
    const [resolving, setResolving] = useState(false);
    const [resolveError, setResolveError] = useState<string | null>(null);
    const [openBankSelect, setOpenBankSelect] = useState(false);

    // Extract optional query param if coming from beneficiaries tab
    const searchParams = new URLSearchParams(window.location.search);
    const preselectId = searchParams.get('preselect');

    const { data, setData, post, processing, errors, reset } = useForm({
        transfer_type: type,
        amount: '',
        narration: '',
        customer_id: preselectId || '',
        account_bank: '',
        account_number: '',
    });

    useEffect(() => {
        if (type === 'bank' && data.account_bank && data.account_number.length === 10) {
            setResolving(true);
            setAccountName(null);
            setResolveError(null);
            axios
                .post(route('transfer.resolve'), { account_bank: data.account_bank, account_number: data.account_number })
                .then((res) => setAccountName(res.data.data.account_name))
                .catch((err) => setResolveError(err.response?.data?.message || 'Invalid account details'))
                .finally(() => setResolving(false));
        }
    }, [data.account_bank, data.account_number]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('transfer.process'), { onSuccess: () => reset() });
    };

    // const fee = type === 'bank' ? 50 : 0;
    const { fee, totalDeduction } = useMemo(() => {
        const currentAmount = Number(data.amount) || 0;
        let calculatedFee = 0;

        if (settings && settings[type]) {
            const feeConfig = settings[type];
            if (feeConfig.type === 'percentage') {
                calculatedFee = currentAmount * (feeConfig.value / 100);
            } else {
                calculatedFee = feeConfig.value;
            }
        }
        return { 
            fee: calculatedFee, 
            totalDeduction: currentAmount + calculatedFee 
        };
    }, [data.amount, settings, type]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Transfers', href: '/transfers' },
                { title: 'Make Transfer', href: '#' },
            ]}
        >
            <Head title="Make Transfer" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <Link href={route('transfers.create')} className="text-primary mb-6 flex items-center text-sm font-medium hover:underline">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Change Destination Type
                </Link>

                <div className="flex items-end justify-between border-b pb-4">
                    <HeadingSmall
                        title={type === 'wallet' ? 'Fund Customer Wallet' : 'Bank Transfer'}
                        description="Fill in the details below to complete the transaction."
                    />
                </div>

                <form onSubmit={submit} className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
                    {/* WALLET FIELDS */}
                    {type === 'wallet' && (
                        <div className="space-y-2">
                            <Label>Select Customer</Label>
                            <Select value={data.customer_id} onValueChange={(v) => setData('customer_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Search for customer..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers?.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name} ({c.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.customer_id && <p className="text-destructive text-sm">{errors.customer_id}</p>}
                        </div>
                    )}

                    {/* BANK FIELDS */}
                    {/* BANK FIELDS */}
                    {type === 'bank' && (
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <Label>Select Bank</Label>
                                <Popover open={openBankSelect} onOpenChange={setOpenBankSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openBankSelect}
                                            className="w-full justify-between font-normal"
                                        >
                                            {data.account_bank
                                                ? banks?.find((b: any) => b.code === data.account_bank)?.name
                                                : 'Search or select bank...'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search bank name..." />
                                            <CommandList className="max-h-60">
                                                <CommandEmpty>No bank found.</CommandEmpty>
                                                <CommandGroup>
                                                    {banks?.map((b: any) => (
                                                        <CommandItem
                                                            key={b.code}
                                                            value={b.name} // Shadcn uses value to filter the search internally
                                                            onSelect={() => {
                                                                setData('account_bank', b.code);
                                                                setOpenBankSelect(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.account_bank === b.code ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {b.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Account Number</Label>
                                <Input
                                    maxLength={10}
                                    placeholder="0123456789"
                                    value={data.account_number}
                                    onChange={(e) => setData('account_number', e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            {/* Validation Feedback */}
                            {resolving && (
                                <p className="text-muted-foreground flex gap-2 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying account...
                                </p>
                            )}
                            {accountName && (
                                <p className="flex gap-2 text-sm font-bold text-emerald-600">
                                    <CheckCircle2 className="h-4 w-4" /> {accountName}
                                </p>
                            )}
                            {resolveError && (
                                <p className="text-destructive flex gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4" /> {resolveError}
                                </p>
                            )}
                        </div>
                    )}
                    {/* SHARED FIELDS */}
                    <div className={`space-y-4 border-t pt-4 ${type === 'bank' && !accountName ? 'pointer-events-none opacity-50' : ''}`}>
                        <div className="space-y-2">
                            <Label>Amount (₦)</Label>
                            <Input type="number" min="50" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
                            {errors.amount && <p className="text-destructive text-sm">{errors.amount}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Narration / Note</Label>
                            <Input
                                maxLength={50}
                                placeholder="e.g. Refund, Bonus, Payout"
                                value={data.narration}
                                onChange={(e) => setData('narration', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="bg-muted mt-6 space-y-2 rounded-lg p-4 text-sm">
                        <div className="text-muted-foreground flex justify-between">
                            <span>Fee</span>
                            <span>₦{fee}</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t pt-2 font-bold">
                            <span>Total Deduction</span>
                            <span className={totalDeduction > walletBalance ? 'text-destructive' : 'text-primary'}>
                                ₦{totalDeduction.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="h-12 w-full"
                        disabled={processing || totalDeduction > walletBalance || (type === 'bank' && !accountName)}
                    >
                        {processing ? 'Processing...' : 'Complete Transfer'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
