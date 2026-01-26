# CSS Linting Guide

## Overview

This project uses [Stylelint](https://stylelint.io/) to enforce consistent CSS code quality and formatting.

## Running the Linter

```bash
# Lint all CSS files
npm run lint:css

# Lint CSS and automatically fix issues where possible
npm run lint:css:fix

# Run all linters (CSS + JavaScript)
npm run lint
```

## Pre-commit Hooks

CSS linting runs automatically on commit via pre-commit hooks. If linting fails, the commit will be blocked.

## Configuration

The linter configuration is in `.stylelintrc.json` and includes:

### Key Rules

- **Property Ordering**: CSS properties must follow a logical order (positioning → display → box model → typography → visual)
- **Color Format**:
  - Hex colors must use 6-digit format (`#ffffff` not `#fff`)
  - Use named colors sparingly (prefer hex/rgb)
  - Modern color function notation (no `rgba`, use `rgb` with alpha)
- **No Vendor Prefixes**: Autoprefixer should handle these
- **Function URL Quotes**: URLs must be quoted
- **Empty Lines**: Multi-line rules should have empty lines before them

### Disabled Rules

Some rules are disabled to accommodate the existing codebase:
- Pattern matching for class names, IDs, and custom properties
- Descending specificity warnings
- Some redundant longhand property checks

## Common Issues and Fixes

### Property Order

**Problem:**
```css
.example {
  color: red;
  display: flex;  /* ❌ display should come before color */
}
```

**Solution:**
```css
.example {
  display: flex;  /* ✅ display first */
  color: red;     /* ✅ color after */
}
```

### Hex Color Length

**Problem:**
```css
.example {
  color: #fff;  /* ❌ short hex notation */
}
```

**Solution:**
```css
.example {
  color: #ffffff;  /* ✅ full hex notation */
}
```

### Color Function Notation

**Problem:**
```css
.example {
  color: rgba(0, 0, 0, 0.5);  /* ❌ old notation */
}
```

**Solution:**
```css
.example {
  color: rgb(0 0 0 / 0.5);  /* ✅ modern notation */
}
```

### Alpha Values

**Problem:**
```css
.example {
  opacity: 50%;  /* ❌ percentage notation */
}
```

**Solution:**
```css
.example {
  opacity: 0.5;  /* ✅ decimal notation */
}
```

## Auto-fixing

Many issues can be automatically fixed by running:

```bash
npm run lint:css:fix
```

This will fix:
- Property ordering
- Spacing and indentation
- Some color format issues
- Empty lines before rules

## Ignoring Rules

To disable a rule for a specific line or block:

```css
/* stylelint-disable-next-line rule-name */
.special-case {
  color: red;
}

/* stylelint-disable rule-name */
.block {
  /* rules disabled for entire block */
}
/* stylelint-enable rule-name */
```

## IDE Integration

### VS Code

Install the [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) for real-time linting feedback.

### Other Editors

See the [Stylelint documentation](https://stylelint.io/user-guide/integrations/editor) for integration guides.
