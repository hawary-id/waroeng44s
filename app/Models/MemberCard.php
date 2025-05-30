<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class MemberCard extends Model implements AuditableContract
{
    use SoftDeletes, Auditable, HasFactory;
    protected $fillable = [
        'card_number',
        'balance',
        'user_id',
        'issued_by',
        'expired_at'
    ];

    /**
     * Get the user that owns the MemberCard
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Get the issuedBy that owns the MemberCard
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by', 'id');
    }

    /**
     * Get all of the transactions for the MemberCard
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'member_card_id', 'id');
    }

    /**
     * Get all of the topUps for the MemberCard
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function topUps(): HasMany
    {
        return $this->hasMany(TopUp::class, 'member_card_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($memberCard) {
            if (!$memberCard->card_number) {
                $memberCard->card_number = self::generateCardNumber($memberCard->user_id);
            }
        });
        static::saving(function ($memberCard) {
            if (Auth::check()) {
                $memberCard->issued_by = Auth::user()->id;
            }
        });
    }

    public static function generateCardNumber(): string
    {
        $today = Carbon::now()->format('Ymd');
        $prefix = 'MC' . $today;

        // Cari nomor kartu terakhir hari ini
        $lastCard = self::where('card_number', 'like', $prefix . '%')
            ->orderBy('card_number', 'desc')
            ->first();

        if ($lastCard && preg_match('/MC\d{8}(\d{4})/', $lastCard->card_number, $matches)) {
            $lastNumber = (int) $matches[1];
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    public function updateBalance(): void
    {
        $this->balance = $this->calculateBalance();
        $this->save();
    }

    public function calculateBalance(): float
    {
        $totalTopUp = $this->topUps()->where('status', 'success')->sum('amount');
        $totalTransaction = $this->transactions()->where('status', 'success')->sum('amount');

        return $totalTopUp - $totalTransaction;
    }
}
