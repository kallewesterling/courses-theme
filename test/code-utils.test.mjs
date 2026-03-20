import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseLineSpec,
  cleanCommandPrompt,
  addLineNumberSpans,
} from "../production/skilljar-theme-v3.0/code-utils.mjs";

// ------------------------------------------------------------
// parseLineSpec
// ------------------------------------------------------------

describe("parseLineSpec", () => {
  it("parses a single line number", () => {
    assert.deepEqual(parseLineSpec("3"), new Set([3]));
  });

  it("parses a range", () => {
    assert.deepEqual(parseLineSpec("5-7"), new Set([5, 6, 7]));
  });

  it("parses a mix of single numbers and ranges", () => {
    assert.deepEqual(parseLineSpec("3,5-7,10"), new Set([3, 5, 6, 7, 10]));
  });

  it("handles an inverted range (high-low) by normalising it", () => {
    assert.deepEqual(parseLineSpec("7-5"), new Set([5, 6, 7]));
  });

  it("ignores empty parts from trailing/double commas", () => {
    assert.deepEqual(parseLineSpec("1,,3"), new Set([1, 3]));
  });

  it("ignores non-numeric tokens", () => {
    assert.deepEqual(parseLineSpec("1,abc,3"), new Set([1, 3]));
  });

  it("returns an empty Set for an empty string", () => {
    assert.deepEqual(parseLineSpec(""), new Set());
  });

  it("trims whitespace around parts", () => {
    assert.deepEqual(parseLineSpec(" 2 , 4-6 "), new Set([2, 4, 5, 6]));
  });
});

// ------------------------------------------------------------
// cleanCommandPrompt
// ------------------------------------------------------------

describe("cleanCommandPrompt", () => {
  it("strips a leading prompt symbol", () => {
    assert.equal(cleanCommandPrompt({ textContent: "$ echo hello" }), "echo hello");
  });

  it("joins multi-line commands with &&", () => {
    assert.equal(
      cleanCommandPrompt({ textContent: "$ foo\n$ bar" }),
      "foo && bar",
    );
  });

  it("handles Windows-style line endings", () => {
    assert.equal(
      cleanCommandPrompt({ textContent: "$ foo\r\n$ bar" }),
      "foo && bar",
    );
  });

  it("leaves text without a prompt unchanged", () => {
    assert.equal(
      cleanCommandPrompt({ textContent: "just some text" }),
      "just some text",
    );
  });

  it("does not strip a prompt that appears mid-line", () => {
    assert.equal(
      cleanCommandPrompt({ textContent: "echo $ not a prompt" }),
      "echo $ not a prompt",
    );
  });
});

// ------------------------------------------------------------
// addLineNumberSpans
// ------------------------------------------------------------

describe("addLineNumberSpans", () => {
  it("returns a transformer with the correct Shiki name", () => {
    const t = addLineNumberSpans();
    assert.equal(t.name, "@shikijs/add-line-number-spans");
  });

  it("has copy and line methods", () => {
    const t = addLineNumberSpans();
    assert.equal(typeof t.copy, "function");
    assert.equal(typeof t.line, "function");
  });

  describe("copy()", () => {
    it("adds the default preClass to the node", () => {
      const added = [];
      const ctx = { addClassToHast: (_, cls) => added.push(cls) };
      addLineNumberSpans().copy.call(ctx, {});
      assert.deepEqual(added, ["has-line-numbers"]);
    });

    it("uses a custom preClass when provided", () => {
      const added = [];
      const ctx = { addClassToHast: (_, cls) => added.push(cls) };
      addLineNumberSpans({ preClass: "my-class" }).copy.call(ctx, {});
      assert.deepEqual(added, ["my-class"]);
    });
  });

  describe("line()", () => {
    it("sets data-line to the line number", () => {
      const node = { properties: {}, children: ["something"] };
      const ctx = { addClassToHast: () => {} };
      addLineNumberSpans().line.call(ctx, node, 4);
      assert.equal(node.properties["data-line"], 4);
    });

    it("adds the default lineClass", () => {
      const added = [];
      const node = { properties: {}, children: ["x"] };
      const ctx = { addClassToHast: (_, cls) => added.push(cls) };
      addLineNumberSpans().line.call(ctx, node, 1);
      assert.ok(added.includes("code-line"));
    });

    it("adds the noContent class for empty lines", () => {
      const added = [];
      const node = { properties: {}, children: [] };
      const ctx = { addClassToHast: (_, cls) => added.push(cls) };
      addLineNumberSpans().line.call(ctx, node, 1);
      assert.ok(added.includes("no-content"));
    });

    it("does not add noContent class for non-empty lines", () => {
      const added = [];
      const node = { properties: {}, children: ["text"] };
      const ctx = { addClassToHast: (_, cls) => added.push(cls) };
      addLineNumberSpans().line.call(ctx, node, 1);
      assert.ok(!added.includes("no-content"));
    });
  });
});
