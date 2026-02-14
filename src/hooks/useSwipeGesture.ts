import { useRef, useEffect, RefObject } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

/**
 * Custom hook for swipe gesture detection
 * DRY: Reusable touch gesture logic for any component
 */
export function useSwipeGesture(
  ref: RefObject<HTMLElement>,
  { onSwipeLeft, onSwipeRight, threshold = 50 }: SwipeConfig
) {
  const touchStart = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);
      const deltaTime = Date.now() - touchStart.current.time;

      // Validate swipe: horizontal movement > threshold, time < 300ms, vertical movement < 50px
      if (Math.abs(deltaX) > threshold && deltaTime < 300 && deltaY < 50) {
        if (deltaX > 0 && onSwipeRight) onSwipeRight();
        else if (deltaX < 0 && onSwipeLeft) onSwipeLeft();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
