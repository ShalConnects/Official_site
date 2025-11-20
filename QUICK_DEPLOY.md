# Quick Deploy to Vercel

Your code is already on GitHub. Here's the fastest way to deploy:

## Option 1: Vercel Dashboard (Easiest - 2 minutes)

1. **Go to:** [vercel.com/dashboard](https://vercel.com/dashboard)

2. **If project exists:**
   - Find "shalconnects_official_site" project
   - Click on it
   - Go to "Deployments" tab
   - Click "Redeploy" on latest deployment
   - OR it should auto-deploy from GitHub

3. **If project doesn't exist:**
   - Click "Add New..." → "Project"
   - Import: `ShalConnects/Official_site`
   - Project name: `shalconnects-official-site` (use hyphens, not underscores)
   - Add environment variable: `PADDLE_API_KEY`
   - Click "Deploy"

## Option 2: Vercel CLI

If you want to use CLI, first link to existing project:

```bash
vercel link
# Select: "Link to existing project"
# Project name: shalconnects-official-site
# Then deploy:
vercel --prod
```

## What Gets Deployed

✅ All latest code from GitHub
✅ Updated price ($24.99)
✅ Legal pages (Privacy, Terms, Refund)
✅ Paddle integration
✅ All features and fixes

## After Deployment

Your site will be live at:
- `https://shalconnects-official-site.vercel.app`
- Or your custom domain: `https://shalconnects.com`

---

**Recommended:** Use Option 1 (Dashboard) - it's faster and easier!

