/**
 * Pure utility functions for code block processing.
 * No browser dependencies — safe to import in Node for testing.
 */

/**
 * Parses a line specification string into a set of line numbers.
 * @param {string} spec - e.g. "3,5-7" → Set{3,5,6,7}
 * @returns {Set<number>}
 */
export function parseLineSpec(spec) {
  const out = new Set();
  for (const part of spec.split(",")) {
    const p = part.trim();
    if (!p) continue;

    const m = p.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;

    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    for (let i = Math.min(start, end); i <= Math.max(start, end); i++)
      out.add(i);
  }
  return out;
}

/**
 * Cleans command prompt symbols from a code block's text content,
 * joining multi-line shell commands with " && ".
 * @param {{ textContent: string }} el - Any object with a textContent property.
 * @returns {string}
 */
export function cleanCommandPrompt(el) {
  return el.textContent.replace(/\r?\n\$ /g, " && ").replace(/^\$ /g, "");
}

/**
 * Returns a Shiki transformer that adds line-number spans to a code block.
 * @param {Object} [options]
 * @param {string} [options.preClass="has-line-numbers"] - Class added to the <code> element.
 * @param {string} [options.lineClass="code-line"] - Class added to each line span.
 * @param {string} [options.noContent="no-content"] - Class added to empty line spans.
 * @returns {import("shiki").ShikiTransformer}
 */
export function addLineNumberSpans(options = {}) {
  const {
    preClass: copyClass = "has-line-numbers",
    lineClass = "code-line",
    noContent = "no-content",
  } = options;

  return {
    name: "@shikijs/add-line-number-spans",
    copy(node) {
      this.addClassToHast(node, copyClass);
    },
    line(node, line) {
      this.addClassToHast(node, lineClass);
      node.properties["data-line"] = line;
      if (node.children.length === 0) {
        this.addClassToHast(node, noContent);
      }
    },
  };
}
