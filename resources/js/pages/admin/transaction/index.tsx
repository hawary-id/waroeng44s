'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TransactionWithRelations } from '@/types';
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
    transactions: TransactionWithRelations[];
}

export default function Index({ transactions }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link href="/admin/transactions/create">
                        <Button>
                            <PlusIcon /> Belanja
                        </Button>
                    </Link>
                </div>
                <DataTable columns={columns(true)} data={transactions} />
            </div>
        </AppLayout>
    );
}
