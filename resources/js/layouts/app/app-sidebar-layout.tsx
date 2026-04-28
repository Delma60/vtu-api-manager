import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { SidebarComponent as AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FlashMessages } from '@/components/flash-messages';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';

export default function AppSidebarLayout({ children }: { children: React.ReactNode }) {
    const userType = usePage<SharedData>().props.auth.user.user_type;

    return (
        <>
            <AppShell variant="sidebar">
                <FlashMessages />
                <AppSidebar />
                <AppContent variant="sidebar">
                    <AppSidebarHeader />
                    {children}
                </AppContent>

                {userType !== 'admin' && (
                    <button
                        type="button"
                        onClick={() => router.visit(route('support'))}
                        className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    >
                        <HelpCircle className="h-5 w-5" />
                        Support
                    </button>
                )}
            </AppShell>
        </>
    );
}
