<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Transaction extends Model
{
    protected $fillable = [
        'amount',
        'receipt_code',
        'status',
        'member_card_id',
        'performed_by',
    ];

    /**
     * Get the memberCard that owns the Transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function memberCard()
    {
        return $this->belongsTo(MemberCard::class, 'member_card_id', 'id');
    }

    /**
     * Get the performedBy that owns the Transaction
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function performedBy()
    {
        return $this->belongsTo(User::class, 'performed_by', 'id');
    }

    protected static function booted(): void
    {
        static::creating(function (Transaction $transaction) {
            if (Auth::check()) {
                $transaction->performed_by = Auth::user()->id;
            }

            $prefix = 'TR' . Carbon::now()->format('Ymd');
            $lastCode = self::where('code', 'like', $prefix . '%')
                ->orderBy('id', 'desc')
                ->first();

            if ($lastCode && preg_match('/TR\d{8}(\d+)/', $lastCode->code, $matches)) {
                $lastNumber = (int) $matches[1];
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            $transaction->code = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        });
    }

    // Scope untuk transaksi tahun ini
    public function scopeThisYear($query)
    {
        return $query->whereYear('created_at', now()->year);
    }

    // Scope untuk transaksi sukses
    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }
}
