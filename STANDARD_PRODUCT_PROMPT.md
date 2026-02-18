# Standard prompt: Add a new product/plugin

Use this when adding any new product (plugin, theme, etc.) to the store so everything stays consistent and nothing is missed.

---

## Copy this block when requesting a new product

```
Add a new product/plugin to the store with the following. Follow DRY, separation of concerns, and minimal code.

**Product**
- Slug: [e.g. my-plugin]
- Name: [display name]
- Category: [e.g. WordPress Plugin | WooCommerce Plugin | Theme]
- Description: [1–2 sentences for cards and meta]
- Results/tagline: [e.g. "Cleaner admin experience" or "250% increase in conversion"]
- Features (4 short items): [e.g. Feature 1, Feature 2, Feature 3, Feature 4]
- Price: $[XX.XX] USD

**Assets**
- Store card image: /images/plugin/[slug]-preview.png (use object-cover object-top)
- [If before/after slider:] before: /images/plugin/[slug]-before.png, after: /images/plugin/[slug]-after.png

**Paddle (when ready)**
- Product ID: [pro_xxx]
- Price ID: [pri_xxx]
- Same IDs in: PluginPage pluginData, api/lib/product-config.js, env [SLUG]_PLUGIN_FILE_URL for download

**Place everywhere needed**
- src/data/productsPlugins.ts (single source for price + listing)
- src/pages/StoreHome.tsx (products array: id, name, category, description, price via getPrice(slug), icon, slug, features)
- src/pages/PluginPage.tsx (pluginData entry: name, tagline, description, paddleProductId, paddlePriceId, paddleVendorId, price via getPrice, features, heroImage, tocItems if different)
- src/components/Breadcrumbs.tsx (path → label)
- src/components/Footer.tsx (Products link)
- api/lib/product-config.js (Paddle product_id/price_id → slug, fileEnvKey)

**Optional**
- Product-specific section (e.g. before/after slider only for this slug): conditional in PluginPage by slug.
- Custom tocItems in pluginData if fewer sections than default.

Do not duplicate price: use getPrice(slug) from productsPlugins. Do not expose API keys or add new public API surface.
```

---

## Checklist (for you before requesting)

- [ ] Paddle product created; you have product_id and price_id (or leave blank and add later)
- [ ] Preview image at `public/images/plugin/[slug]-preview.png`
- [ ] If before/after: two images at `[slug]-before.png` and `[slug]-after.png`
- [ ] Plugin ZIP URL for download (env var) when Paddle is set up

---

## What gets updated (reference)

| Location | Purpose |
|----------|---------|
| `src/data/productsPlugins.ts` | Single source: price, title, description, features, pluginSlug, imagePath |
| `src/pages/StoreHome.tsx` | Store grid: add to `products` array, use `getPrice(slug)` for price |
| `src/pages/PluginPage.tsx` | Product page: add to `pluginData[slug]`, optional tocItems / conditional sections |
| `src/components/Breadcrumbs.tsx` | Add `path === 'slug' → label` |
| `src/components/Footer.tsx` | Add link under Products |
| `api/lib/product-config.js` | Add Paddle ID(s) → slug, fileEnvKey for download routing |
