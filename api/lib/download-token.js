import crypto from 'crypto';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function getSigningSecret() {
  return process.env.DOWNLOAD_TOKEN_SECRET || process.env.PADDLE_API_KEY || '';
}

/**
 * Create a signed, time-limited download token for a transaction.
 */
export function createDownloadToken(transactionId) {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error('No signing secret configured');
  }
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${transactionId}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

/**
 * Verify a download token. Returns { valid, reason }.
 */
export function verifyDownloadToken(token, transactionId) {
  const secret = getSigningSecret();
  if (!secret) {
    return { valid: false, reason: 'Server configuration error' };
  }
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Missing token' };
  }

  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Invalid token format' };
    }
    const [tokenTxnId, expiresAtStr, signature] = parts;
    if (tokenTxnId !== transactionId) {
      return { valid: false, reason: 'Token mismatch' };
    }
    const expiresAt = Number(expiresAtStr);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return { valid: false, reason: 'Token expired' };
    }
    const payload = `${tokenTxnId}:${expiresAtStr}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false, reason: 'Invalid token signature' };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Invalid token' };
  }
}
