# Unused CSS Evaluation

## Date: 2026-01-27

## Overview

Evaluation of potentially unused CSS in the courses theme codebase, considering the critical constraint that **Skilljar dynamically renders HTML** and we cannot control what elements appear on each page.

---

## Executive Summary

**Current State**:
- **Total CSS**: 152KB uncompressed (~110KB raw bytes)
- **Total lines**: 3,190 lines across all files
- **No build process**: CSS loaded via @import (not bundled/minified)
- **No CSS purging**: No PurgeCSS, UnCSS, or similar tools configured

**Key Findings**:
- ✅ CSS bundle is relatively small (152KB is reasonable)
- ⚠️ `freezebox.css` contains legacy/deprecated styles (116 lines)
- ⚠️ 5 TODO comments indicating questionable code
- ⚠️ Many `display: none` rules (hiding Skilljar elements we don't want)
- 🔴 **High risk** of removing CSS due to Skilljar's dynamic rendering

**Recommendation**: **Do NOT implement aggressive CSS purging** due to Skilljar constraints.

---

## CSS Bundle Analysis

### File Size Breakdown

| File | Size | Lines | % of Total | Purpose |
|------|------|-------|------------|---------|
| **Total (all files)** | **152KB** | **3,190** | **100%** | - |
| lessons.css | ~30KB | 907 | 28.4% | Lesson pages |
| catalog.css | ~14KB | 465 | 14.6% | Catalog/landing |
| defs/colors.css | ~12KB | 336 | 10.5% | Color system |
| course-info.css | ~10KB | 379 | 11.9% | Course detail |
| defs/variables.css | ~9KB | 253 | 7.9% | Typography/spacing |
| globals.css | ~8KB | 234 | 7.3% | Global styles |
| Other files | ~69KB | 616 | 19.3% | Various |

**Analysis**:
- ✅ No obviously bloated files
- ✅ 152KB is reasonable for a complete theme (not excessive)
- ✅ Largest file (lessons.css) is appropriately sized for main functionality

---

## Potentially Unused CSS

### Category 1: Explicitly Legacy (freezebox.css)

**File**: `production/css/freezebox.css` (116 lines)

**Purpose** (from file header):
> "This is where we put legacy styles that we want to freeze and not update, but potentially remove"

**Contents**:

#### 1.1 Module Styles (Questionable)
```css
.module-heading { /* TODO: Legacy? */ }
.module-list { /* TODO: Legacy? */ }
```

**Risk**: 🟡 Medium
- May be used by Skilljar in some contexts
- Not obviously tied to specific page type
- TODO comment indicates uncertainty

**Recommendation**: **Keep for now**, verify with Skilljar documentation or testing.

---

#### 1.2 Video Player (Likely Unused)
```css
.video-player.flex-video.widescreen {
  /* Legacy - I don't think we use video player anywhere anymore */
}
```

**Risk**: 🟢 Low
- Comment explicitly states likely unused
- 3 lines of CSS (minimal impact)

**Recommendation**: **Can remove** after verifying no video players on any pages.

---

#### 1.3 Hidden Skilljar Elements (In Use)
```css
.sj-heading-paragraph,
.sj-floater-text {
  /* TODO: Legacy, but still remains hardcoded so need to be here for now. */
  display: none;
}
```

**Risk**: 🔴 Critical
- Actively hiding Skilljar elements
- Comment says "still remains hardcoded"
- Removing would make hidden elements visible

**Recommendation**: **Must keep** — actively in use to hide unwanted Skilljar elements.

---

#### 1.4 Legacy Catalog Styles (Duplicate?)
```css
body.sj-page-catalog {
  /* These are our legacy styles in the transition period to the new branding. */
  #catalog-content {
    #catalog-courses {
      .coursebox-container { /* styles */ }
    }
  }
}
```

**Risk**: 🟡 Medium-High
- 75 lines of catalog styles
- May conflict with catalog.css (465 lines)
- Labeled "transition period to new branding"
- Note: catalog.css already hides `#catalog-content` with `display: none !important` (line 23)

**Potential Issue**: These styles may **never apply** because catalog.css hides `#catalog-content` entirely!

**Recommendation**: **Investigate conflict** — if `#catalog-content` is hidden, these styles are unused.

---

### Category 2: Hidden Elements (Actively Used)

**Count**: 19 `display: none !important` rules across files

**Examples**:
```css
/* style.css */
.related-parent-objects {
  display: none !important; /* Hide "Also available as part of" section */
}

.sj-save-toggle-block {
  display: none !important; /* Hide save course/learning path feature */
}

/* catalog.css */
.catalog-hero a {
  display: none !important; /* Hide "View Our Courses" button */
}

/* course-info.css */
.social-media-wrapper {
  display: none !important; /* Hide social sharing */
}
```

**Risk**: 🔴 Critical — **Must keep all**
- These rules actively hide Skilljar elements we don't want
- Removing them would make unwanted elements visible
- Core to custom theming strategy

**Recommendation**: **Do NOT remove** — essential functionality.

---

### Category 3: TODO Comments (5 found)

| File | Line | Selector | TODO Comment | Risk |
|------|------|----------|--------------|------|
| course-info.css | 117 | `h2` font-weight | "this seems unnecessary" | 🟢 Low |
| course-info.css | 218 | `i` margin | "is this legacy?" | 🟡 Medium |
| freezebox.css | 8 | `.module-heading` | "Legacy?" | 🟡 Medium |
| freezebox.css | 15 | `.module-list` | "Legacy?" | 🟡 Medium |
| freezebox.css | 27 | `.sj-heading-paragraph` | "Legacy, but still hardcoded" | 🔴 Keep |

**Recommendation**: **Audit each TODO** — some can likely be removed, others must stay.

---

## Skilljar Dynamic Rendering Risk

### Why Unused CSS Detection is Dangerous

**The Problem**: Skilljar dynamically renders HTML based on:
- User authentication state (logged in vs logged out)
- User progress (course started, completed, not started)
- Page type (catalog, lesson, course detail, etc.)
- Course configuration (has video, has resources, has quiz, etc.)
- Admin settings (features enabled/disabled)

**Example Scenarios**:

#### Scenario 1: Resource Boxes
```css
.resource-box .resource-wrapper .resource-card { /* styles */ }
```

- Appears ONLY on lesson pages
- Appears ONLY if lesson has resources configured
- May not appear in test environment if resources not configured
- **Purging risk**: Tool might not see resource boxes, marks as unused, removes CSS

---

#### Scenario 2: Course Badges
```css
.badge-box.sj-course-ribbon-complete { /* completed badge styles */ }
```

- Appears ONLY on catalog pages
- Appears ONLY if user has completed a course
- Won't appear for new users or test accounts without progress
- **Purging risk**: Tool might not see completed badges, marks as unused

---

#### Scenario 3: Authentication States
```css
body.sj-page-login form { /* login form styles */ }
```

- Appears ONLY when logged out
- Testing while logged in won't trigger these styles
- **Purging risk**: Tool might not see login form, marks as unused

---

### Skilljar Element Unpredictability

**Elements we CANNOT control**:
- Skilljar may add wrapper divs dynamically
- Skilljar may change class names in platform updates
- Skilljar may conditionally render elements based on configuration
- Skilljar may use different HTML structure on different page types

**Example** (from SKILLJAR_SELECTORS.md):
```
.sj-course-ribbon-complete     ← Only appears when course completed
.cbp-spmenu-open               ← Only appears when menu is open
.lesson-active                 ← Only appears for current lesson
.course-owned                  ← Only appears for enrolled courses
```

**Conclusion**: **Cannot reliably detect unused CSS** without testing ALL possible states and configurations.

---

## CSS Purging Tools Analysis

### PurgeCSS

**How it works**: Scans HTML/JS files, removes CSS selectors not found

**Pros**:
- ✅ Can significantly reduce CSS bundle size
- ✅ Configurable safelist (protect certain selectors)

**Cons**:
- ❌ Requires access to ALL possible HTML output (we don't have this)
- ❌ Doesn't understand dynamic rendering (Skilljar)
- ❌ Would need comprehensive safelist (defeats purpose)
- ❌ Risk of removing CSS for rare states (completed courses, admin features, etc.)

**Recommendation**: **Do NOT use** due to Skilljar dynamic rendering.

---

### UnCSS

**How it works**: Loads pages in headless browser, removes unused CSS

**Pros**:
- ✅ More accurate than static analysis (actually renders pages)
- ✅ Can handle some JavaScript-based rendering

**Cons**:
- ❌ Cannot test all authentication states
- ❌ Cannot test all user progress states
- ❌ Cannot test all page configurations
- ❌ Requires maintaining list of ALL possible page URLs
- ❌ Slow (must load each page)

**Recommendation**: **Do NOT use** — too risky and not comprehensive enough.

---

### CSSO / CSSNano (Minification only)

**How it works**: Compresses CSS (removes whitespace, shortens values) but keeps all selectors

**Pros**:
- ✅ Safe (doesn't remove any selectors)
- ✅ Reduces file size (~30-40% typical)
- ✅ No risk of breaking styles

**Cons**:
- ❌ Doesn't remove unused CSS (only compresses)

**Recommendation**: **Consider implementing** — safe and beneficial (see Task 4.4).

---

## Recommendations

### ✅ Recommended: Safe Cleanup

#### Action 1: Audit freezebox.css Legacy Catalog Styles

**Investigation needed**:
```css
/* catalog.css line 23 */
#catalog-content {
  display: none !important; /* Hide existing catalog content */
}

/* BUT freezebox.css lines 40-116 style #catalog-content children */
body.sj-page-catalog #catalog-content #catalog-courses { /* 75 lines of styles */ }
```

**Question**: If `#catalog-content` is hidden, are freezebox.css styles dead code?

**Steps**:
1. Test catalog page with DevTools
2. Check if `#catalog-content` is actually hidden
3. If yes, remove freezebox.css catalog styles (lines 40-116)
4. If no, investigate why catalog.css hiding isn't working

**Potential savings**: ~75 lines of CSS (~2.3% of total)

---

#### Action 2: Remove TODO Items After Verification

**Target**: 5 TODO comments

**Process**:
1. Test pages where TODO selectors appear
2. Use DevTools to check if selector matches any elements
3. If no matches after comprehensive testing, remove
4. Document why removed

**Potential savings**: ~10-15 lines of CSS (minimal)

---

#### Action 3: Verify and Remove Video Player Styles

**Target**: `.video-player.flex-video.widescreen` (freezebox.css:19-23)

**Process**:
1. Search all pages for video player elements
2. Check Skilljar documentation for video player usage
3. If confirmed unused, remove

**Potential savings**: 3 lines of CSS (negligible)

---

### ❌ NOT Recommended: Aggressive Purging

#### Don't Do: Automated CSS Purging

**Why not**:
- ❌ High risk of removing CSS for rare states
- ❌ Cannot test all Skilljar rendering scenarios
- ❌ Would require constant maintenance (safelist updates)
- ❌ Potential for production bugs (missing styles for completed courses, etc.)

**Alternative**: Manual code review and removal of confirmed-unused styles only.

---

#### Don't Do: Remove "display: none" Rules

**Why not**:
- ❌ These actively hide Skilljar elements
- ❌ Removing them would break custom theming
- ❌ Core to the theming strategy

**Keep**: All `display: none !important` rules.

---

### ⚠️ Consider: Manual Audit Process

If you want to reduce unused CSS safely:

**Process**:
1. **Document all page types** (already done in SKILLJAR_SELECTORS.md)
2. **Test each page type** in all states:
   - Logged in / logged out
   - Course not started / in progress / completed
   - With resources / without resources
   - With video / without video
   - Mobile / tablet / desktop
3. **Use DevTools Coverage** to identify unused CSS per page
4. **Cross-reference** unused CSS across ALL tested pages
5. **Only remove** CSS that's unused in EVERY scenario
6. **Test thoroughly** after removal

**Effort**: Very high (multiple days of testing)

**Benefit**: Moderate (maybe 10-20% reduction at best)

**Recommendation**: **Not worth the effort** given current bundle size (152KB is reasonable).

---

## Current Bundle Size Assessment

### Is 152KB Too Large?

**Industry Standards**:
- ✅ **<200KB**: Good (our target range)
- ⚠️ **200-500KB**: Acceptable for complex sites
- 🔴 **>500KB**: Should optimize

**Our CSS**: **152KB uncompressed** (no build process, no minification)

**With minification** (estimated):
- Whitespace removal: ~20% reduction → **121KB**
- Compression (gzip): ~70% reduction → **45KB** (actual transfer size)

**Verdict**: ✅ **Current size is reasonable** and not a performance bottleneck.

---

## Performance Impact Analysis

### Current Setup (No Build Process)

**Pros**:
- ✅ Simple deployment (no build step)
- ✅ Easy debugging (readable CSS)
- ✅ Fast development (no compilation)

**Cons**:
- ❌ Multiple HTTP requests (16 CSS files via @import)
- ❌ No minification (152KB vs ~121KB possible)
- ❌ No compression optimization
- ❌ Browser must parse @import statements

**Impact**: ⚠️ Moderate — Multiple @import statements can cause render-blocking.

---

### With Build Process (Recommended in Task 4.4)

**Pros**:
- ✅ Single HTTP request (bundled file)
- ✅ Minified (~121KB)
- ✅ Better compression (gzip: ~45KB transfer)
- ✅ Eliminates @import parsing overhead

**Cons**:
- ❌ Requires build step
- ❌ Less readable in production
- ❌ Need source maps for debugging

**Impact**: ✅ **Better performance** without removing any CSS.

---

## Testing Recommendations

Before removing ANY CSS:

### Comprehensive State Testing

- [ ] **Authentication States**
  - [ ] Logged out (public catalog view)
  - [ ] Logged in, not enrolled
  - [ ] Logged in, enrolled
  - [ ] Logged in, completed courses

- [ ] **Page Types**
  - [ ] Catalog/landing page
  - [ ] Course detail page (not enrolled)
  - [ ] Course detail page (enrolled)
  - [ ] Lesson page (in progress)
  - [ ] Lesson page (with resources)
  - [ ] Lesson page (with code blocks)
  - [ ] Completion page
  - [ ] Login/signup pages
  - [ ] 404 error page

- [ ] **Interactive States**
  - [ ] Navigation menu open
  - [ ] Navigation menu closed
  - [ ] Resource boxes expanded
  - [ ] Code copy tooltips
  - [ ] Hover states
  - [ ] Focus states

- [ ] **Responsive States**
  - [ ] Mobile (320px, 375px, 414px)
  - [ ] Tablet (768px, 991px)
  - [ ] Desktop (1200px, 1440px, 1920px)

- [ ] **Browser DevTools Coverage**
  - [ ] Run Coverage tab for each page/state
  - [ ] Document unused CSS per page
  - [ ] Find patterns (unused across ALL pages)

---

## Summary

**Key Takeaways**:

1. **Current CSS bundle (152KB) is reasonable** — not a performance bottleneck
2. **High risk of breaking styles** if we remove CSS without comprehensive testing
3. **Skilljar's dynamic rendering** makes automated purging dangerous
4. **freezebox.css catalog styles** may be unused (investigate)
5. **Manual cleanup is safe** but limited benefit for high effort

**Recommended Actions**:
- ✅ Investigate freezebox.css catalog styles conflict (may save ~75 lines)
- ✅ Audit and remove verified TODO items (save ~10-15 lines)
- ✅ Remove video player styles after verification (save ~3 lines)
- ✅ Implement CSS build process with minification (Task 4.4) — **better ROI than purging**
- ❌ Do NOT use automated CSS purging tools (too risky)
- ❌ Do NOT remove "display: none" rules (actively in use)

**Best Performance Gains**:
- Implement CSS bundling + minification → ~45KB transfer size (70% reduction)
- Keep all CSS selectors for safety
- Much better ROI than risky purging

---

## Related Documentation

- [Specificity Analysis](SPECIFICITY_ANALYSIS.md) - Selector specificity patterns
- [Skilljar Selectors](SKILLJAR_SELECTORS.md) - Complete selector reference
- [Phase 2 Complete](PHASE_2_COMPLETE.md) - File organization
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Overall roadmap

---

## Next Steps

**Immediate** (Task 4.2 continuation):
1. Investigate freezebox.css catalog styles vs catalog.css conflict
2. Test if `#catalog-content` is actually hidden
3. Document findings

**Future** (Task 4.4):
1. Evaluate CSS build process (bundling + minification)
2. Implement if beneficial (likely yes)

---

**Unused CSS Evaluation Complete** ✓

Unused CSS risk assessed. Aggressive purging NOT recommended due to Skilljar constraints. Manual cleanup opportunities identified. Build process optimization recommended instead.
