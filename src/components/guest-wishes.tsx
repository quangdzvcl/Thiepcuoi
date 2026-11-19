'use client';
import { useWishes } from './wishes-provider';
export default function GuestWishes({ compact = false }: { compact?: boolean }) {
  const { wishes, loading, error, more, refresh, loadMore } = useWishes();
  return <div className={`guest-wishes${compact ? ' is-compact' : ''}`} aria-label="Lời chúc gửi đến cô dâu chú rể">
    {!compact && <h2>Lời chúc yêu thương</h2>}
    {error && <p>Chưa cập nhật được lời chúc. <button disabled={loading} onClick={refresh}>Thử lại</button></p>}
    {wishes.length ? <><ul>{wishes.map(wish => <li key={wish.id}><strong>{wish.name}</strong><p>{wish.wishes}</p><time dateTime={wish.created_at}>{new Date(wish.created_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</time></li>)}</ul>{more && <button disabled={loading} className="wish-more" onClick={loadMore}>{loading ? 'Đang tải…' : 'Xem thêm lời chúc'}</button>}</> : !error && <p className="wishes-empty">{loading ? 'Đang tải lời chúc…' : 'Gửi lời yêu thương đầu tiên đến chúng mình nhé.'}</p>}
  </div>;
}
