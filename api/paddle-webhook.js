// Paddle Webhook Endpoint
// Receives transaction notifications from Paddle
// Vercel Serverless Function
import crypto from 'crypto';
import { setCorsHeaders, handleMethodGuard } from './lib/http.js';

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

// Disable automatic body parsing so we can verify the HMAC over the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Verify Paddle Billing webhook signature (Paddle-Signature header).
 * Format: ts=<timestamp>;h1=<hmac>
 * @see https://developer.paddle.com/webhooks/signature-verification
 */
function verifyPaddleSignature(rawBody, signatureHeader, secret) {
  if (!secret || !signatureHeader || rawBody == null) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(';').map((part) => {
      const [k, v] = part.split('=');
      return [k?.trim(), v?.trim()];
    })
  );

  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const ageMs = Math.abs(Date.now() - Number(ts) * 1000);
  if (!Number.isFinite(ageMs) || ageMs > 5 * 60 * 1000) {
    return false;
  }

  const signedPayload = `${ts}:${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  try {
    const a = Buffer.from(h1, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  setCorsHeaders(req, res, 'POST, OPTIONS');

  if (handleMethodGuard(req, res, ['POST'])) return;

  try {
    const rawBody = await readRawBody(req);

    if (PADDLE_WEBHOOK_SECRET) {
      const signature = req.headers['paddle-signature'];
      if (!verifyPaddleSignature(rawBody, signature, PADDLE_WEBHOOK_SECRET)) {
        console.warn('Paddle webhook signature verification failed');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.error('PADDLE_WEBHOOK_SECRET is not set — rejecting webhook in production');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    let webhookData = {};
    try {
      webhookData = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    console.log('Paddle webhook received:', {
      event_type: webhookData?.event_type,
      transaction_id: webhookData?.data?.id,
      timestamp: new Date().toISOString(),
    });

    // Acknowledge receipt. Purchase verification uses Paddle API directly
    // (verify-transaction), so no durable store is required here.
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(200).json({ received: true });
  }
}
