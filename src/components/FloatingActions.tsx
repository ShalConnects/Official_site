import { ArrowUp } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface FloatingActionsProps {
  show: boolean;
  onScrollToTop: () => void;
  scrollProgress?: number;
}

export default function FloatingActions({ show, onScrollToTop, scrollProgress = 0 }: FloatingActionsProps) {
  if (!show) return null;

  // Interpolate color based on scroll progress (orange to green)
  const getProgressColor = () => {
    const orange = { r: 218, g: 101, b: 30 };
    const green = { r: 23, g: 102, b: 65 };
    
    const r = Math.round(orange.r + (green.r - orange.r) * (scrollProgress / 100));
    const g = Math.round(orange.g + (green.g - orange.g) * (scrollProgress / 100));
    const b = Math.round(orange.b + (green.b - orange.b) * (scrollProgress / 100));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div 
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] flex items-center gap-2 transition-all duration-300"
      style={{
        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
      }}
    >
      {/* Theme Toggle with matching style */}
      <div className="relative w-10 h-10">
        <ThemeToggle className="absolute inset-0 bg-gradient-theme rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center p-0" />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/20" />
      
      {/* Back to Top with Progress Indicator */}
      <div className="relative w-12 h-12">
        {/* Circular Progress Border */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="48"
          height="48"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke={getProgressColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - scrollProgress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.2s ease-out' }}
          />
        </svg>
        
        <button
          onClick={onScrollToTop}
          className="absolute inset-0 m-auto bg-gradient-theme rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{ 
            width: '40px', 
            height: '40px',
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}
