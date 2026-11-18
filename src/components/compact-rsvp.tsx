'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import RSVP from './rsvp-form';

function Details({ name, attendance, close }: { name: string; attendance: string; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const active = document.activeElement as HTMLElement;
    const el = dialog.current;
    el?.showModal();
    return () => { el?.close(); active?.focus(); };
  }, []);
  return <dialog ref={dialog} className="rsvp-dialog" aria-labelledby="rsvp-dialog-title" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <button className="dialog-close icon-button" aria-label="Đóng xác nhận tham dự" onClick={close}><X size={20} /></button>
    <h2 id="rsvp-dialog-title">Xác nhận tham dự</h2><p>Thêm thông tin để gia đình chuẩn bị đón tiếp bạn.</p>
    <RSVP initialName={name} initialAttendance={attendance} />
  </dialog>;
}

export default function CompactRSVP() {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('yes');
  const [details, setDetails] = useState(false);
  function next(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setDetails(true); }
  return <><form className="compact-rsvp" onSubmit={next}>
    <label htmlFor="guest-name">Họ và tên</label><input id="guest-name" value={name} onChange={event => setName(event.target.value)} placeholder="Nhập tên của bạn" required minLength={2} maxLength={100} autoComplete="name" />
    <fieldset><legend>Bạn sẽ tham dự chứ?</legend>
      {[['yes', 'Có, tôi sẽ tham dự'], ['no', 'Tôi bận, rất tiếc không thể tham dự'], ['maybe', 'Tôi sẽ xác nhận sau']].map(([value, label]) => <label key={value}><input type="radio" name="attendance-preview" value={value} checked={attendance === value} onChange={() => setAttendance(value)} />{label}</label>)}
    </fieldset><button className="button primary" type="submit">Tiếp tục xác nhận</button>
  </form>{details && <Details name={name} attendance={attendance} close={() => setDetails(false)} />}</>;
}
