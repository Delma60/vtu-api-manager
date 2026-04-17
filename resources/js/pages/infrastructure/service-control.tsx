import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Layers, Lightbulb, MoreHorizontal, Network, Smartphone, Wifi } from 'lucide-react';
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
        put(route('service-controls.update', ));
    };

    // Group services by type
    const groupedServices = {
        airtime: networkTypes.filter((s: any) => s.type?.toLowerCase() === 'airtime' || s.type?.toLowerCase() === 'air-time'),
        data: networkTypes.filter((s: any) => s.type?.toLowerCase() === 'data'),
        utility: services.filter((s: any) => s.type?.toLowerCase() === 'utility' || s.type?.toLowerCase() === 'utilities'),
        others: services.filter((s: any) => {
            const typeLC = s.type?.toLowerCase() || '';
            return typeLC !== 'airtime' && typeLC !== 'air-time' && typeLC !== 'data' && typeLC !== 'utility' && typeLC !== 'utilities';
        }),
    };

    // Helper component to render the select dropdowns
    const RouteSelect = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full border-slate-700 bg-slate-950 text-white">
                <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent className="border-slate-800 bg-slate-900 text-white">
                <SelectItem value="none" className="text-slate-500 italic">
                    Auto / Inherit
                </SelectItem>
                {providers.map((p: any) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    return (
        <AppLayout>
            <Head title="Service Control (Routing)" />
            <div className="flex min-h-screen flex-1 flex-col space-y-6 p-6">
                <header className="mb-4 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Service Control Engine</h1>
                        <p className="mt-1 text-sm text-slate-400">Map your specific services, data types, and brands to your API providers.</p>
                    </div>
                    <Button onClick={handleSubmit} disabled={processing} className="bg-indigo-600 hover:bg-indigo-500">
                        {processing ? 'Saving...' : 'Save All Routing Rules'}
                    </Button>
                </header>

                {recentlySuccessful && (
                    <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                        Routing engine configurations synced successfully.
                    </div>
                )}

                <Tabs defaultValue="airtime" className="w-full">
                    <TabsList className="mb-4 border border-slate-800 bg-slate-900">
                        <TabsTrigger value="airtime" className="data-[state=active]:bg-slate-800">
                            <Smartphone className="mr-2 h-4 w-4" /> Airtime
                        </TabsTrigger>
                        <TabsTrigger value="data" className="data-[state=active]:bg-slate-800">
                            <Wifi className="mr-2 h-4 w-4" /> Data
                        </TabsTrigger>
                        <TabsTrigger value="utility" className="data-[state=active]:bg-slate-800">
                            <Lightbulb className="mr-2 h-4 w-4" /> Utility
                        </TabsTrigger>
                        <TabsTrigger value="others" className="data-[state=active]:bg-slate-800">
                            <MoreHorizontal className="mr-2 h-4 w-4" /> Others
                        </TabsTrigger>
                        <TabsTrigger value="data-types" className="data-[state=active]:bg-slate-800">
                            <Network className="mr-2 h-4 w-4" /> Data Types (SME/CG)
                        </TabsTrigger>
                        <TabsTrigger value="networks" className="data-[state=active]:bg-slate-800">
                            <Layers className="mr-2 h-4 w-4" /> Brands
                        </TabsTrigger>
                    </TabsList>

                    {/* AIRTIME TAB */}
                    <TabsContent value="airtime">
                        {/* {JSON.stringify(networkTypes)} */}
                        {groupedServices.airtime.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {groupedServices.airtime.map((service: any) => (
                                    <Card key={service.id} className="border-slate-800 bg-slate-900">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-md text-white">{service.typeable.name} {service.name}</CardTitle>
                                            <CardDescription className="text-xs">Airtime Service</CardDescription>
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
                            <div className="rounded border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
                                No airtime services configured.
                            </div>
                        )}
                    </TabsContent>

                    {/* DATA TAB */}
                    <TabsContent value="data">
                        {groupedServices.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {groupedServices.data.map((service: any) => (
                                    <Card key={service.id} className="border-slate-800 bg-slate-900">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-md text-white">{service.typeable.name} {service.name}</CardTitle>
                                            <CardDescription className="text-xs">Data Service</CardDescription>
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
                            <div className="rounded border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
                                No data services configured.
                            </div>
                        )}
                    </TabsContent>

                    {/* UTILITY TAB */}
                    <TabsContent value="utility">
                        {groupedServices.utility.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {groupedServices.utility.map((service: any) => (
                                    <Card key={service.id} className="border-slate-800 bg-slate-900">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-md text-white">{service.name}</CardTitle>
                                            <CardDescription className="text-xs">Utility Service</CardDescription>
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
                            <div className="rounded border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
                                No utility services configured.
                            </div>
                        )}
                    </TabsContent>

                    {/* OTHERS TAB */}
                    <TabsContent value="others">
                        {groupedServices.others.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {groupedServices.others.map((service: any) => (
                                    <Card key={service.id} className="border-slate-800 bg-slate-900">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-md text-white">{service.name}</CardTitle>
                                            <CardDescription className="text-xs">{service.type || 'Other Service'}</CardDescription>
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
                            <div className="rounded border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
                                No other services configured.
                            </div>
                        )}
                    </TabsContent>

                    {/* DATA TYPES TAB (SME, Gifting, CG) */}
                    <TabsContent value="data-types">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {networkTypes.map((type: any) => (
                                <Card key={type.id} className="border-slate-800 bg-slate-900">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-md text-white">{type.name.toUpperCase()}</CardTitle>
                                        <CardDescription className="text-xs">Data Routing</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RouteSelect
                                            value={data.networkTypes[type.id]}
                                            onChange={(val) => setData('networkTypes', { ...data.networkTypes, [type.id]: val })}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* NETWORKS TAB (DSTV, GOTV, MTN, Airtel) */}
                    <TabsContent value="networks">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {networks.map((network: any) => (
                                <Card key={network.id} className="border-slate-800 bg-slate-900">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-md text-white">{network.name}</CardTitle>
                                        <CardDescription className="text-xs">Brand Routing</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RouteSelect
                                            value={data.networks[network.id]}
                                            onChange={(val) => setData('networks', { ...data.networks, [network.id]: val })}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
