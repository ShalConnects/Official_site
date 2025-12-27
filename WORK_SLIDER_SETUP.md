# Work Slider Setup Guide

## ✅ What's Been Implemented

I've successfully created a complete work slider system for your portfolio! Here's what's been added:

### 1. **Data Structure** (`src/data/workPortfolio.ts`)
   - Centralized data file for all your work images
   - Helper functions to filter by service
   - Easy to add/update work entries

### 2. **WorkSlider Component** (`src/components/WorkSlider.tsx`)
   - Full-featured image slider with:
     - Auto-play (5 seconds, pauses on hover)
     - Navigation arrows and dot indicators
     - Fullscreen modal view
     - Keyboard navigation (arrow keys, ESC)
     - Service badges
     - Image loading states
     - Responsive design

### 3. **Landing Page Integration**
   - Added "Our Work Showcase" section
   - Shows all work images mixed together (shuffled)
   - Appears after the "Featured Work" section

### 4. **Service Page Integration**
   - Added work slider to individual service pages
   - Automatically filters to show only work for that specific service
   - Appears in the portfolio section

---

## 📋 What You Need To Do

### Step 1: Create the Images Folder

Create a folder for your work images:
```
public/images/work/
```

### Step 2: Add Your Work Images

1. Place all your work screenshots/images in `public/images/work/`
2. Name them descriptively (e.g., `wordpress-ecommerce-store.png`, `shopify-fashion-boutique.png`)

### Step 3: Add Your Work Data

Open `src/data/workPortfolio.ts` and add your work entries. Here's the format:

```typescript
export const workPortfolio: WorkImage[] = [
  {
    id: 'wp-project-1',
    image: '/images/work/wordpress-ecommerce-store.png',
    title: 'E-commerce WordPress Site',
    description: 'Custom WooCommerce store with modern design and payment integration',
    services: ['WordPress'], // Must match service title exactly
    category: 'e-commerce',
    projectUrl: 'https://example.com' // Optional: link to live project
  },
  {
    id: 'shopify-project-1',
    image: '/images/work/shopify-fashion-store.png',
    title: 'Fashion Shopify Store',
    description: 'Beautiful Shopify store with custom theme',
    services: ['Shopify'],
    category: 'e-commerce'
  },
  {
    id: 'wix-project-1',
    image: '/images/work/wix-restaurant-site.png',
    title: 'Restaurant Website',
    description: 'Modern restaurant website with online menu',
    services: ['Wix'],
    category: 'business'
  },
  // Add more entries...
];
```

### Important Notes:
- **Service Names**: The `services` array must match the exact service titles from your service categories:
  - `'WordPress'`
  - `'Shopify'`
  - `'Wix'`
  - `'eBay'`
  - `'Amazon'`
  - `'Walmart'`
  - `'Custom Site'`
  - `'Android App'`
  - `'Brand Identity'`
  - `'Social Media Graphics'`
  - `'Print Design'`
  - `'Web Graphics'`

- **Multiple Services**: An image can belong to multiple services:
  ```typescript
  services: ['WordPress', 'Shopify'] // Shows on both service pages
  ```

- **Image Paths**: Always start with `/images/work/` (the public folder path)

### Step 4: Test It Out

1. Start your development server: `npm start`
2. Visit the landing page - you should see the "Our Work Showcase" section
3. Visit any service page (e.g., `/services/wordpress`) - you should see the filtered slider
4. If no images are added yet, you'll see a helpful message

---

## 🎨 Customization Options

### Change Auto-Play Speed
In `LandingPage.tsx` or `ServicePage.tsx`, modify:
```typescript
<WorkSlider 
  images={...} 
  autoPlay={true}
  autoPlayInterval={3000} // Change to 3 seconds (default is 5000)
/>
```

### Disable Auto-Play
```typescript
<WorkSlider 
  images={...} 
  autoPlay={false}
/>
```

### Hide Service Badges (on service pages)
```typescript
<WorkSlider 
  images={...} 
  showServiceBadges={false} // Already set on service pages
/>
```

---

## 📁 File Structure

```
src/
├── components/
│   └── WorkSlider.tsx          # The slider component
├── data/
│   └── workPortfolio.ts        # Your work data (EDIT THIS)
└── pages/
    ├── LandingPage.tsx         # Global slider added
    └── ServicePage.tsx         # Service-specific slider added

public/
└── images/
    └── work/                   # PUT YOUR IMAGES HERE
        ├── wordpress-1.png
        ├── shopify-1.png
        └── ...
```

---

## 🚀 Quick Start Example

1. **Add one image** to `public/images/work/test.png`

2. **Add one entry** to `src/data/workPortfolio.ts`:
```typescript
export const workPortfolio: WorkImage[] = [
  {
    id: 'test-1',
    image: '/images/work/test.png',
    title: 'My First Work',
    description: 'This is a test work entry',
    services: ['WordPress']
  }
];
```

3. **Save and refresh** - you should see it on the landing page and WordPress service page!

---

## 💡 Tips

- **Image Sizes**: Recommended size is 1200-1920px wide for best quality
- **File Formats**: PNG, JPG, or WebP all work
- **Naming**: Use descriptive names like `wordpress-ecommerce-store.png` for easy management
- **Organization**: You can organize by service in subfolders if you prefer, just update the paths

---

## ❓ Troubleshooting

**Slider not showing?**
- Make sure you've added entries to `workPortfolio.ts`
- Check that image paths are correct (start with `/images/work/`)
- Verify service names match exactly (case-sensitive)

**Images not loading?**
- Check that images are in `public/images/work/`
- Verify the file names match what's in `workPortfolio.ts`
- Check browser console for 404 errors

**Service page shows no images?**
- Make sure the service name in `services` array matches the service title exactly
- Check that you've added work for that specific service

---

## 🎉 You're All Set!

Once you add your images and data, the sliders will automatically:
- Show on the landing page (all work mixed)
- Show on service pages (filtered by service)
- Auto-play through images
- Allow fullscreen viewing
- Support keyboard navigation

Happy showcasing! 🚀

