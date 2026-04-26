import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Building2, UploadCloud } from 'lucide-react';
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';

interface Props {
    business: {
        trading_name: string;
        description: string;
        doing_business_as: string;
        business_type: string;
        sector: string;
        industry: string;
        notification_email: string;
        notification_phone: string;
    };
}

export default function BusinessProfile({ business }: Props) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        trading_name: business?.trading_name || '',
        description: business?.description || '',
        doing_business_as: business?.doing_business_as || '',
        business_type: business?.business_type || '',
        sector: business?.sector || '',
        industry: business?.industry || '',
        notification_email: business?.notification_email || '',
        notification_phone: business?.notification_phone || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.business.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <SettingsLayout>
                <Head title="Business Profile" />

                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">Business Profile</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage your business details, compliance information, and contact preferences.
                        </p>
                    </div>

                    <Tabs defaultValue="about" className="w-full">
                        {/* The horizontal scrollable tabs mimicking Flutterwave */}
                        <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger
                                value="about"
                                className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-6 py-3 font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                About
                            </TabsTrigger>
                            <TabsTrigger
                                value="notification"
                                className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-6 py-3 font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Notification
                            </TabsTrigger>
                        </TabsList>

                        {/* --- ABOUT TAB --- */}
                        <TabsContent value="about" className="mt-6">
                            <BusinessProfileTab />
                        </TabsContent>

                        {/* --- NOTIFICATION TAB --- */}
                        <TabsContent value="notification" className="mt-6">
                            <form onSubmit={submit}>
                                <Card className="border-none shadow-none">
                                    <CardHeader className="">
                                        <CardTitle className="text-lg">Contact Information</CardTitle>
                                        <CardDescription>This is where we will send your transaction updates and settlement alerts.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="max-w-xl space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="notification_email">Email Address</Label>
                                            <Input
                                                id="notification_email"
                                                type="email"
                                                value={data.notification_email}
                                                onChange={(e) => setData('notification_email', e.target.value)}
                                            />
                                            <InputError message={errors.notification_email} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notification_phone">Phone Number</Label>
                                            <Input
                                                id="notification_phone"
                                                type="tel"
                                                value={data.notification_phone}
                                                onChange={(e) => setData('notification_phone', e.target.value)}
                                            />
                                            <InputError message={errors.notification_phone} />
                                        </div>

                                        <div className="flex items-center gap-4 pt-4">
                                            <Button disabled={processing}>Save Changes</Button>
                                            {recentlySuccessful && <p className="text-sm font-medium text-green-600">Saved successfully.</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}


function BusinessProfileTab() {
    const { auth } = usePage<SharedData>().props;
    const business = auth.user.business; // Assuming this is passed via HandleInertiaRequests middleware
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(business?.logo_url || null);

    // Watch for prop changes from the server to update the logo
    useEffect(() => {
        if (business?.logo_url) {
            setLogoPreview(business.logo_url);
        }
    }, [business?.logo_url]);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: business?.name || '',
        support_email: business?.support_email || '',
        support_phone: business?.support_phone || '',
        address: business?.address || '',
        settlement_method: business?.settlement_method || 'bank',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('business.update'));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show immediate preview
        const objectUrl = URL.createObjectURL(file);
        setLogoPreview(objectUrl);

        // Upload to server immediately
        router.post(
            route('business.logo.update'),
            {
                logo: file,
            },
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    // Clear the file input so they can upload the same file again if needed
                    if (fileInputRef.current) fileInputRef.current.value = '';

                    // Cleanup the object URL to prevent memory leaks
                    URL.revokeObjectURL(objectUrl);
                },
                onError: () => {
                    // Revert to original logo if upload fails
                    setLogoPreview(business?.logo_url || null);

                    // Cleanup the failed preview object URL
                    URL.revokeObjectURL(objectUrl);
                },
            },
        );
    };

    return (
        <div className="space-y-10">
            {/* LOGO SECTION */}
            <div className="space-y-6">
                <HeadingSmall title="Brand Identity" description="Update your company logo." />

                <div className="flex items-center gap-6">
                    <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Business Logo" className="h-full w-full object-contain p-2" />
                        ) : (
                            <Building2 className="text-muted-foreground h-8 w-8 opacity-50" />
                        )}
                    </div>

                    <div>
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" />
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload New Logo
                        </Button>
                        <p className="text-muted-foreground mt-2 text-xs">Recommended: Square image, max 2MB (PNG, JPG, SVG).</p>
                    </div>
                </div>
            </div>

            <hr className="border-border" />

            {/* DETAILS SECTION */}
            <div className="space-y-6">
                <HeadingSmall title="Company Details" description="Information displayed to your customers on receipts and support pages." />

                <form onSubmit={submitProfile} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g. Spur Connect"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="support_email">Support Email</Label>
                            <Input
                                id="support_email"
                                type="email"
                                value={data.support_email}
                                onChange={(e) => setData('support_email', e.target.value)}
                                placeholder="support@example.com"
                            />
                            <InputError message={errors.support_email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="support_phone">Support Phone</Label>
                            <Input
                                id="support_phone"
                                type="tel"
                                value={data.support_phone}
                                onChange={(e) => setData('support_phone', e.target.value)}
                                placeholder="e.g. 08031234567"
                            />
                            <InputError message={errors.support_phone} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Textarea
                            id="address"
                            rows={3}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Enter your physical or registered business address"
                        />
                        <InputError message={errors.address} />
                    </div>

                    {/* How do you want to get your earnings? bank or wallet */}
                    <div className="grid gap-2">
                        <Label htmlFor="payout_method">Settlement Method</Label>
                        <Select
                            value={data.settlement_method}
                            onValueChange={(value) => setData('settlement_method', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a settlement method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bank">To Bank</SelectItem>
                                <SelectItem value="wallet">To payout balance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save Changes</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved successfully.</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </div>
    );
}
