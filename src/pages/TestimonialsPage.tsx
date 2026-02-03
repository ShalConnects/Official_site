import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star, CheckCircle, Globe, ArrowRight, Search } from 'lucide-react';
import { SiLinkedin, SiQuora } from 'react-icons/si';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageContainer from '../components/PageContainer';
import PageSection from '../components/PageSection';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { testimonials, type Testimonial } from '../data/testimonials';

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="group relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-gray-800/50 transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 break-inside-avoid mb-4 sm:mb-5 md:mb-6"
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 rounded-xl sm:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Quote className="w-5 h-5 sm:w-6 sm:h-6 opacity-30 flex-shrink-0" style={{ color: '#4a9d6f' }} aria-hidden="true" />
          <blockquote className="text-sm sm:text-base text-gray-300 leading-relaxed italic">
            "{testimonial.content}"
          </blockquote>
        </div>
        <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-gray-800/50">
          {testimonial.image && (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              loading="lazy"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-green-500/50 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-white truncate">{testimonial.name}</p>
              {testimonial.verified && (
                <span className="flex-shrink-0" title="Verified">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{testimonial.role}</p>
            <div className="flex items-center gap-1 mt-0.5" role="img" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
              ))}
            </div>
          </div>
          {(testimonial.linkedin || testimonial.website || testimonial.quora) && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {testimonial.linkedin && (
                <a
                  href={testimonial.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="LinkedIn profile"
                >
                  <SiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {testimonial.website && (
                <a
                  href={testimonial.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {testimonial.quora && (
                <a
                  href={testimonial.quora}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Quora profile"
                >
                  <SiQuora className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTestimonials = useMemo(() => {
    if (!searchQuery.trim()) return testimonials;
    const q = searchQuery.trim().toLowerCase();
    return testimonials.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <PageLayout title="Testimonials - ShalConnects">
      <PageHero
        title="Client Testimonials"
        description="Hear from the people I've worked with"
      />

      <PageSection>
        <PageContainer>
          {/* Same slider as landing and service pages */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <TestimonialSlider
              testimonials={testimonials}
              showHeading={true}
              showViewAll={false}
            />
          </div>

          {/* Search - useful when you have many testimonials */}
          <div className="mb-6 sm:mb-8">
            <label htmlFor="testimonials-search" className="sr-only">Search testimonials by name, role, or quote</label>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
              <input
                id="testimonials-search"
                type="search"
                placeholder="Search by name, role, or quote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                aria-label="Search testimonials"
              />
            </div>
            {searchQuery.trim() && (
              <p className="text-center text-sm text-gray-400 mt-2">
                {filteredTestimonials.length} result{filteredTestimonials.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Masonry-style layout (CSS columns) */}
          {filteredTestimonials.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 [column-gap:1.5rem]">
              {filteredTestimonials.map((t, idx) => (
                <TestimonialCard key={`${t.name}-${idx}`} testimonial={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 text-gray-400">
              <p className="text-lg">No testimonials match your search.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-green-400 hover:text-green-300 underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Back to home / featured */}
          <div className="mt-10 sm:mt-12 md:mt-16 text-center">
            <Link
              to="/#testimonials"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span>Back to Featured on Home</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
