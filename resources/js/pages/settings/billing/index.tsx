import HeadingSmall from '@/components/heading-small';
import PackageItem from '@/components/package-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router } from '@inertiajs/react';
import { Check } from 'lucide-react';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    billing_cycle: string;
    features: string[];
}

export default function BillingSettings({ currentBusiness, packages }: { currentBusiness: any; packages: Package[] }) {
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
                            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
                                <div>
                                    <p className="font-semibold">Current Plan: {currentBusiness.package?.name || 'Unknown'}</p>
                                    <p className="text-sm opacity-80">
                                        Renews on: {new Date(currentBusiness.subscription_ends_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge variant="outline" className="bg-emerald-500/20">
                                    Active
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-2">
                        {packages.map((pkg) => {

                            return <PackageItem currentPackageId={currentBusiness.package_id} pkg={pkg} />
                            // (
                            //     <Card key={pkg.id} className={`relative flex flex-col ${isCurrent ? 'border-primary shadow-md' : ''}`}>
                            //         {isCurrent && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Current Plan</Badge>}
                            //         <CardHeader>
                            //             <CardTitle className="text-xl">{pkg.name}</CardTitle>
                            //             <CardDescription>{pkg.description}</CardDescription>
                            //             <div className="mt-4 text-3xl font-bold">
                            //                 ₦{Number(pkg.price).toLocaleString()}{' '}
                            //                 <span className="text-muted-foreground text-sm font-normal">
                            //                     /{pkg.billing_cycle === 'monthly' ? 'mo' : 'yr'}
                            //                 </span>
                            //             </div>
                            //         </CardHeader>
                            //         <CardContent className="flex-1">
                            //             <ul className="text-muted-foreground space-y-3 text-sm">
                            //                 {pkg.features?.map((feature, i) => (
                            //                     <li key={i} className="flex items-center gap-2">
                            //                         <Check className="text-primary h-4 w-4" /> {feature}
                            //                     </li>
                            //                 ))}
                            //             </ul>
                            //         </CardContent>
                            //         <CardFooter>
                            //             <Button
                            //                 className="w-full"
                            //                 variant={isCurrent ? 'outline' : 'default'}
                            //                 disabled={isCurrent}
                            //                 onClick={() => handleSubscribe(pkg.id)}
                            //             >
                            //                 {isCurrent ? 'Active' : 'Subscribe'}
                            //             </Button>
                            //         </CardFooter>
                            //     </Card>
                            // );
                        })}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
