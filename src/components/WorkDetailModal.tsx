import React, { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { WorkImage } from '../data/workPortfolio';
import { usePageScrolling } from './LongScreenshotScroll';
import LazyImage from './LazyImage';
import SmartWorkImage from './SmartWorkImage';

interface WorkDetailModalProps {
  work: WorkImage;
  onClose: () => void;
}

export default function WorkDetailModal({ work, onClose }: WorkDetailModalProps) {
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const isModalScrolling = usePageScrolling(modalScrollRef);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const isMulti = work.images && work.images.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
    >
      <div className="relative bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors" aria-label="Close">
          <X size={20} className="text-white" />
        </button>
        
        <div ref={modalScrollRef} className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="relative w-full bg-gray-800">
            {isMulti ? (
              <div className="grid grid-cols-2 gap-4 p-6">
                {work.images!.map((img, i) => (
                  <div key={i} className="relative flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden min-h-[200px]">
                    <LazyImage src={img} alt={`${work.title} ${i + 1}`} className="w-full h-full object-contain p-4" priority />
                  </div>
                ))}
              </div>
            ) : (
              <SmartWorkImage
                src={work.image}
                alt={work.title}
                heightClass="h-[400px] sm:h-[500px]"
                isPageScrolling={isModalScrolling}
              />
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {work.services.map(s => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 border border-gray-700 text-white">{s}</span>
              ))}
              {work.category && <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">{work.category}</span>}
            </div>

            {work.clientName && <p className="text-sm text-gray-400 mb-2">{work.clientName}</p>}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{work.title}</h2>
            {work.description && <p className="text-gray-300 mb-4 leading-relaxed">{work.description}</p>}
            {work.results && <p className="text-lg font-semibold text-green-400 mb-4">{work.results}</p>}
            {work.quote && (
              <blockquote className="border-l-4 border-gray-700 pl-4 py-2 mb-4 italic text-gray-400">"{work.quote}"</blockquote>
            )}

            {work.projectUrl && work.projectUrl !== '#' && (
              <a href={work.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                View Live Project <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
