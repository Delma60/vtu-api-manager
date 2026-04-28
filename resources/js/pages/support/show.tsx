import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, Clock, Send, UserCircle2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface User {
    id: number;
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
    replies: Reply[];
    created_at: string;
}

interface Props {
    ticket: Ticket;
}

export default function TicketShow({ ticket }: Props) {
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

        post(route('tickets.reply', ticket.id), {
            onSuccess: () => reset('message'),
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="mx-auto flex h-[calc(100dvh-6rem)] w-full max-w-4xl flex-col overflow-hidden border-0 border-slate-200/60 bg-slate-50/30 sm:mt-6 sm:h-[calc(100vh-8rem)] sm:rounded-3xl sm:border sm:shadow-lg dark:border-slate-800/60 dark:bg-slate-900/30">
            <Head title={`Ticket #${ticket.id} - ${ticket.subject}`} />
            {/* 1. Header (Fixed at top) */}
            <div className="z-20 flex-shrink-0 border-b border-slate-200/60 bg-white/80 p-4 backdrop-blur-xl sm:p-6 dark:border-slate-800/60 dark:bg-slate-950/80">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="line-clamp-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{ticket.subject}</h1>
                        <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'} className="shrink-0">
                            {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                    </div>

                    {/* flex-wrap ensures meta info stacks neatly on small mobile screens */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <UserCircle2 className="h-4 w-4" /> {ticket.user.name}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <Clock className="h-4 w-4" /> {formatDate(ticket.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <AlertCircle className="h-4 w-4" /> {ticket.priority.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Scrollable Chat Area (Takes up remaining space) */}
            <div className="flex-1 space-y-5 overflow-y-auto scroll-smooth p-4 sm:p-6">
                {/* Original Ticket Description */}
                <div className={`flex flex-col ${ticket.user.id === currentUserId ? 'items-end' : 'items-start'}`}>
                    <div className="mb-1 px-2 text-xs font-medium text-slate-500">{ticket.user.name}</div>
                    {/* Mobile: 92% width, Desktop: 75% width */}
                    <div
                        className={`relative max-w-[92%] rounded-2xl p-3.5 shadow-sm sm:max-w-[75%] sm:rounded-3xl sm:p-4 ${
                            ticket.user.id === currentUserId
                                ? 'rounded-tr-sm bg-indigo-600 text-white'
                                : 'rounded-tl-sm border border-slate-200/50 bg-white/90 text-slate-900 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/90 dark:text-white'
                        }`}
                    >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap sm:text-[15px]">{ticket.description}</p>
                        <div className={`mt-2 text-right text-[10px] ${ticket.user.id === currentUserId ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {formatTime(ticket.created_at)}
                        </div>
                    </div>
                </div>

                {/* Replies Map */}
                {ticket.replies.map((reply) => {
                    const isMe = reply.user_id === currentUserId;
                    return (
                        <div key={reply.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="mb-1 px-2 text-xs font-medium text-slate-500">{isMe ? 'You' : reply.user.name}</div>
                            <div
                                className={`relative max-w-[92%] rounded-2xl p-3.5 shadow-sm transition-all duration-300 hover:shadow-md sm:max-w-[75%] sm:rounded-3xl sm:p-4 ${
                                    isMe
                                        ? 'rounded-tr-sm bg-indigo-600 text-white'
                                        : 'rounded-tl-sm border border-slate-200/50 bg-white/90 text-slate-900 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/90 dark:text-white'
                                }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap sm:text-[15px]">{reply.message}</p>
                                <div className={`mt-2 text-right text-[10px] ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {formatTime(reply.created_at)}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* 3. Input Box (Fixed at bottom natively via flex) */}
            {ticket.status !== 'closed' && (
                <div className="pb-safe flex-shrink-0 border-t border-slate-200/60 bg-white/80 p-3 backdrop-blur-xl sm:p-4 dark:border-slate-800/60 dark:bg-slate-950/80">
                    <form onSubmit={submitReply} className="mx-auto flex w-full items-end gap-2 sm:gap-3">
                        <Textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Type your reply..."
                            className="max-h-[150px] min-h-[48px] w-full resize-none rounded-xl border-slate-200/60 bg-white/60 py-3 text-sm shadow-sm backdrop-blur-sm transition-all focus:bg-white sm:rounded-2xl sm:text-base dark:border-slate-700/60 dark:bg-slate-900/60 dark:focus:bg-slate-900"
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
                            className="mb-[2px] h-11 w-11 shrink-0 rounded-full bg-indigo-600 shadow-md transition-transform hover:bg-indigo-700 active:scale-95 sm:mb-1 sm:h-12 sm:w-12"
                        >
                            <Send className="ml-1 h-4 w-4 sm:ml-1.5 sm:h-5 sm:w-5" />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
