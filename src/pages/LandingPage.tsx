import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { X, Zap, Target, TrendingUp, Clock, CheckCircle, Star, Quote, ExternalLink, XCircle, ChevronDown, Palette, Code, Wrench, FileCode, Layout, Package, Store, List, Image, Smartphone, Globe, Share2, FileText, Layers, Home, Briefcase, MoreHorizontal, ArrowUp, ArrowRight, Mail, Search, Workflow, Rocket } from 'lucide-react';
import { SiWordpress, SiShopify, SiWix, SiEbay, SiAmazon, SiWalmart, SiAndroid, SiLinkedin, SiX, SiWhatsapp } from 'react-icons/si';
import Logo from '../components/Logo';

// Type definitions
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  colorIntensity: number;
}

interface ParticleConnection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  distance: number;
  opacity: number;
}

interface FormData {
  name: string;
  email: string;
  message: string;
  service: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  service?: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  color: string;
  description: string;
  results: string;
  services: string[];
}

interface Stats {
  projects: number;
  clients: number;
  years: number;
  satisfaction: number;
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const moreMenuCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '', service: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [_activeTab] = useState(0);
  const [activeServiceCard, setActiveServiceCard] = useState(0);
  const [visibleServiceCards, setVisibleServiceCards] = useState<Set<string>>(new Set());
  const [selectedProcessStep, setSelectedProcessStep] = useState<number | null>(null);
  const [activeProcessTab, setActiveProcessTab] = useState<'subSteps' | 'deliverables' | 'questions'>('subSteps');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const serviceCardRefs = useRef<Record<string, HTMLElement | null>>({});
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const hasScrolledToContactRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Stats counter animation
  const [stats, setStats] = useState<Stats>({ projects: 0, clients: 0, years: 0, satisfaction: 0 });
  const statsTarget: Stats = { projects: 150, clients: 200, years: 8, satisfaction: 98 };

  // Mouse position for interactive effects
  const [mousePosition, _setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement | null>(null);
  
  // Interactive particles state
  const [particles, _setParticles] = useState<Particle[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _particlesRef = useRef<Particle[]>([]);
  const [particleConnections, _setParticleConnections] = useState<ParticleConnection[]>([]);

  // Scroll progress and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      
      // Show back to top button after scrolling down 300px
      setShowBackToTop(currentScroll > 300);
      
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = (currentScroll / scrollableHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      
      // Determine active section
      const sections = ['home', 'services', 'process', 'work', 'testimonials', 'contact'];
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Stats counter animation
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const animate = (timestamp: number) => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setStats({
          projects: Math.floor(statsTarget.projects * easeOut),
          clients: Math.floor(statsTarget.clients * easeOut),
          years: Math.floor(statsTarget.years * easeOut),
          satisfaction: Math.floor(statsTarget.satisfaction * easeOut)
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final values are set
          setStats(statsTarget);
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Start animation when component mounts
    animateStats();
  }, []);

  // Hash navigation (for #contact)
  useEffect(() => {
    if (location.hash === '#contact' && !hasScrolledToContactRef.current) {
      const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const offset = 100;
          const elementPosition = contactSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          hasScrolledToContactRef.current = true;
        }
      };
      
      // Small delay to ensure DOM is ready
      setTimeout(scrollToContact, 100);
    } else if (location.hash !== '#contact') {
      hasScrolledToContactRef.current = false;
    }
  }, [location.hash]);

  // Pre-fill service from location state
  useEffect(() => {
    if (location.state?.prefillService) {
      setFormData(prev => ({
        ...prev,
        service: location.state.prefillService
      }));
      // Clear the state after using it
      navigate(location.pathname + location.search + location.hash, { replace: true, state: null });
    }
  }, [location.state, location.pathname, location.search, location.hash, navigate]);

  // Calculate dropdown position for More Menu
  useEffect(() => {
    if (isMoreMenuOpen && moreMenuRef.current) {
      const rect = moreMenuRef.current.getBoundingClientRect();
      // Position dropdown above the button (since it's at bottom of screen)
      // Estimate dropdown height: ~200px for 4 items
      const estimatedDropdownHeight = 200;
      // Position it closer to the button (smaller gap) to prevent mouse leave issues
      const topPosition = rect.top - estimatedDropdownHeight - 5; // 5px gap above button
      
      setDropdownPosition({
        top: Math.max(10, topPosition), // Ensure it doesn't go off top of screen
        left: rect.left
      });
    } else {
      setDropdownPosition({ top: 0, left: 0 });
    }
  }, [isMoreMenuOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (moreMenuCloseTimeoutRef.current) {
        clearTimeout(moreMenuCloseTimeoutRef.current);
      }
    };
  }, []);

  // Intersection Observer for visible sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = ['home', 'services', 'process', 'work', 'testimonials', 'contact'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Intersection Observer for service cards
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cardId = (entry.target as HTMLElement).dataset.cardId;
          if (cardId) {
            setVisibleServiceCards(prev => new Set(prev).add(cardId));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all service cards
    Object.values(serviceCardRefs.current).forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [activeServiceCard]);

  // Helper function: Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Form validation
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);
    // Form submission logic here
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', message: '', service: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Data arrays
  const serviceCategories = [
    {
      name: 'Platforms',
      icon: Zap,
      color: '#176641', // Brand Green
      services: [
        { 
          icon: SiWordpress, 
          title: 'WordPress', 
          desc: 'Complete WordPress solutions from design to maintenance',
          startingPrice: '$500',
          subServices: [
            { icon: Palette, label: 'WordPress Site Design', desc: 'Custom designs tailored to your brand' },
            { icon: Layout, label: 'Custom Theme', desc: 'Unique themes built from scratch' },
            { icon: Code, label: 'Making Plugins', desc: 'Custom plugin development' },
            { icon: Wrench, label: 'Site Maintenance', desc: 'Ongoing support & updates' },
            { icon: FileCode, label: 'Custom Script', desc: 'Tailored functionality solutions' }
          ]
        },
        { 
          icon: SiShopify, 
          title: 'Shopify', 
          desc: 'Professional Shopify store development and customization',
          startingPrice: '$800',
          subServices: [
            { icon: Palette, label: 'Site Design', desc: 'Beautiful, conversion-focused designs' },
            { icon: Layout, label: 'Custom Theme', desc: 'Branded themes for your store' },
            { icon: Package, label: 'Shopify App', desc: 'Custom app development' }
          ]
        },
        { 
          icon: SiWix, 
          title: 'Wix', 
          desc: 'Professional Wix website design and customization',
          startingPrice: '$400',
          subServices: [
            { icon: Palette, label: 'Wix Site Design', desc: 'Custom Wix website designs' },
            { icon: Layout, label: 'Wix Customization', desc: 'Tailored Wix site customization' },
            { icon: Wrench, label: 'Wix Maintenance', desc: 'Ongoing Wix site support' }
          ]
        }
      ]
    },
    {
      name: 'E-commerce',
      icon: TrendingUp,
      color: '#da651e', // Orange
      services: [
        { 
          icon: SiEbay, 
          title: 'eBay', 
          desc: 'Complete eBay store management and optimization',
          startingPrice: '$300',
          subServices: [
            { icon: Store, label: 'eBay Store Management', desc: 'Complete store optimization' },
            { icon: List, label: 'eBay Listing', desc: 'Professional product listings' },
            { icon: Layout, label: 'eBay Template', desc: 'Custom store templates' },
            { icon: Palette, label: 'eBay Store Redesign', desc: 'Modern store makeovers' }
          ]
        },
        { 
          icon: SiAmazon, 
          title: 'Amazon', 
          desc: 'Amazon store management and enhanced content creation',
          startingPrice: '$350',
          subServices: [
            { icon: Store, label: 'Amazon Store Management', desc: 'Full store optimization' },
            { icon: List, label: 'Amazon Listing', desc: 'Optimized product listings' },
            { icon: Image, label: 'Amazon Graphics & A+ Content', desc: 'Enhanced visual content' }
          ]
        },
        { 
          icon: SiWalmart, 
          title: 'Walmart', 
          desc: 'Complete Walmart marketplace management and optimization',
          startingPrice: '$300',
          subServices: [
            { icon: Store, label: 'Walmart Store Management', desc: 'Complete store optimization' },
            { icon: List, label: 'Walmart Listing', desc: 'Professional product listings' }
          ]
        }
      ]
    },
    {
      name: 'Development',
      icon: Target,
      color: '#3b82f6', // Blue
      services: [
        { 
          icon: Code, 
          title: 'Custom Site', 
          desc: 'Bespoke web applications built with modern technologies',
          startingPrice: '$1,500',
          subServices: [
            { icon: Globe, label: 'Custom Build Site', desc: 'React, Next.js & modern frameworks' },
            { icon: Layout, label: 'Frontend Development', desc: 'React, Vue, Angular interfaces' },
            { icon: Code, label: 'Backend Development', desc: 'Server-side APIs and logic' },
            { icon: FileCode, label: 'API Development', desc: 'RESTful APIs and integrations' },
            { icon: Wrench, label: 'Maintenance & Support', desc: 'Ongoing updates and support' }
          ]
        },
        { 
          icon: SiAndroid, 
          title: 'Android App', 
          desc: 'Mobile app development from web conversion to native apps',
          startingPrice: '$2,000',
          subServices: [
            { icon: Smartphone, label: 'Web to App', desc: 'Convert your website to app' },
            { icon: Code, label: 'Scratch to App', desc: 'Native app development' },
            { icon: Wrench, label: 'App Maintenance', desc: 'Ongoing support and updates' },
            { icon: TrendingUp, label: 'App Store Optimization', desc: 'ASO and listing optimization' },
            { icon: Palette, label: 'App UI/UX Design', desc: 'Interface design services' },
            { icon: Globe, label: 'App Integration', desc: 'API and third-party integrations' }
          ]
        }
      ]
    },
    {
      name: 'Design',
      icon: Palette,
      color: '#a855f7', // Purple
      services: [
        { 
          icon: Palette, 
          title: 'Brand Identity', 
          desc: 'Complete branding packages for your business',
          startingPrice: '$600',
          subServices: [
            { icon: Palette, label: 'Logo Design', desc: 'Custom logo creation' },
            { icon: Image, label: 'Banner Design', desc: 'Professional banner graphics' },
            { icon: Target, label: 'Brand Guidelines', desc: 'Complete brand style guides' },
            { icon: Layout, label: 'Color & Typography', desc: 'Brand color palettes and fonts' },
            { icon: Package, label: 'Brand Assets', desc: 'Complete brand asset packages' }
          ]
        },
        { 
          icon: Share2, 
          title: 'Social Media Graphics', 
          desc: 'All social media assets and graphics',
          startingPrice: '$200',
          subServices: [
            { icon: Image, label: 'Social Posts', desc: 'Custom social media posts' },
            { icon: Layout, label: 'Stories & Covers', desc: 'Social stories and cover graphics' },
            { icon: TrendingUp, label: 'Social Ads', desc: 'Social media advertising graphics' }
          ]
        },
        { 
          icon: FileText, 
          title: 'Print Design', 
          desc: 'Business cards, flyers, brochures and more',
          startingPrice: '$150',
          subServices: [
            { icon: Layout, label: 'Business Cards', desc: 'Professional business card design' },
            { icon: Image, label: 'Flyers & Brochures', desc: 'Marketing flyers and brochures' },
            { icon: Package, label: 'Posters & Banners', desc: 'Print posters and banners' }
          ]
        },
        { 
          icon: Layers, 
          title: 'Web Graphics', 
          desc: 'Icons, illustrations, and UI elements',
          startingPrice: '$250',
          subServices: [
            { icon: Code, label: 'Icon Design', desc: 'Custom icon sets' },
            { icon: Image, label: 'Illustrations', desc: 'Custom illustrations and graphics' },
            { icon: Layout, label: 'UI Elements', desc: 'Web interface elements' }
          ]
        }
      ]
    }
  ];

  // Process steps data
  const processSteps = [
    {
      icon: Search,
      title: 'Discovery & Strategy',
      timeline: '1 week',
      desc: 'We start by understanding your business, goals, and target audience.',
      subSteps: ['Initial consultation', 'Market research', 'Strategy development', 'Project planning'],
      deliverables: ['Project brief', 'Strategy document', 'Timeline', 'Budget estimate'],
      keyQuestions: ['What are your main goals?', 'Who is your target audience?', 'What is your budget?']
    },
    {
      icon: Workflow,
      title: 'Design & Development',
      timeline: '2 weeks',
      desc: 'We create and build your solution with attention to detail.',
      subSteps: ['Design mockups', 'Client review', 'Development', 'Testing'],
      deliverables: ['Design files', 'Working prototype', 'Test results', 'Documentation'],
      keyQuestions: ['What design style do you prefer?', 'Any specific features needed?', 'Timeline expectations?']
    },
    {
      icon: CheckCircle,
      title: 'Review & Refinement',
      timeline: '3-4 days',
      desc: 'We review, test, and refine your solution based on your feedback.',
      subSteps: ['Quality assurance', 'Client feedback', 'Revisions', 'Final approval'],
      deliverables: ['Test reports', 'Feedback summary', 'Revised deliverables', 'Approval sign-off'],
      keyQuestions: ['Any changes needed?', 'Does it meet your expectations?', 'Ready for launch?']
    },
    {
      icon: Rocket,
      title: 'Launch & Support',
      timeline: 'Support: Ongoing',
      desc: 'We launch your project and provide ongoing support.',
      subSteps: ['Final testing', 'Launch', 'Training', 'Support'],
      deliverables: ['Live project', 'Training materials', 'Support plan', 'Maintenance schedule'],
      keyQuestions: ['What support level do you need?', 'Training requirements?', 'Maintenance preferences?']
    }
  ];

  // Projects data
  const projects: Project[] = [
    {
      id: 1,
      title: 'E-commerce Platform',
      category: 'Web Development',
      color: 'from-purple-500 to-pink-500',
      description: 'A modern e-commerce platform with advanced features.',
      results: '300% increase in sales',
      services: ['WordPress', 'WooCommerce', 'Custom Development']
    },
    {
      id: 2,
      title: 'Brand Identity',
      category: 'Design',
      color: 'from-green-500 to-emerald-500',
      description: 'Complete brand identity package for a tech startup.',
      results: '50% brand recognition increase',
      services: ['Brand Identity', 'Logo Design', 'Brand Guidelines']
    },
    {
      id: 3,
      title: 'Mobile App',
      category: 'Development',
      color: 'from-blue-500 to-cyan-500',
      description: 'Native mobile app for iOS and Android.',
      results: '100K+ downloads',
      services: ['Android App', 'UI/UX Design', 'App Store Optimization']
    },
    {
      id: 4,
      title: 'Shopify Store',
      category: 'E-commerce',
      color: 'from-orange-500 to-red-500',
      description: 'Custom Shopify store with unique design.',
      results: '200% conversion rate increase',
      services: ['Shopify', 'Custom Theme', 'Site Design']
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'John Doe',
      role: 'CEO, TechFlow Inc',
      content: 'ShalConnects transformed our online presence. The team is professional, creative, and delivers on time.',
      rating: 5
    },
    {
      name: 'Jane Smith',
      role: 'Founder, GreenEarth',
      content: 'Outstanding work! They understood our vision and brought it to life beautifully.',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Director, UrbanStyle',
      content: 'The best investment we made. Our sales increased significantly after the redesign.',
      rating: 5
    }
  ];

  // All services (flattened from categories)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _allServices = serviceCategories.flatMap(category => 
    category.services.map(service => ({
      ...service,
      category: category.name,
      categoryColor: category.color
    }))
  );
  
  // Component return statement
  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-theme transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bottom-20 bg-gray-900/98 backdrop-blur-md z-40 overflow-y-auto md:hidden transform transition-transform duration-300 ease-out">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Home', id: 'home' },
                  { label: 'Services', id: 'services' },
                  { label: 'Process', id: 'process' },
                  { label: 'Work', id: 'work' },
                  { label: 'Contact', id: 'contact' }
                ]
                .filter((item) => {
                  // Only show items that are NOT in the bottom navigation bar
                  const bottomBarItems = ['home', 'services', 'contact'];
                  return !bottomBarItems.includes(item.id);
                })
                .map((item) => {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-4 px-4 py-4 rounded-lg text-left transition-all duration-200 touch-manipulation min-h-[56px]"
                      style={{ 
                        color: activeSection === item.id ? '#da651e' : '#ffffff',
                        backgroundColor: activeSection === item.id ? 'rgba(218, 101, 30, 0.1)' : 'transparent'
                      }}
                      onMouseEnter={(e) => activeSection !== item.id && (e.currentTarget.style.backgroundColor = 'rgba(74, 157, 111, 0.1)')}
                      onMouseLeave={(e) => activeSection !== item.id && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span className="text-lg font-medium">{item.label}</span>
                      {activeSection === item.id && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#da651e' }} />
                      )}
                    </button>
                  );
                })}
                
                {/* More Section */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">More</div>
                  {[
                    { label: 'About Us', id: 'about', action: 'scroll' },
                    { label: 'Meet the Team', id: 'team', action: 'scroll' },
                    { label: 'Blog', id: 'blog', action: 'scroll' },
                    { label: 'Tools', id: 'tools', action: 'navigate', route: '/tools' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.action === 'navigate' && item.route) {
                          navigate(item.route);
                        } else {
                          scrollToSection(item.id);
                        }
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-lg text-left text-gray-400 hover:text-white hover:bg-gray-800/50 active:bg-gray-800/70 transition-colors duration-150 touch-manipulation min-h-[56px]"
                    >
                      <span className="text-lg font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Quick Actions Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom md:hidden">
        <div className="max-w-7xl mx-auto px-2">
          <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50 rounded-t-2xl shadow-2xl">
            <div className="flex items-center justify-around gap-1 py-2.5">
              {/* Home */}
              <button
                onClick={() => scrollToSection('home')}
                className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-200 touch-manipulation min-h-[44px]"
                style={{ color: activeSection === 'home' ? '#da651e' : '#4a9d6f' }}
                onMouseEnter={(e) => activeSection !== 'home' && (e.currentTarget.style.color = '#da651e')}
                onMouseLeave={(e) => activeSection !== 'home' && (e.currentTarget.style.color = '#4a9d6f')}
                aria-label="Home"
              >
                <Home size={20} />
                {activeSection === 'home' && (
                  <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#da651e' }} />
                )}
              </button>

              {/* Services */}
              <button
                onClick={() => scrollToSection('services')}
                className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-200 touch-manipulation min-h-[44px]"
                style={{ color: activeSection === 'services' ? '#da651e' : '#4a9d6f' }}
                onMouseEnter={(e) => activeSection !== 'services' && (e.currentTarget.style.color = '#da651e')}
                onMouseLeave={(e) => activeSection !== 'services' && (e.currentTarget.style.color = '#4a9d6f')}
                aria-label="Services"
              >
                <Zap size={20} />
                {activeSection === 'services' && (
                  <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#da651e' }} />
                )}
              </button>

              {/* Book a Call - Prominent */}
              <a
                href="https://calendly.com/hello-shalconnects/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-full transition-all duration-300 touch-manipulation min-h-[44px]"
                style={{
                  background: 'linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.6)) padding-box, linear-gradient(to right, #176641, #da651e) border-box',
                  border: '2px solid transparent'
                }}
              >
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full z-20">FREE</span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">Book Call</span>
              </a>

              {/* Contact */}
              <button
                onClick={() => scrollToSection('contact')}
                className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-200 touch-manipulation min-h-[44px]"
                style={{ color: activeSection === 'contact' ? '#da651e' : '#4a9d6f' }}
                onMouseEnter={(e) => activeSection !== 'contact' && (e.currentTarget.style.color = '#da651e')}
                onMouseLeave={(e) => activeSection !== 'contact' && (e.currentTarget.style.color = '#4a9d6f')}
                aria-label="Contact"
              >
                <Mail size={20} />
                {activeSection === 'contact' && (
                  <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#da651e' }} />
                )}
              </button>

              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-200 touch-manipulation min-h-[44px]"
                style={{ color: isMenuOpen ? '#da651e' : '#4a9d6f' }}
                onMouseEnter={(e) => !isMenuOpen && (e.currentTarget.style.color = '#da651e')}
                onMouseLeave={(e) => !isMenuOpen && (e.currentTarget.style.color = '#4a9d6f')}
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X size={20} />
                ) : (
                  <MoreHorizontal size={20} />
                )}
                {isMenuOpen && (
                  <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#da651e' }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home" 
        ref={(el) => {
          sectionRefs.current.home = el;
          heroRef.current = el as HTMLDivElement | null;
        }}
        className="min-h-[600px] sm:min-h-[700px] md:min-h-[80vh] flex items-start justify-center relative overflow-hidden pt-4 sm:pt-6 md:pt-8"
      >
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br" style={{ background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.2), rgba(17, 24, 39, 1), rgba(218, 101, 30, 0.2))' }}></div>
        
        {/* Interactive Gradient Mesh */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.2) 0%, transparent 40%),
              radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Interactive Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Particle Connections */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            style={{ pointerEvents: 'none' }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {particleConnections.map((connection, index) => (
              <line
                key={index}
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke="url(#particleGradient)"
                strokeWidth="0.1"
                opacity={connection.opacity}
                style={{ transition: 'opacity 0.2s ease-out' }}
              />
            ))}
            <defs>
              <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(34, 197, 94, 0.6)" />
                <stop offset="100%" stopColor="rgba(249, 115, 22, 0.4)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Particles with Enhanced Visuals */}
          {particles.map((particle) => {
            const greenIntensity = 0.6 * particle.colorIntensity;
            const orangeIntensity = 0.4 * particle.colorIntensity;
            
            return (
              <div
                key={particle.id}
                className="absolute rounded-full transition-all duration-75 ease-out"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  background: `radial-gradient(circle, rgba(34, 197, 94, ${greenIntensity}) 0%, rgba(249, 115, 22, ${orangeIntensity}) 50%, transparent 100%)`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${particle.size * 2}px rgba(34, 197, 94, ${0.3 * particle.colorIntensity}), 0 0 ${particle.size * 3}px rgba(249, 115, 22, ${0.2 * particle.colorIntensity})`,
                  filter: `brightness(${1 + (particle.colorIntensity - 1) * 0.3})`,
                }}
              />
            );
          })}
        </div>
        
        {/* Animated Particle/Geometric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`,
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse transition-transform duration-300 ease-out"
            style={{
              animationDelay: '1s',
              transform: `translate(${(mousePosition.x - 50) * -0.15}px, ${(mousePosition.y - 50) * -0.15}px)`,
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-500/5 rounded-full blur-3xl animate-pulse transition-transform duration-300 ease-out"
            style={{
              animationDelay: '2s',
              transform: `translate(calc(-50% + ${(mousePosition.x - 50) * 0.05}px), calc(-50% + ${(mousePosition.y - 50) * 0.05}px))`,
            }}
          ></div>
          
          {/* Floating Geometric Shapes */}
          <div 
            className="hidden sm:block absolute top-32 right-32 w-16 sm:w-20 h-16 sm:h-20 border-2 border-green-500/20 rounded-lg rotate-45 animate-float transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.2}px, ${(mousePosition.y - 50) * 0.2}px) rotate(45deg)`,
            }}
          ></div>
          <div 
            className="absolute bottom-40 left-8 sm:left-24 w-12 sm:w-16 h-12 sm:h-16 border-2 border-orange-500/20 rounded-full animate-float transition-transform duration-300 ease-out"
            style={{
              animationDelay: '1.5s',
              transform: `translate(${(mousePosition.x - 50) * -0.25}px, ${(mousePosition.y - 50) * -0.25}px)`,
            }}
          ></div>
          <div 
            className="hidden md:block absolute top-1/3 right-1/4 w-12 h-12 bg-green-500/10 rounded-lg rotate-12 animate-float transition-transform duration-300 ease-out"
            style={{
              animationDelay: '2.5s',
              transform: `translate(${(mousePosition.x - 50) * 0.15}px, ${(mousePosition.y - 50) * 0.15}px) rotate(12deg)`,
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Column - Visual Element */}
            <div className="relative flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="relative w-full flex flex-col items-center justify-center pt-4 pb-0 sm:pt-6 sm:pb-6 lg:pt-8 lg:pb-8">
                {/* Main Visual Container */}
                <div className="relative flex items-center justify-center w-full mb-4 sm:mb-6 lg:mb-8">
                  {/* Large Logo/Icon Display */}
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                    {/* Glowing Background Circle */}
                    <div className="absolute inset-0 rounded-full blur-3xl animate-pulse" style={{ background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.2), rgba(218, 101, 30, 0.2))' }}></div>
                    
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 border-2 rounded-full animate-spin-slow" style={{ borderColor: 'rgba(21, 102, 65, 0.2)' }}></div>
                    <div className="absolute inset-4 border-2 rounded-full animate-spin-slow-reverse" style={{ animationDuration: '20s', borderColor: 'rgba(218, 101, 30, 0.2)' }}></div>
                    
                    {/* Center Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative z-10 transform hover:scale-110 transition-transform duration-500">
                        <Logo size={120} className="sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] drop-shadow-2xl" />
                      </div>
                    </div>

                    {/* Floating Elements Around Logo */}
                    <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-green-500/10 border border-green-500/30 rounded-xl rotate-12 animate-float"></div>
                    <div className="absolute -bottom-2 sm:-bottom-4 right-4 sm:right-6 md:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-500/10 border border-orange-500/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 -left-4 sm:-left-6 md:-left-8 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-500/10 border border-green-500/30 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 -right-4 sm:-right-6 md:-right-8 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-orange-500/10 border border-orange-500/30 rounded-lg -rotate-45 animate-float" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full blur-2xl" style={{ background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.1), transparent)' }}></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full blur-2xl" style={{ background: 'linear-gradient(to top right, rgba(218, 101, 30, 0.1), transparent)' }}></div>
                
                {/* Badge and Stats at Bottom */}
                <div className="relative flex flex-col items-center gap-3 sm:gap-4 lg:gap-5 z-20 w-full px-2 sm:px-0">
                  {/* Badge with Star Ratings */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full backdrop-blur-sm animate-fade-in transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.7s', backgroundColor: 'rgba(21, 102, 65, 0.15)', border: '1px solid rgba(21, 102, 65, 0.4)' }}>
                    <span className="text-xs sm:text-sm md:text-base font-semibold" style={{ color: '#4a9d6f' }}>A Leading Agency</span>
                    <div className="w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 rounded-full animate-pulse" style={{ backgroundColor: '#4a9d6f' }}></div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className="text-[10px] sm:text-xs md:text-sm text-yellow-400 font-semibold">4.9</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={8} 
                            className="sm:w-[10px] sm:h-[10px] text-yellow-400 fill-yellow-400" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="hidden lg:grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl backdrop-blur-sm animate-fade-in transition-all duration-300 hover:border-opacity-40" style={{ animationDelay: '0.9s', backgroundColor: 'rgba(17, 24, 39, 0.4)', border: '1px solid rgba(21, 102, 65, 0.2)' }}>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-theme">
                        {stats.projects}+
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-theme">
                        {stats.clients}+
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-theme">
                        {stats.satisfaction}%
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="text-center lg:text-left flex flex-col justify-center relative">
              {/* Option 6: Subtle AI Indicator */}
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 lg:-top-4 lg:-right-4 opacity-60 animate-fade-in z-10" style={{ animationDelay: '0.15s' }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-theme rounded-full blur-md opacity-50 animate-pulse"></div>
                  <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(218, 101, 30, 0.2)', border: '1px solid rgba(218, 101, 30, 0.4)' }}>
                    <Zap size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" style={{ color: '#da651e' }} />
                  </div>
                </div>
              </div>
              
              {/* Main Headline with Animation */}
              <h1 className="font-extrabold mb-4 sm:mb-6" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', lineHeight: '1.1' }}>
                  <span className="block text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    We Connect
                  </span>
                  <span className="block bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.2s', background: 'linear-gradient(to right, #4a9d6f, #da651e, #4a9d6f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Brands With
                  </span>
                  <span className="block bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.3s', background: 'linear-gradient(to right, #4a9d6f, #da651e, #4a9d6f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Their Audience
            </span>
          </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-300 mb-3 sm:mb-4 md:mb-5 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Strategic digital agency crafting unforgettable experiences that drive growth and inspire action
          </p>

              {/* Option 4: Small Tag Below Subheadline */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8 text-[10px] sm:text-xs md:text-sm animate-fade-in px-2 sm:px-0" style={{ animationDelay: '0.45s' }}>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full" style={{ backgroundColor: 'rgba(218, 101, 30, 0.1)', border: '1px solid rgba(218, 101, 30, 0.3)' }}>
                  <Zap size={10} className="sm:w-3 sm:h-3" style={{ color: '#da651e' }} />
                  <span style={{ color: '#da651e' }}>AI-Powered</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full" style={{ backgroundColor: 'rgba(21, 102, 65, 0.1)', border: '1px solid rgba(21, 102, 65, 0.3)' }}>
                  <TrendingUp size={10} className="sm:w-3 sm:h-3" style={{ color: '#4a9d6f' }} />
                  <span style={{ color: '#4a9d6f' }}>Data-Driven</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full" style={{ backgroundColor: 'rgba(21, 102, 65, 0.1)', border: '1px solid rgba(21, 102, 65, 0.3)' }}>
                  <Target size={10} className="sm:w-3 sm:h-3" style={{ color: '#4a9d6f' }} />
                  <span style={{ color: '#4a9d6f' }}>Results-Focused</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center lg:justify-start animate-fade-in px-2 sm:px-0" style={{ animationDelay: '0.5s' }}>
          <a
            href="https://calendly.com/hello-shalconnects/30min"
            target="_blank"
            rel="noopener noreferrer"
                  className="group bg-gradient-theme px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-xs sm:text-base md:text-lg font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 w-auto max-w-fit self-center sm:self-auto"
                  style={{ boxShadow: '0 0 0 rgba(21, 102, 65, 0)' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(21, 102, 65, 0.5)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 rgba(21, 102, 65, 0)'}
          >
            Start Your Project
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform w-3 h-3 sm:w-5 sm:h-5" size={20} />
          </a>
        </div>

              {/* Quick Stats - Mobile Only */}
              <div className="lg:hidden grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl backdrop-blur-sm animate-fade-in transition-all duration-300 hover:border-opacity-40 mt-4 sm:mt-6" style={{ animationDelay: '0.9s', backgroundColor: 'rgba(17, 24, 39, 0.4)', border: '1px solid rgba(21, 102, 65, 0.2)' }}>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-theme">
                    {stats.projects}+
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-theme">
                    {stats.clients}+
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-theme">
                    {stats.satisfaction}%
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services" 
        ref={(el) => (sectionRefs.current.services = el)}
        className="bg-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">
          <div className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ${
            visibleSections.has('services') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">Our Services</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 px-2">Comprehensive solutions for modern brands</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6 sm:mb-8 px-2">
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700 p-0.5 sm:p-1 overflow-x-auto scrollbar-hide max-w-full">
              {serviceCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveServiceCard(idx)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                      idx === activeServiceCard
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                    style={idx === activeServiceCard ? { backgroundColor: category.color } : {}}
                  >
                    <Icon size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Container */}
          {serviceCategories.map((category, categoryIdx) => {
              const isActive = activeServiceCard === categoryIdx;
              
              return (
                <div
                  key={categoryIdx}
                  className={`transition-opacity duration-500 ease-in-out ${
                    isActive ? 'opacity-100 block' : 'opacity-0 hidden'
                  }`}
                >
                  <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-gray-700 w-full shadow-2xl">
                        {/* Services Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 justify-items-center">
                    {category.services.map((service, serviceIdx) => {
                      const cardId = `service-${categoryIdx}-${serviceIdx}`;
                      const isCardVisible = visibleServiceCards.has(cardId);
                      return (
                      <div
                        key={serviceIdx}
                        ref={(el) => {
                          if (el) serviceCardRefs.current[cardId] = el;
                        }}
                        data-card-id={cardId}
                        onClick={() => {
                          const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '-');
                          navigate(`/services/${serviceSlug}`);
                        }}
                        className="group bg-gray-800/50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-gray-700/50 transition-all duration-300 w-full max-w-sm hover:border-gray-600/50 cursor-pointer hover:scale-105"
                        style={{
                          opacity: isCardVisible ? 1 : 0,
                          transform: isCardVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                          transitionDelay: `${serviceIdx * 100}ms`,
                          transformStyle: 'preserve-3d',
                          '--category-color': category.color,
                        } as React.CSSProperties}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: category.color }}>
                            <service.icon size={20} className="sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-semibold text-white">{service.title}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1" style={{ lineHeight: '1rem' }}>{service.desc}</p>
                          </div>
                        </div>
                        <div className="pt-2 sm:pt-3 border-t border-gray-700/50">
                          <p className="text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2" style={{ color: '#4a9d6f' }}>Services Include:</p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {service.subServices.map((subService, subIdx) => (
                              <div
                                key={subIdx}
                                className="group/sub relative inline-flex items-center gap-1 sm:gap-1.5 bg-gray-800 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 border border-gray-700/50"
                              >
                                <subService.icon size={8} className="sm:w-[10px] sm:h-[10px] flex-shrink-0" style={{ color: '#4a9d6f' }} />
                                <span className="text-gray-300 text-[10px] sm:text-xs font-medium">
                                  {subService.label}
                                </span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/sub:block sm:group-hover/sub:block bg-gray-900 border border-gray-700 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-xl z-10 min-w-[140px] sm:min-w-[180px] max-w-[180px] sm:max-w-[220px] pointer-events-none">
                                  <p className="text-[10px] sm:text-xs text-gray-300 text-center leading-relaxed">{subService.desc}</p>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-gray-700"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pb-12 sm:pb-16 md:pb-20"></div>
      </section>

      {/* Process Section */}
      <section 
        id="process" 
        ref={(el) => (sectionRefs.current.process = el)}
        className="py-12 sm:py-16 md:py-20 relative"
        style={{ 
          background: 'linear-gradient(to bottom, transparent, rgba(21, 102, 65, 0.03))'
        }}
      >
        {/* Subtle Top Border */}
        <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
          background: 'linear-gradient(to right, transparent, rgba(21, 102, 65, 0.5), rgba(218, 101, 30, 0.5), transparent)'
        }}></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            visibleSections.has('process') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">Our Process</h2>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4 font-semibold text-xs sm:text-sm md:text-base relative overflow-hidden" style={{ 
              background: 'linear-gradient(to right, rgba(21, 102, 65, 0.25), rgba(218, 101, 30, 0.25))',
              border: '2px solid transparent',
              boxShadow: '0 2px 8px rgba(21, 102, 65, 0.3), 0 0 0 1px rgba(218, 101, 30, 0.2)'
            }}>
              <div className="absolute inset-0 bg-gradient-theme opacity-20"></div>
              <Clock size={12} className="relative z-10 sm:w-3 sm:h-3 md:w-4 md:h-4" style={{ color: '#da651e' }} />
              <span className="relative z-10 text-white" style={{ 
                fontWeight: '600'
              }}>From Vision to Launch in 1 Month</span>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-2">A streamlined approach that delivers results fast</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative">
            {processSteps.map((step, idx) => {
              return (
                <div
                  key={idx}
                  className={`relative transition-all duration-1000 mt-4 mb-12 sm:mt-0 sm:mb-0 ${
                    visibleSections.has('process') 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${idx * 200}ms` }}
                >
                  <div 
                    className="cursor-pointer group transition-all duration-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 hover:bg-gray-800/30 relative"
                    onClick={() => {
                      setSelectedProcessStep(idx);
                      setActiveProcessTab('subSteps');
                    }}
                  >
                    {/* Icon and Timeline */}
                    <div className="text-center">
                      <div className="bg-gradient-theme-diagonal w-14 h-14 sm:w-16 sm:h-16 md:w-[4.5rem] md:h-[4.5rem] lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 relative z-10 shadow-lg group-hover:scale-110 transition-transform" style={{ boxShadow: '0 10px 15px -3px rgba(21, 102, 65, 0.5)' }}>
                        <step.icon size={20} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                      </div>
                      <div className="inline-flex items-center gap-0.5 sm:gap-1 md:gap-1.5 px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-0.5 md:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold mb-1.5 sm:mb-2 md:mb-3" style={{ backgroundColor: 'rgba(218, 101, 30, 0.15)', border: '1px solid rgba(218, 101, 30, 0.3)', color: '#da651e' }}>
                        <Clock size={8} className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                        <span>{step.timeline}</span>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-1.5 md:mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 md:mb-3 leading-relaxed px-1">{step.desc}</p>
                      <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm" style={{ color: '#4a9d6f' }}>
                        <span>View Details</span>
                        <ArrowRight size={10} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                      </div>
                    </div>
                  </div>
                  {/* Arrow Pointer to Next Step */}
                  {idx < processSteps.length - 1 && (
                    <>
                      {/* Mobile/Tablet: Bottom Arrow - Centered in gap-4 (1rem gap, so 0.5rem from each card) */}
                      <div className="flex sm:hidden absolute left-1/2 items-center justify-center z-20" style={{ 
                        top: 'calc(100% + 0.5rem)',
                        transform: 'translateX(-50%) translateY(-50%)'
                      }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ 
                          background: 'linear-gradient(to right, rgba(21, 102, 65, 0.2), rgba(218, 101, 30, 0.2))',
                          border: '1px solid rgba(21, 102, 65, 0.4)'
                        }}>
                          <ArrowRight size={14} className="rotate-90" style={{ color: '#4a9d6f' }} />
                        </div>
                      </div>
                      {/* Desktop sm: Right Arrow - Centered in gap-6 (1.5rem gap, so 0.75rem from each card) */}
                      <div className="hidden sm:flex lg:hidden absolute top-1/2 items-center justify-center z-10" style={{ 
                        left: 'calc(100% + 0.75rem)',
                        transform: 'translateY(-50%) translateX(-50%)'
                      }}>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ 
                          background: 'linear-gradient(to right, rgba(21, 102, 65, 0.2), rgba(218, 101, 30, 0.2))',
                          border: '1px solid rgba(21, 102, 65, 0.4)'
                        }}>
                          <ArrowRight size={14} className="sm:w-4 sm:h-4" style={{ color: '#4a9d6f' }} />
                        </div>
                      </div>
                      {/* Desktop lg: Right Arrow - Centered in gap-8 (2rem gap, so 1rem from each card) */}
                      <div className="hidden lg:flex absolute top-1/2 items-center justify-center z-10" style={{ 
                        left: 'calc(100% + 1rem)',
                        transform: 'translateY(-50%) translateX(-50%)'
                      }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ 
                          background: 'linear-gradient(to right, rgba(21, 102, 65, 0.2), rgba(218, 101, 30, 0.2))',
                          border: '1px solid rgba(21, 102, 65, 0.4)'
                        }}>
                          <ArrowRight size={16} className="w-4 h-4" style={{ color: '#4a9d6f' }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Step Modal */}
      {selectedProcessStep !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProcessStep(null)}
        >
          <div 
            className="bg-gray-900 rounded-xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden border flex flex-col mx-2 sm:mx-4"
            style={{ borderColor: 'rgba(21, 102, 65, 0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const step = processSteps[selectedProcessStep];
              return (
                <>
                  {/* Modal Header */}
                  <div className="bg-gray-900/95 backdrop-blur-sm border-b p-3 sm:p-4 md:p-5 flex items-center justify-between flex-shrink-0 gap-2" style={{ borderColor: 'rgba(21, 102, 65, 0.3)' }}>
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="bg-gradient-theme-diagonal w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 4px 12px rgba(21, 102, 65, 0.4)' }}>
                        <step.icon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{step.title}</h2>
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold mt-0.5 sm:mt-1" style={{ backgroundColor: 'rgba(218, 101, 30, 0.15)', border: '1px solid rgba(218, 101, 30, 0.3)', color: '#da651e' }}>
                          <Clock size={9} className="sm:w-2.5 sm:h-2.5" />
                          <span>{step.timeline}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProcessStep(null)}
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <X size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </button>
                  </div>

                  {/* Description */}
                  <div className="px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3 flex-shrink-0">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b px-2 sm:px-3 md:px-4 lg:px-5 flex-shrink-0 overflow-x-auto scrollbar-hide" style={{ borderColor: 'rgba(21, 102, 65, 0.3)' }}>
                    <button
                      onClick={() => setActiveProcessTab('subSteps')}
                      className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex-shrink-0 ${
                        activeProcessTab === 'subSteps' 
                          ? 'text-gray-200' 
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                      style={{ 
                        borderBottomColor: activeProcessTab === 'subSteps' ? '#4a9d6f' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <List size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span>Steps</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveProcessTab('deliverables')}
                      className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex-shrink-0 ${
                        activeProcessTab === 'deliverables' 
                          ? 'text-gray-200' 
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                      style={{ 
                        borderBottomColor: activeProcessTab === 'deliverables' ? '#da651e' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <FileText size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span>Deliverables</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveProcessTab('questions')}
                      className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex-shrink-0 ${
                        activeProcessTab === 'questions' 
                          ? 'text-gray-200' 
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                      style={{ 
                        borderBottomColor: activeProcessTab === 'questions' ? '#da651e' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Target size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span>Questions</span>
                      </div>
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5">
                    {activeProcessTab === 'subSteps' && (
                      <ul className="space-y-2 sm:space-y-2.5">
                        {step.subSteps.map((subStep, subIdx) => (
                          <li key={subIdx} className="text-xs sm:text-sm md:text-base text-gray-300 flex items-start gap-2 sm:gap-2.5">
                            <CheckCircle size={14} className="sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" style={{ color: '#4a9d6f' }} />
                            <span>{subStep}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeProcessTab === 'deliverables' && (
                      <ul className="space-y-2 sm:space-y-2.5">
                        {step.deliverables.map((deliverable, delIdx) => (
                          <li key={delIdx} className="text-xs sm:text-sm md:text-base text-gray-300 flex items-start gap-2 sm:gap-2.5">
                            <CheckCircle size={14} className="sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" style={{ color: '#da651e' }} />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeProcessTab === 'questions' && (
                      <ul className="space-y-2 sm:space-y-2.5">
                        {step.keyQuestions.map((question, qIdx) => (
                          <li key={qIdx} className="text-xs sm:text-sm md:text-base text-gray-300 flex items-start gap-2 sm:gap-2.5">
                            <span className="text-[10px] sm:text-xs md:text-sm font-bold mt-0.5 flex-shrink-0" style={{ color: '#da651e' }}>Q{qIdx + 1}:</span>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Portfolio Section */}
      <section 
        id="work" 
        ref={(el) => (sectionRefs.current.work = el)}
        className="py-12 sm:py-16 md:py-20 relative"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(218, 101, 30, 0.03), transparent)'
        }}
      >
        {/* Subtle Top Border */}
        <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
          background: 'linear-gradient(to right, transparent, rgba(218, 101, 30, 0.5), rgba(21, 102, 65, 0.5), transparent)'
        }}></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            visibleSections.has('work') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">Featured Work</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-2">Projects we're proud of</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`group relative h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-1000 ${
                  visibleSections.has('work') 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 transform group-hover:translate-y-0 translate-y-4 transition-transform">
                  <p className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">{project.category}</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{project.title}</h3>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs sm:text-sm">View Details</span>
                    <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" size={16} />
                  </div>
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:rotate-12">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border"
            style={{ borderColor: 'rgba(21, 102, 65, 0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 p-8" style={{ background: selectedProject.color }}>
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="mt-12">
                <p className="text-sm text-white/80 mb-2">{selectedProject.category}</p>
                <h2 className="text-4xl font-bold text-white">{selectedProject.title}</h2>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Project Overview</h3>
              <p className="text-gray-400 mb-6">{selectedProject.description}</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Key Results</h4>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(21, 102, 65, 0.1)', border: '1px solid rgba(21, 102, 65, 0.3)' }}>
                  <p className="font-semibold" style={{ color: '#7ab896' }}>{selectedProject.results}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Services Provided</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section 
        id="stats" 
        className="py-12 sm:py-16 md:py-20"
        style={{ background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.2), rgba(218, 101, 30, 0.2))' }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-theme mb-1 sm:mb-2">
                {stats.projects}+
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 px-1">Projects Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-theme mb-1 sm:mb-2">
                {stats.clients}+
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 px-1">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-theme mb-1 sm:mb-2">
                {stats.years}+
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 px-1">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-theme mb-1 sm:mb-2">
                {stats.satisfaction}%
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 px-1">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        ref={(el) => (sectionRefs.current.testimonials = el)}
        className="py-12 sm:py-16 md:py-20 relative"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(21, 102, 65, 0.05), rgba(218, 101, 30, 0.03))'
        }}
      >
        {/* Subtle Top Border */}
        <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
          background: 'linear-gradient(to right, transparent, rgba(21, 102, 65, 0.5), rgba(218, 101, 30, 0.5), transparent)'
        }}></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            visibleSections.has('testimonials') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">What Clients Say</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-2">Testimonials from our amazing partners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`bg-gray-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-800 transition-all duration-500 hover:transform hover:scale-105 transition-all duration-1000 ${
                  visibleSections.has('testimonials') 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${idx * 150}ms`,
                  borderColor: '#1f2937'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(21, 102, 65, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1f2937'}
              >
                <Quote className="mb-3 sm:mb-4 w-6 h-6 sm:w-8 sm:h-8" size={32} style={{ color: '#4a9d6f' }} />
                <div className="flex mb-3 sm:mb-4 gap-0.5 sm:gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400 w-3 h-3 sm:w-4 sm:h-4" size={16} />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="text-sm sm:text-base font-semibold">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        ref={(el) => (sectionRefs.current.contact = el)}
        className="py-20 relative"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(218, 101, 30, 0.05), rgba(21, 102, 65, 0.03))'
        }}
      >
        {/* Subtle Top Border */}
        <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
          background: 'linear-gradient(to right, transparent, rgba(218, 101, 30, 0.5), rgba(21, 102, 65, 0.5), transparent)'
        }}></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            visibleSections.has('contact') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">Let's Connect</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-2">Ready to elevate your brand?</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className={`flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8 mb-8 sm:mb-12 transition-all duration-1000 ${
              visibleSections.has('contact') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <a 
                href="https://wa.me/8801879729252" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-gray-900 border border-gray-800 transition-all hover:transform hover:scale-105 text-gray-400 hover:text-white w-full sm:w-auto"
                style={{ borderColor: '#1f2937' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(218, 101, 30, 0.5)';
                  e.currentTarget.style.color = '#da651e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1f2937';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                <SiWhatsapp size={20} className="sm:w-6 sm:h-6 flex-shrink-0" style={{ color: '#da651e' }} />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] sm:text-xs text-gray-500">WhatsApp</span>
                  <span className="font-semibold text-sm sm:text-base truncate">+880 1879-729252</span>
                </div>
              </a>
              <a 
                href="mailto:hello@shalconnects.com" 
                className="flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-gray-900 border border-gray-800 transition-all hover:transform hover:scale-105 text-gray-400 hover:text-white w-full sm:w-auto"
                style={{ borderColor: '#1f2937' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(21, 102, 65, 0.5)';
                  e.currentTarget.style.color = '#4a9d6f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1f2937';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                <Mail size={20} className="sm:w-6 sm:h-6 flex-shrink-0" style={{ color: '#4a9d6f' }} />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] sm:text-xs text-gray-500">Email</span>
                  <span className="font-semibold text-sm sm:text-base truncate">hello@shalconnects.com</span>
                </div>
              </a>
            </div>

            {/* Divider with text */}
            <div className={`flex flex-col items-center gap-3 mb-8 transition-all duration-1000 ${
              visibleSections.has('contact') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <p className="text-sm text-gray-500 font-medium">Or, use the form below to reach us</p>
              <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>

            <div className={`p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl border transition-all duration-1000 ${
              visibleSections.has('contact') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`} style={{ background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.2), rgba(218, 101, 30, 0.2))', borderColor: 'rgba(21, 102, 65, 0.3)' }}>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base focus:outline-none transition-colors ${
                        formErrors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-700'
                      }`}
                      onFocus={(e) => !formErrors.name && (e.currentTarget.style.borderColor = '#176641')}
                      onBlur={(e) => !formErrors.name && (e.currentTarget.style.borderColor = '#374151')}
                    />
                    {formErrors.name && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center">
                        <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base focus:outline-none transition-colors ${
                        formErrors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-700'
                      }`}
                      onFocus={(e) => !formErrors.email && (e.currentTarget.style.borderColor = '#176641')}
                      onBlur={(e) => !formErrors.email && (e.currentTarget.style.borderColor = '#374151')}
                    />
                    {formErrors.email && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center">
                        <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative" ref={serviceDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsServiceDropdownOpen(!isServiceDropdownOpen);
                      } else if (e.key === 'ArrowDown' && !isServiceDropdownOpen) {
                        e.preventDefault();
                        setIsServiceDropdownOpen(true);
                        setHoveredServiceIndex(0);
                      }
                    }}
                    className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl py-3 sm:py-4 pr-10 sm:pr-12 text-left text-sm sm:text-base focus:outline-none transition-all duration-200 border-gray-700 text-white cursor-pointer hover:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 ${
                      formData.service ? 'pl-8 sm:pl-10' : 'pl-4 sm:pl-6'
                    }`}
                    style={{
                      backgroundImage: formData.service ? 'none' : 'linear-gradient(to right, rgba(21, 102, 65, 0.05), rgba(218, 101, 30, 0.05))',
                    }}
                    onMouseEnter={(e) => {
                      if (document.activeElement !== e.currentTarget) {
                        e.currentTarget.style.borderColor = '#4b5563';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (document.activeElement !== e.currentTarget) {
                        e.currentTarget.style.borderColor = formData.service ? '#4a9d6f' : '#374151';
                      }
                    }}
                  >
                    <span className={formData.service ? 'text-white' : 'text-gray-400'}>
                      {formData.service || 'Select a Service (Optional)'}
                    </span>
                  </button>
                  <ChevronDown 
                    size={20} 
                    className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ${
                      isServiceDropdownOpen ? 'rotate-180' : ''
                    }`}
                    style={{ 
                      color: formData.service ? '#4a9d6f' : '#9ca3af',
                    }}
                  />
                  {formData.service && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  )}
                  
                  {/* Dropdown Menu */}
                  {isServiceDropdownOpen && (
                    <div 
                      className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto scrollbar-hide animate-fade-in-down"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsServiceDropdownOpen(false);
                          setHoveredServiceIndex(null);
                        }
                      }}
                      tabIndex={-1}
                    >
                      <div className="py-2">
                        {serviceCategories.map((category, categoryIdx) => (
                          <div key={category.name}>
                            <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-800/50 sticky top-0">
                              {category.name}
                            </div>
                            {category.services.map((service, serviceIdx) => {
                              const index = categoryIdx * 100 + serviceIdx;
                              const serviceValue = `${category.name} - ${service.title}`;
                              const isSelected = formData.service === serviceValue;
                              return (
                                <button
                                  key={serviceValue}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, service: serviceValue }));
                                    setIsServiceDropdownOpen(false);
                                    setHoveredServiceIndex(null);
                                  }}
                                  onMouseEnter={() => setHoveredServiceIndex(index)}
                                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition-colors ${
                                    isSelected 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : hoveredServiceIndex === index
                                      ? 'bg-gray-800 text-white'
                                      : 'text-gray-300 hover:bg-gray-800/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isSelected && <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />}
                                    <span className="truncate">{service.title}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                        <div className="border-t border-gray-700 mt-2">
                          <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-800/50">
                            Other
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, service: 'General Inquiry' }));
                              setIsServiceDropdownOpen(false);
                              setHoveredServiceIndex(null);
                            }}
                            onMouseEnter={() => setHoveredServiceIndex(999)}
                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition-colors ${
                              formData.service === 'General Inquiry'
                                ? 'bg-green-500/20 text-green-400' 
                                : hoveredServiceIndex === 999
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-300 hover:bg-gray-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {formData.service === 'General Inquiry' && <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />}
                              <span className="truncate">General Inquiry</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your project"
                    className={`w-full bg-gray-900 border rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base focus:outline-none transition-colors resize-none ${
                      formErrors.message 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-700'
                    }`}
                    onFocus={(e) => !formErrors.message && (e.currentTarget.style.borderColor = '#176641')}
                    onBlur={(e) => !formErrors.message && (e.currentTarget.style.borderColor = '#374151')}
                  />
                  {formErrors.message && (
                    <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center">
                      <XCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-theme py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ boxShadow: '0 0 0 rgba(21, 102, 65, 0)' }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(21, 102, 65, 0.5)')}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 rgba(21, 102, 65, 0)'}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-sm sm:text-base">Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Success Message Modal */}
        {showSuccess && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          >
            <div 
              className="bg-gray-900 rounded-2xl max-w-md w-full p-6 sm:p-8 border-2 shadow-2xl transform transition-all"
              style={{ borderColor: 'rgba(21, 102, 65, 0.5)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-theme flex items-center justify-center mb-4 sm:mb-6 animate-scale-in">
                  <CheckCircle size={32} className="sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Message Sent!</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                  Thank you for reaching out! We've received your message and will get back to you soon.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 bg-gradient-theme"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 pb-[100px] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Multi-column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 mb-8">
            {/* Company Info Column */}
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-gradient-theme mb-3">
                ShalConnects
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                <span className="text-white font-medium">Connecting brands</span> with their audience through innovative digital solutions
              </p>
              <p className="text-gray-500 text-xs">Since {new Date().getFullYear() - statsTarget.years}</p>
            </div>

            {/* Contact Info Column */}
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:hello@shalconnects.com" 
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center justify-center sm:justify-start gap-2"
                  >
                    <Mail size={16} />
                    <span>hello@shalconnects.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/8801879729252" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center justify-center sm:justify-start gap-2"
                  >
                    <SiWhatsapp size={16} />
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
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 group"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin size={18} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </a>
                <a 
                  href="https://x.com/ShalConnects" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110 group"
                  aria-label="Twitter"
                >
                  <SiX size={18} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Section: Copyright & Legal Links */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
              <p className="text-gray-500 text-xs sm:text-sm">Â© 2025 ShalConnects. All rights reserved.</p>
              <div className="flex justify-center flex-wrap gap-3 sm:gap-4 md:gap-6 text-gray-500 text-xs sm:text-sm">
                <Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-green-400 transition-colors">Terms</Link>
                <Link to="/refund" className="hover:text-green-400 transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Minimalist Bottom Navigation (Desktop Only) */}
      <nav className="hidden md:block fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto px-1.5 xs:px-2 sm:px-4 md:px-4 lg:px-6" style={{ overflow: 'visible' }}>
          <div className="bg-gray-900/60 backdrop-blur-md border-t border-gray-800/30 rounded-t-3xl" style={{ overflow: 'visible' }}>
            <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-3 md:gap-2 lg:gap-3 overflow-x-auto overflow-y-visible scrollbar-hide snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch', paddingTop: '0.7rem', paddingBottom: '0.7rem' }}>
              {[
                { label: 'Home', id: 'home', icon: Home },
                { label: 'Services', id: 'services', icon: Zap },
                { label: 'Process', id: 'process', icon: Workflow }
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="relative px-2.5 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2 xs:py-2.5 sm:py-2.5 md:py-3 transition-all duration-200 flex-shrink-0 touch-manipulation min-h-[44px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-0 snap-center"
                    style={{ color: activeSection === item.id ? '#da651e' : '#4a9d6f' }}
                    onMouseEnter={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#da651e')}
                    onMouseLeave={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#4a9d6f')}
                    onTouchStart={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#da651e')}
                    onTouchEnd={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#4a9d6f')}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <IconComponent size={20} className="md:hidden flex-shrink-0" />
                    <span className="tracking-wide whitespace-nowrap hidden md:inline" style={{ fontSize: '1rem', fontWeight: 'bold' }}>{item.label}</span>
                    {activeSection === item.id && (
                      <span className="absolute -bottom-0.5 xs:-bottom-1 sm:-bottom-1.5 left-1/2 transform -translate-x-1/2 w-0.5 xs:w-1 sm:w-1.5 h-0.5 xs:h-1 sm:h-1.5 rounded-full" style={{ backgroundColor: '#da651e' }} />
                    )}
                  </button>
                );
              })}
              
              {/* Outlined Button with Icon and Free Badge */}
              <a
                href="https://calendly.com/hello-shalconnects/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 px-2.5 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2 xs:py-2.5 sm:py-2.5 md:py-3 rounded-full transition-all duration-300 flex-shrink-0 touch-manipulation min-h-[44px] snap-center"
                style={{
                  background: 'linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.6)) padding-box, linear-gradient(to right, #176641, #da651e) border-box',
                  border: '2px solid transparent'
                }}
              >
                <span className="absolute -top-0.5 xs:-top-1 sm:-top-1.5 -right-0.5 xs:-right-1 sm:-right-1.5 bg-yellow-400 text-gray-900 text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full z-20 whitespace-nowrap leading-none">FREE</span>
                <span className="absolute inset-0 rounded-full bg-gradient-theme opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 -z-10"></span>
                <span className="relative z-10 text-gray-300 group-hover:text-white group-active:text-white transition-colors duration-300 whitespace-nowrap" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Book a Call</span>
              </a>
              
              {[
                { label: 'Work', id: 'work', icon: Briefcase },
                { label: 'Contact', id: 'contact', icon: Mail }
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="relative px-2.5 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2 xs:py-2.5 sm:py-2.5 md:py-3 transition-all duration-200 flex-shrink-0 touch-manipulation min-h-[44px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-0 snap-center"
                    style={{ color: activeSection === item.id ? '#da651e' : '#4a9d6f' }}
                    onMouseEnter={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#da651e')}
                    onMouseLeave={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#4a9d6f')}
                    onTouchStart={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#da651e')}
                    onTouchEnd={(e) => activeSection !== item.id && (e.currentTarget.style.color = '#4a9d6f')}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <IconComponent size={20} className="md:hidden flex-shrink-0" />
                    <span className="tracking-wide whitespace-nowrap hidden md:inline" style={{ fontSize: '1rem', fontWeight: 'bold' }}>{item.label}</span>
                    {activeSection === item.id && (
                      <span className="absolute -bottom-0.5 xs:-bottom-1 sm:-bottom-1.5 left-1/2 transform -translate-x-1/2 w-0.5 xs:w-1 sm:w-1.5 h-0.5 xs:h-1 sm:h-1.5 rounded-full" style={{ backgroundColor: '#da651e' }} />
                    )}
                  </button>
                );
              })}
              
              {/* More Menu with Dropdown */}
              <div
                ref={moreMenuRef}
                className="relative"
                style={{ overflow: 'visible' }}
                onMouseEnter={() => {
                  if (moreMenuCloseTimeoutRef.current) {
                    clearTimeout(moreMenuCloseTimeoutRef.current);
                    moreMenuCloseTimeoutRef.current = null;
                  }
                  setIsMoreMenuOpen(true);
                }}
                onMouseLeave={() => {
                  // Delay closing to allow mouse to move to dropdown
                  moreMenuCloseTimeoutRef.current = setTimeout(() => {
                    setIsMoreMenuOpen(false);
                  }, 150);
                }}
              >
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="relative px-2.5 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2 xs:py-2.5 sm:py-2.5 md:py-3 transition-all duration-200 flex-shrink-0 touch-manipulation min-h-[44px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-0 snap-center"
                  style={{ color: isMoreMenuOpen ? '#da651e' : '#4a9d6f' }}
                  onMouseEnter={(e) => !isMoreMenuOpen && (e.currentTarget.style.color = '#da651e')}
                  onMouseLeave={(e) => !isMoreMenuOpen && (e.currentTarget.style.color = '#4a9d6f')}
                  onTouchStart={(e) => !isMoreMenuOpen && (e.currentTarget.style.color = '#da651e')}
                  onTouchEnd={(e) => !isMoreMenuOpen && (e.currentTarget.style.color = '#4a9d6f')}
                  aria-label="More"
                  title="More"
                >
                  <MoreHorizontal size={20} className="md:hidden flex-shrink-0" />
                  <span className="tracking-wide whitespace-nowrap hidden md:inline" style={{ fontSize: '1rem', fontWeight: 'bold' }}>More</span>
                  {isMoreMenuOpen && (
                    <span className="absolute -bottom-0.5 xs:-bottom-1 sm:-bottom-1.5 left-1/2 transform -translate-x-1/2 w-0.5 xs:w-1 sm:w-1.5 h-0.5 xs:h-1 sm:h-1.5 rounded-full" style={{ backgroundColor: '#da651e' }} />
                  )}
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* More Menu Dropdown - Rendered outside nav to avoid clipping */}
      {isMoreMenuOpen && dropdownPosition.top > 0 && (
        <div 
          data-dropdown-menu
          className="fixed bg-gray-900 backdrop-blur-md border-2 border-gray-500 rounded-lg shadow-2xl min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] overflow-hidden z-[9999]" 
          style={{ 
            maxWidth: 'calc(100vw - 2rem)',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            position: 'fixed',
            display: 'block',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(17, 24, 39, 0.98)'
          }}
          onMouseEnter={() => {
            if (moreMenuCloseTimeoutRef.current) {
              clearTimeout(moreMenuCloseTimeoutRef.current);
              moreMenuCloseTimeoutRef.current = null;
            }
            setIsMoreMenuOpen(true);
          }}
          onMouseLeave={() => {
            // Delay closing to allow mouse to move back to button
            moreMenuCloseTimeoutRef.current = setTimeout(() => {
              setIsMoreMenuOpen(false);
            }, 150);
          }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                scrollToSection('about');
                setIsMoreMenuOpen(false);
              }}
              className="w-full text-left px-4 xs:px-5 py-2.5 xs:py-3 text-xs xs:text-sm text-gray-400 hover:text-white active:text-white hover:bg-gray-800/50 active:bg-gray-800/70 transition-colors duration-150 touch-manipulation min-h-[44px] flex items-center"
            >
              About Us
            </button>
            <button
              onClick={() => {
                scrollToSection('team');
                setIsMoreMenuOpen(false);
              }}
              className="w-full text-left px-4 xs:px-5 py-2.5 xs:py-3 text-xs xs:text-sm text-gray-400 hover:text-white active:text-white hover:bg-gray-800/50 active:bg-gray-800/70 transition-colors duration-150 touch-manipulation min-h-[44px] flex items-center"
            >
              Meet the Team
            </button>
            <button
              onClick={() => {
                scrollToSection('blog');
                setIsMoreMenuOpen(false);
              }}
              className="w-full text-left px-4 xs:px-5 py-2.5 xs:py-3 text-xs xs:text-sm text-gray-400 hover:text-white active:text-white hover:bg-gray-800/50 active:bg-gray-800/70 transition-colors duration-150 touch-manipulation min-h-[44px] flex items-center"
            >
              Blog
            </button>
            <button
              onClick={() => {
                navigate('/tools');
                setIsMoreMenuOpen(false);
              }}
              className="w-full text-left px-4 xs:px-5 py-2.5 xs:py-3 text-xs xs:text-sm text-gray-400 hover:text-white active:text-white hover:bg-gray-800/50 active:bg-gray-800/70 transition-colors duration-150 touch-manipulation min-h-[44px] flex items-center"
            >
              Tools
            </button>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] bg-gradient-theme rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          style={{ 
            width: '40px', 
            height: '40px',
            padding: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
          }}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp size={20} className="text-white" />
        </button>
      )}

    </div>
  );
}

