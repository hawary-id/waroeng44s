<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TopUp;
use App\Services\TopUpService;
use App\Services\TransactionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    protected $topUpService, $transactiionService;

    public function __construct(TopUpService $topUpService, TransactionService $transactionService)
    {
        $this->topUpService = $topUpService;
        $this->transactiionService = $transactionService;
    }

    public function topUp(Request $request)
    {
        $filters = $request->only('start_date', 'end_date');
        $print = $request->boolean('print');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $topUps = $this->topUpService->getAll($filters);

            $totalSuccess = $topUps->where('status', 'success')->sum('amount');
            $totalCanceled = $topUps->where('status', 'canceled')->sum('amount');
        } else {
            $topUps = collect();
        }

        if ($print) {
            $startDate = $filters['start_date'] ?? now()->format('Ymd');
            $endDate = $filters['end_date'] ?? now()->format('Ymd');

            $fileName = "report-top-up-{$startDate}_to_{$endDate}.pdf";

            $pdf = Pdf::loadView('pdfs.reports.top_up', [
                'topUps' => $topUps,
                'filters' => $filters,
                'totalSuccess' => $totalSuccess,
                'totalCanceled' => $totalCanceled,
            ])->setPaper('a4', 'landscape');

            return $pdf->download($fileName);
        }

        return Inertia::render('admin/report/top-up', [
            'filters' => $filters,
            'topUps' => $topUps,
        ]);
    }

    public function transaction(Request $request)
    {
        $filters = $request->only('start_date', 'end_date');
        $print = $request->boolean('print');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $transactions = $this->transactiionService->getAll($filters);
            $totalSuccess = $transactions->where('status', 'success')->sum('amount');
            $totalCanceled = $transactions->where('status', 'canceled')->sum('amount');
        } else {
            $transactions = collect();
        }

        if ($print) {
            $startDate = $filters['start_date'] ?? now()->format('Ymd');
            $endDate = $filters['end_date'] ?? now()->format('Ymd');

            $fileName = "report-transaction-{$startDate}_to_{$endDate}.pdf";

            $pdf = Pdf::loadView('pdfs.reports.transaction', [
                'transactions' => $transactions,
                'filters' => $filters,
                'totalSuccess' => $totalSuccess,
                'totalCanceled' => $totalCanceled,
            ])->setPaper('a4', 'landscape');
            return $pdf->download($fileName);
        }

        return Inertia::render('admin/report/transaction', [
            'filters' => $filters,
            'transactions' => $transactions,
        ]);
    }
}
