'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EmployeeWithRelations } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Karyawan', href: '/admin/employees' }];

interface IndexProps {
    employees: EmployeeWithRelations[];
}

export default function Index({ employees }: IndexProps) {
    const [search, setSearch] = useState('');
    const { data, setData, post, processing, errors } = useForm<{ top_ups: Record<string, string> }>({
        top_ups: {},
    });

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.code.toLowerCase().includes(search.toLowerCase()) ||
            emp.member_card?.card_number.toLowerCase().includes(search.toLowerCase()) ||
            emp.store?.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.division?.name.toLowerCase().includes(search.toLowerCase()),
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/\D/g, '');
        const formattedValue = new Intl.NumberFormat('id-ID').format(Number(numericValue));

        setData('top_ups', {
            ...data.top_ups,
            [id]: numericValue,
        });

        e.target.value = formattedValue;
    };

    const handleSubmit = () => {
        const entries = Object.entries(data.top_ups);

        if (entries.length === 0) {
            toast.error('Silakan isi minimal satu nominal top up.');
            return;
        }

        post(route('admin.top-ups.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Top Up Karyawan" />
            <div className="p-4">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="max-w-sm"
                        type="search"
                    />
                </div>

                <div className="max-h-[740px] overflow-auto">
                    <Table>
                        <TableHeader className="">
                            <TableRow>
                                <TableHead className="border border-gray-300 px-2 py-2">No</TableHead>
                                <TableHead className="border border-gray-300 px-2 py-2">Member Card Code</TableHead>
                                <TableHead className="border border-gray-300 px-2 py-2">Kode Karyawan</TableHead>
                                <TableHead className="border border-gray-300 px-2 py-2">Nama Karyawan</TableHead>
                                <TableHead className="border border-gray-300 px-2 py-2">Toko</TableHead>
                                <TableHead className="border border-gray-300 px-2 py-2">Divisi</TableHead>
                                <TableHead className="border border-gray-300 px-2 py-2">Top Up</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((emp, index) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="border border-gray-300 px-2 py-1 text-center text-sm">{index + 1}</TableCell>
                                    <TableCell className="border border-gray-300 px-2 py-1 text-sm">{emp.member_card?.card_number}</TableCell>
                                    <TableCell className="border border-gray-300 px-2 py-1 text-sm">{emp.code}</TableCell>
                                    <TableCell className="border border-gray-300 px-2 py-1 text-sm">{emp.name}</TableCell>
                                    <TableCell className="border border-gray-300 px-2 py-1 text-sm">{emp.store?.name}</TableCell>
                                    <TableCell className="border border-gray-300 px-2 py-1 text-sm">{emp.division?.name}</TableCell>
                                    <TableCell className="border border-gray-300 px-2 py-1 text-sm">
                                        <Input
                                            type="text"
                                            defaultValue={new Intl.NumberFormat('id-ID').format(
                                                Number(data.top_ups[emp.member_card?.id?.toString() || emp.id.toString()] || ''),
                                            )}
                                            onChange={(e) => handleChange(e, emp.member_card?.id?.toString() || emp.id.toString())}
                                            className="w-32 rounded border px-2 py-1"
                                            placeholder="Rp 0"
                                            required
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-3 flex flex-col justify-end gap-4 md:flex-row">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Kembali
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" tabIndex={5} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi Simpan</AlertDialogTitle>
                                <AlertDialogDescription>Apakah Anda yakin ingin menyimpan perubahan ini?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSubmit} disabled={processing}>
                                    Ya, Simpan
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AppLayout>
    );
}
