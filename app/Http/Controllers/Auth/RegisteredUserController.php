<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Package;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
        ]);

        try{
            DB::beginTransaction();
        
            // 1. Fetch the default Free Package
            $defaultPackage = Package::where('is_default', true)
                                     ->where('is_active', true)
                                     ->first();
            
            // 2. Create the Business Tenant
            $business = Business::create([
                'name' => $request->company_name,
                'slug' => Str::slug($request->company_name) . '-' . Str::random(4), 
                'support_email' => $request->email,
                'is_active' => true,
                'package_id' => $defaultPackage?->id,
                'subscription_status' => 'active',
                'subscription_ends_at' => null, // Free plan doesn't expire
            ]);

            // 2. Create basic roles for the business
            $ownerRole = \App\Models\Role::create([
                'name' => 'Business Owner',
                'slug' => 'owner',
                'business_id' => $business->id,
            ]);

            $newUser = $business->owner()->create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'business_id' => $business->id, // Assign to the newly created business
                'type' => 'business_admin',     // Set them as an admin, not a customer
            ]);

            $newUser->assignRole($ownerRole);
            

            DB::commit();

            event(new Registered($newUser));

            Auth::login($newUser);

            return to_route('dashboard');
    

        }catch(\Exception $e){
            DB::rollback();
            return back()->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
