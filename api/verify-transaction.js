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
  
  // Prevent caching - always get fresh data from Paddle
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

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
      // Get error details from Paddle
      const errorData = await response.json().catch(() => ({}));
      console.error('Paddle API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      
      // Return more specific error messages
      if (response.status === 404) {
        return res.status(200).json({
          valid: false,
          message: 'Transaction not found. Please check your transaction ID and try again.',
          transaction: null,
        });
      }
      
      throw new Error(`Paddle API error: ${response.status} ${response.statusText}`);
    }

    const transaction = await response.json();
    
    // Log the full response for debugging
    console.log('Paddle transaction response:', {
      id: transaction.id,
      status: transaction.status,
      hasStatus: 'status' in transaction,
      keys: Object.keys(transaction),
    });
    
    // Check if transaction object is valid
    if (!transaction || typeof transaction !== 'object') {
      console.error('Invalid transaction response:', transaction);
      return res.status(500).json({
        valid: false,
        message: 'Invalid response from Paddle API. Please contact support.',
      });
    }

    // Check if status exists
    const transactionStatus = transaction.status || transaction.status_code || 'unknown';
    
    // Allow downloads for both 'completed' and 'pending' transactions
    // Pending transactions are usually just waiting for bank processing
    const allowedStatuses = ['completed', 'pending'];
    
    if (allowedStatuses.includes(transactionStatus)) {
      // Generate download token (in production, use JWT or signed token)
      const downloadToken = Buffer.from(`${transactionId}:${Date.now()}`).toString('base64');

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
      });
    } else {
      // Return transaction info even if status is not allowed
      return res.status(200).json({
        valid: false,
        message: `Transaction status: ${transactionStatus}. Payment may still be processing.`,
        transaction: {
          id: transaction.id || transactionId,
          status: transactionStatus,
        },
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

