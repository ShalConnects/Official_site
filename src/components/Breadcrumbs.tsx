import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  // Don't show breadcrumbs on landing page
  if (pathname === '/') {
    return null;
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    // Check if we're on the store subdomain
    const isStoreSubdomain = typeof window !== 'undefined' && window.location.hostname === 'store.shalconnects.com';
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';
    
    paths.forEach((path) => {
      currentPath += `/${path}`;
      
      // Format label: convert slug to readable text
      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Special handling for known paths
      if (path === 'services') {
        label = 'Services';
      } else if (path === 'tools') {
        label = 'Fun Project';
      } else if (path === 'ai-formatter') {
        label = 'AI Text Formatter';
      } else if (path === 'wordpress') {
        label = 'WordPress';
      } else if (path === 'plugins') {
        label = 'Plugins';
      } else if (path === 'variation-images-pro') {
        label = 'Variation Images Pro';
      }

      breadcrumbs.push({
        label,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-40" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li key={crumb.path} className="flex items-center">
                {index === 0 ? (
                  <Link
                    to={crumb.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Home size={16} />
                    <span className="sr-only">Home</span>
                  </Link>
                ) : (
                  <>
                    <ChevronRight size={16} className="text-gray-600 mx-2" />
                    {isLast ? (
                      <span className="text-white font-medium" aria-current="page">
                        {crumb.label}
                      </span>
                    ) : crumb.path === '/services' ? (
                      // Services is not a real page, so make it non-clickable
                      <span className="text-gray-400">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.path}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

