import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Package } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, Users } from 'lucide-react';

export default function PackageIndex({ packages }: { packages: Package[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this package?')) {
            router.delete(route('super-admin.packages.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manage Packages', href: '/admin/packages' }]}>
            <Head title="Manage Packages" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <HeadingSmall title="Subscription Packages" description="Manage the plans available to your tenants." />
                    <Link href={route('super-admin.packages.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Package
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className={!pkg.is_active ? 'opacity-60 grayscale' : ''}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                    <div className="flex items-center justify-between gap-2">
                                        <Badge className={pkg.is_active ? 'bg-primary' : 'bg-muted'}>{pkg.is_active ? 'Active' : 'Draft'}</Badge>
                                        {pkg.is_default && (
                                            <Badge className={pkg.is_default ? 'bg-blue-400' : 'bg-muted'}>
                                                {pkg.is_default ? 'Default' : 'Not Default'}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardDescription>{pkg.description}</CardDescription>
                                <div className="mt-4 text-2xl font-bold">
                                    ₦{Number(pkg.price).toLocaleString()}
                                    <span className="text-muted-foreground text-sm font-normal">/{pkg.billing_cycle}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-md p-2 text-sm">
                                    <Users className="h-4 w-4" />
                                    <span>{pkg.businesses_count} active subscriptions</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Link href={route('super-admin.packages.edit', pkg.id)} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(pkg.id)}
                                    disabled={pkg.businesses_count > 0}
                                    title={pkg.businesses_count > 0 ? 'Cannot delete plan with active users' : 'Delete'}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {packages.length === 0 && (
                        <div className="text-muted-foreground col-span-full rounded-xl border-2 border-dashed py-12 text-center">
                            No packages found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
