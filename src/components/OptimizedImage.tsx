import React from 'react';
import { useImageError } from '../hooks/useImageError';
import { useImageDimensions } from '../hooks/useImageDimensions';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  onDimensionsDetected?: (isLong: boolean, aspectRatio: number) => void;
}

/**
 * Optimized image component with error handling and dimension detection
 * DRY: Centralized image loading logic with fallback and long-image detection
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  fallbackSrc = '/images/placeholder.svg', 
  onError: customOnError,
  onDimensionsDetected,
  className = '',
  ...props 
}: OptimizedImageProps) {
  const { error, src: errorSrc, onError } = useImageError(fallbackSrc);
  const { dimensions, onLoad } = useImageDimensions();

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onError();
    customOnError?.(e);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad(e);
    props.onLoad?.(e);
  };

  React.useEffect(() => {
    if (dimensions && onDimensionsDetected) {
      onDimensionsDetected(dimensions.isLong, dimensions.aspectRatio);
    }
  }, [dimensions, onDimensionsDetected]);

  return (
    <img
      src={errorSrc || src}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      className={`${className} ${error ? 'opacity-50' : ''}`}
      {...props}
    />
  );
}
