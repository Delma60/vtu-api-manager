import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

// Define the available services the bot can sell
const AVAILABLE_SERVICES = [
    { id: 'airtime', label: 'Airtime Recharge' },
    { id: 'data', label: 'Data Bundles' },
    { id: 'cable', label: 'Cable TV' },
    { id: 'electricity', label: 'Electricity Bills' },
];

interface Props {
    business: {
        id: number;
        name: string;
        whatsapp_bot_username?: string;
        bot_code: string;
        whatsapp_welcome_message?: string;
        whatsapp_allowed_services?: string[];
    };
    isActive: boolean;
    totalSalesAmount?: number;
    totalSalesCount?: number;
}

export default function MerchantWhatsAppBot({ business, isActive, totalSalesAmount = 0, totalSalesCount = 0 }: Props) {
    const [copied, setCopied] = useState(false);

    // For WhatsApp, the "link" would be their business WhatsApp number
    // But since this is a bot, it might be a shareable link or just instructions
    const whatsappInstructions = `Send "Menu" to ${business.whatsapp_bot_username || 'our WhatsApp number'} to start using our VTU services!`;

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        whatsapp_welcome_message: business.whatsapp_welcome_message || '',
        allowed_services: business.whatsapp_allowed_services ?? ['airtime', 'data', 'cable', 'electricity'],
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(whatsappInstructions);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('bots.whatsapp.update'), {
            preserveScroll: true,
        });
    };

    const handleServiceToggle = (serviceId: string, checked: boolean) => {
        if (checked) {
            setData('allowed_services', [...data.allowed_services, serviceId]);
        } else {
            setData(
                'allowed_services',
                data.allowed_services.filter((id) => id !== serviceId),
            );
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'WhatsApp Sales Channel', href: route('bots.whatsapp.edit') }]}>
            <Head title="WhatsApp Sales Channel" />

            <div className="space-y-8 p-6 py-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">WhatsApp Sales Channel</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-300">
                        Allow your customers to buy VTU services directly from WhatsApp. Purchases will be credited to your business.
                    </p>
                </div>

                {recentlySuccessful && (
                    <Alert>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>WhatsApp bot settings updated successfully.</AlertDescription>
                    </Alert>
                )}

                {!isActive && (
                    <Alert>
                        <AlertTitle>WhatsApp Bot Not Configured</AlertTitle>
                        <AlertDescription>
                            Your WhatsApp bot is not yet configured. Please contact support to enable WhatsApp integration for your business.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Shareable Instructions & Stats Column */}
                    <div className="space-y-6 md:col-span-1">
                        <Card className="border-none bg-green-600 text-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">Share Instructions</CardTitle>
                                <CardDescription className="text-green-200">
                                    Tell your customers how to start using your WhatsApp bot.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-center rounded-lg bg-green-900/50 p-3">
                                    {/* WhatsApp Icon */}
                                    <svg className="h-32 w-32 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-green-200">{whatsappInstructions}</p>
                                    <Button
                                        onClick={handleCopy}
                                        variant="secondary"
                                        className="w-full bg-white/10 text-white hover:bg-white/20"
                                        disabled={!isActive}
                                    >
                                        {copied ? 'Copied!' : 'Copy Instructions'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Sales Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Total Sales</span>
                                    <span className="font-semibold">₦{totalSalesAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Transactions</span>
                                    <span className="font-semibold">{totalSalesCount}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Settings Column */}
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bot Settings</CardTitle>
                                <CardDescription>Customize your WhatsApp bot's behavior and available services.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="welcome_message">Welcome Message</Label>
                                        <Textarea
                                            id="welcome_message"
                                            rows={3}
                                            value={data.whatsapp_welcome_message}
                                            onChange={(e) => setData('whatsapp_welcome_message', e.target.value)}
                                            placeholder="Welcome to our VTU service! How can we help you today?"
                                            disabled={!isActive}
                                        />
                                        <p className="text-muted-foreground text-xs">This message will be sent when users first contact your bot.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Allowed Services</Label>
                                        <p className="text-muted-foreground text-sm">
                                            Choose which services customers can purchase through your WhatsApp bot.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {AVAILABLE_SERVICES.map((service) => (
                                                <div key={service.id} className="flex items-center space-x-2">
                                                    <Switch
                                                        id={`service-${service.id}`}
                                                        checked={data.allowed_services.includes(service.id)}
                                                        onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                                                        disabled={!isActive}
                                                    />
                                                    <Label htmlFor={`service-${service.id}`} className="text-sm">
                                                        {service.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={processing || !isActive}>
                                        {processing ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
