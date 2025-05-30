<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Division extends Model implements AuditableContract
{
    use HasFactory,Auditable;
    protected $fillable = [
        'name'
    ];

    /**
     * Get all of the users for the Division
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'division_id', 'id');
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('created_at', now()->year);
    }
}
