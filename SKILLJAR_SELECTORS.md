# Skilljar Selector Patterns Reference

## Overview

Complete reference for Skilljar's HTML selectors, naming conventions, and patterns. Use this guide to understand what Skilljar generates and how to target it effectively.

**Important**: We don't control the HTML or selector names - Skilljar generates them. Our CSS must target these existing selectors rather than creating our own classes.

---

## Table of Contents

1. [Page-Level Identifiers](#page-level-identifiers)
2. [State Classes](#state-classes)
3. [Component Classes](#component-classes)
4. [Button & Form IDs](#button--form-ids)
5. [Text Content Classes](#text-content-classes)
6. [Naming Conventions](#naming-conventions)
7. [Common Patterns](#common-patterns)

---

## Page-Level Identifiers

Skilljar adds page-specific classes to the `<body>` element. Scope page-specific styles using these.

### Authentication Pages

```css
body.sj-page-login { }          /* Login page */
body.sj-page-signup { }         /* Signup/registration page */
```

**Files**: auth.css

**Example**:
```css
body.sj-page-login #button-sign-in {
  /* Styles only apply on login page */
}
```

---

### Catalog & Browse Pages

```css
body.sj-page-catalog { }        /* Main catalog/browse page */
body.sj-page-catalog-root { }   /* Root catalog page */
body.sj-page-series { }         /* Learning path series view */
```

**Files**: catalog.css

**Variations**:
- `body.sj-page-catalog.sj-page-series` - Catalog view for series/paths

---

### Course Detail Pages

```css
body.sj-page-detail-course { }  /* Course detail (not enrolled OR enrolled) */
body.sj-page-curriculum { }     /* Course detail (enrolled, shows curriculum) */
body.sj-page-detail-path { }    /* Learning path detail */
body.sj-page-detail-bundle { }  /* Bundle detail */
```

**Files**: course-info.css, courses-learning-paths.css

**Key Distinctions**:
- `detail-course` = User viewing course (may or may not be enrolled)
- `curriculum` = User enrolled in course, sees curriculum/syllabus

**Combined Selectors**:
```css
body.sj-page-detail-bundle.sj-page-detail-path { }  /* Learning path bundle */
```

---

### Lesson Pages

```css
body.sj-page-lesson { }         /* Active lesson page (main learning experience) */
```

**Files**: lessons.css

**Most Common Page**: This is where users spend most of their time (watching videos, reading content, completing quizzes).

---

### Completion Pages

```css
body.sj-page-completion { }     /* Course/lesson completion page */
```

**Files**: completion.css

---

### State Variations

Skilljar sometimes adds state information to page classes:

```css
/* Examples found in comments: */
body.sj-page-detail-course: isCourseUnregistered  /* User not enrolled */
body.sj-page-curriculum: isCourseRegistered       /* User enrolled */
body.sj-page-series: isPathRegistered             /* User enrolled in path */
body.sj-page-detail-path: isPathUnregistered      /* User not enrolled in path */
```

**Note**: These are pseudo-states noted in comments. Target using standard page classes combined with presence/absence of enrollment elements.

---

## State Classes

Classes that toggle based on user interaction or application state.

### Menu Open/Close

```css
.cbp-spmenu-open { }            /* Applied when left navigation menu is open */
```

**Usage**:
```css
body.sj-page-lesson.cbp-spmenu-open {
  /* Styles when menu is open */
}

body.sj-page-lesson:not(.cbp-spmenu-open) {
  /* Styles when menu is closed */
}
```

**Files**: lessons.css

---

### Lesson State

```css
.lesson-active { }              /* Applied to currently active lesson in nav */
```

**Usage**:
```css
.lesson-row.lesson-active {
  /* Highlight current lesson */
}
```

**Files**: lessons.css

---

### Course Ribbons/Badges

```css
.sj-course-ribbon-complete { }  /* "Complete" badge on course cards */
.sj-ribbon-wrapper { }          /* Wrapper for ribbon badges */
```

**Files**: catalog.css, course-info.css

**Purpose**: Show completion status on course cards in catalog

---

## Component Classes

### Course Cards (Catalog)

```css
.coursebox-container { }        /* Individual course card container */
.coursebox-image { }            /* Course card image */
.coursebox-text-description { } /* Course card description text */
.sj-courseboxes-v2 { }          /* Course card grid container */
```

**Files**: catalog.css

**Structure**:
```html
<div class="coursebox-container">
  <div class="coursebox-image">...</div>
  <div class="coursebox-text-description">...</div>
  <div class="badge-box">...</div>  <!-- Status badge -->
</div>
```

---

### Course Cards (Detail Page)

```css
.course-card { }                /* Course information card */
.sj-course-info-wrapper { }     /* Course info wrapper */
```

**Files**: course-info.css

---

### Lesson Components

```css
.lesson-row { }                 /* Individual lesson in left nav */
.lesson-top { }                 /* Top section of lesson page */
.lesson-floater { }             /* Floating lesson navigation */
.lesson-btn { }                 /* Lesson navigation button */
.lessons-wrapper { }            /* Wrapper for lessons list */
```

**Files**: lessons.css

---

### Resource Components

```css
.resource-box { }               /* Resource box container */
.resource-wrapper { }           /* Resource content wrapper */
.resource-card { }              /* Individual resource card */
```

**Files**: lessons.css

**Purpose**: Additional resources, downloads, links attached to lessons

---

### Badge Components

```css
.badge-box { }                  /* Status badge box (NEW, COMPLETE, etc.) */
```

**Files**: catalog.css

**Usage**: Shows course status (new, in progress, completed)

---

## Button & Form IDs

### Authentication Buttons

```css
#button-sign-in { }             /* Sign in button (login page) */
#button-sign-up { }             /* Sign up button (signup page) */
#google_login { }               /* Google OAuth login button */
#facebook_login { }             /* Facebook OAuth login button (hidden) */
```

**Files**: auth.css

---

### Navigation Buttons

```css
#login-tab-left { }             /* Left tab (Login tab) */
#login-tab-right { }            /* Right tab (Sign up tab) */
```

**Files**: auth.css

**Purpose**: Toggle between login and signup forms

---

### Course Action Buttons

```css
#resume-button { }              /* Resume course button */
#purchase-button-wrapper-large { }  /* Purchase/enroll button wrapper */
```

**Files**: course-info.css

---

### Quiz/Assessment Buttons

```css
#answer_question { }            /* Answer question container */
#prev_question { }              /* Previous question button */
```

**Files**: lessons.css

**Quiz Button Classes**:
```css
.button.small.sj-text-quiz-next { }     /* Next question */
.button.small.sj-text-quiz-submit { }   /* Submit quiz */
.button.small.sj-text-quiz-previous { } /* Previous question */
.button.sj-text-quiz-start { }          /* Start quiz */
```

---

### Form Fields

```css
#id_password { }                /* Password input field */
#id_password2 { }               /* Confirm password field (signup) */
#id_answer { }                  /* Quiz answer input */
#id_chosen_answers { }          /* Quiz chosen answers */
```

**Files**: auth.css, lessons.css

---

## Layout & Container IDs

### Main Containers

```css
#skilljar-content { }           /* Main content container (all pages) */
#catalog-content { }            /* Catalog page content */
#completion-content { }         /* Completion page content */
#lp-content { }                 /* Lesson page content */
#cp-content { }                 /* Course page content */
```

---

### Header & Footer

```css
#main-header { }                /* Site header */
#header-left { }                /* Header left section (logo) */
#header-right { }               /* Header right section (nav, login) */
#mobile-header-left { }         /* Mobile header left */
#mobile-header-right { }        /* Mobile header right */
#lp-footer { }                  /* Lesson page footer (often hidden) */
```

**Files**: header.css, lessons.css

---

### Lesson Page Containers

```css
#lp-wrapper { }                 /* Lesson page main wrapper */
#lp-left-nav { }                /* Left navigation menu */
#lpLeftNavBackground { }        /* Left nav background (when open) */
#lesson-body { }                /* Lesson body content */
#lesson-main { }                /* Lesson main content area */
#lesson-main-inner { }          /* Lesson main inner container */
```

**Files**: lessons.css

**Structure**:
```
#lp-wrapper
  ├─ #lp-left-nav (left navigation)
  └─ #lp-content
       └─ #lesson-body
            └─ #lesson-main
                 └─ #lesson-main-inner
```

---

### Authentication Containers

```css
#auth-container { }             /* Auth page container */
#tabs { }                       /* Login/signup tabs container */
#login_form { }                 /* Login form */
#signup_form { }                /* Signup form */
```

**Files**: auth.css

---

### Course Detail Containers

```css
#dp-details { }                 /* Course detail pane */
#dp-details-bundle { }          /* Bundle detail pane */
#details-pane { }               /* Details pane */
#details-pane-inner { }         /* Details pane inner */
#curriculum-section { }         /* Curriculum/syllabus section */
```

**Files**: course-info.css

---

### Special Containers

```css
#breadcrumbs { }                /* Breadcrumb navigation */
#cta-bottom { }                 /* Bottom CTA section (catalog) */
#completion-card { }            /* Completion certificate card */
#completion-popup { }           /* Completion popup */
#internal-course-warning { }    /* Internal course warning banner */
#cg-bg { }                      /* Custom background element */
```

---

## Text Content Classes

Skilljar uses specific classes for text content that can be customized through their admin:

```css
.sj-text-login-note { }                 /* Login page note text */
.sj-text-page-not-found-explanation { } /* 404 page explanation */
.sj-text-quiz-next { }                  /* "Next" quiz button text */
.sj-text-quiz-submit { }                /* "Submit" quiz button text */
.sj-text-quiz-previous { }              /* "Previous" quiz button text */
.sj-text-quiz-start { }                 /* "Start" quiz button text */
.sj-text-sign-in { }                    /* "Sign in" link text */
.sj-text-sign-up { }                    /* "Sign up" link text */
```

**Purpose**: These classes wrap text strings that can be customized in Skilljar's admin. They allow for translation and customization.

**Files**: Various (auth.css, lessons.css, etc.)

---

## Naming Conventions

### Skilljar's Naming Patterns

Skilljar uses multiple naming conventions:

1. **Page Classes**: `sj-page-{pagetype}`
   - Examples: `sj-page-login`, `sj-page-catalog`, `sj-page-lesson`

2. **Text Classes**: `sj-text-{content}`
   - Examples: `sj-text-quiz-next`, `sj-text-sign-in`

3. **Component Prefixes**: `sj-`, `coursebox-`, `lesson-`
   - Examples: `sj-course-info-wrapper`, `coursebox-container`, `lesson-row`

4. **Menu System**: `cbp-spmenu-{state}`
   - Example: `cbp-spmenu-open`

5. **ID Patterns**:
   - **Kebab-case**: `#button-sign-in`, `#lesson-main`, `#header-left`
   - **camelCase**: `#lpLeftNavBackground`, `#detailsPane`

### Our Naming (Custom Elements)

When we add custom elements (rare), we follow:

- **IDs**: `#cg-bg` (custom background), `#cta-bottom` (custom CTA)
- **Classes**: `.featured-courses`, `.resource-box`, `.card`

**Note**: We add very few custom elements. Most styling targets Skilljar's existing selectors.

---

## Common Patterns

### Scoping to Page Type

Always scope page-specific styles to prevent cross-page bleeding:

```css
/* ✅ Good - Scoped to page */
body.sj-page-lesson #lesson-main {
  /* Only applies on lesson pages */
}

/* ❌ Bad - Applies everywhere */
#lesson-main {
  /* Could affect other pages if ID exists elsewhere */
}
```

---

### State Management

Combine page class with state class:

```css
/* Menu open on lesson page */
body.sj-page-lesson.cbp-spmenu-open {
  /* Specific to lesson page with menu open */
}

/* Menu closed on lesson page */
body.sj-page-lesson:not(.cbp-spmenu-open) {
  /* Specific to lesson page with menu closed */
}
```

---

### Multi-Page Selectors

Some elements appear on multiple page types:

```css
/* Breadcrumbs appear on course and lesson pages */
body.sj-page-curriculum #breadcrumbs,
body.sj-page-lesson #breadcrumbs {
  /* Shared breadcrumb styles */
}
```

---

### Overriding Platform Styles

Use `!important` with comments explaining the override:

```css
body.sj-page-lesson #lp-footer {
  display: none !important; /* Skilljar Override: Hide platform footer */
}
```

---

### Component Hierarchies

Understand Skilljar's component structure to target effectively:

```css
/* Target specific part of course card */
.coursebox-container {
  /* Card container */

  .coursebox-image {
    /* Card image */
  }

  .coursebox-text-description {
    /* Card description */
  }

  .badge-box {
    /* Status badge */
  }
}
```

---

### Checking for Presence

Target elements based on what exists:

```css
/* Course card with badge */
.coursebox-container:has(.badge-box) {
  /* Styles when badge is present */
}

/* Resource box without cards */
.resource-box:not(:has(.resource-card)) {
  display: none; /* Hide empty resource boxes */
}
```

---

## Cross-Reference: Selectors by File

### auth.css
- `body.sj-page-login`, `body.sj-page-signup`
- `#auth-container`, `#tabs`, `#login_form`, `#signup_form`
- `#button-sign-in`, `#button-sign-up`, `#google_login`
- `#id_password`, `#id_password2`
- `.sj-text-sign-in`, `.sj-text-sign-up`

### catalog.css
- `body.sj-page-catalog`, `body.sj-page-series`
- `#catalog-content`, `#catalog-courses`, `#cta-bottom`
- `.coursebox-container`, `.coursebox-image`, `.coursebox-text-description`
- `.badge-box`, `.sj-course-ribbon-complete`
- `.featured-courses` (custom)

### course-info.css
- `body.sj-page-detail-course`, `body.sj-page-curriculum`, `body.sj-page-detail-path`
- `#cp-content`, `#dp-details`, `#curriculum-section`
- `.course-card`, `.sj-course-info-wrapper`
- `#resume-button`, `#purchase-button-wrapper-large`

### lessons.css
- `body.sj-page-lesson`
- `#lp-wrapper`, `#lp-left-nav`, `#lp-content`
- `#lesson-body`, `#lesson-main`, `#lesson-main-inner`
- `.lesson-row`, `.lesson-active`, `.lesson-top`, `.lesson-floater`
- `.resource-box`, `.resource-wrapper`, `.resource-card`
- `.cbp-spmenu-open`
- `#answer_question`, `#prev_question`
- `.sj-text-quiz-*`

### header.css
- `#main-header`, `#header-left`, `#header-right`
- `#mobile-header-left`, `#mobile-header-right`
- `#logo-wrapper`

### footer.css
- `.footer`, `.ctas`

### completion.css
- `body.sj-page-completion`
- `#completion-content`, `#completion-card`, `#completion-popup`

---

## Tips for Working with Skilljar Selectors

### DO ✅

1. **Scope to page type**
   ```css
   body.sj-page-lesson { /* ... */ }
   ```

2. **Use existing Skilljar IDs and classes**
   ```css
   #lesson-main, .coursebox-container, etc.
   ```

3. **Document overrides with comments**
   ```css
   display: none !important; /* Skilljar Override: Hide X */
   ```

4. **Check element hierarchy**
   - Understand parent-child relationships
   - Use DevTools to inspect structure

5. **Test across page types**
   - Ensure styles don't leak to other pages
   - Use page-specific scoping

### DON'T ❌

1. **Don't create custom classes for Skilljar elements**
   - Can't modify Skilljar's HTML
   - Must target their selectors

2. **Don't assume selectors are consistent**
   - Some use camelCase, some kebab-case
   - Check actual HTML in browser

3. **Don't forget to scope**
   - Global selectors can cause conflicts
   - Always use page class when possible

4. **Don't remove !important without testing**
   - Often necessary to override platform CSS
   - Skilljar's CSS loads after ours

---

## Verification & Testing

### Finding Selectors

To find what selectors Skilljar generates:

1. Open the page in browser
2. Use DevTools (Inspect Element)
3. Check the `<body>` class
4. Inspect the element you want to style
5. Note the IDs and classes Skilljar uses

### Testing Changes

1. Scope to page type (body.sj-page-*)
2. Test on actual page
3. Check other pages to ensure no leaking
4. Verify overrides work (may need !important)

---

## Summary

**Key Takeaways**:

- **16 page types** identified (login, catalog, lesson, etc.)
- **Body classes** for page-specific targeting (`body.sj-page-*`)
- **State classes** for interactive states (`.cbp-spmenu-open`, `.lesson-active`)
- **Component classes** for UI elements (`.coursebox-container`, `.lesson-row`)
- **ID patterns** mixed (kebab-case and camelCase)
- **Always scope** to page type to prevent conflicts
- **Use !important** with documentation for platform overrides

This reference documents Skilljar's selector patterns as found in the codebase. Use it to quickly understand what Skilljar generates and how to target it effectively.

---

## Related Documentation

- [File Organization Reference](FILE_ORGANIZATION_REFERENCE.md) - Which file to edit
- [Approach Notes](APPROACH_NOTES.md) - Skilljar platform constraints
- [Skilljar Overrides](SKILLJAR_OVERRIDES.md) - Platform override strategy
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Overall roadmap
