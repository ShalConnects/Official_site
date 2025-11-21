# Deployment Checklist - ShalConnects.com

## ✅ Step 1: GitHub Repository - COMPLETED
- [x] Code pushed to: https://github.com/ShalConnects/Official_site
- [x] All files committed and pushed
- [x] Repository is ready for Vercel deployment

## 📋 Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**:
   - Visit: https://vercel.com
   - Sign up or log in (use GitHub to connect)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select `ShalConnects/Official_site`
   - Click "Import"

3. **Configure Project**:
   - Vercel will auto-detect:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy" (no changes needed)

4. **Wait for Deployment**:
   - First deployment takes 2-3 minutes
   - You'll get a URL like: `shalconnects-official-site.vercel.app`
   - Test this URL to ensure everything works

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## 🔧 Step 3: Configure Environment Variables (Optional but Recommended)

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these if you want to keep API keys secure:
- `PADDLE_API_KEY` = `your_new_paddle_api_key_here` (Get from Paddle dashboard → Settings → API Keys)
- `PLUGIN_FILE_URL` = (your plugin download URL if using CDN)

**Note**: After adding environment variables, redeploy the project.

## 🌐 Step 4: Connect Domain (shalconnects.com)

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter: `shalconnects.com`
   - Click "Add"
   - Vercel will show you DNS configuration

2. **Update DNS Records**:
   - Go to your domain registrar (where you manage shalconnects.com)
   - Find DNS Management settings
   - **Remove** old A record pointing to WordPress hosting
   - **Add** the new A record or CNAME as shown by Vercel
   - Typical configuration:
     - **A Record**: `@` → `[IP from Vercel]`
     - **CNAME**: `www` → `cname.vercel-dns.com`

3. **Wait for DNS Propagation**:
   - Usually 1-2 hours (can take up to 48 hours)
   - Check status: https://www.whatsmydns.net/#A/shalconnects.com
   - Vercel will automatically provision SSL once DNS is configured

## ✅ Step 5: Verify Deployment

- [ ] Test Vercel preview URL (e.g., `shalconnects-official-site.vercel.app`)
- [ ] Test custom domain once DNS propagates (`https://shalconnects.com`)
- [ ] Test all pages/routes
- [ ] Test API endpoints: `/api/verify-transaction` and `/api/download`
- [ ] Check SSL certificate (should be automatic)

## 📝 Quick Reference

- **GitHub Repo**: https://github.com/ShalConnects/Official_site
- **Vercel Dashboard**: https://vercel.com/dashboard
- **DNS Setup Guide**: See `DNS_SETUP_QUICK_REFERENCE.md`
- **Full Deployment Guide**: See `VERCEL_DEPLOYMENT_GUIDE.md`

## 🚨 Important Notes

1. **WordPress Site**: Once DNS changes propagate, your WordPress site will no longer be accessible at shalconnects.com. Make sure you've backed up any content you need.

2. **Automatic Deployments**: After connecting GitHub, every push to `main` branch will automatically trigger a new deployment on Vercel.

3. **Free Tier**: Vercel's free tier includes:
   - Unlimited deployments
   - 100GB bandwidth/month
   - Custom domains
   - SSL certificates
   - Serverless functions

## 🆘 Troubleshooting

If you encounter issues:
1. Check Vercel deployment logs
2. Verify DNS records match exactly what Vercel shows
3. Wait for DNS propagation (can take time)
4. Check `VERCEL_DEPLOYMENT_GUIDE.md` for detailed troubleshooting

---

**Next Action**: Go to https://vercel.com and import your GitHub repository!

