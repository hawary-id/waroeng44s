<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class User extends Authenticatable implements AuditableContract
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Auditable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'email',
        'password',
        'role',
        'status',
        'division_id',
        'store_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the division that owns the division
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'division_id', 'id');
    }

    /**
     * Get the store that owns the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    /**
     * Get the memberCard associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function memberCard(): HasOne
    {
        return $this->HasOne(MemberCard::class, 'user_id', 'id');
    }

    /**
     * Get the issuedBy associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function issuedBy(): HasMany
    {
        return $this->HasMany(MemberCard::class, 'issued_by', 'id');
    }

    /**
     * Get all of the topUps for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function topUps(): HasMany
    {
        return $this->hasMany(TopUp::class, 'topup_by', 'id');
    }

    /**
     * Get all of the transactions for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'performed_by', 'id');
    }

    protected static function booted(): void
    {
        static::creating(function (User $user) {
            $lastCode = User::withTrashed()->where('code', 'like', 'EMP%')
                ->orderByDesc('id')
                ->value('code');

            $lastNumber = 0;
            if ($lastCode && preg_match('/EMP(\d+)/', $lastCode, $matches)) {
                $lastNumber = (int) $matches[1];
            }

            $nextNumber = $lastNumber + 1;
            $user->code = 'EMP' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        });
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('created_at', now()->year);
    }
}
