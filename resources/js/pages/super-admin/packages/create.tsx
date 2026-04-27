import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Package } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function PackageForm({ package: pkg }: { package?: Package }) {
    const isEditing = !!pkg;
    const [featureInput, setFeatureInput] = useState('');

    const { data, setData, post, put, processing, errors } = useForm({
        name: pkg?.name || '',
        description: pkg?.description || '',
        price: pkg?.price || 0,
        billing_cycle: pkg?.billing_cycle || 'monthly',
        features: pkg?.features || [],
        is_active: pkg?.is_active ?? true,
        is_default: pkg?.is_default ?? false,
        is_featured: pkg?.is_featured ?? false,
        discount: pkg?.discount || '',
        settings: pkg?.settings || {
            api_access: false,
            custom_domain: false,
            staff_limit: 1,
            monthly_api_limit: 0,
            // bot_access: false,
            allow_telegram_bot: false,
            allow_whatsapp_bot: false,
            webhook_access: false,
            custom_pricing: false,
            priority_support: false,
            white_label: false,
        },
    });

    const addFeature = () => {
        if (featureInput.trim() !== '') {
            setData('features', [...data.features, featureInput.trim()]);
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setData(
            'features',
            data.features.filter((_: any, i: number) => i !== index),
        );
    };

    const updateSetting = (key: string, value: any) => {
        setData('settings', { ...data.settings, [key]: value });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('super-admin.packages.update', pkg.id));
        } else {
            post(route('super-admin.packages.store'));
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Packages', href: '/admin/packages' },
                { title: isEditing ? 'Edit Package' : 'Create Package', href: '#' },
            ]}
        >
            <Head title={isEditing ? 'Edit Package' : 'Create Package'} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <HeadingSmall
                    title={isEditing ? 'Edit Package' : 'Create New Package'}
                    description="Configure pricing, billing cycle, features, and strict system limits."
                />

                <form onSubmit={submit} className="bg-card space-y-8 rounded-xl border p-6 shadow-sm">
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label>Package Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Pro Tier" required />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Price (₦)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                    required
                                />
                                <InputError message={errors.price} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount">Package Discount (Amount or %)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    step="0.01"
                                    value={data.discount}
                                    onChange={(e) => setData('discount', e.target.value)}
                                />
                                {errors.discount && <div className="text-sm text-red-500">{errors.discount}</div>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Billing Cycle</Label>
                                <Select value={data.billing_cycle} onValueChange={(val) => setData('billing_cycle', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select cycle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                        <SelectItem value="lifetime">Lifetime (One-time)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.billing_cycle} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Short Description</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    {/* Features Array */}
                    <div className="grid gap-2 border-t pt-6">
                        <div>
                            <Label className="text-base font-medium">Marketing Features</Label>
                            <p className="text-muted-foreground mb-3 text-xs">These are the bullet points shown to the user on the pricing page.</p>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                placeholder="e.g. Unlimited API Requests"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addFeature();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addFeature} variant="secondary">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <ul className="mt-2 space-y-2">
                            {data.features.map((feat: string, index: number) => (
                                <li key={index} className="bg-muted/50 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                                    {feat}
                                    <button type="button" onClick={() => removeFeature(index)} className="text-destructive hover:opacity-70">
                                        <X className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* System Limits / Settings JSON */}
                    <div className="grid gap-6 border-t pt-6">
                        <div>
                            <Label className="text-base font-medium">System Rules & Limits</Label>
                            <p className="text-muted-foreground text-xs">These settings are strictly enforced by the backend middleware.</p>
                        </div>

                        <div className="bg-muted/30 grid grid-cols-1 gap-6 rounded-xl border p-5 md:grid-cols-2">
                            {/* Numeric Limits */}
                            <div className="space-y-2">
                                <Label>Staff Account Limit</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={data.settings.staff_limit}
                                    onChange={(e) => updateSetting('staff_limit', parseInt(e.target.value) || 1)}
                                />
                                <p className="text-muted-foreground text-[10px]">Max admin users allowed.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly API Limit</Label>
                                <Input
                                    type="number"
                                    min="10"
                                    value={data.settings.monthly_api_limit}
                                    onChange={(e) => updateSetting('monthly_api_limit', parseInt(e.target.value) || 0)}
                                />
                                <p className="text-muted-foreground text-[10px]">Max API calls allowed per month.</p>
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Developer API</Label>
                                    <p className="text-muted-foreground text-[10px]">Generate API keys.</p>
                                </div>
                                <Switch checked={data.settings.api_access} onCheckedChange={(c) => updateSetting('api_access', c)} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Webhook Access</Label>
                                    <p className="text-muted-foreground text-[10px]">Receive server callbacks.</p>
                                </div>
                                <Switch checked={data.settings.webhook_access} onCheckedChange={(c) => updateSetting('webhook_access', c)} />
                            </div>

                            {/* Telegram Bot Access */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="allow_telegram_bot">Allow Telegram Bot Access</Label>
                                    <p className="text-muted-foreground text-[10px]">Enable Telegram bot integration.</p>
                                </div>
                                <Switch
                                    id="allow_telegram_bot"
                                    checked={data?.settings?.allow_telegram_bot}
                                    onCheckedChange={(checked) => updateSetting('allow_telegram_bot', checked)}
                                />
                            </div>
                            {/* WhatsApp Bot Access */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="allow_whatsapp_bot">Allow WhatsApp Bot Access</Label>
                                    <p className="text-muted-foreground text-[10px]">Enable WhatsApp bot integration.</p>
                                </div>
                                <Switch
                                    id="allow_whatsapp_bot"
                                    checked={data?.settings?.allow_whatsapp_bot}
                                    onCheckedChange={(checked) => updateSetting('allow_whatsapp_bot', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Custom Domain</Label>
                                    <p className="text-muted-foreground text-[10px]">Allow domain mapping.</p>
                                </div>
                                <Switch checked={data.settings.custom_domain} onCheckedChange={(c) => updateSetting('custom_domain', c)} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Custom Pricing</Label>
                                    <p className="text-muted-foreground text-[10px]">Modify profit margins.</p>
                                </div>
                                <Switch checked={data.settings.custom_pricing} onCheckedChange={(c) => updateSetting('custom_pricing', c)} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>White Label</Label>
                                    <p className="text-muted-foreground text-[10px]">Remove platform branding.</p>
                                </div>
                                <Switch checked={data.settings.white_label} onCheckedChange={(c) => updateSetting('white_label', c)} />
                            </div>

                            <div className="flex items-center justify-between md:col-span-2">
                                <div className="space-y-0.5">
                                    <Label>Priority Support</Label>
                                    <p className="text-muted-foreground text-[10px]">Premium tier support queue.</p>
                                </div>
                                <Switch checked={data.settings.priority_support} onCheckedChange={(c) => updateSetting('priority_support', c)} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="space-y-0.5">
                            <Label className="text-base">Active Status</Label>
                            <p className="text-muted-foreground text-xs">If disabled, tenants cannot see or subscribe to this plan.</p>
                        </div>
                        <Switch checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                    </div>
                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="space-y-0.5">
                            <Label className="text-base">Default Package</Label>
                            <p className="text-muted-foreground text-xs">Set as the default package for new tenants.</p>
                        </div>
                        <Switch checked={data.is_default} onCheckedChange={(checked) => setData('is_default', checked)} />
                    </div>

                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="space-y-0.5">
                            <Label className="text-base">Featured Package</Label>
                            <p className="text-muted-foreground text-xs">Highlight this package as featured.</p>
                        </div>
                        <Switch checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked)} />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing}>
                            {isEditing ? 'Save Changes' : 'Create Package'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
