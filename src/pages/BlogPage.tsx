import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, FileText, Sparkles, Share2, Mail, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { useMetaTags } from '../hooks/useMetaTags';
import { blogPosts, getAllCategories, getFeaturedPost, getPostsByCategory } from '../utils/blogData';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  useMetaTags({
    title: 'Blog | ShalConnects',
    description: 'Read the latest articles about web development, design, e-commerce, and digital marketing from ShalConnects.',
    keywords: 'blog, web development, design, e-commerce, WordPress, Shopify, digital marketing',
    ogTitle: 'Blog - ShalConnects',
    ogDescription: 'Latest articles about web development, design, and e-commerce.',
    ogImage: '/logo.png',
    twitterTitle: 'Blog - ShalConnects',
    twitterDescription: 'Latest articles about web development, design, and e-commerce.',
    twitterImage: '/logo.png'
  });

  const categories = getAllCategories();
  const featuredPost = getFeaturedPost();
  
  const filteredPosts = useMemo(() => {
    let posts = blogPosts.filter(post => !post.featured);
    
    // Category filter
    if (selectedCategory) {
      posts = getPostsByCategory(selectedCategory).filter(post => !post.featured);
    }
    
    return posts;
  }, [selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleShare = (e: React.MouseEvent, postId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${postId}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: title,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {});
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      return;
    }
    setIsSubmittingNewsletter(true);
    // Newsletter subscription logic here
    setTimeout(() => {
      setIsSubmittingNewsletter(false);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <PageLayout title="Blog">
      {/* Header Section - Minimalist */}
      <section className="bg-gray-800/50 py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
              Blog
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
              Insights, tips, and guides about web development, design, e-commerce, and digital marketing
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post Section - Enhanced */}
      {featuredPost && (
        <section className="py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-gradient-theme" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Post</h2>
            </div>
            <Link
              to={`/blog/${featuredPost.id}`}
              className="group block bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 overflow-hidden hover:shadow-xl"
            >
              <div className="md:flex">
                {featuredPost.image && (
                  <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-700/30 overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className={`p-6 sm:p-8 md:p-10 ${featuredPost.image ? 'md:w-3/5' : 'w-full'} flex flex-col justify-between`}>
                  <div>
                    <div className="mb-4">
                      <span className="px-3 py-1.5 bg-gradient-theme/20 text-gradient-theme text-xs font-medium rounded-full border border-gradient-theme/30">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-gradient-theme transition-colors line-clamp-2 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(featuredPost.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center text-base font-medium text-gradient-theme group-hover:gap-2 transition-all duration-300">
                      <span>Read Article</span>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Posts Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories Filter - Enhanced */}
          {categories.length > 0 && (
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border transition-all duration-200 ${
                    selectedCategory === null
                      ? 'bg-gradient-theme/20 text-white border-gradient-theme/50 shadow-lg shadow-gradient-theme/20'
                      : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-theme/20 text-white border-gradient-theme/50 shadow-lg shadow-gradient-theme/20'
                        : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Posts Grid - Enhanced Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {paginatedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-gray-800/50 rounded-2xl border border-gray-700/50 transition-all duration-300 hover:border-gray-600/50 hover:shadow-xl hover:shadow-gray-900/50 hover:-translate-y-1 cursor-pointer flex flex-col overflow-hidden"
              >
                {/* Post Image */}
                {post.image && (
                  <div className="w-full h-48 sm:h-56 bg-gray-700/30 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="px-3 py-1.5 bg-gradient-theme/20 text-gradient-theme text-xs font-medium rounded-full border border-gradient-theme/30">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-gradient-theme transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base text-gray-300 mb-4 line-clamp-3 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 pb-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min</span>
                    </div>
                  </div>

                  {/* Read More and Share */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center text-sm font-medium text-gradient-theme group-hover:gap-2 transition-all duration-300">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <button
                      onClick={(e) => handleShare(e, post.id, post.title)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0"
                      title="Share this post"
                      aria-label="Share this post"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No blog posts found. Check back soon!</p>
            </div>
          )}

          {/* Pagination - Enhanced */}
          {totalPages > 1 && (
            <div className="mt-10 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 sm:p-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-gray-600/50 hover:bg-gray-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2 overflow-x-auto">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 text-sm sm:text-base rounded-lg border transition-all duration-200 whitespace-nowrap ${
                          currentPage === page
                            ? 'bg-gradient-theme/20 text-white border-gradient-theme/50 shadow-lg shadow-gradient-theme/20'
                            : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50 hover:text-white hover:bg-gray-700/50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-gray-500 text-sm">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 sm:p-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-gray-600/50 hover:bg-gray-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription Section - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 sm:p-10 md:p-12">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-gradient-theme" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Stay Updated</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest articles, tips, and updates delivered to your inbox.
              </p>
            </div>
            {newsletterSubmitted ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-green-400 bg-green-500/20 px-3 sm:px-4 py-2 rounded-lg border border-green-500/30 text-sm sm:text-base">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Thank you for subscribing!</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gradient-theme text-white placeholder-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNewsletter}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-theme text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

