/**
 * Unit tests for download token HMAC helpers (Node crypto).
 * Run via: npx vitest run api/lib/__tests__/download-token.test.js
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createDownloadToken, verifyDownloadToken } from '../download-token.js';

describe('download-token', () => {
  const prevKey = process.env.PADDLE_API_KEY;
  const prevSecret = process.env.DOWNLOAD_TOKEN_SECRET;

  beforeEach(() => {
    process.env.DOWNLOAD_TOKEN_SECRET = 'test-secret-for-unit-tests';
    delete process.env.PADDLE_API_KEY;
  });

  afterEach(() => {
    if (prevKey === undefined) delete process.env.PADDLE_API_KEY;
    else process.env.PADDLE_API_KEY = prevKey;
    if (prevSecret === undefined) delete process.env.DOWNLOAD_TOKEN_SECRET;
    else process.env.DOWNLOAD_TOKEN_SECRET = prevSecret;
  });

  it('creates and verifies a valid token', () => {
    const txn = 'txn_01abc123';
    const token = createDownloadToken(txn);
    expect(verifyDownloadToken(token, txn).valid).toBe(true);
  });

  it('rejects mismatched transaction id', () => {
    const token = createDownloadToken('txn_01abc123');
    expect(verifyDownloadToken(token, 'txn_01other').valid).toBe(false);
  });

  it('rejects tampered tokens', () => {
    const token = createDownloadToken('txn_01abc123');
    const tampered = token.slice(0, -4) + 'xxxx';
    expect(verifyDownloadToken(tampered, 'txn_01abc123').valid).toBe(false);
  });

  it('rejects missing token', () => {
    expect(verifyDownloadToken('', 'txn_01abc123').valid).toBe(false);
  });
});
