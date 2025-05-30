'use client';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Employee } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { employee_columns } from './column/employee_columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Karyawan',
        href: '/admin/employees',
    },
];

interface IndexProps {
    employees: Employee[];
}

export default function Index({ employees }: IndexProps) {

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
                            <PlusIcon /> Karyawan Baru
                        </Button>
                    </Link>
                </div>
                <DataTable columns={employee_columns} data={employees} />
            </div>
        </AppLayout>
    );
}
