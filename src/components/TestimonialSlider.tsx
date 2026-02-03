import React, { useState, useEffect } from 'react';
import { Quote, Star, CheckCircle, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { SiLinkedin, SiQuora } from 'react-icons/si';
import { ViewAllLink } from './ViewAllLink';
import type { Testimonial } from '../data/testimonials';

export interface TestimonialSliderProps {
  testimonials: Testimonial[];
  /** Accent color for quote icon and rings (e.g. service category color). Defaults to green. */
  accentColor?: string;
  /** Auto-advance to next testimonial. Default false. */
  autoPlay?: boolean;
  /** Pause auto-play on hover. Default true when autoPlay is true. */
  pauseOnHover?: boolean;
  /** Show "Featured Testimonials" heading. Default true. */
  showHeading?: boolean;
  /** Show "View All Testimonials" link. Default true. */
  showViewAll?: boolean;
  /** Extra class for the wrapper. */
  className?: string;
}

const DEFAULT_ACCENT = '#4a9d6f';

export function TestimonialSlider({
  testimonials,
  accentColor = DEFAULT_ACCENT,
  autoPlay = false,
  pauseOnHover = true,
  showHeading = true,
  showViewAll = true,
  className = '',
}: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (testimonials.length > 0 && currentIndex >= testimonials.length) {
      setCurrentIndex(0);
    }
  }, [testimonials.length, currentIndex]);

  useEffect(() => {
    if (!autoPlay || isPaused || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, isPaused, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];
  if (!current) return null;

  const accentStyle = { color: accentColor };

  return (
    <div className={className}>
      {showHeading && (
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2 text-white">
            Featured Testimonials
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 px-2">
            Hear from our clients about their experience
          </p>
        </div>
      )}

      <div
        className="mb-6 sm:mb-8 md:mb-12 lg:mb-16"
        onMouseEnter={() => autoPlay && pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => autoPlay && pauseOnHover && setIsPaused(false)}
      >
        <div
          key={currentIndex}
          className="group/hero bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl md:rounded-3xl border border-gray-800/50 relative overflow-hidden transition-all duration-700 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10 min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px] flex flex-col justify-center"
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 pointer-events-none transition-opacity duration-700 group-hover/hero:from-green-500/10 group-hover/hero:to-green-500/10" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
              <Quote
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 opacity-30 flex-shrink-0 transition-all duration-700 group-hover/hero:opacity-50 group-hover/hero:scale-110"
                style={accentStyle}
                aria-hidden
              />
              <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold leading-[1.5] sm:leading-[1.6] md:leading-[1.7] lg:leading-[1.8] italic flex-1 transition-colors duration-700 group-hover/hero:text-white px-1 sm:px-2 break-words text-gray-200">
                "{current.content}"
              </blockquote>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-800/50">
              {current.image && (
                <div className="relative flex-shrink-0">
                  <img
                    src={current.image}
                    alt={current.name}
                    loading="lazy"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-green-500/50 transition-all duration-700 group-hover/hero:ring-green-500/80 group-hover/hero:scale-110 group-hover/hero:shadow-lg group-hover/hero:shadow-green-500/30"
                  />
                  {current.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5 border-2 border-gray-900">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-0">
                  <p className="text-base sm:text-lg md:text-xl font-bold text-white transition-colors duration-700 group-hover/hero:text-green-400">
                    {current.name}
                  </p>
                  <div
                    className="flex items-center gap-0.5"
                    role="img"
                    aria-label={`Rating: ${current.rating} out of 5 stars`}
                  >
                    {[...Array(current.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-yellow-400 fill-yellow-400 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-500 group-hover/hero:scale-110"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                  <p className="text-xs sm:text-sm text-gray-400 transition-colors duration-700 group-hover/hero:text-gray-300">
                    {current.role}
                  </p>
                  {(current.linkedin || current.website || current.quora) && (
                    <>
                      <span className="text-gray-600 hidden sm:inline">•</span>
                      {current.linkedin && (
                        <a
                          href={current.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-400 hover:text-blue-400 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                          aria-label="LinkedIn profile"
                        >
                          <SiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      )}
                      {current.website && (
                        <a
                          href={current.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-400 hover:text-green-400 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                          aria-label="Website"
                        >
                          <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      )}
                      {current.quora && (
                        <a
                          href={current.quora}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-400 hover:text-red-400 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                          aria-label="Quora profile"
                        >
                          <SiQuora className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-green-500/50 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-green-500/50 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {showViewAll && testimonials.length > 1 && (
        <div className="mt-8 sm:mt-12 md:mt-16 text-center">
          <ViewAllLink to="/testimonials">View All Testimonials</ViewAllLink>
        </div>
      )}
    </div>
  );
}
