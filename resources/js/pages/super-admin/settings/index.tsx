import  AppLayout  from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Settings2, Globe, ShieldAlert, PhoneCall } from 'lucide-react';

interface Props {
    settings: Record<string, string | null>;
}

export default function SystemSettingsIndex({ settings }: Props) {
    const { data, setData, post, processing } = useForm({
        site_name: settings.site_name || 'NexusVTU',
        support_email: settings.support_email || '',
        support_phone: settings.support_phone || '',
        company_address: settings.company_address || '',
        global_maintenance_mode: settings.global_maintenance_mode === '1',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="System Settings" />
            
            <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Platform Configurations</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage global platform details, support contacts, and maintenance modes.
                    </p>
                </div>

                <form onSubmit={submit}>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full sm:w-[500px] grid-cols-3">
                            <TabsTrigger value="general" className="flex items-center gap-2"><Settings2 className="h-4 w-4"/> General</TabsTrigger>
                            <TabsTrigger value="contact" className="flex items-center gap-2"><PhoneCall className="h-4 w-4"/> Contact</TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2"><ShieldAlert className="h-4 w-4"/> Security</TabsTrigger>
                        </TabsList>

                        {/* GENERAL TAB */}
                        <TabsContent value="general" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">General Platform Details</CardTitle>
                                    <CardDescription>Core identifiers used across the platform and emails.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 max-w-md">
                                        <Label htmlFor="site_name">Platform Name</Label>
                                        <Input
                                            id="site_name"
                                            value={data.site_name}
                                            onChange={(e) => setData('site_name', e.target.value)}
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* CONTACT TAB */}
                        <TabsContent value="contact" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Global Contact Information</CardTitle>
                                    <CardDescription>Displayed to tenants when they need platform support.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="support_email">Support Email</Label>
                                            <Input
                                                id="support_email"
                                                type="email"
                                                value={data.support_email}
                                                onChange={(e) => setData('support_email', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="support_phone">Support Phone</Label>
                                            <Input
                                                id="support_phone"
                                                value={data.support_phone}
                                                onChange={(e) => setData('support_phone', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company_address">Official Company Address</Label>
                                        <Input
                                            id="company_address"
                                            value={data.company_address}
                                            onChange={(e) => setData('company_address', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SECURITY / MAINTENANCE TAB */}
                        <TabsContent value="security" className="mt-6">
                            <Card className="border-rose-500/20">
                                <CardHeader>
                                    <CardTitle className="text-lg text-rose-600 dark:text-rose-400">Danger Zone</CardTitle>
                                    <CardDescription>System-wide locks and API overrides.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-rose-500/5">
                                        <div className="space-y-0.5">
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
                        <div className="mt-6 flex justify-end">
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