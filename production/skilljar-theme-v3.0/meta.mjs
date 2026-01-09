export function Q(selector, root = document) {
  return root.querySelector(selector);
}

export function A(selector, root = document) {
  return root.querySelectorAll(selector);
}

export function c(selector) {
  return Q(selector) || false;
}

export function getCorrectURL(link, UTM = {}) {
  let url = new URL(link);

  if (!UTM) UTM = CG.data.UTM ? CG.data.UTM.utm_campaign : undefined;

  if (!UTM) return url.toString();

  // add UTM params for tracking if specified

  UTM
    ? Object.entries(UTM).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      })
    : undefined;

  return url.toString();
}

/**
 * Creates a DOM element with specified tag, properties, and children.
 * Supports event listeners by using "onEventName" properties (e.g., "onclick").
 * Supports both HTML and SVG elements.
 * @param {string} tag - The HTML/SVG tag name.
 * @param {Object} props - An object containing properties and attributes for the element.
 * @param {Array} children - An array of child nodes to append to the element.
 * @returns {HTMLElement|SVGElement|null} - The created DOM element or null if no tag is provided.
 *
 * @example
 * const button = el('button', { className: 'btn', onclick: () => alert('Clicked!') }, [
 *  el('span', { textContent: 'Click Me' })
 * ]);
 * document.body.appendChild(button);
 */
export function el(tag, props = {}, children = []) {
  if (!tag) return null;
  const svgTags =
    tag === "svg" ||
    tag === "path" ||
    tag === "g" ||
    tag === "defs" ||
    tag === "clipPath";

  let n;
  if (svgTags) {
    n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  } else {
    n = document.createElement(tag);
  }
  for (const [k, v] of Object.entries(props)) {
    if (!v) continue;

    if (/^on[A-Za-z]+$/.test(k) && typeof v === "function") {
      const eventName = k.slice(2).toLowerCase(); // "onclick" -> "click"
      n.addEventListener(eventName, v);
      continue;
    }

    if (k === "className" && !svgTags) n.className = v;
    else if (k === "className" && svgTags) n.className.baseVal = v;
    else if (k === "textContent" || k === "text") n.textContent = v;
    else if (k === "innerHTML") n.innerHTML = v;
    else n.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children])
    .filter(Boolean)
    .forEach((child) => n.appendChild(child));
  return n;
}

/**
 * Sets the text content of an HTML element.
 * @param {HTMLElement} element - The target HTML element.
 * @param {string} value - The text content to set.
 * @param {string} [auto=""] - The fallback text content if value is undefined or null.
 * @returns {void}
 */
export const text = (element, value, auto = "") => {
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  } else if (element) {
    element.textContent = auto;
  } else {
    console.warn(
      "text(): Element is null or undefined. Tried to set text to:",
      value
    );
  }
};

/**
 * Removes elements from the DOM based on the provided selector(s).
 * @param {string|string[]} selector - A CSS selector string or an array of selector strings.
 * @returns {void}
 * @example
 * // Remove a single element
 * remove('.ad-banner');
 *
 * // Remove multiple elements
 * remove(['.ad-banner', '#popup', '.sponsored-content']);
 */
export function remove(selector) {
  if (!selector) return;

  if (selector instanceof HTMLElement) {
    try {
      selector.remove();
    } catch (e) {
      console.warn("Could not remove element:", selector, e);
    }
    return;
  }

  if (Array.isArray(selector)) {
    selector.forEach((sel) => remove(sel));
    return;
  }

  A(selector).forEach((el) => {
    try {
      el.remove();
    } catch (e) {
      console.warn("Could not remove element:", el, e);
    }
  });
}
