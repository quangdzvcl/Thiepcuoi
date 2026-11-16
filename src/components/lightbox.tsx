'use client';
import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { wedding as w } from '@/config/wedding';
export default function Lightbox({ index, close, change }: { index: number; close: () => void; change: (value: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const active = document.activeElement as HTMLElement; const el = dialog.current; el?.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { el?.close(); document.body.style.overflow = overflow; active?.focus(); }; }, []);
  return <dialog ref={dialog} className="lightbox" aria-label="Album ảnh cưới" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => { if (e.key === 'ArrowRight') change((index + 1) % w.gallery.length); if (e.key === 'ArrowLeft') change((index + w.gallery.length - 1) % w.gallery.length); }}><button autoFocus className="lightbox-close icon-button" aria-label="Đóng ảnh" onClick={close}><X /></button><button className="icon-button" aria-label="Ảnh trước" onClick={() => change((index + w.gallery.length - 1) % w.gallery.length)}><ChevronLeft /></button><figure><img src={w.gallery[index].src} alt={w.gallery[index].alt} /><figcaption>{w.gallery[index].alt} · {index + 1}/{w.gallery.length}</figcaption></figure><button className="icon-button" aria-label="Ảnh tiếp" onClick={() => change((index + 1) % w.gallery.length)}><ChevronRight /></button></dialog>;
}
