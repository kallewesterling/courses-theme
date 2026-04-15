import { Q, el } from "../utils.mjs";
import { CG } from "../CG.mjs";
import { logger } from "../logger.mjs";

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
 * The strip is not appended here — postCourse() places it in the header.
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
}

/**
 * Post-course setup function to finalize the DOM adjustments specific to course pages after routing logic has been applied.
 * Appends all header elements — including the course details strip — to the header wrapper.
 */
function postCourse() {
  CG.dom.header.wrapper.append(
    ...[
      Q(".sj-floater-text") ||
      el("div", {
        className: "sj-floater-text",
        text: "Course",
      }),
      Q(".break-word"),
      CG.dom.header.courseInfo || CG.el.headingParagraph,
      CG.dom.local.strip,
      CG.dom.header.ctaBtnWrapper,
    ].filter(Boolean)
  );
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

  processCourseDetails(courseDetails, "unregistered");

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

  processCourseDetails(courseDetails, "registered");

  CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);

  postCourse();
}
