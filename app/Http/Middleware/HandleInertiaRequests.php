<?php

namespace App\Http\Middleware;

use App\Models\Provider;
use App\Models\SystemSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {


        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user()?->load('settings'),
            ],
            'provider_down_count' => Provider::all()->map(function($provider) {
                if(!$provider->connection) return $provider;
            })->filter()->count(),
            'mode' => auth()->check() ? auth()->user()->business->mode : null,
            'notifications' => $request->user() ? $request->user()->unreadNotifications()->take(5)->get() : [],
            'unreadNotificationsCount' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
            'is_super_admin' => $request->user() ? $request->user()->isSuperAdmin() : false,
            'is_business_admin' => $request->user() ? $request->user()->isBusinessAdmin() : false,
            'general' => [
                "app_name" => SystemSetting::getKeyValue("app_name", 'Laravel', [ 'ignore-scopes' => true ]),
                // "app_name" SystemSettings
                'app_url' => env('APP_URL', 'http://localhost'),
            ],
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                    'warning' => session('warning'),
                    'info' => session('info'),
                ];
            },

        ]);
    }
}
