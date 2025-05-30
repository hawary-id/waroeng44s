<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DivisionRequest;
use App\Http\Requests\UpdateDivisionRequest;
use App\Models\Division;
use App\Services\DivisionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class DivisionController extends Controller
{
    protected $divisionService;

    public function __construct(DivisionService $divisionService)
    {
        $this->divisionService = $divisionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $divisions = $this->divisionService->getAll();
       return Inertia::render('admin/division/index',[
            'divisions' => $divisions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/division/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DivisionRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->divisionService->createDivision($request->validated());
            DB::commit();

            return redirect()->route('admin.divisions.index')->with([
                'type' => 'success',
                'message' => 'Data divisi berhasil dibuat!'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal membuat data divisi', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type',
                'error',
                'message' => 'Terjadi kesalahan saat menyimpan data divisi.'
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
    public function edit(Division $division)
    {
        try {
            return Inertia::render('admin/division/edit', [
                'division' => $division
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal edit data divisi', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal edit data division. Coba kembali.'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDivisionRequest $request, Division $division)
    {
        $data = $request->validated();
        DB::beginTransaction();
        try {

            $division->update($data);

            DB::commit();

            return redirect()->route('admin.divisions.index')->with([
                'type' => 'success',
                'message' => 'Data divisi berhasil diubah'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal update data divisi', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Gagal update data divisi. Coba kembali.'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Division $division)
    {
        try {
            $division->delete();
            return redirect()->route('admin.divisions.index')->with([
                'type' => 'success',
                'message' => 'Data divisi berhasil dihapus'
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal hapus data divisi', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal menghapus data divisi'
            ]);
        }
    }
}
