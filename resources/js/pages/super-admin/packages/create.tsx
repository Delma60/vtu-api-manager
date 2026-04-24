import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Plus, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function PackageForm({ package: pkg }: { package?: any }) {
    const isEditing = !!pkg;
    const [featureInput, setFeatureInput] = useState('');

    const { data, setData, post, put, processing, errors } = useForm({
        name: pkg?.name || '',
        description: pkg?.description || '',
        price: pkg?.price || 0,
        billing_cycle: pkg?.billing_cycle || 'monthly',
        features: pkg?.features || [],
        is_active: pkg?.is_active ?? true,
    });

    const addFeature = () => {
        if (featureInput.trim() !== '') {
            setData('features', [...data.features, featureInput.trim()]);
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_: any, i: number) => i !== index));
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
        <AppLayout breadcrumbs={[
            { title: 'Packages', href: '/admin/packages' },
            { title: isEditing ? 'Edit Package' : 'Create Package', href: '#' }
        ]}>
            <Head title={isEditing ? 'Edit Package' : 'Create Package'} />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <HeadingSmall 
                    title={isEditing ? 'Edit Package' : 'Create New Package'} 
                    description="Configure pricing, billing cycle, and features." 
                />

                <form onSubmit={submit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                    
                    <div className="grid gap-2">
                        <Label>Package Name</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Pro Tier" required />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Price (₦)</Label>
                            <Input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} required />
                            <InputError message={errors.price} />
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
                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2} />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2 border-t pt-4">
                        <Label>Features List (Displayed to users)</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={featureInput} 
                                onChange={e => setFeatureInput(e.target.value)} 
                                placeholder="e.g. Unlimited API Requests"
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                            />
                            <Button type="button" onClick={addFeature} variant="secondary"><Plus className="h-4 w-4" /></Button>
                        </div>
                        
                        <ul className="space-y-2 mt-2">
                            {data.features.map((feat: string, index: number) => (
                                <li key={index} className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded-md text-sm">
                                    {feat}
                                    <button type="button" onClick={() => removeFeature(index)} className="text-destructive hover:opacity-70">
                                        <X className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="space-y-0.5">
                            <Label>Active Status</Label>
                            <p className="text-xs text-muted-foreground">If disabled, tenants cannot see or subscribe to this plan.</p>
                        </div>
                        <Switch checked={data.is_active} onCheckedChange={checked => setData('is_active', checked)} />
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