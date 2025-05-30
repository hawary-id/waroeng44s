'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/data-table-pagination';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    showHeaderTable?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, showHeaderTable = true }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');

    const newColumns = columns.map((col) => ({
        ...col,
        footer: (ctx: any) => {
            const colId = ctx.column.id;
            if (!colId || data.length === 0) return null;

            const firstRow = data[0] as Record<string, any>;
            const isNumericColumn = typeof firstRow[colId] === 'number';

            if (isNumericColumn) {
                const total = data.reduce((sum, row) => {
                    const value = (row as Record<string, any>)[colId];
                    return sum + (typeof value === 'number' ? value : 0);
                }, 0);

                return total.toLocaleString();
            }

            return null;
        },
    }));

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="">
            {showHeaderTable && (
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search..."
                        value={globalFilter ?? ''}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                        type="search"
                    />
                    <DataTableViewOptions table={table} />
                </div>
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <tfoot>
                        {table.getFooterGroups().map((footerGroup) => (
                            <TableRow key={footerGroup.id}>
                                {footerGroup.headers.map((header) => (
                                    <TableCell key={header.id} className={header.column.id === 'amount' ? 'text-right font-bold' : ''}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </tfoot>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
