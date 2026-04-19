import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Eye, MoreHorizontal, Plus, Power, PowerOff, Search } from 'lucide-react';
import { useState } from 'react';

interface Business {
    id: number;
    name: string;
    support_email: string;
    is_active: boolean;
    owner_name: string;
    owner_email: string;
    lifetime_volume: string;
    created_at: string;
}

interface Props {
    businesses: {
        data: Business[];
        links: any[];
    };
    filters: { search: string };
}

export default function BusinessesIndex({ businesses, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('super-admin.businesses.index'), { search: searchTerm }, { preserveState: true });
    };

    const toggleStatus = (id: number) => {
        if (confirm('Are you sure you want to change this business status?')) {
            router.post(route('super-admin.businesses.toggle', id), {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Tenants" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
                {/* Header & Actions */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tenant Businesses</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage all API consumers and VTU businesses on the platform.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('super-admin.businesses.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Register Tenant
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="bg-muted/20 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="text-primary h-5 w-5" />
                                Registered Businesses
                            </CardTitle>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search by name or email..."
                                    className="bg-background pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Business Details</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Lifetime Volume</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead className="pr-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {businesses.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                            No businesses found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    businesses.data.map((business) => (
                                        <TableRow key={business.id}>
                                            {/* Business Name & Email */}
                                            <TableCell className="pl-6">
                                                <div className="text-foreground font-medium">{business.name}</div>
                                                <div className="text-muted-foreground text-xs">{business.support_email}</div>
                                            </TableCell>

                                            {/* Owner Info */}
                                            <TableCell>
                                                <div className="text-sm">{business.owner_name}</div>
                                                <div className="text-muted-foreground text-xs">{business.owner_email}</div>
                                            </TableCell>

                                            {/* Volume */}
                                            <TableCell>
                                                <span className="text-sm font-semibold">₦{business.lifetime_volume}</span>
                                            </TableCell>

                                            {/* Status Badge */}
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium tracking-wider uppercase ${
                                                        business.is_active
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {business.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell className="text-muted-foreground text-sm">{business.created_at}</TableCell>

                                            {/* Actions */}
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            {/* This is where the Super Admin gets access to Tenant Transactions */}
                                                            <Link
                                                                href={route('super-admin.businesses.show', business.id)}
                                                                className="flex cursor-pointer items-center"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" /> View Dashboard & Ledger
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => toggleStatus(business.id)}
                                                            className={`focus:bg-accent cursor-pointer ${business.is_active ? 'text-rose-600 focus:text-rose-600' : 'text-emerald-600 focus:text-emerald-600'}`}
                                                        >
                                                            {business.is_active ? (
                                                                <>
                                                                    <PowerOff className="mr-2 h-4 w-4" /> Suspend Tenant
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Power className="mr-2 h-4 w-4" /> Activate Tenant
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination would go here using businesses.links */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
