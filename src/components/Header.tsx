import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, MoreHorizontal, Home, Zap, Briefcase, Mail, ExternalLink } from 'lucide-react';
import Logo from './Logo';
import { isStoreContext } from '../utils/storeUtils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isStore = isStoreContext();

  // Don't show header on landing page (it has its own navigation)
  if (location.pathname === '/' && !isStore) {
    return null;
  }

  const mainNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'About', path: '/about', icon: null },
    { label: 'Testimonials', path: '/testimonials', icon: null },
    { label: 'Reviews', path: '/reviews', icon: null },
    { label: 'Blog', path: '/blog', icon: null },
    { label: 'Tools', path: '/tools', icon: null },
  ];

  const moreNavItems = [
    { label: 'Store', path: 'https://store.shalconnects.com', external: true, icon: ExternalLink },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo size={32} />
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-orange-500 bg-clip-text text-transparent">
              ShalConnects
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {Icon ? <Icon size={18} className="inline-block mr-2" /> : null}
                  {item.label}
                </Link>
              );
            })}
            {moreNavItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors flex items-center gap-2"
              >
                {item.label}
                {item.external && <ExternalLink size={14} />}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <MoreHorizontal size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-gray-900/98 backdrop-blur-md z-40 border-b border-gray-800 md:hidden">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="flex flex-col gap-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-orange-500 bg-orange-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {Icon && <Icon size={20} />}
                      {item.label}
                    </Link>
                  );
                })}
                <div className="mt-2 pt-2 border-t border-gray-800">
                  {moreNavItems.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      {item.label}
                      {item.external && <ExternalLink size={16} />}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
