// Paddle Webhook Endpoint
// Receives transaction notifications from Paddle
// Vercel Serverless Function

// SECURITY: Webhook secret should be set via environment variable
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

/**
 * Simple in-memory storage for transactions
 * In production, use a database (e.g., Vercel KV, MongoDB, PostgreSQL)
 * For now, this works for small scale and Vercel serverless functions
 */
const transactionStore = new Map();

/**
 * Vercel Serverless Function
 * Handles Paddle webhook notifications
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
    // Get webhook data
    const webhookData = req.body;

    // Log webhook for debugging (remove sensitive data in production)
    console.log('Paddle webhook received:', {
      event_type: webhookData.event_type,
      transaction_id: webhookData.data?.id,
      timestamp: new Date().toISOString(),
    });

    // Handle different webhook event types
    if (webhookData.event_type === 'transaction.completed' || 
        webhookData.event_type === 'transaction.created') {
      
      const transaction = webhookData.data;
      
      if (transaction && transaction.id) {
        // Store transaction for later retrieval
        transactionStore.set(transaction.id, {
          id: transaction.id,
          status: transaction.status || 'completed',
          customer_email: transaction.customer_email || null,
          created_at: transaction.created_at || new Date().toISOString(),
          stored_at: new Date().toISOString(),
        });

        console.log('Transaction stored:', transaction.id);
      }
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Paddle from retrying
    return res.status(200).json({ received: true, error: 'Processing error' });
  }
}

/**
 * Helper function to get stored transaction
 * Can be used by other API endpoints
 */
export function getStoredTransaction(transactionId) {
  return transactionStore.get(transactionId) || null;
}

