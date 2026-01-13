# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom theme for Chainguard's Skilljar-based training platform. It applies custom styles and functionality to enhance the user experience on courses.chainguard.com. The theme is injected into Skilljar pages and provides:

- Custom styling and responsive design
- Page-specific views (courses, lessons, catalog, authentication)
- Dynamic DOM manipulation and element injection
- Syntax highlighting with Shiki
- Course completion animations
- Custom footer generation

## Development Commands

### Linting
```bash
# Lint CSS files
npx stylelint production/style.css production/css/*.css

# Lint JavaScript files
npx eslint production/**/*.{js,mjs}
```

### Syntax Checking
```bash
# Check JavaScript syntax
node --check production/theme.mjs
node --check production/skilljar-theme-v3.0/*.mjs
```

### Pre-commit Hooks
Pre-commit hooks are configured in `.pre-commit-config.yaml` to run CSS and JS syntax checks automatically.

## Architecture

### Core Entry Point

**`production/theme.mjs`** - Main entry point that orchestrates the theme. On DOMContentLoaded:
1. Initializes the CG state object
2. Cleans up Skilljar's default DOM elements
3. Injects custom header, footer, and navigation
4. Routes to appropriate view handler based on page type
5. Shows the page (prevents FOUC via preload.js)

**`production/preload.js`** - Loaded before theme.mjs to hide the body and prevent Flash of Unstyled Content (FOUC).

### CG Object (`production/skilljar-theme-v3.0/CG.mjs`)

Central state management object containing:
- `env` - Environment detection (staging, logged in, admin, partner status)
- `page` - Page type detection (lesson, course, catalog, auth, etc.)
- `state` - Runtime state (user data, breadcrumbs, progress)
- `dom` - Cached DOM element references
- `el` - Pre-constructed elements for injection
- `data` - Static data (CONFIG, UTM params)

The CG object is imported and used throughout all modules.

### Router System (`production/skilljar-theme-v3.0/router.mjs`)

Routes pages to view handlers using a test/handler pattern:
- Each handler in `pageHandlers` has a test function and view function
- Router finds first matching test and executes corresponding handler
- View handlers are in `production/skilljar-theme-v3.0/views/`

### Views (`production/skilljar-theme-v3.0/views/*.mjs`)

Page-specific styling and functionality:
- `lesson.mjs` - Lesson pages (main learning interface)
- `course.mjs` - Course landing pages (registered/unregistered states)
- `path.mjs` - Learning path pages
- `catalog.mjs` - Course catalog/landing page
- `auth.mjs` - Login/signup pages
- `404.mjs` - Not found page

Each view manipulates the DOM and applies page-specific styles.

### Utility Modules

- `meta.mjs` - DOM query shortcuts (Q, A, c), element creation (el), URL utilities
- `logger.mjs` - Logging with environment-aware verbosity
- `styling.mjs` - Show/hide utilities, CSS injection
- `sections.mjs` - Section manipulation for lessons
- `icons.mjs` - Icon definitions
- `footer.mjs` - Footer generation logic
- `debug.mjs` - Admin debug tools
- `static.mjs` - Static data (CONFIG, footer data)

### Styling

CSS is organized in `production/css/`:
- `_colors.css`, `_fonts.css`, `_animations.css` - Base variables/utilities
- `_freezebox.css` - Loading state styling
- Page-specific CSS files match view names (lesson.css, course.css, etc.)
- `globals.css` - Global overrides
- Compiled to `production/style.css`

## Key Patterns

### DOM Querying
Use meta.mjs utilities:
- `Q(selector)` - querySelector shorthand
- `A(selector)` - querySelectorAll shorthand
- `c(selector)` - Returns element or false

### Element Creation
Use `el(tag, props)` from meta.mjs:
```javascript
el("div", { className: "my-class", text: "Hello" })
```

### Page Detection
Check `CG.page` properties:
```javascript
if (CG.page.isLesson) { /* lesson-specific code */ }
```

### Environment Detection
Check `CG.env` properties:
```javascript
if (CG.env.isAdmin) { /* admin-only features */ }
```

### Adding New Views
1. Create new view file in `production/skilljar-theme-v3.0/views/`
2. Add corresponding CSS file in `production/css/`
3. Add page detection to CG.page in CG.mjs
4. Add handler to pageHandlers in router.mjs
5. Import view in router.mjs

## Important Notes

- This code runs in the Skilljar platform context where global variables like `skilljarUser`, `skilljarCourse`, etc. are available
- The theme must not break Skilljar's core functionality
- All DOM manipulation must account for Skilljar's dynamic content loading
- ES modules are used throughout (`.mjs` extension)
- External library: Shiki for syntax highlighting loaded from esm.sh
