import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { trackPageView } from './utils/analytics';
import { serviceCategories } from './data/serviceCategories';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './pages/LandingPage';
import { lazy, Suspense } from 'react';
import { isStoreContext } from './utils/storeUtils';
import { ThemeProvider } from './contexts/ThemeContext';

const ServicePage = lazy(() => import('./pages/ServicePage'));
const PluginPage = lazy(() => import('./pages/PluginPage'));
const DownloadPage = lazy(() => import('./pages/DownloadPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const AITextFormatter = lazy(() => import('./pages/AITextFormatter'));
const FitQuest = lazy(() => import('./pages/FitQuest'));
const PasswordGenerator = lazy(() => import('./pages/PasswordGenerator'));
const URLEncoderDecoder = lazy(() => import('./pages/URLEncoderDecoder'));
const LoremIpsumGenerator = lazy(() => import('./pages/LoremIpsumGenerator'));
const QRCodeGenerator = lazy(() => import('./pages/QRCodeGenerator'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const StoreHome = lazy(() => import('./pages/StoreHome'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));

function ShalConnectsPortfolio() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loading screen on first visit (not in sessionStorage)
    return !sessionStorage.getItem('hasLoaded');
  });
  
  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  // Check if we're on the store subdomain or store routes
  const isStoreSubdomain = isStoreContext();
  
  // Mark as loaded when loading completes
  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('hasLoaded', 'true');
  };
  const routeFallback = <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  return (
    <ThemeProvider>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <ScrollToTop />
      <Analytics />
      <Suspense fallback={routeFallback}>
    <Routes>
      <Route path="/download" element={<DownloadPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/ai-formatter" element={<AITextFormatter />} />
        <Route path="/tools/fitquest" element={<FitQuest />} />
        <Route path="/tools/password-generator" element={<PasswordGenerator />} />
        <Route path="/tools/url-encoder-decoder" element={<URLEncoderDecoder />} />
        <Route path="/tools/lorem-ipsum" element={<LoremIpsumGenerator />} />
        <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
      <Route path="/store" element={isStoreSubdomain ? <Navigate to="/" replace /> : <StoreHome />} />
      <Route path="/store/:productSlug" element={<PluginPage />} />
      <Route path="/services/:serviceSlug" element={<ServicePage serviceCategories={serviceCategories as any} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund" element={<RefundPolicy />} />
        {isStoreSubdomain && <Route path="/:productSlug" element={<PluginPage />} />}
        <Route path="/" element={isStoreSubdomain ? <StoreHome /> : <LandingPage />} />
    </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default ShalConnectsPortfolio;
