import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, BreadcrumbItem } from '@/types';
import { ReactNode } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.type && flash.message) {
            if (flash.type === 'success') {
                toast.success(flash.message);
            } else if (flash.type === 'error') {
                toast.error(flash.message);
            }
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster expand={true} richColors />
        </AppLayoutTemplate>
    );
}
