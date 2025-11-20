# Quick DNS Setup Reference for shalconnects.com

## What You Need to Do

When you add your domain in Vercel, it will show you the exact DNS records to add. Here's what to expect:

## Typical Vercel DNS Configuration

### For Root Domain (shalconnects.com)

**Option 1: A Record (Most Common)**
```
Type: A
Name: @ (or leave blank)
Value: [IP address from Vercel]
TTL: 3600 (or Auto)
```

**Option 2: ALIAS/ANAME (If your DNS provider supports it)**
```
Type: ALIAS or ANAME
Name: @ (or root)
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### For WWW Subdomain (www.shalconnects.com)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

## Step-by-Step Process

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter `shalconnects.com`
   - Vercel will show you the exact records to add

2. **In Your DNS Provider** (GoDaddy, Namecheap, Cloudflare, etc.):
   - Log into your domain registrar/hosting control panel
   - Find DNS Management or DNS Settings
   - **Remove or update** the old A record pointing to WordPress hosting
   - **Add** the new A record or CNAME as shown by Vercel

3. **Wait for Propagation**:
   - Usually 1-2 hours, can take up to 48 hours
   - Check status at: https://www.whatsmydns.net/#A/shalconnects.com

## Important Notes

⚠️ **Before making DNS changes:**
- Backup your WordPress site if you need the content
- Note down your current DNS records (in case you need to revert)
- The WordPress site will stop working once DNS changes propagate

✅ **After DNS changes:**
- Your site will be live on Vercel
- SSL certificate will be automatically provisioned
- Both `shalconnects.com` and `www.shalconnects.com` will work (if configured)

## Common DNS Providers - Where to Find Settings

- **GoDaddy**: My Products → Domains → Manage DNS
- **Namecheap**: Domain List → Manage → Advanced DNS
- **Cloudflare**: Select domain → DNS → Records
- **Google Domains**: DNS → Custom records
- **Bluehost/cPanel**: Advanced → Zone Editor

## Verification

After adding DNS records, verify in Vercel:
- Go to Settings → Domains
- Status should show "Valid Configuration" (may take a few minutes)
- Once valid, SSL will be automatically provisioned

## Need Help?

If Vercel shows "Invalid Configuration":
1. Double-check the DNS record values match exactly
2. Wait a few minutes for DNS to propagate
3. Check for typos in the record values
4. Ensure you removed conflicting old records

