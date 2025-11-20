import { useState, useEffect } from 'react';
import { Download, Mail, Share2, ChevronUp, ChevronDown, Minus, ShoppingCart } from 'lucide-react';
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
  const [isActionsVisible, setIsActionsVisible] = useState<boolean>(true);

  // Scroll spy: detect which section is currently in view
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all TOC sections
    tocItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
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
      
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 lg:top-24 left-0 h-screen lg:h-auto z-50 lg:z-auto flex-shrink-0 transition-all duration-300 overflow-y-auto lg:overflow-visible ${
        isVisible ? 'w-64 lg:w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'
      } bg-gray-900 lg:bg-transparent border-r border-gray-800 lg:border-r-0`}>
        <div className={`sticky lg:sticky top-0 lg:top-24 p-4 lg:p-0 space-y-6 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-0'
        }`}>
        {/* Table of Contents */}
        {tocItems.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <button
              onClick={() => setIsTOCVisible(!isTOCVisible)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
            >
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                Table of Contents
              </h3>
              <div className="flex items-center gap-2">
                {isTOCVisible ? (
                  <Minus size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isTOCVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-4 pb-4">
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === item.id
                          ? 'text-white font-medium'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                      style={{
                        backgroundColor: activeSection === item.id ? `${categoryColor}20` : 'transparent',
                        borderLeft: activeSection === item.id ? `3px solid ${categoryColor}` : '3px solid transparent'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <button
            onClick={() => setIsActionsVisible(!isActionsVisible)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Quick Actions
            </h3>
            <div className="flex items-center gap-2">
              {isActionsVisible ? (
                <Minus size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </div>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isActionsVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-4 pb-4 space-y-3">
              {purchaseAction && (
                <button
                  onClick={purchaseAction}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-all hover:scale-105"
                  style={{ backgroundColor: categoryColor }}
                >
                  <ShoppingCart size={18} />
                  {purchaseLabel}
                </button>
              )}
              {downloadUrl && !purchaseAction && (
                <a
                  href={downloadUrl}
                  download
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-all hover:scale-105"
                  style={{ backgroundColor: categoryColor }}
                >
                  <Download size={18} />
                  Download
                </a>
              )}

              {contactAction && (
                <>
                  <button
                    onClick={contactAction}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-all hover:scale-105"
                    style={{ backgroundColor: categoryColor }}
                  >
                    <Mail size={18} />
                    Contact Us
                  </button>
                  <a
                    href="https://wa.me/8801879729252"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-colors bg-gray-700 hover:bg-gray-600 border border-gray-600"
                  >
                    <SiWhatsapp size={18} />
                    WhatsApp
                  </a>
                </>
              )}

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-gray-300 transition-colors bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                onClick={scrollToTop}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-gray-300 transition-colors bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                <ChevronUp size={18} />
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

