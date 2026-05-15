'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';

export default function AdminForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    alert('Tautan reset password telah dikirim ke email Anda.');
    router.push('/admin/login');
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden animate-fade-in">
        <div className="p-8 border-b border-slate-700 relative">
          <button
            onClick={() => router.push('/admin/login')}
            className="absolute left-6 top-8 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-700 mb-4 shadow-sm">
              <KeyRound className="text-slate-300 w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Reset Password</h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed px-4">
              Masukkan email admin Anda untuk menerima tautan pemulihan kata sandi.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">Alamat Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-slate-500" />
              </div>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kampus.ac.id"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-2 shadow-sm flex justify-center items-center gap-2"
          >
            Kirim Tautan Reset
          </button>
        </form>
      </div>
    </div>
  );
}
