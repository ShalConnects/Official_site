// Paddle API utility functions
// These should be called from your backend, not directly from the frontend
// This file is for reference and type definitions

const PADDLE_API_KEY = 'REMOVED_API_KEY';
const PADDLE_API_URL = 'https://api.paddle.com';

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
export async function verifyTransaction(transactionId: string): Promise<PaddleTransaction | null> {
  try {
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

