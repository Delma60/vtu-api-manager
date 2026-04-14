<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerService
{
    /**
     * Create a new customer and initialize their VTU wallet.
     * Uses a DB transaction to ensure no orphaned customers exist without a wallet.
     */
    public function createCustomer(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            // Generate a secure random password if the admin isn't setting one directly
            $password = $data['password'] ?? Str::random(12);

            $customer = Customer::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($password),
                // Note: 'type' => 'customer' is handled by the Customer model automatically
                // Note: 'business_id' is handled by your BelongsToBusiness trait globally
            ]);

            $customer->assignRole('customer');

            // Initialize the customer's wallet immediately
            Wallet::create([
                'user_id' => $customer->id, // Customer extends User, so it's a user_id
                'balance' => 0.00,
                'status' => 'active',
            ]);



            // Optional: Dispatch an event or send a welcome email here
            // event(new CustomerRegistered($customer, $password));

            return $customer;
        });
    }

    /**
     * Update an existing customer's details.
     */
    public function updateCustomer(Customer $customer, array $data): Customer
    {
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']); // Don't overwrite with null if left blank
        }

        $customer->update($data);

        return $customer;
    }

    /**
     * Suspend a customer to prevent further VTU purchases.
     */
    public function suspendCustomer(Customer $customer): void
    {
        DB::transaction(function () use ($customer) {
            // Suspend the user account (assuming you add a status column to users)
            $customer->update(['is_active' => false]);
            
            // Lock the wallet to freeze funds
            if ($customer->wallet) {
                $customer->wallet->update(['status' => 'locked']);
            }
        });
    }

    /**
     * Reactivate a previously suspended customer.
     */
    public function activateCustomer(Customer $customer): void
    {
        DB::transaction(function () use ($customer) {
            $customer->update(['is_active' => true]);
            
            if ($customer->wallet) {
                $customer->wallet->update(['status' => 'active']);
            }
        });
    }

    /**
     * Retrieve formatted statistics for the Customer Dashboard UI.
     */
    public function getCustomerMetrics(Customer $customer): array
    {
        return [
            'wallet_balance' => $customer->wallet ? $customer->wallet->balance : 0.00,
            'total_transactions' => $customer->transactions()->count(),
            'lifetime_value' => $customer->transactions()->where('status', 'successful')->sum('amount'),
            'joined_date' => $customer->created_at->format('M d, Y'),
            'status' => $customer->is_active ? 'active' : 'suspended',
        ];
    }
}