import { AlertCircle, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import React from 'react';

interface CalloutProps {
    type?: 'info' | 'warning' | 'error' | 'success' | 'tip';
    title?: string;
    children: React.ReactNode;
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
    const styles = {
        info: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            text: 'text-blue-200',
            icon: 'text-blue-400',
            Icon: Info,
        },
        warning: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            text: 'text-amber-200',
            icon: 'text-amber-400',
            Icon: AlertTriangle,
        },
        error: {
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/30',
            text: 'text-rose-200',
            icon: 'text-rose-400',
            Icon: AlertCircle,
        },
        success: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-200',
            icon: 'text-emerald-400',
            Icon: CheckCircle,
        },
        tip: {
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            text: 'text-purple-200',
            icon: 'text-purple-400',
            Icon: Lightbulb,
        },
    };

    const style = styles[type];
    const Icon = style.Icon;

    const typeLabels = {
        info: 'Note',
        warning: 'Warning',
        error: 'Error',
        success: 'Success',
        tip: 'Tip',
    };

    return (
        <div className={`not-prose my-6 flex gap-4 rounded-lg border ${style.bg} ${style.border} p-4`}>
            <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${style.icon} mt-0.5`} />
            </div>
            <div className="flex-1">
                <p className={`font-semibold ${style.text}`}>{title || typeLabels[type]}</p>
                <div className={`mt-2 text-sm ${style.text} opacity-90`}>{children}</div>
            </div>
        </div>
    );
}
