import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, AlertCircle, Users, Building2, Wallet } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import axios from 'axios';

interface Bank { code: string; name: string; }
interface Customer { id: number; name: string; email: string; wallet_balance: number; }

export default function UnifiedTransferPage({ banks, customers, walletBalance }: { banks: Bank[], customers: Customer[], walletBalance: number }) {
    
    const [transferType, setTransferType] = useState<'wallet' | 'bank'>('wallet');
    const [accountName, setAccountName] = useState<string | null>(null);
    const [resolving, setResolving] = useState(false);
    const [resolveError, setResolveError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        transfer_type: 'wallet',
        amount: '',
        narration: '',
        customer_id: '',
        account_bank: '',
        account_number: '',
    });

    // Handle Transfer Type Change
    const handleTypeChange = (type: 'wallet' | 'bank') => {
        setTransferType(type);
        setData('transfer_type', type);
        reset('amount', 'narration', 'customer_id', 'account_bank', 'account_number');
        setAccountName(null);
    };

    // Auto-resolve Bank Account
    useEffect(() => {
        if (transferType === 'bank' && data.account_bank && data.account_number.length === 10) {
            setResolving(true);
            setAccountName(null);
            setResolveError(null);

            axios.post(route('transfer.resolve'), {
                account_bank: data.account_bank,
                account_number: data.account_number
            }).then(res => {
                setAccountName(res.data.data.account_name);
            }).catch(err => {
                setResolveError(err.response?.data?.message || 'Invalid account details');
            }).finally(() => {
                setResolving(false);
            });
        }
    }, [data.account_bank, data.account_number, transferType]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('transfer.process'), {
            onSuccess: () => reset('amount', 'narration', 'account_number', 'customer_id')
        });
    };

    const fee = transferType === 'bank' ? 50 : 0;
    const totalDeduction = (Number(data.amount) || 0) + fee;

    return (
        <AppLayout breadcrumbs={[{ title: 'Send Money', href: '/wallets/transfer' }]}>
            <Head title="Send Money" />

            <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8 space-y-8">
                
                <div className="flex justify-between items-end border-b pb-4">
                    <HeadingSmall title="Send Money" description="Transfer funds to customers or withdraw to local banks." />
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Available Balance</p>
                        <p className="font-bold text-xl flex items-center gap-1"><Wallet className="h-5 w-5 text-primary"/> ₦{Number(walletBalance).toLocaleString()}</p>
                    </div>
                </div>

                {/* TRANSFER TYPE SELECTOR */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        type="button"
                        onClick={() => handleTypeChange('wallet')}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                            transferType === 'wallet' ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted hover:border-primary/50 bg-card opacity-70'
                        }`}
                    >
                        <Users className={`h-8 w-8 mb-3 ${transferType === 'wallet' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-sm">To Customer Wallet</span>
                    </button>

                    <button 
                        type="button"
                        onClick={() => handleTypeChange('bank')}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                            transferType === 'bank' ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted hover:border-primary/50 bg-card opacity-70'
                        }`}
                    >
                        <Building2 className={`h-8 w-8 mb-3 ${transferType === 'bank' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-sm">To Bank Account</span>
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                    
                    {/* --- WALLET FIELDS --- */}
                    {transferType === 'wallet' && (
                        <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                            <Label>Select Customer</Label>
                            <Select value={data.customer_id} onValueChange={v => setData('customer_id', v)}>
                                <SelectTrigger><SelectValue placeholder="Search for customer..." /></SelectTrigger>
                                <SelectContent>
                                    {customers.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name} ({c.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id}</p>}
                        </div>
                    )}

                    {/* --- BANK FIELDS --- */}
                    {transferType === 'bank' && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-2">
                                <Label>Select Bank</Label>
                                <Select value={data.account_bank} onValueChange={v => setData('account_bank', v)}>
                                    <SelectTrigger><SelectValue placeholder="Search or select bank..." /></SelectTrigger>
                                    <SelectContent className="max-h-60">
                                        {banks.map(bank => (
                                            <SelectItem key={bank.code} value={bank.code}>{bank.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Account Number</Label>
                                <Input 
                                    maxLength={10} 
                                    placeholder="0123456789" 
                                    value={data.account_number} 
                                    onChange={e => setData('account_number', e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            {/* Verification States */}
                            {resolving && <p className="flex gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Verifying account...</p>}
                            {accountName && <p className="flex gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4"/> {accountName}</p>}
                            {resolveError && <p className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4"/> {resolveError}</p>}
                        </div>
                    )}

                    {/* --- SHARED FIELDS --- */}
                    <div className={`space-y-4 pt-4 border-t ${transferType === 'bank' && !accountName ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="space-y-2">
                            <Label>Amount (₦)</Label>
                            <Input 
                                type="number" min="50" 
                                value={data.amount} 
                                onChange={e => setData('amount', e.target.value)}
                            />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Narration / Note</Label>
                            <Input 
                                maxLength={50} placeholder="e.g. Refund, Bonus, Payout" 
                                value={data.narration} onChange={e => setData('narration', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-muted p-4 rounded-lg text-sm space-y-2 mt-6">
                        <div className="flex justify-between text-muted-foreground"><span>Fee</span><span>₦{fee}</span></div>
                        <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>Total Deduction</span>
                            <span className={totalDeduction > walletBalance ? 'text-destructive' : 'text-primary'}>
                                ₦{totalDeduction.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-md" disabled={processing || totalDeduction > walletBalance || (transferType === 'bank' && !accountName)}>
                        {processing ? 'Processing...' : 'Send Money'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}