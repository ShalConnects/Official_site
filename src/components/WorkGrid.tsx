import React, { useState, useMemo } from 'react';
import { WorkImage } from '../data/workPortfolio';
import WorkDetailModal from './WorkDetailModal';
import LazyImage from './LazyImage';
import SmartWorkImage from './SmartWorkImage';
import ErrorBoundary from './ErrorBoundary';

interface WorkGridProps {
  images: WorkImage[];
  className?: string;
  isPageScrolling?: boolean;
}

export default function WorkGrid({ images, className = '', isPageScrolling = false }: WorkGridProps) {
  const [selectedWork, setSelectedWork] = useState<WorkImage | null>(null);

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400">No work images available yet.</p>
      </div>
    );
  }

  const ServiceBadge = ({ service }: { service: string }) => (
    <div className="absolute top-3 left-3 z-10">
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 text-white">
        {service}
      </span>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {images.map((work) => (
          <article
            key={work.id}
            className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-[1.02] will-change-transform cursor-pointer"
            onClick={() => setSelectedWork(work)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedWork(work)}
            aria-label={`View ${work.title} details`}
          >
            <div className="relative w-full h-[240px] sm:h-[280px] bg-gray-900">
              {work.images && work.images.length > 1 ? (
                <div className="grid grid-cols-2 gap-2 p-2 h-full">
                  {work.images.map((img, i) => (
                    <div key={i} className="relative flex items-center justify-center bg-gray-800 rounded overflow-hidden">
                      <LazyImage src={img} alt={`${work.title} ${i + 1}`} className="w-full h-full object-contain p-2" priority={i < 6} />
                    </div>
                  ))}
                </div>
              ) : (
                <SmartWorkImage
                  src={work.image}
                  alt={work.title}
                  heightClass="h-[240px] sm:h-[280px]"
                  className="group-hover:scale-105 transition-transform duration-500"
                  isPageScrolling={isPageScrolling}
                  forceLongScroll={work.longScreenshot}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  {work.services.length > 0 && <ServiceBadge service={work.services[0]} />}
                </SmartWorkImage>
              )}
            </div>
            <div className="p-4">
              {work.clientName && <p className="text-xs text-gray-400 mb-0.5">{work.clientName}</p>}
              <h3 className="text-base font-semibold text-white mb-1">{work.title}</h3>
              {work.description && <p className="text-sm text-gray-300 line-clamp-2">{work.description}</p>}
              {work.results && <p className="text-sm font-medium text-white/90 mt-1">{work.results}</p>}
            </div>
          </article>
        ))}
      </div>
      {selectedWork && <WorkDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />}
    </ErrorBoundary>
  );
}
