/* eslint-disable no-undef */

/*
 * Chainguard Courses Theme v2.1
 * This script applies custom styles and functionality to Chainguard's Skilljar platform.
 * It includes features like curriculum styling, lesson navigation, and responsive design adjustments.
 * It also provides utility functions for clipboard operations and element styling.
 *
 * This script is designed to be run in the context of a Skilljar page.
 *
 * @version 2.1
 * @date 2025-08-21
 * @author Chainguard
 * @license MIT
 * @see {@link https://courses.chainguard.com|Chainguard Courses}
 */

// UTM settings
const UTM = {
  SOURCE: "courses",
  MEDIUM: "referral",
  CAMPAIGN: "dev-enablement",
};

let initialLoadComplete = false,
  isStaging = false,
  isInternal = false,
  domain = "3glgawqmzatte",
  course = {
    progress: {},
    path:
      typeof skilljarCourseSeries !== "undefined" ? skilljarCourseSeries : {},
    completed: false,
  };

if (window.location.hostname.includes("chainguard-test.skilljar.com")) {
  isStaging = true;
  domain = "ix1ljpxex6xd";
}

course.path.edit =
  typeof skilljarCourseSeries !== "undefined"
    ? `https://dashboard.skilljar.com/publishing/domains/${domain}/published-paths/${skilljarCourseSeries.id}/edit`
    : "";

if (typeof skilljarCourse !== "undefined") {
  course.id = skilljarCourse.id;
  course.publishedCourseId = skilljarCourse.publishedCourseId;
  course.tags = skilljarCourse.tags;
  course.title = skilljarCourse.title;
  course.short_description = skilljarCourse.short_description;
  course.long_description_html = skilljarCourse.long_description_html;
  course.edit = `https://dashboard.skilljar.com/course/${skilljarCourse.id}`;
}

if (typeof skilljarCourseProgress !== "undefined") {
  course.progress = skilljarCourseProgress;
  course.completed = skilljarCourseProgress.completed_at !== "";
}

if (typeof skilljarUser !== "undefined")
  isInternal = skilljarUser.email.includes("@chainguard.dev");

/**
 * This function logs messages to the console with a specific style.
 * It only logs messages if the hostname includes "chainguard-test.skilljar.com".
 * It supports both string messages and objects.
 * @param {string|object} message - The message to log.
 * @param {...*} args - Additional arguments to log.
 * @return {void}
 * @example
 * log("This is a test message");
 * log({ key: "value" }, "Additional info");
 */
const log = (message, ...args) => {
  if (!message || !isStaging) return;

  const style = "color: var(--primary-blue-hex); font-weight: 600;";

  if (typeof message === "string") {
    console.info(`%c${message}`, style, ...args);
  } else {
    console.info("%c", style, message, ...args);
  }
};

function createClone(type = "checkbox") {
  function createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  }

  const attrs = {
    className: `${type}-icon`,
    width: "20",
    height: "21",
    viewBox: "0 0 20 21",
    fill: "none",
    style:
      `display: block; fill: var(${
        type === "checkbox" ? "--answer-option" : "--primary-blue-hex"
      });` +
      (type === "copy" ? "cursor: pointer;" : "") +
      (type === "checkbox" ? "flex-shrink: 0;" : ""),
  };

  const svg = createSvgElement("svg", attrs);

  let path;
  switch (type) {
    case "checkbox":
      path = createSvgElement("path", {
        d: "M8.22948 14.021L5.02148 10.792L5.75048 10.042L8.22948 12.5L14.2505 6.5L14.9795 7.271L8.22948 14.021Z",
      });
      break;

    case "copy":
      path = createSvgElement("path", {
        d: "M5.12597 18.0835C4.75064 18.0835 4.43464 17.9548 4.17797 17.6975C3.9213 17.4408 3.79297 17.1248 3.79297 16.7495V6.3335H4.87597V16.7495C4.87597 16.8195 4.9003 16.8785 4.94897 16.9265C4.99764 16.9752 5.05664 16.9995 5.12597 16.9995H13.543V18.0835H5.12597ZM7.70897 15.4995C7.3343 15.4995 7.0183 15.3712 6.76097 15.1145C6.5043 14.8572 6.37597 14.5412 6.37597 14.1665V4.6875C6.37597 4.31216 6.5043 3.99283 6.76097 3.7295C7.0183 3.4655 7.3343 3.3335 7.70897 3.3335H15.189C15.5636 3.3335 15.883 3.4655 16.147 3.7295C16.411 3.99283 16.543 4.31216 16.543 4.6875V14.1665C16.543 14.5412 16.411 14.8572 16.147 15.1145C15.883 15.3712 15.5636 15.4995 15.189 15.4995H7.70897ZM7.70897 14.4165H15.189C15.2583 14.4165 15.3206 14.3922 15.376 14.3435C15.4313 14.2948 15.459 14.2358 15.459 14.1665V4.6875C15.459 4.61816 15.4313 4.5555 15.376 4.4995C15.3206 4.44416 15.2583 4.4165 15.189 4.4165H7.70897C7.63964 4.4165 7.58064 4.44416 7.53197 4.4995C7.4833 4.5555 7.45897 4.61816 7.45897 4.6875V14.1665C7.45897 14.2358 7.4833 14.2948 7.53197 14.3435C7.58064 14.3922 7.63964 14.4165 7.70897 14.4165Z",
      });
      break;
  }

  svg.appendChild(path);

  return svg;
}

function createResourceCard(resource) {
  // ---- Link with optional UTM ----
  let link;
  if (resource.addUTM) {
    const url = new URL(resource.link);
    url.searchParams.set("utm_source", "courses");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "dev-enablement");
    link = url.toString();
  } else {
    link = resource.link;
  }

  // ---- Outer link wrapper ----
  const linkWrapper = Object.assign(document.createElement("a"), {
    href: link,
    target: "_blank",
    className: "resource-link-wrapper", // style like a block if needed
  });

  // ---- Card container ----
  const card = Object.assign(document.createElement("div"), {
    className: "resource-card",
  });

  const cardWrapper = Object.assign(document.createElement("div"), {
    className: "card-body",
  });

  // ---- Badges before title ----
  if (Array.isArray(resource.tags) && resource.tags.length > 0) {
    const badgeContainer = Object.assign(document.createElement("div"), {
      className: "badge-container",
    });

    resource.tags.forEach((tag) => {
      const badge = Object.assign(document.createElement("div"), {
        className: "badge",
        textContent: tag,
      });
      badgeContainer.appendChild(badge);
    });

    cardWrapper.appendChild(badgeContainer);
  }

  // ---- Title ----
  const titleEl = Object.assign(document.createElement("h5"), {
    className: "card-title",
    textContent: resource.title,
  });
  cardWrapper.appendChild(titleEl);

  // ---- Assemble ----
  card.appendChild(cardWrapper);
  linkWrapper.appendChild(card);

  return linkWrapper;
}

const c = (selector) => (document.querySelector(selector) ? true : false);

const page = {
  isCatalog: c(".sj-page-catalog"),
  isLanding: c(".sj-page-catalog-root"),
  isCurriculum: c(".sj-page-curriculum"),
  isCourseDetails: c(".sj-page-detail-course"),
  isLesson: c(".sj-page-lesson"),
  isLogin: c(".sj-page-login"),
  isSignup: c(".sj-page-signup"),
  isPageDetail: c(".sj-page-detail-bundle.sj-page-detail-path"),
  isPageCatalog: c(".sj-page-series.sj-page-path"),
  hasCertificate: c(".cp-certificate"),
};

let v = {
  viewport: "", // "mobile" or "desktop"
  width: 0, // current viewport width

  // elements
  global: {
    body: document.querySelector("body"),
    logo: document.querySelector(".header-center-img"),
    footerContainer: document.querySelector("#footer-container"),
    footerCols: document.querySelectorAll(
      "#footer-container .global-footer-column"
    ),
    epFooter: document.querySelector("#ep-footer"),
    contentContainer: page.isLesson
      ? document.querySelector(".sj-page-lesson")
      : document.querySelector("#skilljar-content"),
  },
};

function getCurriculumElements(curriculumParentContainer) {
  let currentSection = 0,
    elements = Array.from(
      curriculumParentContainer.querySelectorAll("[class^='lesson-']")
    ),
    a;

  const content = elements
    .filter((e) => !e.classList.contains("lesson-row"))
    .map((elem) => {
      const isHeader = elem.classList.contains("lesson-section");

      currentSection += isHeader ? 1 : 0;

      return [
        currentSection,
        isHeader,
        elem.textContent.replace("optional", "").trim(),
        elem.href || null,
        elem.querySelector(".bullet i"),
      ];
    });

  if (!currentSection) {
    // we have no sections, only a list of lessons
    a = [
      {
        section: 1,
        heading: "Lessons",
        lessons: content.map((d) => d[2]),
        links: content.map((d) => d[3]),
        bullets: content.map((d) => d[4]),
      },
    ];
  } else {
    a = new Array(currentSection).fill(0).map((_, i) => ({
      section: i + 1,
      heading: content.filter((d) => d[1] && d[0] === i + 1)[0][2],
      lessons: content.filter((d) => !d[1] && d[0] === i + 1).map((d) => d[2]),
      links: content.filter((d) => !d[1] && d[0] === i + 1).map((d) => d[3]),
      bullets: content.filter((d) => !d[1] && d[0] === i + 1).map((d) => d[4]),
    }));
  }

  return a.map((section) => {
    const wrapper = Object.assign(document.createElement("div"), {
      className: "curriculum-wrapper",
      // style: `border-radius: 8px; margin-bottom: 48px; padding: 0; border: ${
      //   border === "b"
      //     ? "2px solid var(--primary-blue-hex)"
      //     : "1px solid var(--detail-medium-contrast)"
      // };`,
    });

    const header = Object.assign(document.createElement("div"), {
      className: "curriculum-header",
      // style: `display: flex; align-items: center; padding: 24px; margin: 0; font-family: "Fusiona"; font-size: 16px; font-weight: 500; line-height: 125%; letter-spacing: "-.16px"; border-bottom: 2px solid var(--primary-blue-hex);`,
      textContent: section.heading,
    });

    const lessons = section.lessons.map((lesson, ix) => {
      const a = Object.assign(document.createElement("a"), {
        className: "curriculum-lesson" /* lesson-row */,
        // style: `display: block; color: black; padding: 24px; font-size: 16px; font-weight: 400; line-height: 150%; border-bottom: ${
        //   ix !== section.lessons.length - 1
        //     ? border === "b"
        //       ? "2px solid var(--primary-blue-hex)"
        //       : "1px solid var(--detail-medium-contrast)"
        //     : "none"
        // };`,
        textContent: lesson,
        href: section.links[ix] || "#",
      });

      if (section.bullets[ix])
        a.prepend(
          Object.assign(section.bullets[ix], {
            // style: `display: inline-block; font-size: 1.5em; transform: translateY(3px); margin-right: 10px; color: var(--primary-blue-hex);`,
          })
        );

      return a;
    });

    wrapper.append(header, ...lessons);

    return wrapper;
  });
}

/**
 * This function copies the given text to the clipboard and animates a tooltip indicating success.
 * @param {string} copyText - The text to copy to the clipboard.
 * @param {HTMLElement} tooltipContainer - The element to animate as a tooltip.
 * @return {Function} - A function that, when called, will copy the text and animate the tooltip.
 */
function toClipboard(copyText, tooltipContainer) {
  return async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      animateCopiedTooltip(tooltipContainer);
    } catch (err) {
      console.error("Failed to copy codeblock to clipboard: ", err);
    }
  };
}

/**
 * Sets the style of an element or a list of elements.
 * Accepts: HTMLElement, NodeList/HTMLCollection/Array of HTMLElements, or selector string.
 * Skips non-element values found in iterables (e.g., strings, nulls, Documents).
 * @returns {HTMLElement|HTMLElement[]|null}
 */
function setStyle(target, style) {
  const toKebab = (p) =>
    p.startsWith("--") ? p : p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

  const isElement = (n) =>
    !!n &&
    typeof n === "object" &&
    n.nodeType === 1 &&
    typeof n.style?.setProperty === "function";

  const apply = (el) => {
    for (const [prop, raw] of Object.entries(style)) {
      const cssProp = toKebab(prop);

      // If undefined → unset
      if (raw === undefined) {
        el.style.removeProperty(cssProp);
        continue;
      }

      let value = String(raw);
      let priority = "";

      if (/\s*!important\s*$/i.test(value)) {
        priority = "important";
        value = value.replace(/\s*!important\s*$/i, "");
      }

      if (value.trim()) {
        el.style.setProperty(cssProp, value.trim(), priority);
      }
    }
    return el;
  };

  // selector string → first match
  if (typeof target === "string") {
    const el = document.querySelector(target);
    return el ? apply(el) : null;
  }

  // Iterable? (NodeList, HTMLCollection, Array, Set, etc.)
  const isIterable =
    target &&
    typeof target !== "string" &&
    typeof target[Symbol.iterator] === "function";

  if (isIterable && !(target instanceof Element)) {
    const elements = Array.from(target).filter(isElement);
    // Optional: warn if we dropped items (useful during dev)
    // if (elements.length !== Array.from(target).length) console.warn("setStyle: skipped non-element items in iterable");
    if (elements.length === 0) return null;
    elements.forEach(apply);
    return elements;
  }

  // Single element
  if (isElement(target)) return apply(target);

  return null;
}

/**
 * This function hides the given element by setting its display style to "none".
 * @param {HTMLElement} element - The element to hide.
 */
function hide(element) {
  setStyle(element, { display: "none !important" });
}

/**
 * This function animates the tooltip that appears when code is copied.
 * It sets the opacity to 1, waits for 400ms, and then sets the opacity to 0.
 * @param {HTMLElement} tooltipEl - The tooltip element to animate.
 */
function animateCopiedTooltip(tooltipEl) {
  setStyle(tooltipEl, { opacity: "1" });

  setTimeout(() => {
    setStyle(tooltipEl, { opacity: "0" });
  }, 400);
}

/**
 * This function styles the group container for curriculum sections.
 * It sets the border, border radius, margin, and padding.
 * @param {HTMLElement} container - The container element to style.
 * @param {string} border - The border style to apply. Default is "b" for blue.
 * @return {void}
 */
function styleGroupContainer(container, border = "b") {
  log("Running styleGroupContainer with setStyle");
  setStyle(container, {
    border:
      border === "b"
        ? "2px solid var(--primary-blue-hex)"
        : "1px solid var(--detail-medium-contrast)",
    borderRadius: "8px",
    marginBottom: "48px",
    padding: "0",
  });
}

/**
 * This function styles the list item for lessons.
 * It hides the type icon, sets padding, font size, font weight, and line height.
 * If the item is not the last child, it adds a bottom border.
 * @param {HTMLElement} lessonItem - The list item element to style.
 * @param {boolean} isLastChild - Indicates if the item is the last child.
 * @param {boolean} hideIcon - Whether to hide the type icon. Default is true.
 * @param {string} border - The border style to apply. Default is "b" for blue.
 * @return {void}
 */
function styleListItem(lessonItem, isLastChild, hideIcon = true, border = "b") {
  log("Running styleListItem with setStyle");
  if (hideIcon) {
    hide(lessonItem.querySelector(".type-icon"));
  }

  setStyle(lessonItem, {
    padding: "24px",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "150%",
    borderBottom: isLastChild
      ? "none"
      : border === "b"
      ? "2px solid var(--primary-blue-hex)"
      : "1px solid var(--detail-medium-contrast)",
  });
}

/**
 * This function styles the group heading container.
 * It sets padding, border bottom, and styles the actual group heading.
 * @param {HTMLElement} groupHeadingContainer - The group heading container to style.
 */
function styleGroupHeading(groupHeadingContainer, border = "b") {
  log("Running styleGroupHeading with setStyle");
  setStyle(groupHeadingContainer, {
    padding: "24px",
    margin: "0",
    fontFamily: "Fusiona",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "125%",
    letterSpacing: "-.16px",
    borderBottom:
      border === "b"
        ? "2px solid var(--primary-blue-hex)"
        : "1px solid var(--detail-medium-contrast)",
  });
}

/**
 * This function applies desktop-specific styling to a catalog page.
 */
function styleCatalog() {
  log("Running styleCatalog");
}

/**
 * This function applies desktop-specific styling to the landing page.
 */
function styleLanding() {
  log("Running styleLanding");
  v.local = {
    catalogBodyParentContainer: document.querySelector("#catalog-content"),
    catalogContainer: document.querySelector("#catalog-courses"),
  };

  // set up userCourseJourney global variable
  window.userCourseJourney = {
    unregistered: Array.from(
      document.querySelectorAll(
        ".coursebox-container[data-course-status='unregistered']"
      )
    ).map((el) => Object.assign({ ...el.dataset })),
    registered: Array.from(
      document.querySelectorAll(
        ".coursebox-container[data-course-status='registered']"
      )
    ).map((el) => Object.assign({ ...el.dataset })),
    completed: Array.from(
      document.querySelectorAll(
        ".coursebox-container[data-course-status='complete']"
      )
    ).map((el) => Object.assign({ ...el.dataset })),
  };

  v.local.catalogBodyParentContainer.append(v.local.catalogContainer);
}

/**
 * This function applies general styling to the course details page.
 */
function styleCourseDetails() {
  log("Running styleCourseDetails");

  v.local = {
    header: {
      container: document.querySelector(".top-row-grey"),
      floaterText: document.querySelector(".sj-floater-text"),
      mainHeading: document.querySelector(".break-word"),
      courseInfo:
        document.querySelector(".sj-course-info-wrapper") ||
        document.querySelector(".sj-heading-paragraph"),
      ctaBtnWrapper: document.querySelector("#purchase-button-wrapper-large"),
      registerBtn: document.querySelector("#purchase-button-wrapper-large a"),
      mainHeadingContainer: document.querySelector(".dp-summary-wrapper"),
    },
    body: {
      container: document.querySelector("#dp-details"),
    },
    curriculum: {
      container: document.querySelectorAll(".dp-curriculum")[0], // note: this is the desktop version
    },
    card: {
      details: document.querySelector(".course-details-card"),
      detailItems: document.querySelectorAll(".course-details-card li"),
      link: document.querySelector(".course-details-card-link"),
    },
  };

  if (v.local.header.registerBtn && v.local.card.link) {
    const btnText = v.local.header.registerBtn.textContent || "Register";
    const btnHref = v.local.header.registerBtn.href || "#";
    v.local.card.link.textContent = btnText;
    v.local.card.link.setAttribute("href", btnHref);
  }

  const curriculumElements = getCurriculumElements(
    v.local.curriculum.container
  );

  v.local.curriculum.container.innerHTML = ""; // Clear the container
  v.local.curriculum.container.append(...curriculumElements);

  // v.local.card.detailItems.forEach((li) => li.prepend(createClone("checkbox")));

  // append card
  v.local.body.container.append(...[v.local.card.details].filter(Boolean));

  // append elements to header
  v.local.header.mainHeadingContainer.append(
    ...[
      v.local.header.floaterText,
      v.local.header.mainHeading,
      v.local.header.courseInfo,
      v.local.header.ctaBtnWrapper,
    ].filter(Boolean)
  );
}

/**
 * This function applies general styling to the path course details page.
 */
function stylePathCourseDetails() {
  log("Running stylePathCourseDetails");

  v.local = {
    header: {
      mainHeadingContainer: document.querySelector(".dp-summary-wrapper"),
      floaterText: document.querySelector(".sj-floater-text"),
      mainHeading: document.querySelector(".break-word"),
      courseInfo: document.querySelector(".sj-heading-paragraph"),
      ctaBtnWrapper: document.querySelector("#purchase-button-wrapper-large"),
    },
    catalog: document.querySelector(".catalog-center-width"),
  };

  // set content
  v.local.header.floaterText.textContent = "Learning Path";
  v.local.header.courseInfo.textContent =
    skilljarCourseSeries.short_description || "";

  // move elements
  v.local.header.mainHeadingContainer.append(
    ...[
      v.local.header.floaterText,
      v.local.header.mainHeading,
      v.local.header.courseInfo,
      v.local.header.ctaBtnWrapper,
    ].filter(Boolean)
  );

  if (skilljarCourseSeries.title === "Chainguard Containers Onboarding Guide") {
    // apply style specific to container onboarding path
    const csmWrapper = Object.assign(document.createElement("div"), {
      id: "catalog-courses",
      className: "course-listing",
    });
    csmWrapper.dataset.listing = "CSM";
    v.local.catalog.prepend(csmWrapper);

    const saHeader = Object.assign(document.createElement("h3"), {
      className: "course-listing-header technical-onboarding",
      textContent: "Technical Onboarding",
    });

    const csmHeader = Object.assign(document.createElement("h3"), {
      className: "course-listing-header admin-onboarding",
      textContent: "Admin Onboarding",
    });

    // here we set the order of csmCourses
    const csmCourses = [
      "kickoff-guide-to-chainguard",
      "getting-started-with-chainguards-console",
      "shared-responsibility-model",
      "chainguards-superstar-support",
    ]
      .filter(Boolean)
      .map((d) =>
        document.querySelector(`.coursebox-container[data-course=${d}]`)
      );

    const saCourses = document.querySelector(
      "#catalog-courses:not([data-listing='CSM'])"
    );

    csmWrapper.append(...csmCourses.filter(Boolean));

    v.local.catalog.append(csmHeader, csmWrapper, saHeader, saCourses);

    // move completed courses to end of list
    saCourses.append(
      ...saCourses.querySelectorAll(
        ".coursebox-container[data-course-status='complete']"
      )
    );

    csmWrapper.append(
      ...csmWrapper.querySelectorAll(
        ".coursebox-container[data-course-status='complete']"
      )
    );
  }
}

/**
 * This function applies desktop-specific styling to the path catalog page.
 */
function stylePathCatalogPage() {
  log("Running stylePathCatalogPage");
  const backArrowBtn = document.querySelector(".back-to-catalog");

  const mainContentContainer = document.querySelector("#catalog-content");
  const topContentContainer = mainContentContainer.querySelector(
    ".path-curriculum-resume-wrapper"
  );
  const coursesList = document.querySelectorAll(
    "#catalog-courses .coursebox-container"
  );

  coursesList.forEach((course) => {
    const innerContainer = course.querySelector(".course-overview");

    setStyle(course, {
      border: "2px solid var(--form-bg)",
      borderRadius: "20px",
    });

    setStyle(innerContainer, { borderTop: "2px solid var(--form-bg)" });

    course.addEventListener("mouseover", () => {
      setStyle(course, { borderColor: "var(--primary-blue-hex)" });
      setStyle(innerContainer, { borderColor: "var(--primary-blue-hex)" });
    });

    course.addEventListener("mouseout", () => {
      setStyle(course, { borderColor: "var(--form-bg)" });
      setStyle(innerContainer, { borderColor: "var(--form-bg)" });
    });
  });

  // MAIN CONTENT STYLING
  setStyle(mainContentContainer, { margin: "96px auto" });

  // hide elements
  hide(backArrowBtn);
  hide(topContentContainer);
}

function styleLesson() {
  log("Running styleLesson");

  /**
   * This function processes code blocks by adding a copy icon and functionality to copy the code to the clipboard.
   * It filters out code blocks that have the 'noCopy' or 'copyAdded' data attributes.
   * @param {NodeList} codeBlocks - A list of code block elements to process.
   * @return {void}
   */
  v.local = {
    body: {
      mainContainer: document.querySelector("#lp-wrapper"),
      innerContainer: document.querySelector("#lesson-body"),
    },
    lesson: {
      body: document.querySelector("#lesson-body"),
      innerBody: document.querySelector("#lesson-main-inner"),
      content: {
        codeBlocks: new Array(
          ...document.querySelectorAll("pre:has(code):not(.language-ansi)")
        ),
        internalCourseWarning: document.querySelector(
          "#internal-course-warning"
        ),
        links: document.querySelectorAll("sjwc-lesson-content-item a"),
        resources: {
          boxes: document.querySelectorAll(
            "sjwc-lesson-content-item .resource-box"
          ),
          wrapper: document.querySelector(
            "sjwc-lesson-content-item .resource-box .resource-wrapper"
          ),
        },
      },
    },
    nav: {
      toggleWrapper: document.querySelector("#left-nav-button"),
      backToCurriculumText: document.querySelector("#left-nav-return-text"),
    },
    footer: {
      container: document.querySelector("#lp-footer"),
    },
  };

  // content
  if (v.local.nav.backToCurriculumText)
    v.local.nav.backToCurriculumText.textContent = "Back to Course Overview";

  // Makes lesson links pop up in new tab
  v.local.lesson.content.links.forEach((el) => {
    el.target = "_blank";
    // we also want to set some utm_source, utm_medium here if it's a link to a certain set of domains (domain name includes chainguard.dev)
    if (el.href.includes("chainguard.dev")) {
      const url = new URL(el.href);
      url.searchParams.set("utm_source", UTM.SOURCE);
      url.searchParams.set("utm_medium", UTM.MEDIUM);
      url.searchParams.set("utm_campaign", UTM.CAMPAIGN);
      el.href = url.toString();
    }
  });

  // move elements
  v.local.body.mainContainer.append(v.local.footer.container);
  v.local.body.innerContainer.prepend(
    ...[
      v.local.lesson.content.internalCourseWarning,
      v.local.nav.toggleWrapper,
    ].filter(Boolean)
  );

  // 1) Find canonical footer controls
  const footerPrev = document.querySelector("#lp-footer .prev-lesson-button");
  const footerNext = document.querySelector("#lp-footer .next-lesson-link");

  // 2) Extract Prev
  const prevHref = footerPrev?.getAttribute("href") || "#";
  const prevTitle = footerPrev?.getAttribute("title") || "Previous Lesson";
  const prevTrack = footerPrev?.getAttribute("data-track-click");

  // 3) Extract Next (Skilljar style: onNextLessonClick('<url>'))
  const up = footerNext?.getAttribute("onmouseup") || "";
  const kd = footerNext?.getAttribute("onkeydown") || "";
  const nextMatch = (up || kd).match(/onNextLessonClick\('([^']+)'\)/);
  const nextUrl = nextMatch ? nextMatch[1] : null;
  const nextTitle = footerNext?.getAttribute("title") || "Next Lesson";
  const nextTrack = footerNext?.getAttribute("data-track-click");

  // 4) Build buttons
  const prevBtn = Object.assign(document.createElement("a"), {
    className: "lesson-btn prev",
    rel: "prev",
    role: "button",
    href: prevHref,
    textContent: "← Previous",
    title: prevTitle,
  });
  if (prevTrack) prevBtn.setAttribute("data-track-click", prevTrack);

  const nextBtn = Object.assign(document.createElement("a"), {
    className: "lesson-btn next",
    rel: "next",
    role: "button",
    // give it a real href for middle-click/open-in-new-tab
    href: nextUrl || "#",
    textContent: "Next →",
    title: nextTitle,
    tabindex: 0,
  });
  if (nextTrack) nextBtn.setAttribute("data-track-click", nextTrack);

  // 5) Behavior: call onNextLessonClick just like Skilljar
  function goNext(e) {
    if (!nextUrl) return;
    e?.preventDefault();
    if (typeof window.onNextLessonClick === "function") {
      window.onNextLessonClick(nextUrl);
    } else {
      window.location.href = nextUrl;
    }
  }
  nextBtn.addEventListener("click", goNext);
  nextBtn.addEventListener("mouseup", goNext);
  nextBtn.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "Enter" || k === " " || k === "Spacebar" || k === "ArrowRight") {
      goNext(e);
    }
  });

  // Disable/hide if missing
  if (!footerPrev) {
    prevBtn.style.display = "none";
  }
  if (!footerNext || !nextUrl) {
    nextBtn.style.display = "none";
  }

  // 6) Build wrapper
  const btnWrapper = Object.assign(document.createElement("nav"), {
    className: "lesson-floater",
    role: "navigation",
    ariaLabel: "Lesson navigation",
  });

  btnWrapper.append(prevBtn, nextBtn);

  v.local.lesson.innerBody.append(document.createElement("hr"), btnWrapper);

  v.local.lesson.content.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((el) => {
      const codeEl = el.querySelector("code");
      const iconClone = createClone("copy");

      const copyText = codeEl.textContent
        .trim()
        .replace(/\r?\n\$ /g, " && ")
        .replace(/^\$ /g, "");

      const container = Object.assign(document.createElement("div"), {
        style: `display: flex; justify-content: end; border-bottom: 1px solid gainsboro; padding: 12px 24px;`,
      });

      // create 'copied' tooltip
      const tooltipContainer = Object.assign(document.createElement("div"), {
        textContent: "Copied",
        style: `position: absolute; top: -24px; right: 10px; text-shadow: none; background-color: var(--answer-option); color: var(--primary-white-hex); padding: 5px 10px; border-radius: 4px; opacity: 0; transition: opacity .2s ease-in;`,
      });

      // add elements
      container.append(iconClone);
      el.append(tooltipContainer);
      el.prepend(container);

      // add event listener to cloned icon to copy block into clipboard
      iconClone.addEventListener(
        "click",
        toClipboard(copyText, tooltipContainer)
      );

      // Mark that copy icon was added to this code block
      el.dataset.copyAdded = "true";
    });

  // Make section titles normal h3 elements
  Array.from(document.querySelectorAll("h3.sjwc-section-title")).map((el) =>
    el.classList.remove("sjwc-section-title")
  );

  if (typeof resources !== "undefined") {
    const numBoxes = v.local.lesson.content.resources.boxes.length;

    if (typeof resources.resources !== "undefined" && numBoxes === 0) {
      console.info(
        "No resource boxes found to add resources to. Adding automatically!"
      );
      const box = Object.assign(document.createElement("div"), {
        className: "resource-box",
      });
      const header = Object.assign(document.createElement("h3"), {
        textContent: "📘 More Resources",
      });
      const wrapper = Object.assign(document.createElement("div"), {
        className: "resource-wrapper",
      });

      box.append(header, wrapper);
      v.local.lesson.body.append(box);
    }

    if (v.local.lesson.content.resources && typeof resources !== "undefined") {
      if (typeof resources.resources !== "undefined" && numBoxes === 1) {
        // we have a list of resources and will drop that in the first box
        const cards = resources.resources.map((r) => createResourceCard(r));

        const box = v.local.lesson.content.resources.boxes[0];

        const wrapper = box.querySelector(".resource-wrapper");

        // Clear existing content
        wrapper.innerHTML = "";

        // Add cards
        wrapper.append(...cards);
      } else if (typeof resources.groups !== "undefined") {
        // we have groups of resources to drop in each box
        v.local.lesson.content.resources.boxes.forEach((box) => {
          const cards = resources.groups[box.dataset.group].map((r) =>
            createResourceCard(r)
          );

          const wrapper = box.querySelector(".resource-wrapper");

          // Clear existing content
          wrapper.innerHTML = "";

          // Add cards
          if (resources.groups[box.dataset.group]) {
            wrapper.append(...cards);
          }
        });
      }
    }
  }
}

const getLoginSignupSelectors = () => ({
  googleBtn: document.querySelector("#google_login"),
  termsAndServices: document.querySelector("#access-message"),
  altMethod:
    document.querySelector(".sj-text-sign-in-with span") ||
    document.querySelector(".sj-text-sign-up-with span"),

  inputs: {
    password2: document.querySelector("#id_password2"), // signup specific
    email: document.querySelector("#id_email"), // signup specific
  },

  // login specific
  loginBtn: document.querySelector("#button-sign-in"),
  loginForm: document.querySelector("#login_form"),
  loginText: document.querySelector("#login-tab-left span span"),
  signupTabTextSpan: document.querySelector("#login-tab-right span"),

  // signup-specific
  loginTabTextSpan: document.querySelector("#login-tab-left a span"),
  signupForm: document.querySelector("#signup_form"),
  signupTabText:
    document.querySelector("#login-tab-right a") ||
    document.querySelector("#login-tab-right span"),
  passwordConfirm: document.querySelector(
    "label[for=id_password2] .input-label-text span"
  ),
  fNameLabel: document.querySelector('label[for="id_first_name"] span span'),
  lNameLabel: document.querySelector('label[for="id_last_name"] span span'),
  emailLabel: document.querySelector('label[for="id_email"]'),
  signupBtnText: document.querySelector("#button-sign-up span"),
});

function styleLogin() {
  log("Running styleLogin");

  v.local = getLoginSignupSelectors();

  v.local.loginText.textContent = "Log In";
  v.local.signupTabTextSpan.textContent = "Sign Up";
  v.local.altMethod.textContent = "Or Log In With";
  v.local.loginBtn.textContent = "Log In";
  v.local.googleBtn.textContent = "Continue with Google";

  // move elements
  v.local.loginForm.append(v.local.termsAndServices);
}

function styleSignup() {
  log("Running styleSignup");

  v.local = getLoginSignupSelectors();

  // set content
  v.local.loginTabTextSpan.textContent = "Log In";
  v.local.signupTabText.textContent = "Sign Up";
  v.local.altMethod.textContent = "Or Sign Up With";
  v.local.fNameLabel.textContent = "First Name";
  v.local.googleBtn.textContent = "Continue with Google";
  v.local.lNameLabel.textContent = "Last Name";
  v.local.signupBtnText.textContent = "Sign Up";
  v.local.passwordConfirm.textContent = "Password Confirm";
  v.local.emailLabel.textContent = "Work Email";
  v.local.inputs.email.placeholder = "Work Email";
  v.local.inputs.password2.placeholder = "Password Confirm";

  // move elements
  v.local.signupForm.append(v.local.termsAndServices);
}

function styleCurriculumPageNoCertificate() {
  log("Running styleCurriculumPageNoCertificate");

  v.local = {
    body: {
      mainContainer: document.querySelector("#cp-content"),
    },
    header: {
      mainHeadingContainer: document.querySelector(".cp-summary-wrapper"),
      floaterText: document.querySelector(".sj-floater-text"),
      mainHeading: document.querySelector(".break-word"),
      courseInfo: document.querySelector(".sj-heading-paragraph"),
      ctaBtnWrapper: document.querySelector("#resume-button"),
      ctaBtn: document.querySelector("#resume-button a"),
      ctaBtnText: document.querySelector("#resume-button a span"),
    },
    curriculum: {
      container: document.querySelector("#curriculum-list"),
    },
    tabs: {
      container: document.querySelector(".tabs"),
      curriculumSection:
        document.querySelector(".tabs section #curriculumSection") ||
        document.querySelector(".tabs section:nth-child(1)"),
      aboutSection:
        document.querySelector(".tabs section #aboutSection") ||
        document.querySelector(".tabs section:nth-child(2)"),
    },
    card: {
      details: document.querySelector(".course-details-card"),
      detailItems: document.querySelectorAll(".course-details-card li"),
      link: document.querySelector(".course-details-card-link"),
    },
  };

  v.local.tabs.aboutSection?.classList.add("active");

  // update resume button text and href (with auto-value fallback)
  if (v.local.header.ctaBtnWrapper && v.local.card.link) {
    const btnText = v.local.header.ctaBtnText.textContent || "Resume";
    const btnHref = v.local.header.ctaBtn.getAttribute("href") || "resume";

    v.local.card.link.textContent = btnText;
    v.local.card.link.href = btnHref;
  } else {
    log("Hiding resume button as it could not be found");
    if (course.completed) {
      v.local.card.link.textContent = "🎉 Completed";
      v.local.card.link.classList.add("completed");
      v.local.card.details.append(
        Object.assign(document.createElement("p"), {
          textContent: "Click on any lesson that you want to revisit.",
          className: "completed-subtext",
        })
      );
    } else {
      hide(v.local.card.link); // Hide resume button if it doesn't exist
    }
  }

  v.local.tabs.aboutSection.id = "aboutSection";
  v.local.tabs.curriculumSection.id = "curriculumSection";

  v.local.tabs.container.append(
    v.local.tabs.aboutSection,
    v.local.tabs.curriculumSection
  );

  // v.local.card.detailItems.forEach((li) => li.prepend(createClone("checkbox")));

  const curriculumElements = getCurriculumElements(
    v.local.curriculum.container
  );

  v.local.curriculum.container.innerHTML = ""; // Clear the container
  v.local.curriculum.container.append(...curriculumElements);

  v.local.header.courseInfo.textContent = skilljarCourse.short_description;

  // move elements
  v.local.body.mainContainer.append(...[v.local.card.details].filter(Boolean));
  v.local.header.mainHeadingContainer.append(
    ...[
      v.local.header.floaterText,
      v.local.header.mainHeading,
      v.local.header.courseInfo,
      v.local.header.ctaBtnWrapper,
    ].filter(Boolean)
  );
}

/**
 * This function applies desktop-specific styling to the curriculum page when a certificate is available.
 * It modifies the layout and appearance of various elements on the page.
 */
function styleCurriculumPageHasCertificationDesktop() {
  // TODO: Clean up this function
  log("Running styleCurriculumPageHasCertificationDesktop");
  const courseDescription = skilljarCourse.short_description;

  // HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(".cp-summary-wrapper"); // DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR
  const backToCatalogLink = document.querySelector(".back-to-catalog");

  hide(backToCatalogLink);

  const curriculumPageHeader = document.querySelector(".top-row-grey");
  const headerTextAndImgContainer = document.querySelector(".dp-row-flex-v2");
  const sjHeaderTextContainer = document.querySelector(".cp-summary-wrapper");
  const sjHeaderTextHeading = document.querySelector(".break-word");
  const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
  const sjHeaderTextProgressBar = document.querySelector(
    ".progress-bar.button-border-color"
  );
  const certificateEl = document.querySelector(".cp-certificate");
  const sjHeaderImgContainer = document.querySelector(
    ".large-4.pull-8.columns.cp-promo-image-wrapper"
  );
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");

  // BODY VARIABLES
  const bodyMainContainer = document.querySelector("#cp-content");
  const innerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");

  // STYLE LOGO
  v.global.logo.style.height = "24px";

  // TEST
  if (initialLoadComplete) {
    curriculumSection = v.global.curriculumSection;
    aboutSection = v.global.aboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.querySelector("#curriculum-list");
  const curriculumItemsListLIVE = new Array(
    ...curriculumParentContainer.childNodes
  );
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  // CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  // const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  // STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.marginTop = "96px";
  bodyMainContainer.style.gridTemplateColumns =
    "minmax(100px, 760px) minmax(100px, 368px)";

  bodyMainContainer.append(...(courseDetailsCard ? [courseDetailsCard] : []));

  courseDetailsCard.style.margin = "96px 0 46px 0";

  hide(courseDetailsCardLink);

  // if (!initialLoadComplete) {
  //   courseDetailCardListItems.forEach((li) =>
  //     li.prepend(createClone("checkbox"))
  //   );
  // }

  bodyMainContainer.style.columnGap = "24px";
  innerContentContainer.style.width = "100%";

  // STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  hide(sjHeaderTextSubheading);
  hide(sjHeaderTextProgressBar);

  // STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundImage =
    "linear-gradient(315deg, var(--gradient-start), var(--gradient-end) 72%)";
  curriculumPageHeader.style.border = "0";

  // STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  // TEXT CONTAINER
  sjHeaderTextContainer.style.position = "static";
  sjHeaderTextContainer.style.padding = "0";
  sjHeaderTextContainer.style.maxWidth = "564px";
  sjHeaderTextContainer.style.border = "0";
  sjHeaderTextContainer.style.textAlign = "left";
  // IMG CONTAINER
  sjHeaderImgContainer.style.position = "static";
  sjHeaderImgContainer.style.padding = "0";
  sjHeaderImgContainer.style.width = "564px";
  sjHeaderImgContainer.style.height = "auto";
  sjHeaderImgDirectContainer.style.maxHeight = "none";
  sjHeaderImg.style.maxHeight = "none";
  sjHeaderImg.style.height = "auto";
  sjHeaderImg.style.maxWidth = "100%";
  // PARENT CONTAINER
  headerTextAndImgContainer.style.margin = "96px 0";
  headerTextAndImgContainer.style.justifyContent = "center";
  headerTextAndImgContainer.style.flexWrap = "nowrap";
  headerTextAndImgContainer.style.gap = "24px";

  // RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.textContent = courseDescription;
  headingParagraph.style.display = "block";
  headingFloaterText.style.display = "block";
  container.append(
    ...(headingFloaterText ? [headingFloaterText] : []),
    ...(mainHeading ? [mainHeading] : []),
    ...(headingParagraph ? [headingParagraph] : []),
    ...(certificateEl ? [certificateEl] : [])
  );

  // CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = "0 0 46px 0";
  bodyMainContainer.style.paddingTop = "0";
  bodyMainContainer.style.paddingBottom = "0";
  aboutSection.classList.add("active");
  curriculumSection.style.marginTop = "48px";

  aboutSection.querySelector("h3").style.fontWeight = "600";
  hide(aboutSection.querySelector(".title"));
  aboutSection.querySelector(".content").style.border = "0";
  aboutSection.querySelector(".content").style.padding = "0";
  hide(curriculumSection.querySelector(".title"));
  curriculumSection.querySelector("h2").style.fontWeight = "600";
  curriculumSection.querySelector(".content").style.border = "0";
  curriculumSection.querySelector(".content").style.padding = "0";

  /*
  ------------------------------
  NEW CURRICULUM DISPLAY STYLING
  ------------------------------
  */
  if (!initialLoadComplete) {
    // Set global curriculum and about section vars
    v.global.curriculumSection = curriculumSection;
    v.global.aboutSection = aboutSection;

    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    curriculumItemsListLIVE.forEach((el) => {
      if (el?.tagName) {
        el.classList.add("curriculumItem");
      }
    });

    const curriculumItemsListNonLive =
      curriculumParentContainer.querySelectorAll(".curriculumItem");

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === "DIV") {
        // Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        // Reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement("div");
        newGroupHeading.style.display = "flex";
        newGroupHeading.style.gap = "12px";

        newGroupHeading.textContent =
          el.querySelector("h3")?.textContent?.trim() || "Module";

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        hide(el);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const isLastChild = curArr[i + 1]
          ? curArr[i + 1].tagName === "DIV"
          : true;

        const newListEl = document.createElement("div");
        styleListItem(newListEl, isLastChild, false);

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    hide(curriculumOutsideContainer.querySelector("h2"));
    hide(curriculumOutsideContainer.querySelector("hr"));
  }

  // CURRICULUM ITSELF STYLING
  hide(...pageIcons);

  lessonListItems.forEach((item) => {
    const titleEl = item.querySelector(".title");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "12px";

    item.querySelector(".bullet").style.position = "static";

    titleEl.style.position = "static";
    titleEl.style.color = "var(--answer-option)";
    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.margin = "0";
    titleEl.style.transform = "translateY(2px)";
  });
}

/**
 * This function applies mobile-specific styling to the curriculum page when a certificate is present.
 * It modifies the layout and appearance of various elements on the page.
 */
function styleCurriculumPageHasCertificationMobile() {
  // TODO: Clean up this function
  log("Running styleCurriculumPageHasCertificateMobile");

  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(".cp-summary-wrapper"); // DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR
  const backToCatalogLink = document.querySelector(".back-to-catalog");

  hide(backToCatalogLink);

  const curriculumPageHeader = document.querySelector(".top-row-grey");
  const headerTextAndImgContainer = document.querySelector(".dp-row-flex-v2");
  const sjHeaderTextContainer = document.querySelector(".cp-summary-wrapper");
  const sjHeaderTextHeading = document.querySelector(".break-word");
  const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
  const sjHeaderTextProgressBar = document.querySelector(
    ".progress-bar.button-border-color"
  );
  const certificateEl = document.querySelector(".cp-certificate");
  const sjHeaderImgContainer = document.querySelector(
    ".large-4.pull-8.columns.cp-promo-image-wrapper"
  );
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");

  // BODY VARIABLES
  const bodyMainContainer = document.querySelector("#cp-content");
  const innerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");

  // TEST
  if (initialLoadComplete) {
    curriculumSection = v.global.curriculumSection;
    aboutSection = v.global.aboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.querySelector("#curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  // CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  // const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  // NAV STYLING
  v.global.logo.style.maxHeight = "48px";

  // STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.gridTemplateColumns = "1fr";
  bodyMainContainer.style.width = "90%";
  bodyMainContainer.style.columnGap = "24px";

  courseDetailsCard.style.margin = "32px 0 56px 0";
  courseDetailsCard.style.justifySelf = "center";
  bodyMainContainer.append(courseDetailsCard);

  hide(courseDetailsCardLink);

  // if (!initialLoadComplete) {
  //   courseDetailCardListItems.forEach((li) =>
  //     li.prepend(createClone("checkbox"))
  //   );
  // }

  innerContentContainer.style.width = "100%";

  // STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  hide(sjHeaderTextSubheading);
  hide(sjHeaderTextProgressBar);

  // STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundImage =
    "linear-gradient(315deg, var(--gradient-start), var(--gradient-end) 72%)";
  curriculumPageHeader.style.border = "0";

  // STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  // TEXT CONTAINER
  sjHeaderTextContainer.style.position = "static";
  sjHeaderTextContainer.style.padding = "0";
  sjHeaderTextContainer.style.maxWidth = "none";
  sjHeaderTextContainer.style.width = "100%";
  sjHeaderTextContainer.style.marginBottom = "32px";
  sjHeaderTextContainer.style.border = "0";
  sjHeaderTextContainer.style.textAlign = "left";
  // IMG CONTAINER
  sjHeaderImgContainer.style.position = "static";
  sjHeaderImgContainer.style.padding = "0";
  sjHeaderImgContainer.style.width = "90%";
  sjHeaderImgContainer.style.maxWidth = "564px";
  sjHeaderImgContainer.style.height = "auto";
  sjHeaderImgDirectContainer.style.maxHeight = "none";
  sjHeaderImg.style.maxHeight = "none";
  sjHeaderImg.style.height = "auto";
  sjHeaderImg.style.maxWidth = "100%";
  // PARENT CONTAINER
  container.style.width = "90%";
  headerTextAndImgContainer.style.margin = "96px 0";
  headerTextAndImgContainer.style.justifyContent = "center";
  headerTextAndImgContainer.style.flexWrap = "wrap";
  headerTextAndImgContainer.style.gap = "24px";

  // RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.style.display = "block";
  headingFloaterText.style.display = "block";
  container.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    certificateEl
  );
  // CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = "96px 0 46px 0";
  bodyMainContainer.style.paddingTop = "0";
  bodyMainContainer.style.paddingBottom = "0";
  aboutSection.classList.add("active");
  curriculumSection.style.marginTop = "48px";

  aboutSection.querySelector("h3").style.fontWeight = "600";
  hide(aboutSection.querySelector(".title"));
  aboutSection.querySelector(".content").style.border = "0";
  aboutSection.querySelector(".content").style.padding = "0";
  hide(curriculumSection.querySelector(".title"));
  curriculumSection.querySelector("h2").style.fontWeight = "600";
  curriculumSection.querySelector(".content").style.border = "0";
  curriculumSection.querySelector(".content").style.padding = "0";

  /*
  ------------------------------
  NEW CURRICULUM DISPLAY STYLING
  ------------------------------
  */
  if (!initialLoadComplete) {
    // Set global curriculum and about section vars
    v.global.curriculumSection = curriculumSection;
    v.global.aboutSection = aboutSection;

    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer, "g");
    }

    curriculumItemsListLIVE.forEach((el) => {
      if (el?.tagName) {
        el.classList.add("curriculumItem");
      }
    });

    const curriculumItemsListNonLive =
      curriculumParentContainer.querySelectorAll(".curriculumItem");

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === "DIV") {
        // Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        // Reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement("div");
        newGroupHeading.style.display = "flex";
        newGroupHeading.style.gap = "12px";

        newGroupHeading.textContent =
          el.querySelector("h3")?.textContent?.trim() || "Module";

        styleGroupHeading(newGroupHeading, "c");

        curContainer.append(newGroupHeading);
        hide(el);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const isLastChild = curArr[i + 1]
          ? curArr[i + 1].tagName === "DIV"
          : true;

        const newListEl = document.createElement("div");
        styleListItem(newListEl, isLastChild, false, "g");

        // Styling for mobile
        el.querySelector(".title").style.textWrap = "wrap";

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    hide(curriculumOutsideContainer.querySelector("h2"));
    hide(curriculumOutsideContainer.querySelector("hr"));
  }

  // CURRICULUM ITSELF STYLING
  lessonListItems.forEach((item) => {
    const titleEl = item.querySelector(".title");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "12px";

    item.querySelector(".bullet").style.position = "static";

    titleEl.style.position = "static";
    titleEl.style.color = "var(--answer-option)";
    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.margin = "0";
    titleEl.style.transform = "translateY(2px)";
  });

  hide([...pageIcons]);
}

/**
 * This function handles the styling of the page based on the current page type.
 * It applies different styles for landing, login, signup, course details, curriculum pages,
 * lesson pages, catalog pages, and page details.
 *
 * It also checks for the presence of a certificate and applies styles accordingly.
 */
function handlePageStyling() {
  if (page.isLanding)
    // we are on the landing page (which is a catalog page)
    return styleLanding();

  if (page.isLogin)
    // we are on the login page
    return styleLogin();

  if (page.isSignup)
    // we are on the sign-up page
    return styleSignup();

  if (page.isCourseDetails)
    // we are on a course page but not logged in
    return styleCourseDetails();

  if (page.isCurriculum && !page.hasCertificate)
    // we are on a course page (without a certificate) and logged in
    return styleCurriculumPageNoCertificate();

  if (page.isPageDetail)
    // we are on the page that shows courses for a given learning path
    return stylePathCourseDetails();

  if (page.isPageCatalog)
    // we are on a learning path and registered for it
    return stylePathCatalogPage();

  if (page.isLesson)
    // we are on a lesson page
    return styleLesson();

  if (page.isCatalog)
    // we are on a catalog page (not currently in use)
    return styleCatalog();

  if (page.isCurriculum && page.hasCertificate)
    // we are on a course page (with a certificate) and logged in
    // n.b. this function is not edited and/or tested (and not in use)
    return v.viewport === "desktop"
      ? styleCurriculumPageHasCertificationDesktop()
      : styleCurriculumPageHasCertificationMobile();
}

/**
 * This function renders the course page based on the current view (desktop or mobile).
 * It checks the window width and applies appropriate styles for different page types.
 */
function render() {
  v.width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // set current view based on width
  v.viewport = v.width <= 991 ? "mobile" : "desktop";

  setStyle(v.global.footerContainer, {
    display: "flex",
    paddingLeft: v.viewport === "desktop" ? "40px" : "0",
    paddingRight: v.viewport === "desktop" ? "40px" : "0",
  });

  setStyle(v.global.footerCols, {
    width: v.viewport === "desktop" ? "270px" : "212px",
  });

  v.global.contentContainer.append(v.global.footerContainer);

  handlePageStyling();

  !page.isLesson ? hide(v.global.epFooter) : null;
}

/**
  This event is fired when the DOM is fully loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
  It is a good place to run scripts that need to manipulate the DOM or set up event listeners.
*/
document.addEventListener("DOMContentLoaded", () => {
  // hide all
  hide(v.global.body);

  // adding "cg-staging" for staging server
  isStaging ? v.global.body.classList.add("cg-staging") : null;

  // render + set initalLoadComplete
  render();
  initialLoadComplete = true;

  // show all
  setStyle(v.global.body, { display: undefined });
});

/* 
  This event is fired when the entire page is fully loaded, including all dependent resources such as stylesheets and images.
  It is a good place to run scripts that need to ensure all resources are available before executing.
*/
window.addEventListener("resize", () => {
  // no need to re-apply styles on resize for the following pages
  if (page.isLanding) return;
  if (page.isCourseDetails) return;
  if (page.isPageDetail) return;
  if (page.isLogin) return;
  if (page.isSignup) return;
  if (page.isCurriculum && !page.hasCertificate) return;
  if (page.isLesson) return;

  render();
});

// Make header white on scroll
if (!page.isLesson) {
  $(document).ready(function () {
    v.global.scroll_pos = 0;
    $(document).scroll(function () {
      v.global.scroll_pos = $(this).scrollTop();
      if (v.global.scroll_pos > 60) {
        setStyle(document.querySelector("header"), {
          backgroundColor: "white !important",
        });
      } else {
        setStyle(document.querySelector("header"), {
          backgroundColor: "transparent !important",
        });
      }
    });
  });
}
