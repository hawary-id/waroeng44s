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
import { employeeStatus } from '@/constants/employee_status';
import { EmployeeWithRelations } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

export const employee_columns: ColumnDef<EmployeeWithRelations>[] = [
    {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Karyawan" />,
        cell: ({ row }) => {
            const employeeCode = row.original.code;
            return (
                <Link href={route('admin.employees.show', row.original.id)} className="text-blue-700">
                    {employeeCode}
                </Link>
            );
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Karyawan" />,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
        accessorKey: 'division.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Divisi" />,
    },
    {
        accessorKey: 'store.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Toko" />,
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    },
    {
        accessorKey: 'member_card.card_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Member Card" />,
        cell: ({ row }) => {
            const memberCardCode = row.original.member_card?.card_number;
            return (
                <Link href={route('admin.employees.show', row.original.id)} className="text-blue-700">
                    {memberCardCode}
                </Link>
            );
        },
    },

    {
        accessorKey: 'member_card.balance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo" />,
        cell: ({ row }) => {
            const balance = parseFloat(row.original?.member_card?.balance ?? '0');
            return <CurrencyFormatter amount={balance} />;
        },
    },

    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.original.status as keyof typeof employeeStatus;
            const badgeVariant = status == '1' ? 'default' : 'destructive';
            return <Badge variant={badgeVariant}>{employeeStatus[status as keyof typeof employeeStatus]}</Badge>;
        },
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            const employee = row.original;
            const memberCardId = row.original?.member_card?.id;
            const [dialogOpen, setDialogOpen] = useState(false);
            const [dialogPrintOpen, setDialogPrintOpen] = useState(false);
            const [dropdownOpen, setDropdownOpen] = useState(false);
            const triggerRef = useRef<HTMLButtonElement>(null);
            const { get, delete: destroy } = useForm();

            const openDeleteDialog = (e: Event) => {
                e.preventDefault();
                setDropdownOpen(false);
                setTimeout(() => setDialogOpen(true), 100);
            };

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
                            <DropdownMenuItem>
                                <Link href={route('admin.employees.show', employee.id)} className="w-full">
                                    Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={route('admin.employees.edit', employee.id)} className="w-full">
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={openPrintDialog} className="cursor-pointer">
                                Cetak
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={openDeleteDialog} className="cursor-pointer" variant="destructive">
                                Hapus
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
                                    className={buttonVariants({ variant: 'default' })}
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

                    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data secara permanen dari server.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDialogOpen(false)}>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className={buttonVariants({ variant: 'destructive' })}
                                    onClick={() => {
                                        setDialogOpen(false);
                                        destroy(route('admin.employees.destroy', employee.id));
                                    }}
                                >
                                    Ya, Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        },
    },
];
