# Linking Between Store & Main Site - Guidance

## ⚠️ **Critical Answer: NO Links from Store to Main Site**

**Do NOT link from `store.shalconnects.com` to `shalconnects.com`**

### Why?

Ana from Paddle said: *"you would need to create a separate domain or subdomain dedicated only to the software product, **with no services shown**."*

If Paddle reviewers:
1. Visit `store.shalconnects.com`
2. Click a link to `shalconnects.com`
3. See services on the main site
4. **They may consider this a violation** - because services are "shown" via the link

---

## ✅ **What's Currently Safe**

### 1. **Email Addresses** ✅
- `hello@shalconnects.com` in footer - **OK**
- `support@shalconnects.com` in legal pages - **OK**
- These are contact methods, not links to services

### 2. **Company Name/Brand** ✅
- "ShalConnects" mentioned in footer - **OK**
- Company name in legal pages - **OK**
- This is branding, not a link to services

### 3. **Domain Mentioned in Text** ✅
- Legal pages mention "shalconnects.com" - **OK** (as long as not clickable)
- This is informational, not a navigation link

### 4. **Social Media Links** ✅
- LinkedIn, Twitter links - **OK**
- These don't lead to services

---

## ❌ **What to Avoid**

### 1. **Navigation Links to Main Site** ❌
- ❌ "Visit our main site" link
- ❌ "Our Services" link
- ❌ "About Us" link (if it mentions services)
- ❌ Logo linking to main site homepage

### 2. **Footer Links to Services** ❌
- ❌ "Services" section in footer
- ❌ Links to service pages
- ❌ "Web Development" links

### 3. **Breadcrumbs Linking to Main Site** ❌
- ✅ Current setup is OK (Breadcrumbs link to `/store` on store subdomain)

---

## ✅ **What's OK: Main Site → Store**

**Links FROM main site TO store are probably fine:**
- Main site can link to store (e.g., "Buy our plugins")
- Main site isn't using Paddle, so it's not under review
- This is common practice (main site promotes products)

**Example:**
- On `shalconnects.com`: "Check out our [WordPress plugins](https://store.shalconnects.com)" ✅

---

## 🔍 **Current Status Check**

### ✅ **Store Pages - Currently Safe:**

1. **Footer.tsx** ✅
   - No links to main site
   - Only email, social media, legal pages
   - **Status: OK**

2. **StoreHome.tsx** ✅
   - No links to main site
   - Only product links
   - **Status: OK**

3. **Breadcrumbs.tsx** ✅
   - Links to `/store` on store subdomain (not main site)
   - **Status: OK**

4. **Legal Pages** ⚠️
   - Mention "shalconnects.com" in text
   - But no clickable links to main site
   - **Status: Probably OK** (but could be safer)

---

## 🛡️ **Recommended Changes**

### Option 1: Keep Current Setup (Safest)
- ✅ No changes needed
- ✅ No links from store to main site
- ✅ Legal pages mention domain but don't link
- ✅ This is the safest approach

### Option 2: Update Legal Pages (More Explicit)
If you want to be extra safe, update legal pages to:
- Remove mentions of "shalconnects.com" (or make it clear it's a different site)
- Or add a note: "This store is separate from our main website"

**Example update for Terms page:**
```tsx
// Instead of:
<strong>Website:</strong> shalconnects.com

// Use:
<strong>Store:</strong> store.shalconnects.com
<strong>Company Website:</strong> shalconnects.com (separate site)
```

---

## 📋 **Final Recommendation**

### **For Paddle Approval:**
1. ✅ **Keep current setup** - No links from store to main site
2. ✅ **Legal pages are fine** - Domain mentions are OK (not clickable links)
3. ✅ **Email addresses are fine** - Contact info, not service links
4. ✅ **Company name is fine** - Branding, not a link

### **After Paddle Approval:**
- You can still keep them separate (safest)
- Or add a small "Visit our main site" link in footer (less safe, but probably OK after approval)

---

## ✅ **Checklist Before Submission**

- [ ] No navigation links to main site from store
- [ ] No "Services" links anywhere on store
- [ ] Footer doesn't link to main site
- [ ] Breadcrumbs stay within store subdomain
- [ ] Legal pages don't have clickable links to main site
- [ ] Email addresses are fine (contact info)
- [ ] Company name is fine (branding)

**Current Status: ✅ You're good to go!**

No changes needed - your current setup is safe for Paddle submission.

---

## 🎯 **Summary**

**Answer: NO, don't link from store to main site**

**Why:** Paddle requires "no services shown" - links could be seen as showing services

**Current Status:** ✅ Your setup is already safe - no links from store to main site

**Action Needed:** None - you're ready to submit!

