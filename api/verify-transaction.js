// Backend API endpoint for verifying Paddle transactions
// Vercel Serverless Function
import { getProductFromTransaction } from './lib/product-config.js';
import { createDownloadToken } from './lib/download-token.js';
import {
  setCorsHeaders,
  setNoCacheHeaders,
  handleMethodGuard,
  isValidTransactionId,
} from './lib/http.js';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
if (!PADDLE_API_KEY) console.error('PADDLE_API_KEY environment variable is not set');
const PADDLE_API_URL = 'https://api.paddle.com';

const ALLOWED_STATUSES = ['completed', 'paid', 'pending'];

export default async function handler(req, res) {
  setCorsHeaders(req, res, 'GET, OPTIONS');
  setNoCacheHeaders(res);

  if (handleMethodGuard(req, res, ['GET'])) return;

  const transactionId = typeof req.query.transaction === 'string'
    ? req.query.transaction.trim()
    : '';

  if (!transactionId || !isValidTransactionId(transactionId)) {
    return res.status(400).json({
      valid: false,
      message: 'A valid transaction ID is required',
    });
  }

  if (!PADDLE_API_KEY) {
    console.error('PADDLE_API_KEY is not configured');
    return res.status(500).json({
      valid: false,
      message: 'Server configuration error. Please contact support.',
    });
  }

  try {
    const response = await fetch(`${PADDLE_API_URL}/transactions/${encodeURIComponent(transactionId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Paddle API error:', {
        status: response.status,
        errorCode: errorData?.error?.code,
      });

      if (response.status === 404) {
        return res.status(200).json({
          valid: false,
          message: 'Transaction not found. Please check your transaction ID and try again.',
          transaction: null,
        });
      }

      throw new Error(`Paddle API error: ${response.status}`);
    }

    const raw = await response.json();
    const transaction = raw?.data ?? raw;

    if (!transaction || typeof transaction !== 'object') {
      console.error('Invalid transaction response shape');
      return res.status(500).json({
        valid: false,
        message: 'Invalid response from payment provider. Please contact support.',
      });
    }

    const transactionStatus =
      transaction.status ||
      transaction.status_code ||
      transaction.payment_status ||
      transaction.state ||
      'unknown';

    if (ALLOWED_STATUSES.includes(transactionStatus)) {
      let downloadToken;
      try {
        downloadToken = createDownloadToken(transactionId);
      } catch (err) {
        console.error('Failed to create download token:', err.message);
        return res.status(500).json({
          valid: false,
          message: 'Server configuration error. Please contact support.',
        });
      }

      const product = getProductFromTransaction(transaction);

      return res.status(200).json({
        valid: true,
        transaction: {
          id: transaction.id || transactionId,
          status: transactionStatus,
          customer_email: transaction.customer_email || transaction.email || null,
          items: transaction.items || [],
          created_at: transaction.created_at || transaction.created || new Date().toISOString(),
        },
        downloadToken,
        productSlug: product ? product.slug : null,
      });
    }

    return res.status(200).json({
      valid: false,
      message: `Transaction status: ${transactionStatus}. Payment may still be processing.`,
      transaction: {
        id: transaction.id || transactionId,
        status: transactionStatus,
      },
    });
  } catch (error) {
    console.error('Transaction verification error:', error.message);
    return res.status(500).json({
      valid: false,
      message: 'Failed to verify transaction. Please contact support.',
    });
  }
}
