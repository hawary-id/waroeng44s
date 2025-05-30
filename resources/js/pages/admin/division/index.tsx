'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Division } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Divisi',
        href: '/admin/devisions',
    },
];

interface IndexProps {
    divisions: Division[];
}

export default function Index({ divisions }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link href="/admin/divisions/create">
                        <Button>
                            <PlusIcon /> Divisi Baru
                        </Button>
                    </Link>
                </div>
                <DataTable columns={columns} data={divisions} />
            </div>
        </AppLayout>
    );
}
