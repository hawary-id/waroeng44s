<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $transactionService, $reportService;

    public function __construct(TransactionService $transactionService,ReportService $reportService)
    {
        $this->transactionService = $transactionService;
        $this->reportService = $reportService;
    }

    public function dashboard()
    {
        $filters = [
            'limit' => 10
        ];

        $totalTopUp = $this->reportService->getTotalTopUpThisYear();
        $totalTransaction = $this->reportService->getTotalTransactionThisYear();
        $totalEmployee = $this->reportService->getTotalEmployee();
        $totalStore = $this->reportService->getTotalStore();
        $totalDivision = $this->reportService->getTotalDivision();

        $transactions = $this->transactionService->getAll($filters);
        $chartData = $this->reportService->getMonthlyTopupAndTransaction();

        $dailyTransactions = $this->reportService->getDailyTransactionThisMonth();

        return Inertia::render('admin/dashboard', [
            'totalTopUp' => $totalTopUp,
            'totalTransaction' => $totalTransaction,
            'totalEmployee' => $totalEmployee,
            'totalStore' => $totalStore,
            'totalDivision' => $totalDivision,
            'chartData' => $chartData,
            'dailyTransactions' => $dailyTransactions,
            'transactions' => $transactions,
        ]);
    }
}
