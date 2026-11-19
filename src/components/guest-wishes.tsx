'use client';
import { useEffect, useState } from 'react';
type Wish = { id: string; name: string; wishes: string; created_at: string };
export default function GuestWishes({ compact = false }: { compact?: boolean }) {
  const [wishes, setWishes] = useState<Wish[]>([]); const [error, setError] = useState(false); const [more, setMore] = useState(false); const [loading, setLoading] = useState(false);
  async function load(offset = 0) {
    setLoading(true);
    try {
      const response = await fetch(`/api/wishes?offset=${offset}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      setWishes(previous => offset ? Array.from(new Map<string, Wish>([...previous, ...data.wishes].map(wish => [wish.id, wish])).values()) : data.wishes); setMore(data.wishes.length === 20); setError(false);
    } catch { setError(true); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    const refresh = () => void load();
    refresh(); const timer = window.setInterval(refresh, 60000);
    window.addEventListener('wedding-rsvp-saved', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('wedding-rsvp-saved', refresh); };
  }, []);
  return <div className={`guest-wishes${compact ? ' is-compact' : ''}`} aria-label="Lời chúc gửi đến cô dâu chú rể">
    {!compact && <h2>Lời chúc yêu thương</h2>}
    {error ? <p>Chưa tải được lời chúc. <button disabled={loading} onClick={() => void load()}>Thử lại</button></p> : wishes.length ? <><ul>{wishes.map(wish => <li key={wish.id}><strong>{wish.name}</strong><p>{wish.wishes}</p><time dateTime={wish.created_at}>{new Date(wish.created_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</time></li>)}</ul>{more && <button disabled={loading} className="wish-more" onClick={() => void load(wishes.length)}>{loading ? 'Đang tải…' : 'Xem thêm lời chúc'}</button>}</> : <p className="wishes-empty">Những lời chúc được đồng ý chia sẻ và duyệt sẽ xuất hiện tại đây.</p>}
  </div>;
}
