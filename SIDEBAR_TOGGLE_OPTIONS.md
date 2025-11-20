# Sidebar Toggle Options

## Overview
Add ability to hide/show the TOC and Quick Actions sections in the sidebar.

---

## Option 1: Individual Toggle Buttons (Header Icons) ⭐ RECOMMENDED
**Best for:** Granular control, clean UI

### Features:
- Small toggle icon button in each section header
- Click to collapse/expand that section
- Smooth animation
- Remembers state per section

### Layout:
```
┌─────────────────────────┐
│ Table of Contents  [−] │ ← Toggle button
├─────────────────────────┤
│ • Overview             │
│ • Features             │
│ • ...                  │
└─────────────────────────┘

┌─────────────────────────┐
│ Quick Actions      [−]  │ ← Toggle button
├─────────────────────────┤
│ [Download]              │
│ [Contact]               │
└─────────────────────────┘
```

### Pros:
✅ Individual control per section
✅ Clean, minimal UI
✅ Standard accordion pattern
✅ Easy to understand

### Cons:
❌ Requires two separate toggles

---

## Option 2: Single Master Toggle
**Best for:** Quick hide/show entire sidebar

### Features:
- One toggle button at top of sidebar
- Hides/shows entire sidebar
- Can be a floating button or header button

### Layout:
```
┌─────────────────────────┐
│ [☰] Sidebar            │ ← Master toggle
├─────────────────────────┤
│ (all content)           │
└─────────────────────────┘
```

### Pros:
✅ Simple single control
✅ Quick to hide everything
✅ Less UI clutter

### Cons:
❌ Can't hide sections individually
❌ Less flexible

---

## Option 3: Accordion Headers (Clickable Headers)
**Best for:** Intuitive, no extra buttons

### Features:
- Click section header to toggle
- Header acts as button
- Visual indicator (chevron icon)

### Layout:
```
┌─────────────────────────┐
│ ▼ Table of Contents     │ ← Clickable header
├─────────────────────────┤
│ • Overview             │
│ • Features             │
└─────────────────────────┘

┌─────────────────────────┐
│ ▶ Quick Actions         │ ← Collapsed (chevron right)
└─────────────────────────┘
```

### Pros:
✅ No extra buttons needed
✅ Intuitive interaction
✅ Clean design

### Cons:
❌ Less obvious it's clickable
❌ Might conflict with other header actions

---

## Option 4: Settings Menu (Gear Icon)
**Best for:** Advanced users, multiple options

### Features:
- Settings/gear icon at top
- Dropdown menu with checkboxes:
  - ☑ Show Table of Contents
  - ☑ Show Quick Actions
- Persists to localStorage

### Layout:
```
┌─────────────────────────┐
│ [⚙] Settings            │
├─────────────────────────┤
│ ☑ Table of Contents     │
│ ☑ Quick Actions         │
└─────────────────────────┘
```

### Pros:
✅ Professional settings approach
✅ Can persist preferences
✅ Room for future options

### Cons:
❌ More clicks to toggle
❌ Less immediate

---

## Option 5: Collapsible with Icons (Hybrid)
**Best for:** Best UX, clear indicators

### Features:
- Clickable headers with chevron icons
- Small toggle icons in header
- Smooth animations
- Visual feedback

### Layout:
```
┌─────────────────────────┐
│ Table of Contents  [−]  │ ← Header + toggle icon
│                         │
│ ▼ Overview              │
│   Features              │
│   ...                   │
└─────────────────────────┘
```

### Pros:
✅ Clear visual indicators
✅ Multiple ways to toggle
✅ Professional appearance

### Cons:
❌ Slightly more complex
❌ More UI elements

---

## Recommendation

### **Option 1: Individual Toggle Buttons** ⭐
- Best balance of functionality and simplicity
- Users can control each section independently
- Standard UI pattern users recognize
- Clean and minimal

### Alternative: **Option 3: Accordion Headers**
- If you want even cleaner UI
- Click header to toggle (no extra buttons)

---

## Implementation Details

### Toggle States:
- **TOC**: Default visible, can be hidden
- **Quick Actions**: Default visible, can be hidden
- **State Management**: useState (or localStorage for persistence)

### Visual Indicators:
- **Expanded**: `−` (minus) or `▼` (down chevron)
- **Collapsed**: `+` (plus) or `▶` (right chevron)
- **Animation**: Smooth height transition

### Persistence Options:
1. **Session only** (resets on page reload)
2. **localStorage** (remembers across sessions)
3. **URL params** (shareable state)

---

## Next Steps

1. **Choose your preferred option** (1-5)
2. **I'll implement:**
   - Toggle functionality
   - Smooth animations
   - State management
   - Visual indicators
   - Optional persistence

Let me know which option you prefer!

