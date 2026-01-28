# Critical CSS Evaluation

## Date: 2026-01-27

## Overview

Evaluation of critical CSS optimization for the courses theme, considering the critical constraint that **Skilljar controls HTML rendering** including the `<head>` section.

---

## Executive Summary

**Critical CSS** is the technique of inlining above-the-fold CSS directly in the HTML `<head>` to eliminate render-blocking and improve First Contentful Paint (FCP).

**Key Finding**: **Cannot implement traditional critical CSS** due to Skilljar platform limitation (no HTML `<head>` control).

**Alternative Recommendation**: Implement CSS bundling + loading optimization instead (see Task 4.4).

---

## What is Critical CSS?

### Traditional Approach

1. **Identify** above-the-fold CSS (styles needed for initial viewport)
2. **Extract** critical styles into separate inline block
3. **Inline** critical CSS in `<head>`:
   ```html
   <head>
     <style>
       /* Critical CSS inline here (5-15KB) */
       .header { ... }
       .hero { ... }
     </style>

     <!-- Load remaining CSS async -->
     <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
   </head>
   ```
4. **Defer** non-critical CSS loading
5. **Result**: Faster initial paint, no render-blocking CSS

---

## Benefits of Critical CSS

### Performance Gains

- ✅ **Faster FCP** (First Contentful Paint) - Eliminates CSS render-blocking
- ✅ **Better Lighthouse scores** - Improves "Eliminate render-blocking resources"
- ✅ **Improved perceived performance** - User sees content faster
- ✅ **Reduced Time to Interactive** - Page becomes interactive sooner

### Typical Impact

- **FCP improvement**: 200-800ms reduction
- **Lighthouse score**: +5 to +15 points
- **Critical CSS size**: Usually 5-15KB (subset of total CSS)

---

## Skilljar Platform Constraint

### The Problem

**From CSS_IMPROVEMENT_PLAN.md**:
> "We do **not** control the HTML that Skilljar renders. We can only override CSS styles that target Skilljar's existing selectors and structure."

**What this means**:
- ❌ Cannot access HTML `<head>` section
- ❌ Cannot add inline `<style>` tags
- ❌ Cannot modify `<link>` tag attributes
- ❌ Cannot use JavaScript to load CSS asynchronously (if Skilljar doesn't allow custom JS)

**What we CAN do**:
- ✅ Provide CSS file via Skilljar theme settings
- ✅ Control CSS content
- ❌ Control HOW CSS is loaded (Skilljar decides)

---

## Skilljar CSS Loading Investigation

### Current Setup

Based on project structure:
- **Entry point**: `production/style.css` (4KB file with @import statements)
- **Loading method**: CSS `@import` for 16 files
- **Skilljar likely**:
  ```html
  <link rel="stylesheet" href="https://westerling.nu/courses-theme/production/style.css">
  ```

### @import Performance Issue

**Current** (style.css):
```css
@import url("css/defs/colors.css");
@import url("css/defs/fonts.css");
@import url("css/defs/variables.css");
@import url("css/animations.css");
@import url("css/globals.css");
/* ... 11 more @imports ... */
```

**Problem with @import**:
1. Browser loads style.css
2. Browser parses @import statements
3. Browser loads colors.css
4. Browser parses more @imports
5. **Waterfall effect**: Each file loads sequentially
6. **Render-blocking**: Page doesn't paint until ALL CSS loaded

**Impact**: ⚠️ **Render-blocking** — All 16 CSS files must load before painting.

---

## Skilljar Custom HTML Options (Unknown)

### Questions for Skilljar Platform Team

**Question 1**: Can we access HTML `<head>` section?
- If **yes**: Can implement critical CSS (inline in `<head>`)
- If **no**: Cannot implement traditional critical CSS

**Question 2**: Can we use custom JavaScript?
- If **yes**: Can load CSS asynchronously with JavaScript
- If **no**: Limited to Skilljar's CSS loading mechanism

**Question 3**: Can we specify multiple CSS files?
- If **yes**: Can provide critical.css (priority) + main.css (deferred)
- If **no**: Must use single CSS file (or @import chain)

**Question 4**: Does Skilljar support `<link rel="preload">`?
- If **yes**: Can optimize CSS loading order
- If **no**: No control over loading priority

**Status**: ❓ **Unknown** — Need to check Skilljar documentation or contact support.

---

## Alternative Approaches (Without HTML Control)

### Approach 1: Single Bundled CSS File (Recommended)

**Instead of**:
```css
/* style.css with @imports (waterfall loading) */
@import url("css/defs/colors.css");
@import url("css/animations.css");
/* ... 14 more @imports ... */
```

**Use**:
```
<!-- Single bundled CSS file (parallel loading) -->
<link rel="stylesheet" href="bundle.css">
```

**Implementation**:
```bash
# Build process: concatenate all CSS files
cat css/defs/*.css css/*.css > bundle.css

# Minify
cssnano bundle.css -o bundle.min.css
```

**Benefits**:
- ✅ Single HTTP request (vs 16 sequential)
- ✅ Eliminates @import waterfall
- ✅ Faster loading (parallel, not sequential)
- ✅ Can minify (reduce size)
- ⚠️ Still render-blocking (but faster)

**Drawback**:
- ❌ Not true critical CSS (still loads all CSS before paint)
- ❌ But significant improvement over current @import chain

**Recommendation**: **Implement** (see Task 4.4)

---

### Approach 2: CSS Ordering Optimization

**Strategy**: Put critical CSS at TOP of bundled file.

**Example** (bundle.css):
```css
/* ========== CRITICAL STYLES (above-the-fold) ========== */

/* Header */
.headers { background-color: var(--white); }
#site-header { display: flex; }

/* Hero */
.catalog-hero h1 { font-size: var(--font-size-6xl); }

/* Navigation */
#slide-menu { position: fixed; }

/* ========== NON-CRITICAL STYLES ========== */

/* Footer (below fold) */
.footer { ... }

/* Resource boxes (lesson pages only) */
.resource-box { ... }
```

**Benefits**:
- ✅ Browser parses critical styles first
- ✅ Can start painting sooner (progressive rendering)
- ✅ No HTML changes required
- ⚠️ Still loads full file before rendering complete

**Implementation**:
1. Identify critical selectors (header, hero, nav)
2. Move critical files to top of bundle
3. Order: variables → critical → non-critical

**Recommendation**: **Implement** alongside bundling

---

### Approach 3: Font Loading Optimization

**Current** (defs/fonts.css):
```css
@font-face {
  font-family: 'Gellix';
  src: url('https://westerling.nu/courses-theme/production/fonts/Gellix-Regular.woff2');
  font-display: swap; /* ← Good! */
}
```

**Already optimal**: Uses `font-display: swap`

**Benefits**:
- ✅ Text renders immediately with fallback font
- ✅ Custom font swaps in when loaded
- ✅ No FOIT (Flash of Invisible Text)

**Status**: ✅ **Already implemented** correctly

---

### Approach 4: Reduce CSS Size (via Dead Code Removal)

**From UNUSED_CSS_EVALUATION.md**:
- Total CSS: 152KB uncompressed
- Identified: ~106 lines of dead code (catalog styles)
- With minification: ~121KB (estimated)
- With gzip: ~45KB transfer size

**Recommendation**:
1. Remove dead code (catalog styles) → Save 3-4KB
2. Implement minification → Save ~30KB (152KB → 121KB)
3. Enable gzip (server-side) → Transfer only 45KB

**Status**: See Task 4.2 (dead code removal)

---

## Critical CSS Extraction Tools (Not Usable)

### Critical (npm package)

**How it works**: Loads page in headless browser, extracts above-the-fold CSS

**Example**:
```bash
npm install critical
critical https://example.com/catalog --inline
```

**Output**: Inline critical CSS in `<head>`

**Problem**: ❌ Requires HTML `<head>` control (we don't have)

**Status**: Cannot use

---

### Critters (Webpack plugin)

**How it works**: Webpack plugin that inlines critical CSS automatically

**Problem**: ❌ Requires build-time HTML access (we don't have)

**Status**: Cannot use

---

### penthouse, crittr, etc.

All critical CSS tools require either:
- ❌ HTML `<head>` access OR
- ❌ Build-time HTML manipulation

**Status**: None are usable without HTML control

---

## Recommendations

### Priority 1: Implement CSS Bundling (Task 4.4) ✅

**Action**: Replace @import chain with single bundled CSS file

**Benefits**:
- ✅ Eliminate @import waterfall (16 sequential → 1 request)
- ✅ Faster loading (parallel, not sequential)
- ✅ Can minify (152KB → 121KB)
- ✅ **Biggest performance win without HTML access**

**Effort**: Low-Medium (set up build process)

**Recommendation**: **Implement immediately**

---

### Priority 2: Optimize CSS File Order ✅

**Action**: Order CSS with critical styles first in bundle

**Implementation**:
```bash
# Bundle order: definitions → critical → non-critical
cat \
  css/defs/*.css \
  css/header.css css/breadcrumbs.css \
  css/catalog.css css/globals.css \
  css/lessons.css css/course-info.css \
  css/*.css \
  > bundle.css
```

**Benefits**:
- ✅ Browser parses critical styles first
- ✅ Progressive rendering (paint header/hero sooner)
- ✅ No extra effort (just file ordering)

**Effort**: Minimal (adjust build script)

**Recommendation**: **Implement** with bundling

---

### Priority 3: Remove Dead Code (Task 4.2) ✅

**Action**: Remove ~106 lines of unused catalog styles

**Benefits**:
- ✅ Reduce CSS size (~3.3% smaller)
- ✅ Faster parsing
- ✅ Cleaner code

**Effort**: Low (10 minutes)

**Recommendation**: **Implement**

---

### Priority 4: Investigate Skilljar Custom HTML ⚠️

**Action**: Research if Skilljar allows HTML `<head>` customization

**Check**:
- [ ] Skilljar documentation for "custom HTML"
- [ ] Theme settings for "custom head tags"
- [ ] JavaScript injection options
- [ ] Custom `<link>` tag attributes

**If available**:
- ✅ Can implement true critical CSS
- ✅ Can use async CSS loading
- ✅ Can optimize resource hints (preload, prefetch)

**If not available**:
- ❌ Continue with bundling approach (still good improvement)

**Effort**: Low (1 hour research)

**Recommendation**: **Research**, but don't block other improvements

---

## Performance Comparison

### Current Setup (16 @import files)

**Loading**:
1. Load style.css (4KB) — **100ms**
2. Parse @import statements — **10ms**
3. Load colors.css — **150ms** (wait for style.css first)
4. Load fonts.css — **150ms** (wait for colors.css)
5. ... (14 more files)
6. **Total**: ~2-3 seconds (waterfall)

**Render**: ⚠️ Blocked until ALL CSS loaded

---

### Proposed: Single Bundled File

**Loading**:
1. Load bundle.min.css (121KB minified) — **300ms** (parallel)
2. **Total**: ~300ms

**Render**: ⚠️ Still blocked until CSS loaded, but **much faster**

**Improvement**: ~2.7 seconds faster (2-3s → 0.3s)

---

### Ideal: Critical CSS (if HTML access available)

**Loading**:
1. Inline critical.css in `<head>` (8KB) — **0ms** (no HTTP request)
2. Load remaining.css async (113KB) — **250ms** (non-blocking)
3. **Total**: 0ms for initial paint

**Render**: ✅ Paints immediately (no blocking)

**Improvement**: ~3 seconds faster, **instant paint**

**Status**: ❓ **Unknown** if feasible (Skilljar limitation)

---

## Testing Plan (After Bundling Implementation)

### Measure Performance

**Tools**:
- [ ] Chrome DevTools Network tab (waterfall)
- [ ] Lighthouse audit (before & after)
- [ ] WebPageTest.org (filmstrip view)
- [ ] Core Web Vitals (FCP, LCP, CLS)

**Metrics to track**:
- [ ] **FCP** (First Contentful Paint)
- [ ] **LCP** (Largest Contentful Paint)
- [ ] **Total Blocking Time**
- [ ] **Number of CSS requests** (16 → 1)
- [ ] **CSS transfer size** (152KB → ~121KB → ~45KB gzipped)

**Expected improvements**:
- ✅ FCP: ~500-1000ms faster
- ✅ Lighthouse: +10-20 points
- ✅ Requests: 94% reduction (16 → 1)

---

## Summary

**Can we use critical CSS?**
- ❌ **No** — Skilljar controls HTML `<head>`, we cannot inline CSS
- ❓ **Maybe** — Need to research Skilljar's custom HTML capabilities

**What's the best alternative?**
- ✅ **CSS bundling** — Replace @import chain with single bundled file
- ✅ **Optimize file order** — Put critical styles first
- ✅ **Minification** — Reduce file size (152KB → 121KB)
- ✅ **Remove dead code** — Clean up unused styles

**Expected performance gain**:
- **Current**: ~2-3 seconds CSS load time (16 sequential requests)
- **Bundled**: ~300ms CSS load time (1 request, minified)
- **Improvement**: ~2+ seconds faster, 16 fewer HTTP requests

**Next steps**:
1. ✅ Implement CSS bundling (Task 4.4) — **Highest priority**
2. ✅ Remove dead code (Task 4.2)
3. ⚠️ Research Skilljar HTML customization options
4. ❌ Don't block on critical CSS (bundling is good enough)

---

## Related Documentation

- [Unused CSS Evaluation](UNUSED_CSS_EVALUATION.md) - Dead code analysis
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Task 4.3 reference
- [Phase 2 Complete](PHASE_2_COMPLETE.md) - File organization
- [Catalog Investigation](CATALOG_CONTENT_INVESTIGATION.md) - Dead code details

---

**Critical CSS Evaluation Complete** ✓

Traditional critical CSS not feasible due to Skilljar HTML control limitation. CSS bundling + optimization recommended as best alternative. Expected ~2+ second performance improvement.
