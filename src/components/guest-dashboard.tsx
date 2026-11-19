'use client';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { attendanceLabels, csvCell, sideLabels, type Guest } from '@/lib/guest-list';
import './guest-dashboard.css';

type Stats = { responses: number; accepted: number; declined: number; maybe: number; attendees: number; groom_attendees: number; bride_attendees: number; pending_wishes: number };
type Result = { guests: Guest[]; total: number; stats: Stats };
export default function GuestDashboard({ email, configured }: { email: string | null; configured: boolean }) {
  const [account, setAccount] = useState(email);
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1); const [attendance, setAttendance] = useState(''); const [side, setSide] = useState(''); const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState(''); const [exporting, setExporting] = useState(false);
  const query = useCallback((nextPage: number) => new URLSearchParams({ page: String(nextPage), attendance, side, search }), [attendance, side, search]);
  const load = useCallback(async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch(`/api/admin/rsvps?${query(page)}`, { cache: 'no-store' });
      const result = await response.json();
      if (response.status === 401) { setAccount(null); setData(null); }
      if (!response.ok) throw new Error(result.message);
      setData(result);
    } catch (err) { setError(err instanceof Error ? err.message : 'Chưa tải được danh sách.'); setData(null); }
    finally { setBusy(false); }
  }, [page, query]);
  useEffect(() => { if (account) void load(); }, [account, load]);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const form = event.currentTarget; const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      form.reset(); setAccount(String(values.email));
    } catch (err) { setError(err instanceof Error ? err.message : 'Chưa đăng nhập được.'); }
    finally { setBusy(false); }
  }
  async function logout() {
    const response = await fetch('/api/admin/session', { method: 'DELETE' });
    if (response.ok) { setAccount(null); setData(null); setError(''); }
    else setError('Chưa đăng xuất được. Vui lòng thử lại.');
  }
  async function moderate(guest: Guest) {
    setBusy(true); setError('');
    try {
      const response = await fetch(`/api/admin/rsvps/${guest.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: !guest.wish_approved }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Chưa cập nhật được.'); }
    finally { setBusy(false); }
  }
  async function download() {
    if (!data) return;
    setExporting(true); setError('');
    try {
      const rows: Guest[] = [];
      for (let nextPage = 1; nextPage <= Math.max(1, Math.ceil(data.total / 50)); nextPage++) {
        const response = await fetch(`/api/admin/rsvps?${query(nextPage)}`, { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        rows.push(...result.guests);
      }
      const lines: unknown[][] = [['Họ tên', 'Điện thoại', 'Khách của', 'Tham dự', 'Số người', 'Lời chúc', 'Đồng ý công khai', 'Đã duyệt', 'Gửi lúc']];
      rows.forEach(row => lines.push([row.name, row.phone, sideLabels[row.side], attendanceLabels[row.attendance], row.guests, row.wishes, row.publish_wish ? 'Có' : 'Không', row.wish_approved ? 'Có' : 'Không', new Date(row.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })]));
      const url = URL.createObjectURL(new Blob(['\uFEFF', lines.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a'); link.href = url; link.download = 'khach-moi-xuan-quang-vo-hong.csv'; link.click(); URL.revokeObjectURL(url);
    } catch (err) { setError(err instanceof Error ? err.message : 'Chưa xuất được danh sách.'); }
    finally { setExporting(false); }
  }
  if (!account) return <main className="guest-admin"><section className="admin-login"><span className="admin-kicker">Xuân Quang & Võ Hồng</span><h1>Quản lý khách mời</h1><p>Đăng nhập bằng tài khoản quản lý thiệp để xem xác nhận và lời chúc.</p>{!configured && <p className="admin-error" role="status">Chưa kết nối Supabase và tài khoản quản lý. Form hiện chưa lưu dữ liệu thật; danh sách khách sẽ có sau khi hoàn tất kết nối.</p>}<form onSubmit={login}><label>Email<input name="email" type="email" required autoComplete="username" /></label><label>Mật khẩu<input name="password" type="password" required maxLength={256} autoComplete="current-password" /></label><button disabled={busy || !configured}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></form>{error && <p className="admin-error" role="alert">{error}</p>}<a href="/">← Về thiệp cưới</a></section></main>;
  return <main className="guest-admin"><header className="admin-header"><div><span className="admin-kicker">Xuân Quang & Võ Hồng</span><h1>Danh sách khách mời</h1><p>{account}</p></div><div className="admin-actions"><a href="/">Xem thiệp</a><button onClick={() => void logout()}>Đăng xuất</button></div></header>
    {data && <><section className="admin-stats" aria-label="Tổng quan"><article><strong>{data.stats.responses}</strong><span>Phản hồi</span></article><article><strong>{data.stats.accepted}</strong><span>Khách xác nhận sẽ đến</span></article><article><strong>{data.stats.attendees}</strong><span>Tổng người dự kiến</span></article><article><strong>{data.stats.maybe}</strong><span>Chưa chắc</span></article><article><strong>{data.stats.declined}</strong><span>Không tham dự</span></article><article><strong>{data.stats.pending_wishes}</strong><span>Lời chúc chờ duyệt</span></article></section><p className="admin-note">Số người đã nhận lời: nhà trai <b>{data.stats.groom_attendees}</b> · nhà gái <b>{data.stats.bride_attendees}</b>. Chỉ cộng người chọn “Sẽ tham dự”; mỗi phản hồi có thể gồm nhiều người. Một người gửi lại nhiều lần vẫn tính là nhiều phản hồi.</p></>}
    <form className="admin-filters" onSubmit={event => { event.preventDefault(); setPage(1); setSearch(searchInput); }}><label>Tìm tên<input value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Nhập tên khách" maxLength={100} /></label><label>Tham dự<select value={attendance} onChange={event => { setAttendance(event.target.value); setPage(1); }}><option value="">Tất cả</option><option value="yes">Sẽ tham dự</option><option value="no">Không tham dự</option><option value="maybe">Chưa chắc</option></select></label><label>Khách của<select value={side} onChange={event => { setSide(event.target.value); setPage(1); }}><option value="">Hai nhà</option><option value="groom">Nhà trai</option><option value="bride">Nhà gái</option></select></label><button disabled={busy}>Tìm kiếm</button><button type="button" disabled={busy} onClick={() => void load()}>Làm mới</button><button type="button" disabled={busy || exporting || !data?.total} onClick={() => void download()}>{exporting ? 'Đang xuất…' : 'Tải CSV / Excel'}</button></form>
    {error && <p className="admin-error" role="alert">{error}</p>}{busy && <p role="status">Đang cập nhật…</p>}
    {data && <><p>{data.total} phản hồi khớp bộ lọc · Mới nhất trước</p><div className="admin-table-wrap"><table><thead><tr><th>Khách mời</th><th>Tham dự</th><th>Số người</th><th>Lời chúc</th><th>Gửi lúc</th></tr></thead><tbody>{data.guests.map(guest => <tr key={guest.id}><td><b>{guest.name}</b><br /><a href={`tel:${guest.phone.replace(/[^+0-9]/g, '')}`}>{guest.phone}</a><br />{sideLabels[guest.side]}</td><td><span className={`attendance-badge ${guest.attendance}`}>{attendanceLabels[guest.attendance]}</span></td><td>{guest.guests}</td><td className="admin-wish">{guest.wishes || '—'}{guest.wishes && <div>{guest.publish_wish ? <button disabled={busy} onClick={() => void moderate(guest)}>{guest.wish_approved ? 'Ẩn khỏi thiệp' : 'Duyệt lên thiệp'}</button> : <small>Khách gửi riêng cho gia đình</small>}</div>}</td><td>{new Date(guest.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td></tr>)}</tbody></table>{!data.guests.length && <p className="admin-empty">Chưa có xác nhận nào khớp bộ lọc. Danh sách sẽ hiện sau khi khách gửi thành công.</p>}</div><nav className="admin-pagination" aria-label="Phân trang"><button disabled={page <= 1 || busy} onClick={() => setPage(page - 1)}>← Trang trước</button><span>Trang {page} / {Math.max(1, Math.ceil(data.total / 50))}</span><button disabled={page * 50 >= data.total || busy} onClick={() => setPage(page + 1)}>Trang sau →</button></nav></>}
  </main>;
}
