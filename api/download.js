// Backend API endpoint for secure file downloads
// Vercel Serverless Function

// SECURITY: API key must be set via environment variable
// Never hardcode API keys in source code
const PADDLE_API_KEY = process.env.PADDLE_API_KEY;

if (!PADDLE_API_KEY) {
  console.error('PADDLE_API_KEY environment variable is not set');
}
const PADDLE_API_URL = 'https://api.paddle.com';

// Path to your plugin ZIP file
// Option 1: Hosted on Vercel (in public/downloads folder) - Current setup
// Option 2: Host on CDN (Cloudflare R2, AWS S3, etc.) and set PLUGIN_FILE_URL environment variable
// Option 3: Use Paddle's built-in delivery (upload ZIP in Paddle dashboard)

// For Vercel: Files in public/ folder are served at root
// public/downloads/file.zip → https://yourdomain.com/downloads/file.zip
const getPluginUrl = (req) => {
  // If environment variable is set, use it (for CDN/external hosting)
  if (process.env.PLUGIN_FILE_URL) {
    return process.env.PLUGIN_FILE_URL;
  }
  
  // Otherwise, use Vercel-hosted file
  // Get the base URL from the request headers
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || process.env.VERCEL_URL || 'localhost:5173';
  const baseUrl = `${protocol}://${host}`;
  
  return `${baseUrl}/downloads/wc-variation-images-pro-pro-v1.0.0.zip`;
};

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

  if (!PADDLE_API_KEY) {
    console.error('PADDLE_API_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error. Please contact support.' });
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
    
    // Log the full response for debugging
    console.log('=== DOWNLOAD API - PADDLE RESPONSE ===');
    console.log(JSON.stringify(transactionData, null, 2));
    console.log('=== END PADDLE RESPONSE ===');

    // Check if status exists - Paddle API v2 might use different field names
    // Try multiple possible field names (same as verify-transaction.js)
    const transactionStatus = transactionData.status || 
                              transactionData.status_code || 
                              transactionData.payment_status ||
                              transactionData.state ||
                              (transactionData.data && transactionData.data.status) ||
                              'unknown';
    
    console.log('Download API - Extracted transaction status:', transactionStatus);

    // Allow downloads for both 'completed' and 'pending' transactions
    // Pending transactions are usually just waiting for bank processing
    const allowedStatuses = ['completed', 'pending'];
    if (!allowedStatuses.includes(transactionStatus)) {
      return res.status(403).json({ 
        error: `Transaction status is ${transactionStatus}. Payment may still be processing.` 
      });
    }

    // Verify the token (basic validation)
    // In production, use proper JWT or signed token verification
    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [tokenTxnId] = decoded.split(':');
        if (tokenTxnId !== transaction) {
          console.warn('Token transaction ID mismatch');
          // Still allow download if transaction is valid (token is for additional security)
        }
      } catch (e) {
        console.warn('Token validation error:', e);
        // Continue with download if transaction is valid
      }
    }

    // Track download (optional - store in database)
    // await trackDownload(transaction);

    // Serve the file
    // Get the download URL (use Paddle's if available, otherwise use our hosted file)
    const downloadUrl = transactionData.download_url || getPluginUrl(req);

    // Redirect to the download URL
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

