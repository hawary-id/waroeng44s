'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Store } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Toko',
        href: '/admin/stores',
    },
];

interface IndexProps {
    stores: Store[];
}

export default function Index({ stores }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link href="/admin/stores/create">
                        <Button>
                            <PlusIcon /> Toko Baru
                        </Button>
                    </Link>

                </div>
                <DataTable columns={columns} data={stores} />
            </div>
        </AppLayout>
    );
}
