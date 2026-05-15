'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { History, Check, X, Ticket, Home, Layers, Volume2 } from 'lucide-react';
import MarqueeBar from '@/components/MarqueeBar';

export default function MonitorPage() {
  const [calledTicket, setCalledTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const prevTicketIdRef = useRef(null);

  const playDing = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const enableSound = () => {
    setSoundEnabled(true);
    // Play a test sound to initialize audio context
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      ctx.resume();
    } catch(e) {}
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/queues');
        const queues = await res.json();

        const called = queues.find(q => q.status === 'called');
        
        if (called && prevTicketIdRef.current !== called.id) {
          playDing();
          prevTicketIdRef.current = called.id;
        } else if (!called) {
          prevTicketIdRef.current = null;
        }
        
        setCalledTicket(called || null);

        const hist = queues
          .filter(q => q.status === 'completed' || q.status === 'missed')
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 3);
        setHistory(hist);
      } catch (e) {
        console.error('Failed to fetch:', e);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  return (
    <div className="bg-slate-900 text-slate-100 h-screen w-screen overflow-hidden flex flex-col">
      <MarqueeBar />

      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Main Queue Display */}
        <main className="flex-1 flex flex-col items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900 pointer-events-none"></div>

          <div className="z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-16 rounded-3xl shadow-2xl">
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

        {/* Sidebar: History */}
        <aside className="w-[450px] bg-slate-800 border-l border-slate-700 flex flex-col shrink-0">
          <div className="p-8 border-b border-slate-700 bg-slate-800/50">
            <h3 className="text-xl font-bold text-slate-200 tracking-wide flex items-center gap-3">
              <History className="text-blue-500" />
              Riwayat Panggilan
            </h3>
          </div>

          <div className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">
            {history.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-4">Belum ada riwayat</div>
            ) : (
              history.map(ticket => {
                const isCompleted = ticket.status === 'completed';
                return (
                  <div key={ticket.id} className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-sm flex items-center justify-between transition-all">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">{ticket.serviceName}</div>
                      <div className="text-2xl font-bold text-slate-200">{ticket.ticketNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium flex items-center justify-end gap-1 ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {isCompleted ? 'Selesai' : 'Terlewat'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 flex flex-col items-center justify-center gap-4 bg-slate-800/80">
            <div className="w-full flex flex-col gap-2">
              <Link
                href="/ticket/waiting"
                className="w-full py-2.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-400 border border-blue-800/50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" /> Cek Status Antrean Saya
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Kembali ke Beranda
              </Link>
            </div>

            <div className="flex flex-col items-center gap-1 mt-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <div className="text-slate-500 text-xs font-semibold tracking-widest">ZENITH QUEUE</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sound Toggle Button */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`absolute bottom-6 right-[480px] p-3 rounded-full shadow-lg transition-all z-50 flex items-center justify-center
          ${soundEnabled ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-700/80 text-slate-400 hover:text-slate-200 backdrop-blur-sm border border-slate-600'}`}
        title={soundEnabled ? "Suara Aktif" : "Aktifkan Suara Notifikasi"}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <div className="relative">
            <Volume2 className="w-5 h-5 opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-slate-400 -rotate-45 rounded-full"></div>
          </div>
        )}
      </button>
    </div>
  );
}
