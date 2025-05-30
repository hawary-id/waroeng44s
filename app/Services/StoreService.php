<?php

namespace App\Services;

use App\Models\Store;
use Illuminate\Support\Collection;

class StoreService
{
    /**
     * Ambil semua data store.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        $data = Store::orderBy('id', 'DESC')->get();
        return $data;
    }

    /**
     * Ambil store berdasarkan ID.
     *
     * @param int $id
     * @return Store|null
     */
    public function getById(int $id): ?Store
    {
        return Store::find($id);
    }

    /**
     * Ambil store dengan filter tertentu (optional).
     *
     * @param array $filters
     * @return Collection
     */
    public function getWithFilters(array $filters = []): Collection
    {
        $query = Store::query();

        if (isset($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['code'])) {
            $query->where('code', $filters['code']);
        }

        return $query->get();
    }

    public function createStore(array $data): Store
    {
        $data = Store::create($data);

        return $data;
    }
}
