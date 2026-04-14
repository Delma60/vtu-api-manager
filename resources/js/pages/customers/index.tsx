import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Filter, Mail, MoreVertical, Plus, Search } from 'lucide-react';
import { useState } from 'react';

// Mock data tailored to a VTU/Wallet context
const mockCustomers = [
    {
        id: 'CUS-1029',
        name: 'Oluwaseun Adeyemi',
        email: 'oluwaseun.a@example.com',
        phone: '08012345678',
        status: 'active',
        wallet_balance: 45000.5,
        joined: 'Oct 24, 2025',
        initials: 'OA',
        color: 'bg-blue-500/10 text-blue-600',
    },
    {
        id: 'CUS-1030',
        name: 'Chiamaka Nwosu',
        email: 'chiamaka.n@example.com',
        phone: '07087654321',
        status: 'active',
        wallet_balance: 12500.0,
        joined: 'Oct 22, 2025',
        initials: 'CN',
        color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
        id: 'CUS-1031',
        name: 'Ibrahim Musa',
        email: 'ibrahim.m@example.com',
        phone: '09011223344',
        status: 'inactive',
        wallet_balance: 0.0,
        joined: 'Oct 15, 2025',
        initials: 'IM',
        color: 'bg-slate-500/10 text-slate-600',
    },
];

export default function CustomersIndex() {
    const [searchQuery, setSearchQuery] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    return (

        <AppLayout>
        <div className="space-y-8 p-4">
            <Head title="Customers" />

            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-foreground text-2xl font-bold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your users, view their wallet balances, and track activity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <Button className="flex items-center gap-2">
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
                            placeholder="Search customers by name, email, or ID..."
                            className="bg-background pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-muted-foreground hidden text-sm font-medium sm:block">{mockCustomers.length} Total</div>
                </div>

                {/* The List Layout */}
                <div className="space-y-2 p-2 sm:p-4">
                    {mockCustomers.map((customer) => (
                        <div
                            key={customer.id}
                            className="group bg-background hover:border-border flex flex-col justify-between gap-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:shadow-sm sm:flex-row sm:items-center"
                        >
                            {/* Left: Avatar & Identity */}
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                <Avatar className="h-10 w-10 border sm:h-12 sm:w-12">
                                    <AvatarFallback className={`font-semibold ${customer.color}`}>{customer.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col truncate">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/customers/${customer.id}`}
                                            className="text-foreground hover:text-primary truncate text-sm font-semibold transition-colors sm:text-base"
                                        >
                                            {customer.name}
                                        </Link>
                                        {customer.status === 'active' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active" />}
                                    </div>
                                    <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs sm:text-sm">
                                        <span className="truncate">{customer.email}</span>
                                        <span className="bg-muted-foreground/30 hidden h-1 w-1 rounded-full sm:inline-block" />
                                        <span className="hidden sm:inline-block">{customer.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Wallet Balance (Hidden on tiny screens) */}
                            <div className="hidden min-w-[120px] flex-col items-end md:flex">
                                <span className="text-foreground text-sm font-medium sm:text-base">{formatCurrency(customer.wallet_balance)}</span>
                                <span className="text-muted-foreground text-xs">Wallet Balance</span>
                            </div>

                            {/* Right: Date & Actions */}
                            <div className="flex min-w-[140px] items-center justify-between gap-6 sm:justify-end">
                                <div className="flex flex-col items-start sm:items-end">
                                    <span className="text-foreground text-sm">{customer.joined}</span>
                                    <span className="text-muted-foreground text-xs">Date Added</span>
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
                                        <DropdownMenuItem>
                                            <ArrowUpRight className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950">
                                            Suspend Account
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </AppLayout>
    );
}
