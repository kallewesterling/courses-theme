/**
 * Course completion popup and confetti animation module.
 */

import { el, text, Q, render } from "./utils.mjs";
import { setStyle } from "./styling.mjs";
import { CG } from "./CG.mjs";
import { logger } from "./logger.mjs";

// External libraries
import { confetti } from "https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/+esm";

// static imports
import { config } from "../data/config.mjs";
import { completion } from "../data/messages.mjs";

/**
 * Ensure the completion popup element exists, creating it if necessary.
 * On first call the popup is created with the provided title string; subsequent
 * calls return the existing element unchanged (singleton pattern).
 * @param {string} [title] - Rendered title text for the popup heading.
 *   Falls back to the current course title when omitted.
 * @returns {HTMLElement} The completion popup element.
 */
export function ensureCompletionPopup(title) {
  let elem = document.getElementById("completion-popup");
  if (elem) return elem;

  const headingText = title ?? CG.state.course?.title ?? "the course!";

  elem = el(
    "div",
    {
      id: "completion-popup",
      role: "dialog",
      aria: { modal: "true", hidden: "true" },
      on: {
        click: () => hideCompletion(elem),
      }
    },
    [
      el("div", { id: "completion-content" }, [
        el(
          "div",
          {
            id: "completion-card",
            tabIndex: -1,
          },
          [
            el("h1", {
              id: "completion-title",
              textContent: headingText,
            }),
            el("p", {
              id: "completion-sub",
              textContent: completion.popup.subTitle,
            }),
            el("p", {
              id: "completion-notice",
              innerHTML: render(completion.popup.notice, {
                seconds: config.confetti.autoHideMs / 1000,
              }),
            }),
          ]
        ),
      ]),
    ]
  );
  document.body.appendChild(elem);

  // ESC to close
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" && elem.getAttribute("aria-hidden") === "false")
      hideCompletion(elem);
  });

  return elem;
}

/**
 * Show the completion popup with animation and focus management.
 * @param {HTMLElement} elem - The completion popup element to show.
 * @returns {void}
 */
export function showCompletion(elem) {
  setStyle(elem, { display: "block", aria: { hidden: "false" } });
  // Next paint to trigger transition
  requestAnimationFrame(() => setStyle(elem, { opacity: "1" }));
  // focus for accessibility
  const focusTarget = Q("#completion-card", elem);
  if (focusTarget) focusTarget.focus({ preventScroll: true });

  const countdownEl = Q("#completion-countdown", elem);
  if (countdownEl) {
    let remaining = config.confetti.autoHideMs / 1000;
    text(countdownEl, remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        text(countdownEl, remaining);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}

/**
 * Hide the completion popup with animation.
 * @param {HTMLElement} elem - The completion popup element to hide.
 * @returns {void}
 */
export function hideCompletion(elem) {
  setStyle(elem, { opacity: "0" });
  const finish = () => {
    setStyle(elem, {
      display: "none",
      aria: { hidden: "true" },
      on: { transitionend: undefined }
    });
  };
  setStyle(elem, { on: { transitionend: finish } });
  // Safety timeout in case transitionend doesn’t fire
  setTimeout(finish, 300);
}

/**
 * Shoot confetti bursts with stars, circles, and logos.
 * @returns {void}
 */
export function shoot(size = "big", { x, y } = { x: 0.5, y: 0.33 }) {
  const configConfetti = { ...config.confetti.defaults, origin: { x, y } };
  logger.info("Shooting confetti", configConfetti);

  if (size === "big") {
    confetti({
      ...configConfetti,
      particleCount: config.confetti.particles.stars.count,
      scalar: config.confetti.particles.stars.scalar,
      shapes: ["star"],
    });
    confetti({
      ...configConfetti,
      particleCount: config.confetti.particles.circles.count,
      scalar: config.confetti.particles.circles.scalar,
      shapes: ["circle"],
    });
    confetti({
      ...configConfetti,
      particleCount: config.confetti.particles.logos.count,
      scalar: config.confetti.particles.logos.scalar,
      shapes: ["image"],
      shapeOptions: {
        image: [
          {
            src: "https://cc.sj-cdn.net/instructor/l9kl0bllkdr4-chainguard/themes/2gr0n1rmedy35/favicon.1757695230.png",
            width: 32,
            height: 32,
          },
        ],
      },
    });
  } else if (size === "small") {
    const smallConfetti = { ...configConfetti, ...config.confetti.small };

    confetti({
      ...smallConfetti,
      particleCount: 120 / 3,
      scalar: config.confetti.particles.stars.scalar,
      shapes: ["star"],
    });
    confetti({
      ...smallConfetti,
      particleCount: 120 / 3,
      scalar: config.confetti.particles.circles.scalar,
      shapes: ["circle"],
    });
    confetti({
      ...smallConfetti,
      particleCount: 120 / 3,
      scalar: config.confetti.particles.logos.scalar,
      shapes: ["image"],
      shapeOptions: {
        image: [
          {
            src: "https://cc.sj-cdn.net/instructor/l9kl0bllkdr4-chainguard/themes/2gr0n1rmedy35/favicon.1757695230.png",
            width: 32,
            height: 32,
          },
        ],
      },
    });
  }
}

/**
 * Animate the completion popup with confetti and auto-hide functionality.
 * Pass `type = 'path'` on learning-path pages to show a path-specific title.
 * @param {'course'|'path'} [type='course'] - Whether this is a course or path completion.
 * @returns {void}
 */
export function animateCompletion(type = "course") {
  const title =
    type === "path"
      ? render(completion.popup.pathTitle, {
        pathTitle: CG.state.course.path?.title ?? "the learning path",
      })
      : render(completion.popup.title, {
        courseTitle: CG.state.course?.title ?? "the course",
      });

  const elem = ensureCompletionPopup(title);
  showCompletion(elem);

  // Confetti bursts
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);

  // Auto-hide
  setTimeout(() => hideCompletion(elem), config.confetti.autoHideMs);
}
