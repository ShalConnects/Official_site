// Launched products for the landing carousel. Single source of truth.

export interface Product {
  id: number;
  title: string;
  category: string;
  color: string;
  description: string;
  results: string;
  services: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  playStoreLink?: string;
  appVersion?: string;
  screenshots?: string[];
  platform?: string;
  technologies?: string[];
  status?: 'live' | 'new' | 'popular';
  platformIcon?: 'web' | 'android' | 'ios' | 'windows';
  quickStats?: string;
  ctaLabel?: string;
}

export const launchedProducts: Product[] = [
  {
    id: 5,
    title: 'BadgeMilestone',
    category: 'YouTube SaaS',
    color: 'from-red-600 to-rose-500',
    description: 'Scan a YouTube channel, stamp 100K / 1M / 10M badges from real view counts, export Studio-ready PNGs, or push to videos you own.',
    results: 'Channel scan → live badge preview → PNG / ZIP export or YouTube push',
    services: ['Channel Scan', 'Milestone Badges', 'Live Preview', 'PNG / ZIP Export', 'YouTube Push'],
    techStack: ['Next.js', 'NextAuth', 'MongoDB', 'YouTube API', 'Stripe', 'Lemon Squeezy'],
    liveUrl: 'https://www.badgemilestone.app/',
    imageUrl: '/images/badgemilestone-mark.png',
    status: 'new',
    platformIcon: 'web',
    quickStats: 'Scan • Stamp • Export / Push'
  },
  {
    id: 1,
    title: 'Be Better You',
    category: 'Motivational Website',
    color: 'from-pink-500 to-rose-500',
    description: 'Your personal hype squad in website form! A motivational platform dedicated to bringing back the fire inside you. Whether you\'re chasing career dreams, breaking free from bad habits, or just need a daily dose of "you got this," Be Better You is here to turn your "what ifs" into "holy moly, I DID IT!" moments. Daily motivational quotes, inspiring blog posts, and content designed to unleash the awesome that\'s been hiding inside you.',
    results: 'Motivational content platform with daily quotes, blog posts, and resources to inspire personal growth and achievement',
    services: ['WordPress Development', 'Content Management', 'Blog Platform', 'Daily Quotes', 'Motivational Content'],
    techStack: ['WordPress', 'PHP', 'MySQL'],
    liveUrl: 'https://bebetteryou.net/',
    imageUrl: '/images/be-better-you-logo.png',
    status: 'live',
    platformIcon: 'web',
    quickStats: 'Daily Quotes • Blog • Motivation',
    ctaLabel: 'Visit Site'
  },
  {
    id: 2,
    title: 'Balanze',
    category: 'Full-Stack SaaS',
    color: 'from-indigo-500 to-purple-500',
    description: 'A modern, multi-user personal finance management SaaS platform that helps users track accounts, transactions, savings, donations, and financial goals across multiple currencies. Built with React, TypeScript, and Supabase, featuring real-time analytics, dynamic dashboards, and a native Android mobile app.',
    results: 'Full-stack SaaS platform with multi-currency support, real-time analytics, subscription management, and cross-platform mobile app',
    services: ['Multi-User Authentication', 'Multi-Currency Support', 'Real-Time Analytics', 'Recurring Transactions', 'Mobile App', 'Subscription Management'],
    techStack: ['React 18', 'TypeScript', 'Zustand', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Capacitor', 'Paddle', 'Vercel'],
    liveUrl: 'https://balanze.cash/',
    githubUrl: 'https://github.com/ShalConnects/fin-tech',
    imageUrl: '/images/balanze-icon.png',
    status: 'live',
    platformIcon: 'web',
    quickStats: 'Multi-currency • Real-time • SaaS'
  },
  {
    id: 3,
    title: 'Screen Time Tracker',
    category: 'Android App',
    color: 'from-blue-500 to-cyan-500',
    description: 'Monitor and manage your digital habits with beautiful real-time overlays and comprehensive analytics. Track your screen time, app usage, and productivity insights with a privacy-first approach. All data is stored locally on your device and never shared.',
    results: 'Android productivity app with real-time overlay, detailed analytics, goal setting, and privacy-first local data storage',
    services: ['Real-Time Overlay', 'Detailed Analytics', 'App Usage Tracking', 'Productivity Insights', 'Goal Setting', 'Export Data', 'Privacy-First'],
    techStack: ['Android', 'Kotlin'],
    technologies: ['Android', 'Kotlin', 'Windows', 'WinUI 3', '.NET 8'],
    platform: 'Android (Windows in development)',
    appVersion: '10.0.5+',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.screentime.overlay',
    imageUrl: '/images/screen-time-icon.png',
    screenshots: ['/images/screen-time-screenshot.png'],
    status: 'live',
    platformIcon: 'android',
    quickStats: '10.0.5+ • Privacy-first • Analytics'
  },
  {
    id: 4,
    title: 'Quran Verse Widget',
    category: 'Web Widget',
    color: 'from-amber-500 to-yellow-500',
    description: 'A beautiful, responsive daily Quran verse widget with Arabic text and English translations. Features dark mode, offline support, social sharing, favorites, and full accessibility. Built with vanilla HTML/CSS/JS, optimized for performance and SEO.',
    results: 'Fully accessible widget with offline support, retry mechanism, and service worker',
    services: ['Web Development', 'UI/UX Design', 'Accessibility', 'PWA', 'SEO Optimization'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Service Worker', 'PWA', 'Google Fonts'],
    liveUrl: 'https://shalconnects.github.io/quran-verse-widget/',
    githubUrl: 'https://github.com/ShalConnects/quran-verse-widget',
    imageUrl: '/images/quran-widget-preview.png',
    status: 'live',
    platformIcon: 'web',
    quickStats: 'PWA • Offline • Accessible'
  }
];
