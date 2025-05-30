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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Store } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Toko',
        href: '/admin/stores',
    },
    {
        title: 'Toko Baru',
        href: '/admin/stores/add',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Partial<Store>>({
        name: '',
        address: '',
        phone: '',
        email: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <form className="flex justify-center py-5">
                <Card className="w-full md:w-1/2">
                    <CardHeader>
                        <CardTitle>Buat Toko Baru</CardTitle>
                        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="name" required>
                                    Nama Toko
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
                                    placeholder="Nama Toko"
                                />
                                <InputError message={errors.name} className="" />
                            </div>
                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="phone">Telp.</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    tabIndex={2}
                                    autoComplete="phone"
                                    value={data.phone || ''}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    disabled={processing}
                                    placeholder="Telp."
                                />
                                <InputError message={errors.phone} className="" />
                            </div>

                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    tabIndex={3}
                                    autoComplete="email"
                                    value={data.email || ''}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="Email"
                                />
                                <InputError message={errors.email} className="" />
                            </div>

                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="address">Alamat</Label>
                                <Textarea
                                    id="address"
                                    tabIndex={4}
                                    autoComplete="address"
                                    value={data.address || ''}
                                    onChange={(e) => setData('address', e.target.value)}
                                    disabled={processing}
                                    placeholder="Alamat"
                                />
                                <InputError message={errors.address} className="" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href={route('admin.stores.index')}>
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
                                    <AlertDialogAction onClick={() => post(route('admin.stores.store'))} disabled={processing}>
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
