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
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Division } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function Edit({ division }: { division: Division }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisi',
            href: '/admin/divisions',
        },
        {
            title: 'Edit',
            href: '/admin/divisions/edit',
        },
    ];
    const { data, setData, put, processing, errors } = useForm<Required<Division>>({
        id: division.id,
        name: division.name,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <form className="flex justify-center py-5">
                <Card className="w-full md:w-1/2">
                    <CardHeader>
                        <CardTitle>Edit Divisi</CardTitle>
                        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            <div className="mb-5 grid gap-2">
                                <Label htmlFor="name" required>
                                    Nama Divisi
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
                                    placeholder="Nama Divisi"
                                />
                                <InputError message={errors.name} className="" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href={route('admin.divisions.index')}>
                            <Button type="button" variant="outline">
                                Kembali
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" tabIndex={2} disabled={processing}>
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
                                    <AlertDialogAction onClick={() => put(route('admin.divisions.update', division.id))} disabled={processing}>
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
