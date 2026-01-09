import { el } from "./meta.mjs";
import { CONFIG } from "./static.mjs";
import { logger } from "./logger.mjs";

/**
 * Creates an SVG icon element based on the specified type and attributes.
 * @param {string} type - The type of icon to create (e.g., "checkbox", "burger").
 * @param {Object} attrs - Additional attributes to apply to the SVG element.
 * @returns {SVGElement} The created SVG icon element.
 */
export function createClone(
  type = "checkbox",
  attrs = {
    // xmlns: "http://www.w3.org/2000/svg",
    // width: "20",
    // height: "21",
    // viewBox: "0 0 20 21",
    // fill: "none",
  }
) {
  if (!CONFIG.icons[type]) {
    logger.error(`Icon type "${type}" not found in CONFIG.icons`);
    return null;
  }

  if (CONFIG.icons[type].attrs) {
    attrs = { ...CONFIG.icons[type].attrs, ...attrs };
  }

  if (!attrs["className"]) attrs.className = `clone-icon ${type}-icon`;

  const paths = CONFIG.icons[type].paths.map((d) => el("path", { d }));
  return el("svg", attrs, paths);
}
