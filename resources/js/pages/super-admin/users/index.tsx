import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, MoreHorizontal, Power, PowerOff, ShieldAlert, Key } from 'lucide-react';
import { useState } from 'react';
import { User } from '@/types'
// interface GlobalUser {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     is_active: boolean;
//     user_type: string;
//     business_name: string;
//     role: string;
//     created_at: string;
// }

interface Props {
    users: {
        data: User[];
        links: any[];
    };
    filters: { search: string; type: string };
    auth: { user: { id: number } };
}

export default function UsersIndex({ users, filters, auth }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');

    const handleFilter = (key: string, value: string) => {
        router.get(route('super-admin.users.index'), 
            { ...filters, search: searchTerm, [key]: value }, 
            { preserveState: true }
        );
    };

    const toggleStatus = (user: GlobalUser) => {
        if (user.id === auth.user.id) {
            alert("You cannot suspend your own account.");
            return;
        }
        if (confirm(`Are you sure you want to change access for ${user.name}?`)) {
            router.post(route('super-admin.users.toggle', user.id), {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Global Users" />
            
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Global Users</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage access for all platform administrators and tenant staff.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b bg-muted/20 pb-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Account Directory
                            </CardTitle>
                            
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Select value={typeFilter} onValueChange={(val) => handleFilter('type', val)}>
                                    <SelectTrigger className="w-[150px] bg-background">
                                        <SelectValue placeholder="Account Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Accounts</SelectItem>
                                        <SelectItem value="tenant">Tenant Staff</SelectItem>
                                        <SelectItem value="super_admin">Super Admins</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Search Bar */}
                                <form onSubmit={(e) => { e.preventDefault(); handleFilter('search', searchTerm); }} className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search name, email..."
                                        className="pl-8 bg-background"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </form>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">User</TableHead>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Access Level</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-foreground">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">{user.phone}</span>
                                                </div>
                                            </TableCell>
                                            
                                            <TableCell>
                                                <span className={`font-medium text-sm ${user.user_type === 'admin' ? 'text-primary' : ''}`}>
                                                    {user.business_name}
                                                </span>
                                            </TableCell>
                                            
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                    user.user_type === 'admin' 
                                                    ? 'bg-primary/10 text-primary border-primary/20' 
                                                    : 'bg-secondary text-secondary-foreground border-border'
                                                }`}>
                                                    {user.user_type === 'admin' && <ShieldAlert className="w-3 h-3 mr-1" />}
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                                                    user.is_active 
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                }`}>
                                                    {user.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                            </TableCell>
                                            
                                            <TableCell className="text-sm text-muted-foreground">
                                                {user.created_at}
                                            </TableCell>
                                            
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                                        
                                                        {/* Example of future functionality */}
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Key className="mr-2 h-4 w-4" /> Send Password Reset
                                                        </DropdownMenuItem>

                                                        {user.id !== auth.user.id && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem 
                                                                    onClick={() => toggleStatus(user)}
                                                                    className={`cursor-pointer focus:bg-accent ${user.is_active ? 'text-rose-600 focus:text-rose-600' : 'text-emerald-600 focus:text-emerald-600'}`}
                                                                >
                                                                    {user.is_active ? (
                                                                        <><PowerOff className="mr-2 h-4 w-4" /> Suspend User Account</>
                                                                    ) : (
                                                                        <><Power className="mr-2 h-4 w-4" /> Restore User Account</>
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        
                        {/* Pagination component goes here using users.links */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}