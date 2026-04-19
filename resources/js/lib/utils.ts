import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export const getNetworkColor = (name: string) => {
        switch (name?.toLowerCase()) {
            case 'mtn':
                return 'bg-yellow-500';
            case 'airtel':
                return 'bg-red-500';
            case 'glo':
                return 'bg-green-500';
            case '9mobile':
                return 'bg-emerald-800';
            default:
                return 'bg-slate-500';
        }
    };