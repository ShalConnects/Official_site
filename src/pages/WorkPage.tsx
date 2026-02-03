import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import PageContainer from '../components/PageContainer';
import WorkGrid from '../components/WorkGrid';
import { workPortfolio, getAllServices, getWorkByService } from '../data/workPortfolio';

export default function WorkPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceFilter = searchParams.get('service') ?? '';

  const services = useMemo(() => getAllServices(), []);

  const filteredWork = useMemo(() => {
    if (!serviceFilter) return workPortfolio;
    return getWorkByService(serviceFilter);
  }, [serviceFilter]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ service: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <PageLayout title="Our Work - ShalConnects">
      <PageHero
        title="Our Work"
        description="Explore our portfolio of projects across platforms and services."
      />

      <PageSection>
        <PageContainer>
          {services.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <label htmlFor="work-service-filter" className="text-sm text-gray-400">
                Filter by service:
              </label>
              <select
                id="work-service-filter"
                value={serviceFilter}
                onChange={handleServiceChange}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All work</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
          <WorkGrid images={filteredWork} />
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
