import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Bell, Building, Layout, Shield, User } from 'lucide-react';

const sidebarNavItems = [
    { title: 'Profile', href: route('settings.profile.edit'), icon: User },
    { title: 'Security', href: route('settings.password.edit'), icon: Shield },
    { title: 'Appearance', href: route('settings.appearance.edit'), icon: Layout },
    // New ones:
    { title: 'Business Profile', href: route('settings.business.edit'), icon: Building },
    {
        title: 'Settlements',
        href: route('settings.settlements'),
        active: route().current('settings.settlements'),
    },
    { title: 'Billing', href: route('settings.billing.index'), icon: Building },
    { title: 'Notifications', href: route('settings.notifications.edit'), icon: Bell },
    // { title: "Team Management", href: route('settings.team.index'), icon: Users },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.href}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
