import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { MessageCircle, Plus, Send, ShieldAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Bot {
    id: number;
    name: string;
    platform: 'telegram' | 'whatsapp';
    credentials: any;
    is_active: boolean;
    created_at: string;
}

export default function SystemBotsIndex({ bots }: { bots: Bot[] }) {
    const [activeTab, setActiveTab] = useState<'telegram' | 'whatsapp'>('telegram');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        platform: 'telegram',
        credentials: {
            bot_username: '',
            bot_token: '',
            phone_number_id: '',
            business_account_id: '',
            access_token: '',
            webhook_verify_token: '',
        },
    });

    const telegramBots = bots.filter((b) => b.platform === 'telegram');
    const whatsappBots = bots.filter((b) => b.platform === 'whatsapp');

    const openCreateModal = () => {
        clearErrors();
        reset();
        setData('platform', activeTab);
        setIsModalOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('super-admin.bots.store'), {
            onSuccess: () => setIsModalOpen(false),
        });
    };

    const toggleStatus = (id: number) => {
        router.post(route('super-admin.bots.toggle', id), {}, { preserveScroll: true });
    };

    const deleteBot = (id: number) => {
        if (confirm('Are you sure you want to delete this bot configuration? This will break integrations using it.')) {
            router.delete(route('admin.bots.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title="System Bots" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Bots</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Configure global Telegram and WhatsApp bots for tenant usage and system alerts.
                        </p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add {activeTab === 'telegram' ? 'Telegram' : 'WhatsApp'} Bot
                    </Button>
                </div>

                <Tabs defaultValue="telegram" onValueChange={(val) => setActiveTab(val as 'telegram' | 'whatsapp')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
                        <TabsTrigger value="telegram" className="flex items-center gap-2">
                            <Send className="h-4 w-4" /> Telegram
                        </TabsTrigger>
                        <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                        </TabsTrigger>
                    </TabsList>

                    {/* TELEGRAM CONTENT */}
                    <TabsContent value="telegram" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {telegramBots.length === 0 ? (
                                <Card className="bg-muted/20 col-span-full border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                        <Send className="text-muted-foreground mb-4 h-10 w-10 opacity-50" />
                                        <p className="text-lg font-semibold">No Telegram Bots Configured</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                telegramBots.map((bot) => (
                                    <Card key={bot.id} className={!bot.is_active ? 'opacity-75' : ''}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-lg text-[#0088cc]">
                                                    <Send className="h-5 w-5" /> {bot.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1 font-mono">@{bot.credentials.bot_username}</CardDescription>
                                            </div>
                                            <Switch checked={bot.is_active} onCheckedChange={() => toggleStatus(bot.id)} />
                                        </CardHeader>
                                        <CardContent className="pb-4">
                                            <div className="bg-muted/50 text-muted-foreground rounded p-2 font-mono text-xs break-all">
                                                Token: {bot.credentials.bot_token.substring(0, 15)}...
                                            </div>
                                        </CardContent>
                                        <div className="bg-muted/10 flex items-center justify-between border-t px-6 py-3">
                                            <span className="text-muted-foreground text-xs">Added {bot.created_at}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteBot(bot.id)}
                                                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* WHATSAPP CONTENT */}
                    <TabsContent value="whatsapp" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {whatsappBots.length === 0 ? (
                                <Card className="bg-muted/20 col-span-full border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                        <MessageCircle className="text-muted-foreground mb-4 h-10 w-10 opacity-50" />
                                        <p className="text-lg font-semibold">No WhatsApp Bots Configured</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                whatsappBots.map((bot) => (
                                    <Card key={bot.id} className={!bot.is_active ? 'opacity-75' : ''}>
                                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-lg text-[#25D366]">
                                                    <MessageCircle className="h-5 w-5" /> {bot.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1 flex items-center gap-1">
                                                    <ShieldAlert className="h-3 w-3" /> Meta Verified
                                                </CardDescription>
                                            </div>
                                            <Switch checked={bot.is_active} onCheckedChange={() => toggleStatus(bot.id)} />
                                        </CardHeader>
                                        <CardContent className="space-y-2 pb-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="text-muted-foreground">Phone ID:</span>
                                                <span className="bg-muted/50 rounded p-1 font-mono">{bot.credentials.phone_number_id}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="text-muted-foreground">Business ID:</span>
                                                <span className="bg-muted/50 rounded p-1 font-mono">{bot.credentials.business_account_id}</span>
                                            </div>
                                        </CardContent>
                                        <div className="bg-muted/10 flex items-center justify-between border-t px-6 py-3">
                                            <span className="text-muted-foreground text-xs">Added {bot.created_at}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteBot(bot.id)}
                                                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* DYNAMIC CREATION MODAL */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={submitForm}>
                            <DialogHeader>
                                <DialogTitle>Configure {activeTab === 'telegram' ? 'Telegram' : 'WhatsApp'} Bot</DialogTitle>
                                <DialogDescription>
                                    Enter the API credentials provided by {activeTab === 'telegram' ? 'BotFather' : 'Meta Developer Dashboard'}.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Internal Display Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Primary Support Bot"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                                </div>

                                {activeTab === 'telegram' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="bot_username">Bot Username</Label>
                                            <Input
                                                id="bot_username"
                                                placeholder="e.g., my_vtu_bot"
                                                value={data.credentials.bot_username}
                                                onChange={(e) => setData('credentials', { ...data.credentials, bot_username: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bot_token">Bot HTTP API Token</Label>
                                            <Input
                                                id="bot_token"
                                                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz..."
                                                value={data.credentials.bot_token}
                                                onChange={(e) => setData('credentials', { ...data.credentials, bot_token: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'whatsapp' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone_number_id">Phone Number ID</Label>
                                                <Input
                                                    id="phone_number_id"
                                                    value={data.credentials.phone_number_id}
                                                    onChange={(e) => setData('credentials', { ...data.credentials, phone_number_id: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="business_account_id">WhatsApp Biz ID</Label>
                                                <Input
                                                    id="business_account_id"
                                                    value={data.credentials.business_account_id}
                                                    onChange={(e) =>
                                                        setData('credentials', { ...data.credentials, business_account_id: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="access_token">Permanent Access Token</Label>
                                            <Input
                                                id="access_token"
                                                type="password"
                                                value={data.credentials.access_token}
                                                onChange={(e) => setData('credentials', { ...data.credentials, access_token: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="webhook_verify_token">Webhook Verify Token (Custom)</Label>
                                            <Input
                                                id="webhook_verify_token"
                                                placeholder="e.g., my_secure_verify_token"
                                                value={data.credentials.webhook_verify_token}
                                                onChange={(e) =>
                                                    setData('credentials', { ...data.credentials, webhook_verify_token: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Save Bot
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
