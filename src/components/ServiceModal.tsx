import React from 'react';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubService {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  desc: string;
}

interface Service {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  desc: string;
  startingPrice?: string;
  subServices: SubService[];
}

interface ServiceModalProps {
  service: Service | null;
  categoryColor: string;
  onClose: () => void;
}

export default function ServiceModal({ service, categoryColor, onClose }: ServiceModalProps) {
  if (!service) return null;

  const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-gray-900 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-300" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: categoryColor }}
            >
              <service.icon size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{service.title}</h2>
              <p className="text-gray-400">{service.desc}</p>
            </div>
          </div>
          {service.startingPrice && (
            <div className="mt-4">
              <span className="text-sm text-gray-500">Starting at </span>
              <span className="text-xl font-bold" style={{ color: categoryColor }}>
                {service.startingPrice}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white mb-4" style={{ color: categoryColor }}>
            Services Include:
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {service.subServices.map((subService, idx) => (
              <div
                key={idx}
                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: categoryColor + '20' }}
                  >
                    <subService.icon size={20} style={{ color: categoryColor }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{subService.label}</h4>
                    <p className="text-gray-400 text-sm">{subService.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-gray-700 bg-gray-800/30">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/services/${serviceSlug}`}
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105"
              style={{ 
                backgroundColor: categoryColor,
              }}
            >
              View Full Page
              <ExternalLink size={18} />
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

