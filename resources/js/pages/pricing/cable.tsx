import DeleteButton from '@/components/delete-button';
import { IsActiveSwitch } from '@/components/is-active-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { Edit2, Plus } from 'lucide-react';
import React from 'react';

// Define our interfaces
interface CablePlan {
    id: number;
    network_type_id: number;
    provider_id: number;
    plan_id: string;
    name: string;
    amount: string;
    is_active: boolean;
    network_type?: { name: string };
    provider?: { name: string };
}

interface CableNetwork {
    id: number;
    name: string;
    type: string;
}

export default function CablePricing() {
    const { cablePlans, cableNetworks } = usePage().props as unknown as {
        cablePlans: CablePlan[],
        cableNetworks: CableNetwork[]
    };

    return (
        <AppLayout breadcrumbs={[
            // { title: 'Pricing & Plans', href: route('pricing.index') },
            { title: 'Cable TV', href:"#" }
        ]}>
            <div className="flex flex-col gap-6 p-4 pt-0">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Cable TV Plans</h1>
                        <p className="text-sm text-muted-foreground">Manage DSTV, GOTV, and Startimes packages and providers.</p>
                    </div>
                </div>

                {/* Tabbed Interface */}
                <Tabs defaultValue="providers" className="w-full">
                    <TabsList className="mb-4 grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="providers">Cable Providers</TabsTrigger>
                        <TabsTrigger value="packages">Subscription Packages</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Subscription Packages */}
                    <TabsContent value="packages">
                        <Card>
                            <div className="flex items-center justify-between border-b p-6">
                                <div>
                                    <h3 className="text-lg font-medium leading-none">Subscription Packages</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Manage pricing and API mapping for specific bouquets.</p>
                                </div>
                                <Button asChild>
                                    <Link href={route('cable-plans.create')}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Package
                                    </Link>
                                </Button>
                            </div>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">Provider</TableHead>
                                            <TableHead>Package Name</TableHead>
                                            <TableHead>API Plan ID</TableHead>
                                            <TableHead>Price (₦)</TableHead>
                                            <TableHead>Gateway</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cablePlans.length > 0 ? (
                                            cablePlans.map((plan) => (
                                                <TableRow key={plan.id}>
                                                    <TableCell className="font-medium pl-6">{plan.network_type?.name}</TableCell>
                                                    <TableCell>{plan.name}</TableCell>
                                                    <TableCell>
                                                        <span className="rounded bg-slate-800 text-slate-300 px-2 py-1 font-mono text-xs">
                                                            {plan.plan_id}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-emerald-400">
                                                        ₦{parseFloat(plan.amount).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{plan.provider?.name || 'Default'}</TableCell>
                                                    <TableCell>
                                                        <IsActiveSwitch
                                                            isActive={plan.is_active}
                                                            toggleUrl={route('cable-plans.toggle-status', plan.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" asChild>
                                                                <Link href={route('cable-plans.edit', plan.id)}>
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <DeleteButton
                                                                route={route('cable-plans.destroy', plan.id)}
                                                                resourceName="Cable Package"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                                    No cable packages found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab 2: Cable Providers */}
                    <TabsContent value="providers">
                        <Card>
                            <div className="flex items-center justify-between border-b p-6">
                                <div>
                                    <h3 className="text-lg font-medium leading-none">Cable Providers</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Manage underlying decoders/providers.</p>
                                </div>
                                <Button asChild>
                                    <Link href={route('network-types.create')}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Provider
                                    </Link>
                                </Button>
                            </div>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">Provider Name</TableHead>
                                            <TableHead className="text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cableNetworks.length > 0 ? (
                                            cableNetworks.map((network) => (
                                                <TableRow key={network.id}>
                                                    <TableCell className="font-medium pl-6">{network.name}</TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('network-types.edit', network.id)}>
                                                                <Edit2 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-24 text-center text-slate-500">
                                                    No cable providers found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </AppLayout>
    );
}
