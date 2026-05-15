'use client';

import { useRouter } from 'next/navigation';
import { Clock4, RefreshCw } from 'lucide-react';

export default function TicketMissedPage() {
  const router = useRouter();

  function handleNewQueue() {
    sessionStorage.removeItem('current_ticket_id');
    sessionStorage.removeItem('current_ticket');
    router.push('/');
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl shadow-sm p-8 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Clock4 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-bold text-slate-100 mb-2 uppercase tracking-wide">
          MAAF, WAKTU ANDA HABIS
        </h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Nomor antrean Anda telah terlewat karena melebihi batas waktu panggilan (3 Menit). Silakan mengambil nomor antrean baru.
        </p>

        <button
          onClick={handleNewQueue}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Ambil Antrean Baru
        </button>
      </div>
    </div>
  );
}
