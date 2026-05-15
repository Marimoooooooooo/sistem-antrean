import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/queues - Get all queues
export async function GET(request) {
  // Auto-skip expired tickets
  const autoSkipMinutes = parseInt(process.env.NEXT_PUBLIC_AUTO_SKIP_MINUTES || '3');
  await store.autoSkipExpired(autoSkipMinutes);

  const queues = await store.getQueues();
  
  // Optional filter by status
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  if (status) {
    const filtered = queues.filter(q => q.status === status);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(queues);
}

// POST /api/queues - Create new ticket
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, serviceName, serviceCode } = body;

    if (!name || !phone || !serviceName || !serviceCode) {
      return NextResponse.json(
        { error: 'Nama, nomor HP, nama layanan, dan kode layanan wajib diisi.' },
        { status: 400 }
      );
    }

    // Cek apakah nomor HP sudah punya antrean aktif
    const existingTicket = await store.hasActiveTicket(phone);
    if (existingTicket) {
      return NextResponse.json(
        { 
          error: `Nomor HP ini sudah memiliki antrean aktif (${existingTicket.ticketNumber}). Selesaikan antrean Anda terlebih dahulu sebelum mengambil antrean baru.`,
          existingTicket: existingTicket,
        },
        { status: 409 }
      );
    }

    // Generate ticket number
    const count = await store.getQueueCountByService(serviceCode);
    const nextNumber = count + 1;
    const ticketNumber = `${serviceCode}-${nextNumber.toString().padStart(3, '0')}`;

    const newTicket = {
      id: 'tkt_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
      ticketNumber,
      name,
      phone,
      serviceName,
      serviceCode,
      status: 'waiting',
      timestamp: new Date().toISOString(),
      calledAt: null,
    };

    const saved = await store.addQueue(newTicket);

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/queues - Clear all queues
export async function DELETE() {
  await store.clearQueues();
  return NextResponse.json({ message: 'All queues cleared' });
}
