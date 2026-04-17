import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CodeBlock from '@/components/code-block'; // Assuming you have this from the docs
import { Search, Filter, Clock, Activity, ArrowRightLeft } from 'lucide-react';

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
    const getStatusColor = (code: number) => {
        if (code >= 200 && code < 300) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (code >= 400 && code < 500) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    };

    // Helper for Method Colors
    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET': return 'text-blue-400';
            case 'POST': return 'text-emerald-400';
            case 'PUT': return 'text-amber-400';
            case 'DELETE': return 'text-red-400';
            default: return 'text-slate-400';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Developer Settings', href: '#' }, { title: 'API Logs' }]}>
            <Head title="API Logs" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Activity className="h-6 w-6 text-indigo-400" />
                            API Request Logs
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Review your recent API requests, payloads, and errors.</p>
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input 
                            type="text" 
                            placeholder="Search endpoint or request ID..." 
                            className="pl-9 bg-slate-900 border-slate-800 text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-300">
                            <Filter className="h-4 w-4 mr-2" /> Status
                        </Button>
                        <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-300">
                            <Clock className="h-4 w-4 mr-2" /> Timeframe
                        </Button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Method & Endpoint</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Duration</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Date</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {logs.data.map((log: ApiLog) => (
                                <tr 
                                    key={log.id} 
                                    className="hover:bg-slate-800/20 transition-colors cursor-pointer group"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <td className="px-6 py-4">
                                        <Badge className={`font-mono font-medium ${getStatusColor(log.status_code)}`}>
                                            {log.status_code}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-mono text-xs font-bold ${getMethodColor(log.method)}`}>
                                                {log.method}
                                            </span>
                                            <span className="font-mono text-slate-300 group-hover:text-white transition-colors truncate max-w-[200px] md:max-w-md">
                                                {log.endpoint}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell font-mono text-slate-400">
                                        {log.duration_ms}ms
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-slate-400">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                            <ArrowRightLeft className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Log Details Slide-over */}
                <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                    <SheetContent className="w-full sm:max-w-2xl bg-slate-950 border-l border-slate-800 overflow-y-auto p-0">
                        {selectedLog && (
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="border-b border-slate-800 p-6 bg-slate-900/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className={getStatusColor(selectedLog.status_code)}>
                                            {selectedLog.status_code}
                                        </Badge>
                                        <span className={`font-mono font-bold text-sm ${getMethodColor(selectedLog.method)}`}>
                                            {selectedLog.method}
                                        </span>
                                    </div>
                                    <SheetTitle className="text-xl font-mono text-white truncate break-all">
                                        {selectedLog.endpoint}
                                    </SheetTitle>
                                    <div className="flex gap-4 mt-4 text-sm text-slate-400 font-mono">
                                        <span>Time: {new Date(selectedLog.created_at).toLocaleString()}</span>
                                        <span>Duration: {selectedLog.duration_ms}ms</span>
                                        <span>IP: {selectedLog.ip_address}</span>
                                    </div>
                                </div>

                                {/* Payloads */}
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Request Payload</h3>
                                        <CodeBlock 
                                            language="json" 
                                            code={JSON.stringify(selectedLog.request_payload, null, 2)} 
                                        />
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Response Payload</h3>
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