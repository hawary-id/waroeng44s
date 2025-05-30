'use client';

import { DataTable } from '@/components/data-table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatedDate } from '@/lib/utils';
import { BreadcrumbItem, MemberCardWithRelations } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { top_up_columns } from '../employee/column/history_top_up_columns';
import { Button } from '@/components/ui/button';

interface Props {
    memberCard: MemberCardWithRelations;
}

export default function Show({ memberCard }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Member Card',
            href: '/admin/member-cards',
        },
        {
            title: memberCard.card_number || '-',
            href: '/admin/employees/show',
        },
    ];

    const employeeStatus = memberCard.user?.status;
    const employeeLabelStatus = employeeStatus === 1 ? 'Aktif' : 'Nonaktif';
    const statusClass = employeeStatus === 0 ? 'bg-secondary font-bold text-destructive' : 'bg-secondary font-bold text-default';
    const balanceFormated = new Intl.NumberFormat('id-ID').format(Number(memberCard.balance)) || '';

    const memberCardStatus = memberCard.active;
    const memberCardLabelStatus = memberCardStatus === 1 ? 'Aktif' : 'Nonaktif';
    const memberCardstatusClass = memberCardStatus === 0 ? 'bg-secondary font-bold text-destructive' : 'bg-secondary font-bold text-default';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Tabs defaultValue="account" className="w-full p-5">
                <TabsList>
                    <TabsTrigger value="account">Akun</TabsTrigger>
                    <TabsTrigger value="transaction">Transaksi</TabsTrigger>
                    <TabsTrigger value="topUp">Top Up</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card className="p-5">
                        <h1 className="font-bold">Member Card</h1>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="card_number">Barcode</Label>
                                <Input
                                    id="card_number"
                                    type="text"
                                    autoComplete="employee_code"
                                    value={memberCard.card_number || ''}
                                    readOnly={true}
                                    placeholder="Kode Member Card"
                                    className="bg-secondary text-primary font-bold"
                                />
                            </div>
                            <div>
                                <Label htmlFor="expired_at">Expired Date</Label>
                                <Input
                                    id="expired_at"
                                    type="date"
                                    autoComplete="expired_at"
                                    value={formatedDate(memberCard.expired_at, 'yyyy-MM-dd') || ''}
                                    readOnly={true}
                                    placeholder="Expired Date"
                                    className="bg-secondary"
                                />
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    type="text"
                                    autoComplete="status"
                                    value={memberCardLabelStatus}
                                    readOnly={true}
                                    placeholder="Status"
                                    className={memberCardstatusClass}
                                />
                            </div>
                            <div>
                                <Label htmlFor="balance">Saldo</Label>
                                <h1 className="text-4xl font-bold text-blue-600">{balanceFormated}</h1>
                            </div>
                        </div>
                        <Separator />
                        <h1 className="font-bold">Data Karyawan</h1>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="user_code">ID Karyawan</Label>
                                <Input
                                    id="user_code"
                                    type="text"
                                    autoComplete="user_code"
                                    value={memberCard.user?.code || ''}
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
                                    value={memberCard.user?.name || ''}
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
                                    value={memberCard.user?.email || ''}
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
                                    value={memberCard.user?.store?.name || ''}
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
                                    value={memberCard.user?.division?.name || ''}
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
                    </Card>
                </TabsContent>
                <TabsContent value="transaction">
                    <Card className="p-5">Transaction</Card>
                </TabsContent>
                <TabsContent value="topUp">
                    <Card className="p-5">
                        <DataTable columns={top_up_columns} data={memberCard.top_ups} />
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="flex justify-end px-5 gap-4">
                <Link href={route('admin.member-cards.index')}>
                    <Button type="button" variant="outline">
                        Kembali
                    </Button>
                </Link>
            </div>
        </AppLayout>
    );
}
