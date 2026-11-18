'use client';

import { motion, useReducedMotion } from 'framer-motion';

const hearts = [
  { left: '20%', scale: 0.6, delay: 1.2, duration: 4, sway: 34 },
  { left: '55%', scale: 1, delay: 1.4, duration: 5, sway: -28 },
  { left: '10%', scale: 0.8, delay: 1.6, duration: 7, sway: 50 },
];

// A separate layer lets the last hearts finish after the envelope dissolves.
export default function OpeningHearts({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return <div className="opening-hearts" aria-hidden="true"><div className="opening-heart-origin">
    {hearts.map((heart, index) => <motion.svg key={heart.left} className="opening-heart" style={{ left: heart.left }} viewBox="0 0 48 44" fill="#d00000"
      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0.8, 0], y: [0, -35, -300, -600], x: [0, heart.sway, 0, heart.sway], scale: [0, heart.scale * 1.2, heart.scale, heart.scale] }}
      transition={{ delay: heart.delay, duration: heart.duration, times: [0, 0.1, 0.5, 1], ease: [0.25, 0.46, 0.45, 0.94] }}
      onAnimationComplete={index === hearts.length - 1 ? onComplete : undefined}>
      <path d="M24 43 4 23C-9 9 10-10 24 5 38-10 57 9 44 23Z" />
    </motion.svg>)}
  </div></div>;
}
