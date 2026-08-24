/**
 * Premium download stats (KV with in-memory fallback).
 * Shared by track-premium-download and download handlers.
 */

let memoryStore = {
  today: 0,
  yesterday: 0,
  last7days: [],
  allTime: 0,
  lastUpdated: null,
};

function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

async function getKVStats() {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return null;
    }
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
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

async function saveKVStats(stats) {
  try {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return false;
    }
    const response = await fetch(`${process.env.KV_REST_API_URL}/set/stats`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
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

async function getStats() {
  const kvStats = await getKVStats();
  if (kvStats) return kvStats;
  return { ...memoryStore };
}

async function saveStats(stats) {
  const saved = await saveKVStats(stats);
  if (!saved) {
    Object.assign(memoryStore, stats);
  }
}

/**
 * Increment premium download counter. Returns summary stats.
 */
export async function incrementPremiumDownload() {
  const stats = await getStats();
  const todayKey = getDateKey();

  if (!stats.last7days) stats.last7days = [];
  if (!stats.allTime) stats.allTime = 0;
  if (!stats.today) stats.today = 0;
  if (!stats.yesterday) stats.yesterday = 0;

  const lastUpdated = stats.lastUpdated || todayKey;
  if (lastUpdated !== todayKey) {
    stats.yesterday = stats.today || 0;
    stats.today = 0;
    stats.last7days = (stats.last7days || []).slice(-6);
    stats.last7days.push({ date: lastUpdated, count: stats.yesterday });
    stats.lastUpdated = todayKey;
  }

  stats.today = (stats.today || 0) + 1;
  stats.allTime = (stats.allTime || 0) + 1;

  const last7daysTotal =
    (stats.last7days || []).reduce((sum, day) => sum + (day.count || 0), 0) + stats.today;

  await saveStats(stats);

  return {
    today: stats.today,
    yesterday: stats.yesterday,
    last7days: last7daysTotal,
    allTime: stats.allTime,
  };
}

/**
 * Read premium stats without incrementing.
 */
export async function getPremiumStatsSummary() {
  const stats = await getStats();
  const last7days =
    (stats.last7days || []).reduce((sum, day) => sum + (day.count || 0), 0) + (stats.today || 0);
  return {
    today: stats.today || 0,
    yesterday: stats.yesterday || 0,
    last7days,
    allTime: stats.allTime || 0,
  };
}
