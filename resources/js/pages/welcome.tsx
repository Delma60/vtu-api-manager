import AppLogo from '@/components/app-logo';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function WelcomePage() {
    const { props } = usePage();
    const appName = (props as any)?.general?.app_name || 'VTU API';
    const appUrl = (props as any)?.general?.app_url || 'https://api.example.com';

    // State for the mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-200">
            {/* 1. Navigation Bar */}
            <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-8">
                <div className="flex items-center gap-2">
                    <AppLogo />
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{appName}</span>
                </div>

                {/* Desktop Links */}
                <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
                    <a href="#features" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        Features
                    </a>
                    <a href="#performance" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        Uptime
                    </a>
                    <a href="#pricing" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        Pricing
                    </a>
                    <a href="#docs" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        Documentation
                    </a>
                </div>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-4 md:flex">
                    <a href="/login" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        Sign in
                    </a>
                    <a href="/register" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-all hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                        Get API Keys
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="flex text-slate-600 md:hidden dark:text-slate-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="absolute left-0 top-full z-50 w-full border-b border-slate-200 bg-white px-4 py-6 shadow-xl md:hidden dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex flex-col gap-4">
                            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 dark:text-slate-300">Features</a>
                            <a href="#performance" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 dark:text-slate-300">Uptime</a>
                            <Link href={route("pricing")} className="text-base font-medium text-slate-600 dark:text-slate-300">Pricing</Link>
                            <a href="#docs" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 dark:text-slate-300">Documentation</a>
                            <hr className="my-2 border-slate-100 dark:border-slate-800" />
                            <Link href={route("login")} className="text-base font-medium text-slate-600 dark:text-slate-300 w-full text-center">
                                Sign in
                            </Link>
                            <a href="/register" className="inline-block w-full text-center rounded-lg bg-indigo-600 px-4 py-3 text-base font-medium text-white">
                                Get API Keys
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* 2. Hero Section */}
            <header className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-4 pt-12 pb-20 md:px-8 md:pt-20 lg:flex-row lg:gap-16">
                <div className="z-10 flex-1 space-y-6 text-center lg:space-y-8 lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-400 uppercase">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500"></span>
                        v2.0 API is now live
                    </div>

                    <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-7xl dark:text-white">
                        One Unified API for <br className="hidden lg:block" />
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Telecom Billing.</span>
                    </h1>

                    <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg lg:mx-0 dark:text-slate-400">
                        Stop wrestling with multiple vendor integrations and downtimes. Route your airtime, data, and utility payments through a
                        single, highly available REST API with built-in auto-failover.
                    </p>

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center lg:justify-start">
                        <button
                            onClick={() => router.get(route('register'))}
                            className="w-full rounded-lg bg-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 sm:w-auto"
                        >
                            Start Integrating
                        </button>
                        <button
                            onClick={() => router.get(route('docs.quick-start'))}
                            className="w-full rounded-lg border border-slate-200 bg-slate-100/70 px-8 py-3.5 font-semibold text-slate-900 transition-all hover:bg-slate-200 sm:w-auto dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:hover:bg-slate-800"
                        >
                            Read the Docs
                        </button>
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-lg flex-1 mt-8 lg:mt-0 lg:max-w-none">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-2xl"></div>
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
                        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex gap-2">
                                <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                                <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                            </div>
                            <div className="ml-4 font-mono text-xs text-slate-500 md:text-sm">POST /v1/transactions/topup</div>
                        </div>
                        <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed md:p-6 md:text-sm">
                            <div className="text-slate-400">
                                <span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> fetch(
                                <span className="text-emerald-300">{`${appUrl}/api/v1/topup`}</span>, {'{'}
                            </div>
                            <div className="pl-4 text-slate-300">
                                method: <span className="text-emerald-300">'POST'</span>,
                            </div>
                            <div className="pl-4 text-slate-300">
                                headers: {'{'} <span className="text-emerald-300">'Authorization'</span>:{' '}
                                <span className="text-emerald-300">'Bearer sk_live_...'</span> {'}'},
                            </div>
                            <div className="pl-4 text-slate-300">
                                body: JSON.<span className="text-blue-400">stringify</span>({'{'}
                            </div>
                            <div className="pl-8 text-slate-300">
                                network: <span className="text-emerald-300">'MTN'</span>,
                            </div>
                            <div className="pl-8 text-slate-300">
                                amount: <span className="text-orange-300">1000</span>,
                            </div>
                            <div className="pl-8 text-slate-300">
                                phone: <span className="text-emerald-300">'08012345678'</span>
                            </div>
                            <div className="pl-4 text-slate-300">{'}'})</div>
                            <div className="text-slate-400">{'}'});</div>
                            <br />
                            <div className="text-slate-500">{'// Response: 200 OK'}</div>
                            <div className="text-indigo-300">
                                {'{'} "status": "success", "reference": "txn_8910" {'}'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. Partner / Networks Strip */}
            <section className="border-y border-slate-200 bg-slate-100/60 py-8 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <p className="mb-6 text-center text-xs font-semibold tracking-widest text-slate-500 uppercase">Supported Infrastructure</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 md:gap-12 lg:gap-24">
                        <span className="text-lg font-bold tracking-wider md:text-xl">MTN</span>
                        <span className="text-lg font-bold tracking-wider md:text-xl">AIRTEL</span>
                        <span className="text-lg font-bold tracking-wider md:text-xl">GLO</span>
                        <span className="text-lg font-bold tracking-wider md:text-xl">9MOBILE</span>
                        <span className="text-lg font-bold tracking-wider md:text-xl">IKEDC</span>
                    </div>
                </div>
            </section>

            {/* 4. Core Features Grid */}
            <section id="features" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
                <div className="mb-12 text-center md:mb-16">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">Middleware built for reliability.</h2>
                    <p className="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
                        We handle the upstream complexity so you can focus on building your frontend application.
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 md:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-500/50 md:p-8 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 md:mb-6">
                            <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 md:text-xl md:mb-3 dark:text-white">Smart Auto-Routing</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                            If your primary provider fails or times out, our system instantly re-routes the request to a backup vendor. Zero dropped
                            transactions.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-purple-500/50 md:p-8 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 md:mb-6">
                            <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 md:text-xl md:mb-3 dark:text-white">Real-Time Webhooks</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                            Stop polling our servers. We push transaction statuses directly to your application endpoint the millisecond the network
                            resolves them.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-emerald-500/50 md:p-8 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 md:mb-6">
                            <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 md:text-xl md:mb-3 dark:text-white">Unified Responses</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                            We standardize all chaotic vendor responses into one clean JSON structure. Map it once, and it works for every network
                            provider.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. Performance / Dashboard Teaser */}
            <section id="performance" className="border-y border-slate-200 bg-slate-100/50 py-16 md:py-24 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:flex-row md:px-8 md:gap-16">
                    <div className="flex-1">
                        <h2 className="mb-4 text-3xl font-bold text-slate-900 md:mb-6 dark:text-white">Complete visibility into your margins.</h2>
                        <p className="mb-6 text-base leading-relaxed text-slate-700 md:mb-8 md:text-lg dark:text-slate-400">
                            Our dashboard doesn't just manage API keys. It gives you real-time logs of every request, tracks your wallet balances
                            across all underlying vendors, and lets you set custom profit markups per network.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-slate-700 md:text-base dark:text-slate-300">
                                <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Dedicated Request Logs
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700 md:text-base dark:text-slate-300">
                                <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Vendor Health Status Monitors
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700 md:text-base dark:text-slate-300">
                                <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                IP Whitelisting & Security Rules
                            </li>
                        </ul>
                    </div>
                    <div className="relative w-full flex-1">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-3xl"></div>
                        {/* Faux Dashboard UI Element */}
                        <div className="relative rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-2xl md:p-6 dark:border-slate-700 dark:bg-[#0f172a]">
                            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 md:mb-6 md:pb-4 dark:border-slate-800">
                                <div className="font-semibold text-slate-900 dark:text-white">Live Traffic</div>
                                <div className="flex gap-2">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-slate-400">txn_1029</span>
                                    <span className="text-emerald-400">Success</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-slate-400">txn_1030</span>
                                    <span className="text-emerald-400">Success</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-slate-400">txn_1031</span>
                                    <span className="text-amber-400">Re-routed</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span className="text-slate-400">txn_1032</span>
                                    <span className="text-emerald-400">Success</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Simple Pricing / CTA */}
            <section id="pricing" className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8 md:py-24">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 md:mb-6 dark:text-white">Simple, transparent rates.</h2>
                <p className="mb-8 text-base text-slate-700 md:mb-10 md:text-lg dark:text-slate-400">
                    We aggregate the best vendor prices. You pay a tiny markup for the infrastructure reliability.
                </p>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-12 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-8 grid gap-6 border-b border-slate-200 pb-8 text-left md:mb-10 md:pb-10 md:grid-cols-3 dark:border-slate-700">
                        <div className="flex justify-between md:block">
                            <div className="mb-1 text-sm text-slate-400">MTN Data (1GB)</div>
                            <div className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">₦245</div>
                        </div>
                        <div className="flex justify-between md:block">
                            <div className="mb-1 text-sm text-slate-400">Airtime Discount</div>
                            <div className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">Up to 3%</div>
                        </div>
                        <div className="flex justify-between md:block">
                            <div className="mb-1 text-sm text-slate-400">Utility Fee</div>
                            <div className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">₦35</div>
                        </div>
                    </div>

                    <button className="w-full rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-slate-800 md:w-auto md:text-lg dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                        Create Free Account
                    </button>
                </div>
            </section>

            {/* 7. Footer */}
            <footer className="border-t border-slate-200 bg-white py-8 md:py-12 dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-8">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 flex-shrink-0 rounded bg-indigo-500"></div>
                        <span className="font-semibold tracking-tight text-slate-900 dark:text-white">{appName}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 md:gap-6">
                        <a href="#" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            API Reference
                        </a>
                        <a href="#" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            Status Page
                        </a>
                        <a href="#" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            Support
                        </a>
                        <a href="#" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            Terms
                        </a>
                    </div>
                    <div className="text-sm text-slate-600 text-center dark:text-slate-400">© 2026 {appName} Infrastructure.</div>
                </div>
            </footer>
        </div>
    );
}
