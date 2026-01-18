import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeroProps {
  title: string;
  description?: string;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkPath?: string;
  className?: string;
}

export default function PageHero({
  title,
  description,
  showBackLink = true,
  backLinkText = 'Back to Home',
  backLinkPath = '/',
  className = '',
}: PageHeroProps) {
  return (
    <div
      className={`relative py-16 sm:py-20 md:py-24 overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.2), rgba(17, 24, 39, 1), rgba(218, 101, 30, 0.15))',
      }}
    >
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(circle at 30% 50%, rgba(21, 102, 65, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(218, 101, 30, 0.3) 0%, transparent 50%)'
      }}></div>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {showBackLink && (
          <Link
            to={backLinkPath}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            <span>{backLinkText}</span>
          </Link>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 via-green-500 to-orange-500 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
