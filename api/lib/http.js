/**
 * Shared HTTP helpers for Vercel serverless API routes.
 */

const DEFAULT_ALLOWED_ORIGINS = [
  'https://shalconnects.com',
  'https://www.shalconnects.com',
  'https://store.shalconnects.com',
];

function getAllowedOrigins() {
  const fromEnv = process.env.ALLOWED_ORIGINS;
  if (fromEnv) {
    return fromEnv.split(',').map((o) => o.trim()).filter(Boolean);
  }
  const origins = [...DEFAULT_ALLOWED_ORIGINS];
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173');
  }
  return origins;
}

/**
 * Set CORS headers restricted to known origins (not *).
 */
export function setCorsHeaders(req, res, methods = 'GET, OPTIONS') {
  const origin = req.headers.origin;
  const allowed = getAllowedOrigins();
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function setNoCacheHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

/**
 * Handle OPTIONS and reject non-allowed methods. Returns true if response was sent.
 */
export function handleMethodGuard(req, res, allowedMethods) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }
  return false;
}

/** Paddle transaction IDs look like txn_... */
export function isValidTransactionId(id) {
  return typeof id === 'string' && /^txn_[a-zA-Z0-9]+$/.test(id.trim());
}
