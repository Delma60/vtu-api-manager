import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CodeBlock from '@/components/code-block';
import { Search, Filter, Clock, Activity, ArrowRightLeft, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type definitions based on typical API Log structure
interface ApiLog {
    id: string;
    method: string;
    endpoint: string;
    status_code: number;
    ip_address: string;
    duration_ms: number;
    request_payload: any;
    response_payload: any;
    created_at: string;
}

export default function ApiLogs({ logs, filters }: { logs: any, filters: any }) {
    const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);
    const [search, setSearch] = useState(filters?.search || '');

    // Handle search filtering
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/developers/api-logs', { search }, { preserveState: true, preserveScroll: true });
    };

    // Helper for Status Badge Colors
    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
        if (status >= 400 && status < 500) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
        if (status >= 500) return 'bg-destructive/10 text-destructive border-destructive/20';
        return 'bg-muted text-muted-foreground border-border';
    };

    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET': return 'text-blue-600 dark:text-blue-400';
            case 'POST': return 'text-emerald-600 dark:text-emerald-400';
            case 'PUT':
            case 'PATCH': return 'text-amber-600 dark:text-amber-400';
            case 'DELETE': return 'text-destructive';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <AppLayout>
            <Head title="API Logs" />
            <div className="flex min-h-screen flex-1 flex-col p-8 bg-background font-sans text-foreground">
                <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">API Request Logs</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitor and debug all incoming requests to your VTU API.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search endpoints, IP, or status..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-card border-input focus:ring-ring focus:border-ring"
                            />
                        </form>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm text-card-foreground">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Method & Endpoint</th>
                                    <th className="px-6 py-4">IP Address</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs?.data && logs.data.length > 0 ? (
                                    logs.data.map((log: ApiLog) => (
                                        <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className={cn('rounded-md border px-2.5 py-1 font-mono text-xs font-semibold', getStatusColor(log.status_code))}>
                                                    {log.status_code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("font-bold text-xs", getMethodColor(log.method))}>{log.method}</span>
                                                    <span className="font-mono text-foreground">{log.endpoint}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                                                {log.ip_address}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {log.duration_ms}ms
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => setSelectedLog(log)}
                                                >
                                                    View Payload
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            <Activity className="h-10 w-10 mx-auto opacity-20 mb-3" />
                                            No logs found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Basic Pagination Footer */}
                    <div className="flex items-center justify-between border-t border-border bg-muted/30 p-4 text-sm">
                        <div className="text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{logs?.from || 0}</span> to{' '}
                            <span className="font-medium text-foreground">{logs?.to || 0}</span> of{' '}
                            <span className="font-medium text-foreground">{logs?.total || 0}</span> logs
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!logs?.prev_page_url}
                                onClick={() => logs?.prev_page_url && router.get(logs.prev_page_url, { search }, { preserveState: true })}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!logs?.next_page_url}
                                onClick={() => logs?.next_page_url && router.get(logs.next_page_url, { search }, { preserveState: true })}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>

                <Sheet open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                    <SheetContent className="w-full sm:max-w-2xl overflow-y-auto border-l border-border bg-background p-0">
                        {selectedLog && (
                            <div className="flex flex-col h-full text-foreground">
                                <SheetHeader className="border-b border-border bg-muted/50 p-6">
                                    <SheetTitle className="flex items-center gap-3">
                                        <span className={cn('rounded-md border px-2.5 py-1 font-mono text-sm font-semibold', getStatusColor(selectedLog.status_code))}>
                                            {selectedLog.status_code}
                                        </span>
                                        <span className={cn("font-bold text-sm", getMethodColor(selectedLog.method))}>{selectedLog.method}</span>
                                        <span className="font-mono text-base font-normal">{selectedLog.endpoint}</span>
                                    </SheetTitle>
                                </SheetHeader>
                                
                                <div className="grid grid-cols-2 gap-4 border-b border-border p-6 bg-card">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{new Date(selectedLog.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Activity className="h-4 w-4" />
                                        <span>{selectedLog.duration_ms}ms</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Globe className="h-4 w-4" />
                                        <span className="font-mono">IP: {selectedLog.ip_address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ArrowRightLeft className="h-4 w-4" />
                                        <span className="font-mono">ID: {selectedLog.id.substring(0,8)}</span>
                                    </div>
                                </div>

                                {/* Payloads */}
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Request Payload</h3>
                                        <CodeBlock 
                                            language="json" 
                                            code={JSON.stringify(selectedLog.request_payload, null, 2)} 
                                        />
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Response Payload</h3>
                                        <CodeBlock 
                                            language="json" 
                                            code={JSON.stringify(selectedLog.response_payload, null, 2)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}