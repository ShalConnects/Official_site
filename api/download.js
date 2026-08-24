// Backend API endpoint for secure file downloads
// Vercel Serverless Function
import { getDownloadUrl } from './lib/product-config.js';
import { verifyDownloadToken } from './lib/download-token.js';
import { incrementPremiumDownload } from './lib/premium-stats.js';
import {
  setCorsHeaders,
  handleMethodGuard,
  isValidTransactionId,
} from './lib/http.js';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
if (!PADDLE_API_KEY) console.error('PADDLE_API_KEY environment variable is not set');
const PADDLE_API_URL = 'https://api.paddle.com';

const ALLOWED_STATUSES = ['completed', 'paid', 'pending'];

export default async function handler(req, res) {
  setCorsHeaders(req, res, 'GET, OPTIONS');

  if (handleMethodGuard(req, res, ['GET'])) return;

  const transaction = typeof req.query.transaction === 'string'
    ? req.query.transaction.trim()
    : '';
  const token = typeof req.query.token === 'string' ? req.query.token.trim() : '';

  if (!transaction || !token) {
    return res.status(400).json({ error: 'Missing transaction or token' });
  }

  if (!isValidTransactionId(transaction)) {
    return res.status(400).json({ error: 'Invalid transaction ID' });
  }

  const tokenCheck = verifyDownloadToken(token, transaction);
  if (!tokenCheck.valid) {
    return res.status(403).json({ error: tokenCheck.reason || 'Invalid or expired download token' });
  }

  if (!PADDLE_API_KEY) {
    console.error('PADDLE_API_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error. Please contact support.' });
  }

  try {
    const verifyResponse = await fetch(
      `${PADDLE_API_URL}/transactions/${encodeURIComponent(transaction)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!verifyResponse.ok) {
      return res.status(403).json({ error: 'Transaction verification failed' });
    }

    const raw = await verifyResponse.json();
    const transactionData = raw?.data ?? raw;
    const transactionStatus =
      transactionData?.status ||
      transactionData?.status_code ||
      transactionData?.payment_status ||
      transactionData?.state ||
      'unknown';

    if (!ALLOWED_STATUSES.includes(transactionStatus)) {
      return res.status(403).json({
        error: `Transaction status is ${transactionStatus}. Payment may still be processing.`,
      });
    }

    // Track download without blocking the redirect
    incrementPremiumDownload().catch((err) => {
      console.error('Failed to track download (non-blocking):', err.message);
    });

    const downloadUrl = transactionData?.download_url || getDownloadUrl(transactionData, req);
    return res.redirect(302, downloadUrl);
  } catch (error) {
    console.error('Download error:', error.message);
    return res.status(500).json({ error: 'Failed to process download' });
  }
}
