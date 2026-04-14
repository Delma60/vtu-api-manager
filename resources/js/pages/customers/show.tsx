// resources/js/pages/customers/show.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, ArrowLeft, Ban, Calendar, CheckCircle, CreditCard, Mail, MoreVertical, Phone, PlusCircle, Wallet } from 'lucide-react';

// Interfaces matching your backend CustomerController@show response
interface Transaction {
    id: number;
    reference: string;
    service_type: string;
    amount: number;
    status: 'successful' | 'pending' | 'failed';
    created_at: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    wallet: { balance: number; status: string } | null;
    transactions: Transaction[];
}

interface PageProps {
    customer: Customer;
    metrics: {
        wallet_balance: number;
        total_transactions: number;
        lifetime_value: number;
        joined_date: string;
        status: string;
    };
}

export default function CustomerShow({ customer, metrics }: PageProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const formatDate = (dateString: string, includeTime = false) => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            ...(includeTime && { hour: 'numeric', minute: '2-digit' }),
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const handleSuspend = () => {
        if (confirm('Are you sure you want to suspend this customer?')) {
            router.post(route('customers.suspend', customer.id), {}, { preserveScroll: true });
        }
    };

    const handleActivate = () => {
        if (confirm("Reactivate this customer's account?")) {
            router.post(route('customers.activate', customer.id), {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-4 md:p-6">
                <Head title={`${customer.name} - Details`} />

                {/* Top Navigation */}
                <Link
                    href={route('customers.index')}
                    className="text-muted-foreground hover:text-foreground group mb-2 inline-flex items-center text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Customers
                </Link>

                {/* Header Profile Section */}
                <div className="bg-card flex flex-col justify-between gap-4 rounded-2xl border p-6 shadow-sm md:flex-row md:items-center">
                    <div className="flex items-center gap-5">
                        <Avatar className="border-primary/10 h-16 w-16 border-2">
                            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-foreground flex items-center gap-3 text-2xl font-bold tracking-tight">
                                {customer.name}
                                {customer.is_active ? (
                                    <Badge className="border-0 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">Active</Badge>
                                ) : (
                                    <Badge variant="destructive" className="border-0 bg-red-500/10 text-red-600 hover:bg-red-500/20">
                                        Suspended
                                    </Badge>
                                )}
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm">Customer ID: CUS-{customer.id.toString().padStart(4, '0')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            <span>Fund Wallet</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {customer.is_active ? (
                                    <DropdownMenuItem onClick={handleSuspend} className="text-red-600 focus:text-red-600">
                                        <Ban className="mr-2 h-4 w-4" /> Suspend Account
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={handleActivate} className="text-emerald-600 focus:text-emerald-600">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Reactivate Account
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex flex-col gap-1 p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium">Wallet Balance</span>
                                <Wallet className="text-primary h-4 w-4" />
                            </div>
                            <span className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(metrics.wallet_balance)}</span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-1 p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium">Lifetime Value</span>
                                <Activity className="h-4 w-4 text-emerald-500" />
                            </div>
                            <span className="text-foreground mt-2 text-2xl font-bold">{formatCurrency(metrics.lifetime_value)}</span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-1 p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium">Total Transactions</span>
                                <CreditCard className="h-4 w-4 text-blue-500" />
                            </div>
                            <span className="text-foreground mt-2 text-2xl font-bold">{metrics.total_transactions}</span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-1 p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium">Joined Date</span>
                                <Calendar className="h-4 w-4 text-orange-500" />
                            </div>
                            <span className="text-foreground mt-2 text-2xl font-bold">{metrics.joined_date}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Details & Transactions Split */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-6 lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="text-muted-foreground mt-1 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-foreground text-sm font-medium">{customer.email}</span>
                                        <span className="text-muted-foreground text-xs">Email Address</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="text-muted-foreground mt-1 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-foreground text-sm font-medium">{customer.phone || 'Not provided'}</span>
                                        <span className="text-muted-foreground text-xs">Phone Number</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Recent Transactions */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                                <Button variant="ghost" size="sm" className="text-primary">
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {customer.transactions.length === 0 ? (
                                    <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
                                        No transactions found for this customer.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {customer.transactions.map((tx) => (
                                            <div
                                                key={tx.id}
                                                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`rounded-full p-2 ${
                                                            tx.status === 'successful'
                                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                                : tx.status === 'failed'
                                                                  ? 'bg-red-500/10 text-red-600'
                                                                  : 'bg-amber-500/10 text-amber-600'
                                                        }`}
                                                    >
                                                        <Activity className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold capitalize">{tx.service_type} Purchase</span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {tx.reference} • {formatDate(tx.created_at, true)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-foreground text-sm font-bold">{formatCurrency(tx.amount)}</span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] uppercase ${
                                                            tx.status === 'successful'
                                                                ? 'border-emerald-200 text-emerald-600'
                                                                : tx.status === 'failed'
                                                                  ? 'border-red-200 text-red-600'
                                                                  : 'border-amber-200 text-amber-600'
                                                        }`}
                                                    >
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
