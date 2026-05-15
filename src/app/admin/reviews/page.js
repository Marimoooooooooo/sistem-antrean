'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { MessageSquare, MessageSquareOff, Star } from 'lucide-react';

export default function AdminReviewsPage() {
  const [feedbacks, setFeedbacks] = useState([]);

  async function fetchFeedbacks() {
    try {
      const res = await fetch('/api/feedbacks');
      setFeedbacks(await res.json());
    } catch (e) {
      console.error('Failed to fetch feedbacks:', e);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function clearReviews() {
    if (confirm('Hapus semua ulasan?')) {
      try {
        await fetch('/api/feedbacks', { method: 'DELETE' });
        setFeedbacks([]);
      } catch (e) {
        console.error('Failed to clear:', e);
      }
    }
  }

  return (
    <div className="bg-slate-900 text-slate-100 h-screen flex overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar title="Ulasan Pengguna" />

        <div className="flex-1 p-8 overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Daftar Ulasan & Penilaian
            </h2>
            <button
              onClick={clearReviews}
              className="text-sm px-3 py-1.5 text-slate-400 border border-slate-600 rounded hover:bg-slate-700 transition-colors"
            >
              Hapus Semua Ulasan
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <div className="col-span-full p-12 flex flex-col items-center justify-center text-slate-500 bg-slate-800/50 border border-slate-700 rounded-xl border-dashed">
              <MessageSquareOff className="w-12 h-12 mb-4 text-slate-600" />
              <p>Belum ada ulasan yang masuk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {feedbacks.map(fb => {
                const date = new Date(fb.timestamp);
                const formattedDate = date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={fb.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-200">{fb.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {fb.ticketNumber} • {fb.serviceName}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i <= fb.rating ? 'text-amber-400 fill-current' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                      <p className="text-sm text-slate-300 italic">
                        &quot;{fb.review || 'Tidak ada ulasan tertulis.'}&quot;
                      </p>
                    </div>
                    <div className="text-xs text-slate-500 text-right">
                      {formattedDate}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
