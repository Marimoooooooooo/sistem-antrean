'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hand, CreditCard, Shirt, ChevronRight, History, Check, X, UserCog, Ticket } from 'lucide-react';
import MarqueeBar from '@/components/MarqueeBar';

export default function HomePage() {
  const router = useRouter();
  const [calledTicket, setCalledTicket] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/queues');
        const queues = await res.json();

        const called = queues.find(q => q.status === 'called');
        setCalledTicket(called || null);

        const hist = queues
          .filter(q => q.status === 'completed' || q.status === 'missed')
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 3);
        setHistory(hist);
      } catch (e) {
        console.error('Failed to fetch queues:', e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  function selectService(serviceName, serviceCode) {
    sessionStorage.setItem('selected_service_name', serviceName);
    sessionStorage.setItem('selected_service_code', serviceCode);
    router.push('/register');
  }

  return (
    <div className="bg-slate-900 text-slate-100 h-screen w-screen overflow-hidden flex flex-col relative">
      <MarqueeBar />

      {/* Admin Portal Button */}
      <Link
        href="/admin/login"
        className="absolute top-16 right-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 shadow-sm"
      >
        <span className="text-sm font-medium">Admin Portal</span>
        <UserCog className="w-5 h-5" />
      </Link>

      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Main Queue Display */}
        <main className="flex-1 flex flex-col items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900 pointer-events-none"></div>

          <div className="z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-16 rounded-3xl shadow-2xl animate-fade-in">
            <h2 className="text-3xl text-slate-400 font-medium uppercase tracking-[0.2em] mb-4">
              NOMOR ANTREAN DIPANGGIL
            </h2>
            <div className={`text-[12rem] font-black text-blue-500 leading-none tracking-tight my-8 drop-shadow-lg ${calledTicket ? 'animate-pulse text-glow' : ''}`}>
              {calledTicket ? calledTicket.ticketNumber : '--'}
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 px-8 py-4 rounded-2xl border border-slate-700/50">
              <p className="text-3xl text-slate-300 font-medium capitalize">
                {calledTicket ? calledTicket.name : 'Menunggu Antrean...'}
              </p>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              <p className="text-2xl text-blue-400 font-semibold uppercase tracking-wide">
                {calledTicket ? calledTicket.serviceName : 'Layanan'}
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar: Ambil Antrean & Riwayat */}
        <aside className="w-[450px] bg-slate-800 border-l border-slate-700 flex flex-col shrink-0 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          {/* Ambil Antrean */}
          <div className="p-6 border-b border-slate-700 bg-slate-800/80 mt-12">
            <h3 className="text-xl font-bold text-slate-200 tracking-wide flex items-center gap-3 mb-4">
              <Hand className="text-blue-500" />
              Ambil Antrean
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => selectService('Pengambilan KPM', 'KPM')}
                className="w-full text-left bg-slate-900 border border-slate-600 rounded-lg p-4 shadow-sm hover:bg-slate-700 transition-colors duration-200 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-medium text-slate-100">Pengambilan KPM</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Kartu Tanda Mahasiswa</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => selectService('Pengambilan Almamater', 'ALM')}
                className="w-full text-left bg-slate-900 border border-slate-600 rounded-lg p-4 shadow-sm hover:bg-slate-700 transition-colors duration-200 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-medium text-slate-100">Ambil Almamater</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Jas Almamater Kampus</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-500 group-hover:text-slate-300" />
              </button>
            </div>
          </div>

          {/* History Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-2 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4" />
                Riwayat Panggilan
              </h3>
            </div>

            <div className="flex-1 flex flex-col p-6 gap-3 overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center text-slate-500 text-sm mt-4">Belum ada riwayat</div>
              ) : (
                history.map((ticket) => {
                  const isCompleted = ticket.status === 'completed';
                  return (
                    <div key={ticket.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-sm flex items-center justify-between transition-all">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{ticket.serviceName}</div>
                        <div className="text-lg font-bold text-slate-200">{ticket.ticketNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium flex items-center justify-end gap-1 ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                          {isCompleted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {isCompleted ? 'Selesai' : 'Terlewat'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Check Status */}
          <div className="p-6 border-t border-slate-700 bg-slate-800/80">
            <Link
              href="/ticket/waiting"
              className="w-full py-2.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-400 border border-blue-800/50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" /> Cek Status Antrean Saya
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
