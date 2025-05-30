import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { EmployeeWithRelations } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

// Buat komponen input memo supaya tidak rerender kecuali prop berubah
const TopUpInput = React.memo(function TopUpInput({
    memberCardId,
    value,
    onAmountChange,
}: {
    memberCardId: string;
    value: string;
    onAmountChange: (id: string, value: string) => void;
}) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onAmountChange(memberCardId, e.target.value.replace(/\D/g, ''))}
            className="w-32 rounded border px-2"
            placeholder="Rp 0"
        />
    );
});

export function getTopUpColumns({
    getValue,
    onAmountChange,
}: {
    getValue: (memberCardId: string) => string;
    onAmountChange: (id: string, value: string) => void;
}): ColumnDef<EmployeeWithRelations>[] {
    return [
        {
            accessorKey: 'code',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Karyawan" />,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Karyawan" />,
        },
        {
            accessorKey: 'top_up',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Top Up" />,
            cell: ({ row }) => {
                const memberCardId = String(row.original.member_card?.id ?? '');
                const value = getValue(memberCardId);
                return <TopUpInput memberCardId={memberCardId} value={value} onAmountChange={onAmountChange} />;
            },
        },
    ];
}
