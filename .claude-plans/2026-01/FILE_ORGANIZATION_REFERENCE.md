# File Organization Reference

## Quick Reference Guide

Complete reference for CSS file organization in the Chainguard courses theme. Use this guide to quickly find the right file for your changes.

---

## File Structure Overview

```
production/css/
├── defs/               → Variable definitions (load first)
├── [global files]      → Global layout (header, footer, etc.)
├── [page files]        → Page-specific styles (auth, catalog, lessons, etc.)
└── freezebox.css       → Legacy (to be removed)
```

**Total**: 16 active CSS files (3,833 lines)

---

## Quick Lookup: Where Do I Make Changes?

| What are you changing? | File to edit |
|------------------------|--------------|
| Colors, brand palette | `defs/colors.css` |
| Spacing, typography, transitions | `defs/variables.css` |
| Font loading (Gellix, Roobert) | `defs/fonts.css` |
| Global base styles, typography | `globals.css` |
| Site header, navigation | `header.css` |
| Site footer, CTAs | `footer.css` |
| Breadcrumb navigation | `breadcrumbs.css` |
| Login/signup pages | `auth.css` |
| Catalog, landing pages | `catalog.css` |
| Course detail pages | `course-info.css` |
| Lesson pages (main content) | `lessons.css` |
| Completion/certificate pages | `completion.css` |
| Error pages (404, etc.) | `404.css` |
| Course/path shared styles | `courses-learning-paths.css` |
| Animations, keyframes | `animations.css` |

---

## Detailed File Reference

### 1. Definitions (defs/)

#### colors.css (13K, 336 lines)
**Purpose**: Complete color system with semantic variables

**Contains**:
- Surface colors (backgrounds)
- Border colors
- Brand colors (blurple, aqua, fuschia, lime, solar)
- Text colors (ink scale, special colors)
- State colors (success, error, warning, info)
- Shadow colors and definitions
- Gradient definitions
- Legacy compatibility mappings

**When to edit**:
- Adding new colors
- Creating color variations
- Updating brand palette
- Defining new shadows

**Key variables**: `--ink`, `--blurple`, `--color-surface-base`, `--shadow-focus-ring`

---

#### fonts.css (2.6K, 111 lines)
**Purpose**: Custom font loading (@font-face declarations)

**Contains**:
- Gellix font family (weights 100-900)
- Roobert font family (weights 300-800)

**When to edit**:
- Adding new font weights
- Updating font file URLs
- Adding new font families

**⚠️ Important**: Cannot use CSS variables in @font-face declarations

---

#### variables.css (8.6K, 227 lines)
**Purpose**: Typography, spacing, layout, and transition variables

**Contains**:
- Font sizes (xs through 6xl)
- Font weights (light through extrabold)
- Line heights (relative and fixed)
- Letter spacing (tightest through widest)
- Base spacing scale (0 through 24)
- Pixel-based spacing
- Gap variables (for flex/grid)
- Border radius (sm through pill)
- Border width (none through heavy)
- Transition timing and patterns

**When to edit**:
- Adding new spacing values
- Creating new transition patterns
- Updating typography scale
- Defining new layout variables

**Key variables**: `--font-size-base`, `--spacing-4`, `--transition-button-full`, `--radius-pill`

---

### 2. Global Layout

#### globals.css (1.7K, 109 lines)
**Purpose**: Global base styles and typography overrides

**Contains**:
- Base typography settings
- Global `.button` class
- Body and label colors
- Universal Skilljar overrides

**Scope**: Applies to all pages

**When to edit**:
- Changing global button styles
- Updating base typography
- Adding global overrides

**Key selectors**: `.button`, `body`, `label`

---

#### animations.css (255B, 21 lines)
**Purpose**: Global CSS animations and keyframes

**Contains**:
- `cursor-blink` animation

**When to edit**:
- Adding new global animations
- Creating reusable keyframes

---

#### header.css (5.0K, 245 lines)
**Purpose**: Site header and navigation overrides

**Contains**:
- Header layout and styling
- Navigation menu
- Mobile menu
- User account dropdown
- Login/signup buttons

**Scope**: Applies to all pages

**When to edit**:
- Changing header appearance
- Modifying navigation menu
- Updating mobile menu behavior

**Key selectors**: `#main-header`, `.header-dropdown`, `#mobile-menu`

---

#### footer.css (4.6K, 215 lines)
**Purpose**: Site footer overrides

**Contains**:
- Footer layout
- Footer links
- CTA buttons in footer
- Social media links

**Scope**: Applies to all pages

**When to edit**:
- Changing footer appearance
- Modifying footer CTAs
- Updating footer links

**Key selectors**: `.footer`, `.ctas .button`

---

#### breadcrumbs.css (1.9K, 75 lines)
**Purpose**: Breadcrumb navigation styling

**Contains**:
- Breadcrumb layout
- Breadcrumb links
- Breadcrumb separators

**Scope**: Applies where breadcrumbs appear (course/lesson pages)

**When to edit**:
- Changing breadcrumb appearance
- Modifying breadcrumb behavior

**Key selectors**: `.breadcrumb`, `.breadcrumb-item`

---

### 3. Page-Specific Styles

#### auth.css (9.5K, 385 lines)
**Purpose**: Login and signup page overrides

**Skilljar Pages**:
- `body.sj-page-login`
- `body.sj-page-signup`

**Contains**:
- Login/signup form styling
- Input field styling
- Sign-in/sign-up buttons
- Google OAuth button
- Tabs (login/signup toggle)
- Auth card styling
- "Forgot password" link

**When to edit**:
- Changing login form appearance
- Modifying input fields
- Updating button styles
- Changing form layout

**Key selectors**: `#button-sign-in`, `#button-sign-up`, `#google_login`, `.auth-card`, `input[type="text"]`

---

#### catalog.css (14K, 465 lines)
**Purpose**: Catalog and landing page overrides

**Skilljar Pages**:
- `body.sj-page-catalog`

**Contains**:
- Catalog hero section
- Featured course sections
- Course cards
- Course grid layout
- Status pills (completed, in-progress)
- Bottom CTA section
- Responsive overrides for mobile

**When to edit**:
- Changing catalog page layout
- Modifying course cards
- Updating featured sections
- Changing CTA appearance

**Key selectors**: `.featured-courses`, `.coursebox-container`, `.cards`, `#cta-bottom`, `.pill`

---

#### course-info.css (9.9K, 379 lines)
**Purpose**: Course detail page overrides

**Skilljar Pages**:
- `body.sj-page-detail-course` (not enrolled)
- `body.sj-page-curriculum` (enrolled)

**Contains**:
- Course header
- Course description
- Course curriculum/syllabus
- Enrollment button
- Course card layout
- Instructor information

**When to edit**:
- Changing course detail layout
- Modifying enrollment flow
- Updating course card appearance
- Changing curriculum display

**Key selectors**: `.course-card`, `.curriculum-wrapper`, `#resume-button`

---

#### lessons.css (27K, 907 lines) ⚠️ LARGE FILE
**Purpose**: Lesson page overrides (main learning experience)

**Skilljar Pages**:
- `body.sj-page-lesson`

**Structure** (with section headers):
1. Page Setup & Global Overrides
2. Menu State Management (Open/Close)
3. Left Navigation Menu
4. Lesson Content Wrapper
5. Lesson Content Body
6. Interactive Elements (Buttons, Forms)
7. Resource Boxes

**Contains**:
- Lesson page layout
- Left navigation menu
- Menu open/close states
- Lesson content area
- Video player customization
- Resource cards/boxes
- Resource buttons
- Navigation buttons
- Quiz/assessment styling
- Code blocks with copy buttons
- Interactive elements

**When to edit**:
- Changing lesson page layout
- Modifying left navigation
- Updating resource boxes
- Changing video player appearance
- Modifying lesson content styling

**Key selectors**: `#lp-left-nav`, `#lp-wrapper`, `#lesson-main`, `.resource-box`, `a#returnToOverview`, `a.button` (resources)

**Note**: Largest file in codebase. Uses clear section headers for navigation.

---

#### completion.css (1.2K, 50 lines)
**Purpose**: Completion and certificate page overrides

**Skilljar Pages**:
- `body.sj-page-completion`

**Contains**:
- Completion page layout
- Certificate display
- Completion message
- Continue/next course buttons

**When to edit**:
- Changing completion page layout
- Modifying certificate appearance
- Updating completion messaging

**Key selectors**: `.completion-page`, `.certificate`

---

#### 404.css (505B, 30 lines)
**Purpose**: Error page (404, etc.) overrides

**Skilljar Pages**:
- Error pages

**Contains**:
- Error page layout
- Error message styling
- Return home button

**When to edit**:
- Changing error page appearance
- Modifying error messaging

**Key selectors**: `.error-page`

---

#### courses-learning-paths.css (4.2K, 162 lines)
**Purpose**: Shared styles for course and learning path pages

**Scope**: Applies to both course detail and learning path pages

**Contains**:
- Shared card layouts
- Common course/path elements
- Shared interactive components

**When to edit**:
- Adding styles used by both courses and paths
- Creating shared components

---

### 4. Legacy

#### freezebox.css (3.0K, 115 lines)
**Purpose**: Legacy styles (deprecated, to be removed)

**Status**: ⚠️ Legacy

**Contains**:
- Old styles that may still be referenced
- Deprecated patterns

**When to edit**:
- Only edit when maintaining legacy functionality
- Consider migrating styles out of this file

**Goal**: Eventually remove this file

---

## Skilljar Page Mapping

Map Skilljar's `body` class to the correct CSS file:

| Skilljar Body Class | CSS File(s) |
|---------------------|-------------|
| `body.sj-page-login` | auth.css |
| `body.sj-page-signup` | auth.css |
| `body.sj-page-catalog` | catalog.css |
| `body.sj-page-detail-course` | course-info.css, courses-learning-paths.css |
| `body.sj-page-curriculum` | course-info.css, courses-learning-paths.css |
| `body.sj-page-lesson` | lessons.css |
| `body.sj-page-completion` | completion.css |
| Error pages | 404.css |
| All pages | globals.css, header.css, footer.css, breadcrumbs.css |

---

## Load Order (Critical)

Files load in this order via `style.css`:

1. **Definitions** (colors, fonts, variables) → Must load first
2. **Global Layout** (animations, globals, header, footer, breadcrumbs)
3. **Page-Specific** (404, auth, catalog, completion, course-info, courses-learning-paths, lessons)
4. **Legacy** (freezebox)

**Why order matters**:
- CSS variables must be defined before use
- Global styles should load before page-specific
- Page-specific styles can override globals

---

## File Size Reference

**Large Files** (500+ lines):
1. lessons.css - 907 lines
2. catalog.css - 465 lines
3. auth.css - 385 lines
4. course-info.css - 379 lines
5. colors.css - 336 lines

**Medium Files** (100-300 lines):
- header.css - 245 lines
- variables.css - 227 lines
- footer.css - 215 lines
- courses-learning-paths.css - 162 lines
- freezebox.css - 115 lines
- fonts.css - 111 lines
- globals.css - 109 lines

**Small Files** (<100 lines):
- breadcrumbs.css - 75 lines
- completion.css - 50 lines
- 404.css - 30 lines
- animations.css - 21 lines

---

## Best Practices

### DO ✅

1. **Edit the correct file**
   - Changes to lesson pages → lessons.css
   - Changes to login → auth.css
   - New colors → colors.css

2. **Respect the load order**
   - Variables before usage
   - Global before page-specific

3. **Use existing variables**
   - Check variables.css and colors.css first
   - Don't hardcode values

4. **Target Skilljar selectors**
   - Use Skilljar's IDs and classes
   - Scope to body.sj-page-* when possible

5. **Add section headers in large files**
   - Use clear section comments
   - Group related selectors

### DON'T ❌

1. **Don't create new files unnecessarily**
   - Use existing page-specific files
   - Only add files for truly new page types

2. **Don't hardcode values**
   - Use CSS variables instead
   - Check existing variables first

3. **Don't modify load order without reason**
   - Definitions must load first
   - Page-specific should load after globals

4. **Don't mix concerns**
   - Lesson styles go in lessons.css
   - Not in header.css or globals.css

---

## Adding a New Page Type

If Skilljar adds a new page type (e.g., `body.sj-page-newtype`):

1. Create `newtype.css` in `production/css/`
2. Add import to `style.css` (in page-specific section, alphabetical order)
3. Document in this file
4. Scope all styles to `body.sj-page-newtype`

---

## Summary

- **16 active CSS files** organized by page type
- **Definitions** load first (colors, fonts, variables)
- **Global** styles apply to all pages
- **Page-specific** files map to Skilljar body classes
- **lessons.css** is largest (907 lines) with section headers
- **Load order matters** - documented in style.css

Use this reference to quickly find the right file for your changes and understand the overall CSS architecture.

---

## Related Documentation

- [File Organization Evaluation](FILE_ORGANIZATION_EVALUATION.md) - Detailed evaluation & decision
- [CSS Variables Reference](CSS_VARIABLES.md) - Complete variable documentation
- [Approach Notes](APPROACH_NOTES.md) - Skilljar platform constraints
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Overall roadmap
