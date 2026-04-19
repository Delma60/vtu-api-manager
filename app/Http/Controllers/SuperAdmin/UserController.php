<?php

// app/Http/Controllers/SuperAdmin/UserController.php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $type = $request->input('type', 'all');

        $users = User::with(['business', 'role'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($type !== 'all', function ($query) use ($type) {
                if ($type === 'super_admin') {
                    $query->where('user_type', 'super_admin');
                } else {
                    $query->where('user_type', '!=', 'super_admin');
                }
            })
            ->latest()
            ->paginate(15)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? 'N/A',
                    'is_active' => (bool) $user->is_active,
                    'user_type' => $user->user_type,
                    // Handle nullable relationships safely
                    'business_name' => $user->business ? $user->business->name : 'System Platform',
                    'role' => $user->role ? $user->role->name : ($user->user_type === 'super_admin' ? 'Super Admin' : 'Unassigned'),
                    'created_at' => $user->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('super-admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'type' => $type
            ],
        ]);
    }

    // Toggle Active/Suspended Status for a specific user
    public function toggleStatus(User $user)
    {
        // Prevent super admins from accidentally locking themselves out
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot suspend your own account.');
        }

        $user->update(['is_active' => !$user->is_active]);
        
        return back()->with('success', "User account has been " . ($user->is_active ? 'activated' : 'suspended') . ".");
    }
}