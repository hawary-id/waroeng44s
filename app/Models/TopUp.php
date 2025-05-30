<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class TopUp extends Model implements AuditableContract
{
    use SoftDeletes, Auditable;
    protected $fillable = [
        'code',
        'amount',
        'status',
        'member_card_id',
        'topup_by',
    ];

    /**
     * Get the memberCard that owns the TopUp
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function memberCard(): BelongsTo
    {
        return $this->belongsTo(MemberCard::class, 'member_card_id', 'id');
    }

    /**
     * Get the topUpBy that owns the TopUp
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function topUpBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'topup_by', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($topUp) {
            if (Auth::check()) {
                $topUp->topup_by = Auth::user()->id;
            }

            $prefix = 'TU' . Carbon::now()->format('Ym');

            $lastTopUp = self::where('code', 'like', $prefix . '%')
                ->orderBy('id', 'desc')
                ->first();

            if ($lastTopUp && preg_match('/TU\d{6}(\d+)/', $lastTopUp->code, $matches)) {
                $lastNumber = (int) $matches[1];
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            $topUp->code = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        });
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('created_at', now()->year);
    }

    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }
}
