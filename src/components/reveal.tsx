'use client';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const RevealContext = createContext(true);
export function RevealProvider({ active, children }: { active: boolean; children: ReactNode }) {
  return <RevealContext.Provider value={active}>{children}</RevealContext.Provider>;
}

export function Reveal({ children, className = '', effect = 'rise', delay = 0, duration = 1.6 }: { children: ReactNode; className?: string; effect?: 'rise' | 'left' | 'right' | 'zoom' | 'fade'; delay?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const active = useContext(RevealContext);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.12 });
  const hidden = { opacity: 0, x: effect === 'left' ? -32 : effect === 'right' ? 32 : 0, y: effect === 'rise' ? 30 : 0, scale: effect === 'zoom' ? 0.94 : 1 };
  return <motion.div ref={ref} initial={reduced ? false : hidden} animate={reduced || (active && visible) ? { opacity: 1, x: 0, y: 0, scale: 1 } : hidden} transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: [0, 0, 0.58, 1] }} className={className}>{children}</motion.div>;
}
export function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) { return <Reveal className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</Reveal>; }
