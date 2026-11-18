'use client';

import { useEffect, useState } from 'react';
import { MessageCircleHeart, Send } from 'lucide-react';
import { wedding } from '@/config/wedding';

export default function DesktopPanel() {
  const [tab, setTab] = useState<'wishes' | 'qr'>('wishes');
  const [qr, setQr] = useState('');
  useEffect(() => {
    if (tab !== 'qr') return;
    let active = true;
    import('qrcode').then(module => module.default.toDataURL(`${window.location.origin}/`, { width: 240, margin: 2, errorCorrectionLevel: 'M' })).then(value => { if (active) setQr(value); }).catch(() => { if (active) setQr(''); });
    return () => { active = false; };
  }, [tab]);
  return <aside className="desktop-panel" aria-label="Lời chúc và xem thiệp trên điện thoại">
    <div className="desktop-panel-tabs" role="tablist" aria-label="Thông tin thiệp">
      <button role="tab" id="wishes-tab" aria-controls="wishes-panel" aria-selected={tab === 'wishes'} onClick={() => setTab('wishes')}>Lời chúc</button>
      <button role="tab" id="qr-tab" aria-controls="qr-panel" aria-selected={tab === 'qr'} onClick={() => setTab('qr')}>Xem trên điện thoại</button>
    </div>
    {tab === 'wishes' ? <div id="wishes-panel" role="tabpanel" aria-labelledby="wishes-tab" className="desktop-wishes-panel"><MessageCircleHeart size={34} strokeWidth={1} /><p>Gửi lời yêu thương đến</p><h2 className="script">{wedding.groom} & {wedding.bride}</h2><p>Một lời chúc nhỏ làm ngày vui thêm trọn vẹn.</p><a className="desktop-wish-button" href="#rsvp">Gửi lời chúc…<Send size={18} /></a></div> : <div id="qr-panel" role="tabpanel" aria-labelledby="qr-tab" className="desktop-qr-panel">{qr ? <img src={qr} alt={`Mã QR mở thiệp cưới ${wedding.groom} và ${wedding.bride}`} width={240} height={240} /> : <p>Đang chuẩn bị mã QR…</p>}<p>Quét mã để xem thiệp trên điện thoại.</p></div>}
  </aside>;
}
