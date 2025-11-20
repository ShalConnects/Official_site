# Vercel Deployment Guide for ShalConnects.com

This guide will walk you through deploying your ShalConnects site to Vercel and connecting it to your existing domain `shalconnects.com`.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) - free tier is sufficient)
2. Access to your domain's DNS settings (wherever you manage shalconnects.com)
3. Git repository (GitHub, GitLab, or Bitbucket) - recommended for easiest deployment

## Step 1: Prepare Your Project

The project is already configured with:
- ✅ `vercel.json` - Vercel configuration file
- ✅ API routes in `/api` folder (already set up for Vercel serverless functions)
- ✅ Vite build configuration

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-git-repo-url>
   git push -u origin main
   ```

2. **Import Project in Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Configure Environment Variables** (if needed):
   - In your project settings on Vercel
   - Go to Settings → Environment Variables
   - Add:
     - `PADDLE_API_KEY` (your Paddle API key)
     - `PLUGIN_FILE_URL` (if you have a CDN URL for plugin downloads)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production: `vercel --prod`

## Step 3: Connect Your Domain (shalconnects.com)

### In Vercel Dashboard:

1. **Add Domain**:
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Domains
   - Click "Add Domain"
   - Enter `shalconnects.com`
   - Also add `www.shalconnects.com` (optional but recommended)

2. **Get DNS Configuration**:
   - Vercel will show you the DNS records you need to add
   - You'll typically need:
     - **A Record** pointing to Vercel's IP (or)
     - **CNAME Record** pointing to `cname.vercel-dns.com` (recommended)

### In Your Domain's DNS Settings:

**Important**: You need to update your DNS records to point to Vercel instead of your WordPress hosting.

#### Option 1: CNAME Method (Recommended for subdomains)
- If you want to use `www.shalconnects.com`:
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com`

#### Option 2: A Record Method (For root domain)
- For `shalconnects.com` (root domain):
  - Type: `A`
  - Name: `@` or leave blank
  - Value: Vercel's IP address (shown in Vercel dashboard)
  - Note: Vercel provides specific IPs for your project

#### Option 3: ALIAS/ANAME Record (Best for root domain)
- Some DNS providers support ALIAS/ANAME records:
  - Type: `ALIAS` or `ANAME`
  - Name: `@` or root
  - Value: `cname.vercel-dns.com`

**Common DNS Providers:**
- **Cloudflare**: Use CNAME (with proxy) or A record
- **GoDaddy**: Use A record or CNAME
- **Namecheap**: Use A record or CNAME
- **Google Domains**: Use A record or CNAME

### DNS Propagation

- DNS changes can take 24-48 hours to propagate globally
- Usually works within 1-2 hours
- You can check propagation at [whatsmydns.net](https://www.whatsmydns.net)

## Step 4: SSL Certificate

- Vercel automatically provides SSL certificates via Let's Encrypt
- Once DNS is configured, SSL will be automatically provisioned
- Your site will be available at `https://shalconnects.com`

## Step 5: Verify Deployment

1. **Check Vercel Deployment**:
   - Your site will have a URL like: `shalconnects-xyz.vercel.app`
   - Test this URL first to ensure everything works

2. **Test Custom Domain**:
   - Once DNS propagates, visit `https://shalconnects.com`
   - Check that all routes work correctly
   - Test API endpoints: `/api/verify-transaction` and `/api/download`

## Step 6: WordPress Site Migration (Optional)

If you want to keep your WordPress content:

1. **Export WordPress Content**:
   - Export posts/pages from WordPress admin
   - Download media files

2. **Redirect Old WordPress URLs** (if needed):
   - Add redirects in `vercel.json` if you have important WordPress URLs
   - Or set up redirects in your old hosting

## Troubleshooting

### Domain Not Working?

1. **Check DNS Propagation**:
   ```bash
   # Check A record
   dig shalconnects.com A
   
   # Check CNAME
   dig www.shalconnects.com CNAME
   ```

2. **Verify in Vercel**:
   - Go to Settings → Domains
   - Check if domain shows as "Valid Configuration"
   - Look for any error messages

3. **Clear DNS Cache**:
   - Flush DNS on your computer: `ipconfig /flushdns` (Windows)
   - Try accessing from different network/device

### Build Errors?

1. **Check Build Logs**:
   - Go to Deployments → Click on failed deployment
   - Review build logs for errors

2. **Common Issues**:
   - Missing environment variables
   - TypeScript errors (run `npm run build` locally first)
   - Missing dependencies

### API Routes Not Working?

1. **Check Function Logs**:
   - Go to Deployments → Functions tab
   - Check serverless function logs

2. **Verify Environment Variables**:
   - Ensure `PADDLE_API_KEY` is set in Vercel dashboard

## Additional Configuration

### Redirect www to non-www (or vice versa):

Add to `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.shalconnects.com"
        }
      ],
      "destination": "https://shalconnects.com/:path*",
      "permanent": true
    }
  ]
}
```

### Custom Headers:

Already configured in `vercel.json` for CORS support.

## Cost

- **Vercel Free Tier** includes:
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domains
  - SSL certificates
  - Serverless functions (100GB-hours/month)

- **Upgrade** if you need:
  - More bandwidth
  - More serverless function execution time
  - Team collaboration features

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure domain DNS
3. ✅ Wait for DNS propagation
4. ✅ Test your site
5. ✅ Update any hardcoded URLs in your code
6. ✅ Set up monitoring/analytics (optional)

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)

---

**Note**: After switching DNS to Vercel, your WordPress site will no longer be accessible at shalconnects.com. Make sure you've backed up any important content before making the switch.

