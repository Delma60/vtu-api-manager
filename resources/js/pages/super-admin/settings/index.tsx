import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Banknote, Globe, Save, ShieldAlert } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    settings: any; // Using any for flexibility, or properly type your nested settings
}

export default function SystemSettingsIndex({ settings }: Props) {
    // con
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name,
        site_description: settings.site_description || '',
        site_logo: settings.site_logo || null,
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

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Platform Configuration</h1>
                    <p className="text-muted-foreground">Manage global settings, fees, and maintenance controls.</p>
                </div>

                <form onSubmit={submit}>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-3">
                            <TabsTrigger value="general">
                                <Globe className="mr-2 h-4 w-4" /> General
                            </TabsTrigger>
                            <TabsTrigger value="financials">
                                <Banknote className="mr-2 h-4 w-4" /> Financials
                            </TabsTrigger>
                            <TabsTrigger value="security">
                                <ShieldAlert className="mr-2 h-4 w-4" /> Security
                            </TabsTrigger>
                        </TabsList>

                        {/* GENERAL TAB */}
                        <TabsContent value="general" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Core details used across the platform.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Site Name</Label>
                                        <Input value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="site_description">Site Description (SEO)</Label>
                                        <Textarea
                                            id="site_description"
                                            value={data.site_description}
                                            onChange={(e) => setData('site_description', e.target.value)}
                                            placeholder="Manage your VTU services, airtime, and data effortlessly..."
                                            rows={3}
                                        />
                                        {errors.site_description && <p className="text-sm text-red-500">{errors.site_description}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="site_logo">Site Logo</Label>

                                        <div className="mt-2 flex items-center gap-4">
                                            {/* Show preview of the newly selected file */}
                                            {data.site_logo instanceof File ? (
                                                <img
                                                    src={URL.createObjectURL(data.site_logo)}
                                                    alt="New Logo Preview"
                                                    className="h-16 w-auto rounded border object-contain p-1"
                                                />
                                            ) : settings.site_logo ? (
                                                /* Or show the existing logo from the database */
                                                <img
                                                    src={`/storage/${settings.site_logo}`}
                                                    alt="Current Logo"
                                                    className="h-16 w-auto rounded border object-contain p-1"
                                                />
                                            ) : null}

                                            <Input
                                                id="site_logo"
                                                type="file"
                                                accept="image/*"
                                                className="w-full md:max-w-md"
                                                onChange={(e) => setData('site_logo', e.target.files ? e.target.files[0] : null)}
                                            />
                                        </div>
                                        {errors.site_logo && <p className="text-sm text-red-500">{errors.site_logo}</p>}
                                        <p className="text-muted-foreground mt-1 text-sm">Recommended size: 200x50px (PNG or SVG).</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Support Email</Label>
                                        <Input type="email" value={data.support_email} onChange={(e) => setData('support_email', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Support Phone</Label>
                                        <Input value={data.support_phone} onChange={(e) => setData('support_phone', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company Address</Label>
                                        <Input value={data.company_address} onChange={(e) => setData('company_address', e.target.value)} />
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
                                            <p className="text-muted-foreground mb-3 text-xs">
                                                Applied when tenants or customers withdraw to a local bank.
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Type</Label>
                                                <Select
                                                    value={data.bank_transfer_charge_type}
                                                    onValueChange={(v) => setData('bank_transfer_charge_type', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Value</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.bank_transfer_charge_value}
                                                    onChange={(e) => setData('bank_transfer_charge_value', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wallet Transfer Fee */}
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-base font-semibold">Wallet-to-Wallet Fee</Label>
                                            <p className="text-muted-foreground mb-3 text-xs">Applied for internal transfers between wallets.</p>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Type</Label>
                                                <Select
                                                    value={data.wallet_transfer_charge_type}
                                                    onValueChange={(v) => setData('wallet_transfer_charge_type', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label>Charge Value</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.wallet_transfer_charge_value}
                                                    onChange={(e) => setData('wallet_transfer_charge_value', parseFloat(e.target.value) || 0)}
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
                                    <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                                        <div className="space-y-0.5 pr-4">
                                            <Label className="text-base font-semibold">Global Maintenance Mode</Label>
                                            <p className="text-muted-foreground text-sm">
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
