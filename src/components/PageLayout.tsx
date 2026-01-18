import React from 'react';
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
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

