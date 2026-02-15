import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '../data/caseStudies';

export default function CaseStudyCard({ study, compact }: { study: CaseStudy; compact?: boolean }) {
  const summary = study.results || study.challenge;
  const to = `/case-studies/${study.slug}`;
  if (compact) {
    return (
      <Link to={to} className="flex gap-2 sm:gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all group min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
          <img src={study.image || '/images/plugin/preview.png'} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white text-xs sm:text-sm group-hover:text-green-400 transition-colors line-clamp-2">{study.title}</h3>
          {summary && <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{summary}</p>}
        </div>
        <ArrowRight size={14} className="flex-shrink-0 text-green-400 self-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  }
  return (
    <Link to={to} className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 hover:shadow-xl transition-all duration-300 group block min-w-0">
      <div className="h-36 sm:h-40 bg-gray-800 flex items-center justify-center overflow-hidden">
        <img src={study.image || '/images/plugin/preview.png'} alt="" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
      <div className="p-4 sm:p-5">
        {study.clientName && <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">{study.clientName}</p>}
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">{study.title}</h3>
        {study.services.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2">
            {study.services.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-400 border border-green-500/30">{s}</span>
            ))}
          </div>
        )}
        {summary && <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-3">{summary}</p>}
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-green-400 group-hover:gap-2 transition-all">Read case study <ArrowRight size={14} className="sm:w-4 sm:h-4" /></span>
      </div>
    </Link>
  );
}
