<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Ticket::with(['user', 'replies.user'])->latest();
        
        if ($user->user_type !== 'admin') {
            $query->where('business_id', $user->business_id);
        } else {
            $query->with('business'); 
        }

        $tickets = $query->get();

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
        $user = auth()->user();

        if ($user->user_type !== 'admin' && $ticket->business_id !== $user->business_id) {
            abort(403);
        }

        $ticket->load(['user', 'replies.user']);
        
        return inertia('support/show', ['ticket' => $ticket]);
    }

    public function storeReply(Request $request, Ticket $ticket)
    {
        $request->validate(['message' => 'required|string']);

        $user = auth()->user();
        if ($user->user_type !== 'admin' && $ticket->business_id !== $user->business_id) {
            abort(403);
        }

        $ticket->replies()->create([
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        if ($ticket->status === 'closed') {
            $ticket->update(['status' => $user->user_type === 'admin' ? 'in_progress' : 'open']);
        } elseif ($user->user_type === 'admin' && $ticket->status === 'open') {
            $ticket->update(['status' => 'in_progress']);
        }

        return redirect()->route('tickets.show', $ticket)->with('success', 'Reply sent.');
    }
}
