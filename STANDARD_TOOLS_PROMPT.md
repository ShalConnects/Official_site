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
- Route: /tools/[slug]

**Place everywhere needed**
- src/App.tsx — add <Route path="/tools/[slug]" element={<MyTool />} /> and import
- src/pages/ — create [MyTool].tsx (or [ToolName].tsx) with PageLayout, usePageTitle, useMetaTags
- src/pages/ToolsPage.tsx — add to tools array: id, name, description, icon (lucide-react), route, color (hex), isNew (optional)
- src/pages/LandingPage.tsx — add same tool entry to the tools list used in "Our Free Tools" (id, name, description, icon, route, color)
- src/components/Breadcrumbs.tsx — if the auto-generated label from slug is wrong, add: else if (path === '[slug]') { label = '[Display Name]'; }

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
- If name/route/description changes: src/pages/ToolsPage.tsx, src/pages/LandingPage.tsx, src/components/Breadcrumbs.tsx

Do not duplicate logic; no console.logs; no new public API surface or exposed keys.
```

---

## Checklist (before requesting a new tool)

- [ ] Slug is kebab-case (e.g. `my-tool`)
- [ ] Route is `/tools/[slug]`
- [ ] Display name and 1–2 sentence description ready
- [ ] Icon chosen from `lucide-react` (used on Tools and Landing)
- [ ] Hex color chosen for card accent (e.g. `#6366f1`)

---

## What gets updated (reference)

| Location | Purpose |
|----------|---------|
| `src/App.tsx` | Route and component import for `/tools/[slug]` |
| `src/pages/[ToolName].tsx` | New page: PageLayout, usePageTitle, useMetaTags, main UI |
| `src/pages/ToolsPage.tsx` | Add to `tools` array: id, name, description, icon, route, color, isNew |
| `src/pages/LandingPage.tsx` | Add same entry to tools list for "Our Free Tools" section |
| `src/components/Breadcrumbs.tsx` | Add path → label override only if auto label is wrong (e.g. slug `qr-code-generator` → "QR Code Generator") |

---

## Conventions for tool pages

- **Layout:** `PageLayout` with title; main content in a container that matches site content width (e.g. same max-width as breadcrumb/footer).
- **Meta:** `usePageTitle(title)` and `useMetaTags({ title, description, keywords, og*, twitter* })`.
- **Icons:** Use `lucide-react`; same icon as in ToolsPage/LandingPage for consistency.
- **No** console.logs, no exposed API keys, no new public API surface unless required.
