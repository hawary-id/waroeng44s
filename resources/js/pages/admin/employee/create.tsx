'use client';

import InputError from '@/components/input-error';
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allRoles } from '@/constants/roles';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Division, Employee, Store } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Karyawan',
        href: '/admin/employees',
    },
    {
        title: 'Karyawan Baru',
        href: '/admin/employees/add',
    },
];

interface Props {
    divisions: Division[];
    stores: Store[];
}

export default function Create({ stores, divisions }: Props) {
    const { data, setData, post, processing, errors } = useForm<Partial<Employee>>({
        name: '',
        email: '',
        role: '',
        division_id: '',
        store_id: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <form className="flex justify-center py-5">
                <Card className="w-full md:w-1/2">
                    <CardHeader>
                        <CardTitle>Buat Karyawan Baru</CardTitle>
                        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="name" required>
                                    Nama Karyawan
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name || ''}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nama Karyawan"
                                />
                                <InputError message={errors.name} className="" />
                            </div>
                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="email" required>Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email || ''}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="Email"
                                />
                                <InputError message={errors.email} className="" />
                            </div>

                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="role" required>
                                    Role
                                </Label>
                                <Select onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Role" tabIndex={4} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(allRoles).map(([roleKey, roleName]) => (
                                            <SelectItem key={roleKey} value={roleKey}>
                                                {roleName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.role} className="" />
                            </div>

                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="division_id" required>
                                    Divisi
                                </Label>
                                <Select onValueChange={(value) => setData('division_id', value)} disabled={processing}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Divisi" tabIndex={4} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {divisions.map((division: Division) => (
                                            <SelectItem key={division.id} value={String(division.id)}>
                                                {division.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.division_id} className="" />
                            </div>

                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="store_id">
                                    Toko
                                </Label>
                                <Select onValueChange={(value) => setData('store_id', value)} disabled={processing}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Toko" tabIndex={4} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stores.map((store: Store) => (
                                            <SelectItem key={store.id} value={String(store.id)}>
                                                {store.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.store_id} className="" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href={route('admin.employees.index')}>
                            <Button type="button" variant="outline">
                                Kembali
                            </Button>
                        </Link>
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
                                    <AlertDialogAction onClick={() => post(route('admin.employees.store'))} disabled={processing}>
                                        Ya, Simpan
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </form>
        </AppLayout>
    );
}
