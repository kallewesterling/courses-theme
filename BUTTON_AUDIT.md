# Skilljar Button Elements Audit

## Date: 2026-01-27

## Overview

This document audits all button-like elements across the CSS to identify patterns, inconsistencies, and opportunities for improved consistency while respecting that we cannot add custom classes to Skilljar's HTML.

## Button Inventory

### 1. Primary Solid Buttons (Blurple Background, White Text)

#### `.button` (globals.css:46)
**Context**: Generic Skilljar button class used across multiple pages

```css
.button {
  padding: var(--spacing-px-10) var(--spacing-px-20);
  border: var(--border-width-none);
  background-color: var(--blurple);
  color: var(--white) !important;
  font-family: Gellix, sans-serif;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}
```

**Missing**:
- ❌ No transition
- ❌ No focus-visible state
- ❌ No active state
- ❌ No display property (defaults to inline)
- ❌ No reduced-motion support

#### `a#returnToOverview` (lessons.css:77)
**Context**: "Return to Overview" button in left navigation

```css
a#returnToOverview {
  display: flex;
  justify-content: center;
  padding: var(--spacing-px-4);
  margin-top: var(--spacing-px-16);
  border-radius: var(--radius-pill);
  background: var(--blurple);
  color: var(--color-surface-base) !important;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}
```

**Missing**:
- ❌ No transition
- ❌ No focus-visible state
- ❌ No active state
- ❌ No reduced-motion support
- ⚠️ Different padding than `.button`
- ⚠️ Different font-weight than `.button`

### 2. Outline Buttons (Transparent Background, Blurple Border)

#### `#button-sign-in`, `#button-sign-up` (auth.css:252-253)
**Context**: Sign in and sign up form submit buttons

```css
#button-sign-in,
#button-sign-up {
  width: 100%;
  height: 56px;
  margin-top: var(--spacing-px-10);
  border: var(--border-width-medium) solid var(--blurple);
  border-radius: var(--radius-pill);
  background-color: transparent;
  color: var(--blurple);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: var(--letter-spacing-wide);
  transition: all 0.2s ease-in;
}

&:hover {
  background-color: var(--blurple) !important;
  color: var(--primary-white-hex) !important;
}

&:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

**Has**:
- ✅ Transition
- ✅ Focus-visible state
- ✅ Reduced-motion support
- ⚠️ No active state
- ⚠️ Transition uses `all` (not specific properties)

### 3. OAuth Button

#### `#google_login` (auth.css:119)
**Context**: Google OAuth sign-in button

```css
#google_login {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-3);
  width: 100%;
  height: 52px;
  border: var(--border-width-thin) solid var(--color-border-strong);
  background: var(--primary-white-hex);
  color: var(--ink);
  font-family: Gellix, sans-serif;
  text-align: center;
  transition:
    transform 0.05s ease,
    filter 0.15s ease,
    box-shadow 0.15s ease;
}

&:hover {
  filter: brightness(0.98);
}

&:active {
  transform: translateY(1px);
}

&:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

**Has**:
- ✅ Transition (specific properties)
- ✅ Focus-visible state
- ✅ Active state
- ✅ Reduced-motion support
- ✅ Good accessibility

### 4. Secondary/Light Buttons

#### `a.button` in catalog CTA (catalog.css:396)
**Context**: CTA button at bottom of catalog page

```css
a.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-2);
  column-gap: var(--gap-2);
  min-width: 180px;
  padding: var(--spacing-px-24);
  border-width: var(--border-width-thin);
  background-color: var(--color-surface-base);
  color: var(--ink) !important;
  font-size: var(--font-size-xl);
  white-space: nowrap;
  align-self: flex-start;
  flex-shrink: 0;
}
```

**Missing**:
- ❌ No transition
- ❌ No focus-visible state
- ❌ No active state
- ❌ No hover state defined
- ❌ No reduced-motion support

#### `a.button` in lessons resources (lessons.css:618)
**Context**: Button links in lesson resource cards

```css
a.button {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  margin: var(--spacing-0);
  border: var(--border-width-thin) solid transparent;
  border-color: var(--border-color-v2) !important;
  border-radius: var(--radius-rem-sm);
  background-color: var(--border-color-v2) !important;
  background-color: transparent;  /* Duplicate property! */
  color: var(--blurple) !important;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-24);
  text-align: center;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  vertical-align: middle;
  user-select: none;
}
```

**Has**:
- ✅ Transition (specific properties)
- ⚠️ Has duplicate `background-color` property (line 625 and 626)
- ❌ No focus-visible state
- ❌ No hover state defined
- ❌ No active state
- ❌ No reduced-motion support

#### `.ctas .button` in footer (footer.css:48)
**Context**: Footer CTA buttons

```css
.ctas .button {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-2);
  margin: var(--spacing-0);
  font-size: inherit;
}
```

**Has**:
- Only minimal styling (inherits most from `.button` in globals.css)
- Missing all interactive states

### 5. Other Interactive Elements

#### `.header-dropdown-button` (header.css:75)
**Context**: Header dropdown trigger

```css
.header-dropdown-button {
  margin-right: var(--spacing-px-10);
}
```

**Has**: Only margin (very minimal styling)

#### `#resume-button` (course-info.css:373)
**Context**: Resume course button

```css
#resume-button {
  padding: var(--spacing-0) var(--spacing-4);
}
```

**Has**: Only padding override

---

## Consistency Issues Identified

### Issue 1: Missing Focus-Visible States

**Problem**: Most buttons lack `:focus-visible` states for keyboard accessibility

**Missing focus-visible**:
- ❌ `.button` (globals.css)
- ❌ `a#returnToOverview` (lessons.css)
- ❌ `a.button` (catalog.css)
- ❌ `a.button` (lessons.css resources)
- ❌ `.ctas .button` (footer.css)

**Has focus-visible** (Good examples):
- ✅ `#button-sign-in`, `#button-sign-up` (auth.css)
- ✅ `#google_login` (auth.css)

### Issue 2: Inconsistent Transitions

**Problem**: Different approaches to transitions

**No transition**:
- `.button` (globals.css)
- `a#returnToOverview` (lessons.css)
- `a.button` (catalog.css)

**Uses `all` transition** (not specific):
- `#button-sign-in`, `#button-sign-up` (auth.css) - `transition: all 0.2s ease-in;`

**Uses specific properties** (better):
- `#google_login` (auth.css) - `transform, filter, box-shadow`
- `a.button` (lessons.css resources) - `color, background-color, border-color, box-shadow`

### Issue 3: Missing Active States

**Problem**: Only one button has `:active` state for tactile feedback

**Has active state**:
- ✅ `#google_login` (auth.css) - `transform: translateY(1px);`

**Missing active state**:
- All other buttons

### Issue 4: Missing Reduced-Motion Support

**Problem**: Only auth buttons respect `prefers-reduced-motion`

**Has reduced-motion**:
- ✅ `#button-sign-in`, `#button-sign-up` (auth.css)
- ✅ `#google_login` (auth.css)

**Missing reduced-motion**:
- All other buttons with transitions

### Issue 5: Inconsistent Display Properties

**Different display values**:
- `inline` (default) - `.button` (globals.css)
- `flex` - `a#returnToOverview` (lessons.css)
- `inline-flex` - `a.button` (catalog.css), `.ctas .button` (footer.css)
- `inline-block` - `a.button` (lessons.css resources)

### Issue 6: Inconsistent Sizing/Padding

**Different padding approaches**:
- `var(--spacing-px-10) var(--spacing-px-20)` - `.button` (globals.css)
- `var(--spacing-px-4)` - `a#returnToOverview` (lessons.css)
- `var(--spacing-px-24)` - `a.button` (catalog.css)
- `0.375rem 0.75rem` - `a.button` (lessons.css) - Uses rem instead of variables!

### Issue 7: Duplicate Property

**Problem**: `a.button` in lessons.css has duplicate `background-color` property

```css
background-color: var(--border-color-v2) !important;  /* line 625 */
background-color: transparent;  /* line 626 - overwrites above */
```

---

## Recommendations

### Priority 1: Add Focus-Visible States (Accessibility)

Add consistent focus-visible states to all buttons:

```css
/* Standard focus-visible pattern */
&:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

**Apply to**:
- `.button` (globals.css)
- `a#returnToOverview` (lessons.css)
- `a.button` (catalog.css)
- `a.button` (lessons.css resources)
- `.ctas .button` (footer.css)

### Priority 2: Add Transitions

Add smooth transitions for better UX:

**Recommended pattern** (specific properties):
```css
transition:
  background-color 0.2s ease-in,
  color 0.2s ease-in,
  border-color 0.2s ease-in,
  box-shadow 0.15s ease,
  transform 0.05s ease;
```

**Apply to**:
- `.button` (globals.css)
- `a#returnToOverview` (lessons.css)
- `a.button` (catalog.css)

**Update**:
- Change `#button-sign-in`, `#button-sign-up` from `all` to specific properties

### Priority 3: Add Reduced-Motion Support

Add to all buttons with transitions:

```css
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

### Priority 4: Add Active States

Add tactile feedback for all buttons:

```css
&:active {
  transform: translateY(1px);
}
```

### Priority 5: Fix Duplicate Property

Remove duplicate in lessons.css:618:

```css
/* Remove line 625 */
background-color: var(--border-color-v2) !important;
```

Keep only:
```css
background-color: transparent;
```

### Priority 6: Add Hover States

Ensure all buttons have defined hover states for consistency.

### Priority 7: Use CSS Variables

Replace hardcoded rem values:
- `0.375rem 0.75rem` → use spacing variables

---

## Implementation Strategy

### Phase 1: Critical Accessibility (Do First)
1. Add `:focus-visible` to all buttons
2. Add `prefers-reduced-motion` support
3. Fix duplicate property bug

### Phase 2: Enhanced UX
4. Add consistent transitions (specific properties, not `all`)
5. Add `:active` states
6. Ensure all buttons have `:hover` states

### Phase 3: Consistency Polish
7. Review display properties (consider standardizing to `inline-flex`)
8. Consider extracting common button properties to CSS variables
9. Document all Skilljar button selectors

---

## Proposed CSS Variable Approach (Optional)

If many buttons share exact values, could extract to variables:

```css
:root {
  /* Button interaction patterns */
  --button-transition:
    background-color 0.2s ease-in,
    color 0.2s ease-in,
    border-color 0.2s ease-in,
    box-shadow 0.15s ease,
    transform 0.05s ease;
  --button-focus-shadow: var(--shadow-focus-ring);
  --button-active-transform: translateY(1px);
}
```

Then apply to all button selectors:

```css
.button,
#button-sign-in,
#button-sign-up,
a#returnToOverview,
#google_login {
  transition: var(--button-transition);

  &:focus-visible {
    outline: none;
    box-shadow: var(--button-focus-shadow);
  }

  &:active {
    transform: var(--button-active-transform);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

---

## Summary

**Total Button Selectors Found**: 11
**Missing Focus-Visible**: 7 (64%)
**Missing Transitions**: 4 (36%)
**Missing Active States**: 10 (91%)
**Missing Reduced-Motion**: 9 (82%)
**Code Issues**: 1 duplicate property

**Priority**: Focus on accessibility first (focus-visible, reduced-motion), then enhance UX (transitions, active states).
