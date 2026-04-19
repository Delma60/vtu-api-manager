import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Activity, Building2, CreditCard, Users } from 'lucide-react';
import { Head } from '@inertiajs/react';

export default function SuperAdminDashboard({ stats }: any) {
    return (
        <AppLayout>
            <Head title="Super Admin Dashboard" />
            
            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2 mb-4">
                    <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_businesses}</div>
                            <p className="text-xs text-muted-foreground">Active tenants on the platform</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">Registered accounts globally</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_transactions}</div>
                            <p className="text-xs text-muted-foreground">Across all businesses</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Platform Volume</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦{stats.total_revenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total successful transaction value</p>
                        </CardContent>
                    </Card>
                </div>
                
                {/* You can add global tables here like "Recent Businesses Created" or "Platform Error Logs" */}
            </div>
        </AppLayout>
    );
}