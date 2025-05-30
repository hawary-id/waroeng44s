import {
    LayoutGrid,
    CreditCard,
    UsersIcon,
    StoreIcon,
    CombineIcon,
    Folder,
    BookOpen,
    ShoppingCart,
    DollarSign,
    FolderIcon,
} from 'lucide-react';
import { NavItem } from '@/types';

export const getMainNavItems = (role: string): NavItem[] => {
    switch (role) {
        case 'admin':
            return [
                { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
                { title: 'Belanja', href: '/admin/transactions', icon: ShoppingCart },
                { title: 'Top Up', href: '/admin/top-ups', icon: DollarSign },
                { title: 'Member Card', href: '/admin/member-cards', icon: CreditCard },
                { title: 'Karyawan', href: '/admin/employees', icon: UsersIcon },
                { title: 'Divisi', href: '/admin/divisions', icon: CombineIcon },
                { title: 'Toko', href: '/admin/stores', icon: StoreIcon },
                {
                    title: 'Laporan',
                    icon: FolderIcon,
                    children: [
                        { title: 'Top Up', href: '/admin/reports/top-up' },
                        { title: 'Belanja', href: '/admin/reports/transaction' },
                    ],
                },

            ];
        case 'employee':
            return [
                { title: 'Dashboard', href: '/employee/dashboard', icon: LayoutGrid },
                { title: 'Tasks', href: '/employee/tasks', icon: Folder },
            ];
        case 'user':
            return [
                { title: 'Dashboard', href: '/user/dashboard', icon: LayoutGrid },
                { title: 'Profile', href: '/user/profile', icon: UsersIcon },
            ];
        default:
            return [];
    }
};

// Jika kamu punya menu footer atau nav footer lain, bisa didefinisikan juga di sini.
export const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
