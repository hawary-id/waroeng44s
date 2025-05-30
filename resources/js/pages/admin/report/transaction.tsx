'use client';

import { DataTable } from '@/components/data-table';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TransactionWithRelations } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Info, Printer, RefreshCcw, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { columns } from '../transaction/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan Belanja',
        href: '/admin/reports/top-up',
    },
];

interface IndexProps {
    transactions: TransactionWithRelations[];
    filters?: {
        start_date?: string;
        end_date?: string;
    };
}

const validateForm = (start_date: string, end_date: string): { isValid: boolean; errors: { start_date?: string; end_date?: string } } => {
    const errors: { start_date?: string; end_date?: string } = {};

    if (!start_date) {
        errors.start_date = 'The start date field is required.';
    }

    if (!end_date) {
        errors.end_date = 'The end date field is required.';
    } else if (start_date && end_date < start_date) {
        errors.end_date = 'The end date field must be a date after or equal to start date.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export default function Transaction({ transactions, filters }: IndexProps) {
    const { data, setData, get, processing } = useForm<{
        start_date: string;
        end_date: string;
    }>({
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

    const [errors, setErrors] = useState<{ start_date?: string; end_date?: string }>({});

    const handleSearch = () => {
        const { isValid, errors } = validateForm(data.start_date, data.end_date);

        if (!isValid) {
            setErrors(errors);
            return;
        }

        setErrors({});
        get(
            route('admin.reports.transaction', {
                start_date: data.start_date,
                end_date: data.end_date,
            }),
        );
    };

    const handlePrint = () => {
        const { isValid, errors } = validateForm(data.start_date, data.end_date);

        if (!isValid) {
            setErrors(errors);
            return;
        }

        setErrors({});

        const url = route('admin.reports.transaction', {
            start_date: data.start_date,
            end_date: data.end_date,
            print: 1,
        });

        window.open(url, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="mb-5 flex flex-col gap-3 md:flex-row">
                    <div className="flex gap-3">
                        <div className="w-1/2 md:w-52">
                            <Label htmlFor="start_date" required>
                                Start Date
                            </Label>
                            <Input
                                id="start_date"
                                type="date"
                                tabIndex={1}
                                autoComplete="start_date"
                                value={data.start_date || ''}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="block w-full"
                            />
                            <InputError message={errors.start_date} className="" />
                        </div>
                        <div className="w-1/2 md:w-52">
                            <Label htmlFor="end_date" required>
                                End Date
                            </Label>
                            <Input
                                id="end_date"
                                type="date"
                                tabIndex={2}
                                autoComplete="end_date"
                                value={data.end_date || ''}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="block w-full"
                            />
                            <InputError message={errors.end_date} className="" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 md:mt-6">
                        <Button onClick={handleSearch}>
                            <SearchIcon />
                        </Button>
                        <Link href={route('admin.reports.transaction')}>
                            <Button variant="outline">
                                <RefreshCcw />
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer />
                        </Button>
                    </div>
                </div>
                {transactions && transactions.length > 0 ? (
                    <DataTable showHeaderTable={false} columns={columns(false)} data={transactions} />
                ) : (
                    <div className="bg-muted text-muted-foreground border-border flex items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm">
                        <Info className="h-4 w-4" />
                        Filter periode terlebih dahulu untuk melihat data.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
