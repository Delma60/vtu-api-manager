// resources/js/pages/customers/index.tsx
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Filter, Mail, MoreVertical, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';

// TypeScript Interfaces for your Backend Data
interface Wallet {
    balance: number;
    status: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    wallet: Wallet | null;
}

interface PaginatedData {
    data: Customer[];
    total: number;
    current_page: number;
    last_page: number;
}

interface PageProps {
    customers: PaginatedData;
    flash: { success?: string; error?: string };
}

export default function CustomersIndex({ customers, flash }: PageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Inertia Form Setup for Adding Customers
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    // Helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Actions
    const handleCreateCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customers', {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                reset();
            },
        });
    };

    const handleSuspend = (id: number) => {
        if (confirm('Are you sure you want to suspend this customer? They will not be able to make purchases.')) {
            router.post(`/customers/${id}/suspend`, {}, { preserveScroll: true });
        }
    };

    const handleActivate = (id: number) => {
        if (confirm("Reactivate this customer's account?")) {
            router.post(`/customers/${id}/activate`, {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
                <Head title="Customers" />

                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold tracking-tight">Customers</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage your workspace users, view their wallet balances, and track activity.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Filter</span>
                        </Button>

                        {/* Add Customer Button Triggers Dialog */}
                        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add Customer</span>
                        </Button>
                    </div>
                </div>

                {/* Search & List Container */}
                <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
                    {/* Toolbar */}
                    <div className="bg-muted/20 flex items-center justify-between gap-4 border-b p-4">
                        <div className="relative w-full max-w-md">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search customers by name or email..."
                                className="bg-background pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="text-muted-foreground hidden text-sm font-medium sm:block">{customers.total} Total</div>
                    </div>

                    {/* The List Layout */}
                    <div className="space-y-2 p-2 sm:p-4">
                        {customers.data.length === 0 ? (
                            <div className="text-muted-foreground py-12 text-center">No customers found. Click "Add Customer" to get started.</div>
                        ) : (
                            customers.data.map((customer) => (
                                <div
                                    key={customer.id}
                                    className={`group bg-background hover:border-border flex flex-col justify-between gap-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:shadow-sm sm:flex-row sm:items-center ${!customer.is_active ? 'opacity-75 grayscale-[0.5]' : ''}`}
                                >
                                    {/* Left: Avatar & Identity */}
                                    <div className="flex min-w-0 flex-1 items-center gap-4">
                                        <Avatar className="h-10 w-10 border bg-indigo-50 sm:h-12 sm:w-12 dark:bg-indigo-950/50">
                                            <AvatarFallback className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                {getInitials(customer.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col truncate">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/customers/${customer.id}`}
                                                    className="text-foreground hover:text-primary truncate text-sm font-semibold transition-colors sm:text-base"
                                                >
                                                    {customer.name}
                                                </Link>
                                                {customer.is_active ? (
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active" />
                                                ) : (
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" title="Suspended" />
                                                )}
                                            </div>
                                            <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs sm:text-sm">
                                                <span className="truncate">{customer.email}</span>
                                                {customer.phone && (
                                                    <>
                                                        <span className="bg-muted-foreground/30 hidden h-1 w-1 rounded-full sm:inline-block" />
                                                        <span className="hidden sm:inline-block">{customer.phone}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Wallet Balance */}
                                    <div className="hidden min-w-[120px] flex-col items-end md:flex">
                                        <span className="text-foreground text-sm font-medium sm:text-base">
                                            {formatCurrency(customer.wallet?.balance || 0)}
                                        </span>
                                        <span className="text-muted-foreground text-xs">Wallet Balance</span>
                                    </div>

                                    {/* Right: Date & Actions */}
                                    <div className="flex min-w-[140px] items-center justify-between gap-6 sm:justify-end">
                                        <div className="flex flex-col items-start sm:items-end">
                                            <span className="text-foreground text-sm">{formatDate(customer.created_at)}</span>
                                            <span className="text-muted-foreground text-xs">Joined</span>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100"
                                                >
                                                    <MoreVertical className="text-muted-foreground h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => router.get(`/customers/${customer.id}`)}>
                                                    <ArrowUpRight className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Email Customer
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {customer.is_active ? (
                                                    <DropdownMenuItem
                                                        onClick={() => handleSuspend(customer.id)}
                                                        className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50"
                                                    >
                                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                                        Suspend Account
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => handleActivate(customer.id)}
                                                        className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 dark:focus:bg-emerald-950/50"
                                                    >
                                                        Reactivate Account
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add Customer Dialog Modal */}
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) {
                            reset();
                            clearErrors();
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleCreateCustomer}>
                            <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                                <DialogDescription>Create a new customer profile. An empty wallet will be generated automatically.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Oluwaseun Adeyemi"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="e.g. seun@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="e.g. 08012345678"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Create Customer'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
