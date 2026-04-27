import { router } from '@inertiajs/react';
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

export const getDiscountedPrice = (price: number, discount: number, type?: 'flat' | 'percentage') => {
    if (!discount || discount <= 0) return price;
    
    if (type === 'percentage') {
        const discountAmount = (price * discount) / 100;
        return Math.max(0, price - discountAmount);
    }
    
    return Math.max(0, price - discount);
};

 export const handleSubscribe = (packageId: number) => {
        router.post(route('billing.subscribe'), { package_id: packageId });
    };