# Theme Migration Guide

## Overview
This guide explains how to migrate existing components from hardcoded dark mode to support both light and dark themes.

## Implementation Summary

✅ **Completed:**
- Created `tailwind.config.js` with theme configuration
- Added CSS variables for light/dark themes in `index.css`
- Created `ThemeContext` for theme state management
- Created reusable `ThemeToggle` component
- Integrated theme toggle in `Header` component (for non-landing pages)
- Integrated theme toggle in `LandingPage` mobile menu
- Wrapped app with `ThemeProvider` in `App.tsx`

## How It Works

### 1. Theme System Architecture (DRY Pattern)
```
ThemeContext (Single Source of Truth)
    ↓
ThemeProvider (Wraps entire app)
    ↓
useTheme() hook (Used by any component)
    ↓
ThemeToggle (Reusable UI component)
```

### 2. CSS Variables (Separation of Concerns)
- Light and dark theme colors are defined in `index.css`
- Applied via `class="dark"` or `class="light"` on `<html>` element
- Components reference CSS variables, not hardcoded values

### 3. Component Updates Required (OPTIMIZED - DRY Pattern)

**Current (Hardcoded Dark):**
```tsx
<div className="bg-gray-900 text-white">
```

**New (Theme-Aware - ONE class, works everywhere):**
```tsx
<div className="bg-theme-bg-primary text-theme-text-primary">
```

**Why This is Better (DRY):**
- ✅ Single class name (not two with `dark:` prefix)
- ✅ Automatically adapts to theme
- ✅ Centralized in CSS variables
- ✅ No repetition across components

## Migration Steps for Components (AUTOMATED)

### Option 1: Automated Script (Fastest)
```bash
# Migrate a single file
node scripts/migrateTheme.js src/pages/LandingPage.tsx

# Migrate multiple files
node scripts/migrateTheme.js src/components/Header.tsx
node scripts/migrateTheme.js src/pages/ServicePage.tsx
```

### Option 2: Manual (Search & Replace)

Replace these classes across your codebase:

**Background Colors:**
- `bg-gray-900` → `bg-theme-bg-primary`
- `bg-gray-800` → `bg-theme-bg-secondary`
- `bg-gray-700` → `bg-theme-bg-tertiary`
- `bg-gray-900/95` → `bg-theme-bg-primary/95`
- `bg-gray-800/50` → `bg-theme-bg-secondary/50`

**Text Colors:**
- `text-white` → `text-theme-text-primary`
- `text-gray-400` → `text-theme-text-tertiary`
- `text-gray-300` → `text-theme-text-secondary`

**Border Colors:**
- `border-gray-800` → `border-theme-border-primary`
- `border-gray-700` → `border-theme-border-primary`
- `border-gray-700/50` → `border-theme-border-primary/50`

**Hover States:**
- `hover:bg-gray-800/50` → `hover:bg-theme-hover/50`
- `hover:text-white` → `hover:text-theme-text-primary`

### Class Mapping Reference
All mappings are defined in `src/utils/themeClasses.ts`

## Files That Need Updates

**Priority 1 (Main Pages):**
- [ ] `src/pages/LandingPage.tsx` - Main landing page (3277 lines)
- [ ] `src/pages/ServicePage.tsx` - Service details pages
- [ ] `src/pages/WorkPage.tsx` - Portfolio work page
- [ ] `src/pages/AboutPage.tsx` - About page

**Priority 2 (Components):**
- [ ] `src/components/WorkGrid.tsx` - Work portfolio grid
- [ ] `src/components/WorkSlider.tsx` - Work portfolio slider
- [ ] `src/components/Footer.tsx` - Site footer
- [ ] `src/components/ContactForm.tsx` - Contact form
- [ ] `src/components/TestimonialSlider.tsx` - Testimonial slider

**Priority 3 (Other Pages):**
- [ ] All other pages and components (40+ files)

## Estimated Migration Effort

- **Per Component:** ~5-15 minutes
- **Total Files:** ~43 components/pages
- **Total Time:** ~4-8 hours for complete migration

## Testing Checklist

After migration, test:
- [ ] Theme persists after page refresh
- [ ] Theme toggle works on all pages
- [ ] Colors look good in both themes
- [ ] Hover states work in both themes
- [ ] All text is readable in both themes
- [ ] Images/logos adapt to theme (if needed)
- [ ] Animations work in both themes

## Performance Notes

✅ **Optimized for Performance:**
- Theme state managed at root level (no prop drilling)
- CSS variables (no JavaScript re-renders for colors)
- Theme preference cached in localStorage
- Tailwind's built-in dark mode (no runtime overhead)

## Brand Colors (Unchanged)

Brand colors remain the same in both themes:
- Green: `#176641`
- Orange: `#da651e`
- Gradients continue to use these colors

## Next Steps

1. **Test current implementation** - Verify theme toggle works
2. **Migrate high-traffic pages first** - LandingPage, ServicePage
3. **Test each page** - Ensure readability and aesthetics
4. **Iterate on design** - Adjust light theme colors if needed
5. **Migrate remaining components** - Lower priority pages

## Questions?

The implementation follows:
- ✅ DRY (Don't Repeat Yourself) - Single ThemeContext, reusable ThemeToggle
- ✅ Separation of Concerns - Context for state, CSS for styling, Component for UI
- ✅ Minimal Code - Only ~150 lines of new code for full theme system
- ✅ Optimized - No unnecessary re-renders, cached in localStorage
