# Skilljar Platform Override Reference

## Overview

This document explains the use of `!important` in the courses-theme CSS and provides reference information for common Skilljar platform overrides.

## Why !important is Necessary

Skilljar injects its own CSS into the platform that controls the default styling of courses, catalogs, authentication pages, and other elements. To implement custom theming, we must override these platform styles using `!important` declarations.

**This is expected and necessary** - it's not a code smell or anti-pattern in this context.

## Files with Platform Overrides

All CSS files in this theme include platform overrides. Each file has a header comment noting this:

| File | !important Count | Primary Purpose |
|------|------------------|-----------------|
| `lessons.css` | 76 | Lesson page layout, navigation, content styling |
| `course-info.css` | 51 | Course detail/curriculum pages |
| `catalog.css` | 31 | Catalog page layout and course cards |
| `courses-learning-paths.css` | 15 | Course and learning path detail pages |
| `footer.css` | 13 | Footer navigation and layout |
| `header.css` | 12 | Header navigation and branding |
| `freezebox.css` | 8 | Legacy styles |
| `auth.css` | 7 | Login and signup pages |
| `globals.css` | 4 | Global typography and base styles |
| `404.css` | 2 | Error page |
| `breadcrumbs.css` | 1 | Breadcrumb navigation |

**Total**: 220 `!important` declarations across 11 files

## Common Override Patterns

### Display and Visibility

```css
/* Hiding Skilljar's default elements */
#lp-footer {
  display: none !important; /* Hide platform footer */
}

#catalog-content {
  display: none !important; /* Hide default catalog */
}
```

### Layout and Positioning

```css
/* Adjusting layout properties */
.course-card {
  position: sticky !important;
  max-width: 368px !important;
  margin: var(--spacing-px-20) auto !important;
}
```

### Colors and Backgrounds

```css
/* Custom color schemes */
.headers {
  background-color: var(--white) !important;
  border-bottom: 1px solid var(--color-border-default) !important;
}

h1.course-title {
  color: var(--ink) !important;
}
```

### Typography

```css
/* Custom fonts and text styling */
a#returnToOverview {
  color: var(--color-surface-base) !important;
  text-decoration: none !important;
}
```

### Spacing

```css
/* Custom padding and margins */
#lesson-main {
  padding-right: var(--spacing-10) !important;
  padding-left: var(--spacing-10) !important;
}
```

## Skilljar Class Patterns

Skilljar uses specific class naming patterns. Here are common ones you'll encounter:

### Page-Level Classes (on `<body>`)

- `sj-page-catalog` - Catalog/landing pages
- `sj-page-lesson` - Individual lesson pages
- `sj-page-detail-course` - Course detail (not enrolled)
- `sj-page-curriculum` - Course detail (enrolled)
- `sj-page-detail-path` - Learning path detail (not enrolled)
- `sj-page-series` - Learning path detail (enrolled)
- `sj-page-login` - Login page
- `sj-page-signup` - Signup page
- `sj-page-error-404` - 404 error page

### Component Classes

- `cbp-spmenu-open` - When side navigation is open
- `.lesson-row` - Individual lesson items in navigation
- `.lesson-active` - Currently active lesson
- `.course-card` - Course information card
- `.coursebox-container` - Course box in catalog
- `.badge-box` - Status badges (completed, in progress)

## Maintenance Guidelines

### When Adding New Overrides

1. **Add comments** for complex or non-obvious overrides
2. **Use CSS variables** instead of hardcoded values
3. **Test on Skilljar staging** before deploying to production
4. **Group related overrides** together in the file

### When Skilljar Updates

Skilljar may update their platform CSS periodically. When this happens:

1. **Test all pages** after Skilljar platform updates
2. **Check for visual regressions** using browser DevTools
3. **Update overrides** if Skilljar changes class names or structure
4. **Document any new patterns** in this file

### Troubleshooting Override Issues

If your custom styles aren't applying:

1. **Check specificity** - You may need to increase selector specificity
2. **Verify `!important`** - Make sure it's present where needed
3. **Inspect element** - Use browser DevTools to see which styles are winning
4. **Check for typos** - In class names or variable references
5. **Clear cache** - Browser and Skilljar platform caches

## CSS Cascade Layers (Future)

Consider using `@layer` in the future to organize platform overrides:

```css
@layer reset, base, components, skilljar-overrides;

@layer skilljar-overrides {
  /* All platform overrides in one place */
  .sj-page-catalog #catalog-content {
    display: none !important;
  }

  /* ...more overrides */
}
```

**Benefits**:
- Clearer separation of custom vs override styles
- Easier to find and maintain platform-specific code
- `!important` still works within layers
- Explicit override hierarchy

## Related Documentation

- [CSS Variables](CSS_VARIABLES.md) - Reference for all design tokens
- [CSS Improvement Plan](CSS_IMPROVEMENT_PLAN.md) - Roadmap for future enhancements
- [Skilljar Documentation](https://help.skilljar.com/) - Platform documentation

## Questions or Issues?

When working with Skilljar overrides:

1. **Refer to this document** for common patterns
2. **Check existing overrides** in the codebase for similar cases
3. **Test thoroughly** on Skilljar staging environment
4. **Document new patterns** by updating this file

---

**Last Updated**: 2026-01-27
**Theme Version**: Current
**Skilljar Platform**: Compatible with current version
