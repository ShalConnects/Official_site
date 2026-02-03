import React, { useRef, useEffect } from 'react';

const DEFAULT_BRIGHT = 'rgb(255, 255, 255)';
const DEFAULT_DIM = 'rgb(80, 80, 80)';

interface ScrollColorTextProps {
  children: string;
  className?: string;
  /** HTML element for the wrapper (e.g. "h2") */
  as?: keyof JSX.IntrinsicElements;
  brightColor?: string;
  dimColor?: string;
  /** Viewport fraction from top; words above this line use dim color (0–1). Default 0.35 */
  threshold?: number;
}

export default function ScrollColorText({
  children,
  className = '',
  as: Tag = 'span',
  brightColor = DEFAULT_BRIGHT,
  dimColor = DEFAULT_DIM,
  threshold = 0.35,
}: ScrollColorTextProps) {
  const text = typeof children === 'string' ? children.trim() : String(children).trim();
  const words = text ? text.split(/\s+/) : [];
  const containerRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || words.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      container.querySelectorAll<HTMLSpanElement>('[data-scroll-color-word]').forEach((span) => {
        span.style.color = brightColor;
      });
      return;
    }

    const wordSpans = container.querySelectorAll<HTMLSpanElement>('[data-scroll-color-word]');
    const update = () => {
      const vh = window.innerHeight;
      const line = vh * threshold;
      wordSpans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        span.style.color = mid < line ? dimColor : brightColor;
      });
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
  }, [words.length, brightColor, dimColor, threshold]);

  if (words.length === 0) {
    return React.createElement(Tag, { className }, children);
  }

  return React.createElement(
    Tag,
    { ref: containerRef, className },
    words.map((word, i) => (
      <React.Fragment key={i}>
        <span
          data-scroll-color-word
          className="transition-colors duration-200"
          style={{ color: brightColor }}
        >
          {word}
        </span>
        {i < words.length - 1 ? ' ' : ''}
      </React.Fragment>
    ))
  );
}
