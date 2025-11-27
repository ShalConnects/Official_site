# Paddle Webhook Setup Guide

## Overview

Webhooks allow Paddle to automatically notify your server when transactions are completed. This enables automatic transaction ID capture without relying on URL parameters or browser events.

## Files Created

1. **`api/paddle-webhook.js`** - Receives webhook notifications from Paddle
2. **`api/check-transaction.js`** - Checks if a transaction was stored from webhook

## Setup Instructions

### Step 1: Get Your Webhook URL

Your webhook endpoint is:
```
https://store.shalconnects.com/api/paddle-webhook
```

### Step 2: Configure Webhook in Paddle Dashboard

1. Log into your Paddle vendor dashboard
2. Go to **Developer Tools** → **Notifications** (or **Webhooks**)
3. Click **Add Notification** or **Create Webhook**
4. Enter your webhook URL: `https://store.shalconnects.com/api/paddle-webhook`
5. Select the events you want to receive:
   - ✅ `transaction.completed` (required)
   - ✅ `transaction.created` (optional, for early notification)
6. Save the webhook

### Step 3: Test the Webhook

1. Make a test purchase
2. Check Vercel function logs to see if webhook was received
3. The transaction should be automatically stored

## How It Works

1. **Customer completes purchase** → Paddle processes payment
2. **Paddle sends webhook** → Your `/api/paddle-webhook` endpoint receives notification
3. **Transaction stored** → Transaction ID is stored server-side
4. **Customer redirected** → To download page (with or without transaction ID in URL)
5. **Auto-verification** → If transaction ID is found, it's verified automatically

## Current Status

- ✅ Webhook endpoint created
- ✅ Transaction storage implemented
- ⚠️ **Note**: Currently using in-memory storage (Map)
- 📝 **For production**: Replace with database (Vercel KV, MongoDB, PostgreSQL)

## Production Improvements Needed

### Replace In-Memory Storage

The current implementation uses a `Map()` which:
- ✅ Works for testing
- ❌ Doesn't persist across serverless function restarts
- ❌ Not suitable for production scale

**Recommended solutions:**
1. **Vercel KV** (Redis) - Fast, serverless-friendly
2. **Vercel Postgres** - Full database
3. **MongoDB Atlas** - Document database
4. **Supabase** - PostgreSQL with easy setup

### Example: Using Vercel KV

```javascript
import { kv } from '@vercel/kv';

// Store transaction
await kv.set(`transaction:${transaction.id}`, {
  id: transaction.id,
  status: transaction.status,
  customer_email: transaction.customer_email,
  created_at: transaction.created_at,
}, { ex: 86400 * 365 }); // Expire after 1 year

// Retrieve transaction
const stored = await kv.get(`transaction:${transactionId}`);
```

## Security Considerations

1. **Webhook Secret**: Add `PADDLE_WEBHOOK_SECRET` environment variable
2. **Verify Signatures**: Paddle signs webhooks - verify them before processing
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **HTTPS Only**: Webhooks should only be received over HTTPS

## Testing

1. Use Paddle's webhook testing tool (if available)
2. Make a test purchase and check logs
3. Verify transaction appears in storage

## Troubleshooting

- **Webhook not received**: Check Vercel function logs
- **Transaction not stored**: Check webhook endpoint logs
- **Storage not persisting**: Switch to database (see Production Improvements)

## Next Steps

1. Configure webhook in Paddle dashboard
2. Test with a purchase
3. Monitor Vercel logs
4. Consider upgrading to database storage for production

