// Backend API endpoint for verifying Paddle transactions
// Vercel Serverless Function

// SECURITY: API key must be set via environment variable
// Never hardcode API keys in source code
const PADDLE_API_KEY = process.env.PADDLE_API_KEY;

if (!PADDLE_API_KEY) {
  console.error('PADDLE_API_KEY environment variable is not set');
}
const PADDLE_API_URL = 'https://api.paddle.com';

/**
 * Vercel Serverless Function
 * Verifies Paddle transactions and returns transaction status
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

  const transactionId = req.query.transaction;

  if (!transactionId) {
    return res.status(400).json({ 
      valid: false, 
      message: 'Transaction ID is required' 
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
    // Verify transaction with Paddle API
    const response = await fetch(`${PADDLE_API_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Paddle API error: ${response.statusText}`);
    }

    const transaction = await response.json();

    // Check if transaction is completed
    if (transaction.status === 'completed') {
      // Generate download token (in production, use JWT or signed token)
      const downloadToken = Buffer.from(`${transactionId}:${Date.now()}`).toString('base64');

      return res.status(200).json({
        valid: true,
        transaction: {
          id: transaction.id,
          status: transaction.status,
          customer_email: transaction.customer_email,
          items: transaction.items,
          created_at: transaction.created_at,
        },
        downloadToken,
      });
    } else {
      return res.status(200).json({
        valid: false,
        message: `Transaction status: ${transaction.status}`,
      });
    }
  } catch (error) {
    console.error('Transaction verification error:', error);
    return res.status(500).json({
      valid: false,
      message: 'Failed to verify transaction. Please contact support.',
    });
  }
}

/**
 * Express.js Route Example
 * 
 * app.get('/api/verify-transaction', async (req, res) => {
 *   const transactionId = req.query.transaction;
 *   // ... same logic as above
 * });
 */

/**
 * Netlify Function Example
 * Place in: /netlify/functions/verify-transaction.js
 * 
 * exports.handler = async (event, context) => {
 *   const transactionId = event.queryStringParameters.transaction;
 *   // ... same logic as above, return { statusCode, body: JSON.stringify(...) }
 * };
 */

