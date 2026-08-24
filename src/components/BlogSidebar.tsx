import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ChevronDown, Minus, Mail } from 'lucide-react';
import { getRecentPosts, getArchiveByMonth, getCategoryCounts } from '../utils/blogData';
import NewsletterForm from './NewsletterForm';

interface BlogSidebarProps {
  currentPostId?: string;
}

export default function BlogSidebar({ currentPostId }: BlogSidebarProps) {
  const [isRecentVisible, setIsRecentVisible] = useState(true);
  const [isArchiveVisible, setIsArchiveVisible] = useState(true);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [isNewsletterVisible, setIsNewsletterVisible] = useState(true);

  const recentPosts = getRecentPosts(currentPostId, 5);
  const archiveItems = getArchiveByMonth();
  const categoryCounts = getCategoryCounts();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <aside className="w-64 xl:w-72 space-y-5">
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsRecentVisible(!isRecentVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Recent Posts</h3>
          {isRecentVisible ? <Minus size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isRecentVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 space-y-3">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="block group">
                <h4 className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 mb-1">{post.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.date)}</span>
                  <Clock className="w-3 h-3 ml-1" />
                  <span>{post.readTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsArchiveVisible(!isArchiveVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Archive</h3>
          {isArchiveVisible ? <Minus size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isArchiveVisible ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 space-y-2">
            {archiveItems.map(({ month, display, count }) => (
              <div key={month} className="flex items-center justify-between text-sm text-gray-400">
                <span>{display}</span>
                <span className="text-gray-500">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Categories</h3>
          {isCategoriesVisible ? <Minus size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCategoriesVisible ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 space-y-2">
            {categoryCounts.map(({ category, count }) => (
              <Link key={category} to="/blog" className="flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors">
                <span>{category}</span>
                <span className="text-gray-500">({count})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsNewsletterVisible(!isNewsletterVisible)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/70 transition-colors"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
            <Mail size={14} /> Newsletter
          </h3>
          {isNewsletterVisible ? <Minus size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isNewsletterVisible ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-400 mb-3">Get the latest articles delivered to your inbox.</p>
            <NewsletterForm variant="sidebar" />
          </div>
        </div>
      </div>
    </aside>
  );
}
