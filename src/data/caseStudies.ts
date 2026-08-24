/** Single source for service slug: title -> URL slug (DRY with ServicePage, LandingPage). */
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
  /** Custom gallery sections (title + image paths). Use when case study has its own images. */
  gallerySections?: { title: string; images: string[] }[];
  projectUrl?: string;
  featured?: boolean;
}

const CASE_STUDIES_IMG = '/images/case-studies';
const FEATURED_IMG = '/images/featured';

const caseStudiesList: CaseStudy[] = [
  {
    id: 'bonterra',
    slug: 'bonterra-home',
    title: 'Bonterra Home – eBay, Walmart & Shopify',
    clientName: 'Martin Evenson (Bonterra Home)',
    services: ['eBay', 'Shopify', 'Walmart', 'Brand Identity'],
    challenge: 'Full e-commerce support: eBay store banner and listing templates, Walmart and Shopify account management, plus a new Shopify store for mini splits and tankless water heaters.',
    solution: 'Delivered company logo, eBay store banner, eBay listing template, and designed/built the Shopify store at bonterrahome.com.',
    results: 'eBay templates & store banner, Shopify store design, multi-channel (eBay, Walmart, Shopify) management.',
    image: `${FEATURED_IMG}/bonterra-shopify.png`,
    projectUrl: 'https://bonterrahome.com/',
    featured: true,
    gallerySections: [
      { title: 'Brand & store', images: [`${FEATURED_IMG}/bonterra-logo.png`, `${FEATURED_IMG}/bonterra-ebay-banner.png`] },
      { title: 'eBay listing & Shopify', images: [`${FEATURED_IMG}/bonterra-ebay-template.png`, `${FEATURED_IMG}/bonterra-shopify.png`] },
    ],
  },
  {
    id: 'rak',
    slug: 'ebay-rak-consignment',
    title: 'eBay Listing, Store Banner & Social – RAK Consignment',
    clientName: 'RAK Consignment (Mindy)',
    services: ['eBay', 'Brand Identity'],
    challenge: 'Client needed a professional eBay listing template and a cohesive store presence. Through casual conversation during the first order, we identified an opportunity to improve the store banner and expand into social branding.',
    solution: 'Delivered an eBay listing template (with revisions) and set it up in Auctiva. Proposed and delivered a new eBay store header, then a Facebook header. All work was done via Fiverr with clear communication and iterations.',
    results: 'Listing live on eBay with a polished template; store header and Facebook banner completed. Client left positive Fiverr feedback and plans to do her website next.',
    image: `${CASE_STUDIES_IMG}/rak-consignment/store-header.png`,
    projectUrl: 'https://www.ebay.com/itm/287138820320',
    featured: true,
    gallerySections: [
      {
        title: 'Final deliverables',
        images: [
          `${CASE_STUDIES_IMG}/rak-consignment/listing-sample.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/store-header.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/fb-banner.jpg`,
        ],
      },
      {
        title: 'Conversation',
        images: [
          `${CASE_STUDIES_IMG}/rak-consignment/convo-7.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/convo-8.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/convo-9.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/convo-10.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/convo-11.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/convo-12.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/convo-13.png`,
        ],
      },
      {
        title: 'Fiverr feedback',
        images: [
          `${CASE_STUDIES_IMG}/rak-consignment/feedback-1.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/feedback-2.png`,
          `${CASE_STUDIES_IMG}/rak-consignment/feedback-3.png`,
        ],
      },
    ],
  },
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

const idxBySlug = (slug: string) => caseStudiesList.findIndex((c) => c.slug === slug);

export const getPrevNext = (slug: string): { prev: CaseStudy | null; next: CaseStudy | null } => {
  const i = idxBySlug(slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? caseStudiesList[i - 1] ?? null : null,
    next: i < caseStudiesList.length - 1 && i >= 0 ? caseStudiesList[i + 1] ?? null : null,
  };
};

export const getRelatedCaseStudies = (slug: string, limit = 3): CaseStudy[] => {
  const study = getCaseStudyBySlug(slug);
  if (!study?.services.length) return [];
  const byFirst = getCaseStudiesByService(toServiceSlug(study.services[0]));
  return byFirst.filter((c) => c.slug !== slug).slice(0, limit);
};
