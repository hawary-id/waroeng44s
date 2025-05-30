'use client';

import { DataTable } from '@/components/data-table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EmployeeWithRelations } from '@/types';
import { Head } from '@inertiajs/react';
import { history_top_up_columns } from './column/history_top_up_columns';
import { history_transaction_columns } from './column/history_transaction_columns';

interface Props {
    employee: EmployeeWithRelations;
}

export default function Show({ employee }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Karyawan',
            href: '/admin/employees',
        },
        {
            title: `${employee.name} - ${employee.code}` || '-',
            href: '/admin/employees/show',
        },
    ];

    const employeeStatus = employee?.status;
    const employeeLabelStatus = employeeStatus === 1 ? 'Aktif' : 'Nonaktif';
    const statusClass = employeeStatus === 0 ? 'bg-secondary font-bold text-destructive' : 'bg-secondary font-bold text-default';
    const balance = Number(employee.member_card?.balance ?? 0);
    const balanceFormatted = new Intl.NumberFormat('id-ID').format(balance);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Tabs defaultValue="account" className="w-full px-5 pt-5">
                <TabsList>
                    <TabsTrigger value="account">Akun</TabsTrigger>
                    <TabsTrigger value="transaction">Belanja</TabsTrigger>
                    <TabsTrigger value="topUp">Top Up</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card className="p-5">
                        <h1 className="font-bold">Data Karyawan</h1>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="user_code">ID Karyawan</Label>
                                <Input
                                    id="user_code"
                                    type="text"
                                    autoComplete="user_code"
                                    value={employee?.code || ''}
                                    readOnly={true}
                                    placeholder=" Nama Karyawan"
                                    className="bg-secondary text-primary font-bold"
                                />
                            </div>
                            <div>
                                <Label htmlFor="user_name">Nama Karyawan</Label>
                                <Input
                                    id="user_name"
                                    type="text"
                                    autoComplete="user_name"
                                    value={employee?.name || ''}
                                    readOnly={true}
                                    placeholder=" Nama Karyawan"
                                    className="bg-secondary"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={employee?.email || ''}
                                    readOnly={true}
                                    placeholder="Email Karyawan"
                                    className="bg-secondary"
                                />
                            </div>
                            <div>
                                <Label htmlFor="store_name">Toko</Label>
                                <Input
                                    id="store_name"
                                    type="text"
                                    autoComplete="store_name"
                                    value={employee?.store?.name || ''}
                                    readOnly={true}
                                    placeholder="Nama Toko"
                                    className="bg-secondary"
                                />
                            </div>
                            <div>
                                <Label htmlFor="division_name">Divisi</Label>
                                <Input
                                    id="division_name"
                                    type="text"
                                    autoComplete="division_name"
                                    value={employee?.division?.name || ''}
                                    readOnly={true}
                                    placeholder="Nama Divisi"
                                    className="bg-secondary"
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    type="text"
                                    autoComplete="status"
                                    value={employeeLabelStatus}
                                    readOnly={true}
                                    placeholder="Status"
                                    className={statusClass}
                                />
                            </div>
                        </div>
                        <Separator />
                        <h1 className="font-bold">Member Card</h1>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="card_number">Barcode</Label>
                                <Input
                                    id="card_number"
                                    type="text"
                                    autoComplete="employee_code"
                                    value={employee.member_card?.card_number || ''}
                                    readOnly={true}
                                    placeholder="Kode Member Card"
                                    className="bg-secondary text-primary font-bold"
                                />
                            </div>

                            <div>
                                <Label htmlFor="balance">Saldo</Label>
                                <h1 className="text-4xl font-bold text-blue-600">{balanceFormatted}</h1>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
                <TabsContent value="transaction">
                    <Card className="p-5">
                        <DataTable columns={history_transaction_columns} data={employee.member_card?.transactions ?? []} />
                    </Card>
                </TabsContent>
                <TabsContent value="topUp">
                    <Card className="p-5">
                        <DataTable columns={history_top_up_columns} data={employee.member_card?.top_ups ?? []} />
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="flex flex-col gap-4 p-5 md:flex-row md:justify-end">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Kembali
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">
                            Cetak Member Card
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    window.open(route('admin.member-cards.print', employee.member_card?.id), '_blank');
                                }}
                            >
                                Ya, Cetak
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
