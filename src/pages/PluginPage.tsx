import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Image, Code, Zap, Palette, Settings, Plug, Menu, X as XIcon, ShoppingCart, Shield } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageSidebar from '../components/PageSidebar';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { useState, useEffect } from 'react';
import { isStoreContext, getStoreHomePath } from '../utils/storeUtils';
import { getPrice } from '../data/productsPlugins';

// Declare Paddle type
declare global {
  interface Window {
    Paddle?: {
      Initialize: (options: { seller?: number; token?: string }) => void;
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
  const { pluginSlug, productSlug } = useParams<{ pluginSlug?: string; productSlug?: string }>();
  const slug = pluginSlug || productSlug;
  const navigate = useNavigate();
  const isStoreSubdomain = isStoreContext();
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // Hidden by default - user must click burger to open
  const [downloadStats, setDownloadStats] = useState<{
    free: { today: number; yesterday: number; last7days: number; allTime: number; lastUpdated?: string | null };
    premium: { today: number; yesterday: number; last7days: number; allTime: number; lastUpdated?: string | null };
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch download statistics
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const response = await fetch('/api/get-download-stats');
        if (response.ok) {
          const data = await response.json();
          setDownloadStats(data);
          console.log('Download stats loaded:', data);
        } else {
          throw new Error(`API returned ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching download statistics:', error);
        // In local development, API routes don't work (they're Vercel serverless functions)
        // Show mock data so the component is visible
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocalDev) {
          setStatsError('Note: Stats API works in production. Showing placeholder data.');
          // Set mock data for local development
          const now = new Date().toISOString();
          setDownloadStats({
            free: { today: 0, yesterday: 1, last7days: 9, allTime: 120, lastUpdated: now },
            premium: { today: 0, yesterday: 0, last7days: 0, allTime: 0, lastUpdated: now }
          });
        } else {
          setStatsError('Unable to load download statistics');
          setDownloadStats({
            free: { today: 0, yesterday: 0, last7days: 0, allTime: 0, lastUpdated: null },
            premium: { today: 0, yesterday: 0, last7days: 0, allTime: 0, lastUpdated: null }
          });
        }
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to format "Last updated" time
  const formatLastUpdated = (timestamp: string | null | undefined): string => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  // Plugin data - will be expanded based on slug
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
        { feature: 'Display styles', free: '3 basic styles', pro: '7 styles total' },
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
      heroImage: '/images/plugin/preview.png',
      paidOnly: false
    },
    'notipress': {
      name: 'Notipress',
      tagline: 'Hide annoying admin notifications. Cleaner WordPress dashboard.',
      description: 'Notipress hides third-party plugin notices (rating requests, promos, update nags) so you can focus. Toggle "Hide All" or click × on any notice to hide it. WordPress core errors and warnings stay visible.',
      paddleProductId: '',
      paddlePriceId: 'pri_01khd9vscmynzpd3655cd1trrx',
      paddleVendorId: 252028,
      features: [
        { icon: Zap, title: 'Hide All', desc: 'One toggle to hide all third-party notices' },
        { icon: Settings, title: 'Per-Notice', desc: 'Click × on any notice to hide it' },
        { icon: Shield, title: 'Core Safe', desc: 'Errors and warnings always visible' },
        { icon: Code, title: 'Lightweight', desc: 'Minimal code, no bloat' }
      ],
      displayStyles: [],
      freeFeatures: [],
      screenshots: [],
      heroImage: '/images/plugin/notipress-preview.png',
      paidOnly: true,
      tocItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'features', label: 'Features' },
        { id: 'installation', label: 'Installation' },
        { id: 'download', label: 'Download' }
      ]
    }
  };

  const plugin = pluginData[slug as keyof typeof pluginData];
  
  // Compute page title
  const pageTitle = plugin ? plugin.name : 'Plugin';

  if (!plugin) {
    return (
      <PageLayout title="Plugin Not Found">
        <div className="flex items-center justify-center p-4 min-h-[60vh]">
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Plugin Not Found</h1>
          <p className="text-gray-400 mb-8">The plugin you're looking for doesn't exist.</p>
          <Link
            to={isStoreSubdomain ? "/" : "/services/wordpress"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105"
            style={{ backgroundColor: '#176641' }}
          >
            <ArrowLeft size={18} />
            {isStoreSubdomain ? "Back to Store" : "Back to WordPress Services"}
          </Link>
        </div>
      </div>
      </PageLayout>
    );
  }

  const defaultToc = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Key Features' },
    { id: 'comparison', label: 'Free vs Pro' },
    { id: 'display-styles', label: 'Display Styles' },
    { id: 'installation', label: 'Installation Guide' },
    { id: 'download', label: 'Download' }
  ];
  const tocItems = 'tocItems' in plugin && plugin.tocItems ? plugin.tocItems : defaultToc;

  const price = getPrice(slug ?? '');
  const purchaseLabel = plugin.paidOnly ? (price ? `Buy - ${price}` : 'Buy') : (price ? `Buy Pro - ${price}` : 'Buy Pro Version');
  const afterPaymentCopy = <>After payment, you&apos;ll receive a receipt by email. Use the Transaction ID on that receipt at the <Link to="/download" className="text-green-400 hover:underline">download page</Link> to download your plugin ZIP.</>;
  const purchaseStepCopy = plugin.paidOnly ? <>Click the &quot;Buy&quot; button above to purchase. {afterPaymentCopy}</> : <>Click the &quot;Buy Pro Version&quot; button above to purchase. {afterPaymentCopy}</>;
  const downloadCtaCopy = plugin.paidOnly ? 'Download now and unlock all features.' : 'Download the Pro version now and unlock all premium features.';

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
          // Note: Environment is determined by the seller ID (production vs sandbox seller)
          if (window.Paddle.Initialize) {
            console.log('Initializing Paddle with seller ID:', plugin.paddleVendorId);
            window.Paddle.Initialize({
              seller: plugin.paddleVendorId,
            });
            console.log('Paddle initialized successfully');
          } else if (window.Paddle.Setup) {
            // Fallback for v1 API
            console.log('Using Paddle v1 API');
            if (window.Paddle.Environment) {
              window.Paddle.Environment.set('production');
            }
            window.Paddle.Setup({ vendor: plugin.paddleVendorId });
          }
        } catch (error) {
          console.error('Error initializing Paddle:', error);
        }
      } else {
        if (!plugin) console.warn('Plugin data not available');
        if (!window.Paddle) console.warn('Paddle script not loaded');
        if (!plugin?.paddleVendorId) console.warn('Paddle Vendor ID missing');
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
    if (!plugin || !window.Paddle) {
      console.error('Paddle not initialized');
      scrollToContact();
      return;
    }

    if (!plugin.paddlePriceId && !plugin.paddleProductId) {
      console.error('Paddle Price ID or Product ID missing');
      scrollToContact();
      return;
    }

    try {
      // Get current URL for redirect after payment
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/download`;

      console.log('Opening Paddle checkout with:', {
        priceId: plugin.paddlePriceId,
        productId: plugin.paddleProductId,
        vendorId: plugin.paddleVendorId,
        redirectUrl,
      });

      // Set up Paddle event listeners BEFORE opening checkout
      // Paddle Checkout v2 events - try multiple event names
      const handleCheckoutEvent = (event: any) => {
        console.log('Paddle checkout event received:', event);
        console.log('Event type:', event.type);
        console.log('Event detail:', event.detail);
        
        // Try multiple ways to extract transaction ID
        const transactionId = 
          event?.detail?.transactionId || 
          event?.detail?.transaction?.id ||
          event?.detail?.id ||
          event?.transactionId ||
          event?.transaction?.id ||
          event?.id;
        
        if (transactionId) {
          console.log('✅ Transaction ID captured from event:', transactionId);
          sessionStorage.setItem('paddle_transaction_id', transactionId);
          // Also try to update URL if possible
          if (window.location.pathname === '/download') {
            const url = new URL(window.location.href);
            url.searchParams.set('transaction', transactionId);
            window.history.replaceState({}, '', url.toString());
          }
        } else {
          console.warn('⚠️ Transaction ID not found in event:', event);
        }
      };

      // Listen for ALL possible Paddle checkout events
      const eventNames = [
        'paddle:checkout:completed',
        'paddle:checkout:transaction-completed',
        'paddle:checkout:close',
        'checkout:completed',
        'checkout:transaction-completed',
      ];

      eventNames.forEach(eventName => {
        window.addEventListener(eventName, handleCheckoutEvent);
        console.log(`Listening for event: ${eventName}`);
      });

      // Paddle Checkout v2 API - Try priceId first, fallback to productId
      let checkoutOptions: any;

      if (plugin.paddlePriceId) {
        // Use priceId (recommended for Paddle v2)
        // Add event callbacks if available
        checkoutOptions = {
          items: [{
            priceId: plugin.paddlePriceId,
            quantity: 1,
          }],
          settings: {
            successUrl: redirectUrl,
            displayMode: 'overlay',
            // Try to get transaction ID in success URL
            // Paddle should append _ptxn parameter, but we'll also listen for events
          },
          // Add event callbacks if Paddle v2 supports them
          onComplete: (data: any) => {
            console.log('Paddle onComplete callback:', data);
            if (data?.transactionId) {
              sessionStorage.setItem('paddle_transaction_id', data.transactionId);
              console.log('✅ Transaction ID from onComplete:', data.transactionId);
            }
          },
        };
      } else if (plugin.paddleProductId) {
        // Fallback to productId
        checkoutOptions = {
          product: plugin.paddleProductId,
          settings: {
            successUrl: redirectUrl,
            displayMode: 'overlay',
          },
          onComplete: (data: any) => {
            console.log('Paddle onComplete callback:', data);
            if (data?.transactionId) {
              sessionStorage.setItem('paddle_transaction_id', data.transactionId);
              console.log('✅ Transaction ID from onComplete:', data.transactionId);
            }
          },
        };
      } else {
        throw new Error('No valid Paddle product or price ID');
      }

      // Open checkout with error handling
      console.log('Opening Paddle checkout with options:', checkoutOptions);
      window.Paddle.Checkout.open(checkoutOptions);
    } catch (error) {
      console.error('Error opening Paddle checkout:', error);
      alert('Unable to open checkout. Please contact support or try again later.');
      scrollToContact();
    }
  };

  return (
    <PageLayout title={pageTitle}>
      
      {/* Floating Toggle Button - Mobile & Desktop */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className={`fixed top-16 sm:top-20 z-50 bg-gray-800/90 hover:bg-gray-700 border border-gray-700 rounded-lg p-2 sm:p-2.5 transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm ${
          isSidebarVisible 
            ? 'left-[272px] lg:left-[272px]' 
            : 'left-2 sm:left-4 lg:left-4'
        }`}
        aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isSidebarVisible ? (
          <XIcon size={18} className="sm:w-5 sm:h-5 text-white" />
        ) : (
          <Menu size={18} className="sm:w-5 sm:h-5 text-white" />
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
          purchaseLabel={purchaseLabel}
        />

        {/* Main Content */}
        <main className={`flex-1 min-w-0 transition-all duration-300 ${
          isSidebarVisible ? 'lg:ml-0' : ''
        }`}>
          {/* Hero Section */}
          <section id="overview" className="py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={getStoreHomePath()} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6">
            <ArrowLeft size={16} /> Store
          </Link>
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6">
              {plugin.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-4 sm:mb-6 md:mb-8">
              {plugin.tagline}
            </p>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              {plugin.description}
            </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={handlePurchase}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-white text-base sm:text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 bg-gradient-theme"
              >
                  <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                  {purchaseLabel}
                </button>
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
          <section id="feature-showcase" className="py-8 sm:py-12 md:py-16 bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {slug === 'notipress' && (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center px-2">
                    See the difference
                  </h2>
                  <p className="text-sm sm:text-base text-center text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
                    Drag the slider to compare your admin with and without Notipress.
                  </p>
                  <div className="relative bg-gray-800/30 rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 overflow-hidden">
                    <BeforeAfterSlider
                      beforeSrc="/images/plugin/notipress-after.png"
                      afterSrc="/images/plugin/notipress-before.png"
                      beforeLabel="With notifications"
                      afterLabel="With Notipress"
                      alt="WordPress admin before and after Notipress"
                    />
                  </div>
                </>
              )}
              {slug !== 'notipress' && (
                <>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center px-2">
                    Powerful Features, Intuitive Interface
                  </h2>
                  <p className="text-sm sm:text-base text-center text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2">
                    Everything you need to transform your WooCommerce product variations into beautiful, engaging experiences
                  </p>
                  <div className="relative bg-gray-800/30 rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
                    <div className="relative space-y-6 sm:space-y-8">
                  
                  {/* Top Row - Screenshots */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
                    {/* Visual Designer */}
                    <div className="relative flex flex-col">
                      <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 lg:-top-4 lg:-left-4 z-20 bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-lg shadow-xl font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap max-w-[calc(100%-1rem)] sm:max-w-none overflow-hidden text-ellipsis">
                        Visual Designer
                        <div className="absolute -bottom-1.5 sm:-bottom-2 left-4 sm:left-6 lg:left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 sm:border-l-6 sm:border-r-6 sm:border-t-6 lg:border-l-8 lg:border-r-8 lg:border-t-8 border-transparent border-t-blue-600"></div>
                    </div>
                    
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mt-6 sm:mt-7 lg:mt-8 flex-1 flex items-center justify-center">
                        <img 
                          src="/images/screenshot-visual-designer.png" 
                          alt="Visual Designer Interface"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        </div>
                      </div>
                      
                    {/* Visual Variation Management */}
                    <div className="relative flex flex-col">
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 lg:-top-4 lg:-right-4 z-20 bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-lg shadow-xl font-semibold text-xs sm:text-sm lg:text-base max-w-[calc(100%-1rem)] sm:max-w-none">
                        <span className="whitespace-normal sm:whitespace-nowrap break-words">Visual Variation Management</span>
                        <div className="absolute -bottom-1.5 sm:-bottom-2 right-4 sm:right-6 lg:right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 sm:border-l-6 sm:border-r-6 sm:border-t-6 lg:border-l-8 lg:border-r-8 lg:border-t-8 border-transparent border-t-blue-600"></div>
                      </div>
                        
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mt-6 sm:mt-7 lg:mt-8 flex-1 flex items-center justify-center">
                        <img 
                          src="/images/screenshot-visual-variation-management.png" 
                          alt="Visual Variation Management Interface"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                            </div>
                    </div>
                  </div>

                  {/* Bottom Row - Features */}
                  <div className="flex justify-center">
                    {/* Multiple Display Styles */}
                    <div className="relative max-w-2xl w-full">
                      <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 lg:-top-4 lg:-left-4 z-20 bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-lg shadow-xl font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap max-w-[calc(100%-1rem)] sm:max-w-none overflow-hidden text-ellipsis">
                        Multiple Display Styles
                        <div className="absolute -bottom-1.5 sm:-bottom-2 left-4 sm:left-6 lg:left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 sm:border-l-6 sm:border-r-6 sm:border-t-6 lg:border-l-8 lg:border-r-8 lg:border-t-8 border-transparent border-t-blue-600"></div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden mt-6 sm:mt-7 lg:mt-8 p-4 sm:p-5 lg:p-6">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {/* Square Thumbnails */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-24 mb-1 sm:mb-2"></div>
                            <div className="flex gap-1 sm:gap-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded border border-gray-300"></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Circular Thumbnails */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-24 mb-1 sm:mb-2"></div>
                            <div className="flex gap-1 sm:gap-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full border border-gray-300"></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Color Swatches */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-24 mb-1 sm:mb-2"></div>
                            <div className="flex gap-1 sm:gap-2">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-gray-400" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i-1] }}></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Button Style */}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-24 mb-1 sm:mb-2"></div>
                            <div className="space-y-0.5 sm:space-y-1">
                              {[1, 2].map((i) => (
                                <div key={i} className="h-6 sm:h-7 lg:h-8 bg-gray-100 rounded border border-gray-300 flex items-center px-1.5 sm:px-2">
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-200 to-purple-200 rounded mr-1 sm:mr-2"></div>
                                  <div className="h-1.5 sm:h-2 bg-gray-300 rounded flex-1"></div>
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
                </>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-8 sm:py-12 md:py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center px-2">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {plugin.features.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-800/50 p-4 sm:p-5 md:p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:scale-105"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4" style={{ backgroundColor: '#17664120' }}>
                    <FeatureIcon size={20} className="sm:w-6 sm:h-6" style={{ color: '#176641' }} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

          {/* Installation Guide Section */}
          <section id="installation" className="py-8 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center px-2">
            How to Install the Plugin
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2">
            {plugin.paidOnly
              ? "Install the plugin after purchase by following these steps."
              : "Choose your installation method based on whether you're using the free or pro version."}
          </p>

          {!plugin.paidOnly && (
          /* Free Version Instructions */
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
          )}

          {/* Pro / Paid Version Instructions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#da651e20' }}>
                <Download size={18} className="sm:w-5 sm:h-5" style={{ color: '#da651e' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">{plugin.paidOnly ? 'Installation' : 'Pro Version (Manual Upload)'}</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700/50 text-gray-400 font-semibold text-xs sm:text-sm">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Purchase & Download the Plugin</h4>
                    <p className="text-gray-400 text-sm mb-2 leading-relaxed">{purchaseStepCopy}</p>
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

            </div>
          </div>

          {/* Configuration Section */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#17664120' }}>
                <Settings size={20} className="sm:w-6 sm:h-6" style={{ color: '#176641' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{plugin.paidOnly ? 'Configure Settings' : 'Configure Settings (Both Versions)'}</h3>
                <p className="text-gray-400 mb-3 text-sm sm:text-base leading-relaxed">
                  {plugin.paidOnly
                    ? "After activation, find Notipress settings under Settings → Notipress in your WordPress dashboard."
                    : <>After activation, the plugin will show up in WordPress dashboard in a separate menu called <strong className="text-white">Variation Images</strong>. Under that menu, it will have <strong className="text-white">Variation images</strong> and <strong className="text-white">Settings</strong>, two submenus.</>}
                </p>
                {!plugin.paidOnly && <p className="text-sm text-gray-500">You can choose display styles, enable features, and customize the appearance to match your store's design.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* Download Section */}
          <section id="download" className="py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 px-2">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-7 md:mb-8 px-2">
            {downloadCtaCopy}
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={handlePurchase}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-white text-base sm:text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 bg-gradient-theme"
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              {purchaseLabel}
            </button>
          </div>
          
          {/* Download Statistics - Side by Side Cards */}
          {downloadStats && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 px-2">
              {/* Premium Version Card - First */}
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5 md:p-6 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px]">
                <div className="text-center">
                  <div className="text-sm sm:text-base font-medium text-gray-300 mb-2">Premium Version</div>
                  <div className="text-xs text-gray-400 mb-1 break-words">(ShalConnects.com)</div>
                  {statsLoading ? (
                    <div className="text-gray-500 text-xs">Loading...</div>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 break-words">
                        {downloadStats.premium.allTime.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mb-2">All Time Downloads</div>
                      {downloadStats.premium.lastUpdated && (
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Updated {formatLastUpdated(downloadStats.premium.lastUpdated)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {!plugin.paidOnly && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-5 md:p-6 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px]">
                <div className="text-center">
                  <div className="text-sm sm:text-base font-medium text-gray-300 mb-2">Free Version</div>
                  <div className="text-xs text-gray-400 mb-1 break-words">(WordPress.org)</div>
                  {statsLoading ? (
                    <div className="text-gray-500 text-xs">Loading...</div>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 break-words">
                        {downloadStats.free.allTime.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mb-2">All Time Downloads</div>
                      {downloadStats.free.lastUpdated && (
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Updated {formatLastUpdated(downloadStats.free.lastUpdated)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              )}
            </div>
          )}
          
          </div>
        </section>
        </main>
      </div>
    </PageLayout>
  );
}

