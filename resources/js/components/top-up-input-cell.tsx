'use client';

import { Input } from '@/components/ui/input';

interface TopUpInputCellProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TopUpInputCell({ value, onChange }: TopUpInputCellProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = e.target.value.replace(/\D/g, '');
        onChange(numeric);
    };

    return (
        <Input
            type="text"
            className="w-32"
            value={new Intl.NumberFormat('id-ID').format(Number(value || '0'))}
            onChange={handleChange}
            placeholder="Rp 0"
        />
    );
}
