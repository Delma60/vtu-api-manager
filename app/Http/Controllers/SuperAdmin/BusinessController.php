<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class BusinessController extends Controller
{
    //
    public function index(Request $request)
    {
        $search = $request->input('search');

        $businesses = Business::with(['owner'])
            ->withSum(['transactions' => function($query) {
                $query->where('status', 'successful');
            }], 'amount')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('support_email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->through(function ($business) {
                return [
                    'id' => $business->id,
                    'name' => $business->name,
                    'support_email' => $business->support_email,
                    'is_active' => $business->is_active,
                    'owner_name' => $business->owner ? $business->owner->name : 'No Owner',
                    'owner_email' => $business->owner ? $business->owner->email : 'N/A',
                    'lifetime_volume' => number_format($business->transactions_sum_amount ?? 0, 2),
                    'created_at' => $business->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('super-admin/businesses/index', [
            'businesses' => $businesses,
            'filters' => ['search' => $search],
        ]);
    }
    // app/Http/Controllers/SuperAdmin/BusinessController.php

public function show(Business $business, Request $request)
{
    // 1. Load relationships
    $business->load(['owner', 'users']);

    // 2. Fetch specific tenant metrics
    $metrics = [
        'lifetime_volume' => number_format(
            \App\Models\Transaction::where('business_id', $business->id)
                ->where('status', 'successful')
                ->sum('amount'), 2
        ),
        'total_transactions' => \App\Models\Transaction::where('business_id', $business->id)->count(),
        'active_customers' => \App\Models\Customer::where('business_id', $business->id)->count(),
        // Assuming a Wallet model exists
        'wallet_balance' => number_format(\App\Models\Wallet::where('business_id', $business->id)->sum('balance'), 2),
    ];

    // 3. Fetch Tenant's Isolated Transactions (Paginated)
    $transactions = \App\Models\Transaction::with(['service'])
        ->where('business_id', $business->id)
        ->latest()
        ->paginate(15)
        ->through(function ($tx) {
            return [
                'id' => $tx->id,
                'reference' => $tx->transaction_reference,
                'type' => $tx->transaction_type,
                'service' => $tx->service ? $tx->service->name : 'N/A',
                'amount' => number_format($tx->amount, 2),
                'destination' => $tx->account_or_phone,
                'status' => $tx->status,
                'date' => $tx->created_at->format('M d, Y H:i'),
            ];
        });

    return Inertia::render('super-admin/businesses/show', [
        'business' => $business,
        'metrics' => $metrics,
        'transactions' => $transactions,
    ]);
}

    // Toggle Active/Suspended Status
    public function toggleStatus(Business $business)
    {
        $business->update(['is_active' => !$business->is_active]);

        return back()->with('success', 'Business status updated successfully.');
    }

    public function create()
    {
        return Inertia::render('super-admin/businesses/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Business Details
            'business_name' => ['required', 'string', 'max:255', 'unique:businesses,name'],
            'support_email' => ['required', 'string', 'email', 'max:255'],

            // Owner Details
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'owner_phone' => ['required', 'string', 'max:20'],
            'password' => ['required',  Password::defaults()],
        ]);

        DB::beginTransaction();

        try {
            // 1. Create the Isolated Business Entity
            $business = Business::create([
                'name' => $validated['business_name'],
                'support_email' => $validated['support_email'],
                'slug' => str()->slug($validated['business_name'] . '-' . str()->random(4)),
                'is_active' => true,
                'mode' => 'test', // Always start new tenants in test mode
            ]);

            // 2. Create the Owner's Account and link to Business
            $user = User::create([
                'name' => $validated['owner_name'],
                'email' => $validated['owner_email'],
                'phone' => $validated['owner_phone'],
                'password' => Hash::make($validated['password']),
                'user_type' => 'tenant', // Explicitly declare them as a tenant
                'business_id' => $business->id,
                'is_active' => true,
            ]);

            // 3. Provision the Tenant's initial Wallet
            Wallet::create([
                'user_id' => $user->id,
                'business_id' => $business->id,
                'balance' => 0.00,
                'total_funded' => 0.00,
            ]);

            // (Optional) 4. Assign an 'Owner' role if you are using Spatie/Custom roles
            // $role = Role::firstOrCreate(['name' => 'owner', 'business_id' => $business->id]);
            $user->role()->assignRole("owner");

            DB::commit();

            return redirect()->route('super-admin.businesses.index')
                ->with('success', 'Tenant environment successfully provisioned.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to provision tenant: ' . $e->getMessage()]);
        }
    }
}
