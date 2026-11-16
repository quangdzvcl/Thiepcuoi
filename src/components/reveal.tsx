'use client';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7 }} className={className}>{children}</motion.div>;
}
export function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) { return <Reveal className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</Reveal>; }
