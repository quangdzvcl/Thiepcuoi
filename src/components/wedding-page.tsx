'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpRight, CalendarDays, CarFront, Check, Copy, Gift, Heart, Images, MapPin, MessageCircleHeart, Music2, Pause, Share2, X } from 'lucide-react';
import { wedding as w } from '@/config/wedding';
import { Reveal, RevealProvider } from './reveal';
import Countdown from './countdown';
import Lightbox from './lightbox';
import RSVP from './rsvp-form';
import Envelope from './envelope';
import RibbonBow from './ribbon-bow';
import OpeningHearts from './opening-hearts';

function calendarLink(event: typeof w.events[number]) {
  const compact = (date: string) => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dates = event.time ? `${compact(event.start)}/${compact(event.end)}` : `${event.start.slice(0, 10).replaceAll('-', '')}/${event.end.slice(0, 10).replaceAll('-', '')}`;
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: 'TEMPLATE', text: `${event.title} · ${w.groom} & ${w.bride}`, dates, details: 'Trân trọng kính mời bạn đến chung vui cùng gia đình. Thời lượng trên lịch được đặt mặc định 1 giờ, không phải giờ kết thúc tiệc đã được xác nhận.', location: `${event.venue}, ${event.address}`, ctz: 'Asia/Ho_Chi_Minh' })}`;
}

function GiftDialog({ close }: { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    const el = dialog.current;
    el?.showModal(); document.body.style.overflow = 'hidden';
    return () => { el?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  async function copy(account: string, index: number) {
    try { await navigator.clipboard.writeText(account); setCopied(index); setStatus('Đã sao chép số tài khoản.'); }
    catch { setStatus(`Bạn có thể sao chép thủ công: ${account}`); }
  }
  return <dialog ref={dialog} className="gift-dialog" aria-labelledby="gift-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <button autoFocus className="dialog-close icon-button" aria-label="Đóng hộp mừng cưới" onClick={close}><X size={20} /></button>
    <RibbonBow /><h2 id="gift-title">Gửi chút yêu thương</h2><p>Sự hiện diện của bạn là món quà quý giá nhất với chúng mình.</p>
    <div className="gift-grid">{w.gifts.map((gift, i) => <div className="gift-card" key={gift.role}>
      <span className="eyebrow">{gift.role}</span><h3>{i === 0 ? w.groom : w.bride}</h3>
      {gift.qr ? <><img className="qr-image" src={gift.qr} alt={`VietQR ${gift.role}`} /><p>{gift.bank}</p><strong>{gift.name}</strong><span className="account-number">{gift.account}</span><button className="copy-button" onClick={() => void copy(gift.account, i)}>{copied === i ? <Check size={15} /> : <Copy size={15} />}{copied === i ? 'Đã sao chép' : 'Sao chép tài khoản'}</button></> : <div className="gift-pending"><Heart size={26} strokeWidth={1} /><p>Thông tin mừng cưới<br />sẽ được cập nhật.</p></div>}
    </div>)}</div><p className="copy-status" role="status">{status}</p>
  </dialog>;
}

function Journey() {
  return <div className="journey" aria-label="Hai miền quê, một ngày chung đôi">
    <svg viewBox="0 0 500 210" fill="none" aria-hidden="true"><path d="M65 170C80 105 340 185 375 106S170 55 408 20" stroke="#f0e4dc" strokeWidth="37" strokeLinecap="round" /><path d="M65 170C80 105 340 185 375 106S170 55 408 20" stroke="#c8aa8e" strokeWidth="1" strokeDasharray="5 5" /><path d="M118 61C106 44 88 60 118 77C148 60 130 44 118 61ZM313 160C304 147 290 159 313 173C336 159 322 147 313 160Z" fill="#9b252b" opacity=".6" /></svg>
    <a href={w.events[0].maps} target="_blank" rel="noreferrer" className="journey-home bride-home"><MapPin size={24} strokeWidth={1.3} /><span>Nhà gái</span><small>{w.family.bride.province}</small></a>
    <CarFront className="journey-car" size={37} strokeWidth={1.2} />
    <a href={w.events[1].maps} target="_blank" rel="noreferrer" className="journey-home groom-home"><MapPin size={24} strokeWidth={1.3} /><span>Nhà trai</span><small>{w.family.groom.province}</small></a>
  </div>;
}

export default function WeddingPage() {
  const [opened, setOpened] = useState(false);
  const [openingHearts, setOpeningHearts] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [image, setImage] = useState<number | null>(null);
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => { if (opened) document.getElementById('main-content')?.focus({ preventScroll: true }); }, [opened]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 5000); return () => clearTimeout(timer); }, [toast]);
  async function play() {
    if (!w.music) return;
    try { await audio.current?.play(); setPlaying(true); }
    catch { setPlaying(false); setToast('Chưa phát được nhạc. Bạn chạm lại nút nhạc nhé.'); }
  }
  async function share() {
    const url = `${window.location.origin}/`;
    try {
      if (navigator.share) await navigator.share({ title: `${w.groom} & ${w.bride} — Thiệp cưới`, url });
      else { await navigator.clipboard.writeText(url); setToast('Đã sao chép đường dẫn thiệp cưới.'); }
    } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setToast(`Đường dẫn thiệp: ${url}`); }
  }
  return <MotionConfig reducedMotion="user">
    <RevealProvider active={opened}><div className="wedding-shell" inert={!opened} aria-hidden={!opened}>
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <aside className="desktop-note" aria-hidden="true"><span>THE WEDDING OF</span><p>{w.groom}<em>&</em>{w.bride}</p><RibbonBow /><small>Hai miền quê.<br />Một lời hẹn trăm năm.</small></aside>
      <main className="invitation-page" id="main-content" tabIndex={-1}>
        <section className="wedding-cover" id="top" aria-labelledby="couple-title">
          <div className="cover-photo"><motion.img initial={{ scale: 1.31 }} animate={{ scale: opened ? 1.25 : 1.31 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }} src={w.hero} alt={`Ảnh cưới vest trắng của ${w.groom} và ${w.bride}`} width={2000} height={2999} fetchPriority="high" /><span className="cover-photo-label"><span className="script">Save the date</span>{w.dateLabel}</span></div>
          <div className="cover-copy"><Reveal effect="zoom" delay={0.1}><RibbonBow /></Reveal><Reveal effect="fade" delay={0.25}><p className="cover-overline">OUR WEDDING</p></Reveal><Reveal effect="rise" delay={0.4}><h1 id="couple-title"><span>{w.groom}</span><i>–</i><span>{w.bride}</span></h1></Reveal><Reveal effect="fade" delay={0.65}><p className="script invitation-line">Trân trọng kính mời</p></Reveal><p className="cover-message">Bạn đến chung vui trong ngày hạnh phúc<br />của chúng mình và gia đình.</p><div className="cover-dates">{w.events.map((event, i) => <a key={event.title} href={`#event-${i}`}><span>{event.subtitle}</span><strong>{event.start.slice(0, 10).split('-').reverse().join(' . ')}</strong>{event.time && <time dateTime={event.start}>Bắt đầu {event.time}</time>}<small>{event.lunarDay.replace('Nhằm ngày ', '')}</small></a>)}</div><a className="scroll-hint" href="#families">CÙNG MỞ CHƯƠNG MỚI <ArrowDown size={15} /></a></div>
        </section>
        <section className="family-section section-pad" id="families">

          <div className="family-grid">{[{ label: 'NHÀ TRAI', name: w.groom, data: w.family.groom, english: 'GROOM' }, { label: 'NHÀ GÁI', name: w.bride, data: w.family.bride, english: 'BRIDE' }].map((family, i) => <Reveal key={family.label} effect={i === 0 ? 'left' : 'right'} delay={i * 0.18} className="family-column"><h3>{family.label}</h3><p>Ba: <strong>{family.data.father}</strong></p><p>Mẹ: <strong>{family.data.mother}</strong></p><p className="family-address">{family.data.address}</p><div className="individual-photo"><img src={family.data.portrait} alt={`${family.english === 'GROOM' ? 'Chú rể' : 'Cô dâu'} ${family.name}`} loading="lazy" width={1400} height={2100} /></div><span className="portrait-label">{family.english}</span><h4 className="script">{family.name}</h4></Reveal>)}</div>

        </section>
        <section className="love-portrait section-pad" id="story"><Reveal effect="zoom"><span className="love-word">L . O . V . E</span><div className="love-photo-frame"><img src={w.portrait} alt={`${w.groom} và ${w.bride} ôm nhau trong ánh sáng ấm áp`} width={1400} height={2100} loading="lazy" /></div><p className="script love-caption">Bên nhau, là nhà.</p></Reveal></section>
        <section className="ceremonies section-pad" id="events" aria-label="Thông tin hai tiệc cưới">
          {w.events.map((event, i) => <Reveal className="ceremony-card" effect="fade" key={event.title}><article id={`event-${i}`}><span className="ceremony-side">{event.subtitle}</span><h3 className="soft-pulse">{event.title}</h3><p className="ceremony-invitation">Trân trọng kính mời bạn tham dự bữa cơm thân mật<br />chung vui cùng gia đình vào ngày</p><div className="ceremony-date"><span className="date-wing">THÁNG {event.start.slice(5, 7)}</span><div><span className="weekday">{event.day.split(',')[0].toLocaleUpperCase('vi')}</span><strong className="soft-pulse">{event.start.slice(8, 10)}</strong>{event.time && <time dateTime={event.start}>{event.time}</time>}</div><span className="date-wing">NĂM {event.start.slice(0, 4)}</span></div><p className="lunar-date">({event.lunarDay})</p>{!event.time && <p className="time-pending">Giờ đón khách sẽ được gia đình cập nhật.</p>}<h4>{event.venue}</h4><p className="ceremony-address">{event.address}</p><div className="event-actions"><a className="button primary" href={event.maps} target="_blank" rel="noreferrer"><MapPin size={15} />Chỉ đường<ArrowUpRight size={14} /></a><a className="calendar-link" href={calendarLink(event)} target="_blank" rel="noreferrer"><CalendarDays size={15} />Lưu ngày cưới</a></div></article></Reveal>)}
        </section>
        <section className="journey-section section-pad"><Reveal><p className="script journey-heading">Từ hai miền thương, về một nhà</p><Journey /><div className="countdown-heading"><CarFront size={33} strokeWidth={1.2} /><span>ĐẾM NGƯỢC ĐẾN NGÀY VUI</span></div><Countdown /></Reveal></section>
        <section className="love-letter section-pad"><Reveal><RibbonBow /><h2 className="script">Có bạn, ngày vui thêm trọn vẹn.</h2><p>{w.invitation}</p><div className="letter-signature">WITH ALL OUR LOVE<span className="script">{w.groom} & {w.bride}</span></div></Reveal></section>
        <section className="album-section section-pad" id="gallery"><Reveal><span className="eyebrow">NHỮNG KHOẢNH KHẮC CỦA CHÚNG MÌNH</span><h2 className="section-title soft-pulse">Album ảnh</h2><p className="script album-subtitle">A little collection of our forever</p></Reveal><div className="photo-grid">{w.gallery.map((photo, i) => <Reveal key={photo.src} effect="zoom" delay={i % 2 * 0.12} className={`gallery-item${photo.wide ? ' gallery-item-landscape' : ''}`}><button onClick={() => setImage(i)} aria-label={`Phóng to: ${photo.alt}`}><img src={photo.src} alt={photo.alt} width={photo.wide ? 1600 : 1400} height={photo.wide ? 1067 : 2100} loading="lazy" /><span>{String(i + 1).padStart(2, '0')}<Images size={17} /></span></button></Reveal>)}</div><p className="album-hint">Chạm vào ảnh để lưu giữ khoảnh khắc gần hơn.</p></section>
        <section className="rsvp-section section-pad" id="rsvp"><Reveal><RibbonBow /><span className="eyebrow">HẸN GẶP BẠN TẠI NGÀY CƯỚI</span><h2 className="section-title">Bạn sẽ đến chứ?</h2><p className="section-description">Gửi một lời nhắn nhỏ để chúng mình<br />chuẩn bị đón tiếp bạn thật chu đáo nhé.</p></Reveal><Reveal className="rsvp-card"><RSVP /></Reveal></section>
        <section className="gift-invitation section-pad" id="gifts"><Reveal><Gift size={30} strokeWidth={1} /><h2 className="script">Gửi yêu thương</h2><p>Có bạn bên cạnh là đủ đầy hạnh phúc.<br />Chúng mình trân trọng mọi lời chúc và tấm lòng.</p><button className="button outline" onClick={() => setGiftsOpen(true)}>Hộp mừng cưới<Heart size={16} /></button></Reveal></section>
        <footer className="wedding-footer"><img src={w.footer} alt={`${w.groom} và ${w.bride} cùng nâng khăn voan trắng`} width={1400} height={2100} loading="lazy" /><div className="footer-copy"><h2>THANKS</h2><p className="script">{w.groom} & {w.bride}</p><a href="#top" aria-label="Về đầu thiệp"><ArrowUp size={17} /></a></div></footer>
      </main>
      <div className="card-scroll-controls"><button aria-label="Cuộn thiệp lên" onClick={() => document.getElementById('main-content')?.scrollBy({ top: -500, behavior: 'smooth' })}><ArrowUp size={20} /></button><button aria-label="Cuộn thiệp xuống" onClick={() => document.getElementById('main-content')?.scrollBy({ top: 500, behavior: 'smooth' })}><ArrowDown size={20} /></button></div><nav className="quick-actions" aria-label="Tiện ích thiệp cưới"><a href="#rsvp"><MessageCircleHeart size={20} /><span>Lời chúc</span></a><a href="#gallery"><Images size={20} /><span>Album</span></a><button onClick={() => setGiftsOpen(true)}><Gift size={20} /><span>Mừng cưới</span></button><button onClick={() => void share()}><Share2 size={20} /><span>Chia sẻ</span></button></nav>
      <button className={`music-button${playing ? ' playing' : ''}`} aria-label={!w.music ? 'Chưa có nhạc nền' : playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'} aria-pressed={playing} disabled={!w.music} onClick={() => { if (playing) { audio.current?.pause(); setPlaying(false); } else void play(); }}>{playing ? <Pause size={18} /> : <Music2 size={18} />}</button>
      {toast && <p className="toast-message" role="status">{toast}</p>}
    </div></RevealProvider>
    {w.music && <audio ref={audio} src={w.music} loop preload="none" onError={() => { setPlaying(false); setToast('Không tải được nhạc nền.'); }} />}
    <AnimatePresence>{!opened && <Envelope onOpen={() => setOpened(true)} onStart={() => { setOpeningHearts(true); void play(); }} />}</AnimatePresence>
    {openingHearts && <OpeningHearts onComplete={() => setOpeningHearts(false)} />}
    {image !== null && <Lightbox index={image} close={() => setImage(null)} change={setImage} />}
    {giftsOpen && <GiftDialog close={() => setGiftsOpen(false)} />}
  </MotionConfig>;
}
