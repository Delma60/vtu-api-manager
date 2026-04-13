import AppLayout from '@/layouts/app-layout';
import { Transaction } from '@/types';

interface Props {
    transaction:Transaction;
    metaData:{
        request?: Record<string, any>;
        response?: Record<string, any>;
        payload?: Record<string, any>; // Fallback if 'request' is not available
        result?: Record<string, any>; // Fallback if 'response' is not available
        http_status?: string; // Optional HTTP status code for display
    };
    formattedDate:string;
}
export default function TransactionShow({ transaction, metaData, formattedDate }:Props) {
    // Helper to color-code status badges dynamically
    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'successful':
                return (
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                        Successful
                    </span>
                );
            case 'failed':
                return (
                    <span className="rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-sm font-semibold text-rose-400">Failed</span>
                );
            case 'refunded':
                return (
                    <span className="rounded-md border border-slate-500/20 bg-slate-500/10 px-3 py-1 text-sm font-semibold text-slate-400">
                        Refunded
                    </span>
                );
            default:
                return (
                    <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400">
                        Processing
                    </span>
                );
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen flex-1 bg-slate-950 p-8 font-sans text-slate-200">
                {/* 1. Header & Breadcrumbs */}
                <div className="mb-8">
                    <a
                        href="/transactions"
                        className="group mb-4 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-indigo-400"
                    >
                        <svg
                            className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Transactions
                    </a>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="font-mono text-2xl font-bold tracking-tight text-white">{transaction.reference}</h1>
                            {getStatusBadge(transaction.status)}
                        </div>
                        <div className="flex gap-3">
                            {/* If failed, show a retry button */}
                            {transaction.status === 'failed' && (
                                <button className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-slate-800">
                                    Retry Transaction
                                </button>
                            )}
                            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500">
                                Download Receipt
                            </button>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Initiated on {formattedDate}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT COLUMN: Business Logic */}
                    <div className="space-y-8 lg:col-span-1">
                        {/* A. Core Details */}
                        <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm">
                            <h3 className="mb-6 border-b border-slate-800 pb-3 text-base font-semibold text-white">Transaction Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-medium tracking-wider text-slate-500 uppercase">Network & Service</p>
                                    <p className="text-sm font-medium text-slate-200">
                                        {transaction.service?.name || String(transaction.network).toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-medium tracking-wider text-slate-500 uppercase">Destination (Phone/Meter)</p>
                                    <p className="inline-block rounded border border-slate-800 bg-slate-900/50 px-2 py-1 font-mono text-base text-white">
                                        {transaction.destination}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-medium tracking-wider text-slate-500 uppercase">Upstream Provider</p>
                                    <p className="text-sm font-medium text-slate-300">{transaction.provider?.name || 'Auto-Routed (Fallback)'}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-medium tracking-wider text-slate-500 uppercase">Vendor Reference ID</p>
                                    <p className="font-mono text-sm text-indigo-300">{transaction.vendor_reference || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* B. Financial Ledger */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] p-6 shadow-sm">
                            {/* Background Icon */}
                            <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-5">
                                <svg className="h-32 w-32 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <h3 className="mb-6 border-b border-slate-800 pb-3 text-base font-semibold text-white">Financial Ledger</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Previous Balance</span>
                                    <span className="font-medium text-slate-300">
                                        ₦{Number(transaction.previous_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Amount Charged</span>
                                    <span className="font-medium text-rose-400">
                                        - ₦{Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                {transaction.status === 'refunded' && (
                                    <div className="flex items-center justify-between border-t border-dashed border-slate-700 pt-2 text-sm">
                                        <span className="text-slate-400">Refund Applied</span>
                                        <span className="font-medium text-emerald-400">
                                            + ₦{Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}
                                <div className="mt-3 flex items-center justify-between border-t border-slate-700 pt-3 text-base">
                                    <span className="font-semibold text-white">New Balance</span>
                                    <span className="font-bold text-white">
                                        ₦{Number(transaction.new_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Admin/Reseller Profit View (Optional based on user role) */}
                            <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-3">
                                <span className="text-xs font-medium text-slate-500">Your Profit Margin</span>
                                <span className="text-sm font-bold text-emerald-400">
                                    + ₦{Number(transaction.profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Developer / Machine Logic */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* API Debugger Tool */}
                        <div className="flex h-full max-h-[800px] flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 p-4">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        />
                                    </svg>
                                    <h3 className="text-sm font-semibold text-white">Developer Debug Logs</h3>
                                </div>
                                <div className="flex gap-2">
                                    <span className="rounded border border-slate-700 bg-slate-800 px-2 py-1 font-mono text-xs text-slate-400">
                                        POST /v1/topup
                                    </span>
                                </div>
                            </div>

                            <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#0d1117] p-0">
                                {/* Request Payload */}
                                <div className="border-b border-slate-800/50">
                                    <div className="flex items-center justify-between border-b border-slate-800/50 bg-slate-800/30 px-4 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                        Vendor Request Payload
                                        <span className="text-[10px] text-slate-500 normal-case">Sent to {transaction.provider?.name}</span>
                                    </div>
                                    <pre className="overflow-x-auto p-4 font-mono text-xs text-emerald-300">
                                        <code>{JSON.stringify(metaData.request || metaData.payload || {}, null, 2)}</code>
                                    </pre>
                                </div>

                                {/* Response Payload */}
                                <div>
                                    <div className="flex items-center justify-between border-y border-slate-800/50 bg-slate-800/30 px-4 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                        Vendor Response Payload
                                        <span className="font-mono text-[10px] text-slate-500 normal-case">{metaData.http_status || '200 OK'}</span>
                                    </div>
                                    <pre className="overflow-x-auto p-4 font-mono text-xs text-indigo-300">
                                        <code>{JSON.stringify(metaData.response || metaData.result || {}, null, 2)}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
