'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import StarRating from '@/components/StarRating';

export default function FeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      alert('Silakan pilih rating terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const ticketId = sessionStorage.getItem('current_ticket_id');

      await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          rating,
          review,
        }),
      });

      alert('Terima kasih atas penilaian Anda!');
      sessionStorage.removeItem('current_ticket_id');
      sessionStorage.removeItem('current_ticket');
      router.push('/');
    } catch (e) {
      alert('Gagal mengirim penilaian.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      <header className="p-6 bg-slate-900 border-b border-slate-700 sticky top-0 z-10 shadow-sm flex items-center">
        <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white transition-colors">
          <X />
        </button>
        <div className="flex-1 text-center pr-6">
          <h1 className="text-xl font-semibold tracking-wide">Penilaian Layanan</h1>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-md mx-auto w-full animate-fade-in">
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-sm flex flex-col items-center w-full">
          <h2 className="text-lg font-medium text-slate-200 mb-6 text-center">
            Seberapa puas Anda dengan pelayanan kami hari ini?
          </h2>

          <div className="mb-8">
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="w-full flex flex-col gap-2 mb-6">
            <label htmlFor="review" className="text-sm font-medium text-slate-400">
              Ulasan Singkat (Opsional)
            </label>
            <textarea
              id="review"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Bagikan pengalaman Anda..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            {loading ? 'Mengirim...' : 'Kirim Penilaian'}
          </button>
        </form>
      </main>
    </div>
  );
}
