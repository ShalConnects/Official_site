import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import PageContainer from '../components/PageContainer';
import { caseStudies } from '../data/caseStudies';

export default function CaseStudiesPage() {
  return (
    <PageLayout title="Case Studies - ShalConnects">
      <PageHero title="Case Studies" description="Real projects and results across WordPress, Shopify, eBay, and more." />
      <PageSection>
        <PageContainer>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((c) => (
              <Link
                key={c.id}
                to={`/case-studies/${c.slug}`}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-40 bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={c.image || '/images/plugin/preview.png'}
                    alt={c.title}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="p-5">
                  {c.clientName && <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{c.clientName}</p>}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{c.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{c.results || c.challenge}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-400 group-hover:gap-2 transition-all">
                    Read case study <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
