'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
export type PublicWish = { id: string; name: string; wishes: string; created_at: string };
type WishesState = { wishes: PublicWish[]; loading: boolean; error: boolean; more: boolean; refresh: () => void; loadMore: () => void };
const WishesContext = createContext<WishesState | null>(null);
export function WishesProvider({ active, children }: { active: boolean; children: ReactNode }) {
  const [wishes, setWishes] = useState<PublicWish[]>([]);
  const [limit, setLimit] = useState(20); const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); const [more, setMore] = useState(false);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    if (!active) return;
    const requestId = ++sequence.current; setLoading(true);
    try {
      const response = await fetch(`/api/wishes?limit=${limit}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (requestId !== sequence.current) return;
      setWishes(data.wishes); setMore(data.hasMore && limit < 200); setError(false);
    } catch { if (requestId === sequence.current) setError(true); }
    finally { if (requestId === sequence.current) setLoading(false); }
  }, [active, limit]);
  useEffect(() => {
    if (!active) return;
    const update = () => { if (!document.hidden) void refresh(); };
    update(); const timer = window.setInterval(update, 10000);
    window.addEventListener('wedding-rsvp-saved', update); document.addEventListener('visibilitychange', update);
    return () => { ++sequence.current; window.clearInterval(timer); window.removeEventListener('wedding-rsvp-saved', update); document.removeEventListener('visibilitychange', update); };
  }, [active, refresh]);
  return <WishesContext.Provider value={{ wishes, loading, error, more, refresh: () => void refresh(), loadMore: () => setLimit(current => Math.min(200, current + 20)) }}>{children}</WishesContext.Provider>;
}
export function useWishes() {
  const context = useContext(WishesContext);
  if (!context) throw new Error('WishesProvider is required');
  return context;
}
