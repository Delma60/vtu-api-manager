import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notification settings', href: '/settings/notifications' },
];

export default function Notifications({ preferences }: { preferences: any }) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        preferences: {
            email_low_balance: preferences.email_low_balance ?? true,
            low_balance_threshold: preferences.low_balance_threshold ?? 5000,
            email_failed_transactions: preferences.email_failed_transactions ?? true,
            email_webhook_failures: preferences.email_webhook_failures ?? true,
            marketing_updates: preferences.marketing_updates ?? false,
        }
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('notifications.update'));
    };

    // Helper to deeply update preferences state
    const updatePref = (key: keyof typeof data.preferences, value: any) => {
        setData('preferences', { ...data.preferences, [key]: value });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification settings" />

            <SettingsLayout>
                <div className="space-y-10">
                    <form onSubmit={submitForm} className="space-y-8">
                        
                        {/* Transaction & Wallet Alerts */}
                        <div className="space-y-6">
                            <HeadingSmall title="Operational Alerts" description="Manage alerts regarding your wallet and VTU transactions." />
                            
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Failed Transactions</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive an email when a VTU transaction fails on the provider's end.
                                    </p>
                                </div>
                                <Switch
                                    checked={data.preferences.email_failed_transactions}
                                    onCheckedChange={(val) => updatePref('email_failed_transactions', val)}
                                />
                            </div>

                            <div className="flex flex-col space-y-4 rounded-lg border p-4">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Low Wallet Balance</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive an alert when your main wallet drops below a certain amount.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.preferences.email_low_balance}
                                        onCheckedChange={(val) => updatePref('email_low_balance', val)}
                                    />
                                </div>
                                
                                {data.preferences.email_low_balance && (
                                    <div className="pt-2 pl-1 flex items-center gap-4">
                                        <Label htmlFor="threshold" className="text-sm text-muted-foreground">Alert me below (₦):</Label>
                                        <Input 
                                            id="threshold" 
                                            type="number" 
                                            className="w-32 h-8" 
                                            min="0"
                                            value={data.preferences.low_balance_threshold}
                                            onChange={(e) => updatePref('low_balance_threshold', Number(e.target.value))}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Developer Alerts */}
                        <div className="space-y-6">
                            <HeadingSmall title="Developer Alerts" description="Get notified about API and Webhook issues." />
                            
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Webhook Failures</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive an alert if your server fails to respond (HTTP 500) to our webhooks.
                                    </p>
                                </div>
                                <Switch
                                    checked={data.preferences.email_webhook_failures}
                                    onCheckedChange={(val) => updatePref('email_webhook_failures', val)}
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-4 pt-4 border-t">
                            <Button disabled={processing}>Save Preferences</Button>
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
            </SettingsLayout>
        </AppLayout>
    );
}