# Motion Preferences Accessibility Audit

## Date: 2026-01-28

## Overview

Comprehensive audit of `@media (prefers-reduced-motion)` usage to ensure animations and transitions respect user preferences. WCAG 2.1 Level AAA requires respecting user motion preferences.

---

## 🎯 WCAG 2.1 Standards

### Success Criterion 2.3.3 (Level AAA)

**Animation from Interactions**: Motion animation triggered by interaction can be disabled, unless the animation is essential.

**User Preference**: `prefers-reduced-motion: reduce` media query allows users to signal that they prefer minimal animation.

**Our Target**: Level AAA compliance (best practice)

---

## 📊 Motion Analysis Summary

### Totals

| Category | Count | Status |
|----------|-------|--------|
| **Total Transitions** | 13 unique | 7 covered, 5 missing, 1 duplicate |
| **Total Animations** | 1 | 0 covered, 1 missing |
| **Files with Reduced Motion** | 4 | globals, catalog, lessons, auth, animations |
| **Files Needing Updates** | 3 | catalog, lessons, auth |

---

## ✅ PASSES - Existing Reduced Motion Support

### 1. Global Button Transitions

**File**: `globals.css` line 54

**Transition**:
```css
button {
  transition: var(--transition-button-simple);
  /* Expands to: background-color 0.2s ease-in, color 0.2s ease-in */
}
```

**Reduced Motion Support** (line 70-72):
```css
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

**Status**: ✅ Covered

---

### 2. Catalog CTA Button

**File**: `catalog.css` line 427

**Transition**:
```css
.catalog-cta a {
  transition: var(--transition-button-full);
  /* Expands to: background 0.2s ease-in, color 0.2s ease-in, transform 0.05s ease-out, box-shadow 0.2s ease */
}
```

**Reduced Motion Support** (line 443-445):
```css
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

**Status**: ✅ Covered

---

### 3. Lessons Menu Button

**File**: `lessons.css` line 111

**Transition**:
```css
.lesson-menu-button {
  transition: var(--transition-button-minimal);
  /* Expands to: background-color 0.2s ease-in, opacity 0.15s ease */
}
```

**Reduced Motion Support** (line 126-128):
```css
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

**Status**: ✅ Covered

---

### 4. Lessons Resource Buttons

**File**: `lessons.css` line 677

**Transition**:
```css
.resource-button {
  transition: var(--transition-resource-button);
  /* Expands to: color 0.15s ease-in-out, background-color 0.15s ease-in-out, transform 0.05s ease-out, box-shadow 0.2s ease */
}
```

**Reduced Motion Support** (line 695-697):
```css
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

**Status**: ✅ Covered

---

### 5. Auth Icon Button

**File**: `auth.css` line 131

**Transition**:
```css
.auth-icon-button {
  transition: var(--transition-icon-button);
  /* Expands to: transform 0.05s ease, background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease */
}
```

**Reduced Motion Support** (line 137-139):
```css
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

**Status**: ✅ Covered

---

### 6. Auth Submit Button

**File**: `auth.css` line 257

**Transition**:
```css
.auth-submit {
  transition: var(--transition-button-full);
  /* Expands to: background 0.2s ease-in, color 0.2s ease-in, transform 0.05s ease-out, box-shadow 0.2s ease */
}
```

**Reduced Motion Support** (line 277-279):
```css
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

**Status**: ✅ Covered

---

### 7. Completion Popup Overlay

**File**: `completion.css` line 8

**Transition**:
```css
#completion-popup {
  transition: opacity 0.2s ease-in;
}
```

**Reduced Motion Support** (animations.css line 18-20):
```css
@media (prefers-reduced-motion: reduce) {
  #completion-popup {
    transition: none;
  }
}
```

**Status**: ✅ Covered (handled in animations.css)

**Note**: This is an interesting pattern - the transition is defined in completion.css but the reduced motion override is in animations.css. This works but could be more maintainable if co-located.

---

## ⚠️ MISSING - Transitions Without Reduced Motion Support

### 1. Catalog Course Card Hover (High Priority)

**File**: `catalog.css` line 239-241

**Context**: Course card hover effect on catalog page

**Current Code**:
```css
section.featured-courses .cards a article {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);
  }
}
```

**Effect**: Card lifts up 4px and shadow increases on hover

**Accessibility Impact**: ⚠️ Users with vestibular disorders may experience discomfort from moving elements

**Recommended Fix**:
```css
section.featured-courses .cards a article {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none; /* No movement */
      /* Keep shadow for visual feedback */
    }
  }
}
```

---

### 2. Lesson Button Hover (High Priority)

**File**: `lessons.css` line 308-310

**Context**: Lesson navigation buttons (Previous/Next)

**Current Code**:
```css
.lesson-btn {
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}
```

**Effect**: Button scales down slightly when clicked (active state)

**Accessibility Impact**: ⚠️ Scale transform can be disorienting for users sensitive to motion

**Recommended Fix**:
```css
.lesson-btn {
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none; /* No scale */
      /* Keep box-shadow change for visual feedback */
    }
  }
}
```

---

### 3. Tooltip Opacity Transitions (Medium Priority)

**File**: `lessons.css` line 541, 588

**Context**: Tooltips showing answer correctness

**Current Code (line 541)**:
```css
.answer-option:hover::after {
  content: "Correct!";
  opacity: 1;
  transition: opacity 0.2s ease-in;
}
```

**Current Code (line 588)**:
```css
.answer-option.incorrect:hover::after {
  content: "Try again!";
  opacity: 0;
  transition: opacity 0.2s ease-in;
}
```

**Effect**: Tooltips fade in/out

**Accessibility Impact**: ⚠️ Fading effects can be problematic for users with motion sensitivity

**Recommended Fix**:
```css
.answer-option:hover::after {
  content: "Correct!";
  opacity: 1;
  transition: opacity 0.2s ease-in;

  @media (prefers-reduced-motion: reduce) {
    transition: none; /* Instant appearance */
  }
}

.answer-option.incorrect:hover::after {
  content: "Try again!";
  opacity: 0;
  transition: opacity 0.2s ease-in;

  @media (prefers-reduced-motion: reduce) {
    transition: none; /* Instant appearance */
  }
}
```

---

### 4. Auth Form Input (Low Priority)

**File**: `auth.css` line 204

**Context**: Login/signup form inputs

**Current Code**:
```css
input[type="text"],
input[type="password"],
input[type="email"] {
  transition: var(--transition-input);
  /* Expands to: border-color 0.15s ease, box-shadow 0.15s ease */

  &:focus-visible {
    border-color: var(--brand);
    box-shadow: var(--shadow-focus-ring);
  }
}
```

**Effect**: Border color and focus ring fade in on focus

**Accessibility Impact**: ℹ️ Low impact - color transitions are generally less problematic than transforms/animations

**Recommended Fix**:
```css
input[type="text"],
input[type="password"],
input[type="email"] {
  transition: var(--transition-input);

  &:focus-visible {
    border-color: var(--brand);
    box-shadow: var(--shadow-focus-ring);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none; /* Instant focus appearance */
  }
}
```

**Alternative**: Could skip this fix as color transitions have minimal accessibility impact. However, for completeness and consistency, recommend adding.

---

## ⚠️ MISSING - Animations Without Reduced Motion Support

### 1. Cursor Blink Animation (Medium Priority)

**File**: `catalog.css` line 179

**Context**: Blinking cursor effect in "Securing..." text animation

**Current Code**:
```css
.catalog-hero::after {
  content: "|";
  background-color: var(--color-brand-blurple);
  transform: translate(7px, 3px);
  animation: cursor-blink 1.5s steps(1) infinite;
}
```

**Animation Definition** (animations.css line 1-9):
```css
@keyframes cursor-blink {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}
```

**Effect**: Cursor blinks on/off every 1.5 seconds

**Accessibility Impact**: ⚠️ Blinking/flashing can trigger vestibular disorders or migraines

**Recommended Fix**:
```css
.catalog-hero::after {
  content: "|";
  background-color: var(--color-brand-blurple);
  transform: translate(7px, 3px);
  animation: cursor-blink 1.5s steps(1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none; /* Stop blinking */
    opacity: 1; /* Keep cursor visible but static */
  }
}
```

---

## 📋 Implementation Checklist

### Phase 1: High Priority Fixes

**Course Card Hover** (catalog.css):
- [ ] Add `@media (prefers-reduced-motion: reduce)` to catalog.css line ~239
- [ ] Disable transform, keep box-shadow for feedback

**Lesson Button** (lessons.css):
- [ ] Add `@media (prefers-reduced-motion: reduce)` to lessons.css line ~308
- [ ] Disable transform, keep box-shadow for feedback

---

### Phase 2: Medium Priority Fixes

**Cursor Blink Animation** (catalog.css):
- [ ] Add `@media (prefers-reduced-motion: reduce)` to catalog.css line ~179
- [ ] Stop animation, set static opacity

**Tooltip Opacity** (lessons.css):
- [ ] Add `@media (prefers-reduced-motion: reduce)` to lessons.css line ~541
- [ ] Add `@media (prefers-reduced-motion: reduce)` to lessons.css line ~588
- [ ] Make opacity changes instant

---

### Phase 3: Low Priority Fixes (Optional)

**Form Input Transitions** (auth.css):
- [ ] Add `@media (prefers-reduced-motion: reduce)` to auth.css line ~204
- [ ] Make focus changes instant

---

### Phase 4: Code Quality (Optional)

**Consolidate Completion Popup**:
- [ ] Consider moving `@media` from animations.css to completion.css
- [ ] Co-locate reduced motion with transition definition
- [ ] Improves maintainability (but not required)

---

## 🧪 Testing Recommendations

### Browser Testing

**Enable Reduced Motion**:
- **macOS**: System Preferences → Accessibility → Display → Reduce motion
- **Windows**: Settings → Ease of Access → Display → Show animations
- **iOS**: Settings → Accessibility → Motion → Reduce Motion
- **Android**: Settings → Accessibility → Remove animations

**Chrome DevTools**:
1. Open DevTools (F12)
2. Command Palette (Cmd+Shift+P)
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

---

### Manual Testing Checklist

**With Reduced Motion Disabled** (default):
- [ ] Course cards lift on hover (catalog page)
- [ ] Lesson buttons scale on click
- [ ] Tooltips fade in/out
- [ ] Form inputs transition focus states
- [ ] Cursor blinks in hero section

**With Reduced Motion Enabled**:
- [ ] Course cards do NOT lift (no transform)
- [ ] Course cards still show shadow change (visual feedback preserved)
- [ ] Lesson buttons do NOT scale (no transform)
- [ ] Tooltips appear instantly (no fade)
- [ ] Form inputs change instantly (no transition)
- [ ] Cursor does NOT blink (static)

---

## 📊 Expected Outcomes

### Before Implementation

| Category | Count | Status |
|----------|-------|--------|
| ✅ Transitions with reduced motion | 7 | Good coverage |
| ⚠️ Transitions missing reduced motion | 5 | Needs fixing |
| ⚠️ Animations missing reduced motion | 1 | Needs fixing |
| **Overall Coverage** | **~54%** | ⚠️ Needs improvement |

---

### After Implementation

| Category | Count | Status |
|----------|-------|--------|
| ✅ Transitions with reduced motion | 12 | ✅ Excellent |
| ✅ Animations with reduced motion | 1 | ✅ Complete |
| ⚠️ Missing coverage | 0 | ✅ None |
| **Overall Coverage** | **100%** | ✅ Compliant |

---

## 🎯 Accessibility Impact

### Users Benefiting

**Vestibular Disorders**:
- Reduced risk of dizziness, nausea from motion effects
- Transforms (movement) are most problematic - highest priority

**Migraine Sufferers**:
- Blinking/flashing animations can trigger migraines
- Cursor blink animation should be disabled

**ADHD/Attention Issues**:
- Motion can be distracting
- Reduced motion helps focus on content

**General Preference**:
- Some users simply prefer less motion
- Respecting user preferences is good UX

---

### WCAG Compliance

**Before Fixes**:
- **WCAG 2.3.3 (AAA)**: ⚠️ Partial compliance (~54%)
- Some animations/transitions respect preferences
- Others do not

**After Fixes**:
- **WCAG 2.3.3 (AAA)**: ✅ Full compliance (100%)
- All motion respects user preferences
- Visual feedback preserved (shadows, colors)
- No functionality lost

---

## 📝 Best Practices

### Pattern to Follow

**Standard Approach**:
```css
.element {
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-elevated);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none; /* Disable movement */
      /* Keep box-shadow for visual feedback */
    }
  }
}
```

**Key Principles**:
1. Disable `transition` to make changes instant
2. Disable `transform` to prevent movement
3. Keep color/shadow changes for visual feedback
4. Preserve functionality (element still clickable, focusable)

---

### What to Disable

**Always Disable**:
- ✅ `transform` (translateX/Y, scale, rotate)
- ✅ Blinking/flashing animations
- ✅ Infinite animations

**Consider Disabling**:
- ⚠️ Opacity transitions (fade in/out)
- ⚠️ Long duration transitions (>300ms)

**Usually Keep**:
- ✅ Color transitions (low impact)
- ✅ Box-shadow transitions (depth cues)
- ✅ Border-color transitions (focus states)

---

## 🔗 Related Documentation

- [Focus States Implementation](FOCUS_STATES_IMPLEMENTATION.md) - Phase 5.1 complete
- [Color Contrast Implementation](COLOR_CONTRAST_IMPLEMENTATION.md) - Phase 5.2 complete
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Phase 5.3
- [WCAG 2.3.3 Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)

---

## ✅ Summary

**Motion Preferences Audit Complete**

Found 13 transitions and 1 animation in the codebase:
- ✅ 7 transitions already have reduced motion support (54%)
- ⚠️ 5 transitions missing support (high/medium priority)
- ⚠️ 1 animation missing support (medium priority)

**Recommended Fixes**: Add `@media (prefers-reduced-motion: reduce)` to 6 locations across 3 files (catalog.css, lessons.css, auth.css).

**Impact**: Achieves 100% WCAG 2.3.3 (AAA) compliance for motion preferences.

---

**Motion Preferences Audit Complete** ✓

Ready to proceed with implementation.
