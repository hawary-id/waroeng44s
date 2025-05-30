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
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MemberCard, MemberCardWithRelations } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Belanja',
        href: '/admin/transactions',
    },
    {
        title: 'Belanja Baru',
        href: '/admin/transactions/add',
    },
];

interface Props {
    memberCard: MemberCardWithRelations | null;
}

export default function Create({ memberCard }: Props) {
    const { data, setData, post, processing, errors } = useForm<
        Partial<MemberCard> & {
            amount?: string;
            user_name?: string;
            division_name?: string;
            email?: string;
            store_name?: string;
            new_balance?: string | number;
            member_card_id: string | number;
            receipt_code?: string;
        }
    >({
        member_card_id: memberCard?.id || '',
        card_number: memberCard?.card_number || '',
        balance: memberCard?.balance || '',
        new_balance: '0',
        user_id: memberCard?.user_id || '',
        amount: '',
        email: memberCard?.user?.email || '',
        user_name: memberCard?.user?.name || '',
        division_name: memberCard?.user?.division?.name || '',
        store_name: memberCard?.user?.store?.name || '',
        receipt_code: '',
    });

    const barcodeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        barcodeRef.current?.focus();
    }, []);

    async function handleScanOrManualInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.trim();
        setData((prevData) => ({
            ...prevData,
            card_number: value,
        }));

        if (value.length === 14) {
            try {
                const response = await axios.get(`/api/member-cards/${value}`);
                const memberCard = response.data;

                setData((prevData) => ({
                    ...prevData,
                    card_number: value,
                    member_card_id: memberCard.id,
                    balance: memberCard.balance,
                    new_balance: memberCard.balance,
                    user_id: String(memberCard.id),
                    user_name: memberCard.user?.name || '',
                    email: memberCard.user?.email || '',
                    division_name: memberCard.user?.division?.name || '',
                    store_name: memberCard.user?.store?.name || '',
                }));
            } catch (error) {
                setData((prevData) => ({
                    ...prevData,
                    member_card_id: '',
                    balance: '',
                    new_balance: '',
                    user_id: '',
                    user_name: '',
                    email: '',
                    division_name: '',
                    store_name: '',
                }));
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || 'Terjadi kesalahan';
                    toast.error(message);
                } else {
                    toast.error('Terjadi kesalahan tak terduga');
                }

                console.error('Card not found or API error', error);
            }
        }
    }

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/\D/g, '');
        const inputAmount = Number(numericValue);
        const balance = Number(data.balance) || 0;

        if (inputAmount > balance) {
            toast.error('Saldo tidak mencukupi untuk transaksi ini.');
            return;
        }

        const formattedValue = new Intl.NumberFormat('id-ID').format(inputAmount);
        const newBalance = balance - inputAmount;

        setData((prevData) => ({
            ...prevData,
            amount: numericValue,
            new_balance: newBalance,
        }));

        e.target.value = formattedValue;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <form className="flex justify-center py-5">
                <Card className="w-full md:w-1/2">
                    <CardHeader>
                        <CardTitle>Transaksi Belanja Baru</CardTitle>
                        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="card_number" required>
                                        Barcode
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="card_number"
                                        value={data.card_number || ''}
                                        ref={barcodeRef}
                                        onChange={handleScanOrManualInput}
                                        placeholder="Barcode"
                                        maxLength={14}
                                    />
                                    <InputError message={errors.member_card_id} className="" />
                                </div>
                            </div>
                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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
                                        autoFocus
                                        autoComplete="balance"
                                        value={new Intl.NumberFormat('id-ID').format(Number(data.balance)) || ''}
                                        readOnly={true}
                                        placeholder="Saldo Awal"
                                        className="bg-secondary"
                                    />
                                    <InputError message={errors.balance} className="" />
                                </div>
                            </div>
                            <Separator className="mb-5" />
                            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="receipt_code" required>
                                        Kode Struk
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        tabIndex={2}
                                        value={data.receipt_code || ''}
                                        onChange={(e) => setData('receipt_code', e.target.value)}
                                        placeholder="Kode Struk"
                                    />
                                    <InputError message={errors.receipt_code} className="" />
                                </div>
                                <div>
                                    <Label htmlFor="amount" required>
                                        Nominal Transaksi
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="text"
                                        tabIndex={3}
                                        autoComplete="amount"
                                        value={new Intl.NumberFormat('id-ID').format(Number(data.amount || '0'))}
                                        onChange={handleAmountChange}
                                        disabled={processing}
                                        placeholder="Nominal Transaksi"
                                    />
                                    <InputError message={errors.amount} className="" />
                                </div>
                                <div>
                                    <Label htmlFor="new_balance" required>
                                        Sisa Saldo
                                    </Label>
                                    <h1 className="text-4xl font-bold text-blue-600">
                                        {new Intl.NumberFormat('id-ID').format(Number(data.new_balance))}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Kembali
                        </Button>
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.transactions.create')}>
                                <Button type="button" variant={'secondary'}>
                                    Kosongkan
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
                                        <AlertDialogAction onClick={() => post(route('admin.transactions.store'))} disabled={processing}>
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
