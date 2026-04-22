import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Provider } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { 
    Activity, 
    AlertCircle, 
    AlertTriangle, 
    ArrowLeft, 
    CheckCircle, 
    Info, 
    Key, 
    Route, 
    Server, 
    ShieldCheck 
} from 'lucide-react';
import { useState } from 'react';

export default function ProviderConfig({
    provider: currentProvider,
    
    recentErrors,
}: {
    provider: Provider;
    services: any;
    recentErrors: any;
    config: { auto_failover: boolean, timeout_ms: number };
}) {
    const [activeTab, setActiveTab] = useState('credentials');
    

    const { data: formData, setData, errors, patch, processing } = useForm<Provider>(currentProvider);
    const [changePassword, setChangePassword] = useState(true);

    const onSave = () => {
        patch(route('providers.update', currentProvider.id));
    };


    return (
        <AppLayout>
            <div className="min-h-screen flex-1 bg-background font-sans text-foreground">
                {/* Sticky Header */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-8 py-5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <a
                            href="/providers"
                            className="rounded-lg border border-input bg-background p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </a>
                        <div>
                            <h1 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground">
                                {currentProvider.name}
                                <span
                                    className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                                        currentProvider.is_active 
                                            ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                            : 'border border-muted-foreground/20 bg-muted/50 text-muted-foreground'
                                    }`}
                                >
                                    {currentProvider.is_active ? 'Active' : 'Disabled'}
                                </span>
                                <span
                                    className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                                        currentProvider.connection 
                                            ? 'border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                                            : 'border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                    }`}
                                >
                                    {currentProvider.connection ? 'Connected' : 'Disconnected'}
                                </span>
                            </h1>
                            <p className="mt-0.5 font-mono text-xs text-muted-foreground">Code: {currentProvider.code}</p>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                                Balance: ₦{Number(currentProvider.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            Cancel
                        </button>
                        <Button
                            onClick={onSave}
                            disabled={processing}
                            className="px-6 py-2.5 shadow-md"
                        >
                            {processing ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </div>
                </header>

                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-8 py-8 md:flex-row">
                    {/* Left Sidebar Navigation */}
                    <nav className="w-full shrink-0 space-y-1 md:w-64">
                        <button
                            onClick={() => setActiveTab('credentials')}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                                activeTab === 'credentials' 
                                    ? 'bg-primary/10 text-primary font-medium' 
                                    : 'text-muted-foreground font-medium hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <Key className="h-5 w-5" />
                            API Credentials
                        </button>
                        <button
                            onClick={() => setActiveTab('routing')}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                                activeTab === 'routing' 
                                    ? 'bg-primary/10 text-primary font-medium' 
                                    : 'text-muted-foreground font-medium hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <Route className="h-5 w-5" />
                            Routing & Failover
                        </button>
                        <button
                            onClick={() => setActiveTab('diagnostics')}
                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                                activeTab === 'diagnostics' 
                                    ? 'bg-primary/10 text-primary font-medium' 
                                    : 'text-muted-foreground font-medium hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5" />
                                Diagnostics
                            </div>
                            {recentErrors && recentErrors.length > 0 && <span className="h-2 w-2 rounded-full bg-destructive"></span>}
                        </button>
                    </nav>

                    {/* Right Content Area */}
                    <div className="max-w-3xl flex-1">
                        {/* TAB 1: API Credentials */}
                        {activeTab === 'credentials' && (
                            <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                                <div className="border-b border-border p-6">
                                    <h2 className="text-lg font-semibold">Connection Details</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        These keys securely authenticate your server with the upstream provider.
                                    </p>
                                </div>
                                <div className="space-y-6 p-6">
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-foreground">Base URL</Label>
                                        <Input
                                            type="url"
                                            value={formData.base_url}
                                            onChange={(e) => setData('base_url', e.target.value)}
                                            className="w-full font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-foreground">Public Key / Username</Label>
                                        <Input
                                            type="text"
                                            value={formData.api_key}
                                            onChange={(e) => setData('api_key', e.target.value)}
                                            className="w-full font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-foreground">Secret Key / Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={changePassword ? 'password' : 'text'}
                                                value={formData.api_secret}
                                                onChange={(e) => setData('api_secret', e.target.value)}
                                                className="w-full font-mono text-sm pr-20"
                                            />
                                            <button
                                                onClick={() => setChangePassword(!changePassword)}
                                                className="absolute top-2.5 right-3 text-sm font-medium text-primary hover:text-primary/80"
                                            >
                                                Reveal
                                            </button>
                                        </div>
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Stored securely using AES-256 encryption.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: Routing & Failover */}
                        {activeTab === 'routing' && (
                            <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                                <div className="border-b border-border p-6">
                                    <h2 className="text-lg font-semibold">Routing Intelligence</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">Determine how and when your dispatcher utilizes this provider.</p>
                                </div>
                                <div className="space-y-8 p-6">
                                    <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-foreground">Routing Priority</h3>
                                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                                Lower numbers execute first. If Priority 1 fails, the dispatcher automatically attempts Priority 2.
                                            </p>
                                        </div>
                                        <Input
                                            type="number"
                                            value={formData.priority}
                                            className="w-20 text-center font-mono"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-foreground">Connection Timeout</h3>
                                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                                How long to wait for a response before dropping the connection and failing over to the backup
                                                provider.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={formData.timeout_ms}
                                                className="w-24 text-center font-mono"
                                            />
                                            <span className="text-xs font-semibold text-muted-foreground">ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: Diagnostics */}
                        {activeTab === 'diagnostics' && (
                            <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                                <div className="flex items-center justify-between border-b border-border p-6">
                                    <div>
                                        <h2 className="text-lg font-semibold">Provider Diagnostics</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">Recent connection errors and health checks.</p>
                                    </div>
                                    <button
                                        onClick={() => router.get(route('providers.diagnose', currentProvider.id))}
                                        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Server className="h-3.5 w-3.5" />
                                        Ping Provider
                                    </button>
                                </div>

                                <div className="space-y-4 p-6">
                                    {recentErrors && recentErrors.length > 0 ? (
                                        recentErrors.map(function (error: any, idx: number) {
                                            return (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        'flex items-start gap-3 rounded-lg border p-4',
                                                        error?.type === 'warning'
                                                            ? 'border-amber-500/20 bg-amber-500/10'
                                                            : error?.type === 'error'
                                                              ? 'border-destructive/20 bg-destructive/10'
                                                              : error?.type === 'success'
                                                                ? 'border-emerald-500/20 bg-emerald-500/10'
                                                                : 'border-blue-500/20 bg-blue-500/10',
                                                    )}
                                                >
                                                    {error?.type === 'warning' ? (
                                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                                    ) : error?.type === "error" ? (
                                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                                                    ) : error?.type === "success" ? (
                                                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                    ) : (
                                                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                                    )}
                                                    
                                                    <div>
                                                        <h4
                                                            className={cn(
                                                                'text-sm font-semibold',
                                                                error?.type === 'success'
                                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                                    : error.type === 'warning'
                                                                      ? 'text-amber-700 dark:text-amber-400'
                                                                      : error?.type === 'error'
                                                                        ? 'text-destructive'
                                                                        : 'text-blue-700 dark:text-blue-400',
                                                            )}
                                                        >
                                                            {error?.title}
                                                        </h4>
                                                        <p className="mt-1 text-xs text-muted-foreground">{error?.body}</p>
                                                        <p className="mt-2 font-mono text-[10px] text-muted-foreground/80">
                                                            {error.time} • Endpoint: {error.endpoint}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                                            <Activity className="h-10 w-10 opacity-20 mb-3" />
                                            <p className="text-sm font-medium text-foreground">No recent issues</p>
                                            <p className="text-xs">This provider is operating smoothly with zero recorded failures.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}