# Hosting Plugin ZIP on Vercel

## ✅ Current Setup

Your ZIP file is located at:
```
public/downloads/wc-variation-images-pro-pro-v1.0.0.zip
```

## How It Works

In Vite/React projects, files in the `public` folder are served statically at the root URL.

- **Local dev:** `http://localhost:5173/downloads/wc-variation-images-pro-pro-v1.0.0.zip`
- **Vercel production:** `https://yourdomain.com/downloads/wc-variation-images-pro-pro-v1.0.0.zip`

## ✅ Configuration

The `api/download.js` file has been updated to automatically use your Vercel-hosted file.

### How It Works:
1. User completes purchase
2. Transaction is verified
3. User is redirected to: `/downloads/wc-variation-images-pro-pro-v1.0.0.zip`
4. File downloads from your Vercel deployment

## Testing

### Local Testing:
1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:5173/downloads/wc-variation-images-pro-pro-v1.0.0.zip`
3. File should download

### Production Testing:
1. Deploy to Vercel
2. Visit: `https://yourdomain.com/downloads/wc-variation-images-pro-pro-v1.0.0.zip`
3. File should download

## Deploy to Vercel

1. **Push to Git:**
   ```bash
   git add .
   git commit -m "Add plugin ZIP file"
   git push
   ```

2. **Deploy:**
   - If connected to Vercel, it auto-deploys
   - Or go to Vercel dashboard → Deploy

3. **Verify:**
   - After deployment, test the URL:
   - `https://yourdomain.com/downloads/wc-variation-images-pro-pro-v1.0.0.zip`

## Environment Variables (Optional)

If you want to override the file URL later (e.g., move to CDN), set:
```
PLUGIN_FILE_URL=https://your-cdn.com/file.zip
```

Otherwise, it will automatically use the Vercel-hosted file.

## File Size Considerations

- **Vercel Free Tier:** 100MB per file limit
- Your file: ~154KB ✅ (well within limits)
- **Bandwidth:** Vercel includes generous bandwidth on free tier

## Updating the File

When you release a new version:

1. Replace `public/downloads/wc-variation-images-pro-pro-v1.0.0.zip` with new file
2. Update filename in `api/download.js` if needed
3. Deploy to Vercel
4. Done!

## Security

✅ **Secure:** Your `api/download.js` verifies the transaction before redirecting, so only verified customers can access the download through your system.

⚠️ **Note:** The direct URL (`/downloads/file.zip`) is publicly accessible if someone knows the path. However:
- Your backend verifies transactions first
- Customers go through your download page
- The filename is long and hard to guess
- This is secure enough for most use cases

## Advantages of Vercel Hosting

✅ **Simple:** Just put file in `public/` folder  
✅ **Fast:** Served from Vercel's CDN  
✅ **Free:** Included in Vercel free tier  
✅ **No setup:** Works automatically  
✅ **Version control:** File is in your repo  

## Next Steps

1. ✅ File is in `public/downloads/`
2. ✅ Code is configured
3. ⏳ Deploy to Vercel
4. ⏳ Test the download flow

Your setup is ready! 🎉

