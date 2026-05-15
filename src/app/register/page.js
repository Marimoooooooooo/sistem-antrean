'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Ticket } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [serviceName, setServiceName] = useState('Layanan');
  const [serviceCode, setServiceCode] = useState('SRV');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingTicket, setExistingTicket] = useState(null);

  useEffect(() => {
    const sn = sessionStorage.getItem('selected_service_name');
    const sc = sessionStorage.getItem('selected_service_code');
    if (sn) setServiceName(sn);
    if (sc) setServiceCode(sc);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    setError('');
    setExistingTicket(null);

    try {
      const res = await fetch('/api/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          serviceName,
          serviceCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('current_ticket_id', data.id);
        sessionStorage.setItem('current_ticket', JSON.stringify(data));
        router.push('/ticket/generated');
      } else if (res.status === 409) {
        // Sudah punya antrean aktif
        setError(data.error);
        setExistingTicket(data.existingTicket || null);
      } else {
        setError(data.error || 'Gagal mendaftar antrean.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  function goToExistingTicket() {
    if (existingTicket) {
      sessionStorage.setItem('current_ticket_id', existingTicket.id);
      sessionStorage.setItem('current_ticket', JSON.stringify(existingTicket));
      router.push('/ticket/waiting');
    }
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 bg-slate-900 border-b border-slate-700 sticky top-0 z-10 shadow-sm flex items-center">
        <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <div className="flex-1 text-center pr-6">
          <h1 className="text-xl font-semibold tracking-wide">Data Diri</h1>
          <p className="text-slate-400 text-sm mt-1">{serviceName}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col max-w-md mx-auto w-full animate-fade-in">
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-sm flex flex-col gap-5">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
              {existingTicket && (
                <button
                  type="button"
                  onClick={goToExistingTicket}
                  className="w-full py-2.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-400 border border-blue-800/50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Lihat Antrean Saya ({existingTicket.ticketNumber})
                </button>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-300">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-300">Nomor Handphone (WhatsApp)</label>
            <input
              type="tel"
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors mt-2 shadow-sm"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Antrean'}
          </button>
        </form>
      </main>
    </div>
  );
}
