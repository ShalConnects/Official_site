import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from './Footer';
import StoreTopBar from './StoreTopBar';
import { usePageTitle } from '../hooks/usePageTitle';
import { isStoreContext } from '../utils/storeUtils';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  backTo?: { href: string; label: string };
}

export default function PageLayout({ children, title, backTo }: PageLayoutProps) {
  usePageTitle(title);
  const isStore = isStoreContext();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {isStore && <StoreTopBar />}
      <main className="flex-1">
        {backTo && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4">
            <Link to={backTo.href} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors" aria-label={backTo.label}>
              <ArrowLeft className="w-4 h-4" /> {backTo.label}
            </Link>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}

