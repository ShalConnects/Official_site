import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Zap, Shield, Clock, Users, TrendingUp, ChevronDown, ChevronUp, Star, Quote, ExternalLink, Menu, X as XIcon } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import PageLayout from '../components/PageLayout';
import PageSidebar from '../components/PageSidebar';

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
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  
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

  const tocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Why Choose Us' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'products', label: 'Our Products' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <PageLayout title={pageTitle}>
      
      {/* Floating Toggle Button - Left Side */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className={`fixed top-20 z-50 lg:z-50 bg-gray-800/90 hover:bg-gray-700 border border-gray-700 rounded-lg p-2.5 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm ${
          isSidebarVisible ? 'left-[272px]' : 'left-4'
        }`}
        aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isSidebarVisible ? (
          <XIcon size={20} className="text-white" />
        ) : (
          <Menu size={20} className="text-white" />
        )}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <PageSidebar
          tocItems={tocItems}
          contactAction={scrollToContact}
          shareUrl={window.location.href}
          categoryColor={foundCategory.color}
          isVisible={isSidebarVisible}
          onToggle={() => setIsSidebarVisible(!isSidebarVisible)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 transition-all duration-300">
          {/* Hero Section */}
          <section id="overview" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: foundCategory.color }}
            >
              <foundService.icon size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{foundService.title}</h1>
              <p className="text-xl text-gray-400">{foundService.desc}</p>
            </div>
          </div>
        </div>
      </section>

          {/* Features/Benefits Section */}
          <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Why Choose Our {foundService.title} Services?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: foundCategory.color + '20' }}>
                <Zap size={24} style={{ color: foundCategory.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Efficient</h3>
              <p className="text-gray-400">Quick turnaround times without compromising quality. We deliver results that exceed expectations.</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: foundCategory.color + '20' }}>
                <Shield size={24} style={{ color: foundCategory.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-400">Enterprise-grade security and reliability. Your project is in safe hands with our proven track record.</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: foundCategory.color + '20' }}>
                <Clock size={24} style={{ color: foundCategory.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ongoing Support</h3>
              <p className="text-gray-400">Continuous support and maintenance. We're here for you long after the project launches.</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: foundCategory.color + '20' }}>
                <Users size={24} style={{ color: foundCategory.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Team</h3>
              <p className="text-gray-400">Experienced professionals dedicated to bringing your vision to life with attention to detail.</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: foundCategory.color + '20' }}>
                <TrendingUp size={24} style={{ color: foundCategory.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Scalable Solutions</h3>
              <p className="text-gray-400">Built to grow with your business. Our solutions scale as your needs evolve.</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: foundCategory.color + '20' }}>
                <CheckCircle size={24} style={{ color: foundCategory.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Guaranteed</h3>
              <p className="text-gray-400">We stand behind our work. Quality assurance and testing are built into every project.</p>
            </div>
          </div>
        </div>
      </section>

          {/* Portfolio Section */}
          {foundService.title === 'WordPress' && (
            <section id="portfolio" className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our WordPress Services
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Explore some of our WordPress services and see how we've helped businesses grow online.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'E-Commerce Store',
                  category: 'WordPress + WooCommerce',
                  description: 'Complete e-commerce solution with custom product pages, payment integration, and inventory management.',
                  results: '300% increase in online sales',
                  features: ['Custom Theme', 'WooCommerce Setup', 'Payment Gateway', 'SEO Optimization'],
                  isPlugin: false,
                  pluginSlug: undefined
                },
                {
                  title: 'Corporate Website',
                  category: 'WordPress Custom Theme',
                  description: 'Professional corporate website with custom design, blog integration, and multilingual support.',
                  results: '150% increase in lead generation',
                  features: ['Custom Design', 'Blog System', 'Contact Forms', 'Multilingual'],
                  isPlugin: false,
                  pluginSlug: undefined
                },
                {
                  title: 'News Portal',
                  category: 'WordPress + Custom Plugins',
                  description: 'High-traffic news website with custom content management, user registration, and subscription system.',
                  results: '500K+ monthly visitors',
                  features: ['Custom CMS', 'User Dashboard', 'Subscription System', 'Fast Loading'],
                  isPlugin: false,
                  pluginSlug: undefined
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
                    {project.isPlugin && project.pluginSlug ? (
                      <button
                        onClick={() => navigate(`/services/wordpress/plugins/${project.pluginSlug}`)}
                        className="w-full mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
                        style={{ backgroundColor: foundCategory.color }}
                      >
                        View Plugin Details
                        <ExternalLink size={16} />
                      </button>
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
          </div>
        </section>
      )}

          {/* Our Products & Plugins Section */}
          {foundService.title === 'WordPress' && (
            <section id="products" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Our Products & Plugins
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Discover the WordPress plugins and themes we've created to help businesses enhance their websites.
            </p>
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
                }
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
          </div>
        </section>
      )}

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

          {/* Pricing Tiers Section */}
          <section id="pricing" className="py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            Choose Your Package
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
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
                  $500
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

          {/* Testimonials Section */}
          <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            What Our Clients Say
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what clients have to say about our {foundService.title} services.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} style={{ color: foundCategory.color }} className="fill-current" />
                  ))}
                </div>
                <Quote size={24} style={{ color: foundCategory.color }} className="mb-4 opacity-50" />
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="border-t border-gray-700/50 pt-4">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* FAQ Section */}
          <section id="faq" className="py-16 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: `How long does a typical ${foundService.title} project take?`,
                answer: `Project timelines vary based on complexity and requirements. A basic setup typically takes 2-4 weeks, while custom projects may take 4-8 weeks. We'll provide a detailed timeline during our initial consultation.`
              },
              {
                question: `What's included in the starting price?`,
                answer: `The starting price includes basic setup, essential features, and initial configuration. Additional features, customizations, and extended support can be added based on your specific needs. We'll provide a detailed breakdown in your quote.`
              },
              {
                question: `Do you provide hosting and domain services?`,
                answer: `We can help you set up hosting and domain services, or work with your existing provider. We recommend reliable hosting solutions and can guide you through the setup process.`
              },
              {
                question: `Can I update content myself after the project is complete?`,
                answer: `Yes! We build user-friendly solutions that allow you to manage and update content easily. We also provide training and documentation so you can confidently manage your site.`
              },
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
              },
              {
                question: `Will my site be mobile-responsive and SEO-optimized?`,
                answer: `Yes! All our solutions are built mobile-first and include SEO best practices. We ensure your site performs well on all devices and search engines.`
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/70 transition-colors"
                >
                  <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                  {openFAQ === idx ? (
                    <ChevronUp size={20} style={{ color: foundCategory.color }} className="flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} style={{ color: foundCategory.color }} className="flex-shrink-0" />
                  )}
                </button>
                {openFAQ === idx && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* CTA Section */}
          <section id="contact" className="py-16 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Let's discuss how we can help bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 rounded-lg font-medium text-white text-lg transition-all hover:scale-105 bg-gradient-theme"
            >
              Contact Us Today
            </button>
            <a
              href="https://wa.me/8801879729252"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors flex items-center gap-2"
            >
              <SiWhatsapp size={20} />
              WhatsApp Now
            </a>
          </div>
        </div>
        </section>
        </main>
      </div>
    </PageLayout>
  );
}

