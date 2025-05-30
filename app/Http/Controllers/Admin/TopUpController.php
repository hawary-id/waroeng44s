<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TopUpRequest;
use App\Models\TopUp;
use App\Services\MemberCardService;
use App\Services\TopUpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class TopUpController extends Controller
{
    protected $topUpService, $memberCardService;

    public function __construct(TopUpService $topUpService, MemberCardService $memberCardService)
    {
        $this->topUpService = $topUpService;
        $this->memberCardService = $memberCardService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $topUps = $this->topUpService->getAll();

        return Inertia::render('admin/top-up/index', [
            'topUps' => $topUps,
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
        return Inertia::render('admin/top-up/create', [
            'memberCard' => $memberCard
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->has('top_ups') && is_array($request->input('top_ups'))) {
            $topUps = collect($request->input('top_ups'))
                ->map(function ($amount, $member_card_id) {
                    return [
                        'member_card_id' => $member_card_id,
                        'amount' => $amount,
                    ];
                })
                ->values()
                ->all();
        } else {
            $topUps = [[
                'member_card_id' => $request->input('member_card_id'),
                'amount' => $request->input('amount'),
            ]];
        }

        foreach ($topUps as $topUp) {
            if (empty($topUp['member_card_id']) || empty($topUp['amount']) || !is_numeric($topUp['amount'])) {
                return redirect()->back()->withInput()->withErrors(['msg' => 'Data top up tidak valid']);
            }
        }

        DB::beginTransaction();
        try {
            $this->topUpService->createTopUp($topUps);
            DB::commit();

            return redirect()->route('admin.top-ups.index')->with([
                'type' => 'success',
                'message' => 'Top Up berhasil!'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal Top Up', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data top up.'
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
    public function destroy(TopUp $topUp)
    {
        try {
            $topUp->update([
                'status' => 'canceled'
            ]);
            return redirect()->route('admin.top-ups.index')->with([
                'type' => 'success',
                'message' => 'Data top up berhasil dibatalkan'
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal membatalkan transaksi top up', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal membatalkan transaksi top up'
            ]);
        }
    }

    public function approve(TopUp $topUp)
    {
        try {
            $topUp->update([
                'status' => 'success'
            ]);
            return redirect()->route('admin.top-ups.index')->with([
                'type' => 'success',
                'message' => 'Data top up berhasil di setujui.'
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal setujui transaksi top up', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal men setujui transaksi top up'
            ]);
        }
    }
}
