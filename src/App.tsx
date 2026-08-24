import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { trackPageView } from './utils/analytics';
import { serviceCategories } from './data/serviceCategories';
import type { ServiceCategory } from './pages/ServicePage';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import { lazy, Suspense } from 'react';
import { isStoreContext } from './utils/storeUtils';
import { ThemeProvider } from './contexts/ThemeContext';
import { getToolBySlug } from './data/toolsData';

const ServicePage = lazy(() => import('./pages/ServicePage'));
const PluginPage = lazy(() => import('./pages/PluginPage'));
const DownloadPage = lazy(() => import('./pages/DownloadPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const StoreHome = lazy(() => import('./pages/StoreHome'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AboutCvPage = lazy(() => import('./pages/AboutCvPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'));

function ToolRouter() {
  const { slug } = useParams();
  const tool = slug ? getToolBySlug(slug) : null;
  if (!tool) return <Navigate to="/tools" replace />;
  const Load = tool.Load;
  return <Load />;
}

function ShalConnectsPortfolio() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('hasLoaded');
    } catch {
      return true;
    }
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
    try {
      sessionStorage.setItem('hasLoaded', 'true');
    } catch {
      // ignore storage errors
    }
  };
  const routeFallback = <LoadingScreen variant="minimal" />;
  return (
    <ThemeProvider>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900 text-center">
            <div>
              <p className="text-gray-300 mb-4">Something went wrong loading the site.</p>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: '#176641' }}
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        }
      >
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <ScrollToTop />
      <Analytics />
      <Suspense fallback={routeFallback}>
    <Routes>
      <Route path="/download" element={<DownloadPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/:slug" element={<ToolRouter />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
      <Route path="/store" element={isStoreSubdomain ? <Navigate to="/" replace /> : <StoreHome />} />
      <Route path="/store/:productSlug" element={<PluginPage />} />
      <Route path="/services/:serviceSlug" element={<ServicePage serviceCategories={serviceCategories as ServiceCategory[]} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about-cv" element={<AboutCvPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund" element={<RefundPolicy />} />
        {isStoreSubdomain && <Route path="/:productSlug" element={<PluginPage />} />}
        <Route path="/" element={isStoreSubdomain ? <StoreHome /> : <LandingPage />} />
    </Routes>
      </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default ShalConnectsPortfolio;
