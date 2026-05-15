'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TicketWaitingPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);

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

        if (data.status === 'called' || data.status === 'serving') {
          router.push('/ticket/called');
        } else if (data.status === 'missed') {
          router.push('/ticket/missed');
        } else if (data.status === 'completed') {
          router.push('/ticket/completed');
        }
      } catch (e) {
        console.error('Failed to check status:', e);
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [router]);

  if (!ticket) return null;

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 relative animate-fade-in">

      {/* Back Button */}
      <Link
        href="/ticket/generated"
        className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Kembali</span>
      </Link>

      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col text-center relative">
        {/* Header Ribbon */}
        <div className="bg-blue-900/30 text-blue-400 text-xs font-semibold py-2 px-4 uppercase tracking-wider border-b border-slate-700">
          E-Tiket Aktif
        </div>

        <div className="p-8 flex flex-col items-center">
          <h2 className="text-sm text-slate-400 font-medium mb-1">{ticket.serviceName}</h2>
          <div className="text-5xl font-bold text-slate-100 my-4 tracking-tight">{ticket.ticketNumber}</div>
          <p className="text-lg text-slate-300 font-medium capitalize">{ticket.name}</p>
        </div>

        <div className="bg-slate-900 border-t border-slate-700 p-6 flex flex-col gap-4 text-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span>Status</span>
            <span className="px-3 py-1 bg-amber-900/40 text-amber-500 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Menunggu
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-3">
            <span>Estimasi Waktu</span>
            <span className="text-slate-200 font-medium">~ 15 Menit</span>
          </div>
        </div>

        {/* Perforation holes visual */}
        <div className="absolute left-0 right-0 bottom-[116px] flex justify-between">
          <div className="w-4 h-4 bg-slate-900 rounded-full transform -translate-x-1/2"></div>
          <div className="w-4 h-4 bg-slate-900 rounded-full transform translate-x-1/2"></div>
        </div>
      </div>

      <p className="text-slate-500 text-sm mt-8 text-center max-w-xs">
        Mohon bersiap di area tunggu. Layar ini akan otomatis berubah saat nomor Anda dipanggil.
      </p>
    </div>
  );
}
