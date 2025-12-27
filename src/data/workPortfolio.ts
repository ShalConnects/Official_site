// Work Portfolio Data
// Add your work images here with their associated services

export interface WorkImage {
  id: string;
  image: string; // Path to image in public/images/images/work/
  title: string;
  description?: string;
  services: string[]; // Service names that this work belongs to (e.g., ['WordPress', 'Shopify'])
  category?: string; // Optional category like 'e-commerce', 'design', etc.
  projectUrl?: string; // Optional link to live project
}

// TODO: Add your actual work images here
// Place images in: public/images/images/work/
// Then add entries below with the image path and service associations
// Note: Use /images/images/work/ in the path (not /images/work/)

export const workPortfolio: WorkImage[] = [
  // Example entries - replace with your actual work
  // {
  //   id: 'wp-project-1',
  //   image: '/images/work/wordpress-project-1.png',
  //   title: 'E-commerce WordPress Site',
  //   description: 'Custom WooCommerce store with modern design',
  //   services: ['WordPress'],
  //   category: 'e-commerce',
  //   projectUrl: 'https://example.com'
  // },
  // {
  //   id: 'shopify-project-1',
  //   image: '/images/work/shopify-store-1.png',
  //   title: 'Shopify Store Design',
  //   description: 'Beautiful Shopify store with custom theme',
  //   services: ['Shopify'],
  //   category: 'e-commerce'
  // },
  // Add more entries as needed...

  {
    id: 'banner-1',
    image: '/images/images/work/Banner_1.jpg',
    title: 'eBay Banner Design',
    description: 'Professional banner design for eBay store',
    services: ['eBay'],
    category: 'e-commerce'
  },
  {
    id: 'banner-2',
    image: '/images/images/work/Banner (1).png',
    title: 'eBay Store Banner',
    description: 'Custom banner design for eBay listing',
    services: ['eBay'],
    category: 'e-commerce'
  },
  {
    id: 'banner-3',
    image: '/images/images/work/Banner (2).jpg',
    title: 'eBay Promotional Banner',
    description: 'Eye-catching promotional banner',
    services: ['eBay'],
    category: 'e-commerce'
  },
  {
    id: 'banner-4',
    image: '/images/images/work/Banner (3).jpg',
    title: 'eBay Product Banner',
    description: 'Product showcase banner design',
    services: ['eBay'],
    category: 'e-commerce'
  },
  {
    id: 'banner-5',
    image: '/images/images/work/Banner (4).jpg',
    title: 'eBay Marketing Banner',
    description: 'Marketing banner for eBay store',
    services: ['eBay'],
    category: 'e-commerce'
  },
  {
    id: 'banner-6',
    image: '/images/images/work/Banner (5).jpg',
    title: 'eBay Seasonal Banner',
    description: 'Seasonal promotional banner',
    services: ['eBay'],
    category: 'e-commerce'
  }

];

// Helper function to get all unique services from portfolio
export const getAllServices = (): string[] => {
  const services = new Set<string>();
  workPortfolio.forEach(work => {
    work.services.forEach(service => services.add(service));
  });
  return Array.from(services).sort();
};

// Helper function to get work by service
export const getWorkByService = (serviceName: string): WorkImage[] => {
  return workPortfolio.filter(work => 
    work.services.some(service => 
      service.toLowerCase() === serviceName.toLowerCase()
    )
  );
};

// Helper function to shuffle array (for landing page)
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

