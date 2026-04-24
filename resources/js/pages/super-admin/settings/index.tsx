import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Settings2, Globe, ShieldAlert, PhoneCall, Banknote } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    settings: any; // Using any for flexibility, or properly type your nested settings
}

export default function SystemSettingsIndex({ settings }: Props) {
    // con
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || 'NexusVTU',
        support_email: settings.support_email || '',
        support_phone: settings.support_phone || '',
        company_address: settings.company_address || '',
        global_maintenance_mode: settings.global_maintenance_mode === '1',
        bank_transfer_charge_value: settings.bank_transfer_charge.value,
        bank_transfer_charge_type: settings.bank_transfer_charge.type,
        
        wallet_transfer_charge_value: settings.wallet_transfer_charge.value,
        wallet_transfer_charge_type: settings.wallet_transfer_charge.type,
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('super-admin.settings.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'System Settings', href: '/admin/settings' }]}>
            <Head title="System Settings" />

            <div className=" p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Platform Configuration</h1>
                    <p className="text-muted-foreground">Manage global settings, fees, and maintenance controls.</p>
                </div>

                <form onSubmit={submit}>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
                            <TabsTrigger value="general"><Globe className="h-4 w-4 mr-2" /> General</TabsTrigger>
                            <TabsTrigger value="financials"><Banknote className="h-4 w-4 mr-2" /> Financials</TabsTrigger>
                            <TabsTrigger value="security"><ShieldAlert className="h-4 w-4 mr-2" /> Security</TabsTrigger>
                        </TabsList>

                        {/* GENERAL TAB */}
                        <TabsContent value="general" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Core details used across the platform.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Site Name</Label>
                                        <Input value={data.site_name} onChange={e => setData('site_name', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Support Email</Label>
                                        <Input type="email" value={data.support_email} onChange={e => setData('support_email', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Support Phone</Label>
                                        <Input value={data.support_phone} onChange={e => setData('support_phone', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company Address</Label>
                                        <Input value={data.company_address} onChange={e => setData('company_address', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* FINANCIALS TAB (NEW) */}
                        <TabsContent value="financials" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transfer Charges</CardTitle>
                                    <CardDescription>Configure the fees deducted when users send or withdraw money.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-8">
                                    
                                    {/* Bank Transfer Fee */}
                                    <div className="space-y-3 border-b pb-6">
                                        <div>
                                            <Label className="text-base font-semibold">Bank Withdrawal Fee</Label>
                                            <p className="text-xs text-muted-foreground mb-3">Applied when tenants or customers withdraw to a local bank.</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Type</Label>
                                                <Select 
                                                    value={data.bank_transfer_charge_type} 
                                                    onValueChange={v => setData('bank_transfer_charge_type', v)}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Value</Label>
                                                <Input 
                                                    type="number" min="0" step="0.01"
                                                    value={data.bank_transfer_charge_value} 
                                                    onChange={e => setData('bank_transfer_charge_value', parseFloat(e.target.value) || 0)} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wallet Transfer Fee */}
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-base font-semibold">Wallet-to-Wallet Fee</Label>
                                            <p className="text-xs text-muted-foreground mb-3">Applied for internal transfers between wallets.</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Type</Label>
                                                <Select 
                                                    value={data.wallet_transfer_charge_type} 
                                                    onValueChange={v => setData('wallet_transfer_charge_type', v)}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Value</Label>
                                                <Input 
                                                    type="number" min="0" step="0.01"
                                                    value={data.wallet_transfer_charge_value} 
                                                    onChange={e => setData('wallet_transfer_charge_value', parseFloat(e.target.value) || 0)} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SECURITY TAB */}
                        <TabsContent value="security" className="space-y-6">
                            <Card className="border-rose-500/20">
                                <CardHeader>
                                    <CardTitle className="text-rose-600">Danger Zone</CardTitle>
                                    <CardDescription>Critical platform controls.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 rounded-lg border border-rose-500/20 bg-rose-500/5">
                                        <div className="space-y-0.5 pr-4">
                                            <Label className="text-base font-semibold">Global Maintenance Mode</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Instantly blocks all tenant API requests and shows a maintenance screen on tenant dashboards.
                                            </p>
                                        </div>
                                        <Switch 
                                            checked={data.global_maintenance_mode} 
                                            onCheckedChange={(checked) => setData('global_maintenance_mode', checked)} 
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* GLOBAL SAVE BUTTON */}
                        <div className="mt-8 flex justify-end border-t pt-6">
                            <Button type="submit" disabled={processing} size="lg" className="min-w-[150px]">
                                <Save className="mr-2 h-4 w-4" /> Save Configurations
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </div>
        </AppLayout>
    );
}