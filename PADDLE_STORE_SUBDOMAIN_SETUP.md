# Paddle Store Subdomain Setup Guide

## 🎯 Goal
Set up `store.shalconnects.com` as a **software-only store** (NO services) to get Paddle approval.

---

## ✅ Critical Requirements from Paddle

Based on Ana's response, the store subdomain MUST:
- ✅ **ONLY show software products** (plugins, themes)
- ❌ **NO agency services** (web development, design, consulting, etc.)
- ❌ **NO human-delivered services** mentioned anywhere
- ✅ All required legal pages accessible
- ✅ Clear product information and pricing

---

## 📋 Pre-Submission Checklist

### 1. **Store Content Review** ✅

**Verify these pages have NO service mentions:**

- [ ] **Homepage (`/store`)** - Only shows products, no services
- [ ] **Product pages** (`/store/variation-images-pro`) - Only product info
- [ ] **Footer** - No service links (current footer is OK)
- [ ] **Navigation** - No links to services
- [ ] **About/Company info** - If present, must NOT mention services
- [ ] **Contact page** - If present, must be for product support only

**What's ALLOWED:**
- ✅ Software products (plugins, themes)
- ✅ Product descriptions
- ✅ Pricing information
- ✅ Product support/help
- ✅ Legal pages (Terms, Privacy, Refund)

**What's NOT ALLOWED:**
- ❌ Web development services
- ❌ Design services
- ❌ Consulting services
- ❌ Custom development services
- ❌ Any mention of "agency services"
- ❌ Links to `shalconnects.com` main site (if it has services)

### 2. **Required Pages** ✅

All must be accessible via navigation (footer is fine):

- [ ] **Terms & Conditions** - `/terms`
  - Must include company/legal name: "Shalauddin Kader" or "ShalConnects"
- [ ] **Privacy Policy** - `/privacy`
- [ ] **Refund Policy** - `/refund`
- [ ] **Product Page** - `/store/variation-images-pro` (or main product)
  - Clear pricing
  - Product features
  - What customers receive

### 3. **Website Status** ✅

- [ ] Site is **live and publicly accessible**
- [ ] SSL certificate active (HTTPS)
- [ ] All pages load correctly
- [ ] No broken links
- [ ] Mobile responsive

### 4. **Product Information** ✅

- [ ] Clear product description
- [ ] Pricing displayed clearly
- [ ] Features/deliverables listed
- [ ] Screenshots or product images
- [ ] Purchase/download process clear

---

## 🚀 Setup Steps

### Step 1: Deploy Store Subdomain to Vercel

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Domains**
   - Click **"Add Domain"**
   - Enter: `store.shalconnects.com`
   - Click **"Add"**

2. **Vercel will show DNS configuration:**
   - Usually: **CNAME** record
   - Name: `store`
   - Value: `cname.vercel-dns.com` (or similar)

3. **Update DNS in your domain registrar:**
   - Go to your DNS management (where you manage shalconnects.com)
   - Add the CNAME record as shown by Vercel
   - Wait for DNS propagation (usually 1-2 hours, max 48 hours)

4. **Verify:**
   - Visit `https://store.shalconnects.com`
   - Should show your store homepage
   - SSL certificate should auto-provision

### Step 2: Verify Store Content

**Test these URLs:**
- `https://store.shalconnects.com` - Store homepage
- `https://store.shalconnects.com/store/variation-images-pro` - Product page
- `https://store.shalconnects.com/terms` - Terms & Conditions
- `https://store.shalconnects.com/privacy` - Privacy Policy
- `https://store.shalconnects.com/refund` - Refund Policy

**Check for service mentions:**
- Search the entire site for: "service", "development", "design", "consulting", "agency"
- Remove any service-related content
- Ensure navigation doesn't link to services

### Step 3: Update Legal Pages (if needed)

**Terms & Conditions must include:**
- Company name or legal name: "Shalauddin Kader" (sole proprietor) or "ShalConnects"
- Clear terms for software product sales
- No service-related terms

**Privacy Policy:**
- Standard privacy policy for software sales
- Data collection and usage policies

**Refund Policy:**
- 30-day refund policy (as mentioned)
- Clear refund process for software products

### Step 4: Prepare Submission Email

Use the template in `PADDLE_STORE_SUBDOMAIN_SUBMISSION.md` (created below)

---

## 📧 Submission Process

1. **Go to Paddle Dashboard:**
   - Navigate to domain approval section
   - Or reply to Ana's email

2. **Submit new domain:**
   - Domain: `store.shalconnects.com`
   - Use the submission email template

3. **Wait for review:**
   - Usually 1-3 business days
   - Paddle will review the entire subdomain

---

## ⚠️ Common Mistakes to Avoid

1. **Don't link to main site** - If `shalconnects.com` has services, don't link to it from store
2. **Don't mention services** - Even in "About" or "Company" sections
3. **Don't use service language** - Avoid words like "we build", "we design", "custom development"
4. **Don't mix products and services** - Keep them completely separate

---

## ✅ Success Criteria

Your submission will be approved if:
- ✅ Store subdomain shows ONLY software products
- ✅ No services mentioned anywhere
- ✅ All required pages accessible
- ✅ Legal pages include company name
- ✅ Product information is clear
- ✅ Site is live and functional

---

## 🔄 If Still Rejected

If Paddle still rejects (unlikely if you follow this guide):

1. **Ask for specific feedback:**
   - What exactly violates the policy?
   - Which pages have issues?
   - What needs to be changed?

2. **Consider:**
   - Creating a completely separate domain (e.g., `shalplugins.com`)
   - Further separating product and service brands

---

## 📝 Notes

- The store subdomain can still use the same codebase
- Just ensure no service content is visible on store routes
- You can conditionally hide service links based on subdomain
- Footer is fine as-is (no service links)

---

**Ready to submit?** Use the email template in the next file!

