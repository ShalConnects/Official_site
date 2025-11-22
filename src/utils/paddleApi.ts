// Paddle API utility functions
// ⚠️ SECURITY WARNING: These functions should ONLY be called from your backend, NOT from the frontend
// This file is for reference and type definitions only
// API keys should NEVER be in frontend code

// NOTE: This file should not contain any API keys
// All API calls should be made from your backend serverless functions
// const PADDLE_API_URL = 'https://api.paddle.com'; // Unused - API calls go through backend

export interface PaddleTransaction {
  id: string;
  status: string;
  customer_id: string;
  customer_email: string;
  items: Array<{
    price_id: string;
    product_id: string;
    quantity: number;
  }>;
  created_at: string;
  updated_at: string;
}

/**
 * Verify a transaction with Paddle API
 * NOTE: This should be done on your backend, not in the frontend
 * 
 * @param transactionId - The transaction ID from Paddle
 * @returns Transaction data if valid, null otherwise
 */
/**
 * ⚠️ WARNING: This function should NOT be used in frontend code
 * API keys must never be exposed in client-side code
 * Use your backend API endpoint (/api/verify-transaction) instead
 */
export async function verifyTransaction(transactionId: string): Promise<PaddleTransaction | null> {
  // This is a reference implementation only
  // In production, call your backend API: /api/verify-transaction?transaction=xxx
  console.warn('⚠️ This function should not be called from frontend. Use backend API instead.');
  
  try {
    // Call your backend API instead of Paddle directly
    const response = await fetch(`/api/verify-transaction?transaction=${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Paddle API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check if transaction is completed
    if (data.status === 'completed') {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return null;
  }
}

/**
 * Generate a secure download token
 * This should be done on your backend
 */
export function generateDownloadToken(transactionId: string): string {
  // In production, use a proper JWT or signed token
  // This is just a placeholder
  return btoa(`${transactionId}:${Date.now()}`);
}

