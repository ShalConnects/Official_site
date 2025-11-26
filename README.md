# ShalConnects Official Website

A modern, interactive portfolio and e-commerce website for ShalConnects digital agency, featuring WordPress plugins, services, and integrated payment processing.

🌐 **Live Site:** [shalconnectsofficialsite.vercel.app](https://shalconnectsofficialsite.vercel.app)  
📦 **Repository:** [github.com/ShalConnects/Official_site](https://github.com/ShalConnects/Official_site)

## ✨ Features

### 🎨 Modern Design
- Gradient color scheme with green accent
- Smooth scroll navigation
- Animated background elements
- Glass-morphism navigation
- Fully responsive design (mobile-first)
- Dark theme optimized

### 🛒 E-Commerce & Payments
- **Paddle Integration** - Secure payment processing for digital products
- **Plugin Store** - WooCommerce plugin showcase and sales
- **Download System** - Secure file delivery after purchase
- **Transaction Verification** - Server-side payment verification

### 📄 Legal & Compliance
- Privacy Policy page (`/privacy`)
- Terms of Service page (`/terms`)
- Refund Policy page (`/refund`)
- All pages accessible and linked in footer

### 🚀 Performance
- Lightweight animations with Framer Motion
- Efficient React state management
- Optimized for fast loading
- Vite build system for fast development
- Lazy loading for route components
- Memoized calculations for better performance
- Code splitting for reduced bundle size

### 💫 Interactive Elements
- Scroll-triggered animations
- Service detail modals
- Animated stats counter
- Contact form with validation
- Active navigation highlighting
- Breadcrumb navigation
- Sidebar navigation for plugin pages

### 🛠️ Free Tools & Utilities
- **AI Text Formatter** - Remove markdown formatting and convert AI-generated text to clean, human-readable format
- **FitQuest** - Gamified fitness tracker with points, levels, streaks, and achievements
- More tools coming soon!

## 🏗️ Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── download.js        # Secure file download handler
│   └── verify-transaction.js  # Paddle transaction verification
├── public/                # Static assets
│   ├── downloads/        # Plugin ZIP files
│   └── images/           # Images and screenshots
├── src/
│   ├── components/       # React components
│   │   ├── Breadcrumbs.tsx
│   │   ├── Logo.tsx
│   │   ├── PageSidebar.tsx
│   │   └── ServiceModal.tsx
│   ├── pages/            # Page components
│   │   ├── PluginPage.tsx      # Plugin product pages
│   │   ├── ServicePage.tsx     # Service detail pages
│   │   ├── DownloadPage.tsx    # Post-purchase download
│   │   ├── ToolsPage.tsx       # Tools listing page
│   │   ├── AITextFormatter.tsx # AI Text Formatter tool
│   │   ├── FitQuest.tsx        # Gamified fitness tracker
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TermsOfService.tsx
│   │   └── RefundPolicy.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── usePageTitle.ts     # Dynamic page titles
│   │   └── useMetaTags.ts      # Dynamic SEO meta tags
│   ├── utils/           # Utility functions
│   │   ├── analytics.ts        # Analytics integration
│   │   ├── paddleApi.ts         # Paddle API utilities
│   │   └── storeUtils.ts       # Store utilities
│   └── App.tsx           # Main application
└── vercel.json           # Vercel configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ShalConnects/Official_site.git
cd Official_site
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 🔧 Configuration

### Environment Variables

For production deployment, set these in Vercel (or your hosting platform):

```env
PADDLE_API_KEY=your_paddle_api_key
PLUGIN_FILE_URL=https://your-cdn-url.com/plugin.zip  # Optional
VITE_GA_MEASUREMENT_ID=your_google_analytics_id  # Optional, for analytics
```

### Analytics Setup

1. Get your Google Analytics Measurement ID
2. Add it to environment variables as `VITE_GA_MEASUREMENT_ID`
3. Analytics will automatically track page views and events
4. Use `trackEvent()` from `src/utils/analytics.ts` for custom events

### Paddle Setup

1. Sign up at [paddle.com](https://paddle.com)
2. Create products in Paddle dashboard
3. Get your Vendor ID, Product ID, and Price ID
4. Update `src/pages/PluginPage.tsx` with your Paddle IDs
5. Add your domain to Paddle's domain whitelist

See `PADDLE_TROUBLESHOOTING.md` for detailed setup instructions.

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React 18** - UI framework with lazy loading
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Tailwind CSS** - Styling (via CDN)
- **Paddle** - Payment processing
- **Google Analytics** - Analytics integration (optional)
- **Vercel** - Hosting and serverless functions

## 📄 Pages & Routes

- `/` - Homepage with services and portfolio
- `/services/:serviceSlug` - Service detail pages
- `/services/wordpress/plugins/:pluginSlug` - Plugin product pages
- `/tools` - Free tools and utilities page
- `/tools/ai-formatter` - AI Text Formatter tool
- `/tools/fitquest` - FitQuest gamified fitness tracker
- `/download` - Post-purchase download page
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/refund` - Refund Policy

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure

- **Components** - Reusable UI components
- **Pages** - Route-level page components
- **Utils** - Helper functions and utilities
- **API** - Serverless functions for backend logic

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add environment variables
4. Deploy!

See `VERCEL_DEPLOY_INSTRUCTIONS.md` for detailed steps.

### Manual Deployment

1. Build the project: `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server to serve `index.html` for all routes

## 🎮 FitQuest - Gamified Fitness Tracker

FitQuest is a free fitness tracking tool that gamifies your workout routine with points, levels, streaks, and achievements.

### Features

- **Workout Logging** - Track workouts with type, duration, and intensity
- **Points System** - Earn points based on workout intensity and duration
- **Leveling System** - Level up every 100 points
- **Streak Tracking** - Track consecutive workout days
- **Achievements** - Unlock 10 different achievements
- **Workout History** - View all workouts with filtering options
- **Statistics** - Weekly and monthly summaries with charts
- **Workout Templates** - Quick-add common workout types
- **Data Export** - Export your data as JSON or CSV
- **Local Storage** - All data stored locally in your browser

### Usage

1. Navigate to `/tools/fitquest`
2. Click "Add Workout" or use a quick template
3. Select workout type, duration, and intensity
4. Track your progress with points, levels, and streaks
5. View statistics and history to see your fitness journey
6. Export your data anytime for backup

### Points System

- **Low Intensity**: 10 base points + duration bonus
- **Medium Intensity**: 20 base points + duration bonus
- **High Intensity**: 30 base points + duration bonus
- **Duration Bonus**: +1 point per 10 minutes

### Achievements

- First Steps - Complete your first workout
- On Fire - 3-day workout streak
- Week Warrior - 7-day workout streak
- Month Master - 30-day workout streak
- Getting Started - Complete 10 workouts
- Dedicated - Complete 50 workouts
- Centurion - Complete 100 workouts
- Rising Star - Reach Level 5
- Elite - Reach Level 10
- Point Collector - Earn 1000 points

## 🛠️ Tools Page Structure

The tools page (`/tools`) is designed to showcase free utilities and tools. To add a new tool:

1. **Create the tool component** in `src/pages/YourTool.tsx`
2. **Add to tools array** in `src/pages/ToolsPage.tsx`:
   ```typescript
   {
     id: 'your-tool-id',
     name: 'Your Tool Name',
     description: 'Tool description',
     icon: YourIcon, // from lucide-react
     route: '/tools/your-tool',
     color: '#hexcolor',
     isNew: true // optional
   }
   ```
3. **Add route** in `src/App.tsx`:
   ```typescript
   <Route path="/tools/your-tool" element={<YourTool />} />
   ```
4. **Add SEO** (optional) - Use `useMetaTags` hook for dynamic meta tags

### Tool Component Structure

```typescript
import PageLayout from '../components/PageLayout';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMetaTags } from '../hooks/useMetaTags';

export default function YourTool() {
  usePageTitle('Your Tool Name');
  useMetaTags({
    title: 'Your Tool Name | ShalConnects',
    description: 'Tool description for SEO',
    // ... other meta tags
  });

  return (
    <PageLayout title="Your Tool Name">
      {/* Your tool content */}
    </PageLayout>
  );
}
```

## 📚 Documentation

- `DEPLOY_NOW.md` - Quick deployment checklist
- `PADDLE_TROUBLESHOOTING.md` - Paddle integration guide
- `PADDLE_DOMAIN_APPROVAL.md` - Domain approval process
- `VERCEL_DEPLOY_INSTRUCTIONS.md` - Vercel deployment guide
- `QUICK_HOSTING_SETUP.md` - File hosting options

## 🔒 Security

- API keys stored as environment variables
- Server-side transaction verification
- Secure file download with token validation
- CORS headers configured for API routes

## 📝 License

Copyright © 2025 ShalConnects. All rights reserved.

## 🤝 Contributing

This is a private project. For issues or questions, contact support@shalconnects.com

## 📞 Support

- **Email:** support@shalconnects.com
- **Website:** [shalconnects.com](https://shalconnects.com)
- **GitHub:** [github.com/ShalConnects/Official_site](https://github.com/ShalConnects/Official_site)

---

Built with ❤️ by ShalConnects
