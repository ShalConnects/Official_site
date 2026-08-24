// Fetch WordPress.org plugin download statistics (cached 2 hours)
import { setCorsHeaders, handleMethodGuard } from './lib/http.js';

const PLUGIN_SLUG = 'dynamic-variation-images';
const WORDPRESS_ORG_URL = `https://wordpress.org/plugins/${PLUGIN_SLUG}/advanced/`;
const CACHE_DURATION = 2 * 60 * 60 * 1000;

let cache = {
  data: null,
  timestamp: null,
};

function parseStats(html) {
  try {
    const tableMatch = html.match(
      /<table[^>]*id="plugin-download-history-stats"[^>]*>([\s\S]*?)<\/table>/
    );
    if (!tableMatch) {
      throw new Error('Stats table not found');
    }

    const tableContent = tableMatch[1];
    const stats = { today: 0, yesterday: 0, last7days: 0, allTime: 0 };

    const rowMatches = tableContent.matchAll(
      /<tr[^>]*>[\s\S]*?<th[^>]*scope="row"[^>]*>(.*?)<\/th>[\s\S]*?<td[^>]*>(.*?)<\/td>[\s\S]*?<\/tr>/g
    );

    for (const match of rowMatches) {
      const label = match[1].trim().toLowerCase();
      const value = parseInt(match[2].trim().replace(/,/g, ''), 10) || 0;

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
    console.error('Error parsing WordPress.org stats:', error.message);
    return null;
  }
}

async function fetchWordPressStats() {
  const response = await fetch(WORDPRESS_ORG_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; ShalConnects/1.0; +https://store.shalconnects.com)',
    },
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
}

export default async function handler(req, res) {
  setCorsHeaders(req, res, 'GET, OPTIONS');

  if (handleMethodGuard(req, res, ['GET'])) return;

  try {
    const now = Date.now();
    if (cache.data && cache.timestamp && now - cache.timestamp < CACHE_DURATION) {
      return res.status(200).json({
        ...cache.data,
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000 / 60),
      });
    }

    const stats = await fetchWordPressStats();
    cache.data = stats;
    cache.timestamp = now;

    return res.status(200).json({
      ...stats,
      cached: false,
    });
  } catch (error) {
    console.error('WordPress stats API error:', error.message);
    if (cache.data) {
      return res.status(200).json({
        ...cache.data,
        cached: true,
        stale: true,
        cacheAge: cache.timestamp
          ? Math.floor((Date.now() - cache.timestamp) / 1000 / 60)
          : null,
      });
    }
    return res.status(500).json({
      error: 'Failed to fetch WordPress.org statistics',
    });
  }
}
