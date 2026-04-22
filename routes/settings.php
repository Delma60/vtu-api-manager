<?php

use App\Http\Controllers\Settings\BusinessProfileController;
use App\Http\Controllers\Settings\NotificationPreferenceController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('settings.profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('settings.password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('settings.appearance.edit');

    Route::get('settings/business', [BusinessProfileController::class, 'edit'])->name('settings.business.edit');
    Route::patch('settings/business', [BusinessProfileController::class, 'update'])->name('business.update');
    Route::post('settings/business/logo', [BusinessProfileController::class, 'updateLogo'])->name('business.update-logo');

   Route::get('/settings/notifications', [NotificationPreferenceController::class, 'edit'])->name('settings.notifications.edit');
    Route::patch('/settings/notifications', [NotificationPreferenceController::class, 'update'])->name('notifications.update');

    Route::get('settings/team', function () {
        return Inertia::render('settings/team');
    })->name('settings.team.index');
});
