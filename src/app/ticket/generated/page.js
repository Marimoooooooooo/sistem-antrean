'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Printer, Info, ExternalLink } from 'lucide-react';

export default function TicketGeneratedPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('current_ticket');
    if (!stored) {
      router.push('/');
      return;
    }
    setTicket(JSON.parse(stored));
  }, [router]);

  if (!ticket) return null;

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 relative animate-fade-in">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col text-center relative">
        
        <div className="bg-green-900/30 text-green-400 text-sm font-medium py-3 px-4 border-b border-slate-700 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Tiket Berhasil Dibuat
        </div>

        <div className="p-8 flex flex-col items-center">
          <h2 className="text-sm text-slate-400 font-medium mb-1">{ticket.serviceName}</h2>
          <div className="text-5xl font-bold text-slate-100 my-4 tracking-tight">{ticket.ticketNumber}</div>
          <p className="text-lg text-slate-300 font-medium capitalize">{ticket.name}</p>
        </div>

        <div className="bg-slate-900 border-t border-slate-700 p-6 flex flex-col gap-3">
          <button
            onClick={() => alert('Mencetak tiket...')}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Cetak Tiket
          </button>

          <Link
            href="/"
            className="w-full bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-300 font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
          >
            <Info className="w-4 h-4" /> Lihat Info (Monitor Layar)
          </Link>

          <Link
            href="/ticket/waiting"
            className="w-full mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors underline text-center"
          >
            Cek Status Antrean Live Saya
          </Link>
        </div>
      </div>
    </div>
  );
}
