import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sanitizeUrl, toTitleCase } from "../production/skilljar-theme-v3.0/meta.mjs";

// ------------------------------------------------------------
// sanitizeUrl
// ------------------------------------------------------------

describe("sanitizeUrl", () => {
  describe("non-Chainguard URLs", () => {
    it("returns external URLs unchanged", () => {
      const url = "https://example.com/some/path";
      assert.equal(sanitizeUrl(url), url);
    });

    it("does not add UTM params to external URLs even when provided", () => {
      const url = "https://example.com/page";
      assert.equal(sanitizeUrl(url, { utm_campaign: "test" }), url);
    });

    it("returns relative URLs unchanged", () => {
      assert.equal(sanitizeUrl("/page/partners"), "/page/partners");
    });

    it("returns bare anchor links unchanged", () => {
      assert.equal(sanitizeUrl("#section"), "#section");
    });
  });

  describe("Chainguard URLs", () => {
    it("returns a Chainguard URL without UTM params when none are given", () => {
      const result = sanitizeUrl("https://www.chainguard.dev");
      const parsed = new URL(result);
      assert.equal(parsed.searchParams.size, 0);
      assert.equal(parsed.hostname, "www.chainguard.dev");
    });

    it("appends UTM params to a Chainguard URL", () => {
      const result = sanitizeUrl("https://www.chainguard.dev/contact", {
        utm_campaign: "courses",
        utm_source: "skilljar",
      });
      const parsed = new URL(result);
      assert.equal(parsed.searchParams.get("utm_campaign"), "courses");
      assert.equal(parsed.searchParams.get("utm_source"), "skilljar");
    });

    it("works on Chainguard subdomains", () => {
      const result = sanitizeUrl("https://courses.chainguard.dev/catalog", {
        utm_campaign: "nav",
      });
      assert.ok(result.includes("utm_campaign=nav"));
    });

    it("preserves existing query params on Chainguard URLs", () => {
      const result = sanitizeUrl(
        "https://www.chainguard.dev/page?existing=yes",
        { utm_campaign: "test" },
      );
      const parsed = new URL(result);
      assert.equal(parsed.searchParams.get("existing"), "yes");
      assert.equal(parsed.searchParams.get("utm_campaign"), "test");
    });
  });
});

// ------------------------------------------------------------
// toTitleCase
// ------------------------------------------------------------

describe("toTitleCase", () => {
  it("capitalises the first letter of each word", () => {
    assert.equal(toTitleCase("hello world"), "Hello World");
  });

  it("lowercases the rest of each word", () => {
    assert.equal(toTitleCase("HELLO WORLD"), "Hello World");
  });

  it("handles a single word", () => {
    assert.equal(toTitleCase("javascript"), "Javascript");
  });

  it("handles mixed casing", () => {
    assert.equal(toTitleCase("hElLo wOrLd"), "Hello World");
  });

  it("returns an empty string unchanged", () => {
    assert.equal(toTitleCase(""), "");
  });
});
