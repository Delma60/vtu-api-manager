export const navItems = ({
    providerDownCount,
}: {
    providerDownCount: string;
}): Array<{
    section: string;
    items: Array<{
        icon: React.ReactNode;
        label: string;
        routeName: string;
        badge?: string;
        children?: Array<{ label: string; routeName: string }>;
    }>;
}> => [
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
