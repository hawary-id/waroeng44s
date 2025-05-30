import { MemberCard } from './index.d';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

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
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash?: {
        type?: string;
        message?: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Store {
    id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    email: string;
};

export interface Division {
    id: string;
    name: string;
};

export interface Employee {
    id: string | number;
    code: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    status: string | number;
    division_id: string | number;
    store_id: string | number;
};

export interface EmployeeWithRelations extends Employee {
    division?: Division;
    store?: Store;
    member_card?: MemberCardWithRelations;
}

export interface MemberCard {
    id: string | number;
    card_number: string;
    balance: string;
    expired_at: string;
    status: string | number | boolean;
    user_id: string | number;
    issued_by: string | number;
};

export interface MemberCardWithRelations extends MemberCard {
    user?: EmployeeWithRelations;
    top_ups?: TopUp[];
    transactions?: Transaction[];
}

export interface TopUp {
    id: string | number;
    amount: string | number;
    status: string;
    member_card_id: string | number;
    topup_by: string | number;
    created_at: string;
};

export interface TopUpWithRelations extends TopUp {
    member_card?: MemberCardWithRelations;
}

export interface Transaction {
    id: string | number;
    code: string | number;
    receipt_code: string | number;
    amount: string | number;
    status: string | number;
    member_card_id: string | number;
    performed_by: string | number;
    created_at: string;
};

export interface TransactionWithRelations extends Transaction {
    member_card?: MemberCardWithRelations;
    performed_by?: EmployeeWithRelations;
}

export interface ChartMonthly {
    month: string;
    topup: number;
    belanja: number;
}

export interface dailyTransaction {
    date: string;
    amount: number;
}


