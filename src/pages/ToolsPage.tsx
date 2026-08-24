import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageContainer from '../components/PageContainer';
import PageSection from '../components/PageSection';
import { useMetaTags } from '../hooks/useMetaTags';
import { toolsData } from '../data/toolsData';

const GRADIENT: Record<string, string> = { '#6366f1': 'from-indigo-500 to-purple-500', '#8b5cf6': 'from-purple-500 to-pink-500', '#06b6d4': 'from-cyan-500 to-blue-500', '#ec4899': 'from-pink-500 to-rose-500', '#14b8a6': 'from-teal-500 to-cyan-500', '#14a34a': 'from-green-500 to-emerald-500', '#10b981': 'from-emerald-500 to-green-500', '#059669': 'from-emerald-600 to-green-600', '#f59e0b': 'from-amber-500 to-orange-500', '#3b82f6': 'from-blue-500 to-indigo-500' };

export default function ToolsPage() {
  useMetaTags({
    title: 'Free Tools & Utilities | ShalConnects',
    description: 'Free utilities and tools crafted by ShalConnects to help you work smarter. AI Text Formatter, FitQuest fitness tracker, and more.',
    keywords: 'free tools, utilities, AI formatter, fitness tracker, productivity tools, online tools',
    ogTitle: 'Free Tools & Utilities - ShalConnects',
    ogDescription: 'Free utilities and tools to help you work smarter. AI Text Formatter, FitQuest, and more.',
    ogImage: '/logo.png',
    twitterTitle: 'Free Tools & Utilities - ShalConnects',
    twitterDescription: 'Free utilities and tools to help you work smarter.',
    twitterImage: '/logo.png'
  });

  return (
    <PageLayout title="Fun Project">
      <PageHero
        title="Fun Project"
        description={`${toolsData.length} free tools to help you work smarter`}
      />

      <PageSection>
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsData.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.route}
                  className="group bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-gray-600/50 hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${GRADIENT[tool.color] ? `bg-gradient-to-r ${GRADIENT[tool.color]}` : ''}`}
                      style={GRADIENT[tool.color] ? undefined : { backgroundColor: tool.color }}
                    >
                      <Icon size={24} className="text-white transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">
                          {tool.name}
                        </h3>
                        {tool.isNew && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-sm font-medium group-hover:gap-2 transition-all duration-300" style={{ color: tool.color }}>
                    <span>Use Tool</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty State (if no tools) */}
          {toolsData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No tools available yet. Check back soon!</p>
            </div>
          )}
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}

