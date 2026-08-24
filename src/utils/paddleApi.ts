/** Paddle types and thin client helpers. API keys must never live in the frontend. */

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

export interface VerifyTransactionResponse {
  valid: boolean;
  message?: string;
  downloadToken?: string;
  productSlug?: string | null;
  transaction?: {
    id: string;
    status: string;
    customer_email?: string | null;
    items?: PaddleTransaction['items'];
    created_at?: string;
  } | null;
}

/**
 * Verify a transaction via the backend API (never call Paddle directly from the browser).
 */
export async function verifyTransactionViaApi(
  transactionId: string
): Promise<VerifyTransactionResponse> {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const response = await fetch(
    `${apiUrl}/verify-transaction?transaction=${encodeURIComponent(transactionId)}&_t=${Date.now()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    }
  );

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || `Verification failed: ${response.statusText}`);
  }

  return (await response.json()) as VerifyTransactionResponse;
}
