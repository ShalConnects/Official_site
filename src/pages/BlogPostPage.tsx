import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, User, ArrowRight, ChevronLeft, ChevronRight, Share2, Twitter, Facebook, Linkedin, Copy, Check, X, ZoomIn, Menu, FileText } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageSidebar from '../components/PageSidebar';
import BlogSidebar from '../components/BlogSidebar';
import { useMetaTags } from '../hooks/useMetaTags';
import { getPostById, getRelatedPosts, getPreviousPost, getNextPost, blogPosts } from '../utils/blogData';

// Simple markdown to HTML converter for basic markdown syntax
function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Code blocks (triple backticks) - must be processed before other replacements
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text';
    const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
    return `<div class="code-block-wrapper my-6" data-code-id="${codeId}">
      <div class="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <span class="text-xs text-gray-400 font-mono">${language}</span>
        <button onclick="copyCode('${codeId}')" class="copy-code-btn flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded transition-colors" data-code-id="${codeId}">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          <span class="copy-text">Copy</span>
        </button>
      </div>
      <pre class="bg-gray-900 p-4 rounded-b-lg overflow-x-auto border border-gray-700"><code class="language-${language}" id="${codeId}">${code.trim()}</code></pre>
    </div>`;
  });
  
  // Inline code (single backticks)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-400 border border-gray-700">$1</code>');
  
  // Headers with IDs for TOC navigation
  let headingCounter = 0;
  html = html.replace(/^### (.*$)/gim, (match, text) => {
    const id = `heading-${headingCounter++}`;
    return `<h3 id="${id}" class="text-2xl font-bold mt-8 mb-4 text-white">${text}</h3>`;
  });
  html = html.replace(/^## (.*$)/gim, (match, text) => {
    const id = `heading-${headingCounter++}`;
    return `<h2 id="${id}" class="text-3xl font-bold mt-10 mb-6 text-white">${text}</h2>`;
  });
  html = html.replace(/^# (.*$)/gim, (match, text) => {
    const id = `heading-${headingCounter++}`;
    return `<h1 id="${id}" class="text-4xl font-bold mt-12 mb-8 text-white">${text}</h1>`;
  });
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gradient-theme hover:opacity-80 underline">$1</a>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
  
  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>\n?)+/g, (match) => {
    return '<ul class="list-disc mb-4 space-y-2">' + match + '</ul>';
  });
  
  // Paragraphs (split by double newlines)
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    p = p.trim();
    if (p && !p.startsWith('<') && !p.includes('code-block-wrapper')) {
      return `<p class="mb-4 text-gray-300 leading-relaxed">${p}</p>`;
    }
    return p;
  }).join('\n');
  
  // Line breaks (but not inside code blocks)
  html = html.replace(/(?<!<\/code>)\n(?!<code)/g, '<br />');
  
  return html;
}

export default function BlogPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [copied, setCopied] = useState(false);
  const [showStickyShare, setShowStickyShare] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isBlogSidebarVisible, setIsBlogSidebarVisible] = useState(false);
  
  if (!postId) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostById(postId);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${post.title} - ${post.excerpt}`;
  const htmlContent = markdownToHtml(post.content);

  // Generate TOC from headings in content
  const tocItems = useMemo(() => {
    const headings: { id: string; label: string; level: number }[] = [];
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    let idCounter = 0;

    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${idCounter++}`;
      headings.push({ id, label: text, level });
    }

    return headings;
  }, [post.content]);

  // Update heading IDs in HTML after render
  useEffect(() => {
    if (tocItems.length > 0) {
      const articleContent = document.querySelector('article .prose');
      if (articleContent) {
        const headings = articleContent.querySelectorAll('h1, h2, h3');
        headings.forEach((heading, index) => {
          if (index < tocItems.length) {
            heading.id = tocItems[index].id;
          }
        });
      }
    }
  }, [htmlContent, tocItems]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyShare(window.scrollY > 300);
      
      // Calculate reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Add copy code function to window for inline handlers
    (window as any).copyCode = (codeId: string) => {
      const codeElement = document.getElementById(codeId);
      if (codeElement) {
        const text = codeElement.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
          const btn = document.querySelector(`button[data-code-id="${codeId}"]`);
          if (btn) {
            const copyText = btn.querySelector('.copy-text');
            if (copyText) {
              copyText.textContent = 'Copied!';
              setTimeout(() => {
                copyText.textContent = 'Copy';
              }, 2000);
            }
          }
        });
      }
    };
    return () => {
      delete (window as any).copyCode;
    };
  }, []);


  useEffect(() => {
    // Make images clickable for lightbox
    const articleContent = document.querySelector('article .prose');
    if (articleContent) {
      const images = articleContent.querySelectorAll('img');
      images.forEach((img) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          setLightboxImage(img.getAttribute('src') || null);
        });
      });
    }
  }, [post.content]);

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(articleUrl);
    const text = encodeURIComponent(shareText);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=550,height=420');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=420');
        break;
      case 'copy':
        navigator.clipboard.writeText(articleUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const relatedPosts = getRelatedPosts(postId, 3);
  const previousPost = getPreviousPost(postId);
  const nextPost = getNextPost(postId);

  useMetaTags({
    title: `${post.title} | ShalConnects Blog`,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || post.category,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    ogImage: post.image || '/logo.png',
    twitterTitle: post.title,
    twitterDescription: post.excerpt,
    twitterImage: post.image || '/logo.png'
  });

  const scrollToContact = () => {
    window.location.href = '/#contact';
  };

  return (
    <PageLayout title={post.title}>
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800/50 z-50">
        <div
          className="h-full bg-gradient-theme transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <button
          onClick={() => setIsBlogSidebarVisible(!isBlogSidebarVisible)}
          className="p-2 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700/50 text-white hover:bg-gray-700/50 transition-colors"
          aria-label="Toggle blog sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Blog Sidebar Overlay */}
      {isBlogSidebarVisible && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsBlogSidebarVisible(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Blog Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-gray-900 z-50 transition-transform duration-300 overflow-y-auto ${
        isBlogSidebarVisible ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 pt-24">
          <button
            onClick={() => setIsBlogSidebarVisible(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          <BlogSidebar currentPostId={postId} />
        </div>
      </div>

      {/* Featured/Hero Image */}
      {post.image && (
        <section className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80 z-10"></div>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 w-full">
              <div className="mb-3">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-theme/20 text-gradient-theme text-xs sm:text-sm font-medium rounded-full border border-gradient-theme/30 backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {post.title}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Layout with Sidebar */}
      <div className="flex relative gap-4 lg:gap-6 xl:gap-8">
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Article Header - Enhanced */}
          <section className={`bg-gradient-to-b from-gray-800/60 to-gray-800/40 ${post.image ? 'py-8 sm:py-10' : 'py-12 sm:py-16'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {!post.image && (
                <>
                  {/* Category Badge */}
                  <div className="mb-5">
                    <span className="px-4 py-2 bg-gradient-theme/25 text-gradient-theme text-sm font-semibold rounded-full border border-gradient-theme/40 shadow-lg shadow-gradient-theme/10">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight tracking-tight">
                    {post.title}
                  </h1>
                </>
              )}

              {/* Enhanced Meta Information */}
              <div className="flex flex-wrap items-center gap-5 text-base text-gray-400 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-gray-700/50 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-300">{post.author}</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-gray-700/50 rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>{formatDate(post.date)}</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-gray-700/50 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{post.readTime} min read</span>
                </div>
              </div>

              {/* Tags - Enhanced */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white text-sm rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 hover:scale-105"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Article Content - Optimized Layout */}
          <article className="py-10 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
              <style>{`
                .prose {
                  font-size: 18px;
                  line-height: 1.75;
                  color: #d1d5db;
                }
                .prose h1 {
                  font-size: 2.25em;
                  margin-top: 2em;
                  margin-bottom: 1em;
                  font-weight: 700;
                  letter-spacing: -0.01em;
                  line-height: 1.25;
                  color: #ffffff;
                }
                .prose h2 {
                  font-size: 1.875em;
                  margin-top: 2em;
                  margin-bottom: 0.875em;
                  font-weight: 700;
                  letter-spacing: -0.01em;
                  line-height: 1.3;
                  color: #ffffff;
                  padding-top: 0.75em;
                  border-top: 1px solid rgba(75, 85, 99, 0.25);
                }
                .prose h3 {
                  font-size: 1.5em;
                  margin-top: 1.5em;
                  margin-bottom: 0.625em;
                  font-weight: 600;
                  line-height: 1.35;
                  color: #f3f4f6;
                }
                .prose p {
                  margin-bottom: 1.5em;
                  line-height: 1.75;
                  color: #d1d5db;
                }
                .prose p:first-of-type {
                  font-size: 1.125em;
                  line-height: 1.8;
                  color: #e5e7eb;
                  margin-bottom: 1.75em;
                }
                .prose ul, .prose ol {
                  margin: 1.25em 0;
                  padding-left: 1.5em;
                }
                .prose li {
                  margin-bottom: 0.625em;
                  line-height: 1.75;
                  color: #d1d5db;
                }
                .prose li::marker {
                  color: #9ca3af;
                }
                .prose strong {
                  color: #ffffff;
                  font-weight: 600;
                }
                .prose em {
                  color: #e5e7eb;
                  font-style: italic;
                }
                .prose a {
                  color: #60a5fa;
                  text-decoration: underline;
                  text-underline-offset: 2px;
                  transition: all 0.2s;
                }
                .prose a:hover {
                  color: #93c5fd;
                }
                .prose img {
                  cursor: pointer;
                  transition: transform 0.2s ease;
                  border-radius: 10px;
                  margin: 2em 0;
                  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
                  max-width: 100%;
                  height: auto;
                }
                .prose img:hover {
                  transform: scale(1.01);
                }
                .prose code {
                  font-size: 0.9em;
                  padding: 0.2em 0.4em;
                  border-radius: 4px;
                }
                .prose pre {
                  margin: 2em 0;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                .prose blockquote {
                  border-left: 3px solid #60a5fa;
                  padding-left: 1.25em;
                  margin: 1.75em 0;
                  font-style: italic;
                  color: #cbd5e1;
                  background: rgba(59, 130, 246, 0.05);
                  padding: 1.25em 1.25em 1.25em 1.5em;
                  border-radius: 6px;
                }
                .prose hr {
                  border: none;
                  border-top: 1px solid rgba(75, 85, 99, 0.25);
                  margin: 2.5em 0;
                }
              `}</style>
            </div>
          </article>

          {/* Author Bio Section - Enhanced */}
          <section className="bg-gradient-to-b from-gray-800/40 to-gray-800/20 py-10 sm:py-14 border-t border-gray-700/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 p-8 sm:p-10 shadow-xl">
                <div className="flex items-start gap-5 sm:gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-theme/30 flex items-center justify-center border-2 border-gradient-theme/50 flex-shrink-0 shadow-lg">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-gradient-theme" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{post.author}</h3>
                    <p className="text-base sm:text-lg text-gray-300 mb-5 leading-relaxed">
                      Expert in web development, design, and digital marketing. Passionate about helping businesses grow online with modern solutions and best practices.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="px-3 py-1.5 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        More articles by {post.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Floating Share Buttons - Left Side (Medium Style) */}
          {showStickyShare && (
            <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 p-2 flex flex-col gap-2 shadow-lg">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2.5 bg-gray-700/50 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg border border-gray-600/50 hover:border-blue-500/50 transition-colors"
                  title="Share on Twitter"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2.5 bg-gray-700/50 hover:bg-blue-600/20 text-gray-400 hover:text-blue-500 rounded-lg border border-gray-600/50 hover:border-blue-600/50 transition-colors"
                  title="Share on Facebook"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2.5 bg-gray-700/50 hover:bg-blue-700/20 text-gray-400 hover:text-blue-400 rounded-lg border border-gray-600/50 hover:border-blue-700/50 transition-colors"
                  title="Share on LinkedIn"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-colors"
                  title="Copy link"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Blog Sidebar - Right Side (Desktop only) */}
        <div className="hidden lg:block flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <BlogSidebar currentPostId={postId} />
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Article image"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Article Footer CTA */}
      <section className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 py-12 sm:py-16 border-t border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Need Help with Your Project?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Let's work together to bring your vision to life. Get in touch for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#contact"
              className="px-6 py-3 bg-gradient-theme text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <Link
              to="/#contact"
              className="px-6 py-3 bg-gray-700/50 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-600/50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Reading Suggestions */}
      <section className="bg-gray-800/30 py-8 sm:py-12 border-t border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">You Might Also Like</h3>
          <div className="space-y-4">
            {blogPosts
              .filter(p => p.id !== postId && p.category === post.category)
              .slice(0, 3)
              .map((suggestion) => (
                <Link
                  key={suggestion.id}
                  to={`/blog/${suggestion.id}`}
                  className="block p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    {suggestion.image && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={suggestion.image}
                          alt={suggestion.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <span className="px-2 py-1 bg-gradient-theme/20 text-gradient-theme text-xs font-medium rounded-full border border-gradient-theme/30">
                          {suggestion.category}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-gradient-theme transition-colors line-clamp-2">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-2">{suggestion.excerpt}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gradient-theme group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Related Posts Section - Full Width */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-800/30 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-white">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col overflow-hidden"
                >
                  {relatedPost.image && (
                    <div className="w-full h-40 bg-gray-700/30 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-gradient-theme/20 text-gradient-theme text-xs font-medium rounded-full border border-gradient-theme/30">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient-theme transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 flex-1">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center text-sm font-medium text-gradient-theme group-hover:gap-2 transition-all duration-300">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Previous/Next Post Navigation */}
      {(previousPost || nextPost) && (
        <section className="bg-gray-800/50 py-8 sm:py-12 border-t border-gray-700/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previousPost && (
                <Link
                  to={`/blog/${previousPost.id}`}
                  className="group p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-400">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Article</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-gradient-theme transition-colors line-clamp-2">
                    {previousPost.title}
                  </h3>
                </Link>
              )}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.id}`}
                  className="group p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 sm:text-right"
                >
                  <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-400 sm:justify-end">
                    <span>Next Article</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-gradient-theme transition-colors line-clamp-2">
                    {nextPost.title}
                  </h3>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog Footer */}
      <section className="bg-gray-800/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-theme text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Posts</span>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

