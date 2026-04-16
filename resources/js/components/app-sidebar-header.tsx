import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SharedData, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bell, Command, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppearanceToggleDropdown from './appearance-dropdown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { UserInfo } from './user-info';

interface SearchResult {
    type: string;
    id: number;
    title: string;
    description: string;
    url: string;
}

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Debounce query input
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 200);
        return () => clearTimeout(timeout);
    }, [query]);

    // Fetch search results
    useEffect(() => {
        if (debouncedQuery.length <= 2) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`/search?q=${encodeURIComponent(debouncedQuery)}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                console.log(res);
                return res.json();
            })
            .then((res) => {
                console.log(res);
                setResults(res);
            })
            .catch(() => {
                setResults([]);
                setError('Unable to load results.');
            })
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    const {
        props: { auth },
    } = usePage<SharedData>();

    void breadcrumbs;

    const pageLinks: SearchResult[] = [
        { type: 'page', id: 1, title: 'Transactions', description: 'Manage transaction history', url: '/transactions' },
        { type: 'page', id: 2, title: 'Customers', description: 'Manage customer accounts', url: '/customers' },
        { type: 'page', id: 3, title: 'Providers', description: 'Manage service providers', url: '/providers' },
        { type: 'page', id: 4, title: 'Networks', description: 'Manage networks and connectivity', url: '/networks' },
        { type: 'page', id: 5, title: 'Wallets', description: 'View wallet balances', url: '/wallets' },
        { type: 'page', id: 6, title: 'Discounts', description: 'View active discounts', url: '/discounts' },
        { type: 'page', id: 7, title: 'Airtime & Data', description: 'Manage pricing plans', url: '/pricing/airtime-data' },
    ].filter((item) =>
        debouncedQuery.length > 2
            ? item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || item.description.toLowerCase().includes(debouncedQuery.toLowerCase())
            : true,
    );

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
                        readOnly
                        onClick={() => setOpen(true)}
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
            <CommandDialog
                open={open}
                onOpenChange={(newOpen) => {
                    setOpen(newOpen);
                    if (newOpen) {
                        setQuery('');
                        setResults([]);
                        setError(null);
                    }
                }}
            >
                <CommandInput placeholder="Type to search..." value={query} onValueChange={setQuery} />
                <CommandList>
                    {loading && <CommandItem disabled>Loading search results…</CommandItem>}
                    {!loading && error && <CommandItem disabled>{error}</CommandItem>}
                    {!loading && !error && debouncedQuery.length > 2 && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

                    {results.length > 0 && (
                        <CommandGroup heading="Results">
                            {results.map((result) => (
                                <CommandItem
                                    key={`${result.type}-${result.id}`}
                                    value={result.title}
                                    onSelect={() => (window.location.href = result.url)}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span>{result.title}</span>
                                        <span className="text-muted-foreground text-sm">{result.description}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {!loading && debouncedQuery.length <= 2 && (
                        <CommandGroup heading="Suggestions">
                            <CommandItem value="Transactions" onSelect={() => (window.location.href = '/transactions')}>
                                Transactions
                            </CommandItem>
                            <CommandItem value="Customers" onSelect={() => (window.location.href = '/customers')}>
                                Customers
                            </CommandItem>
                            <CommandItem value="Providers" onSelect={() => (window.location.href = '/providers')}>
                                Providers
                            </CommandItem>
                        </CommandGroup>
                    )}

                    {!loading && debouncedQuery.length > 2 && pageLinks.length > 0 && (
                        <CommandGroup heading="Pages">
                            {pageLinks.map((page) => (
                                <CommandItem key={`page-${page.id}`} value={page.title} onSelect={() => (window.location.href = page.url)}>
                                    <div className="flex flex-col gap-0.5">
                                        <span>{page.title}</span>
                                        <span className="text-muted-foreground text-sm">{page.description}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </header>
    );
}
