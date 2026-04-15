<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Services\CustomerService;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct(protected CustomerService $customerService) {}
    
    public function index()
    {
        $customers = Customer::with('wallet')
            ->latest()
            ->paginate(15);
        return Inertia::render('customers/index', compact("customers"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('customers/create');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $validated = $request->validated();
        $customer = $this->customerService->createCustomer($validated);
        return back()->with('success', 'Customer created and wallet initialized.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        //
        $customer->load([
            'wallet', 
            'transactions' => function ($query) {
                $query->latest()->take(10);
            }
        ]);

        $metrics = $this->customerService->getCustomerMetrics($customer);
        return Inertia::render('customers/show', compact("customer", "metrics"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
        return Inertia::render('customers/edit', compact("customer"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        //
        $validated = $request->validated();
        $updatedCustomer = $this->customerService->updateCustomer($customer, $validated);
        return back()->with('success', 'Customer details updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
        $this->customerService->deleteCustomer($customer);
        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');

    }

    public function suspend(Customer $customer)
    {
        $this->customerService->suspendCustomer($customer);
        
        return redirect()->back()->with('success', 'Customer account and wallet suspended.');
    }
}
