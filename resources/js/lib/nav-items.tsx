export const navItems = ({
    providerDownCount,
    user_type,
}: {
    providerDownCount: string;
    user_type:string
}): Array<{
    section: string;
    items: Array<{
        icon: React.ReactNode;
        label: string;
        routeName: string;
        badge?: string;
        children?: Array<{ label: string; routeName: string }>;
    }>;
}> => {
    // --- SUPER ADMIN NAVIGATION ---
    if (user_type === 'admin') {
        return [
            {
                section: 'Platform Overview',
                items: [
                    {
                        icon: (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        ),
                        label: 'Dashboard',
                        routeName: 'super-admin.dashboard',
                    },
                ],
            },
            {
                section: 'Tenant Management',
                items: [
                    {
                        icon: (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        ),
                        label: 'Businesses',
                        routeName: 'super-admin.businesses.index', // Change to: 'super-admin.businesses.index'
                    },
                    {
                        icon: (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ),
                        label: 'Users',
                        routeName: 'super-admin.users.index', // Change to: 'super-admin.users.index'
                    },
                ],
            },
            {
                section: 'Infrastructure & Gateways',
                items: [
                    {
                        // Grouping Network, Types, and Plans STRICTLY under Simhost
                        icon: (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                        ),
                        label: 'Simhosts',
                        routeName: 'super-admin.dashboard', // Change to 'super-admin.simhosts.index'
                        children: [
                            { label: 'Manage Simhosts', routeName: 'super-admin.dashboard' },
                            { label: 'Networks & Types', routeName: 'super-admin.dashboard' }, // Super Admin sets networks here
                            { label: 'Simhost Plans', routeName: 'super-admin.dashboard' },    // Super Admin sets plans here
                        ],
                    },
                    {
                        icon: (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        ),
                        label: 'Payment Providers',
                        routeName: 'super-admin.dashboard', // Change to 'super-admin.payment-providers.index'
                    },
                    {
                        icon: (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ),
                        label: 'Global Pricing',
                        routeName: 'super-admin.dashboard', // Change to 'super-admin.pricing.index'
                    },
                ],
            },
            {
                section: 'System Control',
                items: [
                    {
                        icon: (
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        ),
                        label: 'Bots',
                        routeName: 'super-admin.dashboard', // Change to 'super-admin.bots.index'
                    },
                ],
            },
        ];
    }
        return [
            {
                section: 'Overview',
                items: [
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        ),
                        label: 'Dashboard',
                        routeName: 'dashboard',
                    },
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        ),
                        label: 'Transactions',
                        routeName: 'transactions.index',
                    },
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 9v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1"
                            />
                        ),
                        label: 'Customers',
                        routeName: 'customers.index',
                    },
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        ),
                        label: 'Wallets & Balances',
                        routeName: 'wallets.index',
                    },
                    {
                        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                        label: 'Payment Links',
                        routeName: 'payment-links.index',
                    },
                ],
            },
            {
                section: 'Infrastructure',
                items: [
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        ),
                        label: 'API Providers',
                        routeName: 'providers.index',
                        badge: `${providerDownCount} Down`,
                    },
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        ),
                        label: 'Pricing & Margins',
                        routeName: 'pricing.airtime-data',
                        children: [
                            { label: 'Airtime & Data', routeName: 'pricing.airtime-data' },
                            { label: 'Cable', routeName: 'cable-plans.index' },
                            { label: 'Bill Payments', routeName: 'pricing.airtime-data' },
                        ],
                    },
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        ),
                        label: 'Service Control',
                        routeName: 'service-controls.index',
                    },
                ],
            },
            {
                section: 'Developers',
                items: [
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        ),
                        label: 'API Keys',
                        routeName: 'api-keys.index',
                    },
                    {
                        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                        label: 'Webhooks',
                        routeName: 'webhooks.index',
                    },
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        ),
                        label: 'API Logs',
                        routeName: 'api-logs.index',
                    },
                    {
                        icon: (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        ),
                        label: 'Bots',
                        routeName: 'bots.index',
                        children: [{ label: 'Telegram', routeName: 'bots.telegram.index' }],
                    },
                ],
            },
        ];
    
};
