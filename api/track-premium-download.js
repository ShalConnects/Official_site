// Track premium downloads. Protected by internal secret when configured.
// Prefer server-side increment from download.js; this endpoint is for ops/tools.
import { incrementPremiumDownload } from './lib/premium-stats.js';
import { setCorsHeaders, handleMethodGuard } from './lib/http.js';

export default async function handler(req, res) {
  setCorsHeaders(req, res, 'POST, OPTIONS');

  if (handleMethodGuard(req, res, ['POST'])) return;

  const internalSecret = process.env.INTERNAL_API_SECRET;
  if (internalSecret) {
    const provided = req.headers['x-internal-secret'];
    if (provided !== internalSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const stats = await incrementPremiumDownload();
    return res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Track download error:', error.message);
    return res.status(500).json({
      error: 'Failed to track download',
    });
  }
}
