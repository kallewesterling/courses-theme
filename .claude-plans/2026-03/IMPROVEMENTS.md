# Codebase Improvement Plan — March 2026

## Current State Summary

As of March 2026, the theme is in good shape. The foundations laid in January 2026 are solid:
- CSS variable system is complete (colors, typography, spacing, transitions)
- PostCSS build pipeline is running (bundled + minified output in `dist/`)
- Accessibility work is done (focus states, color contrast, motion preferences)
- The worst nesting offender in `lessons.css` (13-level resource box) was flattened to 3 levels

What follows are concrete improvements to tackle next, ordered by impact vs. effort.

---

## Priority 1 — Quick Wins

### 1.1 Resolve open TODOs

There are a handful of unresolved TODO comments that represent real decisions to make:

| File | Location | TODO |
|------|----------|------|
| [meta.mjs:14](../production/skilljar-theme-v3.0/meta.mjs#L14) | `sanitizeUrl` | Should return link if not a Chainguard URL |
| [router.mjs:28](../production/skilljar-theme-v3.0/router.mjs#L28) | `pageHandlers` | Verify if `CG.page.isLanding` is still needed |
| [course-info.css:122](../production/css/course-info.css#L122) | Font weight | Marked as "seems unnecessary" — remove if confirmed |
| [course-info.css:228](../production/css/course-info.css#L228) | Selector block | Marked as possibly legacy |
| [freezebox.css:8,15,27](../production/css/freezebox.css) | Multiple blocks | Three sections marked as "Legacy?" |

**Action**: Audit each TODO, remove what's confirmed dead, document what must stay.

---

### 1.2 Delete or graduate freezebox.css

[freezebox.css](../production/css/freezebox.css) is 123 lines of explicitly frozen legacy styles. The file comment says these are "legacy styles that we want to freeze and not update, but potentially remove." Three sections inside are marked `/* TODO: Legacy? */`.

**Action**:
1. Test the site with `freezebox.css` excluded from the build.
2. If nothing breaks → delete the file and remove its `@import` from `style.css`.
3. If something breaks → move the surviving rules into the appropriate page-scoped CSS file and document why they're needed.

Either outcome is better than keeping a file explicitly named for future deletion.

---

### 1.3 Continue nesting refactor in catalog.css and course-info.css

The nesting plan from January identified Phase 2 targets that were never executed:

- **catalog.css**: course card sections at 8 nesting levels → target 4
- **course-info.css**: curriculum sections at 7 nesting levels → target 4
- **freezebox.css**: 8 levels → irrelevant if the file is deleted (see 1.2)

The pattern is established from the `lessons.css` resource box work. Apply the same flatten-and-scope approach:
```css
/* Before: 8 levels */
body.sj-page-catalog .catalog-center-width .catalog-content .coursebox-list .coursebox-container .coursebox-content .coursebox-title a { }

/* After: 3 levels */
body.sj-page-catalog .coursebox-container .coursebox-title a { }
```

---

## Priority 2 — Medium Effort

### 2.1 Split static.mjs (840 lines, ~56KB)

[static.mjs](../production/skilljar-theme-v3.0/static.mjs) is the largest JS file in the project and contains heterogeneous content: the logo SVG, footer data, partner routes, confetti configuration, and icon definitions. This makes it hard to navigate and means any small change requires loading the whole file.

**Proposed split**:
```
static.mjs (thin re-export file)
├── data/footer.mjs       ← footerData
├── data/partners.mjs     ← partnerRoutes, partner config
├── data/icons.mjs        ← icon SVGs (if not already in icons.mjs)
└── data/confetti.mjs     ← confetti settings
```

Check whether `icons.mjs` already overlaps before splitting. The logo SVG could live in its own `assets/logo.mjs` or inline in `CG.mjs` where it's consumed.

---

### 2.2 Remove dead CSS identified in January audit

The January `UNUSED_CSS_EVALUATION.md` identified ~106 lines of unused styles in `catalog.css`. These should be removed:

**Action**:
1. Re-run the Chrome DevTools Coverage audit on each page type.
2. Cross-reference with the January list to confirm the rules are still unused.
3. Remove confirmed dead selectors; add a comment for anything left intentionally.

---

### 2.3 Consolidate duplicated media query blocks

`lessons.css` and `catalog.css` both have multiple `@media` blocks at the same breakpoints scattered through the file. Each breakpoint should appear once per file.

**Before** (scattered):
```css
/* line 120 */
@media (max-width: 768px) { .nav { display: none; } }

/* line 450 */
@media (max-width: 768px) { .card { flex-direction: column; } }

/* line 820 */
@media (max-width: 768px) { .header { padding: 0.5rem; } }
```

**After** (consolidated in a single section at the end):
```css
/* ========================================
   8. RESPONSIVE OVERRIDES
   ======================================== */
@media (max-width: 768px) {
  .nav { display: none; }
  .card { flex-direction: column; }
  .header { padding: 0.5rem; }
}
```

This is already the convention in `lessons.css` — apply it consistently.

---

### 2.4 Replace magic number padding in card-body

[lessons.css](../production/css/lessons.css) has one lingering magic number:
```css
.resource-card .card-body {
  padding: 1.25rem; /* ← hardcoded, not a variable */
}
```

A `--spacing-5` (= `1.25rem`) variable likely already exists. Swap it in.

---

## Priority 3 — Architectural

### 3.1 CSS Cascade Layers

The January CSS Improvement Plan proposed `@layer` to replace specificity-based overrides. This is the highest-leverage architectural change remaining.

**Proposed layer order**:
```css
@layer reset, base, components, skilljar-overrides;
```

- `reset` — normalize only
- `base` — typography, global variables
- `components` — our custom elements (footer, mobile header, breadcrumbs)
- `skilljar-overrides` — all Skilljar platform overrides (currently using `!important`)

Within `skilljar-overrides`, `!important` can potentially be removed from many declarations because layer ordering gives our rules priority over Skilljar's unlayered styles. This needs testing per rule — don't batch-remove `!important` without verifying each one.

**Why defer to Priority 3**: This requires thorough regression testing on all page types and is risky to do in one pass. Worth doing in a dedicated session with staging access.

---

### 3.2 Verify and clean up `CG.page.isLanding`

The router TODO at [router.mjs:28](../production/skilljar-theme-v3.0/router.mjs#L28) questions whether `CG.page.isLanding` is still needed. This requires:

1. Checking `CG.mjs` to see how `isLanding` is set.
2. Looking at whether any Skilljar pages still use the landing page template.
3. If unused: remove the check from the router and the property from `CG.page`.
4. If used: remove the TODO comment and add a brief note explaining what "landing" pages are.

---

### 3.3 JS module: separate concerns in CG.mjs

`CG.mjs` (~13KB) mixes environment detection, page type detection, DOM querying, breadcrumb generation, and element construction. These are distinct concerns.

**Candidate splits**:
- `CG.env` → `env.mjs` (environment/domain detection)
- `CG.page` → `page.mjs` (page type detection from `body` classes)
- `CG.el` (element constructors: logo, mobileHeader, toChainguard) → could move to `elements.mjs`
- `CG.dom` (DOM references) → stays in `CG.mjs` as the primary state object, consuming the above

This is a refactor with no user-visible change — do it only if `CG.mjs` becomes hard to maintain or causes merge conflicts.

---

## Not Worth Doing (Yet)

- **Dark mode / theming**: No product requirement visible. The variable system supports it, but without a design spec it would just be speculative work.
- **Container queries**: The Skilljar HTML structure doesn't have containers we control, so container queries would need to target Skilljar's own wrappers — risky and high-maintenance.
- **Logical properties (RTL support)**: No indication of RTL language requirement. Would be a significant change for no current user benefit.
- **Living style guide / Storybook**: High setup cost. Only worth it if the team grows or handoff becomes a problem.
- **Automated visual regression tests**: Good idea long-term, but needs a staging URL and CI setup that isn't in place.

---

## Suggested Order of Work

1. **Resolve TODOs + delete/graduate freezebox.css** — one focused session, low risk
2. **Nesting refactor Phase 2 (catalog.css, course-info.css)** — proven pattern, medium risk
3. **Remove dead CSS** — needs Coverage audit, then straightforward deletes
4. **Split static.mjs** — isolated JS refactor, no CSS risk
5. **Consolidate media queries** — within-file reordering, easy to verify
6. **CSS cascade layers** — save for a dedicated session with staging access
