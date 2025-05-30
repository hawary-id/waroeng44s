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
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Employee, EmployeeWithRelations, MemberCard } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Member Card',
        href: '/admin/member-cards',
    },
    {
        title: 'Member Card Baru',
        href: '/admin/employees/add',
    },
];

interface Props {
    employees: EmployeeWithRelations[];
}

export default function Create({ employees }: Props) {
    const { data, setData, post, processing, errors } = useForm<
        Partial<MemberCard> & { amount?: string; user_name?: string; division_name?: string; email?: string; store_name?: string }
    >({
        card_number: '',
        expired_at: '',
        user_id: '',
        amount: '',
        email: '',
        user_name: '',
        division_name: '',
        store_name: '',
    });

    function handleSelectEmployee(value: string) {
        const selectedEmployee = employees.find((employee) => String(employee.id) === value);

        setData((prevData) => ({
            ...prevData,
            user_id: value,
            user_name: selectedEmployee?.name || '',
            email: selectedEmployee?.email || '',
            division_name: selectedEmployee?.division?.name || '',
            store_name: selectedEmployee?.store?.name || '',
        }));
    }

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/\D/g, '');
        const formattedValue = new Intl.NumberFormat('id-ID').format(Number(numericValue));
        setData('amount', numericValue);
        e.target.value = formattedValue;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <form className="flex justify-center py-5">
                <Card className="w-full md:w-1/2">
                    <CardHeader>
                        <CardTitle>Buat Member Card Baru</CardTitle>
                        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="user_id" required>
                                        Kode Karyawan
                                    </Label>
                                    <Select onValueChange={handleSelectEmployee}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Kode Karyawan" tabIndex={1} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee: Employee) => (
                                                <SelectItem key={employee.id} value={String(employee.id)}>
                                                    {employee.code} - {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.user_id} className="" />
                                </div>

                                <div>
                                    <Label htmlFor="user_name" required>
                                        Nama Karyawan
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        value={data.user_name || ''}
                                        readOnly={true}
                                        placeholder=" Nama Karyawan"
                                        className="bg-secondary"
                                    />
                                    <InputError message={errors.user_name} className="" />
                                </div>

                                <div>
                                    <Label htmlFor="email" required>
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        autoComplete="email"
                                        value={data.email || ''}
                                        readOnly={true}
                                        placeholder=" Email"
                                        className="bg-secondary"
                                    />
                                    <InputError message={errors.email} className="" />
                                </div>

                                <div>
                                    <Label htmlFor="division_name" required>
                                        Divisi
                                    </Label>
                                    <Input
                                        id="division_name"
                                        type="text"
                                        autoComplete="name"
                                        value={data.division_name || ''}
                                        readOnly={true}
                                        placeholder=" Divisi"
                                        className="bg-secondary"
                                    />
                                    <InputError message={errors.division_name} className="" />
                                </div>

                                <div>
                                    <Label htmlFor="store_name" required>
                                        Toko
                                    </Label>
                                    <Input
                                        id="store_name"
                                        type="text"
                                        autoComplete="store_name"
                                        value={data.store_name || ''}
                                        readOnly={true}
                                        placeholder=" Toko"
                                        className="bg-secondary"
                                    />
                                    <InputError message={errors.store_name} className="" />
                                </div>
                            </div>
                            <Separator className="mb-5" />
                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="expired_at" required>
                                        Tanggal Expired
                                    </Label>
                                    <Input
                                        id="expired_at"
                                        type="date"
                                        tabIndex={2}
                                        autoComplete="expired_at"
                                        value={data.expired_at || ''}
                                        onChange={(e) => setData('expired_at', e.target.value)}
                                        readOnly={processing}
                                        placeholder="Tanggal Expired"
                                        className="block"
                                    />
                                    <InputError message={errors.expired_at} className="" />
                                </div>
                                <div>
                                    <Label htmlFor="amount">Top Up Saldo</Label>
                                    <Input
                                        id="amount"
                                        type="text"
                                        tabIndex={3}
                                        autoComplete="amount"
                                        value={new Intl.NumberFormat('id-ID').format(Number(data.amount || '0'))}
                                        onChange={handleAmountChange}
                                        readOnly={processing}
                                        placeholder="Top Up Saldo"
                                    />
                                    <InputError message={errors.amount} className="" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href={route('admin.member-cards.index')}>
                            <Button type="button" variant="outline">
                                Kembali
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.member-cards.create')}>
                                <Button type="button" variant={'secondary'}>
                                    Hapus
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
                                        <AlertDialogAction onClick={() => post(route('admin.member-cards.store'))} disabled={processing}>
                                            Ya, Simpan
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </AppLayout>
    );
}
