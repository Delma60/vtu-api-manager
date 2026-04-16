import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bell, Command, Search } from 'lucide-react';
import AppearanceToggleDropdown from './appearance-dropdown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { UserInfo } from './user-info';
import { useEffect, useState } from 'react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [open, setOpen] = useState(false);

    // Keyboard shortcut (⌘K or Ctrl+K) to open search
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);
    const {
        props: { auth },
    } = usePage();
    return (
        <header className="bg-background/80 sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-md md:px-6">
            {/* Left Section: Navigation & Breadcrumbs */}
            <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger className="-ml-1" />
                {/* <Separator orientation="vertical" className="hidden sm:block mr-2 h-4" /> */}
                {/* <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div> */}
            </div>

            {/* Middle Section: Search Bar */}
            <div className="mx-4 hidden max-w-md flex-1 lg:block">
                <div className="group relative rounded-md border">
                    <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
                    <Input
                        placeholder="Search transactions, customers..."
                        className="bg-muted/50 focus-visible:ring-primary/50 w-full border-none pr-12 pl-10 transition-all focus-visible:ring-1"
                    />
                    <div className="bg-background text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium opacity-60">
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
                    <Button variant="ghost" size="icon" className="hover:bg-muted relative transition-colors">
                        <Bell className="h-5 w-5" />
                        {/* Notification Badge Dot */}
                        <span className="border-background absolute top-2 right-2 h-2 w-2 rounded-full border-2 bg-red-500" />
                    </Button>
                </div>

                <div className="hidden items-center gap-4 sm:flex">
                    <AppearanceToggleDropdown />
                    <Separator orientation="vertical" className="h-4" />
                </div>

                <UserInfo user={auth?.user} />
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type to search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => (window.location.href = '/transactions')}>Transactions</CommandItem>
                        <CommandItem onSelect={() => (window.location.href = '/customers')}>Customers</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </header>
    );
}
