import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, Layers, Lightbulb, Network, Save, Smartphone, Wifi } from 'lucide-react';
import React from 'react';

export default function ServiceControl({ providers, services, networkTypes, networks }: any) {
    // Initialize state dynamically based on database rows
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        services: services.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.provider_id?.toString() || 'none' }), {}),
        networkTypes: networkTypes.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.provider_id?.toString() || 'none' }), {}),
        networks: networks.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.provider_id?.toString() || 'none' }), {}),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('service-controls.bulk-update'));
    };

    // Group services by type
    const groupedServices = {
        airtime: networkTypes.filter((s: any) => s.type === 'airtime'),
        data: networkTypes.filter((s: any) => s.type === 'data'),
        cable: services.filter((s: any) => s.type === 'cable'),
        electricity: services.filter((s: any) => s.type === 'electricity'),
        others: services.filter((s: any) => !['cable', 'electricity'].includes(s.type)),
    };

    // Reusable dropdown for assigning providers
    const RouteSelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full bg-background border-input text-foreground focus:ring-ring">
                <SelectValue placeholder="Select primary provider" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none">System Default (Failover)</SelectItem>
                {providers.map((provider: any) => (
                    <SelectItem key={provider.id} value={provider.id.toString()}>
                        {provider.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    return (
        <AppLayout>
            <Head title="Service Control" />
            <div className="flex min-h-screen flex-1 flex-col bg-background font-sans text-foreground">
                
                {/* Sticky Header */}
                <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-border bg-background/80 px-8 py-5 backdrop-blur-md">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Service Routing Control</h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Direct specific services to preferred upstream providers.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mr-2">
                                <CheckCircle className="h-4 w-4" /> Saved
                            </span>
                        )}
                        <Button 
                            onClick={handleSubmit} 
                            disabled={processing}
                            className="gap-2 shadow-lg shadow-primary/20"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </div>
                </header>

                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-8">
                    <Tabs defaultValue="airtime" className="w-full">
                        
                        <TabsList className="mb-8 flex w-full justify-start overflow-x-auto bg-muted/50 p-1 border border-border h-auto">
                            <TabsTrigger value="airtime" className="gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                <Smartphone className="h-4 w-4" /> Airtime
                            </TabsTrigger>
                            <TabsTrigger value="data" className="gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                <Wifi className="h-4 w-4" /> Data
                            </TabsTrigger>
                            <TabsTrigger value="cable" className="gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                <Network className="h-4 w-4" /> Cable TV
                            </TabsTrigger>
                            <TabsTrigger value="electricity" className="gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                <Lightbulb className="h-4 w-4" /> Electricity
                            </TabsTrigger>
                            <TabsTrigger value="others" className="gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                <Layers className="h-4 w-4" /> Other Services
                            </TabsTrigger>
                        </TabsList>

                        {/* Airtime Tab */}
                        <TabsContent value="airtime" className="mt-0 outline-none">
                            {groupedServices.airtime.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {groupedServices.airtime.map((service: any) => (
                                        <Card key={service.id} className="border-border bg-card shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-md text-foreground">{service.name}</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">{service.typeable?.name || 'Airtime'}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <RouteSelect
                                                    value={data.networkTypes[service.id]}
                                                    onChange={(val) => setData('networkTypes', { ...data.networkTypes, [service.id]: val })}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-muted-foreground">
                                    No airtime services configured.
                                </div>
                            )}
                        </TabsContent>

                        {/* Data Tab */}
                        <TabsContent value="data" className="mt-0 outline-none">
                            {groupedServices.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {groupedServices.data.map((service: any) => (
                                        <Card key={service.id} className="border-border bg-card shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-md text-foreground">{service.name}</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">{service.typeable?.name || 'Data'}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <RouteSelect
                                                    value={data.networkTypes[service.id]}
                                                    onChange={(val) => setData('networkTypes', { ...data.networkTypes, [service.id]: val })}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-muted-foreground">
                                    No data services configured.
                                </div>
                            )}
                        </TabsContent>

                        {/* Cable Tab */}
                        <TabsContent value="cable" className="mt-0 outline-none">
                            {groupedServices.cable.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {groupedServices.cable.map((service: any) => (
                                        <Card key={service.id} className="border-border bg-card shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-md text-foreground">{service.name}</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">{service.type || 'Cable TV'}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <RouteSelect
                                                    value={data.services[service.id]}
                                                    onChange={(val) => setData('services', { ...data.services, [service.id]: val })}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-muted-foreground">
                                    No cable services configured.
                                </div>
                            )}
                        </TabsContent>

                        {/* Electricity Tab */}
                        <TabsContent value="electricity" className="mt-0 outline-none">
                            {groupedServices.electricity.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {groupedServices.electricity.map((service: any) => (
                                        <Card key={service.id} className="border-border bg-card shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-md text-foreground">{service.name}</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">{service.type || 'Electricity'}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <RouteSelect
                                                    value={data.services[service.id]}
                                                    onChange={(val) => setData('services', { ...data.services, [service.id]: val })}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-muted-foreground">
                                    No electricity services configured.
                                </div>
                            )}
                        </TabsContent>

                        {/* Others Tab */}
                        <TabsContent value="others" className="mt-0 outline-none">
                            {groupedServices.others.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {groupedServices.others.map((service: any) => (
                                        <Card key={service.id} className="border-border bg-card shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-md text-foreground">{service.name}</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">{service.type || 'Other Service'}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <RouteSelect
                                                    value={data.services[service.id]}
                                                    onChange={(val) => setData('services', { ...data.services, [service.id]: val })}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-muted-foreground">
                                    No other services configured.
                                </div>
                            )}
                        </TabsContent>
                        
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}