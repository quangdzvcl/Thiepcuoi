'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { wedding } from '@/config/wedding';

export default function Envelope({ onOpen, onStart }: { onOpen: () => void; onStart: () => void }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; if (timer.current) clearTimeout(timer.current); };
  }, []);
  function open() {
    if (opening) return;
    onStart();
    if (reduced) { onOpen(); return; }
    setOpening(true);
    timer.current = setTimeout(onOpen, 1900);
  }
  return <motion.div className={`envelope-screen${opening ? ' is-opening' : ''}`} role="dialog" aria-modal="true" aria-label={`Thiệp mời ${wedding.groom} và ${wedding.bride}`} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.45 }}>
    <p className="envelope-prompt">- Chạm vào thiệp để mở -</p>
    <button className="envelope-button" onClick={open} disabled={opening} aria-label={`Mở thiệp cưới ${wedding.groom} và ${wedding.bride}`}>
      <span className="envelope-back" /><span className="envelope-letter"><img src={wedding.hero} alt="" /><span>{wedding.groom}<br />& {wedding.bride}</span></span><span className="envelope-front" /><span className="envelope-flap" /><span className="wax-seal">Q<span>&</span>H</span>
    </button>
    <span className="envelope-shadow" aria-hidden="true" />
  </motion.div>;
}
