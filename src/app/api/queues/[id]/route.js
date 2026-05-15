import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/queues/[id] - Get a specific ticket
export async function GET(request, { params }) {
  const { id } = await params;
  const ticket = await store.getQueueById(id);

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

// PATCH /api/queues/[id] - Update ticket status
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['waiting', 'called', 'serving', 'completed', 'missed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updates = {};
    if (status) {
      updates.status = status;
      if (status === 'called') {
        updates.calledAt = new Date().toISOString();
      }
    }

    const updated = await store.updateQueue(id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/queues/[id] - Delete a specific ticket
export async function DELETE(request, { params }) {
  const { id } = await params;
  const deleted = await store.deleteQueue(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Ticket deleted' });
}
