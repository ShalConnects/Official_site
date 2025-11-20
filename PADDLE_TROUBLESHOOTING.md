# Paddle Checkout Troubleshooting Guide

## Error: 403 Forbidden / 400 Bad Request

If you're seeing these errors when clicking "Buy Pro Version", follow these steps:

### Step 1: Check Domain Whitelist in Paddle

**This is the most common cause of 403 errors.**

1. Log in to your [Paddle Dashboard](https://vendors.paddle.com)
2. Go to **Settings** → **Developer Tools** → **Checkout Settings**
3. Look for **"Allowed Domains"** or **"Domain Whitelist"**
4. Add your domain(s):
   - `localhost` (for local development)
   - `your-vercel-url.vercel.app` (your Vercel deployment URL)
   - `shalconnects.com` (your custom domain)
   - `www.shalconnects.com` (if using www)

**Important:** Paddle requires domains to be explicitly whitelisted. Without this, you'll get 403 errors.

### Step 2: Verify Your Paddle IDs

Check that your IDs are correct in `src/pages/PluginPage.tsx`:

```typescript
paddleVendorId: 252028,  // Your Paddle Seller/Vendor ID
paddleProductId: 'pro_01kafwx8k4bw47cfh5w95smm7m',  // Your Product ID
paddlePriceId: 'pri_01kafx042cwqdh525d9ts9fj6v',  // Your Price ID
```

**How to find these:**
- **Vendor ID**: Settings → Account → Your Vendor ID
- **Product ID**: Products → Your Product → Product ID (starts with `pro_`)
- **Price ID**: Products → Your Product → Prices → Price ID (starts with `pri_`)

### Step 3: Check Product Status

1. Go to Paddle Dashboard → Products
2. Find your product
3. Ensure it's **Active** (not Draft or Archived)
4. Check that the price is **Active**

### Step 4: Verify Paddle Script Loading

Open browser console (F12) and check:
- No errors loading `paddle.js`
- `window.Paddle` is defined
- Paddle initializes without errors

### Step 5: Test in Different Environments

**Local Development:**
- Make sure `localhost` is whitelisted in Paddle
- Use Paddle Sandbox for testing (if available)

**Production:**
- Ensure your production domain is whitelisted
- Check that you're using production seller ID (not sandbox)

### Step 6: Check Browser Console

Look for specific error messages:
- `403` = Domain not whitelisted or authentication issue
- `400` = Bad request (check product/price IDs)
- `ERR_BLOCKED_BY_CLIENT` = Ad blocker (disable for testing)

### Step 7: Verify Checkout Configuration

The checkout should use:
- **Price ID** (preferred): `items: [{ priceId: 'pri_...', quantity: 1 }]`
- **Product ID** (fallback): `product: 'pro_...'`

Both should work, but Price ID is more reliable.

## Common Issues & Solutions

### Issue: "Something went wrong" Error

**Cause:** Usually domain whitelist or incorrect IDs

**Solution:**
1. Add domain to Paddle whitelist
2. Verify product/price IDs are correct
3. Check product is active

### Issue: Checkout Opens But Shows Error

**Cause:** Product configuration issue

**Solution:**
1. Check product settings in Paddle dashboard
2. Verify price is configured correctly
3. Ensure product has at least one active price

### Issue: ERR_BLOCKED_BY_CLIENT

**Cause:** Browser extension (ad blocker) blocking Paddle

**Solution:**
1. Disable ad blockers temporarily
2. Whitelist your site in ad blocker
3. Test in incognito mode

### Issue: Checkout Doesn't Open at All

**Cause:** Paddle not initialized or script not loaded

**Solution:**
1. Check browser console for errors
2. Verify `window.Paddle` exists
3. Check network tab - is `paddle.js` loading?
4. Ensure seller ID is correct

## Testing Checklist

- [ ] Domain whitelisted in Paddle dashboard
- [ ] Vendor/Seller ID is correct
- [ ] Product ID is correct
- [ ] Price ID is correct (if using)
- [ ] Product is active in Paddle
- [ ] Price is active in Paddle
- [ ] Paddle script loads without errors
- [ ] `window.Paddle` is available
- [ ] No ad blockers interfering
- [ ] Testing on whitelisted domain

## Still Not Working?

1. **Check Paddle Status Page**: [status.paddle.com](https://status.paddle.com)
2. **Contact Paddle Support**: [paddle.com/support](https://paddle.com/support)
3. **Review Paddle Docs**: [developer.paddle.com](https://developer.paddle.com)

## Quick Fix: Domain Whitelist

**Most 403 errors are fixed by adding your domain to Paddle's whitelist:**

1. Paddle Dashboard → Settings → Developer Tools
2. Find "Allowed Domains" or "Checkout Domains"
3. Add:
   ```
   localhost
   *.vercel.app
   shalconnects.com
   www.shalconnects.com
   ```
4. Save changes
5. Try checkout again

---

**Note:** Domain whitelisting is required for security. Paddle blocks requests from unlisted domains to prevent unauthorized use of your checkout.

