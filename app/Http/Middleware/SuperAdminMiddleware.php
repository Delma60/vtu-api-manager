<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized. Super Admin access only.'); 
            // Alternatively, you can redirect: return redirect('/dashboard')->with('error', 'Unauthorized');
        }

        return $next($request);
    }
}