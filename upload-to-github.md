# Quick Upload to GitHub Release

Your ZIP file is ready: `wc-variation-images-pro-pro-v1.0.0.zip`

## Method 1: GitHub Web Interface (Easiest - 2 minutes)

### Step 1: Go to Your Repository
1. Open: https://github.com/ShalConnects/variation-images-pro-zip
2. Make sure you're signed in

### Step 2: Create Release
1. Click **"Releases"** (on the right sidebar, or go to: https://github.com/ShalConnects/variation-images-pro-zip/releases)
2. Click **"Create a new release"** button

### Step 3: Fill Release Details
1. **Choose a tag:** Type `v1.0.0` and click "Create new tag: v1.0.0 on publish"
2. **Release title:** `Variation Images Pro v1.0.0`
3. **Description (optional):** 
   ```
   Initial release of Variation Images Pro
   ```

### Step 4: Upload ZIP File
1. Scroll down to **"Attach binaries by dropping them here"** section
2. **Option A:** Drag and drop `wc-variation-images-pro-pro-v1.0.0.zip` from your project folder
3. **Option B:** Click "selecting them" and browse to:
   ```
   C:\Users\salau\Downloads\Projects\ShalConnects\wc-variation-images-pro-pro-v1.0.0.zip
   ```
4. Wait for upload to complete (you'll see file size)

### Step 5: Publish
1. Click **"Publish release"** (green button at bottom)
2. Wait a few seconds

### Step 6: Get Download URL
1. After publishing, you'll see your release
2. Find `wc-variation-images-pro-pro-v1.0.0.zip` in Assets section
3. **Right-click** on the file name → **"Copy link address"**
4. URL will be:
   ```
   https://github.com/ShalConnects/variation-images-pro-zip/releases/download/v1.0.0/wc-variation-images-pro-pro-v1.0.0.zip
   ```

### Step 7: Update Your App
Set environment variable:
```
PLUGIN_FILE_URL=https://github.com/ShalConnects/variation-images-pro-zip/releases/download/v1.0.0/wc-variation-images-pro-pro-v1.0.0.zip
```

---

## Method 2: Using GitHub CLI (If You Install It)

### Install GitHub CLI:
```powershell
winget install --id GitHub.cli
```

### Then run:
```powershell
gh release create v1.0.0 wc-variation-images-pro-pro-v1.0.0.zip --title "Variation Images Pro v1.0.0" --repo ShalConnects/variation-images-pro-zip
```

---

## Quick Link

**Go directly to create release:**
https://github.com/ShalConnects/variation-images-pro-zip/releases/new

**Your file location:**
`C:\Users\salau\Downloads\Projects\ShalConnects\wc-variation-images-pro-pro-v1.0.0.zip`

---

## After Upload

Once uploaded, your download URL will be:
```
https://github.com/ShalConnects/variation-images-pro-zip/releases/download/v1.0.0/wc-variation-images-pro-pro-v1.0.0.zip
```

Update your `PLUGIN_FILE_URL` environment variable with this URL!

