<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::where('business_id', auth()->user()->business_id)
            ->latest()
            ->get();

        return inertia('support/index', ['tickets' => $tickets]);
    }

    public function create()
    {
        return inertia('support/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $ticket = Ticket::create([
            'business_id' => auth()->user()->business_id,
            'user_id' => auth()->id(),
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority,
        ]);

        return redirect()->route('tickets.show', $ticket)->with('success', 'Ticket created successfully.');
    }

public function show(Ticket $ticket)
{
    // Eager load the user who created the ticket and the users who replied
    $ticket->load(['user', 'replies.user']);
    
    return inertia('support/show', ['ticket' => $ticket]);
}

public function storeReply(Request $request, Ticket $ticket)
{
    $request->validate(['message' => 'required|string']);

    $ticket->replies()->create([
        'user_id' => auth()->id(),
        'message' => $request->message,
    ]);

    // Automatically update status to 'in_progress' if an admin replies, or keep it open
    if ($ticket->status === 'closed') {
        $ticket->update(['status' => 'open']);
    }

    return back()->with('success', 'Reply sent.');
}
}
