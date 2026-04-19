import AppLayout  from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, UserCircle, ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RegisterTenant() {
    const { data, setData, post, processing, errors, reset } = useForm({
        business_name: '',
        support_email: '',
        owner_name: '',
        owner_email: '',
        owner_phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('super-admin.businesses.store'), {
            onSuccess: () => reset(),
        });
    };

    console.log(errors)

    return (
        <AppLayout>
            <Head title="Register New Tenant" />
            
            <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={route('super-admin.businesses.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Provision New Tenant</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Create a new isolated VTU environment and administrator account.
                        </p>
                    </div>
                </div>

                {errors.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Provisioning Failed</AlertTitle>
                        <AlertDescription>{errors.error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
                    
                    {/* Left Column: Business Details */}
                    <Card className="h-fit">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Business Information
                            </CardTitle>
                            <CardDescription>
                                The public-facing details for this API consumer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="business_name">Company / Business Name</Label>
                                <Input
                                    id="business_name"
                                    type="text"
                                    value={data.business_name}
                                    onChange={(e) => setData('business_name', e.target.value)}
                                    placeholder="e.g. SwiftPay VTU"
                                    required
                                />
                                {errors.business_name && <p className="text-sm text-rose-500">{errors.business_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="support_email">Support Email Address</Label>
                                <Input
                                    id="support_email"
                                    type="email"
                                    value={data.support_email}
                                    onChange={(e) => setData('support_email', e.target.value)}
                                    placeholder="support@swiftpay.com"
                                    required
                                />
                                {errors.support_email && <p className="text-sm text-rose-500">{errors.support_email}</p>}
                            </div>
                            
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    <strong>Note:</strong> Upon creation, this tenant will automatically be placed in <b>Test Mode</b> to allow safe API integration before going live.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Owner Details */}
                    <Card className="h-fit">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserCircle className="h-5 w-5 text-primary" />
                                Administrator Account
                            </CardTitle>
                            <CardDescription>
                                The root user credentials for this tenant's dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="owner_name">Owner's Full Name</Label>
                                <Input
                                    id="owner_name"
                                    type="text"
                                    value={data.owner_name}
                                    onChange={(e) => setData('owner_name', e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                                {errors.owner_name && <p className="text-sm text-rose-500">{errors.owner_name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="owner_email">Login Email</Label>
                                    <Input
                                        id="owner_email"
                                        type="email"
                                        value={data.owner_email}
                                        onChange={(e) => setData('owner_email', e.target.value)}
                                        placeholder="admin@swiftpay.com"
                                        required
                                    />
                                    {errors.owner_email && <p className="text-sm text-rose-500">{errors.owner_email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="owner_phone">Phone Number</Label>
                                    <Input
                                        id="owner_phone"
                                        type="tel"
                                        value={data.owner_phone}
                                        onChange={(e) => setData('owner_phone', e.target.value)}
                                        placeholder="08012345678"
                                        required
                                    />
                                    {errors.owner_phone && <p className="text-sm text-rose-500">{errors.owner_phone}</p>}
                                </div>
                            </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Initial Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <p className="text-sm text-rose-500">{errors.password}</p>}
                                </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {/* <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Bar */}
                    <div className="md:col-span-2 flex items-center justify-end gap-3 border-t pt-6 mt-2">
                        <Button variant="ghost" type="button" onClick={() => reset()} disabled={processing}>
                            Clear Form
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-[150px]">
                            {processing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Provision Tenant</>
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}