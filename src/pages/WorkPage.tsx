import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import PageContainer from '../components/PageContainer';
import WorkGrid from '../components/WorkGrid';
import { workPortfolio, getAllServices } from '../data/workPortfolio';
import { usePageScrolling } from '../components/LongScreenshotScroll';

export default function WorkPage() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const services = useMemo(() => getAllServices(), []);
  const isPageScrolling = usePageScrolling();

  const filteredWork = useMemo(() => {
    if (selectedServices.size === 0) return workPortfolio;
    return workPortfolio.filter(w => w.services.some(s => selectedServices.has(s)));
  }, [selectedServices]);

  const toggleService = (service: string) => {
    const next = new Set(selectedServices);
    next.has(service) ? next.delete(service) : next.add(service);
    setSelectedServices(next);
  };

  return (
    <PageLayout title="Our Work - ShalConnects">
      <PageHero title="Our Work" description="Explore our portfolio of projects across platforms and services." />
      <PageSection>
        <PageContainer>
          {services.length > 0 && (
            <div className="mb-8 p-4 sm:p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300">Filter by service</h3>
                {selectedServices.size > 0 && (
                  <button onClick={() => setSelectedServices(new Set())} className="text-xs text-green-500 hover:text-green-400 font-medium transition-colors">
                    Clear all ({selectedServices.size})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {services.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleService(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedServices.has(s)
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-105'
                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                    }`}
                  >
                    {s}
                    {selectedServices.has(s) && <X size={14} className="inline ml-1.5 -mr-0.5" />}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                {filteredWork.length === workPortfolio.length ? (
                  <>Showing all <span className="font-semibold text-white">{workPortfolio.length}</span> projects</>
                ) : (
                  <>Showing <span className="font-semibold text-white">{filteredWork.length}</span> of {workPortfolio.length} projects</>
                )}
              </p>
            </div>
          )}
          <WorkGrid images={filteredWork} isPageScrolling={isPageScrolling} />
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
