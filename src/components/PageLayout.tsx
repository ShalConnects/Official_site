import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import { usePageTitle } from '../hooks/usePageTitle';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  usePageTitle(title);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Breadcrumbs />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

