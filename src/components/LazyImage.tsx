import React, { useEffect, useRef, useState } from 'react';
import OptimizedImage from './OptimizedImage';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  skeleton?: boolean;
  onDimensionsDetected?: (isLong: boolean, aspectRatio: number) => void;
}

/**
 * Lazy loading image with Intersection Observer and skeleton placeholder
 * DRY: Single source of truth for all lazy-loaded images across the app
 */
export default function LazyImage({
  src,
  alt,
  fallbackSrc,
  priority = false,
  skeleton = true,
  onDimensionsDetected,
  className = '',
  ...props
}: LazyImageProps) {
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {skeleton && !loaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
      {inView && (
        <OptimizedImage
          src={src}
          alt={alt}
          fallbackSrc={fallbackSrc}
          onDimensionsDetected={onDimensionsDetected}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      )}
    </div>
  );
}
