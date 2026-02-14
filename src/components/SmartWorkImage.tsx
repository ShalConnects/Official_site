import React, { useState } from 'react';
import LazyImage from './LazyImage';
import LongScreenshotScroll from './LongScreenshotScroll';

interface SmartWorkImageProps {
  src: string;
  alt: string;
  heightClass: string;
  className?: string;
  isPageScrolling?: boolean;
  forceLongScroll?: boolean; // Skip detection when explicitly set
  children?: React.ReactNode;
}

/**
 * Smart image component that auto-detects long images and applies scroll
 * DRY: Centralized logic for work image rendering with auto-scroll detection
 */
export default function SmartWorkImage({
  src,
  alt,
  heightClass,
  className = '',
  isPageScrolling = false,
  forceLongScroll = false,
  children,
}: SmartWorkImageProps) {
  const [isLong, setIsLong] = useState(forceLongScroll);
  const [showScroll, setShowScroll] = useState(forceLongScroll);

  const handleDimensions = (detected: boolean) => {
    if (forceLongScroll) return; // Skip detection when metadata is explicit
    setIsLong(detected);
    // Delay showing scroll container to prevent flash
    if (detected) setTimeout(() => setShowScroll(true), 100);
  };

  // Show placeholder while detecting
  if (isLong && !showScroll) {
    return (
      <div className={`relative flex items-center justify-center w-full bg-gray-900 ${heightClass} overflow-hidden`}>
        <LazyImage
          src={src}
          alt={alt}
          onDimensionsDetected={handleDimensions}
          className="w-full h-full object-contain opacity-0"
          skeleton={false}
        />
      </div>
    );
  }

  // Use scroll container for long images
  if (showScroll) {
    return (
      <LongScreenshotScroll src={src} alt={alt} heightClass={heightClass} isPageScrolling={isPageScrolling}>
        {children}
      </LongScreenshotScroll>
    );
  }

  // Regular image display
  return (
    <div className={`relative flex items-center justify-center w-full bg-gray-900 ${heightClass} overflow-hidden ${className}`}>
      <LazyImage
        src={src}
        alt={alt}
        onDimensionsDetected={handleDimensions}
        className="w-full h-full object-contain"
      />
      {children}
    </div>
  );
}
