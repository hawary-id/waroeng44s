<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\MemberCardController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\Admin\TopUpController;
use App\Http\Controllers\Admin\TransactionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware(['auth','role:admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/member-cards/{card_number}search', [MemberCardController::class,'showByCardNumber'])->name('member-cards.search');
    Route::get('/member-cards/{id}/print', [MemberCardController::class, 'print'])->name('member-cards.print');
    Route::get('/employees/top-ups', [EmployeeController::class, 'topUps'])->name('employees.topUps');
    Route::put('/top-ups/{topUp}/approve', [TopUpController::class, 'approve'])->name('top-ups.approve');
    Route::put('/transactions/{id}/approve', [TransactionController::class, 'approve'])->name('transactions.approve');
    Route::get('/reports/top-up', [ReportController::class, 'topUp'])->name('reports.top-up');
    Route::get('/reports/transaction', [ReportController::class, 'Transaction'])->name('reports.transaction');

    Route::resource('transactions', TransactionController::class);
    Route::resource('top-ups', TopUpController::class);
    Route::resource('member-cards', MemberCardController::class);
    Route::resource('employees', EmployeeController::class);
    Route::resource('stores', StoreController::class);
    Route::resource('divisions', DivisionController::class);
});
