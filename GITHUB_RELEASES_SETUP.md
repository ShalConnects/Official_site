# Step-by-Step: Host Plugin ZIP on GitHub Releases

This guide will walk you through hosting your plugin ZIP file on GitHub Releases so customers can download it after purchase.

---

## Prerequisites

- A GitHub account (sign up at [github.com](https://github.com) if you don't have one)
- Your `variation-images-pro.zip` file ready

---

## Step 1: Create a GitHub Repository

### 1.1 Sign in to GitHub
1. Go to [github.com](https://github.com)
2. Sign in to your account (or create one if needed)

### 1.2 Create New Repository
1. Click the **"+"** icon in the top right corner
2. Select **"New repository"**

### 1.3 Configure Repository
1. **Repository name:** Enter something like:
   - `variation-images-pro-releases`
   - `shalconnects-plugin-downloads`
   - `plugin-releases`
   - (Any name works, this is just for hosting files)

2. **Description (optional):** 
   - "Plugin download repository for Variation Images Pro"

3. **Visibility:**
   - ✅ **Private** (recommended) - Only you can see it
   - ⚠️ **Public** - Anyone can see the repo (but download links still work)

4. **DO NOT** check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   - (We're creating an empty repo just for releases)

5. Click **"Create repository"**

---

## Step 2: Create Your First Release

### 2.1 Navigate to Releases
1. You'll be on your new repository page
2. Look for the **"Releases"** link on the right sidebar
   - It might say "0 releases" or "Releases"
   - If you don't see it, click the **"Code"** tab, then look for "Releases" in the sidebar

### 2.2 Create New Release
1. Click **"Releases"**
2. Click **"Create a new release"** button
   - (If this is your first release, you'll see "Create a new release" as a big button)

### 2.3 Fill in Release Details

**Choose a tag:**
1. Click **"Choose a tag"** dropdown
2. Type: `v1.0.0` (or `v1.0` or just `1.0.0`)
3. Click **"Create new tag: v1.0.0 on publish"**
   - This creates a new tag when you publish

**Release title:**
- Enter: `Variation Images Pro v1.0.0`
- Or: `Version 1.0.0`
- Or: `Initial Release`

**Description (optional):**
- You can add release notes like:
  ```
  Initial release of Variation Images Pro
  
  Features:
  - Custom variation images
  - Multiple display styles
  - Visual designer
  ```

### 2.4 Upload Your ZIP File
1. Scroll down to the **"Attach binaries by dropping them here"** section
2. You have two options:

   **Option A: Drag and Drop**
   - Open File Explorer (Windows) or Finder (Mac)
   - Navigate to your `variation-images-pro.zip` file
   - Drag the file into the "Attach binaries" area
   - Wait for upload to complete

   **Option B: Click to Upload**
   - Click **"selecting them"** link in the "Attach binaries" section
   - Browse to your ZIP file
   - Select it and click "Open"
   - Wait for upload to complete

3. You should see your file listed under "Attach binaries" with a file size

### 2.5 Publish Release
1. Scroll to the bottom
2. Click **"Publish release"** button (green button)
3. Wait a few seconds for GitHub to process

---

## Step 3: Get the Download URL

### 3.1 View Your Release
1. After publishing, you'll be on the release page
2. You should see your release title and the ZIP file listed

### 3.2 Copy the Download URL
You have two ways to get the URL:

**Method 1: Right-click (Recommended)**
1. Find your `variation-images-pro.zip` file in the "Assets" section
2. **Right-click** on the file name or download button
3. Select **"Copy link address"** or **"Copy link"**
4. The URL will look like:
   ```
   https://github.com/yourusername/repo-name/releases/download/v1.0.0/variation-images-pro.zip
   ```

**Method 2: Click and Copy from Browser**
1. Click on the ZIP file name
2. It will start downloading
3. In your browser's download bar, right-click the download
4. Select "Copy download link" or check the URL in downloads

**Method 3: Manual URL Construction**
If you know your details:
- Username: `yourusername`
- Repo name: `variation-images-pro-releases`
- Tag: `v1.0.0`
- File name: `variation-images-pro.zip`

URL format:
```
https://github.com/yourusername/variation-images-pro-releases/releases/download/v1.0.0/variation-images-pro.zip
```

### 3.3 Verify the URL
1. Copy the URL
2. Open it in a new browser tab (incognito/private window)
3. It should start downloading the ZIP file
4. If it downloads, the URL is correct! ✅

---

## Step 4: Configure Your Application

Now you need to tell your app where to find the file.

### Option A: Environment Variable (Recommended for Production)

**If using Vercel:**
1. Go to [vercel.com](https://vercel.com) dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. **Key:** `PLUGIN_FILE_URL`
6. **Value:** Paste your GitHub URL (the one you copied)
   ```
   https://github.com/yourusername/repo/releases/download/v1.0.0/variation-images-pro.zip
   ```
7. Select **Production**, **Preview**, and **Development** (or just Production)
8. Click **"Save"**
9. **Redeploy** your application for changes to take effect

**If using Netlify:**
1. Go to Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add variable"**
5. **Key:** `PLUGIN_FILE_URL`
6. **Value:** Your GitHub URL
7. Click **"Save"**
8. Redeploy

**If using other hosting:**
- Find "Environment Variables" or "Config Vars" in settings
- Add `PLUGIN_FILE_URL` with your GitHub URL

### Option B: Update Code Directly (For Testing)

1. Open `api/download.js` in your project
2. Find this line:
   ```javascript
   const PLUGIN_FILE_PATH = process.env.PLUGIN_FILE_URL || 'https://your-cdn.com/variation-images-pro.zip';
   ```
3. Replace with:
   ```javascript
   const PLUGIN_FILE_PATH = process.env.PLUGIN_FILE_URL || 'https://github.com/yourusername/repo/releases/download/v1.0.0/variation-images-pro.zip';
   ```
4. Replace `yourusername/repo/v1.0.0` with your actual values
5. Save the file

### Option C: Local Development (.env file)

1. Create a file named `.env.local` in your project root (same folder as `package.json`)
2. Add this line:
   ```
   PLUGIN_FILE_URL=https://github.com/yourusername/repo/releases/download/v1.0.0/variation-images-pro.zip
   ```
3. Replace with your actual URL
4. Restart your development server

---

## Step 5: Test the Download

### 5.1 Test the URL Directly
1. Open the GitHub URL in a browser
2. The ZIP file should download
3. If it works, proceed to next step

### 5.2 Test Through Your App
1. Make a test purchase (or use Paddle sandbox mode)
2. Complete checkout
3. You should be redirected to `/download?transaction=xxx`
4. The download page should verify the transaction
5. Click the "Download Pro Version" button
6. The file should download from your GitHub URL

---

## Step 6: Update for New Versions

When you release a new version:

1. Go to your GitHub repo → **Releases**
2. Click **"Draft a new release"**
3. Create new tag: `v1.1.0` (or next version)
4. Upload new ZIP file
5. Publish release
6. Copy new download URL
7. Update `PLUGIN_FILE_URL` environment variable with new URL
8. Redeploy your app

---

## Troubleshooting

### Problem: "404 Not Found" when accessing URL
**Solution:**
- Make sure the release is published (not draft)
- Check the tag name matches exactly
- Check the file name matches exactly
- Try accessing the release page first to verify file is there

### Problem: File downloads but is corrupted
**Solution:**
- Re-upload the ZIP file
- Make sure file uploaded completely (check file size)
- Try downloading from GitHub release page directly first

### Problem: Environment variable not working
**Solution:**
- Make sure you redeployed after setting the variable
- Check variable name is exactly `PLUGIN_FILE_URL` (case-sensitive)
- For local dev, make sure `.env.local` is in project root
- Restart your dev server after adding `.env.local`

### Problem: Can't see Releases option
**Solution:**
- Make sure you're on the repository page (not GitHub homepage)
- Look in the right sidebar under "About" section
- Or go to: `https://github.com/yourusername/repo-name/releases`

---

## Security Notes

✅ **Good:** Your backend (`api/download.js`) verifies the transaction before redirecting, so only verified customers can access the download through your system.

⚠️ **Note:** The GitHub URL itself is public (if repo is public) or accessible to anyone with the link. However:
- Your backend verifies transactions first
- Customers go through your download page
- The URL is long and hard to guess
- This is secure enough for most use cases

🔒 **For Extra Security (Optional):**
- Keep the repository private
- Use GitHub tokens for authentication (more complex setup)
- Or switch to Cloudflare R2 with signed URLs

---

## Quick Checklist

- [ ] Created GitHub account
- [ ] Created new repository
- [ ] Created release with tag (e.g., v1.0.0)
- [ ] Uploaded ZIP file to release
- [ ] Published the release
- [ ] Copied the download URL
- [ ] Verified URL works (downloads in browser)
- [ ] Set `PLUGIN_FILE_URL` environment variable
- [ ] Redeployed application
- [ ] Tested download through your app

---

## Example URLs

Here's what your URL should look like:

```
https://github.com/shalconnects/variation-images-pro/releases/download/v1.0.0/variation-images-pro.zip
```

Breakdown:
- `shalconnects` = your GitHub username
- `variation-images-pro` = repository name
- `v1.0.0` = release tag
- `variation-images-pro.zip` = file name

---

## Need Help?

If you get stuck:
1. Make sure the release is **published** (not draft)
2. Check the URL format matches exactly
3. Try accessing the release page in GitHub first
4. Verify the file uploaded completely (check size)

Your download system is now ready! 🎉

