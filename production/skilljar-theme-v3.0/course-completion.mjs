import { el, text, Q } from "./meta.mjs";
import { CONFIG } from "./config.mjs";
import { setStyle } from "./styling.mjs";
import { CG } from "./CG.mjs";

/**
 * Course completion popup and confetti animation module.
 */

/**
 * Ensure the completion popup element exists, creating it if necessary.
 * @returns {HTMLElement} The completion popup element.
 */
export function ensureCompletionPopup() {
  let elem = document.getElementById("completion-popup");
  if (elem) return elem;

  elem = el(
    "div",
    {
      id: "completion-popup",
      role: "dialog",
      "aria-modal": "true",
      "aria-hidden": "true",
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
              textContent: `Hooray! You finished ${
                CG.state.course?.title ? CG.state.course?.title : "the course!"
              }`,
            }),
            el("p", {
              id: "completion-sub",
              textContent: "Seriously, nice work!",
            }),
            el("p", {
              id: "completion-notice",
              innerHTML: `You can close this popup by clicking outside of it or press ESC to dismiss. It will also disappear automatically in <span id="completion-countdown">${
                CONFIG.confetti.autoHideMs / 1000
              }</span> seconds.`,
            }),
          ]
        ),
      ]),
    ]
  );

  elem.addEventListener("click", () => hideCompletion(elem));
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
  elem.setAttribute("aria-hidden", "false");
  setStyle(elem, { display: "block" });
  // Next paint to trigger transition
  requestAnimationFrame(() => setStyle(elem, { opacity: "1" }));
  // focus for accessibility
  const focusTarget = Q("#completion-card", elem);
  if (focusTarget) focusTarget.focus({ preventScroll: true });

  const countdownEl = Q("#completion-countdown", elem);
  if (countdownEl) {
    let remaining = CONFIG.confetti.autoHideMs / 1000;
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
    elem.setAttribute("aria-hidden", "true");
    setStyle(elem, { display: "none" });
    elem.removeEventListener("transitionend", finish);
  };
  elem.addEventListener("transitionend", finish);
  // Safety timeout in case transitionend doesn’t fire
  setTimeout(finish, 300);
}

/**
 * Shoot confetti bursts with stars, circles, and logos.
 * @returns {void}
 */
export function shoot() {
  // TODO: Solve confetti import/build issues
  //
  // confetti({
  //   ...CONFIG.confetti.defaults,
  //   particleCount: CONFIG.confetti.particles.stars.counts,
  //   scalar: CONFIG.confetti.particles.stars.scalar,
  //   shapes: ["star"],
  // });
  // confetti({
  //   ...CONFIG.confetti.defaults,
  //   particleCount: CONFIG.confetti.particles.circles.counts,
  //   scalar: CONFIG.confetti.particles.circles.scalar,
  //   shapes: ["circle"],
  // });
  // confetti({
  //   ...CONFIG.confetti.defaults,
  //   particleCount: CONFIG.confetti.particles.logos.counts,
  //   scalar: CONFIG.confetti.particles.logos.scalar,
  //   shapes: ["image"],
  //   shapeOptions: {
  //     image: [
  //       {
  //         src: "https://cc.sj-cdn.net/instructor/l9kl0bllkdr4-chainguard/themes/2gr0n1rmedy35/favicon.1757695230.png",
  //         width: 32,
  //         height: 32,
  //       },
  //     ],
  //   },
  // });
}

/**
 * Animate the completion popup with confetti and auto-hide functionality.
 * @returns {void}
 */
export function animateCompletion() {
  const elem = ensureCompletionPopup();
  showCompletion(elem);

  // Confetti bursts
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);

  // Auto-hide
  setTimeout(() => hideCompletion(elem), CONFIG.confetti.autoHideMs);
}
