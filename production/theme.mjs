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
import { generateFooter } from "./skilljar-theme-v3.0/footer.mjs";
import { hide, showBody } from "./skilljar-theme-v3.0/styling.mjs";
import { route, preRoute, postRoute } from "./skilljar-theme-v3.0/router.mjs";
import { setupDebug } from "./skilljar-theme-v3.0/debug.mjs";

document.addEventListener("DOMContentLoaded", () => {
  if (CG.env.isAdmin) setupDebug();

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
