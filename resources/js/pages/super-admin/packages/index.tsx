import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    billing_cycle: string;
    is_active: boolean;
    businesses_count: number;
}

export default function PackageIndex({ packages }: { packages: Package[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this package?')) {
            router.delete(route('super-admin.packages.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manage Packages', href: '/admin/packages' }]}>
            <Head title="Manage Packages" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <HeadingSmall title="Subscription Packages" description="Manage the plans available to your tenants." />
                    <Link href={route('super-admin.packages.create')}>
                        <Button><Plus className="h-4 w-4 mr-2" /> Add Package</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className={!pkg.is_active ? 'opacity-60 grayscale' : ''}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                    <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                                        {pkg.is_active ? 'Active' : 'Draft'}
                                    </Badge>
                                </div>
                                <CardDescription>{pkg.description}</CardDescription>
                                <div className="mt-4 text-2xl font-bold">
                                    ₦{Number(pkg.price).toLocaleString()} 
                                    <span className="text-sm font-normal text-muted-foreground">/{pkg.billing_cycle}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                                    <Users className="h-4 w-4" />
                                    <span>{pkg.businesses_count} active subscriptions</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Link href={route('super-admin.packages.edit', pkg.id)} className="flex-1">
                                    <Button variant="outline" className="w-full"><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                                </Link>
                                <Button 
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => handleDelete(pkg.id)}
                                    disabled={pkg.businesses_count > 0}
                                    title={pkg.businesses_count > 0 ? "Cannot delete plan with active users" : "Delete"}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    
                    {packages.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                            No packages found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}