<?php

namespace App\Providers;

use App\Models\TopUp;
use App\Models\Transaction;
use App\Observers\TopUpObserver;
use App\Observers\TransactionObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        TopUp::observe(TopUpObserver::class);
        Transaction::observe(TransactionObserver::class);
    }
}
