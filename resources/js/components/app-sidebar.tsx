import { NavUser } from '@/components/nav-user';
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
import { navItems } from '@/lib/nav-items';
import { User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function SidebarComponent() {
    const { props, url } = usePage<{
        auth: { user: User };
        provider_down_count?: number;
        mode?: 'live' | 'test';
    }>();
    const providerDownCount = (props as Record<string, unknown>)?.provider_down_count ?? 0;
    const userType = props.auth.user.user_type;
    const appName = usePage().props?.general?.app_name;
    const [activeTab, setActiveTab] = useState(url);
    const [isLiveMode, setIsLiveMode] = useState(props.mode === 'live');
    const [expandedItems, setExpandedItems] = useState<string[]>(['pricing']);
    const { state, isMobile, setOpenMobile } = useSidebar();

    // FIXED: The sidebar is "expanded" if it's expanded on desktop OR if we are on a mobile device
    // (since mobile uses a full-width Sheet slide-out)
    const isExpanded = state === 'expanded' || isMobile;

    const handleChange = (routeName: string) => {
        setActiveTab(routeName);
        router.visit(route(routeName));

        if (isMobile) {
            setOpenMobile(false);
        }
    };

    const toggleExpanded = (itemName: string) => {
        setExpandedItems((prev) => (prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]));
    };

    const _navItems = navItems({ providerDownCount, user_type: props.auth.user.user_type });

    const isItemActive = (routeName: string): boolean => {
        if (!routeName) return false;
        return activeTab.includes(routeName);
    };

    const changeMode = () => {
        const newMode = isLiveMode ? 'test' : 'live';
        router.get(route('toggle-mode'), { mode: newMode }, { onSuccess: () => setIsLiveMode(!isLiveMode) });
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-sidebar-border bg-sidebar text-sidebar-foreground border-r">
            {/* Logo Section */}
            <SidebarGroup className="border-sidebar-border border-b">
                <div className="flex items-center justify-center gap-2 px-2 py-4">
                    <div className="from-primary to-chart-4 shadow-primary/30 h-6 w-6 shrink-0 rounded bg-gradient-to-br shadow-lg" />
                    {isExpanded && <span className="text-sidebar-foreground text-lg font-bold tracking-tight whitespace-nowrap">{appName as unknown as string}</span>}
                </div>
                {/* Environment Toggle */}
                {userType !== 'admin' && (
                    <div className="px-2 py-3">
                        <button
                            onClick={changeMode}
                            className="border-border bg-background hover:border-sidebar-accent flex w-full cursor-pointer items-center justify-between rounded-lg border p-1 text-xs font-semibold transition-all"
                            title={`Switch to ${isLiveMode ? 'Test' : 'Live'} Mode`}
                        >
                            <div
                                className={`flex-1 rounded-md py-1 text-center transition-all ${!isLiveMode ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {isExpanded ? 'Test' : 'T'}
                            </div>
                            <div
                                className={`flex-1 rounded-md py-1 text-center transition-all ${isLiveMode ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-sm dark:text-emerald-400' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {isExpanded ? 'Live' : 'L'}
                            </div>
                        </button>
                    </div>
                )}
            </SidebarGroup>

            {/* Main Navigation */}
            <SidebarContent className="no-scrollbar flex-1 overflow-y-auto">
                {_navItems.map((section) => (
                    <SidebarGroup key={section.section}>
                        {isExpanded && (
                            <SidebarGroupLabel className="text-sidebar-foreground/60 px-2 text-xs font-semibold tracking-wider uppercase">
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
                                                        title={!isExpanded ? item.label : undefined}
                                                    >
                                                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            {item.icon}
                                                        </svg>
                                                        {isExpanded && (
                                                            <>
                                                                <span className="flex-1">{item.label}</span>
                                                                <ChevronRight className="h-4 w-4 shrink-0 opacity-50 transition-transform group-data-[state=open]:rotate-90" />
                                                            </>
                                                        )}
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                {expandedItems.includes(item.label) && isExpanded && (
                                                    <CollapsibleContent>
                                                        <SidebarMenu className="border-sidebar-border mt-1 ml-3 space-y-1 border-l pl-3">
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
                                                title={!isExpanded ? item.label : undefined}
                                            >
                                                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    {item.icon}
                                                </svg>
                                                {isExpanded && (
                                                    <>
                                                        <span className="flex-1">{item.label}</span>
                                                        {'badge' in item && item.badge && (
                                                            <span className="border-destructive/20 bg-destructive/10 text-destructive shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide">
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
            <SidebarFooter className="border-sidebar-border border-t">
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
