import { Q, A, c, getCorrectURL, el } from "./skilljar-theme-v3.0/meta.mjs";
import { footerData } from "./skilljar-theme-v3.0/static.mjs";
import { generateFooter } from "./skilljar-theme-v3.0/footer.mjs";

window.Q = Q;
window.A = A;
window.c = c;
window.getCorrectURL = getCorrectURL;
window.el = el;
window.footerData = footerData;

generateFooter(window.footerData);
