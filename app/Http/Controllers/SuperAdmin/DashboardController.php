<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get global platform stats
        $stats = [
            'total_businesses' => Business::count(),
            'total_users' => User::count(),
            'total_transactions' => Transaction::count(),
            'total_revenue' => Transaction::where('status', 'successful')->sum('amount'),
        ];

        return Inertia::render('super-admin/dashboard', [
            'stats' => $stats
        ]);
    }
}