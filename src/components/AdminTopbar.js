'use client';

export default function AdminTopbar({ title, children }) {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8 shrink-0">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Sistem Aktif
        </div>
        <div className="h-6 w-px bg-slate-700 mx-2"></div>
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium border border-slate-600">
          AD
        </div>
      </div>
    </header>
  );
}
