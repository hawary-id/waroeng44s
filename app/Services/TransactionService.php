<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Collection;

class TransactionService
{
    /**
     * Ambil semua data Transaction.
     *
     * @return Collection
     */
    public function getAll(array $filters = [], array $withRelations = ['memberCard.user.store', 'memberCard.user.division', 'performedBy']): Collection
    {
        $query = Transaction::with($withRelations)->orderBy('id', 'DESC');

        if (!empty($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['limit'])) {
            $query->limit((int)$filters['limit']);
        }

        return $query->get();
    }


    /**
     * Ambil Transaction berdasarkan ID.
     *
     * @param int $id
     * @return Transaction|null
     */
    public function getById(int $id): ?Transaction
    {
        return Transaction::find($id);
    }

    /**
     * Ambil Transaction dengan filter tertentu (optional).
     *
     * @param array $filters
     * @return Collection
     */
    public function getWithFilters(array $filters = []): Collection
    {
        $query = Transaction::query();

        if (isset($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['code'])) {
            $query->where('code', $filters['code']);
        }

        return $query->get();
    }

    public function createTransaction(array $data): Transaction
    {
        $data = Transaction::create($data);

        return $data;
    }
}
