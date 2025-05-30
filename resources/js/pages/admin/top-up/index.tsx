'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MemberCard, TopUp } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Member Card',
        href: '/admin/top-ups',
    },
];

interface IndexProps {
    topUps: TopUp[];
}

export default function Index({ topUps }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link href={route('admin.employees.topUps')}>
                        <Button>
                            <PlusIcon /> Top Up
                        </Button>
                    </Link>
                </div>
                <DataTable columns={columns(true)} data={topUps} />
            </div>
        </AppLayout>
    );
}
