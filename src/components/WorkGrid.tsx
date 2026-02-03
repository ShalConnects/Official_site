import React from 'react';
import { WorkImage } from '../data/workPortfolio';
import { ExternalLink } from 'lucide-react';

interface WorkGridProps {
  images: WorkImage[];
  className?: string;
}

export default function WorkGrid({ images, className = '' }: WorkGridProps) {
  if (images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400">No work images available yet.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {images.map((work) => (
        <div
          key={work.id}
          className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-[1.02]"
        >
          <a
            href={work.projectUrl && work.projectUrl !== '#' ? work.projectUrl : undefined}
            target={work.projectUrl && work.projectUrl !== '#' ? '_blank' : undefined}
            rel={work.projectUrl && work.projectUrl !== '#' ? 'noopener noreferrer' : undefined}
            className={`block ${!(work.projectUrl && work.projectUrl !== '#') ? 'cursor-default' : ''}`}
            onClick={(e) => {
              if (!(work.projectUrl && work.projectUrl !== '#')) {
                e.preventDefault();
              }
            }}
          >
            <div className="relative flex items-center justify-center w-full h-[240px] sm:h-[280px] overflow-hidden bg-gray-900">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {work.services.length > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 text-white">
                    {work.services[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              {work.clientName && (
                <p className="text-xs text-gray-400 mb-0.5">{work.clientName}</p>
              )}
              <h3 className="text-base font-semibold text-white mb-1">{work.title}</h3>
              {work.description && (
                <p className="text-sm text-gray-300 line-clamp-2">{work.description}</p>
              )}
              {work.results && (
                <p className="text-sm font-medium text-white/90 mt-1">{work.results}</p>
              )}
              {work.quote && (
                <p className="text-xs text-gray-400 italic line-clamp-2 mt-1">"{work.quote}"</p>
              )}
              {work.projectUrl && work.projectUrl !== '#' && (
                <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                  View Project <ExternalLink size={12} />
                </p>
              )}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
