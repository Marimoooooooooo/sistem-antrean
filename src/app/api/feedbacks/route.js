import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/feedbacks - Get all feedbacks
export async function GET() {
  const feedbacks = await store.getFeedbacks();
  return NextResponse.json(feedbacks);
}

// POST /api/feedbacks - Create new feedback
export async function POST(request) {
  try {
    const body = await request.json();
    const { ticketId, rating, review } = body;

    if (!rating) {
      return NextResponse.json(
        { error: 'Rating wajib diisi.' },
        { status: 400 }
      );
    }

    // Get ticket info
    const ticket = await store.getQueueById(ticketId);

    const newFeedback = {
      id: 'fb-' + Date.now().toString(36) + Math.random().toString(36).substr(2),
      ticketId: ticketId || null,
      ticketNumber: ticket ? ticket.ticketNumber : 'Unknown',
      name: ticket ? ticket.name : 'Anonymous',
      serviceName: ticket ? ticket.serviceName : 'Unknown',
      rating: parseInt(rating),
      review: review || '',
      timestamp: new Date().toISOString(),
    };

    const saved = await store.addFeedback(newFeedback);

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/feedbacks - Clear all feedbacks
export async function DELETE() {
  await store.clearFeedbacks();
  return NextResponse.json({ message: 'All feedbacks cleared' });
}
