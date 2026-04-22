/**
 * Singleton floating tooltip utility.
 *
 * One shared .floater-tooltip element is appended to <body> and reused for
 * every trigger. Positioning is done with CSS custom properties so the element
 * never needs to be re-inserted into the DOM.
 *
 * Trigger behaviour:
 *   - show on mouseenter / focus
 *   - hide on mouseleave / blur (after HIDE_DELAY so the cursor can travel
 *     from the trigger onto the tooltip without it disappearing)
 *   - hide on Escape
 *   - hide on click outside
 */

import { el } from "./utils.mjs";
import { setStyle } from "./styling.mjs";

const HIDE_DELAY = 120; // ms

let tooltipEl = null;
let hideTimer = null;
let outsideListenerAdded = false;

/** Returns the singleton tooltip element, creating it on first call. */
function getTooltip(textContent) {
  if (tooltipEl) return tooltipEl;

  tooltipEl = el("div", {
    textContent,
    className: "floater-tooltip",
    role: "tooltip",
    id: "floater-tooltip",
    on: {
      mouseenter: () => clearTimeout(hideTimer),
      mouseleave: () => scheduleHide(),
    }
  });
  document.body.appendChild(tooltipEl);

  return tooltipEl;
}

function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (tooltipEl) tooltipEl.classList.remove("is-visible");
  }, HIDE_DELAY);
}

function showTooltip(triggerEl, textContent) {
  clearTimeout(hideTimer);

  const tip = getTooltip(textContent);

  // Position before making visible so getBoundingClientRect() is accurate.
  positionTooltip(triggerEl, tip);
  tip.classList.add("is-visible");
}

function positionTooltip(triggerEl, tip) {
  const maxWidth = 280, gap = 8,
    rect = triggerEl.getBoundingClientRect(),
    { scrollX, scrollY, innerWidth, innerHeight } = window;

  // Clamp width to viewport with a small margin.
  const width = Math.min(maxWidth, innerWidth - 24);

  // Centre under the trigger (viewport coords → document coords via scroll).
  let left = rect.left + scrollX + rect.width / 2 - width / 2;
  left = Math.max(scrollX + 12, Math.min(left, scrollX + innerWidth - width - 12));

  // Default: below the trigger. Flip above if not enough room.
  const spaceBelow = innerHeight - rect.bottom;
  const above = spaceBelow < 100;
  const top = above
    ? rect.top + scrollY - gap
    : rect.bottom + scrollY + gap;

  setStyle(tip, { top: `${top}px`, left: `${left}px`, width: `${width}px` });
  tip.classList.toggle("is-above", above);
}

function ensureOutsideListener() {
  if (outsideListenerAdded) return;
  outsideListenerAdded = true;

  document.addEventListener(
    "click",
    (e) => {
      if (
        tooltipEl?.classList.contains("is-visible") &&
        !tooltipEl.contains(e.target) &&
        !e.target.closest("[data-floater-trigger]")
      ) {
        scheduleHide();
      }
    },
    { capture: true }
  );
}

/**
 * Attaches hover/focus tooltip behaviour to a trigger element.
 *
 * @param {HTMLElement} triggerEl - The element that triggers the tooltip.
 * @param {string} content - Plain-text tooltip content (from data/messages.mjs).
 */
export function attachFloaterTooltip(triggerEl, content) {
  triggerEl.setAttribute("tabindex", "0");
  triggerEl.setAttribute("aria-describedby", "floater-tooltip");
  triggerEl.setAttribute("data-floater-trigger", "");

  triggerEl.addEventListener("mouseenter", () => showTooltip(triggerEl, content));
  triggerEl.addEventListener("focus", () => showTooltip(triggerEl, content));
  triggerEl.addEventListener("mouseleave", scheduleHide);
  triggerEl.addEventListener("blur", scheduleHide);
  triggerEl.addEventListener("keydown", (e) => { if (e.key === "Escape") scheduleHide(); });

  ensureOutsideListener();
}
