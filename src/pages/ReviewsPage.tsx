import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageContainer from '../components/PageContainer';
import PageSection from '../components/PageSection';

interface ReviewImage {
  id: string;
  src: string;
  alt: string;
}

// Generate all review images
// This function loads all available review screenshots
const generateAllReviewImages = (): Array<ReviewImage> => {
  const images: Array<ReviewImage> = [];
  
  // Load Screenshot_1 through Screenshot_202 (or as many as available)
  // We'll try to load a wide range, and missing images will be handled gracefully
  for (let i = 1; i <= 202; i++) {
    images.push({
      id: `review-${i}`,
      src: `/images/reviews/Screenshot_${i}.png`,
      alt: `Client Review ${i}`
    });
  }
  
  return images;
};

export default function ReviewsPage() {
  const [clickedImage, setClickedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const allImages = generateAllReviewImages();

  // Calculate images per column (distribute evenly across 3 columns)
  const COLUMNS = 3;
  const imagesPerColumn = Math.ceil(allImages.length / COLUMNS);

  // Navigation functions - memoized for performance
  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Handle Escape key and arrow keys for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!clickedImage) return;
      
      if (e.key === 'Escape') {
        setClickedImage(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clickedImage, handlePrevious, handleNext]);

  // Update clicked image when index changes
  useEffect(() => {
    if (clickedImage && allImages[currentImageIndex]) {
      setClickedImage(allImages[currentImageIndex].src);
    }
  }, [currentImageIndex, clickedImage, allImages]);

  // Split images into columns
  const column1Images = allImages.slice(0, imagesPerColumn);
  const column2Images = allImages.slice(imagesPerColumn, imagesPerColumn * 2);
  const column3Images = allImages.slice(imagesPerColumn * 2, allImages.length);

  // Duplicate images for seamless infinite scroll
  const duplicateImages = (imgArray: ReviewImage[]) => [...imgArray, ...imgArray];

  const col1Duplicated = duplicateImages(column1Images);
  const col2Duplicated = duplicateImages(column2Images);
  const col3Duplicated = duplicateImages(column3Images);

  // Prevent body scroll when full-screen is open
  useEffect(() => {
    if (clickedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [clickedImage]);

  return (
    <PageLayout title="All Reviews - ShalConnects">
      <PageHero
        title="Platform Reviews"
        description="Verified reviews from Fiverr and Upwork"
      />

      <PageSection className="relative w-full" style={{ 
        background: 'linear-gradient(to bottom, rgba(21, 102, 65, 0.05), rgba(218, 101, 30, 0.03))'
      }}>
        {/* Subtle Top Border */}
        <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
          background: 'linear-gradient(to right, transparent, rgba(21, 102, 65, 0.5), rgba(218, 101, 30, 0.5), transparent)'
        }}></div>
        
        <PageContainer>

          {/* Marquee - Full width */}
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
                    const originalIndex = idx % column1Images.length;
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
                            setClickedImage(image.src);
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
                    const originalIndex = (idx % column2Images.length) + column1Images.length;
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
                            setClickedImage(image.src);
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
                    const originalIndex = (idx % column3Images.length) + column1Images.length + column2Images.length;
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
                            setClickedImage(image.src);
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
              {allImages.map((image, index) => (
                <div
                  key={image.id}
                  className="mb-3 sm:mb-4 break-inside-avoid group relative cursor-pointer"
                >
                  <img
                    src={image.src}
                    alt={`${image.alt} - Client review from Fiverr or Upwork`}
                    className="w-full h-auto rounded-lg sm:rounded-xl object-cover border border-gray-700/50 hover:border-gray-600/50 active:border-gray-500/50 transition-all duration-300"
                    loading="lazy"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setClickedImage(image.src);
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
          </div>
        </PageContainer>
      </PageSection>

        {/* Full-screen overlay on click */}
        {clickedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in-scale"
            onClick={() => setClickedImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setClickedImage(null)}
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
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Full-size image */}
            <div className="max-w-[95vw] sm:max-w-[90vw] max-h-[85vh] sm:max-h-[90vh] flex items-center justify-center p-2 sm:p-4">
              <img
                src={clickedImage}
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
    </PageLayout>
  );
}
