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


export interface Network {
    id: string|number;
    name: string;
    code: string;
    airtime_api_id: number|string;
    airtime_pin_api_id: number|string;
    data_api_id: number|string;
    data_pin_api_id: number|string;
    is_active: boolean;
    network_types?: NetworkType[]
}


export interface NetworkType {
    id: number|string;
    name: string;
    type: string;
    typeable:Typeable;
    is_active: boolean;
    network_id:string;
}

export interface Typeable {
    id: number|string;
    name: string;
}

export interface DataPlan {
    id: number;
    name: string;
    plan_type?:string;
    plan_name?:string;
    network: string;
    min_amount: number;
    max_amount: number;
    is_active: boolean;
}


export interface   DiscountPlan {
    id: number;
    name: string;
    plan_type: NetworkType
    network: Network;
    min_amount: number;
    max_amount: number;
    is_active: boolean;
}