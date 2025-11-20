# Plugin ZIP File Hosting Options

## Quick Answer: Best Options

**Easiest:** Use Paddle's built-in file delivery (upload ZIP in Paddle dashboard)  
**Most Control:** Host on CDN (Cloudflare R2, AWS S3, or similar)  
**Simple Alternative:** GitHub Releases (free, public)

---

## Option 1: Paddle's Built-in File Delivery (If Available)

**Note:** Not all Paddle products support file uploads. Check your product settings.

### How to Check:
1. Go to Paddle dashboard → Products → Your Product
2. Look for "Files", "Downloads", "Digital Products", or "Product Files" tab
3. If available, upload ZIP file there
4. Paddle will email download links automatically

### If Not Available:
Paddle may not support file uploads for your product type. Use one of the CDN options below instead.

---

## Option 1: Cloudflare R2 ⭐ RECOMMENDED (Free & Fast)

**Free tier:** 10GB storage, 1M requests/month

### Steps:
1. Sign up at [cloudflare.com](https://cloudflare.com) (free)
2. Go to R2 → Create bucket
3. Upload your ZIP file
4. Make file public or use signed URLs
5. Get the public URL

### Setup:
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Create bucket
wrangler r2 bucket create plugin-downloads

# Upload file
wrangler r2 object put plugin-downloads/variation-images-pro.zip --file=./variation-images-pro.zip
```

### Get Public URL:
- Go to R2 dashboard
- Click on your file
- Copy the public URL (e.g., `https://pub-xxxxx.r2.dev/variation-images-pro.zip`)

### Update Code:
In `api/download.js`, set:
```javascript
const PLUGIN_FILE_PATH = 'https://pub-xxxxx.r2.dev/variation-images-pro.zip';
```

Or use environment variable:
```bash
PLUGIN_FILE_URL=https://pub-xxxxx.r2.dev/variation-images-pro.zip
```

---

## Option 2: AWS S3

**Cost:** ~$0.023 per GB storage + $0.09 per GB transfer

### Steps:
1. Create AWS account
2. Go to S3 → Create bucket
3. Upload ZIP file
4. Make it public or use signed URLs
5. Get the URL

### Setup:
```bash
# Install AWS CLI
aws s3 cp variation-images-pro.zip s3://your-bucket-name/ --acl public-read
```

### Get URL:
`https://your-bucket-name.s3.amazonaws.com/variation-images-pro.zip`

### Update Code:
```javascript
const PLUGIN_FILE_PATH = 'https://your-bucket-name.s3.amazonaws.com/variation-images-pro.zip';
```

---

## Option 3: GitHub Releases (Free & Simple)

**Free:** Unlimited storage for public repos

### Steps:
1. Create a GitHub repository (can be private)
2. Go to Releases → Create new release
3. Upload your ZIP file as an asset
4. Get the download URL

### Get URL:
After uploading, right-click "Download" button → Copy link
Example: `https://github.com/yourusername/plugin-releases/releases/download/v1.0.0/variation-images-pro.zip`

### Pros:
✅ Free  
✅ Reliable (GitHub CDN)  
✅ Version control  
✅ Easy updates  

### Cons:
❌ Public repos = public downloads (use private repo + tokens for security)
❌ Less professional than CDN

### Update Code:
```javascript
const PLUGIN_FILE_PATH = 'https://github.com/yourusername/plugin-releases/releases/download/v1.0.0/variation-images-pro.zip';
```

---

## Option 4: Your Own Server/Vercel

### If using Vercel:
1. Create `/public/downloads/` folder
2. Upload ZIP file there
3. Access at: `https://yourdomain.com/downloads/variation-images-pro.zip`

### Update Code:
```javascript
const PLUGIN_FILE_PATH = 'https://yourdomain.com/downloads/variation-images-pro.zip';
```

### Pros:
✅ Full control  
✅ No external dependencies  

### Cons:
❌ Uses your bandwidth  
❌ Slower than CDN  
❌ Not ideal for large files  

---

## Option 5: Google Drive / Dropbox (Quick & Dirty)

### Steps:
1. Upload to Google Drive or Dropbox
2. Get shareable link
3. Convert to direct download link

### Google Drive Direct Link:
1. Upload file
2. Right-click → Get link → Anyone with link
3. Convert: `https://drive.google.com/uc?export=download&id=FILE_ID`

### Pros:
✅ Free  
✅ Quick setup  

### Cons:
❌ Not professional  
❌ May have download limits  
❌ Can break if file moved  

---

## Recommended Setup

### For Production:
**Use Cloudflare R2** (Option 1) - Free tier, fast CDN, reliable

### Quick Alternative:
**Use GitHub Releases** (Option 3) - Free, easy, good for versioning

---

## How to Configure

### If using Paddle's delivery:
- No configuration needed! Just upload in Paddle dashboard
- Update `DownloadPage.tsx` to show "Check your email" message

### If using CDN/Server:
1. Upload ZIP file to your chosen hosting
2. Get the public URL
3. Update `api/download.js`:
   ```javascript
   const PLUGIN_FILE_PATH = process.env.PLUGIN_FILE_URL || 'YOUR_URL_HERE';
   ```
4. Or set environment variable:
   ```bash
   PLUGIN_FILE_URL=https://your-cdn.com/plugin.zip
   ```

---

## Security Considerations

### Public URL (Less Secure):
- Anyone with URL can download
- Use if file is meant to be downloadable after payment verification

### Signed URLs (More Secure):
- URL expires after set time
- Requires authentication
- Better for premium products

### Current Setup:
Your `api/download.js` verifies the transaction before redirecting, so even with a public URL, only verified customers can access it through your system.

---

## Quick Start (Recommended)

### Step 1: Host Your ZIP File

**Option A: Cloudflare R2 (Recommended)**
1. Sign up at [cloudflare.com](https://cloudflare.com) (free)
2. Go to R2 → Create bucket (name it `plugin-downloads`)
3. Upload `variation-images-pro.zip`
4. Click on file → Copy public URL
5. URL looks like: `https://pub-xxxxx.r2.dev/variation-images-pro.zip`

**Option B: GitHub Releases (Easiest)**
1. Create GitHub repo (can be private)
2. Go to Releases → Create new release
3. Upload ZIP as asset
4. Right-click download button → Copy link
5. URL looks like: `https://github.com/user/repo/releases/download/v1.0.0/variation-images-pro.zip`

### Step 2: Configure Your Backend

Set environment variable in your hosting (Vercel, Netlify, etc.):
```bash
PLUGIN_FILE_URL=https://your-url-here/variation-images-pro.zip
```

Or update `api/download.js` directly:
```javascript
const PLUGIN_FILE_PATH = 'https://your-url-here/variation-images-pro.zip';
```

### Step 3: Test

1. Make a test purchase
2. Verify transaction on download page
3. Click download button
4. Should download from your hosted URL

---

## Need Help?

- **Paddle Delivery:** Check Paddle dashboard → Product → Files
- **Cloudflare R2:** [docs.cloudflare.com/r2](https://developers.cloudflare.com/r2)
- **AWS S3:** [aws.amazon.com/s3](https://aws.amazon.com/s3)

