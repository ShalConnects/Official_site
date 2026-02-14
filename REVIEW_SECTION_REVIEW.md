# Review Section – Audit (Landing + Reviews Page)

## What’s working well
- **Single source of truth**: `reviewImages.ts` for IDs, paths, `getAllReviewImages`, `getRandomReviewImages`.
- **Accessibility**: `aria-label` on regions, `aria-label` on buttons (Close, Previous, Next), keyboard (Escape, arrows).
- **Reduced motion**: `prefers-reduced-motion: reduce` disables marquee and fade animations.
- **Scroll parity**: Reviews page duration scales with column size so scroll feel matches landing.
- **Error handling**: `onError` hides broken images so one missing file doesn’t break layout.
- **Lazy loading**: `loading="lazy"` on images.

---

## Potential issues

### 1. **Lightbox closes when clicking the image** (fixed below)
- Overlay uses `onClick={() => setHoveredImage(null)}` / `setClickedImage(null)`.
- Clicking the **image** bubbles to the overlay and closes the lightbox.
- **Fix**: Add `onClick={(e) => e.stopPropagation()}` on the image container div so only backdrop click closes.

### 2. **Focus not trapped in lightbox**
- When the full-screen overlay is open, Tab can move focus to links/buttons behind it.
- **Improvement**: Focus the close button when opening; trap focus inside the modal (e.g. focusable elements only); restore focus to the trigger on close. Optional but improves a11y.

### 3. **Duplicate marquee UI and styles**
- `ReviewsMarquee` (landing) and `ReviewsPage` (desktop marquee + mobile grid + overlay) share almost the same: 3-column layout, gradients, keyframes, overlay behavior.
- **Improvement**: Reuse one marquee component and pass `images` + optional `scrollDurationSec` (or derive from `images.length`). Would remove a lot of duplication and keep behavior in sync.

---

## Possible improvements

### 4. **Image display in grid**
- Thumbnails use `object-cover`, so tall or wide screenshots can be cropped.
- **Option**: Use `object-contain` for review thumbnails so the full screenshot is visible (may add letterboxing). Prefer if readability matters more than strict grid look.

### 5. **Landing empty state**
- `reviewImages.length > 0` is effectively always true when `getRandomReviewImages(30)` is used.
- Keeping the fallback is harmless; no change required.

### 6. **Shared constants**
- Marquee duration `40s` and “10 items per column” are in two places (ReviewsMarquee and ReviewsPage formula).
- **Improvement**: Export e.g. `LANDING_MARQUEE_DURATION_SEC = 40` and `LANDING_IMAGES_PER_COLUMN = 10` from `reviewImages.ts` or a small constants file so both landing and reviews page use the same numbers.

### 7. **Gradient and keyframe duplication**
- Same gradient inline style and same `scrollDown` / `scrollUp` / `fadeInScale` keyframes in both components.
- **Improvement**: Move to a shared CSS module or global style so one change updates both; reduces bundle and keeps visuals consistent.

---

## Summary
- **Fixed**: Lightbox no longer closes when clicking the image (stopPropagation on image container in both components).
- **Recommended next**: (A) Extract shared marquee + lightbox into one component used by both pages; (B) Add focus trap and focus restore for the lightbox; (C) Optionally switch thumbnails to `object-contain` and/or centralize duration constants and styles.
