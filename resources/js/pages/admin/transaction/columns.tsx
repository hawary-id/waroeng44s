'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import CurrencyFormatter from '@/components/data-table-currency-formatter';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { transactionStatus } from '@/constants/transaction_status';
import { formatedDate } from '@/lib/utils';
import { TransactionWithRelations } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

export const columns = (showActions: boolean = true): ColumnDef<TransactionWithRelations>[] => {
    const columns: ColumnDef<TransactionWithRelations>[] = [
        {
            accessorKey: 'code',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Transaksi" />,
        },
        {
            accessorKey: 'member_card.card_number',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Barcode" />,
            cell: ({ row }) => {
                const cardNumber = row.original.member_card?.card_number;
                return (
                    <Link href={route('admin.employees.show', row.original.member_card?.user_id)} className="text-blue-700">
                        {cardNumber}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'member_card.user.name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Karyawan" />,
        },
        {
            accessorKey: 'member_card.user.store.name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Toko" />,
        },
        {
            accessorKey: 'member_card.user.division.name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Divisi" />,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Waktu Transaksi" />,
            cell: ({ row }) => {
                const expiredDate = row.original.created_at;
                const expiredDateFormated = formatedDate(expiredDate, 'yyyy-MM-dd HH:mm:ss');
                return expiredDateFormated;
            },
        },
        {
            accessorKey: 'receipt_code',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Struk" />,
        },
        {
            accessorKey: 'performed_by.name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction By" />,
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Nominal" align="right" />,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('amount'));
                return <CurrencyFormatter amount={amount} />;
            },
            footer: (props) => {
                const data = props.table.options.data as TransactionWithRelations[];

                const total = data.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

                const totalCanceled = data.filter((row) => row.status === 'canceled').reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

                const finalTotal = total - totalCanceled;

                const formatCurrency = (value: number) => value.toLocaleString('id-ID', { currency: 'IDR' });

                return (
                    <div>
                        {`${formatCurrency(total)} - ${formatCurrency(totalCanceled)} = `}
                        <strong>{formatCurrency(finalTotal)}</strong>
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.original.status as keyof typeof transactionStatus;
                const badgeVariant = status == 'success' ? 'default' : 'destructive';
                return <Badge variant={badgeVariant}>{transactionStatus[status as keyof typeof transactionStatus]}</Badge>;
            },
        },
    ];
    if (showActions) {
        columns.push({
            id: 'actions',
            cell: ({ row }) => {
                const transaction = row.original;
                const [dialogApproveOpen, setDialogApproveOpen] = useState(false);
                const [dialogOpen, setDialogOpen] = useState(false);

                const [dropdownOpen, setDropdownOpen] = useState(false);
                const triggerRef = useRef<HTMLButtonElement>(null);
                const { put, delete: destroy } = useForm();

                const openApproveDialog = (e: Event) => {
                    e.preventDefault();
                    setDropdownOpen(false);
                    setTimeout(() => setDialogApproveOpen(true), 100);
                };

                const openDeleteDialog = (e: Event) => {
                    e.preventDefault();
                    setDropdownOpen(false);
                    setTimeout(() => setDialogOpen(true), 100);
                };

                return (
                    <>
                        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" ref={triggerRef}>
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {transaction.status === 'canceled' ? (
                                    <DropdownMenuItem onSelect={openApproveDialog} className="cursor-pointer">
                                        Approve
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onSelect={openDeleteDialog} className="cursor-pointer" variant="destructive">
                                        Cancel
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog open={dialogApproveOpen} onOpenChange={setDialogApproveOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                    <AlertDialogDescription>Tindakan ini akan merubah status transaksi belanja.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDialogApproveOpen(false)}>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        className={buttonVariants({ variant: 'default' })}
                                        onClick={() => {
                                            setDialogApproveOpen(false);
                                            put(route('admin.transactions.approve', transaction.id));
                                        }}
                                    >
                                        Ya, Approve
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                    <AlertDialogDescription>Tindakan ini akan membatalkan transaksi belanja.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDialogOpen(false)}>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        className={buttonVariants({ variant: 'destructive' })}
                                        onClick={() => {
                                            setDialogOpen(false);
                                            destroy(route('admin.transactions.destroy', transaction.id));
                                        }}
                                    >
                                        Ya, Cancel
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                );
            },
        });
    }
    return columns;
};
