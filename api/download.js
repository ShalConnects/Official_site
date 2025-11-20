// Backend API endpoint for secure file downloads
// Vercel Serverless Function

const PADDLE_API_KEY = process.env.PADDLE_API_KEY || 'REMOVED_API_KEY';
const PADDLE_API_URL = 'https://api.paddle.com';

// Path to your plugin ZIP file (update this or use environment variable)
const PLUGIN_FILE_PATH = process.env.PLUGIN_FILE_URL || '/path/to/variation-images-pro.zip';

/**
 * Vercel Serverless Function
 * Handles secure file downloads after transaction verification
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

  const { transaction, token } = req.query;

  if (!transaction || !token) {
    return res.status(400).json({ error: 'Missing transaction or token' });
  }

  try {
    // Verify transaction again for security
    const verifyResponse = await fetch(`${PADDLE_API_URL}/transactions/${transaction}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verifyResponse.ok) {
      throw new Error('Transaction verification failed');
    }

    const transactionData = await verifyResponse.json();

    if (transactionData.status !== 'completed') {
      return res.status(403).json({ error: 'Transaction not completed' });
    }

    // In production, verify the token properly
    // For now, we'll just check if transaction is valid

    // Track download (optional - store in database)
    // await trackDownload(transaction);

    // Serve the file
    // Option 1: If file is on CDN/S3, redirect
    const downloadUrl = transactionData.download_url || PLUGIN_FILE_PATH;

    return res.redirect(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Failed to process download' });
  }
}

/**
 * Alternative: Use Paddle's built-in file delivery
 * Paddle automatically emails download links after purchase
 * You can also configure download URLs in Paddle dashboard
 */

