<?php

namespace App\Services;

use App\Models\Division;
use App\Models\Store;
use App\Models\TopUp;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;

class ReportService
{

    public function getTotalTopUpThisYear(): float
    {
        return TopUp::thisYear()->success()->sum('amount');
    }

    public function getTotalTransactionThisYear(): float
    {
        return Transaction::thisYear()
            ->success()
            ->sum('amount');
    }

    public function getTotalEmployee(): int
    {
        return User::count();
    }

    public function getTotalStore(): int
    {
        return Store::count();
    }

    public function getTotalDivision(): int
    {
        return Division::count();
    }

    public function getMonthlyTopupAndTransaction(): array
    {
        $topupData = TopUp::thisYear()
            ->success()
            ->selectRaw('MONTH(created_at) as month, SUM(amount) as total_topup')
            ->groupByRaw('MONTH(created_at)')
            ->pluck('total_topup', 'month');

        $belanjaData = Transaction::thisYear()
            ->success()
            ->selectRaw('MONTH(created_at) as month, SUM(amount) as total_belanja')
            ->groupByRaw('MONTH(created_at)')
            ->pluck('total_belanja', 'month');

        $months = collect(range(1, 12))->map(function ($month) use ($topupData, $belanjaData) {
            return [
                'month' => Carbon::create()->month($month)->format('F'),
                'topup' => (int) ($topupData[$month] ?? 0),
                'belanja' => (int) ($belanjaData[$month] ?? 0),
            ];
        });

        return $months->toArray();
    }

    public function getDailyTransactionThisMonth(): array
    {
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $data = Transaction::selectRaw('DATE(created_at) as date, SUM(amount) as amount')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->success()
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => $item->date,
                'nominal' => (float) $item->amount,
            ])
            ->toArray();

        return $data;
    }
}
