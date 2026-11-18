'use client';

import { useEffect, useState, type RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useAutoScroll(container: RefObject<HTMLElement | null>, opened: boolean) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);
  useEffect(() => { if (reduced) setActive(false); }, [reduced]);
  useEffect(() => {
    const element = container.current;
    if (!opened || !active || reduced || !element) return;
    let frameId = 0;
    let lastTime = 0;
    let position = element.scrollTop;
    const tick = (time: number) => {
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      if (!document.hidden) {
        const end = Math.max(0, element.scrollHeight - element.clientHeight);
        position = Math.min(end, position + elapsed * 60);
        element.scrollTop = position;
        if (position >= end) { setActive(false); return; }
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [container, opened, active, reduced]);
  const resume = () => {
    const element = container.current;
    if (element && element.scrollTop >= element.scrollHeight - element.clientHeight - 1) {
      element.scrollTo({ top: 0, behavior: 'instant' });
    }
    setActive(true);
  };
  return { active: active && !reduced, reduced, pause: () => setActive(false), resume };
}
