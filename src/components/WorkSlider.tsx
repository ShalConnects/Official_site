import React, { useEffect, useRef, useState } from 'react';
import { WorkImage } from '../data/workPortfolio';

interface WorkSliderProps {
  images: WorkImage[];
  showServiceMarquee?: boolean;
  className?: string;
  speed?: number; // Animation speed in seconds (lower = faster)
  compact?: boolean; // Smaller cards so more slides fit in viewport (e.g. landing page)
}

export default function WorkSlider({
  images,
  showServiceMarquee = true,
  className = '',
  speed = 20,
  compact = false
}: WorkSliderProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const momentumRef = useRef<number | null>(null);
  const autoScrollRef = useRef<number | null>(null);
  const hasDragged = useRef(false);

  // Get unique services for marquee
  const uniqueServices = React.useMemo(() => {
    const services = new Set<string>();
    images.forEach(work => {
      work.services.forEach(service => services.add(service));
    });
    return Array.from(services);
  }, [images]);

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = React.useMemo(() => {
    if (images.length === 0) return [];
    // Duplicate 3 times for smooth infinite scroll
    return [...images, ...images, ...images];
  }, [images]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    setIsDragging(true);
    setIsPaused(true);
    hasDragged.current = false;
    dragStartX.current = e.pageX - carousel.offsetLeft;
    dragScrollLeft.current = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
    carousel.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const carousel = carouselRef.current;
    if (!carousel) return;

    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5; // Scroll speed multiplier
    
    // Check if user actually dragged (moved more than 5px)
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    
    carousel.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.style.cursor = 'grab';
      carousel.style.userSelect = '';
    }

    // Reset drag flag after a short delay to allow click events
    setTimeout(() => {
      hasDragged.current = false;
    }, 100);

    // Resume auto-scroll after a short delay
    setTimeout(() => {
      setIsPaused(false);
    }, 2000); // 2 second delay before resuming
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      hasDragged.current = false;
      const carousel = carouselRef.current;
      if (carousel) {
        carousel.style.cursor = 'grab';
        carousel.style.userSelect = '';
      }
      setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = e.touches[0].pageX - carousel.offsetLeft;
    dragScrollLeft.current = carousel.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    carousel.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Add momentum scrolling
    const carousel = carouselRef.current;
    if (!carousel) return;

    const startScrollLeft = carousel.scrollLeft;
    const startTime = Date.now();
    const duration = 300; // 300ms momentum
    const startVelocity = 0.5; // Initial velocity

    const momentumScroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScroll = startScrollLeft + (startVelocity * easeOut * 500);

      carousel.scrollLeft = currentScroll;

      if (progress < 1) {
        momentumRef.current = requestAnimationFrame(momentumScroll);
      } else {
        // Resume auto-scroll after momentum
        setTimeout(() => {
          setIsPaused(false);
        }, 1000);
      }
    };

    momentumRef.current = requestAnimationFrame(momentumScroll);
  };

  // Auto-scroll with pause support
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || images.length === 0) return;

    const scrollSpeed = 0.5; // pixels per frame

    const autoScroll = () => {
      if (!isPaused && !isDragging) {
        carousel.scrollLeft += scrollSpeed;
        
        // Reset to middle section for infinite scroll
        const scrollWidth = carousel.scrollWidth / 3;
        if (carousel.scrollLeft >= scrollWidth * 2) {
          carousel.scrollLeft = scrollWidth;
        }
      }
      autoScrollRef.current = requestAnimationFrame(autoScroll);
    };

    // Pause on hover (but not when dragging)
    const handleMouseEnter = () => {
      if (!isDragging) {
        setIsPaused(true);
      }
    };
    const handleMouseLeave = () => {
      if (!isDragging) {
        setIsPaused(false);
      }
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    // Set initial cursor
    carousel.style.cursor = 'grab';

    // Start auto-scroll
    autoScrollRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
      }
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [images.length, isPaused, isDragging]);

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

  return (
    <div className={`w-full ${className}`}>
      {/* Service Marquee Text */}
      {showServiceMarquee && uniqueServices.length > 0 && (
        <div className="relative overflow-hidden mb-8 py-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
          <div className="flex">
            {/* First marquee - left to right */}
            <div
              ref={marqueeRef}
              className="flex items-center gap-4 whitespace-nowrap"
              style={{
                animation: `marqueeScroll ${speed}s infinite linear`
              }}
            >
              {uniqueServices.map((service, idx) => (
                <React.Fragment key={`marquee-1-${idx}`}>
                  <div className="px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-white text-sm font-medium">
                    {service}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                </React.Fragment>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div
              className="flex items-center gap-4 whitespace-nowrap"
              style={{
                animation: `marqueeScroll ${speed}s infinite linear`
              }}
            >
              {uniqueServices.map((service, idx) => (
                <React.Fragment key={`marquee-2-${idx}`}>
                  <div className="px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-white text-sm font-medium">
                    {service}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Infinite Image Carousel */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide select-none"
          style={{
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {duplicatedImages.map((work, idx) => (
            <div
              key={`${work.id}-${idx}`}
              className={`flex-shrink-0 group cursor-pointer ${compact ? 'w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px]' : 'w-[400px] sm:w-[500px] md:w-[600px]'}`}
              onClick={(e) => {
                // Only open link if user didn't drag
                if (!hasDragged.current && work.projectUrl && work.projectUrl !== '#') {
                  window.open(work.projectUrl, '_blank');
                }
              }}
            >
              <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50">
                {/* Image - full width, vertically centered */}
                <div className={`relative flex items-center justify-center w-full overflow-hidden bg-gray-900 ${compact ? 'h-[200px] sm:h-[220px] md:h-[260px] lg:h-[280px]' : 'h-[300px] sm:h-[400px] md:h-[500px]'}`}>
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  {/* Service Badge */}
                  {work.services.length > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 text-white">
                        {work.services[0]}
                      </span>
                    </div>
                  )}

                </div>
                {/* Always-on strip: client + title */}
                <div className="px-4 py-3 bg-gray-800/80 border-t border-gray-700/50">
                  {work.clientName && (
                    <p className="text-xs text-gray-400 truncate">{work.clientName}</p>
                  )}
                  <h3 className="text-sm font-semibold text-white truncate">{work.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Auto-scroll animation for carousel */
        @keyframes autoScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        /* Apply auto-scroll if needed */
        .auto-scroll {
          animation: autoScroll ${speed * 2}s infinite linear;
        }
      `}</style>
    </div>
  );
}
