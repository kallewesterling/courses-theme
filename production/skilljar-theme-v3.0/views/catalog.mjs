import { pathSections } from "../static.mjs";
import { Q, el, remove, getCorrectURL } from "../meta.mjs";
import { hide } from "../styling.mjs";
import { createClone } from "../icons.mjs";
import { CG } from "../CG.mjs";
import { logger } from "../logger.mjs";
import { makeSections } from "../sections.mjs";

const LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 303 303" aria-hidden="true"><path fill="#fff" stroke="#ededed" d="M201.6.361H252v50.4h-50.4zm0 50.4H252v50.4h-50.4z"/><path fill="#f8f6fe" stroke="#ededed" d="M201.6 101.161H252v50.4h-50.4z"/><path fill="#6226fb" d="M201.6 151.561H252v50.4h-50.4z"/><path fill="#fff" stroke="#ededed" d="M201.6 201.96H252v50.4h-50.4z"/><path fill="#f8f6fe" stroke="#ededed" d="M201.6 252.361H252v50.4h-50.4z"/><path fill="#6226fb" d="M151.2.361h50.4v50.4h-50.4z"/><path fill="#f1ecfe" stroke="#ededed" d="M151.2 50.761h50.4v50.4h-50.4z"/><path fill="#fff" stroke="#ededed" d="M151.2 101.161h50.4v50.4h-50.4zm0 50.4h50.4v50.4h-50.4z"/><path fill="#fff" stroke="#ededed" d="M151.2 201.96h50.4v50.4h-50.4zm0 50.401h50.4v50.4h-50.4z"/><path fill="#f8f6fe" stroke="#ededed" d="M252 .361h50.4v50.4H252z"/><path fill="#fff" stroke="#ededed" d="M252 50.761h50.4v50.4H252z"/><path fill="#6226fb" d="M252 101.161h50.4v50.4H252z"/><path fill="#fff" stroke="#ededed" d="M252 151.561h50.4v50.4H252z"/><path fill="#f1ecfe" stroke="#ededed" d="M252 201.96h50.4v50.4H252z"/><path fill="#fff" stroke="#ededed" d="M252 252.361h50.4v50.4H252zM50.4.361h50.4v50.4H50.4zm0 50.4h50.4v50.4H50.4z"/><path fill="#6226fb" d="M50.4 101.161h50.4v50.4H50.4z"/><path fill="#f1ecfe" stroke="#ededed" d="M50.4 151.561h50.4v50.4H50.4z"/><path fill="#fff" stroke="#ededed" d="M50.4 201.96h50.4v50.4H50.4z"/><path fill="#6226fb" d="M50.4 252.361h50.4v50.4H50.4zM0 .361h50.4v50.4H0z"/><path fill="#f8f6fe" stroke="#ededed" d="M0 50.761h50.4v50.4H0z"/><path fill="#fff" stroke="#ededed" d="M0 101.161h50.4v50.4H0zm0 50.4h50.4v50.4H0z"/><path fill="#fff" stroke="#ededed" d="M0 201.96h50.4v50.4H0z"/><path fill="#f1ecfe" stroke="#ededed" d="M0 252.361h50.4v50.4H0z"/><path fill="#fff" stroke="#ededed" d="M100.8.361h50.4v50.4h-50.4zm0 50.4h50.4v50.4h-50.4z"/><path fill="#f8f6fe" d="M100.8 101.161h50.4v50.4h-50.4z"/><path fill="#fff" stroke="#ededed" d="M100.8 151.561h50.4v50.4h-50.4z"/><path fill="#6226fb" d="M100.8 201.96h50.4v50.4h-50.4z"/><path fill="#fff" stroke="#ededed" d="M100.8 252.361h50.4v50.4h-50.4z"/></svg>`;

const RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 303 303" aria-hidden="true"><path fill="#fff" stroke="#ededed" d="M101.3.36H50.9v50.4h50.4zm0 50.4H50.9v50.4h50.4z"/><path fill="#fef5fe" stroke="#ededed" d="M101.3 101.161H50.9v50.4h50.4z"/><path fill="#fd2bf2" d="M101.3 151.561H50.9v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M101.3 201.96H50.9v50.4h50.4z"/><path fill="#fef5fe" stroke="#ededed" d="M101.3 252.361H50.9v50.4h50.4z"/><path fill="#fd2bf2" d="M151.7.36h-50.4v50.4h50.4z"/><path fill="#fddffc" stroke="#ededed" d="M151.7 50.76h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M151.7 101.161h-50.4v50.4h50.4zm0 50.4h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M151.7 201.96h-50.4v50.4h50.4zm0 50.401h-50.4v50.4h50.4z"/><path fill="#fef5fe" stroke="#ededed" d="M50.9.36H.5v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M50.9 50.76H.5v50.4h50.4z"/><path fill="#fd2bf2" d="M50.9 101.161H.5v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M50.9 151.561H.5v50.4h50.4z"/><path fill="#fddffc" stroke="#ededed" d="M50.9 201.96H.5v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M50.9 252.361H.5v50.4h50.4zM252.5.36h-50.4v50.4h50.4zm0 50.4h-50.4v50.4h50.4z"/><path fill="#fd2bf2" d="M252.5 101.161h-50.4v50.4h50.4z"/><path fill="#fddffc" stroke="#ededed" d="M252.5 151.561h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M252.5 201.96h-50.4v50.4h50.4z"/><path fill="#fd2bf2" d="M252.5 252.361h-50.4v50.4h50.4zM302.9.36h-50.4v50.4h50.4z"/><path fill="#fef5fe" stroke="#ededed" d="M302.9 50.76h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M302.9 101.161h-50.4v50.4h50.4zm0 50.4h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M302.9 201.96h-50.4v50.4h50.4z"/><path fill="#fddffc" stroke="#ededed" d="M302.9 252.361h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M202.1.36h-50.4v50.4h50.4zm0 50.4h-50.4v50.4h50.4z"/><path fill="#fef5fe" d="M202.1 101.161h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M202.1 151.561h-50.4v50.4h50.4z"/><path fill="#fd2bf2" d="M202.1 201.96h-50.4v50.4h50.4z"/><path fill="#fff" stroke="#ededed" d="M202.1 252.361h-50.4v50.4h50.4z"/></svg>`;

function createBanner() {
  const leftCol = el("div", { className: "banner-col" });
  leftCol.innerHTML = LEFT_SVG;

  const rightCol = el("div", { className: "banner-col" });
  rightCol.innerHTML = RIGHT_SVG;

  const ctaLink = el("a", {
    href: "/",
    target: "_blank",
    rel: "noreferrer noopener",
    className: "banner-link",
    innerHTML: `See all our courses <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.8 6.4V3.2H9.6v3.2h3.2ZM12.8 12.8V9.6H9.6v3.2h3.2ZM9.6 3.2V0H6.4v3.2h3.2ZM9.6 16v-3.2H6.4V16h3.2Z"/><path d="M9.6 9.6V6.4H6.4v3.2h3.2ZM16 9.6V6.4h-3.2v3.2H16ZM3.2 9.6V6.4H0v3.2h3.2Z"/></svg>`,
  });

  return el("div", { id: "catalog-banner" }, [
    el("div", { className: "banner-inner" }, [
      leftCol,
      el("div", { className: "banner-center" }, [
        el("h1", { text: "Let's Get Smarter." }),
        el("p", {
          text: "Transform your potential into expertise with Chainguard Courses. Your gateway to a future built on trust and technology.",
        }),
        el("div", { className: "banner-cta" }, [ctaLink]),
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
export function catalogView() {
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
            href: getCorrectURL("https://www.chainguard.dev/contact"),
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
