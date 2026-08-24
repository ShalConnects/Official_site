# Standard prompt: Add or update a tool

Use this when adding or changing any free tool (e.g. AI Formatter, Lorem Ipsum, QR Code Generator) so everything stays consistent and nothing is missed.

---

## Copy this block when requesting a new tool

```
Add a new free tool with the following. Follow DRY, separation of concerns, and minimal code. Match existing tool pages: PageLayout, usePageTitle, useMetaTags, content width aligned with breadcrumb/footer, responsive.

**Tool**
- Slug: [e.g. my-tool]
- Name: [display name, e.g. My Tool]
- Description: [1–2 sentences for cards and meta]
- Route: /tools/[slug] (e.g. /tools/my-tool)

**Single source of truth**
- src/data/toolsData.ts — add one entry: id, name, description, icon (lucide-react), route, color (hex), isNew (optional), Load: lazy(() => import('../pages/[MyTool]'))
- src/pages/ — create [MyTool].tsx with PageLayout, usePageTitle, useMetaTags

ToolsPage, LandingPage, Breadcrumbs, and App routing derive from toolsData automatically. No changes needed there.

**Page behavior**
- Use PageLayout, usePageTitle, useMetaTags. Content width aligned with breadcrumb/footer; responsive.
- No duplicate logic; reuse shared components where possible. No console.logs or exposed API keys.
```

---

## Copy this block when updating an existing tool

```
Update the [Tool Name] tool with the following. Keep existing structure (PageLayout, usePageTitle, useMetaTags). Match content width to breadcrumb/footer; keep it responsive.

**Changes**
- [List specific changes: e.g. add option X, fix bug Y, change copy Z]

**Files**
- Primary: src/pages/[ToolComponent].tsx
- If name/route/description/icon/color changes: src/data/toolsData.ts

Do not duplicate logic; no console.logs; no new public API surface or exposed keys.
```

---

## Checklist (before requesting a new tool)

- [ ] Slug is kebab-case (e.g. `my-tool`)
- [ ] Route is `/tools/[slug]` (e.g. `/tools/my-tool`)
- [ ] Display name and 1–2 sentence description ready
- [ ] Icon chosen from `lucide-react`
- [ ] Hex color chosen for card accent (e.g. `#6366f1`)

---

## What gets updated (reference)

| Location | Purpose |
|----------|---------|
| `src/data/toolsData.ts` | **Single source:** Add entry (id, name, description, icon, route, color, isNew, Load). ToolsPage, LandingPage, Breadcrumbs, App all derive from here. |
| `src/pages/[ToolName].tsx` | New page: PageLayout, usePageTitle, useMetaTags, main UI |

---

## Conventions for tool pages

- **Layout:** `PageLayout` with title; main content in a container that matches site content width (e.g. same max-width as breadcrumb/footer).
- **Meta:** `usePageTitle(title)` and `useMetaTags({ title, description, keywords, og*, twitter* })`.
- **Icons:** Use `lucide-react`; same icon as in toolsData for consistency.
- **No** console.logs, no exposed API keys, no new public API surface unless required.
