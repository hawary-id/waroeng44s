<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\MemberCard;
use App\Models\User;
use App\Services\DivisionService;
use App\Services\EmployeeService;
use App\Services\StoreService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class EmployeeController extends Controller
{
    protected $employeeService, $divisionService, $storeService;

    public function __construct(
        EmployeeService $employeeService,
        DivisionService $divisionService,
        StoreService $storeService
    ) {
        $this->employeeService = $employeeService;
        $this->divisionService = $divisionService;
        $this->storeService = $storeService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = $this->employeeService->getAll();

        return Inertia::render('admin/employee/index', [
            'employees' => $employees,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $stores = $this->storeService->getAll();
        $divisions = $this->divisionService->getAll();
        return Inertia::render('admin/employee/create', [
            'stores' => $stores,
            'divisions' => $divisions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EmployeeRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->employeeService->createUser($request->validated());
            DB::commit();

            return redirect()->route('admin.employees.index')->with([
                'type' => 'success',
                'message' => 'Data karyawan berhasil disimpan!'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal membuat karyawan', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data karyawan.'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $employee = $this->employeeService->getById($id);

            return Inertia::render('admin/employee/show', [
                'employee' => $employee
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal mengambil data karyawan', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal mengambil data karyawan. Coba kembali.'
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $employee = $this->employeeService->getById($id);
            $stores = $this->storeService->getAll();
            $divisions = $this->divisionService->getAll();
            return Inertia::render('admin/employee/edit', [
                'employee' => $employee,
                'stores' => $stores,
                'divisions' => $divisions,
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal edit data karyawan', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal edit data karyawan. Coba kembali.'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, string $id)
    {
        DB::beginTransaction();
        try {

            $user = User::findOrFail($id);
            $user->update($request->validated());

            if (!$user->memberCard) {
                $memberCardData = [
                    'user_id' => $user->id
                ];
                MemberCard::create($memberCardData);
            }

            DB::commit();

            return redirect()->route('admin.employees.index')->with([
                'type' => 'success',
                'message' => 'Data karyawan berhasil diubah'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal update data karyawan', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Gagal update data karyawan. Coba kembali.'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $employee = $this->employeeService->getById($id);
            $employee->delete();
            return redirect()->route('admin.employees.index')->with([
                'type' => 'success',
                'message' => 'Data toko karyawan dihapus'
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal hapus data toko', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal menghapus data karyawan'
            ]);
        }
    }

    public function topUps()
    {
        $employees = $this->employeeService->getAll(true, true, 'name', 'ASC');

        return Inertia::render('admin/employee/top-up', [
            'employees' => $employees,
        ]);
    }
}
