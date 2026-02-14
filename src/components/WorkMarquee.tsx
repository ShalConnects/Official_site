import React, { useState } from 'react';
import { WorkImage } from '../data/workPortfolio';
import LazyImage from './LazyImage';
import SmartWorkImage from './SmartWorkImage';

const CARD_HEIGHT = 'h-[240px] sm:h-[280px] md:h-[320px]';

function WorkCard({ work, isPageScrolling, widthClass }: { work: WorkImage; isPageScrolling?: boolean; widthClass: string }) {
  const isMulti = work.images && work.images.length > 1;
  
  return (
    <div className={`relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 flex-shrink-0 ${widthClass}`}>
      {isMulti ? (
        <div className={`grid grid-cols-2 gap-2 p-2 ${CARD_HEIGHT}`}>
          {work.images!.map((img, i) => (
            <div key={i} className="relative flex items-center justify-center bg-gray-800 rounded overflow-hidden">
              <LazyImage src={img} alt={`${work.title} ${i + 1}`} className="w-full h-full object-contain p-1 sm:p-2" />
            </div>
          ))}
        </div>
      ) : (
        <SmartWorkImage src={work.image} alt={work.title} heightClass={CARD_HEIGHT} isPageScrolling={isPageScrolling} forceLongScroll={work.longScreenshot}>
          {work.services.length > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 text-white">
                {work.services[0]}
              </span>
            </div>
          )}
        </SmartWorkImage>
      )}
      <div className="px-4 py-3 bg-gray-800/80 border-t border-gray-700/50">
        {work.clientName && <p className="text-xs text-gray-400 truncate">{work.clientName}</p>}
        <h3 className="text-sm font-semibold text-white truncate">{work.title}</h3>
      </div>
    </div>
  );
}

interface WorkMarqueeProps {
  images: WorkImage[];
  isPageScrolling?: boolean;
  speed?: number;
}

/** Infinite marquee: ~3 cards visible on desktop, 2 on tablet, 1 on mobile */
const MARQUEE_DURATION_S = 25;
export default function WorkMarquee({ images, isPageScrolling = false, speed = MARQUEE_DURATION_S }: WorkMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  // 1-2 items: static grid display
  if (images.length <= 2) {
    return (
      <div className="flex justify-center items-center py-12 px-4">
        <div className={`grid gap-6 ${images.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' : 'max-w-md'} w-full`}>
          {images.map((work) => (
            <div
              key={work.id}
              className={work.projectUrl && work.projectUrl !== '#' ? 'cursor-pointer' : ''}
              onClick={() => work.projectUrl && work.projectUrl !== '#' && window.open(work.projectUrl, '_blank')}
              role={work.projectUrl ? 'link' : undefined}
              tabIndex={0}
              aria-label={work.projectUrl ? `View ${work.title} project` : work.title}
            >
              <WorkCard work={work} isPageScrolling={isPageScrolling} widthClass="w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3+ items: infinite marquee (optimized: duplicate only once for seamless loop)
  const duplicated = [...images, ...images];

  return (
    <div
      className="relative overflow-hidden py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Work portfolio showcase"
    >
      <div
        className="flex gap-6"
        style={{
          animation: `marqueeSlide ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {duplicated.map((work, idx) => (
          <div
            key={`${work.id}-${idx}`}
            className={work.projectUrl && work.projectUrl !== '#' ? 'cursor-pointer' : ''}
            onClick={() => work.projectUrl && work.projectUrl !== '#' && window.open(work.projectUrl, '_blank')}
            role={work.projectUrl ? 'link' : undefined}
            tabIndex={0}
            aria-label={work.projectUrl ? `View ${work.title} project` : work.title}
          >
            <WorkCard 
              work={work} 
              isPageScrolling={isPageScrolling} 
              widthClass="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />

      <style>{`
        @keyframes marqueeSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
