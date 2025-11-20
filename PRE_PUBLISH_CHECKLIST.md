# Pre-Publish Checklist - Minimal Requirements

## ✅ CRITICAL (Must Fix Before Publishing)

### 1. **Contact Information** ✅ DONE
- [x] **Phone Number**: Updated to `+880 1879-729252` (Bangladesh) with WhatsApp links
  - Location: `src/App.tsx` line 1921-1922 - **COMPLETED**
  - Location: `src/pages/ServicePage.tsx` lines 124, 564 - **COMPLETED**
  - All phone links now redirect to WhatsApp: `https://wa.me/8801879729252`
- [ ] **Email**: Verify `hello@shalconnects.com` is correct and monitored
  - Location: `src/App.tsx` line 1639

### 2. **Contact Form** ⚠️
- [ ] Currently shows alert only - doesn't actually send emails
  - Location: `src/App.tsx` line 773-785
  - **Options:**
    - **Quick Fix**: Keep alert for now (acceptable for MVP)
    - **Better**: Integrate with email service (Formspree, EmailJS, or backend API)
    - **Best**: Set up proper backend endpoint

### 3. **Social Media Links** ⚠️
- [ ] Update footer placeholder links (`#`) to real URLs or remove
  - Location: `src/App.tsx` line 1761-1764
  - Links: Privacy, Terms, LinkedIn, Twitter

### 4. **SEO Meta Tags** ✅ DONE
- [x] Add meta description, Open Graph tags, and Twitter cards
  - Location: `index.html` - **COMPLETED**
  - **Required for SEO and social sharing**

### 5. **Build & Test** ✅
- [ ] Run `npm run build` to ensure production build works
- [ ] Test the built site with `npm run preview`
- [ ] Verify all images load correctly
- [ ] Test on mobile devices

### 6. **Assets Verification** ✅
- [x] Favicon exists: `Favicon.png` (verify it's in `public/` folder)
- [x] Logo exists: `logo.png` (verify it's accessible)

---

## 📋 RECOMMENDED (Can Do After Launch)

### 7. **Analytics**
- [ ] Add Google Analytics or similar tracking
- [ ] Set up conversion tracking for "Book a Call" buttons

### 8. **Performance**
- [ ] Optimize images (compress if needed)
- [ ] Test Lighthouse score
- [ ] Consider lazy loading for images

### 9. **Legal Pages**
- [ ] Create Privacy Policy page (link in footer)
- [ ] Create Terms of Service page (link in footer)

### 10. **Error Handling**
- [ ] Add 404 page for React Router
- [ ] Handle broken service page links gracefully

---

## 🚀 QUICK FIXES NEEDED

### Priority 1 (5 minutes):
1. ✅ Update phone number in `src/App.tsx` - **DONE** (Now WhatsApp: +880 1879-729252)
2. ✅ Add basic meta tags to `index.html` - **DONE**
3. Fix/remove social links in footer

### Priority 2 (15 minutes):
4. Set up contact form backend (Formspree is easiest - free tier available)
5. ✅ Update phone numbers in `ServicePage.tsx` - **DONE**

### Priority 3 (After launch):
6. Analytics setup
7. Legal pages
8. Performance optimization

---

## 📝 DEPLOYMENT STEPS

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Test the build:**
   ```bash
   npm run preview
   ```

3. **Deploy to hosting:**
   - **Vercel** (Recommended - easiest): Connect GitHub repo, auto-deploys
   - **Netlify**: Drag & drop `dist` folder or connect repo
   - **GitHub Pages**: Requires additional config
   - **Other**: Upload `dist` folder contents to web server

4. **Post-deployment:**
   - Test all links
   - Verify contact form works
   - Check mobile responsiveness
   - Test "Book a Call" Calendly links

---

## ⚡ FASTEST PATH TO PUBLISH (30 minutes)

1. ✅ Update phone number (2 min) - **DONE** (WhatsApp: +880 1879-729252)
2. ✅ Add meta tags (5 min) - **DONE**
3. ⚠️ Fix footer links (3 min) - **TODO**
4. ✅ Build and test (5 min)
5. ✅ Deploy to Vercel (15 min)

**Total: ~30 minutes to go live!**

