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
        footer: (props) => {
                    const data = props.table.options.data as TopUpWithRelations[];

                    const total = data.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
                    const totalCanceled = data.filter((row) => row.status === 'canceled').reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

                    const finalTotal = total - totalCanceled;

                    const formatCurrency = (value: number) => value.toLocaleString('id-ID', { currency: 'IDR' });

                    if (finalTotal === 0) return null;

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
