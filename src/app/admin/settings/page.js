'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';

export default function AdminSettingsPage() {
  const [autoSkip, setAutoSkip] = useState(3);

  async function confirmReset() {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin menghapus semua data antrean hari ini?')) {
      try {
        await fetch('/api/queues', { method: 'DELETE' });
        alert('Data berhasil dikosongkan.');
      } catch (e) {
        console.error('Failed to reset:', e);
      }
    }
  }

  return (
    <div className="bg-slate-900 text-slate-100 h-screen flex overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <AdminTopbar title="Pengaturan Sistem" />

        <div className="p-8 max-w-4xl animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-lg font-medium text-slate-200">Konfigurasi Antrean</h2>
              <p className="text-sm text-slate-400 mt-1">Atur perilaku antrean dan operasional loket layanan.</p>
            </div>

            <div className="p-6 flex flex-col gap-8">
              {/* Toggle System Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-200 font-medium">Status Operasional Loket</h3>
                  <p className="text-sm text-slate-400 mt-1">Buka atau tutup pengambilan antrean baru oleh mahasiswa.</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    id="loket-toggle"
                    defaultChecked
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label htmlFor="loket-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-700 cursor-pointer"></label>
                </div>
              </div>

              <hr className="border-slate-700" />

              {/* Auto-skip Duration */}
              <div className="flex items-start justify-between">
                <div className="max-w-md">
                  <h3 className="text-slate-200 font-medium">Durasi Auto-Skip (Terlewat)</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Waktu maksimal (dalam menit) mahasiswa harus hadir setelah nomornya dipanggil sebelum otomatis dianggap terlewat.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={autoSkip}
                    onChange={(e) => setAutoSkip(parseInt(e.target.value) || 3)}
                    min={1}
                    max={10}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500 text-center"
                  />
                  <span className="text-slate-400 text-sm">Menit</span>
                </div>
              </div>

              <hr className="border-slate-700" />

              {/* Reset System */}
              <div className="flex items-start justify-between">
                <div className="max-w-md">
                  <h3 className="text-red-400 font-medium">Reset Data Hari Ini</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Menghapus seluruh antrean, riwayat, dan laporan untuk hari ini. Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                <button
                  onClick={confirmReset}
                  className="px-4 py-2 bg-red-900/30 text-red-500 hover:bg-red-900/50 border border-red-800/50 rounded-lg text-sm font-medium transition-colors"
                >
                  Kosongkan Data
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex justify-end gap-3">
              <button className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                Batal
              </button>
              <button
                onClick={() => alert('Pengaturan disimpan!')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
