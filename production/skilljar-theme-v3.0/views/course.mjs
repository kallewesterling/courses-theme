import { Q, el } from "../utils.mjs";
import { CG } from "../CG.mjs";
import { logger } from "../logger.mjs";

// static imports
import { courseDetails as staticCourseDetails } from "../../data/course-details.mjs";
import { term } from "../../data/messages.mjs";

/**
 * Resolves course details for the current page.
 * Uses the page-injected `courseDetails` global (from the course description script block) if
 * present and non-empty; falls back to the static data file keyed by course slug.
 * @returns {Object|undefined}
 */
function resolveDetails() {
  const fromPage = typeof courseDetails !== "undefined" ? courseDetails : null;
  if (fromPage && Object.keys(fromPage).length > 0) return fromPage;

  // Derive the slug from the URL — always available, no Skilljar dependency
  const slug = window.location.pathname.split("/").filter(Boolean).pop();
  const fromStatic = slug ? staticCourseDetails[slug] : undefined;

  if (!fromStatic) logger.warn(`No course details found for slug: "${slug}"`);
  return fromStatic;
}

/**
 * Creates a horizontal course details strip element with provided details.
 * The register/resume button is intentionally excluded — it will be placed
 * elsewhere in the header.
 * @param {Object} details - An object containing course details.
 * @param {string} details.audience - The target audience for the course.
 * @param {string} details.time - The estimated time to complete the course.
 * @param {number} details.lessons - The number of lessons in the course.
 * @returns {HTMLElement} The created course details strip element.
 */
function createCourseDetailsStrip(details) {
  return el("div", { className: "course-details-strip no-select" }, [
    el("div", { className: "detail-item detail-item--audience" }, [
      el("p", { className: "detail-label", textContent: "Audience" }),
      el("p", { className: "detail-text", textContent: details.audience }),
    ]),
    el("div", { className: "detail-item detail-item--duration" }, [
      el("p", { className: "detail-label", textContent: "Duration" }),
      el("p", { className: "detail-text", textContent: details.time }),
    ]),
    el("div", { className: "detail-item detail-item--lessons" }, [
      el("p", { className: "detail-label", textContent: "Lessons" }),
      el("p", { className: "detail-text", textContent: details.lessons + " lessons" }),
    ]),
  ]);
}

/**
 * Creates the course details strip and stores it on CG.dom.local.strip.
 * The strip is not appended here — postCourse() places it in the content container.
 * @param {Object} courseDetails - An object containing course details.
 * @param {string} viewType - "unregistered" or "registered" (used for logging).
 * @returns {void}
 */
function processCourseDetails(courseDetails, viewType) {
  if (typeof courseDetails === "undefined") {
    logger.warn("Course details are undefined. Skipping course details strip creation.");
    return;
  }

  logger.info(`Processing course details for ${viewType} view`);

  CG.dom.local.strip?.remove();
  CG.dom.local.strip = createCourseDetailsStrip(courseDetails);

  CG.dom.local.timeIndicator?.remove();
  CG.dom.local.timeIndicator = el("p", {
    className: "course-time-indicator",
    textContent: courseDetails.time,
  });
}

/**
 * Wraps a CTA button (Register / Resume / Completed) with the brand-badge design:
 * a coloured square containing a dot-grid icon on the left, the existing
 * Skilljar <a> element on the right. Safe to call on course and learning-path
 * pages in any state; guards against double-wrapping.
 *
 * Icon and colour vary by state:
 *   - Unregistered:       cross icon, fuschia badge, full hover
 *   - Registered/resumed: play icon,  fuschia badge, full hover
 *   - Completed:          check icon, lime badge, no hover, text → "Completed"
 *                         (course pages only — paths have no completion concept)
 */
export function wrapCTAWithBadge() {
  const btn = CG.dom.header.btn;
  if (!btn || btn.closest(".cta-badge-btn")) return;

  let badgeClass = "cta-badge";
  let wrapperClass = "cta-badge-btn";

  if (CG.page.isCourseRegistered && CG.state.course.completed) {
    badgeClass += " cta-badge--check";
    wrapperClass += " cta-badge-btn--completed";
    const textSpan = btn.querySelector("span") || btn;
    textSpan.textContent = "Completed";
  } else if (CG.page.isCourseRegistered || CG.page.isPathRegistered) {
    badgeClass += " cta-badge--play";
  }

  const badge = el("span", { className: badgeClass });
  const wrapper = el("div", { className: wrapperClass }, [badge]);

  btn.replaceWith(wrapper);
  wrapper.append(btn);
}

/**
 * Post-course setup function to finalize the DOM adjustments specific to course pages after routing logic has been applied.
 * Assembles the header and appends the course details strip to the bottom of the content container.
 */
function postCourse() {
  // Header assembly
  const floater = Q(".sj-floater-text") || el("span", { className: "sj-floater-text", text: term.course });
  const metaItems = [floater];
  if (CG.dom.local.timeIndicator) {
    metaItems.push(el("span", { className: "course-meta-sep", textContent: "●" }));
    metaItems.push(CG.dom.local.timeIndicator);
  }
  const metaRow = el("div", { className: "course-meta-row" }, metaItems);

  CG.dom.header.wrapper.append(
    ...[
      metaRow,
      Q(".break-word"),
      CG.dom.header.courseInfo || CG.el.headingParagraph,
      CG.dom.header.ctaBtnWrapper,
    ].filter(Boolean)
  );

  // Strip placement depends on the view:
  // - Registered: after the two-column .tabs container (inside #cp-content > .tabs-wrapper-v2)
  // - Unregistered: appended inside #dp-details (flex-direction: column), so it sits
  //   below the two-column .row.hide-for-small block
  if (CG.dom.local.strip) {
    if (CG.dom.local.tabs?.container) {
      CG.dom.local.tabs.container.after(CG.dom.local.strip);
    } else {
      CG.dom.courseContainer.append(CG.dom.local.strip);
    }
  }

  wrapCTAWithBadge();
}

/**
 * This function applies styling to the course details page when the user is
 * not logged in or logged in but not registered for the course.
 * @returns {void}
 */
export function courseUnregisteredView() {
  CG.dom.local = {};

  // Add course order
  let courseInfo = CG.dom.header.courseInfo || CG.el.headingParagraph;

  [...courseInfo.children]
    .filter((elem) => elem.textContent.search(/Course \d+ of \d+ in/) !== -1)
    .forEach((elem) => elem.classList.add("course-order"));

  // Add path registration info
  [...courseInfo.children]
    .filter(
      (elem) =>
        elem.textContent.search(
          /Register for the learning path to register for this course/
        ) !== -1
    )
    .forEach((elem) => elem.classList.add("path-registration"));

  // Lift "About this course" h3 out of its column so it spans both grid columns
  const dpRow = Q(".row.hide-for-small", Q("#dp-details"));
  const aboutCol = dpRow ? (Q(".large-7.columns", dpRow) || Q(".columns:first-child", dpRow)) : null;
  const aboutH3 = aboutCol ? Q("h3", aboutCol) : null;
  if (aboutH3 && dpRow) {
    aboutH3.classList.add("course-content-header");
    dpRow.prepend(aboutH3);
  }

  processCourseDetails(resolveDetails(), "unregistered");

  // process curriculum elements
  try {
    CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);
  } catch (error) {
    logger.error("Error processing curriculum elements:", error);
  }

  postCourse();
}

/**
 * This function applies styling to the course details page when the user is
 * logged in and registered for the course.
 * @returns {void}
 */
export function courseRegisteredView() {
  CG.dom.local = {
    tabs: {
      container: Q(".tabs"),

      get curriculumSection() {
        return (
          Q("section #curriculum-section", this.container) ||
          Q("section:nth-child(1)", this.container)
        );
      },

      get aboutSection() {
        return (
          Q("section #about-section", this.container) ||
          Q("section:nth-child(2)", this.container)
        );
      },
    },
  };

  CG.dom.local.tabs.aboutSection?.classList.add("active");

  CG.dom.local.tabs.container.append(
    Object.assign(CG.dom.local.tabs.aboutSection, { id: "about-section" }),
    Object.assign(CG.dom.local.tabs.curriculumSection, {
      id: "curriculum-section",
    })
  );

  // Lift "About this course" h3 out of its section so it spans both grid columns
  const aboutH3 = Q("h3.course-long-description-header", CG.dom.local.tabs.container);
  if (aboutH3) {
    aboutH3.classList.add("course-content-header");
    CG.dom.local.tabs.container.prepend(aboutH3);
  }

  processCourseDetails(resolveDetails(), "registered");

  CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);

  postCourse();
}
