import { Head } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

interface Props {
    paymentLink: {
        id: number;
        title: string;
        amount: number;
        status: string;
    };
    tx_ref?: string;
}

export default function Failed({ paymentLink, tx_ref }: Props) {
    return (
        <>
            <Head title="Payment Failed" />

            <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <XCircle className="mx-auto h-12 w-12 text-red-500" />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Payment Failed</h2>
                            <p className="mt-2 text-center text-sm text-gray-600">Your payment could not be processed. Please try again.</p>
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

                            <div className="space-y-4 text-center">
                                <button
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Try Again
                                </button>
                                <div>
                                    <a
                                        href="/"
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Return to Home
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
