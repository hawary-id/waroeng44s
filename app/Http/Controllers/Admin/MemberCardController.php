<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberCardRequest;
use App\Http\Requests\UpdateMemberCardRequest;
use App\Models\MemberCard;
use App\Services\EmployeeService;
use App\Services\MemberCardService;
use App\Services\TopUpService;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class MemberCardController extends Controller
{
    protected $employeeService, $memberCardService, $topUpService;

    public function __construct(
        MemberCardService $memberCardService,
        EmployeeService $employeeService,
        TopUpService $topUpService,
    ) {
        $this->memberCardService = $memberCardService;
        $this->employeeService = $employeeService;
        $this->topUpService = $topUpService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $memberCards = $this->memberCardService->getAll();

        return Inertia::render('admin/member-card/index', [
            'memberCards' => $memberCards,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = $this->employeeService->getAll(true, true, 'id', 'ASC');

        return Inertia::render('admin/member-card/create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MemberCardRequest $request)
    {
        $data = $request->except([
            'email',
            'user_name',
            'division_name',
            'store_name',
        ]);

        DB::beginTransaction();
        try {
            $memberCard = $this->memberCardService->createMemberCard($data);

            $data = [
                'amount' => $data['amount'],
                'member_card_id' => $memberCard['id'],
            ];
            if (!empty($data['amount']) && $data['amount'] > 0) {
                $topUpData = [
                    'amount' => $data['amount'],
                    'member_card_id' => $memberCard['id'],
                ];
                $this->topUpService->createTopUp($topUpData);
            }

            DB::commit();

            return redirect()->route('admin.member-cards.index')->with([
                'type' => 'success',
                'message' => 'Data member card berhasil disimpan!'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal membuat member card', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data member card.'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $memberCard = MemberCard::with([
            'topUps' => function ($query) {
                $query->orderBy('id', 'desc');
            },
            'topUps.topUpBy',
            'user.division',
            'user.store',
            'transactions' => function ($query) {
                $query->orderBy('id', 'desc');
            },
        ])->where('id', $id)->first();


        return Inertia::render('admin/member-card/show', [
            'memberCard' => $memberCard
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MemberCard $memberCard)
    {
        try {
            $memberCard->load('user.division', 'user.store');
            $employees = $this->employeeService->getAll(true, false, 'id', 'ASC');

            return Inertia::render('admin/member-card/edit', [
                'memberCard' => $memberCard,
                'employees' => $employees,
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal edit data member card', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal edit data member card. Coba kembali.'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMemberCardRequest $request, MemberCard $memberCard)
    {
        $validatedData  = $request->validated();
        DB::beginTransaction();
        try {
            $memberCard->update($validatedData);
            DB::commit();
            return redirect()->route('admin.member-cards.index')->with([
                'type' => 'success',
                'message' => 'Data membercard berhasil diubah'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal update data membercard', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Gagal update data membercard. Coba kembali.'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function showByCardNumber($card_number)
    {
        $memberCard = $this->memberCardService->getByCardNumber($card_number, 1);

        if (!$memberCard) {
            return response()->json([
                'status' => 'error',
                'message' => 'Member Card tidak ditemukan!',
            ], 404);
        }

        return response()->json($memberCard);
    }

    public function print($id)
    {
        $memberCard = MemberCard::findOrFail($id);

        $qrCode = base64_encode(QrCode::format('svg')->size(48)->generate($memberCard->card_number));

        $widthPt = 85 * 2.8346;
        $heightPt = 54 * 2.8346;

        $pdf = Pdf::loadView('pdfs.member_card', compact('memberCard', 'qrCode'))
            ->setPaper([0, 0, $widthPt, $heightPt])
            ->setOption('margin-top', 0)
            ->setOption('margin-bottom', 0)
            ->setOption('margin-left', 0)
            ->setOption('margin-right', 0);


        return $pdf->stream("member-card-{$memberCard->card_number}.pdf");
    }
}
