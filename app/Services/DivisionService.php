<?php

namespace App\Services;

use App\Models\Division;
use Illuminate\Support\Collection;

class DivisionService
{
    /**
     * Ambil semua data store.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        $data = Division::orderBy('id', 'DESC')->get();
        return $data;
    }

    /**
     * Ambil store berdasarkan ID.
     *
     * @param int $id
     * @return Division|null
     */
    public function getById(int $id): ?Division
    {
        return Division::find($id);
    }

    /**
     * Ambil Division dengan filter tertentu (optional).
     *
     * @param array $filters
     * @return Collection
     */
    public function getWithFilters(array $filters = []): Collection
    {
        $query = Division::query();

        if (isset($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['code'])) {
            $query->where('code', $filters['code']);
        }

        return $query->get();
    }

    public function createDivision(array $data): Division
    {
        $data = Division::create($data);

        return $data;
    }
}
