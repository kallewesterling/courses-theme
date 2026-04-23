import { Q, el, remove, sanitizeUrl } from "../utils.mjs";
import { hide } from "../styling.mjs";
import { createClone } from "../icons.mjs";
import { CG } from "../CG.mjs";
import { logger } from "../logger.mjs";
import { makeSections } from "../sections.mjs";

// static imports
import { pathSections } from "../../data/path-sections.mjs";
import { bannerSVGs } from "../../data/graphics.mjs";
import { header } from "../../data/landing-header.mjs";
import { cta } from "../../data/landing-cta.mjs";

/**
 * Creates and returns the banner element for the catalog page, including the title, description, and call-to-action links.
 * @returns {HTMLElement} The banner element to be inserted into the catalog page.
 */
function createBanner() {
  const ctaLinks = header.ctas.map(({ href, text, arrow }) =>
    el("a", {
      href: sanitizeUrl(href),
      target: "_blank",
      rel: "noreferrer noopener",
      className: "banner-link",
      innerHTML: arrow ? `${text} ${bannerSVGs.arrow}` : text,
    }),
  );

  return el("div", { id: "catalog-banner" }, [
    el("div", { className: "banner-inner" }, [
      el("div", { className: "banner-col", innerHTML: bannerSVGs.left }),
      el("div", { className: "banner-center" }, [
        el("h1", { text: header.title }),
        el("p", { text: header.description }),
        el("div", { className: "banner-cta" }, ctaLinks),
      ]),
      el("div", { className: "banner-col", innerHTML: bannerSVGs.right }),
    ]),
  ]);
}

/**
 * This function applies styling to a catalog page (landing page only, regardless
 * of whether the user is logged in; and Learning Path catalog pages, if the user is logged in).
 * @returns {void}
 */
export function catalogView() {
  CG.data.sections = pathSections[window.skilljarCatalogPage.slug]; // ex. "partners"

  if (!CG.data.sections) CG.data.sections = pathSections["home"];

  if (!pathSections[window.skilljarCatalogPage.slug] && !CG.page.isLanding)
    logger.warn("Could not determine catalog section name, defaulting to home");

  // hide existing content
  hide(
    // catalog content for landing pages
    Q("#catalog-content"),
    // tile contents for pages
    Q(".tile-content-block"),
  );

  // insert factory banner after old catalog header
  const catalogHeader = Q(".catalog-header");
  if (catalogHeader)
    catalogHeader.insertAdjacentElement("afterend", createBanner());

  // remove search functionality
  remove([".catalog-left-nav", "#left-nav-button", ".back-to-catalog"]);

  // create new sections
  makeSections(CG.data.sections, "#skilljar-content", CG.state.baseURL);

  CG.dom.contentContainer.append(
    el("div", { className: "full-width", id: "cta-bottom" }, [
      createClone("chainguard", { width: "83", height: "72" }),
      el("h2", { text: cta.title }),
      el("div", {}, [
        el(
          "a",
          {
            href: sanitizeUrl(cta.url),
            className: "button white",
            text: cta.button,
          },
          [createClone("rightArrow")],
        ),
        createClone("chainguard", { width: "83", height: "72" }),
      ]),
    ]),
  );
}
