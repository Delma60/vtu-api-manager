import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { usePage, router } from '@inertiajs/react';
import { SharedData } from '@/types'; // Adjust this import based on your types setup

export function NotificationDropdown() {
    const { auth } = usePage<any>().props;
    const notifications = auth.notifications || [];
    const unreadCount = auth.unreadNotificationsCount || 0;

    const markAsRead = (id: string) => {
        router.post(route('notifications.mark-as-read', id), {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.mark-all-as-read'), {}, { preserveScroll: true });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-destructive">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                        </span>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel className="p-0 font-semibold">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {unreadCount} new
                        </Badge>
                    )}
                </div>
                <DropdownMenuSeparator />
                
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                            <Bell className="mb-2 h-8 w-8 opacity-20" />
                            <p className="text-sm">No new notifications</p>
                        </div>
                    ) : (
                        notifications.map((notification: any) => (
                            <DropdownMenuItem 
                                key={notification.id} 
                                className="flex cursor-pointer flex-col items-start gap-1 p-4"
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex w-full items-start justify-between gap-2">
                                    <p className="text-sm font-medium leading-none">
                                        {notification.data.title || 'New Notification'}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="line-clamp-2 text-xs text-muted-foreground">
                                    {notification.data.message || 'You have a new alert.'}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                            <Button 
                                variant="outline" 
                                className="w-full text-xs h-8" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    markAllAsRead();
                                }}
                            >
                                <Check className="mr-2 h-3 w-3" />
                                Mark all as read
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}