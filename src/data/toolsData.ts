import { lazy, type LazyExoticComponent, type ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Wand2, Activity, Key, Link2, FileText, QrCode, Share2, Briefcase, Wallet, Table2 } from 'lucide-react';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  route: string;
  color: string;
  isNew?: boolean;
  Load: LazyExoticComponent<ComponentType>;
}

export const toolsData: ToolItem[] = [
  { id: 'ai-text-formatter', name: 'AI Text Formatter', description: 'Remove markdown formatting and convert AI-generated text to clean, human-readable format. Automatically detects and removes AI meta-commentary.', icon: Wand2, route: '/tools/ai-formatter', color: '#6366f1', isNew: true, Load: lazy(() => import('../pages/AITextFormatter')) },
  { id: 'fitquest', name: 'FitQuest', description: 'Gamify your fitness journey with points, levels, streaks, and achievements. Track workouts and level up your fitness game.', icon: Activity, route: '/tools/fitquest', color: '#10b981', isNew: true, Load: lazy(() => import('../pages/FitQuest')) },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate strong, secure passwords with customizable options. Control length, character types, and security settings.', icon: Key, route: '/tools/password-generator', color: '#8b5cf6', isNew: true, Load: lazy(() => import('../pages/PasswordGenerator')) },
  { id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', description: 'Encode URLs to percent-encoded format or decode them back to readable text. Perfect for handling special characters in URLs.', icon: Link2, route: '/tools/url-encoder-decoder', color: '#06b6d4', isNew: true, Load: lazy(() => import('../pages/URLEncoderDecoder')) },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for your designs and layouts. Customize paragraphs, words, and sentences.', icon: FileText, route: '/tools/lorem-ipsum', color: '#ec4899', isNew: true, Load: lazy(() => import('../pages/LoremIpsumGenerator')) },
  { id: 'qr-code-generator', name: 'QR Code Generator', description: 'Generate QR codes from text or URLs. Download as PNG or SVG. Perfect for sharing links and information.', icon: QrCode, route: '/tools/qr-code-generator', color: '#14b8a6', isNew: true, Load: lazy(() => import('../pages/QRCodeGenerator')) },
  { id: 'share-link-generator', name: 'Share Link Generator', description: 'Create Facebook, Twitter/X, LinkedIn, Bluesky, Telegram, Pinterest share links and email mailto links from one URL. No JavaScript required.', icon: Share2, route: '/tools/share-link-generator', color: '#f59e0b', isNew: true, Load: lazy(() => import('../pages/ShareLinkGenerator')) },
  { id: 'upwork-proposal-generator', name: 'Upwork Proposal Generator', description: 'Generate professional Upwork proposals (100–160 words) with a hook, plan, proof, pricing, and CTA. Paste job details or add a job URL for reference.', icon: Briefcase, route: '/tools/upwork-proposal-generator', color: '#14a34a', isNew: true, Load: lazy(() => import('../pages/UpworkProposalGenerator')) },
  { id: 'finance-summary', name: 'Finance Summary', description: 'Format and display all-time income, expenses, net, and date range. Bangladeshi Taka (৳). Copy-ready summary format.', icon: Wallet, route: '/tools/finance-summary', color: '#059669', isNew: true, Load: lazy(() => import('../pages/FinanceSummary')) },
  { id: 'csv-viewer', name: 'CSV Viewer', description: 'Open and view CSV files online in your browser. Free CSV opener with search, sort, and export — files stay on your device.', icon: Table2, route: '/tools/csv-viewer', color: '#3b82f6', isNew: true, Load: lazy(() => import('../pages/CSVViewer')) }
];

export const getToolBySlug = (slug: string) => toolsData.find(t => t.route === `/tools/${slug}`);
