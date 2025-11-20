import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, X, Download, ExternalLink, Image, Code, Zap, Palette, CheckCircle2, Settings, Plug, Menu, X as XIcon, ShoppingCart } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageSidebar from '../components/PageSidebar';
import { useState, useEffect } from 'react';

// Declare Paddle type
declare global {
  interface Window {
    Paddle?: {
      Initialize: (options: { seller?: number; token?: string; environment?: 'sandbox' | 'production' }) => void;
      Setup?: (options: { vendor: number }) => void; // Legacy v1 API
      Checkout: {
        open: (options: { 
          items?: Array<{ priceId: string; quantity?: number }>;
          product?: number | string;
          settings?: {
            successUrl?: string;
            displayMode?: 'overlay' | 'inline';
          };
        }) => void;
      };
      Environment?: {
        set: (env: 'sandbox' | 'production') => void;
      };
    };
  }
}

export default function PluginPage() {
  const { pluginSlug } = useParams<{ pluginSlug: string }>();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // Hidden by default on mobile

  // Show sidebar by default on desktop, hide on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Plugin data - will be expanded based on pluginSlug
  // CONFIGURATION REQUIRED:
  // 1. Sign up at https://paddle.com
  // 2. Create a product in Paddle dashboard
  // 3. Upload your plugin ZIP file to Paddle
  // 4. Get your Vendor ID from Settings > Account
  // 5. Get your Product ID from the product page
  // 6. Replace the IDs below
  const pluginData = {
    'variation-images-pro': {
      name: 'WooCommerce Variation Images Pro',
      tagline: 'Add custom images to product variations. Works seamlessly with all themes and page builders.',
      description: 'Variation Images Pro for WooCommerce is a powerful plugin that revolutionizes how customers select product variations. Instead of plain dropdown menus, your customers see beautiful visual swatches, image galleries, and interactive selectors that make shopping more engaging and increase conversion rates.',
      paddleProductId: 'pro_01kafwx8k4bw47cfh5w95smm7m', // Paddle Product ID
      paddlePriceId: 'pri_01kafx042cwqdh525d9ts9fj6v', // Paddle Price ID
      paddleVendorId: 252028, // Paddle Vendor ID
      price: '$49', // Display price
      features: [
        { icon: Image, title: 'Custom Images', desc: 'Add custom images to each product variation' },
        { icon: Zap, title: 'Multiple Styles', desc: 'Choose from various display styles and layouts' },
        { icon: Palette, title: 'Visual Designer', desc: 'Easy customization with built-in Visual Designer' },
        { icon: Code, title: 'Page Builders', desc: 'Works with Elementor, Divi, Bricks, and more' }
      ],
      displayStyles: [
        { name: 'Horizontal Text Boxes', description: 'Text-only buttons in a horizontal row', badge: 'Simple attributes', image: '/images/images/horizontal-text-boxes.png' },
        { name: 'Vertical Text List', description: 'Text-only buttons in a vertical list', badge: 'Simple attributes', image: '/images/images/vertical-text-list.png' },
        { name: 'Color Swatches', description: 'Circular color dots for color attributes', badge: 'Color attributes', image: '/images/images/color-swatches.png' },
        { name: 'Square Thumbnails', description: 'Square image boxes in a horizontal row', badge: 'Visual products', image: '/images/images/square-thumbnails.png', isPro: true },
        { name: 'Circular Thumbnails', description: 'Circular image boxes in a horizontal row', badge: 'Visual products', image: '/images/images/circular-thumbnails.png', isPro: true },
        { name: 'Button Style (Image First)', description: 'Vertical boxes with image thumbnails and labels', badge: 'All attributes', image: '/images/images/button-style-image-first.png', isPro: true },
        { name: 'Button Style (Text First)', description: 'Vertical boxes with labels and image thumbnails', badge: 'All attributes', image: '/images/images/button-style-text-first.png', isPro: true }
      ],
      compatibility: [
        'All WordPress Themes',
        'Elementor',
        'Divi',
        'Bricks',
        'Gutenberg',
        'WooCommerce 6.x, 7.x, 8.x'
      ],
      freeFeatures: [
        { feature: 'Display styles', free: '4 basic styles', pro: '10+ advanced styles' },
        { feature: 'Performance', free: 'Basic', pro: 'Lazy loading, CDN, optimization' },
        { feature: 'Updates', free: 'WordPress.org updates', pro: 'Your own update server' },
        { feature: 'Support', free: 'Community', pro: 'Priority support' }
      ],
      screenshots: [
        { 
          title: 'Plugin Dashboard', 
          description: 'Manage all your product variations from one central dashboard',
          image: '/images/plugin/screenshot-dashboard.png',
          alt: 'WooCommerce Variation Images Pro Dashboard'
        },
        { 
          title: 'Visual Designer', 
          description: 'Customize display styles with the intuitive visual designer',
          image: '/images/plugin/screenshot-designer.png',
          alt: 'Visual Designer Interface'
        },
        { 
          title: 'Settings Panel', 
          description: 'Configure display options and multi-attribute settings',
          image: '/images/plugin/screenshot-settings.png',
          alt: 'Plugin Settings'
        },
        { 
          title: 'Product Page Preview', 
          description: 'See how variations look on your product pages in real-time',
          image: '/images/plugin/screenshot-preview.png',
          alt: 'Product Page Preview'
        },
        { 
          title: 'Variation Management', 
          description: 'Easily add and manage images for each product variation',
          image: '/images/plugin/screenshot-variations.png',
          alt: 'Variation Management'
        },
        { 
          title: 'Frontend Display - Button Style', 
          description: 'Beautiful button-style variation selectors on your storefront',
          image: '/images/plugin/screenshot-frontend-1.png',
          alt: 'Frontend Product Page - Button Style'
        },
        { 
          title: 'Frontend Display - Square Thumbnails', 
          description: 'Square thumbnail variation selectors for visual products',
          image: '/images/plugin/screenshot-frontend-2.png',
          alt: 'Frontend Product Page - Square Thumbnails'
        },
        { 
          title: 'Frontend Display - Circular Thumbnails', 
          description: 'Circular thumbnail variation selectors with color options',
          image: '/images/plugin/screenshot-frontend-3.png',
          alt: 'Frontend Product Page - Circular Thumbnails'
        }
      ],
      heroImage: '/images/plugin/preview.png'
    }
  };

  const plugin = pluginData[pluginSlug as keyof typeof pluginData];

  if (!plugin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Plugin Not Found</h1>
          <p className="text-gray-400 mb-8">The plugin you're looking for doesn't exist.</p>
          <Link
            to="/services/wordpress"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105"
            style={{ backgroundColor: '#176641' }}
          >
            <ArrowLeft size={18} />
            Back to WordPress Services
          </Link>
        </div>
      </div>
    );
  }

  const tocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Key Features' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'comparison', label: 'Free vs Pro' },
    { id: 'display-styles', label: 'Display Styles' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'installation', label: 'Installation Guide' },
    { id: 'download', label: 'Download' }
  ];

  const scrollToContact = () => {
    navigate('/#contact', { state: { prefillService: plugin.name } });
  };

  // Initialize Paddle
  useEffect(() => {
    const initPaddle = () => {
      if (plugin && window.Paddle && plugin.paddleVendorId && plugin.paddleVendorId > 0) {
        try {
          // Paddle v2 uses Initialize instead of Setup
          // Vendor ID is the same as Seller ID
          if (window.Paddle.Initialize) {
            window.Paddle.Initialize({
              seller: plugin.paddleVendorId,
              environment: 'production', // Use 'sandbox' for testing
            });
          } else if (window.Paddle.Setup) {
            // Fallback for v1 API
            if (window.Paddle.Environment) {
              window.Paddle.Environment.set('production');
            }
            window.Paddle.Setup({ vendor: plugin.paddleVendorId });
          }
        } catch (error) {
          console.error('Error initializing Paddle:', error);
        }
      }
    };

    // Wait for Paddle to load if not already available
    if (window.Paddle) {
      initPaddle();
    } else {
      // Check periodically for Paddle to load (max 5 seconds)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds at 100ms intervals
      const checkPaddle = setInterval(() => {
        attempts++;
        if (window.Paddle) {
          clearInterval(checkPaddle);
          initPaddle();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkPaddle);
          console.warn('Paddle failed to load after 5 seconds');
        }
      }, 100);
    }
  }, [plugin]);

  // Handle Paddle checkout
  const handlePurchase = () => {
    if (!plugin || !window.Paddle || !plugin.paddleProductId) {
      console.error('Paddle not initialized or product ID missing');
      // Fallback: redirect to contact form
      scrollToContact();
      return;
    }

    try {
      // Get current URL for redirect after payment
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/download`;

      // Use Price ID for checkout (more reliable than Product ID)
      const checkoutProduct = plugin.paddlePriceId || plugin.paddleProductId;

      // Paddle Checkout v2 API
      const checkoutOptions: any = {
        items: [{
          priceId: checkoutProduct,
          quantity: 1,
        }],
        settings: {
          successUrl: redirectUrl,
          displayMode: 'overlay',
        },
      };

      window.Paddle.Checkout.open(checkoutOptions);
    } catch (error) {
      console.error('Error opening Paddle checkout:', error);
      // Fallback: redirect to contact form
      scrollToContact();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Breadcrumbs />
      
      {/* Floating Toggle Button - Mobile & Desktop */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className={`fixed top-20 z-50 bg-gray-800/90 hover:bg-gray-700 border border-gray-700 rounded-lg p-2.5 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm ${
          isSidebarVisible 
            ? 'left-[272px] lg:left-[272px]' 
            : 'left-4 lg:left-4'
        }`}
        aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isSidebarVisible ? (
          <XIcon size={20} className="text-white" />
        ) : (
          <Menu size={20} className="text-white" />
        )}
      </button>

      <div className="flex relative">
        {/* Sidebar */}
        <PageSidebar
          tocItems={tocItems}
          purchaseAction={handlePurchase}
          contactAction={scrollToContact}
          shareUrl={window.location.href}
          categoryColor="#176641"
          isVisible={isSidebarVisible}
          onToggle={() => setIsSidebarVisible(!isSidebarVisible)}
          purchaseLabel={plugin.price ? `Buy Pro - ${plugin.price}` : 'Buy Pro Version'}
        />

        {/* Main Content */}
        <main className={`flex-1 min-w-0 transition-all duration-300 ${
          isSidebarVisible ? 'lg:ml-0' : ''
        }`}>
          {/* Hero Section */}
          <section id="overview" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {plugin.name}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-8">
              {plugin.tagline}
            </p>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              {plugin.description}
            </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handlePurchase}
                className="px-8 py-4 rounded-lg font-medium text-white text-lg transition-all hover:scale-105 flex items-center gap-2 bg-gradient-theme"
              >
                  <ShoppingCart size={20} />
                  Buy Pro Version {plugin.price && `- ${plugin.price}`}
                </button>
              <a
                href="https://wordpress.org/plugins/wc-variation-images-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors flex items-center gap-2"
              >
                <ExternalLink size={20} />
                View Free Version on WordPress.org
              </a>
            </div>
            </div>
            {plugin.heroImage && (
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                  <img 
                    src={plugin.heroImage} 
                    alt={plugin.name}
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

          {/* Feature Showcase Section - EDD Style */}
          <section id="feature-showcase" className="py-16 bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
                Powerful Features, Intuitive Interface
              </h2>
              <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Everything you need to transform your WooCommerce product variations into beautiful, engaging experiences
              </p>
              
              {/* Main Showcase Container */}
              <div className="relative bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6 sm:p-8 lg:p-12 overflow-hidden">
                <div className="relative grid lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Side - Admin Interface */}
                  <div className="relative">
                    {/* Callout Box 1 - Visual Variation Management */}
                    <div className="absolute -top-4 -left-4 z-20 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl font-semibold text-sm sm:text-base whitespace-nowrap">
                      Visual Variation Management
                      <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-600"></div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mt-8">
                      {/* WordPress Admin Header */}
                      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-300 rounded w-32 mb-1"></div>
                          <div className="h-1.5 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      
                      {/* Admin Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                          <div className="h-3 bg-gray-100 rounded w-32"></div>
                        </div>
                        
                        {/* Variation Images Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded border-2 border-gray-300 flex items-center justify-center">
                              <Image size={24} className="text-gray-400" />
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="h-8 bg-blue-600 rounded text-white px-4 flex items-center text-sm font-medium">
                            Upload Image
                          </div>
                          <div className="h-8 bg-gray-200 rounded px-4 flex items-center text-sm text-gray-600">
                            Remove
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Multiple Features */}
                  <div className="space-y-6">
                    
                    {/* Display Styles Showcase */}
                    <div className="relative">
                      {/* Callout Box 2 - Multiple Display Styles */}
                      <div className="absolute -top-4 -right-4 z-20 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl font-semibold text-sm sm:text-base whitespace-nowrap">
                        Multiple Display Styles
                        <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-600"></div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mt-8 p-6">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Square Thumbnails */}
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="flex gap-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded border border-gray-300"></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Circular Thumbnails */}
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="flex gap-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full border border-gray-300"></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Color Swatches */}
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-400" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i-1] }}></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Button Style */}
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="space-y-1">
                              {[1, 2].map((i) => (
                                <div key={i} className="h-8 bg-gray-100 rounded border border-gray-300 flex items-center px-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-200 to-purple-200 rounded mr-2"></div>
                                  <div className="h-2 bg-gray-300 rounded flex-1"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Designer & Compatibility Row */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Visual Designer */}
                      <div className="relative">
                        {/* Callout Box 3 - Visual Designer */}
                        <div className="absolute -top-3 -left-3 z-20 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-xl font-semibold text-xs sm:text-sm whitespace-nowrap">
                          Visual Designer
                          <div className="absolute -bottom-1.5 left-6 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-blue-600"></div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mt-6 p-4">
                          <div className="space-y-2 mb-3">
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded border border-blue-300"></div>
                            <div className="w-8 h-8 bg-purple-100 rounded border border-purple-300"></div>
                            <div className="w-8 h-8 bg-green-100 rounded border border-green-300"></div>
                          </div>
                          <div className="h-6 bg-gray-100 rounded border border-gray-300"></div>
                        </div>
                      </div>

                      {/* Universal Compatibility */}
                      <div className="relative">
                        {/* Callout Box 4 - Universal Compatibility */}
                        <div className="absolute -top-3 -right-3 z-20 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-xl font-semibold text-xs sm:text-sm whitespace-nowrap">
                          Universal Compatibility
                          <div className="absolute -bottom-1.5 right-6 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-blue-600"></div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mt-6 p-4">
                          <div className="space-y-2">
                            {['Elementor', 'Divi', 'Bricks', 'Gutenberg'].map((name, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                <span className="text-xs text-gray-600 font-medium">{name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Screenshots Section */}
          {plugin.screenshots && plugin.screenshots.length > 0 && (
            <section id="screenshots" className="py-16 bg-gray-800/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
                  See It In Action
                </h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                  Explore the powerful features and intuitive interface of Variation Images Pro
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plugin.screenshots.map((screenshot, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all hover:scale-105 group"
                    >
                      <div className="relative overflow-hidden bg-gray-900">
                        <img 
                          src={screenshot.image} 
                          alt={screenshot.alt}
                          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.parentElement?.querySelector('.placeholder-icon');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div className="placeholder-icon hidden absolute inset-0 items-center justify-center bg-gray-800">
                          <Image size={48} style={{ color: '#176641' }} className="opacity-50" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{screenshot.title}</h3>
                        <p className="text-gray-400 text-sm">{screenshot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Features Section */}
          <section id="features" className="py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plugin.features.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#17664120' }}>
                    <FeatureIcon size={24} style={{ color: '#176641' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

          {/* Screenshots Section */}
          {plugin.screenshots && plugin.screenshots.length > 0 && (
            <section id="screenshots" className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
                  See It In Action
                </h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                  Explore the powerful features and intuitive interface of Variation Images Pro
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plugin.screenshots.map((screenshot, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all hover:scale-105 group"
                    >
                      <div className="relative overflow-hidden bg-gray-900">
                        <img 
                          src={screenshot.image} 
                          alt={screenshot.alt}
                          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.parentElement?.querySelector('.placeholder-icon');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div className="placeholder-icon hidden absolute inset-0 items-center justify-center bg-gray-800">
                          <Image size={48} style={{ color: '#176641' }} className="opacity-50" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{screenshot.title}</h3>
                        <p className="text-gray-400 text-sm">{screenshot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Free vs Pro Comparison Table */}
          <section id="comparison" className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            Free vs Pro Comparison
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Compare the features available in the free version versus the Pro version.
          </p>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left px-4 sm:px-6 py-4 text-white font-semibold text-sm sm:text-base">Feature</th>
                      <th className="text-center px-4 sm:px-6 py-4 text-white font-semibold text-sm sm:text-base">Free Version</th>
                      <th className="text-center px-4 sm:px-6 py-4 text-white font-semibold text-sm sm:text-base" style={{ color: '#da651e' }}>Pro Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plugin.freeFeatures.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-700/30 hover:bg-gray-800/70 transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-gray-300 text-sm sm:text-base">{item.feature}</td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          {typeof item.free === 'boolean' ? (
                            item.free ? (
                              <CheckCircle size={20} className="mx-auto text-green-500" />
                            ) : (
                              <X size={20} className="mx-auto text-gray-600" />
                            )
                          ) : (
                            <span className="text-gray-400 text-sm sm:text-base">{item.free}</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          {typeof item.pro === 'boolean' ? (
                            item.pro ? (
                              <CheckCircle size={20} className="mx-auto" style={{ color: '#da651e' }} />
                          ) : (
                            <X size={20} className="mx-auto text-gray-600" />
                          )
                        ) : (
                          <span className="text-sm sm:text-base" style={{ color: '#da651e' }}>{item.pro}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* Display Styles Section */}
          <section id="display-styles" className="py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            See It In Action
          </h2>
          <p className="text-center text-gray-400 mb-4 max-w-2xl mx-auto">
            Choose from 7 different display styles
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 justify-items-center">
            {plugin.displayStyles.map((style, idx) => (
              <div
                key={idx}
                className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105 overflow-hidden w-full max-w-sm"
              >
                <div 
                  className="h-48 flex items-center justify-center relative"
                  style={{ 
                    background: '#fafafa',
                    borderBottom: '2px solid #17664130'
                  }}
                >
                  <img 
                    src={style.image} 
                    alt={style.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.parentElement?.querySelector('.placeholder-icon');
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="placeholder-icon hidden absolute inset-0 items-center justify-center">
                    <Image size={48} style={{ color: '#176641' }} className="opacity-50" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{style.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{style.description}</p>
                  <span 
                    className={`inline-block text-xs px-2 py-1 rounded-full ${
                      style.isPro 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                        : 'bg-gray-700/50 text-gray-300 border border-gray-600/50'
                    }`}
                  >
                    {style.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* Compatibility Section */}
          <section id="compatibility" className="py-16 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Universal Compatibility
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plugin.compatibility.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50"
              >
                <CheckCircle2 size={20} style={{ color: '#176641' }} className="flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* Installation Guide Section */}
          <section id="installation" className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            How to Install the Plugin
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose your installation method based on whether you're using the free or pro version.
          </p>

          {/* Free Version Instructions */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#17664120' }}>
                <Plug size={18} className="sm:w-5 sm:h-5" style={{ color: '#176641' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">Free Version (WordPress.org)</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Access WordPress Admin</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Log in to your WordPress admin dashboard and navigate to <strong className="text-white">Plugins → Add New</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Search for the Plugin</h4>
                    <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                      In the search box, type <strong className="text-white">"Variation Images Pro"</strong> or <strong className="text-white">"WooCommerce Variation Images"</strong>.
                    </p>
                    <p className="text-sm text-gray-500">Look for the plugin by ShalConnects in the search results.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Install & Activate</h4>
                    <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                      Click <strong className="text-white">"Install Now"</strong> on the plugin card, then click <strong className="text-white">"Activate"</strong> once installation completes.
                    </p>
                    <p className="text-sm text-gray-500">The free version will automatically update through WordPress.org.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Version Instructions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#da651e20' }}>
                <Download size={18} className="sm:w-5 sm:h-5" style={{ color: '#da651e' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">Pro Version (Manual Upload)</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Purchase & Download the Plugin</h4>
                    <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                      Click the "Buy Pro Version" button above to purchase. After payment, you'll receive an email with the download link for the Pro plugin ZIP file.
                    </p>
                    <p className="text-sm text-gray-500">Keep the ZIP file ready - do not extract it.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Access WordPress Admin</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Log in to your WordPress admin dashboard and navigate to <strong className="text-white">Plugins → Add New</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Upload the Plugin</h4>
                    <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                      Click the <strong className="text-white">"Upload Plugin"</strong> button at the top of the page, then click <strong className="text-white">"Choose File"</strong> and select the downloaded ZIP file.
                    </p>
                    <p className="text-sm text-gray-500">Make sure you're uploading the ZIP file, not extracting it first.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    4
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Install & Activate</h4>
                    <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                      Click <strong className="text-white">"Install Now"</strong> and wait for the installation to complete. Once done, click <strong className="text-white">"Activate Plugin"</strong>.
                    </p>
                    <p className="text-sm text-gray-500">The plugin will now be active and ready to use.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    5
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Enter License Key</h4>
                    <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                      Go to <strong className="text-white">WooCommerce → Settings → Products → Variation Images</strong> and enter your license key to receive automatic updates and premium support.
                    </p>
                    <p className="text-sm text-gray-500">Your license key was sent to your email after purchase.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Section (Common for both) */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#17664120' }}>
                <Settings size={20} className="sm:w-6 sm:h-6" style={{ color: '#176641' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Configure Settings (Both Versions)</h3>
                <p className="text-gray-400 mb-3 text-sm sm:text-base leading-relaxed">
                  After activation, go to <strong className="text-white">WooCommerce → Settings → Products → Variation Images</strong> to configure the plugin settings and customize how variation images are displayed.
                </p>
                <p className="text-sm text-gray-500">You can choose display styles, enable features, and customize the appearance to match your store's design.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* Download Section */}
          <section id="download" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Download the Pro version now and unlock all premium features.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handlePurchase}
              className="px-8 py-4 rounded-lg font-medium text-white text-lg transition-all hover:scale-105 flex items-center gap-2 bg-gradient-theme"
            >
              <ShoppingCart size={20} />
              Buy Pro Version {plugin.price && `- ${plugin.price}`}
            </button>
            <a
              href="https://wordpress.org/plugins/wc-variation-images-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink size={20} />
              Try Free Version
            </a>
          </div>
          </div>
        </section>
        </main>
      </div>
    </div>
  );
}

