'use client';
import { useState, type CSSProperties } from 'react';
import { MessageCircleHeart, X } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useWishes } from './wishes-provider';
export default function FloatingWishes({ suspended = false }: { suspended?: boolean }) {
  const { wishes } = useWishes(); const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion(); const recent = wishes.slice(0, 10);
  if (!recent.length || suspended) return null;
  const style = { '--wish-duration': `${Math.max(6, recent.length * 2)}s` } as CSSProperties;
  return <div className={`floating-wishes${hidden ? ' is-collapsed' : ''}${reduced ? ' is-reduced' : ''}`} style={style}>
    <button className="floating-wishes-toggle" aria-label={hidden ? 'Hiện lời chúc chạy' : 'Ẩn lời chúc chạy'} aria-expanded={!hidden} onClick={() => setHidden(current => !current)}>{hidden ? <MessageCircleHeart size={16} /> : <X size={14} />}</button>
    {!hidden && <div className="floating-wishes-window" aria-hidden="true"><div className="floating-wishes-track">
      {[0, 1].map(copy => <div key={copy} className="floating-wishes-group">{recent.map(wish => <div className="floating-wish" key={wish.id}><span><b>{wish.name}:</b> {wish.wishes}</span></div>)}</div>)}
    </div></div>}
  </div>;
}
