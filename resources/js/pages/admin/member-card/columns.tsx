'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import CurrencyFormatter from '@/components/data-table-currency-formatter';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { employeeStatus } from '@/constants/employee_status';
import { MemberCardWithRelations } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

export const columns: ColumnDef<MemberCardWithRelations>[] = [
    {
        accessorKey: 'card_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Barcode" />,
        cell: ({ row }) => {
            const cardNumber = row.original.card_number;
            return (
                <Link href={route('admin.employees.show', row.original.user?.id)} className="text-blue-700">
                    {cardNumber}
                </Link>
            );
        },
    },
    {
        accessorKey: 'user.code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Karyawan" />,
        cell: ({ row }) => {
            const employeeCode = row.original.user?.code;
            return (
                <Link href={route('admin.employees.show', row.original.user?.id)} className="text-blue-700">
                    {employeeCode}
                </Link>
            );
        },
    },
    {
        accessorKey: 'user.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Karyawan" />,
    },
    {
        accessorKey: 'user.store.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Toko" />,
    },
    {
        accessorKey: 'user.division.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="divisi" />,
    },
    {
        accessorKey: 'issued_by.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dibuat" />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.original.user?.status as keyof typeof employeeStatus;
            const badgeVariant = status == '1' ? 'default' : 'destructive';
            return <Badge variant={badgeVariant}>{employeeStatus[status as keyof typeof employeeStatus]}</Badge>;
        },
    },
    {
        accessorKey: 'balance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo" align="right" />,
        cell: ({ row }) => {
            const balance = parseFloat(row.getValue('balance'));
            return <CurrencyFormatter amount={balance} />;
        },
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            const memberCardId = row.original.id;
            const [dialogOpen, setDialogOpen] = useState(false);
            const [dialogPrintOpen, setDialogPrintOpen] = useState(false);

            const [dropdownOpen, setDropdownOpen] = useState(false);
            const triggerRef = useRef<HTMLButtonElement>(null);
            const { delete: destroy } = useForm();

            const openPrintDialog = (e: Event) => {
                e.preventDefault();
                setDropdownOpen(false);
                setTimeout(() => setDialogPrintOpen(true), 100);
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
                            <DropdownMenuItem onSelect={openPrintDialog} className="cursor-pointer">
                                Cetak
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog open={dialogPrintOpen} onOpenChange={setDialogPrintOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda ingin cetak kartu member karyawan ini?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDialogPrintOpen(false)}>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        setDialogPrintOpen(false);
                                        window.open(route('admin.member-cards.print', memberCardId), '_blank');
                                    }}
                                >
                                    Ya, Cetak
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        },
    },
];
