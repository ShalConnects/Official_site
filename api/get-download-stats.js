// Backend API endpoint to get combined download statistics
// Vercel Serverless Function
// Returns both WordPress.org (free) and premium download stats

/**
 * Get WordPress.org stats
 */
async function getWordPressStats() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173');
    
    const response = await fetch(`${baseUrl}/api/wordpress-stats`, {
      headers: {
        'User-Agent': 'ShalConnects-Stats-API/1.0'
      }
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching WordPress stats:', error);
  }
  return null;
}

/**
 * Get premium stats
 */
async function getPremiumStats() {
  try {
    // Try to get from KV first
    if (process.env.KV_REST_API_URL) {
      const response = await fetch(`${process.env.KV_REST_API_URL}/get/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const stats = JSON.parse(data.result || '{}');
        
        // Calculate last 7 days
        const last7days = (stats.last7days || []).reduce((sum, day) => sum + (day.count || 0), 0) + (stats.today || 0);
        
        return {
          today: stats.today || 0,
          yesterday: stats.yesterday || 0,
          last7days: last7days,
          allTime: stats.allTime || 0
        };
      }
    }
  } catch (error) {
    console.error('Error fetching premium stats from KV:', error);
  }

  // Return zeros if no stats available
  return {
    today: 0,
    yesterday: 0,
    last7days: 0,
    allTime: 0
  };
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
    // Fetch both stats in parallel
    const [wordpressStats, premiumStats] = await Promise.all([
      getWordPressStats(),
      getPremiumStats()
    ]);

    // Get current timestamp for premium stats (real-time)
    const premiumLastUpdated = new Date().toISOString();

    return res.status(200).json({
      free: wordpressStats ? {
        ...wordpressStats,
        lastUpdated: wordpressStats.cached ? new Date(Date.now() - (wordpressStats.cacheAge * 60 * 1000)).toISOString() : new Date().toISOString()
      } : {
        today: 0,
        yesterday: 0,
        last7days: 0,
        allTime: 0,
        error: 'Unable to fetch WordPress.org statistics',
        lastUpdated: null
      },
      premium: {
        ...premiumStats,
        lastUpdated: premiumLastUpdated
      }
    });
  } catch (error) {
    console.error('Get download stats error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch download statistics',
      message: error.message 
    });
  }
}
