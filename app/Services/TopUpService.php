<?php

namespace App\Services;

use App\Models\TopUp;
use Illuminate\Support\Collection;

class TopUpService
{
    /**
     * Ambil semua data store.
     *
     * @return Collection
     */
    public function getAll(array $filters = [], array $withRelations = ['memberCard.user.store', 'memberCard.user.division', 'topUpBy']): Collection
    {
        $query = TopUp::with($withRelations)->orderBy('id', 'DESC');

        if (!empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->get();
    }


    /**
     * Ambil store berdasarkan ID.
     *
     * @param int $id
     * @return Store|null
     */
    public function getById(int $id): ?TopUp
    {
        return TopUp::find($id);
    }

    /**
     * Ambil store dengan filter tertentu (optional).
     *
     * @param array $filters
     * @return Collection
     */
    public function getWithFilters(array $filters = []): Collection
    {
        $query = TopUp::query();

        if (isset($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['code'])) {
            $query->where('code', $filters['code']);
        }

        return $query->get();
    }

    public function createTopUp(array $data)
    {
        if (isset($data['member_card_id'])) {
            TopUp::create($data);
        } else {
            foreach ($data as $item) {
                TopUp::create($item);
            }
        }
    }
}
