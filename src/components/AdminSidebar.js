'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Star, Settings, LogOut, Layers } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Laporan' },
  { href: '/admin/reviews', icon: Star, label: 'Ulasan' },
  { href: '/admin/settings', icon: Settings, label: 'Pengaturan' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <Layers className="w-6 h-6 text-blue-500 mr-3" />
        <span className="font-bold tracking-wider text-slate-100">
          ZENITH<span className="text-blue-500">QUEUE</span>
        </span>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg font-medium transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </Link>
      </div>
    </aside>
  );
}
