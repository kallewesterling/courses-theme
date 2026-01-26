# Codebase Improvement Plan: Chainguard Courses Theme v3.0

**Date:** 2026-01-26
**Codebase Size:** ~3,223 lines of JavaScript/MJS
**Main Location:** `production/skilljar-theme-v3.0/**/*.mjs`

---

## Executive Summary

This document outlines recommended improvements for the Chainguard Courses Theme codebase. The current implementation is functional but would benefit from better architecture, testing, type safety, and maintainability improvements. Recommendations are prioritized by impact and complexity.

---

## 1. Architecture & Code Organization

### 1.1 Refactor the CG Monolith (Priority: HIGH)

**Current Issue:**
- The `CG` object in `CG.mjs` (462 lines) is a massive monolith mixing multiple concerns:
  - Environment detection (lines 6-48)
  - Page type detection (lines 49-81)
  - State management (lines 82-250)
  - Element factories (lines 251-290)
  - DOM references (lines 291-346)
  - Data transformations (lines 348-461)

**Recommendation:**
Break down into focused modules:
```
/skilljar-theme-v3.0/
  /state/
    environment.mjs      # Environment detection
    page.mjs             # Page type detection
    user.mjs             # User state
    course.mjs           # Course state
  /dom/
    references.mjs       # DOM element references
    queries.mjs          # Reusable query functions
  /components/
    breadcrumbs.mjs      # Breadcrumb component
    curriculum.mjs       # Curriculum component
    elements.mjs         # Element factory functions
```

**Benefits:**
- Easier testing of individual modules
- Clearer separation of concerns
- Reduced cognitive load
- Better tree-shaking potential

**Estimated Effort:** 2-3 days

---

### 1.2 Implement State Management Pattern (Priority: MEDIUM)

**Current Issue:**
- State is scattered across getters with side effects
- No clear single source of truth
- Difficult to track state changes
- Getters recalculate on every access (e.g., `breadcrumbs.data` at line 91-108)

**Recommendation:**
Implement a simple state management pattern:

```javascript
// state-manager.mjs
class StateManager {
  constructor() {
    this.state = {};
    this.listeners = new Map();
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  }

  notify(key, value) {
    const callbacks = this.listeners.get(key) || [];
    callbacks.forEach(cb => cb(value));
  }
}

export const appState = new StateManager();
```

**Benefits:**
- Predictable state updates
- Easier debugging
- Better performance (computed values can be cached)

**Estimated Effort:** 1-2 days

---

### 1.3 Extract View Logic into Controllers (Priority: MEDIUM)

**Current Issue:**
- View files like `lesson.mjs` (524 lines) mix DOM manipulation, event handling, and business logic
- Functions like `lessonView()` do too much (lines 450-523)

**Recommendation:**
Adopt a controller pattern:

```javascript
// views/lesson/lesson-controller.mjs
export class LessonController {
  constructor(dom, config) {
    this.dom = dom;
    this.config = config;
  }

  initialize() {
    this.setupNavigation();
    this.processCodeBlocks();
    this.setupLinks();
    this.buildResourceBox();
  }

  setupNavigation() { /* ... */ }
  processCodeBlocks() { /* ... */ }
  setupLinks() { /* ... */ }
  buildResourceBox() { /* ... */ }
}

// views/lesson.mjs
export function lessonView() {
  const controller = new LessonController(
    getDOMReferences(),
    getConfig()
  );
  controller.initialize();
}
```

**Benefits:**
- Testable in isolation
- Clearer responsibility boundaries
- Easier to extend

**Estimated Effort:** 2-3 days

---

## 2. Type Safety & Documentation

### 2.1 Add TypeScript or JSDoc Type Annotations (Priority: HIGH)

**Current Issue:**
- Many functions lack type information
- Function parameters are sometimes unclear
- No compile-time type checking
- Inconsistent JSDoc coverage (some functions have it, others don't)

**Recommendation:**
**Option A:** Migrate to TypeScript (higher effort, better long-term benefits)
**Option B:** Add comprehensive JSDoc annotations (lower effort, immediate benefits)

**Example JSDoc improvements:**

```javascript
/**
 * @typedef {Object} CourseDetails
 * @property {string} audience - Target audience description
 * @property {string} time - Estimated completion time
 * @property {number} lessons - Number of lessons
 */

/**
 * @typedef {Object} CardOptions
 * @property {string} [btnText="Register"] - Button text
 * @property {string} [btnHref="#"] - Button URL
 * @property {boolean} [completed=false] - Completion status
 */

/**
 * Creates a course details card
 * @param {CourseDetails} details - Course details
 * @param {CardOptions} options - Card options
 * @returns {HTMLElement} The created card element
 */
function createCourseDetailsCard(details, options) {
  // ...
}
```

**Benefits:**
- Better IDE autocomplete
- Catch bugs earlier
- Self-documenting code
- Easier onboarding

**Estimated Effort:**
- Option A (TypeScript): 5-7 days
- Option B (JSDoc): 2-3 days

---

### 2.2 Create Type Definitions for Global Objects (Priority: HIGH)

**Current Issue:**
- Reliance on global variables: `skilljarUser`, `skilljarCourse`, `skilljarCourseSeries`, `resources`, etc.
- No type definitions for these globals
- Runtime errors if globals are undefined

**Recommendation:**
Create type definitions and add runtime checks:

```javascript
/**
 * @typedef {Object} SkilljarUser
 * @property {string} email
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 */

/**
 * @typedef {Object} SkilljarCourse
 * @property {string} id
 * @property {string} publishedCourseId
 * @property {string} title
 * @property {string} short_description
 * @property {string} long_description_html
 * @property {Array<string>} tags
 */

// globals.d.js or in a types file
/** @type {SkilljarUser | undefined} */
const skilljarUser = window.skilljarUser;

// Add runtime guards
function requireGlobal(name, value) {
  if (typeof value === 'undefined') {
    throw new Error(`Required global "${name}" is not defined`);
  }
  return value;
}

// Usage
const user = requireGlobal('skilljarUser', window.skilljarUser);
```

**Benefits:**
- Better error messages
- Type checking in editors
- Clearer dependencies

**Estimated Effort:** 1 day

---

## 3. Error Handling & Logging

### 3.1 Implement Centralized Error Handling (Priority: HIGH)

**Current Issue:**
- Minimal try-catch blocks
- Errors may fail silently
- No error reporting/tracking
- Example: `course.mjs` lines 107-111 has a try-catch but others don't

**Recommendation:**

```javascript
// error-handler.mjs
export class ErrorHandler {
  /**
   * @param {Error} error
   * @param {Object} context
   */
  static handle(error, context = {}) {
    logger.error('Error occurred:', error, context);

    // Send to error tracking service (e.g., Sentry)
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: context });
    }

    // Show user-friendly message
    this.showUserMessage(error);
  }

  static showUserMessage(error) {
    // Display user-friendly error message
    const message = this.getUserFriendlyMessage(error);
    // Show toast/notification
  }

  static getUserFriendlyMessage(error) {
    const messages = {
      'TypeError': 'Something went wrong. Please refresh the page.',
      'NetworkError': 'Network error. Please check your connection.',
    };
    return messages[error.name] || 'An unexpected error occurred.';
  }
}

// Usage
try {
  riskyOperation();
} catch (error) {
  ErrorHandler.handle(error, {
    component: 'lessonView',
    action: 'processCodeBlocks'
  });
}
```

**Benefits:**
- Consistent error handling
- Better debugging
- User experience improvements
- Error tracking integration

**Estimated Effort:** 1-2 days

---

### 3.2 Improve Logger with Levels and Filtering (Priority: MEDIUM)

**Current Issue:**
- Simple logger with only info/warn/error
- No log level filtering
- No log persistence or export
- Logger in `logger.mjs` is very basic (lines 1-54)

**Recommendation:**

```javascript
// logger.mjs
class Logger {
  constructor() {
    this.levels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
    };
    this.currentLevel = this.levels.INFO;
    this.buffer = [];
    this.maxBufferSize = 100;
  }

  setLevel(level) {
    this.currentLevel = this.levels[level] || this.levels.INFO;
  }

  debug(message, ...args) {
    this._log('DEBUG', message, args);
  }

  info(message, ...args) {
    this._log('INFO', message, args);
  }

  warn(message, ...args) {
    this._log('WARN', message, args);
  }

  error(message, ...args) {
    this._log('ERROR', message, args);
  }

  _log(level, message, args) {
    if (!this.shouldLog(level)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      args,
    };

    this.buffer.push(logEntry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    this._output(level, message, args);
  }

  shouldLog(level) {
    return CG.env.isStaging || CG.env.isAdmin ||
           this.levels[level] >= this.currentLevel;
  }

  _output(level, message, args) {
    const styles = {
      DEBUG: 'color: gray; font-weight: 600;',
      INFO: 'color: var(--primary-blue-hex); font-weight: 600;',
      WARN: 'color: darkorange; font-weight: 600;',
      ERROR: 'color: darkred; font-weight: 600;',
    };

    const method = level === 'ERROR' ? 'error' :
                   level === 'WARN' ? 'warn' : 'log';

    console[method](`%c[CG:${level}] ${message}`, styles[level], ...args);
  }

  exportLogs() {
    return JSON.stringify(this.buffer, null, 2);
  }
}

export const logger = new Logger();
```

**Benefits:**
- Better debugging capabilities
- Log export for support
- Performance (skip debug logs in production)

**Estimated Effort:** 0.5-1 day

---

## 4. Performance Optimizations

### 4.1 Implement DOM Query Caching (Priority: MEDIUM)

**Current Issue:**
- Repeated `querySelector` calls for same elements
- No caching strategy
- Example: `CG.dom.contentContainer` is computed every time (line 299-301)

**Recommendation:**

```javascript
// dom-cache.mjs
class DOMCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * @param {string} selector
   * @param {boolean} [forceRefresh=false]
   * @returns {HTMLElement | null}
   */
  get(selector, forceRefresh = false) {
    if (forceRefresh || !this.cache.has(selector)) {
      const element = document.querySelector(selector);
      this.cache.set(selector, element);
    }
    return this.cache.get(selector);
  }

  /**
   * @param {string} selector
   * @returns {NodeListOf<HTMLElement>}
   */
  getAll(selector) {
    return document.querySelectorAll(selector);
  }

  clear() {
    this.cache.clear();
  }

  invalidate(selector) {
    this.cache.delete(selector);
  }
}

export const domCache = new DOMCache();

// Usage
const header = domCache.get('#header');
// Subsequent calls use cache
const headerAgain = domCache.get('#header');
```

**Benefits:**
- Faster DOM access
- Reduced reflows
- Better performance on slower devices

**Estimated Effort:** 1 day

---

### 4.2 Lazy Load Code Highlighter (Priority: LOW)

**Current Issue:**
- Shiki library loaded immediately via ESM import
- Not all pages need syntax highlighting
- 3rd party dependency loaded from CDN

**Recommendation:**

```javascript
// shiki-loader.mjs
let shikiInstance = null;

export async function getShiki() {
  if (!shikiInstance) {
    shikiInstance = await import("https://esm.sh/shiki@3.0.0");
  }
  return shikiInstance;
}

// Usage in lesson.mjs
async function processPre(pre) {
  const shiki = await getShiki();
  // Use shiki...
}
```

**Benefits:**
- Faster initial page load
- On-demand loading
- Better resource utilization

**Estimated Effort:** 0.5 day

---

### 4.3 Debounce/Throttle Event Handlers (Priority: LOW)

**Current Issue:**
- No event handler optimization visible
- Potential performance issues on scroll/resize events

**Recommendation:**

```javascript
// utils/performance.mjs
/**
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

**Benefits:**
- Smoother performance
- Reduced CPU usage
- Better UX on low-end devices

**Estimated Effort:** 0.5 day

---

## 5. Security Improvements

### 5.1 Remove Hardcoded Admin Email (Priority: HIGH)

**Current Issue:**
- Admin check uses hardcoded email: `CG.mjs` line 19
- Security through obscurity
- Not scalable

**Location:** `CG.mjs:19`

**Recommendation:**

```javascript
// Check against a group or role instead
get isAdmin() {
  if (!this.isLoggedIn) return false;

  // Use group membership instead
  return this.hasGroups &&
         window.skilljarUserStudentGroups
           .some(group => group.id === CONFIG.adminGroupId);
}
```

**Configuration:**
```javascript
// static.mjs
export const CONFIG = {
  // ...
  adminGroupId: '1234567890abc', // Admin group ID
  // ...
};
```

**Benefits:**
- No code changes for admin management
- Better security
- Scalable solution

**Estimated Effort:** 0.5 day

---

### 5.2 Sanitize HTML Inputs (Priority: HIGH)

**Current Issue:**
- `innerHTML` usage in `meta.mjs` line 74
- Potential XSS vulnerability
- No HTML sanitization

**Recommendation:**

```javascript
// security/sanitizer.mjs
/**
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html; // This escapes HTML
  return div.innerHTML;
}

/**
 * For cases where HTML is needed, use DOMPurify
 * @param {string} html
 * @returns {string}
 */
export function sanitizeAndAllowHTML(html) {
  // Option 1: Use DOMPurify library
  if (window.DOMPurify) {
    return window.DOMPurify.sanitize(html);
  }

  // Option 2: Whitelist-based sanitization
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove non-whitelisted elements
  const allElements = doc.body.getElementsByTagName('*');
  for (let i = allElements.length - 1; i >= 0; i--) {
    const el = allElements[i];
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      el.replaceWith(...el.childNodes);
    }
  }

  return doc.body.innerHTML;
}

// Update el() function
export function el(tag, props = {}, children = []) {
  // ...
  if (k === "innerHTML") {
    n.innerHTML = sanitizeAndAllowHTML(v);
  }
  // ...
}
```

**Benefits:**
- Prevent XSS attacks
- Safer HTML handling
- Better security posture

**Estimated Effort:** 1 day

---

### 5.3 Add Content Security Policy Headers (Priority: MEDIUM)

**Current Issue:**
- No CSP headers mentioned
- External scripts loaded from CDN (esm.sh)
- Potential XSS risks

**Recommendation:**

Add CSP headers via Skilljar platform configuration or meta tags:

```html
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://esm.sh;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        font-src 'self' data:;
        connect-src 'self';
      ">
```

**Benefits:**
- Defense-in-depth security
- Mitigate XSS risks
- Industry best practice

**Estimated Effort:** 0.5 day (configuration dependent)

---

## 6. Testing Infrastructure

### 6.1 Add Unit Testing Framework (Priority: HIGH)

**Current Issue:**
- No tests visible in codebase
- No testing framework configured
- Difficult to verify changes
- Risk of regressions

**Recommendation:**

Set up Vitest (fast, modern, ESM-friendly):

```bash
npm install -D vitest @vitest/ui jsdom
```

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
});
```

**Example test:**

```javascript
// meta.test.mjs
import { describe, it, expect } from 'vitest';
import { el, Q, toTitleCase } from '../production/skilljar-theme-v3.0/meta.mjs';

describe('meta utilities', () => {
  describe('toTitleCase', () => {
    it('converts string to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });
  });

  describe('el', () => {
    it('creates HTML element with properties', () => {
      const div = el('div', { className: 'test', text: 'Hello' });
      expect(div.tagName).toBe('DIV');
      expect(div.className).toBe('test');
      expect(div.textContent).toBe('Hello');
    });

    it('creates SVG elements', () => {
      const svg = el('svg', { viewBox: '0 0 100 100' });
      expect(svg.tagName).toBe('svg');
      expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });
  });
});
```

**Benefits:**
- Catch bugs early
- Refactor with confidence
- Documentation via tests
- Better code quality

**Estimated Effort:** 2-3 days (initial setup + writing tests)

---

### 6.2 Add Integration Tests (Priority: MEDIUM)

**Recommendation:**

Use Playwright for end-to-end testing:

```javascript
// tests/e2e/lesson-page.spec.js
import { test, expect } from '@playwright/test';

test.describe('Lesson Page', () => {
  test('should display code blocks with copy button', async ({ page }) => {
    await page.goto('/lesson/some-lesson');

    const codeBlock = page.locator('pre:has(code)').first();
    await expect(codeBlock).toBeVisible();

    const copyButton = codeBlock.locator('.code-block-controls');
    await expect(copyButton).toBeVisible();

    await copyButton.click();
    await expect(page.locator('.tooltip-copied')).toBeVisible();
  });

  test('should navigate to next lesson', async ({ page }) => {
    await page.goto('/lesson/lesson-1');

    const nextButton = page.locator('.lesson-btn.next');
    await nextButton.click();

    await expect(page).toHaveURL(/lesson\/lesson-2/);
  });
});
```

**Benefits:**
- Test user workflows
- Catch integration bugs
- Confidence in deployments

**Estimated Effort:** 2-3 days

---

### 6.3 Add Test Coverage Reporting (Priority: LOW)

**Recommendation:**

```javascript
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

**Benefits:**
- Identify untested code
- Track testing progress
- Quality metrics

**Estimated Effort:** 0.5 day

---

## 7. Code Quality & Maintainability

### 7.1 Fix ESLint Configuration (Priority: MEDIUM)

**Current Issue:**
- ESLint config exists but has syntax errors
- `eslint.config.mjs` line 10: `extends` in wrong position

**Current:**
```javascript
{ files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
```

**Should be:**
```javascript
export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
    },
  },
]);
```

**Benefits:**
- Working linting
- Catch common errors
- Enforce code standards

**Estimated Effort:** 0.5 day

---

### 7.2 Extract Magic Values to Constants (Priority: MEDIUM)

**Current Issue:**
- Magic strings and numbers throughout
- Examples:
  - Group IDs: `"a7iai6t7agi9"` (line 29), `"1axsvmzhtbb95"` (line 42)
  - Hardcoded URLs and paths
  - Magic numbers in styling

**Recommendation:**

```javascript
// constants.mjs
export const GROUP_IDS = {
  INTERNAL: 'a7iai6t7agi9',
  PARTNER: '1axsvmzhtbb95',
};

export const TIMEOUTS = {
  TOOLTIP_HIDE: 400,
  DEBOUNCE_DEFAULT: 300,
  THROTTLE_DEFAULT: 100,
};

export const SELECTORS = {
  HEADER: '#header',
  CONTENT_CONTAINER: '#skilljar-content',
  LESSON_CONTAINER: '.sj-page-lesson',
};

// Usage
return window.skilljarUserStudentGroups
  .map((d) => d.id)
  .includes(GROUP_IDS.INTERNAL);
```

**Benefits:**
- Easier updates
- Self-documenting code
- Reduced duplication

**Estimated Effort:** 1 day

---

### 7.3 Break Down Large Functions (Priority: MEDIUM)

**Current Issue:**
- Functions over 100 lines
- Multiple responsibilities
- Hard to test

**Examples:**
- `lessonView()` in `lesson.mjs`: 74 lines (450-523)
- `buildResourceBox()` in `lesson.mjs`: 77 lines (11-77)
- `CG.data.curriculumElements` getter: 58 lines (402-459)

**Recommendation:**

```javascript
// Before: 77 lines
function buildResourceBox() {
  // ... all logic here
}

// After: Broken into smaller functions
function buildResourceBox() {
  const elems = getResourceElements();

  if (!hasResources()) return;

  ensureResourceBoxExists(elems);
  populateResourceBoxes(elems);
}

function getResourceElements() {
  return {
    get boxes() {
      return A("sjwc-lesson-content-item .resource-box");
    },
    get lastBodyItem() {
      return Array.from(A("sjwc-lesson-content-item")).pop();
    },
    get numBoxes() {
      return this.boxes.length;
    }
  };
}

function hasResources() {
  return typeof resources.resources !== "undefined" ||
         typeof resources.groups !== "undefined";
}

function ensureResourceBoxExists(elems) {
  if (elems.numBoxes === 0 && hasResourcesList()) {
    elems.lastBodyItem.append(createResourceBoxElement());
  }
}

function populateResourceBoxes(elems) {
  if (hasResourcesList()) {
    populateSingleBox(elems.boxes[0]);
  } else if (hasResourceGroups()) {
    populateGroupedBoxes(elems.boxes);
  }
}
```

**Benefits:**
- Easier to understand
- Easier to test
- Easier to maintain
- Better reusability

**Estimated Effort:** 2-3 days

---

### 7.4 Add Pre-commit Hooks (Priority: LOW)

**Current Issue:**
- `.pre-commit-config.yaml` exists but unclear if it's active
- No automated code quality checks

**Recommendation:**

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict

  - repo: local
    hooks:
      - id: eslint
        name: ESLint
        entry: npx eslint
        language: node
        files: \.(m?js)$
        args: [--fix]

      - id: stylelint
        name: Stylelint
        entry: npx stylelint
        language: node
        files: \.css$
        args: [--fix]
```

**Benefits:**
- Consistent code quality
- Catch issues before commit
- Automated formatting

**Estimated Effort:** 0.5 day

---

## 8. Documentation

### 8.1 Create Architecture Documentation (Priority: MEDIUM)

**Current Issue:**
- No high-level architecture documentation
- Hard for new developers to understand system

**Recommendation:**

Create `ARCHITECTURE.md`:

```markdown
# Chainguard Courses Theme Architecture

## Overview
Custom theme for Skilljar LMS platform

## Module Structure
- `/views` - Page-specific view handlers
- `/state` - State management
- `/dom` - DOM utilities and references
- `/components` - Reusable UI components

## Key Flows
### Page Load
1. DOMContentLoaded fires
2. Router determines page type
3. Appropriate view handler executes
4. Custom styling applied
5. Body shown

### Code Block Processing
1. Find all `<pre>` elements
2. Apply Shiki syntax highlighting
3. Add copy button
4. Apply line highlighting if specified

## Global Dependencies
- Skilljar global objects
- Shiki (external CDN)
```

**Benefits:**
- Faster onboarding
- Better understanding
- Easier maintenance

**Estimated Effort:** 1 day

---

### 8.2 Add Inline Comments for Complex Logic (Priority: MEDIUM)

**Current Issue:**
- Complex logic without explanation
- Examples:
  - Curriculum element generation (CG.mjs:402-459)
  - Line spec parsing (lesson.mjs:249-265)
  - Next lesson click handling (lesson.mjs:333-375)

**Recommendation:**

```javascript
// Before
function parseLineSpec(spec) {
  const out = new Set();
  for (const part of spec.split(",")) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    for (let i = Math.min(start, end); i <= Math.max(start, end); i++)
      out.add(i);
  }
  return out;
}

// After
/**
 * Parses a line specification string into a set of line numbers.
 *
 * Supports formats:
 * - Single line: "5" -> Set{5}
 * - Multiple lines: "3,5,7" -> Set{3,5,7}
 * - Range: "3-7" -> Set{3,4,5,6,7}
 * - Combined: "3,5-7,10" -> Set{3,5,6,7,10}
 *
 * @param {string} spec - The line specification string
 * @returns {Set<number>} Set of line numbers to highlight
 * @example
 * parseLineSpec("3,5-7") // Returns Set{3,5,6,7}
 */
function parseLineSpec(spec) {
  const out = new Set();

  // Split by comma to handle multiple parts
  for (const part of spec.split(",")) {
    const p = part.trim();
    if (!p) continue;

    // Match single number or range (e.g., "5" or "5-7")
    const m = p.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;

    // Extract start and end (end defaults to start for single numbers)
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;

    // Add all numbers in range to set (handles reverse ranges too)
    for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
      out.add(i);
    }
  }

  return out;
}
```

**Benefits:**
- Easier to understand
- Reduces cognitive load
- Better maintainability

**Estimated Effort:** 2 days

---

### 8.3 Create README with Setup Instructions (Priority: LOW)

**Current Issue:**
- Minimal README (only "Chainguard Courses")
- No setup or development instructions

**Recommendation:**

```markdown
# Chainguard Courses Theme v3.0

Custom theme for the Chainguard Skilljar learning platform.

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
npm install
```

### Development
```bash
# Lint code
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Format code
npm run format
```

### Project Structure
```
production/
  skilljar-theme-v3.0/
    views/          # Page-specific views
    *.mjs           # Core modules
  theme.mjs         # Entry point
```

### Key Concepts
- **Router**: Determines page type and routes to correct view
- **CG Object**: Central state and utility object
- **View Functions**: Page-specific styling and functionality

### Deployment
Files are deployed to Skilljar via their platform.

### Contributing
1. Create feature branch
2. Make changes
3. Add tests
4. Submit PR

### License
MIT
```

**Benefits:**
- Easier onboarding
- Clear workflow
- Professional appearance

**Estimated Effort:** 0.5 day

---

## 9. Build & Deployment

### 9.1 Add Build Pipeline (Priority: LOW)

**Current Issue:**
- No build step
- Raw source deployed
- No minification
- No bundling
- Terser installed but not used in a pipeline

**Recommendation:**

```javascript
// build.mjs
import { minify } from 'terser';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

async function buildProduction() {
  const files = await glob('production/**/*.mjs');

  for (const file of files) {
    const code = readFileSync(file, 'utf-8');
    const result = await minify(code, {
      module: true,
      compress: {
        dead_code: true,
        drop_console: true,
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    });

    const outFile = file.replace('production/', 'dist/');
    writeFileSync(outFile, result.code);
  }

  console.log('Build complete!');
}

buildProduction();
```

**package.json:**
```json
{
  "scripts": {
    "build": "node build.mjs",
    "build:watch": "nodemon build.mjs"
  }
}
```

**Benefits:**
- Smaller file sizes
- Faster load times
- Remove dev code in production

**Estimated Effort:** 1 day

---

### 9.2 Add Source Maps (Priority: LOW)

**Recommendation:**

Update build script:
```javascript
const result = await minify(code, {
  // ...
  sourceMap: {
    filename: file,
    url: `${file}.map`,
  },
});

writeFileSync(outFile + '.map', result.map);
```

**Benefits:**
- Debug minified code
- Better error tracking

**Estimated Effort:** 0.5 day

---

## 10. Dependency Management

### 10.1 Bundle Shiki Instead of CDN (Priority: MEDIUM)

**Current Issue:**
- Shiki loaded from esm.sh CDN
- Network dependency
- Version not locked in package.json
- Potential CORS/CSP issues

**Current:** `lesson.mjs:9`
```javascript
import * as shiki from "https://esm.sh/shiki@3.0.0";
```

**Recommendation:**

```bash
npm install shiki@3.0.0
```

```javascript
// lesson.mjs
import * as shiki from 'shiki';
```

Then use a bundler (Rollup/esbuild) to bundle dependencies.

**Alternative (still use CDN but with better reliability):**
```javascript
// shiki-loader.mjs
const SHIKI_VERSION = '3.0.0';
const SHIKI_CDN = 'https://esm.sh';
const SHIKI_FALLBACK = 'https://cdn.jsdelivr.net/npm/shiki@3.0.0/+esm';

async function loadShiki() {
  try {
    return await import(`${SHIKI_CDN}/shiki@${SHIKI_VERSION}`);
  } catch (error) {
    logger.warn('Primary CDN failed, using fallback');
    return await import(SHIKI_FALLBACK);
  }
}
```

**Benefits:**
- Reliability
- Offline capability
- Better caching
- Security

**Estimated Effort:** 1-2 days (with bundler setup)

---

## 11. Accessibility

### 11.1 Add ARIA Labels and Roles (Priority: MEDIUM)

**Current Issue:**
- Some interactive elements lack proper ARIA labels
- Keyboard navigation could be improved

**Recommendation:**

```javascript
// Add to lesson navigation
const btnWrapper = el("nav", {
  className: "lesson-floater",
  role: "navigation",
  "aria-label": "Lesson navigation",  // Good! Already there (line 395)
});

// Add to copy button
const copyButton = el("button", {
  className: "copy-button",
  "aria-label": "Copy code to clipboard",
  "aria-live": "polite",
  onclick: handleCopy,
});

// Update copy tooltip
const tooltip = el("div", {
  className: "tooltip-copied",
  role: "status",
  "aria-live": "polite",
  textContent: "Copied to clipboard",
});
```

**Benefits:**
- Better screen reader support
- WCAG compliance
- Improved accessibility

**Estimated Effort:** 1 day

---

### 11.2 Add Keyboard Navigation (Priority: MEDIUM)

**Current Issue:**
- Some interactive elements may not be keyboard accessible
- Focus management not explicit

**Recommendation:**

```javascript
// Trap focus in modals
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }

  // Arrow keys for lesson navigation
  if (e.key === 'ArrowLeft' && e.altKey) {
    document.querySelector('.lesson-btn.prev')?.click();
  }
  if (e.key === 'ArrowRight' && e.altKey) {
    document.querySelector('.lesson-btn.next')?.click();
  }
});
```

**Benefits:**
- Better keyboard accessibility
- Power user features
- WCAG compliance

**Estimated Effort:** 1-2 days

---

## Implementation Roadmap

### Phase 1: Critical Fixes (1-2 weeks)
Priority: HIGH issues that affect security, stability, or development velocity

1. ✅ Add JSDoc type annotations (2-3 days)
2. ✅ Remove hardcoded admin email (0.5 day)
3. ✅ Sanitize HTML inputs (1 day)
4. ✅ Implement centralized error handling (1-2 days)
5. ✅ Add unit testing framework (2-3 days)
6. ✅ Fix ESLint configuration (0.5 day)

**Total:** ~7-11 days

### Phase 2: Architecture Improvements (2-3 weeks)
Priority: Improve maintainability and code quality

1. ✅ Refactor CG monolith (2-3 days)
2. ✅ Implement state management (1-2 days)
3. ✅ Extract view logic into controllers (2-3 days)
4. ✅ Break down large functions (2-3 days)
5. ✅ Extract magic values to constants (1 day)
6. ✅ Create architecture documentation (1 day)

**Total:** ~9-13 days

### Phase 3: Performance & Quality (1-2 weeks)
Priority: Optimize performance and improve developer experience

1. ✅ Implement DOM query caching (1 day)
2. ✅ Improve logger (0.5-1 day)
3. ✅ Add inline comments (2 days)
4. ✅ Add integration tests (2-3 days)
5. ✅ Bundle Shiki dependency (1-2 days)

**Total:** ~6.5-9 days

### Phase 4: Polish & Accessibility (1 week)
Priority: Nice-to-haves and future-proofing

1. ✅ Add ARIA labels (1 day)
2. ✅ Add keyboard navigation (1-2 days)
3. ✅ Lazy load code highlighter (0.5 day)
4. ✅ Add build pipeline (1 day)
5. ✅ Add pre-commit hooks (0.5 day)
6. ✅ Create README (0.5 day)
7. ✅ Add test coverage reporting (0.5 day)

**Total:** ~5-6 days

---

## Total Estimated Effort

**Conservative Estimate:** 28-39 days (~6-8 weeks)
**Aggressive Estimate:** 20-30 days (~4-6 weeks)

---

## Metrics to Track

### Before/After Comparison

| Metric | Current | Target |
|--------|---------|--------|
| Test Coverage | 0% | 80%+ |
| ESLint Errors | Unknown | 0 |
| Bundle Size | ~Unknown | Measured + Optimized |
| Type Coverage | ~20% | 90%+ |
| Documentation | Minimal | Comprehensive |
| Load Time | Baseline | -20% |
| Accessibility Score | Unknown | 95+ |

---

## Risk Assessment

### Low Risk
- Adding JSDoc
- Extracting constants
- Adding tests
- Documentation

### Medium Risk
- State management refactor
- Breaking down CG object
- Dependency changes

### High Risk (Require Careful Testing)
- View controller refactor
- Security changes (admin check)
- Build pipeline changes

---

## Recommendations Summary

### Do First (High Impact, Low Risk)
1. Add JSDoc type annotations
2. Set up unit testing
3. Extract magic values to constants
4. Add centralized error handling
5. Fix ESLint config

### Do Soon (High Impact, Medium Risk)
1. Refactor CG object
2. Remove hardcoded admin email
3. Sanitize HTML inputs
4. Implement state management

### Do Eventually (Medium Impact)
1. Add build pipeline
2. Bundle Shiki dependency
3. DOM query caching
4. Accessibility improvements

### Nice to Have (Low Priority)
1. Keyboard shortcuts
2. Lazy loading
3. Source maps
4. Advanced logging

---

## Questions for Consideration

1. **TypeScript Migration**: Worth the investment? Current codebase is manageable size for migration.

2. **Build Tools**: Which bundler? (Rollup, esbuild, Vite all good options)

3. **Testing Priority**: Which parts of codebase are most critical to test first?

4. **Breaking Changes**: What's the risk tolerance for refactoring?

5. **Performance Targets**: What are acceptable load time benchmarks?

6. **Browser Support**: What browsers need to be supported? Affects polyfill needs.

7. **Deployment Pipeline**: Is there CI/CD? Can we automate testing/deployment?

8. **Error Tracking**: Should we integrate Sentry or similar?

---

## Conclusion

This codebase is well-structured and functional, showing good engineering practices in many areas (modular design, JSDoc in places, recent updates). The main improvements would come from:

1. **Better testing** - Most impactful for long-term maintenance
2. **Type safety** - Catches bugs early in development
3. **Architecture cleanup** - Makes code easier to understand and modify
4. **Security hardening** - Reduces risk

The recommended phased approach allows for incremental improvements without disrupting the working system. Each phase delivers value independently while building toward a more robust, maintainable codebase.

---

**Document Version:** 1.0
**Last Updated:** 2026-01-26
**Author:** Claude Code Analysis
