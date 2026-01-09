import {
  Q,
  A,
  c,
  getCorrectURL,
  el,
  remove,
  placeholder,
  text,
} from "./skilljar-theme-v3.0/meta.mjs";
import { CG } from "./skilljar-theme-v3.0/CG.mjs";
import {
  CONFIG,
  footerData,
  pathSections,
} from "./skilljar-theme-v3.0/static.mjs";
import { animateCompletion } from "./skilljar-theme-v3.0/course-completion.mjs";
import { generateFooter } from "./skilljar-theme-v3.0/footer.mjs";
import { hide, showBody } from "./skilljar-theme-v3.0/styling.mjs";
import { logger } from "./skilljar-theme-v3.0/logger.mjs";
import { createClone } from "./skilljar-theme-v3.0/icons.mjs";
import { route } from "./skilljar-theme-v3.0/router.mjs";

document.addEventListener("DOMContentLoaded", () => {
  logger.info("CG Modular Script Loaded");

  window.CONFIG = CONFIG;
  window.footerData = footerData;
  window.pathSections = pathSections;
  window.CG = CG;
  window.Q = Q;
  window.A = A;
  window.c = c;
  window.getCorrectURL = getCorrectURL;
  window.el = el;
  window.remove = remove;
  window.hide = hide;
  window.showBody = showBody;
  window.createClone = createClone;
  window.placeholder = placeholder;
  window.text = text;
  window.logger = logger;

  // views
  route();

  // Clean up DOM: remove elements + set class names
  remove(".search-container");
  CG.dom.bodyHeader.classList.add("headers");
  hide(Q("#ep-footer")); // hide Skilljar footer

  generateFooter(window.footerData);
  window.animateCompletion = animateCompletion;
});
