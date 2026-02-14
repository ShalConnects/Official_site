// Work Portfolio Data
// Add your work images here with their associated services

export interface WorkImage {
  id: string;
  image: string; // Path to image in public/images/images/work/
  images?: string[]; // Optional: multiple images for sets (e.g., icon sets) - if present, displayed as grid
  title: string;
  description?: string;
  services: string[]; // Service names that this work belongs to (e.g., ['WordPress', 'Shopify'])
  category?: string; // Optional category like 'e-commerce', 'design', etc.
  projectUrl?: string; // Optional link to live project
  clientName?: string; // Optional client/project name for showcase
  results?: string; // Optional one-line results (e.g. "+40% sales")
  quote?: string; // Optional short testimonial or quote
  featured?: boolean; // Optional: show in featured highlights
  longScreenshot?: boolean; // Optional: show in scrollable auto-scroll container (full-page screenshot)
}

// Place images in: public/images/images/work/
const WORK_IMAGE_BASE = '/images/images/work/';

type WorkSlug = { title: string; services: readonly string[]; category?: string };
const workEntries = (slug: WorkSlug, files: string[], idPrefix: string, longScreenshotFiles?: string[], groupSize?: number): WorkImage[] => {
  if (groupSize && groupSize > 1) {
    const groups: string[][] = [];
    for (let i = 0; i < files.length; i += groupSize) groups.push(files.slice(i, i + groupSize));
    return groups.map((group, i) => ({
      id: `${idPrefix}-set-${i + 1}`,
      image: WORK_IMAGE_BASE + group[0],
      images: group.map(f => WORK_IMAGE_BASE + f),
      title: slug.title,
      services: [...slug.services],
      ...(slug.category && { category: slug.category }),
    }));
  }
  return files.map((file, i) => ({
    id: `${idPrefix}-${i + 1}`,
    image: WORK_IMAGE_BASE + file,
    title: slug.title,
    services: [...slug.services],
    ...(slug.category && { category: slug.category }),
    ...(longScreenshotFiles?.includes(file) && { longScreenshot: true }),
  }));
};

const ebaySlug: WorkSlug = { title: 'eBay Store / Template Banner', services: ['eBay', 'Brand Identity'], category: 'e-commerce' };
const ebayFiles = ['Banner_1.jpg', 'Banner (1).png', 'Banner (2).jpg', 'Banner (3).jpg', 'Banner (4).jpg', 'Banner (5).jpg', 'ebay-rockhardsupplements.png'];
const ebayLongScreenshots = ['ebay-rockhardsupplements.png'];

const ebayStoreFrontSlug: WorkSlug = { title: 'eBay Store Front', services: ['eBay', 'Brand Identity'], category: 'e-commerce' };
const ebayStoreFrontFiles = ['ebay-store-1.png', 'ebay-store-2.png', 'ebay-army-surplus.png', 'ebay-newww-1.png', 'ebay-newww-2.png', 'ebay-omniumdigital.png', 'ebay-trade-store.png', 'ebay-infinityinks.png'];

const ebayListingSlug: WorkSlug = { title: 'eBay Listing Template', services: ['eBay'], category: 'e-commerce' };
const ebayListingFiles = ['ebay-listing-167.jpg', 'ebay-listing-170.jpg', 'ebay-listing-173.png', 'ebay-listing-103.png', 'ebay-listing-1.png', 'ebay-listing-9.png', 'ebay-listing-16.png', 'ebay-listing-18.png', 'ebay-listing-20.png', 'ebay-listing-36.png', 'ebay-listing-39.png', 'ebay-listing-47.png', 'ebay-listing-48.png', 'ebay-listing-49.png', 'ebay-listing-50.png', 'ebay-listing-60.png', 'ebay-listing-82.png', 'ebay-listing-91.png', 'ebay-listing-97.png', 'ebay-listing-101.png', 'ebay-listing-110.png', 'ebay-listing-123.png', 'ebay-listing-126.png', 'ebay-listing-128.png', 'ebay-listing-133.png', 'ebay-listing-139.png', 'ebay-listing-143.png', 'ebay-listing-158.png', 'ebay-listing-162.png', 'ebay-listing-163.png'];

const shopifySlug: WorkSlug = { title: 'Shopify Store', services: ['Shopify'], category: 'e-commerce' };
const shopifyFiles = ['shopify-cloud-creative-1.png', 'shopify-cloud-creative-2.png', 'shopify-cloud-creative-5.png', 'shopify-cloud-creative-6.png', 'shopify-cloud-creative-7.png', 'shopify-cloud-creative-8.png', 'shopify-bonterrahome.png', 'shopify-spymods.png', 'shopify-wheyoflife-au.png', 'shopify-nutrinoche.png'];

const wixSlug: WorkSlug = { title: 'Wix Site', services: ['Wix'], category: 'web' };
const wixFiles = ['wix-perfectwhitetee.png', 'wix-sample-1.avif', 'wix-sample-2.avif'];

const wordpressSlug: WorkSlug = { title: 'WordPress Site', services: ['WordPress'], category: 'web' };
const wordpressFiles = ['wordpress-trendrio.png', 'wordpress-iconnecting-improve.png', 'wordpress-newlife.png', 'wordpress-pricc-1.png', 'wordpress-funchicken.png', 'wordpress-uac-2.png', 'wordpress-shal-2.png', 'wordpress-sample-1.png', 'wordpress-sample-2.png', 'wordpress-sample-3.png', 'wordpress-sample-4.png', 'wordpress-sample-5.png', 'wordpress-sample-6.png', 'wordpress-portfolio.png'];

const androidSlug: WorkSlug = { title: 'Android App', services: ['Android'], category: 'mobile' };
const androidFiles = ['android-1.png', 'android-2.png', 'android-3.jpg', 'android-4.jpg'];

const iconSlug: WorkSlug = { title: 'Icon Set', services: ['Graphic Design'], category: 'design' };
const iconFiles = ['icon-22.png', 'icon-23.png', 'icon-24.png', 'icon-25.png', 'icon-31.png', 'icon-32.png', 'icon-33.png', 'icon-34.png', 'icon-35.png', 'icon-36.png', 'icon-37.png', 'icon-38.png', 'icon-40.png', 'icon-41.png', 'icon-42.png', 'icon-43.png'];

const logoSlug: WorkSlug = { title: 'Logo Design', services: ['Logo Design'], category: 'design' };
const logoFiles = ['logo-1.png', 'logo-2.jpeg', 'logo-3.jpeg', 'logo-4.png', 'logo-5.jpg', 'logo-6.png', 'logo-7.png', 'logo-8.png', 'logo-9.png', 'logo-10.png', 'logo-11.png', 'logo-12.png', 'logo-13.png', 'logo-14.jpeg'];

// Featured work indices for landing page highlights
const featuredIndices = {
  wordpress: [0, 3, 6], // Trendrio, PRICC, Fun Chicken
  shopify: [0, 6, 7], // Cloud Creative, Bonterra Home, Spymods
  ebay: [0, 2], // First 2 banners
  ebayStorefront: [0, 5], // Fashion Flair, Omnium Digital
  logo: [0, 4, 7], // Best logo samples
  icon: [0, 1], // First 2 icon sets
};

export const workPortfolio: WorkImage[] = [
  {
    id: 'development-balanze',
    image: WORK_IMAGE_BASE + 'balanze-cash-landing.png',
    title: 'Balanze Cash Landing Page',
    services: ['Web Development'],
    category: 'web',
    longScreenshot: true,
    featured: true,
  },
  ...workEntries(wordpressSlug, wordpressFiles, 'wordpress', wordpressFiles).map((w, i) => 
    featuredIndices.wordpress.includes(i) ? { ...w, featured: true } : w
  ),
  ...workEntries(ebaySlug, ebayFiles, 'banner', ebayLongScreenshots).map((w, i) => 
    featuredIndices.ebay.includes(i) ? { ...w, featured: true } : w
  ),
  ...workEntries(ebayStoreFrontSlug, ebayStoreFrontFiles, 'ebay-storefront', ebayStoreFrontFiles).map((w, i) => 
    featuredIndices.ebayStorefront.includes(i) ? { ...w, featured: true } : w
  ),
  ...workEntries(ebayListingSlug, ebayListingFiles, 'listing'),
  ...workEntries(shopifySlug, shopifyFiles, 'shopify', shopifyFiles).map((w, i) => 
    featuredIndices.shopify.includes(i) ? { ...w, featured: true } : w
  ),
  ...workEntries(wixSlug, wixFiles, 'wix', wixFiles),
  ...workEntries(androidSlug, androidFiles, 'android'),
  ...workEntries(iconSlug, iconFiles, 'icon', undefined, 4).map((w, i) => 
    featuredIndices.icon.includes(i) ? { ...w, featured: true } : w
  ),
  ...workEntries(logoSlug, logoFiles, 'logo').map((w, i) => 
    featuredIndices.logo.includes(i) ? { ...w, featured: true } : w
  ),
];

/** Unique service names from a work list. */
export const getUniqueServices = (workList: WorkImage[], sorted = false): string[] => {
  const set = new Set<string>();
  workList.forEach(w => w.services.forEach(s => set.add(s)));
  const out = Array.from(set);
  return sorted ? out.sort() : out;
};

export const getAllServices = (): string[] => getUniqueServices(workPortfolio, true);

// Service name aliases for flexible matching (DRY: single source of truth)
const SERVICE_ALIASES: Record<string, string[]> = {
  'Android App': ['Android', 'Android App'],
  'Web Graphics': ['Graphic Design', 'Web Graphics'],
  'Custom Site': ['Web Development', 'Custom Site'],
  'Brand Identity': ['Logo Design', 'Brand Identity'],
};

// Helper function to get work by service (supports aliases)
export const getWorkByService = (serviceName: string): WorkImage[] => {
  const aliases = SERVICE_ALIASES[serviceName] || [serviceName];
  return workPortfolio.filter(work => 
    work.services.some(service => 
      aliases.some(alias => service.toLowerCase() === alias.toLowerCase())
    )
  );
};

// Helper function to get featured work (for highlights on landing/service pages)
export const getFeaturedWork = (): WorkImage[] => {
  return workPortfolio.filter(work => work.featured === true);
};

// Helper function to get diverse work selection (2-3 from each category, shuffled)
export const getDiverseWork = (itemsPerCategory = 3, maxTotal = 25): WorkImage[] => {
  const byCategory: Record<string, WorkImage[]> = {};
  workPortfolio.forEach(work => {
    const cat = work.category || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(work);
  });
  
  const diverse: WorkImage[] = [];
  Object.values(byCategory).forEach(items => {
    diverse.push(...shuffleArray(items).slice(0, itemsPerCategory));
  });
  
  return shuffleArray(diverse).slice(0, maxTotal);
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

