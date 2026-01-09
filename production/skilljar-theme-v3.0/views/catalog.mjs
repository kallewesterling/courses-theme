import { pathSections } from "../static.mjs";
import { Q, el, remove, getCorrectURL } from "../meta.mjs";
import { hide } from "../styling.mjs";
import { createClone } from "../icons.mjs";
import { CG } from "../CG.mjs";
import { logger } from "../logger.mjs";
import { makeSections } from "../sections.mjs";

/**
 * This function applies styling to a catalog page (landing page only, regardless
 * of whether the user is logged in; and Learning Path catalog pages, if the user is logged in).
 * @returns {void}
 */
export function catalogView() {
  CG.dom.body.prepend(el("div", { id: "cg-bg" }));
  CG.data.sections = pathSections[window.skilljarCatalogPage.slug]; // ex. "partners"

  if (!CG.data.sections) CG.data.sections = pathSections["home"];

  if (!pathSections[window.skilljarCatalogPage.slug] && !CG.page.isLanding)
    logger.warn("Could not determine catalog section name, defaulting to home");

  // hide existing content
  hide(Q("#catalog-content"));

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
          [createClone("rightArrow")]
        ),
        createClone("chainguard", { width: "83", height: "72" }),
      ]),
    ])
  );
}
