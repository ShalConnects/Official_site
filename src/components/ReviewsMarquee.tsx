import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

interface ReviewImage {
  id: string;
  src: string;
  alt: string;
}

interface ReviewsMarqueeProps {
  images: ReviewImage[];
}

// Constants
const IMAGES_PER_COLUMN = 10;
const TOTAL_IMAGES = 30;
const COLUMNS = 3;

export default function ReviewsMarquee({ images }: ReviewsMarqueeProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Navigation functions - memoized for performance
  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % TOTAL_IMAGES);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
  }, []);

  // Handle Escape key and arrow keys for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hoveredImage) return;
      
      if (e.key === 'Escape') {
        setHoveredImage(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredImage]);

  // Update hovered image when index changes
  useEffect(() => {
    if (hoveredImage && images[currentImageIndex]) {
      setHoveredImage(images[currentImageIndex].src);
    }
  }, [currentImageIndex, hoveredImage, images]);

  // Prevent body scroll when full-screen is open
  useEffect(() => {
    if (hoveredImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [hoveredImage]);

  // Validate image count
  if (images.length < TOTAL_IMAGES) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">
          Loading reviews... ({images.length} of {TOTAL_IMAGES} images available)
        </p>
      </div>
    );
  }

  // Split images into columns
  const column1Images = images.slice(0, IMAGES_PER_COLUMN);
  const column2Images = images.slice(IMAGES_PER_COLUMN, IMAGES_PER_COLUMN * 2);
  const column3Images = images.slice(IMAGES_PER_COLUMN * 2, TOTAL_IMAGES);

  // Duplicate images for seamless infinite scroll
  const duplicateImages = (imgArray: ReviewImage[]) => [...imgArray, ...imgArray];

  const col1Duplicated = duplicateImages(column1Images);
  const col2Duplicated = duplicateImages(column2Images);
  const col3Duplicated = duplicateImages(column3Images);

  return (
    <div className="w-full">
      {/* Desktop: 3-column marquee */}
      <div 
        className="hidden lg:flex gap-3 md:gap-4 xl:gap-6 h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden relative"
        aria-label="Client reviews from Fiverr and Upwork"
        role="region"
      >
        {/* Column 1: Scroll Down */}
        <div className="flex-1 relative overflow-hidden">
                {/* Top gradient fade */}
                <div className="absolute top-0 left-0 right-0 h-[60px] sm:h-[80px] lg:h-[100px] z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 20%, rgba(17, 24, 39, 0.75) 50%, rgba(17, 24, 39, 0.4) 80%, transparent 100%)' }}></div>
                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[60px] sm:h-[80px] lg:h-[100px] z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to top, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 20%, rgba(17, 24, 39, 0.75) 50%, rgba(17, 24, 39, 0.4) 80%, transparent 100%)' }}></div>
          <div className="marquee-down">
            {col1Duplicated.map((image, idx) => {
              // Calculate original index directly (O(1) instead of O(n))
              const originalIndex = idx % IMAGES_PER_COLUMN;
              return (
                      <div
                        key={`col1-${image.id}-${idx}`}
                        className="mb-3 sm:mb-4 flex-shrink-0 relative group"
                      >
                  <img
                    src={image.src}
                    alt={`${image.alt} - Client review from Fiverr or Upwork`}
                          className="w-full h-auto rounded-lg sm:rounded-xl object-cover border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-900/50"
                    loading="lazy"
                    onClick={() => {
                      setCurrentImageIndex(originalIndex);
                      setHoveredImage(image.src);
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Hover overlay with click hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">Click to view</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Scroll Up */}
        <div className="flex-1 relative overflow-hidden">
                {/* Top gradient fade */}
                <div className="absolute top-0 left-0 right-0 h-[60px] sm:h-[80px] lg:h-[100px] z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 20%, rgba(17, 24, 39, 0.75) 50%, rgba(17, 24, 39, 0.4) 80%, transparent 100%)' }}></div>
                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[60px] sm:h-[80px] lg:h-[100px] z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to top, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 20%, rgba(17, 24, 39, 0.75) 50%, rgba(17, 24, 39, 0.4) 80%, transparent 100%)' }}></div>
          <div className="marquee-up">
            {col2Duplicated.map((image, idx) => {
              // Calculate original index directly (O(1) instead of O(n))
              const originalIndex = (idx % IMAGES_PER_COLUMN) + IMAGES_PER_COLUMN;
              return (
                      <div
                        key={`col2-${image.id}-${idx}`}
                        className="mb-3 sm:mb-4 flex-shrink-0 relative group"
                      >
                  <img
                    src={image.src}
                    alt={`${image.alt} - Client review from Fiverr or Upwork`}
                          className="w-full h-auto rounded-lg sm:rounded-xl object-cover border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-900/50"
                    loading="lazy"
                    onClick={() => {
                      setCurrentImageIndex(originalIndex);
                      setHoveredImage(image.src);
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Hover overlay with click hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">Click to view</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Scroll Down */}
        <div className="flex-1 relative overflow-hidden">
                {/* Top gradient fade */}
                <div className="absolute top-0 left-0 right-0 h-[60px] sm:h-[80px] lg:h-[100px] z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 20%, rgba(17, 24, 39, 0.75) 50%, rgba(17, 24, 39, 0.4) 80%, transparent 100%)' }}></div>
                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[60px] sm:h-[80px] lg:h-[100px] z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to top, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 20%, rgba(17, 24, 39, 0.75) 50%, rgba(17, 24, 39, 0.4) 80%, transparent 100%)' }}></div>
          <div className="marquee-down">
            {col3Duplicated.map((image, idx) => {
              // Calculate original index directly (O(1) instead of O(n))
              const originalIndex = (idx % IMAGES_PER_COLUMN) + (IMAGES_PER_COLUMN * 2);
              return (
                      <div
                        key={`col3-${image.id}-${idx}`}
                        className="mb-3 sm:mb-4 flex-shrink-0 relative group"
                      >
                  <img
                    src={image.src}
                    alt={`${image.alt} - Client review from Fiverr or Upwork`}
                          className="w-full h-auto rounded-lg sm:rounded-xl object-cover border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-900/50"
                    loading="lazy"
                    onClick={() => {
                      setCurrentImageIndex(originalIndex);
                      setHoveredImage(image.src);
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Hover overlay with click hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">Click to view</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Static grid fallback */}
      <div className="lg:hidden columns-1 sm:columns-2 gap-3 sm:gap-4">
        {images.slice(0, TOTAL_IMAGES).map((image, index) => (
          <div
            key={image.id}
            className="mb-3 sm:mb-4 break-inside-avoid group relative cursor-pointer"
          >
            <img
              src={image.src}
              alt={`${image.alt} - Client review from Fiverr or Upwork`}
              className="w-full h-auto rounded-lg sm:rounded-xl object-cover border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
              loading="lazy"
              onClick={() => {
                setCurrentImageIndex(index);
                setHoveredImage(image.src);
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Hover overlay with click hint for mobile */}
            <div className="absolute inset-0 bg-black/0 group-active:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-active:opacity-100 rounded-lg sm:rounded-xl pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 transform scale-90 group-active:scale-100 transition-transform">
                <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-white text-xs sm:text-sm font-medium">Tap to view</p>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen overlay on click */}
      {hoveredImage && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in-scale"
          onClick={() => setHoveredImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setHoveredImage(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 active:bg-black/80 transition-colors touch-manipulation"
            aria-label="Close full-screen view"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 active:bg-black/80 transition-colors touch-manipulation"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 active:bg-black/80 transition-colors touch-manipulation"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm">
            {currentImageIndex + 1} / {TOTAL_IMAGES}
          </div>

          {/* Full-size image */}
          <div className="max-w-[95vw] sm:max-w-[90vw] max-h-[85vh] sm:max-h-[90vh] flex items-center justify-center p-2 sm:p-4">
            <img
              src={hoveredImage}
              alt="Client review full screen"
              className="max-w-full max-h-full object-contain rounded-lg sm:rounded-xl animate-fade-in-scale"
            />
          </div>
        </div>
      )}

      <style>{`
        .marquee-down {
          animation: scrollDown 40s linear infinite;
          display: flex;
          flex-direction: column;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .marquee-up {
          animation: scrollUp 40s linear infinite;
          display: flex;
          flex-direction: column;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .marquee-down:hover,
        .marquee-up:hover {
          animation-play-state: paused;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-down,
          .marquee-up {
            animation: none;
            transform: none !important;
          }
          .animate-fade-in-scale {
            animation: none;
          }
        }

        @keyframes scrollDown {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -50%, 0);
          }
        }

        @keyframes scrollUp {
          0% {
            transform: translate3d(0, -50%, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
