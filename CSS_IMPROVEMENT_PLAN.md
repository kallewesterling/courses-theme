# CSS Improvement Plan: Chainguard Courses Theme v3.0

**Date:** 2026-01-26
**Total CSS Lines:** 3,358 lines across 16 files
**Main Entry:** `production/style.css` (imports all CSS files)

---

## Executive Summary

The CSS codebase is well-organized with a clear separation between partials (variables, fonts, animations) and component-specific styles. However, there are critical issues including duplicate CSS custom properties, large monolithic files, and opportunities for better organization, maintainability, and performance.

---

## Critical Issues (Fix Immediately)

### 1. CRITICAL: Duplicate CSS Custom Properties in `_colors.css` (Priority: CRITICAL)

**Current Issue:**
The `_colors.css` file has **THREE complete `:root` declarations** with duplicate and conflicting values:

- **Lines 3-98:** First `:root` block (old brand colors + new brand colors mixed)
- **Lines 100-162:** Second `:root` block (exact duplicate of most variables)
- **Lines 165-178:** Third `:root` block (login page styling)

**Problems:**
- Variables defined multiple times (e.g., `--primary-blue` defined 3 times)
- Some variables have different values in different blocks (e.g., `--card-bg: #F8F6FE` on line 51 vs `--card-bg: #faf7ff` on line 148)
- Confusing which value actually takes effect (later declarations override)
- Maintenance nightmare
- Larger file size

**Affected Variables with Different Values:**
```css
/* Line 51 */
--card-bg: #F8F6FE;

/* Line 148 - Different value! */
--card-bg: #faf7ff;
```

**Recommendation:**

**Immediate Action Required:**

```css
/* _colors.css - CLEANED UP VERSION */

:root {
  /* ====================================
     NEW BRAND COLORS (2025)
     ==================================== */

  /* Brand (Non-text) */
  --blurple: rgb(98, 38, 251);
  --light-blurple: rgb(241, 236, 254);
  --aqua: rgb(43, 186, 253);
  --light-aqua: rgb(223, 244, 254);
  --fuschia: rgb(253, 43, 242);
  --light-fuschia: rgb(253, 223, 252);
  --lime: rgb(68, 253, 43);
  --light-lime: rgb(233, 252, 234);
  --solar: rgb(253, 57, 100);
  --light-solar: rgb(252, 224, 224);

  /* Brand (Text) */
  --blurple-text: rgb(0, 160, 235);
  --aqua-text: rgb(4, 189, 19);
  --fuschia-text: rgb(246, 4, 64);
  --lime-text: rgb(98, 38, 251);
  --solar-text: rgb(235, 2, 224);

  /* Neutral */
  --ink: rgb(13, 22, 28);
  --ink-90: rgb(13, 22, 28, 0.9);
  --ink-70: rgb(13, 22, 28, 0.7);
  --ink-40: rgb(13, 22, 28, 0.4);
  --ink-10: rgb(13, 22, 28, 0.1);
  --ink-5: rgb(13, 22, 28, 0.05);
  --ink-dim: #0f1020b3; /* 70% opacity */
  --white: rgb(255, 255, 255);
  --neutral-border: rgb(218, 218, 218);

  /* ====================================
     LEGACY COLORS (Kept for backward compatibility)
     Consider migrating away from these
     ==================================== */

  /* Primary Colors (RGB values without rgb() for use with opacity) */
  --primary-blue: 52 67 244;
  --primary-blue-hex: #3443f4;
  --primary-cyan: 122 240 254;
  --primary-cyan-hex: #7af0fe;
  --primary-dark-purple: 20 0 61;
  --primary-dark-purple-hex: #14003d;
  --primary-white: 255 255 255;
  --primary-white-hex: #fff;

  /* Secondary Colors */
  --secondary-pink: 254 199 254;
  --secondary-violet: 117 69 251;
  --secondary-gray: 208 207 238;
  --secondary-light-gray: 250 250 253;
  --secondary-light-gray-hex: #fafafd;

  /* Tertiary Colors */
  --tertiary-light-green: 129 254 160;
  --tertiary-dark-green: 1 161 120;
  --tertiary-orange: 254 91 60;
  --tertiary-yellow: 246 235 97;

  /* ====================================
     UI COLORS
     ==================================== */

  --card-bg: #faf7ff; /* Light lavender background */
  --separator: #d8d5e0;
  --icon-border: #804aac24; /* Faint purple border */
  --answer-option: #1c1c1c;
  --border-color: #3443f4;
  --border-color-v2: #e5e3ea;
  --list-bullet-color: #3443f4;
  --error-color: #fe5b3c;
  --ring: #c9d1ff; /* Focus halo */

  /* Form Colors */
  --form-bg: #d0cfee;
  --label-color: #7545fb;
  --placeholder-color: #14003d;

  /* Button Colors */
  --cta-bg: transparent;
  --cta-border: 2px solid #3443f4;
  --cta-text-color: #14003d;

  /* Background & Text */
  --primary-bg: 255, 255, 255;
  --primary-text: 28, 28, 28;
  --paper: #ffffff;

  /* Gradients */
  --gradient-start: #fde1fe;
  --gradient-end: #f5f6fe;
  --gradient-angle: 315deg;
  --grad: linear-gradient(90deg, #57c6ff 0%, #5b6bff 50%, #813df3 100%);

  /* Misc */
  --detail-medium-contrast: rgb(234, 234, 234);
  --text-high-contrast-rgb-value: 49, 49, 49;
  --detail-medium-contrast-rgb-value: 234, 234, 234;
  --slider-btn-disabled: rgba(52, 67, 244, 0.4);
  --nav-link-hover: 208 207 238;

  /* ====================================
     LAYOUT & SPACING
     ==================================== */

  /* Spacing Scale */
  --space-1: 8px;
  --space-2: 12px;
  --space-3: 16px;
  --space-4: 20px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
  --space-section-ends: 80px;

  /* Border Radius */
  --radius-1: 14px;
  --radius-2: 16px;
  --radius-md: 14px;
  --radius-xl: 20px;
  --primary-border-radius: 20px;

  /* Max Widths */
  --w-max: 1168px; /* Match "max-w-section-v2" feel */
  --max-width: 1444px;
  --max-width-v2: 1402px;

  /* Shadows */
  --shadow: 0 12px 30px rgba(20, 0, 61, 0.08);
}
```

**Action Items:**
1. ✅ **Delete lines 100-162** (duplicate `:root` block)
2. ✅ **Consolidate lines 165-178** (login styling) into main `:root`
3. ✅ **Document which `--card-bg` value is correct** (#F8F6FE vs #faf7ff)
4. ✅ **Add comments** to organize sections
5. ✅ **Remove truly unused legacy variables** after auditing usage

**Estimated Effort:** 1-2 hours

---

## High Priority Issues

### 2. Break Down Large `lessons.css` File (Priority: HIGH)

**Current Issue:**
- `lessons.css` is **893 lines** - the largest CSS file
- Mixes multiple concerns: lesson content, navigation, code blocks, resources, etc.
- Hard to maintain and find specific styles

**Recommendation:**

Split into focused files:

```
/css/
  /lesson/
    lesson-layout.css      # Main layout, wrapper styles (~150 lines)
    lesson-navigation.css  # Left nav, lesson floater, buttons (~200 lines)
    lesson-content.css     # Content area, typography, images (~150 lines)
    lesson-code.css        # Code blocks, syntax highlighting (~200 lines)
    lesson-resources.css   # Resource boxes and cards (~100 lines)
```

Update `style.css`:
```css
/* Lessons - split into logical parts */
@import url("css/lesson/lesson-layout.css");
@import url("css/lesson/lesson-navigation.css");
@import url("css/lesson/lesson-content.css");
@import url("css/lesson/lesson-code.css");
@import url("css/lesson/lesson-resources.css");
```

**Benefits:**
- Easier to find and modify styles
- Parallel development (different devs can work on different files)
- Better organization
- Smaller individual files

**Estimated Effort:** 2-3 hours

---

### 3. Extract Magic Values to CSS Variables (Priority: HIGH)

**Current Issue:**
Many hardcoded values scattered throughout:

**Examples:**

```css
/* header.css:8 */
border-bottom: 1px solid #d5d4d4 !important;
/* Should use: var(--neutral-border) or new variable */

/* header.css:127 */
font-size: 16px;
/* Should use: var(--font-size-base) or spacing scale */

/* lessons.css:52 */
width: 292px;
/* Should use: var(--sidebar-width) */

/* catalog.css:235 */
border: 1px solid #04bd13; /* lime */
/* Should use: var(--lime-border) */

/* Various files */
Multiple hardcoded border-radius: 999px, 20px, 16px, etc.
Multiple hardcoded z-index values: 5, 200, -7, etc.
```

**Recommendation:**

Add new variables to `_colors.css` (or create new `_variables.css`):

```css
/* _variables.css */
:root {
  /* Typography Scale */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  --font-size-6xl: 3.75rem;   /* 60px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Layout Dimensions */
  --header-height: 60px;
  --header-height-mobile: 45px;
  --sidebar-width: 292px;
  --sidebar-width-mobile: 320px;

  /* Z-Index Scale (prevent z-index wars) */
  --z-background: -1;
  --z-normal: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;

  /* Border Widths */
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* Status Colors */
  --status-success: #04bd13;      /* lime */
  --status-success-bg: #04bd133d;
  --status-success-border: #04bd13a6;
  --status-in-progress: #fd3964;  /* solar */
  --status-in-progress-bg: #fd396421;
  --status-in-progress-border: #fd396480;
  --status-warning: #f59e0b;
  --status-error: var(--error-color);

  /* Pill Border Radius (very common) */
  --radius-pill: 999px;
}
```

**Then update usage:**

```css
/* Before */
.headers {
  height: 60px;
  z-index: 5;
}

/* After */
.headers {
  height: var(--header-height);
  z-index: var(--z-fixed);
}
```

**Benefits:**
- Consistent values across codebase
- Easy to change globally
- Self-documenting (variable names explain purpose)
- Easier theming

**Estimated Effort:** 3-4 hours

---

### 4. Consolidate Duplicate Selectors (Priority: MEDIUM)

**Current Issue:**
Some selectors appear in multiple files or multiple times in same file.

**Examples:**

```css
/* globals.css:28-33 */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* This could be used via utility class instead of inline */
```

```css
/* Multiple files have media queries with same breakpoints */
@media screen and (max-width: 767px) { ... }
@media screen and (max-width: 690px) { ... }
@media screen and (max-width: 808px) { ... }
```

**Recommendation:**

1. **Create breakpoint variables:**

```css
/* _variables.css */
:root {
  /* Breakpoints (for use in media queries) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Custom breakpoints used in current code */
  --breakpoint-mobile-header: 690px;
  --breakpoint-tablet: 808px;
  --breakpoint-nav-collapse: 991px;
}
```

**Note:** CSS variables don't work in media queries, but this documents the breakpoints. Consider using a CSS preprocessor (Sass/PostCSS) or CSS container queries for better breakpoint management.

2. **Create utility classes file:**

```css
/* _utilities.css */

/* Text Selection */
.no-select {
  user-select: none; /* Modern browsers handle prefixes */
}

/* Visibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hidden {
  display: none !important;
}

/* Spacing Utilities (if needed) */
.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
/* ... etc */
```

**Benefits:**
- DRY (Don't Repeat Yourself)
- Smaller CSS file size
- Consistent breakpoints
- Reusable utility classes

**Estimated Effort:** 2-3 hours

---

## Medium Priority Issues

### 5. Improve Media Query Organization (Priority: MEDIUM)

**Current Issue:**
- Media queries scattered throughout files
- Some components have multiple disconnected media query blocks
- Hard to understand responsive behavior

**Example from `lessons.css`:**

```css
/* Lines 59-74: First mobile styles */
@media screen and (max-width: 767px) {
  /* ... */
}

/* Lines 108-110: Second mobile styles for same component */
@media screen and (max-width: 991px) {
  color: var(--answer-option);
}
```

**Recommendation:**

**Option A: Mobile-First Approach** (Recommended)

```css
/* lesson-navigation.css - AFTER REFACTOR */

/* Base styles (mobile first) */
.lesson-nav {
  width: 100%;
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .lesson-nav {
    width: 292px;
    padding: 20px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .lesson-nav {
    width: 320px;
    padding: 24px;
  }
}
```

**Option B: CSS Container Queries** (Modern approach)

```css
/* Use container queries where supported */
.lesson-container {
  container-type: inline-size;
  container-name: lesson;
}

@container lesson (min-width: 768px) {
  .lesson-nav {
    width: 292px;
  }
}
```

**Benefits:**
- Better mobile performance
- Clearer responsive logic
- Modern approach with container queries

**Estimated Effort:** 2-3 hours

---

### 6. Document `!important` Usage (Priority: LOW)

**Current Context:**
The theme has 61 `!important` declarations across files. These are **necessary and appropriate** because they override Skilljar's platform CSS that's injected at runtime and not visible in this codebase.

**Examples of Justified Usage:**

```css
/* globals.css:36 - Override Skilljar link colors */
a {
  color: var(--blurple) !important;
}

/* lessons.css:7 - Hide Skilljar footer */
#lp-footer {
  display: none !important;
}

/* header.css:9 - Override Skilljar header background */
background-color: var(--white) !important;
```

**Why This Is OK:**
- ✅ Overriding third-party platform CSS (Skilljar)
- ✅ Platform may use inline styles or high-specificity selectors
- ✅ `!important` is the correct tool for this use case
- ✅ Not fighting against your own styles

**Recommendation:**

Rather than reducing `!important` usage, **document it** for maintainability:

1. **Add comments for Skilljar overrides:**

```css
/* Override Skilljar platform styles */
.headers {
  border-bottom: 1px solid #d5d4d4 !important;
  background-color: var(--white) !important;
}

/* Hide Skilljar elements */
#lp-footer {
  display: none !important;
}

/* Preserve custom styling over Skilljar defaults */
a {
  color: var(--blurple) !important;
}
```

2. **Optional: Create sections in CSS files:**

```css
/* ==========================================
   SKILLJAR PLATFORM OVERRIDES
   These !important declarations override
   platform CSS injected by Skilljar
   ========================================== */

.headers {
  background-color: var(--white) !important;
}

/* ... more overrides ... */

/* ==========================================
   CUSTOM STYLES
   ========================================== */

.custom-component {
  /* styles without !important */
}
```

3. **Document in CSS Architecture docs:**

Add to CSS documentation:
```markdown
## !important Usage

This theme uses `!important` declarations to override Skilljar's
platform CSS. This is necessary because:

1. Skilljar injects CSS at runtime that we don't control
2. Skilljar may use inline styles or high-specificity selectors
3. The platform CSS is not visible in our codebase

All `!important` usage is intentional and documented with comments.
```

**Benefits:**
- Clear why `!important` is used
- Easier for new developers to understand
- Documents platform constraints
- Follows best practices for third-party overrides

**Estimated Effort:** 1-2 hours

---

### 7. Add CSS Linting (Priority: MEDIUM)

**Current Issue:**
- Stylelint is installed (`package.json:6`) but configuration is minimal
- `.stylelintrc.json` only has `{}` (empty config)
- No linting rules enforced

**Recommendation:**

**Update `.stylelintrc.json`:**

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recess-order"
  ],
  "plugins": [
    "stylelint-order"
  ],
  "rules": {
    "color-hex-length": "long",
    "color-named": "never",
    "declaration-no-important": [
      true,
      {
        "severity": "warning"
      }
    ],
    "max-nesting-depth": [
      3,
      {
        "severity": "warning"
      }
    ],
    "selector-max-id": 1,
    "selector-max-type": [
      2,
      {
        "ignore": ["child", "descendant"]
      }
    ],
    "custom-property-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
    "no-duplicate-selectors": true,
    "font-family-name-quotes": "always-where-recommended",
    "value-keyword-case": "lower",
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["container"]
      }
    ],
    "order/properties-alphabetical-order": null,
    "order/properties-order": [
      "content",
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "display",
      "flex",
      "flex-direction",
      "align-items",
      "justify-content",
      "width",
      "height",
      "margin",
      "padding",
      "border",
      "background",
      "color",
      "font",
      "text-align",
      "transition"
    ]
  }
}
```

**Install dependencies:**

```bash
npm install -D stylelint-config-standard stylelint-config-recess-order stylelint-order
```

**Add scripts to `package.json`:**

```json
{
  "scripts": {
    "lint:css": "stylelint 'production/css/**/*.css'",
    "lint:css:fix": "stylelint 'production/css/**/*.css' --fix",
    "lint": "npm run lint:css && eslint .",
    "lint:fix": "npm run lint:css:fix && eslint . --fix"
  }
}
```

**Benefits:**
- Catch CSS errors early
- Enforce consistent code style
- Auto-fix many issues
- Prevent bad practices

**Estimated Effort:** 1-2 hours

---

### 8. Optimize CSS Loading (Priority: MEDIUM)

**Current Issue:**
- `style.css` uses 16 `@import` statements
- `@import` is render-blocking
- Each `@import` is a separate HTTP request (though HTTP/2 helps)
- Not minified in production

**Current `style.css`:**
```css
@import url("css/_colors.css");
@import url("css/_fonts.css");
@import url("css/_animations.css");
/* ... 13 more imports ... */
```

**Recommendation:**

**Option A: Concatenate CSS Files**

Create a build process:

```javascript
// build-css.mjs
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const importOrder = [
  'production/css/_colors.css',
  'production/css/_fonts.css',
  'production/css/_animations.css',
  'production/css/_freezebox.css',
  'production/css/globals.css',
  'production/css/header.css',
  'production/css/breadcrumbs.css',
  'production/css/auth.css',
  'production/css/catalog.css',
  'production/css/course-info.css',
  'production/css/learning-path-info.css',
  'production/css/courses-learning-paths.css',
  'production/css/lessons.css',
  'production/css/404.css',
  'production/css/footer.css',
  'production/css/completion.css',
];

let concatenated = '';

for (const file of importOrder) {
  const content = readFileSync(file, 'utf-8');
  concatenated += `\n/* === ${file.replace('production/css/', '')} === */\n`;
  concatenated += content;
  concatenated += '\n';
}

// Add inline styles from style.css
const styleCSS = readFileSync('production/style.css', 'utf-8');
const inlineStyles = styleCSS.split('@import')[0]; // Get styles before @imports
concatenated += '\n/* === Inline styles === */\n';
concatenated += inlineStyles;

writeFileSync('production/style.min.css', concatenated);
console.log('CSS concatenated to style.min.css');
```

**Option B: Use PostCSS**

```bash
npm install -D postcss postcss-cli postcss-import postcss-preset-env cssnano
```

```javascript
// postcss.config.js
export default {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
      },
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false,
  },
};
```

**Build command:**
```json
{
  "scripts": {
    "build:css": "postcss production/style.css -o production/style.min.css",
    "watch:css": "postcss production/style.css -o production/style.min.css --watch"
  }
}
```

**Benefits:**
- Faster page load (single CSS file)
- Minified in production
- Process modern CSS features
- Autoprefixer support

**Estimated Effort:** 2-3 hours

---

## Low Priority Issues

### 9. Font Loading Optimization (Priority: LOW)

**Current Issue:**
- Fonts loaded from external URL (GitHub Pages)
- 14 font files (Gellix: 9 weights, Roobert: 5 weights)
- No font preloading
- No font-display strategy

**Current (`_fonts.css`):**

```css
@font-face {
  font-family: "Gellix";
  font-weight: 700;
  font-style: normal;
  src: url("https://chainguard-dev.github.io/courses-theme/fonts/Gellix-Bold.woff2")
    format("woff2");
  /* Missing: font-display */
}
```

**Recommendation:**

1. **Add `font-display` property:**

```css
@font-face {
  font-family: "Gellix";
  font-weight: 700;
  font-style: normal;
  font-display: swap; /* Show fallback font immediately */
  src: url("https://chainguard-dev.github.io/courses-theme/fonts/Gellix-Bold.woff2")
    format("woff2");
}
```

2. **Preload critical fonts:**

Add to HTML `<head>` (if you have access):

```html
<link rel="preload"
      href="https://chainguard-dev.github.io/courses-theme/fonts/Gellix-Bold.woff2"
      as="font"
      type="font/woff2"
      crossorigin>
<link rel="preload"
      href="https://chainguard-dev.github.io/courses-theme/fonts/Roobert-Regular.woff2"
      as="font"
      type="font/woff2"
      crossorigin>
```

3. **Subset fonts (advanced):**

Only include characters/glyphs actually used to reduce file size.

4. **Consider variable fonts:**

Instead of 9 separate Gellix weights, use 1 variable font (if available).

**Benefits:**
- Faster text rendering
- Better user experience
- Reduced layout shift
- Smaller total download

**Estimated Effort:** 1-2 hours

---

### 10. Add Dark Mode Support (Priority: LOW)

**Current Issue:**
- No dark mode support
- Only light theme variables defined
- Hardcoded colors don't adapt to system preferences

**Recommendation:**

```css
/* _colors.css */

:root {
  /* Light mode (default) */
  --bg-primary: #ffffff;
  --bg-secondary: #faf7ff;
  --text-primary: rgb(13, 22, 28);
  --text-secondary: rgb(13, 22, 28, 0.7);
  /* ... existing variables ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode overrides */
    --bg-primary: #0d161c;
    --bg-secondary: #1a2732;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --card-bg: #1f2937;
    --separator: #374151;
    --ink: #f9fafb;
    --white: #0d161c;
    /* ... other dark mode values ... */
  }
}

/* Optional: Manual toggle */
[data-theme="dark"] {
  --bg-primary: #0d161c;
  /* ... same as prefers-color-scheme ... */
}
```

**Benefits:**
- Better accessibility
- Reduced eye strain
- Modern UX expectation
- Energy saving (OLED screens)

**Estimated Effort:** 4-6 hours (depending on testing needed)

---

### 11. Remove Unused CSS (Priority: LOW)

**Current Issue:**
- Unknown how much CSS is actually used
- Potential dead code

**Recommendation:**

Use PurgeCSS or similar to find unused CSS:

```bash
npm install -D @fullhuman/postcss-purgecss
```

```javascript
// postcss.config.js
import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    // ... other plugins
    purgecss({
      content: ['./production/**/*.{html,js,mjs}'],
      safelist: {
        standard: [/^sj-/, /^cbp-/, /^fa-/], // Skilljar classes
        deep: [],
        greedy: []
      }
    })
  ]
};
```

**Important:** Be careful with dynamic classes and Skilljar platform classes.

**Benefits:**
- Smaller CSS file size
- Faster page loads
- Cleaner codebase

**Estimated Effort:** 2-3 hours + testing

---

### 12. Document CSS Architecture (Priority: LOW)

**Current Issue:**
- No CSS documentation
- Unclear naming conventions
- No style guide

**Recommendation:**

Create `CSS_ARCHITECTURE.md`:

```markdown
# CSS Architecture

## File Organization

### Partials (prefixed with `_`)
- `_colors.css` - CSS custom properties for colors
- `_fonts.css` - Font-face declarations
- `_animations.css` - Keyframe animations
- `_freezebox.css` - Utility classes

### Component Files
- `header.css` - Header and navigation
- `footer.css` - Footer styles
- `lessons.css` - Lesson page styles
- etc.

## Naming Conventions

### BEM-inspired (loosely)
- `block` - Component name
- `block__element` - Element within block
- `block--modifier` - Variation of block

### Utility Classes
- Use existing Skilljar classes where possible
- Custom utilities in `_utilities.css`
- Prefix custom utilities with `cg-`

## CSS Custom Properties

### Naming
- `--{category}-{property}-{modifier}`
- Examples: `--color-primary-blue`, `--space-4`, `--font-size-xl`

### Categories
- `color-*` / bare color names - Colors
- `space-*` - Spacing scale
- `font-*` - Typography
- `radius-*` - Border radius
- `shadow-*` - Box shadows
- `z-*` - Z-index scale

## Media Queries

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Approach
- Mobile-first (min-width)
- Desktop-first (max-width) - legacy, avoid for new code

## Code Style

### Property Order
1. Content
2. Positioning (position, top, left, z-index)
3. Display & Box Model (display, flex, width, margin, padding)
4. Borders
5. Background
6. Typography (font, color, text-align)
7. Misc (transition, cursor, etc.)

### Best Practices
- Use CSS variables for values
- Use `!important` to override Skilljar platform CSS (document with comments)
- Max nesting depth: 3 levels
- Use `:where()` to manage specificity
- Comment complex selectors

## !important Usage

This theme uses `!important` declarations to override Skilljar's platform CSS.

### When to Use !important
- ✅ Overriding Skilljar platform styles
- ✅ Utility classes (e.g., `.hidden`)
- ✅ Overriding inline styles from the platform

### Documentation
Always add a comment explaining why `!important` is needed:

```css
/* Override Skilljar platform header background */
.headers {
  background-color: var(--white) !important;
}
```
```

**Benefits:**
- Easier onboarding
- Consistent code style
- Reference documentation

**Estimated Effort:** 1-2 hours

---

## Performance Optimizations

### 13. Minify CSS in Production (Priority: MEDIUM)

**Current Issue:**
- CSS served unminified
- Comments and whitespace in production
- No compression

**Recommendation:**

Use PostCSS with cssnano (see Section 8) or:

```bash
npm install -D clean-css-cli
```

```json
{
  "scripts": {
    "build:css:min": "cleancss -o production/style.min.css production/style.css"
  }
}
```

**Benefits:**
- 20-40% smaller file size
- Faster downloads
- Better performance

**Estimated Effort:** 30 minutes

---

### 14. Critical CSS Extraction (Priority: LOW)

**Current Issue:**
- All CSS loaded upfront
- Render-blocking CSS

**Recommendation:**

Extract critical (above-the-fold) CSS:

```bash
npm install -D critical
```

```javascript
// extract-critical.mjs
import { generate } from 'critical';

generate({
  inline: true,
  base: 'production/',
  src: 'index.html',
  target: 'index-critical.html',
  width: 1300,
  height: 900,
});
```

**Benefits:**
- Faster initial render
- Better Core Web Vitals scores
- Improved perceived performance

**Estimated Effort:** 2-3 hours

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Immediate - 1 day)
**Priority:** Fix breaking issues

1. ✅ **CRITICAL: Fix duplicate `:root` in `_colors.css`** (1-2 hours)
2. ✅ Add comments to organize color file (30 min)
3. ✅ Document which values are canonical (30 min)

**Total:** ~3-4 hours

---

### Phase 2: High Priority (Week 1 - 2-3 days)

1. ✅ Extract magic values to CSS variables (3-4 hours)
2. ✅ Break down `lessons.css` into smaller files (2-3 hours)
3. ✅ Set up proper Stylelint configuration (1-2 hours)
4. ✅ Consolidate duplicate selectors (2-3 hours)

**Total:** ~9-12 hours

---

### Phase 3: Medium Priority (Week 2 - 2-3 days)

1. ✅ Improve media query organization (2-3 hours)
2. ✅ Set up CSS build process (2-3 hours)
3. ✅ Minify CSS for production (30 min)
4. ✅ Document `!important` usage (1-2 hours)

**Total:** ~6-9 hours

---

### Phase 4: Polish & Optimization (Week 3 - 1-2 days)

1. ✅ Optimize font loading (1-2 hours)
2. ✅ Create CSS documentation (1-2 hours)
3. ✅ Remove unused CSS (2-3 hours)
4. ✅ Critical CSS extraction (2-3 hours) - Optional

**Total:** ~6-10 hours

---

### Phase 5: Future Enhancements (Optional)

1. ✅ Add dark mode support (4-6 hours)
2. ✅ Implement CSS-in-JS solution (if needed)
3. ✅ Set up design tokens system

---

## Total Estimated Effort

**Critical + High Priority:** 12-16 hours (2-3 days)
**All Phases 1-4:** 24-34 hours (4-6 days)
**Including Optional Work:** 28-40 hours (5-7 days)

---

## Metrics to Track

### Before/After Comparison

| Metric | Current | Target |
|--------|---------|--------|
| Total CSS Size | ~100KB (unminified) | <60KB (minified) |
| Number of Files | 16 | 20-25 (after splitting) |
| Duplicate Variables | 90+ | 0 |
| `!important` Count | 61 | 61 (necessary for Skilljar overrides) |
| Documented `!important` | 0% | 100% (with comments) |
| CSS Variables | ~100 | ~150 (more organized) |
| Stylelint Errors | Unknown | 0 |
| Load Time | Baseline | -30% |
| Unused CSS | Unknown | <10% |

---

## Risk Assessment

### Low Risk ✅
- Adding CSS variables
- Documentation
- Linting setup
- Minification

### Medium Risk ⚠️
- Breaking down large files
- Refactoring media queries
- Removing `!important`
- Build process setup

### High Risk 🔴 (Requires Careful Testing)
- Fixing duplicate variables (might change appearance if wrong value chosen)
- Removing unused CSS (might break Skilljar platform features)
- Dark mode (extensive testing needed)

---

## Quick Wins (Do First)

### Immediate Impact, Low Effort

1. **Fix `_colors.css` duplicates** - 1-2 hours, huge improvement
2. **Add `font-display: swap`** - 15 minutes, better performance
3. **Set up CSS minification** - 30 minutes, smaller files
4. **Add Stylelint config** - 1 hour, catch errors

**Total Time:** ~3 hours
**Impact:** High

---

## Testing Checklist

After making CSS changes, test:

- [ ] All page types (catalog, course, lesson, auth, 404)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Skilljar platform integration
- [ ] Print styles (if needed)
- [ ] Hover/focus states
- [ ] Animations
- [ ] Accessibility (contrast, focus indicators)

---

## Questions for Consideration

1. **Build Process:** Are you OK with adding a CSS build step?
2. **Browser Support:** What browsers need to be supported? (affects CSS features used)
3. **Dark Mode:** Is this a desired feature?
4. **Font Hosting:** Can fonts be self-hosted instead of GitHub Pages?
5. **CSS Preprocessor:** Would you consider Sass/Less for better organization?
6. **Framework:** Have you considered a CSS framework (Tailwind, Bootstrap) or is custom preferred?
7. **Breaking Changes:** What's the tolerance for visual changes during refactoring?
8. **Skilljar Updates:** How often does Skilljar update their platform CSS? (affects testing frequency)

---

## Conclusion

The CSS codebase is well-organized with clear file separation and modern CSS practices (variables, nesting). The use of `!important` is **appropriate and necessary** for overriding Skilljar's platform CSS.

### Main Issues to Address:

1. **Duplicate variables** in `_colors.css` (critical fix) ⚠️
2. **Large monolithic files** (`lessons.css` at 893 lines)
3. **Magic values** instead of variables
4. **No build process** (unminified, multiple @imports)

### What's Working Well:

✅ Appropriate use of `!important` for platform overrides
✅ Clear file organization (partials vs components)
✅ Modern CSS with custom properties
✅ CSS nesting for readability
✅ Responsive design with media queries

### Expected Outcomes:

Addressing these issues in the phased approach will result in:
- **More maintainable** CSS (organized variables, split files)
- **Better performance** (smaller minified files, ~40% reduction)
- **Easier development** (better organization, linting, documentation)
- **Modern tooling** (build process, automation)
- **Clear documentation** (including `!important` rationale)

The recommended approach prioritizes the **critical color variable duplication issue first** (1-2 hours for huge impact), then tackles organization and tooling improvements incrementally.

---

**Document Version:** 1.0
**Last Updated:** 2026-01-26
**Author:** Claude Code Analysis
