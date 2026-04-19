import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface PaymentLink {
    id: string;
    amount: string;
    description: string;
    customer_name: string | null;
    customer_email: string | null;
    status: string;
}

export default function Pay({ paymentLink, merchant }: { paymentLink: PaymentLink, merchant: string }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post } = useForm({
        name: paymentLink.customer_name || '',
        email: paymentLink.customer_email || '',
    });

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // IMPORTANT: Initialize your Flutterwave/Paystack modal here
        // Example for Flutterwave:
        // FlutterwaveCheckout({ ... });

        // Temporary simulation:
        setTimeout(() => {
            alert('Payment Gateway Modal would open here.');
            setIsProcessing(false);
            // Simulate success: post(route('pay.verify', paymentLink.id));
        }, 1500);
    };

    if (paymentLink.status === 'successful') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background decorative blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

                <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 p-10 text-center relative z-10">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Payment Successful!</h2>
                    <p className="text-slate-600 text-lg">Thank you. Your payment to <span className="font-semibold text-slate-800">{merchant}</span> has been received.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Head title={`Pay ${merchant}`} />

            {/* Glassy Background Blobs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

            <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 overflow-hidden relative z-10">
                <div className="px-8 pt-10 pb-6 text-center">
                    <div className="h-20 w-20 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white mx-auto mb-5 shadow-lg shadow-indigo-500/30 uppercase transform rotate-3">
                        {merchant.charAt(0)}
                    </div>
                    <p className="text-slate-500 text-sm font-medium tracking-wide uppercase mb-1">Paying Merchant</p>
                    <h2 className="text-2xl font-bold text-slate-800">{merchant}</h2>
                </div>

                <div className="px-8 pb-10">
                    {/* Amount Card Container */}
                    <div className="bg-white/50 rounded-2xl p-6 text-center mb-8 border border-white/60 shadow-sm">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Amount</p>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight flex items-start justify-center">
                            <span className="text-2xl mt-1 mr-1 text-slate-600">₦</span>
                            {parseFloat(paymentLink.amount).toLocaleString()}
                        </h1>
                        {paymentLink.description && (
                            <p className="text-slate-600 mt-4 text-sm font-medium">
                                {paymentLink.description}
                            </p>
                        )}
                    </div>

                    <form onSubmit={handlePayment} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_name}
                                className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-4 py-3.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all read-only:bg-slate-100/50 read-only:text-slate-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_email}
                                className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-4 py-3.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all read-only:bg-slate-100/50 read-only:text-slate-500"
                                placeholder="john@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full mt-2 py-4 px-4 rounded-xl shadow-lg shadow-indigo-500/30 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:ring-4 focus:ring-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    {/* SVG Spinner */}
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                `Pay ₦${parseFloat(paymentLink.amount).toLocaleString()}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-8 text-center text-slate-500 text-sm font-medium flex items-center justify-center gap-2 relative z-10">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secured Payments
            </div>
        </div>
    );
}