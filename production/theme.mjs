/*
 * Chainguard Courses Theme v3.0
 * This script applies custom styles and functionality to Chainguard's Skilljar platform.
 * It includes features like curriculum styling, lesson navigation, and responsive design adjustments.
 * It also provides utility functions for clipboard operations and element styling.
 *
 * This script is designed to be run in the context of a Skilljar page.
 *
 * @version 3.0
 * @date 2026-03-20
 * @author Chainguard
 * @license MIT
 * @see {@link https://courses.chainguard.com|Chainguard Courses}
 */

import { remove } from "./skilljar-theme-v3.0/utils.mjs";
import { CG } from "./skilljar-theme-v3.0/CG.mjs";
import { animateCompletion } from "./skilljar-theme-v3.0/course-completion.mjs";
import { generateFooter } from "./skilljar-theme-v3.0/footer.mjs";
import { hide, showBody } from "./skilljar-theme-v3.0/styling.mjs";
import { logger } from "./skilljar-theme-v3.0/logger.mjs";
import { route, preRoute, postRoute } from "./skilljar-theme-v3.0/router.mjs";

/*
 * Sets up logging based on the environment. Logging is enabled by default for staging and admin users, but can be toggled via localStorage.
 * This function also logs the current environment and state for debugging purposes.
 * It checks the environment variables to determine if logging should be enabled and stores this preference in localStorage.
 * Finally, it logs the current environment and state using the logger instance.
 */
function setupDebug() {
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

document.addEventListener("DOMContentLoaded", () => {
  setupDebug();

  // Clean up DOM: remove elements + set class names
  remove(".search-container");
  CG.dom.bodyHeader.classList.add("headers");
  hide("#ep-footer"); // hide Skilljar footer

  // replace logo
  CG.dom.headerLeft.replaceChildren(CG.el.logo);

  generateFooter();

  preRoute();
  route();
  postRoute();

  // show all
  showBody();
});
