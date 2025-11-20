# Quick Setup: Host Your Plugin ZIP File

Since Paddle doesn't have a file upload option for your product, you need to host the ZIP file yourself.

## ⚡ Fastest Option: Cloudflare R2 (5 minutes)

### Step 1: Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up (free)
3. Verify email

### Step 2: Create R2 Bucket
1. In dashboard, click "R2" in sidebar
2. Click "Create bucket"
3. Name it: `plugin-downloads`
4. Click "Create bucket"

### Step 3: Upload Your ZIP
1. Click on your bucket
2. Click "Upload" button
3. Select `variation-images-pro.zip`
4. Wait for upload to complete

### Step 4: Make File Public
1. Click on the uploaded file
2. Click "Edit" or "Settings"
3. Enable "Public Access" or "Public URL"
4. Copy the public URL (looks like: `https://pub-xxxxx.r2.dev/variation-images-pro.zip`)

### Step 5: Configure Your App

**If using Vercel:**
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add: `PLUGIN_FILE_URL` = `https://pub-xxxxx.r2.dev/variation-images-pro.zip`
3. Redeploy

**If using local development:**
Create `.env.local` file:
```
PLUGIN_FILE_URL=https://pub-xxxxx.r2.dev/variation-images-pro.zip
```

**Or update `api/download.js` directly:**
```javascript
const PLUGIN_FILE_PATH = 'https://pub-xxxxx.r2.dev/variation-images-pro.zip';
```

### Done! ✅
Your download system will now serve the file from Cloudflare R2.

---

## 🚀 Alternative: GitHub Releases (Even Easier)

**See `GITHUB_RELEASES_SETUP.md` for detailed step-by-step guide with screenshots descriptions.**

### Quick Steps:
1. Create GitHub repo (can be private)
2. Go to Releases → Create new release
3. Tag: `v1.0.0`, upload ZIP file
4. Publish release
5. Right-click ZIP file → Copy link
6. Set `PLUGIN_FILE_URL` environment variable

**For complete instructions, see: `GITHUB_RELEASES_SETUP.md`**

---

## 📝 Which Should You Choose?

**Cloudflare R2:**
- ✅ Free tier (10GB, 1M requests/month)
- ✅ Fast CDN
- ✅ Professional
- ✅ Good for production

**GitHub Releases:**
- ✅ Completely free
- ✅ Easy versioning
- ✅ Public or private
- ✅ Good for quick setup

**Recommendation:** Use Cloudflare R2 for production, GitHub for quick testing.

---

## 🔒 Security Note

Your `api/download.js` already verifies the transaction before redirecting to the download URL, so even with a public URL, only verified customers can access it through your system.

The file URL itself might be accessible if someone guesses it, but:
- Your backend verifies the transaction first
- You can add token-based authentication later
- For now, this is secure enough

---

## ✅ Test It

1. Set your `PLUGIN_FILE_URL`
2. Make a test purchase
3. Complete checkout
4. Go to download page
5. Click download
6. Should download from your hosted URL!

