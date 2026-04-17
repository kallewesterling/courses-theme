import { wrapCTAWithBadge } from "./course.mjs";
import { CG } from "../CG.mjs";
import { hide } from "../styling.mjs";
import { tryPathSections } from "../sections.mjs";
import { Q, el } from "../utils.mjs";

// static imports
import { term, tooltips } from "../../data/messages.mjs";
import { attachFloaterTooltip } from "../tooltip.mjs";

/**
 * Post-path setup — runs after each path view has finished its DOM work.
 * Mirrors postCourse(): inserts the floater/meta-row, assembles path sections,
 * and wraps the CTA button with the brand-badge design.
 *
 * Works for both registered and unregistered views:
 * - Unregistered: Skilljar's .dp-summary-wrapper is already in the DOM.
 * - Registered:   pathRegisteredView() prepends topRow (which contains
 *                 .dp-summary-wrapper) before calling this function.
 * In both cases Q(".dp-summary-wrapper") finds the right container.
 */
function postPath() {
  const floater = Q(".sj-floater-text") || el("span", { className: "sj-floater-text", textContent: term.learningPath });
  attachFloaterTooltip(floater, tooltips.learningPath);
  const metaRow = el("div", { className: "course-meta-row" }, [floater]);

  const dpSummary = Q(".dp-summary-wrapper");
  if (dpSummary) {
    const h1 = Q("h1", dpSummary);
    if (h1) h1.before(metaRow);
    else dpSummary.prepend(metaRow);
  }

  tryPathSections();
  wrapCTAWithBadge();
}

/**
 * This function applies styling to the Learning Path details page, when
 * the user is logged out or logged in but not registered for the Learning Path.
 * @returns {void}
 */
export function pathUnregisteredView() {
  postPath();
}

/**
 * This function applies styling to the Learning Path details page, when
 * the user is logged in and registered for the Learning Path.
 * @returns {void}
 */
export function pathRegisteredView() {
  hide([
    ".path-curriculum-resume-wrapper",
    "#path-curriculum-progress-bar-annotation",
    "#path-curriculum-progress-bar",
  ]);

  const topRow = el(
    "div",
    {
      className:
        "top-row-grey top-row-white-v2 padding-top padding-side row-v2",
    },
    [
      el("div", { className: "row dp-row-flex-v2" }, [
        el(
          "div",
          {
            className:
              "columns text-center large-6 dp-summary-wrapper text-left-v2",
          },
          [
            el("h1", {
              className: "break-word",
              textContent: window.skilljarCourseSeries.title || "",
            }),
            el("p", {
              className: "sj-heading-paragraph",
              textContent: window.skilljarCourseSeries.short_description || "",
            }),
            Q(".path-curriculum-button-wrapper a"),
          ]
        ),
      ]),
    ]
  );

  const detailsBundle = el("div", { id: "dp-details-bundle" }, [
    el("div", { className: "row padding-side" }, [
      el("div", { className: "columns" }, [
        el("div", { className: "dp-long-description" }, [
          el("p", {
            innerHTML: window.skilljarCourseSeries.long_description_html,
          }),
        ]),
      ]),
    ]),
  ]);

  // Prepend topRow and detailsBundle before calling postPath(),
  // so Q(".dp-summary-wrapper") inside postPath() finds our new wrapper.
  CG.dom.contentContainer.prepend(...[topRow, detailsBundle].filter(Boolean));

  postPath();
}
