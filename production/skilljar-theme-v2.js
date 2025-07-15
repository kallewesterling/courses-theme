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

function checkWindowWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}

function getCurrentPage() {
  //THIS FUNCTION SEEMS TO JUST REWRITE THE GLOBAL VARS
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

  //PATH PAGES
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

function getWidthAndCurrentPage() {
  return {
    width: checkWindowWidth(),
    currentPage: getCurrentPage(),
  };
}

function makeContentVisible() {
  const body = document.querySelector("body");

  if (!body.classList.contains("sj-page-catalog")) {
    body.setAttribute(
      "style",
      "visibility: visible !important; opacity: 1 !important"
    );
  }
}

function insertFooter(isLessonsPage = false) {
  const footerEl = document.getElementById("footer-container");
  let contentContainer;

  if (isLessonsPage) {
    contentContainer = document.querySelector(".sj-page-lesson");
    if (currentView === "mobile") {
      footerEl.style.display = "none";
    } else {
      footerEl.style.display = "flex";
    }
  } else {
    contentContainer = document.getElementById("skilljar-content");
    footerEl.style.display = "flex";
  }

  contentContainer.append(footerEl);
}

function removeSJFooter(isLessonsPage = false) {
  if (!isLessonsPage) {
    document.getElementById("ep-footer").style.display = "none";
  }
}

//DESTOP VIEW STYLINGS
function desktopCatalogPageStyling() {
  //grab variables
  const catalogBodyParentContainer = document.getElementById("catalog-content");
  const catalogContainer = document.getElementById("catalog-courses");

  if (!initialLoadComplete) {
    //create container div for courses catalog list
    const catalogContentContainer = document.createElement("div");
    catalogContentContainer.style.maxWidth = "min(1232px, 90%)";
    catalogContentContainer.style.margin = "96px auto";

    //create header for list
    const allCoursesHeader = document.createElement("h2");
    allCoursesHeader.textContent = "All Courses";
    allCoursesHeader.style.fontSize = "48px";
    allCoursesHeader.style.marginBottom = "38px";

    catalogContentContainer.append(allCoursesHeader, catalogContainer);
    catalogBodyParentContainer.append(catalogContentContainer);

    initialLoadComplete = true;
  }
}

function desktopCourseDetailsPageStyling() {
  const headerContainer = document.querySelector(
    ".top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2"
  );
  const headerFlexContainer = document.querySelector(".row.dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const registerBtn = document.getElementById("purchase-button-wrapper-large");
  const mainHeadingContainer = document.querySelector(
    ".columns.text-center.large-6.dp-summary-wrapper.text-left-v2"
  );
  const mainVideoContainer = document.querySelector(
    ".columns.large-6.text-center.dp-promo-image-wrapper"
  );
  const backToCatalogBtn = document.querySelector(".back-to-catalog");
  const videoContainer = document.querySelector(".video-max");
  const mainInfoCardContained = document.querySelector(
    ".sj-course-info-wrapper"
  );
  const headingParagraph = mainInfoCardContained.querySelector("h2");

  //SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector(".signin");
  const signInBtn = document.querySelector(
    ".header-link.login-link.sj-text-sign-in.focus-link-v2"
  );
  ////BODY VARIABLES
  const bodyContainer = document.getElementById("dp-details");
  const mobileBodyContent = document.querySelector(".row.show-for-small");
  const secondaryBodyContainer = document.querySelector(
    ".row.hide-for-small.padded-side-bottom"
  );
  const bodyColumns = secondaryBodyContainer.querySelectorAll(".columns");
  const curriculumListContainer = document.querySelector(".dp-curriculum"); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  const curriculumListHeader = curriculumListContainer
    .closest(".sj-curriculum-wrapper")
    .querySelector("h3");
  const curriculumList = curriculumListContainer.querySelectorAll("li");

  ////CARD VARIABLES
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
    .getElementById("purchase-button")
    .getAttribute("href");
  const registerBtnText = document.querySelector(
    ".purchase-button-full-text"
  ).textContent;
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  backToCatalogBtn.style.display = "none";
  mobileBodyContent.style.display = "none";
  if (signInHeaderText) {
    signInHeaderText.style.display = "none";
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

  //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = "0";
  mainHeadingContainer.style.maxWidth = "564px";
  mainInfoCardContained.style.display = "none";
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

  //VIDEO STYLING
  if (videoContainer && videoContainer.style) {
    videoContainer.style.maxWidth = "none";
  }

  //COURSE DETAILS PAGE BODY STYLING
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

  //COURSE DETAILS CURRICULUM STYLING
  if (!initialLoadComplete) {
    let groupIsOpen = false;
    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumListContainer.querySelector(".section")
      ? true
      : false;
    let curContainer = document.createElement("li");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    // const startingGroup = document.createElement("div");
    // styleGroupHeading(startingGroup);
    // curContainer.append(startingGroup);

    function styleGroupContainer(container) {
      container.style.border = "2px solid #3443F4";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonItem, isLastChild) {
      //display none for icon w/ class 'type-icon'
      const icon = lessonItem.querySelector(".type-icon");
      icon.style.display = "none";

      const lessonItemText = lessonItem.querySelector(".lesson-wrapper");
      lessonItemText.style.padding = "24px";
      lessonItemText.style.fontSize = "16px";
      lessonItemText.style.fontWeight = "400";
      lessonItemText.style.lineHeight = "150%";

      if (!isLastChild) {
        lessonItemText.style.borderBottom = "2px solid #3443F4";
      }
    }

    function styleGroupHeading(groupHeading) {
      // console.log('groupHeading: ', groupHeading)
      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontWeight = "500";
      groupHeading.style.lineHeight = "125%";
      //   groupHeading.style.letterSpacing = "-.16px";
      groupHeading.style.fontFamily = "Fusiona";
      groupHeading.style.padding = "24px";
      groupHeading.style.borderBottom = "2px solid #3443F4";
      curContainer.append(groupHeading);
    }

    curriculumList.forEach((curListItem, i, arr) => {
      //first check if current item contains 'section' class
      if (curListItem.classList.contains("section")) {
        //Yes? push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);
        //reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement("li");
        styleGroupContainer(curContainer);
        const newGroupHeading = document.createElement("div");
        newGroupHeading.innerHTML = curListItem.innerHTML;
        styleGroupHeading(newGroupHeading);
        curContainer.append(newGroupHeading);
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const newListItem = document.createElement("div");
        newListItem.innerHTML = curListItem.innerHTML;
        styleListItem(
          newListItem,
          arr[i + 1] ? arr[i + 1].classList.contains("section") : true
        );
        curContainer.append(newListItem);
      }
      curListItem.style.display = "none";
    });

    //LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    curriculumListHeader.style.display = "none";
    curriculumListContainer.style.padding = "0";
  }

  //COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
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

function desktopPathCourseDetailsPageStyling() {
  const headerContainer = document.querySelector(
    ".top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2"
  );
  const headerFlexContainer = document.querySelector(".row.dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const registerBtn = document.getElementById("purchase-button-wrapper-large");
  const registerBtnAnchor = document.getElementById("purchase-button");
  const mainHeadingContainer = document.querySelector(
    ".columns.text-center.large-6.dp-summary-wrapper.text-left-v2"
  );
  // const mainVideoContainer = document.querySelector(
  //   ".columns.large-6.text-center.dp-promo-image-wrapper"
  // );
  const backToCatalogBtn = document.querySelector(".back-to-catalog");
  // const videoContainer = document.querySelector(".video-max");
  const mainInfoCardContained = document.querySelector(
    ".sj-course-info-wrapper"
  );
  const headingParagraph = mainInfoCardContained.querySelector("h2");

  //SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector(".signin");
  const signInBtn = document.querySelector(
    ".header-link.login-link.sj-text-sign-in.focus-link-v2"
  );
  ////BODY VARIABLES
  const bodyContainer = document.getElementById("dp-details-bundle");
  const catalogContainer = document.getElementById("catalog-courses");

  // const mobileBodyContent = document.querySelector(".row.show-for-small");
  // const secondaryBodyContainer = document.querySelector(
  //   ".row.hide-for-small.padded-side-bottom"
  // );
  // const bodyColumns = secondaryBodyContainer.querySelectorAll(".columns");
  // const curriculumListContainer = document.querySelector(".dp-curriculum"); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  // const curriculumListHeader = curriculumListContainer
  //   .closest(".sj-curriculum-wrapper")
  // .querySelector("h3");
  // const curriculumList = curriculumListContainer.querySelectorAll("li");

  ////CARD VARIABLES
  // const courseDetailCardContainer = secondaryBodyContainer.querySelector(
  //   ".course-details-card"
  // );
  // let courseDetailCardListItems;
  // if (courseDetailCardContainer) {
  //   courseDetailCardListItems =
  //     courseDetailCardContainer.querySelectorAll("li");
  // }
  // const checkboxIcon = document.querySelector(".checkbox-icon");
  // const registerBtnLink = document
  //   .getElementById("purchase-button")
  //   .getAttribute("href");
  // const registerBtnText = document.querySelector(
  //   ".purchase-button-full-text"
  // ).textContent;
  // const courseDetailsCardLink = document.querySelector(
  //   ".course-details-card-link"
  // );

  backToCatalogBtn.style.display = "none";
  // mobileBodyContent.style.display = "none";
  if (signInHeaderText) {
    signInHeaderText.style.display = "none";
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

  // headerContainer.style.backgroundColor = "#D0CFEE";
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

  // //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = "0";
  mainHeadingContainer.style.maxWidth = "600px";
  mainInfoCardContained.style.display = "none";
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

  // //VIDEO STYLING
  // if (videoContainer && videoContainer.style) {
  //   videoContainer.style.maxWidth = "none";
  // }

  // //COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = "0";
  bodyContainer.style.margin = "96px auto 46px auto";
  bodyContainer.style.maxWidth = "min(1152px, 90%)";
  catalogContainer.style.marginBottom = "85px";
  // bodyContainer.style.display = "grid";
  // bodyContainer.style.gridTemplateColumns =
  //   "minmax(100px, 760px) minmax(100px, 368px)";
  // bodyContainer.style.columnGap = "24px";

  // secondaryBodyContainer.style.padding = "0";
  // secondaryBodyContainer.style.maxWidth = "760px";
  // bodyColumns.forEach((column) => {
  //   column.style.float = "none";
  //   column.style.padding = "0";
  //   column.style.width = "100%";
  //   column.style.display = "block";

  //   column.querySelector("h3").style.fontWeight = "600";

  //   if (column.classList.contains("large-7")) {
  //     column.style.marginBottom = "48px";
  //   }

  //   const innerCol = column.querySelector(".dp-curriculum");
  //   if (innerCol) {
  //     innerCol.style.margin = "0";
  //   }
  // });

  // //COURSE DETAILS CURRICULUM STYLING
  // if (!initialLoadComplete) {
  //   let groupIsOpen = false;
  //   let curContainer = document.createElement("li");
  //   styleGroupContainer(curContainer);

  //   const startingGroup = document.createElement("div");
  //   styleGroupHeading(startingGroup);
  //   curContainer.append(startingGroup);

  //   function styleGroupContainer(container) {
  //     container.style.border = "2px solid #3443F4";
  //     container.style.borderRadius = "8px";
  //     container.style.marginBottom = "48px";
  //     container.style.padding = "0";
  //   }

  //   function styleListItem(lessonItem, isLastChild) {
  //     //display none for icon w/ class 'type-icon'
  //     const icon = lessonItem.querySelector(".type-icon");
  //     icon.style.display = "none";

  //     const lessonItemText = lessonItem.querySelector(".lesson-wrapper");
  //     lessonItemText.style.padding = "24px";
  //     lessonItemText.style.fontSize = "16px";
  //     lessonItemText.style.fontWeight = "400";
  //     lessonItemText.style.lineHeight = "150%";

  //     if (!isLastChild) {
  //       lessonItemText.style.borderBottom = "2px solid #3443F4";
  //     }
  //   }

  //   function styleGroupHeading(groupHeading) {
  //     // console.log('groupHeading: ', groupHeading)
  //     groupHeading.textContent =
  //       groupHeading?.textContent?.trim() === ""
  //         ? "Introduction"
  //         : groupHeading?.textContent?.trim();
  //     groupHeading.style.fontSize = "16px";
  //     groupHeading.style.fontWeight = "500";
  //     groupHeading.style.lineHeight = "125%";
  //     //   groupHeading.style.letterSpacing = "-.16px";
  //     groupHeading.style.fontFamily = "Fusiona";
  //     groupHeading.style.padding = "24px";
  //     groupHeading.style.borderBottom = "2px solid #3443F4";
  //     curContainer.append(groupHeading);
  //   }

  //   curriculumList.forEach((curListItem, i, arr) => {
  //     //first check if current item contains 'section' class
  //     if (curListItem.classList.contains("section")) {
  //       //Yes? push curContainer into curriculumListContainer
  //       curriculumListContainer.append(curContainer);
  //       //reset curContainer while pushing current 'section' in there for the next iteration
  //       curContainer = document.createElement("li");
  //       styleGroupContainer(curContainer);
  //       const newGroupHeading = document.createElement("div");
  //       newGroupHeading.innerHTML = curListItem.innerHTML;
  //       styleGroupHeading(newGroupHeading);
  //       curContainer.append(newGroupHeading);
  //     } else {
  //       // else, normal/expected behaviour
  //       //transfer inner html of current list item to new created div
  //       const newListItem = document.createElement("div");
  //       newListItem.innerHTML = curListItem.innerHTML;
  //       styleListItem(
  //         newListItem,
  //         arr[i + 1] ? arr[i + 1].classList.contains("section") : true
  //       );
  //       curContainer.append(newListItem);
  //     }
  //     curListItem.style.display = "none";
  //   });

  //   //LAST, unpushed SECTION; push it out to curriculumListContainer
  //   curriculumListContainer.append(curContainer);

  //   curriculumListHeader.style.display = "none";
  //   curriculumListContainer.style.padding = "0";
  // }

  // //COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  // if (courseDetailCardContainer) {
  //   bodyContainer.append(courseDetailCardContainer);
  //   courseDetailCardContainer.style.margin = "0 0 46px 0";
  //   courseDetailCardContainer.style.justifySelf = "center";
  //   courseDetailCardListItems.forEach((li) => {
  //     const iconClone = checkboxIcon.cloneNode(true);
  //     iconClone.style.display = "block";
  //     iconClone.style.flexShrink = "0";
  //     li.prepend(iconClone);
  //   });
  // }

  // if (courseDetailsCardLink) {
  //   courseDetailsCardLink.textContent = registerBtnText;
  //   courseDetailsCardLink.setAttribute("href", registerBtnLink);
  // }
  console.log("reached end of path func");
}

function desktopPathCatalogPageStyling() {
  const backArrowBtn = document.querySelector(".back-to-catalog");

  const mainContentContainer = document.getElementById("catalog-content");
  const topContentContainer = mainContentContainer.querySelector(
    ".path-curriculum-resume-wrapper"
  );
  const coursesList = document
    .getElementById("catalog-courses")
    .querySelectorAll(".coursebox-container");

  coursesList.forEach((course) => {
    //Outter border
    course.style.border = "2px solid #D0CFEE";
    course.style.borderRadius = "20px";

    //inner border
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

  //PAGE NAV STYLING
  backArrowBtn.style.display = "none";

  //MAIN CONTENT STYLING
  mainContentContainer.style.margin = "96px auto";
  topContentContainer.style.display = "none";
}

function desktopLessonPageStyling() {
  const logoImg = document.querySelector(".header-center-img");

  const leftNav = document.getElementById("lp-left-nav");
  const mainLessonContentContainer = document.getElementById("lp-wrapper");
  const mainLessonContentSubContainer = document.getElementById("lp-content");
  const mainLessonInnerContainer = document.getElementById("lesson-body");
  const mainLessonMainContainer = document.getElementById("lesson-main");

  const lessonFooter = document.getElementById("lp-footer");
  const navOpenIcon = document.getElementById("left-nav-button");
  const hamburgerIcon = navOpenIcon.querySelector(".fa.fa-bars");
  const xIcon = navOpenIcon.querySelector(".fa.fa-times");
  const leftNavMobileOverlay = document.getElementById("lpLeftNavBackground");

  const fullScreenBtn = document.querySelector(
    ".toggle-fullscreen.focus-link-v2 "
  );
  /// LESSON BODY VARS
  const lessonInnerContainer = document.getElementById("lesson-main-inner");
  const quizPage = document.querySelector(
    ".course-scrollable-content.course-text-content.quiz"
  );
  const copyIcon = document.querySelector(".copy-icon");
  const lessonContentContainer = document.querySelector(
    "sjwc-lesson-content-item"
  );
  const codeBlocks = lessonContentContainer.querySelectorAll("pre");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  ///////STYLE LOGO
  logoImg.style.height = "24px";

  lessonInnerContainer.style.maxWidth = "712px";
  lessonInnerContainer.style.margin = "0 auto";

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  //STYLING TO ALIGN NAV ICON TO LEFT CORNER AND STICKY
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
  hamburgerIcon.style.padding = "12px";
  xIcon.style.padding = "12px";
  navOpenIcon.style.float = "none";
  [hamburgerIcon, xIcon].forEach((el) => {
    xIcon.style.padding = "12px";
    el.style.padding = "12px";
    el.style.border = "none";
    el.style.borderRadius = "8px";
    el.style.background = "rgba(255, 255, 255, .8)";
    el.style.backdropFilter = "blur(1.5px)";
  });

  ///////////////////////////////

  lessonFooter.style.position = "relative";
  lessonFooter.style.border = "0";
  lessonFooter.style.backgroundColor = "transparent";
  //lessonFooter.style.backgroundColor = "red";

  leftNav.style.position = "absolute";
  leftNav.style.backgroundColor = "#f9f9f9";
  leftNav.style.width = "320px";
  leftNav.style.marginBottom = "0px";
  // leftNav.style.height = "100%";
  // leftNav.style.paddingBottom = "40px";
  mainLessonContentContainer.style.height = "100vh";
  mainLessonContentContainer.style.overflowY = "auto";
  mainLessonContentContainer.style.paddingBottom = "0";

  /////////HIDE FULL SCREEN BUTTON
  fullScreenBtn.style.display = "none";

  /////////QUIZ PAGE STYLING
  if (quizPage) {
    const quizInitCheckboxIcon = document.querySelector(
      ".fa.fa-check-square-o.quiz-icon"
    );
    //quizInitCheckboxIcon.style.display = "none";
    //console.log("quizPage", quizPage);
  }

  //SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector(".sj-page-lesson");

  // footerContainer.style.marginTop = "60px";

  const openIcon = document.querySelector(".fa.fa-bars");
  const searchIcon = document.querySelector(".fa.fa-search");
  const closeIcon = document.querySelector(".fa.fa-times");
  const navText = document.querySelector(".burger-text.sj-text-lessons");

  searchIcon.style.display = "none";
  navText.style.display = "none";

  //HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains("cbp-spmenu-open")) {
    openIcon.style.display = "none";
  } else {
    closeIcon.style.display = "none";
  }

  //HANDLE CLICKS
  openIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    closeIcon.style.display = "inline-block";
  });
  closeIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    openIcon.style.display = "inline-block";
  });

  //STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.getElementById("curriculum-list-2");
  const backToCurriculumEl = document.getElementById("left-nav-return-text");
  const links = lessonNavLinksContainer.querySelectorAll("a");
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll(".section-title");

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  lessonNavLinksContainer.style.paddingBottom = "32px";

  //STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon");
    const lessonLinkContainer = link.querySelector(".lesson-row");

    link.style.color = "#14003d";
    link.style.cursor = "pointer";
    pageIcon.style.display = "none";
    lessonLinkContainer.style.display = "flex";
    lessonLinkContainer.style.flexDirection = "row-reverse";
    lessonLinkContainer.style.justifyContent = "space-between";
    lessonLinkContainer.style.margin = "0 12px";
    lessonLinkContainer.style.paddingLeft = "12px";
    lessonLinkContainer.style.paddingRight = "12px";
    lessonLinkContainer.style.fontSize = "14px";
    lessonLinkContainer.style.lineHeight = "20px";
  });

  //STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
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

  // const copyIcon = document.querySelector('.checkbox-icon');
  // const lessonContentContainer = document.querySelector('sjwc-lesson-content-item');
  // const codeBlocks = lessonContentContainer.querySelectorAll('pre');
  //HANDLE CODE BLOCK CUSTOM STYLING

  function animateCopiedTooltip(tooltipEl) {
    tooltipEl.style.opacity = "1";

    setTimeout(() => {
      tooltipEl.style.opacity = "0";
    }, 400);
  }

  codeBlocks.forEach((el) => {
    //console.log(el);

    //WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
    el.style.padding = "0";
    el.style.overflow = "visible";
    el.style.position = "relative";
    const codeEl = el.querySelector("code");
    // codeEl.style.display = 'inline-block';
    // codeEl.style.padding = '24px !important';
    codeEl.setAttribute(
      "style",
      "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
    );
    const copyText = codeEl.textContent.trim().replace(/^\$ /g,'');

    //CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "end";
    container.style.borderBottom = "1px solid gainsboro";
    container.style.padding = "12px 24px";

    //CLONE COPYICON EL AND ADD TO CONTAINER
    const iconClone = copyIcon.cloneNode(true);
    iconClone.style.display = "block";
    iconClone.style.cursor = "pointer";
    container.append(iconClone);

    //CREATE 'COPIED' TOOLTIP
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

    //ADD CONTAINER AS FIRST CHILD IN EL
    el.prepend(container);

    //ADD EVENT LISTENER TO CLONED ICON TO COPY CODE BLOCK INTO CLIPBOARD
    iconClone.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyText);
        animateCopiedTooltip(tooltipContainer);
      } catch (err) {
        console.error("Failed to copy codeblock to clipboard: ", err);
      }
    });
  });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => {
    el.setAttribute("target", "_blank");
  });

  //LESSON CONTENT FOOTER
  const prevBtn = document.querySelector(".button-prev-title span");
  if (prevBtn) {
    prevBtn.style.color = "#14003d";
  }

  //FOOTER STYLING
  footerContainer.style.paddingLeft = "40px";
  footerContainer.style.paddingRight = "40px";
  footerCols.forEach((col) => {
    col.style.width = "270px";
  });
}

function desktopLoginPageStyling() {
  const logoImg = document.querySelector(".header-center-img");

  const fbBtn = document.getElementById("facebook_login");
  const googleBtn = document.getElementById("google_login");
  const loginContent = document.getElementById("login-content");
  const tabArrow = document.getElementById("tab-marker-login");
  const termsAndServicesText = document.getElementById("access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orGoogleSignInContainer =
    loginContent.querySelectorAll(".large-6.columns")[1];
  const orGoogleSignInInnerContainer =
    orGoogleSignInContainer.querySelector("ul");
  const orGoogleSignInInnerContainerListItems =
    orGoogleSignInInnerContainer.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const tabsContainer = document.getElementById("tabs");
  const loginTab = document.getElementById("login-tab-left");
  const signInTab = document.getElementById("login-tab-right");
  const signInTabText = signInTab.querySelector("a");
  const longInNote = document.querySelector(".loginNote.sj-text-login-note");
  const orSignInWithContainer = document.querySelector(
    ".socialaccount_providers li"
  );
  const orSignInWithTextEl = orSignInWithContainer.querySelector(
    ".sj-text-sign-in-with span"
  );
  const loginInput = document.getElementById("id_login");
  const passwordInput = document.getElementById("id_password");
  const loginBottomBtn = document.getElementById("button-sign-in");
  const forgotPasswordText = document.querySelector(
    ".forgot-password.sj-text-forgot-password.focus-link-v2"
  );
  const loginBottomBtnAndForgotPassBtn =
    loginBottomBtn.closest(".large-12.columns");

  const loginForm = document.getElementById("login_form");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  ///////STYLE LOGO
  logoImg.style.height = "24px";

  termsAndServicesText.style.maxWidth = "368px";
  // termsAndServicesText.style.color = "#545454";
  termsAndServicesText.style.fontSize = "14px";

  loginForm.append(termsAndServicesText);

  //////STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  // tabs.style.backgroundColor = "#F3F3F3";
  tabs.style.borderRadius = "100px";
  tabs.style.display = "flex";
  tabs.style.padding = "4px";
  loginTab.querySelector("span span").textContent = "Log In";
  loginTab.style.border = "0";
  loginTab.style.display = "flex";
  loginTab.style.padding = "8px 16px";
  loginTab.style.alignItems = "center";
  // loginTab.style.backgroundColor = "#3443F4";
  loginTab.style.textDecoration = "underline";
  loginTab.style.fontFamily = "Space Mono";
  loginTab.style.color = "#3443f4";
  loginTab.style.fontWeight = "700";
  loginTab.style.fontSize = "18px";
  loginTab.style.lineHeight = "24px";
  // loginTab.style.borderRadius = "100px";
  signInTab.querySelector("span").textContent = "Sign Up";
  signInTab.style.display = "flex";
  signInTab.style.alignItems = "center";
  signInTab.style.padding = "8px 16px";
  signInTabText.style.color = "rgba(52, 67, 244, .4)";
  loginTab.style.fontFamily = "Space Mono";
  signInTabText.style.fontWeight = "700";
  signInTabText.style.fontSize = "18px";
  signInTabText.style.lineHeight = "24px";

  //////STYLE THE LOGIN TEXT CONTENT BOX
  loginContentContainer.style.width = "50%";
  orGoogleSignInContainer.style.width = "50%";
  orGoogleSignInInnerContainer.style.paddingLeft = "125px";
  orGoogleSignInInnerContainerListItems.forEach((li) => {
    li.style.padding = "0";
  });

  //

  longInNote.style.display = "none";
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
  //forgotPasswordText.style.height = '48px';
  forgotPasswordText.style.fontSize = "16px";
  forgotPasswordText.style.fontFamily = "Space Mono";
  forgotPasswordText.style.marginBottom = "2px";
  loginBottomBtnAndForgotPassBtn.style.marginBottom = "24px";

  //STYLING OF SIDE 'SIGN IN W/' GOOGLE ELS
  orSignInWithTextEl.textContent = "Or Log In With";
  googleBtn.textContent = "Continue with Google";

  fbBtn.style.display = "none";
  googleBtn.style.background =
    "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)";
  googleBtn.style.width = "auto";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  tabArrow.style.display = "none";

  //FOOTER STYLING
  footerContainer.style.paddingLeft = "40px";
  footerContainer.style.paddingRight = "40px";
  footerCols.forEach((col) => {
    col.style.width = "270px";
  });
}

function desktopSignUpPageStyling() {
  const logoImg = document.querySelector(".header-center-img");
  const fbBtn = document.getElementById("facebook_login");
  const googleBtn = document.getElementById("google_login");
  const loginContent = document.getElementById("login-content");
  const tabArrow = document.getElementById("tab-marker-signup");
  const termsAndServicesText = document.getElementById("access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orSignInWithGoogleContainer = loginContent.querySelectorAll(
    ".row .large-6.columns"
  )[3];
  //console.log("orSignInWithGoogleContainer: ", orSignInWithGoogleContainer);
  const orSignInWithGoogleList =
    orSignInWithGoogleContainer.querySelector("ul");
  const orSignInWithGoogleItems = orSignInWithGoogleList.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const tabsContainer = document.getElementById("tabs");
  const loginTab = document.getElementById("login-tab-left");
  loginTab;
  const loginTabText = loginTab.querySelector("a");
  const signInTab = document.getElementById("login-tab-right");
  const signInTabText = signInTab.querySelector("span");
  const longInNote = document.querySelector(".loginNote.sj-text-login-note");
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
  const loginInput = document.getElementById("id_email");
  const passwordInput = document.getElementById("id_password1");
  const passwordInput2 = document.getElementById("id_password2");
  const signUpBottomBtn = document.getElementById("button-sign-up");
  const forgotPasswordText = document.querySelector(
    ".forgot-password.sj-text-forgot-password.focus-link-v2"
  );
  const signUpForm = document.getElementById("signup_form");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  termsAndServicesText.style.maxWidth = "368px";
  termsAndServicesText.style.color = "#545454";
  termsAndServicesText.style.fontSize = "14px";
  signUpForm.append(termsAndServicesText);

  ///////STYLE LOGO
  logoImg.style.height = "24px";

  //////STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  // tabs.style.backgroundColor = "#F3F3F3";
  tabs.style.borderRadius = "100px";
  tabs.style.display = "flex";
  tabs.style.padding = "4px";
  loginTabText.querySelector("span").textContent = "Log In";
  loginTab.style.border = "0";
  loginTab.style.display = "flex";
  loginTab.style.padding = "8px 16px";
  loginTab.style.alignItems = "center";
  loginTabText.style.color = "rgba(52, 67, 244, .4)";
  loginTabText.style.fontWeight = "700";
  loginTabText.style.fontSize = "18px";
  loginTabText.style.fontFamily = "Space Mono";
  loginTabText.style.lineHeight = "24px";
  loginTab.style.borderRadius = "100px";
  signInTab.style.display = "flex";
  signInTab.style.alignItems = "center";
  signInTab.style.padding = "8px 16px";
  // signInTab.style.backgroundColor = "#3443F4";
  signInTab.style.borderRadius = "100px";
  signInTabText.textContent = "Sign up";
  signInTabText.style.color = "#3443f4";
  signInTabText.style.textDecoration = "underline";
  signInTabText.style.fontFamily = "Space Mono";
  signInTabText.style.fontWeight = "700";
  signInTabText.style.fontSize = "18px";
  signInTabText.style.lineHeight = "24px";

  //////STYLE THE SIGNUP TEXT CONTENT BOX
  loginContentContainer.style.width = "50%";
  orSignInWithGoogleContainer.style.width = "50%";
  orSignInWithGoogleContainer.style.paddingLeft = "100px";
  orSignInWithGoogleList.style.paddingLeft = "25px";
  orSignInWithGoogleItems.forEach((li) => {
    li.style.padding = "0";
  });
  // const orSignInWithGoogleList = orSignInWithGoogleContainer.querySelector('ul');
  // const orSignInWithGoogleItems
  //

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

  //STYLING OF RIGHT SIDE, OR SIGN UP WITH GOOGLE, TEXT AND BTN
  orSignInWithTextSpan.textContent = "Or Sign Up With";
  googleBtn.textContent = "Continue with Google";

  fbBtn.style.display = "none";
  googleBtn.style.background =
    "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)";
  googleBtn.style.width = "auto";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  tabArrow.style.display = "none";

  const labels = document.querySelectorAll("label");
  labels.forEach((label) => {
    label.style.marginBottom = "12px";
    label.style.fontWeight = "500";
    label.style.fontSize = "16px";
    label.style.fontFamily = "Fusiona";
    label.style.lineHeight = "20px";

    //            console.log(label.getAttribute('for'));
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

  //FOOTER STYLING
  footerContainer.style.paddingLeft = "40px";
  footerContainer.style.paddingRight = "40px";
  footerCols.forEach((col) => {
    col.style.width = "270px";
  });
}

function desktopCurriculumPageNoCertificateStyling() {
  const courseDescription = skilljarCourse.short_description;

  const logoImg = document.querySelector(".header-center-img");

  //HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  ); //DUPLICATE VAR
  const btn = document.getElementById("resume-button"); //DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector(".back-to-catalog");

  backToCatalogLink.style.display = "none";

  const curriculumPageHeader = document.querySelector(
    ".top-row-grey.top-row-white-v2.padding-side.row-v2"
  );
  const headerTextAndImgContainer = document.querySelector(
    ".row.dp-row-flex-v2"
  );
  const sjHeaderTextContainer = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  );
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
  const resumeBtn = document.getElementById("resume-button");
  let btnText, btnHref;
  if (resumeBtn) {
    btnText = resumeBtn.querySelector(".button span").textContent;
    btnHref = resumeBtn.querySelector(".button").getAttribute("href");
  }

  //BODY VARIABLES
  const bodyMainContainer = document.getElementById("cp-content");
  const InnerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");
  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.getElementById("curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  ///////STYLE LOGO
  logoImg.style.height = "24px";

  //TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  //CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  let courseDetailCardListItems;
  if (courseDetailsCard) {
    courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  }
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.marginTop = "96px";
  bodyMainContainer.style.gridTemplateColumns =
    "minmax(100px, 760px) minmax(100px, 368px)";
  if (courseDetailsCard) {
    courseDetailsCard.style.margin = "96px 0 46px 0";
    bodyMainContainer.append(courseDetailsCard);

    if (!resumeBtn) {
      courseDetailsCardLink.style.display = "none";
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
  InnerContentContainer.style.width = "100%";

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  sjHeaderTextSubheading.style.display = "none";
  sjHeaderTextProgressBar.style.display = "none";

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundColor = "#D0CFEE";
  curriculumPageHeader.style.border = "0";

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = "static";
  sjHeaderTextContainer.style.padding = "0";
  sjHeaderTextContainer.style.maxWidth = "564px";
  //sjHeaderTextContainer.style.height = '376px';
  //      sjHeaderTextContainer.style.marginRight = '96px';
  sjHeaderTextContainer.style.border = "0";
  sjHeaderTextContainer.style.textAlign = "left";
  if (resumeBtn) {
    resumeBtn.style.marginLeft = "0";
    resumeBtn.style.marginRight = "0";
  }
  //IMG CONTAINER
  sjHeaderImgContainer.style.position = "static";
  sjHeaderImgContainer.style.padding = "0";
  sjHeaderImgContainer.style.width = "564px";
  sjHeaderImgContainer.style.height = "auto";
  sjHeaderImgDirectContainer.style.maxHeight = "none";
  sjHeaderImg.style.maxHeight = "none";
  //      sjHeaderImg.style.width = '564px';
  sjHeaderImg.style.height = "auto";
  sjHeaderImg.style.maxWidth = "100%";
  //PARENT CONTAINER
  headerTextAndImgContainer.style.margin = "96px 0";
  headerTextAndImgContainer.style.justifyContent = "center";
  headerTextAndImgContainer.style.flexWrap = "nowrap";
  headerTextAndImgContainer.style.gap = "24px";

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.textContent = courseDescription;
  headingParagraph.style.display = "block";
  headingFloaterText.style.display = "block";

  if (resumeBtn) {
    // container.append(headingFloaterText, mainHeading, headingParagraph, btn);
    container.append(
      headingFloaterText,
      mainHeading,
      headingParagraph,
      resumeBtn
    );
  } else {
    container.append(headingFloaterText, mainHeading, headingParagraph);
  }

  ///////CURRICULUM PAGE BODY STYLING
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
    aboutSection.querySelector(".title").style.display = "none";
    aboutSection.querySelector(".content").style.border = "0";
    aboutSection.querySelector(".content").style.padding = "0";
  }
  curriculumSection.querySelector(".title").style.display = "none";
  curriculumSection.querySelector("h2").style.fontWeight = "600";
  curriculumSection.querySelector(".content").style.border = "0";
  curriculumSection.querySelector(".content").style.padding = "0";

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!initialLoadComplete) {
    //add vars to global
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    let groupIsOpen = false;
    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    // const startingGroup = document.createElement("div");
    // styleGroupHeading(startingGroup);
    // curContainer.append(startingGroup);

    function styleGroupContainer(container) {
      container.style.border = "2px solid #3443f4";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonEl, isLastChild) {
      lessonEl.style.padding = "24px";
      lessonEl.style.fontSize = "16px";
      lessonEl.style.fontWeight = "400";
      lessonEl.style.lineHeight = "150%";
      if (!isLastChild) {
        lessonEl.style.borderBottom = "2px solid #3443f4";
      }
    }

    function styleGroupHeading(groupHeadingContainer) {
      // console.log('groupHeading: ', groupHeading)

      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "2px solid #3443f4";

      //get actual group heading
      const groupHeading =
        groupHeadingContainer.querySelector("h3") || groupHeadingContainer;

      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontFamily = "Fusiona";
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
    //console.log('curriculumItemsListNonLive: ', curriculumItemsListNonLive);

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === "DIV") {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement("div");
        newGroupHeading.style.display = "flex";
        newGroupHeading.style.gap = "12px";
        const groupH3Tag = document.createElement("h3");

        groupH3Tag.textContent = el.querySelector("h3").textContent;
        newGroupHeading.append(groupH3Tag);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        el.style.display = "none";
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true
        );

        el.querySelector(".title").style.textWrap = "wrap";

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector("h2").style.display = "none";
    curriculumOutsideContainer.querySelector("hr").style.display = "none";

    globalCurriculumSection.setAttribute(
      "style",
      "padding: 0 !important; margin-top: 48px !important;"
    );
    globalAboutSection.setAttribute("style", "padding: 0 !important");
  }

  ////////CURRICULUM ITSELF STYLING
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

function desktopCurriculumPageYesCertificationStyling() {
  const courseDescription = skilljarCourse.short_description;
  console.log("courseDescription: ", courseDescription);

  const logoImg = document.querySelector(".header-center-img");

  //HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  ); //DUPLICATE VAR
  //const btn = document.getElementById('resume-button');  //DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector(".back-to-catalog");

  backToCatalogLink.style.display = "none";

  const curriculumPageHeader = document.querySelector(
    ".top-row-grey.top-row-white-v2.padding-side.row-v2"
  );
  const headerTextAndImgContainer = document.querySelector(
    ".row.dp-row-flex-v2"
  );
  const sjHeaderTextContainer = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  );
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
  const resumeBtn = document.getElementById("resume-button");
  //      const btnText = resumeBtn.querySelector('.button span').textContent;
  //      const btnHref = resumeBtn.querySelector('.button').getAttribute("href");

  //BODY VARIABLES
  const bodyMainContainer = document.getElementById("cp-content");
  const InnerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");

  ///////STYLE LOGO
  logoImg.style.height = "24px";

  //TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.getElementById("curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  //CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.marginTop = "96px";
  bodyMainContainer.style.gridTemplateColumns =
    "minmax(100px, 760px) minmax(100px, 368px)";
  if (courseDetailsCard) {
    courseDetailsCard.style.margin = "96px 0 46px 0";
    bodyMainContainer.append(courseDetailsCard);

    courseDetailsCardLink.style.display = "none";
    //                courseDetailsCardLink.setAttribute("href", btnHref);
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
  InnerContentContainer.style.width = "100%";

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  sjHeaderTextSubheading.style.display = "none";
  sjHeaderTextProgressBar.style.display = "none";

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundImage =
    "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
  curriculumPageHeader.style.border = "0";

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = "static";
  sjHeaderTextContainer.style.padding = "0";
  sjHeaderTextContainer.style.maxWidth = "564px";
  //sjHeaderTextContainer.style.height = '376px';
  //      sjHeaderTextContainer.style.marginRight = '96px';
  sjHeaderTextContainer.style.border = "0";
  sjHeaderTextContainer.style.textAlign = "left";
  //      resumeBtn.style.marginLeft = '0';
  //      resumeBtn.style.marginRight = '0';
  //IMG CONTAINER
  sjHeaderImgContainer.style.position = "static";
  sjHeaderImgContainer.style.padding = "0";
  sjHeaderImgContainer.style.width = "564px";
  sjHeaderImgContainer.style.height = "auto";
  sjHeaderImgDirectContainer.style.maxHeight = "none";
  sjHeaderImg.style.maxHeight = "none";
  //      sjHeaderImg.style.width = '564px';
  sjHeaderImg.style.height = "auto";
  sjHeaderImg.style.maxWidth = "100%";
  //PARENT CONTAINER
  headerTextAndImgContainer.style.margin = "96px 0";
  headerTextAndImgContainer.style.justifyContent = "center";
  headerTextAndImgContainer.style.flexWrap = "nowrap";
  headerTextAndImgContainer.style.gap = "24px";

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.textContent = courseDescription;
  headingParagraph.style.display = "block";
  headingFloaterText.style.display = "block";
  // container.append(
  //   headingFloaterText,
  //   mainHeading,
  //   headingParagraph
  // );
  container.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    certificateEl
  );

  ///////CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = "0 0 46px 0";
  bodyMainContainer.style.paddingTop = "0";
  bodyMainContainer.style.paddingBottom = "0";
  aboutSection.classList.add("active");
  curriculumSection.style.marginTop = "48px";

  aboutSection.querySelector("h3").style.fontWeight = "600";
  aboutSection.querySelector(".title").style.display = "none";
  aboutSection.querySelector(".content").style.border = "0";
  aboutSection.querySelector(".content").style.padding = "0";
  curriculumSection.querySelector(".title").style.display = "none";
  curriculumSection.querySelector("h2").style.fontWeight = "600";
  curriculumSection.querySelector(".content").style.border = "0";
  curriculumSection.querySelector(".content").style.padding = "0";

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!initialLoadComplete) {
    //set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    let groupIsOpen = false;
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    // const startingGroup = document.createElement("div");
    // styleGroupHeading(startingGroup);
    // curContainer.append(startingGroup);

    function styleGroupContainer(container) {
      container.style.border = "2px solid #3443f4";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonEl, isLastChild) {
      lessonEl.style.padding = "24px";
      lessonEl.style.fontSize = "16px";
      lessonEl.style.fontWeight = "400";
      lessonEl.style.lineHeight = "150%";
      if (!isLastChild) {
        lessonEl.style.borderBottom = "2px solid #3443f4";
      }
    }

    function styleGroupHeading(groupHeadingContainer) {
      // console.log('groupHeading: ', groupHeading)

      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "2px solid #3443f4";

      //get actual group heading
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
    //console.log('curriculumItemsListNonLive: ', curriculumItemsListNonLive);

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === "DIV") {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement("div");
        newGroupHeading.style.display = "flex";
        newGroupHeading.style.gap = "12px";
        const groupH3Tag = document.createElement("h3");

        groupH3Tag.textContent = el.querySelector("h3").textContent;
        newGroupHeading.append(groupH3Tag);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        el.style.display = "none";
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true
        );
        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector("h2").style.display = "none";
    curriculumOutsideContainer.querySelector("hr").style.display = "none";
  }

  ////////CURRICULUM ITSELF STYLING
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

//MOBILE VIEW STYLINGS
function mobileLoginPageStyling() {
  //NAV VARS
  const logoImg = document.querySelector(".header-center-img");

  const fbBtn = document.getElementById("facebook_login");
  const googleBtn = document.getElementById("google_login");
  const loginContent = document.getElementById("login-content");
  const tabArrow = document.getElementById("tab-marker-login");
  const termsAndServicesText = document.getElementById("access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orGoogleSignInContainer =
    loginContent.querySelectorAll(".large-6.columns")[1];
  const orGoogleSignInInnerContainer =
    orGoogleSignInContainer.querySelector("ul");
  const orGoogleSignInInnerContainerListItems =
    orGoogleSignInInnerContainer.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const tabsContainer = document.getElementById("tabs");
  const loginTab = document.getElementById("login-tab-left");
  const signInTab = document.getElementById("login-tab-right");
  const signInTabText = signInTab.querySelector("a");
  const longInNote = document.querySelector(".loginNote.sj-text-login-note");
  const orSignInWithContainer = document.querySelector(
    ".socialaccount_providers li"
  );
  const orSignInWithTextEl = orSignInWithContainer.querySelector(
    ".sj-text-sign-in-with span"
  );
  const loginInput = document.getElementById("id_login");
  const passwordInput = document.getElementById("id_password");
  const loginBottomBtn = document.getElementById("button-sign-in");
  const forgotPasswordText = document.querySelector(
    ".forgot-password.sj-text-forgot-password.focus-link-v2"
  );
  const loginBottomBtnAndForgotPassBtn =
    loginBottomBtn.closest(".large-12.columns");

  const loginForm = document.getElementById("login_form");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  //NAV STYLING
  logoImg.style.maxHeight = "48px";

  termsAndServicesText.style.maxWidth = "368px";
  termsAndServicesText.style.color = "#545454";
  termsAndServicesText.style.fontSize = "14px";

  loginForm.append(termsAndServicesText);

  //////STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  tabs.style.backgroundColor = "#F3F3F3";
  tabs.style.borderRadius = "100px";
  tabs.style.display = "flex";
  tabs.style.padding = "4px";
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

  //////STYLE THE LOGIN TEXT CONTENT BOX
  loginContentContainer.style.width = "100%";
  orGoogleSignInContainer.style.width = "100%";
  orGoogleSignInInnerContainer.style.padding = "0";
  orGoogleSignInInnerContainerListItems.forEach((li) => {
    li.style.padding = "0";
  });

  //
  longInNote.style.display = "none";
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
  //forgotPasswordText.style.height = '48px';
  forgotPasswordText.style.fontSize = "16px";
  forgotPasswordText.style.marginBottom = "2px";
  loginBottomBtnAndForgotPassBtn.style.marginBottom = "24px";

  //STYLING OF SIDE 'SIGN IN W/' GOOGLE ELS
  orSignInWithTextEl.textContent = "or log in with";
  googleBtn.textContent = "Continue with Google";

  fbBtn.style.display = "none";
  googleBtn.style.backgroundColor = "#3443F4";
  googleBtn.style.width = "100%";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  tabArrow.style.display = "none";

  //FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

function mobileSignUpPageStyling() {
  console.log("SIGN UP PAGE VIEW");
  const logoImg = document.querySelector(".header-center-img");
  const fbBtn = document.getElementById("facebook_login");
  const googleBtn = document.getElementById("google_login");
  const loginContent = document.getElementById("login-content");
  const tabArrow = document.getElementById("tab-marker-signup");
  const termsAndServicesText = document.getElementById("access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orSignInWithGoogleContainer = loginContent.querySelectorAll(
    ".row .large-6.columns"
  )[3];
  //console.log("orSignInWithGoogleContainer: ", orSignInWithGoogleContainer);
  const orSignInWithGoogleList =
    orSignInWithGoogleContainer.querySelector("ul");
  const orSignInWithGoogleItems = orSignInWithGoogleList.querySelectorAll("li");

  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const tabsContainer = document.getElementById("tabs");
  const loginTab = document.getElementById("login-tab-left");
  loginTab;
  const loginTabText = loginTab.querySelector("a");
  const signInTab = document.getElementById("login-tab-right");
  const signInTabText = signInTab.querySelector("span");
  const longInNote = document.querySelector(".loginNote.sj-text-login-note");
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
  const loginInput = document.getElementById("id_email");
  const passwordInput = document.getElementById("id_password1");
  const passwordInput2 = document.getElementById("id_password2");
  const signUpBottomBtn = document.getElementById("button-sign-up");
  const forgotPasswordText = document.querySelector(
    ".forgot-password.sj-text-forgot-password.focus-link-v2"
  );
  const signUpForm = document.getElementById("signup_form");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  termsAndServicesText.style.maxWidth = "368px";
  termsAndServicesText.style.color = "#545454";
  termsAndServicesText.style.fontSize = "14px";
  signUpForm.append(termsAndServicesText);

  ///////STYLE LOGO
  logoImg.style.minHeight = "48px";

  //////STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";
  tabs.style.backgroundColor = "#F3F3F3";
  tabs.style.borderRadius = "100px";
  tabs.style.display = "flex";
  tabs.style.padding = "4px";
  loginTabText.querySelector("span").textContent = "Log in";
  loginTab.style.border = "0";
  loginTab.style.display = "flex";
  loginTab.style.padding = "8px 16px";
  loginTab.style.alignItems = "center";
  loginTabText.style.color = "#8C8C8C";
  loginTabText.style.fontWeight = "500";
  loginTabText.style.fontSize = "16px";
  loginTabText.style.lineHeight = "24px";
  loginTab.style.borderRadius = "100px";
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

  //////STYLE THE SIGNUP TEXT CONTENT BOX
  loginContentContainer.style.width = "100%";
  orSignInWithGoogleContainer.style.width = "100%";
  orSignInWithGoogleContainer.style.padding = "0";
  orSignInWithGoogleList.style.padding = "0";
  orSignInWithGoogleItems.forEach((li) => {
    li.style.padding = "0";
  });

  // const orSignInWithGoogleList = orSignInWithGoogleContainer.querySelector('ul');
  // const orSignInWithGoogleItems

  //
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

  //STYLING OF RIGHT SIDE, OR SIGN UP WITH GOOGLE, TEXT AND BTN
  orSignInWithTextSpan.textContent = "or sign up with";
  googleBtn.textContent = "Continue with Google";

  fbBtn.style.display = "none";
  googleBtn.style.backgroundColor = "#3443F4";
  googleBtn.style.width = "100%";
  googleBtn.style.textAlign = "center";
  loginContent.style.border = "0";
  tabArrow.style.display = "none";

  const labels = document.querySelectorAll("label");
  labels.forEach((label) => {
    label.style.marginBottom = "12px";
    label.style.fontWeight = "500";
    label.style.fontSize = "16px";
    label.style.lineHeight = "20px";

    //            console.log(label.getAttribute('for'));
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

  //FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

function mobileCourseDetailsPageStyling() {
  //NAV VARS
  const navLogoImg = document.querySelector(".header-center-img");

  const headerContainer = document.querySelector(
    ".top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2"
  );
  const headerFlexContainer = document.querySelector(".row.dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const registerBtn = document.getElementById("purchase-button-wrapper-large");
  const mainHeadingContainer = document.querySelector(
    ".columns.text-center.large-6.dp-summary-wrapper.text-left-v2"
  );
  const mainVideoContainer = document.querySelector(
    ".columns.large-6.text-center.dp-promo-image-wrapper"
  );
  const backToCatalogBtn = document.querySelector(".back-to-catalog");
  const videoContainer = document.querySelector(".video-max");
  //SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector(".signin");
  const signInBtn = document.querySelector(
    ".header-link.login-link.sj-text-sign-in.focus-link-v2"
  );
  ////BODY VARIABLES
  const bodyContainer = document.getElementById("dp-details");
  const mobileBodyContent = document.querySelector(".row.show-for-small");
  const secondaryBodyContainer = document.querySelector(
    ".row.hide-for-small.padded-side-bottom"
  );
  //console.log('secondaryBodyContainer: ', secondaryBodyContainer)
  const bodyColumns = secondaryBodyContainer.querySelectorAll(".columns");
  const curriculumListContainer = document.querySelector(".dp-curriculum"); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  const curriculumListHeader = curriculumListContainer
    .closest(".sj-curriculum-wrapper")
    .querySelector("h3");
  const curriculumList = curriculumListContainer.querySelectorAll("li");

  ////CARD VARIABLES
  const courseDetailCardContainer = document.querySelectorAll(
    ".course-details-card"
  )[0];
  const courseDetailCardListItems =
    courseDetailCardContainer.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const registerBtnLink = document
    .getElementById("purchase-button")
    .getAttribute("href");
  const registerBtnText = document.querySelector(
    ".purchase-button-full-text"
  ).textContent;
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  backToCatalogBtn.style.display = "none";
  //mobileBodyContent.style.display = "none";
  mobileBodyContent.setAttribute("style", "display: none !important;");

  //NAV STYLING
  navLogoImg.style.maxHeight = "48px";
  if (signInHeaderText) {
    signInHeaderText.style.display = "none";
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

  //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = "0";
  mainHeadingContainer.style.maxWidth = "none";
  mainHeadingContainer.style.width = "100%";
  mainHeadingContainer.querySelector(".sj-course-info-wrapper").style.display =
    "none";
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

  //VIDEO STYLING
  mainVideoContainer.style.padding = "0";
  mainVideoContainer.style.maxWidth = "none";
  mainVideoContainer.style.width = "100%";
  videoContainer.style.maxWidth = "none";
  videoContainer.style.paddingLeft = "15px";
  videoContainer.style.paddingRight = "15px";

  //COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = "0";
  bodyContainer.style.margin = "72px auto -10px auto";
  bodyContainer.style.maxWidth = "min(1152px, 90%)";
  bodyContainer.style.display = "grid";
  bodyContainer.style.gridTemplateColumns = "1fr";
  bodyContainer.style.columnGap = "24px";

  //secondaryBodyContainer.style.padding = "0";
  //secondaryBodyContainer.style.maxWidth = "760px";
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

  //COURSE DETAILS CURRICULUM STYLING
  if (!initialLoadComplete) {
    let groupIsOpen = false;
    const hasSections = curriculumListContainer.querySelector(".section")
      ? true
      : false;
    let curContainer = document.createElement("li");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    // const startingGroup = document.createElement("div");
    // styleGroupHeading(startingGroup);
    // curContainer.append(startingGroup);

    function styleGroupContainer(container) {
      container.style.border = "1px solid #DCDCDC";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonItem, isLastChild) {
      //display none for icon w/ class 'type-icon'
      const icon = lessonItem.querySelector(".type-icon");
      icon.style.display = "none";

      const lessonItemText = lessonItem.querySelector(".lesson-wrapper");
      lessonItemText.style.padding = "24px";
      lessonItemText.style.fontSize = "16px";
      lessonItemText.style.fontWeight = "400";
      lessonItemText.style.lineHeight = "150%";

      if (!isLastChild) {
        lessonItemText.style.borderBottom = "1px solid #DCDCDC";
      }
    }

    function styleGroupHeading(groupHeading) {
      // console.log('groupHeading: ', groupHeading)
      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = "16px";
      groupHeading.style.fontWeight = "500";
      groupHeading.style.lineHeight = "125%";
      groupHeading.style.letterSpacing = "-.16px";
      groupHeading.style.padding = "24px";
      groupHeading.style.borderBottom = "1px solid #DCDCDC";
      curContainer.append(groupHeading);
    }

    curriculumList.forEach((curListItem, i, arr) => {
      //first check if current item contains 'section' class
      if (curListItem.classList.contains("section")) {
        //Yes? push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);
        //reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement("li");
        styleGroupContainer(curContainer);
        const newGroupHeading = document.createElement("div");
        newGroupHeading.innerHTML = curListItem.innerHTML;
        styleGroupHeading(newGroupHeading);
        curContainer.append(newGroupHeading);
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const newListItem = document.createElement("div");
        newListItem.innerHTML = curListItem.innerHTML;
        styleListItem(
          newListItem,
          arr[i + 1] ? arr[i + 1].classList.contains("section") : true
        );
        curContainer.append(newListItem);
      }
      curListItem.style.display = "none";
    });

    //LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    curriculumListHeader.style.display = "none";
    curriculumListContainer.style.padding = "0";

    //COURSE DETAILS CARD STYLING
    //ADD COURSE DETAILS CARD INTO RIGHT CONTAINER
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

  //COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  courseDetailCardContainer.style.margin = "0 0 46px 0";
  courseDetailCardContainer.style.justifySelf = "center";

  //FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

function mobileCurriculumPageNoCertificateStyling() {
  "textWrap";

  //NAV VARS
  const navLogoImg = document.querySelector(".header-center-img");

  //HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  ); //DUPLICATE VAR
  const btn = document.getElementById("resume-button"); //DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector(".back-to-catalog");

  backToCatalogLink.style.display = "none";

  const curriculumPageHeader = document.querySelector(
    ".top-row-grey.top-row-white-v2.padding-side.row-v2"
  );
  const headerTextAndImgContainer = document.querySelector(
    ".row.dp-row-flex-v2"
  );
  const sjHeaderTextContainer = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  );
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
  const resumeBtn = document.getElementById("resume-button");
  const btnText = resumeBtn.querySelector(".button span").textContent;
  const btnHref = resumeBtn.querySelector(".button").getAttribute("href");

  //BODY VARIABLES
  const bodyMainContainer = document.getElementById("cp-content");
  const InnerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");
  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.getElementById("curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  //TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  //CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  //NAV STYLING
  navLogoImg.style.maxHeight = "48px";

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.gridTemplateColumns = "1fr";
  bodyMainContainer.style.width = "90%";

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

  bodyMainContainer.style.columnGap = "24px";
  InnerContentContainer.style.width = "100%";

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  sjHeaderTextSubheading.style.display = "none";
  sjHeaderTextProgressBar.style.display = "none";

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundImage =
    "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
  curriculumPageHeader.style.border = "0";

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = "static";
  sjHeaderTextContainer.style.padding = "0";
  sjHeaderTextContainer.style.maxWidth = "none";
  sjHeaderTextContainer.style.width = "100%";
  sjHeaderTextContainer.style.marginBottom = "32px";

  sjHeaderTextContainer.style.border = "0";
  sjHeaderTextContainer.style.textAlign = "left";
  resumeBtn.style.marginLeft = "0";
  resumeBtn.style.marginRight = "0";
  //IMG CONTAINER
  sjHeaderImgContainer.style.position = "static";
  sjHeaderImgContainer.style.padding = "0";
  sjHeaderImgContainer.style.width = "90%";
  sjHeaderImgContainer.style.maxWidth = "564px";
  sjHeaderImgContainer.style.height = "auto";
  sjHeaderImgDirectContainer.style.maxHeight = "none";
  sjHeaderImg.style.maxHeight = "none";
  //      sjHeaderImg.style.width = '564px';
  sjHeaderImg.style.height = "auto";
  sjHeaderImg.style.maxWidth = "100%";
  //PARENT CONTAINER
  container.style.width = "90%";
  headerTextAndImgContainer.style.margin = "96px 0";
  headerTextAndImgContainer.style.justifyContent = "center";
  headerTextAndImgContainer.style.flexWrap = "wrap";
  headerTextAndImgContainer.style.gap = "24px";

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.style.display = "block";
  headingFloaterText.style.display = "block";
  container.append(headingFloaterText, mainHeading, headingParagraph, btn);

  ///////CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = "96px 0 46px 0";
  bodyMainContainer.style.paddingTop = "0";
  bodyMainContainer.style.paddingBottom = "0";
  aboutSection.classList.add("active");
  curriculumSection.style.marginTop = "48px";

  aboutSection.querySelector("h3").style.fontWeight = "600";
  aboutSection.querySelector(".title").style.display = "none";
  aboutSection.querySelector(".content").style.border = "0";
  aboutSection.querySelector(".content").style.padding = "0";
  curriculumSection.querySelector(".title").style.display = "none";
  const curriculumSectionH2 = curriculumSection.querySelector("h2");
  if (curriculumSectionH2) {
    curriculumSectionH2.style.fontWeight = "600";
  }
  curriculumSection.querySelector(".content").style.border = "0";
  curriculumSection.querySelector(".content").style.padding = "0";

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!initialLoadComplete) {
    //set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    let groupIsOpen = false;
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    // const startingGroup = document.createElement("div");
    // styleGroupHeading(startingGroup);
    // curContainer.append(startingGroup);

    function styleGroupContainer(container) {
      container.style.border = "1px solid #DCDCDC";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonEl, isLastChild) {
      lessonEl.style.padding = "24px";
      lessonEl.style.fontSize = "16px";
      lessonEl.style.fontWeight = "400";
      lessonEl.style.lineHeight = "150%";
      if (!isLastChild) {
        lessonEl.style.borderBottom = "1px solid #DCDCDC";
      }
    }

    function styleGroupHeading(groupHeadingContainer) {
      // console.log('groupHeading: ', groupHeading)

      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "1px solid #DCDCDC";

      //get actual group heading
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
    //console.log('curriculumItemsListNonLive: ', curriculumItemsListNonLive);

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === "DIV") {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement("div");
        newGroupHeading.style.display = "flex";
        newGroupHeading.style.gap = "12px";
        const groupH3Tag = document.createElement("h3");

        groupH3Tag.textContent = el.querySelector("h3").textContent;
        newGroupHeading.append(groupH3Tag);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        el.style.display = "none";
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true
        );
        //styling for mobile
        console.log("wrap ran");
        el.querySelector(".title").style.textWrap = "wrap";
        console.log("wrap ran DONE");

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector("h2").style.display = "none";
    curriculumOutsideContainer.querySelector("hr").style.display = "none";
  }

  ////////CURRICULUM ITSELF STYLING
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

  //FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

function mobileCurriculumPageYesCertificateStyling() {
  //NAV VARS
  const navLogoImg = document.querySelector(".header-center-img");

  //HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  ); //DUPLICATE VAR
  //const btn = document.getElementById("resume-button"); //DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector(".back-to-catalog");

  backToCatalogLink.style.display = "none";

  const curriculumPageHeader = document.querySelector(
    ".top-row-grey.top-row-white-v2.padding-side.row-v2"
  );
  const headerTextAndImgContainer = document.querySelector(
    ".row.dp-row-flex-v2"
  );
  const sjHeaderTextContainer = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  );
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
  //const resumeBtn = document.getElementById("resume-button");
  //const btnText = resumeBtn.querySelector(".button span").textContent;
  //const btnHref = resumeBtn.querySelector(".button").getAttribute("href");

  //BODY VARIABLES
  const bodyMainContainer = document.getElementById("cp-content");
  const InnerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll("section");

  //TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.getElementById("curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest(".content");

  //CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const courseDetailsCardLink = document.querySelector(
    ".course-details-card-link"
  );

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  //NAV STYLING
  navLogoImg.style.maxHeight = "48px";

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.gridTemplateColumns = "1fr";
  bodyMainContainer.style.width = "90%";

  courseDetailsCard.style.margin = "32px 0 56px 0";
  courseDetailsCard.style.justifySelf = "center";
  bodyMainContainer.append(courseDetailsCard);

  //courseDetailsCardLink.textContent = btnText;
  //courseDetailsCardLink.setAttribute("href", btnHref);
  courseDetailsCardLink.style.display = "none";

  if (!initialLoadComplete) {
    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      iconClone.style.display = "block";
      iconClone.style.flexShrink = "0";
      li.prepend(iconClone);
    });
  }

  bodyMainContainer.style.columnGap = "24px";
  InnerContentContainer.style.width = "100%";

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  sjHeaderTextSubheading.style.display = "none";
  sjHeaderTextProgressBar.style.display = "none";

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundImage =
    "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
  curriculumPageHeader.style.border = "0";

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = "static";
  sjHeaderTextContainer.style.padding = "0";
  sjHeaderTextContainer.style.maxWidth = "none";
  sjHeaderTextContainer.style.width = "100%";
  sjHeaderTextContainer.style.marginBottom = "32px";

  sjHeaderTextContainer.style.border = "0";
  sjHeaderTextContainer.style.textAlign = "left";
  //resumeBtn.style.marginLeft = "0";
  //resumeBtn.style.marginRight = "0";
  //IMG CONTAINER
  sjHeaderImgContainer.style.position = "static";
  sjHeaderImgContainer.style.padding = "0";
  sjHeaderImgContainer.style.width = "90%";
  sjHeaderImgContainer.style.maxWidth = "564px";
  sjHeaderImgContainer.style.height = "auto";
  sjHeaderImgDirectContainer.style.maxHeight = "none";
  sjHeaderImg.style.maxHeight = "none";
  //      sjHeaderImg.style.width = '564px';
  sjHeaderImg.style.height = "auto";
  sjHeaderImg.style.maxWidth = "100%";
  //PARENT CONTAINER
  container.style.width = "90%";
  headerTextAndImgContainer.style.margin = "96px 0";
  headerTextAndImgContainer.style.justifyContent = "center";
  headerTextAndImgContainer.style.flexWrap = "wrap";
  headerTextAndImgContainer.style.gap = "24px";

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.style.display = "block";
  headingFloaterText.style.display = "block";
  container.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    certificateEl
  );
  ///////CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = "96px 0 46px 0";
  bodyMainContainer.style.paddingTop = "0";
  bodyMainContainer.style.paddingBottom = "0";
  aboutSection.classList.add("active");
  curriculumSection.style.marginTop = "48px";

  aboutSection.querySelector("h3").style.fontWeight = "600";
  aboutSection.querySelector(".title").style.display = "none";
  aboutSection.querySelector(".content").style.border = "0";
  aboutSection.querySelector(".content").style.padding = "0";
  curriculumSection.querySelector(".title").style.display = "none";
  curriculumSection.querySelector("h2").style.fontWeight = "600";
  curriculumSection.querySelector(".content").style.border = "0";
  curriculumSection.querySelector(".content").style.padding = "0";

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!initialLoadComplete) {
    //set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    let groupIsOpen = false;
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    // const startingGroup = document.createElement("div");
    // styleGroupHeading(startingGroup);
    // curContainer.append(startingGroup);

    function styleGroupContainer(container) {
      container.style.border = "1px solid #DCDCDC";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonEl, isLastChild) {
      lessonEl.style.padding = "24px";
      lessonEl.style.fontSize = "16px";
      lessonEl.style.fontWeight = "400";
      lessonEl.style.lineHeight = "150%";
      if (!isLastChild) {
        lessonEl.style.borderBottom = "1px solid #DCDCDC";
      }
    }

    function styleGroupHeading(groupHeadingContainer) {
      // console.log('groupHeading: ', groupHeading)

      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "1px solid #DCDCDC";

      //get actual group heading
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
    //console.log('curriculumItemsListNonLive: ', curriculumItemsListNonLive);

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === "DIV") {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement("div");
        newGroupHeading.style.display = "flex";
        newGroupHeading.style.gap = "12px";
        const groupH3Tag = document.createElement("h3");

        groupH3Tag.textContent = el.querySelector("h3").textContent;
        newGroupHeading.append(groupH3Tag);

        styleGroupHeading(newGroupHeading);

        curContainer.append(newGroupHeading);
        el.style.display = "none";
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        styleListItem(
          newListEl,
          curArr[i + 1] ? curArr[i + 1].tagName === "DIV" : true
        );
        //styling for mobile
        el.querySelector(".title").style.textWrap = "wrap";

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector("h2").style.display = "none";
    curriculumOutsideContainer.querySelector("hr").style.display = "none";
  }

  ////////CURRICULUM ITSELF STYLING
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

  //FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

function mobileLessonPageStyling() {
  "left-nav-button";

  //MAIN NAV VARS
  const navLogoImg = document.querySelector(".header-center-img");

  const leftNav = document.getElementById("lp-left-nav");
  const mainLessonContentContainer = document.getElementById("lp-wrapper");
  const mainLessonContentSubContainer = document.getElementById("lp-content");
  const mainLessonInnerContainer = document.getElementById("lesson-body");
  const mainLessonMainContainer = document.getElementById("lesson-main");

  const lessonFooter = document.getElementById("lp-footer");
  const navOpenIcon = document.getElementById("left-nav-button");
  const hamburgerIcon = navOpenIcon.querySelector(".fa.fa-bars");
  const xIcon = navOpenIcon.querySelector(".fa.fa-times");
  const leftNavMobileOverlay = document.getElementById("lpLeftNavBackground");
  const fullScreenBtn = document.querySelector(
    ".toggle-fullscreen.focus-link-v2 "
  );
  /// LESSON BODY VARS
  const lessonInnerContainer = document.getElementById("lesson-main-inner");
  const quizPage = document.querySelector(
    ".course-scrollable-content.course-text-content.quiz"
  );
  const copyIcon = document.querySelector(".copy-icon");
  const lessonContentContainer = document.querySelector(
    "sjwc-lesson-content-item"
  );
  const codeBlocks = document.querySelectorAll("pre:has(code):not(.language-ansi)");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  //MAIN NAV STYLING
  navLogoImg.style.maxHeight = "48px";

  lessonInnerContainer.style.maxWidth = "712px";
  lessonInnerContainer.style.margin = "0 auto";

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  //STYLING TO ALIGN NAV ICON TO RIGHT CORNER AND STICKY
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
  const { width } = getWidthAndCurrentPage();
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

  ///////////////////////////////

  lessonFooter.style.position = "relative";
  lessonFooter.style.border = "0";
  lessonFooter.style.backgroundColor = "transparent";
  //lessonFooter.style.backgroundColor = "red";

  leftNav.style.position = "fixed";
  leftNav.style.backgroundColor = "#f9f9f9";
  leftNav.style.width = "320px";
  leftNav.style.height = "100%";
  leftNav.style.paddingBottom = "40px";
  mainLessonContentContainer.style.height = "100vh";
  //mainLessonContentContainer.style.overflowY = "auto";
  mainLessonContentContainer.style.paddingBottom = "0";

  /////////HIDE FULL SCREEN BUTTON
  fullScreenBtn.style.display = "none";

  /////////QUIZ PAGE STYLING
  if (quizPage) {
    const quizInitCheckboxIcon = document.querySelector(
      ".fa.fa-check-square-o.quiz-icon"
    );
    //quizInitCheckboxIcon.style.display = "none";
    //console.log("quizPage", quizPage);
  }

  //SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector(".sj-page-lesson");
  // const footerContainer = document.getElementById(
  //   "footer-container"
  // );

  footerContainer.style.marginTop = "0";

  const openIcon = document.querySelector(".fa.fa-bars");
  const searchIcon = document.querySelector(".fa.fa-search");
  const closeIcon = document.querySelector(".fa.fa-times");
  const navText = document.querySelector(".burger-text.sj-text-lessons");

  searchIcon.style.display = "none";
  navText.style.display = "none";

  //HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains("cbp-spmenu-open")) {
    openIcon.style.display = "none";
  } else {
    closeIcon.style.display = "none";
  }

  //DEFAULT LEFT-NAV TO BE CLOSED ON OPEN
  document.querySelector("body").classList.remove("cbp-spmenu-open");
  leftNav.classList.remove("cbp-spmenu-open");
  openIcon.style.display = "inline-block";
  closeIcon.style.display = "none";

  //HANDLE CLICKS
  openIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    closeIcon.style.display = "inline-block";
  });
  closeIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    openIcon.style.display = "inline-block";
  });
  leftNavMobileOverlay.addEventListener("click", (e) => {
    closeIcon.style.display = "none";
    openIcon.style.display = "inline-block";
  });

  //STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.getElementById("curriculum-list-2");
  const backToCurriculumEl = document.getElementById("left-nav-return-text");
  const links = lessonNavLinksContainer.querySelectorAll("a");
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll(".section-title");

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  lessonNavLinksContainer.style.paddingBottom = "32px";

  //STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon");
    const lessonLinkContainer = link.querySelector(".lesson-row");

    link.style.color = "#1C1C1C";
    link.style.cursor = "pointer";
    pageIcon.style.display = "none";
    lessonLinkContainer.style.display = "flex";
    lessonLinkContainer.style.flexDirection = "row-reverse";
    lessonLinkContainer.style.justifyContent = "space-between";
    lessonLinkContainer.style.margin = "0 12px";
    lessonLinkContainer.style.paddingLeft = "12px";
    lessonLinkContainer.style.paddingRight = "12px";
    lessonLinkContainer.style.fontSize = "14px";
    lessonLinkContainer.style.lineHeight = "20px";
  });

  //STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
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

  // const copyIcon = document.querySelector('.checkbox-icon');
  // const lessonContentContainer = document.querySelector('sjwc-lesson-content-item');
  // const codeBlocks = lessonContentContainer.querySelectorAll('pre');
  //HANDLE CODE BLOCK CUSTOM STYLING

  function animateCopiedTooltip(tooltipEl) {
    tooltipEl.style.opacity = "1";

    setTimeout(() => {
      tooltipEl.style.opacity = "0";
    }, 400);
  }

  codeBlocks.forEach((el) => {
    //console.log(el);

    //WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
    el.style.padding = "0";
    el.style.overflow = "visible";
    el.style.position = "relative";
    const codeEl = el.querySelector("code");
    // codeEl.style.display = 'inline-block';
    // codeEl.style.padding = '24px !important';
    codeEl.setAttribute(
      "style",
      "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
    );
    const copyText = codeEl.textContent.trim().replace(/^\$ /g,'');

    //CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "end";
    container.style.borderBottom = "1px solid gainsboro";
    container.style.padding = "12px 24px";

    //CLONE COPYICON EL AND ADD TO CONTAINER
    const iconClone = copyIcon.cloneNode(true);
    iconClone.style.display = "block";
    iconClone.style.cursor = "pointer";
    container.append(iconClone);

    //CREATE 'COPIED' TOOLTIP
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

    //ADD CONTAINER AS FIRST CHILD IN EL
    el.prepend(container);

    //ADD EVENT LISTENER TO CLONED ICON TO COPY CODE BLOCK INTO CLIPBOARD
    iconClone.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyText);
        animateCopiedTooltip(tooltipContainer);
      } catch (err) {
        console.error("Failed to copy codeblock to clipboard: ", err);
      }
    });
  });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => {
    el.setAttribute("target", "_blank");
  });

  //FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

function handlePageStyling(
  {
    isCatalogPage,
    isCourseDetailsPage,
    isPageDetailPath,
    isPageCatalogPath,
    isLoginPage,
    isSignUpPage,
    isCurriculumPage,
    isLessonsPage,
  },
  currentView
) {
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
      //CURRICULUM PAGE W COMPLETED CERTIFICATION GOES HERE [YESSS CERTIFICATION] <<<<<<<<<<< [CHECK TO MAKE SURE THIS WORKS; NOT TESTED]
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

function renderCourse() {
  const { width } = getWidthAndCurrentPage();
  //console.log("resized: ", width);

  if (width <= 991 && !(currentView === "mobile")) {
    currentView = "mobile";

    handlePageStyling(
      {
        isCatalogPage,
        isCourseDetailsPage,
        isPageDetailPath,
        isPageCatalogPath,
        isLoginPage,
        isSignUpPage,
        isCurriculumPage,
        isLessonsPage,
      },
      currentView
    );
  } else if (width > 991 && !(currentView === "desktop")) {
    currentView = "desktop";

    handlePageStyling(
      {
        isCatalogPage,
        isCourseDetailsPage,
        isPageDetailPath,
        isPageCatalogPath,
        isLoginPage,
        isSignUpPage,
        isCurriculumPage,
        isLessonsPage,
      },
      currentView
    );
  }

  //console.log("currentView: ", currentView);
  removeSJFooter(isLessonsPage);
  insertFooter(isLessonsPage);
  makeContentVisible();
}

/////
//EVENT TO HANDLE FIRST/INITIAL RENDERING
/////
document.addEventListener("DOMContentLoaded", () => {
  //console.log("DOM LOADED");
  renderCourse();
  initialLoadComplete = true;
});

/////
//EVENT TO HANDLE RESIZING RENDERING
/////
window.addEventListener("resize", () => {
  //BASICALLY SAME FUNCTION AS INIT!! JUST NEEDS TO MAKE SURE FUNC DOESNT GET CALLED UNNECESSARILY! SO USE THE CURRENTVIEW VAR AS REFERENCE!
  renderCourse();
});
