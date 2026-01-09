import {
  Q,
  A,
  c,
  getCorrectURL,
  el,
  remove,
} from "./skilljar-theme-v3.0/meta.mjs";
import { CG } from "./skilljar-theme-v3.0/CG.mjs";
import { footerData } from "./skilljar-theme-v3.0/static.mjs";
import { animateCompletion } from "./skilljar-theme-v3.0/course-completion.mjs";
import { generateFooter } from "./skilljar-theme-v3.0/footer.mjs";

document.addEventListener("DOMContentLoaded", () => {
  window.CG = CG;
  window.Q = Q;
  window.A = A;
  window.c = c;
  window.getCorrectURL = getCorrectURL;
  window.el = el;
  window.remove = remove;
  window.footerData = footerData;

  generateFooter(window.footerData);
  window.animateCompletion = animateCompletion;
});
