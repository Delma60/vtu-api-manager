import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface PaymentLink {
    id: string;
    amount: string | null;
    description: string;
    customer_name: string | null;
    customer_email: string | null;
    status: string;
}

export default function Pay({ paymentLink, merchant }: { paymentLink: PaymentLink; merchant: string }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const isVariableAmount = paymentLink.amount === null;

    const { data, setData } = useForm({
        name: paymentLink.customer_name || '',
        email: paymentLink.customer_email || '',
        amount: paymentLink.amount || '',
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
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-foreground">
                {/* Background decorative blobs - Tied to theme colors instead of hardcoded indigo/emerald */}
                <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-primary/20 blur-3xl filter dark:mix-blend-screen mix-blend-multiply opacity-70"></div>
                <div className="absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-chart-2/20 blur-3xl filter dark:mix-blend-screen mix-blend-multiply opacity-70"></div>

                <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card/80 p-10 text-center shadow-xl backdrop-blur-xl text-card-foreground">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="mb-3 text-3xl font-bold tracking-tight">Payment Successful!</h2>
                    <p className="text-lg text-muted-foreground">
                        Thank you. Your payment to <span className="font-semibold text-foreground">{merchant}</span> has been
                        received.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-foreground">
            <Head title={`Pay ${merchant}`} />

            {/* Glassy Background Blobs */}
            <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl filter dark:mix-blend-screen mix-blend-multiply opacity-70"></div>
            <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-chart-4/10 blur-3xl filter dark:mix-blend-screen mix-blend-multiply opacity-70"></div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card/80 shadow-xl backdrop-blur-2xl text-card-foreground">
                <div className="px-8 pt-10 pb-6 text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 rotate-3 transform items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-chart-4 text-3xl font-extrabold text-primary-foreground uppercase shadow-lg shadow-primary/20">
                        {merchant.charAt(0)}
                    </div>
                    <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">Paying Merchant</p>
                    <h2 className="text-2xl font-bold">{merchant}</h2>
                </div>

                <div className="px-8 pb-10">
                    {/* Amount Card Container */}
                    <div className="mb-8 rounded-2xl border border-border bg-muted/50 p-6 text-center shadow-sm">
                        <p className="mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            {isVariableAmount ? 'Enter Amount to Pay' : 'Total Amount'}
                        </p>

                        {isVariableAmount ? (
                            <div className="relative mx-auto mt-2 max-w-[200px]">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₦</span>
                                <input
                                    type="number"
                                    min="100"
                                    step="0.01"
                                    required
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="w-full rounded-xl border-2 border-input bg-background py-3 pr-4 pl-12 text-center text-3xl font-extrabold text-foreground transition-all outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-0"
                                    placeholder="0.00"
                                />
                            </div>
                        ) : (
                            <h1 className="flex items-start justify-center text-5xl font-extrabold tracking-tight">
                                <span className="mt-1 mr-1 text-2xl text-muted-foreground">₦</span>
                                {parseFloat(paymentLink.amount as string).toLocaleString()}
                            </h1>
                        )}

                        {paymentLink.description && (
                            <p className="mt-4 text-sm font-medium text-muted-foreground">{paymentLink.description}</p>
                        )}
                    </div>

                    <form onSubmit={handlePayment} className="space-y-5">
                        <div>
                            <label className="mb-1.5 ml-1 block text-sm font-semibold text-foreground">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_name}
                                className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-foreground shadow-sm transition-all outline-none read-only:bg-muted read-only:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 ml-1 block text-sm font-semibold text-foreground">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_email}
                                className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-foreground shadow-sm transition-all outline-none read-only:bg-muted read-only:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Submit Button uses theme primary colors */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="mt-2 w-full transform rounded-xl bg-primary px-4 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 focus:ring-4 focus:ring-ring/20 active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-primary-foreground"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                // Added `|| '0'` fallback to prevent "NaN" if the input is completely empty
                                `Pay ₦${parseFloat(data?.amount || '0').toLocaleString()}`
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Trust Badge */}
            <div className="relative z-10 mt-8 flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
                Secured Payments
            </div>
        </div>
    );
}