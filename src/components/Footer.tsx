import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { SiLinkedin, SiX, SiWhatsapp, SiYoutube } from 'react-icons/si';
import { isStoreContext } from '../utils/storeUtils';
import { useEffect } from 'react';

export default function Footer() {
  const startYear = new Date().getFullYear() - 8; // Calculate once
  const isStoreSubdomain = isStoreContext();
  
  // Add structured data for SEO
  useEffect(() => {
    const scriptId = 'shalconnects-structured-data';
    if (document.getElementById(scriptId)) return;
    
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ShalConnects',
      url: window.location.origin,
      email: 'hello@shalconnects.com',
      sameAs: [
        'https://www.linkedin.com/in/shalconnects/',
        'https://x.com/ShalConnects',
        'https://www.youtube.com/@ShalConnects'
      ]
    });
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);
  
  // Store subdomain footer - simpler, product-focused
  if (isStoreSubdomain) {
    return (
      <footer className="bg-gray-800 py-6 sm:py-8 md:py-10 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-5 sm:mb-6 md:mb-8" aria-label="Footer navigation">
            {/* Products Column */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm uppercase tracking-wider">Products</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link to="/store/variation-images-pro" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-xs sm:text-sm transition-colors inline-block">
                    Variation Images Pro
                  </Link>
                </li>
                <li>
                  <Link to="/store/notipress" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-xs sm:text-sm transition-colors inline-block">
                    Notipress
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-xs sm:text-sm transition-colors inline-block">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-xs sm:text-sm transition-colors inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-xs sm:text-sm transition-colors inline-block">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm uppercase tracking-wider">Support</h3>
              <address className="not-italic">
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="mailto:hello@shalconnects.com" 
                      aria-label="Send email to hello@shalconnects.com for support"
                      className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-sm transition-colors flex items-center justify-center sm:justify-start gap-2"
                    >
                      <Mail size={14} />
                      <span>Contact Support</span>
                    </a>
                  </li>
                </ul>
              </address>
            </div>
          </nav>

          {/* Bottom Section: Copyright & Social */}
          <div className="border-t border-gray-700 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              {/* Social Media Links */}
              <div className="flex items-center justify-center gap-3 sm:gap-4" aria-label="Social media links">
                <a 
                  href="https://www.linkedin.com/in/shalconnects/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin size={18} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://x.com/ShalConnects" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="Twitter"
                >
                  <SiX size={18} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://www.youtube.com/@ShalConnects" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="YouTube"
                >
                  <SiYoutube size={18} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
              {/* Copyright */}
              <p className="text-gray-500 text-[10px] xs:text-xs sm:text-xs md:text-sm text-center px-2">
                © {new Date().getFullYear()} ShalConnects. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  // Main site footer - original design
  return (
    <footer className="bg-gray-950 py-6 sm:py-8 md:py-10 lg:py-12 pb-[80px] md:pb-[90px] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Multi-column Layout */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-5 sm:mb-6 md:mb-8"
        >
          {/* Company Info Column */}
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gradient-theme mb-2 sm:mb-3">
                ShalConnects
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed max-w-xs sm:max-w-none mx-auto sm:mx-0">
                <span className="text-white font-medium">Connecting brands</span> with their audience through innovative digital solutions
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs">Since {startYear}</p>
            </div>

          {/* Contact Info Column */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Contact</h3>
            <address className="not-italic">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:hello@shalconnects.com" 
                    aria-label="Send email to hello@shalconnects.com"
                    className="text-gray-400 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-xs sm:text-sm transition-colors flex items-center justify-center sm:justify-start gap-2 break-all sm:break-normal"
                  >
                    <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate sm:truncate-none">hello@shalconnects.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/8801879729252" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Contact us on WhatsApp at +880 1879-729252"
                    className="text-gray-400 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 rounded text-xs sm:text-sm transition-colors flex items-center justify-center sm:justify-start gap-2"
                  >
                    <SiWhatsapp size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>+880 1879-729252</span>
                  </a>
                </li>
              </ul>
            </address>
          </div>

          {/* Social Media Column */}
          <div className="text-center sm:text-left lg:text-right lg:justify-self-end">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Follow Us</h3>
            <div className="flex items-center justify-center sm:justify-start lg:justify-end gap-3 sm:gap-4">
              <a 
                href="https://www.linkedin.com/in/shalconnects/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950"
                aria-label="LinkedIn"
              >
                <SiLinkedin size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
              <a 
                href="https://x.com/ShalConnects" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950"
                aria-label="Twitter"
              >
                <SiX size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
              <a 
                href="https://www.youtube.com/@ShalConnects" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950"
                aria-label="YouTube"
              >
                <SiYoutube size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal Links */}
        <div className="border-t border-gray-800 pt-4 sm:pt-5 md:pt-6 lg:pt-8 mt-4 sm:mt-5 md:mt-6 lg:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-5 text-center sm:text-left">
            <p className="text-gray-500 text-[10px] xs:text-xs sm:text-xs md:text-sm whitespace-nowrap">© {new Date().getFullYear()} ShalConnects. All rights reserved.</p>
            <nav aria-label="Footer legal links">
              <div className="flex justify-center flex-wrap gap-2 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-6 text-gray-500 text-[10px] xs:text-xs sm:text-xs md:text-sm">
                <Link to="/privacy" className="hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded px-1 transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded px-1 transition-colors">Terms</Link>
                <Link to="/refund" className="hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950 rounded px-1 transition-colors">Refund Policy</Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Large Background Logo Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-[150px] xs:min-h-[180px] sm:min-h-[200px] md:min-h-[250px]">
        {/* Subtle gradient overlay for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
          }}
        />
        
        {/* Large Background Logo */}
        <div className="relative pt-6 sm:pt-8 pb-0 flex items-center justify-center overflow-hidden w-full px-2 sm:px-4">
          <div className="text-center relative w-full">
            <span className="inline-block relative w-full break-words text-gray-800/40 dark:text-gray-700/40 brand-hero-text">
              ShalConnects
            </span>
          </div>
        </div>
        
        {/* Subtle fade overlay at top */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.4) 0%, transparent 30%, transparent 100%)',
          }}
        />
      </div>
    </footer>
  );
}

