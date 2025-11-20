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

### 💫 Interactive Elements
- Scroll-triggered animations
- Service detail modals
- Animated stats counter
- Contact form with validation
- Active navigation highlighting
- Breadcrumb navigation
- Sidebar navigation for plugin pages

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
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TermsOfService.tsx
│   │   └── RefundPolicy.tsx
│   ├── utils/           # Utility functions
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
```

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
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Tailwind CSS** - Styling (via CDN)
- **Paddle** - Payment processing
- **Vercel** - Hosting and serverless functions

## 📄 Pages & Routes

- `/` - Homepage with services and portfolio
- `/services/:serviceSlug` - Service detail pages
- `/services/wordpress/plugins/:pluginSlug` - Plugin product pages
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
