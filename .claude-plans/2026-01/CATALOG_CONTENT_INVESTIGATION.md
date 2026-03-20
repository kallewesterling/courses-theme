# Catalog Content Investigation

## Date: 2026-01-27

## Issue

Found contradictory CSS in catalog.css where `#catalog-content` is hidden but children are still styled.

---

## The Problem

### catalog.css (lines 21-58)

```css
#catalog-content {
  /* Hide existing catalog content */
  display: none !important;  /* ← HIDDEN! */

  #catalog-courses {
    /* But we style children inside the hidden container? */
    justify-content: start;
    gap: var(--gap-6);

    .coursebox-container {
      width: calc(50% - var(--spacing-px-24)) !important;
      /* ... 30 more lines of styles ... */
    }
  }
}
```

**Lines**: 21-58 (38 lines total)

---

### freezebox.css (lines 40-116)

```css
body.sj-page-catalog {
  /* These are our legacy styles in the transition period to the new branding. */

  #catalog-content {
    #catalog-courses {
      .coursebox-container {
        /* ... 75 lines of styles ... */
      }
    }
  }
}
```

**Lines**: 40-116 (77 lines total)

---

## Analysis

### CSS Specificity Rules

When an element has `display: none`:
- ✅ Element is removed from rendering tree
- ✅ Element is not painted
- ✅ Children are also hidden (not rendered)
- ❌ **Styles on children have NO EFFECT**

**Conclusion**: If `#catalog-content` has `display: none !important`, all child styles are **dead code**.

---

### Investigation Results

**Checked for**:
- ❌ No JavaScript toggling `display` property
- ❌ No conditional CSS that removes `display: none`
- ❌ No media queries that change this behavior

**Confirmed**:
- ✅ `#catalog-content` is permanently hidden
- ✅ Custom catalog uses `section.featured-courses` instead (catalog.css:102-362)
- ✅ Comment says "Hide existing catalog content" (replacing Skilljar's default)

---

## Dead Code Identified

### In catalog.css

**Lines 25-58** (34 lines):
```css
#catalog-courses {
  justify-content: start;
  gap: var(--gap-6);

  .coursebox-container {
    width: calc(50% - var(--spacing-px-24)) !important;
    margin: var(--spacing-0);

    @media screen and (max-width: 600px) {
      width: 100% !important;
    }

    .badge-box {
      position: absolute !important;
      /* ... styles ... */
    }

    .sj-course-ribbon-complete {
      color: var(--color-surface-base) !important;
    }
  }
}
```

**Status**: 🔴 **DEAD CODE** — nested inside hidden `#catalog-content`

---

### In freezebox.css

**Lines 45-116** (72 lines):
```css
#catalog-content {
  #catalog-courses {
    .coursebox-container {
      display: flex;
      flex-direction: column;
      /* ... 70+ more lines ... */
    }
  }
}
```

**Status**: 🔴 **DEAD CODE** — styling hidden `#catalog-content`

---

## Why This Happened

### Timeline (Hypothesized)

1. **Original**: Used Skilljar's default catalog (`#catalog-content`)
2. **Transition**: Added custom catalog sections (`section.featured-courses`)
3. **Decision**: Hide Skilljar catalog with `display: none !important`
4. **Mistake**: Forgot to remove old styles for hidden catalog
5. **freezebox.css**: Put old catalog styles in "legacy" file but never removed

---

## Impact

### Current State

- **Dead code**: ~106 lines total (34 in catalog.css + 72 in freezebox.css)
- **File size**: ~3-4KB of unused CSS
- **Maintenance burden**: Confusing for developers
- **Load time**: Unnecessary CSS downloaded and parsed

### If Removed

- ✅ Cleaner codebase
- ✅ Smaller CSS bundle (~3.3% reduction)
- ✅ Less confusion
- ✅ No functionality impact (already hidden!)

---

## Recommendation

### ✅ SAFE TO REMOVE

**What to remove**:

#### 1. catalog.css (lines 25-58)
Remove all nested styles inside `#catalog-content` block:
```css
/* KEEP */
#catalog-content {
  /* Hide existing catalog content */
  display: none !important;
}

/* REMOVE lines 25-58 */
/* (all the nested #catalog-courses .coursebox-container styles) */
```

#### 2. freezebox.css (lines 40-116)
Remove entire `body.sj-page-catalog #catalog-content` block:
```css
/* REMOVE lines 40-116 */
body.sj-page-catalog {
  #catalog-content { /* ... */ }
}
```

---

### Why It's Safe

1. **Already hidden**: `#catalog-content` has `display: none !important`
2. **Custom catalog works**: `section.featured-courses` provides catalog functionality
3. **No JavaScript toggle**: Nothing changes `display` property dynamically
4. **No breaking changes**: Removing styles for hidden elements can't break anything

---

### Testing Plan

After removal:

- [ ] Load catalog page
- [ ] Verify `#catalog-content` is still hidden (should be)
- [ ] Verify custom catalog (`section.featured-courses`) displays correctly (should be unchanged)
- [ ] Check for console errors (should be none)
- [ ] Test on mobile/tablet/desktop (should work identically)

**Expected result**: No visual or functional changes (removing dead code).

---

## Implementation

### Step 1: Remove catalog.css Dead Code

**File**: `production/css/catalog.css`

**Current** (lines 21-58):
```css
#catalog-content {
  /* Hide existing catalog content */
  display: none !important;

  #catalog-courses {
    justify-content: start;
    /* ... 30 more lines ... */
  }
}
```

**Proposed** (keep only the hide rule):
```css
#catalog-content {
  /* Hide existing catalog content - using custom sections instead */
  display: none !important;
}
```

**Lines removed**: 34 lines

---

### Step 2: Remove freezebox.css Dead Code

**File**: `production/css/freezebox.css`

**Current** (lines 40-116):
```css
body.sj-page-catalog {
  /*
  These are our legacy styles in the transition period to the new branding.
  */

  #catalog-content {
    #catalog-courses {
      /* ... 75 lines ... */
    }
  }
}
```

**Proposed**: Delete entire block (lines 40-116)

**Lines removed**: 77 lines

---

## Summary

**Found**: 106 lines of dead CSS code styling hidden elements

**Impact**: ~3.3% of total CSS (~3-4KB)

**Risk**: None (already hidden, no functionality impact)

**Recommendation**: **Remove immediately**

**Estimated effort**: 10 minutes (delete lines, test catalog page)

**Next step**: Implement removal and test

---

## Related Documentation

- [Unused CSS Evaluation](UNUSED_CSS_EVALUATION.md) - Complete unused CSS analysis
- [Phase 2 Complete](PHASE_2_COMPLETE.md) - File organization
- [Skilljar Selectors](SKILLJAR_SELECTORS.md) - Selector reference

---

**Investigation Complete** ✓

Dead code confirmed. Safe to remove. No functionality impact.
