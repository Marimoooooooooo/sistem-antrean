'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { Users, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    async function fetchQueues() {
      try {
        const res = await fetch('/api/queues');
        const data = await res.json();
        setQueues(data);
      } catch (e) {
        console.error('Failed to fetch queues:', e);
      }
    }

    fetchQueues();
    const interval = setInterval(fetchQueues, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeQueues = queues.filter(q => q.status === 'waiting' || q.status === 'called' || q.status === 'serving');
  const isAnyCalled = queues.some(q => q.status === 'called');

  async function callTicket(id) {
    try {
      await fetch(`/api/queues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'called' }),
      });
    } catch (e) {
      console.error('Failed to call ticket:', e);
    }
  }

  async function completeTicket(id) {
    try {
      await fetch(`/api/queues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
    } catch (e) {
      console.error('Failed to complete ticket:', e);
    }
  }

  async function skipTicket(id) {
    try {
      await fetch(`/api/queues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'missed' }),
      });
    } catch (e) {
      console.error('Failed to skip ticket:', e);
    }
  }

  async function clearAll() {
    if (confirm('Hapus semua antrean saat ini?')) {
      try {
        await fetch('/api/queues', { method: 'DELETE' });
      } catch (e) {
        console.error('Failed to clear:', e);
      }
    }
  }

  function getWaitMinutes(timestamp) {
    return Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
  }

  function getCalledTimer(calledAt) {
    if (!calledAt) return '--:--';
    const diffSecs = Math.floor((Date.now() - new Date(calledAt).getTime()) / 1000);
    const remaining = 180 - diffSecs;
    if (remaining <= 0) return '00:00';
    const m = Math.floor(remaining / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    return `(${m}:${s})`;
  }

  function isTimerUrgent(calledAt) {
    if (!calledAt) return false;
    const diffSecs = Math.floor((Date.now() - new Date(calledAt).getTime()) / 1000);
    return (180 - diffSecs) < 30;
  }

  return (
    <div className="bg-slate-900 text-slate-100 h-screen flex overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar title="Tabel Antrean Aktif" />

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col max-h-full">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="font-medium text-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Daftar Antrean Hari Ini
              </h2>
              <button
                onClick={clearAll}
                className="text-sm px-3 py-1.5 text-slate-400 border border-slate-600 rounded hover:bg-slate-700 transition-colors"
              >
                Reset Data (Testing)
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium border-b border-slate-700">No. Antrean</th>
                    <th className="p-4 font-medium border-b border-slate-700">Nama Lengkap</th>
                    <th className="p-4 font-medium border-b border-slate-700">Layanan</th>
                    <th className="p-4 font-medium border-b border-slate-700">Status & Timer</th>
                    <th className="p-4 font-medium border-b border-slate-700 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-700/50">
                  {activeQueues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        {queues.length === 0
                          ? 'Tidak ada antrean aktif saat ini.'
                          : 'Semua antrean telah selesai/terlewat.'}
                      </td>
                    </tr>
                  ) : (
                    activeQueues.map(ticket => (
                      <tr key={ticket.id} className={ticket.status === 'called' ? 'bg-blue-900/10' : 'hover:bg-slate-800/80'}>
                        <td className="p-4 font-semibold text-slate-200">{ticket.ticketNumber}</td>
                        <td className="p-4 text-slate-300">
                          {ticket.name}
                          <br />
                          <span className="text-xs text-slate-500">{ticket.phone}</span>
                        </td>
                        <td className="p-4 text-slate-300">{ticket.serviceName}</td>
                        <td className="p-4">
                          {ticket.status === 'waiting' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                              <Clock className="w-3 h-3" /> Menunggu ({getWaitMinutes(ticket.timestamp)}m)
                            </span>
                          )}
                          {ticket.status === 'called' && (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                              isTimerUrgent(ticket.calledAt)
                                ? 'bg-red-900 text-red-300 border-red-700'
                                : 'bg-blue-900 text-blue-300 border-blue-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                isTimerUrgent(ticket.calledAt) ? 'bg-red-400' : 'bg-blue-400'
                              }`}></span>
                              Dipanggil <span className="font-mono">{getCalledTimer(ticket.calledAt)}</span>
                            </span>
                          )}
                          {ticket.status === 'serving' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700">
                              Sedang Dilayani
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {ticket.status === 'waiting' ? (
                            <>
                              <button
                                onClick={() => callTicket(ticket.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm bg-blue-600 hover:bg-blue-500 text-white"
                              >
                                Panggil
                              </button>
                              <button
                                onClick={() => skipTicket(ticket.id)}
                                className="ml-2 px-3 py-1.5 bg-transparent border border-slate-600 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                              >
                                Lewati
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => completeTicket(ticket.id)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                              >
                                Selesai
                              </button>
                              <button
                                onClick={() => skipTicket(ticket.id)}
                                className="ml-2 px-3 py-1.5 bg-transparent border border-red-900/50 hover:bg-red-900/30 text-red-400 rounded-lg text-xs font-medium transition-colors"
                              >
                                Lewati (Miss)
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
