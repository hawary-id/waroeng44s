'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MemberCard } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Member Card',
        href: '/admin/member-cards',
    },
];

interface IndexProps {
    memberCards: MemberCard[];
}

export default function Index({ memberCards }: IndexProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="flex justify-end gap-3">
                    <Link href={route('admin.employees.topUps')}>
                        <Button variant="outline">
                            <PlusIcon /> Top Up
                        </Button>
                    </Link>
                    <Link href="/admin/employees/create">
                        <Button>
                            <PlusIcon /> Member Card Baru
                        </Button>
                    </Link>
                </div>
                <DataTable columns={columns} data={memberCards} />
            </div>
        </AppLayout>
    );
}
