import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Users } from 'lucide-react';

export default function TransferSelectType(props) {
    const appName = props?.general?.app_name;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Transfers', href: '/transfers' },
                { title: 'Select Type', href: '#' },
            ]}
        >
            <Head title="Select Transfer Type" />

            <div className="mx-auto mt-10 max-w-3xl space-y-8 p-4 text-center sm:p-6 lg:p-12">
                <HeadingSmall title="Where are you sending money?" description="Choose the destination for this transfer." />

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Option 1: Customer Wallet */}
                    <Link href={route('transfers.create', { type: 'wallet' })}>
                        <div className="border-muted hover:border-primary bg-card group flex flex-col items-center justify-center rounded-2xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 transition-colors">
                                <Users className="h-8 w-8 text-indigo-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-lg font-bold">{appName} Wallet</h3>
                            <p className="text-muted-foreground mt-2 text-sm">Instantly fund one of your registered customers' wallets.</p>
                        </div>
                    </Link>

                    {/* Option 2: Local Bank */}
                    <Link href={route('transfers.create', { type: 'bank' })}>
                        <div className="border-muted hover:border-primary bg-card group flex flex-col items-center justify-center rounded-2xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 transition-colors">
                                <Building2 className="h-8 w-8 text-orange-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Local Bank Account</h3>
                            <p className="text-muted-foreground mt-2 text-sm">Withdraw funds or pay suppliers via local bank transfer.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
