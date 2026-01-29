# CSS Nesting Refactoring Plan

## Date: 2026-01-28

## Overview

Flatten deeply nested CSS selectors to improve maintainability, reduce specificity, and enhance performance. Focus on the worst offender: **lessons.css resource box section (13 levels → 3 levels)**.

---

## 🎯 Goals

### Primary Objectives
1. **Reduce nesting depth** from 13 levels to 3 levels maximum
2. **Improve maintainability** - easier to read and modify
3. **Lower specificity** - reduce need for `!important`
4. **Better performance** - faster CSS matching
5. **Zero visual regressions** - maintain existing appearance

### Success Metrics
- Maximum nesting depth: 3 levels (from 13)
- Specificity reduction: ~70%
- Code readability: significantly improved
- Visual output: identical (no regressions)

---

## 📊 Current State Analysis

### lessons.css Resource Box Section (Lines 618-723)

**Current nesting chain (13 levels):**
```
body.sj-page-lesson                    ← Level 1
  #lp-wrapper                          ← Level 2
    #lp-content                        ← Level 3
      #lesson-body                     ← Level 4
        #lesson-main                   ← Level 5
          #lesson-main-inner           ← Level 6
            sjwc-lesson-content-item   ← Level 7
              .resource-box            ← Level 8
                .resource-wrapper      ← Level 9
                  .resource-card       ← Level 10
                    .card-body         ← Level 11
                      .badge-container ← Level 12
                        .badge         ← Level 13 ⚠️
```

**Current specificity:**
- `.badge` selector: `(0,3,8)` - 3 IDs + 8 classes/elements
- Nearly impossible to override without `!important`
- Already using `!important` for Skilljar overrides, creating specificity wars

**Current code structure:**
```css
body.sj-page-lesson {
  #lp-wrapper {
    #lp-content {
      #lesson-body {
        #lesson-main {
          #lesson-main-inner {
            sjwc-lesson-content-item {
              .resource-box {
                h3 { /* 10 levels */ }

                .resource-wrapper {
                  .resource-card {
                    .card-body {
                      .badge-container {
                        .badge { /* 13 levels */ }
                      }
                      h5.card-title { /* 11 levels */ }
                      p.card-text { /* 11 levels */ }
                      a.button { /* 11 levels */ }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**Problems with current approach:**
1. ❌ Impossible to read - nested structure is hard to follow
2. ❌ Fragile - changes to HTML structure break styles
3. ❌ Over-specific - unnecessary intermediate selectors
4. ❌ Performance - browser must traverse entire chain
5. ❌ Maintainability - locating styles requires deep diving

---

## 🔧 Refactoring Strategy

### Key Insight
**We don't need all those intermediate selectors!**

The intermediate wrappers (`#lp-wrapper`, `#lp-content`, `#lesson-body`, etc.) are Skilljar's structure, but we don't need to reference them all to style the resource cards.

### Flattening Approach

**Before (13 levels):**
```css
body.sj-page-lesson #lp-wrapper #lp-content #lesson-body #lesson-main #lesson-main-inner sjwc-lesson-content-item .resource-box .resource-wrapper .resource-card .card-body .badge-container .badge {
  /* styles */
}
```

**After (3 levels):**
```css
body.sj-page-lesson .resource-card .badge {
  /* styles */
}
```

**Specificity comparison:**
- Before: `(0,3,8)` - 3 IDs + 8 classes
- After: `(0,0,3)` - 3 classes only
- **Reduction: ~73%** 🎉

### Scoping Strategy

We still need to scope styles to lesson pages only (to avoid affecting other pages), so we keep the page-level selector:

```css
/* Scope to lesson pages only */
body.sj-page-lesson {
  /* Flat selectors within */
}
```

**Alternative approach** (even flatter):
```css
/* Separate top-level rules scoped to lesson pages */
body.sj-page-lesson .resource-box { }
body.sj-page-lesson .resource-wrapper { }
body.sj-page-lesson .resource-card { }
body.sj-page-lesson .resource-card .badge { }
```

---

## 📝 Implementation Plan

### Phase 1: Extract Resource Box Section

**Step 1: Create new section header**
```css
/* ========================================
   7. RESOURCE BOXES (Flattened from deep nesting)
   ======================================== */
```

**Step 2: Extract and flatten each component**

#### 7.1 Resource Box Container
```css
body.sj-page-lesson .resource-box {
  /* Hide if empty */
  &:not(:has(.resource-card)) {
    display: none !important;
  }

  h3 {
    font-size: var(--font-size-lg);
  }
}
```

**Nesting depth**: 2 levels (was 10 for h3)

#### 7.2 Resource Wrapper
```css
body.sj-page-lesson .resource-wrapper {
  display: grid;
  gap: var(--gap-3);
  grid-template-columns: repeat(2, 1fr);
  padding: var(--spacing-3);
}
```

**Nesting depth**: 1 level (was 9)

#### 7.3 Resource Card
```css
body.sj-page-lesson .resource-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: var(--border-width-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-rem-sm);
  background-color: var(--color-surface-base);
  overflow-wrap: break-word;
  background-clip: border-box;
}
```

**Nesting depth**: 1 level (was 10)

#### 7.4 Card Body
```css
body.sj-page-lesson .resource-card .card-body {
  flex: 1 1 auto;
  padding: 1.25rem;
}
```

**Nesting depth**: 2 levels (was 11)

#### 7.5 Badge Container & Badge
```css
body.sj-page-lesson .resource-card .badge-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-px-10);
}

body.sj-page-lesson .resource-card .badge {
  width: fit-content;
  margin-right: var(--spacing-px-10);
  margin-bottom: var(--spacing-px-10);
  border: var(--border-width-none);
  border-radius: var(--radius-rem-sm);
  background-color: var(--color-pink-light);
  color: var(--color-text-pink-dark);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: calc(1 / 0.75);
  padding-block: 0.125rem;
  padding-inline: 0.625rem;
  margin-inline-end: var(--spacing-2);
  box-sizing: border-box;
}
```

**Nesting depth**: 2-3 levels (was 12-13)

#### 7.6 Card Title
```css
body.sj-page-lesson .resource-card h5.card-title {
  margin-top: var(--spacing-0);
  margin-bottom: var(--spacing-0);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-1-5rem);
}
```

**Nesting depth**: 2 levels (was 11)

#### 7.7 Card Text
```css
body.sj-page-lesson .resource-card p.card-text {
  overflow-wrap: break-word;
}
```

**Nesting depth**: 2 levels (was 11)

#### 7.8 Card Button
```css
body.sj-page-lesson .resource-card a.button {
  display: inline-block;
  padding: var(--spacing-px-6) var(--spacing-px-12);
  margin: var(--spacing-0);
  border: var(--border-width-thin) solid transparent;
  border-color: var(--border-color-v2) !important;
  border-radius: var(--radius-rem-sm);
  background-color: transparent;
  color: var(--blurple) !important;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-24);
  text-align: center;
  transition: var(--transition-resource-button);
  vertical-align: middle;
  user-select: none;

  &:hover {
    border-color: var(--blurple);
    background-color: var(--color-surface-accent);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus-ring);
  }

  &:active {
    transform: translateY(1px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

**Nesting depth**: 2-3 levels (was 11-12)

---

## 🧪 Testing Strategy

### Visual Regression Testing

**Pages to test:**
1. Any lesson page with resource boxes
2. Lessons with multiple resource cards
3. Lessons with badges on resource cards
4. Mobile responsive views (grid should collapse)

**Test scenarios:**
- [ ] Resource box displays correctly
- [ ] Resource cards layout in grid
- [ ] Badges display with correct styling
- [ ] Card titles and text render properly
- [ ] Buttons have correct styling and hover states
- [ ] Focus states work on buttons
- [ ] Responsive behavior intact (mobile/tablet)
- [ ] No visual differences from before refactor

### Specificity Testing

**Verify specificity reduction:**
```bash
# Check compiled selector specificity
# Should see significant reduction in selector weight
```

**Expected results:**
- `.badge`: `(0,0,3)` instead of `(0,3,8)`
- `.card-title`: `(0,0,3)` instead of `(0,3,6)`
- `.button`: `(0,0,3)` instead of `(0,3,7)`

### Performance Testing

**Metrics to measure:**
- CSS parsing time (Chrome DevTools Performance tab)
- Style calculation time
- Lighthouse CSS performance score

**Expected improvements:**
- Faster CSS matching (~10-15% improvement)
- Lower style recalculation time
- Slight bundle size reduction (shorter selectors)

---

## 📋 Implementation Checklist

### Preparation
- [x] Audit current nesting depth
- [x] Document current structure
- [x] Create refactoring plan (this document)
- [ ] Identify exact line numbers for extraction

### Extraction
- [ ] Locate resource box section in lessons.css (lines 618-723)
- [ ] Copy current code to backup/reference
- [ ] Create new flattened section in lessons.css

### Refactoring
- [ ] Extract `.resource-box` container
- [ ] Extract `.resource-wrapper` grid
- [ ] Extract `.resource-card` styles
- [ ] Extract `.card-body` styles
- [ ] Extract `.badge-container` and `.badge` styles
- [ ] Extract `.card-title` styles
- [ ] Extract `.card-text` styles
- [ ] Extract `.button` styles with states
- [ ] Preserve all `!important` declarations
- [ ] Preserve reduced motion support

### Cleanup
- [ ] Remove old deeply nested code (lines 618-723)
- [ ] Verify no duplicate selectors
- [ ] Update section comments
- [ ] Format code consistently

### Testing
- [ ] Build production CSS (`npm run build:css`)
- [ ] Visual test on development environment
- [ ] Test with different resource card configurations
- [ ] Test responsive breakpoints
- [ ] Verify focus states work
- [ ] Verify hover states work
- [ ] Check for any visual regressions

### Documentation
- [ ] Create NESTING_REFACTOR_IMPLEMENTATION.md
- [ ] Document specificity improvements
- [ ] Note any breaking changes (should be none)
- [ ] Update CSS Improvement Plan progress

---

## 🎯 Expected Results

### Before Refactoring
- **Nesting depth**: 13 levels
- **Specificity**: `(0,3,8)` for .badge
- **Readability**: Very difficult
- **Maintainability**: Poor
- **Performance**: Slower matching

### After Refactoring
- **Nesting depth**: 3 levels ✅
- **Specificity**: `(0,0,3)` for .badge ✅
- **Readability**: Excellent ✅
- **Maintainability**: Good ✅
- **Performance**: Improved ✅

### Code Comparison

**Before (106 lines with 13-level nesting):**
```css
body.sj-page-lesson {
  #lp-wrapper {
    #lp-content {
      #lesson-body {
        #lesson-main {
          #lesson-main-inner {
            sjwc-lesson-content-item {
              .resource-box {
                .resource-wrapper {
                  .resource-card {
                    .card-body {
                      .badge-container {
                        .badge { /* 13 levels deep! */ }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**After (~100 lines with 3-level maximum):**
```css
body.sj-page-lesson .resource-box { }
body.sj-page-lesson .resource-wrapper { }
body.sj-page-lesson .resource-card { }
body.sj-page-lesson .resource-card .badge-container { }
body.sj-page-lesson .resource-card .badge { /* Only 3 levels! */ }
body.sj-page-lesson .resource-card h5.card-title { }
body.sj-page-lesson .resource-card p.card-text { }
body.sj-page-lesson .resource-card a.button { }
```

---

## 🚀 Next Steps

### Phase 1: Resource Box (This Plan)
1. Implement flattening for lessons.css lines 618-723
2. Test thoroughly for visual regressions
3. Document changes

### Phase 2: Other Deep Nesting (Future)
After successful completion of Phase 1, consider:
- catalog.css course cards (8 levels → 4 levels)
- freezebox.css legacy styles (8 levels → 4 levels)
- course-info.css curriculum sections (7 levels → 4 levels)

---

## ⚠️ Risks & Mitigation

### Risk 1: Visual Regressions
**Mitigation**: Thorough visual testing before deployment. Side-by-side comparison of before/after.

### Risk 2: Specificity Conflicts
**Mitigation**: Existing `!important` declarations preserved. New selectors still scoped to `body.sj-page-lesson`.

### Risk 3: Missing Edge Cases
**Mitigation**: Test with various resource card configurations (with/without badges, multiple cards, etc.).

### Risk 4: Breaking Changes
**Mitigation**: Extract-then-remove approach. Old code stays until new code is proven to work.

---

## 📖 Related Documentation

- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Phase 4.1: Reduce Specificity
- [Nesting Depth Audit](audit report from agent a62a278) - Complete analysis
- [NESTING_REFACTOR_IMPLEMENTATION.md](to be created) - Implementation details

---

**Nesting Refactor Plan Complete** ✓

Ready to flatten the resource box section from 13 levels to 3 levels maximum, reducing specificity by ~73% and significantly improving maintainability.
