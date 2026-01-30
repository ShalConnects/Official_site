import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          // Wait a bit before hiding to show completion
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        // Accelerate progress (starts fast, slows near end)
        const increment = prev < 70 ? 8 : prev < 90 ? 4 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center transition-opacity duration-500 ${
        isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Morphing shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 via-orange-500/10 to-green-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Logo/Text */}
        <div className="relative">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-orange-500 animate-gradient-shift">
            ShalConnects
          </h1>
          {/* Glow effect */}
          <div className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-bold text-green-500/30 blur-xl animate-pulse">
            ShalConnects
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-orange-500 animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 md:w-96 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-green-400 to-orange-500 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-loading"></div>
          </div>
        </div>

        {/* Progress Text */}
        <p className="text-gray-400 text-sm font-medium">
          {progress < 100 ? `Loading... ${progress}%` : 'Ready!'}
        </p>
      </div>
    </div>
  );
}
