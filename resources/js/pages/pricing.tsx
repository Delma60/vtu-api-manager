import { Package } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function PricingPage({ packages = [] }: { packages: Package[] }) {
    // provid
    console.log(packages[0]);
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-200">
            <Head title="Pricing Plans" />

            {/* Simple Public Navigation */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
                            <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg" />
                            <span className="text-xl font-bold tracking-tight">NexusVTU</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-x-6">
                        <Link
                            href={route('login')}
                            className="text-sm leading-6 font-semibold text-slate-900 transition-colors hover:text-indigo-600 dark:text-white"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign up <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Pricing Section */}
            <main className="isolate">
                <div className="py-24 sm:py-32 lg:pb-40">
                    <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                                Simple, transparent pricing
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                                Choose the plan that fits your VTU business needs. Upgrade, downgrade, or cancel at any time.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-8">
                            {packages.map((pkg, index) => {
                                // Highlight the middle tier (usually index 1)
                                const isFeatured = pkg.is_featured;

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 transition-all hover:-translate-y-1 xl:p-10 dark:bg-slate-900 ${
                                            isFeatured
                                                ? 'scale-105 shadow-indigo-500/10 ring-indigo-600 lg:z-10 dark:ring-indigo-500'
                                                : 'ring-slate-200 lg:mt-8 dark:ring-slate-800'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-x-4">
                                                <h3
                                                    className={`text-lg leading-8 font-semibold ${isFeatured ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}
                                                >
                                                    {pkg.name}
                                                </h3>
                                                {isFeatured ? (
                                                    <span className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs leading-5 font-semibold text-indigo-600 dark:text-indigo-400">
                                                        Most popular
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{pkg.description}</p>
                                            <p className="mt-6 flex items-baseline gap-x-1">
                                                <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                    ₦{Number(pkg.price).toLocaleString()}
                                                </span>
                                                <span className="text-sm leading-6 font-semibold text-slate-600 dark:text-slate-400">
                                                    /{pkg.billing_cycle === 'monthly' ? 'mo' : pkg.billing_cycle === 'yearly' ? 'yr' : 'one-time'}
                                                </span>
                                            </p>
                                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                {pkg.features?.map((feature, i) => (
                                                    <li key={i} className="flex gap-x-3">
                                                        <svg
                                                            className={`h-6 w-5 flex-none ${isFeatured ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Link
                                            href={route('register')}
                                            className={`mt-8 block rounded-md px-3 py-2 text-center text-sm leading-6 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                isFeatured
                                                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                                            }`}
                                        >
                                            Get started today
                                        </Link>
                                    </div>
                                );
                            })}

                            {/* Fallback if no packages exist in the database */}
                            {packages.length === 0 && (
                                <div className="col-span-full rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center text-slate-500 dark:border-slate-800">
                                    Pricing plans are currently being configured. Check back soon!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
