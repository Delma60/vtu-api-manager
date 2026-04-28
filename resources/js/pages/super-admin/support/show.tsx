import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Building2, Clock, Send } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface User {
    id: number;
    name: string;
}
interface Business {
    id: string;
    name: string;
}
interface Reply {
    id: number;
    message: string;
    user_id: number;
    user: User;
    created_at: string;
}
interface Ticket {
    id: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    user: User;
    user_id: number;
    business: Business;
    replies: Reply[];
    created_at: string;
}

interface Props {
    ticket: Ticket;
}

export default function SuperAdminTicketShow({ ticket }: Props) {
    const { data, setData, post, processing, reset } = useForm({ message: '' });
    const auth = usePage<any>().props.auth;
    const currentUserId = auth?.user?.id;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [ticket.replies]);

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.message.trim()) return;

        // Uses the Super Admin route group
        post(route('super-admin.tickets.reply', ticket.id), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                reset('message');
                scrollToBottom();
            },
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    return (
        <div className="bg-background text-foreground flex h-[100dvh] w-full flex-col">
            <Head title={`Admin: Ticket #${ticket.id}`} />

            {/* Header */}
            <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 flex-shrink-0 border-b px-4 py-4 backdrop-blur sm:px-6 md:px-8">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('super-admin.tickets.index')}
                                    className="hover:bg-muted text-muted-foreground rounded-md p-1 transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{ticket.subject}</h1>
                            </div>

                            {/* Super Admin specific metadata showing the Business */}
                            <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-2 pl-8 text-sm">
                                <span className="text-foreground flex items-center gap-1.5 font-medium">
                                    <Building2 className="h-4 w-4 text-indigo-500" />
                                    {ticket.business?.name || 'Unknown'}
                                </span>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="flex items-center gap-1.5">{ticket.user.name}</span>
                                <Separator orientation="vertical" className="hidden h-4 sm:block" />
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDate(ticket.created_at)}
                                </span>
                                <Separator orientation="vertical" className="hidden h-4 sm:block" />
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {ticket.priority.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'} className="shrink-0 rounded-md shadow-sm">
                            {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                    </div>
                </div>
            </header>

            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
                    {/* Original Ticket Description */}
                    <div className={`flex w-full flex-col gap-2 ${ticket.user.id === currentUserId ? 'items-end' : 'items-start'}`}>
                        <div
                            className={`flex max-w-[90%] items-end gap-2 sm:max-w-[75%] md:max-w-[65%] ${ticket.user.id === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {ticket.user.id !== currentUserId && (
                                <Avatar className="border-border mb-0.5 h-8 w-8 shrink-0 border">
                                    <AvatarFallback className="text-xs">{getInitials(ticket.user.name)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={`relative flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-[15px] shadow-sm ${
                                    ticket.user.id === currentUserId
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'border-border bg-card text-foreground rounded-bl-sm border'
                                }`}
                            >
                                {ticket.user.id !== currentUserId && (
                                    <span className="text-muted-foreground text-xs font-medium">{ticket.user.name}</span>
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                                <span
                                    className={`text-right text-[10px] ${ticket.user.id === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                                >
                                    {formatTime(ticket.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Replies Map */}
                    {ticket.replies.map((reply) => {
                        const isMe = reply.user_id === currentUserId;
                        return (
                            <div key={reply.id} className={`flex w-full flex-col gap-2 ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`flex max-w-[90%] items-end gap-2 sm:max-w-[75%] md:max-w-[65%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {!isMe && (
                                        <Avatar className="border-border mb-0.5 h-8 w-8 shrink-0 border">
                                            <AvatarFallback className="text-xs">{getInitials(reply.user.name)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`relative flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-[15px] shadow-sm ${
                                            isMe
                                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                : 'border-border bg-card text-foreground rounded-bl-sm border'
                                        }`}
                                    >
                                        {!isMe && <span className="text-muted-foreground text-xs font-medium">{reply.user.name}</span>}
                                        <p className="leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                                        <span className={`text-right text-[10px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                            {formatTime(reply.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} className="h-2" />
                </div>
            </div>

            {/* Input Box: Absolute positioned button */}
            {ticket.status !== 'closed' ? (
                <div className="pb-safe border-border bg-background z-20 flex-shrink-0 border-t p-4 sm:px-6 md:px-8">
                    <form onSubmit={submitReply} className="mx-auto flex w-full max-w-5xl flex-col">
                        <div className="border-input bg-background focus-within:ring-ring relative rounded-xl border shadow-sm focus-within:ring-1">
                            <Textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Write your reply as admin..."
                                className="max-h-[150px] min-h-[52px] w-full resize-none border-0 bg-transparent py-3.5 pr-14 pl-4 text-[15px] shadow-none focus-visible:ring-0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        submitReply(e);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                disabled={processing || !data.message.trim()}
                                size="icon"
                                className="absolute right-2 bottom-2 h-9 w-9 shrink-0 rounded-md transition-all active:scale-95"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send reply</span>
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="border-border bg-muted text-muted-foreground flex-shrink-0 border-t p-4 text-center text-sm">
                    This ticket has been closed.
                </div>
            )}
        </div>
    );
}
