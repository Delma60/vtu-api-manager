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
        // FlutterwaveCheckout({
        //     public_key: "FLWPUBK_TEST-...",
        //     tx_ref: "tx_ref_" + Date.now(),
        //     amount: paymentLink.amount,
        //     currency: "NGN",
        //     customer: { email: data.email, name: data.name },
        //     customizations: { title: merchant, description: paymentLink.description },
        //     callback: function(response) {
        //         if (response.status === "successful") {
        //             post(route('pay.verify', paymentLink.id));
        //         }
        //     },
        //     onclose: function() { setIsProcessing(false); }
        // });

        // Temporary simulation:
        setTimeout(() => {
            alert('Payment Gateway Modal would open here.');
            setIsProcessing(false);
            // Simulate success
            // post(route('pay.verify', paymentLink.id));
        }, 1000);
    };

    if (paymentLink.status === 'successful') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-emerald-500">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                    <p className="text-slate-600">Thank you. Your payment to {merchant} has been received.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title={`Pay ${merchant}`} />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-slate-900 px-6 py-8 text-center text-white">
                    <div className="h-16 w-16 bg-indigo-500 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg uppercase">
                        {merchant.charAt(0)}
                    </div>
                    <p className="text-slate-400 text-sm mb-1">You are paying</p>
                    <h2 className="text-xl font-medium">{merchant}</h2>
                </div>

                <div className="px-6 py-8">
                    <div className="text-center mb-8">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Amount</p>
                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            <span className="text-2xl align-top mr-1">₦</span>
                            {parseFloat(paymentLink.amount).toLocaleString()}
                        </h1>
                        <p className="text-slate-600 mt-4 bg-slate-50 py-2 px-4 rounded-lg inline-block text-sm font-medium">
                            {paymentLink.description}
                        </p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_name}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none read-only:bg-slate-50"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_email}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none read-only:bg-slate-50"
                                placeholder="john@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full mt-4 py-4 px-4 rounded-xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Processing...' : `Pay ₦${parseFloat(paymentLink.amount).toLocaleString()}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
