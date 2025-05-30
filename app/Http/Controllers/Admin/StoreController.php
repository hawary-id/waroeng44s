<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Store;
use App\Services\StoreService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class StoreController extends Controller
{
    protected $storeService;

    public function __construct(StoreService $storeService)
    {
        $this->storeService = $storeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stores = $this->storeService->getAll();

        return Inertia::render('admin/store/index', [
            'stores' => $stores,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/store/create');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->storeService->createStore($request->validated());
            DB::commit();

            return redirect()->route('admin.stores.index')->with([
                'type' => 'success',
                'message' => 'Data toko berhasil disimpan!'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal membuat toko', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data toko.'
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
    public function edit(Store $store)
    {
        try {
            return Inertia::render('admin/store/edit', [
                'store' => $store
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal edit data toko', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal edit data toko. Coba kembali.'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStoreRequest $request, Store $store)
    {
        $data = $request->validated();
        DB::beginTransaction();
        try {

            $store->update($data);

            DB::commit();

            return redirect()->route('admin.stores.index')->with([
                'type' => 'success',
                'message' => 'Data toko berhasil diubah'
            ]);
        } catch (Throwable $th) {
            DB::rollBack();
            Log::error('Gagal update data toko', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->withInput()->with([
                'type' => 'error',
                'message' => 'Gagal update data toko. Coba kembali.'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        try {
            $store->delete();
            return redirect()->route('admin.stores.index')->with([
                'type' => 'success',
                'message' => 'Data toko berhasil dihapus'
            ]);
        } catch (Throwable $th) {
            Log::error('Gagal hapus data toko', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return redirect()->back()->with([
                'type' => 'error',
                'message' => 'Gagal menghapus data toko'
            ]);
        }
    }
}
