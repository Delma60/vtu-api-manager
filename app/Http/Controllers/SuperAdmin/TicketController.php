<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    //
    public function index()
    {
        // Fetches ALL tickets with their associated business and user
        $tickets = Ticket::with(['business', 'user'])->latest()->get();

        // You can point this to an admin-specific React view
        return inertia('super-admin/support/index', ['tickets' => $tickets]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['user', 'business', 'replies.user']);
        
        return inertia('super-admin/support/show', ['ticket' => $ticket]);
    }

    public function storeReply(Request $request, Ticket $ticket)
    {
        $request->validate(['message' => 'required|string']);

        $ticket->replies()->create([
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);

        if ($ticket->status !== 'in_progress') {
            $ticket->update(['status' => 'in_progress']);
        }

        return redirect()->route('super-admin.tickets.show', $ticket)->with('success', 'Reply sent.');
    }
}
