'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MessageSquareHeart } from 'lucide-react';

export default function TicketCompletedPage() {
  const router = useRouter();

  function handleNewQueue() {
    sessionStorage.removeItem('current_ticket_id');
    sessionStorage.removeItem('current_ticket');
    router.push('/');
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl shadow-sm p-8 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-2xl font-bold text-slate-100 mb-2">Pelayanan Selesai</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Terima kasih telah menggunakan layanan kami. Semoga hari Anda menyenangkan!
        </p>

        <Link
          href="/feedback"
          className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <MessageSquareHeart className="w-4 h-4" />
          Berikan Penilaian
        </Link>

        <button
          onClick={handleNewQueue}
          className="w-full mt-3 bg-transparent hover:bg-slate-700/50 text-slate-400 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
