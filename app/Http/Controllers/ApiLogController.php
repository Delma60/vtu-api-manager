<?php

namespace App\Http\Controllers;

use App\Models\ApiLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApiLogController extends Controller
{
    public function index(Request $request)
    {
        // Handle Search functionality
        // if ($request->filled('search')) {
        //     $search = $request->input('search');
        //     $query->where(function($q) use ($search) {
        //         $q->where('endpoint', 'LIKE', "%{$search}%")
        //           ->orWhere('id', 'LIKE', "%{$search}%");
        //     });
        // }

        // Paginate results
        $logs = ApiLog::latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('developers/api-logs', [
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        abort(404);
    }

    public function store(Request $request)
    {
        abort(404);
    }

    public function show($id)
    {
        abort(404);
    }

    public function edit($id)
    {
        abort(404);
    }

    public function update(Request $request, $id)
    {
        abort(404);
    }

    public function destroy($id)
    {
        abort(404);
    }
}
