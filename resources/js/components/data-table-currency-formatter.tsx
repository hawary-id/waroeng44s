import React from 'react';

interface CurrencyFormatterProps {
    amount: number;
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({ amount }) => {
    const formatted = new Intl.NumberFormat('en-US', {
        // style: 'currency',
        currency: 'IDR',
    }).format(amount);

    return <div className="text-right font-medium">{formatted}</div>;
};

export default CurrencyFormatter;
