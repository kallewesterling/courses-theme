import { Q, el } from "../utils.mjs";
import { hide } from "../styling.mjs";
import { CG } from "../CG.mjs";
import { logger } from "../logger.mjs";

/**
 * Creates a course details card element with provided details and options.
 * @param {Object} details - An object containing course details.
 * @param {string} details.audience - The target audience for the course.
 * @param {string} details.time - The estimated time to complete the course.
 * @param {number} details.lessons - The number of lessons in the course.
 * @param {Object} options - An object containing options for the card.
 * @param {string} [options.btnText="Register"] - The text for the action button.
 * @param {string} [options.btnHref="#"] - The URL for the action button.
 * @param {boolean} [options.completed=false] - Indicates if the course is completed.
 * @returns {HTMLElement} The created course details card element.
 */
function createCourseDetailsCard(
  details,
  options = {
    btnText: "Register",
    btnHref: "#",
    completed: false,
  }
) {
  // Create main container
  const card = el("div", { className: "course-card" }, [
    el("h3", {
      className: "no-select",
      textContent: "Course Details",
    }),
    el("ul", { className: "no-select" }, [
      el("li", {}, [el("p", { text: details.audience })]),
      el("li", {}, [el("p", { text: details.time })]),
      el("li", {}, [el("p", { text: details.lessons + " Lessons" })]),
    ]),
  ]);

  // Link
  const link = el("a", {
    href: options.completed ? "#" : options.btnHref,
    textContent: options.completed ? "🎉 Completed" : options.btnText,
    className: `button ${options.completed ? "completed" : ""}`,
  });

  // add margin to link button
  // setStyle(link, { marginLeft: "20px", marginRight: "20px" });

  card.appendChild(link);

  if (options.completed) {
    card.append(
      el("p", {
        textContent: "Click on any lesson that you want to revisit.",
        className: "completed-subtext",
      })
    );
  }

  return card;
}

/**
 * This function processes the course details and updates the course details card on the page.
 * It creates a new course details card with the provided details and options, and replaces the existing card if it exists.
 * @param {Object} courseDetails - An object containing course details to be displayed on the card.
 * @param {string} viewType - A string indicating the type of view ("unregistered" or "registered") to determine the button text and styling.
 * @returns {void}
 */
function processCourseDetails(courseDetails, viewType) {
  if (typeof courseDetails == "undefined") {
    logger.warn("Course details are undefined. Skipping course details card creation.");
    return;
  }

  let btnText;
  if (viewType === "unregistered") {
    btnText = CG.dom.header.ctaBtnWrapper
      ? CG.dom.header.registerBtn.textContent
      : "Register for Learning Path";
  } else if (viewType === "registered") {
    btnText = CG.dom.header.ctaBtnWrapper
      ? CG.dom.header.ctaBtnText.textContent
      : "Resume";
  } else {
    btnText = "Register";
  }

  logger.info(`Processing course details for ${viewType} view with button text: ${btnText}`);

  CG.dom.local.card ? CG.dom.local.card.remove() : null;

  CG.dom.courseContainer.append(
    ...[
      createCourseDetailsCard(courseDetails, {
        btnText,
        btnHref: CG.dom.header.href,
        completed: CG.state.course.completed,
      }),
    ].filter(Boolean)
  );

  // re-query link
  CG.dom.local._card.link = Q(".course-card a");
}

/**
 * Post-course setup function to finalize the DOM adjustments specific to course pages after routing logic has been applied.
 * This function handles tasks such as appending course details to the header, and any other adjustments needed for course pages.
 * It ensures that the course page is fully set up with the correct elements and structure after the main routing logic has executed.
 */
function postCourse() {
  // append elements to header
  CG.dom.header.wrapper.append(
    ...[
      Q(".sj-floater-text") ||
      el("div", {
        className: "sj-floater-text",
        text: "Course",
      }),
      Q(".break-word"),
      CG.dom.header.courseInfo || CG.el.headingParagraph,
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
  CG.dom.local = {
    card: Q(".course-card"),
  };

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
    card: Q(".course-card"),
    _card: {
      details: Q(".course-card"),
      link: Q(".course-card a"),
    },
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

  // update resume button text and href (with auto-value fallback)
  if (CG.dom.header.ctaBtnWrapper && CG.dom.local._card.link) {
    Object.assign(CG.dom.local._card.link, {
      textContent: CG.dom.header.ctaBtnText.textContent || "Resume",
      href: CG.dom.header.ctaBtn.getAttribute("href") || "resume",
    });
  } else if (CG.dom.local._card.link && !CG.state.course.completed) {
    logger.warn("Hiding resume button as it could not be found");
    hide(CG.dom.local.card.link); // Hide resume button if it doesn't exist
  }

  CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);

  // move elements
  CG.dom.courseContainer.append(
    ...[CG.dom.local._card.details].filter(Boolean)
  );

  postCourse();
}
