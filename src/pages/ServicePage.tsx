import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Zap, Shield, Clock, Users, TrendingUp, ChevronDown, ChevronUp, Star, Quote, ExternalLink, Mail, Share2, Download, ShoppingCart, X } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import PageLayout from '../components/PageLayout';
import WorkSlider from '../components/WorkSlider';
import { getWorkByService } from '../data/workPortfolio';

interface SubService {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  desc: string;
}

interface Service {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  desc: string;
  startingPrice?: string;
  subServices: SubService[];
}

interface ServiceCategory {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  services: Service[];
}

interface ServicePageProps {
  serviceCategories: ServiceCategory[];
}

export default function ServicePage({ serviceCategories }: ServicePageProps) {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isActionsExpanded, setIsActionsExpanded] = useState<boolean>(false);
  
  // Find the service across all categories
  let foundService: Service | null = null;
  let foundCategory: ServiceCategory | null = null;

  for (const category of serviceCategories) {
    const service = category.services.find(
      s => s.title.toLowerCase().replace(/\s+/g, '-') === serviceSlug
    );
    if (service) {
      foundService = service;
      foundCategory = category;
      break;
    }
  }
  
  // Compute page title
  const pageTitle = foundService ? foundService.title : 'Service';

  // Get work images for this service
  const serviceWorkImages = foundService ? getWorkByService(foundService.title) : [];

  if (!foundService || !foundCategory) {
    return (
      <PageLayout title="Service Not Found">
        <div className="flex items-center justify-center p-4 min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-gray-400 mb-8">The service you're looking for doesn't exist.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105"
              style={{ backgroundColor: '#176641' }}
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const scrollToContact = () => {
    navigate('/#contact', { state: { prefillService: foundService.title } });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <PageLayout title={pageTitle}>
      {/* Main Content */}
        <main className="flex-1 min-w-0 transition-all duration-300">
          {/* Hero Section */}
          <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
            {/* Background Gradient */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${foundCategory.color}20, ${foundCategory.color}05)`
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50"></div>
            
            <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 lg:pr-8">
              <div className="text-center max-w-4xl mx-auto">
                {/* Service Icon */}
                <div className="mb-6 sm:mb-8 flex justify-center">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl"
                    style={{ 
                      backgroundColor: foundCategory.color,
                      boxShadow: `0 20px 40px -10px ${foundCategory.color}40`
                    }}
                  >
                    <foundService.icon size={40} className="sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                  </div>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ marginBottom: '10px' }}>
                  Professional{' '}
                  <span className="bg-clip-text text-transparent" style={{ 
                    backgroundImage: `linear-gradient(to right, ${foundCategory.color}, #da651e)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {foundService.title}
                  </span>
                  {' '}Services
                </h1>
                
                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                  {foundService.desc || `Transform your business with our expert ${foundService.title} solutions. Tailored to your needs, delivered with excellence.`}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4" style={{ marginBottom: '20px' }}>
                  <button
                    onClick={scrollToContact}
                    className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-xl font-bold text-white text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-theme relative overflow-hidden group w-full sm:w-auto"
                    style={{
                      boxShadow: `0 10px 30px -5px ${foundCategory.color}50`
                    }}
                  >
                    <span className="relative z-10">Get Your Custom Quote</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                  <a
                    href="#services"
                    className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-xl font-semibold text-white text-base sm:text-lg transition-all duration-300 hover:scale-105 border-2 w-full sm:w-auto text-center"
                    style={{ 
                      borderColor: foundCategory.color,
                      color: foundCategory.color,
                      backgroundColor: 'transparent'
                    }}
                  >
                    View Services
                  </a>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} style={{ color: foundCategory.color }} />
                    <span><span className="font-semibold text-white">100+</span> Happy Clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                    <span><span className="font-semibold text-white">98%</span> Satisfaction Rate</span>
                  </div>
                  {foundService.startingPrice && (
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} style={{ color: foundCategory.color }} />
                      <span>Starting at <span className="font-semibold text-white">{foundService.startingPrice}</span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Features/Benefits Section */}
          <section id="features" className="py-12 sm:py-16 md:py-20 relative">
            {/* Section Divider */}
            <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
              background: `linear-gradient(to right, transparent, ${foundCategory.color}50, transparent)`
            }}></div>
            
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 lg:pr-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '5px' }}>
                  Why Us?
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                  We deliver excellence through expertise, innovation, and unwavering commitment to your success.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <div className="bg-gray-800/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group flex-1 min-w-[150px] sm:min-w-[180px] lg:max-w-none">
              <div className="flex flex-col items-center text-center gap-2">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  style={{ 
                    backgroundColor: foundCategory.color + '20',
                    boxShadow: `0 4px 12px -2px ${foundCategory.color}30`
                  }}
                >
                  <Zap size={16} className="sm:w-4 sm:h-4" style={{ color: '#FFD700' }} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Fast & Efficient</h3>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group flex-1 min-w-[150px] sm:min-w-[180px] lg:max-w-none">
              <div className="flex flex-col items-center text-center gap-2">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  style={{ 
                    backgroundColor: foundCategory.color + '20',
                    boxShadow: `0 4px 12px -2px ${foundCategory.color}30`
                  }}
                >
                  <Shield size={16} className="sm:w-4 sm:h-4" style={{ color: '#FFD700' }} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Secure & Reliable</h3>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group flex-1 min-w-[150px] sm:min-w-[180px] lg:max-w-none">
              <div className="flex flex-col items-center text-center gap-2">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  style={{ 
                    backgroundColor: foundCategory.color + '20',
                    boxShadow: `0 4px 12px -2px ${foundCategory.color}30`
                  }}
                >
                  <Clock size={16} className="sm:w-4 sm:h-4" style={{ color: '#FFD700' }} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Ongoing Support</h3>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group flex-1 min-w-[150px] sm:min-w-[180px] lg:max-w-none">
              <div className="flex flex-col items-center text-center gap-2">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  style={{ 
                    backgroundColor: foundCategory.color + '20',
                    boxShadow: `0 4px 12px -2px ${foundCategory.color}30`
                  }}
                >
                  <Users size={16} className="sm:w-4 sm:h-4" style={{ color: '#FFD700' }} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Expert Team</h3>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group flex-1 min-w-[150px] sm:min-w-[180px] lg:max-w-none">
              <div className="flex flex-col items-center text-center gap-2">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  style={{ 
                    backgroundColor: foundCategory.color + '20',
                    boxShadow: `0 4px 12px -2px ${foundCategory.color}30`
                  }}
                >
                  <TrendingUp size={16} className="sm:w-4 sm:h-4" style={{ color: '#FFD700' }} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Scalable Solutions</h3>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group flex-1 min-w-[150px] sm:min-w-[180px] lg:max-w-none">
              <div className="flex flex-col items-center text-center gap-2">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  style={{ 
                    backgroundColor: foundCategory.color + '20',
                    boxShadow: `0 4px 12px -2px ${foundCategory.color}30`
                  }}
                >
                  <CheckCircle size={16} className="sm:w-4 sm:h-4" style={{ color: '#FFD700' }} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Quality Guaranteed</h3>
              </div>
            </div>
              </div>
            </div>
          </section>

          {/* Services & Pricing Section */}
          {foundService.subServices && foundService.subServices.length > 0 ? (
            <>
            <section id="services" className="py-12 sm:py-16 md:py-20 relative bg-gray-800/30">
              {/* Section Divider */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
                background: `linear-gradient(to right, transparent, ${foundCategory.color}50, transparent)`
              }}></div>
              
              <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 lg:pr-8">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
                    Our {foundService.title} Services & Pricing
                  </h2>
                  <p className="text-center text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                    We offer comprehensive {foundService.title} solutions tailored to your needs. Choose individual services or combine them for a complete solution.
                  </p>
                </div>

                {/* Individual Service Pricing */}
                {foundService.subServices && foundService.subServices.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-12 sm:mb-16">
                      {foundService.subServices.map((subService, subIdx) => {
                        // Generic pricing function based on service type and label
                        const getPrice = (serviceTitle: string, label: string) => {
                          // WordPress specific pricing
                          if (serviceTitle === 'WordPress') {
                            if (label.includes('Site Design')) return '$100';
                            if (label.includes('Custom Theme')) return '$120';
                            if (label.includes('Making Plugins') || label.includes('Plugins')) return '$30';
                            if (label.includes('Site Maintenance')) return '$10';
                            if (label.includes('Custom Script')) return '$20';
                            return '$100';
                          }
                          // Shopify specific pricing
                          if (serviceTitle === 'Shopify') {
                            if (label.includes('Site Design')) return '$150';
                            if (label.includes('Custom Theme')) return '$200';
                            if (label.includes('Shopify App')) return '$300';
                            return '$150';
                          }
                          // Wix specific pricing
                          if (serviceTitle === 'Wix') {
                            if (label.includes('Site Design')) return '$100';
                            if (label.includes('Customization')) return '$120';
                            if (label.includes('Maintenance')) return '$15';
                            return '$100';
                          }
                          // E-commerce platforms (eBay, Amazon, Walmart)
                          if (['eBay', 'Amazon', 'Walmart'].includes(serviceTitle)) {
                            if (label.includes('Store Management') || label.includes('Management')) return '$200';
                            if (label.includes('Listing')) return '$50';
                            if (label.includes('Template') || label.includes('Redesign')) return '$150';
                            if (label.includes('Graphics') || label.includes('A+ Content')) return '$100';
                            if (label.includes('Dropshipping')) return '$250';
                            return '$150';
                          }
                          // Android App
                          if (serviceTitle === 'Android App') {
                            if (label.includes('Web to App')) return '$500';
                            if (label.includes('Scratch to App')) return '$2000';
                            if (label.includes('Maintenance')) return '$100';
                            if (label.includes('App Store Optimization') || label.includes('ASO')) return '$200';
                            if (label.includes('UI/UX Design')) return '$300';
                            if (label.includes('Integration')) return '$400';
                            return '$500';
                          }
                          // Design services
                          if (['Brand Identity', 'Social Media Graphics', 'Print Design', 'Web Graphics'].includes(serviceTitle)) {
                            if (label.includes('Logo')) return '$200';
                            if (label.includes('Banner')) return '$50';
                            if (label.includes('Brand Guidelines') || label.includes('Guidelines')) return '$300';
                            if (label.includes('Color') || label.includes('Typography')) return '$100';
                            if (label.includes('Brand Assets') || label.includes('Assets')) return '$400';
                            if (label.includes('Social Posts') || label.includes('Posts')) return '$30';
                            if (label.includes('Stories') || label.includes('Covers')) return '$25';
                            if (label.includes('Social Ads') || label.includes('Ads')) return '$50';
                            if (label.includes('Business Cards')) return '$80';
                            if (label.includes('Flyers') || label.includes('Brochures')) return '$100';
                            if (label.includes('Posters') || label.includes('Banners')) return '$120';
                            if (label.includes('Web Graphics') || label.includes('Graphics')) return '$60';
                            return '$100';
                          }
                          // Default fallback
                          return '$100';
                        };
                        
                        return (
                        <div
                          key={subIdx}
                          className="bg-gray-800/60 backdrop-blur-sm p-5 sm:p-6 md:p-7 rounded-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col group relative overflow-hidden"
                          style={{
                            boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          {/* Subtle gradient overlay */}
                          <div 
                            className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full blur-3xl"
                            style={{ backgroundColor: foundCategory.color }}
                          ></div>
                          
                          {/* Icon */}
                          <div className="mb-4 flex justify-center">
                            <div 
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                              style={{ 
                                backgroundColor: foundCategory.color + '20',
                                boxShadow: `0 4px 12px -2px ${foundCategory.color}30`
                              }}
                            >
                              <subService.icon size={24} className="sm:w-7 sm:h-7" style={{ color: foundCategory.color }} />
                            </div>
                          </div>
                          
                          {/* Title & Description */}
                          <div className="text-center mb-5 sm:mb-6 relative z-10">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight" style={{ marginBottom: '0' }}>{subService.label}</h3>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{subService.desc}</p>
                          </div>
                            
                          {/* Price Section */}
                          <div className="mt-auto pt-4 border-t border-gray-700/50 relative z-10">
                            <div className="text-center">
                              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">Starting at</p>
                              <div 
                                className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent leading-none" 
                                style={{ 
                                  backgroundImage: `linear-gradient(135deg, ${foundCategory.color}, #da651e)`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }}
                              >
                                {getPrice(foundService.title, subService.label)}
                              </div>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                    
                    {/* Common Get Quote Button */}
                    <div className="flex flex-col items-center gap-3 sm:gap-4 mt-10 sm:mt-12 md:mt-16 px-2">
                      <button
                        onClick={scrollToContact}
                        className="px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-xl font-bold text-white text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-theme relative overflow-hidden group w-full sm:w-auto"
                        style={{
                          boxShadow: `0 10px 30px -5px ${foundCategory.color}50`
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Get Your Custom Quote
                          <ArrowLeft size={20} className="rotate-180" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 relative" style={{ 
                      background: `linear-gradient(to bottom, ${foundCategory.color}08, ${foundCategory.color}03)`
                    }}>
                      {/* Subtle Top Border */}
                      <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
                        background: `linear-gradient(to right, transparent, ${foundCategory.color}50, #da651e50, transparent)`
                      }}></div>
                      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 lg:pr-8">
                        <div className="text-center mb-10 sm:mb-12 md:mb-16">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '0' }}>What Clients Say</h2>
                          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto">Testimonials from our amazing partners</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Business Owner',
                content: `Working with ShalConnects on our ${foundService.title} project was a game-changer. The team was professional, responsive, and delivered exactly what we needed. Highly recommend!`,
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Marketing Director',
                content: `The ${foundService.title} solution they built for us exceeded our expectations. It's fast, reliable, and exactly what we needed to grow our business.`,
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'Entrepreneur',
                content: `I was impressed by their attention to detail and commitment to quality. Our ${foundService.title} project was completed on time and within budget. Excellent service!`,
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gray-800/60 backdrop-blur-sm p-6 sm:p-7 md:p-8 rounded-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group relative overflow-hidden"
                style={{ 
                  boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Subtle gradient overlay on hover */}
                <div 
                  className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full blur-2xl"
                  style={{ backgroundColor: foundCategory.color }}
                ></div>
                
                <div className="relative z-10">
                  <Quote className="mb-4 w-8 h-8 sm:w-10 sm:h-10" style={{ color: foundCategory.color }} />
                  <div className="flex mb-4 gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-sm sm:text-base font-semibold text-white mb-1">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
                        </div>
                      </div>
                    </section>
            </>
          ) : (
            <section id="pricing" className="py-8 sm:py-12 md:py-16 bg-gray-800/30">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 lg:pr-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center px-2">
                  Choose Your Package
                </h2>
                <p className="text-center text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-2">
                  Select the package that best fits your needs. All packages include quality work and ongoing support.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Starter Package */}
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
                    <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: foundCategory.color }}>
                        $250
                      </span>
                      <span className="text-gray-400 ml-2">starting</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Basic setup & configuration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Essential features included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">1 month support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Basic documentation</span>
                      </li>
                    </ul>
                    <button
                      onClick={scrollToContact}
                      className="w-full px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 bg-gradient-theme"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Professional Package */}
                  <div className="bg-gray-800/50 p-8 rounded-xl border-2 transition-all hover:scale-105 relative" style={{ borderColor: foundCategory.color }}>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white bg-gradient-theme">
                      Most Popular
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: '#da651e' }}>
                        {foundService.startingPrice || '$500'}
                      </span>
                      <span className="text-gray-400 ml-2">starting</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Everything in Starter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Custom design & development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Advanced features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">3 months support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Priority support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Training & documentation</span>
                      </li>
                    </ul>
                    <button
                      onClick={scrollToContact}
                      className="w-full px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 bg-gradient-theme"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Enterprise Package */}
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
                    <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: foundCategory.color }}>
                        Custom
                      </span>
                      <span className="text-gray-400 ml-2">quote</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Everything in Professional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Fully custom solution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Unlimited features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">6+ months support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Dedicated account manager</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">24/7 priority support</span>
                      </li>
                    </ul>
                    <button
                      onClick={scrollToContact}
                      className="w-full px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Work Portfolio Slider Section */}
          {serviceWorkImages.length > 0 && (
            <section id="portfolio" className="py-12 sm:py-16 md:py-20 relative bg-gray-800/30">
              {/* Section Divider */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
                background: `linear-gradient(to right, transparent, ${foundCategory.color}50, transparent)`
              }}></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
                    Our {foundService.title} Work
                  </h2>
                  <p className="text-center text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                    Explore our portfolio of {foundService.title} projects and see the quality of our work.
                  </p>
                </div>
                <WorkSlider 
                  images={serviceWorkImages} 
                  showServiceMarquee={false}
                  speed={20}
                />
              </div>
            </section>
          )}

          {/* Portfolio Section */}
          <section id="portfolio" className="py-12 sm:py-16 md:py-20 relative bg-gray-800/30">
            {/* Section Divider */}
            <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
              background: `linear-gradient(to right, transparent, ${foundCategory.color}50, transparent)`
            }}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '0' }}>
                  Our {foundService.title} Portfolio
                </h2>
                <p className="text-center text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                  See how we've helped businesses succeed with {foundService.title}. Real projects, real results.
                </p>
              </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
              {[
                {
                  title: 'E-Commerce Store',
                  category: `${foundService.title} + E-Commerce`,
                  description: 'Complete e-commerce solution with custom product pages, payment integration, and inventory management.',
                  results: '300% increase in online sales',
                  features: [`${foundService.title} Site Design`, 'Custom Theme', 'Custom Integration', 'Payment Setup'],
                  isPlugin: false,
                  pluginSlug: undefined
                },
                {
                  title: 'Corporate Website',
                  category: `${foundService.title} Custom Design`,
                  description: 'Professional corporate website with custom design, blog integration, and multilingual support.',
                  results: '150% increase in lead generation',
                  features: [`${foundService.title} Site Design`, 'Custom Theme', 'Custom Features'],
                  isPlugin: false,
                  pluginSlug: undefined
                },
                {
                  title: 'Business Portal',
                  category: `${foundService.title} + Custom Features`,
                  description: 'High-traffic business website with custom content management, user registration, and advanced functionality.',
                  results: '500K+ monthly visitors',
                  features: [`${foundService.title} Site Design`, 'Custom Theme', 'Custom Features', 'Advanced Integration'],
                  isPlugin: false,
                  pluginSlug: undefined
                }
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden group"
                  style={{
                    boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div 
                    className="h-48 bg-gradient-to-br flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}30, ${foundCategory.color}15)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    {/* Animated gradient overlay */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`
                      }}
                    ></div>
                    <div className="text-center relative z-10">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
                        style={{ 
                          backgroundColor: foundCategory.color,
                          boxShadow: `0 8px 20px -5px ${foundCategory.color}50`
                        }}
                      >
                        <foundService.icon size={32} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">{project.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-5 leading-relaxed">{project.description}</p>
                    <div className="mb-5 p-3 rounded-lg" style={{ backgroundColor: foundCategory.color + '10' }}>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: foundCategory.color }}>
                        Results
                      </p>
                      <p className="text-gray-200 text-sm font-medium">{project.results}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="text-xs px-2.5 py-1.5 rounded-full"
                          style={{ 
                            backgroundColor: foundCategory.color + '20',
                            color: foundCategory.color,
                            border: `1px solid ${foundCategory.color}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    {project.isPlugin && project.pluginSlug ? (
                      <button
                        onClick={() => navigate(`/services/${foundService.title.toLowerCase().replace(/\s+/g, '-')}/plugins/${project.pluginSlug}`)}
                        className="w-full px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        style={{ backgroundColor: foundCategory.color }}
                      >
                        View Plugin Details
                        <ExternalLink size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={scrollToContact}
                        className="w-full px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        style={{ backgroundColor: foundCategory.color }}
                      >
                        Get Similar Results
                        <ExternalLink size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

          {/* Our Products & Plugins Section */}
          <section id="products" className="py-12 sm:py-16 md:py-20 relative">
            {/* Section Divider */}
            <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
              background: `linear-gradient(to right, transparent, ${foundCategory.color}50, transparent)`
            }}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '0' }}>
                  Our Products & Plugins
                </h2>
                <p className="text-center text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                  Discover the {foundService.title} products and solutions we've created to help businesses enhance their services.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Variation Images Pro',
                    category: 'WooCommerce Plugin',
                    description: 'Transform product variation selection with beautiful visual swatches, galleries, and interactive selectors.',
                    results: '250% increase in conversion rate',
                    features: ['Visual Swatches', 'Image Galleries', 'Video Support', 'Bulk Operations'],
                    isPlugin: true,
                    pluginSlug: 'variation-images-pro',
                    price: '$24.99'
                  },
                ].map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden"
                  >
                    <div 
                      className="h-48 bg-gradient-to-br flex items-center justify-center overflow-hidden relative"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    <img 
                      src="/images/plugin/preview.png" 
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Fallback to icon if image fails to load
                        const fallback = target.parentElement?.querySelector('.fallback-icon');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="fallback-icon hidden absolute inset-0 items-center justify-center text-center">
                      <div>
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: foundCategory.color }}>
                          <foundService.icon size={32} className="text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-300">{product.category}</p>
                      </div>
                    </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{product.description}</p>
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2" style={{ color: foundCategory.color }}>
                          Results:
                        </p>
                        <p className="text-gray-300 text-sm">{product.results}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.features.map((feature, featureIdx) => (
                          <span
                            key={featureIdx}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: foundCategory.color + '20',
                              color: foundCategory.color,
                              border: `1px solid ${foundCategory.color}30`
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      {product.price && (
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-white">{product.price}</p>
                        </div>
                      )}
                      {product.isPlugin ? (
                        <a
                          href={`https://store.shalconnects.com/store/${product.pluginSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                          style={{ backgroundColor: foundCategory.color }}
                        >
                          View Plugin Details
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <button
                          onClick={scrollToContact}
                          className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                          style={{ backgroundColor: foundCategory.color }}
                        >
                          Get Similar Results
                          <ExternalLink size={16} />
                        </button>
                      )}
                    </div>
                  </div>
              ))}
            </div>
            
            {/* Visit Store CTA */}
            <div className="mt-10 sm:mt-12 md:mt-16 text-center">
              <a
                href="https://store.shalconnects.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-theme"
              >
                Visit Our Store
                <ExternalLink size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </section>

          {/* Portfolio Section - Shopify */}
          {foundService.title === 'Shopify' && (
            <section id="portfolio" className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our Shopify Portfolio
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Discover our successful Shopify stores and see how we've helped businesses achieve e-commerce success.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Fashion Boutique',
                  category: 'Shopify Store + Custom Theme',
                  description: 'Beautiful fashion e-commerce store with product filtering, size guides, and wishlist functionality.',
                  results: '250% increase in conversion rate',
                  features: ['Custom Theme', 'Product Filters', 'Size Guide', 'Wishlist']
                },
                {
                  title: 'Electronics Store',
                  category: 'Shopify + Custom Apps',
                  description: 'High-performance electronics store with inventory sync, multi-currency support, and advanced search.',
                  results: '400% increase in monthly revenue',
                  features: ['Inventory Sync', 'Multi-Currency', 'Advanced Search', 'Quick Checkout']
                },
                {
                  title: 'Beauty Products',
                  category: 'Shopify + Subscription',
                  description: 'Subscription-based beauty store with recurring orders, product bundles, and loyalty program.',
                  results: '180% increase in repeat customers',
                  features: ['Subscription Box', 'Product Bundles', 'Loyalty Program', 'Auto-Reorder']
                }
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <div 
                    className="h-48 bg-gradient-to-br flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: foundCategory.color }}>
                        <foundService.icon size={32} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">{project.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: foundCategory.color }}>
                        Results:
                      </p>
                      <p className="text-gray-300 text-sm">{project.results}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: foundCategory.color + '20',
                            color: foundCategory.color,
                            border: `1px solid ${foundCategory.color}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Get Similar Results
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

          {/* Portfolio Section - Wix */}
          {foundService.title === 'Wix' && (
            <section id="portfolio" className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our Wix Portfolio
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              See how we've created stunning websites using Wix for businesses of all sizes.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Restaurant Website',
                  category: 'Wix Custom Design',
                  description: 'Modern restaurant website with online menu, reservation system, and location integration.',
                  results: '200% increase in online reservations',
                  features: ['Online Menu', 'Reservation System', 'Location Map', 'Gallery']
                },
                {
                  title: 'Photography Portfolio',
                  category: 'Wix + Custom Features',
                  description: 'Elegant photography portfolio with image galleries, client portal, and booking system.',
                  results: '150% increase in bookings',
                  features: ['Image Gallery', 'Client Portal', 'Booking System', 'Contact Forms']
                },
                {
                  title: 'Fitness Studio',
                  category: 'Wix + Membership',
                  description: 'Fitness studio website with class schedules, membership signup, and payment integration.',
                  results: '300% increase in memberships',
                  features: ['Class Schedule', 'Membership Signup', 'Payment Integration', 'Blog']
                }
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <div 
                    className="h-48 bg-gradient-to-br flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: foundCategory.color }}>
                        <foundService.icon size={32} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">{project.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: foundCategory.color }}>
                        Results:
                      </p>
                      <p className="text-gray-300 text-sm">{project.results}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: foundCategory.color + '20',
                            color: foundCategory.color,
                            border: `1px solid ${foundCategory.color}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Get Similar Results
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

          {/* Portfolio Section - eBay */}
          {foundService.title === 'eBay' && (
            <section id="portfolio" className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our eBay Portfolio
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              See how we've optimized eBay stores for maximum visibility and sales performance.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Electronics Seller',
                  category: 'eBay Store Optimization',
                  description: 'Complete eBay store setup with optimized listings, bulk upload tools, and inventory management.',
                  results: '350% increase in sales',
                  features: ['Store Setup', 'Listing Optimization', 'Bulk Upload', 'Inventory Sync']
                },
                {
                  title: 'Fashion Retailer',
                  category: 'eBay + Marketing',
                  description: 'Fashion store with professional listings, promoted listings, and international shipping setup.',
                  results: '280% increase in views',
                  features: ['Professional Listings', 'Promoted Listings', 'International Shipping', 'SEO']
                },
                {
                  title: 'Collectibles Store',
                  category: 'eBay + Automation',
                  description: 'Automated collectibles store with repricing tools, listing templates, and analytics dashboard.',
                  results: '200% increase in profit margin',
                  features: ['Auto-Repricing', 'Listing Templates', 'Analytics', 'Automation']
                }
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <div 
                    className="h-48 bg-gradient-to-br flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: foundCategory.color }}>
                        <foundService.icon size={32} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">{project.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: foundCategory.color }}>
                        Results:
                      </p>
                      <p className="text-gray-300 text-sm">{project.results}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: foundCategory.color + '20',
                            color: foundCategory.color,
                            border: `1px solid ${foundCategory.color}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Get Similar Results
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

          {/* Portfolio Section - Amazon */}
          {foundService.title === 'Amazon' && (
            <section id="portfolio" className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our Amazon Portfolio
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Discover how we've helped sellers achieve success on Amazon with optimized listings and strategies.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'FBA Seller Account',
                  category: 'Amazon FBA Setup',
                  description: 'Complete FBA account setup with product listings, inventory management, and PPC campaigns.',
                  results: '500% increase in sales',
                  features: ['FBA Setup', 'Product Listings', 'PPC Campaigns', 'Inventory Management']
                },
                {
                  title: 'Private Label Brand',
                  category: 'Amazon Brand Registry',
                  description: 'Brand registry setup with enhanced content, A+ pages, and brand protection strategies.',
                  results: '400% increase in brand visibility',
                  features: ['Brand Registry', 'A+ Content', 'Enhanced Listings', 'Brand Protection']
                },
                {
                  title: 'Multi-Product Store',
                  category: 'Amazon Store Management',
                  description: 'Multi-product store with automated repricing, review management, and analytics.',
                  results: '300% increase in revenue',
                  features: ['Store Management', 'Auto-Repricing', 'Review Management', 'Analytics']
                }
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <div 
                    className="h-48 bg-gradient-to-br flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: foundCategory.color }}>
                        <foundService.icon size={32} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">{project.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: foundCategory.color }}>
                        Results:
                      </p>
                      <p className="text-gray-300 text-sm">{project.results}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: foundCategory.color + '20',
                            color: foundCategory.color,
                            border: `1px solid ${foundCategory.color}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Get Similar Results
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

          {/* Portfolio Section - Walmart */}
          {foundService.title === 'Walmart' && (
            <section id="portfolio" className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our Walmart Portfolio
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              See how we've helped sellers succeed on Walmart Marketplace with optimized listings and strategies.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Marketplace Seller',
                  category: 'Walmart Marketplace Setup',
                  description: 'Complete marketplace setup with product catalog, pricing optimization, and fulfillment integration.',
                  results: '250% increase in sales',
                  features: ['Marketplace Setup', 'Product Catalog', 'Pricing Optimization', 'Fulfillment']
                },
                {
                  title: 'Brand Store',
                  category: 'Walmart + Branding',
                  description: 'Brand store with enhanced listings, product content, and advertising campaigns.',
                  results: '350% increase in visibility',
                  features: ['Enhanced Listings', 'Product Content', 'Advertising', 'Branding']
                },
                {
                  title: 'Multi-Channel Seller',
                  category: 'Walmart + Integration',
                  description: 'Multi-channel integration with inventory sync, order management, and analytics.',
                  results: '200% increase in efficiency',
                  features: ['Multi-Channel', 'Inventory Sync', 'Order Management', 'Analytics']
                }
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <div 
                    className="h-48 bg-gradient-to-br flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: foundCategory.color }}>
                        <foundService.icon size={32} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">{project.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: foundCategory.color }}>
                        Results:
                      </p>
                      <p className="text-gray-300 text-sm">{project.results}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: foundCategory.color + '20',
                            color: foundCategory.color,
                            border: `1px solid ${foundCategory.color}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Get Similar Results
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

          {/* Portfolio Section - Android */}
          {foundService.title === 'Android App' && (
            <section id="portfolio" className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our Android App Portfolio
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Explore our successful Android applications and see how we've helped businesses reach millions of users.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Fitness Tracking App',
                  category: 'Android Native App',
                  description: 'Feature-rich fitness app with workout tracking, progress analytics, and social features.',
                  results: '1M+ downloads, 4.7 star rating',
                  features: ['Workout Tracking', 'Progress Analytics', 'Social Features', 'Offline Mode']
                },
                {
                  title: 'E-Commerce Mobile App',
                  category: 'Android + Backend',
                  description: 'Complete e-commerce app with shopping cart, payment integration, and order tracking.',
                  results: '500K+ downloads, 4.5 star rating',
                  features: ['Shopping Cart', 'Payment Integration', 'Order Tracking', 'Push Notifications']
                },
                {
                  title: 'Business Management App',
                  category: 'Android Enterprise',
                  description: 'Enterprise app with team collaboration, task management, and real-time sync.',
                  results: '200K+ active users, 4.8 star rating',
                  features: ['Team Collaboration', 'Task Management', 'Real-time Sync', 'Analytics']
                }
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden"
                >
                  <div 
                    className="h-48 bg-gradient-to-br flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${foundCategory.color}40, ${foundCategory.color}20)`,
                      borderBottom: `2px solid ${foundCategory.color}30`
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: foundCategory.color }}>
                        <foundService.icon size={32} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">{project.category}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2" style={{ color: foundCategory.color }}>
                        Results:
                      </p>
                      <p className="text-gray-300 text-sm">{project.results}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map((feature, featureIdx) => (
                        <span
                          key={featureIdx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: foundCategory.color + '20',
                            color: foundCategory.color,
                            border: `1px solid ${foundCategory.color}30`
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Get Similar Results
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </section>
          )}

          {/* Complete Solutions Section */}
          <section className="py-12 sm:py-16 md:py-20 relative bg-gray-800/30">
            {/* Section Divider */}
            <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
              background: `linear-gradient(to right, transparent, ${foundCategory.color}50, transparent)`
            }}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '0' }}>
                  Complete Solutions
                </h2>
                <p className="text-center text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                  Popular project packages that combine multiple services for comprehensive solutions.
                </p>
              </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Corporate Website Package */}
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-400 mb-2">{foundService.title} Custom Design</p>
                      <h3 className="text-2xl font-bold text-white mb-2">Corporate Website</h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">{foundService.title} Site Design</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Custom Theme</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Custom Script</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: foundCategory.color }}>
                        {foundService.startingPrice || '$500'}
                      </span>
                      <span className="text-gray-400 ml-2">starting</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{foundService.title} Site Design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Custom Theme</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Blog System</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Contact Forms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Multilingual Support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">3 months support</span>
                      </li>
                    </ul>
                    <button
                      onClick={scrollToContact}
                      className="w-full px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 bg-gradient-theme"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* E-Commerce Store Package */}
                  <div className="bg-gray-800/50 p-8 rounded-xl border-2 transition-all hover:scale-105 relative" style={{ borderColor: foundCategory.color }}>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white bg-gradient-theme">
                      Most Popular
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-400 mb-2">{foundService.title} + E-Commerce</p>
                      <h3 className="text-2xl font-bold text-white mb-2">E-Commerce Store</h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">{foundService.title} Site Design</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Custom Theme</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Making Plugins</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Custom Script</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: foundCategory.color }}>
                        $800
                      </span>
                      <span className="text-gray-400 ml-2">starting</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{foundService.title} Site Design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Custom Theme</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">WooCommerce Setup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Payment Gateway Integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">SEO Optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Inventory Management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">6 months support</span>
                      </li>
                    </ul>
                    <button
                      onClick={scrollToContact}
                      className="w-full px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 bg-gradient-theme"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* News Portal Package */}
                  <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-400 mb-2">{foundService.title} + Custom Features</p>
                      <h3 className="text-2xl font-bold text-white mb-2">Business Portal</h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">{foundService.title} Site Design</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Custom Theme</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Making Plugins</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">Custom Script</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: foundCategory.color }}>
                        Custom
                      </span>
                      <span className="text-gray-400 ml-2">quote</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{foundService.title} Site Design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Custom Theme</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Making Plugins</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Custom Script</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">User Dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Subscription System</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={20} style={{ color: foundCategory.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">12+ months support</span>
                      </li>
                    </ul>
                    <button
                      onClick={scrollToContact}
                      className="w-full px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105"
                      style={{ backgroundColor: foundCategory.color }}
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </section>

          {/* FAQ Section */}
          <section id="faq" className="py-12 sm:py-16 md:py-20 relative bg-gray-800/30">
            {/* Section Divider */}
            <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ 
              background: `linear-gradient(to right, transparent, ${foundCategory.color}50, transparent)`
            }}></div>
            
            <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 lg:pr-8">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '0' }}>
                  FAQs
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
            {[
              {
                question: `How long does a typical ${foundService.title} project take?`,
                answer: `Project timelines vary based on complexity and requirements. A basic setup typically takes 2-4 weeks, while custom projects may take 4-8 weeks. We'll provide a detailed timeline during our initial consultation.`
              },
              {
                question: `What's included in the starting price?`,
                answer: `The starting price includes basic setup, essential features, and initial configuration. Additional features, customizations, and extended support can be added based on your specific needs. We'll provide a detailed breakdown in your quote.`
              },
              // Web-specific questions (WordPress, Shopify, Wix, Custom Site)
              ...(['WordPress', 'Shopify', 'Wix', 'Custom Site'].includes(foundService.title) ? [
                {
                  question: `Do you provide hosting and domain services?`,
                  answer: `We can help you set up hosting and domain services, or work with your existing provider. We recommend reliable hosting solutions and can guide you through the setup process.`
                },
                {
                  question: `Can I update content myself after the project is complete?`,
                  answer: `Yes! We build user-friendly solutions that allow you to manage and update content easily. We also provide training and documentation so you can confidently manage your site.`
                },
                {
                  question: `Will my site be mobile-responsive and SEO-optimized?`,
                  answer: `Yes! All our solutions are built mobile-first and include SEO best practices. We ensure your site performs well on all devices and search engines.`
                }
              ] : []),
              // Design-specific questions
              ...(['Brand Identity', 'Social Media Graphics', 'Print Design', 'Web Graphics'].includes(foundService.title) ? [
                {
                  question: `What file formats will I receive?`,
                  answer: `You'll receive all files in the formats you need - including source files (AI, PSD, Figma), web formats (PNG, JPG, SVG), and print-ready formats (PDF, EPS) depending on your project requirements.`
                },
                {
                  question: `How many revisions are included?`,
                  answer: `We include 2-3 rounds of revisions in our standard packages to ensure you're completely satisfied with the final design. Additional revisions can be arranged if needed.`
                }
              ] : []),
              // Android App-specific questions
              ...(foundService.title === 'Android App' ? [
                {
                  question: `Will my app be published on Google Play Store?`,
                  answer: `Yes! We can handle the entire Google Play Store submission process, including store listing optimization, screenshots, descriptions, and compliance requirements.`
                },
                {
                  question: `Can you convert my existing website to an app?`,
                  answer: `Absolutely! We specialize in converting websites to native Android apps, maintaining all functionality while optimizing for mobile performance and user experience.`
                }
              ] : []),
              // E-commerce platform-specific questions
              ...(['eBay', 'Amazon', 'Walmart'].includes(foundService.title) ? [
                {
                  question: `Do I need to provide product information?`,
                  answer: `Yes, we'll need product details, images, and specifications. We can also help optimize your existing listings and create professional product descriptions that convert.`
                },
                {
                  question: `How do you handle ongoing store management?`,
                  answer: `We offer comprehensive store management services including listing optimization, inventory updates, order processing assistance, and performance monitoring.`
                }
              ] : []),
              // General questions for all services
              {
                question: `What if I need changes or additional features later?`,
                answer: `We offer ongoing support and maintenance packages. You can request changes, add new features, or get help with updates anytime. We're here to support your growth.`
              },
              {
                question: `Do you provide training and documentation?`,
                answer: `Absolutely! We provide comprehensive documentation and training sessions to ensure you're comfortable managing your solution. Training is included in Professional and Enterprise packages.`
              },
              {
                question: `What kind of support do you offer after launch?`,
                answer: `Support varies by package. Starter includes 1 month of support, Professional includes 3 months, and Enterprise includes 6+ months with priority access. We also offer ongoing maintenance plans.`
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/70 overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: openFAQ === idx ? `0 8px 20px -5px ${foundCategory.color}20` : '0 4px 10px -2px rgba(0, 0, 0, 0.2)'
                }}
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-5 sm:px-6 md:px-7 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors gap-4 group"
                  aria-expanded={openFAQ === idx}
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-white pr-2 sm:pr-4 leading-snug group-hover:text-gray-100 transition-colors">{faq.question}</span>
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                    style={{ 
                      backgroundColor: openFAQ === idx ? foundCategory.color + '20' : 'transparent'
                    }}
                  >
                    {openFAQ === idx ? (
                      <ChevronUp size={20} className="sm:w-6 sm:h-6" style={{ color: foundCategory.color }} />
                    ) : (
                      <ChevronDown size={20} className="sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-300" />
                    )}
                  </div>
                </button>
                {openFAQ === idx && (
                  <div className="px-5 sm:px-6 md:px-7 pb-4 sm:pb-5 border-t border-gray-700/50">
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
              </div>
            </div>
          </section>
        </main>

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
                <button
                  onClick={() => {
                    scrollToContact();
                    setIsActionsExpanded(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs md:text-sm font-bold text-white transition-all duration-300 hover:scale-105 bg-gradient-theme"
                >
                  <Mail size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span className="whitespace-nowrap">Get Your Quote</span>
                </button>

                {/* Contact Methods */}
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      scrollToContact();
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

                {/* Share & Back to Top */}
                <div className="pt-1.5 sm:pt-2 border-t border-gray-700/50 flex gap-1.5 sm:gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-gray-700/30"
                    style={{ color: foundCategory.color }}
                  >
                    <Share2 size={12} className="sm:w-3.5 sm:h-3.5" />
                    Share
                  </button>
                  <button
                    onClick={scrollToTop}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-gray-700/30"
                    style={{ color: foundCategory.color }}
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
              boxShadow: `0 8px 20px -5px ${foundCategory.color}50`
            }}
            aria-label="Open Quick Actions"
          >
            <Mail size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        )}
      </div>
    </PageLayout>
  );
}

