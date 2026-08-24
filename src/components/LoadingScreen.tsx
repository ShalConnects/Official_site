import React, { useEffect, useRef, useState } from 'react';

const BAR_CLASS = 'h-full bg-gradient-to-r from-green-500 via-green-400 to-orange-500 rounded-full transition-all duration-300 ease-out relative';
const SHIMMER = <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-loading" />;

interface LoadingScreenProps {
  variant?: 'full' | 'minimal' | 'inline';
  message?: string;
  onComplete?: () => void;
}

export default function LoadingScreen({ variant = 'full', message, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInline = variant === 'inline';
  const showProgress = variant === 'full' && typeof onComplete === 'function';

  useEffect(() => {
    if (!showProgress) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          completeTimerRef.current = setTimeout(() => onComplete?.(), 300);
          return 100;
        }
        const inc = prev < 70 ? 8 : prev < 90 ? 4 : 2;
        return Math.min(prev + inc, 100);
      });
    }, 50);
    return () => {
      clearInterval(interval);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, [showProgress, onComplete]);

  const label = showProgress ? (progress < 100 ? `Loading... ${progress}%` : 'Ready!') : 'Loading...';
  const progressBar = showProgress ? (
    <div className={BAR_CLASS} style={{ width: `${progress}%` }}>{SHIMMER}</div>
  ) : (
    <div className={`${BAR_CLASS} w-[40%] animate-loading-indeterminate`}>{SHIMMER}</div>
  );

  if (isInline) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-14 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div className={`${BAR_CLASS} w-[40%] animate-loading-indeterminate`} />
        </div>
        <p className="text-gray-500 text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      role="status"
      aria-live="polite"
      aria-busy={!isComplete}
    >
      <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 via-orange-500/10 to-green-500/10 rounded-full blur-3xl animate-spin-slow" />
        </div>
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-orange-500 animate-gradient-shift">
            ShalConnects
          </h1>
          <div className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-bold text-green-500/30 blur-xl animate-pulse" aria-hidden>ShalConnects</div>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-orange-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1s' }} />
          ))}
        </div>
        <div className="w-64 sm:w-80 md:w-96 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          {progressBar}
        </div>
        <p className="text-gray-400 text-sm font-medium">{message ?? label}</p>
      </div>
    </div>
  );
}
