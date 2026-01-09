import { Q, el } from "../meta.mjs";
import { hide } from "../styling.mjs";
import { tryPathSections } from "../sections.mjs";

import { CG } from "../CG.mjs";

/**
 * This function applies styling to the Learning Path details page, when
 * the user is logged out or logged in but not registered for the Learning Path.
 * @returns {void}
 */
export function pathUnregisteredView() {
  // make path sections
  tryPathSections();
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
            el("div", {
              className: "sj-floater-text",
              textContent: "Learning Path",
            }),
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

  // prepend topRow and detailsBundle to content
  CG.dom.contentContainer.prepend(...[topRow, detailsBundle].filter(Boolean));

  // make path sections
  tryPathSections();
}
