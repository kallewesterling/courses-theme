# courses-theme

Custom theme for [Chainguard Courses](https://courses.chainguard.dev), a learning platform built on [Skilljar](https://www.skilljar.com). This repo contains the CSS and JavaScript that override Skilljar's default UI with Chainguard branding and additional functionality.

> **Note:** This is a public repository. It contains no credentials or secrets, but keep that in mind when adding comments, commit messages, or documentation.

---

## How it works

Skilljar is a SaaS LMS. It renders pages server-side and allows custom CSS and JavaScript to be injected via its admin console. This repo provides those assets:

- **`production/style.css`** — CSS entry point, imported by Skilljar. Uses `@import` to pull in modular stylesheets.
- **`production/theme.mjs`** — JS entry point. Runs on `DOMContentLoaded`, detects which Skilljar page type is loaded, and applies the appropriate view handler.
- **`production/preload.js`** — Injected before `theme.mjs`. Sets `body { display: none }` to prevent a flash of unstyled content; `theme.mjs` restores visibility once the DOM is ready.

Both the CSS and JS URLs are configured directly in the Skilljar admin console, pointing to the files served from Google Cloud Storage.

---

## Repository structure

```
courses-theme/
├── production/                  # Source files (synced to GCS on merge to main)
│   ├── theme.mjs                # JS entry point
│   ├── preload.js               # Anti-FOUC preload script
│   ├── style.css                # CSS entry point (@import manifest)
│   ├── skilljar-theme-v3.0/    # Theme modules
│   │   ├── CG.mjs              # Global state, environment detection, DOM refs
│   │   ├── router.mjs          # Page-type detection and view dispatch
│   │   ├── sections.mjs        # Course section / card rendering
│   │   ├── views/              # One handler per Skilljar page type
│   │   └── ...                 # Utilities, icons, footer, logger, etc.
│   ├── css/                     # Modular stylesheets
│   │   ├── defs/               # Design tokens (colors, fonts, variables)
│   │   └── *.css               # Per-page and global styles
│   └── data/                    # Static content: copy, config, SVG, sections
├── fonts/                       # Custom font files (Gellix, Roobert)
├── dist/                        # Built CSS output (not committed; CI-generated)
├── test/                        # Test files + compiled CSS bundle for the mock
├── internal/                    # Internal dev tooling (not deployed)
│   ├── mock-landing-page.html  # Static HTML preview of the landing page
│   └── PLANS.md                # Rough notes and future ideas
└── package.json
```

---

## Prerequisites

- **Node.js** 25.4.0 (only version tested)
- **npm**

---

## Setup

```bash
npm install
```

---

## Local development

There is no local dev server that connects to Skilljar. The options for previewing changes are:

**1. Mock page (CSS / landing page layout only)**

Build the test CSS bundle and open the mock in a browser:

```bash
npm run build:css:test     # outputs to test/bundle.min.css
open internal/mock-landing-page.html
```

The mock reflects the landing page structure with static HTML. It does not run the JS theme or Skilljar globals.

**2. Staging (full Skilljar integration)**

Push changes to `main`. The GCS sync workflow deploys `production/` automatically, and the staging instance at `chainguard-test.skilljar.com` picks up the changes. There is no way to test against staging locally.

---

## npm scripts

| Command | What it does |
|---|---|
| `npm run build:css` | Build minified CSS → `dist/bundle.min.css` |
| `npm run build:css:test` | Build minified CSS → `test/bundle.min.css` (for mock page) |
| `npm run build:css:dev` | Build CSS with source maps → `dist/bundle.css` |
| `npm run watch:css` | Watch and rebuild CSS on changes |
| `npm run build` | Lint everything, then build minified CSS |
| `npm run lint` | Run CSS and JS linters |
| `npm run lint:css:fix` | Auto-fix CSS lint issues |
| `npm test` | Run unit tests |

---

## Testing

Unit tests live in `test/` and use Node's native test runner:

```bash
npm test
```

Tests cover utility functions (`sanitizeUrl`, `toTitleCase`) and code block utilities (`parseLineSpec`, `cleanCommandPrompt`, line number injection).

---

## Linting

CSS is linted with **stylelint** (config in `.stylelintrc.json`) and JS with **ESLint** (config in `eslint.config.mjs`). Both run as part of `npm run build` and are enforced by pre-commit hooks via `.pre-commit-config.yaml`.

```bash
npm run lint          # check
npm run lint:css:fix  # auto-fix CSS
```

---

## Deployment

### JS and CSS source files

On every push to `main` that touches `production/` or `fonts/`, a GitHub Actions workflow syncs those directories to the GCS bucket `chainguard-courses-theme`:

```
production/  →  gs://chainguard-courses-theme/production/
fonts/       →  gs://chainguard-courses-theme/fonts/
```

Skilljar then serves the assets from those GCS URLs. Authentication uses Workload Identity Federation — no long-lived credentials are stored.

### CSS bundle

A separate CI step to build `dist/bundle.min.css` and deploy it is **planned but not yet active**. The current setup serves `production/style.css` directly, with browser-level `@import` resolution loading the individual stylesheets from GCS.

---

## Theme architecture

### Entry point flow

```
preload.js          →  hides body (anti-FOUC)
theme.mjs           →  DOMContentLoaded
  ├── CG (init)     →  detects environment, page type, DOM references
  ├── preRoute()    →  shared DOM setup (header, breadcrumbs, body classes)
  ├── route()       →  finds matching view handler and runs it
  └── postRoute()   →  final DOM adjustments (footer, messages)
```

### Page routing

`router.mjs` maps Skilljar page types to view handlers:

| Page | Handler |
|---|---|
| Login / signup | `authView` |
| Course (unregistered) | `courseUnregisteredView` |
| Course (registered) | `courseRegisteredView` |
| Learning path (unregistered) | `pathUnregisteredView` |
| Learning path (registered) | `pathRegisteredView` |
| Lesson | `lessonView` |
| Catalog / landing | `catalogView` |
| 404 | `notFoundView` |

Page type is detected from Skilljar-injected CSS classes on `<body>` (e.g. `sj-page-lesson`, `sj-page-catalog`).

### CG object

`CG.mjs` is the global namespace for the theme:

- `CG.env` — environment flags (`isStaging`, `isAdmin`, `isInternal`, `isPartner`, …)
- `CG.page` — page type flags (`isLesson`, `isCatalog`, `isLanding`, …)
- `CG.state` — runtime state (course data, user info, breadcrumbs, progress)
- `CG.dom` — cached references to key DOM nodes
- `CG.el` — element factories (logo, CTAs, mobile header)
- `CG.data` — computed data (curriculum sections)

On staging and for admin users, `CG`, `logger`, and `animateCompletion` are exposed on `window` for debugging.

### Data and content

All static content (landing page copy, course sections, footer links, SVG graphics, UTM parameters) lives in `production/data/`. To add or edit courses/paths shown on the landing page, edit `production/data/path-sections.mjs`.

---

## CSS system

### Import order

`production/style.css` loads stylesheets in a fixed order:

1. **Definitions** — `defs/colors.css`, `defs/fonts.css`, `defs/variables.css`
2. **Globals** — `animations.css`, `globals.css`, `header.css`, `footer.css`, `breadcrumbs.css`
3. **Page styles** — `catalog.css`, `lessons.css`, `auth.css`, etc.

### Design tokens

All spacing, colour, typography, and motion values are CSS custom properties defined in `production/css/defs/`. Use these variables rather than raw values. Key scales:

- **Spacing**: `--spacing-1` (4px) → `--spacing-24` (96px)
- **Gap**: `--gap-1` (4px) → `--gap-10` (40px)
- **Font sizes**: `--font-size-xs` (12px) → `--font-size-6xl` (fluid, up to 96px)
- **Colours**: `--blurple`, `--ink`, `--ink-dim`, `--color-brand-lime`, etc.

### Skilljar overrides

Skilljar ships its own CSS that must be overridden. `!important` is used throughout — this is expected and necessary, not a mistake.
