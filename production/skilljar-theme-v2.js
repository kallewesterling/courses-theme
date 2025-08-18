const lessonView = {};
let currentView = "";
let isCatalogPage,
  isCurriculumPage,
  isCourseDetailsPage,
  isPageDetailPath,
  isPageCatalogPath,
  isLessonsPage,
  isLoginPage,
  isSignUpPage;
let initialLoadComplete = false;
let globalCurriculumSection, globalAboutSection;
let width;
let v = {
  logo: document.querySelector(".header-center-img"),
  footerContainer: document.querySelector("#footer-container"),
  footerCols: document.querySelectorAll(
    "#footer-container .global-footer-column"
  ),
};

function getCurriculumElements(curriculumParentContainer, border = "b") {
  let currentSection = 0,
    a;

  const content = Array.from(
    curriculumParentContainer.querySelectorAll(".curriculumItem")
  ).map((elem) => {
    const isHeader = elem.classList.contains("lesson-section");

    currentSection += isHeader ? 1 : 0;

    return [
      currentSection,
      isHeader,
      elem.textContent.replace("optional", "").trim(),
      elem.getAttribute("href") || null,
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
      style: `border-radius: 8px; margin-bottom: 48px; padding: 0; border: ${
        border === "b" ? "2px solid #3443F4" : "1px solid #DCDCDC"
      };`,
    });

    const header = Object.assign(document.createElement("div"), {
      class: "curriculum-header",
      style: `display: flex; align-items: center; padding: 24px; margin: 0; font-family: "Fusiona"; font-size: 16px; font-weight: 500; line-height: 125%; letter-spacing: "-.16px"; border-bottom: 2px solid #3443f4;`,
      textContent: section.heading,
    });

    const lessons = section.lessons.map((lesson, ix) => {
      const a = Object.assign(document.createElement("a"), {
        class: "curriculum-lesson lesson-row",
        style: `display: block; color: black; padding: 24px; font-size: 16px; font-weight: 400; line-height: 150%; border-bottom: ${
          ix !== section.lessons.length - 1
            ? border === "b"
              ? "2px solid #3443F4"
              : "1px solid #DCDCDC"
            : "none"
        };`,
        textContent: lesson,
        href: section.links[ix] || "#",
      });

      a.prepend(
        Object.assign(section.bullets[ix], {
          style: `display: inline-block; font-size: 1.5em; transform: translateY(3px); padding-right: 5px; color: #3443f4;`,
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
      let value = String(raw);
      let priority = "";
      if (/\s*!important\s*$/i.test(value)) {
        priority = "important";
        value = value.replace(/\s*!important\s*$/i, "");
      }
      if (value.trim())
        el.style.setProperty(toKebab(prop), value.trim(), priority);
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
  console.info("Running styleGroupContainer with setStyle");
  setStyle(container, {
    border: border === "b" ? "2px solid #3443F4" : "1px solid #DCDCDC",
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
  console.info("Running styleListItem with setStyle");
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
      ? "2px solid #3443F4"
      : "1px solid #DCDCDC",
  });
}

/**
 * This function styles the group heading container.
 * It sets padding, border bottom, and styles the actual group heading.
 * @param {HTMLElement} groupHeadingContainer - The group heading container to style.
 */
function styleGroupHeading(groupHeadingContainer, border = "b") {
  console.info("Running styleGroupHeading with setStyle");
  setStyle(groupHeadingContainer, {
    padding: "24px",
    margin: "0",
    fontFamily: "Fusiona",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "125%",
    letterSpacing: "-.16px",
    borderBottom: border === "b" ? "2px solid #3443f4" : "1px solid #DCDCDC",
  });
}

/**
 * This function checks the current page and sets the global variables accordingly.
 */
function getCurrentPage() {
  isCatalogPage = document.querySelector(
    ".sj-page-catalog.sj-page-catalog-root"
  )
    ? true
    : false;
  isCurriculumPage = document.querySelector(".sj-page-curriculum")
    ? true
    : false;
  isCourseDetailsPage = document.querySelector(
    ".sj-page-detail.sj-page-detail-course"
  )
    ? true
    : false;
  isLessonsPage = document.querySelector(".sj-page-lesson") ? true : false;
  isLoginPage = document.querySelector(".sj-page-login") ? true : false;
  isSignUpPage = document.querySelector(".sj-page-signup") ? true : false;

  // PATH PAGES
  isPageDetailPath = document.querySelector(
    ".sj-page-detail.sj-page-detail-bundle.sj-page-detail-path"
  )
    ? true
    : false;
  isPageCatalogPath = document.querySelector(
    ".sj-page-catalog.sj-page-series.sj-page-path"
  )
    ? true
    : false;
}

/**
 * This function inserts the footer into the page.
 */
function insertFooter() {
  const footerEl = document.querySelector("#footer-container");
  const contentContainer = isLessonsPage
    ? document.querySelector(".sj-page-lesson")
    : document.querySelector("#skilljar-content");

  setStyle(footerEl, { display: "flex" });

  if (isLessonsPage && currentView === "mobile") hide(footerEl);

  contentContainer.append(footerEl);
}

/**
 * This function applies desktop-specific styling to the catalog page.
 */
function desktopCatalogPageStyling() {
  console.info("Running desktopCatalogPageStyling with setStyle");
  const catalogBodyParentContainer = document.querySelector("#catalog-content");
  const catalogContainer = document.querySelector("#catalog-courses");

  if (!initialLoadComplete) {
    // Create a container div for courses catalog list
    const catalogContentContainer = document.createElement("div");

    // Create header for list
    const allCoursesHeader = document.createElement("h2");
    allCoursesHeader.textContent = "All Courses";

    // handle styling
    setStyle(allCoursesHeader, {
      fontSize: "48px",
      marginBottom: "38px",
    });

    setStyle(catalogContentContainer, {
      maxWidth: "min(1232px, 90%)",
      margin: "96px auto",
    });

    catalogContentContainer.append(allCoursesHeader, catalogContainer);
    catalogBodyParentContainer.append(catalogContentContainer);

    initialLoadComplete = true;
  }
}

/**
 * This function applies desktop-specific styling to the course details page.
 */
function desktopCourseDetailsPageStyling() {
  console.info(
    "Running desktopCourseDetailsPageStyling with setStyle [cleaned up]"
  );
  const headerContainer = document.querySelector(".top-row-grey");
  const headerFlexContainer = document.querySelector(".dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const registerBtnWrapper = document.querySelector(
    "#purchase-button-wrapper-large"
  );
  const registerBtn = registerBtnWrapper.querySelector("a");
  const mainHeadingContainer = document.querySelector(".dp-summary-wrapper");
  const backToCatalogBtn = document.querySelector(".back-to-catalog");
  const videoContainer = document.querySelector(".video-max");
  const mainInfoCardContained = document.querySelector(
    ".sj-course-info-wrapper"
  );
  const headingParagraph = mainInfoCardContained.querySelector("h2");

  // SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector(".signin");

  // BODY VARIABLES
  const bodyContainer = document.querySelector("#dp-details");
  const mobileBodyContent = document.querySelector(".show-for-small");
  const secondaryBodyContainer = document.querySelector(".hide-for-small");
  const bodyColumns = secondaryBodyContainer.querySelectorAll(".columns");
  const curriculumListContainer = document.querySelector(".dp-curriculum"); // NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  const curriculumListHeader = curriculumListContainer
    .closest(".sj-curriculum-wrapper")
    .querySelector("h3");
  const curriculumList = curriculumListContainer.querySelectorAll("li");

  // CARD VARIABLES
  const card = {
    details: document.querySelector(".course-details-card"),
    detailItems: document.querySelectorAll(".course-details-card li"),
    link: document.querySelector(".course-details-card-link"),
  };

  const checkboxIcon = document.querySelector(".checkbox-icon");

  const signInBtn = document.querySelector(
    ".header-link.login-link.sj-text-sign-in.focus-link-v2"
  );

  if (signInHeaderText) {
    setStyle(signInBtn, {
      backgroundColor: "transparent",
      padding: "8px 12px",
      marginRight: "24px",
      borderColor: "#3443F4",
      border: "2px solid #3443F4",
      borderRadius: "999px",
      fontSize: "14px",
      fontFamily: "Space Mono",
      fontWeight: "700",
      lineHeight: "20px",
    });
  }

  setStyle(headerContainer, {
    backgroundColor: "#D0CFEE",
    margin: "0",
    maxWidth: "none",
    paddingTop: "96px",
    paddingBottom: "96px",
    border: "0",
  });

  setStyle(headerFlexContainer, {
    flexDirection: "row-reverse",
    flexWrap: "nowrap",
    justifyContent: "start",
    gap: "24px",
    maxWidth: "1188px",
  });

  setStyle(mainHeadingContainer, {
    border: "0",
    maxWidth: "564px",
  });

  setStyle(headingFloaterText, {
    display: "block",
    marginBottom: "24px",
  });

  setStyle(mainHeading, {
    margin: "0 0 12px 0",
    fontSize: "36px",
    fontWeight: "600",
    lineHeight: "43.2px",
    letterSpacing: "-.02em",
  });

  setStyle(headingParagraph, {
    display: "block",
    margin: "0 0 24px 0",
  });

  setStyle(videoContainer, {
    maxWidth: "none",
  });

  setStyle(bodyContainer, {
    padding: "0",
    margin: "96px auto 46px auto",
    maxWidth: "min(1152px, 90%)",
    display: "grid",
    gridTemplateColumns: "minmax(100px, 760px) minmax(100px, 368px)",
    columnGap: "24px",
  });

  setStyle(secondaryBodyContainer, {
    padding: "0",
    maxWidth: "760px",
  });

  bodyColumns.forEach((column) => {
    setStyle(column, {
      float: "none",
      padding: "0",
      width: "100%",
      display: "block",
      marginBottom: column.classList.contains("large-7") ? "48px" : "0",
    });

    setStyle(column.querySelector("h3"), { fontWeight: "600" });

    setStyle(column.querySelector(".dp-curriculum"), { margin: "0" });
  });

  // COURSE DETAILS CURRICULUM STYLING
  if (!initialLoadComplete) {
    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumListContainer.querySelector(".section")
      ? true
      : false;
    let curContainer = document.createElement("li");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    const curriculumElements = getCurriculumElements(curriculumListContainer);

    curriculumListContainer.innerHTML = ""; // Clear the container
    curriculumListContainer.append(...curriculumElements);

  }
  //   curriculumList.forEach((curListItem, i, arr) => {
  //     // First check if current item contains 'section' class
  //     if (curListItem.classList.contains("section")) {
  //       // Yes? push curContainer into curriculumListContainer
  //       curriculumListContainer.append(curContainer);
  //       // Reset curContainer while pushing current 'section' in there for the next iteration
  //       curContainer = document.createElement("li");
  //       styleGroupContainer(curContainer);

  //       const newGroupHeading = document.createElement("div");

  //       newGroupHeading.innerHTML = curListItem.innerHTML;

  //       styleGroupHeading(newGroupHeading);

  //       curContainer.append(newGroupHeading);
  //     } else {
  //       // Else, normal/expected behaviour
  //       // Transfer inner html of current list item to new created div
  //       const newListItem = document.createElement("div");
  //       newListItem.innerHTML = curListItem.innerHTML;
  //       styleListItem(
  //         newListItem,
  //         arr[i + 1] ? arr[i + 1].classList.contains("section") : true
  //       );
  //       curContainer.append(newListItem);
  //     }
  //     hide(curListItem);
  //   });

  //   // LAST, unpushed SECTION; push it out to curriculumListContainer
  //   curriculumListContainer.append(curContainer);

  //   setStyle(curriculumListContainer, { padding: "0" });
  // }

  // COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  setStyle(card.details, {
    margin: "0 0 46px 0",
    justifySelf: "center",
  });

  if (!initialLoadComplete) {
    card.detailItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);

      setStyle(iconClone, {
        display: "block",
        flexShrink: "0",
      });

      li.prepend(iconClone);
    });
  }

  if (registerBtn && card.link) {
    const btnText = registerBtn.textContent || "Register";
    const btnHref = registerBtn.href || "#";
    card.link.textContent = btnText;
    card.link.setAttribute("href", btnHref);
  }

  // move elements
  if (card.details) {
    bodyContainer.append(card.details);
  }
  mainHeadingContainer.append(
    ...(headingFloaterText ? [headingFloaterText] : []),
    ...(mainHeading ? [mainHeading] : []),
    ...(headingParagraph ? [headingParagraph] : []),
    ...(registerBtnWrapper ? [registerBtnWrapper] : [])
  );

  // hide elements
  hide(mainInfoCardContained);
  hide(backToCatalogBtn);
  hide(mobileBodyContent);
  hide(signInHeaderText);
  hide(curriculumListHeader);
}

/**
 * This function applies desktop-specific styling to the path course details page.
 */
function desktopPathCourseDetailsPageStyling() {
  console.info("Running desktopPathCourseDetailsPageStyling with setStyle");
  const headerContainer = document.querySelector(".top-row-grey");
  const headerFlexContainer = document.querySelector(".dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const registerBtn = document.querySelector("#purchase-button-wrapper-large");
  const registerBtnAnchor = document.querySelector("#purchase-button");
  const mainHeadingContainer = document.querySelector(".dp-summary-wrapper");
  const backToCatalogBtn = document.querySelector(".back-to-catalog");
  const mainInfoCardContained = document.querySelector(
    ".sj-course-info-wrapper"
  );
  const headingParagraph = mainInfoCardContained.querySelector("h2");

  // SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector(".signin");
  const signInBtn = document.querySelector(
    ".header-link.login-link.sj-text-sign-in.focus-link-v2"
  );
  // BODY VARIABLES
  const bodyContainer = document.querySelector("#dp-details-bundle");
  const catalogContainer = document.querySelector("#catalog-courses");

  // set content
  headingFloaterText.textContent = "Learning Path";

  setStyle(signInBtn, {
    backgroundColor: "transparent",
    padding: "8px 12px",
    marginRight: "24px",
    borderColor: "#3443F4",
    border: "2px solid #3443F4",
    borderRadius: "999px",
    fontSize: "14px",
    fontFamily: "Space Mono",
    fontWeight: "700",
    lineHeight: "20px",
  });

  setStyle(headerContainer, {
    background:
      "url(https://images.ctfassets.net/l47ir7rfykkn/5zE7elBMFe1MmuhPIeWd9G/e09a10e4d4c081b9ca86a879b6984049/Main_BG.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    margin: "0",
    maxWidth: "none",
    paddingTop: "96px",
    paddingBottom: "96px",
    border: "0",
  });

  setStyle(headerFlexContainer, {
    flexDirection: "row-reverse",
    flexWrap: "nowrap",
    justifyContent: "start",
    gap: "24px",
    maxWidth: "1188px",
  });

  setStyle(mainHeadingContainer, {
    border: "0",
    maxWidth: "600px",
  });

  setStyle(headingFloaterText, {
    color: "#7AF0FE",
    display: "block",
    marginBottom: "24px",
  });

  setStyle(mainHeading, {
    color: "#fff",
    margin: "0 0 12px 0",
    fontSize: "36px",
    fontWeight: "600",
    lineHeight: "43.2px",
    letterSpacing: "-.02em",
  });

  setStyle(headingParagraph, {
    color: "#fff",
    display: "block",
    margin: "0 0 24px 0",
  });

  setStyle(registerBtnAnchor, {
    borderColor: "#7AF0FE",
    color: "#fff",
  });

  setStyle(bodyContainer, {
    padding: "0",
    margin: "96px auto 46px auto",
    maxWidth: "min(1152px, 90%)",
  });

  setStyle(catalogContainer, {
    marginBottom: "85px",
  });

  // move elements
  mainHeadingContainer.append(
    ...(headingFloaterText ? [headingFloaterText] : []),
    ...(mainHeading ? [mainHeading] : []),
    ...(headingParagraph ? [headingParagraph] : []),
    ...(registerBtn ? [registerBtn] : [])
  );

  // hide elements
  hide(backToCatalogBtn);
  hide(signInHeaderText);
  hide(mainInfoCardContained);
}

/**
 * This function applies desktop-specific styling to the path catalog page.
 */
function desktopPathCatalogPageStyling() {
  console.info("Running desktopPathCatalogPageStyling with setStyle");
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
      border: "2px solid #D0CFEE",
      borderRadius: "20px",
    });

    setStyle(innerContainer, { borderTop: "2px solid #D0CFEE" });

    course.addEventListener("mouseover", () => {
      setStyle(course, { borderColor: "#3443f4" });
      setStyle(innerContainer, { borderColor: "#3443f4" });
    });

    course.addEventListener("mouseout", () => {
      setStyle(course, { borderColor: "#D0CFEE" });
      setStyle(innerContainer, { borderColor: "#D0CFEE" });
    });
  });

  // MAIN CONTENT STYLING
  setStyle(mainContentContainer, { margin: "96px auto" });

  // hide elements
  hide(backArrowBtn);
  hide(topContentContainer);
}

/**
 * This function applies desktop-specific styling to the lesson page.
 */
function desktopLessonPageStyling() {
  console.info("Running desktopLessonPageStyling with setStyle [cleaned up]");

  const internalCourseWarning = document.querySelector(
    "#internal-course-warning"
  );

  const leftNav = document.querySelector("#lp-left-nav");
  const mainLessonContentContainer = document.querySelector("#lp-wrapper");
  const mainLessonContentSubContainer = document.querySelector("#lp-content");
  const mainLessonInnerContainer = document.querySelector("#lesson-body");
  const mainLessonMainContainer = document.querySelector("#lesson-main");

  const lessonFooter = document.querySelector("#lp-footer");
  const navOpenIcon = document.querySelector("#left-nav-button");
  const hamburgerIcon = navOpenIcon.querySelector(".fa.fa-bars");
  const xIcon = navOpenIcon.querySelector(".fa.fa-times");

  const fullScreenBtn = document.querySelector(".toggle-fullscreen");

  const lessonInnerContainer = document.querySelector("#lesson-main-inner");
  const copyIcon = document.querySelector(".copy-icon");
  const lessonContentContainer = document.querySelector(
    "sjwc-lesson-content-item"
  );
  const parentEl = document.querySelector(".sj-page-lesson");

  const openIcon = document.querySelector(".fa.fa-bars");
  const searchIcon = document.querySelector(".fa.fa-search");
  const closeIcon = document.querySelector(".fa.fa-times");
  const navText = document.querySelector(".burger-text.sj-text-lessons");

  const lessonNavLinksContainer = document.querySelector("#curriculum-list-2");
  const backToCurriculumEl = document.querySelector("#left-nav-return-text");
  const links = lessonNavLinksContainer.querySelectorAll("a");
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll(".section-title");

  lessonView.codeBlocks = new Array(
    ...document.querySelectorAll("pre:has(code):not(.language-ansi)")
  );

  const prevBtn = document.querySelector(".button-prev-title span");

  setStyle(v.logo, {
    height: "24px",
  });

  setStyle(lessonInnerContainer, {
    maxWidth: "712px",
    margin: "0 auto",
  });

  // STYLING TO ALIGN NAV ICON TO LEFT CORNER AND STICKY
  setStyle(mainLessonContentContainer, {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  });

  setStyle(mainLessonContentSubContainer, {
    height: "auto",
  });

  setStyle(mainLessonInnerContainer, {
    margin: "0",
    maxWidth: "none",
  });

  setStyle(mainLessonMainContainer, {
    position: "relative",
    zIndex: "0",
    paddingTop: "0",
  });

  setStyle(navOpenIcon, {
    position: "sticky",
    top: "12px",
    zIndex: "1",
    float: "none",
  });

  setStyle([hamburgerIcon, xIcon], {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, .8)",
    backdropFilter: "blur(1.5px)",
  });

  setStyle(lessonFooter, {
    position: "relative",
    border: "0",
    backgroundColor: "transparent",
  });

  setStyle(leftNav, {
    position: "absolute",
    backgroundColor: "#f9f9f9",
    width: "320px",
    marginBottom: "0px",
  });

  setStyle(mainLessonContentContainer, {
    height: "100vh",
    overflowY: "auto",
    paddingBottom: "0",
  });

  // move elements
  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);
  if (internalCourseWarning) {
    document.querySelector("#lesson-main").prepend(internalCourseWarning);
  }

  // hide elements
  hide(fullScreenBtn);
  hide(searchIcon);
  hide(navText);

  // HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains("cbp-spmenu-open")) {
    hide(openIcon);
  } else {
    hide(closeIcon);
  }

  // HANDLE CLICKS
  openIcon.addEventListener("click", (e) => {
    hide(e.target);
    setStyle(closeIcon, { display: "inline-block" });
  });

  closeIcon.addEventListener("click", (e) => {
    hide(e.target);
    setStyle(openIcon, { display: "inline-block" });
  });

  // STYLING OF THE LEFT NAV LINKS
  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  setStyle(lessonNavLinksContainer, { paddingBottom: "32px" });

  // STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon");
    const lessonLinkContainer = link.querySelector(".lesson-row");

    setStyle(link, {
      color: "#14003d",
      cursor: "pointer",
    });

    setStyle(lessonLinkContainer, {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      margin: "0 12px",
      paddingLeft: "12px",
      paddingRight: "12px",
      fontSize: "14px",
      lineHeight: "20px",
    });

    hide(pageIcon);
  });

  // STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  sectionTitles.forEach((title) => {
    setStyle(title, {
      backgroundColor: "transparent",
      padding: "12px",
      paddingLeft: "24px",
      paddingRight: "24px",
      marginTop: "12px",
      marginBottom: "12px",
      border: "0",
      fontFamily: "Fusiona",
      fontSize: "16px",
      fontWeight: "700",
    });
  });

  // HANDLE CODE BLOCK CUSTOM STYLING

  lessonView.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((el) => {
      const codeEl = el.querySelector("code");
      const iconClone = copyIcon.cloneNode(true);

      setStyle(el, {
        padding: "0",
        overflow: "visible",
        position: "relative",
      });

      setStyle(codeEl, {
        display: "inline-block",
        padding: "24px !important",
        overflowX: "scroll",
        width: "100%",
      });

      const copyText = codeEl.textContent
        .trim()
        .replace(/\r?\n\$ /g, " && ")
        .replace(/^\$ /g, "");

      const container = document.createElement("div");

      setStyle(container, {
        display: "flex",
        justifyContent: "end",
        borderBottom: "1px solid gainsboro",
        padding: "12px 24px",
      });

      setStyle(iconClone, {
        display: "block",
        cursor: "pointer",
      });

      // CREATE 'COPIED' TOOLTIP
      const tooltipContainer = document.createElement("div");
      tooltipContainer.textContent = "Copied";

      setStyle(tooltipContainer, {
        position: "absolute",
        top: "-24px",
        right: "10px",
        textShadow: "none",
        backgroundColor: "#1c1c1c",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "4px",
        opacity: "0",
        transition: "opacity .2s ease-in",
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

      el.dataset.copyAdded = "true"; // Mark that copy icon was added to this code block
    });

  // Makes lesson links pop up in new tab
  lessonContentContainer
    .querySelectorAll("a")
    .forEach((el) => (el.target = "_blank"));

  setStyle(prevBtn, {
    color: "#14003d",
  });

  setStyle(v.footerContainer, {
    paddingLeft: "40px",
    paddingRight: "40px",
  });

  v.footerCols.forEach((col) => {
    setStyle(col, { width: "270px" });
  });
}

/**
 * This function applies desktop-specific styling to the login page.
 */
function desktopLoginPageStyling() {
  console.info("Running desktopLoginPageStyling with setStyle");

  v.loginSignup = {
    fbBtn: document.querySelector("#facebook_login"),
    googleBtn: document.querySelector("#google_login"),
    tabArrow:
      document.querySelector("#tab-marker-login") ||
      document.querySelector("#tab-marker-signup"),
    loginContent: document.querySelector("#login-content"),
    loginContentContainer: document.querySelector(".large-6.columns"),
    termsAndServices: document.querySelector("#access-message"),
    tabContainer: document.querySelector(".large-12.columns"),
    altMethod:
      document.querySelector(".sj-text-sign-in-with span") ||
      document.querySelector(".sj-text-sign-up-with span"),
    altMethodContainer: document.querySelector(".socialaccount_providers li"),
    altMethodCol: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers)"
    ),
    altMethodUl: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers) ul"
    ),
    altMethodLi: document.querySelectorAll(
      ".large-6.columns:has(.socialaccount_providers) li"
    ),

    inputs: {
      login: document.querySelector("#id_login"), // login
      password: document.querySelector("#id_password"), // login
      password1: document.querySelector("#id_password1"), // signup
      password2: document.querySelector("#id_password2"), // signup
      email: document.querySelector("#id_email"), // signup
    },

    loginTab: document.querySelector("#login-tab-left"),
    signupTab: document.querySelector("#login-tab-right"),

    // login specific
    forgotPassword: document.querySelector(".sj-text-forgot-password"),
    loginBtn: document.querySelector("#button-sign-in"),
    loginForm: document.querySelector("#login_form"),
    loginNote: document.querySelector(".loginNote.sj-text-login-note"),
    loginTabText: document.querySelector("#login-tab-left a"),
    loginTabTextSpan: document.querySelector("#login-tab-left a span"),
    loginText: document.querySelector("#login-tab-left span span"),
    loginForgetWrapper: document.querySelector(
      ".large-12.columns:has(#button-sign-in)"
    ),

    // signup-specific
    allInputs: document.querySelectorAll("input"),
    allLabels: document.querySelectorAll("label"),
    signupForm: document.querySelector("#signup_form"),
    signupTabText:
      document.querySelector("#login-tab-right a") ||
      document.querySelector("#login-tab-right span"),
    signupTabSpan: document.querySelector("#login-tab-right span"),
    passwordConfirm: document.querySelector(
      "label[for=id_password2] .input-label-text span"
    ),
    loginLabel: document.querySelector('label[for="id_email"]'),
    fNameLabel: document.querySelector('label[for="id_first_name"] span span'),
    lNameLabel: document.querySelector('label[for="id_last_name"] span span'),
    emailLabel: document.querySelector('label[for="id_email"]'),
    signupBtn: document.querySelector("#button-sign-up"),
    signupBtnText: document.querySelector("#button-sign-up span"),
    signupBtnWrapper: document.querySelector("#signup_form .text-center"),
  };

  // set content
  v.loginSignup.loginText.textContent = "Log In";
  v.loginSignup.signupTabSpan.textContent = "Sign Up";
  v.loginSignup.altMethod.textContent = "Or Log In With";
  v.loginSignup.loginBtn.textContent = "Log In";
  v.loginSignup.googleBtn.textContent = "Continue with Google";

  setStyle(v.logo, { height: "24px" });

  setStyle(v.loginSignup.termsAndServices, {
    maxWidth: "368px",
    fontSize: "14px",
  });

  setStyle(v.loginSignup.tabContainer, { display: "flex" });

  setStyle([v.loginSignup.loginTab, v.loginSignup.signupTab], {
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
  });

  setStyle(v.loginSignup.loginTab, {
    border: "0",
    textDecoration: "underline",
    fontFamily: "Space Mono",
    color: "#3443f4",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
  });

  setStyle(v.loginSignup.signupTabText, {
    color: "rgba(52, 67, 244, .4)",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
  });

  setStyle([v.loginSignup.loginContentContainer, v.loginSignup.altMethodCol], {
    width: "50%",
  });

  setStyle(v.loginSignup.altMethodUl, {
    paddingLeft: "125px",
  });

  setStyle(v.loginSignup.altMethodLi, { padding: "0" });

  setStyle(v.loginSignup.altMethodContainer, { paddingBottom: "0" });

  setStyle([v.loginSignup.inputs.login, v.loginSignup.inputs.password], {
    borderRadius: "4px",
    border: "2px solid #3443f4",
    padding: "20px 15px",
    fontSize: "14px",
    lineHeight: "24px",
  });

  setStyle([v.loginSignup.loginBtn, v.loginSignup.forgotPassword], {
    fontSize: "16px",
    fontFamily: "Space Mono",
    marginBottom: "2px",
  });

  setStyle(v.loginSignup.loginBtn, {
    color: "#14003d",
    width: "368px",
    height: "48px",
    backgroundColor: "transparent",
    border: "2px solid #3443f4",
    borderRadius: "999px",
  });

  setStyle(v.loginSignup.loginForgetWrapper, { marginBottom: "24px" });

  setStyle(v.loginSignup.googleBtn, {
    background: "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)",
    width: "auto",
    textAlign: "center",
  });

  setStyle(v.loginSignup.loginContent, { border: "0" });

  setStyle(v.footerContainer, {
    paddingLeft: "40px",
    paddingRight: "40px",
  });

  setStyle(v.footerCols, { width: "270px" });

  // move elements
  v.loginSignup.loginForm.append(v.loginSignup.termsAndServices);

  // hide elements
  hide([v.loginSignup.tabArrow, v.loginSignup.fbBtn, v.loginSignup.loginNote]);
}

/**
 * This function applies desktop-specific styling to the sign-up page.
 */
function desktopSignUpPageStyling() {
  console.info("Running desktopSignUpPageStyling with setStyle");

  v.loginSignup = {
    fbBtn: document.querySelector("#facebook_login"),
    googleBtn: document.querySelector("#google_login"),
    tabArrow:
      document.querySelector("#tab-marker-login") ||
      document.querySelector("#tab-marker-signup"),
    loginContent: document.querySelector("#login-content"),
    loginContentContainer: document.querySelector(".large-6.columns"),
    termsAndServices: document.querySelector("#access-message"),
    tabContainer: document.querySelector(".large-12.columns"),
    altMethod:
      document.querySelector(".sj-text-sign-in-with span") ||
      document.querySelector(".sj-text-sign-up-with span"),
    altMethodContainer: document.querySelector(".socialaccount_providers li"),
    altMethodCol: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers)"
    ),
    altMethodUl: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers) ul"
    ),
    altMethodLi: document.querySelectorAll(
      ".large-6.columns:has(.socialaccount_providers) li"
    ),

    inputs: {
      login: document.querySelector("#id_login"), // login
      password: document.querySelector("#id_password"), // login
      password1: document.querySelector("#id_password1"), // signup
      password2: document.querySelector("#id_password2"), // signup
      email: document.querySelector("#id_email"), // signup
    },

    loginTab: document.querySelector("#login-tab-left"),
    signupTab: document.querySelector("#login-tab-right"),

    // login specific
    forgotPassword: document.querySelector(".sj-text-forgot-password"),
    loginBtn: document.querySelector("#button-sign-in"),
    loginForm: document.querySelector("#login_form"),
    loginNote: document.querySelector(".loginNote.sj-text-login-note"),
    loginTabText: document.querySelector("#login-tab-left a"),
    loginTabTextSpan: document.querySelector("#login-tab-left a span"),
    loginText: document.querySelector("#login-tab-left span span"),
    loginForgetWrapper: document.querySelector(
      ".large-12.columns:has(#button-sign-in)"
    ),

    // signup-specific
    allInputs: document.querySelectorAll("input"),
    allLabels: document.querySelectorAll("label"),
    signupForm: document.querySelector("#signup_form"),
    signupTabText:
      document.querySelector("#login-tab-right a") ||
      document.querySelector("#login-tab-right span"),
    signupTabSpan: document.querySelector("#login-tab-right span"),
    passwordConfirm: document.querySelector(
      "label[for=id_password2] .input-label-text span"
    ),
    loginLabel: document.querySelector('label[for="id_email"]'),
    fNameLabel: document.querySelector('label[for="id_first_name"] span span'),
    lNameLabel: document.querySelector('label[for="id_last_name"] span span'),
    emailLabel: document.querySelector('label[for="id_email"]'),
    signupBtn: document.querySelector("#button-sign-up"),
    signupBtnText: document.querySelector("#button-sign-up span"),
    signupBtnWrapper: document.querySelector("#signup_form .text-center"),
  };

  // set content
  v.loginSignup.loginTabTextSpan.textContent = "Log In";
  v.loginSignup.signupBtnText.textContent = "Sign Up";
  v.loginSignup.altMethod.textContent = "Or Sign Up With";
  v.loginSignup.googleBtn.textContent = "Continue with Google";
  v.loginSignup.signupTabText.textContent = "Sign Up";
  v.loginSignup.fNameLabel.textContent = "First Name";
  v.loginSignup.lNameLabel.textContent = "Last Name";
  v.loginSignup.emailLabel.textContent = "Work Email";
  v.loginSignup.passwordConfirm.textContent = "Password Confirm";
  v.loginSignup.inputs.email.placeholder = "Work Email";
  v.loginSignup.inputs.password2.placeholder = "Password Confirm";

  setStyle(v.loginSignup.termsAndServices, {
    maxWidth: "368px",
    color: "#545454",
    fontSize: "14px",
    transform: "translateX(-13px)",
  });

  setStyle(v.logo, { height: "24px" });

  setStyle(v.loginSignup.tabContainer, { display: "flex" });

  setStyle(v.loginSignup.loginTab, {
    border: "0",
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
    borderRadius: "100px",
  });

  setStyle(v.loginSignup.loginTabText, {
    color: "rgba(52, 67, 244, .4)",
    fontWeight: "700",
    fontSize: "18px",
    fontFamily: "Space Mono",
    lineHeight: "24px",
  });

  setStyle(v.loginSignup.signupTab, {
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
    borderRadius: "100px",
  });

  setStyle(v.loginSignup.signupTabText, {
    color: "#3443f4",
    textDecoration: "underline",
    fontFamily: "Space Mono",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
  });

  setStyle([v.loginSignup.loginContentContainer, v.loginSignup.altMethodCol], {
    width: "50%",
  });

  setStyle(v.loginSignup.altMethodCol, { paddingLeft: "100px" });

  setStyle(v.loginSignup.altMethodUl, { paddingLeft: "25px" });

  setStyle(v.loginSignup.altMethodLi, { padding: "0" });

  setStyle(v.loginSignup.altMethodContainer, { paddingBottom: "0" });

  setStyle(v.loginSignup.altMethod, {
    marginBottom: "12px",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "20px",
  });

  setStyle([v.loginSignup.inputs.login, v.loginSignup.inputs.password1], {
    borderRadius: "4px",
    borderColor: "#DCDCDC",
    padding: "12px",
    lineHeight: "24px",
  });

  setStyle(v.loginSignup.inputs.password2, { marginBottom: "24px" });

  setStyle(v.loginSignup.signupBtn, {
    width: "368px",
    height: "48px",
    fontSize: "16px",
    fontFamily: "Space Mono",
    color: "#14003d",
    backgroundColor: "transparent",
    border: "2px solid #3443f4",
    borderRadius: "999px",
  });

  setStyle(v.loginSignup.signupBtnWrapper, { textAlign: "left !important" });

  setStyle(v.loginSignup.googleBtn, {
    background: "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)",
    width: "auto",
    textAlign: "center",
  });

  setStyle(v.loginSignup.loginContent, { border: "0" });

  setStyle(v.loginSignup.allLabels, {
    marginBottom: "12px",
    fontWeight: "500",
    fontSize: "16px",
    fontFamily: "Fusiona",
    lineHeight: "20px",
  });

  setStyle(v.loginSignup.allInputs, {
    borderRadius: "4px",
    border: "2px solid #3443f4",
    padding: "20px 15px",
    lineHeight: "24px",
  });

  setStyle(v.footerContainer, {
    paddingLeft: "40px",
    paddingRight: "40px",
  });

  setStyle(v.footerCols, { width: "270px" });

  // move elements
  v.loginSignup.signupForm.append(v.loginSignup.termsAndServices);

  // hide elements
  hide([v.loginSignup.fbBtn, v.loginSignup.tabArrow]);
}

/**
 * This function applies desktop-specific styling to the curriculum page when no certificate is available.
 * It modifies the layout and appearance of various elements on the page.
 */
function desktopCurriculumPageNoCertificateStyling() {
  console.info(
    "Running desktopCurriculumPageNoCertificateStyling with setStyle [cleaned up]"
  );
  const courseDescription = skilljarCourse.short_description; // eslint-disable-line no-undef

  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(".cp-summary-wrapper");
  const mainHeading = document.querySelector(".break-word");
  const backToCatalogLink = document.querySelector(".back-to-catalog");

  const curriculumPageHeader = document.querySelector(".top-row-grey");
  const headerTextAndImgContainer = document.querySelector(".dp-row-flex-v2");
  const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
  const sjHeaderTextProgressBar = document.querySelector(".progress-bar");
  const sjHeaderImgContainer = document.querySelector(
    ".cp-promo-image-wrapper"
  );
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = sjHeaderImgDirectContainer.querySelector("img");
  const resumeBtn = document.querySelector("#resume-button");

  const bodyMainContainer = document.querySelector("#cp-content");
  const innerContentContainer = bodyMainContainer.querySelector(".columns");

  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");
  const aboutHeader = aboutSection.querySelector("h3");
  const curriculumHeader = curriculumSection.querySelector("h2");
  const aboutContent = aboutSection.querySelector(".content");
  const curriculumContent = curriculumSection.querySelector(".content");

  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const lessonListTitles = document.querySelectorAll(".lesson-row .title");
  const lessonListBullets = document.querySelectorAll(".lesson-row .bullet");
  const curriculumParentContainer = document.querySelector("#curriculum-list");
  const curriculumItemsListLIVE = new Array(
    ...curriculumParentContainer.childNodes
  );

  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");
  const checkboxIcon = document.querySelector(".checkbox-icon");

  const card = {
    details: document.querySelector(".course-details-card"),
    detailItems: document.querySelectorAll(".course-details-card li"),
    link: document.querySelector(".course-details-card-link"),
  };

  // TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  bodyMainContainer.append(...(card.details ? [card.details] : []));

  // update resume button text and href (with auto-value fallback)
  if (resumeBtn && card.link) {
    const btnText =
      resumeBtn.querySelector(".button span")?.textContent || "Resume";
    const btnHref =
      resumeBtn.querySelector(".button").getAttribute("href") || "resume";

    card.link.textContent = btnText;
    card.link.href = btnHref;
  }

  if (!initialLoadComplete) {
    card.detailItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);

      setStyle(iconClone, { display: "block", flexShrink: "0" });

      li.prepend(iconClone);
    });
  }

  // content
  headingParagraph.textContent = courseDescription;

  // update about section to be active
  aboutSection?.classList.add("active");

  setStyle(v.logo, { height: "24px" });

  setStyle(bodyMainContainer, {
    display: "grid",
    marginTop: "96px",
    gridTemplateColumns: "minmax(100px, 760px) minmax(100px, 368px)",
    columnGap: "24px",
    paddingTop: "0",
    paddingBottom: "0",
  });

  setStyle(innerContentContainer, { width: "100%" });

  setStyle(card.details, { margin: "96px 0 46px 0" });

  setStyle(mainHeading, {
    fontWeight: "600",
    fontSize: "36px",
    lineHeight: "43.2px",
    letterSpacing: "-0.5px",
    marginTop: "0",
  });

  setStyle(curriculumPageHeader, {
    maxWidth: "none",
    padding: "0",
    backgroundColor: "#D0CFEE",
    border: "0",
  });

  setStyle(container, {
    position: "static",
    padding: "0",
    maxWidth: "564px",
    border: "0",
    textAlign: "left",
  });

  setStyle(resumeBtn, { marginLeft: "0", marginRight: "0" });

  setStyle(sjHeaderImgContainer, {
    position: "static",
    padding: "0",
    width: "564px",
    height: "auto",
  });

  setStyle(sjHeaderImgDirectContainer, { maxHeight: "none" });

  setStyle(sjHeaderImg, {
    maxHeight: "none",
    height: "auto",
    maxWidth: "100%",
  });

  setStyle(headerTextAndImgContainer, {
    margin: "96px 0",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: "24px",
  });

  setStyle([headingParagraph, headingFloaterText], { display: "block" });

  setStyle(tabsContainer, { margin: "0 0 46px 0" });

  setStyle(curriculumSection, { marginTop: "48px" });

  setStyle([aboutHeader, curriculumHeader], { fontWeight: "600" });

  setStyle([aboutContent, curriculumContent], { border: "0", padding: "0" });

  if (!initialLoadComplete) {
    // Add vars to global
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;

    curriculumItemsListLIVE
      .filter((el) => el?.tagName)
      .forEach((el) => el.classList.add("curriculumItem"));

    // Create a starting container
    let currentContainer = document.createElement("div");
    if (!hasSections) {
      styleGroupContainer(currentContainer);
    }

    const curriculumElements = getCurriculumElements(curriculumParentContainer);

    curriculumParentContainer.innerHTML = ""; // Clear the container
    curriculumParentContainer.append(...curriculumElements);
  }

  // CURRICULUM ITSELF STYLING
  setStyle(lessonListItems, {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  });

  setStyle(lessonListTitles, {
    position: "static",
    color: "#1C1C1C",
    display: "flex",
    alignItems: "center",
    margin: "0",
    transform: "translateY(2px)",
  });

  setStyle(lessonListBullets, { position: "static" });

  setStyle(
    [
      aboutSection,
      curriculumSection,
      globalAboutSection,
      globalCurriculumSection,
    ],
    { padding: "0 !important" }
  );

  setStyle([curriculumSection, globalCurriculumSection], {
    marginTop: "48px !important",
  });

  // hide elements
  hide([
    ...pageIcons,
    backToCatalogLink,
    sjHeaderTextSubheading,
    sjHeaderTextProgressBar,
    curriculumOutsideContainer.querySelector("h2"),
    curriculumOutsideContainer.querySelector("hr"),
    aboutSection.querySelector(".title"),
    curriculumSection.querySelector(".title"),
    !resumeBtn ? card.link : null, // Hide resume button if it doesn't exist
  ]);

  // move elements
  container.append(
    ...(headingFloaterText ? [headingFloaterText] : []),
    ...(mainHeading ? [mainHeading] : []),
    ...(headingParagraph ? [headingParagraph] : []),
    ...(resumeBtn ? [resumeBtn] : [])
  );
  tabsContainer.append(curriculumSection);
}

/**
 * This function applies desktop-specific styling to the curriculum page when a certificate is available.
 * It modifies the layout and appearance of various elements on the page.
 */
function desktopCurriculumPageYesCertificationStyling() {
  // TODO: Clean up this function
  console.info("Running desktopCurriculumPageYesCertificationStyling");
  const courseDescription = skilljarCourse.short_description; // eslint-disable-line no-undef

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
  v.logo.style.height = "24px";

  // TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
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
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
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

  if (!initialLoadComplete) {
    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      iconClone.style.display = "block";
      iconClone.style.flexShrink = "0";
      li.prepend(iconClone);
    });
  }

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
    "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
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
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

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
    titleEl.style.color = "#1C1C1C";
    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.margin = "0";
    titleEl.style.transform = "translateY(2px)";
  });
}

/**
 * This function applies mobile-specific styling to the login page.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileLoginPageStyling() {
  console.info("Running mobileLoginPageStyling with setStyle [cleaned up]");

  v.loginSignup = {
    fbBtn: document.querySelector("#facebook_login"),
    googleBtn: document.querySelector("#google_login"),
    tabArrow:
      document.querySelector("#tab-marker-login") ||
      document.querySelector("#tab-marker-signup"),
    loginContent: document.querySelector("#login-content"),
    loginContentContainer: document.querySelector(".large-6.columns"),
    termsAndServices: document.querySelector("#access-message"),
    tabContainer: document.querySelector(".large-12.columns"),
    altMethod:
      document.querySelector(".sj-text-sign-in-with span") ||
      document.querySelector(".sj-text-sign-up-with span"),
    altMethodContainer: document.querySelector(".socialaccount_providers li"),
    altMethodCol: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers)"
    ),
    altMethodUl: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers) ul"
    ),
    altMethodLi: document.querySelectorAll(
      ".large-6.columns:has(.socialaccount_providers) li"
    ),

    inputs: {
      login: document.querySelector("#id_login"), // login
      password: document.querySelector("#id_password"), // login
      password1: document.querySelector("#id_password1"), // signup
      password2: document.querySelector("#id_password2"), // signup
      email: document.querySelector("#id_email"), // signup
    },

    loginTab: document.querySelector("#login-tab-left"),
    signupTab: document.querySelector("#login-tab-right"),

    // login specific
    forgotPassword: document.querySelector(".sj-text-forgot-password"),
    loginBtn: document.querySelector("#button-sign-in"),
    loginForm: document.querySelector("#login_form"),
    loginNote: document.querySelector(".loginNote.sj-text-login-note"),
    loginTabText: document.querySelector("#login-tab-left a"),
    loginTabTextSpan: document.querySelector("#login-tab-left a span"),
    loginText: document.querySelector("#login-tab-left span span"),
    loginForgetWrapper: document.querySelector(
      ".large-12.columns:has(#button-sign-in)"
    ),

    // signup-specific
    allInputs: document.querySelectorAll("input"),
    allLabels: document.querySelectorAll("label"),
    signupForm: document.querySelector("#signup_form"),
    signupTabText:
      document.querySelector("#login-tab-right a") ||
      document.querySelector("#login-tab-right span"),
    signupTabSpan: document.querySelector("#login-tab-right span"),
    passwordConfirm: document.querySelector(
      "label[for=id_password2] .input-label-text span"
    ),
    loginLabel: document.querySelector('label[for="id_email"]'),
    fNameLabel: document.querySelector('label[for="id_first_name"] span span'),
    lNameLabel: document.querySelector('label[for="id_last_name"] span span'),
    emailLabel: document.querySelector('label[for="id_email"]'),
    signupBtn: document.querySelector("#button-sign-up"),
    signupBtnText: document.querySelector("#button-sign-up span"),
    signupBtnWrapper: document.querySelector("#signup_form .text-center"),
  };

  // set content
  v.loginSignup.loginText.textContent = "Log In";
  v.loginSignup.signupTabSpan.textContent = "Sign Up";
  v.loginSignup.altMethod.textContent = "Or Log In With";
  v.loginSignup.loginBtn.textContent = "Log In";
  v.loginSignup.googleBtn.textContent = "Continue with Google";

  setStyle(v.logo, { maxHeight: "48px" });

  setStyle(v.loginSignup.termsAndServices, {
    maxWidth: "368px",
    color: "#545454",
    fontSize: "14px",
  });

  setStyle(v.loginSignup.tabContainer, { display: "flex" });

  setStyle(v.loginSignup.loginTab, {
    border: "0",
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
    backgroundColor: "#3443F4",
    color: "#fff",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
    borderRadius: "100px",
  });

  setStyle(v.loginSignup.signupTab, {
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
  });

  setStyle(v.loginSignup.signupTabText, {
    color: "#8C8C8C",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
  });

  setStyle([v.loginSignup.loginContentContainer, v.loginSignup.altMethodCol], {
    width: "100%",
  });

  setStyle(v.loginSignup.altMethodUl, { padding: "0" });

  setStyle(v.loginSignup.altMethodContainer, { paddingBottom: "0" });

  setStyle([v.loginSignup.inputs.login, v.loginSignup.inputs.password], {
    borderRadius: "4px",
    borderColor: "#DCDCDC",
    padding: "12px",
    lineHeight: "24px",
  });

  setStyle(v.loginSignup.inputs.password, { marginBottom: "24px" });

  setStyle(v.loginSignup.loginBtn, {
    width: "100%",
    height: "48px",
    fontSize: "16px",
    marginBottom: "12px",
  });

  setStyle(v.loginSignup.forgotPassword, {
    fontSize: "16px",
    marginBottom: "2px",
  });

  setStyle(v.loginSignup.loginForgetWrapper, { marginBottom: "24px" });

  setStyle(v.loginSignup.googleBtn, {
    backgroundColor: "#3443F4",
    width: "100%",
    textAlign: "center",
  });

  setStyle(v.loginSignup.loginContent, {
    border: "0",
  });

  setStyle(v.footerContainer, {
    paddingLeft: "0",
    paddingRight: "0",
  });

  setStyle(v.footerCols, { width: "212px" });

  // move elements
  v.loginSignup.loginForm.append(v.loginSignup.termsAndServices);

  // hide elements
  hide([v.loginSignup.fbBtn, v.loginSignup.tabArrow, v.loginSignup.loginNote]);
}

/**
 * This function applies mobile-specific styling to the sign-up page.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileSignUpPageStyling() {
  console.info("Running mobileSignUpPageStyling with setStyle");

  v.loginSignup = {
    fbBtn: document.querySelector("#facebook_login"),
    googleBtn: document.querySelector("#google_login"),
    tabArrow:
      document.querySelector("#tab-marker-login") ||
      document.querySelector("#tab-marker-signup"),
    loginContent: document.querySelector("#login-content"),
    loginContentContainer: document.querySelector(".large-6.columns"),
    termsAndServices: document.querySelector("#access-message"),
    tabContainer: document.querySelector(".large-12.columns"),
    altMethod:
      document.querySelector(".sj-text-sign-in-with span") ||
      document.querySelector(".sj-text-sign-up-with span"),
    altMethodContainer: document.querySelector(".socialaccount_providers li"),
    altMethodCol: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers)"
    ),
    altMethodUl: document.querySelector(
      ".large-6.columns:has(.socialaccount_providers) ul"
    ),
    altMethodLi: document.querySelectorAll(
      ".large-6.columns:has(.socialaccount_providers) li"
    ),

    inputs: {
      login: document.querySelector("#id_login"), // login
      password: document.querySelector("#id_password"), // login
      password1: document.querySelector("#id_password1"), // signup
      password2: document.querySelector("#id_password2"), // signup
      email: document.querySelector("#id_email"), // signup
    },

    loginTab: document.querySelector("#login-tab-left"),
    signupTab: document.querySelector("#login-tab-right"),

    // login specific
    forgotPassword: document.querySelector(".sj-text-forgot-password"),
    loginBtn: document.querySelector("#button-sign-in"),
    loginForm: document.querySelector("#login_form"),
    loginNote: document.querySelector(".loginNote.sj-text-login-note"),
    loginTabText: document.querySelector("#login-tab-left a"),
    loginTabTextSpan: document.querySelector("#login-tab-left a span"),
    loginText: document.querySelector("#login-tab-left span span"),
    loginForgetWrapper: document.querySelector(
      ".large-12.columns:has(#button-sign-in)"
    ),

    // signup-specific
    allInputs: document.querySelectorAll("input"),
    allLabels: document.querySelectorAll("label"),
    signupForm: document.querySelector("#signup_form"),
    signupTabText:
      document.querySelector("#login-tab-right a") ||
      document.querySelector("#login-tab-right span"),
    signupTabSpan: document.querySelector("#login-tab-right span"),
    passwordConfirm: document.querySelector(
      "label[for=id_password2] .input-label-text span"
    ),
    loginLabel: document.querySelector('label[for="id_email"]'),
    fNameLabel: document.querySelector('label[for="id_first_name"] span span'),
    lNameLabel: document.querySelector('label[for="id_last_name"] span span'),
    emailLabel: document.querySelector('label[for="id_email"]'),
    signupBtn: document.querySelector("#button-sign-up"),
    signupBtnText: document.querySelector("#button-sign-up span"),
    signupBtnWrapper: document.querySelector("#signup_form .text-center"),
  };

  // set content
  v.loginSignup.loginTabTextSpan.textContent = "Log In";
  v.loginSignup.signupTabText.textContent = "Sign Up";
  v.loginSignup.fNameLabel.textContent = "First Name";
  v.loginSignup.lNameLabel.textContent = "Last Name";
  v.loginSignup.emailLabel.textContent = "Work Email";
  v.loginSignup.altMethod.textContent = "Or Sign Up With";
  v.loginSignup.googleBtn.textContent = "Continue with Google";
  v.loginSignup.passwordConfirm.textContent = "Password Confirm";
  v.loginSignup.signupBtnText.textContent = "Sign Up";
  v.loginSignup.inputs.email.placeholder = "Work Email";
  v.loginSignup.inputs.password2.placeholder = "Password Confirm";

  setStyle(v.loginSignup.termsAndServices, {
    maxWidth: "368px",
    color: "#545454",
    fontSize: "14px",
    transform: "translateX(-13px)",
  });

  setStyle(v.logo, { maxHeight: "48px" });

  setStyle(v.loginSignup.tabContainer, { display: "flex" });

  setStyle(v.loginSignup.loginTab, {
    border: "0",
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
    borderRadius: "100px",
  });

  setStyle(v.loginSignup.loginTabText, {
    color: "8C8C8C",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
  });

  setStyle(v.loginSignup.signupTab, {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    backgroundColor: "#3443F4",
    borderRadius: "100px",
  });

  setStyle(v.loginSignup.signupTabText, {
    color: "#fff",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
  });

  setStyle([v.loginSignup.loginContentContainer, v.loginSignup.altMethodCol], {
    width: "100%",
  });

  setStyle([v.loginSignup.altMethodUl, v.loginSignup.altMethodCol], {
    padding: "0",
  });

  setStyle(v.loginSignup.altMethodLi, { padding: "0" });

  setStyle(v.loginSignup.altMethodContainer, { paddingBottom: "0" });

  setStyle(v.loginSignup.altMethod, {
    marginBottom: "12px",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "20px",
  });

  setStyle([v.loginSignup.inputs.login, v.loginSignup.inputs.password1], {
    borderRadius: "4px",
    borderColor: "#DCDCDC",
    padding: "12px",
    lineHeight: "24px",
  });

  setStyle(v.loginSignup.inputs.password2, {
    marginBottom: "24px",
  });

  setStyle(v.loginSignup.signupBtn, {
    width: "100%",
    height: "48px",
    fontSize: "16px",
  });

  setStyle(v.loginSignup.signupBtnWrapper, {
    textAlign: "left !important",
  });

  setStyle(v.loginSignup.googleBtn, {
    backgroundColor: "#3443F4",
    width: "100%",
    textAlign: "center",
  });

  setStyle(v.loginSignup.loginContent, {
    border: "0",
  });

  setStyle(v.loginSignup.allLabels, {
    marginBottom: "12px",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "20px",
  });

  setStyle(v.loginSignup.allInputs, {
    borderRadius: "4px",
    borderColor: "rgb(220, 220, 220)",
    padding: "12px",
    lineHeight: "24px",
  });

  setStyle(v.footerContainer, {
    paddingLeft: "0",
    paddingRight: "0",
  });

  setStyle(v.footerCols, { width: "212px" });

  // move elements
  v.loginSignup.signupForm.append(v.loginSignup.termsAndServices);

  // hide elements
  hide([v.loginSignup.fbBtn, v.loginSignup.tabArrow]);
}

/**
 * This function applies mobile-specific styling to the course details page.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCourseDetailsPageStyling() {
  // TODO: we need to clean this up but we are currently not using this view...
  // only on the staging site: https://chainguard-test.skilljar.com/secure-or-sorry-understanding-software-vulnerabilities
  console.info("Running mobileCourseDetailsPageStyling using setStyle");

  const headerContainer = document.querySelector(".top-row-grey");
  const headerFlexContainer = document.querySelector(".dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const registerBtn = document.querySelector("#purchase-button-wrapper-large");
  const mainHeadingContainer = document.querySelector(".dp-summary-wrapper");
  const mainVideoContainer = document.querySelector(
    ".columns.large-6.text-center.dp-promo-image-wrapper"
  );
  const backToCatalogBtn = document.querySelector(".back-to-catalog");
  const videoContainer = document.querySelector(".video-max");
  const signInHeaderText = document.querySelector(".signin");
  const signInBtn = document.querySelector(
    ".header-link.login-link.sj-text-sign-in.focus-link-v2"
  );
  const bodyContainer = document.querySelector("#dp-details");
  const mobileBodyContent = document.querySelector(".show-for-small");
  const secondaryBodyContainer = document.querySelector(".hide-for-small");
  const bodyColumns = secondaryBodyContainer.querySelectorAll(".columns");
  const curriculumListContainer = document.querySelector(".dp-curriculum"); // NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  const curriculumListHeader = curriculumListContainer
    .closest(".sj-curriculum-wrapper")
    .querySelector("h3");
  const curriculumList = curriculumListContainer.querySelectorAll("li");
  const courseDetailCardContainer = document.querySelectorAll(
    ".course-details-card"
  )[0];
  const courseDetailCardListItems =
    courseDetailCardContainer.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const registerBtnLink = document
    .querySelector("#purchase-button")
    .getAttribute("href");
  const registerBtnText = document.querySelector(
    ".purchase-button-full-text"
  ).textContent;
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  setStyle(v.logo, { maxHeight: "48px" });

  if (signInHeaderText) {
    setStyle(signInBtn, {
      color: "#fff !important",
      padding: "4px 8px",
      marginRight: "24px",
      borderColor: "#3443F4",
      backgroundColor: "#3443F4",
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "500",
    });
  }

  setStyle(headerContainer, {
    background:
      "linear-gradient(146deg, rgba(245,246,255,1) 0%, rgba(254,231,254,1) 100%)",
    margin: "0",
    maxWidth: "none",
    paddingTop: "48px",
    paddingBottom: "48px",
    border: "0",
  });

  setStyle(headerFlexContainer, {
    flexDirection: "column-reverse",
    flexWrap: "nowrap",
    justifyContent: "start",
    gap: "24px",
    maxWidth: "1188px",
  });

  setStyle(mainHeadingContainer, {
    border: "0",
    maxWidth: "none",
    width: "100%",
  });

  setStyle(headingFloaterText, {
    display: "block",
    marginBottom: "24px",
  });

  setStyle(mainHeading, {
    margin: "0 0 12px 0",
    fontSize: "36px",
    fontWeight: "600",
    lineHeight: "43.2px",
    letterSpacing: "-.02em",
  });

  setStyle(headingParagraph, {
    display: "block",
    margin: "0 0 24px 0",
  });

  setStyle(mainVideoContainer, {
    padding: "0",
    maxWidth: "none",
    width: "100%",
  });

  setStyle(videoContainer, {
    maxWidth: "none",
    paddingLeft: "15px",
    paddingRight: "15px",
  });

  setStyle(bodyContainer, {
    padding: "0",
    margin: "72px auto -10px auto",
    maxWidth: "min(1152px, 90%)",
    display: "grid",
    gridTemplateColumns: "1fr",
    columnGap: "24px",
  });

  setStyle(secondaryBodyContainer, {
    padding: "0",
    maxWidth: "760px",
    display: "grid !important",
  });

  bodyColumns.forEach((column) => {
    setStyle(column, {
      float: "none",
      padding: "0",
      width: "100%",
      display: "block",
      marginBottom: column.classList.contains("large-7") ? "48px" : "0",
    });

    setStyle(column.querySelector("h3"), { fontWeight: "600" });

    setStyle(column.querySelector(".dp-curriculum"), { margin: "0" });
  });

  if (!initialLoadComplete) {
    const hasSections = curriculumListContainer.querySelector(".section")
      ? true
      : false;
    let curContainer = document.createElement("li");

    if (!hasSections) {
      styleGroupContainer(curContainer, "g");
    }

    curriculumList.forEach((curListItem, i, arr) => {
      // First check if current item contains 'section' class
      if (curListItem.classList.contains("section")) {
        // Yes? push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);
        // Reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement("li");
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement("div");

        newGroupHeading.innerHTML = curListItem.innerHTML;

        styleGroupHeading(newGroupHeading, "c");

        curContainer.append(newGroupHeading);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const newListItem = document.createElement("div");
        newListItem.innerHTML = curListItem.innerHTML;
        styleListItem(
          newListItem,
          arr[i + 1] ? arr[i + 1].classList.contains("section") : true,
          true,
          "g"
        );
        curContainer.append(newListItem);
      }
      hide(curListItem);
    });

    // LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    setStyle(curriculumListContainer, { padding: "0" });
    bodyContainer.append(courseDetailCardContainer);

    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);

      setStyle(iconClone, { display: "block", flexShrink: "0" });

      // iconClone.style.display = "block";
      // iconClone.style.flexShrink = "0";

      li.prepend(iconClone);
    });

    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute("href", registerBtnLink);
  }

  // COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  setStyle(courseDetailCardContainer, {
    margin: "0 0 46px 0",
    justifySelf: "center",
  });

  // courseDetailCardContainer.style.margin = "0 0 46px 0";
  // courseDetailCardContainer.style.justifySelf = "center";

  setStyle(v.footerContainer, {
    paddingLeft: "0",
    paddingRight: "0",
  });

  // footerContainer.style.paddingLeft = 0;
  // footerContainer.style.paddingRight = 0;

  v.footerCols.forEach((col) => setStyle(col, { width: "212px" }));

  // footerCols.forEach((col) => {
  //   col.style.width = "212px";
  // });

  // move elements
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  // hide elements
  hide(backToCatalogBtn);
  hide(signInHeaderText);
  hide(mainHeadingContainer.querySelector(".sj-course-info-wrapper"));
  hide(curriculumListHeader);
  hide(mobileBodyContent);
}

/**
 * This function applies mobile-specific styling to the curriculum page when no certificate is present.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCurriculumPageNoCertificateStyling() {
  console.info(
    "Running mobileCurriculumPageNoCertificateStyling using setStyle [cleaned up]"
  );

  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(".cp-summary-wrapper");
  const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR
  const backToCatalogLink = document.querySelector(".back-to-catalog");
  const curriculumPageHeader = document.querySelector(".top-row-grey");
  const headerTextAndImgContainer = document.querySelector(".dp-row-flex-v2");
  const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
  const sjHeaderTextProgressBar = document.querySelector(".progress-bar");
  const sjHeaderImgContainer = document.querySelector(
    ".cp-promo-image-wrapper"
  );
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");
  const resumeBtn = document.querySelector("#resume-button");
  const bodyMainContainer = document.querySelector("#cp-content");
  const innerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");
  const aboutHeader = aboutSection.querySelector("h3");
  const curriculumHeader = curriculumSection.querySelector("h2");
  const aboutContent = aboutSection.querySelector(".content");
  const curriculumContent = curriculumSection.querySelector(".content");
  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const lessonListTitles = document.querySelectorAll(".lesson-row .title");
  const lessonListBullets = document.querySelectorAll(".lesson-row .bullet");
  const curriculumParentContainer = document.querySelector("#curriculum-list");
  const curriculumItemsListLIVE = new Array(
    ...curriculumParentContainer.childNodes
  );
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");
  const checkboxIcon = document.querySelector(".checkbox-icon");

  const card = {
    details: document.querySelector(".course-details-card"),
    detailItems: document.querySelectorAll(".course-details-card li"),
    link: document.querySelector(".course-details-card-link"),
  };

  // TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  aboutSection.classList.add("active");

  setStyle(v.logo, { maxHeight: "48px" });

  setStyle(bodyMainContainer, {
    display: "grid",
    gridTemplateColumns: "1fr",
    width: "90%",
    columnGap: "24px",
  });

  setStyle(card.details, {
    margin: "32px 0 56px 0",
    justifySelf: "center",
  });

  // update resume button text and href (with auto-value fallback)
  if (resumeBtn && card.link) {
    const btnText =
      resumeBtn.querySelector(".button span")?.textContent || "Resume";
    const btnHref =
      resumeBtn.querySelector(".button").getAttribute("href") || "resume";

    card.link.textContent = btnText;
    card.link.href = btnHref;
  }

  if (!initialLoadComplete) {
    card.detailItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);

      setStyle(iconClone, { display: "block", flexShrink: "0" });

      li.prepend(iconClone);
    });
  }

  setStyle(innerContentContainer, { width: "100%" });

  setStyle(mainHeading, {
    fontWeight: "600",
    fontSize: "36px",
    lineHeight: "43.2px",
    letterSpacing: "-0.5px",
    marginTop: "0",
  });

  setStyle(curriculumPageHeader, {
    maxWidth: "none",
    padding: "0",
    backgroundImage: "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)",
    border: "0",
  });

  setStyle(container, {
    position: "static",
    padding: "0",
    maxWidth: "none",
    width: "100%",
    marginBottom: "32px",
    border: "0",
    textAlign: "left",
  });

  setStyle(resumeBtn, {
    marginLeft: "0",
    marginRight: "0",
  });

  setStyle(sjHeaderImgContainer, {
    position: "static",
    padding: "0",
    width: "90%",
    maxWidth: "564px",
    height: "auto",
  });

  setStyle(sjHeaderImgDirectContainer, { maxHeight: "none" });

  setStyle(sjHeaderImg, {
    maxHeight: "none",
    height: "auto",
    maxWidth: "100%",
  });

  setStyle(container, { width: "90%" });

  setStyle(headerTextAndImgContainer, {
    margin: "96px 0",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "24px",
  });

  setStyle([headingParagraph, headingFloaterText], { display: "block" });

  setStyle(tabsContainer, { margin: "96px 0 46px 0" });

  setStyle(bodyMainContainer, { paddingTop: "0", paddingBottom: "0" });

  setStyle(curriculumSection, { marginTop: "48px" });

  setStyle([aboutHeader, curriculumHeader], { fontWeight: "600" });

  setStyle([aboutContent, curriculumContent], { border: "0", padding: "0" });

  if (!initialLoadComplete) {
    // Add vars to global
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;

    curriculumItemsListLIVE
      .filter((el) => el?.tagName)
      .forEach((el) => el.classList.add("curriculumItem"));

    // Create a starting container
    let currentContainer = document.createElement("div");
    if (!hasSections) {
      styleGroupContainer(currentContainer, "g");
    }

    curriculumParentContainer
      .querySelectorAll(".curriculumItem")
      .forEach((el, i, curArr) => {
        if (el.tagName === "DIV") {
          // Handle creating a new module/section

          // Start by resetting the current container
          curriculumParentContainer.append(currentContainer);
          currentContainer = document.createElement("div");

          styleGroupContainer(currentContainer);

          const sectionHeading = Object.assign(document.createElement("div"), {
            style: "display: flex; gap: 12px;",
            textContent:
              el.querySelector("h3")?.textContent?.trim() || "Module",
          });

          styleGroupHeading(sectionHeading, "c");

          currentContainer.append(sectionHeading);

          hide(el);
        } else {
          // Handle appending to current module/section
          const isLastChild = curArr[i + 1]
            ? curArr[i + 1].tagName === "DIV"
            : true;

          const newListEl = document.createElement("div");
          styleListItem(newListEl, isLastChild, false, "g");

          // Styling for mobile
          setStyle(el.querySelector(".title"), { textWrap: "wrap" });

          newListEl.append(el);
          currentContainer.append(newListEl);
        }
      });

    curriculumParentContainer.append(currentContainer);
  }

  setStyle(lessonListItems, {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  });

  setStyle(lessonListTitles, {
    position: "static",
    color: "#1C1C1C",
    display: "flex",
    alignItems: "center",
    margin: "0",
    transform: "translateY(2px)",
  });

  setStyle(lessonListBullets, { position: "static" });

  setStyle(v.footerContainer, { paddingLeft: "0", paddingRight: "0" });

  setStyle(v.footerCols, { width: "212px" });

  // move elements
  if (card.details) {
    bodyMainContainer.append(card.details);
  }
  container.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    resumeBtn
  );
  tabsContainer.append(curriculumSection);

  // hide elements
  hide([
    ...pageIcons,
    backToCatalogLink,
    sjHeaderTextSubheading,
    sjHeaderTextProgressBar,
    aboutSection.querySelector(".title"),
    curriculumSection.querySelector(".title"),
    curriculumOutsideContainer.querySelector("h2"),
    curriculumOutsideContainer.querySelector("hr"),
  ]);
}

/**
 * This function applies mobile-specific styling to the curriculum page when a certificate is present.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCurriculumPageYesCertificateStyling() {
  // TODO: Clean up this function
  console.info("Running mobileCurriculumPageYesCertificateStyling");

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
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
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
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  // NAV STYLING
  v.logo.style.maxHeight = "48px";

  // STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.gridTemplateColumns = "1fr";
  bodyMainContainer.style.width = "90%";
  bodyMainContainer.style.columnGap = "24px";

  courseDetailsCard.style.margin = "32px 0 56px 0";
  courseDetailsCard.style.justifySelf = "center";
  bodyMainContainer.append(courseDetailsCard);

  hide(courseDetailsCardLink);

  if (!initialLoadComplete) {
    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      iconClone.style.display = "block";
      iconClone.style.flexShrink = "0";
      li.prepend(iconClone);
    });
  }

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
    "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
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
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

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
    titleEl.style.color = "#1C1C1C";
    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.margin = "0";
    titleEl.style.transform = "translateY(2px)";
  });

  // FOOTER STYLING
  v.footerContainer.style.paddingLeft = 0;
  v.footerContainer.style.paddingRight = 0;
  v.footerCols.forEach((col) => {
    col.style.width = "212px";
  });

  hide([...pageIcons]);
}

/**
 * This function applies mobile-specific styling to the lesson page.
 * It modifies the layout and appearance of various elements on the page.
 * It also handles the positioning of the internal course warning.
 */
function mobileLessonPageStyling() {
  console.info("Running mobileLessonPageStyling with setStyle [cleaned up]");

  const internalCourseWarning = document.querySelector(
    "#internal-course-warning"
  );

  const leftNav = document.querySelector("#lp-left-nav");
  const mainLessonContentContainer = document.querySelector("#lp-wrapper");
  const mainLessonContentSubContainer = document.querySelector("#lp-content");
  const mainLessonInnerContainer = document.querySelector("#lesson-body");
  const mainLessonMainContainer = document.querySelector("#lesson-main");

  const lessonFooter = document.querySelector("#lp-footer");
  const navOpenIcon = document.querySelector("#left-nav-button");
  const hamburgerIcon = navOpenIcon.querySelector(".fa.fa-bars");
  const xIcon = navOpenIcon.querySelector(".fa.fa-times");
  const leftNavMobileOverlay = document.querySelector("#lpLeftNavBackground");
  const fullScreenBtn = document.querySelector(".toggle-fullscreen");

  const lessonInnerContainer = document.querySelector("#lesson-main-inner");
  const copyIcon = document.querySelector(".copy-icon");
  const lessonContentContainer = document.querySelector(
    "sjwc-lesson-content-item"
  );
  const parentEl = document.querySelector(".sj-page-lesson");

  const openIcon = document.querySelector(".fa.fa-bars");
  const searchIcon = document.querySelector(".fa.fa-search");
  const closeIcon = document.querySelector(".fa.fa-times");
  const navText = document.querySelector(".burger-text.sj-text-lessons");

  const lessonNavLinksContainer = document.querySelector("#curriculum-list-2");
  const backToCurriculumEl = document.querySelector("#left-nav-return-text");
  const links = lessonNavLinksContainer.querySelectorAll("a");
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll(".section-title");

  lessonView.codeBlocks = new Array(
    ...document.querySelectorAll("pre:has(code):not(.language-ansi)")
  );

  setStyle(v.logo, { height: "48px" });

  setStyle(lessonInnerContainer, {
    maxWidth: "712px",
    margin: "0 auto",
  });

  setStyle(mainLessonContentContainer, {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  });

  setStyle(mainLessonContentSubContainer, { height: "auto" });

  setStyle(mainLessonInnerContainer, {
    margin: "0",
    maxWidth: "none",
    overflowX: "clip",
  });

  setStyle(mainLessonMainContainer, {
    position: "relative",
    zIndex: "0",
    paddingTop: "0",
  });

  setStyle(navOpenIcon, {
    position: "sticky",
    top: width >= 767 ? "24px" : "56px",
    zIndex: "1",
    paddingRight: "12px",
    float: "right",
  });

  setStyle([hamburgerIcon, xIcon], {
    padding: "12px",
    border: "1px solid gainsboro",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, .8)",
    backdropFilter: "blur(1.5px)",
  });

  setStyle(lessonFooter, {
    position: "relative",
    border: "0",
    backgroundColor: "transparent",
  });

  setStyle(leftNav, {
    position: "fixed",
    backgroundColor: "#f9f9f9",
    width: "320px",
    height: "100%",
    paddingBottom: "40px",
  });

  setStyle(mainLessonContentContainer, {
    height: "100vh",
    paddingBottom: "0",
  });

  setStyle(v.footerContainer, { marginTop: "0" });

  // move elements
  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);
  if (internalCourseWarning) {
    document.querySelector("#lesson-main").prepend(internalCourseWarning);
  }

  // hide elements
  hide(fullScreenBtn);
  hide(searchIcon);
  hide(navText);

  // HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains("cbp-spmenu-open")) {
    hide(openIcon);
  } else {
    hide(closeIcon);
  }

  // DEFAULT LEFT-NAV TO BE CLOSED ON OPEN
  document.querySelector("body").classList.remove("cbp-spmenu-open");
  leftNav.classList.remove("cbp-spmenu-open");
  openIcon.style.display = "inline-block";
  hide(closeIcon);

  // HANDLE CLICKS
  openIcon.addEventListener("click", (e) => {
    hide(e.target);
    setStyle(closeIcon, { display: "inline-block" });
  });

  closeIcon.addEventListener("click", (e) => {
    hide(e.target);
    setStyle(openIcon, { display: "inline-block" });
  });

  leftNavMobileOverlay.addEventListener("click", () => {
    hide(closeIcon);
    setStyle(openIcon, { display: "inline-block" });
  });

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  setStyle(lessonNavLinksContainer, { paddingBottom: "32px" });

  // STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon");
    const lessonLinkContainer = link.querySelector(".lesson-row");

    setStyle(link, {
      color: "#1C1C1C",
      cursor: "pointer",
    });

    setStyle(lessonLinkContainer, {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      margin: "0 12px",
      paddingLeft: "12px",
      paddingRight: "12px",
      fontSize: "14px",
      lineHeight: "20px",
    });

    hide(pageIcon);
  });

  // STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  sectionTitles.forEach((title) =>
    setStyle(title, {
      backgroundColor: "transparent",
      padding: "12px",
      paddingLeft: "24px",
      paddingRight: "24px",
      marginTop: "12px",
      marginBottom: "12px",
      border: "0",
      fontFamily: "Space Mono",
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: ".05em",
    })
  );

  // HANDLE CODE BLOCK CUSTOM STYLING

  lessonView.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((el) => {
      const codeEl = el.querySelector("code");
      const iconClone = copyIcon.cloneNode(true);

      setStyle(el, {
        padding: "0",
        overflow: "visible",
        position: "relative",
      });

      setStyle(codeEl, {
        display: "inline-block",
        padding: "24px !important",
        overflowX: "scroll",
        width: "100%",
      });

      const copyText = codeEl.textContent
        .trim()
        .replace(/\r?\n\$ /g, " && ")
        .replace(/^\$ /g, "");

      const container = document.createElement("div");

      setStyle(container, {
        display: "flex",
        justifyContent: "end",
        borderBottom: "1px solid gainsboro",
        padding: "12px 24px",
      });

      setStyle(iconClone, {
        display: "block",
        cursor: "pointer",
      });

      container.append(iconClone);

      // CREATE 'COPIED' TOOLTIP
      const tooltipContainer = document.createElement("div");
      tooltipContainer.textContent = "Copied";

      setStyle(tooltipContainer, {
        position: "absolute",
        top: "-24px",
        right: "10px",
        textShadow: "none",
        backgroundColor: "#1c1c1c",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "4px",
        opacity: "0",
        transition: "opacity .2s ease-in",
      });

      // add elements
      el.append(tooltipContainer);
      el.prepend(container);

      // add event listener to cloned icon to copy block into clipboard
      iconClone.addEventListener(
        "click",
        toClipboard(copyText, tooltipContainer)
      );

      el.dataset.copyAdded = "true"; // Mark that copy icon was added to this code block
    });

  // Makes lesson links pop up in new tab
  lessonContentContainer
    .querySelectorAll("a")
    .forEach((el) => (el.target = "_blank"));

  setStyle(v.footerContainer, { paddingLeft: "0", paddingRight: "0" });

  v.footerCols.forEach((col) => {
    setStyle(col, { width: "270px" });
  });
}

/**
 * This function handles the styling of various pages based on the current view (desktop or mobile).
 * It applies specific styles to different page types such as course details, catalog, login,
 * sign-up, curriculum, and lessons pages.
 */
function handlePageStyling() {
  console.info("Running handlePageStyling");
  if (isCourseDetailsPage) {
    currentView === "desktop"
      ? desktopCourseDetailsPageStyling()
      : mobileCourseDetailsPageStyling();
  } else if (isPageDetailPath) {
    currentView === "desktop" ? desktopPathCourseDetailsPageStyling() : null;
  } else if (isPageCatalogPath) {
    currentView === "desktop" ? desktopPathCatalogPageStyling() : null;
  } else if (isLoginPage) {
    currentView === "desktop"
      ? desktopLoginPageStyling()
      : mobileLoginPageStyling();
  } else if (isSignUpPage) {
    currentView === "desktop"
      ? desktopSignUpPageStyling()
      : mobileSignUpPageStyling();
  } else if (isCurriculumPage) {
    const certificateEl = document.querySelector(".cp-certificate");

    if (!certificateEl) {
      currentView === "desktop"
        ? desktopCurriculumPageNoCertificateStyling()
        : mobileCurriculumPageNoCertificateStyling();
    } else {
      // CURRICULUM PAGE W COMPLETED CERTIFICATION GOES HERE [YESSS CERTIFICATION] <<<<<<<<<<< [CHECK TO MAKE SURE THIS WORKS; NOT TESTED]
      currentView === "desktop"
        ? desktopCurriculumPageYesCertificationStyling()
        : mobileCurriculumPageYesCertificateStyling();
    }
  } else if (isLessonsPage) {
    currentView === "desktop"
      ? desktopLessonPageStyling()
      : mobileLessonPageStyling();
  } else if (isCatalogPage) {
    desktopCatalogPageStyling();
  }
}

/**
 * This function renders the course page based on the current view (desktop or mobile).
 * It checks the window width and applies appropriate styles for different page types.
 */
function render() {
  console.info("Running render");
  width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (width <= 991 && !(currentView === "mobile")) {
    currentView = "mobile";
  } else if (width > 991 && !(currentView === "desktop")) {
    currentView = "desktop";
  }

  handlePageStyling();

  if (!isLessonsPage) {
    hide(document.querySelector("#ep-footer"));
  }
  insertFooter();
}

/**
  This event is fired when the DOM is fully loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
  It is a good place to run scripts that need to manipulate the DOM or set up event listeners.
*/
document.addEventListener("DOMContentLoaded", () => {
  getCurrentPage();

  render();
  initialLoadComplete = true;
});

/* 
  This event is fired when the entire page is fully loaded, including all dependent resources such as stylesheets and images.
  It is a good place to run scripts that need to ensure all resources are available before executing.
*/
window.addEventListener("resize", () => {
  render();
});
