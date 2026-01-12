import { Q } from "./meta.mjs";

/**
 * Sets the style of an element or a list of elements.
 * Accepts: HTMLElement, NodeList/HTMLCollection/Array of HTMLElements, or selector string.
 * Skips non-element values found in iterables (e.g., strings, nulls, Documents).
 * @returns {HTMLElement|HTMLElement[]|null}
 */
export function setStyle(target, style) {
  const toKebab = (p) =>
    p.startsWith("--") ? p : p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

  const isElement = (n) =>
    !!n &&
    typeof n === "object" &&
    n.nodeType === 1 &&
    typeof n.style?.setProperty === "function";

  const apply = (elem) => {
    for (const [prop, raw] of Object.entries(style)) {
      const cssProp = toKebab(prop);

      // If undefined → unset
      if (raw === undefined) {
        elem.style.removeProperty(cssProp);
        continue;
      }

      let value = String(raw);
      let priority = "";

      if (/\s*!important\s*$/i.test(value)) {
        priority = "important";
        value = value.replace(/\s*!important\s*$/i, "");
      }

      if (value.trim()) {
        elem.style.setProperty(cssProp, value.trim(), priority);
      }
    }
    return elem;
  };

  // selector string → first match
  if (typeof target === "string") {
    const elem = Q(target);
    return elem ? apply(elem) : null;
  }

  // Iterable? (NodeList, HTMLCollection, Array, Set, etc.)
  const isIterable =
    target &&
    typeof target !== "string" &&
    typeof target[Symbol.iterator] === "function";

  if (isIterable && !(target instanceof Element)) {
    const elements = Array.from(target).filter(isElement);
    // Optional: warn if we dropped items (useful during dev)
    // if (elements.length !== Array.from(target).length) console.warn("setStyle: skipped non-element items in iterable");
    if (elements.length === 0) return null;
    elements.forEach(apply);
    return elements;
  }

  // Single element
  if (isElement(target)) return apply(target);

  return null;
}

/**
 * This function hides the given element by setting its display style to "none".
 * @param {HTMLElement} element - The element to hide.
 * @returns {void}
 */
export const hide = (element) => {
  if (!element) return;

  if (typeof element === "string") {
    element = Q(element);
  } else if (Array.isArray(element) || element instanceof NodeList) {
    // repeat hide for each element in array
    element.forEach((el) => setStyle(el, { display: "none !important" }));
    return;
  }

  if (!typeof element === HTMLElement) return;

  return setStyle(element, { display: "none !important" });
};

/**
 * This function shows the body element by removing any display style overrides.
 * It sets the display style to undefined, allowing it to revert to its default behavior.
 * @returns {void}
 */
export const showBody = () => setStyle(Q("body"), { display: undefined });
