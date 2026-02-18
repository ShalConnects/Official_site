// Featured work for landing page grid. Single source of truth.

export interface Project {
  id: number;
  title: string;
  category: string;
  color: string;
  description: string;
  results: string;
  services: string[];
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export const featuredProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    category: 'Web Development',
    color: 'from-purple-500 to-pink-500',
    description: 'A modern e-commerce platform with advanced features.',
    results: '300% increase in sales',
    services: ['WordPress', 'WooCommerce', 'Custom Development'],
  },
  {
    id: 2,
    title: 'Brand Identity',
    category: 'Design',
    color: 'from-green-500 to-emerald-500',
    description: 'Complete brand identity package for a tech startup.',
    results: '50% brand recognition increase',
    services: ['Brand Identity', 'Logo Design', 'Brand Guidelines'],
  },
  {
    id: 3,
    title: 'Mobile App',
    category: 'Development',
    color: 'from-blue-500 to-cyan-500',
    description: 'Native mobile app for iOS and Android.',
    results: '100K+ downloads',
    services: ['Android App', 'UI/UX Design', 'App Store Optimization'],
  },
  {
    id: 4,
    title: 'Shopify Store',
    category: 'E-commerce',
    color: 'from-orange-500 to-red-500',
    description: 'Custom Shopify store with unique design.',
    results: '200% conversion rate increase',
    services: ['Shopify', 'Custom Theme', 'Site Design'],
  },
];
