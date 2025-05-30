<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Store extends Model implements AuditableContract
{
    use HasFactory, Auditable, SoftDeletes;
    protected $fillable = [
        'code',
        'name',
        'address',
        'phone',
        'email',
    ];

    /**
     * Get all of the users for the Store
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'store_id', 'id');
    }

    protected static function booted(): void
    {
        static::creating(function (Store $store) {
            $lastCode = Store::withTrashed()->where('code', 'like', 'CBG%')
                ->orderByDesc('id')
                ->value('code');

            $lastNumber = 0;
            if ($lastCode && preg_match('/CBG(\d+)/', $lastCode, $matches)) {
                $lastNumber = (int) $matches[1];
            }

            $nextNumber = $lastNumber + 1;
            $store->code = 'CBG' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        });

        // static::deleting(function (Store $store) {
        //     if ($store->isForceDeleting()) {
        //         return;
        //     }

        //     $store->code = 'X' . $store->code;
        //     $store->save();

        // });
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('created_at', now()->year);
    }
}
