# CSS Approach Notes

## Key Constraint: Skilljar Controls HTML

**Critical Understanding**: We do not control the HTML that Skilljar renders. We can only override CSS styles that target Skilljar's existing selectors and structure.

### What This Means

❌ **Cannot Do:**
- Add custom classes to HTML elements (e.g., `class="btn btn-primary"`)
- Change HTML structure or element types
- Add wrapper divs or modify DOM hierarchy
- Use custom data attributes

✅ **Can Do:**
- Target Skilljar's existing classes, IDs, and elements
- Override Skilljar's default styles with `!important`
- Use CSS custom properties (variables) for consistency
- Add `:before` and `:after` pseudo-elements
- Use advanced CSS selectors (`:has()`, `:not()`, etc.)

## CSS Strategy

### 1. Work with Skilljar's Selectors

Target what Skilljar provides:
```css
/* Skilljar generates these IDs/classes, so we target them directly */
#button-sign-in,
#button-sign-up {
  /* Our custom styles */
}

a#returnToOverview {
  /* Our custom styles */
}

.coursebox-container {
  /* Our custom styles */
}
```

### 2. Use CSS Variables for Consistency

Instead of component classes, use CSS variables to maintain consistency:
```css
/* Define button-like properties as variables */
:root {
  --button-padding: var(--spacing-px-10) var(--spacing-px-20);
  --button-border-radius: var(--radius-md);
  --button-focus-shadow: var(--shadow-focus-ring);
}

/* Apply to Skilljar selectors */
#button-sign-in,
#button-sign-up,
.button {
  padding: var(--button-padding);
  border-radius: var(--button-border-radius);
}
```

### 3. Document Skilljar's Structure

Understanding what Skilljar generates helps us write better CSS:

**Common Skilljar Selectors:**
- Page identifiers: `body.sj-page-catalog`, `body.sj-page-lesson`, etc.
- Button IDs: `#button-sign-in`, `#button-sign-up`, `#google_login`
- Generic class: `.button`
- Course elements: `.coursebox-container`, `.course-card`
- Navigation: `#lp-left-nav`, `#left-nav-button`

### 4. Consolidate Patterns

Instead of extracting to reusable classes, we:
1. Identify duplicate CSS property groups
2. Ensure consistent styling across similar Skilljar elements
3. Use CSS variables for shared values

## Revised Phase 1 Tasks

### Task 2 (Revised): Document Skilljar Structure & Consolidate Button Styling

Instead of creating component classes, we should:
1. Document common Skilljar selectors and what they render
2. Ensure button-like elements have consistent styling using their existing selectors
3. Extract common property values to CSS variables if needed

### Task 3: Consolidate Duplicate Selectors

This is still valid - find duplicate selectors within files and merge them.

### Task 4: Add Missing Focus-Visible States

This is still valid - add `:focus-visible` to Skilljar's interactive elements.

### Task 5: Create CSS Variables Documentation

This is still valid - document all available CSS variables.

## Example: Button Consistency

**Wrong Approach (can't add classes):**
```html
<!-- We can't do this - we don't control the HTML -->
<button class="btn btn-primary">Sign In</button>
```

**Right Approach (target Skilljar selectors):**
```css
/* Target what Skilljar generates */
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
}

#button-sign-in:hover,
#button-sign-up:hover {
  background-color: var(--blurple) !important;
  color: var(--primary-white-hex) !important;
}
```

## What to Do with buttons.css

The `css/components/buttons.css` file created earlier:
- **Keep as reference** - Shows desired button patterns
- **Don't expect to use the classes** - We can't add them to HTML
- **Extract the patterns** - Apply them to Skilljar's existing selectors

Or we could:
- Remove it if it's not useful
- Convert it to a reference document showing button patterns
- Use it as a guide for ensuring consistency across Skilljar's button selectors

---

**Last Updated**: 2026-01-27
**Key Insight**: Work with Skilljar's HTML, not against it
