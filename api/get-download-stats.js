// Combined download statistics (WordPress.org free + premium)
import { getPremiumStatsSummary } from './lib/premium-stats.js';
import { setCorsHeaders, handleMethodGuard } from './lib/http.js';

async function getWordPressStats() {
  try {
    const host = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.SITE_URL || 'http://localhost:5173';

    const response = await fetch(`${host}/api/wordpress-stats`, {
      headers: { 'User-Agent': 'ShalConnects-Stats-API/1.0' },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching WordPress stats:', error.message);
  }
  return null;
}

export default async function handler(req, res) {
  setCorsHeaders(req, res, 'GET, OPTIONS');

  if (handleMethodGuard(req, res, ['GET'])) return;

  try {
    const [wordpressStats, premiumStats] = await Promise.all([
      getWordPressStats(),
      getPremiumStatsSummary(),
    ]);

    const premiumLastUpdated = new Date().toISOString();

    return res.status(200).json({
      free: wordpressStats
        ? {
            ...wordpressStats,
            lastUpdated: wordpressStats.cached
              ? new Date(Date.now() - wordpressStats.cacheAge * 60 * 1000).toISOString()
              : new Date().toISOString(),
          }
        : {
            today: 0,
            yesterday: 0,
            last7days: 0,
            allTime: 0,
            error: 'Unable to fetch WordPress.org statistics',
            lastUpdated: null,
          },
      premium: {
        ...premiumStats,
        lastUpdated: premiumLastUpdated,
      },
    });
  } catch (error) {
    console.error('Get download stats error:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch download statistics',
    });
  }
}
