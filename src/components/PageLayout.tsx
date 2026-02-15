import React from 'react';
import Footer from './Footer';
import StoreTopBar from './StoreTopBar';
import { usePageTitle } from '../hooks/usePageTitle';
import { isStoreContext } from '../utils/storeUtils';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  usePageTitle(title);
  const isStore = isStoreContext();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {isStore && <StoreTopBar />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

