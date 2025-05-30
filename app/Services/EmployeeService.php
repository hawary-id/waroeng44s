<?php

namespace App\Services;

use App\Models\MemberCard;
use App\Models\User;
use App\Notifications\AccountCreated;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployeeService
{
    /**
     * Ambil semua data store.
     *
     * @return Collection
     */
    public function getAll(
        bool $onlyActive = false,
        bool $onlyWithMemberCard = false,
        string $orderByColumn = 'id',
        string $orderDirection = 'DESC'
    ): Collection {
        $query = User::with('division', 'store', 'memberCard');
        $query->orderBy($orderByColumn, $orderDirection);
        if ($onlyActive) {
            $query->where('status', true);
        }

        if ($onlyWithMemberCard) {
            $query->whereHas('memberCard');
        }

        return $query->get();
    }

    /**
     * Ambil store berdasarkan ID.
     *
     * @param int $id
     * @return User|null
     */
    public function getById(int $id): ?User
    {
        return User::with([
            'memberCard.topUps' => function ($query) {
                $query->orderBy('id', 'desc');
            },
            'memberCard.transactions' => function ($query) {
                $query->orderBy('id', 'desc');
            },
            'memberCard.topUps.topUpBy',
            'memberCard.transactions.performedBy',
            'store',
            'division'
        ])->find($id);
    }

    /**
     * Ambil User dengan filter tertentu (optional).
     *
     * @param array $filters
     * @return Collection
     */
    public function getWithFilters(array $filters = []): Collection
    {
        $query = User::query();

        if (isset($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (isset($filters['code'])) {
            $query->where('code', $filters['code']);
        }

        return $query->get();
    }

    public function createUser(array $data): User
    {
        $role = $data['role'];
        $generatedPassword = null;

        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'division_id' => $data['division_id'],
            'store_id' => $data['store_id'],
            'role' => $role,
        ];

        if (in_array($role, ['admin', 'user'])) {
            $generatedPassword = Str::random(10);
            $userData['password'] = Hash::make($generatedPassword);
        }

        $user = User::create($userData);

        $memberCardData = [
            'user_id' => $user->id
        ];
        MemberCard::create($memberCardData);
        $user->load('division', 'store');

        if (in_array($role, ['admin', 'user'])) {
            $user->notify(new AccountCreated($user, $generatedPassword));
        }

        return $user;
    }
}
