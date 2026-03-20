# CSS Improvement Plan Revision Summary

## Date: 2026-01-27

## Key Insight Discovered

**Skilljar Controls HTML Rendering** - We cannot add custom classes or modify the HTML structure. This fundamentally changes the CSS improvement strategy from creating reusable component classes to ensuring consistency across Skilljar's existing selectors.

## Changes Made

### 1. Removed Buttons Component

**Deleted Files:**
- `production/css/components/buttons.css` - Component-based button classes
- `production/css/components/BUTTONS.md` - Button component documentation

**Reason**: Cannot use custom classes like `.btn`, `.btn-primary` because we don't control the HTML that Skilljar renders.

**Updated**: Removed import from `production/style.css`

### 2. Created Constraint Documentation

**New File**: `APPROACH_NOTES.md`
- Documents the Skilljar HTML constraint
- Explains what we can and cannot do
- Provides examples of correct approaches
- Differentiates between wrong (adding classes) and right (targeting Skilljar selectors) approaches

### 3. Revised CSS_IMPROVEMENT_PLAN.md

**Added Section**: Key Constraint at the top
- Clearly states we don't control HTML
- Lists what we can and cannot do
- Explains impact on strategy

**Revised Section 1.3**: "Extract Common Patterns" → "Ensure Consistency Across Similar Patterns"
- Changed from creating reusable classes to targeting Skilljar selectors
- Focus on ensuring button-like elements have consistent styling
- Examples use Skilljar IDs like `#button-sign-in`, `#button-sign-up`
- Suggests extracting common values to CSS variables instead

**Revised Section 2.1**: "Implement Component-Based Structure" → "File Organization Strategy"
- Acknowledged current structure is appropriate for Skilljar theming
- Explained why page-based organization makes sense
- Noted that current structure matches Skilljar's page types
- Removed suggestion to reorganize into abstract component files

**Revised Section 2.2**: "Adopt Naming Convention (BEM-lite)" → "Selector Organization & Documentation"
- Changed from proposing BEM classes to documenting Skilljar's patterns
- Listed common Skilljar selectors (page identifiers, state classes, component classes, button IDs)
- Focus on understanding and documenting Skilljar's structure
- Removed BEM examples that aren't applicable

**Revised Section 7.4**: Documentation Comments
- Changed from documenting custom components to documenting Skilljar overrides
- New format includes: what Skilljar generates, where it appears, related states, HTML structure examples
- Examples show Skilljar selectors like `.coursebox-container` instead of custom `.card`

**Updated Roadmap**: Priority 1 & 2 Tasks
- Marked "Extract common button styles to components" as not applicable
- Added "Ensure consistency across similar Skilljar button elements"
- Marked "Implement component-based file structure" as not applicable (current structure is appropriate)
- Marked "Create reusable card component" as not applicable
- Added "Ensure consistency across Skilljar card elements"
- Added "Document common Skilljar selectors and their contexts"

### 4. Updated Tasks

**Task #2**: Changed from "Extract common button styles to components" to:
- Subject: "Ensure consistency across Skilljar button elements"
- Description: Target Skilljar's button selectors and ensure consistent styling
- Focus: Can't add classes, must work with existing selectors

## Strategy Moving Forward

### What We Focus On:

1. **Consistency via Selectors** - Ensure similar Skilljar elements are styled consistently by targeting their existing selectors
2. **CSS Variables** - Use variables for shared property values across different Skilljar elements
3. **Documentation** - Document Skilljar's selector patterns and structure
4. **Override Organization** - Keep overrides organized by page type (current structure)
5. **Consolidation** - Merge duplicate CSS within our files

### What We Don't Do:

1. ❌ Create reusable component classes (`.btn`, `.card`, etc.)
2. ❌ Try to reorganize into abstract component files
3. ❌ Propose BEM or other naming conventions (we don't control names)
4. ❌ Design system based on classes we can add

## Examples of Correct Approach

### Wrong (Can't Do This):
```html
<!-- We don't control this HTML -->
<button class="btn btn-primary">Sign In</button>
```

### Right (Do This Instead):
```css
/* Target what Skilljar generates */
#button-sign-in,
#button-sign-up {
  /* Our consistent button styling */
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
  background-color: var(--blurple) !important; /* Skilljar Override */
  color: var(--primary-white-hex) !important; /* Skilljar Override */
}
```

## Impact on Phase 1

### Completed:
- ✅ Task 1.1: Document !important usage

### Revised Remaining Tasks:
- Task 1.2: Consolidate duplicate selectors (still valid)
- Task 1.3: Ensure consistency across Skilljar button/card/pill elements (revised approach)
- Task 1.4: Add focus-visible states (still valid, target Skilljar's elements)
- Task 1.5: Document CSS variables (still valid, add Skilljar selector patterns)

## Next Steps

Continue with Phase 1 tasks using the correct approach:

1. **Task #2 (Revised)**: Ensure consistency across Skilljar button elements
   - Audit all button-like selectors
   - Ensure consistent styling
   - Document patterns

2. **Task #3**: Consolidate duplicate selectors
   - Find duplicates within files
   - Merge and clean up

3. **Task #4**: Add focus-visible states
   - Add to Skilljar's interactive elements
   - Ensure keyboard accessibility

4. **Task #5**: Document variables and Skilljar patterns
   - Create CSS variables reference
   - Document common Skilljar selectors

## Files Modified

- ❌ Deleted: `production/css/components/buttons.css`
- ❌ Deleted: `production/css/components/BUTTONS.md`
- ✅ Updated: `production/style.css` (removed buttons import)
- ✅ Updated: `CSS_IMPROVEMENT_PLAN.md` (comprehensive revision)
- ✅ Created: `APPROACH_NOTES.md` (constraint documentation)
- ✅ Created: `REVISION_SUMMARY.md` (this file)

## Verification

✅ CSS linting still passes after changes
✅ No broken imports in style.css
✅ Plan now reflects actual constraints

---

**Key Takeaway**: Work with Skilljar's HTML structure, not against it. Focus on consistency through targeting their selectors, not creating new classes.
