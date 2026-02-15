import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageContainer from '../components/PageContainer';
import { getCaseStudyBySlug } from '../data/caseStudies';
import { workPortfolio } from '../data/workPortfolio';

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!study) return <Navigate to="/case-studies" replace />;

  const galleryWork = study.workIds?.length
    ? workPortfolio.filter((w) => study.workIds!.includes(w.id))
    : [];

  return (
    <PageLayout title={`${study.title} - Case Study | ShalConnects`}>
      <div className="min-h-screen bg-gray-900">
        <PageContainer className="py-8 sm:py-12">
          <Link to="/case-studies" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft size={18} /> Back to Case Studies
          </Link>
          {study.image && (
            <div className="rounded-xl overflow-hidden mb-8 border border-gray-700/50">
              <img src={study.image} alt={study.title} className="w-full h-64 sm:h-80 object-cover object-top" />
            </div>
          )}
          <div className="max-w-3xl">
            {study.clientName && <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{study.clientName}</p>}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{study.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {study.services.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">{s}</span>
              ))}
            </div>
            {study.challenge && (
              <section className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Challenge</h2>
                <p className="text-gray-300">{study.challenge}</p>
              </section>
            )}
            {study.solution && (
              <section className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Solution</h2>
                <p className="text-gray-300">{study.solution}</p>
              </section>
            )}
            {study.results && (
              <section className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Results</h2>
                <p className="text-gray-300">{study.results}</p>
              </section>
            )}
            {study.projectUrl && (
              <a href={study.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium text-sm">
                View project <ExternalLink size={16} />
              </a>
            )}
          </div>
          {galleryWork.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4">Project gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {galleryWork.map((w) => (
                  <img key={w.id} src={w.image} alt={w.title} className="rounded-lg border border-gray-700/50 w-full aspect-video object-cover" />
                ))}
              </div>
            </section>
          )}
        </PageContainer>
      </div>
    </PageLayout>
  );
}
