import { logger } from "./logger.mjs";

// static imports
import { UTM as standardUTM } from "../data/utm.mjs";

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

/**
 * Shorthand for document.querySelector, with an optional root element.
 * @param {string} selector - The CSS selector to query.
 * @param {HTMLElement|Document} [root=document] - The root element to query within.
 * @returns {HTMLElement|null} - The first matching element or null if none found.
 */
export function Q(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * Creates and returns the completion popup element with the specified structure and content.
 * @param {string} selector - The CSS selector to query.
 * @param {HTMLElement|Document} [root=document] - The root element to query within.
 * @returns {Array<HTMLElement>} - An array of matching elements.
 */
export function A(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Checks if an element exists in the DOM.
 * @param {string} selector - The CSS selector to query.
 * @param {HTMLElement|Document} [root=document] - The root element to query within.
 * @returns {boolean} - True if the element exists, false otherwise.
 */
export function c(selector, root = document) {
  return Q(selector, root) ? true : false;
}

/**
 * Sanitizes a URL by adding UTM parameters if applicable.
 * @param {string} link - The URL to sanitize.
 * @param {Object} [UTM={}] - An object containing UTM parameters.
 * @returns {string} - The sanitized URL.
 */
export function sanitizeUrl(link, UTM = {}) {
  if (!UTM || typeof UTM !== "object" || isEmpty(UTM)) {
    // logger.warn("sanitizeUrl: UTM parameter is not an object or is empty. Setting to standard defaults.");
    UTM = standardUTM;
  }

  let url;
  try {
    url = new URL(link);
  } catch {
    logger.warn("sanitizeUrl: Invalid URL provided, returning as-is:", link);
    return link; // relative URL or unparseable — return as-is
  }

  // Only add UTM params to Chainguard URLs
  if (!url.hostname.endsWith("chainguard.dev")) return link;

  Object.entries(UTM).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const sanitizedLink = url.toString();
  logger.info("sanitizeUrl:", { link, sanitizedLink });

  return sanitizedLink;
}

/**
 * Creates a DOM element with specified tag, properties, and children.
 * Supports event listeners by using "onEventName" properties (e.g., "onclick").
 * Supports both HTML and SVG elements.
 * @param {string} tag - The HTML/SVG tag name.
 * @param {Object} props - An object containing properties and attributes for the element.
 * @param {Object} [props.aria] - Aria attributes as key/value pairs (e.g., `{ label: "Close" }` → `aria-label="Close"`).
 * @param {Object} [props.dataset] - Data attributes as key/value pairs (e.g., `{ lang: "js" }` → `data-lang="js"`).
 * @param {Object} [props.on] - Event listeners as key/value pairs. Value can be a handler function or a
 *   `[handler, options]` tuple (e.g., `{ click: fn }` or `{ scroll: [fn, { passive: true }] }`).
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

    if (k === "on") {
      for (const [event, handlerOrTuple] of Object.entries(v)) {
        if (Array.isArray(handlerOrTuple)) {
          const [handler, options] = handlerOrTuple;
          n.addEventListener(event, handler, options);
        } else if (typeof handlerOrTuple === "function") {
          n.addEventListener(event, handlerOrTuple);
        }
      }
      continue;
    }

    if (k === "aria") {
      for (const [ariaKey, ariaVal] of Object.entries(v)) {
        if (ariaVal != null) n.setAttribute(`aria-${ariaKey}`, ariaVal);
      }
      continue;
    }

    if (k === "dataset") {
      for (const [dataKey, dataVal] of Object.entries(v)) {
        if (dataVal != null) n.dataset[dataKey] = dataVal;
      }
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
export function text(element, value, auto = "") {
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  } else if (element) {
    element.textContent = auto;
  } else {
    logger.warn("text: Element is null or undefined. Value:", value);
  }
}

/**
 * Sets the placeholder attribute of an HTML element.
 * @param {HTMLElement} element - The target HTML element.
 * @param {string} value - The placeholder text to set.
 * @returns {void}
 */
export function placeholder(element, value) {
  if (element && value !== undefined && value !== null) {
    element.setAttribute("placeholder", value);
  } else {
    logger.warn("placeholder: Element is null or undefined. Value:", value);
  }
}

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
      logger.warn("Could not remove element:", selector, e);
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
      logger.warn("Could not remove element:", el, e);
    }
  });
}

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} - The converted string in title case.
 */
export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}

/**
 * Renders a template string by replacing placeholders with values from a variables object.
 * @param {string} template - The template string containing placeholders in the format {key}.
 * @param {Object} vars - An object containing key-value pairs for replacement.
 * @returns {string} - The rendered string with placeholders replaced by corresponding values.
 */
export function render(template, vars) {
  return template.replace(/{(.*?)}/g, (_, key) => vars[key] ?? "")
}