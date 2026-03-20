import { pathSections, bannerSVGs } from "../static.mjs";
import { Q, el, remove, sanitizeUrl } from "../meta.mjs";
import { hide } from "../styling.mjs";
import { createClone } from "../icons.mjs";
import { CG } from "../CG.mjs";
import { logger } from "../logger.mjs";
import { makeSections } from "../sections.mjs";

function createBanner() {
  const leftCol = el("div", { className: "banner-col" });
  leftCol.innerHTML = bannerSVGs.left;

  const rightCol = el("div", { className: "banner-col" });
  rightCol.innerHTML = bannerSVGs.right;

  const ctas = [
    { href: "/", text: "See all our courses", arrow: true },
  ];

  const ctaLinks = ctas.map(({ href, text, arrow }) =>
    el("a", {
      href: sanitizeUrl(href),
      target: "_blank",
      rel: "noreferrer noopener",
      className: "banner-link",
      innerHTML: arrow ? `${text} ${bannerSVGs.arrow}` : text,
    })
  );

  return el("div", { id: "catalog-banner" }, [
    el("div", { className: "banner-inner" }, [
      leftCol,
      el("div", { className: "banner-center" }, [
        el("h1", { text: "Let's Get Smarter." }),
        el("p", {
          text: "Transform your potential into expertise with Chainguard Courses. Your gateway to a future built on trust and technology.",
        }),
        el("div", { className: "banner-cta" }, ctaLinks),
      ]),
      rightCol,
    ]),
  ]);
}

/**
 * This function applies styling to a catalog page (landing page only, regardless
 * of whether the user is logged in; and Learning Path catalog pages, if the user is logged in).
 * @returns {void}
 */
export function landingView() {
  // CG.dom.body.prepend(el("div", { id: "cg-bg" }));
  CG.data.sections = pathSections[window.skilljarCatalogPage.slug]; // ex. "partners"

  if (!CG.data.sections) CG.data.sections = pathSections["home"];

  if (!pathSections[window.skilljarCatalogPage.slug] && !CG.page.isLanding)
    logger.warn("Could not determine catalog section name, defaulting to home");

  // hide existing content
  hide(Q("#catalog-content"));

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
      el("h2", { text: "Want to learn more about Chainguard?" }),
      el("div", {}, [
        el(
          "a",
          {
            href: sanitizeUrl("https://www.chainguard.dev/contact"),
            className: "button white",
            text: "Contact Us",
          },
          [createClone("rightArrow")],
        ),
        createClone("chainguard", { width: "83", height: "72" }),
      ]),
    ]),
  );
}
