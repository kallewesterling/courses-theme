# CSS Improvement & Refactoring Plan

## Overview
This document outlines a strategic plan for further improving the courses-theme CSS codebase, building on the foundation of the variable system and color consolidation already completed.

## ⚠️ Key Constraint: Skilljar Controls HTML

**Critical Understanding**: We do **not** control the HTML that Skilljar renders. We can only override CSS styles that target Skilljar's existing selectors and structure.

**What This Means**:
- ❌ Cannot add custom classes to HTML elements (e.g., `class="btn btn-primary"`)
- ❌ Cannot change HTML structure or element types
- ❌ Cannot add wrapper divs or modify DOM hierarchy
- ✅ Can target Skilljar's existing classes, IDs, and elements
- ✅ Can override Skilljar's default styles with `!important`
- ✅ Can use CSS custom properties (variables) for consistency
- ✅ Can use advanced CSS selectors (`:has()`, `:not()`, etc.)

**Impact on Strategy**: Instead of creating reusable component classes, we focus on:
1. Ensuring consistency across similar Skilljar-generated elements
2. Using CSS variables for shared property values
3. Documenting Skilljar's structure and common selectors
4. Consolidating duplicate CSS within our override files

---

## Phase 1: Code Quality & Maintainability

### 1.1 Document and Organize !important Usage
**Current State**: Heavy use of `!important` throughout the codebase (especially in catalog.css, lessons.css, auth.css)

**Context**: `!important` declarations are **necessary** to override Skilljar's injected platform CSS. This is a platform constraint, not a code quality issue.

**Goals**:
- Document which `!important` declarations are for Skilljar overrides
- Group platform overrides together in files
- Distinguish between necessary (platform) and unnecessary (internal) uses
- Add comments explaining why `!important` is needed

**Benefits**:
- Clear understanding of which overrides are platform-related
- Easier maintenance when Skilljar updates their CSS
- New developers understand the constraint
- Easier to identify if any internal `!important` can be removed

**Implementation**:
```css
/* Skilljar Platform Override - Required !important */
.catalog-hero h1 {
  color: var(--ink) !important; /* Override Skilljar's default heading color */
}

/* Internal override - could potentially be refactored */
.custom-component .nested-element {
  padding: var(--spacing-4) !important; /* TODO: Review if needed */
}
```

**Organization Strategy**:
- Keep platform overrides at the top of relevant sections
- Add clear comments: `/* Skilljar Override */`
- Document in code why the override is necessary
- Separate platform overrides from custom component styles where possible

### 1.2 Consolidate Duplicate Selectors
**Current State**: Some selectors appear multiple times in the same file

**Goals**:
- Merge duplicate selectors
- Group related properties
- Reduce file size

**Example Areas**:
- lessons.css: Multiple media query blocks could be consolidated
- catalog.css: Repeated selectors for course cards

### 1.3 Ensure Consistency Across Similar Patterns
**Current State**: Similar Skilljar-generated elements (buttons, cards, pills) have inconsistent styling

**Context**: Since we can't add custom classes, we ensure consistency by targeting Skilljar's selectors with uniform styling.

**Goals**:
- Identify similar Skilljar-generated elements across pages
- Ensure consistent styling using their existing selectors
- Extract common property values to CSS variables where applicable
- Document Skilljar's common selectors and patterns

**Patterns to Standardize**:
- Button-like elements (`#button-sign-in`, `#button-sign-up`, `.button`, `#google_login`)
- Card elements (`.coursebox-container`, `.course-card`)
- Pill/badge styles (`.badge-box`, `.pill`, `.completed`, `.in-progress`)
- Focus ring patterns (all interactive elements)
- Hover transitions (links, buttons, cards)

**Implementation Approach**:
```css
/* Instead of creating .btn-primary class, target Skilljar selectors */
#button-sign-in,
#button-sign-up {
  /* Consistent button styling */
  width: 100%;
  height: 56px;
  border: var(--border-width-medium) solid var(--blurple);
  border-radius: var(--radius-pill);
  background-color: transparent;
  color: var(--blurple);
  font-weight: var(--font-weight-extrabold);
  transition: all 0.2s ease-in;
}

#button-sign-in:hover,
#button-sign-up:hover {
  background-color: var(--blurple) !important; /* Skilljar Override */
  color: var(--primary-white-hex) !important; /* Skilljar Override */
}
```

**Optional - Extract to Variables**:
```css
/* If many elements share exact values, consider CSS variables */
:root {
  --interactive-transition: all 0.2s ease-in;
  --button-height-large: 56px;
  --button-border-primary: var(--border-width-medium) solid var(--blurple);
}
```

---

## Phase 2: Architecture & Organization

### 2.1 File Organization Strategy
**Current State**: Files organized by page type (catalog.css, lessons.css, auth.css)

**Context**: Since we target Skilljar's selectors rather than creating reusable classes, our file organization should reflect Skilljar's page structure rather than abstract components.

**Current Structure** (Appropriate for Skilljar constraints):
```
css/
├── defs/
│   ├── variables.css (✓ Complete)
│   ├── colors.css (✓ Complete)
│   └── fonts.css (✓ Complete)
├── animations.css (global animations)
├── globals.css (global overrides, base typography)
├── header.css (Skilljar header overrides)
├── footer.css (Skilljar footer overrides)
├── breadcrumbs.css (breadcrumb navigation)
├── auth.css (login/signup pages)
├── catalog.css (catalog/landing pages)
├── course-info.css (course detail pages)
├── courses-learning-paths.css (course/path shared styles)
├── lessons.css (lesson pages)
├── completion.css (completion pages)
├── 404.css (error pages)
└── freezebox.css (legacy styles)
```

**Alternative**: Group by Skilljar context
```
css/
├── defs/ (variables, colors, fonts)
├── global/ (globals, animations, header, footer)
├── auth/ (login, signup overrides)
├── catalog/ (catalog, featured courses)
├── courses/ (course-info, lessons, completion)
└── legacy/ (freezebox, deprecated)
```

**Benefits of Current Structure**:
- Matches Skilljar's page types (easy to find relevant overrides)
- Clear which CSS applies to which page
- Easy to test changes per page
- Natural for platform override approach

**Recommendation**: Keep current structure, it's appropriate for Skilljar theming

### 2.2 Selector Organization & Documentation
**Current State**: We target Skilljar's mixed naming conventions (kebab-case, camelCase, IDs, classes)

**Context**: We don't control the naming - Skilljar generates IDs like `#button-sign-in`, classes like `.coursebox-container`, and page identifiers like `body.sj-page-catalog`.

**Strategy**: Document Skilljar's patterns for maintainability

**Common Skilljar Patterns**:
```css
/* Page-level identifiers (on body) */
body.sj-page-catalog { }        /* Catalog pages */
body.sj-page-lesson { }         /* Lesson pages */
body.sj-page-login { }          /* Login page */
body.sj-page-detail-course { }  /* Course detail (not enrolled) */
body.sj-page-curriculum { }     /* Course detail (enrolled) */

/* State classes */
.cbp-spmenu-open { }            /* When menu is open */
.lesson-active { }              /* Active lesson */

/* Component classes */
.coursebox-container { }        /* Course cards */
.course-card { }                /* Course info card */
.badge-box { }                  /* Status badges */

/* Button IDs */
#button-sign-in { }             /* Sign in button */
#button-sign-up { }             /* Sign up button */
#google_login { }               /* Google OAuth button */
```

**Organization Guidelines**:
- Group selectors by Skilljar component/feature
- Add comments explaining what Skilljar generates
- Document state classes and their triggers
- Note which selectors appear across multiple pages

**Benefits**:
- Easier to find relevant Skilljar selectors
- New developers understand Skilljar's structure
- Clearer maintenance when Skilljar updates their platform

---

## Phase 3: Responsiveness & Modern CSS

### 3.1 Implement Fluid Typography
**Current State**: Fixed font sizes with some responsive overrides

**Goals**:
- Use clamp() for fluid typography
- Reduce media query complexity
- Better scaling across devices

**Implementation**:
```css
:root {
  /* Fluid font sizes that scale between viewport widths */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --font-size-xl: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  --font-size-3xl: clamp(2.25rem, 1.5rem + 2vw, 3rem);
}
```

### 3.2 Consolidate Media Queries
**Current State**: Media queries scattered throughout files, often with same breakpoints

**Goals**:
- Define standard breakpoints in variables
- Group media queries by component
- Consider mobile-first approach

**Proposed Breakpoints**:
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

**Pattern**:
```css
/* Group all styles for a component, then add responsive overrides */
.component {
  /* Base styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### 3.3 Implement Logical Properties
**Current State**: Using physical properties (left, right, top, bottom)

**Goals**:
- Support RTL languages
- Use logical properties for future-proofing

**Examples**:
```css
/* Before */
padding-left: var(--spacing-4);
margin-right: var(--spacing-6);

/* After */
padding-inline-start: var(--spacing-4);
margin-inline-end: var(--spacing-6);
```

### 3.4 Explore Container Queries
**Current State**: Using viewport-based media queries only

**Potential Use Cases**:
- Card components that adapt to their container
- Sidebar navigation that changes based on available space
- Featured course sections with flexible layouts

**Implementation**:
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

---

## Phase 4: Performance Optimization

### 4.1 Reduce Specificity
**Current State**: Deep nesting and high specificity (up to 6+ levels)

**Goals**:
- Flatten selector hierarchy
- Reduce nesting depth
- Improve performance

**Example**:
```css
/* Before - High specificity */
body.sj-page-catalog .catalog-center-width .catalog-header .catalog-hero h1 {
  color: var(--ink);
}

/* After - Lower specificity with utility class */
.catalog-hero__title {
  color: var(--ink);
}
```

### 4.2 Remove Unused CSS
**Tools to Use**:
- PurgeCSS or UnCSS
- Chrome DevTools Coverage tab
- Manual audit

**Expected Reduction**: 15-30% of unused styles

### 4.3 Optimize Critical CSS
**Goals**:
- Inline critical CSS for above-the-fold content
- Defer non-critical CSS
- Reduce initial render blocking

**Implementation Strategy**:
1. Identify critical styles (header, hero, initial viewport)
2. Extract to separate file
3. Inline in `<head>`
4. Load remaining CSS asynchronously

### 4.4 CSS Minification & Bundling
**Current State**: Unminified CSS loaded separately

**Proposal**:
- Set up build process (PostCSS)
- Minify for production
- Bundle related files
- Add source maps for debugging

---

## Phase 5: Accessibility Improvements

### 5.1 Enhanced Focus States
**Current State**: Some focus states use box-shadow, others undefined

**Goals**:
- Consistent focus indicators across all interactive elements
- High contrast focus rings
- Support for `:focus-visible`

**Implementation**:
```css
/* Use :focus-visible for keyboard-only focus */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: var(--border-width-medium) solid var(--blurple);
  outline-offset: 2px;
}

/* Remove focus for mouse users */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### 5.2 Color Contrast Audit
**Goals**:
- Ensure all text meets WCAG AA standards (4.5:1 for normal text)
- Test with tools like WebAIM Contrast Checker
- Document any exceptions

**Areas to Check**:
- Light purple text on white backgrounds
- Gray text combinations
- Button states
- Form placeholders

### 5.3 Motion Preferences
**Current State**: `prefers-reduced-motion` used in some places

**Goals**:
- Apply to all animations and transitions
- Provide alternative feedback for reduced motion users

**Pattern**:
```css
.animated-element {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    transition: none;
  }
}
```

### 5.4 Screen Reader Support
**Review Areas**:
- Hidden content (display: none vs visually-hidden)
- Icon-only buttons need labels
- Status messages (ARIA live regions)
- Skip links for navigation

---

## Phase 6: Advanced Features

### 6.1 CSS Custom Properties for Theming
**Current State**: Single light theme with hardcoded values

**Potential Enhancement**: Theme switching capability

**Implementation**:
```css
/* Light theme (default) */
:root {
  --theme-bg: var(--color-surface-base);
  --theme-text: var(--color-text-primary);
}

/* Dark theme */
[data-theme="dark"] {
  --theme-bg: #1a1a1a;
  --theme-text: #ffffff;
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --theme-bg: #000000;
  --theme-text: #ffffff;
  --theme-border: #ffffff;
}
```

### 6.2 CSS Grid Layout Improvements
**Current State**: Mix of flexbox and grid, some float-based layouts

**Goals**:
- Use CSS Grid for main layouts
- Use Flexbox for one-dimensional layouts
- Eliminate float-based layouts

**Example - Catalog Grid**:
```css
.featured-courses .grid {
  display: grid;
  gap: var(--gap-6);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Specific layouts for larger screens */
@media (min-width: 1200px) {
  .featured-courses .grid {
    grid-template-columns: 38fr 62fr;
  }
}
```

### 6.3 CSS Cascade Layers
**Use Case**: Better control over specificity and cascade

**Implementation**:
```css
@layer reset, base, components, utilities, overrides;

@layer reset {
  /* Normalize/reset styles */
}

@layer base {
  /* Typography, global styles */
}

@layer components {
  /* Component styles */
}

@layer utilities {
  /* Utility classes */
}

@layer overrides {
  /* Skilljar platform overrides (when needed) */
}
```

**Benefits**:
- Control cascade without specificity wars
- Clear override hierarchy for Skilljar platform overrides
- Easier to reason about style application
- `!important` still works within layers, but layers provide better organization
- Separate custom styles from platform overrides cleanly
- Layer order determines priority, making override strategy explicit

**Note for Skilljar Integration**: The `@layer overrides` would contain all Skilljar platform overrides with their necessary `!important` declarations. This keeps them organized separately from custom component styles, making maintenance easier when Skilljar updates their platform CSS.

---

## Phase 7: Documentation & Tooling

### 7.1 Living Style Guide
**Tool Options**:
- Storybook for CSS
- Pattern Lab
- KSS (Knyle Style Sheets)
- Custom documentation

**Contents**:
- All CSS variables with examples
- Component library with usage examples
- Color palette with accessibility ratings
- Typography scale demonstrations
- Interactive examples

### 7.2 Enhanced Linting Rules
**Current State**: Basic Stylelint with property ordering

**Additions**:
- Enforce naming conventions
- Limit selector depth
- Detect duplicate declarations
- Warn on high specificity
- Require comments for complex selectors

**Example Config**:
```json
{
  "rules": {
    "max-nesting-depth": 3,
    "selector-max-specificity": "0,4,0",
    "selector-class-pattern": "^[a-z][a-z0-9-]+(__[a-z0-9-]+)?(--[a-z0-9-]+)?$",
    "comment-word-disallowed-list": [
      ["/^TODO(?!:)/", "/^FIXME(?!:)/"],
      {
        "message": "Use 'TODO:' or 'FIXME:' with colon and description"
      }
    ]
  }
}
```

**Note**: `declaration-no-important` is **not recommended** for this codebase since `!important` is required to override Skilljar's platform CSS. Instead, focus on documenting why each `!important` is needed.

### 7.3 Build Process
**Tools**:
- PostCSS for processing
- Autoprefixer for browser compatibility
- CSS Modules or Scoped CSS
- Source maps for debugging

**Pipeline**:
```
Source CSS → PostCSS → Autoprefixer → Minification → Output
```

### 7.4 Documentation Comments
**Standard Format for Skilljar Overrides**:
```css
/**
 * Course Card (Skilljar-generated)
 *
 * Overrides styling for course cards in the catalog.
 * Skilljar generates: .coursebox-container
 *
 * @context Appears on catalog pages (body.sj-page-catalog)
 * @selector .coursebox-container
 * @states .sj-course-ribbon-complete (completed badge)
 *
 * @example Skilljar generates HTML like:
 *   <div class="coursebox-container">
 *     <div class="badge-box">Status</div>
 *     <div class="coursebox-content">...</div>
 *   </div>
 */
.coursebox-container {
  /* Our override styles */
  width: calc(50% - var(--spacing-px-24)) !important; /* Skilljar Override */
  border-radius: var(--radius-lg);
}
```

**Key Documentation Elements**:
- What Skilljar generates (selector/structure)
- Where it appears (page context)
- Related state classes or modifiers
- Example of Skilljar's HTML structure
- Why overrides are needed

---

## Implementation Roadmap

### Priority 1 (Quick Wins - 1-2 weeks)
- [x] Document all !important usage with comments (mark Skilljar overrides)
- [ ] ~~Extract common button styles to components~~ (Not applicable - can't add classes)
- [ ] Ensure consistency across similar Skilljar button elements
- [ ] Consolidate duplicate selectors within files
- [ ] Add missing focus-visible states to Skilljar's interactive elements
- [ ] Document existing variables and Skilljar selector patterns

### Priority 2 (Medium Effort - 2-4 weeks)
- [ ] ~~Implement component-based file structure~~ (Current structure is appropriate)
- [ ] ~~Create reusable card component~~ (Not applicable - can't add classes)
- [ ] Ensure consistency across Skilljar card elements (`.coursebox-container`, `.course-card`)
- [ ] Consolidate media queries within files
- [ ] Add fluid typography with clamp()
- [ ] Run color contrast audit and fix issues
- [ ] Remove unused CSS
- [ ] Document common Skilljar selectors and their contexts

### Priority 3 (Long Term - 1-3 months)
- [ ] Implement CSS cascade layers
- [ ] Add container queries for components
- [ ] Create living style guide
- [ ] Implement theming system
- [ ] Set up build process with PostCSS
- [ ] Migrate to logical properties

### Priority 4 (Future Enhancements)
- [ ] Dark mode support
- [ ] Advanced grid layouts
- [ ] Performance monitoring
- [ ] A/B testing framework for styles
- [ ] Automated visual regression testing

---

## Metrics for Success

### Performance Metrics
- CSS file size reduction: Target 20-30%
- Reduced selector specificity: Average < 0,3,0
- Faster render times: Measure with Lighthouse
- Improved CSS coverage: > 80% used styles

### Code Quality Metrics
- All !important declarations documented with reason (Skilljar override vs internal)
- Skilljar overrides clearly marked with comments
- Maximum nesting depth: 3 levels
- Consistent naming conventions: 100% compliance
- Zero duplicate selectors within same file
- All interactive elements have focus states

### Accessibility Metrics
- Color contrast: 100% WCAG AA compliance
- Focus indicators: Present on all interactive elements
- Motion preferences: Respected in all animations
- Screen reader testing: Manual verification

### Developer Experience
- Time to find a component: < 30 seconds
- New component creation: Follow documented pattern
- Style guide adoption: Reference for all new work
- Linting errors on commit: Zero

---

## Notes & Considerations

### Browser Support
- Define minimum browser versions
- Use PostCSS with Autoprefixer
- Progressive enhancement strategy
- Fallbacks for modern CSS features

### Skilljar Platform Constraints
- **!important is required** for most custom styles to override Skilljar's injected CSS
- This is expected and necessary - not a code smell in this context
- All platform overrides should be clearly documented with comments
- Test thoroughly on Skilljar staging environment after any CSS changes
- Platform CSS may change with Skilljar updates - monitor and adjust accordingly
- Consider using CSS cascade layers to organize platform overrides separately
- Keep a reference document of common Skilljar selectors that need overriding

### Team Coordination
- Gradual migration strategy (don't break everything at once)
- Regular code reviews for CSS changes
- Team training on new patterns and conventions
- Update onboarding documentation

### Maintenance Plan
- Regular audits (quarterly)
- Update dependencies (Stylelint, PostCSS)
- Review and update documentation
- Performance monitoring
- Accessibility testing

---

## Conclusion

This plan provides a comprehensive roadmap for modernizing and improving the CSS codebase. The foundation has been laid with the variable system and color consolidation. The next phases focus on code quality, architecture, performance, accessibility, and developer experience.

**Key Principles**:
1. **Progressive Enhancement**: Build from a solid foundation upward
2. **Consistency**: Maintain patterns across the codebase
3. **Performance**: Optimize for speed and efficiency
4. **Accessibility**: Ensure inclusive design for all users
5. **Maintainability**: Write code that's easy to understand and modify
6. **Documentation**: Keep knowledge accessible and up-to-date

Implementation should be iterative, starting with high-impact, low-effort improvements (Priority 1) and gradually working toward more comprehensive changes.
