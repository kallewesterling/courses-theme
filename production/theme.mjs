import {
  Q,
  A,
  c,
  getCorrectURL,
  el,
  remove,
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
  window.logger = logger;

  generateFooter(window.footerData);
  window.animateCompletion = animateCompletion;
});
