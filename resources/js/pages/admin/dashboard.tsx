import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { ChartMonthly, dailyTransaction, TransactionWithRelations, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Combine, DollarSign, ShoppingCart, Store, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import { columns } from './transaction/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const chartConfig = {
    topup: {
        label: 'Top Up',
        color: '#60a5fa',
    },
    belanja: {
        label: 'Belanja',
        color: '#9ca3af',
    },
} satisfies ChartConfig;

interface IndexProps {
    totalTopUp: number;
    totalTransaction: number;
    totalEmployee: number;
    totalStore: number;
    totalDivision: number;
    chartData: ChartMonthly[];
    dailyTransactions: dailyTransaction[];
    transactions: TransactionWithRelations[];
}
export default function Dashboard({ totalTransaction, totalTopUp, totalEmployee,totalStore,totalDivision, transactions, dailyTransactions, chartData }: IndexProps) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const formatedNumber = (value: number) => {
        const displayNumber = new Intl.NumberFormat('en-US', {
            // style: 'currency',
            currency: 'IDR',
        }).format(value);

        return displayNumber;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="px-3 py-5">
                <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
                    <div className="group relative w-full rounded-lg border p-3 shadow-sm md:p-4">
                        <p className="text-muted-foreground mb-2 text-sm">Total Top Up (2025)</p>
                        <span className="text-lg font-bold text-sky-600 md:text-2xl">{formatedNumber(totalTopUp)}</span>
                        <DollarSign
                            size={40}
                            className="absolute top-3 right-3 text-sky-600/40 transition-all duration-300 ease-in-out group-hover:scale-110 md:top-4 md:right-4"
                        />
                    </div>

                    <div className="group relative w-full rounded-lg border p-3 shadow-sm md:p-4">
                        <p className="text-muted-foreground mb-2 text-sm">Total Belanja (2025)</p>
                        <span className="text-lg font-bold text-sky-600 md:text-2xl">{formatedNumber(totalTransaction)}</span>
                        <ShoppingCart
                            size={40}
                            className="absolute top-3 right-3 text-sky-600/40 transition-all duration-300 ease-in-out group-hover:scale-110 md:top-4 md:right-4"
                        />
                    </div>

                    <div className="group relative w-full rounded-lg border p-3 shadow-sm md:p-4">
                        <p className="text-muted-foreground mb-2 text-sm">Total Karyawan</p>
                        <span className="text-lg font-bold text-sky-600 md:text-2xl">{formatedNumber(totalEmployee)}</span>
                        <Users
                            size={40}
                            className="absolute top-3 right-3 text-sky-600/40 transition-all duration-300 ease-in-out group-hover:scale-110 md:top-4 md:right-4"
                        />
                    </div>

                    <div className="group relative w-full rounded-lg border p-3 shadow-sm md:p-4">
                        <p className="text-muted-foreground mb-2 text-sm">Total Toko</p>
                        <span className="text-lg font-bold text-sky-600 md:text-2xl">{formatedNumber(totalStore)}</span>
                        <Store
                            size={40}
                            className="absolute top-3 right-3 text-sky-600/40 transition-all duration-300 ease-in-out group-hover:scale-110 md:top-4 md:right-4"
                        />
                    </div>
                    <div className="group relative w-full rounded-lg border p-3 shadow-sm md:p-4">
                        <p className="text-muted-foreground mb-2 text-sm">Total Divisi</p>
                        <span className="text-lg font-bold text-sky-600 md:text-2xl">{formatedNumber(totalDivision)}</span>
                        <Combine
                            size={40}
                            className="absolute top-3 right-3 text-sky-600/40 transition-all duration-300 ease-in-out group-hover:scale-110 md:top-4 md:right-4"
                        />
                    </div>
                </div>

                <div className="mb-5 flex flex-col gap-5 md:flex-row">
                    <Card className="w-full md:w-1/3">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <span>Transaksi {currentYear}</span>
                            <span className="font-semibold">[MONTHLY]</span>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px] w-full md:h-[350px]">
                                <BarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="topup" fill="var(--color-topup)" radius={4}>
                                        <LabelList
                                            dataKey="topup"
                                            position="top"
                                            content={({ x, y, width, value }: any) => {
                                                const formattedValue = new Intl.NumberFormat('id-ID').format(value);
                                                return (
                                                    <text x={x + width / 2} y={y - 5} fontSize={12} fill="#000" textAnchor="middle">
                                                        {formattedValue}
                                                    </text>
                                                );
                                            }}
                                        />
                                    </Bar>

                                    <Bar dataKey="belanja" fill="var(--color-belanja)" radius={4}>
                                        <LabelList
                                            dataKey="belanja"
                                            position="top"
                                            content={({ x, y, width, value }: any) => {
                                                const formattedValue = new Intl.NumberFormat('id-ID').format(value);
                                                return (
                                                    <text x={x + width / 2} y={y - 5} fontSize={12} fill="#000" textAnchor="middle">
                                                        {formattedValue}
                                                    </text>
                                                );
                                            }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="w-full md:w-2/3">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <span>Transaksi Belanja {currentMonth}</span>
                            <span className="font-semibold">[DAILY]</span>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px] w-full md:h-[350px]">
                                <BarChart accessibilityLayer data={dailyTransactions}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend payload={[{ id: 'belanja', value: 'Belanja', type: 'square', color: 'var(--color-belanja)' }]} />

                                    <Bar dataKey="nominal" fill="var(--color-belanja)" radius={4}>
                                        <LabelList
                                            dataKey="nominal"
                                            position="top"
                                            content={({ x, y, width, value }: any) => {
                                                const formattedValue = new Intl.NumberFormat('id-ID').format(value);
                                                return (
                                                    <text x={x + width / 2} y={y - 5} fontSize={12} fill="#000" textAnchor="middle">
                                                        {formattedValue}
                                                    </text>
                                                );
                                            }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h1>Transaksi Belanja Terbaru</h1>
                        <Link href={route('admin.transactions.index')}>
                            <Button>Semua Transaksi</Button>
                        </Link>
                    </CardHeader>

                    <CardContent>
                        <DataTable columns={columns(false)} showHeaderTable={false} data={transactions} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
