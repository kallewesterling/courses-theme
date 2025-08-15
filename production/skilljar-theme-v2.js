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
 * Sets the style of a given element.
 * @param {HTMLElement|string} element - The element to style, or a selector string to find the element.
 * @param {Object} style - An object containing CSS properties and values to apply to the element.
 * @returns {HTMLElement|null}
 */
function setStyle(element, style) {
  if (typeof element === "string") element = document.querySelector(element);
  if (!element) return null;

  const toKebab = (p) =>
    p.startsWith("--") ? p : p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

  for (const [prop, raw] of Object.entries(style)) {
    let value = String(raw);
    let priority = "";
    if (/\s*!important\s*$/i.test(value)) {
      priority = "important";
      value = value.replace(/\s*!important\s*$/i, "");
    }
    if (value.trim()) {
      element.style.setProperty(toKebab(prop), value.trim(), priority);
    }
  }
  return element;
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
 * This function sets the body style to visible and opacity to 1.
 */
function makeContentVisible() {
  const body = document.querySelector("body");

  if (!body.classList.contains("sj-page-catalog")) {
    body.setAttribute(
      "style",
      "visibility: visible !important; opacity: 1 !important"
    );
  }
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
 * This function removes the Skilljar footer from the page.
 */
function removeSJFooter() {
  if (!isLessonsPage) {
    hide(document.querySelector("#ep-footer"));
  }
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
  console.info("Running desktopCourseDetailsPageStyling with setStyle [cleaned up]");
  const headerContainer = document.querySelector(".top-row-grey");
  const headerFlexContainer = document.querySelector(".dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const registerBtnWrapper = document.querySelector("#purchase-button-wrapper-large");
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

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const newListItem = document.createElement("div");
        newListItem.innerHTML = curListItem.innerHTML;
        styleListItem(
          newListItem,
          arr[i + 1] ? arr[i + 1].classList.contains("section") : true
        );
        curContainer.append(newListItem);
      }
      hide(curListItem);
    });

    // LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    setStyle(curriculumListContainer, { padding: "0" });
  }

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
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtnWrapper
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
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
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

  const logoImg = document.querySelector(".header-center-img");

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

  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  const prevBtn = document.querySelector(".button-prev-title span");

  setStyle(logoImg, {
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

  [hamburgerIcon, xIcon].forEach((el) => {
    setStyle(el, {
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      background: "rgba(255, 255, 255, .8)",
      backdropFilter: "blur(1.5px)",
    });
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

  setStyle(footerContainer, {
    paddingLeft: "40px",
    paddingRight: "40px",
  });

  footerCols.forEach((col) => {
    setStyle(col, { width: "270px" });
  });
}

/**
 * This function applies desktop-specific styling to the login page.
 */
function desktopLoginPageStyling() {
  console.info("Running desktopLoginPageStyling with setStyle");
  const logoImg = document.querySelector(".header-center-img");

  const fbBtn = document.querySelector("#facebook_login");
  const googleBtn = document.querySelector("#google_login");
  const loginContent = document.querySelector("#login-content");
  const tabArrow = document.querySelector("#tab-marker-login");
  const termsAndServicesText = document.querySelector("#access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orGoogleSignInContainer =
    loginContent.querySelectorAll(".large-6.columns")[1];
  const orGoogleSignInInnerContainer =
    orGoogleSignInContainer.querySelector("ul");
  const orGoogleSignInInnerContainerListItems =
    orGoogleSignInInnerContainer.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const loginTab = document.querySelector("#login-tab-left");
  const loginText = loginTab.querySelector("span span");
  const signInTab = document.querySelector("#login-tab-right");
  const signInTabText = signInTab.querySelector("a");
  const signInText = signInTab.querySelector("span");
  const loginNote = document.querySelector(".loginNote.sj-text-login-note");
  const orSignInWithContainer = document.querySelector(
    ".socialaccount_providers li"
  );
  const orSignInWithTextEl = orSignInWithContainer.querySelector(
    ".sj-text-sign-in-with span"
  );
  const loginInput = document.querySelector("#id_login");
  const passwordInput = document.querySelector("#id_password");
  const loginBottomBtn = document.querySelector("#button-sign-in");
  const forgotPasswordText = document.querySelector(".sj-text-forgot-password");
  const loginBottomBtnAndForgotPassBtn =
    loginBottomBtn.closest(".large-12.columns");

  const loginForm = document.querySelector("#login_form");

  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // set content
  loginText.textContent = "Log In";
  signInText.textContent = "Sign Up";
  orSignInWithTextEl.textContent = "Or Log In With";
  googleBtn.textContent = "Continue with Google";
  loginBottomBtn.textContent = "Log In";

  setStyle(logoImg, { height: "24px" });

  setStyle(termsAndServicesText, {
    maxWidth: "368px",
    fontSize: "14px",
  });

  setStyle(signUpSignInContainer, { display: "flex" });

  [loginTab, signInTab].forEach((el) =>
    setStyle(el, { display: "flex", padding: "8px 16px", alignItems: "center" })
  );

  setStyle(loginTab, {
    border: "0",
    textDecoration: "underline",
    fontFamily: "Space Mono",
    color: "#3443f4",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
  });

  setStyle(signInTabText, {
    color: "rgba(52, 67, 244, .4)",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
  });

  [loginContentContainer, orGoogleSignInContainer].forEach((el) =>
    setStyle(el, { width: "50%" })
  );

  setStyle(orGoogleSignInInnerContainer, {
    paddingLeft: "125px",
  });

  orGoogleSignInInnerContainerListItems.forEach((li) =>
    setStyle(li, { padding: "0" })
  );

  setStyle(orSignInWithContainer, { paddingBottom: "0" });

  [loginInput, passwordInput].forEach((el) =>
    setStyle(el, {
      borderRadius: "4px",
      border: "2px solid #3443f4",
      padding: "20px 15px",
      fontSize: "14px",
      lineHeight: "24px",
    })
  );

  [loginBottomBtn, forgotPasswordText].forEach((el) =>
    setStyle(el, {
      fontSize: "16px",
      fontFamily: "Space Mono",
      marginBottom: "2px",
    })
  );

  setStyle(loginBottomBtn, {
    color: "#14003d",
    width: "368px",
    height: "48px",
    backgroundColor: "transparent",
    border: "2px solid #3443f4",
    borderRadius: "999px",
  });

  setStyle(loginBottomBtnAndForgotPassBtn, { marginBottom: "24px" });

  setStyle(googleBtn, {
    background: "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)",
    width: "auto",
    textAlign: "center",
  });

  setStyle(loginContent, { border: "0" });

  setStyle(footerContainer, {
    paddingLeft: "40px",
    paddingRight: "40px",
  });

  footerCols.forEach((col) => setStyle(col, { width: "270px" }));

  // move elements
  loginForm.append(termsAndServicesText);

  // hide elements
  hide(loginNote);
  hide(fbBtn);
  hide(tabArrow);
}

/**
 * This function applies desktop-specific styling to the sign-up page.
 */
function desktopSignUpPageStyling() {
  console.info("Running desktopSignUpPageStyling with setStyle");
  const logoImg = document.querySelector(".header-center-img");
  const fbBtn = document.querySelector("#facebook_login");
  const googleBtn = document.querySelector("#google_login");
  const loginContent = document.querySelector("#login-content");
  const tabArrow = document.querySelector("#tab-marker-signup");
  const termsAndServicesText = document.querySelector("#access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orSignInWithGoogleContainer = loginContent.querySelectorAll(
    ".row .large-6.columns"
  )[3];
  const orSignInWithGoogleList =
    orSignInWithGoogleContainer.querySelector("ul");
  const orSignInWithGoogleItems = orSignInWithGoogleList.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const loginTab = document.querySelector("#login-tab-left");
  const loginTabText = loginTab.querySelector("a");
  const loginTabTextSpan = loginTabText.querySelector("span");
  const signInTab = document.querySelector("#login-tab-right");
  const signInTabText = signInTab.querySelector("span");
  const orSignInWithContainer = document.querySelector(
    ".socialaccount_providers li"
  );
  const orSignInWithText = document.querySelector(".sj-text-sign-up-with");
  const orSignInWithTextSpan = orSignInWithText.querySelector("span");

  const firstNameLabel = document.querySelector(
    'label[for="id_first_name"] span span'
  );
  const lastNameLabel = document.querySelector(
    'label[for="id_last_name"] span span'
  );

  const loginLabel = document.querySelector('label[for="id_email"]');
  const loginInput = document.querySelector("#id_email");
  const passwordInput = document.querySelector("#id_password1");
  const passwordInput2 = document.querySelector("#id_password2");
  const signUpBottomBtn = document.querySelector("#button-sign-up");
  const signUpBottomBtnText = signUpBottomBtn.querySelector("span");
  const signUpForm = document.querySelector("#signup_form");

  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  const signUpBottomBtnParent = signUpBottomBtn?.closest(".text-center");
  const labels = document.querySelectorAll("label");
  const inputs = document.querySelectorAll("input");
  const passwordConfirmText = document.querySelector(
    "label[for=id_password2] .input-label-text span"
  );

  // edit content
  loginTabTextSpan.textContent = "Log In";
  signUpBottomBtnText.textContent = "Sign up";
  orSignInWithTextSpan.textContent = "Or Sign Up With";
  googleBtn.textContent = "Continue with Google";
  signInTabText.textContent = "Sign up";
  firstNameLabel.textContent = "First Name";
  lastNameLabel.textContent = "Last Name";
  loginLabel.textContent = "Work Email";
  passwordConfirmText.textContent = "Password Confirm";
  loginInput.placeholder = "Work Email";
  passwordInput2.placeholder = "Password confirm";

  setStyle(termsAndServicesText, {
    maxWidth: "368px",
    color: "#545454",
    fontSize: "14px",
    transform: "translateX(-13px)",
  });

  setStyle(logoImg, { height: "24px" });

  setStyle(signUpSignInContainer, { display: "flex" });

  setStyle(loginTab, {
    border: "0",
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
    borderRadius: "100px",
  });

  setStyle(loginTabText, {
    color: "rgba(52, 67, 244, .4)",
    fontWeight: "700",
    fontSize: "18px",
    fontFamily: "Space Mono",
    lineHeight: "24px",
  });

  setStyle(signInTab, {
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
    borderRadius: "100px",
  });

  setStyle(signInTabText, {
    color: "#3443f4",
    textDecoration: "underline",
    fontFamily: "Space Mono",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
  });

  [loginContentContainer, orSignInWithGoogleContainer].forEach((el) =>
    setStyle(el, { width: "50%" })
  );

  setStyle(orSignInWithGoogleContainer, { paddingLeft: "100px" });

  setStyle(orSignInWithGoogleList, { paddingLeft: "25px" });

  orSignInWithGoogleItems.forEach((li) => setStyle(li, { padding: "0" }));

  setStyle(orSignInWithContainer, { paddingBottom: "0" });

  setStyle(orSignInWithText, {
    marginBottom: "12px",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "20px",
  });

  [loginInput, passwordInput].forEach((el) =>
    setStyle(el, {
      borderRadius: "4px",
      borderColor: "#DCDCDC",
      padding: "12px",
      lineHeight: "24px",
    })
  );

  setStyle(passwordInput2, { marginBottom: "24px" });

  setStyle(signUpBottomBtn, {
    width: "368px",
    height: "48px",
    fontSize: "16px",
    fontFamily: "Space Mono",
    color: "#14003d",
    backgroundColor: "transparent",
    border: "2px solid #3443f4",
    borderRadius: "999px",
  });

  setStyle(signUpBottomBtnParent, { textAlign: "left" });

  signUpBottomBtnParent?.classList.remove("text-center");

  setStyle(googleBtn, {
    background: "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)",
    width: "auto",
    textAlign: "center",
  });

  setStyle(loginContent, { border: "0" });

  labels.forEach((label) =>
    setStyle(label, {
      marginBottom: "12px",
      fontWeight: "500",
      fontSize: "16px",
      fontFamily: "Fusiona",
      lineHeight: "20px",
    })
  );

  inputs.forEach((input) =>
    setStyle(input, {
      borderRadius: "4px",
      border: "2px solid #3443f4",
      padding: "20px 15px",
      lineHeight: "24px",
    })
  );

  setStyle(footerContainer, {
    paddingLeft: "40px",
    paddingRight: "40px",
  });

  footerCols.forEach((col) => setStyle(col, { width: "270px" }));

  // move elements
  signUpForm.append(termsAndServicesText);

  // hide elements
  hide(fbBtn);
  hide(tabArrow);
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

  const logoImg = document.querySelector(".header-center-img");

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

  if (card.details) {
    bodyMainContainer.append(card.details);
  }

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

  setStyle(logoImg, { height: "24px" });

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

  [headingParagraph, headingFloaterText].forEach((el) =>
    setStyle(el, { display: "block" })
  );

  setStyle(tabsContainer, { margin: "0 0 46px 0" });

  setStyle(curriculumSection, { marginTop: "48px" });

  [aboutHeader, curriculumHeader].forEach((el) =>
    setStyle(el, { fontWeight: "600" })
  );

  [aboutContent, curriculumContent].forEach((el) =>
    setStyle(el, { border: "0", padding: "0" })
  );

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
            style: "display: flex; align-items: center;",
            textContent:
              el.querySelector("h3")?.textContent?.trim() || "Module",
          });

          styleGroupHeading(sectionHeading);

          currentContainer.append(sectionHeading);

          hide(el);
        } else {
          // Handle appending to current module/section
          const isLastChild = curArr[i + 1]
            ? curArr[i + 1].tagName === "DIV"
            : true;

          const newListEl = document.createElement("div");
          styleListItem(newListEl, isLastChild, false);

          // Styling for mobile
          setStyle(el.querySelector(".title"), { textWrap: "wrap" });

          newListEl.append(el);
          currentContainer.append(newListEl);
        }
      });

    // move elements
    container.append(
      headingFloaterText,
      mainHeading,
      headingParagraph,
      ...(resumeBtn ? [resumeBtn] : [])
    );
    curriculumParentContainer.append(currentContainer);
    tabsContainer.append(curriculumSection);

    // hide elements
    hide(curriculumOutsideContainer.querySelector("h2"));
    hide(curriculumOutsideContainer.querySelector("hr"));
  }

  // CURRICULUM ITSELF STYLING
  pageIcons.forEach((pageIcon) => hide(pageIcon));

  lessonListItems.forEach((item) => {
    const title = item.querySelector(".title");
    const bullet = item.querySelector(".bullet");

    setStyle(item, {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    });

    setStyle(bullet, { position: "static" });

    setStyle(title, {
      position: "static",
      color: "#1C1C1C",
      display: "flex",
      alignItems: "center",
      margin: "0",
      transform: "translateY(2px)",
    });
  });

  [
    aboutSection,
    curriculumSection,
    globalAboutSection,
    globalCurriculumSection,
  ].forEach((el) => setStyle(el, { padding: "0 !important" }));

  [curriculumSection, globalCurriculumSection].forEach((el) =>
    setStyle(el, { marginTop: "48px !important" })
  );

  // hide elements
  hide(backToCatalogLink);
  hide(sjHeaderTextSubheading);
  hide(sjHeaderTextProgressBar);
  hide(aboutSection.querySelector(".title"));
  hide(curriculumSection.querySelector(".title"));

  // Hide resume button if it doesn't exist
  !resumeBtn ? hide(card.link) : null;
}

/**
 * This function applies desktop-specific styling to the curriculum page when a certificate is available.
 * It modifies the layout and appearance of various elements on the page.
 */
function desktopCurriculumPageYesCertificationStyling() {
  // TODO: Clean up this function
  console.info("Running desktopCurriculumPageYesCertificationStyling");
  const courseDescription = skilljarCourse.short_description; // eslint-disable-line no-undef

  const logoImg = document.querySelector(".header-center-img");

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
  logoImg.style.height = "24px";

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
  if (courseDetailsCard) {
    courseDetailsCard.style.margin = "96px 0 46px 0";
    bodyMainContainer.append(courseDetailsCard);

    hide(courseDetailsCardLink);
  }

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
    headingFloaterText,
    mainHeading,
    headingParagraph,
    certificateEl
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
  pageIcons.forEach((pageIcon) => hide(pageIcon));

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
  const logoImg = document.querySelector(".header-center-img");
  const fbBtn = document.querySelector("#facebook_login");
  const googleBtn = document.querySelector("#google_login");
  const loginContent = document.querySelector("#login-content");
  const tabArrow = document.querySelector("#tab-marker-login");
  const termsAndServicesText = document.querySelector("#access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orGoogleSignInContainer =
    loginContent.querySelectorAll(".large-6.columns")[1];
  const orGoogleSignInInnerContainer =
    orGoogleSignInContainer.querySelector("ul");
  const orGoogleSignInInnerContainerListItems =
    orGoogleSignInInnerContainer.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const loginTab = document.querySelector("#login-tab-left");
  const loginText = loginTab.querySelector("span span");
  const signInTab = document.querySelector("#login-tab-right");
  const signInTabText = signInTab.querySelector("a");
  const signInTabSpan = signInTab.querySelector("span");
  const loginNote = document.querySelector(".loginNote.sj-text-login-note");
  const orSignInWithContainer = document.querySelector(
    ".socialaccount_providers li"
  );
  const orSignInWithTextEl = orSignInWithContainer.querySelector(
    ".sj-text-sign-in-with span"
  );
  const loginInput = document.querySelector("#id_login");
  const passwordInput = document.querySelector("#id_password");
  const loginBottomBtn = document.querySelector("#button-sign-in");
  const forgotPasswordText = document.querySelector(
    ".forgot-password.sj-text-forgot-password.focus-link-v2"
  );
  const loginBottomBtnAndForgotPassBtn =
    loginBottomBtn.closest(".large-12.columns");

  const loginForm = document.querySelector("#login_form");
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // edit content
  loginText.textContent = "Log in";
  signInTabSpan.textContent = "Sign up";
  loginBottomBtn.textContent = "Log in";
  orSignInWithTextEl.textContent = "or log in with";
  googleBtn.textContent = "Continue with Google";

  setStyle(logoImg, { maxHeight: "48px" });

  setStyle(termsAndServicesText, {
    maxWidth: "368px",
    color: "#545454",
    fontSize: "14px",
  });

  setStyle(signUpSignInContainer, { display: "flex" });

  setStyle(loginTab, {
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

  setStyle(signInTab, {
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
  });

  setStyle(signInTabText, {
    color: "#8C8C8C",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
  });

  [orGoogleSignInContainer, loginContentContainer].forEach((el) =>
    setStyle(el, { width: "100%" })
  );

  setStyle(orGoogleSignInInnerContainer, { padding: "0" });

  orGoogleSignInInnerContainerListItems.forEach((li) => {
    setStyle(li, { padding: "0" });
  });

  setStyle(orSignInWithContainer, { paddingBottom: "0" });

  [loginInput, passwordInput].forEach((el) =>
    setStyle(el, {
      borderRadius: "4px",
      borderColor: "#DCDCDC",
      padding: "12px",
      lineHeight: "24px",
    })
  );

  setStyle(passwordInput, { marginBottom: "24px" });

  setStyle(loginBottomBtn, {
    width: "100%",
    height: "48px",
    fontSize: "16px",
    marginBottom: "12px",
  });

  setStyle(forgotPasswordText, {
    fontSize: "16px",
    marginBottom: "2px",
  });

  setStyle(loginBottomBtnAndForgotPassBtn, { marginBottom: "24px" });

  setStyle(googleBtn, {
    backgroundColor: "#3443F4",
    width: "100%",
    textAlign: "center",
  });

  setStyle(loginContent, {
    border: "0",
  });

  setStyle(footerContainer, {
    paddingLeft: "0",
    paddingRight: "0",
  });

  footerCols.forEach((col) => setStyle(col, { width: "212px" }));

  // move elements
  loginForm.append(termsAndServicesText);

  // hide elements
  hide(fbBtn);
  hide(tabArrow);
  hide(loginNote);
}

/**
 * This function applies mobile-specific styling to the sign-up page.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileSignUpPageStyling() {
  console.info("Running mobileSignUpPageStyling with setStyle");
  const logoImg = document.querySelector(".header-center-img");
  const fbBtn = document.querySelector("#facebook_login");
  const googleBtn = document.querySelector("#google_login");
  const loginContent = document.querySelector("#login-content");
  const tabArrow = document.querySelector("#tab-marker-signup");
  const termsAndServicesText = document.querySelector("#access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orSignInWithGoogleContainer = loginContent.querySelectorAll(
    ".row .large-6.columns"
  )[3];
  const orSignInWithGoogleList =
    orSignInWithGoogleContainer.querySelector("ul");
  const orSignInWithGoogleItems = orSignInWithGoogleList.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const loginTab = document.querySelector("#login-tab-left");
  const loginTabText = loginTab.querySelector("a");
  const loginTabTextSpan = loginTabText.querySelector("span");
  const signInTab = document.querySelector("#login-tab-right");
  const signInTabText = signInTab.querySelector("span");
  const orSignInWithContainer = document.querySelector(
    ".socialaccount_providers li"
  );
  const orSignInWithText = document.querySelector(".sj-text-sign-up-with");
  const orSignInWithTextSpan = orSignInWithText.querySelector("span");

  const firstNameLabel = document.querySelector(
    'label[for="id_first_name"] span span'
  );
  const lastNameLabel = document.querySelector(
    'label[for="id_last_name"] span span'
  );

  const loginLabel = document.querySelector('label[for="id_email"]');
  const loginInput = document.querySelector("#id_email");
  const passwordInput = document.querySelector("#id_password1");
  const passwordInput2 = document.querySelector("#id_password2");
  const signUpBottomBtn = document.querySelector("#button-sign-up");
  const signUpBottomBtnText = signUpBottomBtn.querySelector("span");
  const signUpForm = document.querySelector("#signup_form");

  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");
  const signUpBottomBtnParent = signUpBottomBtn?.closest(".text-center");
  const labels = document.querySelectorAll("label");
  const inputs = document.querySelectorAll("input");
  const passwordConfirmText = document.querySelector(
    "label[for=id_password2] .input-label-text span"
  );

  loginTabTextSpan.textContent = "Log in";
  signInTabText.textContent = "Sign up";
  firstNameLabel.textContent = "First name";
  lastNameLabel.textContent = "Last name";
  loginLabel.textContent = "Work email";
  orSignInWithTextSpan.textContent = "or sign up with";
  googleBtn.textContent = "Continue with Google";
  passwordConfirmText.textContent = "Password Confirm";
  signUpBottomBtnText.textContent = "Sign up";
  loginInput.setAttribute("placeholder", "Work email");
  passwordInput2.placeholder = "Password confirm";

  setStyle(termsAndServicesText, {
    maxWidth: "368px",
    color: "#545454",
    fontSize: "14px",
    transform: "translateX(-13px)",
  });

  setStyle(logoImg, { maxHeight: "48px" });

  setStyle(signUpSignInContainer, { display: "flex" });

  setStyle(loginTab, {
    border: "0",
    display: "flex",
    padding: "8px 16px",
    alignItems: "center",
    borderRadius: "100px",
  });

  setStyle(loginTabText, {
    color: "8C8C8C",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
  });

  setStyle(signInTab, {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    backgroundColor: "#3443F4",
    borderRadius: "100px",
  });

  setStyle(signInTabText, {
    color: "#fff",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
  });

  [loginContentContainer, orSignInWithGoogleContainer].forEach((el) =>
    setStyle(el, { width: "100%" })
  );

  [orSignInWithGoogleList, orSignInWithGoogleContainer].forEach((el) =>
    setStyle(el, { padding: "0" })
  );

  orSignInWithGoogleItems.forEach((li) => setStyle(li, { padding: "0" }));

  setStyle(orSignInWithContainer, { paddingBottom: "0" });

  setStyle(orSignInWithText, {
    marginBottom: "12px",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "20px",
  });

  [loginInput, passwordInput].forEach((el) =>
    setStyle(el, {
      borderRadius: "4px",
      borderColor: "#DCDCDC",
      padding: "12px",
      lineHeight: "24px",
    })
  );

  setStyle(passwordInput2, {
    marginBottom: "24px",
  });

  setStyle(signUpBottomBtn, {
    width: "100%",
    height: "48px",
    fontSize: "16px",
  });

  setStyle(signUpBottomBtnParent, {
    textAlign: "left",
  });

  signUpBottomBtnParent?.classList.remove("text-center");

  setStyle(googleBtn, {
    backgroundColor: "#3443F4",
    width: "100%",
    textAlign: "center",
  });

  setStyle(loginContent, {
    border: "0",
  });

  labels.forEach((label) =>
    setStyle(label, {
      marginBottom: "12px",
      fontWeight: "500",
      fontSize: "16px",
      lineHeight: "20px",
    })
  );

  inputs.forEach((input) =>
    setStyle(input, {
      borderRadius: "4px",
      borderColor: "rgb(220, 220, 220)",
      padding: "12px",
      lineHeight: "24px",
    })
  );

  setStyle(footerContainer, {
    paddingLeft: "0",
    paddingRight: "0",
  });

  footerCols.forEach((col) => setStyle(col, { width: "212px" }));

  // move elements
  signUpForm.append(termsAndServicesText);

  // hide elements
  hide(fbBtn);
  hide(tabArrow);
}

/**
 * This function applies mobile-specific styling to the course details page.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCourseDetailsPageStyling() {
  // TODO: we need to clean this up but we are currently not using this view...
  // only on the staging site: https://chainguard-test.skilljar.com/secure-or-sorry-understanding-software-vulnerabilities
  console.info("Running mobileCourseDetailsPageStyling using setStyle");
  const navLogoImg = document.querySelector(".header-center-img");

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
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  setStyle(navLogoImg, { maxHeight: "48px" });

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

  setStyle(footerContainer, {
    paddingLeft: "0",
    paddingRight: "0",
  });

  // footerContainer.style.paddingLeft = 0;
  // footerContainer.style.paddingRight = 0;

  footerCols.forEach((col) => setStyle(col, { width: "212px" }));

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

  const navLogoImg = document.querySelector(".header-center-img");
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
  const curriculumParentContainer = document.querySelector("#curriculum-list");
  const curriculumItemsListLIVE = new Array(
    ...curriculumParentContainer.childNodes
  );
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

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

  setStyle(navLogoImg, { maxHeight: "48px" });

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

  [headingParagraph, headingFloaterText].forEach((el) =>
    setStyle(el, { display: "block" })
  );

  setStyle(tabsContainer, { margin: "96px 0 46px 0" });

  setStyle(bodyMainContainer, { paddingTop: "0", paddingBottom: "0" });

  setStyle(curriculumSection, { marginTop: "48px" });

  [aboutHeader, curriculumHeader].forEach((el) =>
    setStyle(el, { fontWeight: "600" })
  );

  [aboutContent, curriculumContent].forEach((el) =>
    setStyle(el, { border: "0", padding: "0" })
  );

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

  lessonListItems.forEach((item) => {
    const title = item.querySelector(".title");
    const bullet = item.querySelector(".bullet");

    setStyle(item, {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    });

    setStyle(bullet, { position: "static" });

    setStyle(title, {
      position: "static",
      color: "#1C1C1C",
      display: "flex",
      alignItems: "center",
      margin: "0",
      transform: "translateY(2px)",
    });
  });

  setStyle(footerContainer, { paddingLeft: "0", paddingRight: "0" });

  footerCols.forEach((col) => setStyle(col, { width: "212px" }));

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
  pageIcons.forEach((pageIcon) => hide(pageIcon));
  hide(backToCatalogLink);
  hide(sjHeaderTextSubheading);
  hide(sjHeaderTextProgressBar);
  hide(aboutSection.querySelector(".title"));
  hide(curriculumSection.querySelector(".title"));
  hide(curriculumOutsideContainer.querySelector("h2"));
  hide(curriculumOutsideContainer.querySelector("hr"));
}

/**
 * This function applies mobile-specific styling to the curriculum page when a certificate is present.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCurriculumPageYesCertificateStyling() {
  // TODO: Clean up this function
  console.info("Running mobileCurriculumPageYesCertificateStyling");
  const navLogoImg = document.querySelector(".header-center-img");
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

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // NAV STYLING
  navLogoImg.style.maxHeight = "48px";

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
  pageIcons.forEach((pageIcon) => hide(pageIcon));

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
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
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

  const navLogoImg = document.querySelector(".header-center-img");

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

  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  setStyle(navLogoImg, { height: "48px" });

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

  [hamburgerIcon, xIcon].forEach((el) =>
    setStyle(el, {
      padding: "12px",
      border: "1px solid gainsboro",
      borderRadius: "8px",
      background: "rgba(255, 255, 255, .8)",
      backdropFilter: "blur(1.5px)",
    })
  );

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

  setStyle(footerContainer, { marginTop: "0" });

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

  setStyle(footerContainer, { paddingLeft: "0", paddingRight: "0" });

  footerCols.forEach((col) => {
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

  removeSJFooter();
  insertFooter();
  makeContentVisible();
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
