import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ChevronDown, ChevronUp, Minus, Mail, Check } from 'lucide-react';
import { BlogPost, getRecentPosts, getArchiveByMonth, getCategoryCounts } from '../utils/blogData';

interface BlogSidebarProps {
  currentPostId?: string;
}

export default function BlogSidebar({ currentPostId }: BlogSidebarProps) {
  const [isRecentVisible, setIsRecentVisible] = useState(true);
  const [isArchiveVisible, setIsArchiveVisible] = useState(true);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [isNewsletterVisible, setIsNewsletterVisible] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const recentPosts = getRecentPosts(currentPostId, 5);
  const archiveItems = getArchiveByMonth();
  const categoryCounts = getCategoryCounts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      return;
    }
    setIsSubmittingNewsletter(true);
    setTimeout(() => {
      setIsSubmittingNewsletter(false);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <aside className="w-64 xl:w-72 space-y-5">
      {/* Recent Posts Section */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => setIsRecentVisible(!isRecentVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Recent Posts
          </h3>
          <div className="flex items-center gap-2">
            {isRecentVisible ? (
              <Minus size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isRecentVisible ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pb-4 space-y-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block group hover:bg-gray-800/30 rounded-lg p-2 transition-colors"
              >
                <h4 className="text-sm font-medium text-white mb-1 group-hover:text-gradient-theme transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Archive Section */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => setIsArchiveVisible(!isArchiveVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Archive
          </h3>
          <div className="flex items-center gap-2">
            {isArchiveVisible ? (
              <Minus size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isArchiveVisible ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pb-4 space-y-2">
            {archiveItems.map((item) => (
              <Link
                key={item.month}
                to={`/blog?archive=${item.month}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/30 transition-colors group"
              >
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {item.display}
                </span>
                <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Categories
          </h3>
          <div className="flex items-center gap-2">
            {isCategoriesVisible ? (
              <Minus size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCategoriesVisible ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pb-4 space-y-2">
            {categoryCounts.map((item) => (
              <Link
                key={item.category}
                to={`/blog?category=${encodeURIComponent(item.category)}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/30 transition-colors group"
              >
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup Section */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => setIsNewsletterVisible(!isNewsletterVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Newsletter
          </h3>
          <div className="flex items-center gap-2">
            {isNewsletterVisible ? (
              <Minus size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isNewsletterVisible ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pb-4">
            {newsletterSubmitted ? (
              <div className="text-center py-3">
                <div className="inline-flex items-center gap-2 text-green-400 bg-green-500/20 px-3 py-2 rounded-lg border border-green-500/30 text-xs">
                  <Check className="w-4 h-4" />
                  <span>Subscribed!</span>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  Get the latest articles delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gradient-theme text-white placeholder-gray-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNewsletter}
                    className="w-full px-3 py-2 text-sm bg-gradient-theme text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

