import { Zap, Target, TrendingUp, Palette, Code, Wrench, FileCode, Layout, Package, Store, List, Image, Smartphone, Globe, Share2, FileText, Layers } from 'lucide-react';
import { SiWordpress, SiShopify, SiWix, SiEbay, SiAmazon, SiWalmart, SiAndroid } from 'react-icons/si';

export const serviceCategories = [
  {
    name: 'Platforms',
    icon: Zap,
    color: '#176641',
    services: [
      { icon: SiWordpress, title: 'WordPress', desc: 'Complete WordPress solutions from design to maintenance', startingPrice: '$500', idealClient: ["You need effortless content publishing without touching code", "Your WooCommerce store needs custom checkout or unique features", "Your team waits on developers for simple updates", "You need custom plugins that don't exist in the marketplace"], subServices: [{ icon: Palette, label: 'WordPress Site Design', desc: 'Custom designs tailored to your brand' }, { icon: Layout, label: 'Custom Theme', desc: 'Unique themes built from scratch' }, { icon: Code, label: 'Making Plugins', desc: 'Custom plugin development' }, { icon: Wrench, label: 'Site Maintenance', desc: 'Ongoing support & updates' }, { icon: FileCode, label: 'Custom Script', desc: 'Tailored functionality solutions' }] },
      { icon: SiShopify, title: 'Shopify', desc: 'Professional Shopify store development and customization', startingPrice: '$800', idealClient: ["You need a store that converts, not just looks pretty", "Your theme feels generic—you need custom features for your brand", "You want to focus on selling, not hosting and security", "You need a custom app to automate what doesn't exist"], subServices: [{ icon: Palette, label: 'Site Design', desc: 'Beautiful, conversion-focused designs' }, { icon: Layout, label: 'Custom Theme', desc: 'Branded themes for your store' }, { icon: Package, label: 'Shopify App', desc: 'Custom app development' }] },
      { icon: SiWix, title: 'Wix', desc: 'Professional Wix website design and customization', startingPrice: '$400', idealClient: ["You need a professional site fast without WordPress complexity", "You want to update content yourself with drag-and-drop", "Your portfolio or local business needs to look credible online", "You need moderate customization, not heavy backend work"], subServices: [{ icon: Palette, label: 'Wix Site Design', desc: 'Custom Wix website designs' }, { icon: Layout, label: 'Wix Theme', desc: 'Custom Wix themes and templates' }, { icon: Package, label: 'Wix App', desc: 'Custom Wix app development' }] }
    ]
  },
  {
    name: 'E-commerce',
    icon: TrendingUp,
    color: '#da651e',
    services: [
      { icon: SiEbay, title: 'eBay', desc: 'Complete eBay store management and optimization', startingPrice: '$300', idealClient: ["You're managing 50+ listings manually—you need automation", "Your products are buried on page 5 due to poor optimization", "You're ready to scale multi-channel but eBay needs fixing first", "Your store looks amateur and it's costing sales"], subServices: [{ icon: Store, label: 'eBay Store Management', desc: 'Complete store optimization and dropshipping setup and automation tools' }, { icon: List, label: 'eBay Listing', desc: 'Professional product listings' }, { icon: Layout, label: 'eBay Template', desc: 'Custom store templates' }] },
      { icon: SiAmazon, title: 'Amazon', desc: 'Amazon store management and enhanced content creation', startingPrice: '$350', idealClient: ["Your listings get traffic but don't convert—you need A+ content", "You're competing with dozens and need to stand out", "Your keyword strategy is guesswork and hurting visibility", "You need professional storefronts and enhanced visuals"], subServices: [{ icon: Store, label: 'Amazon Store Management', desc: 'Full store optimization' }, { icon: List, label: 'Amazon Listing', desc: 'Optimized product listings' }, { icon: Image, label: 'Amazon Graphics & A+ Content', desc: 'Enhanced visual content' }] },
      { icon: SiWalmart, title: 'Walmart', desc: 'Complete Walmart marketplace management and optimization', startingPrice: '$300', idealClient: ["You're succeeding on Amazon/eBay and ready to expand", "Walmart's strict requirements are blocking your approval", "Your multi-channel inventory sync is a mess", "You want 120M+ Walmart customers without learning another platform"], subServices: [{ icon: Store, label: 'Walmart Store Management', desc: 'Complete store optimization' }, { icon: List, label: 'Walmart Listing', desc: 'Professional product listings' }] }
    ]
  },
  {
    name: 'Development',
    icon: Target,
    color: '#3b82f6',
    services: [
      { icon: Code, title: 'Custom Site', desc: 'Bespoke web applications built with modern technologies', startingPrice: '$1,500', idealClient: ["You need a web app that converts users, not another template", "Your unique workflows can't be handled by off-the-shelf solutions", "You've outgrown WordPress/Shopify and need React or Next.js", "You need scalable code, not technical debt"], subServices: [{ icon: Globe, label: 'Custom Build Site', desc: 'React, Next.js & modern frameworks' }, { icon: Layout, label: 'Frontend Development', desc: 'React, Vue, Angular interfaces' }, { icon: Code, label: 'Backend Development', desc: 'Server-side APIs and logic' }, { icon: FileCode, label: 'API Development', desc: 'RESTful APIs and integrations' }, { icon: Wrench, label: 'Maintenance & Support', desc: 'Ongoing updates and support' }] },
      { icon: SiAndroid, title: 'Android App', desc: 'Mobile app development from web conversion to native apps', startingPrice: '$2,000', idealClient: ["You're losing mobile-first users who expect a native app", "You need presence on Google Play for Android's 70%+ market share", "You need push notifications, offline mode, or device features", "Competitors have apps—you're losing Play Store searches"], subServices: [{ icon: Smartphone, label: 'Web to App', desc: 'Convert your website to app' }, { icon: Code, label: 'Scratch to App', desc: 'Native app development' }, { icon: Wrench, label: 'App Maintenance', desc: 'Ongoing support and updates' }, { icon: Palette, label: 'App UI/UX Design', desc: 'Interface design services' }] }
    ]
  },
  {
    name: 'Design',
    icon: Palette,
    color: '#a855f7',
    services: [
      { icon: Palette, title: 'Brand Identity', desc: 'Complete branding packages for your business', startingPrice: '$600', idealClient: ["You need more than a cheap logo—you need a cohesive system", "Your inconsistent brand is confusing customers and hurting trust", "You're embarrassed to show your DIY logo to investors", "You need guidelines so your team creates on-brand content"], subServices: [{ icon: Palette, label: 'Logo Design', desc: 'Custom logo creation' }, { icon: Image, label: 'Banner Design', desc: 'Professional banner graphics' }, { icon: Target, label: 'Brand Guidelines', desc: 'Complete brand style guides' }, { icon: Layout, label: 'Color & Typography', desc: 'Brand color palettes and fonts' }, { icon: Package, label: 'Brand Assets', desc: 'Complete brand asset packages' }] },
      { icon: Share2, title: 'Social Media Graphics', desc: 'All social media assets and graphics', startingPrice: '$200', idealClient: ["Your graphics look generic and it's hurting engagement", "You need professional ads and posts but don't have a designer", "Your paid campaign creative is getting ignored in feeds", "Canva templates scream \"template\"—you need custom designs"], subServices: [{ icon: Image, label: 'Social Posts', desc: 'Custom social media posts' }, { icon: Layout, label: 'Stories & Covers', desc: 'Social stories and cover graphics' }, { icon: TrendingUp, label: 'Social Ads', desc: 'Social media advertising graphics' }] },
      { icon: FileText, title: 'Print Design', desc: 'Business cards, flyers, brochures and more', startingPrice: '$150', idealClient: ["You need business cards that look credible, not forgettable", "Your DIY flyer isn't cutting through the noise", "You need print-ready files that won't get rejected", "You're exhibiting and need professional materials that convert"], subServices: [{ icon: Layout, label: 'Business Cards', desc: 'Professional business card design' }, { icon: Image, label: 'Flyers & Brochures', desc: 'Marketing flyers and brochures' }, { icon: Package, label: 'Posters & Banners', desc: 'Print posters and banners' }] },
      { icon: Layers, title: 'Web Graphics', desc: 'Icons, illustrations, and UI elements', startingPrice: '$250', idealClient: ["You're using generic icons—you need custom visuals", "You're tired of the same Undraw illustrations as every SaaS", "You need cohesive icon sets or UI elements that scale", "Your developers are blocked waiting for design system graphics"], subServices: [{ icon: Code, label: 'Icon Design', desc: 'Custom icon sets' }, { icon: Image, label: 'Illustrations', desc: 'Custom illustrations and graphics' }, { icon: Layout, label: 'UI Elements', desc: 'Web interface elements' }] }
    ]
  }
];
