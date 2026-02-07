// Products & Plugins data - used on service pages (filtered by service) and anywhere we need the full list

export interface ProductPlugin {
  id: string;
  title: string;
  category: string;
  description: string;
  results: string;
  features: string[];
  isPlugin: boolean;
  pluginSlug?: string;
  price?: string;
  imagePath?: string;
  services: string[]; // Service names this product belongs to (e.g. ['WordPress'])
}

export const productsPlugins: ProductPlugin[] = [
  {
    id: 'variation-images-pro',
    title: 'Variation Images Pro',
    category: 'WooCommerce Plugin',
    description: 'Transform product variation selection with beautiful visual swatches, galleries, and interactive selectors.',
    results: '250% increase in conversion rate',
    features: ['Visual Swatches', 'Image Galleries', 'Video Support', 'Bulk Operations'],
    isPlugin: true,
    pluginSlug: 'variation-images-pro',
    price: '$24.99',
    imagePath: '/images/plugin/preview.png',
    services: ['WordPress']
  }
];

/** Get products/plugins for a given service (e.g. WordPress, Wix). Used on service pages. */
export function getProductsByService(serviceName: string): ProductPlugin[] {
  return productsPlugins.filter((p) =>
    p.services.some((s) => s.toLowerCase() === serviceName.toLowerCase())
  );
}

/** Get all products/plugins. Use on homepage or when no service filter is needed. */
export function getAllProductsPlugins(): ProductPlugin[] {
  return [...productsPlugins];
}
