import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

// Check if we're on the store subdomain
const isStoreSubdomain = typeof window !== 'undefined' && window.location.hostname === 'store.shalconnects.com';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  slug: string;
}

const products: Product[] = [
  {
    id: 'variation-images-pro',
    name: 'Variation Images Pro',
    category: 'WordPress Plugin',
    description: 'Add unlimited custom images to WooCommerce product variations. Transform dropdown menus into beautiful visual swatches and galleries.',
    price: '$24.99',
    slug: 'variation-images-pro'
  }
];

export default function StoreHome() {
  usePageTitle('ShalConnects Store - Premium WordPress Products');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold" style={{ color: '#2271b1' }}>ShalConnects Store</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-white py-20 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-5xl font-bold mb-5">Premium WordPress Products</h1>
          <p className="text-xl opacity-95">Professional plugins and themes to enhance your WordPress website</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20" style={{ background: '#f9f9f9' }}>
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
              >
                <div 
                  className="h-48 flex items-center justify-center text-white text-5xl"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  🖼️
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="text-xs uppercase font-semibold text-gray-600 mb-2">{product.category}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
                  <div className="text-3xl font-bold mb-6" style={{ color: '#2271b1' }}>{product.price}</div>
                  <Link
                    to={isStoreSubdomain ? `/${product.slug}` : `/store/${product.slug}`}
                    className="block text-center py-3 px-6 rounded-md font-semibold text-white transition-colors"
                    style={{ backgroundColor: '#2271b1' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#135e96'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2271b1'}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <Link to={isStoreSubdomain ? '/variation-images-pro' : '/store/variation-images-pro'} className="block text-gray-300 hover:text-white mb-2">
                Variation Images Pro
              </Link>
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

