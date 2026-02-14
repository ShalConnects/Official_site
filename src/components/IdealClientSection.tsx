import { CheckCircle } from 'lucide-react';

interface IdealClientSectionProps {
  serviceTitle: string;
  points: string[];
  color: string;
}

export function IdealClientSection({ serviceTitle, points, color }: IdealClientSectionProps) {
  if (!points?.length) return null;
  return (
    <section id="ideal-client" className="py-12 sm:py-16 md:py-20 relative bg-gray-800/30">
      <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ background: `linear-gradient(to right, transparent, ${color}50, transparent)` }} />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 lg:pr-8">
        <p className="text-gray-400 text-sm sm:text-base text-center mb-8">This {serviceTitle} service is perfect if:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {points.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-lg text-sm sm:text-base text-gray-200 border bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
              style={{ borderColor: `${color}40` }}
            >
              <CheckCircle size={20} style={{ color }} className="flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
