import { Q, A, el } from "./utils.mjs";
import { CG } from "./CG.mjs";
import { pageHandlers } from "./router.mjs";
import { animateCompletion } from "./course-completion.mjs";
import { logger } from "./logger.mjs";

// static imports
import { config } from "../data/config.mjs";

/**
 * Update all links on the page to use either the production or staging domain.
 * @param {boolean} useTestDomain - If true, update links to use the staging domain; otherwise, use the production domain.
 * @returns {void}
 * @example
 * // Update links to use the staging domain
 * updateLinks(true);
 *
 * // Update links to use the production domain
 * updateLinks(false);
 */
function updateLinks(useTestDomain) {
  A(
    'a[href*="' +
    config.domains.prod.url +
    '"], a[href*="' +
    config.domains.stage.url +
    '"]'
  ).forEach((link) => {
    const url = new URL(link.href);
    if (useTestDomain && url.hostname === config.domains.prod.url) {
      url.hostname = config.domains.stage.url;
    } else if (!useTestDomain && url.hostname === config.domains.stage.url) {
      url.hostname = config.domains.prod.url;
    }
    link.href = url.toString();
  });
}

/**
 * Adds a debug heading with environment information and a staging toggle.
 * @returns {void}
 */
export function debugHeading() {
  // adding a dropdown info circle
  const infoCircle = el(
    "div",
    { class: "align-vertical info-circle-wrapper" },
    [el("div", { class: "info-circle", text: "I" })]
  );
  CG.dom.headerRight.insertBefore(infoCircle, CG.dom.headerRight.firstChild);

  let dropdownOptions = [
    el("span", {
      text: "Handler: " + pageHandlers.find(({ test }) => test).handler.name,
    }),
    el("input", {
      type: "checkbox",
      id: "cg-baseurl-staging",
      checked: CG.env.isStaging ? true : false,
    }),

    // Add course edit link
    CG.state.course.id
      ? el("a", { href: CG.state.course.edit, text: "Edit Course" })
      : null,

    // Add path edit link
    CG.state.course.path.id && CG.state.domain
      ? el("a", { href: CG.state.course.path.edit, text: "Edit Path" })
      : null,
  ]
    .filter(Boolean)
    .map((html) => el("li", {}, [html]));

  const dropdownMenu = el(
    "ul",
    { class: "info-circle-menu", hidden: true },
    dropdownOptions
  );

  CG.dom.headerRight.parentElement.insertBefore(
    dropdownMenu,
    CG.dom.headerRight.parentElement.firstChild
  );

  const trigger = Q(".info-circle-wrapper");
  const dropdown = Q(".info-circle-menu");

  trigger.addEventListener("click", () => {
    const x = trigger.getBoundingClientRect().x;

    const dropdownWidth = 200;
    const alignmentFactor = 0.7;

    const left = x - dropdownWidth * alignmentFactor;

    dropdown.style.left = `${left}px`;

    dropdown.hidden = !dropdown.hidden;
  });

  const checkbox = Q("#cg-baseurl-staging");

  // initial state update if needed
  updateLinks(checkbox.checked);

  // toggle behavior
  checkbox.addEventListener("change", function () {
    updateLinks(this.checked);
  });
}

/*
 * Sets up logging based on the environment. Logging is enabled by default for staging and admin users, but can be toggled via localStorage.
 * This function also logs the current environment and state for debugging purposes.
 * It checks the environment variables to determine if logging should be enabled and stores this preference in localStorage.
 * Finally, it logs the current environment and state using the logger instance.
 */
export function setupDebug() {
  // setup logging based on environment - enabled for staging and admin users by default, but can be toggled
  if ((CG.env.isStaging || CG.env.isAdmin) && !localStorage.getItem("cg-logger-enabled")) {
    localStorage.setItem("cg-logger-enabled", "true");
  } else if (!localStorage.getItem("cg-logger-enabled")) {
    localStorage.setItem("cg-logger-enabled", "false");
  }

  // log environment info + state
  logger.info("Environment", CG.env);
  logger.info("State", CG.state);
  logger.info("Page", CG.page);

  if (CG.env.isStaging || CG.env.isAdmin) {
    // Expose logger and animateCompletion to the global scope for debugging and external triggers
    window.logger = logger;
    window.animateCompletion = animateCompletion;
    window.CG = CG; // Expose CG for easier debugging access to state and environment
  }
}