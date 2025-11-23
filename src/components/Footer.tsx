import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { SiLinkedin, SiX, SiWhatsapp } from 'react-icons/si';

export default function Footer() {
  const yearsInBusiness = 8;
  
  return (
    <footer className="bg-gray-950 py-8 sm:py-10 md:py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Multi-column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info Column */}
          <div className="text-center sm:text-left">
            <div className="text-xl sm:text-2xl font-bold text-gradient-theme mb-2 sm:mb-3">
              ShalConnects
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              <span className="text-white font-medium">Connecting brands</span> with their audience through innovative digital solutions
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs">Since {new Date().getFullYear() - yearsInBusiness}</p>
          </div>

          {/* Contact Info Column */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:hello@shalconnects.com" 
                  className="text-gray-400 hover:text-green-400 text-xs sm:text-sm transition-colors flex items-center justify-center sm:justify-start gap-2"
                >
                  <Mail size={14} className="sm:w-4 sm:h-4" />
                  <span>hello@shalconnects.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/8801879729252" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 text-xs sm:text-sm transition-colors flex items-center justify-center sm:justify-start gap-2"
                >
                  <SiWhatsapp size={14} className="sm:w-4 sm:h-4" />
                  <span>+880 1879-729252</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Follow Us</h3>
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
              <a 
                href="https://www.linkedin.com/in/shalconnects/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <SiLinkedin size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
              <a 
                href="https://x.com/ShalConnects" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Twitter"
              >
                <SiX size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal Links */}
        <div className="border-t border-gray-800 pt-4 sm:pt-6 md:pt-8 mt-4 sm:mt-6 md:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4 text-center sm:text-left">
            <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">© {new Date().getFullYear()} ShalConnects. All rights reserved.</p>
            <div className="flex justify-center flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-gray-500 text-[10px] sm:text-xs md:text-sm">
              <Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-green-400 transition-colors">Terms</Link>
              <Link to="/refund" className="hover:text-green-400 transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

