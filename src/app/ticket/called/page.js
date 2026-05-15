'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function TicketCalledPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [timer, setTimer] = useState('03:00');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const ticketId = sessionStorage.getItem('current_ticket_id');
    if (!ticketId) {
      router.push('/');
      return;
    }

    async function checkStatus() {
      try {
        const res = await fetch(`/api/queues/${ticketId}`);
        if (!res.ok) {
          router.push('/');
          return;
        }

        const data = await res.json();
        setTicket(data);

        if (data.status === 'completed') {
          router.push('/ticket/completed');
          return;
        } else if (data.status === 'missed') {
          router.push('/ticket/missed');
          return;
        }

        // Calculate remaining time only if status is 'called'
        if (data.status === 'called' && data.calledAt) {
          const calledTime = new Date(data.calledAt).getTime();
          const now = Date.now();
          const diffSecs = Math.floor((now - calledTime) / 1000);
          const remaining = 180 - diffSecs;

          if (remaining <= 0) {
            await fetch(`/api/queues/${ticketId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'missed' }),
            });
            router.push('/ticket/missed');
          } else {
            const m = Math.floor(remaining / 60).toString().padStart(2, '0');
            const s = (remaining % 60).toString().padStart(2, '0');
            setTimer(`${m}:${s}`);
            setIsUrgent(remaining < 30);
          }
        } else if (data.status === 'serving') {
          setTimer('--:--');
          setIsUrgent(false);
        }
      } catch (e) {
        console.error('Failed to check status:', e);
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [router]);

  async function handleAccept() {
    const ticketId = sessionStorage.getItem('current_ticket_id');
    if (!ticketId) return;

    try {
      await fetch(`/api/queues/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'serving' }),
      });
      // Local state update will happen via polling
    } catch (e) {
      console.error('Failed to accept:', e);
    }
  }

  async function handleComplete() {
    const ticketId = sessionStorage.getItem('current_ticket_id');
    if (!ticketId) return;

    try {
      await fetch(`/api/queues/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      router.push('/ticket/completed');
    } catch (e) {
      console.error('Failed to complete:', e);
    }
  }

  if (!ticket) return null;

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">

      {/* Nomor Tiket — focal point */}
      <div className="flex flex-col items-center text-center mb-10">
        <p className="text-sm text-blue-400 font-semibold uppercase tracking-widest mb-3">
          {ticket.serviceName}
        </p>
        <div className="text-8xl sm:text-9xl font-black text-white tracking-tight leading-none mb-3 text-glow">
          {ticket.ticketNumber}
        </div>
        <p className="text-xl text-slate-400 font-medium capitalize">
          {ticket.name}
        </p>
      </div>

      {/* Status message */}
      <div className="bg-blue-950/60 border border-blue-800/40 rounded-xl px-8 py-5 text-center mb-8 max-w-sm w-full">
        <p className="text-blue-300 text-sm font-medium uppercase tracking-wide mb-1">
          {ticket.status === 'serving' ? 'Sedang Dilayani' : 'Silakan Menuju Loket'}
        </p>
        {ticket.status === 'called' && (
          <div className={`text-4xl font-mono font-bold tracking-wider ${isUrgent ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {timer}
          </div>
        )}
      </div>

      {/* Action Button */}
      {ticket.status === 'called' ? (
        <button
          onClick={handleAccept}
          className="w-full max-w-sm py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          Terima Panggilan
        </button>
      ) : (
        <button
          onClick={handleComplete}
          className="w-full max-w-sm py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <CheckCircle2 className="w-6 h-6" />
          Selesai Dilayani
        </button>
      )}
    </div>
  );
}
