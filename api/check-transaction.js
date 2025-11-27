// API endpoint to check if transaction is stored (from webhook)
// Vercel Serverless Function

// Import the storage function (in production, use shared database)
// For now, we'll use a simple approach - in production use a real database
let transactionStore = null;

// Lazy load the store (shared across function instances in Vercel)
function getTransactionStore() {
  if (!transactionStore) {
    // In production, replace this with actual database access
    // For Vercel: use Vercel KV, Postgres, or MongoDB
    transactionStore = new Map();
  }
  return transactionStore;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
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
      found: false, 
      message: 'Transaction ID is required' 
    });
  }

  try {
    // Check if transaction is stored (from webhook)
    const store = getTransactionStore();
    const storedTransaction = store.get(transactionId);

    if (storedTransaction) {
      return res.status(200).json({
        found: true,
        transaction: storedTransaction,
      });
    } else {
      return res.status(200).json({
        found: false,
        message: 'Transaction not found in stored records',
      });
    }
  } catch (error) {
    console.error('Check transaction error:', error);
    return res.status(500).json({
      found: false,
      message: 'Error checking transaction',
    });
  }
}

