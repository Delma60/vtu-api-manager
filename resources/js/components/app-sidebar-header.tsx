import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bell, Building, Command, Network, Receipt, Search, Settings, User, Wifi } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

export function AppSidebarHeader() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchActive, setSearchActive] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        if (!searchActive) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchActive]);

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

    const getIcon = (type: string) => {
        switch (type) {
            case 'transaction':
                return <Receipt className="h-4 w-4" />;
            case 'customer':
                return <User className="h-4 w-4" />;
            case 'provider':
                return <Building className="h-4 w-4" />;
            case 'network':
                return <Network className="h-4 w-4" />;
            case 'service':
                return <Settings className="h-4 w-4" />;
            case 'data_plan':
                return <Wifi className="h-4 w-4" />;
            default:
                return <Search className="h-4 w-4" />;
        }
    };

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
            <div className="mx-4 hidden w-full max-w-xl flex-1 lg:block">
                <div ref={searchRef} className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                    </div>
                    <Input
                        placeholder="Search transactions, customers, providers..."
                        className="bg-muted/50 focus-visible:ring-primary/50 w-full border-none pr-12 pl-10 transition-all focus-visible:ring-1"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setSearchActive(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && results.length > 0) {
                                window.location.href = results[0].url;
                            }
                        }}
                    />
                    <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-[10px] font-medium text-slate-400">
                        <Command className="h-3.5 w-3.5" /> K
                    </div>

                    {searchActive && (
                        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-slate-800/60 bg-slate-950/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
                            {loading ? (
                                <div className="px-3 py-3 text-sm text-slate-400">Loading search results…</div>
                            ) : error ? (
                                <div className="px-3 py-3 text-sm text-rose-400">{error}</div>
                            ) : query.trim().length > 2 ? (
                                results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((result) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                type="button"
                                                onClick={() => (window.location.href = result.url)}
                                                className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-slate-900/80"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-400">{getIcon(result.type)}</span>
                                                    <div>
                                                        <p className="font-medium text-slate-100">{result.title}</p>
                                                        <p className="text-sm text-slate-500">{result.description}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-3 py-3 text-sm text-slate-400">No results found. Try another keyword.</div>
                                )
                            ) : (
                                <div className="space-y-2">
                                    <div className="px-3 py-3 text-sm text-slate-400">
                                        Search across transactions, customers, providers, networks, and more.
                                    </div>
                                    <div className="grid gap-2 px-1 pb-1 sm:grid-cols-2">
                                        {pageLinks.slice(0, 4).map((page) => (
                                            <button
                                                key={`suggestion-${page.id}`}
                                                type="button"
                                                onClick={() => (window.location.href = page.url)}
                                                className="rounded-xl border border-slate-800/50 bg-slate-900/70 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
                                            >
                                                <div className="font-medium">{page.title}</div>
                                                <div className="text-xs text-slate-500">{page.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Search Button */}
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
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
                                    {getIcon(result.type)}
                                    <div className="ml-2 flex flex-col gap-0.5">
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
