import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Zap, Target, TrendingUp, Palette, Code, Wrench, FileCode, Layout, Package, Store, List, Image, Smartphone, Globe, Share2, FileText, Layers } from 'lucide-react';
import { SiWordpress, SiShopify, SiWix, SiEbay, SiAmazon, SiWalmart, SiAndroid } from 'react-icons/si';
import ScrollToTop from './components/ScrollToTop';
import ServicePage from './pages/ServicePage';
import PluginPage from './pages/PluginPage';
import DownloadPage from './pages/DownloadPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import LandingPage from './pages/LandingPage';

function ShalConnectsPortfolio() {
  // serviceCategories is kept here for ServicePage
  // LandingPage has its own copy of serviceCategories
  const serviceCategories = [
    {
      name: 'Platforms',
      icon: Zap,
      color: '#176641', // Brand Green
      services: [
        { 
          icon: SiWordpress, 
          title: 'WordPress', 
          desc: 'Complete WordPress solutions from design to maintenance',
          startingPrice: '$500',
          subServices: [
            { icon: Palette, label: 'WordPress Site Design', desc: 'Custom designs tailored to your brand' },
            { icon: Layout, label: 'Custom Theme', desc: 'Unique themes built from scratch' },
            { icon: Code, label: 'Making Plugins', desc: 'Custom plugin development' },
            { icon: Wrench, label: 'Site Maintenance', desc: 'Ongoing support & updates' },
            { icon: FileCode, label: 'Custom Script', desc: 'Tailored functionality solutions' }
          ]
        },
        { 
          icon: SiShopify, 
          title: 'Shopify', 
          desc: 'Professional Shopify store development and customization',
          startingPrice: '$800',
          subServices: [
            { icon: Palette, label: 'Site Design', desc: 'Beautiful, conversion-focused designs' },
            { icon: Layout, label: 'Custom Theme', desc: 'Branded themes for your store' },
            { icon: Package, label: 'Shopify App', desc: 'Custom app development' }
          ]
        },
        { 
          icon: SiWix, 
          title: 'Wix', 
          desc: 'Professional Wix website design and customization',
          startingPrice: '$400',
          subServices: [
            { icon: Palette, label: 'Wix Site Design', desc: 'Custom Wix website designs' },
            { icon: Layout, label: 'Wix Customization', desc: 'Tailored Wix site customization' },
            { icon: Wrench, label: 'Wix Maintenance', desc: 'Ongoing Wix site support' }
          ]
        }
      ]
    },
    {
      name: 'E-commerce',
      icon: TrendingUp,
      color: '#da651e', // Orange
      services: [
        { 
          icon: SiEbay, 
          title: 'eBay', 
          desc: 'Complete eBay store management and optimization',
          startingPrice: '$300',
          subServices: [
            { icon: Store, label: 'eBay Store Management', desc: 'Complete store optimization' },
            { icon: List, label: 'eBay Listing', desc: 'Professional product listings' },
            { icon: Layout, label: 'eBay Template', desc: 'Custom store templates' },
            { icon: Palette, label: 'eBay Store Redesign', desc: 'Modern store makeovers' }
          ]
        },
        { 
          icon: SiAmazon, 
          title: 'Amazon', 
          desc: 'Amazon store management and enhanced content creation',
          startingPrice: '$350',
          subServices: [
            { icon: Store, label: 'Amazon Store Management', desc: 'Full store optimization' },
            { icon: List, label: 'Amazon Listing', desc: 'Optimized product listings' },
            { icon: Image, label: 'Amazon Graphics & A+ Content', desc: 'Enhanced visual content' }
          ]
        },
        { 
          icon: SiWalmart, 
          title: 'Walmart', 
          desc: 'Complete Walmart marketplace management and optimization',
          startingPrice: '$300',
          subServices: [
            { icon: Store, label: 'Walmart Store Management', desc: 'Complete store optimization' },
            { icon: List, label: 'Walmart Listing', desc: 'Professional product listings' }
          ]
        }
      ]
    },
    {
      name: 'Development',
      icon: Target,
      color: '#3b82f6', // Blue
      services: [
        { 
          icon: Code, 
          title: 'Custom Site', 
          desc: 'Bespoke web applications built with modern technologies',
          startingPrice: '$1,500',
          subServices: [
            { icon: Globe, label: 'Custom Build Site', desc: 'React, Next.js & modern frameworks' },
            { icon: Layout, label: 'Frontend Development', desc: 'React, Vue, Angular interfaces' },
            { icon: Code, label: 'Backend Development', desc: 'Server-side APIs and logic' },
            { icon: FileCode, label: 'API Development', desc: 'RESTful APIs and integrations' },
            { icon: Wrench, label: 'Maintenance & Support', desc: 'Ongoing updates and support' }
          ]
        },
        { 
          icon: SiAndroid, 
          title: 'Android App', 
          desc: 'Mobile app development from web conversion to native apps',
          startingPrice: '$2,000',
          subServices: [
            { icon: Smartphone, label: 'Web to App', desc: 'Convert your website to app' },
            { icon: Code, label: 'Scratch to App', desc: 'Native app development' },
            { icon: Wrench, label: 'App Maintenance', desc: 'Ongoing support and updates' },
            { icon: TrendingUp, label: 'App Store Optimization', desc: 'ASO and listing optimization' },
            { icon: Palette, label: 'App UI/UX Design', desc: 'Interface design services' },
            { icon: Globe, label: 'App Integration', desc: 'API and third-party integrations' }
          ]
        }
      ]
    },
    {
      name: 'Design',
      icon: Palette,
      color: '#a855f7', // Purple
      services: [
        { 
          icon: Palette, 
          title: 'Brand Identity', 
          desc: 'Complete branding packages for your business',
          startingPrice: '$600',
          subServices: [
            { icon: Palette, label: 'Logo Design', desc: 'Custom logo creation' },
            { icon: Image, label: 'Banner Design', desc: 'Professional banner graphics' },
            { icon: Target, label: 'Brand Guidelines', desc: 'Complete brand style guides' },
            { icon: Layout, label: 'Color & Typography', desc: 'Brand color palettes and fonts' },
            { icon: Package, label: 'Brand Assets', desc: 'Complete brand asset packages' }
          ]
        },
        { 
          icon: Share2, 
          title: 'Social Media Graphics', 
          desc: 'All social media assets and graphics',
          startingPrice: '$200',
          subServices: [
            { icon: Image, label: 'Social Posts', desc: 'Custom social media posts' },
            { icon: Layout, label: 'Stories & Covers', desc: 'Social stories and cover graphics' },
            { icon: TrendingUp, label: 'Social Ads', desc: 'Social media advertising graphics' }
          ]
        },
        { 
          icon: FileText, 
          title: 'Print Design', 
          desc: 'Business cards, flyers, brochures and more',
          startingPrice: '$150',
          subServices: [
            { icon: Layout, label: 'Business Cards', desc: 'Professional business card design' },
            { icon: Image, label: 'Flyers & Brochures', desc: 'Marketing flyers and brochures' },
            { icon: Package, label: 'Posters & Banners', desc: 'Print posters and banners' }
          ]
        },
        { 
          icon: Layers, 
          title: 'Web Graphics', 
          desc: 'Icons, illustrations, and UI elements',
          startingPrice: '$250',
          subServices: [
            { icon: Code, label: 'Icon Design', desc: 'Custom icon sets' },
            { icon: Image, label: 'Illustrations', desc: 'Custom illustrations and graphics' },
            { icon: Layout, label: 'UI Elements', desc: 'Web interface elements' }
          ]
        }
      ]
    }
  ];

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/services/wordpress/plugins/:pluginSlug" element={<PluginPage />} />
        <Route path="/services/:serviceSlug" element={<ServicePage serviceCategories={serviceCategories as any} />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </>
  );
}

export default ShalConnectsPortfolio;
