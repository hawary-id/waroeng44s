'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
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
import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Store } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

export const columns: ColumnDef<Store>[] = [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Toko" />,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Toko" />,
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Telp." />,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
        accessorKey: 'address',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Alamat" />,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const store = row.original;
            const [dialogOpen, setDialogOpen] = useState(false);
            const [dropdownOpen, setDropdownOpen] = useState(false);
            const triggerRef = useRef<HTMLButtonElement>(null);
            const {delete: destroy} = useForm();

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
                            <DropdownMenuItem>
                                <Link href={route('admin.stores.edit', store.id)} className="w-full">
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={openDeleteDialog} className="cursor-pointer" variant="destructive">
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                <AlertDialogAction className={buttonVariants({ variant: "destructive" })}
                                    onClick={() => {
                                        setDialogOpen(false);
                                        destroy(route('admin.stores.destroy', store.id));
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
