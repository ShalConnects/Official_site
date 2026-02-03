# Scroll effects review (Work History / About page)

## Components reviewed
- **ScrollBrightness** – opacity based on distance from viewport center (timeline items).
- **ScrollColorText** – word color based on position above/below threshold (“Work History” heading).

---

## Potential issues

### 1. **Resize not handled**
When the user resizes the window, viewport center and element positions change but opacity/color are only updated on scroll. Result: effect can look wrong until the next scroll.

**Fix:** Add a `resize` listener that runs the same `update()` (e.g. debounced or on `requestAnimationFrame`).

### 2. **Accessibility – reduced motion**
Users with `prefers-reduced-motion: reduce` may find scroll-driven opacity/color changes distracting or uncomfortable.

**Fix:** In both components, detect `window.matchMedia('(prefers-reduced-motion: reduce)')` and, when true, skip the effect (e.g. keep full opacity / bright color only).

### 3. **ScrollBrightness – hardcoded transition**
Transition is fixed at `1s`. Fine for current use, but makes the component less reusable and the intent less obvious.

**Fix:** Add an optional `transitionDuration` prop (default `'1s'`) and use it in the inline style.

### 4. **Scroll listeners count on About page**
About page uses 1 ScrollColorText + 6 ScrollBrightness = 7 scroll listeners. Each uses RAF and a single `getBoundingClientRect()` per frame, so cost is low. Optional future improvement: one shared scroll handler that updates all ScrollBrightness instances (e.g. via context or a ref callback registry). Not required for current scale.

---

## Possible improvements

- **ScrollColorText transition:** Currently `duration-200` (0.2s). For consistency with the 1s brightness transition, consider `duration-500` or a configurable prop.
- **ScrollBrightness peakZone:** Default 0.35 means “full brightness” within ~35% of viewport height from center. Can expose or document for tuning per section.
- **TypeScript:** ScrollColorText `as` prop is `keyof JSX.IntrinsicElements`; ref is passed via `createElement`. Already type-safe.

---

## Summary

| Item                         | Severity   | Action                    |
|-----------------------------|------------|---------------------------|
| Resize not handled          | Medium     | Add resize listener       |
| Reduced motion              | Accessibility | Respect prefers-reduced-motion |
| Hardcoded 1s transition     | Low        | Optional prop              |
| Multiple scroll listeners   | Low        | Acceptable; optional refactor later |

**Implemented:** Resize listener and prefers-reduced-motion in both components; `transitionDuration` prop (default `'1s'`) on ScrollBrightness.
