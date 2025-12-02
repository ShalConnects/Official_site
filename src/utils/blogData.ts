export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  image?: string;
  tags?: string[];
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'getting-started-with-wordpress',
    title: 'Getting Started with WordPress: A Complete Guide',
    excerpt: 'Learn everything you need to know to start building your website with WordPress. From installation to customization, we cover it all.',
    image: '/images/wordpress-guide.png',
    featured: true,
    content: `# Getting Started with WordPress: A Complete Guide

WordPress is one of the most popular content management systems in the world, powering over 40% of all websites. Whether you're building a blog, business website, or e-commerce store, WordPress offers the flexibility and power you need.

## Why Choose WordPress?

WordPress is an excellent choice for beginners and professionals alike because it's:

- **Easy to use**: No coding knowledge required
- **Highly customizable**: Thousands of themes and plugins
- **SEO-friendly**: Built with search engines in mind
- **Community-supported**: Large community and extensive documentation
- **Cost-effective**: Free and open-source

## Getting Started

### 1. Choose Your Hosting

Before you can install WordPress, you'll need web hosting. Look for hosting providers that offer:
- One-click WordPress installation
- Good uptime and speed
- Customer support
- SSL certificates

### 2. Install WordPress

Most hosting providers offer one-click WordPress installation. Simply:
1. Log into your hosting control panel
2. Find the WordPress installer
3. Follow the setup wizard
4. Choose your admin username and password

### 3. Choose a Theme

Your theme determines how your website looks. You can:
- Use a free theme from the WordPress repository
- Purchase a premium theme
- Have a custom theme designed

### 4. Install Essential Plugins

Plugins extend WordPress functionality. Essential plugins include:
- **SEO plugin**: Help your site rank in search engines
- **Security plugin**: Protect your site from threats
- **Backup plugin**: Keep your data safe
- **Contact form plugin**: Allow visitors to reach you

## Next Steps

Once your WordPress site is set up, you can start:
- Creating pages and posts
- Customizing your design
- Adding functionality with plugins
- Optimizing for search engines

Need help with your WordPress site? [Contact us](/contact) for professional WordPress development and customization services.`,
    author: 'ShalConnects Team',
    date: '2024-01-15',
    category: 'WordPress',
    readTime: 5,
    tags: ['WordPress', 'Web Development', 'Beginner Guide']
  },
  {
    id: 'shopify-store-optimization',
    title: '10 Tips to Optimize Your Shopify Store for Better Sales',
    excerpt: 'Discover proven strategies to improve your Shopify store\'s performance and increase conversions. From design to checkout optimization.',
    image: '/images/shopify-optimization.png',
    content: `# 10 Tips to Optimize Your Shopify Store for Better Sales

Running a successful Shopify store requires more than just great products. You need to optimize every aspect of your store to convert visitors into customers. Here are 10 proven tips to boost your sales.

## 1. Optimize Your Product Images

High-quality product images are crucial for online sales. Make sure to:
- Use professional photography
- Show multiple angles
- Include lifestyle images
- Optimize file sizes for fast loading

## 2. Write Compelling Product Descriptions

Your product descriptions should:
- Highlight key benefits
- Address customer pain points
- Use persuasive language
- Include relevant keywords for SEO

## 3. Simplify Your Checkout Process

A complicated checkout process leads to cart abandonment. Streamline by:
- Reducing form fields
- Offering guest checkout
- Providing multiple payment options
- Showing progress indicators

## 4. Improve Site Speed

Fast-loading pages improve user experience and SEO. Optimize by:
- Compressing images
- Using a fast theme
- Minimizing apps and scripts
- Choosing a reliable hosting provider

## 5. Mobile Optimization

With most traffic coming from mobile devices, ensure your store:
- Is fully responsive
- Has touch-friendly buttons
- Loads quickly on mobile
- Provides easy navigation

## 6. Add Customer Reviews

Social proof is powerful. Display customer reviews to:
- Build trust
- Address concerns
- Show product quality
- Improve SEO

## 7. Use Abandoned Cart Recovery

Recover lost sales by:
- Sending email reminders
- Offering discounts
- Creating urgency
- Following up promptly

## 8. Optimize for SEO

Improve your search rankings by:
- Using relevant keywords
- Writing unique product descriptions
- Creating blog content
- Building backlinks

## 9. Offer Excellent Customer Service

Great service leads to:
- Repeat customers
- Positive reviews
- Word-of-mouth referrals
- Higher lifetime value

## 10. Analyze and Test

Continuously improve by:
- Tracking key metrics
- A/B testing different elements
- Gathering customer feedback
- Making data-driven decisions

## Conclusion

Optimizing your Shopify store is an ongoing process. Start with these tips and continue to test and improve. Need help optimizing your store? [Contact us](/contact) for professional Shopify development services.`,
    author: 'ShalConnects Team',
    date: '2024-01-10',
    category: 'E-commerce',
    readTime: 7,
    tags: ['Shopify', 'E-commerce', 'Optimization']
  },
  {
    id: 'web-design-trends-2024',
    title: 'Web Design Trends to Watch in 2024',
    excerpt: 'Stay ahead of the curve with the latest web design trends. From dark mode to micro-interactions, discover what\'s shaping the web in 2024.',
    image: '/images/web-design-trends.png',
    content: `# Web Design Trends to Watch in 2024

The world of web design is constantly evolving. As we move through 2024, several trends are shaping how websites look and function. Here are the key trends to watch.

## 1. Dark Mode Everywhere

Dark mode has become standard across platforms. Benefits include:
- Reduced eye strain
- Better battery life on OLED screens
- Modern, sleek appearance
- Better contrast for certain content

## 2. Minimalist Design

Less is more continues to dominate. Focus on:
- Clean layouts
- Generous white space
- Simple navigation
- Clear typography

## 3. Micro-interactions

Small animations and interactions enhance user experience:
- Button hover effects
- Loading animations
- Scroll-triggered animations
- Feedback for user actions

## 4. Bold Typography

Large, expressive typography makes statements:
- Hero text that commands attention
- Mixing font weights and sizes
- Custom fonts for brand identity
- Readable, accessible text

## 5. Glassmorphism

Frosted glass effects create depth:
- Translucent elements
- Blur effects
- Layered designs
- Modern aesthetic

## 6. 3D Elements

Three-dimensional design adds interest:
- 3D illustrations
- Depth and shadows
- Interactive 3D models
- Immersive experiences

## 7. Sustainability Focus

Eco-friendly design considerations:
- Green color schemes
- Nature-inspired imagery
- Sustainable messaging
- Performance optimization

## 8. Voice User Interface

Voice interactions are becoming more common:
- Voice search optimization
- Voice commands
- Accessibility improvements
- Future-ready design

## 9. AI Integration

Artificial intelligence in web design:
- Personalized experiences
- Chatbots and assistants
- Content generation
- Smart recommendations

## 10. Accessibility First

Designing for everyone:
- WCAG compliance
- Keyboard navigation
- Screen reader support
- Color contrast standards

## Conclusion

These trends reflect a focus on user experience, accessibility, and modern aesthetics. The best designs combine multiple trends while maintaining usability and brand identity.

Ready to update your website with the latest trends? [Contact us](/contact) for professional web design services.`,
    author: 'ShalConnects Team',
    date: '2024-01-05',
    category: 'Design',
    readTime: 6,
    tags: ['Web Design', 'Trends', 'UI/UX']
  }
];

export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map(post => post.category)));
}

export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find(post => post.featured) || blogPosts[0];
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags?.includes(tag));
}

export function getAllTags(): string[] {
  const allTags = blogPosts.flatMap(post => post.tags || []);
  return Array.from(new Set(allTags));
}

export function getRelatedPosts(currentPostId: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostById(currentPostId);
  if (!currentPost) return [];

  const related = blogPosts
    .filter(post => post.id !== currentPostId)
    .map(post => {
      let score = 0;
      // Same category
      if (post.category === currentPost.category) score += 2;
      // Shared tags
      const sharedTags = (post.tags || []).filter(tag => currentPost.tags?.includes(tag));
      score += sharedTags.length;
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);

  return related;
}

export function getPreviousPost(currentPostId: string): BlogPost | undefined {
  const currentIndex = blogPosts.findIndex(post => post.id === currentPostId);
  if (currentIndex <= 0) return undefined;
  return blogPosts[currentIndex - 1];
}

export function getNextPost(currentPostId: string): BlogPost | undefined {
  const currentIndex = blogPosts.findIndex(post => post.id === currentPostId);
  if (currentIndex < 0 || currentIndex >= blogPosts.length - 1) return undefined;
  return blogPosts[currentIndex + 1];
}

export function getRecentPosts(excludePostId?: string, limit: number = 5): BlogPost[] {
  let posts = [...blogPosts];
  if (excludePostId) {
    posts = posts.filter(post => post.id !== excludePostId);
  }
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export interface ArchiveItem {
  month: string;
  year: number;
  count: number;
  display: string;
}

export function getArchiveByMonth(): ArchiveItem[] {
  const archiveMap = new Map<string, number>();
  
  blogPosts.forEach(post => {
    const date = new Date(post.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
  });
  
  return Array.from(archiveMap.entries())
    .map(([key, count]) => {
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        month: key,
        year: parseInt(year),
        count,
        display: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month.localeCompare(a.month);
    });
}

export function getCategoryCounts(): { category: string; count: number }[] {
  const categoryMap = new Map<string, number>();
  
  blogPosts.forEach(post => {
    categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
  });
  
  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

