'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import { wedding as w } from '@/config/wedding';
export default function RSVP({ initialName = '', initialAttendance = 'yes' }: { initialName?: string; initialAttendance?: string }) {
  const [status, setStatus] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false); const [attendance, setAttendance] = useState(initialAttendance);
  const submission = useRef<string | null>(null);
  const previousPayload = useRef('');
  const reduced = useReducedMotion();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return; setBusy(true); setStatus('');
    const form = e.currentTarget; const values = Object.fromEntries(new FormData(form));
    const payload = JSON.stringify(values);
    if (!submission.current || previousPayload.current !== payload) submission.current = crypto.randomUUID();
    previousPayload.current = payload;
    try {
      const response = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, submission_id: submission.current, publish_wish: values.publish_wish === 'on', guests: attendance === 'no' ? 0 : Number(values.guests) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Gửi chưa thành công.');
      setStatus(data.message);
      if (!data.demo) { setDone(true); window.dispatchEvent(new Event('wedding-rsvp-saved')); if (!reduced) { try { const confetti = (await import('canvas-confetti')).default; confetti({ particleCount: 75, spread: 65, origin: { y: 0.7 }, colors: ['#86232c', '#b78d53', '#f4dfdc'], disableForReducedMotion: true }); } catch { /* RSVP already saved. */ } } }
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Kết nối gặp lỗi, vui lòng thử lại.'); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="rsvp-form"><div className="form-grid"><label>Họ và tên <span>*</span><input name="name" defaultValue={initialName} placeholder="Tên thân thương của bạn" required minLength={2} maxLength={100} autoComplete="name" /></label><label>Số điện thoại <span>*</span><input name="phone" type="tel" placeholder="090 123 4567" required pattern="\+?[0-9 \(\)\.\-]{9,20}" maxLength={20} autoComplete="tel" /></label><label>Bạn là khách của<select name="side"><option value="groom">Nhà trai · {w.groom}</option><option value="bride">Nhà gái · {w.bride}</option></select></label><label>Bạn sẽ đến chứ?<select name="attendance" value={attendance} onChange={e => setAttendance(e.target.value)}><option value="yes">Có, mình sẽ đến!</option><option value="no">Tiếc quá, mình không thể đến</option><option value="maybe">Mình sẽ xác nhận sau</option></select></label></div><label>Tổng số khách (bao gồm bạn)<input name="guests" type="number" min={1} max={10} defaultValue={1} required disabled={attendance === 'no'} /></label><label>Gửi một lời yêu thương<textarea name="wishes" rows={3} placeholder="Một lời chúc nhỏ, một niềm vui lớn…" maxLength={1500} /></label><label className="publish-wish-choice"><input type="checkbox" name="publish_wish" defaultChecked />Hiển thị tên và lời chúc của tôi trên thiệp ngay sau khi gửi.</label><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div><p className="privacy-note">Số điện thoại và xác nhận chỉ dành cho gia đình. Lời chúc được giữ riêng nếu bạn không chọn chia sẻ.</p><button className="button primary w-full" disabled={busy || done} type="submit">{busy ? 'Đang gửi…' : done ? 'Đã nhận lời nhắn của bạn' : 'Gửi xác nhận & lời chúc'}{done ? <Check size={17} /> : <Send size={17} />}</button><p role="status" aria-live="polite" className="form-status">{status}</p></form>;
}
