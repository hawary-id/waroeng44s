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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { employeeStatus } from '@/constants/employee_status';
import AppLayout from '@/layouts/app-layout';
import { formatedDate } from '@/lib/utils';
import { BreadcrumbItem, Employee, EmployeeWithRelations, MemberCard, MemberCardWithRelations } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Member Card',
        href: '/admin/member-cards',
    },
    {
        title: 'Edit',
        href: '/admin/employees/edit',
    },
];

interface Props {
    memberCard: MemberCardWithRelations;
    employees: EmployeeWithRelations[];
}

export default function Edit({ memberCard, employees }: Props) {
    const { data, setData, put, processing, errors } = useForm<
        Partial<MemberCard> & { user_name?: string; division_name?: string; email?: string; store_name?: string; amount?: string }
    >({
        card_number: memberCard.card_number,
        balance: memberCard.balance,
        expired_at: formatedDate(memberCard.expired_at, 'yyyy-MM-dd'),
        user_id: memberCard.user_id,
        email: memberCard.user?.email,
        user_name: memberCard.user?.name,
        division_name: memberCard.user?.division?.name,
        store_name: memberCard.user?.store?.name,
        status: memberCard.status,
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
                        <CardTitle>Edit Member Card</CardTitle>
                        <CardDescription>{memberCard.card_number}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="user_id" required>
                                        Kode Karyawan
                                    </Label>
                                    <Select onValueChange={handleSelectEmployee} value={String(data.user_id || '')}>
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
                                        placeholder="Toko"
                                        className="bg-secondary"
                                    />
                                    <InputError message={errors.store_name} className="" />
                                </div>
                                <div>
                                    <Label htmlFor="balance" required>
                                        Saldo
                                    </Label>
                                    <Input
                                        id="balance"
                                        type="text"
                                        autoComplete="balance"
                                        value={new Intl.NumberFormat('id-ID').format(Number(data.balance || '0'))}
                                        readOnly={true}
                                        placeholder="Saldo"
                                        className="bg-secondary"
                                    />
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
                                        disabled={processing}
                                        placeholder="Tanggal Expired"
                                        className="block"
                                    />
                                    <InputError message={errors.expired_at} className="" />
                                </div>
                                <div>
                                    <Label htmlFor="active" required>Status</Label>

                                    <Select
                                        onValueChange={(value) => setData('status', value)}
                                        value={data.status !== undefined ? String(data.status) : ''}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Status" tabIndex={5} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(employeeStatus).map(([roleKey, roleName]) => (
                                                <SelectItem key={roleKey} value={roleKey}>
                                                    {roleName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.status} className="" />
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
                                    <AlertDialogAction onClick={() => put(route('admin.member-cards.update', memberCard.id))} disabled={processing}>
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
