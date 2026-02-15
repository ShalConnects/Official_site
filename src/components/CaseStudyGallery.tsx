import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/** Fixed-height deliverables gallery: slider with prev/next, dots, counter; optional overlay strip; click any image for fullscreen. */
export default function CaseStudyGallery({
  mainImages,
  stripImages,
  inline,
}: {
  mainImages: string[];
  stripImages: string[];
  inline?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [fullScreenSrc, setFullScreenSrc] = useState<string | null>(null);
  const [stripPaused, setStripPaused] = useState(false);
  const stripScrollRef = useRef<HTMLDivElement>(null);
  const n = mainImages.length;
  const strip = stripImages.length > 0;
  const go = (delta: number) => setIdx((i) => (i + delta + n) % n);
  const stripInset = 'right-48 sm:right-64';
  useEffect(() => {
    const el = stripScrollRef.current;
    if (!el || !strip) return;
    const onWheel = (e: WheelEvent) => {
      el.scrollTop += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [strip]);
  useEffect(() => {
    if (!strip || stripPaused || typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = stripScrollRef.current;
    if (!el) return;
    const half = el.scrollHeight / 2;
    let raf = 0;
    const tick = () => {
      el.scrollTop += 1.5;
      if (el.scrollTop >= half) el.scrollTop = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [strip, stripPaused]);
  useEffect(() => {
    if (!fullScreenSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullScreenSrc(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [fullScreenSrc]);
  return (
    <section className={inline ? 'flex-1 min-w-0 lg:min-w-[420px]' : 'mt-12 pt-8 border-t border-gray-700/50'} aria-label="Deliverables gallery">
      <div className="relative rounded-xl border border-gray-700/50 overflow-hidden bg-gray-800/30 h-[320px] sm:h-[400px]">
        <div className={`absolute inset-0 flex items-center justify-center p-3 ${strip ? stripInset : ''}`}>
          <img
            key={idx}
            src={mainImages[idx]}
            alt=""
            role="button"
            tabIndex={0}
            className="w-full h-full object-contain object-center rounded-lg animate-[fadeIn_0.25s_ease-out_forwards] cursor-zoom-in"
            onClick={() => setFullScreenSrc(mainImages[idx])}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFullScreenSrc(mainImages[idx]); }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-gray-600" aria-label="Previous slide">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => go(1)} className={`absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-gray-600 ${strip ? stripInset : 'right-2'}`} aria-label="Next slide">
              <ChevronRight size={20} />
            </button>
            <div className={`absolute bottom-2 left-0 right-0 z-10 flex justify-center ${strip ? stripInset : ''}`}>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/90 tabular-nums">{idx + 1}/{n}</span>
              <div className="flex gap-1">
                {mainImages.map((_, i) => (
                  <button key={i} type="button" onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`} aria-label={`Slide ${i + 1}`} aria-current={i === idx ? 'true' : undefined} />
                ))}
              </div>
            </div>
            </div>
          </>
        )}
        {strip && (
          <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64 bg-gray-900/60 backdrop-blur-sm border-l border-gray-700/40 z-10 overflow-hidden flex flex-col" title="Scroll with mouse wheel; hover to pause" onMouseEnter={() => setStripPaused(true)} onMouseLeave={() => setStripPaused(false)}>
            <div ref={stripScrollRef} className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-2 min-h-0 scroll-smooth">
              {[...stripImages, ...stripImages].map((src, j) => (
                <img key={j} src={src} alt="" role="button" tabIndex={0} className="w-full h-auto max-h-64 sm:max-h-80 rounded object-contain object-center flex-shrink-0 bg-gray-800/50 cursor-zoom-in" onClick={() => setFullScreenSrc(src)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFullScreenSrc(src); }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ))}
            </div>
          </div>
        )}
      </div>
      {fullScreenSrc && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenSrc(null)} role="button" tabIndex={0} aria-label="Close" onKeyDown={(e) => { if (e.key === 'Escape') setFullScreenSrc(null); }}>
          <button type="button" className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setFullScreenSrc(null); }} aria-label="Close"><X size={24} /></button>
          <img src={fullScreenSrc} alt="" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
