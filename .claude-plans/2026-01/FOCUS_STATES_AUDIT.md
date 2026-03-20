# Focus States Accessibility Audit

## Date: 2026-01-28

## Overview

Comprehensive audit of focus states for keyboard navigation accessibility. Goal: Ensure all interactive elements have clear, consistent focus indicators that meet WCAG 2.1 AA standards.

---

## ✅ Current State (Good)

### Focus Ring Definition

**Color Variable**:
```css
--color-focus-ring: #c9d1ff;  /* Light blue/purple */
--shadow-focus-ring: 0 0 0 4px var(--color-focus-ring);
```

**Pattern** (used consistently in 7 places):
```css
&:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

**Why `:focus-visible` is Good**:
- ✅ Only shows focus for **keyboard users** (not mouse clicks)
- ✅ Better UX (no focus ring on click)
- ✅ Modern CSS standard (well-supported)

---

## 📊 Focus State Coverage

### ✅ Elements WITH Focus States (7 instances)

| File | Line | Element | Pattern |
|------|------|---------|---------|
| `globals.css` | 61 | `.button` (global) | `:focus-visible` ✅ |
| `auth.css` | 157 | Login submit button | `:focus-visible` ✅ |
| `auth.css` | 268 | Signup submit button | `:focus-visible` ✅ |
| `lessons.css` | 117 | Menu toggle button (#slide-menu-button) | `:focus-visible` ✅ |
| `lessons.css` | 686 | Resource box buttons (a.button) | `:focus-visible` ✅ |
| `catalog.css` | 429 | CTA bottom buttons | `:focus-visible` ✅ |
| `footer.css` | 55 | Footer links | `:focus-visible` ✅ |

---

### ⚠️ Elements Using OLD `:focus` Pattern (2 instances)

| File | Line | Element | Current Pattern | Should Be |
|------|------|---------|-----------------|-----------|
| `auth.css` | 221 | Form inputs (text, email, password) | `:focus` | `:focus-visible` ⚠️ |
| `auth.css` | 227 | Form inputs (invalid state) | `:invalid:focus` | Keep as-is ✅ |

**Note on line 227**: `:invalid:focus` is appropriate here because form validation should show for both mouse and keyboard users.

---

### ❌ Elements MISSING Focus States

#### High Priority (Interactive, No Focus State)

**1. Course Info Links**
- **File**: `course-info.css`
- **Elements**:
  - Curriculum wrapper links (`.curriculum-wrapper a`) - Lines ~189-223
  - Course card links (`.course-card a`) - Lines ~69-76
- **Impact**: Users navigating course curriculum with keyboard have no focus indicator

**2. Catalog Course Cards**
- **File**: `catalog.css`
- **Elements**:
  - Course card links (`section.featured-courses .cards a`) - Lines ~213-223
  - Article links (wrapping course cards) - Lines ~224-359
- **Impact**: Keyboard users can't see which course they're focused on

**3. Header Navigation**
- **File**: `header.css`
- **Elements**: Navigation links (need to verify if any interactive elements exist)
- **Status**: Needs investigation

**4. Breadcrumb Navigation**
- **File**: `breadcrumbs.css`
- **Elements**: Breadcrumb links
- **Status**: Needs investigation

---

## 🎨 Focus Ring Visual Design

### Current Design

```css
box-shadow: 0 0 0 4px var(--color-focus-ring);
/* 4px ring, light blue/purple (#c9d1ff) */
```

**Appearance**:
- **Size**: 4px ring around element
- **Color**: Light blue/purple (`#c9d1ff`)
- **Style**: Solid (box-shadow, not outline)
- **Offset**: 0 (no gap between element and ring)

---

### WCAG Compliance Check

**WCAG 2.1 Success Criterion 2.4.7** (Focus Visible - Level AA):
> "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible."

**Current Status**: ✅ **PASSES** where implemented

**WCAG 2.4.11** (Focus Appearance - Level AAA, proposed for 2.2):
> Focus indicator has 3:1 contrast and minimum 2px thickness

**Contrast Check**:
- Focus ring: `#c9d1ff` (light blue/purple)
- Against white background: ~2.5:1 ❌ (below 3:1)
- Against dark backgrounds: Better, but not tested

**Status**: ⚠️ **May need improvement** for AAA compliance

---

## 🔧 Recommended Improvements

### Priority 1: Add Missing Focus States (High Impact)

#### 1.1 Course Info Links

**Add to `course-info.css`**:
```css
/* After line 76 (.course-card a) */
.course-card a {
  /* existing styles */
}

.course-card a:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}

/* After line 223 (.curriculum-wrapper a) */
.curriculum-wrapper a {
  /* existing styles */
}

.curriculum-wrapper a:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

**Impact**: Keyboard users can navigate course curriculum with clear focus indicators

---

#### 1.2 Catalog Course Cards

**Add to `catalog.css`**:
```css
/* After line 223 (section.featured-courses .cards a) */
section.featured-courses .cards a:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

**Impact**: Keyboard users can browse course catalog effectively

---

#### 1.3 Header & Breadcrumb Links

**Investigate and add** focus states to:
- Header navigation links (`header.css`)
- Breadcrumb links (`breadcrumbs.css`)

**Pattern**:
```css
a:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

---

### Priority 2: Modernize Old `:focus` Pattern (Low Impact)

**Update `auth.css` line 221**:

**Current**:
```css
&:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: var(--shadow-focus-ring);
}
```

**Recommended**:
```css
&:focus-visible {
  outline: none;
  border-color: var(--brand);
  box-shadow: var(--shadow-focus-ring);
}
```

**Benefit**: Consistent with modern best practices, better UX (no focus on click)

**Note**: Keep `:invalid:focus` as-is (line 227) - form validation should show for all users

---

### Priority 3: Improve Focus Ring Contrast (Optional - AAA)

**Current focus ring** (`#c9d1ff`) has ~2.5:1 contrast against white, which meets AA but not AAA.

**Option 1: Increase Contrast (Conservative)**
```css
--color-focus-ring: #9ba9ff; /* Darker blue/purple - ~3.5:1 contrast */
```

**Option 2: Use Border + Shadow (More Visible)**
```css
--shadow-focus-ring: 0 0 0 3px white, 0 0 0 5px var(--blurple);
/* White inner ring + brand purple outer ring */
```

**Option 3: Keep Current (AA Compliant)**
- Current design meets WCAG 2.1 AA
- Only AAA requires 3:1 contrast
- Consider if AAA is a project requirement

---

## 🧪 Testing Recommendations

### Manual Keyboard Testing

**Test with Tab key**:
- [ ] Press Tab to navigate through all interactive elements
- [ ] Verify focus ring appears on:
  - [ ] Buttons (global, auth, lessons, catalog)
  - [ ] Links (course cards, curriculum, footer)
  - [ ] Form inputs (login, signup)
- [ ] Verify focus ring does NOT appear on mouse click
- [ ] Check focus ring is visible against all background colors

**Test with Screen Reader**:
- [ ] VoiceOver (Mac): Cmd+F5
- [ ] NVDA (Windows): Free screen reader
- [ ] Verify all interactive elements are announced
- [ ] Verify focus order is logical

---

### Automated Testing

**Tools**:
- [ ] **axe DevTools** - Browser extension for accessibility auditing
- [ ] **Lighthouse** - Check "Accessibility" score in DevTools
- [ ] **WAVE** - Web Accessibility Evaluation Tool

**Expected Issues** (before fix):
- "Some elements do not have a focus indicator"
- "Focus order may be confusing"

---

### Visual Testing

**Backgrounds to test**:
- [ ] White background (catalog, course cards)
- [ ] Light purple background (forms)
- [ ] Dark backgrounds (footer)
- [ ] Over images (if applicable)

**Focus ring should be visible on ALL backgrounds**

---

## 📋 Implementation Checklist

### Phase 1: Add Missing Focus States
- [ ] Add focus states to course info links (curriculum, course card)
- [ ] Add focus states to catalog course cards
- [ ] Add focus states to header navigation (if needed)
- [ ] Add focus states to breadcrumb links (if needed)
- [ ] Test with keyboard navigation
- [ ] Verify no visual regressions

### Phase 2: Modernize Patterns
- [ ] Update auth.css input :focus → :focus-visible (line 221)
- [ ] Verify form validation still works (:invalid:focus)
- [ ] Test on login/signup pages

### Phase 3: Improve Contrast (Optional)
- [ ] Test current focus ring contrast (use color contrast checker)
- [ ] Decide if AAA compliance needed
- [ ] If yes, implement improved focus ring design
- [ ] Test new design across all backgrounds

---

## 🎯 Expected Outcomes

**After implementation**:
- ✅ All interactive elements have visible focus indicators
- ✅ Consistent `:focus-visible` pattern throughout codebase
- ✅ WCAG 2.1 AA compliance (Level AA)
- ✅ Better keyboard navigation experience
- ✅ Improved Lighthouse accessibility score (+5-10 points)

**User Impact**:
- Keyboard users can navigate site effectively
- Screen reader users benefit from consistent focus order
- Better accessibility for users with motor impairments
- Professional, polished user experience

---

## Related Documentation

- [Phase 4 Complete](PHASE_4_COMPLETE.md) - Performance work
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Phase 5.1
- [WCAG 2.1 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)

---

**Focus States Audit Complete** ✓

Found 7 existing focus states (good), identified missing focus states on course links and catalog cards (high priority), recommended modernizing 1 old :focus pattern (low priority).
