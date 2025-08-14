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

/**
 * This function hides the given element by setting its display style to "none".
 * @param {HTMLElement} element - The element to hide.
 */
function hide(element) {
  if (element) {
    element.style.display = "none";
  }
}

/**
 * This function animates the tooltip that appears when code is copied.
 * It sets the opacity to 1, waits for 400ms, and then sets the opacity to 0.
 * @param {HTMLElement} tooltipEl - The tooltip element to animate.
 */
function animateCopiedTooltip(tooltipEl) {
  tooltipEl.style.opacity = "1";

  setTimeout(() => {
    tooltipEl.style.opacity = "0";
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
  container.style.border =
    border === "b" ? "2px solid #3443F4" : "1px solid #DCDCDC";
  container.style.borderRadius = "8px";
  container.style.marginBottom = "48px";
  container.style.padding = "0";
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
  if (hideIcon) {
    hide(lessonItem.querySelector(".type-icon"));
  }

  lessonItem.style.padding = "24px";
  lessonItem.style.fontSize = "16px";
  lessonItem.style.fontWeight = "400";
  lessonItem.style.lineHeight = "150%";

  if (!isLastChild) {
    lessonItem.style.borderBottom =
      border === "b" ? "2px solid #3443F4" : "1px solid #DCDCDC";
  }
}

/**
 * This function returns the current window width.
 */
function checkWindowWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
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
function insertFooter(isLessonsPage = false) {
  const footerEl = document.querySelector("#footer-container");
  let contentContainer;

  if (isLessonsPage) {
    contentContainer = document.querySelector(".sj-page-lesson");
    if (currentView === "mobile") {
      hide(footerEl);
    } else {
      footerEl.style.display = "flex";
    }
  } else {
    contentContainer = document.querySelector("#skilljar-content");
    footerEl.style.display = "flex";
  }

  contentContainer.append(footerEl);
}

/**
 * This function removes the Skilljar footer from the page.
 */
function removeSJFooter(isLessonsPage = false) {
  if (!isLessonsPage) {
    hide(document.querySelector("#ep-footer"));
  }
}

/**
 * This function applies desktop-specific styling to the catalog page.
 */
function desktopCatalogPageStyling() {
  console.info("Running desktopCatalogPageStyling");
  const catalogBodyParentContainer = document.querySelector("#catalog-content");
  const catalogContainer = document.querySelector("#catalog-courses");

  if (!initialLoadComplete) {
    // Create a container div for courses catalog list
    const catalogContentContainer = document.createElement("div");
    catalogContentContainer.style.maxWidth = "min(1232px, 90%)";
    catalogContentContainer.style.margin = "96px auto";

    // Create header for list
    const allCoursesHeader = document.createElement("h2");
    allCoursesHeader.textContent = "All Courses";
    allCoursesHeader.style.fontSize = "48px";
    allCoursesHeader.style.marginBottom = "38px";

    catalogContentContainer.append(allCoursesHeader, catalogContainer);
    catalogBodyParentContainer.append(catalogContentContainer);

    initialLoadComplete = true;
  }
}

/**
 * This function applies desktop-specific styling to the course details page.
 */
function desktopCourseDetailsPageStyling() {
  console.info("Running desktopCourseDetailsPageStyling");
  const headerContainer = document.querySelector(".top-row-grey");
  const headerFlexContainer = document.querySelector(".dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const registerBtn = document.querySelector("#purchase-button-wrapper-large");
  const mainHeadingContainer = document.querySelector(".dp-summary-wrapper");
  const backToCatalogBtn = document.querySelector(".back-to-catalog");
  const videoContainer = document.querySelector(".video-max");
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
  const courseDetailCardContainer = secondaryBodyContainer.querySelector(
    ".course-details-card"
  );
  let courseDetailCardListItems;
  if (courseDetailCardContainer) {
    courseDetailCardListItems =
      courseDetailCardContainer.querySelectorAll("li");
  }
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

  hide(backToCatalogBtn);
  hide(mobileBodyContent);
  if (signInHeaderText) {
    hide(signInHeaderText);
    signInBtn.style.backgroundColor = "transparent";
    signInBtn.style.padding = "8px 12px";
    signInBtn.style.marginRight = "24px";
    signInBtn.style.borderColor = "#3443F4";
    signInBtn.style.border = "2px solid #3443F4";
    signInBtn.style.borderRadius = "999px";
    signInBtn.style.fontSize = "14px";
    signInBtn.style.fontFamily = "Space Mono";
    signInBtn.style.fontWeight = "700";
    signInBtn.style.lineHeight = "20px";
  }

  headerContainer.style.backgroundColor = "#D0CFEE";
  headerContainer.style.margin = "0";
  headerContainer.style.maxWidth = "none";
  headerContainer.style.paddingTop = "96px";
  headerContainer.style.paddingBottom = "96px";
  headerContainer.style.border = "0";
  headerFlexContainer.style.flexDirection = "row-reverse";
  headerFlexContainer.style.flexWrap = "nowrap";
  headerFlexContainer.style.justifyContent = "start";
  headerFlexContainer.style.gap = "24px";
  headerFlexContainer.style.maxWidth = "1188px";

  // RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = "0";
  mainHeadingContainer.style.maxWidth = "564px";
  hide(mainInfoCardContained);
  headingFloaterText.style.display = "block";
  headingFloaterText.style.marginBottom = "24px";
  mainHeading.style.margin = "0 0 12px 0";
  mainHeading.style.fontSize = "36px";
  mainHeading.style.fontWeight = "600";
  mainHeading.style.lineHeight = "43.2px";
  mainHeading.style.letterSpacing = "-.02em";
  headingParagraph.style.display = "block";
  headingParagraph.style.margin = "0 0 24px 0";
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  // VIDEO STYLING
  if (videoContainer && videoContainer.style) {
    videoContainer.style.maxWidth = "none";
  }

  // COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = "0";
  bodyContainer.style.margin = "96px auto 46px auto";
  bodyContainer.style.maxWidth = "min(1152px, 90%)";
  bodyContainer.style.display = "grid";
  bodyContainer.style.gridTemplateColumns =
    "minmax(100px, 760px) minmax(100px, 368px)";
  bodyContainer.style.columnGap = "24px";

  secondaryBodyContainer.style.padding = "0";
  secondaryBodyContainer.style.maxWidth = "760px";
  bodyColumns.forEach((column) => {
    column.style.float = "none";
    column.style.padding = "0";
    column.style.width = "100%";
    column.style.display = "block";

    column.querySelector("h3").style.fontWeight = "600";

    if (column.classList.contains("large-7")) {
      column.style.marginBottom = "48px";
    }

    const innerCol = column.querySelector(".dp-curriculum");
    if (innerCol) {
      innerCol.style.margin = "0";
    }
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

    /**
     * This function styles the group heading for curriculum sections.
     * It sets the text content, font size, font weight, line height, font family, padding, and border.
     * @param {HTMLElement} groupHeading - The group heading element to style.
     */
    function styleGroupHeading(groupHeading) {
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontWeight = "500";
      groupHeading.style.lineHeight = "125%";
      groupHeading.style.fontFamily = "Fusiona";
      groupHeading.style.padding = "24px";
      groupHeading.style.borderBottom = "2px solid #3443F4";
      groupHeading.textContent = groupHeading?.textContent?.trim();
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

    hide(curriculumListHeader);
    curriculumListContainer.style.padding = "0";
  }

  // COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  if (courseDetailCardContainer) {
    bodyContainer.append(courseDetailCardContainer);
    courseDetailCardContainer.style.margin = "0 0 46px 0";
    courseDetailCardContainer.style.justifySelf = "center";
    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      iconClone.style.display = "block";
      iconClone.style.flexShrink = "0";
      li.prepend(iconClone);
    });
  }

  if (courseDetailsCardLink) {
    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute("href", registerBtnLink);
  }
}

/**
 * This function applies desktop-specific styling to the path course details page.
 */
function desktopPathCourseDetailsPageStyling() {
  console.info("Running desktopPathCourseDetailsPageStyling");
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

  hide(backToCatalogBtn);
  if (signInHeaderText) {
    hide(signInHeaderText);
    signInBtn.style.backgroundColor = "transparent";
    signInBtn.style.padding = "8px 12px";
    signInBtn.style.marginRight = "24px";
    signInBtn.style.borderColor = "#3443F4";
    signInBtn.style.border = "2px solid #3443F4";
    signInBtn.style.borderRadius = "999px";
    signInBtn.style.fontSize = "14px";
    signInBtn.style.fontFamily = "Space Mono";
    signInBtn.style.fontWeight = "700";
    signInBtn.style.lineHeight = "20px";
  }

  headerContainer.style.background =
    "url(https://images.ctfassets.net/l47ir7rfykkn/5zE7elBMFe1MmuhPIeWd9G/e09a10e4d4c081b9ca86a879b6984049/Main_BG.png)";
  headerContainer.style.backgroundSize = "cover";
  headerContainer.style.backgroundPosition = "center";
  headerContainer.style.backgroundRepeat = "no-repeat";
  headerContainer.style.margin = "0";
  headerContainer.style.maxWidth = "none";
  headerContainer.style.paddingTop = "96px";
  headerContainer.style.paddingBottom = "96px";
  headerContainer.style.border = "0";
  headerFlexContainer.style.flexDirection = "row-reverse";
  headerFlexContainer.style.flexWrap = "nowrap";
  headerFlexContainer.style.justifyContent = "start";
  headerFlexContainer.style.gap = "24px";
  headerFlexContainer.style.maxWidth = "1188px";

  // RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = "0";
  mainHeadingContainer.style.maxWidth = "600px";
  hide(mainInfoCardContained);
  headingFloaterText.textContent = "Learning Path";
  headingFloaterText.style.color = "#7AF0FE";
  headingFloaterText.style.display = "block";
  headingFloaterText.style.marginBottom = "24px";
  mainHeading.style.color = "#fff";
  mainHeading.style.margin = "0 0 12px 0";
  mainHeading.style.fontSize = "36px";
  mainHeading.style.fontWeight = "600";
  mainHeading.style.lineHeight = "43.2px";
  mainHeading.style.letterSpacing = "-.02em";
  headingParagraph.style.color = "#fff";
  headingParagraph.style.display = "block";
  headingParagraph.style.margin = "0 0 24px 0";
  registerBtnAnchor.style.borderColor = "#7AF0FE";
  registerBtnAnchor.style.color = "#fff";
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  // COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = "0";
  bodyContainer.style.margin = "96px auto 46px auto";
  bodyContainer.style.maxWidth = "min(1152px, 90%)";
  catalogContainer.style.marginBottom = "85px";
}

/**
 * This function applies desktop-specific styling to the path catalog page.
 */
function desktopPathCatalogPageStyling() {
  console.info("Running desktopPathCatalogPageStyling");
  const backArrowBtn = document.querySelector(".back-to-catalog");

  const mainContentContainer = document.querySelector("#catalog-content");
  const topContentContainer = mainContentContainer.querySelector(
    ".path-curriculum-resume-wrapper"
  );
  const coursesList = document
    .querySelector("#catalog-courses")
    .querySelectorAll(".coursebox-container");

  coursesList.forEach((course) => {
    // Outer border
    course.style.border = "2px solid #D0CFEE";
    course.style.borderRadius = "20px";

    // Inner border
    const innerContainer = course.querySelector(".course-overview");
    if (innerContainer) {
      innerContainer.style.borderTop = "2px solid #D0CFEE";
    }

    course.addEventListener("mouseover", () => {
      course.style.borderColor = "#3443f4";
      if (innerContainer) {
        innerContainer.style.borderColor = "#3443f4";
      }
    });

    course.addEventListener("mouseout", () => {
      course.style.borderColor = "#D0CFEE";
      if (innerContainer) {
        innerContainer.style.borderColor = "#D0CFEE";
      }
    });
  });

  // PAGE NAV STYLING
  hide(backArrowBtn);

  // MAIN CONTENT STYLING
  mainContentContainer.style.margin = "96px auto";
  hide(topContentContainer);
}

/**
 * This function applies desktop-specific styling to the lesson page.
 */
function desktopLessonPageStyling() {
  console.info("Running desktopLessonPageStyling");
  const internalCourseWarning = document.querySelector(
    "#internal-course-warning"
  );
  if (internalCourseWarning) {
    document.querySelector("#lesson-main").prepend(internalCourseWarning);
  }
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

  const fullScreenBtn = document.querySelector(
    ".toggle-fullscreen.focus-link-v2 "
  );
  // LESSON BODY VARS
  const lessonInnerContainer = document.querySelector("#lesson-main-inner");
  const copyIcon = document.querySelector(".copy-icon");
  const lessonContentContainer = document.querySelector(
    "sjwc-lesson-content-item"
  );
  lessonView.codeBlocks = new Array(
    ...document.querySelectorAll("pre:has(code):not(.language-ansi)")
  );

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // STYLE LOGO
  logoImg.style.height = "24px";

  lessonInnerContainer.style.maxWidth = "712px";
  lessonInnerContainer.style.margin = "0 auto";

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  // STYLING TO ALIGN NAV ICON TO LEFT CORNER AND STICKY
  mainLessonContentContainer.style.position = "relative";
  mainLessonContentContainer.style.display = "flex";
  mainLessonContentContainer.style.flexDirection = "column";
  mainLessonContentContainer.style.justifyContent = "space-between";

  mainLessonContentSubContainer.style.height = "auto";

  mainLessonInnerContainer.style.margin = "0";
  mainLessonInnerContainer.style.maxWidth = "none";
  mainLessonMainContainer.style.position = "relative";
  mainLessonMainContainer.style.zIndex = "0";
  mainLessonMainContainer.style.paddingTop = "0";

  navOpenIcon.style.position = "sticky";
  navOpenIcon.style.top = "12px";
  navOpenIcon.style.zIndex = "1";
  navOpenIcon.style.float = "none";

  [hamburgerIcon, xIcon].forEach((el) => {
    el.style.padding = "12px";
    el.style.border = "none";
    el.style.borderRadius = "8px";
    el.style.background = "rgba(255, 255, 255, .8)";
    el.style.backdropFilter = "blur(1.5px)";
  });

  /*-------------------*/

  lessonFooter.style.position = "relative";
  lessonFooter.style.border = "0";
  lessonFooter.style.backgroundColor = "transparent";

  leftNav.style.position = "absolute";
  leftNav.style.backgroundColor = "#f9f9f9";
  leftNav.style.width = "320px";
  leftNav.style.marginBottom = "0px";
  mainLessonContentContainer.style.height = "100vh";
  mainLessonContentContainer.style.overflowY = "auto";
  mainLessonContentContainer.style.paddingBottom = "0";

  // HIDE FULL SCREEN BUTTON
  hide(fullScreenBtn);

  // SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector(".sj-page-lesson");

  const openIcon = document.querySelector(".fa.fa-bars");
  const searchIcon = document.querySelector(".fa.fa-search");
  const closeIcon = document.querySelector(".fa.fa-times");
  const navText = document.querySelector(".burger-text.sj-text-lessons");

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
    closeIcon.style.display = "inline-block";
  });
  closeIcon.addEventListener("click", (e) => {
    hide(e.target);
    openIcon.style.display = "inline-block";
  });

  // STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.querySelector("#curriculum-list-2");
  const backToCurriculumEl = document.querySelector("#left-nav-return-text");
  const links = lessonNavLinksContainer.querySelectorAll("a");
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll(".section-title");

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  lessonNavLinksContainer.style.paddingBottom = "32px";

  // STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon");
    const lessonLinkContainer = link.querySelector(".lesson-row");

    link.style.color = "#14003d";
    link.style.cursor = "pointer";
    hide(pageIcon);
    lessonLinkContainer.style.display = "flex";
    lessonLinkContainer.style.flexDirection = "row-reverse";
    lessonLinkContainer.style.justifyContent = "space-between";
    lessonLinkContainer.style.margin = "0 12px";
    lessonLinkContainer.style.paddingLeft = "12px";
    lessonLinkContainer.style.paddingRight = "12px";
    lessonLinkContainer.style.fontSize = "14px";
    lessonLinkContainer.style.lineHeight = "20px";
  });

  // STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  sectionTitles.forEach((title) => {
    title.style.backgroundColor = "transparent";
    title.style.padding = "12px";
    title.style.paddingLeft = "24px";
    title.style.paddingRight = "24px";
    title.style.marginTop = "12px";
    title.style.marginBottom = "12px";
    title.style.border = "0";
    title.style.fontFamily = "Fusiona";
    title.style.fontSize = "16px";
    title.style.fontWeight = "700";
  });

  // HANDLE CODE BLOCK CUSTOM STYLING

  lessonView.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((el) => {
      // WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
      el.style.padding = "0";
      el.style.overflow = "visible";
      el.style.position = "relative";

      const codeEl = el.querySelector("code");
      codeEl.setAttribute(
        "style",
        "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
      );
      const copyText = codeEl.textContent
        .trim()
        .replace(/\r?\n\$ /g, " && ")
        .replace(/^\$ /g, "");

      // CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.justifyContent = "end";
      container.style.borderBottom = "1px solid gainsboro";
      container.style.padding = "12px 24px";

      // CLONE COPYICON EL AND ADD TO CONTAINER
      const iconClone = copyIcon.cloneNode(true);
      iconClone.style.display = "block";
      iconClone.style.cursor = "pointer";
      container.append(iconClone);

      // CREATE 'COPIED' TOOLTIP
      const tooltipContainer = document.createElement("div");
      tooltipContainer.textContent = "Copied";
      tooltipContainer.style.position = "absolute";
      tooltipContainer.style.top = "-24px";
      tooltipContainer.style.right = "10px";
      tooltipContainer.style.textShadow = "none";
      tooltipContainer.style.backgroundColor = "#1c1c1c";
      tooltipContainer.style.color = "#fff";
      tooltipContainer.style.padding = "5px 10px";
      tooltipContainer.style.borderRadius = "4px";
      tooltipContainer.style.opacity = "0";
      tooltipContainer.style.transition = "opacity .2s ease-in";

      el.append(tooltipContainer);

      // ADD CONTAINER AS FIRST CHILD IN EL
      el.prepend(container);

      // ADD EVENT LISTENER TO CLONED ICON TO COPY CODE BLOCK INTO CLIPBOARD
      iconClone.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(copyText);
          animateCopiedTooltip(tooltipContainer);
        } catch (err) {
          console.error("Failed to copy codeblock to clipboard: ", err);
        }
      });

      el.dataset.copyAdded = "true"; // Mark that copy icon was added to this code block
    });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => {
    el.setAttribute("target", "_blank");
  });

  // LESSON CONTENT FOOTER
  const prevBtn = document.querySelector(".button-prev-title span");
  if (prevBtn) {
    prevBtn.style.color = "#14003d";
  }

  // FOOTER STYLING
  footerContainer.style.paddingLeft = "40px";
  footerContainer.style.paddingRight = "40px";
  footerCols.forEach((col) => {
    col.style.width = "270px";
  });
}

/**
 * This function applies desktop-specific styling to the login page.
 */
function desktopLoginPageStyling() {
  console.info("Running desktopLoginPageStyling");
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
  const signInTab = document.querySelector("#login-tab-right");
  const signInTabText = signInTab.querySelector("a");
  const longInNote = document.querySelector(".loginNote.sj-text-login-note");
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

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // STYLE LOGO
  logoImg.style.height = "24px";

  termsAndServicesText.style.maxWidth = "368px";
  termsAndServicesText.style.fontSize = "14px";

  loginForm.append(termsAndServicesText);

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  loginTab.querySelector("span span").textContent = "Log In";
  loginTab.style.border = "0";
  loginTab.style.display = "flex";
  loginTab.style.padding = "8px 16px";
  loginTab.style.alignItems = "center";
  loginTab.style.textDecoration = "underline";
  loginTab.style.fontFamily = "Space Mono";
  loginTab.style.color = "#3443f4";
  loginTab.style.fontWeight = "700";
  loginTab.style.fontSize = "18px";
  loginTab.style.lineHeight = "24px";
  loginTab.style.fontFamily = "Space Mono";
  signInTab.querySelector("span").textContent = "Sign Up";
  signInTab.style.display = "flex";
  signInTab.style.alignItems = "center";
  signInTab.style.padding = "8px 16px";
  signInTabText.style.color = "rgba(52, 67, 244, .4)";
  signInTabText.style.fontWeight = "700";
  signInTabText.style.fontSize = "18px";
  signInTabText.style.lineHeight = "24px";

  // STYLE THE LOGIN TEXT CONTENT BOX
  loginContentContainer.style.width = "50%";
  orGoogleSignInContainer.style.width = "50%";
  orGoogleSignInInnerContainer.style.paddingLeft = "125px";
  orGoogleSignInInnerContainerListItems.forEach((li) => {
    li.style.padding = "0";
  });

  hide(longInNote);
  orSignInWithContainer.style.paddingBottom = "0";
  loginInput.style.borderRadius = "4px";
  loginInput.style.border = "2px solid #3443f4";
  loginInput.style.padding = "20px 15px";
  loginInput.style.fontSize = "14px";
  loginInput.style.lineHeight = "24px";
  passwordInput.style.borderRadius = "4px";
  passwordInput.style.border = "2px solid #3443f4";
  passwordInput.style.padding = "20px 15px";
  passwordInput.style.fontSize = "14px";
  passwordInput.style.lineHeight = "24px";
  passwordInput.style.marginBottom = "24px";
  loginBottomBtn.textContent = "Log In";
  loginBottomBtn.style.fontFamily = "Space Mono";
  loginBottomBtn.style.color = "#14003d";
  loginBottomBtn.style.width = "368px";
  loginBottomBtn.style.height = "48px";
  loginBottomBtn.style.fontSize = "16px";
  loginBottomBtn.style.backgroundColor = "transparent";
  loginBottomBtn.style.border = "2px solid #3443f4";
  loginBottomBtn.style.borderRadius = "999px";
  loginBottomBtn.style.marginBottom = "2px";
  forgotPasswordText.style.fontSize = "16px";
  forgotPasswordText.style.fontFamily = "Space Mono";
  forgotPasswordText.style.marginBottom = "2px";
  loginBottomBtnAndForgotPassBtn.style.marginBottom = "24px";

  // STYLING OF SIDE 'SIGN IN W/' GOOGLE ELS
  orSignInWithTextEl.textContent = "Or Log In With";
  googleBtn.textContent = "Continue with Google";

  hide(fbBtn);
  googleBtn.style.background =
    "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)";
  googleBtn.style.width = "auto";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  hide(tabArrow);

  // FOOTER STYLING
  footerContainer.style.paddingLeft = "40px";
  footerContainer.style.paddingRight = "40px";
  footerCols.forEach((col) => {
    col.style.width = "270px";
  });
}

/**
 * This function applies desktop-specific styling to the sign-up page.
 */
function desktopSignUpPageStyling() {
  console.info("Running desktopSignUpPageStyling");
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
  const signUpForm = document.querySelector("#signup_form");

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  termsAndServicesText.style.maxWidth = "368px";
  termsAndServicesText.style.color = "#545454";
  termsAndServicesText.style.fontSize = "14px";
  signUpForm.append(termsAndServicesText);

  // STYLE LOGO
  logoImg.style.height = "24px";

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  loginTab.style.border = "0";
  loginTab.style.display = "flex";
  loginTab.style.padding = "8px 16px";
  loginTab.style.alignItems = "center";
  loginTab.style.borderRadius = "100px";
  loginTabText.style.color = "rgba(52, 67, 244, .4)";
  loginTabText.style.fontWeight = "700";
  loginTabText.style.fontSize = "18px";
  loginTabText.style.fontFamily = "Space Mono";
  loginTabText.style.lineHeight = "24px";
  loginTabText.querySelector("span").textContent = "Log In";
  signInTab.style.display = "flex";
  signInTab.style.alignItems = "center";
  signInTab.style.padding = "8px 16px";
  signInTab.style.borderRadius = "100px";
  signInTabText.textContent = "Sign up";
  signInTabText.style.color = "#3443f4";
  signInTabText.style.textDecoration = "underline";
  signInTabText.style.fontFamily = "Space Mono";
  signInTabText.style.fontWeight = "700";
  signInTabText.style.fontSize = "18px";
  signInTabText.style.lineHeight = "24px";

  // STYLE THE SIGNUP TEXT CONTENT BOX
  loginContentContainer.style.width = "50%";
  orSignInWithGoogleContainer.style.width = "50%";
  orSignInWithGoogleContainer.style.paddingLeft = "100px";
  orSignInWithGoogleList.style.paddingLeft = "25px";
  orSignInWithGoogleItems.forEach((li) => {
    li.style.padding = "0";
  });

  orSignInWithContainer.style.paddingBottom = "0";
  orSignInWithText.style.marginBottom = "12px";
  orSignInWithText.style.fontWeight = "500";
  orSignInWithText.style.fontSize = "16px";
  orSignInWithText.style.lineHeight = "20px";
  firstNameLabel.textContent = "First Name";
  lastNameLabel.textContent = "Last Name";
  loginLabel.textContent = "Work Email";
  loginInput.style.borderRadius = "4px";
  loginInput.style.borderColor = "#DCDCDC";
  loginInput.style.padding = "12px";
  loginInput.style.lineHeight = "24px";
  loginInput.setAttribute("placeholder", "Work Email");
  passwordInput.style.borderRadius = "4px";
  passwordInput.style.borderColor = "#DCDCDC";
  passwordInput.style.padding = "12px";
  passwordInput.style.lineHeight = "24px";
  passwordInput2.style.marginBottom = "24px";

  signUpBottomBtn.style.width = "368px";
  signUpBottomBtn.style.height = "48px";
  signUpBottomBtn.style.fontSize = "16px";
  signUpBottomBtn.style.fontFamily = "Space Mono";
  signUpBottomBtn.style.color = "#14003d";
  signUpBottomBtn.style.backgroundColor = "transparent";
  signUpBottomBtn.style.border = "2px solid #3443f4";
  signUpBottomBtn.style.borderRadius = "999px";

  const signUpBottomBtnParent = signUpBottomBtn?.closest(".text-center");
  if (signUpBottomBtnParent) {
    signUpBottomBtnParent.style.textAlign = "left";
    signUpBottomBtnParent.classList.remove("text-center");
  }
  signUpBottomBtn.querySelector("span").textContent = "Sign up";
  termsAndServicesText.style.transform = "translateX(-13px)";

  // STYLING OF RIGHT SIDE, OR SIGN UP WITH GOOGLE, TEXT AND BTN
  orSignInWithTextSpan.textContent = "Or Sign Up With";
  googleBtn.textContent = "Continue with Google";

  hide(fbBtn);
  googleBtn.style.background =
    "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)";
  googleBtn.style.width = "auto";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  hide(tabArrow);

  const labels = document.querySelectorAll("label");
  labels.forEach((label) => {
    label.style.marginBottom = "12px";
    label.style.fontWeight = "500";
    label.style.fontSize = "16px";
    label.style.fontFamily = "Fusiona";
    label.style.lineHeight = "20px";

    if (label.getAttribute("for") === "id_password2") {
      label.querySelector(".input-label-text span").textContent =
        "Password Confirm";
    }
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.style.borderRadius = "4px";
    input.style.border = "2px solid #3443f4";
    input.style.padding = "20px 15px";
    input.style.lineHeight = "24px";

    if (input.getAttribute("id") === "id_password2") {
      input.setAttribute("placeholder", "Password confirm");
    }
  });

  // FOOTER STYLING
  footerContainer.style.paddingLeft = "40px";
  footerContainer.style.paddingRight = "40px";
  footerCols.forEach((col) => {
    col.style.width = "270px";
  });
}

/**
 * This function applies desktop-specific styling to the curriculum page when no certificate is available.
 * It modifies the layout and appearance of various elements on the page.
 */
function desktopCurriculumPageNoCertificateStyling() {
  console.info("Running desktopCurriculumPageNoCertificateStyling");
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
  const sjHeaderImgContainer = document.querySelector(
    ".large-4.pull-8.columns.cp-promo-image-wrapper"
  );
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");
  const resumeBtn = document.querySelector("#resume-button");
  let btnText, btnHref;
  if (resumeBtn) {
    btnText = resumeBtn.querySelector(".button span").textContent;
    btnHref = resumeBtn.querySelector(".button").getAttribute("href");
  }

  // BODY VARIABLES
  const bodyMainContainer = document.querySelector("#cp-content");
  const innerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");
  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.querySelector("#curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  // STYLE LOGO
  logoImg.style.height = "24px";

  // TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  // CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  let courseDetailCardListItems;
  if (courseDetailsCard) {
    courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  }
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

    if (!resumeBtn) {
      hide(courseDetailsCardLink);
    }
  }

  if (courseDetailsCardLink && resumeBtn) {
    courseDetailsCardLink.textContent = btnText;
    courseDetailsCardLink.setAttribute("href", btnHref);
  }

  if (!initialLoadComplete) {
    if (courseDetailCardListItems) {
      courseDetailCardListItems.forEach((li) => {
        const iconClone = checkboxIcon.cloneNode(true);
        iconClone.style.display = "block";
        iconClone.style.flexShrink = "0";
        li.prepend(iconClone);
      });
    }
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
  curriculumPageHeader.style.backgroundColor = "#D0CFEE";
  curriculumPageHeader.style.border = "0";

  // STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  // TEXT CONTAINER
  sjHeaderTextContainer.style.position = "static";
  sjHeaderTextContainer.style.padding = "0";
  sjHeaderTextContainer.style.maxWidth = "564px";
  sjHeaderTextContainer.style.border = "0";
  sjHeaderTextContainer.style.textAlign = "left";
  if (resumeBtn) {
    resumeBtn.style.marginLeft = "0";
    resumeBtn.style.marginRight = "0";
  }
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

  if (resumeBtn) {
    container.append(
      headingFloaterText,
      mainHeading,
      headingParagraph,
      resumeBtn
    );
  } else {
    container.append(headingFloaterText, mainHeading, headingParagraph);
  }

  // CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = "0 0 46px 0";
  bodyMainContainer.style.paddingTop = "0";
  bodyMainContainer.style.paddingBottom = "0";
  if (aboutSection) {
    aboutSection.classList.add("active");
  }
  curriculumSection.style.marginTop = "48px";

  if (aboutSection) {
    aboutSection.querySelector("h3").style.fontWeight = "600";
    hide(aboutSection.querySelector(".title"));
    aboutSection.querySelector(".content").style.border = "0";
    aboutSection.querySelector(".content").style.padding = "0";
  }
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
    // Add vars to global
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    /**
     * This function styles the group heading container.
     * It sets padding, border bottom, and styles the actual group heading.
     * @param {HTMLElement} groupHeadingContainer - The group heading container to style.
     */
    function styleGroupHeading(groupHeadingContainer) {
      console.info("Running new styleGroupHeading");

      Object.assign(groupHeadingContainer.style, {
        padding: "24px",
        borderBottom: "2px solid #3443f4",
        fontSize: "16px",
        fontFamily: "Fusiona",
        fontWeight: "500",
        lineHeight: "125%",
        letterSpacing: "-.16px",
        margin: "0",
      });

      // groupHeadingContainer.style.padding = "24px";
      // groupHeadingContainer.style.borderBottom = "2px solid #3443f4";

      // Get actual group heading
      const groupHeading =
        groupHeadingContainer.querySelector("h3") || groupHeadingContainer;

      groupHeading.textContent = groupHeading?.textContent?.trim();
      // groupHeading.style.fontSize = "16px";
      // groupHeading.style.fontFamily = "Fusiona";
      // groupHeading.style.fontWeight = "500";
      // groupHeading.style.lineHeight = "125%";
      // groupHeading.style.letterSpacing = "-.16px";
      // groupHeading.style.margin = "0";
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
        
        const headingContent = document.createElement("span");
        headingContent.textContent = el.querySelector("h3").textContent;
        
        newGroupHeading.append(headingContent);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        hide(el);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true,
          false
        );

        el.querySelector(".title").style.textWrap = "wrap";

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    hide(curriculumOutsideContainer.querySelector("h2"));
    hide(curriculumOutsideContainer.querySelector("hr"));

    globalCurriculumSection.setAttribute(
      "style",
      "padding: 0 !important; margin-top: 48px !important;"
    );
    globalAboutSection.setAttribute("style", "padding: 0 !important");
  }

  // CURRICULUM ITSELF STYLING
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute("style", "display:none !important");
  });
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

  curriculumSection.setAttribute(
    "style",
    "padding: 0 !important; margin-top: 48px !important;"
  );
  aboutSection.setAttribute("style", "padding: 0 !important");
}

/**
 * This function applies desktop-specific styling to the curriculum page when a certificate is available.
 * It modifies the layout and appearance of various elements on the page.
 */
function desktopCurriculumPageYesCertificationStyling() {
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

    /**
     * This function styles the group heading container.
     * It sets padding, border bottom, and styles the actual group heading.
     * @param {HTMLElement} groupHeadingContainer - The group heading container to style.
     */
    function styleGroupHeading(groupHeadingContainer) {
      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "2px solid #3443f4";

      // Get actual group heading
      const groupHeading =
        groupHeadingContainer.querySelector("h3") || groupHeadingContainer;

      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontWeight = "500";
      groupHeading.style.lineHeight = "125%";
      groupHeading.style.letterSpacing = "-.16px";
      groupHeading.style.margin = "0";
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
        
        const headingContent = document.createElement("span");
        headingContent.textContent = el.querySelector("h3").textContent;
        
        newGroupHeading.append(headingContent);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        hide(el);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true,
          false
        );
        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    hide(curriculumOutsideContainer.querySelector("h2"));
    hide(curriculumOutsideContainer.querySelector("hr"));
  }

  // CURRICULUM ITSELF STYLING
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute("style", "display:none !important");
  });

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
  console.info("Running mobileLoginPageStyling");
  // NAV VARS
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
  const signInTab = document.querySelector("#login-tab-right");
  const signInTabText = signInTab.querySelector("a");
  const longInNote = document.querySelector(".loginNote.sj-text-login-note");
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

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // NAV STYLING
  logoImg.style.maxHeight = "48px";

  termsAndServicesText.style.maxWidth = "368px";
  termsAndServicesText.style.color = "#545454";
  termsAndServicesText.style.fontSize = "14px";

  loginForm.append(termsAndServicesText);

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  loginTab.querySelector("span span").textContent = "Log in";
  loginTab.style.border = "0";
  loginTab.style.display = "flex";
  loginTab.style.padding = "8px 16px";
  loginTab.style.alignItems = "center";
  loginTab.style.backgroundColor = "#3443F4";
  loginTab.style.color = "#fff";
  loginTab.style.fontWeight = "500";
  loginTab.style.fontSize = "16px";
  loginTab.style.lineHeight = "24px";
  loginTab.style.borderRadius = "100px";
  signInTab.querySelector("span").textContent = "Sign up";
  signInTab.style.display = "flex";
  signInTab.style.alignItems = "center";
  signInTab.style.padding = "8px 16px";
  signInTabText.style.color = "#8C8C8C";
  signInTabText.style.fontWeight = "500";
  signInTabText.style.fontSize = "16px";
  signInTabText.style.lineHeight = "24px";

  // STYLE THE LOGIN TEXT CONTENT BOX
  loginContentContainer.style.width = "100%";
  orGoogleSignInContainer.style.width = "100%";
  orGoogleSignInInnerContainer.style.padding = "0";
  orGoogleSignInInnerContainerListItems.forEach((li) => {
    li.style.padding = "0";
  });

  hide(longInNote);
  orSignInWithContainer.style.paddingBottom = "0";
  loginInput.style.borderRadius = "4px";
  loginInput.style.borderColor = "#DCDCDC";
  loginInput.style.padding = "12px";
  loginInput.style.lineHeight = "24px";
  passwordInput.style.borderRadius = "4px";
  passwordInput.style.borderColor = "#DCDCDC";
  passwordInput.style.padding = "12px";
  passwordInput.style.lineHeight = "24px";
  passwordInput.style.marginBottom = "24px";
  loginBottomBtn.textContent = "Log in";
  loginBottomBtn.style.width = "100%";
  loginBottomBtn.style.height = "48px";
  loginBottomBtn.style.fontSize = "16px";
  loginBottomBtn.style.marginBottom = "12px";
  forgotPasswordText.style.fontSize = "16px";
  forgotPasswordText.style.marginBottom = "2px";
  loginBottomBtnAndForgotPassBtn.style.marginBottom = "24px";

  // STYLING OF SIDE 'SIGN IN W/' GOOGLE ELS
  orSignInWithTextEl.textContent = "or log in with";
  googleBtn.textContent = "Continue with Google";

  hide(fbBtn);
  googleBtn.style.backgroundColor = "#3443F4";
  googleBtn.style.width = "100%";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  hide(tabArrow);

  // FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

/**
 * This function applies mobile-specific styling to the sign-up page.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileSignUpPageStyling() {
  console.info("Running mobileSignUpPageStyling");
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
  const signUpForm = document.querySelector("#signup_form");

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  termsAndServicesText.style.maxWidth = "368px";
  termsAndServicesText.style.color = "#545454";
  termsAndServicesText.style.fontSize = "14px";
  signUpForm.append(termsAndServicesText);

  // STYLE LOGO
  logoImg.style.minHeight = "48px";

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  loginTabText.querySelector("span").textContent = "Log in";
  loginTab.style.border = "0";
  loginTab.style.display = "flex";
  loginTab.style.padding = "8px 16px";
  loginTab.style.alignItems = "center";
  loginTab.style.borderRadius = "100px";
  loginTabText.style.color = "#8C8C8C";
  loginTabText.style.fontWeight = "500";
  loginTabText.style.fontSize = "16px";
  loginTabText.style.lineHeight = "24px";
  signInTab.style.display = "flex";
  signInTab.style.alignItems = "center";
  signInTab.style.padding = "8px 16px";
  signInTab.style.backgroundColor = "#3443F4";
  signInTab.style.borderRadius = "100px";
  signInTabText.textContent = "Sign up";
  signInTabText.style.color = "#fff";
  signInTabText.style.fontWeight = "500";
  signInTabText.style.fontSize = "16px";
  signInTabText.style.lineHeight = "24px";

  // STYLE THE SIGNUP TEXT CONTENT BOX
  loginContentContainer.style.width = "100%";
  orSignInWithGoogleContainer.style.width = "100%";
  orSignInWithGoogleContainer.style.padding = "0";
  orSignInWithGoogleList.style.padding = "0";
  orSignInWithGoogleItems.forEach((li) => {
    li.style.padding = "0";
  });

  orSignInWithContainer.style.paddingBottom = "0";
  orSignInWithText.style.marginBottom = "12px";
  orSignInWithText.style.fontWeight = "500";
  orSignInWithText.style.fontSize = "16px";
  orSignInWithText.style.lineHeight = "20px";
  firstNameLabel.textContent = "First name";
  lastNameLabel.textContent = "Last name";
  loginLabel.textContent = "Work email";
  loginInput.style.borderRadius = "4px";
  loginInput.style.borderColor = "#DCDCDC";
  loginInput.style.padding = "12px";
  loginInput.style.lineHeight = "24px";
  loginInput.setAttribute("placeholder", "Work email");
  passwordInput.style.borderRadius = "4px";
  passwordInput.style.borderColor = "#DCDCDC";
  passwordInput.style.padding = "12px";
  passwordInput.style.lineHeight = "24px";
  passwordInput2.style.marginBottom = "24px";

  signUpBottomBtn.style.width = "100%";
  signUpBottomBtn.style.height = "48px";
  signUpBottomBtn.style.fontSize = "16px";

  const signUpBottomBtnParent = signUpBottomBtn?.closest(".text-center");
  if (signUpBottomBtnParent) {
    signUpBottomBtnParent.style.textAlign = "left";
    signUpBottomBtnParent.classList.remove("text-center");
  }

  signUpBottomBtn.querySelector("span").textContent = "Sign up";
  termsAndServicesText.style.transform = "translateX(-13px)";

  // STYLING OF RIGHT SIDE, OR SIGN UP WITH GOOGLE, TEXT AND BTN
  orSignInWithTextSpan.textContent = "or sign up with";
  googleBtn.textContent = "Continue with Google";

  hide(fbBtn);
  googleBtn.style.backgroundColor = "#3443F4";
  googleBtn.style.width = "100%";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  hide(tabArrow);

  const labels = document.querySelectorAll("label");
  labels.forEach((label) => {
    label.style.marginBottom = "12px";
    label.style.fontWeight = "500";
    label.style.fontSize = "16px";
    label.style.lineHeight = "20px";

    if (label.getAttribute("for") === "id_password2") {
      label.querySelector(".input-label-text span").textContent =
        "Password confirm";
    }
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.style.borderRadius = "4px";
    input.style.borderColor = "rgb(220, 220, 220)";
    input.style.padding = "12px";
    input.style.lineHeight = "24px";

    if (input.getAttribute("id") === "id_password2") {
      input.setAttribute("placeholder", "Password confirm");
    }
  });

  // FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

/**
 * This function applies mobile-specific styling to the course details page.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCourseDetailsPageStyling() {
  console.info("Running mobileCourseDetailsPageStyling");
  // NAV VARS
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
  // SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector(".signin");
  const signInBtn = document.querySelector(
    ".header-link.login-link.sj-text-sign-in.focus-link-v2"
  );
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

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  hide(backToCatalogBtn);
  mobileBodyContent.setAttribute("style", "display: none !important;");

  // NAV STYLING
  navLogoImg.style.maxHeight = "48px";
  if (signInHeaderText) {
    hide(signInHeaderText);
    signInBtn.setAttribute("style", "color:#fff !important");
    signInBtn.style.padding = "4px 8px";
    signInBtn.style.marginRight = "24px";
    signInBtn.style.borderColor = "#3443F4";
    signInBtn.style.backgroundColor = "#3443F4";
    signInBtn.style.fontSize = "14px";
    signInBtn.style.lineHeight = "20px";
    signInBtn.style.fontWeight = "500";
  }

  headerContainer.style.background =
    "linear-gradient(146deg, rgba(245,246,255,1) 0%, rgba(254,231,254,1) 100%)";
  headerContainer.style.margin = "0";
  headerContainer.style.maxWidth = "none";
  headerContainer.style.paddingTop = "48px";
  headerContainer.style.paddingBottom = "48px";
  headerContainer.style.border = "0";
  headerFlexContainer.style.flexDirection = "column-reverse";
  headerFlexContainer.style.flexWrap = "nowrap";
  headerFlexContainer.style.justifyContent = "start";
  headerFlexContainer.style.gap = "24px";
  headerFlexContainer.style.maxWidth = "1188px";

  // RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = "0";
  mainHeadingContainer.style.maxWidth = "none";
  mainHeadingContainer.style.width = "100%";
  hide(mainHeadingContainer.querySelector(".sj-course-info-wrapper"));
  headingFloaterText.style.display = "block";
  headingFloaterText.style.marginBottom = "24px";
  mainHeading.style.margin = "0 0 12px 0";
  mainHeading.style.fontSize = "36px";
  mainHeading.style.fontWeight = "600";
  mainHeading.style.lineHeight = "43.2px";
  mainHeading.style.letterSpacing = "-.02em";
  headingParagraph.style.display = "block";
  headingParagraph.style.margin = "0 0 24px 0";
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  // VIDEO STYLING
  mainVideoContainer.style.padding = "0";
  mainVideoContainer.style.maxWidth = "none";
  mainVideoContainer.style.width = "100%";
  videoContainer.style.maxWidth = "none";
  videoContainer.style.paddingLeft = "15px";
  videoContainer.style.paddingRight = "15px";

  // COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = "0";
  bodyContainer.style.margin = "72px auto -10px auto";
  bodyContainer.style.maxWidth = "min(1152px, 90%)";
  bodyContainer.style.display = "grid";
  bodyContainer.style.gridTemplateColumns = "1fr";
  bodyContainer.style.columnGap = "24px";

  secondaryBodyContainer.setAttribute(
    "style",
    "padding: 0; max-width: 760px; display: grid !important;"
  );
  bodyColumns.forEach((column) => {
    column.style.float = "none";
    column.style.padding = "0";
    column.style.width = "100%";
    column.style.display = "block";

    column.querySelector("h3").style.fontWeight = "600";

    if (column.classList.contains("large-7")) {
      column.style.marginBottom = "48px";
    }

    const innerCol = column.querySelector(".dp-curriculum");
    if (innerCol) {
      innerCol.style.margin = "0";
    }
  });

  // COURSE DETAILS CURRICULUM STYLING
  if (!initialLoadComplete) {
    const hasSections = curriculumListContainer.querySelector(".section")
      ? true
      : false;
    let curContainer = document.createElement("li");

    if (!hasSections) {
      styleGroupContainer(curContainer, "g");
    }

    /**
     * This function styles the group heading for curriculum items.
     * It sets the text content, font size, font weight, line height, letter spacing,
     * padding, and border bottom.
     * @param {HTMLElement} groupHeading - The group heading element to style.
     */
    function styleGroupHeading(groupHeading) {
      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontWeight = "500";
      groupHeading.style.lineHeight = "125%";
      groupHeading.style.letterSpacing = "-.16px";
      groupHeading.style.padding = "24px";
      groupHeading.style.borderBottom = "1px solid #DCDCDC";
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

    hide(curriculumListHeader);
    curriculumListContainer.style.padding = "0";

    // COURSE DETAILS CARD STYLING
    // ADD COURSE DETAILS CARD INTO RIGHT CONTAINER
    bodyContainer.append(courseDetailCardContainer);

    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      iconClone.style.display = "block";
      iconClone.style.flexShrink = "0";
      li.prepend(iconClone);
    });

    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute("href", registerBtnLink);
  }

  // COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  courseDetailCardContainer.style.margin = "0 0 46px 0";
  courseDetailCardContainer.style.justifySelf = "center";

  // FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

/**
 * This function applies mobile-specific styling to the curriculum page when no certificate is present.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCurriculumPageNoCertificateStyling() {
  console.info("Running mobileCurriculumPageNoCertificateStyling");
  // NAV VARS
  const navLogoImg = document.querySelector(".header-center-img");

  // HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(".cp-summary-wrapper"); // DUPLICATE VAR
  const btn = document.querySelector("#resume-button"); // DUPLICATE VAR
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
  const sjHeaderImgContainer = document.querySelector(
    ".large-4.pull-8.columns.cp-promo-image-wrapper"
  );
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");
  const resumeBtn = document.querySelector("#resume-button");
  const btnText = resumeBtn.querySelector(".button span").textContent;
  const btnHref = resumeBtn.querySelector(".button").getAttribute("href");

  // BODY VARIABLES
  const bodyMainContainer = document.querySelector("#cp-content");
  const innerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");
  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.querySelector("#curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  // TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

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

  if (courseDetailsCardLink) {
    courseDetailsCardLink.textContent = btnText;
    courseDetailsCardLink.setAttribute("href", btnHref);
  }

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
  resumeBtn.style.marginLeft = "0";
  resumeBtn.style.marginRight = "0";
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
  container.append(headingFloaterText, mainHeading, headingParagraph, btn);

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
  const curriculumSectionH2 = curriculumSection.querySelector("h2");
  if (curriculumSectionH2) {
    curriculumSectionH2.style.fontWeight = "600";
  }
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

    /**
     * This function styles the group heading for curriculum items.
     * It sets the text content, font size, font weight, line height, letter spacing,
     * padding, and border bottom.
     * @param {HTMLElement} groupHeadingContainer - The group heading element to style.
     */
    function styleGroupHeading(groupHeadingContainer) {
      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "1px solid #DCDCDC";

      // Get actual group heading
      const groupHeading =
        groupHeadingContainer.querySelector("h3") || groupHeadingContainer;

      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontWeight = "500";
      groupHeading.style.lineHeight = "125%";
      groupHeading.style.letterSpacing = "-.16px";
      groupHeading.style.margin = "0";
      groupHeading.style.textWrap = "wrap";
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
        
        const headingContent = document.createElement("span");
        headingContent.textContent = el.querySelector("h3").textContent;
        
        newGroupHeading.append(headingContent);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        hide(el);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true,
          false,
          "g"
        );
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
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute("style", "display:none !important");
  });
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
 * This function applies mobile-specific styling to the curriculum page when a certificate is present.
 * It modifies the layout and appearance of various elements on the page.
 */
function mobileCurriculumPageYesCertificateStyling() {
  console.info("Running mobileCurriculumPageYesCertificateStyling");
  // NAV VARS
  const navLogoImg = document.querySelector(".header-center-img");

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

    /**
     * This function styles the group heading for curriculum items.
     * It sets the text content, font size, font weight, line height, letter spacing,
     * padding, and border bottom.
     * @param {HTMLElement} groupHeadingContainer - The group heading element to style.
     */
    function styleGroupHeading(groupHeadingContainer) {
      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "1px solid #DCDCDC";

      // Get actual group heading
      const groupHeading =
        groupHeadingContainer.querySelector("h3") || groupHeadingContainer;

      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontWeight = "500";
      groupHeading.style.lineHeight = "125%";
      groupHeading.style.letterSpacing = "-.16px";
      groupHeading.style.margin = "0";
      groupHeading.style.textWrap = "wrap";
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
        
        const headingContent = document.createElement("span");
        headingContent.textContent = el.querySelector("h3").textContent;
        
        newGroupHeading.append(headingContent);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        hide(el);
      } else {
        // Else, normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true,
          false,
          "g"
        );
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
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute("style", "display:none !important");
  });
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
  console.info("Running mobileLessonPageStyling");
  const internalCourseWarning = document.querySelector(
    "#internal-course-warning"
  );
  if (internalCourseWarning) {
    document.querySelector("#lesson-main").prepend(internalCourseWarning);
  }

  // MAIN NAV VARS
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
  const fullScreenBtn = document.querySelector(
    ".toggle-fullscreen.focus-link-v2 "
  );
  // LESSON BODY VARS
  const lessonInnerContainer = document.querySelector("#lesson-main-inner");
  const copyIcon = document.querySelector(".copy-icon");
  const lessonContentContainer = document.querySelector(
    "sjwc-lesson-content-item"
  );
  lessonView.codeBlocks = new Array(
    ...document.querySelectorAll("pre:has(code):not(.language-ansi)")
  ).filter((d) => !d.dataset["no-copy"]);

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // MAIN NAV STYLING
  navLogoImg.style.maxHeight = "48px";

  lessonInnerContainer.style.maxWidth = "712px";
  lessonInnerContainer.style.margin = "0 auto";

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  // STYLING TO ALIGN NAV ICON TO RIGHT CORNER AND STICKY
  mainLessonContentContainer.style.position = "relative";
  mainLessonContentContainer.style.display = "flex";
  mainLessonContentContainer.style.flexDirection = "column";
  mainLessonContentContainer.style.justifyContent = "space-between";

  mainLessonContentSubContainer.style.height = "auto";

  mainLessonInnerContainer.style.margin = "0";
  mainLessonInnerContainer.style.maxWidth = "none";
  mainLessonInnerContainer.style.overflowX = "clip";
  mainLessonMainContainer.style.position = "relative";
  mainLessonMainContainer.style.zIndex = "0";
  mainLessonMainContainer.style.paddingTop = "0";

  navOpenIcon.style.position = "sticky";
  const width = checkWindowWidth();
  if (width >= 767) {
    navOpenIcon.style.top = "24px";
  } else {
    navOpenIcon.style.top = "56px";
  }
  navOpenIcon.style.zIndex = "1";
  navOpenIcon.style.paddingRight = "12px";
  navOpenIcon.style.float = "right";
  [hamburgerIcon, xIcon].forEach((el) => {
    el.style.padding = "12px";
    el.style.border = "1px solid gainsboro";
    el.style.borderRadius = "8px";
    el.style.background = "rgba(255, 255, 255, .8)";
    el.style.padding = "6px";
    el.style.backdropFilter = "blur(1.5px)";
  });

  lessonFooter.style.position = "relative";
  lessonFooter.style.border = "0";
  lessonFooter.style.backgroundColor = "transparent";

  leftNav.style.position = "fixed";
  leftNav.style.backgroundColor = "#f9f9f9";
  leftNav.style.width = "320px";
  leftNav.style.height = "100%";
  leftNav.style.paddingBottom = "40px";
  mainLessonContentContainer.style.height = "100vh";
  mainLessonContentContainer.style.paddingBottom = "0";

  // HIDE FULL SCREEN BUTTON
  hide(fullScreenBtn);

  // SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector(".sj-page-lesson");

  footerContainer.style.marginTop = "0";

  const openIcon = document.querySelector(".fa.fa-bars");
  const searchIcon = document.querySelector(".fa.fa-search");
  const closeIcon = document.querySelector(".fa.fa-times");
  const navText = document.querySelector(".burger-text.sj-text-lessons");

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
    closeIcon.style.display = "inline-block";
  });
  closeIcon.addEventListener("click", (e) => {
    hide(e.target);
    openIcon.style.display = "inline-block";
  });
  leftNavMobileOverlay.addEventListener("click", () => {
    hide(closeIcon);
    openIcon.style.display = "inline-block";
  });

  // STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.querySelector("#curriculum-list-2");
  const backToCurriculumEl = document.querySelector("#left-nav-return-text");
  const links = lessonNavLinksContainer.querySelectorAll("a");
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll(".section-title");

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  lessonNavLinksContainer.style.paddingBottom = "32px";

  // STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon");
    const lessonLinkContainer = link.querySelector(".lesson-row");

    link.style.color = "#1C1C1C";
    link.style.cursor = "pointer";
    hide(pageIcon);
    lessonLinkContainer.style.display = "flex";
    lessonLinkContainer.style.flexDirection = "row-reverse";
    lessonLinkContainer.style.justifyContent = "space-between";
    lessonLinkContainer.style.margin = "0 12px";
    lessonLinkContainer.style.paddingLeft = "12px";
    lessonLinkContainer.style.paddingRight = "12px";
    lessonLinkContainer.style.fontSize = "14px";
    lessonLinkContainer.style.lineHeight = "20px";
  });

  // STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  sectionTitles.forEach((title) => {
    title.style.backgroundColor = "transparent";
    title.style.padding = "12px";
    title.style.paddingLeft = "24px";
    title.style.paddingRight = "24px";
    title.style.marginTop = "12px";
    title.style.marginBottom = "12px";
    title.style.border = "0";
    title.style.fontFamily = "Space Mono";
    title.style.fontSize = "12px";
    title.style.textTransform = "uppercase";
    title.style.letterSpacing = ".05em";
  });

  // HANDLE CODE BLOCK CUSTOM STYLING

  lessonView.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((el) => {
      // WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
      el.style.padding = "0";
      el.style.overflow = "visible";
      el.style.position = "relative";

      const codeEl = el.querySelector("code");
      codeEl.setAttribute(
        "style",
        "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
      );
      const copyText = codeEl.textContent
        .trim()
        .replace(/\r?\n\$ /g, " && ")
        .replace(/^\$ /g, "");

      // CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.justifyContent = "end";
      container.style.borderBottom = "1px solid gainsboro";
      container.style.padding = "12px 24px";

      // CLONE COPYICON EL AND ADD TO CONTAINER
      const iconClone = copyIcon.cloneNode(true);
      iconClone.style.display = "block";
      iconClone.style.cursor = "pointer";
      container.append(iconClone);

      // CREATE 'COPIED' TOOLTIP
      const tooltipContainer = document.createElement("div");
      tooltipContainer.textContent = "Copied";
      tooltipContainer.style.position = "absolute";
      tooltipContainer.style.top = "-24px";
      tooltipContainer.style.right = "10px";
      tooltipContainer.style.textShadow = "none";
      tooltipContainer.style.backgroundColor = "#1c1c1c";
      tooltipContainer.style.color = "#fff";
      tooltipContainer.style.padding = "5px 10px";
      tooltipContainer.style.borderRadius = "4px";
      tooltipContainer.style.opacity = "0";
      tooltipContainer.style.transition = "opacity .2s ease-in";

      el.append(tooltipContainer);

      // ADD CONTAINER AS FIRST CHILD IN EL
      el.prepend(container);

      // ADD EVENT LISTENER TO CLONED ICON TO COPY CODE BLOCK INTO CLIPBOARD
      iconClone.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(copyText);
          animateCopiedTooltip(tooltipContainer);
        } catch (err) {
          console.error("Failed to copy codeblock to clipboard: ", err);
        }
      });

      el.dataset.copyAdded = "true"; // Mark that copy icon was added to this code block
    });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => {
    el.setAttribute("target", "_blank");
  });

  // FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
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
    currentView === "desktop" ? desktopCatalogPageStyling() : null;
  }
}

/**
 * This function renders the course page based on the current view (desktop or mobile).
 * It checks the window width and applies appropriate styles for different page types.
 */
function renderCourse() {
  console.info("Running renderCourse");
  const width = checkWindowWidth();

  if (width <= 991 && !(currentView === "mobile")) {
    currentView = "mobile";
  } else if (width > 991 && !(currentView === "desktop")) {
    currentView = "desktop";
  }

  handlePageStyling();

  removeSJFooter(isLessonsPage);
  insertFooter(isLessonsPage);
  makeContentVisible();
}

/**
  This event is fired when the DOM is fully loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
  It is a good place to run scripts that need to manipulate the DOM or set up event listeners.
*/
document.addEventListener("DOMContentLoaded", () => {
  getCurrentPage();

  renderCourse();
  initialLoadComplete = true;
});

/* 
  This event is fired when the entire page is fully loaded, including all dependent resources such as stylesheets and images.
  It is a good place to run scripts that need to ensure all resources are available before executing.
*/
window.addEventListener("resize", () => {
  renderCourse();
});
