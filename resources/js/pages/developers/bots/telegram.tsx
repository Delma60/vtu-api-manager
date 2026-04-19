import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface Props {
    globalBotUsername: string; // e.g. "SpurConnectBot"
    merchantCode: string; // e.g. "biz_12345"
    isActive: boolean;
    welcomeMessage: string | null;
}

export default function MerchantTelegramBot({ globalBotUsername, merchantCode, isActive, welcomeMessage }: Props) {
    const [copied, setCopied] = useState(false);

    // The deep link that routes customers to this specific merchant
    const botLink = `https://t.me/${globalBotUsername}?start=${merchantCode}`;

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        is_active: isActive,
        welcome_message: welcomeMessage || '',
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(botLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('bots.telegram.update-merchant'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Telegram Sales Channel', href: route('bots.telegram.index') }]}>
            <Head title="Telegram Sales Channel" />

            <div className=" space-y-8 p-6 py-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Telegram Sales Channel</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-300">
                        Allow your customers to buy VTU services directly from Telegram. Purchases will be credited to your business.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Shareable Link Column */}
                    <div className="space-y-6 md:col-span-1">
                        <Card className="border-none bg-indigo-600 text-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">Your Bot Link</CardTitle>
                                <CardDescription className="text-indigo-200">
                                    Share this link on your WhatsApp status, Facebook, or Instagram.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-center rounded-lg bg-indigo-900/50 p-3">
                                    {/* SVG QR Code Placeholder - In production, you can generate a real QR here */}
                                    <svg className="h-32 w-32 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 3h8v8H3zm2 2v4h4V5zM13 3h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm-4-4h2v2h-2zm0-4h2v2h-2z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs tracking-wider text-indigo-200 uppercase">Direct Link</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            value={botLink}
                                            className="border-indigo-500 bg-indigo-700/50 text-xs text-white focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleCopy}
                                    variant="secondary"
                                    className="w-full bg-white font-bold text-indigo-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
                                >
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Configuration Column */}
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bot Preferences</CardTitle>
                                <CardDescription>Customize how the bot interacts with your customers.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSave}>
                                <CardContent className="space-y-6">
                                    {/* Enable/Disable Toggle */}
                                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-semibold">Enable Telegram Bot</Label>
                                            <p className="text-sm text-slate-500">Allow customers to interact and make purchases.</p>
                                        </div>
                                        <Switch checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                                    </div>

                                    {/* Welcome Message */}
                                    <div className="space-y-3">
                                        <Label htmlFor="welcome_message">Custom Welcome Message</Label>
                                        <Textarea
                                            id="welcome_message"
                                            placeholder="e.g., Welcome to my VTU store! How can I help you today?"
                                            className="min-h-[100px] resize-none"
                                            value={data.welcome_message}
                                            onChange={(e) => setData('welcome_message', e.target.value)}
                                        />
                                        <p className="text-xs text-slate-500">
                                            This message is sent the very first time a customer clicks your bot link.
                                        </p>
                                    </div>

                                    {!data.is_active && (
                                        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                                            <AlertTitle>Bot is disabled</AlertTitle>
                                            <AlertDescription>
                                                If a customer clicks your link right now, the bot will tell them your store is currently closed.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                                <CardFooter className="flex items-center justify-between border-t border-slate-200/70 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                                    {recentlySuccessful ? (
                                        <span className="text-sm font-medium text-emerald-600">Preferences updated!</span>
                                    ) : (
                                        <span className="text-sm text-slate-500">Save changes to apply immediately.</span>
                                    )}
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Preferences'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
