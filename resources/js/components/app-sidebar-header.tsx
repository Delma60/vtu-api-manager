import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import AppearanceToggleDropdown from './appearance-dropdown';
import { Separator } from './ui/separator';
import { UserInfo } from './user-info';
import { Button } from './ui/button';
import { Bell, Command, Search } from 'lucide-react';
import { Input } from './ui/input';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const {
        props: { auth },
    } = usePage();
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 md:px-6 backdrop-blur-md">
            {/* Left Section: Navigation & Breadcrumbs */}
            <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger className="-ml-1" />
                {/* <Separator orientation="vertical" className="hidden sm:block mr-2 h-4" /> */}
                {/* <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div> */}
            </div>

            {/* Middle Section: Search Bar */}
            <div className="flex-1 max-w-md mx-4 hidden lg:block">
                <div className="relative group border rounded-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                        placeholder="Search transactions, customers..." 
                        className="pl-10 pr-12 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all w-full"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border bg-background text-[10px] font-medium text-muted-foreground opacity-60">
                        <Command className="h-2.5 w-2.5" /> K
                    </div>
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Search Button */}
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Search className="h-5 w-5" />
                </Button>

                {/* Notification Bell */}
                <div className="relative">
                    <Button variant="ghost" size="icon" className="relative hover:bg-muted transition-colors">
                        <Bell className="h-5 w-5" />
                        {/* Notification Badge Dot */}
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
                    </Button>
                </div>

                <div className="hidden sm:flex items-center gap-4">
                    <AppearanceToggleDropdown />
                    <Separator orientation="vertical" className="h-4" />
                </div>
                
                <UserInfo user={auth?.user} />
            </div>
        </header>
    );
}
