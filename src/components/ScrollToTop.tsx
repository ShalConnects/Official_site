import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_KEY = 'shal-scroll';

function saveScroll(pathname: string, y: number) {
  try {
    const data = sessionStorage.getItem(SCROLL_KEY);
    const map = data ? (JSON.parse(data) as Record<string, number>) : {};
    map[pathname] = y;
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function getScroll(pathname: string): number | null {
  try {
    const data = sessionStorage.getItem(SCROLL_KEY);
    if (!data) return null;
    const map = JSON.parse(data) as Record<string, number>;
    const y = map[pathname];
    return typeof y === 'number' ? y : null;
  } catch {
    return null;
  }
}

/**
 * ScrollToTop: scrolls to top on new navigation; saves/restores scroll on back/forward.
 * Restores when we have a saved position for this pathname (revisit or back).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstPathRef = useRef(true);

  useEffect(() => {
    const saved = getScroll(pathname);

    if (saved != null && !isFirstPathRef.current) {
      const id = requestAnimationFrame(() => {
        window.scrollTo(0, saved);
      });
      return () => cancelAnimationFrame(id);
    }

    isFirstPathRef.current = false;
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let tick: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (tick) clearTimeout(tick);
      tick = setTimeout(() => saveScroll(pathname, window.scrollY), 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (tick) clearTimeout(tick);
    };
  }, [pathname]);

  return null;
}

