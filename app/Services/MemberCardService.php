<?php

namespace App\Services;

use App\Models\MemberCard;
use Illuminate\Support\Collection;

class MemberCardService
{
    /**
     * Ambil semua data store.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        $data = MemberCard::with('user.store', 'user.division', 'issuedBy')->orderBy('id', 'DESC')->get();
        return $data;
    }

    /**
     * Ambil store berdasarkan ID.
     *
     * @param int $id
     * @return MemberCard|null
     */
    public function getByCardNumber(string $cardNumber, int $onlyActive = 0): ?MemberCard
    {
        $query = MemberCard::with('user.division', 'user.store')
            ->where('card_number', $cardNumber);

        if ($onlyActive) {
            $query->whereHas('user', function ($q) {
                $q->where('status', 1);
            });
        }

        return $query->first();
    }


    /**
     * Ambil Division dengan filter tertentu (optional).
     *
     * @param array $filters
     * @return Collection
     */
    public function getWithFilters(array $filters = []): Collection
    {
        $query = MemberCard::query();

        if (isset($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['code'])) {
            $query->where('code', $filters['code']);
        }

        return $query->get();
    }

    public function createMemberCard(array $data): MemberCard
    {
        $data = MemberCard::create($data);

        return $data;
    }
}
