# Deploy to Vercel - Quick Instructions

## ✅ Code is Already on GitHub
Your code has been pushed to: `https://github.com/ShalConnects/Official_site.git`

## 🚀 Deploy via Vercel Dashboard (Recommended)

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in with your account

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select **"ShalConnects/Official_site"**
4. Click **"Import"**

### Step 3: Configure Project
- **Project Name:** `shalconnects_official_site` (or keep default)
- **Framework Preset:** Vite (should auto-detect)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (should auto-fill)
- **Output Directory:** `dist` (should auto-fill)
- **Install Command:** `npm install` (should auto-fill)

### Step 4: Add Environment Variables
Before deploying, add these in **Environment Variables** section:

```
PADDLE_API_KEY=your_new_paddle_api_key_here
```

**Optional** (if using external CDN for plugin files):
```
PLUGIN_FILE_URL=https://your-cdn-url.com/plugin.zip
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://shalconnects-official-site.vercel.app`

### Step 6: Connect Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `shalconnects.com`
4. Follow DNS instructions from Vercel

## 🔄 If Project Already Exists

If `shalconnects_official_site` already exists in Vercel:

1. Go to your project dashboard
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
4. Or push a new commit to GitHub (auto-deploys if connected)

## ✅ Verify Deployment

After deployment, check these URLs:
- Main site: `https://shalconnects-official-site.vercel.app`
- Privacy Policy: `https://shalconnects-official-site.vercel.app/privacy`
- Terms: `https://shalconnects-official-site.vercel.app/terms`
- Refund Policy: `https://shalconnects-official-site.vercel.app/refund`

## 🔧 Alternative: Use Vercel CLI

If you prefer CLI (after linking):

```bash
# Link to existing project
vercel link

# Deploy to production
vercel --prod
```

---

**Your code is ready!** Just import the GitHub repo in Vercel dashboard and deploy.

