import { useState, useEffect } from 'react';
import { Download, Mail, Share2, ChevronUp, ChevronDown, Minus, ShoppingCart, X } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

interface TOCItem {
  id: string;
  label: string;
  level?: number;
}

interface PageSidebarProps {
  tocItems?: TOCItem[];
  downloadUrl?: string;
  purchaseAction?: () => void;
  purchaseLabel?: string;
  contactAction?: () => void;
  shareUrl?: string;
  categoryColor?: string;
  isVisible?: boolean;
  onToggle?: () => void;
}

export default function PageSidebar({ 
  tocItems = [], 
  downloadUrl,
  purchaseAction,
  purchaseLabel = 'Buy Pro Version',
  contactAction,
  shareUrl,
  categoryColor = '#176641',
  isVisible = true,
  onToggle
}: PageSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isTOCVisible, setIsTOCVisible] = useState<boolean>(true);
  const [isActionsExpanded, setIsActionsExpanded] = useState<boolean>(false);

  // Scroll spy: detect which section is currently in view
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.5, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible section
      let mostVisible: IntersectionObserverEntry | null = null;
      let maxRatio = 0;

      entries.forEach(entry => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisible = entry;
        }
      });

      // If we have a visible entry with sufficient ratio, use it
      if (mostVisible !== null && maxRatio >= 0.1) {
        const entry: IntersectionObserverEntry = mostVisible;
        if (entry.isIntersecting) {
          setActiveSection((entry.target as HTMLElement).id);
          return;
        }
      }
      
      // If no section is significantly visible, find the one closest to the top
      const scrollPosition = window.scrollY + 150; // Account for header offset
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(tocItems[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all TOC sections
    tocItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also handle scroll events for better accuracy
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let currentSection = '';

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(tocItems[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = tocItems[i].id;
          break;
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleShare = () => {
    if (navigator.share && shareUrl) {
      navigator.share({
        title: document.title,
        url: shareUrl
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl || window.location.href);
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl || window.location.href);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isVisible && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - Only for TOC */}
      <aside className={`fixed lg:sticky top-0 lg:top-24 left-0 h-screen lg:h-[calc(100vh-6rem)] z-50 lg:z-auto flex-shrink-0 transition-all duration-300 overflow-y-auto lg:overflow-y-auto ${
        isVisible ? 'w-64 lg:w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'
      } bg-gray-900 lg:bg-transparent border-r border-gray-800 lg:border-r-0`}>
        <div className={`sticky lg:sticky top-0 lg:top-24 p-3 sm:p-4 lg:p-0 space-y-4 sm:space-y-6 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-0'
      }`}>
        {/* Table of Contents */}
        {tocItems.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-700/50 overflow-hidden">
            <button
              onClick={() => setIsTOCVisible(!isTOCVisible)}
              className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-800/70 transition-colors"
              aria-expanded={isTOCVisible}
              aria-label="Toggle table of contents"
            >
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wide">
                Table of Contents
              </h3>
              <div className="flex items-center gap-2">
                {isTOCVisible ? (
                  <Minus size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                ) : (
                  <ChevronDown size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                )}
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isTOCVisible ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <nav className="space-y-0.5 sm:space-y-1" aria-label="Table of contents">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        // Close mobile sidebar after clicking
                        if (window.innerWidth < 1024 && onToggle) {
                          onToggle();
                        }
                      }}
                      className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                        activeSection === item.id
                          ? 'text-white font-semibold'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                      }`}
                      style={{
                        backgroundColor: activeSection === item.id ? `${categoryColor}25` : 'transparent',
                        borderLeft: activeSection === item.id ? `3px solid ${categoryColor}` : '3px solid transparent'
                      }}
                      aria-current={activeSection === item.id ? 'location' : undefined}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>

      {/* Floating Action Button (FAB) - Bottom Right */}
      <div className="fixed bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 z-50">
        {/* Expanded Menu */}
        {isActionsExpanded && (
          <div className="mb-2 sm:mb-3 bg-gray-800/95 backdrop-blur-md rounded-lg sm:rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden w-[180px] xs:w-[200px] sm:w-[220px] md:w-[240px] max-w-[calc(100vw-1.5rem)]">
            <div className="p-2.5 sm:p-3 md:p-3.5 space-y-1.5 sm:space-y-2">
              {/* Close Button */}
              <button
                onClick={() => setIsActionsExpanded(false)}
                className="w-full flex items-center justify-center px-2 py-1 sm:py-1.5 rounded text-[10px] sm:text-xs font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 transition-colors"
              >
                Close
              </button>
              
              <div className="space-y-1.5 sm:space-y-2">
                {/* Get Quote Action */}
                {contactAction && (
                  <button
                    onClick={() => {
                      contactAction();
                      setIsActionsExpanded(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs md:text-sm font-bold text-white transition-all duration-300 hover:scale-105 bg-gradient-theme"
                  >
                    <Mail size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="whitespace-nowrap">Get Your Quote</span>
                  </button>
                )}

                {/* Purchase/Download Actions */}
                {purchaseAction && (
                  <button
                    onClick={purchaseAction}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold text-white transition-all duration-300 hover:scale-105 bg-gradient-theme"
                  >
                    <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                    <span className="truncate">{purchaseLabel}</span>
                  </button>
                )}
                {downloadUrl && !purchaseAction && (
                  <a
                    href={downloadUrl}
                    download
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold text-white transition-all duration-300 hover:scale-105 bg-gradient-theme"
                  >
                    <Download size={14} className="sm:w-4 sm:h-4" />
                    Download
                  </a>
                )}

                {/* Contact Methods */}
                {contactAction && (
                  <div className="flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() => {
                        contactAction();
                        setIsActionsExpanded(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-gray-200 transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 border border-gray-700/50"
                    >
                      <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
                      Email
                    </button>
                    <a
                      href="https://wa.me/8801879729252"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-white transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <SiWhatsapp size={12} className="sm:w-3.5 sm:h-3.5" />
                      WhatsApp
                    </a>
                  </div>
                )}

                {/* Share & Back to Top */}
                <div className="pt-1.5 sm:pt-2 border-t border-gray-700/50 flex gap-1.5 sm:gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-gray-700/30"
                    style={{ color: categoryColor }}
                  >
                    <Share2 size={12} className="sm:w-3.5 sm:h-3.5" />
                    Share
                  </button>
                  <button
                    onClick={scrollToTop}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-gray-700/30"
                    style={{ color: categoryColor }}
                  >
                    <ChevronUp size={12} className="sm:w-3.5 sm:h-3.5" />
                    Top
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main FAB Button - Only show when menu is collapsed */}
        {!isActionsExpanded && (
          <button
            onClick={() => setIsActionsExpanded(true)}
            className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl bg-gradient-theme relative overflow-hidden group"
            style={{
              boxShadow: `0 8px 20px -5px ${categoryColor}50`
            }}
            aria-label="Open Quick Actions"
          >
            <Mail size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        )}
      </div>
    </>
  );
}

