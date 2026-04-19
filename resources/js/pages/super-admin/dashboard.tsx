import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowUpRight, Building2, CreditCard, Cpu, ServerCrash, Bot } from 'lucide-react';
import { Link, Head } from '@inertiajs/react';
import { SharedData, Provider } from '@/types';

interface DashboardProps extends SharedData {
    metrics: {
        totalPlatformVolume: string;
        activeBusinesses: number;
        totalSimhosts: number;
        activeBots: number;
    };
    simhostHealth: Provider[];
    topBusinesses: Array<{
        id: number;
        name: string;
        volume: string;
        status: 'active' | 'suspended';
    }>;
    systemAlerts: Array<{
        id: number;
        message: string;
        type: 'warning' | 'critical' | 'info';
        time: string;
    }>;
}

export default function SuperAdminDashboard({ metrics, simhostHealth, topBusinesses, systemAlerts }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Platform Overview" />
            
            <div className="flex flex-col gap-6 p-6">
                {/* 1. Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Dele</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Platform Overview & Infrastructure Pulse.
                        </p>
                    </div>
                </div>

                {/* 2. Top-Level Platform Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Platform Volume (24h)</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦{metrics.totalPlatformVolume}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                Aggregate across all tenants
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.activeBusinesses}</div>
                            <p className="text-xs text-muted-foreground mt-1 text-emerald-500">
                                Total active tenants
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Connected Simhosts</CardTitle>
                            <Cpu className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.totalSimhosts}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Global routing infrastructure
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
                            <Bot className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.activeBots}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Running system controllers
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Main Content Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    
                    {/* Left Column: Tenant Aggregation (Spans 4 columns) */}
                    <Card className="lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Top Performing Businesses</CardTitle>
                                <CardDescription>Aggregated 24h volume by tenant.</CardDescription>
                            </div>
                            <Link href="#" className="text-sm text-primary hover:underline">View All</Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topBusinesses.map((business) => (
                                    <div key={business.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/50 transition-colors hover:bg-accent/50 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Building2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-semibold">{business.name}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full w-fit font-medium uppercase tracking-wider ${
                                                    business.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                }`}>
                                                    {business.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-bold">₦{business.volume}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Simhost Health & Alerts (Spans 3 columns) */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Simhost Health */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Cpu className="h-5 w-5" />
                                    Simhost Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {simhostHealth.map((host) => (
                                        <div key={host.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex h-3 w-3">
                                                    {host.is_active && host.success_rate_7d > 80 ? (
                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    ) : null}
                                                    <span className={`relative inline-flex h-3 w-3 rounded-full ${
                                                        !host.is_active ? 'bg-slate-400' :
                                                        host.success_rate_7d > 80 ? 'bg-emerald-500' : 
                                                        host.success_rate_7d > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`}></span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{host.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Bal: ₦{host.cached_balance}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{host.success_rate_7d}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Alerts */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <ServerCrash className="h-4 w-4" />
                                    System Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {systemAlerts.map((alert) => (
                                        <div key={alert.id} className="flex items-start gap-2 text-sm">
                                            <span className={`mt-0.5 shrink-0 h-2 w-2 rounded-full ${
                                                alert.type === 'critical' ? 'bg-rose-500' : 
                                                alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                            }`} />
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground">{alert.message}</span>
                                                <span className="text-[10px] text-muted-foreground/60">{alert.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}