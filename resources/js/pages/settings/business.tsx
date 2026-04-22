import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Building2, UploadCloud } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Business settings',
        href: '/settings/business',
    },
];

export default function BusinessProfile() {
    const { auth } = usePage<SharedData>().props;
    const business = auth.user.business; // Assuming this is passed via HandleInertiaRequests middleware
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(business?.logo_url || null);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: business?.name || '',
        support_email: business?.support_email || '',
        support_phone: business?.support_phone || '',
        address: business?.address || '',
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
        router.post(route('business.logo.update'), {
            _method: 'post',
            logo: file,
        }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Clear the file input so they can upload the same file again if needed
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business settings" />

            <SettingsLayout>
                <div className="space-y-10">
                    
                    {/* LOGO SECTION */}
                    <div className="space-y-6">
                        <HeadingSmall title="Brand Identity" description="Update your company logo." />
                        
                        <div className="flex items-center gap-6">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed bg-muted overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Business Logo" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <Building2 className="h-8 w-8 text-muted-foreground opacity-50" />
                                )}
                            </div>
                            
                            <div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    onChange={handleLogoUpload} 
                                    accept="image/*"
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Upload New Logo
                                </Button>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Recommended: Square image, max 2MB (PNG, JPG, SVG).
                                </p>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </SettingsLayout>
        </AppLayout>
    );
}