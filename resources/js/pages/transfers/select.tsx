import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { Building2, Users } from 'lucide-react';

export default function TransferSelectType() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Transfers', href: '/transfers' }, { title: 'Select Type', href: '#' }]}>
            <Head title="Select Transfer Type" />

            <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-12 space-y-8 text-center mt-10">
                <HeadingSmall title="Where are you sending money?" description="Choose the destination for this transfer." />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    {/* Option 1: Customer Wallet */}
                    <Link href={route('transfers.create', { type: 'wallet' })}>
                        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-muted hover:border-primary bg-card transition-all hover:-translate-y-1 hover:shadow-lg group">
                            <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Users className="h-8 w-8 text-indigo-600 group-hover:text-white" />
                            </div>
                            <h3 className="font-bold text-lg">NexusVTU Wallet</h3>
                            <p className="text-sm text-muted-foreground mt-2">Instantly fund one of your registered customers' wallets.</p>
                        </div>
                    </Link>

                    {/* Option 2: Local Bank */}
                    <Link href={route('transfers.create', { type: 'bank' })}>
                        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-muted hover:border-primary bg-card transition-all hover:-translate-y-1 hover:shadow-lg group">
                            <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Building2 className="h-8 w-8 text-orange-600 group-hover:text-white" />
                            </div>
                            <h3 className="font-bold text-lg">Local Bank Account</h3>
                            <p className="text-sm text-muted-foreground mt-2">Withdraw funds or pay suppliers via local bank transfer.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}