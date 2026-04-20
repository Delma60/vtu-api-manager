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
    // const [isProcessing, setIsProcessing] = useState(false);
    const isVariableAmount = paymentLink.amount === null;

    const { data, setData, post, processing:isProcessing, errors } = useForm({
        customer_name: paymentLink.customer_name || '',
        customer_email: paymentLink.customer_email || '',
        amount: paymentLink.amount || '',
    });

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("pay.submit", paymentLink.id))
    };

    console.log(errors)
    if (paymentLink.status === 'successful') {
        return (
            <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
                {/* Background decorative blobs - Tied to theme colors instead of hardcoded indigo/emerald */}
                <div className="bg-primary/20 absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full opacity-70 mix-blend-multiply blur-3xl filter dark:mix-blend-screen"></div>
                <div className="bg-chart-2/20 absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full opacity-70 mix-blend-multiply blur-3xl filter dark:mix-blend-screen"></div>

                <div className="border-border bg-card/80 text-card-foreground relative z-10 w-full max-w-md rounded-3xl border p-10 text-center shadow-xl backdrop-blur-xl">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="mb-3 text-3xl font-bold tracking-tight">Payment Successful!</h2>
                    <p className="text-muted-foreground text-lg">
                        Thank you. Your payment to <span className="text-foreground font-semibold">{merchant}</span> has been received.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
            <Head title={`Pay ${merchant}`} />

            {/* Glassy Background Blobs */}
            <div className="bg-primary/10 absolute top-0 left-1/4 h-72 w-72 rounded-full opacity-70 mix-blend-multiply blur-3xl filter dark:mix-blend-screen"></div>
            <div className="bg-chart-4/10 absolute right-1/4 bottom-0 h-72 w-72 rounded-full opacity-70 mix-blend-multiply blur-3xl filter dark:mix-blend-screen"></div>

            {/* Main Card */}
            <div className="border-border bg-card/80 text-card-foreground relative z-10 w-full max-w-md overflow-hidden rounded-3xl border shadow-xl backdrop-blur-2xl">
                <div className="px-8 pt-10 pb-6 text-center">
                    <div className="from-primary to-chart-4 text-primary-foreground shadow-primary/20 mx-auto mb-5 flex h-20 w-20 rotate-3 transform items-center justify-center rounded-2xl bg-gradient-to-tr text-3xl font-extrabold uppercase shadow-lg">
                        {merchant.charAt(0)}
                    </div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium tracking-wide uppercase">Paying Merchant</p>
                    <h2 className="text-2xl font-bold">{merchant}</h2>
                </div>

                <div className="px-8 pb-10">
                    {/* Amount Card Container */}
                    <div className="border-border bg-muted/50 mb-8 rounded-2xl border p-6 text-center shadow-sm">
                        <p className="text-muted-foreground mb-2 text-sm font-semibold tracking-wider uppercase">
                            {isVariableAmount ? 'Enter Amount to Pay' : 'Total Amount'}
                        </p>

                        {isVariableAmount ? (
                            <div className="relative mx-auto mt-2 max-w-[200px]">
                                <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 text-2xl font-bold">₦</span>
                                <input
                                    type="number"
                                    min="100"
                                    step="0.01"
                                    required
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring w-full rounded-xl border-2 py-3 pr-4 pl-12 text-center text-3xl font-extrabold transition-all outline-none focus:ring-0"
                                    placeholder="0.00"
                                />
                            </div>
                        ) : (
                            <h1 className="flex items-start justify-center text-5xl font-extrabold tracking-tight">
                                <span className="text-muted-foreground mt-1 mr-1 text-2xl">₦</span>
                                {parseFloat(paymentLink.amount as string).toLocaleString()}
                            </h1>
                        )}

                        {paymentLink.description && <p className="text-muted-foreground mt-4 text-sm font-medium">{paymentLink.description}</p>}
                    </div>

                    <form onSubmit={handlePayment} className="space-y-5">
                        <div>
                            <label className="text-foreground mb-1.5 ml-1 block text-sm font-semibold">Full Name</label>
                            <input
                                type="text"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_name}
                                className="border-input bg-background text-foreground read-only:bg-muted read-only:text-muted-foreground focus:border-ring focus:ring-ring/20 placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3.5 shadow-sm transition-all outline-none focus:ring-2"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="text-foreground mb-1.5 ml-1 block text-sm font-semibold">Email Address</label>
                            <input
                                type="email"
                                value={data.customer_email}
                                onChange={(e) => setData('customer_email', e.target.value)}
                                required
                                readOnly={!!paymentLink.customer_email}
                                className="border-input bg-background text-foreground read-only:bg-muted read-only:text-muted-foreground focus:border-ring focus:ring-ring/20 placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3.5 shadow-sm transition-all outline-none focus:ring-2"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Submit Button uses theme primary colors */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="bg-primary text-primary-foreground shadow-primary/20 focus:ring-ring/20 mt-2 w-full transform rounded-xl px-4 py-4 text-base font-bold shadow-lg transition-all hover:opacity-90 focus:ring-4 active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="text-primary-foreground mr-3 -ml-1 h-5 w-5 animate-spin"
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
            <div className="text-muted-foreground relative z-10 mt-8 flex items-center justify-center gap-2 text-center text-sm font-medium">
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
