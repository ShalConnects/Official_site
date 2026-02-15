import { useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import PageContainer from '../components/PageContainer';
import CaseStudyCard from '../components/CaseStudyCard';
import { caseStudies, getFeaturedCaseStudies } from '../data/caseStudies';
import { useMetaTags } from '../hooks/useMetaTags';

export default function CaseStudiesPage() {
  const list = useMemo(() => {
    const featured = getFeaturedCaseStudies();
    const rest = caseStudies.filter((c) => !c.featured);
    return [...featured, ...rest];
  }, []);

  useMetaTags({
    title: 'Case Studies - ShalConnects',
    description: 'Real projects and results across WordPress, Shopify, eBay, and more.',
    ogTitle: 'Case Studies - ShalConnects',
    ogDescription: 'Real projects and results across WordPress, Shopify, eBay, and more.',
  });

  return (
    <PageLayout title="Case Studies - ShalConnects">
      <PageHero title="Case Studies" description="Real projects and results across WordPress, Shopify, eBay, and more." />
      <PageSection>
        <PageContainer>
          {list.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No case studies yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {list.map((c) => (
                <CaseStudyCard key={c.id} study={c} />
              ))}
            </div>
          )}
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
