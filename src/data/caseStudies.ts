/** Single source for service slug: title -> URL slug (DRY with ServicePage, LandingPage, ServiceModal). */
export const toServiceSlug = (title: string): string =>
  title.toLowerCase().replace(/\s+/g, '-');

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName?: string;
  services: string[];
  challenge?: string;
  solution?: string;
  results?: string;
  image?: string;
  workIds?: string[];
  projectUrl?: string;
  featured?: boolean;
}

const caseStudiesList: CaseStudy[] = [
  {
    id: '1',
    slug: 'wordpress-trendrio',
    title: 'Trendrio WordPress Site',
    clientName: 'Trendrio',
    services: ['WordPress'],
    challenge: 'Client needed a fast, brand-aligned site with WooCommerce.',
    solution: 'Custom theme, product setup, and checkout tweaks.',
    results: 'Live store with improved conversion.',
    image: '/images/images/work/wordpress-trendrio.png',
    workIds: ['wordpress-1'],
    featured: true,
  },
  {
    id: '2',
    slug: 'shopify-cloud-creative',
    title: 'Cloud Creative Shopify Store',
    clientName: 'Cloud Creative',
    services: ['Shopify'],
    challenge: 'New store needed a polished look and smooth checkout.',
    solution: 'Theme customization and layout optimization.',
    results: 'Professional store launched on schedule.',
    image: '/images/images/work/shopify-cloud-creative-1.png',
    workIds: ['shopify-1'],
    featured: true,
  },
  {
    id: '3',
    slug: 'ebay-store-banner',
    title: 'eBay Store & Banner',
    clientName: 'eCommerce Client',
    services: ['eBay', 'Brand Identity'],
    challenge: 'Stand out in a crowded marketplace.',
    solution: 'Custom storefront and listing templates.',
    results: 'Cohesive brand and clearer product presentation.',
    image: '/images/images/work/ebay-store-1.png',
    featured: false,
  },
];

export const caseStudies = caseStudiesList;

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined =>
  caseStudiesList.find((c) => c.slug === slug);

export const getCaseStudiesByService = (serviceSlug: string): CaseStudy[] =>
  caseStudiesList.filter((c) =>
    c.services.some((s) => toServiceSlug(s) === serviceSlug)
  );

export const getFeaturedCaseStudies = (): CaseStudy[] =>
  caseStudiesList.filter((c) => c.featured);
