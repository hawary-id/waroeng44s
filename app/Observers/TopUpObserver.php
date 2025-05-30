<?php

namespace App\Observers;

use App\Models\TopUp;

class TopUpObserver
{
    /**
     * Handle the TopUp "created" event.
     */
    public function created(TopUp $topUp): void
    {
        $topUp->memberCard->updateBalance();
    }

    /**
     * Handle the TopUp "updated" event.
     */
    public function updated(TopUp $topUp): void
    {
        $topUp->memberCard->updateBalance();
    }

    /**
     * Handle the TopUp "deleted" event.
     */
    public function deleted(TopUp $topUp): void
    {
        $topUp->memberCard->updateBalance();
    }

    /**
     * Handle the TopUp "restored" event.
     */
    public function restored(TopUp $topUp): void
    {
        //
    }

    /**
     * Handle the TopUp "force deleted" event.
     */
    public function forceDeleted(TopUp $topUp): void
    {
        //
    }
}
