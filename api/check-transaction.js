// Check transaction endpoint — deprecated.
// Purchases are verified via Paddle API in verify-transaction.js.
// Kept for backwards compatibility; always returns not found.
import { setCorsHeaders, handleMethodGuard, isValidTransactionId } from './lib/http.js';

export default async function handler(req, res) {
  setCorsHeaders(req, res, 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (handleMethodGuard(req, res, ['GET'])) return;

  const transactionId =
    typeof req.query.transaction === 'string' ? req.query.transaction.trim() : '';

  if (!transactionId || !isValidTransactionId(transactionId)) {
    return res.status(400).json({
      found: false,
      message: 'A valid transaction ID is required',
    });
  }

  // In-memory webhook storage does not work across serverless isolates.
  // Clients should use /api/verify-transaction instead.
  return res.status(200).json({
    found: false,
    message: 'Use /api/verify-transaction for purchase verification',
  });
}
