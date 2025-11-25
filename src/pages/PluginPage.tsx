import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

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
  const isStoreSubdomain = typeof window !== 'undefined' && window.location.hostname === 'store.shalconnects.com';

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
      price: '$24.99', // Display price
      features: [],
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
      heroImage: '/images/plugin/preview.png'
    }
  };

  const plugin = pluginData[slug as keyof typeof pluginData];
  
  // Compute page title
  const pageTitle = plugin ? plugin.name : 'Plugin';
  usePageTitle(pageTitle);

  if (!plugin) {
    return (
      <div style={{ background: '#f9f9f9', padding: '40px 20px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Plugin Not Found</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>The plugin you're looking for doesn't exist.</p>
          <Link
            to={isStoreSubdomain ? "/" : "/services/wordpress"}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '6px', backgroundColor: '#176641', color: '#fff', textDecoration: 'none', fontWeight: '600' }}
          >
            <ArrowLeft size={18} />
            {isStoreSubdomain ? "Back to Store" : "Back to WordPress Services"}
          </Link>
        </div>
      </div>
    );
  }

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
      alert('Paddle checkout is not available. Please contact support at hello@shalconnects.com');
      return;
    }

    if (!plugin.paddlePriceId && !plugin.paddleProductId) {
      console.error('Paddle Price ID or Product ID missing');
      alert('Product configuration error. Please contact support at hello@shalconnects.com');
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

      // Paddle Checkout v2 API - Try priceId first, fallback to productId
      let checkoutOptions: any;

      if (plugin.paddlePriceId) {
        // Use priceId (recommended for Paddle v2)
        checkoutOptions = {
        items: [{
            priceId: plugin.paddlePriceId,
          quantity: 1,
        }],
        settings: {
          successUrl: redirectUrl,
          displayMode: 'overlay',
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
        };
      } else {
        throw new Error('No valid Paddle product or price ID');
      }

      // Open checkout with error handling
      window.Paddle.Checkout.open(checkoutOptions);
    } catch (error) {
      console.error('Error opening Paddle checkout:', error);
      alert('Unable to open checkout. Please contact support at hello@shalconnects.com or try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold" style={{ color: '#2271b1', textDecoration: 'none' }}>
              ShalConnects Store
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-white py-20 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-5xl font-bold mb-5">{plugin.name}</h1>
          <p className="text-2xl mb-5 opacity-95">{plugin.tagline}</p>
          <p className="text-xl mb-0 opacity-95">{plugin.description}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ background: '#f9f9f9' }}>
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2271b1' }}>Unlimited Images</h3>
              <p className="text-gray-600">Add unlimited custom images to each product variation. No restrictions, no limits.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2271b1' }}>Multiple Display Styles</h3>
              <p className="text-gray-600">Circular thumbnails, grid layouts, sliders, carousels, and more. Choose what works best for your store.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl mb-4">📹</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2271b1' }}>Video Support</h3>
              <p className="text-gray-600">Add YouTube, Vimeo, or self-hosted videos to product variations for an enhanced shopping experience.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2271b1' }}>Works Everywhere</h3>
              <p className="text-gray-600">Product pages, shop pages, cart, checkout, and archive pages. Full WooCommerce integration.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2271b1' }}>Bulk Operations</h3>
              <p className="text-gray-600">Upload multiple images at once, drag-and-drop sorting, and CSV import/export for efficient management.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2271b1' }}>Page Builder Support</h3>
              <p className="text-gray-600">Dedicated widgets for Elementor, Bricks, and Divi. Works with all major page builders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 text-center bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Get Pro Version</h2>
          <div className="bg-gray-50 border-2 rounded-xl p-12 max-w-lg mx-auto" style={{ borderColor: '#2271b1' }}>
            <div className="text-6xl font-bold mb-3" style={{ color: '#2271b1' }}>{plugin.price}</div>
            <div className="text-lg text-gray-600 mb-8">One-time payment • Unlimited sites</div>
            <p className="text-gray-600 mb-8">
              Includes lifetime updates, technical support, and all Pro features.
            </p>
            <button
              onClick={handlePurchase}
              className="px-10 py-4 text-lg font-semibold text-white rounded-md transition-colors"
              style={{ backgroundColor: '#2271b1' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#135e96'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2271b1'}
            >
              Buy Now
            </button>
            <p className="text-sm text-gray-500 mt-5">
              Secure checkout powered by Paddle
            </p>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20" style={{ background: '#f9f9f9' }}>
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">See It In Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                Plugin Admin Interface
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                Visual Designer
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                Frontend Display
              </div>
            </div>
          </div>
          <p className="text-center mt-8 text-gray-600 italic">
            Add your actual screenshots here
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <Link to="/" className="block text-gray-300 hover:text-white mb-2">Store Home</Link>
              <a href="https://wordpress.org/plugins/variation-images-pro-for-woocommerce/" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white mb-2">Free Version</a>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <Link to="/terms" className="block text-gray-300 hover:text-white mb-2">Terms & Conditions</Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-white mb-2">Privacy Policy</Link>
              <Link to="/refund" className="block text-gray-300 hover:text-white mb-2">Refund Policy</Link>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <a href="mailto:hello@shalconnects.com" className="block text-gray-300 hover:text-white mb-2">Contact Support</a>
              <a href="https://wordpress.org/plugins/variation-images-pro-for-woocommerce/" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white mb-2">Documentation</a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-700 text-gray-400">
            <p>&copy; {new Date().getFullYear()} Shalauddin Kader (trading as ShalConnects). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
