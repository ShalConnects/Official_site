import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  isNew?: boolean;
}

export default function ToolsPage() {
  const tools: Tool[] = [
    {
      id: 'ai-text-formatter',
      name: 'AI Text Formatter',
      description: 'Remove markdown formatting and convert AI-generated text to clean, human-readable format. Automatically detects and removes AI meta-commentary.',
      icon: Wand2,
      route: '/tools/ai-formatter',
      color: '#6366f1', // Indigo
      isNew: true
    }
    // Add more tools here as they are created
  ];

  return (
    <PageLayout title="Fun Project">
      {/* Header Section */}
      <section className="bg-gray-800/50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
            Fun Project
          </h1>
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
            Free utilities and tools crafted by <Link to="/" className="text-gradient-theme font-semibold hover:opacity-80 transition-opacity cursor-pointer inline-block">ShalConnects</Link> to help you work smarter
          </p>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.route}
                  className="group bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-gray-600/50 hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" 
                      style={{ backgroundColor: tool.color }}
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
          {tools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No tools available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

