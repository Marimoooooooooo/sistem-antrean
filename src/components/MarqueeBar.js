'use client';

export default function MarqueeBar() {
  return (
    <div className="bg-blue-800 text-blue-50 py-3 text-lg font-medium tracking-wider marquee-container border-b border-blue-900 shrink-0 z-10">
      <div className="marquee-content">
        SELAMAT DATANG DI ENTERPRISE STUDENT QUEUE SYSTEM. HARAP MEMPERSIAPKAN KARTU IDENTITAS ANDA SEBELUM MENUJU LOKET. TETAP JAGA KETERTIBAN DAN KEAMANAN BERSAMA.
      </div>
    </div>
  );
}
