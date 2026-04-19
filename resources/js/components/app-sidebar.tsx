import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import { router, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { navItems } from '@/lib/nav-items';

export function SidebarComponent() {
    const { props, url } = usePage<{
        auth: { user: { name: string; email: string } };
        provider_down_count?: number;
        mode?: 'live' | 'test';
    }>();
    const providerDownCount = (props as Record<string, unknown>)?.provider_down_count ?? 0;
    const [activeTab, setActiveTab] = useState(url);
    const [isLiveMode, setIsLiveMode] = useState(props.mode === 'live');
    const [expandedItems, setExpandedItems] = useState<string[]>(['pricing']);
    const { state } = useSidebar();

    const handleChange = (routeName: string) => {
        setActiveTab(routeName);
        router.visit(route(routeName));
    };

    const toggleExpanded = (itemName: string) => {
        setExpandedItems((prev) => (prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]));
    };


    const _navItems = navItems({ providerDownCount })

    const isItemActive = (routeName: string): boolean => {
        if (!routeName) return false;
        return activeTab.includes(routeName);
    };

    const changeMode = () => {
        const newMode = isLiveMode ? 'test' : 'live';
        router.get(route('toggle-mode'), { mode: newMode }, { onSuccess: () => setIsLiveMode(!isLiveMode) });
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            {/* Logo Section */}
            <SidebarGroup className="border-b border-sidebar-border">
                <div className="flex items-center justify-center gap-2 px-2 py-4">
                    <div className="h-6 w-6 shrink-0 rounded bg-gradient-to-br from-primary to-chart-4 shadow-lg shadow-primary/30" />
                    {state === 'expanded' && <span className="text-lg font-bold tracking-tight whitespace-nowrap text-sidebar-foreground">NexusVTU</span>}
                </div>

                {/* Environment Toggle */}
                <div className="px-2 py-3">
                    <button
                        onClick={changeMode}
                        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-background p-1 text-xs font-semibold transition-all hover:border-sidebar-accent"
                        title={`Switch to ${isLiveMode ? 'Test' : 'Live'} Mode`}
                    >
                        <div
                            className={`flex-1 rounded-md py-1 text-center transition-all ${!isLiveMode ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {state === 'expanded' ? 'Test' : 'T'}
                        </div>
                        <div
                            className={`flex-1 rounded-md py-1 text-center transition-all ${isLiveMode ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {state === 'expanded' ? 'Live' : 'L'}
                        </div>
                    </button>
                </div>
            </SidebarGroup>

            {/* Main Navigation */}
            <SidebarContent className="no-scrollbar flex-1 overflow-y-auto">
                {_navItems.map((section) => (
                    <SidebarGroup key={section.section}>
                        {state === 'expanded' && (
                            <SidebarGroupLabel className="px-2 text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase">
                                {section.section}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        {'children' in item && item.children ? (
                                            <Collapsible
                                                open={expandedItems.includes(item.label)}
                                                onOpenChange={(open) => {
                                                    if (open) {
                                                        toggleExpanded(item.label);
                                                    } else {
                                                        toggleExpanded(item.label);
                                                    }
                                                }}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        isActive={expandedItems.includes(item.label)}
                                                        className={`group relative ${
                                                            expandedItems.includes(item.label)
                                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                                        }`}
                                                        title={state === 'collapsed' ? item.label : undefined}
                                                    >
                                                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            {item.icon}
                                                        </svg>
                                                        {state === 'expanded' && (
                                                            <>
                                                                <span className="flex-1">{item.label}</span>
                                                                <ChevronRight className="h-4 w-4 shrink-0 opacity-50 transition-transform group-data-[state=open]:rotate-90" />
                                                            </>
                                                        )}
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                {expandedItems.includes(item.label) && state === 'expanded' && (
                                                    <CollapsibleContent>
                                                        <SidebarMenu className="ml-3 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                                                            {item.children.map((child) => (
                                                                <SidebarMenuItem key={child.routeName}>
                                                                    <SidebarMenuButton
                                                                        onClick={() => handleChange(child.routeName)}
                                                                        isActive={activeTab.includes(child.routeName)}
                                                                        className={`text-xs ${
                                                                            activeTab.includes(child.routeName)
                                                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                                                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                                                        }`}
                                                                    >
                                                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                                                        <span>{child.label}</span>
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                            ))}
                                                        </SidebarMenu>
                                                    </CollapsibleContent>
                                                )}
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuButton
                                                onClick={() => handleChange(item.routeName)}
                                                isActive={isItemActive(item.routeName)}
                                                className={`group relative ${
                                                    isItemActive(item.routeName)
                                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                                }`}
                                                title={state === 'collapsed' ? item.label : undefined}
                                            >
                                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    {item.icon}
                                                </svg>
                                                {state === 'expanded' && (
                                                    <>
                                                        <span className="flex-1">{item.label}</span>
                                                        {'badge' in item && item.badge && (
                                                            <span className="shrink-0 rounded-full border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-destructive">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* User Profile Footer */}
            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent group">
                            <Avatar className="h-8 w-8 shrink-0 border border-sidebar-border">
                                <AvatarFallback className="text-xs font-medium bg-sidebar-primary text-sidebar-primary-foreground">
                                    {props?.auth?.user?.name
                                        ?.split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .toUpperCase()}
                                </AvatarFallback>
                                <AvatarImage
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(props?.auth?.user?.name || 'User')}&background=0f172a&color=ffffff&size=128`}
                                    alt={props?.auth?.user?.name}
                                />
                            </Avatar>
                            {state === 'expanded' && (
                                <div className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-sm font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground">{props?.auth?.user?.name}</p>
                                    <p className="truncate text-xs text-sidebar-foreground/60">{props?.auth?.user?.email}</p>
                                </div>
                            )}
                        </button>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}