// Backend API endpoint to fetch WordPress.org plugin download statistics
// Vercel Serverless Function
// Caches results for 2 hours to avoid rate limiting

const PLUGIN_SLUG = 'dynamic-variation-images';
const WORDPRESS_ORG_URL = `https://wordpress.org/plugins/${PLUGIN_SLUG}/advanced/`;
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Cache storage (in-memory, resets on serverless function restart)
let cache = {
  data: null,
  timestamp: null
};

/**
 * Parse download stats from WordPress.org HTML
 */
function parseStats(html) {
  try {
    // Extract the table with download history stats
    const tableMatch = html.match(/<table[^>]*id="plugin-download-history-stats"[^>]*>([\s\S]*?)<\/table>/);
    if (!tableMatch) {
      throw new Error('Stats table not found');
    }

    const tableContent = tableMatch[1];
    const stats = {
      today: 0,
      yesterday: 0,
      last7days: 0,
      allTime: 0
    };

    // Extract each row
    const rowMatches = tableContent.matchAll(/<tr[^>]*>[\s\S]*?<th[^>]*scope="row"[^>]*>(.*?)<\/th>[\s\S]*?<td[^>]*>(.*?)<\/td>[\s\S]*?<\/tr>/g);
    
    for (const match of rowMatches) {
      const label = match[1].trim().toLowerCase();
      const value = parseInt(match[2].trim().replace(/,/g, '')) || 0;

      if (label.includes('today')) {
        stats.today = value;
      } else if (label.includes('yesterday')) {
        stats.yesterday = value;
      } else if (label.includes('last 7 days') || label.includes('last7days')) {
        stats.last7days = value;
      } else if (label.includes('all time') || label.includes('alltime')) {
        stats.allTime = value;
      }
    }

    return stats;
  } catch (error) {
    console.error('Error parsing WordPress.org stats:', error);
    return null;
  }
}

/**
 * Fetch stats from WordPress.org
 */
async function fetchWordPressStats() {
  try {
    const response = await fetch(WORDPRESS_ORG_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShalConnects/1.0; +https://store.shalconnects.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`WordPress.org returned ${response.status}`);
    }

    const html = await response.text();
    const stats = parseStats(html);

    if (!stats) {
      throw new Error('Failed to parse stats from HTML');
    }

    return stats;
  } catch (error) {
    console.error('Error fetching WordPress.org stats:', error);
    throw error;
  }
}

/**
 * Vercel Serverless Function
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_DURATION) {
      return res.status(200).json({
        ...cache.data,
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000 / 60) // minutes
      });
    }

    // Fetch fresh data
    const stats = await fetchWordPressStats();

    // Update cache
    cache.data = stats;
    cache.timestamp = now;

    return res.status(200).json({
      ...stats,
      cached: false
    });
  } catch (error) {
    console.error('WordPress stats API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch WordPress.org statistics',
      message: error.message 
    });
  }
}
