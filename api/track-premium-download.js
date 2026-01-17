// Backend API endpoint to track premium version downloads
// Vercel Serverless Function
// Uses Vercel KV for persistent storage (or in-memory fallback)

// For Vercel KV (recommended)
// @ts-ignore - Vercel KV types
let kv = null;
try {
  // Try to import Vercel KV if available
  // In production, this will be available via @vercel/kv
  if (typeof process !== 'undefined' && process.env.KV_REST_API_URL) {
    // KV will be initialized via environment variables
    // We'll use fetch API to interact with KV REST API
  }
} catch (e) {
  console.log('Vercel KV not available, using in-memory fallback');
}

// In-memory fallback (resets on serverless function restart)
let memoryStore = {
  today: 0,
  yesterday: 0,
  last7days: [],
  allTime: 0
};

// Initialize yesterday's count at startup
const initializeStore = () => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Store yesterday's date for comparison
  if (!memoryStore.lastUpdated) {
    memoryStore.lastUpdated = yesterday.toDateString();
    memoryStore.yesterday = 0;
  }
};

initializeStore();

/**
 * Get current date key for tracking
 */
function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Get stats from Vercel KV
 */
async function getKVStats() {
  try {
    if (!process.env.KV_REST_API_URL) {
      return null;
    }

    // Use Vercel KV REST API
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return JSON.parse(data.result || '{}');
    }
  } catch (error) {
    console.error('KV fetch error:', error);
  }
  return null;
}

/**
 * Save stats to Vercel KV
 */
async function saveKVStats(stats) {
  try {
    if (!process.env.KV_REST_API_URL) {
      return false;
    }

    const response = await fetch(`${process.env.KV_REST_API_URL}/set/stats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: JSON.stringify(stats) }),
    });

    return response.ok;
  } catch (error) {
    console.error('KV save error:', error);
    return false;
  }
}

/**
 * Get stats (from KV or memory)
 */
async function getStats() {
  const kvStats = await getKVStats();
  if (kvStats) {
    return kvStats;
  }
  return memoryStore;
}

/**
 * Save stats (to KV or memory)
 */
async function saveStats(stats) {
  const saved = await saveKVStats(stats);
  if (!saved) {
    // Fallback to memory
    Object.assign(memoryStore, stats);
  }
}

/**
 * Increment download counter
 */
async function incrementDownload() {
  const stats = await getStats();
  const now = new Date();
  const todayKey = getDateKey(now);
  
  // Initialize stats if needed
  if (!stats.last7days) {
    stats.last7days = [];
  }
  if (!stats.allTime) {
    stats.allTime = 0;
  }
  if (!stats.today) {
    stats.today = 0;
  }
  if (!stats.yesterday) {
    stats.yesterday = 0;
  }

  // Check if we need to roll over to a new day
  const lastUpdated = stats.lastUpdated || todayKey;
  if (lastUpdated !== todayKey) {
    // Move today to yesterday
    stats.yesterday = stats.today || 0;
    stats.today = 0;
    
    // Update last 7 days array (keep only last 7 days)
    if (stats.last7days) {
      stats.last7days = stats.last7days.slice(-6); // Keep last 6, add today
      stats.last7days.push({ date: lastUpdated, count: stats.yesterday });
    } else {
      stats.last7days = [{ date: lastUpdated, count: stats.yesterday }];
    }
    
    stats.lastUpdated = todayKey;
  }

  // Increment counters
  stats.today = (stats.today || 0) + 1;
  stats.allTime = (stats.allTime || 0) + 1;

  // Calculate last 7 days total
  const last7daysTotal = (stats.last7days || []).reduce((sum, day) => sum + (day.count || 0), 0) + stats.today;

  await saveStats(stats);

  return {
    today: stats.today,
    yesterday: stats.yesterday,
    last7days: last7daysTotal,
    allTime: stats.allTime
  };
}

/**
 * Vercel Serverless Function
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Increment download counter
    const stats = await incrementDownload();

    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Track download error:', error);
    return res.status(500).json({ 
      error: 'Failed to track download',
      message: error.message 
    });
  }
}
