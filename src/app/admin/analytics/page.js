'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { Users, Clock, Star, TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [queues, setQueues] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [qRes, fRes] = await Promise.all([
          fetch('/api/queues'),
          fetch('/api/feedbacks'),
        ]);
        setQueues(await qRes.json());
        setFeedbacks(await fRes.json());
      } catch (e) {
        console.error('Failed to fetch:', e);
      }
    }
    fetchData();
  }, []);

  const totalQueues = queues.length;
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  // Calculate avg wait time for completed tickets
  const completedWithCalledAt = queues.filter(q => q.status === 'completed' && q.calledAt);
  let avgWait = '0m 0s';
  if (completedWithCalledAt.length > 0) {
    const totalMs = completedWithCalledAt.reduce((sum, q) => {
      return sum + (new Date(q.calledAt).getTime() - new Date(q.timestamp).getTime());
    }, 0);
    const avgMs = totalMs / completedWithCalledAt.length;
    const mins = Math.floor(avgMs / 60000);
    const secs = Math.floor((avgMs % 60000) / 1000);
    avgWait = `${mins}m ${secs}s`;
  }

  return (
    <div className="bg-slate-900 text-slate-100 h-screen flex overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <AdminTopbar title="Laporan & Analitik" />

        <div className="p-8 flex flex-col gap-6 animate-fade-in">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Total Antrean Hari Ini</p>
                  <h3 className="text-3xl font-bold text-slate-100">{totalQueues}</h3>
                </div>
                <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-800/50">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-green-400 mt-4 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Data real-time
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Rata-rata Waktu Tunggu</p>
                  <h3 className="text-3xl font-bold text-slate-100">{avgWait}</h3>
                </div>
                <div className="p-2 bg-amber-900/50 rounded-lg border border-amber-800/50">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Berdasarkan tiket selesai
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Tingkat Kepuasan</p>
                  <h3 className="text-3xl font-bold text-slate-100">
                    {avgRating} <span className="text-lg text-slate-500 font-normal">/ 5.0</span>
                  </h3>
                </div>
                <div className="p-2 bg-green-900/50 rounded-lg border border-green-800/50">
                  <Star className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-xs text-green-400 mt-4 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Berdasarkan {feedbacks.length} ulasan
              </p>
            </div>
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="text-slate-200 font-medium mb-6">Tren Antrean Per Jam</h3>
              <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg min-h-[300px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                <svg className="absolute inset-0 w-full h-full text-blue-500/50" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,100 L0,50 Q25,30 50,60 T100,40 L100,100 Z" fill="currentColor" opacity="0.3"></path>
                  <path d="M0,50 Q25,30 50,60 T100,40" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
                <span className="text-slate-500 text-sm z-10 bg-slate-900 px-3 py-1 rounded">Area Grafik Garis</span>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="text-slate-200 font-medium mb-6">Distribusi Layanan</h3>
              <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg min-h-[300px] flex items-center justify-center relative">
                <div className="w-48 h-48 rounded-full border-8 border-slate-700 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 border-[16px] border-blue-500 rounded-full clip-half"></div>
                  <div className="absolute inset-0 border-[16px] border-indigo-500 rounded-full rotate-90 clip-quarter"></div>
                </div>
                <span className="text-slate-500 text-sm absolute z-10 bg-slate-900 px-3 py-1 rounded">Area Grafik Lingkaran</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
