<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($user->role === 'user') {
            return redirect()->route('user.dashboard');
        }

        abort(403, 'Akses ditolak: Role tidak dikenali.');
    }
    return Inertia::render('auth/login');
})->name('home');

Route::get('/test-sentry', function () {
    throw new \Exception('Tes error ke Sentry!');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/api.php';
