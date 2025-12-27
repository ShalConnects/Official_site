# How to Add Images to Work Portfolio

## ✅ Quick Guide

### Step 1: Place Your Images
Put your image files in: `public/images/work/`

**Example:**
```
public/
  └── images/
      └── work/
          ├── Banner_1.jpg
          ├── my-wordpress-site.png
          └── shopify-store.jpg
```

### Step 2: Add Entry to workPortfolio.ts

Open `src/data/workPortfolio.ts` and add your entry:

```typescript
{
  id: 'unique-id',                    // Unique identifier
  image: '/images/work/filename.jpg', // Path to your image
  title: 'Project Title',            // Title shown on hover
  description: 'Project description', // Optional: shown on hover
  services: ['eBay'],                 // ⚠️ MUST match service title exactly!
  category: 'e-commerce',            // Optional: for organization
  projectUrl: 'https://...'         // Optional: link to live project
}
```

## 📋 Valid Service Names

The `services` array **MUST** match these exact service titles:

### Platforms
- `'WordPress'`
- `'Shopify'`
- `'Wix'`

### E-commerce
- `'eBay'`
- `'Amazon'`
- `'Walmart'`

### Development
- `'Custom Site'`
- `'Android App'`

### Design
- `'Brand Identity'`
- `'Social Media Graphics'`
- `'Print Design'`
- `'Web Graphics'`

## 📝 Examples

### Example 1: eBay Banner
```typescript
{
  id: 'ebay-banner-1',
  image: '/images/work/Banner_1.jpg',
  title: 'eBay Store Banner',
  description: 'Professional banner design',
  services: ['eBay'],
  category: 'e-commerce'
}
```

### Example 2: WordPress Site
```typescript
{
  id: 'wp-site-1',
  image: '/images/work/wordpress-site.png',
  title: 'E-commerce WordPress Site',
  description: 'Custom WooCommerce store',
  services: ['WordPress'],
  category: 'e-commerce',
  projectUrl: 'https://example.com'
}
```

### Example 3: Multiple Services
```typescript
{
  id: 'multi-service-1',
  image: '/images/work/design-work.png',
  title: 'Brand Design',
  description: 'Complete branding package',
  services: ['Brand Identity', 'Social Media Graphics'], // Shows on both pages!
  category: 'design'
}
```

## ⚠️ Common Mistakes

### ❌ Wrong Service Name
```typescript
services: ['Banner Design']  // ❌ Doesn't exist!
services: ['ebay']          // ❌ Wrong case!
services: ['Ebay']          // ❌ Wrong case!
```

### ✅ Correct Service Name
```typescript
services: ['eBay']          // ✅ Correct!
services: ['WordPress']     // ✅ Correct!
services: ['Social Media Graphics'] // ✅ Correct!
```

### ❌ Wrong Image Path
```typescript
image: 'images/work/banner.jpg'     // ❌ Missing leading /
image: '/public/images/work/banner.jpg' // ❌ Don't include 'public'
image: './images/work/banner.jpg'   // ❌ Wrong format
```

### ✅ Correct Image Path
```typescript
image: '/images/work/banner.jpg'    // ✅ Correct!
```

## 🎯 Quick Checklist

- [ ] Image file is in `public/images/work/`
- [ ] Image path starts with `/images/work/`
- [ ] Service name matches exactly (case-sensitive!)
- [ ] ID is unique
- [ ] Title is descriptive

## 🚀 After Adding

1. **Save the file** (`workPortfolio.ts`)
2. **Check your dev server** - it should auto-reload
3. **Visit landing page** - see "Our Latest Work" section
4. **Visit service page** - see filtered work (e.g., `/services/ebay`)

## 💡 Tips

- **Multiple Services**: Add multiple services to show on multiple pages:
  ```typescript
  services: ['eBay', 'Amazon'] // Shows on both eBay and Amazon pages
  ```

- **File Formats**: Supports `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

- **Image Sizes**: Recommended 1200-1920px wide for best quality

- **Naming**: Use descriptive filenames like `ebay-banner-1.jpg` for easy management

## ❓ Troubleshooting

**Image not showing?**
1. Check file exists in `public/images/work/`
2. Check path in code matches filename exactly (case-sensitive!)
3. Check browser console for 404 errors
4. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)

**Not showing on service page?**
1. Check service name matches exactly (case-sensitive!)
2. Check service name is in the valid list above
3. Make sure you're visiting the correct service page URL

**Slider not scrolling?**
1. Make sure you have at least 1 image in the array
2. Check browser console for errors
3. Try refreshing the page

