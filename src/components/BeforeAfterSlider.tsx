import { useState } from 'react';

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}

const imgClass = 'absolute inset-0 w-full h-full object-cover object-left-top';

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = 'Before', afterLabel = 'After', alt = 'Comparison' }: Props) {
  const [position, setPosition] = useState(50);
  return (
    <div className="w-full">
      <div className="relative w-full min-h-[85vh] rounded-xl overflow-hidden border border-gray-700/50 bg-gray-900">
        <img src={beforeSrc} alt={alt} className={imgClass} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <img src={afterSrc} alt="" className={imgClass} aria-hidden />
        </div>
        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 pointer-events-none" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-0.5">
            <div className="w-0.5 h-6 bg-white/90 rounded" /><div className="w-0.5 h-6 bg-white/90 rounded" />
          </div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="mt-3 w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-green-500"
        aria-label={`${beforeLabel} to ${afterLabel}`}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
