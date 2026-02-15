import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageContainer from '../components/PageContainer';
import { getCaseStudyBySlug, getPrevNext, getRelatedCaseStudies, toServiceSlug } from '../data/caseStudies';
import { workPortfolio } from '../data/workPortfolio';
import CaseStudyGallery from '../components/CaseStudyGallery';
import CaseStudyCard from '../components/CaseStudyCard';
import ContactModal from '../components/ContactModal';
import { useMetaTags } from '../hooks/useMetaTags';

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [showContactModal, setShowContactModal] = useState(false);
  const study = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!study) return <Navigate to="/case-studies" replace />;

  const galleryWork = study.workIds?.length ? workPortfolio.filter((w) => study.workIds!.includes(w.id)) : [];
  const { prev, next } = getPrevNext(study.slug);
  const related = getRelatedCaseStudies(study.slug, 3);

  useMetaTags({
    title: `${study.title} - Case Study | ShalConnects`,
    description: study.results || study.challenge || `${study.title} case study.`,
    ogTitle: `${study.title} - Case Study`,
    ogDescription: study.results || study.challenge || '',
    ogImage: study.image || undefined,
  });

  return (
    <PageLayout title={`${study.title} - Case Study | ShalConnects`}>
      <main className="min-h-screen bg-gray-900">
        <PageContainer className="py-8 sm:py-12">
          <nav className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm min-w-0">
            <Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft size={18} /> Case Studies
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300 truncate max-w-[12rem] sm:max-w-xs" title={study.title}>{study.title}</span>
          </nav>
          {study.image && (
            <div className="rounded-xl overflow-hidden mb-8 border border-gray-700/50">
              <img src={study.image} alt={study.title} className="w-full h-64 sm:h-80 object-cover object-center" />
            </div>
          )}
          <section className="w-full">
            {study.clientName && <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{study.clientName}</p>}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">{study.title}</h1>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {study.services.map((s) => (
                <Link key={s} to={`/services/${toServiceSlug(s)}`} className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors">
                  {s}
                </Link>
              ))}
            </div>
            {study.challenge && (
              <section className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Challenge</h2>
                <p className="text-sm sm:text-base text-gray-300">{study.challenge}</p>
              </section>
            )}
            {study.solution && (
              <section className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Solution</h2>
                <p className="text-sm sm:text-base text-gray-300">{study.solution}</p>
              </section>
            )}
            {study.results && (
              <section className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Results</h2>
                <p className="text-sm sm:text-base text-gray-300">{study.results}</p>
              </section>
            )}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {study.projectUrl && (
                <a href={study.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium text-sm">
                  View project <ExternalLink size={16} />
                </a>
              )}
              <button type="button" onClick={() => setShowContactModal(true)} className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors">Get a similar project →</button>
            </div>
          </section>
          {study.gallerySections?.length ? (
            <CaseStudyGallery mainImages={study.gallerySections[0].images} stripImages={study.gallerySections.slice(1).flatMap((s) => s.images)} />
          ) : null}
          {galleryWork.length > 0 && (
            <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700/50" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Project gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {galleryWork.map((w) => (
                  <img key={w.id} src={w.image} alt={w.title} className="rounded-lg border border-gray-700/50 w-full aspect-video object-cover" />
                ))}
              </div>
            </section>
          )}
          {(prev || next || related.length > 0) && (
            <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700/50 space-y-4 sm:space-y-6">
              {(prev || next) && (
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                  {prev ? <Link to={`/case-studies/${prev.slug}`} className="text-xs sm:text-sm text-gray-400 hover:text-white inline-flex items-center gap-1 min-w-0" title={prev.title}><ArrowLeft size={14} className="flex-shrink-0" /><span className="truncate">{prev.title}</span></Link> : <span />}
                  {next ? <Link to={`/case-studies/${next.slug}`} className="text-xs sm:text-sm text-gray-400 hover:text-white inline-flex items-center gap-1 min-w-0 sm:text-right" title={next.title}><span className="truncate">{next.title}</span><ArrowRight size={14} className="flex-shrink-0" /></Link> : <span />}
                </div>
              )}
              {related.length > 0 && (
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white mb-3">More case studies</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {related.map((c) => (
                      <CaseStudyCard key={c.id} study={c} compact />
                    ))}
                  </div>
                </div>
              )}
            </footer>
          )}
        </PageContainer>
      </main>
      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} title="Get a similar project" prefillService={study.title} />
    </PageLayout>
  );
}
