<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\MemberCardController;

Route::prefix('api')->middleware(['auth','role:admin'])->group(function () {
    Route::get('/member-cards/{card_number}', [MemberCardController::class,'showByCardNumber'])->name('member-cards.search');
});
