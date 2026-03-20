# CSS Variables Reference

## Overview

Complete reference for all CSS custom properties (variables) used in the Chainguard courses theme. All variables are defined in the `:root` scope and available throughout the application.

**Variable Definition Files**:
- `production/css/defs/colors.css` - Color system (336 lines)
- `production/css/defs/variables.css` - Typography, spacing, transitions (227 lines)
- `production/css/defs/fonts.css` - Font-face declarations (111 lines)

---

## Table of Contents

1. [Colors](#colors)
   - [Surface Colors](#surface-colors)
   - [Border Colors](#border-colors)
   - [Brand Colors](#brand-colors)
   - [Text Colors](#text-colors)
   - [State Colors](#state-colors)
   - [Shadows](#shadows)
   - [Gradients](#gradients)
2. [Typography](#typography)
   - [Font Sizes](#font-sizes)
   - [Font Weights](#font-weights)
   - [Line Heights](#line-heights)
   - [Letter Spacing](#letter-spacing)
3. [Spacing](#spacing)
   - [Base Spacing](#base-spacing)
   - [Gaps](#gaps)
4. [Layout](#layout)
   - [Border Radius](#border-radius)
   - [Border Width](#border-width)
5. [Transitions](#transitions)
   - [Timing](#transition-timing)
   - [Common Patterns](#transition-patterns)
6. [Fonts](#fonts)
7. [Legacy Variables](#legacy-variables)

---

## Colors

### Surface Colors
Background colors for different surfaces and contexts.

```css
--color-surface-base: #ffffff;          /* Pure white */
--color-surface-soft: #fbfaff;          /* Slight lavender tint */
--color-surface-accent: #f0eeff;        /* Light purple accent */
--color-surface-muted: #eeeeee;         /* Light gray for code blocks */
--color-surface-disabled: #cccccc;      /* Disabled state */
```

**Usage Example**:
```css
.card {
  background-color: var(--color-surface-soft);
}
```

---

### Border Colors
Border colors with semantic naming.

```css
--color-border-default: #d8d5e0;        /* Default border (slight purple tint) */
--color-border-accent: #d0cfee;         /* Purple-gray accent */
--color-border-soft: #e5e3ea;           /* Very light border */
--color-border-strong: #c6c6c6;         /* Darker border */
--color-border-neutral: rgb(218 218 218); /* Pure gray */
--color-border-black: #000000;          /* Black border */
--color-border-subtle: rgb(0 0 0 / 0.125); /* 12.5% opacity black */
```

**Usage Example**:
```css
.container {
  border: 1px solid var(--color-border-default);
}
```

---

### Brand Colors

#### Primary Brand Colors
Core brand identity colors.

```css
--color-brand-primary: #3443f4;         /* Main brand blue */
--color-brand-blurple: rgb(98 38 251);  /* Purple-blue */
--color-brand-violet: #7545fb;          /* Secondary violet */
```

**Short Aliases**:
```css
--blurple: var(--color-brand-blurple);  /* Commonly used alias */
--brand: var(--color-brand-primary);    /* Brand blue alias */
```

#### Accent Brand Colors
Vibrant accent colors for highlights and special elements.

```css
--color-brand-aqua: rgb(43 186 253);    /* Bright aqua */
--color-brand-fuschia: rgb(253 43 242); /* Bright fuschia */
--color-brand-lime: rgb(68 253 43);     /* Bright lime green */
--color-brand-solar: rgb(253 57 100);   /* Solar pink-red */
```

**With Short Aliases**:
```css
--aqua: var(--color-brand-aqua);
--fuschia: var(--color-brand-fuschia);
--lime: var(--color-brand-lime);
--solar: var(--color-brand-solar);
```

#### Light Brand Variants
Subtle background colors for brand accent sections.

```css
--color-brand-blurple-light: rgb(241 236 254);
--color-brand-aqua-light: rgb(223 244 254);
--color-brand-fuschia-light: rgb(253 223 252);
--color-brand-lime-light: rgb(233 252 234);
--color-brand-solar-light: rgb(252 224 224);
```

**With Short Aliases**:
```css
--light-blurple: var(--color-brand-blurple-light);
--light-aqua: var(--color-brand-aqua-light);
/* etc. */
```

#### Brand Opacity Variants
Semi-transparent brand colors for layering effects.

```css
--color-brand-primary-subtle: rgb(52 67 244 / 0.09);   /* 9% */
--color-brand-primary-light: rgb(52 67 244 / 0.13);    /* 13% */
--color-brand-primary-medium: rgb(60 68 247 / 0.12);   /* 12% */
--color-brand-primary-disabled: rgb(52 67 244 / 0.4);  /* 40% */
```

**Usage Example**:
```css
.badge {
  background-color: var(--color-brand-primary-light);
  color: var(--color-brand-primary);
}
```

---

### Text Colors

#### Ink Scale (Main Text)
Hierarchical text colors with opacity variations.

```css
--color-text-primary: #0f1020;          /* Main text (100%) */
--color-text-secondary: rgb(13 22 28 / 0.9);  /* 90% opacity */
--color-text-tertiary: rgb(13 22 28 / 0.7);   /* 70% opacity */
--color-text-muted: rgb(13 22 28 / 0.6);      /* 60% opacity */
--color-text-disabled: rgb(13 22 28 / 0.4);   /* 40% opacity */
--color-text-faint: rgb(13 22 28 / 0.1);      /* 10% opacity */
--color-text-ghost: rgb(13 22 28 / 0.05);     /* 5% opacity */
```

**Short Aliases**:
```css
--ink: var(--color-text-primary);
--ink-dim: var(--color-text-secondary);
--ink-90: var(--color-text-secondary);
--ink-70: var(--color-text-tertiary);
--ink-40: var(--color-text-disabled);
--ink-10: var(--color-text-faint);
--ink-5: var(--color-text-ghost);
```

**Usage Example**:
```css
h1 { color: var(--ink); }
p { color: var(--ink-70); }
.muted { color: var(--ink-40); }
```

#### Special Text Colors
Purpose-specific text colors.

```css
--color-text-dark-purple: #14003d;      /* Deep purple */
--color-text-near-black: #1c1c1c;       /* Almost black */
--color-text-gray: #4d4d4d;             /* Medium gray */
--color-text-gray-medium: #666666;      /* Medium gray */
--color-text-gray-dark: #555555;        /* Dark gray for secondary */
--color-text-steel: #5a697c;            /* Steel blue-gray */
--color-text-muted-purple: #8c8aa4;     /* Muted purple-gray */
--color-text-light-purple: #9c9ab0;     /* Light purple-gray */
--color-text-purple-link: #3f17ac;      /* Links and inline code */
--color-text-pink-dark: #9d174d;        /* Tags/badges */
```

#### Brand Text Colors
Colored text for emphasis on light backgrounds.

```css
--color-text-blurple: rgb(0 160 235);
--color-text-aqua: rgb(4 189 19);
--color-text-fuschia: rgb(246 4 64);
--color-text-lime: rgb(98 38 251);
--color-text-solar: rgb(235 2 224);
```

---

### State Colors

#### Success (Green)
```css
--color-success: #04bd13;
--color-success-dark: #008000;
--color-success-light: rgb(4 189 19 / 0.65);     /* 65% opacity */
--color-success-subtle: rgb(4 189 19 / 0.24);    /* 24% opacity */
```

**Usage Example**:
```css
.badge.completed {
  border: 1px solid var(--color-success);
  background-color: var(--color-success-subtle);
  color: var(--color-success);
}
```

#### Error (Red/Orange)
```css
--color-error: #fe5b3c;
--color-error-light: rgb(255 92 92 / 0.25);      /* 25% opacity */
```

#### Warning (Yellow/Gold)
```css
--color-warning: #c0a200;
--color-warning-border: rgb(255 180 0 / 0.9);    /* 90% opacity */
--color-warning-light: rgb(255 230 150 / 0.8);   /* 80% opacity */
--color-warning-subtle: rgb(255 230 150 / 0.35); /* 35% opacity */
--color-warning-pale: rgb(246 235 97);
```

#### Info (Cyan)
```css
--color-info: #7af0fe;
--color-info-light: rgb(122 240 254);
```

#### Accent States (Catalog Cards)
```css
--color-accent-solar: #fd3964;          /* Solar pink-red */
--color-accent-solar-border: rgb(253 57 100 / 0.5);
--color-accent-solar-bg: rgb(253 57 100 / 0.13);
--color-accent-lime-border: rgb(4 189 19 / 0.65);
--color-accent-lime-bg: rgb(4 189 19 / 0.24);
--color-accent-aqua-bg: rgb(22 148 209 / 0.08);
--color-accent-aqua-subtle: rgb(22 148 209 / 0.08);
```

---

### Shadows

#### Shadow Color Components
Base shadow colors for custom shadows.

```css
--shadow-strong: rgb(0 0 0 / 0.25);     /* 25% black */
--shadow-medium-heavy: rgb(0 0 0 / 0.17); /* 17% black */
--shadow-medium: rgb(0 0 0 / 0.12);     /* 12% black */
--shadow-default: rgb(0 0 0 / 0.1);     /* 10% black */
--shadow-light: rgb(0 0 0 / 0.09);      /* 9% black */
--shadow-soft: rgb(0 0 0 / 0.06);       /* 6% black */
--shadow-subtle: rgb(0 0 0 / 0.04);     /* 4% black */
--shadow-purple: rgb(20 0 61 / 0.08);   /* 8% purple */
--shadow-purple-medium: rgb(20 0 61 / 0.06); /* 6% purple */
--shadow-purple-subtle: rgb(20 0 61 / 0.02); /* 2% purple */
```

#### Elevation Shadows
Complete box-shadow values for different elevation levels.

```css
--shadow-elevation-sm: 0 2px 8px var(--shadow-soft);
--shadow-elevation-md: 0 4px 12px var(--shadow-default);
--shadow-elevation-lg: 0 10px 30px var(--shadow-strong);
--shadow-elevation-xl: 0 10px 20px var(--shadow-medium), 0 3px 6px var(--shadow-subtle);
```

**Usage Example**:
```css
.card {
  box-shadow: var(--shadow-elevation-md);
}

.card:hover {
  box-shadow: var(--shadow-elevation-lg);
}
```

#### Specialized Shadows
Purpose-specific shadow values.

```css
--shadow-card: 0 12px 30px var(--shadow-purple);
--shadow-card-hover: 0 10px 20px var(--shadow-medium), 0 3px 6px var(--shadow-subtle);
--shadow-breadcrumb: 0 8px 24px var(--shadow-purple-medium);
--shadow-menu-dropdown: 0 6px 12px 1px var(--shadow-default);
```

#### Focus Ring Shadows
For keyboard focus indicators (accessibility).

```css
--shadow-focus-ring: 0 0 0 4px var(--color-focus-ring);
--shadow-focus-ring-inset: 0 0 0 3px var(--color-focus-ring-inset) inset;
```

**Usage Example**:
```css
button:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
```

#### Special Purpose Shadows
```css
--shadow-input-outline: 0 1px 0 var(--shadow-purple-subtle);
--shadow-glow: 0 0 6px 6px var(--overlay-tinted-bg);
--shadow-glow-black: 0 0 7px var(--shadow-subtle);
```

#### Complex Multi-Shadow
For mobile menu with layered shadows.

```css
--shadow-mobile-menu:
  var(--shadow-strong) 0 54px 55px,
  var(--shadow-medium) 0 -12px 30px,
  var(--shadow-medium) 0 4px 6px,
  var(--shadow-medium-heavy) 0 12px 13px,
  var(--shadow-light) 0 -3px 5px;
```

---

### Gradients

#### Gradient Color Stops
```css
--gradient-pink: #fde1fe;
--gradient-blue: #f5f6fe;
--gradient-pink-alt: #f7cef9;           /* Alternative pink */
--gradient-blue-alt: #dbdffd;           /* Alternative blue */

--gradient-brand-cyan: #57c6ff;
--gradient-brand-blue: #5b6bff;
--gradient-brand-purple: #813df3;
```

#### Gradient Definitions
Pre-defined gradients ready to use.

```css
/* Pink to Blue (315deg diagonal) */
--gradient-primary: linear-gradient(315deg, var(--gradient-pink), var(--gradient-blue) 72%);

/* Cyan to Purple (horizontal) */
--gradient-brand: linear-gradient(90deg, var(--gradient-brand-cyan) 0%, var(--gradient-brand-blue) 50%, var(--gradient-brand-purple) 100%);
```

**Usage Example**:
```css
.hero {
  background-image: var(--gradient-primary);
}

.badge {
  background-image: var(--gradient-brand);
}
```

---

## Typography

### Font Sizes
Modular scale from 12px to 96px.

#### Base Sizes
```css
--font-size-xs: 0.75rem;        /* 12px */
--font-size-sm: 0.875rem;       /* 14px */
--font-size-base: 1rem;         /* 16px */
--font-size-md: 1.125rem;       /* 18px */
--font-size-lg: 1.25rem;        /* 20px */
--font-size-xl: 1.5rem;         /* 24px */
--font-size-2xl: 1.875rem;      /* 30px */
--font-size-3xl: 2.25rem;       /* 36px */
--font-size-4xl: 3rem;          /* 48px */
--font-size-5xl: 4rem;          /* 64px */
--font-size-6xl: 6rem;          /* 96px */
```

#### Granular Sizes (In-Between Values)
```css
--font-size-xs-plus: 0.8rem;    /* 12.8px */
--font-size-sm-plus: 0.9rem;    /* 14.4px */
--font-size-sm-large: 0.95rem;  /* 15.2px */
```

**Usage Example**:
```css
h1 { font-size: var(--font-size-6xl); }
body { font-size: var(--font-size-base); }
small { font-size: var(--font-size-sm); }
```

---

### Font Weights
Semantic weight names mapped to numeric values.

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

**Usage Example**:
```css
h1 { font-weight: var(--font-weight-bold); }
button { font-weight: var(--font-weight-extrabold); }
p { font-weight: var(--font-weight-normal); }
```

---

### Line Heights

#### Relative Line Heights
Unitless values that scale with font size.

```css
--line-height-none: 1;          /* No leading */
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-medium: 1.55;
--line-height-comfortable: 1.6;
--line-height-relaxed: 1.7;
--line-height-loose: 2;
```

#### Percentage-Based
```css
--line-height-125: 125%;        /* 1.25 - same as tight */
--line-height-150: 150%;        /* 1.5 - same as normal */
```

#### Fixed Line Heights (Pixel Values)
For precise control when needed.

```css
--line-height-18: 18px;
--line-height-20: 20px;
--line-height-21: 21px;
--line-height-24: 24px;
--line-height-28: 28px;
--line-height-30: 30px;
--line-height-32: 32px;
--line-height-35: 35px;
--line-height-38: 38px;
--line-height-40: 40px;
--line-height-42: 42px;
--line-height-44: 44px;
--line-height-50: 50px;
--line-height-88: 88px;
```

#### Em and Rem Based
```css
--line-height-1-125em: 1.125em;
--line-height-1-5em: 1.5em;
--line-height-1-5rem: 1.5rem;   /* 24px */
--line-height-1-6rem: 1.6rem;   /* 25.6px */
```

**Usage Example**:
```css
body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-comfortable); /* 1.6 */
}

h1 {
  font-size: var(--font-size-6xl);
  line-height: var(--line-height-88); /* Fixed 88px */
}
```

---

### Letter Spacing
Fine-tuned tracking for different text sizes.

```css
--letter-spacing-tightest: -0.24rem;    /* -3.84px */
--letter-spacing-tighter: -0.12rem;     /* Very tight, large headings */
--letter-spacing-tight-alt: -0.1rem;    /* Tight, medium headings */
--letter-spacing-tight: -0.08rem;       /* Tight spacing */
--letter-spacing-snug: -0.02em;         /* Slightly tight (most common) */
--letter-spacing-snug-alt: -0.01em;     /* Barely tight */
--letter-spacing-normal: 0;             /* Normal spacing */
--letter-spacing-wide: 0.02em;          /* Slightly wide */
--letter-spacing-wider: 0.03em;         /* Wide */
--letter-spacing-widest: 0.04em;        /* Very wide */
--letter-spacing-extra-wide: 0.05em;    /* Extra wide for emphasis */
```

#### Pixel-Based (Specific Cases)
```css
--letter-spacing-px-tight-xl: -3.84px;  /* Maps to --letter-spacing-tightest */
--letter-spacing-px-tight-lg: -1.6px;   /* Tight for large text */
```

**Usage Example**:
```css
h1 {
  font-size: var(--font-size-6xl);
  letter-spacing: var(--letter-spacing-tightest);
}

.uppercase {
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-widest);
}
```

---

## Spacing

### Base Spacing
Rem-based spacing scale for consistent layouts.

```css
--spacing-0: 0;
--spacing-1: 0.25rem;       /* 4px */
--spacing-2: 0.5rem;        /* 8px */
--spacing-3: 0.75rem;       /* 12px */
--spacing-4: 1rem;          /* 16px */
--spacing-5: 1.25rem;       /* 20px */
--spacing-6: 1.5rem;        /* 24px */
--spacing-8: 2rem;          /* 32px */
--spacing-10: 2.5rem;       /* 40px */
--spacing-12: 3rem;         /* 48px */
--spacing-16: 4rem;         /* 64px */
--spacing-20: 5rem;         /* 80px */
--spacing-24: 6rem;         /* 96px */
```

### Pixel-Based Spacing
For backwards compatibility and precise control.

```css
--spacing-px-2: 2px;
--spacing-px-3: 3px;
--spacing-px-4: 4px;
--spacing-px-5: 5px;
--spacing-px-6: 6px;
--spacing-px-8: 8px;
--spacing-px-10: 10px;
--spacing-px-12: 12px;
--spacing-px-14: 14px;
--spacing-px-15: 15px;
--spacing-px-16: 16px;
--spacing-px-18: 18px;
--spacing-px-20: 20px;
--spacing-px-24: 24px;
--spacing-px-30: 30px;
--spacing-px-32: 32px;
--spacing-px-40: 40px;
--spacing-px-46: 46px;
--spacing-px-48: 48px;
--spacing-px-49: 49px;
--spacing-px-50: 50px;
--spacing-px-60: 60px;
--spacing-px-80: 80px;
```

**Usage Example**:
```css
.section {
  padding: var(--spacing-16);        /* 64px rem-based */
  margin-bottom: var(--spacing-8);   /* 32px rem-based */
}

.button {
  padding: var(--spacing-px-10) var(--spacing-px-20); /* 10px 20px fixed */
}
```

---

### Gaps
Dedicated variables for flex/grid gaps.

```css
--gap-0: 0;
--gap-0-5: 0.125rem;    /* 2px */
--gap-1: 0.25rem;       /* 4px */
--gap-1-5: 0.375rem;    /* 6px */
--gap-2: 0.5rem;        /* 8px */
--gap-2-5: 0.625rem;    /* 10px */
--gap-3: 0.75rem;       /* 12px */
--gap-4: 1rem;          /* 16px */
--gap-5: 1.25rem;       /* 20px */
--gap-6: 1.5rem;        /* 24px */
--gap-8: 2rem;          /* 32px */
--gap-10: 2.5rem;       /* 40px */
```

**Usage Example**:
```css
.grid {
  display: grid;
  gap: var(--gap-6);     /* 24px gap between items */
}

.flex-row {
  display: flex;
  gap: var(--gap-3);     /* 12px gap */
}
```

---

## Layout

### Border Radius
Modular scale for rounded corners.

```css
--radius-none: 0;               /* No rounding */
--radius-sm: 3px;               /* Small rounding */
--radius-default: 4px;          /* Default rounding */
--radius-md: 5px;               /* Medium rounding */
--radius-lg: 8px;               /* Large rounding (most common) */
--radius-xl: 9px;               /* Extra large rounding */
--radius-2xl: 14px;             /* 2X large rounding */
--radius-3xl: 16px;             /* 3X large rounding */
--radius-4xl: 20px;             /* 4X large rounding */
--radius-pill: 999px;           /* Pill shape (fully rounded) */
--radius-circle: 50%;           /* Perfect circle */
```

#### Rem-Based Radius
For responsive rounded corners.

```css
--radius-rem-sm: 0.25rem;       /* 4px - maps to --radius-default */
--radius-rem-md: 0.5rem;        /* 8px - maps to --radius-lg */
--radius-rem-lg: 1rem;          /* 16px - maps to --radius-3xl */
```

**Usage Example**:
```css
.button {
  border-radius: var(--radius-pill);     /* Fully rounded */
}

.card {
  border-radius: var(--radius-2xl);      /* 14px rounded corners */
}
```

---

### Border Width
Standardized border thickness.

```css
--border-width-none: 0;         /* No border */
--border-width-thin: 1px;       /* Thin border (most common) */
--border-width-medium: 2px;     /* Medium border (emphasis) */
--border-width-thick: 3px;      /* Thick border */
--border-width-heavy: 4px;      /* Heavy border */
```

**Usage Example**:
```css
.card {
  border: var(--border-width-thin) solid var(--color-border-default);
}

.button-primary {
  border: var(--border-width-medium) solid var(--blurple);
}
```

---

## Transitions

### Transition Timing
Standardized durations and easing functions.

#### Duration
```css
--transition-duration-instant: 0.05s;   /* Near-instant feedback (transforms) */
--transition-duration-fast: 0.15s;      /* Fast transitions (shadows, filters) */
--transition-duration-normal: 0.2s;     /* Normal transitions (colors, backgrounds) */
--transition-duration-slow: 0.3s;       /* Slower transitions (layout changes) */
```

#### Easing
```css
--transition-easing-in: ease-in;        /* Acceleration curve */
--transition-easing-out: ease-out;      /* Deceleration curve */
--transition-easing-in-out: ease-in-out; /* Smooth both ends */
--transition-easing-default: ease;      /* Browser default */
```

---

### Transition Patterns
Pre-defined transition combinations for common interactive elements.

#### Button Transitions
```css
/* Full interactive button with all states */
--transition-button-full:
  background-color 0.2s ease-in,
  color 0.2s ease-in,
  border-color 0.2s ease-in,
  box-shadow 0.15s ease,
  transform 0.05s ease;

/* Button without border-color transitions */
--transition-button-simple:
  background-color 0.2s ease-in,
  color 0.2s ease-in,
  box-shadow 0.15s ease,
  transform 0.05s ease;

/* Minimal button (for inherit-style buttons) */
--transition-button-minimal:
  background-color 0.2s ease-in,
  box-shadow 0.15s ease,
  transform 0.05s ease;
```

**Usage Example**:
```css
.button {
  transition: var(--transition-button-full);
}

.button:hover {
  background-color: var(--blurple);
}

.button:active {
  transform: translateY(1px);
}
```

#### Other Transition Patterns
```css
/* Form input field transitions */
--transition-input:
  border-color 0.15s ease,
  box-shadow 0.15s ease,
  background-color 0.15s ease;

/* Card hover effects */
--transition-card-hover:
  transform 0.2s ease,
  box-shadow 0.2s ease;

/* Icon button transitions (filter-based hover) */
--transition-icon-button:
  transform 0.05s ease,
  filter 0.15s ease,
  box-shadow 0.15s ease;

/* Resource card button transitions */
--transition-resource-button:
  color 0.15s ease-in-out,
  background-color 0.15s ease-in-out,
  border-color 0.15s ease-in-out,
  box-shadow 0.15s ease-in-out,
  transform 0.05s ease;
```

**Usage Example**:
```css
input[type="text"] {
  transition: var(--transition-input);
}

input[type="text"]:focus {
  border-color: var(--brand);
  box-shadow: var(--shadow-focus-ring);
}

.card {
  transition: var(--transition-card-hover);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevation-lg);
}
```

---

## Fonts

Two custom font families are loaded: **Gellix** (sans-serif) and **Roobert** (semi-mono).

### Gellix Family
Main brand font for headings and body text.

**Weights Available**:
- 100 (Thin)
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)
- 800 (ExtraBold)
- 900 (Black)

**Usage Example**:
```css
body {
  font-family: Gellix, sans-serif;
  font-weight: var(--font-weight-normal); /* 400 */
}

h1 {
  font-family: Gellix, sans-serif;
  font-weight: var(--font-weight-extrabold); /* 800 */
}
```

### Roobert Family
Semi-monospace font for code, buttons, and technical content.

**Weights Available**:
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)
- 800 (Heavy)

**Usage Example**:
```css
button {
  font-family: Roobert, monospace;
  font-weight: var(--font-weight-bold); /* 700 */
}

code {
  font-family: Roobert, monospace;
  font-weight: var(--font-weight-normal); /* 400 */
}
```

---

## Legacy Variables

### Compatibility Mapping

Many legacy variables are maintained for backwards compatibility. These map to the new semantic variable system.

#### Legacy Brand Colors
```css
--brand: var(--color-brand-primary);
--blurple: var(--color-brand-blurple);
--brand-ink: var(--color-text-dark-purple);
```

#### Legacy Layout
```css
--max-width: 1444px;
--w-max: 1168px;
--primary-border-radius: 20px;
--radius-xl: 20px;
--radius-md: 14px;
```

#### Legacy RGB Values
Some variables use RGB triplets (without `rgb()` function) for legacy compatibility:
```css
--primary-blue: 52 67 244;          /* Use: rgb(var(--primary-blue)) */
--primary-white: 255 255 255;
--primary-dark-purple: 20 0 61;
```

#### Legacy Spacing
```css
--space-1: 8px;
--space-2: 12px;
--space-3: 16px;
--space-4: 20px;
--space-5: 24px;
--space-6: 32px;
--space-7: 40px;
--space-8: 48px;
```

**Recommendation**: Use new semantic variables for new code. Legacy variables are maintained for backwards compatibility only.

---

## Best Practices

### DO ✅

1. **Use semantic variables**:
   ```css
   color: var(--ink);
   background-color: var(--color-surface-soft);
   ```

2. **Use transition pattern variables**:
   ```css
   transition: var(--transition-button-full);
   ```

3. **Use spacing scale**:
   ```css
   padding: var(--spacing-6);     /* 24px */
   gap: var(--gap-4);              /* 16px */
   ```

4. **Use relative line heights for body text**:
   ```css
   line-height: var(--line-height-comfortable);
   ```

5. **Use fixed line heights for large headings**:
   ```css
   h1 {
     font-size: var(--font-size-6xl);
     line-height: var(--line-height-88);
   }
   ```

### DON'T ❌

1. **Don't hardcode values**:
   ```css
   /* Bad */
   color: #0f1020;

   /* Good */
   color: var(--ink);
   ```

2. **Don't mix spacing systems**:
   ```css
   /* Bad */
   padding: 16px;

   /* Good */
   padding: var(--spacing-4);    /* or --spacing-px-16 if precision needed */
   ```

3. **Don't write out full transitions**:
   ```css
   /* Bad */
   transition: background-color 0.2s ease-in, color 0.2s ease-in, ...;

   /* Good */
   transition: var(--transition-button-full);
   ```

4. **Don't use legacy variables for new code**:
   ```css
   /* Bad (legacy) */
   color: rgb(var(--primary-blue));

   /* Good (semantic) */
   color: var(--color-brand-primary);
   ```

---

## Quick Reference

### Most Common Variables

**Colors**:
- `--ink` - Main text color
- `--blurple` - Primary brand color
- `--color-surface-base` - White background
- `--color-surface-soft` - Light lavender background

**Typography**:
- `--font-size-base` - 16px body text
- `--font-weight-normal` - 400
- `--font-weight-bold` - 700
- `--line-height-comfortable` - 1.6

**Spacing**:
- `--spacing-4` - 16px (1rem)
- `--gap-6` - 24px for flex/grid gaps

**Transitions**:
- `--transition-button-full` - Full button transitions
- `--transition-input` - Input field transitions

**Shadows**:
- `--shadow-elevation-md` - Medium card shadow
- `--shadow-focus-ring` - Keyboard focus ring

**Layout**:
- `--radius-pill` - Fully rounded button
- `--border-width-thin` - 1px border

---

## Summary

This CSS variable system provides:

- ✅ **336 color variables** - Comprehensive color palette
- ✅ **170+ spacing/typography variables** - Complete design system
- ✅ **7 transition patterns** - Consistent interactive feedback
- ✅ **2 custom font families** - Brand typography (Gellix & Roobert)
- ✅ **Semantic naming** - Clear, purposeful variable names
- ✅ **Legacy compatibility** - Backwards compatible with old variables

**Files**:
- `production/css/defs/colors.css` - All color definitions
- `production/css/defs/variables.css` - Typography, spacing, transitions
- `production/css/defs/fonts.css` - Custom font loading

**Related Documentation**:
- [Approach Notes](APPROACH_NOTES.md) - Skilljar platform constraints
- [Consolidation Complete](CONSOLIDATION_COMPLETE.md) - Variable usage examples
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Overall roadmap
