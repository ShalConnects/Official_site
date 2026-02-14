import { useState, useCallback } from 'react';

/**
 * Custom hook for handling image loading errors with fallback
 * DRY: Centralized image error handling logic
 */
export function useImageError(fallbackSrc?: string) {
  const [error, setError] = useState(false);
  const [src, setSrc] = useState<string | undefined>(undefined);

  const onError = useCallback(() => {
    setError(true);
    if (fallbackSrc) setSrc(fallbackSrc);
  }, [fallbackSrc]);

  const reset = useCallback(() => {
    setError(false);
    setSrc(undefined);
  }, []);

  return { error, src, onError, reset };
}
