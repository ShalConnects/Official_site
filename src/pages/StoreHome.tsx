import { Link } from 'react-router-dom';
import { Package, Image, Code, Palette, Zap, CheckCircle } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { isStoreContext } from '../utils/storeUtils';

// Check if we're on the store subdomain or store routes
const isStoreSubdomain = isStoreContext();

interface Product {
  id: string;
  name: string;
  category: 'plugin' | 'theme' | 'other';
  description: string;
  price: string;
  icon: typeof Package;
  slug: string;
  features: string[];
}

const products: Product[] = [
  {
    id: 'variation-images-pro',
    name: 'Variation Images Pro',
    category: 'plugin',
    description: 'Add unlimited custom images to WooCommerce product variations. Transform dropdown menus into beautiful visual swatches and galleries.',
    price: '$24.99',
    icon: Image,
    slug: 'variation-images-pro',
    features: [
      'Unlimited images per variation',
      'Multiple display styles',
      'Easy customization',
      'Page builder widgets'
    ]
  },
  // Add more products here as you create them
  // {
  //   id: 'theme-name',
  //   name: 'Your Theme Name',
  //   category: 'theme',
  //   description: 'Theme description...',
  //   price: '$XX.XX',
  //   icon: Palette,
  //   slug: 'theme-name',
  //   features: ['Feature 1', 'Feature 2']
  // }
];

const categoryColors = {
  plugin: '#2271b1',
  theme: '#a855f7',
  other: '#176641'
};

const categoryLabels = {
  plugin: 'WordPress Plugin',
  theme: 'WordPress Theme',
  other: 'Other'
};

export default function StoreHome() {
  return (
    <PageLayout title="Store - ShalConnects">
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <div 
          className="text-white py-20 relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.3), rgba(17, 24, 39, 1), rgba(218, 101, 30, 0.2))'
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(21, 102, 65, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(218, 101, 30, 0.3) 0%, transparent 50%)'
          }}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl font-bold mb-4">Premium WordPress Products</h1>
            <p className="text-xl opacity-90">Professional plugins and themes to enhance your WordPress website</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Products</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const Icon = product.icon;
                const categoryColor = categoryColors[product.category];
                
                return (
                  <Link
                    key={product.id}
                    to={isStoreSubdomain ? `/${product.slug}` : `/store/${product.slug}`}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden hover:border-gray-600/50 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Product Image */}
                    <div 
                      className="h-48 flex items-center justify-center text-white overflow-hidden relative"
                      style={{ background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)` }}
                    >
                      <img 
                        src="/images/plugin/preview.png" 
                        alt={product.name}
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
                      <div className="fallback-icon hidden absolute inset-0 items-center justify-center">
                        <Icon className="h-20 w-20 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                        style={{ backgroundColor: categoryColor }}
                      >
                        {categoryLabels[product.category]}
                      </span>

                      {/* Product Name */}
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {product.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-4">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-400">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-3xl font-bold text-white">{product.price}</span>
                        <span className="text-sm text-gray-400">View Details →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-gray-800/30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Zap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Instant Download</h3>
                <p className="text-sm text-gray-400">Get your product immediately after purchase</p>
              </div>
              <div>
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">30-Day Guarantee</h3>
                <p className="text-sm text-gray-400">Full refund if not satisfied</p>
              </div>
              <div>
                <Code className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Lifetime Updates</h3>
                <p className="text-sm text-gray-400">Free updates for purchased version</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

