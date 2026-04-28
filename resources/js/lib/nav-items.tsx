import {
    ArrowUpDown,
    Bot,
    Building2,
    CreditCard,
    DollarSign,
    HelpCircle,
    Key,
    LayoutDashboard,
    Network,
    Package,
    Receipt,
    Server,
    Settings,
    Sliders,
    Terminal,
    UserRound,
    Users,
    Zap,
} from 'lucide-react';

export const navItems = ({
    providerDownCount,
    user_type,
}: {
    providerDownCount: string;
    user_type: string;
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
                        icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
                        label: 'Dashboard',
                        routeName: 'super-admin.dashboard',
                    },
                ],
            },
            {
                section: 'Tenant Management',
                items: [
                    {
                        icon: <Building2 className="h-5 w-5 shrink-0" />,
                        label: 'Businesses',
                        routeName: 'super-admin.businesses.index',
                    },
                    {
                        icon: <Users className="h-5 w-5 shrink-0" />,
                        label: 'Users',
                        routeName: 'super-admin.users.index',
                    },
                ],
            },
            {
                section: 'Infrastructure & Gateways',
                items: [
                    {
                        icon: <Network className="h-5 w-5 shrink-0" />,
                        label: 'Simhosts',
                        routeName: 'super-admin.dashboard',
                        children: [
                            { label: 'Manage Simhosts', routeName: 'super-admin.dashboard' },
                            { label: 'Networks & Types', routeName: 'super-admin.dashboard' },
                            { label: 'Simhost Plans', routeName: 'super-admin.dashboard' },
                        ],
                    },
                    {
                        icon: <CreditCard className="h-5 w-5 shrink-0" />,
                        label: 'Payment Providers',
                        routeName: 'super-admin.payment-gateways.index',
                    },
                    {
                        icon: <DollarSign className="h-5 w-5 shrink-0" />,
                        label: 'Global Pricing',
                        routeName: 'super-admin.dashboard',
                    },
                    {
                        icon: <Package className="h-5 w-5 shrink-0" />,
                        label: 'Packages',
                        routeName: 'super-admin.packages.index',
                    },
                ],
            },
            {
                section: 'System Control',
                items: [
                    {
                        icon: <Bot className="h-5 w-5 shrink-0" />,
                        label: 'Bots',
                        routeName: 'super-admin.bots.index',
                    },
                ],
            },
            {
                section: 'Settings & Logs',
                items: [
                    {
                        icon: <Settings className="h-5 w-5 shrink-0" />,
                        label: 'System Settings',
                        routeName: 'super-admin.settings.index',
                    },
                    {
                        icon: <HelpCircle className="h-5 w-5 shrink-0" />,
                        label: 'Support',
                        routeName: 'super-admin.tickets.index',
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
                    icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
                    label: 'Dashboard',
                    routeName: 'dashboard',
                },
                {
                    icon: <Receipt className="h-5 w-5 shrink-0" />,
                    label: 'Transactions',
                    routeName: 'transactions.index',
                },
                {
                    icon: <UserRound className="h-5 w-5 shrink-0" />,
                    label: 'Customers',
                    routeName: 'customers.index',
                },
                // {
                //     icon: <Wallet className="h-5 w-5 shrink-0" />,
                //     label: 'Wallets & Balances',
                //     routeName: 'wallets.index',
                // },
            ],
        },
        {
            section: 'Payment',
            items: [
                {
                    icon: <Zap className="h-5 w-5 shrink-0" />,
                    label: 'Payment Links',
                    routeName: 'payment-links.index',
                },
                {
                    icon: <ArrowUpDown className="h-5 w-5 shrink-0" />,
                    label: 'Transfer',
                    routeName: 'transfers.index',
                },
                {
                    icon: <Receipt className="h-5 w-5 shrink-0" />,
                    label: 'Settlements',
                    routeName: 'settlements.index',
                },
            ],
        },
        {
            section: 'Infrastructure',
            items: [
                {
                    icon: <Server className="h-5 w-5 shrink-0" />,
                    label: 'API Providers',
                    routeName: 'providers.index',
                    badge: `${providerDownCount} Down`,
                },
                {
                    icon: <Network className="h-5 w-5 shrink-0" />,
                    label: 'Simhosts',
                    routeName: 'simhosts.index',
                    badge: 'Coming Soon',
                },
                {
                    icon: <DollarSign className="h-5 w-5 shrink-0" />,
                    label: 'Pricing & Margins',
                    routeName: 'pricing.airtime-data',
                    children: [
                        { label: 'Airtime & Data', routeName: 'pricing.airtime-data' },
                        { label: 'Cable', routeName: 'cable-plans.index' },
                        { label: 'Bill Payments', routeName: 'pricing.airtime-data' },
                    ],
                },
                {
                    icon: <Sliders className="h-5 w-5 shrink-0" />,
                    label: 'Service Control',
                    routeName: 'service-controls.index',
                },
            ],
        },
        {
            section: 'Developers',
            items: [
                {
                    icon: <Key className="h-5 w-5 shrink-0" />,
                    label: 'API Keys',
                    routeName: 'api-keys.index',
                },
                {
                    icon: <Zap className="h-5 w-5 shrink-0" />,
                    label: 'Webhooks',
                    routeName: 'webhooks.index',
                },
                {
                    icon: <Terminal className="h-5 w-5 shrink-0" />,
                    label: 'API Logs',
                    routeName: 'api-logs.index',
                },
                {
                    icon: <Bot className="h-5 w-5 shrink-0" />,
                    label: 'Bots',
                    routeName: 'bots.index',
                    children: [
                        { label: 'Telegram', routeName: 'bots.telegram.index' },
                        { label: 'WhatsApp', routeName: 'bots.whatsapp.edit' },
                    ],
                },
            ],
        },
        {
            section: 'Support',
            items: [
                {
                    icon: <HelpCircle className="h-5 w-5 shrink-0" />,
                    label: 'Support',
                    routeName: 'support',
                },
            ],
        },
    ];
};
