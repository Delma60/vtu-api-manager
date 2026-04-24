import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    billing_cycle: string;
    features: string[];
}

export default function BillingSettings({ currentBusiness, packages }: { currentBusiness: any, packages: Package[] }) {
    
    const handleSubscribe = (packageId: number) => {
        router.post(route('billing.subscribe'), { package_id: packageId });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Billing & Packages', href: '/settings/billing' }]}>
            <Head title="Billing & Packages" />

            <SettingsLayout>
                <div className="space-y-10">
                    <div className="space-y-2">
                        <HeadingSmall title="Subscription Packages" description="Choose a plan that fits your business needs." />
                        
                        {currentBusiness.subscription_status === 'active' && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">Current Plan: {currentBusiness.package?.name || 'Unknown'}</p>
                                    <p className="text-sm opacity-80">Renews on: {new Date(currentBusiness.subscription_ends_at).toLocaleDateString()}</p>
                                </div>
                                <Badge variant="outline" className="bg-emerald-500/20">Active</Badge>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6">
                        {packages.map((pkg) => {
                            const isCurrent = currentBusiness.package_id === pkg.id;

                            return (
                                <Card key={pkg.id} className={`flex flex-col relative ${isCurrent ? 'border-primary shadow-md' : ''}`}>
                                    {isCurrent && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Current Plan</Badge>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                        <CardDescription>{pkg.description}</CardDescription>
                                        <div className="mt-4 text-3xl font-bold">
                                            ₦{Number(pkg.price).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/{pkg.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3 text-sm text-muted-foreground">
                                            {pkg.features?.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" /> {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button 
                                            className="w-full" 
                                            variant={isCurrent ? "outline" : "default"}
                                            disabled={isCurrent}
                                            onClick={() => handleSubscribe(pkg.id)}
                                        >
                                            {isCurrent ? 'Active' : 'Subscribe'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}