import { useState, useCallback } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
  isLong: boolean;
  aspectRatio: number;
}

/**
 * Hook to detect image dimensions and if it's a "long" image
 * DRY: Centralized image dimension detection logic
 * @param threshold - Height to width ratio threshold (default 1.5)
 */
export function useImageDimensions(threshold = 1.5) {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);

  const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
      isLong: aspectRatio > threshold,
      aspectRatio,
    });
  }, [threshold]);

  return { dimensions, onLoad };
}
