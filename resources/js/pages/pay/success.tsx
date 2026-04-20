import { Head } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

interface Props {
    paymentLink: {
        id: number;
        title: string;
        amount: number;
        status: string;
    };
    tx_ref?: string;
}

export default function Success({ paymentLink, tx_ref }: Props) {
    return (
        <>
            <Head title="Payment Successful" />

            <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Payment Successful!</h2>
                            <p className="mt-2 text-center text-sm text-gray-600">Your payment has been processed successfully.</p>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div className="rounded-md bg-gray-50 p-4">
                                <dl className="space-y-2">
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Payment Link:</dt>
                                        <dd className="text-sm text-gray-900">{paymentLink.title}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Amount:</dt>
                                        <dd className="text-sm text-gray-900">₦{paymentLink.amount}</dd>
                                    </div>
                                    {tx_ref && (
                                        <div className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Transaction Ref:</dt>
                                            <dd className="text-sm text-gray-900">{tx_ref}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            <div className="text-center">
                                <a
                                    href="/"
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Return to Home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
