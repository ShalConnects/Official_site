import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WorkImage, getUniqueServices } from '../data/workPortfolio';
import LazyImage from './LazyImage';
import SmartWorkImage from './SmartWorkImage';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import ErrorBoundary from './ErrorBoundary';

const CARD_HEIGHT = { compact: 'h-[200px] sm:h-[220px] md:h-[260px] lg:h-[280px]', full: 'h-[300px] sm:h-[400px] md:h-[500px]' } as const;
const CARD_WIDTH = { compact: 'w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px]', full: 'w-[400px] sm:w-[500px] md:w-[600px]' } as const;

function WorkCard({ work, compact, isPageScrolling }: { work: WorkImage; compact: boolean; isPageScrolling?: boolean }) {
  const isMulti = work.images && work.images.length > 1;
  const size = compact ? 'compact' : 'full';
  
  const ServiceBadge = work.services.length > 0 ? (
    <div className="absolute top-4 left-4 z-10">
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 text-white">
        {work.services[0]}
      </span>
    </div>
  ) : null;

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50">
      {isMulti ? (
        <div className={`grid grid-cols-2 gap-2 p-2 ${CARD_HEIGHT[size]}`}>
          {work.images!.map((img, i) => (
            <div key={i} className="relative flex items-center justify-center bg-gray-800 rounded overflow-hidden">
              <LazyImage src={img} alt={`${work.title} ${i + 1}`} className="w-full h-full object-contain p-1 sm:p-2" priority={i === 0} />
            </div>
          ))}
        </div>
      ) : (
        <SmartWorkImage
          src={work.image}
          alt={work.title}
          heightClass={CARD_HEIGHT[size]}
          isPageScrolling={isPageScrolling}
          forceLongScroll={work.longScreenshot}
        >
          {ServiceBadge}
        </SmartWorkImage>
      )}
      <div className="px-4 py-3 bg-gray-800/80 border-t border-gray-700/50">
        {work.clientName && <p className="text-xs text-gray-400 truncate">{work.clientName}</p>}
        <h3 className="text-sm font-semibold text-white truncate">{work.title}</h3>
      </div>
    </div>
  );
}

const CARDS_PER_PAGE = 3;

interface WorkSliderProps {
  images: WorkImage[];
  showServiceMarquee?: boolean;
  className?: string;
  speed?: number;
  compact?: boolean;
  /** Arrow mode: show 3 cards per page, step by 3, infinite loop. */
  arrows?: boolean;
  /** When arrows: auto-advance every N ms; pause on hover; respects reduced-motion. 0 = off. */
  autoPlayIntervalMs?: number;
  isPageScrolling?: boolean;
  /** Pause marquee on hover */
  pauseMarqueeOnHover?: boolean;
}

export default function WorkSlider({
  images,
  showServiceMarquee = true,
  className = '',
  speed = 20,
  compact = false,
  arrows = false,
  autoPlayIntervalMs = 0,
  isPageScrolling = false,
  pauseMarqueeOnHover = true
}: WorkSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const uniqueServices = useMemo(() => getUniqueServices(images), [images]);
  const totalPages = Math.max(1, Math.ceil(images.length / CARDS_PER_PAGE));
  const safePage = totalPages > 0 ? pageIndex % totalPages : 0;
  const pages = useMemo(
    () =>
      Array.from({ length: totalPages }, (_, i) =>
        images.slice(i * CARDS_PER_PAGE, i * CARDS_PER_PAGE + CARDS_PER_PAGE)
      ),
    [images, totalPages]
  );

  // Navigation with normalized page index
  const go = (delta: number) => {
    setPageIndex((p) => {
      const next = p + delta;
      return ((next % totalPages) + totalPages) % totalPages;
    });
  };

  // Swipe gesture support for mobile
  useSwipeGesture(sliderRef, {
    onSwipeLeft: () => go(1),
    onSwipeRight: () => go(-1),
  });

  // Auto-advance with optimized interval (5s default, respects reduced-motion)
  useEffect(() => {
    if (!arrows || autoPlayIntervalMs <= 0 || totalPages <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!isPaused && !isPageScrolling) go(1);
    }, autoPlayIntervalMs);
    return () => clearInterval(id);
  }, [arrows, autoPlayIntervalMs, totalPages, isPaused, isPageScrolling]);

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400">No work images available yet.</p>
        <p className="text-gray-500 text-sm mt-2">
          Add your work images to <code className="bg-gray-800 px-2 py-1 rounded">src/data/workPortfolio.ts</code>
        </p>
      </div>
    );
  }

  // Keyboard navigation (accessibility)
  useEffect(() => {
    if (!arrows) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [arrows, totalPages]);

  const slidePercent = totalPages > 1 ? (safePage * 100) / totalPages : 0;

  return (
    <ErrorBoundary>
      <div
        ref={sliderRef}
        className={`w-full ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Service Marquee */}
        {showServiceMarquee && uniqueServices.length > 0 && (
          <div className="relative overflow-hidden mb-8 py-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <div className="flex" style={{ animationPlayState: pauseMarqueeOnHover && isPaused ? 'paused' : 'running' }}>
              {[1, 2].map((set) => (
                <div
                  key={set}
                  className="flex items-center gap-4 whitespace-nowrap"
                  style={{ animation: `marqueeScroll ${speed}s infinite linear` }}
                >
                  {uniqueServices.map((service, idx) => (
                    <React.Fragment key={`marquee-${set}-${idx}`}>
                      <div className="px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-white text-sm font-medium">
                        {service}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slider */}
        <div className="overflow-hidden max-w-6xl mx-auto" role="region" aria-label="Work portfolio slider" aria-live="polite">
          <div
            className="flex transition-transform duration-500 ease-in-out will-change-transform"
            style={{ width: `${totalPages * 100}%`, transform: `translateX(-${slidePercent}%)` }}
          >
            {pages.map((pageItems, i) => {
              // Only render current page + adjacent pages (buffer) for performance
              const isVisible = Math.abs(i - safePage) <= 1;
              return (
                <div
                  key={i}
                  className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  style={{ width: `${100 / totalPages}%` }}
                  aria-hidden={i !== safePage}
                >
                  {isVisible ? pageItems.map((work, idx) => (
                    <div
                      key={work.id}
                      className={work.projectUrl && work.projectUrl !== '#' ? 'cursor-pointer' : ''}
                      onClick={() => work.projectUrl && work.projectUrl !== '#' && window.open(work.projectUrl, '_blank')}
                      role={work.projectUrl ? 'link' : undefined}
                      tabIndex={i === safePage ? 0 : -1}
                    >
                      <WorkCard work={work} compact={compact} isPageScrolling={isPageScrolling} />
                    </div>
                  )) : (
                    // Placeholder for unrendered pages to maintain layout
                    pageItems.map((work) => (
                      <div key={work.id} className="bg-gray-800 rounded-xl border border-gray-700/50 h-[260px] sm:h-[280px] animate-pulse" />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-3 mt-6 sm:mt-8" aria-label="Slider navigation">
          <button
            type="button"
            onClick={() => go(-1)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-green-500/50 hover:bg-gray-700 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <span className="text-sm text-gray-400" aria-live="polite" aria-atomic="true">
            Page {safePage + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-green-500/50 hover:bg-gray-700 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </nav>

        <style>{`
          @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}
