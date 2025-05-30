<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use App\Services\MemberCardService;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class TransactionController extends Controller
{
    protected $transactionService, $memberCardService;

    public function __construct(TransactionService $transactionService, MemberCardService $memberCardService)
    {
        $this->transactionService = $transactionService;
        $this->memberCardService = $memberCardService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = $this->transactionService->getAll();

        return Inertia::render('admin/transaction/index', [
            'transactions' => $transactions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $card_number = $request->card_number;

        if ($card_number) {
            $memberCard = $this->memberCardService->getByCardNumber($card_number, TRUE);
            if (!$memberCard) {
                return redirect()->back()->with([
                    'type' => 'error',
                    'message' => 'Member Card Tidak Aktif'
                ]);
            }
        } else {
            $memberCard = null;
        }
        return Inertia::render('admin/transaction/create', [
            'memberCard' => $memberCard
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TransactionRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->transactionService->createTransaction($request->validated());
            DB::commit();

            return redirect()->route('admin.transactions.index')->with([
                'type' => 'success',
                'message' => 'Data transaksi belanja berhasil disimpan!'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal simpan transaksi belanja', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data transaksi belanja.'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        try {
            $transaction->update([
                'status' => 'canceled'
            ]);

            return redirect()->route('admin.transactions.index')->with([
                'type' => 'success',
                'message' => 'Data transaksi berhasil dibatalkan'
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal membatalkan transaksi belanja', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal membatalkan transaksi belanja'
            ]);
        }
    }

    public function approve($id)
    {
        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->update([
                'status' => 'success'
            ]);

            return redirect()->route('admin.transactions.index')->with([
                'type' => 'success',
                'message' => 'Data transaksi berhasil di setujui.'
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal setujui transaksi belanja', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal setujui transaksi belanja'
            ]);
        }
    }
}
