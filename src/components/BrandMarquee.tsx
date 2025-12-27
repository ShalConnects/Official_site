import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';

interface BrandMarqueeProps {
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  brands: string[];
}

export default function BrandMarquee({ 
  direction = 'left', 
  speed = 20,
  className = '',
  brands
}: BrandMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const oneSetWidthRef = useRef(0); // Width of one set of brands (1/6 of total)
  const wheelOffsetRef = useRef(0); // Track wheel scroll offset
  
  // Duplicate the brands array multiple times for seamless infinite scroll
  // Using 6 copies ensures smooth infinite scrolling - animation moves exactly 1/6 (one set)
  // This creates a perfect seamless loop with no visible jumps
  // Memoized to prevent recreation on every render
  const duplicatedBrands = useMemo(() => {
    if (brands.length === 0) return [];
    return [...brands, ...brands, ...brands, ...brands, ...brands, ...brands];
  }, [brands]);
  
  // Generate descriptive alt text from filename
  const getAltText = (filename: string): string => {
    // Remove file extension and clean up the name
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    // Replace common separators with spaces and capitalize
    const cleaned = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || 'Brand logo';
  };

  // Calculate one set width when component mounts or brands change
  useEffect(() => {
    if (animationRef.current && duplicatedBrands.length > 0) {
      // Wait for next frame to ensure layout is complete
      requestAnimationFrame(() => {
        if (animationRef.current) {
          const totalWidth = animationRef.current.scrollWidth;
          oneSetWidthRef.current = totalWidth / 6; // One set is 1/6 of total
        }
      });
    }
  }, [duplicatedBrands.length]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer - pause when not visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Control animation play/pause
  useEffect(() => {
    if (!animationRef.current) return;

    const shouldPause = isPaused || !isVisible || prefersReducedMotion || isInteractingRef.current;
    
    if (shouldPause) {
      animationRef.current.style.animationPlayState = 'paused';
    } else {
      animationRef.current.style.animationPlayState = 'running';
    }
  }, [isPaused, isVisible, prefersReducedMotion]);

  // Helper function to wrap offset to maintain infinite loop (for wheel scroll)
  const wrapOffset = useCallback((offset: number): number => {
    if (oneSetWidthRef.current <= 0) return offset;
    
    let wrapped = ((offset % oneSetWidthRef.current) + oneSetWidthRef.current) % oneSetWidthRef.current;
    
    // Handle negative offsets correctly
    if (wrapped < 0) {
      wrapped -= oneSetWidthRef.current;
    }
    
    return wrapped;
  }, []);

  // Helper function to apply transform directly to DOM (for wheel scroll)
  const applyTransform = useCallback((offset: number, element: HTMLElement | null) => {
    if (!element) return;
    const transform = `translate3d(${offset}px, 0, 0)`;
    element.style.transform = transform;
    element.style.webkitTransform = transform;
    (element.style as any).mozTransform = transform;
    (element.style as any).msTransform = transform;
  }, []);

  // Scroll wheel handler - simple and smooth
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    isInteractingRef.current = true;
    
    // Clear existing timeout
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }
    
    // Calculate scroll delta (invert for natural scroll direction)
    const delta = e.deltaY > 0 ? 30 : -30;
    
    // Update wheel offset
    wheelOffsetRef.current += delta;
    
    // Apply wrapping to maintain infinite loop
    wheelOffsetRef.current = wrapOffset(wheelOffsetRef.current);
    
    // Apply transform directly to animation element
    if (animationRef.current) {
      // Get current animation transform
      const computedStyle = window.getComputedStyle(animationRef.current);
      const currentTransform = computedStyle.transform || (computedStyle as any).webkitTransform;
      let currentOffset = 0;
      
      if (currentTransform && currentTransform !== 'none') {
        if (currentTransform.includes('matrix')) {
          const values = currentTransform.split('(')[1].split(')')[0].split(',');
          currentOffset = parseFloat(values[4]) || 0;
        } else if (currentTransform.includes('translate3d')) {
          const values = currentTransform.split('(')[1].split(')')[0].split(',');
          currentOffset = parseFloat(values[0].trim()) || 0;
        }
      }
      
      // Apply combined offset
      applyTransform(currentOffset + wheelOffsetRef.current, animationRef.current);
    }
    
    // Reset interaction flag after delay
    wheelTimeoutRef.current = setTimeout(() => {
      // Reset wheel offset and animation transform
      wheelOffsetRef.current = 0;
      if (animationRef.current) {
        animationRef.current.style.transform = '';
        animationRef.current.style.webkitTransform = '';
        (animationRef.current.style as any).mozTransform = '';
        (animationRef.current.style as any).msTransform = '';
      }
      isInteractingRef.current = false;
      wheelTimeoutRef.current = null;
    }, 500);
  }, [applyTransform, wrapOffset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup wheel timeout
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  const animationDuration = prefersReducedMotion ? '0s' : `${speed}s`;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden pt-4 pb-4 ${className}`}
      style={{
        contain: 'layout style paint',
        transform: 'translateZ(0)',
        background: 'transparent',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Enhanced fade edges with theme colors - responsive width */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 md:w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.85) 40%, rgba(17, 24, 39, 0.5) 70%, transparent 100%)',
        }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 md:w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.85) 40%, rgba(17, 24, 39, 0.5) 70%, transparent 100%)',
        }}
      />
      
      <div 
        ref={animationRef}
        className={`flex gap-4 items-center ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{
          animationDuration: animationDuration,
          animationTimingFunction: 'linear',
          width: 'fit-content',
          whiteSpace: 'nowrap',
          animationPlayState: isPaused || !isVisible || prefersReducedMotion || isInteractingRef.current ? 'paused' : 'running',
        }}
        onWheel={handleWheel}
      >
        {duplicatedBrands.map((brand, index) => {
          // Check if this is the special image that needs transparent background
          const isSpecialImage = brand === 'right-logo-7.png' || brand === 'right-logo-2.png' || brand === 'right-logo-47.png' || brand === 'right-logo-41.webp' || brand === 'right-logo-28.png';
          // Check if this image needs black background
          const isBlackBackground = brand === 'right-logo-40.png' || brand === 'right-logo-8.png' || brand === 'left-logo-56.png' || brand === 'left-logo-36.png' || brand === 'right-logo-27.png' || brand === 'left-logo-60.jpg' || brand === 'right-logo-62.png' || brand === 'right-logo-50.png' || brand === 'left-logo-8.jpg';
          // Custom background colors/gradients for specific logos
          const customBackgrounds: Record<string, string> = {
            'right-logo-6.png': '#01172e',
            'left-logo-25.jpg': '#295149',
            'right-logo-24.png': '#333333',
            'right-logo-45.jpg': 'linear-gradient(to bottom, #2773c7, #27548b)',
            'left-logo-50.jpg': '#faf5e2',
            'right-logo-36.jpg': '#72bc49'
          };
          const customBackground = customBackgrounds[brand];
          // Create unique key using brand filename and index to avoid collisions
          const uniqueKey = `brand-${brand.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`;
          return (
          <div
            key={uniqueKey}
            className="flex-shrink-0 flex items-center justify-center h-12 sm:h-14 md:h-16"
            style={{
              width: 'auto',
            }}
          >
            <div 
              className="h-full flex items-center justify-center border transition-all duration-300"
              style={{
                padding: '4px',
                background: customBackground || (isBlackBackground ? '#000' : (isSpecialImage ? 'transparent' : '#fff')),
                borderRadius: '6px',
                transform: 'translateZ(0)',
                willChange: 'auto',
                borderColor: 'rgba(75, 85, 99, 0.3)',
                borderWidth: '1px',
                boxShadow: customBackground 
                  ? '0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                  : (isSpecialImage 
                    ? '0 2px 10px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.03)' 
                    : (isBlackBackground 
                      ? '0 2px 10px rgba(0, 0, 0, 0.35), 0 1px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)')),
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = 'rgba(74, 157, 111, 0.4)';
                target.style.boxShadow = 'none';
                target.style.transform = 'translateY(-3px) scale(1.06)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                
                if (isSpecialImage) {
                  target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.03)';
                } else if (isBlackBackground || customBackground) {
                  target.style.boxShadow = customBackground 
                    ? '0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
                    : '0 2px 10px rgba(0, 0, 0, 0.35), 0 1px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
                } else {
                  target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                }
                target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <img
                src={`/images/brands/${brand}`}
                alt={getAltText(brand)}
                className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                style={{
                  maxWidth: '150px',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  imageRendering: 'auto',
                  WebkitFontSmoothing: 'antialiased',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
                loading="eager"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onError={(e) => {
                  // Handle image load errors more gracefully
                  const target = e.target as HTMLImageElement;
                  const src = target.src;
                  
                  // Check if it's a TIFF file (not supported by browsers)
                  if (src.includes('.tif') || src.includes('.tiff')) {
                    // For TIFF files, show a more visible placeholder
                    target.style.opacity = '0.6';
                    target.style.filter = 'grayscale(50%)';
                    target.style.border = '2px dashed #666';
                    // Add a title tooltip
                    target.title = 'Image format not supported. Please convert to PNG/JPEG.';
                  } else {
                    // For other errors, show a subtle indication but keep it more visible
                    target.style.opacity = '0.5';
                    target.style.filter = 'grayscale(70%)';
                    target.title = 'Failed to load image';
                  }
                }}
              />
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
