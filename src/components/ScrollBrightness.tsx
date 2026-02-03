import React, { useRef, useEffect, type ReactNode } from 'react';

interface ScrollBrightnessProps {
  children: ReactNode;
  className?: string;
  /** Opacity when element is in the "sweet spot" (viewport center). Default 1 */
  maxOpacity?: number;
  /** Opacity when element is far from center. Default 0.5 */
  minOpacity?: number;
  /** Viewport height fraction: distance from center at which fade to minOpacity is complete (0–1). Larger = stay bright longer, dim later. Default 0.65 */
  peakZone?: number;
  /** CSS transition duration for opacity. Default '1s' */
  transitionDuration?: string;
}

export default function ScrollBrightness({
  children,
  className = '',
  maxOpacity = 1,
  minOpacity = 0.5,
  peakZone = 0.65,
  transitionDuration = '1s',
}: ScrollBrightnessProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      el.style.opacity = String(maxOpacity);
      return;
    }

    const update = () => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = Math.abs(centerY - viewportCenter);
      const halfPeak = (window.innerHeight * peakZone) / 2;
      let t = Math.min(1, distance / halfPeak);
      t = t * t; // gentler falloff: stay bright longer, dim later
      const opacity = maxOpacity - (maxOpacity - minOpacity) * t;
      el.style.opacity = String(Math.max(minOpacity, opacity));
    };

    const onScroll = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    const onResize = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [maxOpacity, minOpacity, peakZone]);

  return (
    <div ref={elRef} className={className} style={{ transition: `opacity ${transitionDuration} ease-out` }}>
      {children}
    </div>
  );
}
