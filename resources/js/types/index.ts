import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
    transactions?:Transaction[];
    }


export interface Provider {
        id: number;
        name: string;
        priority: number;
        cached_balance: number;
        success_rate_7d: number;
        timeout_ms: number;
        is_active: boolean;
        api_key:string;
        api_secret:string;
        base_url:string;
        code:string;
        connection:boolean;
        balance:string;
        meta?:{
            diagnostics?:{
                time:Date,
                error:string;
                endpoint:string;
            }
            [key:string]:string;
        }
}

export interface Transaction {
    id: number;
    reference: string;
    vendor_reference: string | null;
    type: string;
    network: string;
    destination: string;
    previous_balance: number;
    new_balance: number;
    amount: number;
    cost: number | null;
    profit: number;
    status: 'pending' | 'processing' | 'successful' | 'failed' | 'refunded';
    created_at: string;
    updated_at: string;
    provider?: {
        id: number;
        name: string;
    } | null;
    service?: {
        id: number;
        name: string;
    } | null;
}
