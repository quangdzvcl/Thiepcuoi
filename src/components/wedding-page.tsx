'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpRight, CalendarDays, Check, Copy, Gift, Heart, Images, MapPin, MessageCircleHeart, Share2, X } from 'lucide-react';
import { wedding as w } from '@/config/wedding';
import { Reveal, RevealProvider } from './reveal';
import Countdown from './countdown';
import Lightbox from './lightbox';
import CompactRSVP from './compact-rsvp';
import Envelope from './envelope';
import RibbonBow from './ribbon-bow';
import OpeningHearts from './opening-hearts';
import DesktopPanel from './desktop-panel';
import { useAutoScroll } from './use-auto-scroll';

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
  return <div className="journey" aria-label="Chỉ đường tới nhà gái tại Đắk Lắk và nhà trai tại Nghệ An">
    <img className="journey-road" src="/images/decorations/wedding-road.png" alt="Đường về chung một nhà" width={640} height={426} loading="lazy" />
    <a href={w.events[0].maps} target="_blank" rel="noreferrer" className="journey-home bride-home" aria-label={`Chỉ đường nhà gái: ${w.events[0].address}`}>CHỈ ĐƯỜNG</a>
    <a href={w.events[1].maps} target="_blank" rel="noreferrer" className="journey-home groom-home" aria-label={`Chỉ đường nhà trai: ${w.events[1].address}`}>CHỈ ĐƯỜNG</a>
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
  const main = useRef<HTMLElement>(null);
  const reading = useAutoScroll(main, opened);
  useEffect(() => { if (opened) document.getElementById('main-content')?.focus({ preventScroll: true }); }, [opened]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 5000); return () => clearTimeout(timer); }, [toast]);
  async function play() {
    if (!w.music) return;
    try { if (!audio.current) return; audio.current.volume = 0.4; await audio.current.play(); }
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
    <RevealProvider active={opened}><div className={`wedding-shell${reading.active ? ' auto-reading' : ''}`} inert={!opened} aria-hidden={!opened}>
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <DesktopPanel onInteract={reading.pause} />
      <main ref={main} className="invitation-page" id="main-content" tabIndex={-1} onWheelCapture={reading.pause} onTouchStartCapture={reading.pause} onKeyDown={event => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) reading.pause(); }} onFocusCapture={event => { if ((event.target as HTMLElement).closest('button,a,input,select,textarea,label')) reading.pause(); }} onClickCapture={event => { if ((event.target as HTMLElement).closest('button,a,input,select,textarea,label')) reading.pause(); }}>

        <section className="wedding-cover" id="top" aria-labelledby="couple-title">
          <div className="cover-photo"><motion.img initial={{ scale: 1.31 }} animate={{ scale: opened ? 1.25 : 1.31 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }} src={w.hero} alt={`Ảnh cưới vest trắng của ${w.groom} và ${w.bride}`} width={2000} height={2999} fetchPriority="high" /><span className="cover-photo-label"><span className="script">Save the date</span>{w.dateLabel}</span></div>
          <div className="cover-copy"><Reveal effect="zoom" delay={0.1}><RibbonBow /></Reveal><Reveal effect="fade" delay={0.25}><img className="cover-overline" src="/images/decorations/wedding-title.png" alt="WEDDING" width={312} height={88} /></Reveal><Reveal effect="rise" delay={0.4}><h1 id="couple-title"><span>{w.groom}</span><i>–</i><span>{w.bride}</span></h1></Reveal><Reveal effect="fade" delay={0.65}><p className="script invitation-line">Trân trọng kính mời</p></Reveal><p className="cover-message">Tham dự bữa cơm thân mật<br />chung vui cùng gia đình vào lúc</p><div className="cover-dates">{w.events.map((event, i) => <a key={event.title} href={`#event-${i}`}><span>{event.subtitle} · {event.time}</span><strong>{event.start.slice(0, 10).split('-').reverse().join('.')}</strong><small>{event.lunarDay.replace('Nhằm ngày ', '')}</small></a>)}</div></div>
        </section>
        <section className="family-section section-pad" id="families">

          <div className="family-grid">{[{ label: 'NHÀ TRAI', name: w.groom, data: w.family.groom, english: 'GROOM' }, { label: 'NHÀ GÁI', name: w.bride, data: w.family.bride, english: 'BRIDE' }].map((family, i) => <div key={family.label} className="family-column"><Reveal className="family-parents" effect="fade" delay={i * .1}><h3>{family.label}</h3><p>Ba: <strong>{family.data.father}</strong></p><p>Mẹ: <strong>{family.data.mother}</strong></p></Reveal><Reveal effect={i === 0 ? 'left' : 'right'}><div className="individual-photo"><img src={family.data.portrait} alt={`${i === 0 ? 'Chú rể' : 'Cô dâu'} ${family.name}`} loading="lazy" width={1400} height={2100} /></div></Reveal><Reveal effect="rise" delay={.1}><img className={`portrait-label ${family.english.toLowerCase()}-label`} src={`/images/decorations/${family.english.toLowerCase()}-title.png`} alt={family.english} width={220} height={52} /><h4 className="script">{family.name}</h4></Reveal></div>)}</div>

        </section>
        <section className="love-portrait section-pad" id="story"><Reveal effect="zoom"><span className="love-word">L.O.V.E</span><div className="love-photo-frame"><img src={w.portrait} alt={`${w.groom} và ${w.bride} ôm nhau trong ánh sáng ấm áp`} width={1400} height={2100} loading="lazy" /></div><img className="love-caption" src="/images/decorations/married-title.png" alt="We get married" width={300} height={56} loading="lazy" /></Reveal></section>
        <section className="ceremonies section-pad" id="events" aria-label="Thông tin hai tiệc cưới">
          {w.events.map((event, i) => <div className="ceremony-card" key={event.title}><article id={`event-${i}`}><Reveal effect="rise"><h3 className="soft-pulse">{event.title}</h3></Reveal><div className="ceremony-date"><Reveal effect="left" className="date-wing">THÁNG {event.start.slice(5, 7)}</Reveal><div><Reveal effect="rise"><span className="weekday">{event.day.split(',')[0].toLocaleUpperCase('vi')}</span></Reveal><Reveal effect="zoom"><strong className="soft-pulse">{event.start.slice(8, 10)}</strong></Reveal>{event.time && <Reveal effect="rise"><time dateTime={event.start}>{event.time}</time></Reveal>}</div><Reveal effect="right" className="date-wing">NĂM {event.start.slice(0, 4)}</Reveal></div><Reveal effect="fade" duration={1.3}><p className="lunar-date">({event.lunarDay})</p></Reveal><Reveal effect="fade"><h4>{event.venue}</h4><p className="ceremony-address">{event.address}</p><div className="event-actions"><a className="button primary" href={event.maps} target="_blank" rel="noreferrer"><MapPin size={15} />Chỉ đường<ArrowUpRight size={14} /></a><a className="calendar-link" href={calendarLink(event)} target="_blank" rel="noreferrer"><CalendarDays size={15} />Lưu ngày cưới</a></div></Reveal></article></div>)}
        </section>
        <section className="event-portrait-section"><Reveal effect="zoom"><div className="event-portrait"><img className="welcome-arch" src="/images/decorations/welcome-arch.png" alt="Welcome to our wedding" width={546} height={138} /><img className="event-portrait-photo" src={w.eventPortrait} alt={`${w.groom} và ${w.bride} trong ngày chụp ảnh cưới`} width={1400} height={2100} loading="lazy" /></div><p className="wedding-poem">{w.poem[0]}<br />{w.poem[1]}</p></Reveal></section>
        <section className="journey-section"><Reveal effect="fade"><img className="address-title" src="/images/decorations/address-title.png" alt="ADDRESS" width={260} height={66} loading="lazy" /><Journey /><div className="countdown-row"><img src="/images/decorations/wedding-car.png" alt="" width={180} height={108} loading="lazy" /><Countdown /></div></Reveal></section>
        <section className="rsvp-section" id="rsvp" aria-label="Xác nhận tham dự và lời chúc"><div className="rsvp-illustrations"><button onClick={() => setGiftsOpen(true)} aria-label="Mở hộp mừng cưới"><img src="/images/decorations/wedding-gift.png" alt="" width={114} height={114} loading="lazy" /></button><img className="rsvp-couple" src="/images/decorations/wedding-couple.png" alt="" width={244} height={286} loading="lazy" /></div><Reveal className="rsvp-card" effect="fade"><h2>Xác nhận tham dự</h2><CompactRSVP /></Reveal></section>
        <section className="album-section section-pad" id="gallery"><Reveal><h2 className="section-title soft-pulse">Album ảnh</h2></Reveal><div className="photo-grid">{w.gallery.map((photo, i) => <Reveal key={photo.src} effect="zoom" delay={i % 2 * 0.12} className={`gallery-item${photo.wide ? ' gallery-item-landscape' : photo.full ? ' gallery-item-feature' : ''}`}><button onClick={() => setImage(i)} aria-label={`Phóng to: ${photo.alt}`}><img src={photo.src} alt={photo.alt} width={photo.wide ? 1600 : 1400} height={photo.wide ? 1067 : 2100} loading="lazy" /></button></Reveal>)}</div></section>


        <footer className="wedding-footer"><img className="footer-photo" src={w.footer} alt={`${w.groom} và ${w.bride} cùng nâng khăn voan trắng`} width={1400} height={2100} loading="lazy" /><img className="footer-thanks" src="/images/decorations/thanks-title.png" alt="THANKS" width={312} height={87} loading="lazy" /></footer>
        <p className="music-credit">Nhạc: <a href={w.musicCredit.url} target="_blank" rel="noreferrer">{w.musicCredit.title} — {w.musicCredit.artist}</a> · <a href={w.musicCredit.licenseUrl} target="_blank" rel="noreferrer">CC BY 4.0</a></p>
      </main>
      <div className="card-scroll-controls"><button aria-label="Cuộn thiệp lên" onClick={() => { reading.pause(); main.current?.scrollBy({ top: -500, behavior: 'smooth' }); }}><ArrowUp size={20} /></button><button aria-label="Cuộn thiệp xuống" onClick={() => { reading.pause(); main.current?.scrollBy({ top: 500, behavior: 'smooth' }); }}><ArrowDown size={20} /></button></div><nav className="quick-actions" onClickCapture={reading.pause} aria-label="Tiện ích thiệp cưới"><a href="#rsvp"><MessageCircleHeart size={20} /><span>Gửi lời chúc…</span></a><a href="#gallery"><Images size={20} /><span>Album</span></a><button onClick={() => setGiftsOpen(true)}><Gift size={20} /><span>Mừng cưới</span></button><button onClick={() => void share()}><Share2 size={20} /><span>Chia sẻ</span></button></nav>
      {opened && !reading.reduced && <button className={`auto-scroll-button${reading.active ? ' is-running' : ''}`} aria-label={reading.active ? 'Tạm dừng tự cuộn' : 'Tiếp tục tự cuộn'} onClick={reading.active ? reading.pause : reading.resume}><img src="/images/decorations/auto-scroll-play.png" alt="" width={40} height={40} /></button>}
      <button className={`music-button${playing ? ' playing' : ''}`} aria-label={!w.music ? 'Chưa có nhạc nền' : playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'} aria-pressed={playing} disabled={!w.music} onClick={() => { if (playing) { audio.current?.pause(); setPlaying(false); } else void play(); }}><img src="/images/decorations/music-icon.png" alt="" width={24} height={24} />{!playing && <span className="music-muted-line" aria-hidden="true" />}</button>
      {toast && <p className="toast-message" role="status">{toast}</p>}
    </div></RevealProvider>
    {w.music && <audio ref={audio} src={w.music} loop preload="metadata" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setToast('Không tải được nhạc nền.'); }} />}
    <AnimatePresence>{!opened && <Envelope onOpen={() => setOpened(true)} onStart={() => { setOpeningHearts(true); void play(); }} />}</AnimatePresence>
    {openingHearts && <OpeningHearts onComplete={() => setOpeningHearts(false)} />}
    {image !== null && <Lightbox index={image} close={() => setImage(null)} change={setImage} />}
    {giftsOpen && <GiftDialog close={() => setGiftsOpen(false)} />}
  </MotionConfig>;
}
