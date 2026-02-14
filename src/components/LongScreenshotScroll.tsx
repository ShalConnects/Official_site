import React, { useEffect, useRef, useState } from 'react';

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Hook to detect active scrolling (debounced) - page or specific container */
export function usePageScrolling(containerRef?: React.RefObject<HTMLElement>, debounceMs = 150): boolean {
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const target = containerRef?.current || window;
    
    const handleScroll = () => {
      setIsScrolling(true);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsScrolling(false), debounceMs);
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [containerRef, debounceMs]);

  return isScrolling;
}

function useAutoScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  paused: boolean,
  durationSec = 45
) {
  const [reduceMotion, setReduceMotion] = useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const active = enabled && !reduceMotion && !paused;
  const rafRef = useRef<number | null>(null);
  
  // Live reduced-motion detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    
    // Dynamic duration: ~30px/sec for smooth scrolling (min 20s, max 60s)
    const calculatedDuration = Math.max(20, Math.min(60, maxScroll / 30));
    const durationMs = (durationSec > 0 ? durationSec : calculatedDuration) * 1000;
    const pauseDurationMs = 2000; // 2s pause at top/bottom
    let startTime: number | null = null;
    let startScroll = 0;
    let direction: 'down' | 'up' | 'pause' = 'down';
    let pauseStartTime: number | null = null;
    
    const animate = (t: number) => {
      if (direction === 'pause') {
        if (pauseStartTime === null) pauseStartTime = t;
        if (t - pauseStartTime >= pauseDurationMs) {
          direction = startScroll === 0 ? 'down' : 'up';
          startTime = null;
          pauseStartTime = null;
        }
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (startTime === null) startTime = t;
      const linear = Math.min((t - startTime) / durationMs, 1);
      const progress = easeInOutCubic(linear);
      
      if (direction === 'down') {
        el.scrollTop = startScroll + progress * (maxScroll - startScroll);
        if (linear >= 1) {
          startScroll = maxScroll;
          direction = 'pause';
          pauseStartTime = null;
        }
      } else {
        el.scrollTop = startScroll - progress * startScroll;
        if (linear >= 1) {
          startScroll = 0;
          direction = 'pause';
          pauseStartTime = null;
        }
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, durationSec, ref]);
}

function useSmoothScroll(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  const targetScrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const touchStartRef = useRef({ y: 0, scrollTop: 0, time: 0 });
  const velocityRef = useRef(0);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  useEffect(() => {
    if (!enabled || reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    
    const SMOOTH_DURATION = 400;
    const SMOOTH_EASE = (t: number) => 1 - Math.pow(1 - t, 3);
    
    const animateToTarget = () => {
      const current = el.scrollTop;
      const target = targetScrollRef.current;
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = target;
        rafRef.current = null;
        return;
      }
      const start = performance.now();
      const startScroll = current;
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / SMOOTH_DURATION, 1);
        el.scrollTop = startScroll + diff * SMOOTH_EASE(progress);
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    
    // Wheel: smooth scroll with conditional preventDefault
    const onWheel = (e: WheelEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;
      
      // Only prevent default if we can actually scroll
      const wouldScroll = (e.deltaY < 0 && el.scrollTop > 0) || (e.deltaY > 0 && el.scrollTop < maxScroll);
      if (wouldScroll) e.preventDefault();
      
      if (rafRef.current === null) targetScrollRef.current = el.scrollTop;
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      const step = Math.sign(delta) * Math.min(Math.abs(delta) * 1.2, 120);
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + step));
      if (rafRef.current === null) animateToTarget();
    };
    
    // Touch: momentum scrolling
    const onTouchStart = (e: TouchEvent) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      touchStartRef.current = { y: e.touches[0].clientY, scrollTop: el.scrollTop, time: Date.now() };
      velocityRef.current = 0;
    };
    
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartRef.current.y - e.touches[0].clientY;
      const deltaTime = Date.now() - touchStartRef.current.time;
      velocityRef.current = deltaTime > 0 ? deltaY / deltaTime : 0;
      el.scrollTop = touchStartRef.current.scrollTop + deltaY;
    };
    
    const onTouchEnd = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const momentum = velocityRef.current * 200; // Scale factor
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, el.scrollTop + momentum));
      if (Math.abs(momentum) > 10) animateToTarget();
    };
    
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    targetScrollRef.current = el.scrollTop;
    
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, reduceMotion, ref]);
}

export interface LongScreenshotScrollProps {
  src: string;
  alt: string;
  heightClass: string;
  durationSec?: number;
  className?: string;
  children?: React.ReactNode;
  isPageScrolling?: boolean;
}

/** Fixed-height container with vertical inside-scroll, auto-scroll, smooth wheel; pause on hover. */
export default function LongScreenshotScroll({
  src,
  alt,
  heightClass,
  durationSec = 45,
  className = '',
  children,
  isPageScrolling = false
}: LongScreenshotScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useAutoScroll(scrollRef, true, paused || isPageScrolling, durationSec);
  useSmoothScroll(scrollRef, true);
  
  // Track scroll position for indicator
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const updateProgress = () => {
      const progress = el.scrollHeight > el.clientHeight 
        ? el.scrollTop / (el.scrollHeight - el.clientHeight) 
        : 0;
      setScrollProgress(progress);
    };
    el.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => el.removeEventListener('scroll', updateProgress);
  }, []);
  
  const showIndicators = scrollRef.current && scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
  
  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={`work-card-scroll relative flex items-start justify-center w-full bg-gray-900 ${heightClass} overflow-y-auto overflow-x-hidden overscroll-contain ${className}`}
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img src={src} alt={alt} className="w-full min-w-0" loading="lazy" />
        {children}
        
        {/* Scroll indicators */}
        {showIndicators && scrollProgress < 0.98 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900/95 backdrop-blur-md border border-white/20 text-white shadow-xl shadow-black/50 flex items-center gap-2">
              <svg className="w-3 h-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Scroll
            </div>
          </div>
        )}
      </div>
      
      {/* Progress indicator */}
      {showIndicators && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-20 bg-gray-900/80 backdrop-blur-sm rounded-full overflow-hidden shadow-lg shadow-black/30 border border-white/10">
          <div 
            className="w-full bg-green-500 rounded-full transition-all duration-300 shadow-sm shadow-green-500/50"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
