'use client';
import { useEffect, useState } from 'react';
import { wedding as w } from '@/config/wedding';
export default function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => { const update = () => setRemaining(Math.max(0, new Date(w.date).getTime() - Date.now())); update(); const timer = setInterval(update, 1000); return () => clearInterval(timer); }, []);
  const seconds = Math.floor((remaining ?? 0) / 1000);
  const values = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  return <div className="countdown" role="timer" aria-label={remaining === 0 ? 'Ngày hạnh phúc đã đến' : 'Đếm ngược đến ngày cưới'}>{values.map((value, i) => <div key={i}><strong>{remaining === null ? '—' : String(value).padStart(2, '0')}</strong><span>{['ngày', 'giờ', 'phút', 'giây'][i]}</span></div>)}</div>;
}
