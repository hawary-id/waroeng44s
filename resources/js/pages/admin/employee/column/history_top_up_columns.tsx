'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import CurrencyFormatter from '@/components/data-table-currency-formatter';
import { Badge } from '@/components/ui/badge';
import { transactionStatus } from '@/constants/transaction_status';
import { formatedDate } from '@/lib/utils';
import { TopUpWithRelations } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const history_top_up_columns: ColumnDef<TopUpWithRelations>[] = [
    {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Transaksi" />,
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
        accessorKey: 'top_up_by.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Top Up By" />,
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nominal" align="right" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            return <CurrencyFormatter amount={amount} />;
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
