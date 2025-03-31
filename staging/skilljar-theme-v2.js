let current = {
  view: "",
  page: {
    isCatalog: document.querySelector(".sj-page-catalog.sj-page-catalog-root") ? true : false,
    isCurriculum: document.querySelector(".sj-page-curriculum") ? true : false,
    isCourseDetailsPage: document.querySelector(".sj-page-detail.sj-page-detail-course") ? true : false,
    isLessons: document.querySelector(".sj-page-lesson") ? true : false,
    isLogin: document.querySelector(".sj-page-login") ? true : false,
    isSignUp: document.querySelector(".sj-page-signup") ? true : false,
    isPathDetail: document.querySelector(".sj-page-detail.sj-page-detail-bundle.sj-page-detail-path") ? true : false,
    isPathCatalog: document.querySelector(".sj-page-catalog.sj-page-series.sj-page-path") ? true : false
  }
}
let initialLoadComplete = false;
let globalCurriculumSection, globalAboutSection;

/////////// UTILS //////////////////////////////////////////////////////


function checkWindowWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}


function getCourseDetailsPageElements() {
  const headerContainer = document.querySelector(".top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2");
  const headerFlexContainer = document.querySelector(".row.dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const registerBtn = document.getElementById("purchase-button-wrapper-large");
  const mainHeadingContainer = document.querySelector(".columns.text-center.large-6.dp-summary-wrapper.text-left-v2");
  // const mainVideoContainer = document.querySelector(".columns.large-6.text-center.dp-promo-image-wrapper");
  // const backToCatalogBtn = document.querySelector(".back-to-catalog");
  // const videoContainer = document.querySelector(".video-max");

  // SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector(".signin");
  const signInBtn = document.querySelector(".header-link.login-link.sj-text-sign-in.focus-link-v2");

  // BODY VARIABLES
  const bodyContainer = document.getElementById("dp-details");
  // const mobileBodyContent = document.querySelector(".row.show-for-small");
  const secondaryBodyContainer = document.querySelector(".row.hide-for-small.padded-side-bottom");
  const bodyColumns = secondaryBodyContainer.querySelectorAll(".columns");
  const curriculumListContainer = document.querySelector(".dp-curriculum"); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  const curriculumListHeader = curriculumListContainer.closest(".sj-curriculum-wrapper").querySelector("h3");
  const curriculumList = curriculumListContainer.querySelectorAll("li");

  // CARD VARIABLES
  const courseDetailCardContainer = document.querySelectorAll(".course-details-card")[0];
  let courseDetailCardListItems = [];
  if (courseDetailCardContainer) {
    courseDetailCardListItems =
      courseDetailCardContainer.querySelectorAll("li");
  }
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const registerBtnLink = document.getElementById("purchase-button").getAttribute("href");
  const registerBtnText = document.querySelector(".purchase-button-full-text").textContent;
  const courseDetailsCardLink = document.querySelector(".course-details-card-link");

  const mainInfoCardContained = document.querySelector(".sj-course-info-wrapper");

  return {
    headerContainer,
    headerFlexContainer,
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn,
    mainHeadingContainer,
    // mainVideoContainer,
    // backToCatalogBtn,
    // videoContainer,
    signInHeaderText,
    signInBtn,
    bodyContainer,
    // mobileBodyContent,
    secondaryBodyContainer,
    curriculumListContainer,
    bodyColumns,
    curriculumListHeader,
    curriculumList,
    courseDetailCardListItems,
    checkboxIcon,
    registerBtnLink,
    registerBtnText,
    courseDetailsCardLink,
    mainInfoCardContained
  }
}

function getLessonPageElements() {
  const leftNav = document.getElementById("lp-left-nav");
  const mainLessonContentContainer = document.getElementById("lp-wrapper");
  const mainLessonContentSubContainer = document.getElementById("lp-content");
  const mainLessonInnerContainer = document.getElementById("lesson-body");
  const mainLessonMainContainer = document.getElementById("lesson-main");
  const lessonFooter = document.getElementById("lp-footer");
  const navOpenIcon = document.getElementById("left-nav-button");
  const hamburgerIcon = navOpenIcon.querySelector(".fa.fa-bars");
  const xIcon = navOpenIcon.querySelector(".fa.fa-times");
  const logoImg = document.querySelector(".header-center-img");

  // LESSON BODY VARS
  const lessonInnerContainer = document.getElementById("lesson-main-inner");
  const copyIcon = document.querySelector(".copy-icon");
  const lessonContentContainer = document.querySelector("sjwc-lesson-content-item");
  const codeBlocks = lessonContentContainer.querySelectorAll("pre");

  // FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector(".sj-page-lesson");
  const openIcon = document.querySelector(".fa.fa-bars");
  const searchIcon = document.querySelector(".fa.fa-search");
  const closeIcon = document.querySelector(".fa.fa-times");
  const navText = document.querySelector(".burger-text.sj-text-lessons");

  // STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.getElementById("curriculum-list-2");
  const backToCurriculumEl = document.getElementById("left-nav-return-text");
  const links = lessonNavLinksContainer.querySelectorAll("a");
  const sectionTitles = lessonNavLinksContainer.querySelectorAll(".section-title");

  return {
    leftNav,
    mainLessonContentContainer,
    mainLessonContentSubContainer,
    mainLessonInnerContainer,
    mainLessonMainContainer,
    lessonFooter,
    navOpenIcon,
    hamburgerIcon,
    xIcon, logoImg,
    lessonInnerContainer,
    copyIcon,
    lessonContentContainer,
    codeBlocks,
    footerContainer,
    footerCols,
    parentEl,
    openIcon,
    searchIcon,
    closeIcon,
    navText,
    lessonNavLinksContainer,
    backToCurriculumEl,
    links,
    sectionTitles
  }
}

function getLoginPageElements() {
  // document.querySelector(".header-center-img").style.maxHeight = "48px"; // in CSS now

  const fbBtn = document.getElementById("facebook_login");
  const googleBtn = document.getElementById("google_login");
  const loginContent = document.getElementById("login-content");
  const tabArrow = document.getElementById("tab-marker-login");
  const termsAndServicesText = document.getElementById("access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orGoogleSignInContainer = document.querySelector(".large-6.columns:has(.socialaccount_providers)");
  const orGoogleSignInInnerContainer = orGoogleSignInContainer.querySelector("ul");
  const orGoogleSignInInnerContainerListItems = orGoogleSignInContainer.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-6.columns:has(.signup)");

  const loginTab = document.getElementById("login-tab-left");
  const signInTab = document.getElementById("login-tab-right");
  const signInTabText = signInTab.querySelector("a");
  // const longInNote = document.querySelector(".loginNote.sj-text-login-note");
  const orSignInWithContainer = document.querySelector(".socialaccount_providers li");
  const orSignInWithTextEl = orSignInWithContainer.querySelector(".sj-text-sign-in-with span");
  const loginInput = document.getElementById("id_login");
  const passwordInput = document.getElementById("id_password");
  const loginBottomBtn = document.getElementById("button-sign-in");
  // const forgotPasswordText = document.querySelector(".forgot-password.sj-text-forgot-password.focus-link-v2");
  const loginBottomBtnAndForgotPassBtn = loginBottomBtn.closest(".large-12.columns");

  const loginForm = document.getElementById("login_form");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  const tabs = document.querySelector("#tabs");

  return {
    fbBtn,
    googleBtn,
    loginContent,
    tabArrow,
    termsAndServicesText,
    loginContentContainer,
    orGoogleSignInContainer,
    orGoogleSignInInnerContainer,
    orGoogleSignInInnerContainerListItems,
    signUpSignInContainer,
    loginTab,
    signInTab,
    signInTabText,
    orSignInWithContainer,
    orSignInWithTextEl,
    loginInput,
    passwordInput,
    loginBottomBtn,
    loginBottomBtnAndForgotPassBtn,
    loginForm,
    footerContainer,
    footerCols,
    tabs,
  }
}

function fixColumn(column) {
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
}

////////////////////////////////////////////////////////////////////////

// DESKTOP VIEW STYLINGS
function desktopCatalogPageStyling() {
  // Grab variables
  const catalogBodyParentContainer = document.getElementById("catalog-content");
  const catalogContainer = document.getElementById("catalog-courses");

  if (!initialLoadComplete) {
    // Create container div for courses catalog list
    const catalogContentContainer = document.createElement("div");
    catalogContentContainer.classList.add("catalog-content-container")
    // catalogContentContainer.style.maxWidth = "min(1232px, 90%)"; // now handled in CSS
    // catalogContentContainer.style.margin = "96px auto"; // now handled in CSS

    // Create header for list
    const allCoursesHeader = document.createElement("h2");
    allCoursesHeader.classList.add("all-courses-header")
    allCoursesHeader.textContent = "All Courses";
    // allCoursesHeader.style.fontSize = "48px"; // now handled in CSS
    // allCoursesHeader.style.marginBottom = "38px"; // now handled in CSS

    catalogContentContainer.append(allCoursesHeader, catalogContainer);
    catalogBodyParentContainer.append(catalogContentContainer);

    initialLoadComplete = true;
  }
}

function desktopCourseDetailsPageStyling() {
  const {
    // headerContainer,
    // headerFlexContainer,
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn,
    mainHeadingContainer,
    // videoContainer,
    bodyContainer,
    secondaryBodyContainer,
    curriculumListContainer,
    bodyColumns,
    curriculumListHeader,
    curriculumList,
    courseDetailCardListItems,
    checkboxIcon,
    registerBtnLink,
    registerBtnText,
    courseDetailsCardLink,
    // mainInfoCardContained
  } = getCourseDetailsPageElements()

  // backToCatalogBtn.style.display = "none"; // hidden on mobile + desktop (should be CSS)
  // mobileBodyContent.style.display = "none"; // hidden on mobile + desktop (should be CSS)

  // if (signInHeaderText) {
  // signInHeaderText.style.display = "none"; // hidden on mobile + desktop (should be CSS)
  // signInBtn.style.marginRight = "24px"; // now in CSS
  // signInBtn.style.borderColor = "#3443F4"; // now in CSS
  // signInBtn.style.border = "2px solid #3443F4"; // now in CSS
  // signInBtn.style.borderRadius = "999px"; // now in CSS
  // signInBtn.style.fontSize = "14px"; // now in CSS
  // signInBtn.style.lineHeight = "20px"; // now in CSS
  // signInBtn.style.backgroundColor = "#3443F4"; // now in CSS
  // signInBtn.style.color = "#fff"; // now in CSS

  // signInBtn.style.padding = "8px 12px"; // now in CSS
  // }

  //headerContainer.style.margin = "0"; // same for mobile + desktop (should be general CSS)
  //headerContainer.style.maxWidth = "none"; // same for mobile + desktop (should be general CSS)
  //headerContainer.style.border = "0"; // same for mobile + desktop (should be general CSS)
  // headerContainer.style.backgroundColor = "#D0CFEE"; // set on CSS instead
  //headerContainer.style.paddingTop = "96px"; // now set in CSS
  //headerContainer.style.paddingBottom = "96px"; // now set in CSS

  // headerFlexContainer.style.flexDirection = "row-reverse";
  // headerFlexContainer.style.flexWrap = "nowrap"; // set on CSS now
  // headerFlexContainer.style.justifyContent = "start"; // set on CSS now
  // headerFlexContainer.style.gap = "24px"; // set on CSS now
  // headerFlexContainer.style.maxWidth = "1188px"; // set on CSS now

  // RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  // mainHeadingContainer.style.border = "0"; // now set in CSS
  // mainHeadingContainer.style.maxWidth = "564px"; // now set in CSS

  // mainInfoCardContained.style.display = "none";; // now in CSS

  // headingFloaterText.style.display = "block"; // now set in CSS
  // headingFloaterText.style.marginBottom = "24px"; // now set in CSS

  // mainHeading.style.margin = "0 0 12px 0"; // now set in CSS
  // mainHeading.style.fontSize = "36px"; // now set in CSS
  // mainHeading.style.fontWeight = "600"; // now set in CSS
  // mainHeading.style.lineHeight = "43.2px"; // now set in CSS
  // mainHeading.style.letterSpacing = "-.02em"; // now set in CSS

  // headingParagraph.style.display = "block"; // now set in CSS
  // headingParagraph.style.margin = "0 0 24px 0"; // now set in CSS

  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  // VIDEO STYLING  // now set in CSS
  // if (videoContainer && videoContainer.style) {
  //   videoContainer.style.maxWidth = "none";
  // }

  // COURSE DETAILS PAGE BODY STYLING
  // bodyContainer.style.padding = "0"; // now in CSS
  // bodyContainer.style.maxWidth = "min(1152px, 90%)"; // now in CSS
  // bodyContainer.style.display = "grid"; // now in CSS
  // bodyContainer.style.columnGap = "24px"; // now in CSS
  // bodyContainer.style.margin = "96px auto 46px auto"; // now in CSS
  // bodyContainer.style.gridTemplateColumns = "minmax(100px, 760px) minmax(100px, 368px)"; // now in CSS

  // secondaryBodyContainer.style.padding = "0"; // now in CSS
  // secondaryBodyContainer.style.maxWidth = "760px"; // now in CSS

  bodyColumns.forEach((column) => fixColumn(column));

  // COURSE DETAILS CURRICULUM STYLING
  if (!initialLoadComplete) {
    // Check if course has Sections/Modules/Parts
      
    let curContainer = document.createElement("li");

    // function styleGroupContainer(container) {
    //   container.style.border = "2px solid #3443F4";
    //   container.style.borderRadius = "8px";
    //   container.style.marginBottom = "48px";
    //   container.style.padding = "0";
    // }

    const hasSections = curriculumListContainer.querySelector(".section")
    ? true
    : false;
  
    if (!hasSections) {
      // styleGroupContainer(curContainer);
      curContainer.classList.add("course-detail-group-container"); // now handled in CSS
    }

    function styleListItem(lessonItem, isLastChild) {
      // Display none for icon w/ class 'type-icon'
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

    // function styleGroupHeading(groupHeading) {
    //   groupHeading.textContent = groupHeading?.textContent?.trim();
    //   groupHeading.style.fontSize = "16px";
    //   groupHeading.style.fontWeight = "500";
    //   groupHeading.style.lineHeight = "125%";
    //   groupHeading.style.fontFamily = "Fusiona";
    //   groupHeading.style.padding = "24px";
    //   groupHeading.style.borderBottom = "2px solid #3443F4";
    //   curContainer.append(groupHeading);
    // }

    curriculumList.forEach((curListItem, i, arr) => {
      // Check if current item contains 'section' class
      if (curListItem.classList.contains("section")) {
        // Push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);

        // Reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement("li");
        //styleGroupContainer(curContainer); // now handled in CSS
        curContainer.classList.add("course-detail-group-container");

        const newGroupHeading = document.createElement("div");
        newGroupHeading.innerHTML = curListItem.innerHTML;
        // styleGroupHeading(newGroupHeading); // now handled in CSS
        newGroupHeading.classList.add("course-detail-group-heading")
        curContainer.append(newGroupHeading); // TODO: ensure this is appended correctly.
      } else {
        // Normal/expected behaviour
        // Transfer inner html of current list item to new created div
        const isLastChild = arr[i + 1] ? arr[i + 1].classList.contains("section") : true

        const newListItem = document.createElement("div");
        newListItem.innerHTML = curListItem.innerHTML;
        styleListItem(newListItem, isLastChild);
        curContainer.append(newListItem);
      }
      curListItem.style.display = "none";
    });

    // LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    curriculumListHeader.style.display = "none"; // TODO: can be added to global CSS
    curriculumListContainer.style.padding = "0"; // TODO: can be added to global CSS
  }

  // COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  const courseDetailCardContainer = secondaryBodyContainer.querySelector(".course-details-card");

  if (courseDetailCardContainer) {
    bodyContainer.append(courseDetailCardContainer);
    // courseDetailCardContainer.style.margin = "0 0 46px 0"; // now set in CSS
    // courseDetailCardContainer.style.justifySelf = "center"; // now set in CSS

    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      // iconClone.style.display = "block"; // now set on CSS
      // iconClone.style.flexShrink = "0"; // now set on CSS
      li.prepend(iconClone);
    });
  }

  if (courseDetailsCardLink) {
    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute("href", registerBtnLink);
  }
}

function desktopPathCourseDetailsPageStyling() {
  const headerContainer = document.querySelector(".top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2");
  // const headerFlexContainer = document.querySelector(".row.dp-row-flex-v2");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector("h1.break-word");
  const registerBtn = document.getElementById("purchase-button-wrapper-large");
  // const registerBtnAnchor = document.getElementById("purchase-button");
  const mainHeadingContainer = document.querySelector(".columns.text-center.large-6.dp-summary-wrapper.text-left-v2");
  // const backToCatalogBtn = document.querySelector(".back-to-catalog");
  const mainInfoCardContained = document.querySelector(".sj-course-info-wrapper");
  const headingParagraph = mainInfoCardContained.querySelector("h2");

  // SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  // const signInHeaderText = document.querySelector(".signin"); // handled in CSS
  // const signInBtn = document.querySelector(".header-link.login-link.sj-text-sign-in.focus-link-v2");

  // BODY VARIABLES
  // const bodyContainer = document.getElementById("dp-details-bundle");
  // const catalogContainer = document.getElementById("catalog-courses");

  // backToCatalogBtn.style.display = "none"; // handled in CSS
  // if (signInHeaderText) {
  //   signInHeaderText.style.display = "none"; // handled in CSS
    // signInBtn.style.backgroundColor = "transparent"; // handled in CSS
    // signInBtn.style.padding = "8px 12px"; // handled in CSS
    // signInBtn.style.marginRight = "24px"; // handled in CSS
    // signInBtn.style.borderColor = "#3443F4"; // handled in CSS
    // signInBtn.style.border = "2px solid #3443F4"; // handled in CSS
    // signInBtn.style.borderRadius = "999px"; // handled in CSS
    // signInBtn.style.fontSize = "14px"; // handled in CSS
    // signInBtn.style.fontFamily = "Space Mono"; // handled in CSS
    // signInBtn.style.fontWeight = "700"; // handled in CSS
    // signInBtn.style.lineHeight = "20px"; // handled in CSS
  // }

  headerContainer.classList.add("cg-special-header")
  // headerContainer.style.background = "url(https://images.ctfassets.net/l47ir7rfykkn/5zE7elBMFe1MmuhPIeWd9G/e09a10e4d4c081b9ca86a879b6984049/Main_BG.png)"; // handled in CSS
  // headerContainer.style.backgroundSize = "cover"; // handled in CSS
  // headerContainer.style.backgroundPosition = "center"; // handled in CSS
  // headerContainer.style.backgroundRepeat = "no-repeat"; // handled in CSS
  // headerContainer.style.margin = "0"; // set in CSS
  // headerContainer.style.maxWidth = "none"; // set in CSS
  // headerContainer.style.paddingTop = "96px"; // set in CSS
  // headerContainer.style.paddingBottom = "96px"; // set in CSS
  // headerContainer.style.border = "0"; // set in CSS

  // headerFlexContainer.style.flexDirection = "row-reverse"; // handled in CSS
  // headerFlexContainer.style.flexWrap = "nowrap"; // handled in CSS
  // headerFlexContainer.style.justifyContent = "start"; // handled in CSS
  // headerFlexContainer.style.gap = "24px"; // handled in CSS
  // headerFlexContainer.style.maxWidth = "1188px"; // handled in CSS

  // RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  // mainHeadingContainer.style.border = "0"; // now set in CSS
  // mainHeadingContainer.style.maxWidth = "600px"; // now set in CSS
  // mainInfoCardContained.style.display = "none"; // handled in CSS
  
  headingFloaterText.textContent = "Learning Path";
  
  headingFloaterText.style.color = "#7AF0FE";
  // headingFloaterText.style.display = "block";
  // headingFloaterText.style.marginBottom = "24px";
  
  mainHeading.style.color = "#fff";
  // mainHeading.style.margin = "0 0 12px 0"; // handled in CSS
  // mainHeading.style.fontSize = "36px"; // handled in CSS
  // mainHeading.style.fontWeight = "600"; // handled in CSS
  // mainHeading.style.lineHeight = "43.2px"; // handled in CSS
  // mainHeading.style.letterSpacing = "-.02em"; // handled in CSS
  
  headingParagraph.style.color = "#fff";
  // headingParagraph.style.display = "block"; // handled in CSS
  // headingParagraph.style.margin = "0 0 24px 0"; // handled in CSS
  
  // registerBtnAnchor.style.borderColor = "#7AF0FE"; // handled in CSS
  // registerBtnAnchor.style.color = "#fff"; // handled in CSS
  
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  // COURSE DETAILS PAGE BODY STYLING
  // bodyContainer.style.padding = "0"; // handled in CSS
  // bodyContainer.style.margin = "96px auto 46px auto"; // handled in CSS
  // bodyContainer.style.maxWidth = "min(1152px, 90%)"; // handled in CSS

  // catalogContainer.style.marginBottom = "85px"; // handled in CSS
}

function desktopPathCatalogPageStyling() {
  // const backArrowBtn = document.querySelector(".back-to-catalog");

  // document.querySelectorAll("#catalog-courses .coursebox-container").forEach((course) => {
    // Outer border
    // course.style.border = "2px solid #D0CFEE"; // handled in CSS
    // course.style.borderRadius = "20px"; // handled in CSS

    // Inner border
    // const innerContainer = course.querySelector(".course-overview");
    // if (innerContainer) {
    //   innerContainer.style.borderTop = "2px solid #D0CFEE";
    // } // not needed; TODO verify

  //   course.addEventListener("mouseover", () => {
  //     course.style.borderColor = "#3443f4";
  //     if (innerContainer) {
  //       innerContainer.style.borderColor = "#3443f4";
  //     }
  //   });
  //   course.addEventListener("mouseout", () => {
  //     course.style.borderColor = "#D0CFEE";
  //     if (innerContainer) {
  //       innerContainer.style.borderColor = "#D0CFEE";
  //     }
  //   });// handled with CSS hover now instead
  // }); 

  // PAGE NAV STYLING
  // backArrowBtn.style.display = "none"; // handled in CSS

  // MAIN CONTENT STYLING
  const mainContentContainer = document.getElementById("catalog-content");
  const topContentContainer = mainContentContainer.querySelector(".path-curriculum-resume-wrapper");

  mainContentContainer.style.margin = "96px auto";
  topContentContainer.style.display = "none";
}

function desktopLessonPageStyling() {
  const {
    // leftNav,
    mainLessonContentContainer,
    mainLessonContentSubContainer,
    mainLessonInnerContainer,
    // mainLessonMainContainer,
    lessonFooter,
    navOpenIcon,
    // hamburgerIcon,
    // xIcon,
    // lessonInnerContainer,
    copyIcon,
    lessonContentContainer,
    codeBlocks,
    // footerContainer,
    footerCols,
    parentEl,
    openIcon,
    // searchIcon,
    closeIcon,
    // navText,
    // lessonNavLinksContainer,
    backToCurriculumEl,
    links,
    sectionTitles,
  } = getLessonPageElements();

  // STYLE LOGO
  // logoImg.style.height = "24px"; // --> moving to CSS

  // lessonInnerContainer.style.maxWidth = "712px"; // handled in CSS
  // lessonInnerContainer.style.margin = "0 auto"; // handled in CSS

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  // STYLING TO ALIGN NAV ICON TO LEFT CORNER AND STICKY
  // mainLessonContentContainer.style.position = "relative"; // handled in CSS
  // mainLessonContentContainer.style.display = "flex"; // handled in CSS
  // mainLessonContentContainer.style.flexDirection = "column"; // handled in CSS
  // mainLessonContentContainer.style.justifyContent = "space-between"; // handled in CSS

  mainLessonContentSubContainer.style.height = "auto";

  // mainLessonInnerContainer.style.margin = "0"; // in CSS
  // mainLessonInnerContainer.style.maxWidth = "none"; // in CSS

  // mainLessonMainContainer.style.position = "relative"; // handled in CSS
  // mainLessonMainContainer.style.zIndex = "0"; // handled in CSS
  // mainLessonMainContainer.style.paddingTop = "0"; // handled in CSS

  // navOpenIcon.style.position = "sticky"; // handled in CSS
  // navOpenIcon.style.top = "12px"; // handled in CSS
  // navOpenIcon.style.zIndex = "1"; // handled in CSS
  // navOpenIcon.style.float = "none"; // handled in CSS
  
  // [hamburgerIcon, xIcon].forEach((el) => {
  //   el.style.padding = "12px";
  //   el.style.border = "none";
  //   el.style.borderRadius = "8px";
  //   el.style.background = "rgba(255, 255, 255, .8)";
  //   el.style.backdropFilter = "blur(1.5px)";
  // }); // handled in CSS

  // lessonFooter.style.position = "relative"; // handled in CSS
  // lessonFooter.style.border = "0"; // handled in CSS
  // lessonFooter.style.backgroundColor = "transparent"; // handled in CSS

  // leftNav.style.position = "absolute"; // handled in CSS
  // leftNav.style.backgroundColor = "#f9f9f9"; // handled in CSS
  // leftNav.style.width = "320px"; // handled in CSS
  // leftNav.style.marginBottom = "0px"; // handled in CSS

  // mainLessonContentContainer.style.height = "100vh"; // handled in CSS
  // mainLessonContentContainer.style.overflowY = "auto"; // handled in CSS
  // mainLessonContentContainer.style.paddingBottom = "0"; // handled in CSS

  // HIDE FULL SCREEN BUTTON
  // fullScreenBtn.style.display = "none"; // --> CSS

  // SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  // searchIcon.style.display = "none"; // in CSS now
  // navText.style.display = "none"; // in CSS now

  // HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains("cbp-spmenu-open")) {
    openIcon.style.display = "none";
  } else {
    closeIcon.style.display = "none";
  }

  // HANDLE CLICKS
  openIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    closeIcon.style.display = "inline-block";
  });
  closeIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    openIcon.style.display = "inline-block";
  });

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  // lessonNavLinksContainer.style.paddingBottom = "32px"; // now in CSS

  // STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon");
    const lessonLinkContainer = link.querySelector(".lesson-row");

    link.style.color = "#14003d";
    link.style.cursor = "pointer";
    pageIcon.style.display = "none";
    
    // lessonLinkContainer.style.display = "flex"; // handled in CSS
    // lessonLinkContainer.style.flexDirection = "row-reverse"; // handled in CSS
    // lessonLinkContainer.style.justifyContent = "space-between"; // handled in CSS
    // lessonLinkContainer.style.margin = "0 12px"; // handled in CSS
    // lessonLinkContainer.style.paddingLeft = "12px"; // handled in CSS
    // lessonLinkContainer.style.paddingRight = "12px"; // handled in CSS
    // lessonLinkContainer.style.fontSize = "14px"; // handled in CSS
    // lessonLinkContainer.style.lineHeight = "20px"; // handled in CSS
  });

  // STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  // sectionTitles.forEach((title) => {
  //   title.style.backgroundColor = "transparent";
  //   title.style.padding = "12px";
  //   title.style.paddingLeft = "24px";
  //   title.style.paddingRight = "24px";
  //   title.style.marginTop = "12px";
  //   title.style.marginBottom = "12px";
  //   title.style.border = "0";
  //   title.style.fontFamily = "Fusiona";
  //   title.style.fontSize = "16px";
  //   title.style.fontWeight = "700";
  // }); // handled in CSS

  // HANDLE CODE BLOCK CUSTOM STYLING

  function animateCopiedTooltip(tooltipEl) {
    tooltipEl.style.opacity = "1";

    setTimeout(() => {
      tooltipEl.style.opacity = "0";
    }, 400);
  }

  codeBlocks.forEach((el) => {
    // WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
    // el.style.padding = "0"; // handled in CSS
    // el.style.overflow = "visible"; // handled in CSS
    // el.style.position = "relative"; // handled in CSS

    const codeEl = el.querySelector("code");
    const copyText = codeEl.textContent;
    // codeEl.setAttribute(
    //   "style",
    //   "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
    // ); // handled in CSS

    // CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
    const container = document.createElement("div");
    container.classList.add("code-parent-container") // added as CSS now
    // container.style.display = "flex"; // handled as CSS
    // container.style.justifyContent = "end"; // handled as CSS
    // container.style.borderBottom = "1px solid gainsboro"; // handled as CSS
    // container.style.padding = "12px 24px"; // handled as CSS

    // CLONE COPYICON EL AND ADD TO CONTAINER
    const iconClone = copyIcon.cloneNode(true);
    iconClone.classList.add("code-icon") // added as CSS now
    // iconClone.style.display = "block"; // handled as CSS
    // iconClone.style.cursor = "pointer"; // handled as CSS
    container.append(iconClone);

    // CREATE 'COPIED' TOOLTIP
    const tooltipContainer = document.createElement("div");
    tooltipContainer.textContent = "Copied";
    tooltipContainer.classList.add("code-tooltip") // added as CSS now
    // tooltipContainer.style.position = "absolute"; // handled as CSS
    // tooltipContainer.style.top = "-24px"; // handled as CSS
    // tooltipContainer.style.right = "10px"; // handled as CSS
    // tooltipContainer.style.textShadow = "none"; // handled as CSS
    // tooltipContainer.style.backgroundColor = "#1c1c1c"; // handled as CSS
    // tooltipContainer.style.color = "#fff"; // handled as CSS
    // tooltipContainer.style.padding = "5px 10px"; // handled as CSS
    // tooltipContainer.style.borderRadius = "4px"; // handled as CSS
    // tooltipContainer.style.opacity = "0"; // handled as CSS
    // tooltipContainer.style.transition = "opacity .2s ease-in"; // handled as CSS

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
  });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => {
    el.setAttribute("target", "_blank");
  });

  // LESSON CONTENT FOOTER
  // const prevBtn = document.querySelector(".button-prev-title span");
  // if (prevBtn) {
  //   prevBtn.style.color = "#14003d";
  // } // now in CSS

  // FOOTER STYLING
  // footerContainer.style.paddingLeft = "40px"; // in CSS now
  // footerContainer.style.paddingRight = "40px"; // in CSS now
  footerCols.forEach((col) => col.style.width = "270px");
}

function desktopLoginPageStyling() {
  const {
    // fbBtn,
    googleBtn,
    // loginContent,
    // tabArrow,
    termsAndServicesText,
    loginContentContainer,
    orGoogleSignInContainer,
    orGoogleSignInInnerContainer,
    // orGoogleSignInInnerContainerListItems,
    signUpSignInContainer,
    loginTab,
    signInTab,
    signInTabText,
    orSignInWithContainer,
    orSignInWithTextEl,
    loginInput,
    passwordInput,
    loginBottomBtn,
    loginBottomBtnAndForgotPassBtn,
    // loginForm,
    // footerContainer,
    footerCols,
    // tabs,
  } = getLoginPageElements()

  // const fbBtn = document.getElementById("facebook_login");
  // const googleBtn = document.getElementById("google_login");
  // const loginContent = document.getElementById("login-content");
  // const tabArrow = document.getElementById("tab-marker-login");
  // const termsAndServicesText = document.getElementById("access-message");
  // const loginContentContainer = document.querySelector(".large-6.columns");
  // const orGoogleSignInContainer = loginContent.querySelectorAll(".large-6.columns")[1];
  // const orGoogleSignInInnerContainer = orGoogleSignInContainer.querySelector("ul");
  // const orGoogleSignInInnerContainerListItems = orGoogleSignInInnerContainer.querySelectorAll("li");
  // const signUpSignInContainer = document.querySelector("#tabs").parentElement;
  // const loginTab = document.getElementById("login-tab-left");
  // const signInTab = document.getElementById("login-tab-right");
  // const signInTabText = signInTab.querySelector("a");
  // const longInNote = document.querySelector(".loginNote.sj-text-login-note");
  // const orSignInWithContainer = document.querySelector(".socialaccount_providers li");
  // const orSignInWithTextEl = orSignInWithContainer.querySelector(".sj-text-sign-in-with span");
  // const loginInput = document.getElementById("id_login");
  // const passwordInput = document.getElementById("id_password");
  // const loginBottomBtn = document.getElementById("button-sign-in");
  // const forgotPasswordText = document.querySelector(".forgot-password.sj-text-forgot-password.focus-link-v2");
  // const loginBottomBtnAndForgotPassBtn = loginBottomBtn.closest(".large-12.columns");

  // FOOTER VARS
  // const footerContainer = document.getElementById("footer-container");
  // const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // STYLE LOGO
  // logoImg.style.height = "24px"; // --> moving to CSS

  // termsAndServicesText.style.maxWidth = "368px"; // now in CSS
  // termsAndServicesText.style.fontSize = "14px"; // now in CSS

  document.querySelector("#login_form").append(termsAndServicesText);

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";

  // const tabs = document.querySelector("#tabs");
  // tabs.style.borderRadius = "100px"; // now in CSS
  // tabs.style.display = "flex"; // now in CSS
  // tabs.style.padding = "4px"; // now in CSS

  loginTab.querySelector("span span").textContent = "Log In";
  // loginTab.style.border = "0"; // CSS now
  // loginTab.style.display = "flex"; // CSS now
  // loginTab.style.padding = "8px 16px"; // CSS now
  // loginTab.style.alignItems = "center"; // CSS now
  loginTab.style.textDecoration = "underline";
  // loginTab.style.fontFamily = "Space Mono"; // CSS now
  loginTab.style.color = "#3443f4";
  // loginTab.style.fontWeight = "700"; // CSS now
  // loginTab.style.fontSize = "18px"; // CSS now
  // loginTab.style.lineHeight = "24px"; // CSS now
  // loginTab.style.fontFamily = "Space Mono"; // CSS now

  signInTab.querySelector("span").textContent = "Sign Up";
  signInTabText.style.color = "rgba(52, 67, 244, .4)";
  // signInTab.style.display = "flex"; // CSS now
  // signInTab.style.alignItems = "center"; // CSS now
  // signInTab.style.padding = "8px 16px"; // CSS now
  // signInTabText.style.fontWeight = "700"; // CSS now
  // signInTabText.style.fontSize = "18px"; // CSS now
  // signInTabText.style.lineHeight = "24px"; // CSS now

  // STYLE THE LOGIN TEXT CONTENT BOX
  loginContentContainer.style.width = "50%"; // 100 on mobile
  orGoogleSignInContainer.style.width = "50%"; // TODO 100 on mobile
  orGoogleSignInInnerContainer.style.paddingLeft = "125px"; // TODO 0 on mobile
  // orGoogleSignInInnerContainerListItems.forEach((li) => li.style.padding = "0"); // now in CSS

  // longInNote.style.display = "none"; // CSS now
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
  // forgotPasswordText.style.fontSize = "16px"; // CSS now
  // forgotPasswordText.style.fontFamily = "Space Mono"; // CSS now
  // forgotPasswordText.style.marginBottom = "2px"; // CSS now
  loginBottomBtnAndForgotPassBtn.style.marginBottom = "24px";

  // STYLING OF SIDE 'SIGN IN W/' GOOGLE ELS
  orSignInWithTextEl.textContent = "Or Log In With";
  googleBtn.textContent = "Continue with Google";

  // fbBtn.style.display = "none"; // now in CSS
  // googleBtn.style.background = "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)"; // now in CSS
  // googleBtn.style.width = "auto"; // now in CSS
  // googleBtn.style.textAlign = "center"; // now in CSS

  // loginContent.style.border = "0"; // now in CSS
  // tabArrow.style.display = "none";// now in CSS

  // FOOTER STYLING
  // footerContainer.style.paddingLeft = "40px"; // now in CSS
  // footerContainer.style.paddingRight = "40px"; // now in CSS
  footerCols.forEach((col) => col.style.width = "270px");
}

function desktopSignUpPageStyling() {
  // const fbBtn = document.getElementById("facebook_login");
  const googleBtn = document.getElementById("google_login");
  const loginContent = document.getElementById("login-content");
  // const tabArrow = document.getElementById("tab-marker-signup");
  const termsAndServicesText = document.getElementById("access-message");
  const loginContentContainer = document.querySelector(".large-6.columns");
  const orSignInWithGoogleContainer = loginContent.querySelectorAll(".row .large-6.columns")[3];

  const orSignInWithGoogleList = orSignInWithGoogleContainer.querySelector("ul");
  // const orSignInWithGoogleItems = orSignInWithGoogleList.querySelectorAll("li");
  const signUpSignInContainer = document.querySelector(".large-12.columns");
  const loginTab = document.getElementById("login-tab-left");
  const loginTabText = loginTab.querySelector("a");
  const signInTab = document.getElementById("login-tab-right");
  const signInTabText = signInTab.querySelector("span");
  const orSignInWithContainer = document.querySelector(".socialaccount_providers li");
  const orSignInWithText = document.querySelector(".sj-text-sign-up-with");
  const orSignInWithTextSpan = orSignInWithText.querySelector("span");

  const firstNameLabel = document.querySelector('label[for="id_first_name"] span span');
  const lastNameLabel = document.querySelector('label[for="id_last_name"] span span');

  const loginLabel = document.querySelector('label[for="id_email"]');
  const loginInput = document.getElementById("id_email");
  // const passwordInput = document.getElementById("id_password1");
  // const passwordInput2 = document.getElementById("id_password2");
  const signUpBottomBtn = document.getElementById("button-sign-up");
  const signUpForm = document.getElementById("signup_form");

  // FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // termsAndServicesText.style.maxWidth = "368px"; // now in CSS
  // termsAndServicesText.style.color = "#545454"; // now in CSS
  // termsAndServicesText.style.fontSize = "14px"; // now in CSS
  signUpForm.append(termsAndServicesText);

  // STYLE LOGO
  // logoImg.style.height = "24px"; // --> moving to CSS

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";

  // const tabs = document.querySelector("#tabs");
  // tabs.style.borderRadius = "100px"; // in CSS now
  // tabs.style.display = "flex"; // in CSS now
  // tabs.style.padding = "4px"; // in CSS now

  loginTabText.querySelector("span").textContent = "Log In";
  // loginTab.style.border = "0"; // CSS now
  // loginTab.style.display = "flex"; // CSS now
  // loginTab.style.padding = "8px 16px"; // CSS now
  // loginTab.style.alignItems = "center"; // CSS now
  loginTabText.style.color = "rgba(52, 67, 244, .4)";
  // loginTabText.style.fontWeight = "700"; // CSS now
  // loginTabText.style.fontSize = "18px"; // CSS now
  // loginTabText.style.fontFamily = "Space Mono"; // CSS now
  // loginTabText.style.lineHeight = "24px"; // CSS now
  // loginTab.style.borderRadius = "100px"; // CSS now

  // signInTab.style.display = "flex"; // CSS now
  // signInTab.style.alignItems = "center"; // CSS now
  // signInTab.style.padding = "8px 16px"; // CSS now
  // signInTab.style.borderRadius = "100px"; // CSS now
  signInTabText.textContent = "Sign up";
  signInTabText.style.color = "#3443f4";
  signInTabText.style.textDecoration = "underline";
  // signInTabText.style.fontFamily = "Space Mono"; // CSS now
  // signInTabText.style.fontWeight = "700"; // CSS now
  // signInTabText.style.fontSize = "18px"; // CSS now
  // signInTabText.style.lineHeight = "24px"; // CSS now

  // STYLE THE SIGNUP TEXT CONTENT BOX
  loginContentContainer.style.width = "50%";
  orSignInWithGoogleContainer.style.width = "50%";
  orSignInWithGoogleContainer.style.paddingLeft = "100px";
  orSignInWithGoogleList.style.paddingLeft = "25px";
  // orSignInWithGoogleItems.forEach((li) => li.style.padding = "0"); // now in CSS

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
  // passwordInput.style.borderRadius = "4px";
  // passwordInput.style.borderColor = "#DCDCDC";
  // passwordInput.style.padding = "12px";
  // passwordInput.style.lineHeight = "24px";
  // passwordInput2.style.marginBottom = "24px"; // now in CSS

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

  // fbBtn.style.display = "none"; // now in CSS
  // googleBtn.style.background = "linear-gradient(225deg, #7545FB 0%, #7AF0FE 100%)"; // now in CSS
  // googleBtn.style.width = "auto"; // now in CSS
  // googleBtn.style.textAlign = "center"; // now in CSS

  // loginContent.style.border = "0"; // now in CSS
  // tabArrow.style.display = "none";// now in CSS

  document.querySelectorAll("label").forEach((label) => {
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

  document.querySelectorAll("input").forEach((input) => {
    input.style.borderRadius = "4px";
    input.style.border = "2px solid #3443f4";
    input.style.padding = "20px 15px";
    input.style.lineHeight = "24px";

    if (input.getAttribute("id") === "id_password2") {
      input.setAttribute("placeholder", "Password confirm");
    }
  });

  // FOOTER STYLING
  // footerContainer.style.paddingLeft = "40px"; // now in CSS
  // footerContainer.style.paddingRight = "40px"; // now in CSS
  footerCols.forEach((col) => col.style.width = "270px");
}

function desktopCurriculumPageNoCertificateStyling() {
  const courseDescription = skilljarCourse.short_description; // eslint-disable-line no-undef

  // HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  );
  const mainHeading = document.querySelector(".break-word");

  // const backToCatalogLink = document.querySelector(".back-to-catalog");// handled in CSS
  // backToCatalogLink.style.display = "none"; // handled in CSS

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

  // BODY VARIABLES
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

  // STYLE LOGO
  // logoImg.style.height = "24px"; // --> moving to CSS

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

  // STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  sjHeaderTextSubheading.style.display = "none";
  sjHeaderTextProgressBar.style.display = "none";

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

    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;
    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

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
      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "2px solid #3443f4";

      // get actual group heading
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

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === "DIV") {
        // Push curContainer into parent container
        curriculumParentContainer.append(curContainer);

        // Reset curContainer while pushing current new heading & icon in there for the next iteration
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
        // Normal/expected behaviour
        // Transfer inner html of current list item to new created div
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

function desktopCurriculumPageYesCertificationStyling() {
  const courseDescription = skilljarCourse.short_description; // eslint-disable-line no-undef

  // HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  );
  const mainHeading = document.querySelector(".break-word");

  // const backToCatalogLink = document.querySelector(".back-to-catalog"); // handled in CSS
  // backToCatalogLink.style.display = "none"; // handled in CSS

  const curriculumPageHeader = document.querySelector(".top-row-grey.top-row-white-v2.padding-side.row-v2");
  const headerTextAndImgContainer = document.querySelector(".row.dp-row-flex-v2");
  const sjHeaderTextContainer = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper");
  const sjHeaderTextHeading = document.querySelector(".break-word");
  const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
  const sjHeaderTextProgressBar = document.querySelector(".progress-bar.button-border-color");
  const certificateEl = document.querySelector(".cp-certificate");
  const sjHeaderImgContainer = document.querySelector(".large-4.pull-8.columns.cp-promo-image-wrapper");
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");

  // BODY VARIABLES
  const bodyMainContainer = document.getElementById("cp-content");
  const InnerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] = tabsContainer.querySelectorAll("section");

  // STYLE LOGO
  // logoImg.style.height = "24px"; // --> moving to CSS

  // TEST
  if (initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.getElementById("curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer = curriculumParentContainer.closest(".content");

  // CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const courseDetailsCardLink = document.querySelector(".course-details-card-link");

  // STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.marginTop = "96px";
  bodyMainContainer.style.gridTemplateColumns = "minmax(100px, 760px) minmax(100px, 368px)";

  if (courseDetailsCard) {
    courseDetailsCard.style.margin = "96px 0 46px 0";
    bodyMainContainer.append(courseDetailsCard);

    courseDetailsCardLink.style.display = "none";
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

  // STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  sjHeaderTextSubheading.style.display = "none";
  sjHeaderTextProgressBar.style.display = "none";

  // STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundImage = "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
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

    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;

    let curContainer = document.createElement("div");

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    function styleGroupContainer(container) {
      container.style.border = "2px solid #3443f4";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonEl, isLastChild) {
      lessonEl.classList.add("curriculum-lesson")
      // lessonEl.style.padding = "24px";// handled in CSS
      // lessonEl.style.fontSize = "16px";// handled in CSS
      // lessonEl.style.fontWeight = "400";// handled in CSS
      // lessonEl.style.lineHeight = "150%";// handled in CSS
      if (!isLastChild) {
        lessonEl.style.borderBottom = "2px solid #3443f4";
      }
    }

    function styleGroupHeading(groupHeadingContainer) {
      groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "2px solid #3443f4";

      //get actual group heading
      const groupHeading = groupHeadingContainer.querySelector("h3") || groupHeadingContainer;

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


//MOBILE VIEW STYLINGS
function mobileLoginPageStyling() {
  const {
    // fbBtn,
    googleBtn,
    // loginContent,
    // tabArrow,
    termsAndServicesText,
    loginContentContainer,
    orGoogleSignInContainer,
    orGoogleSignInInnerContainer,
    // orGoogleSignInInnerContainerListItems,
    signUpSignInContainer,
    loginTab,
    signInTab,
    signInTabText,
    orSignInWithContainer,
    orSignInWithTextEl,
    loginInput,
    passwordInput,
    loginBottomBtn,
    loginBottomBtnAndForgotPassBtn,
    loginForm,
    // footerContainer,
    footerCols,
    // tabs,
  } = getLoginPageElements()
  //NAV VARS
  // const logoImg = document.querySelector(".header-center-img");

  // termsAndServicesText.style.maxWidth = "368px"; // in CSS
  // termsAndServicesText.style.color = "#545454"; // in CSS
  // termsAndServicesText.style.fontSize = "14px"; // in CSS

  loginForm.append(termsAndServicesText);

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";

  // tabs.style.backgroundColor = "#F3F3F3"; // in CSS now
  // tabs.style.borderRadius = "100px"; // in CSS now
  // tabs.style.display = "flex"; // in CSS now
  // tabs.style.padding = "4px"; // in CSS now

  loginTab.querySelector("span span").textContent = "Log in";
  // loginTab.style.border = "0"; // CSS now
  // loginTab.style.display = "flex"; // CSS now
  // loginTab.style.padding = "8px 16px"; // CSS now
  // loginTab.style.alignItems = "center"; // CSS now
  loginTab.style.backgroundColor = "#3443F4";
  loginTab.style.color = "#fff";
  // loginTab.style.fontWeight = "500"; // CSS now
  // loginTab.style.fontSize = "16px"; // CSS now
  // loginTab.style.lineHeight = "24px"; // CSS now
  // loginTab.style.borderRadius = "100px"; // CSS now
  signInTab.querySelector("span").textContent = "Sign up";
  // signInTab.style.display = "flex"; // CSS now
  // signInTab.style.alignItems = "center"; // CSS now
  // signInTab.style.padding = "8px 16px"; // CSS now
  signInTabText.style.color = "#8C8C8C";
  // signInTabText.style.fontWeight = "500"; // CSS now
  // signInTabText.style.fontSize = "16px"; // CSS now
  // signInTabText.style.lineHeight = "24px"; // CSS now

  // STYLE THE LOGIN TEXT CONTENT BOX
  loginContentContainer.style.width = "100%";
  orGoogleSignInContainer.style.width = "100%";
  orGoogleSignInInnerContainer.style.padding = "0";
  // orGoogleSignInInnerContainerListItems.forEach((li) => li.style.padding = "0"); // now in CSS

  // longInNote.style.display = "none"; // CSS now
  orSignInWithContainer.style.paddingBottom = "0"; // TODO same set to global CSS
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
  // forgotPasswordText.style.fontSize = "16px"; // CSS now
  // forgotPasswordText.style.marginBottom = "2px"; // CSS now
  loginBottomBtnAndForgotPassBtn.style.marginBottom = "24px";

  //STYLING OF SIDE 'SIGN IN W/' GOOGLE ELS
  orSignInWithTextEl.textContent = "Or Log In With";
  googleBtn.textContent = "Continue with Google";

  // fbBtn.style.display = "none"; // now in CSS
  // googleBtn.style.backgroundColor = "#3443F4"; // now in CSS
  // googleBtn.style.width = "100%"; // now in CSS
  // googleBtn.style.textAlign = "center"; // now in CSS

  // loginContent.style.border = "0"; // now in CSS
  // tabArrow.style.display = "none"; // now in CSS

  //FOOTER STYLING
  // footerContainer.style.paddingLeft = 0; // now in CSS
  // footerContainer.style.paddingRight = 0; // now in CSS
  footerCols.forEach((col) => col.style.width = "212px");
}

function mobileSignUpPageStyling() {
  const {
    // fbBtn,
    googleBtn,
    loginContent,
    // tabArrow,
    termsAndServicesText,
    loginContentContainer,
    // orGoogleSignInContainer,
    // orGoogleSignInInnerContainer,
    // orGoogleSignInInnerContainerListItems,
    signUpSignInContainer,
    loginTab,
    signInTab,
    signInTabText,
    orSignInWithContainer,
    // orSignInWithTextEl,
    loginInput,
    passwordInput,
    // loginBottomBtn,
    // loginBottomBtnAndForgotPassBtn,
    // loginForm,
    // footerContainer,
    footerCols,
    // tabs,
  } = getLoginPageElements()

  // const fbBtn = document.getElementById("facebook_login");
  // const googleBtn = document.getElementById("google_login");
  // const loginContent = document.getElementById("login-content");
  // const tabArrow = document.getElementById("tab-marker-signup");
  // const termsAndServicesText = document.getElementById("access-message");
  // const loginContentContainer = document.querySelector(".large-6.columns");
  const orSignInWithGoogleContainer = loginContent.querySelectorAll(".row .large-6.columns")[3];
  const orSignInWithGoogleList = orSignInWithGoogleContainer.querySelector("ul");
  const orSignInWithGoogleItems = orSignInWithGoogleList.querySelectorAll("li");

  // const signUpSignInContainer = document.querySelector(".large-12.columns");
  // const loginTab = document.getElementById("login-tab-left");
  const loginTabText = loginTab.querySelector("a");
  // const signInTab = document.getElementById("login-tab-right");
  // const signInTabText = signInTab.querySelector("span");
  // const orSignInWithContainer = document.querySelector(".socialaccount_providers li");
  const orSignInWithText = document.querySelector(".sj-text-sign-up-with");
  const orSignInWithTextSpan = orSignInWithText.querySelector("span");

  const firstNameLabel = document.querySelector('label[for="id_first_name"] span span');
  const lastNameLabel = document.querySelector('label[for="id_last_name"] span span');

  const loginLabel = document.querySelector('label[for="id_email"]');
  // const loginInput = document.getElementById("id_email");
  // const passwordInput = document.getElementById("id_password1");
  const passwordInput2 = document.getElementById("id_password2");
  const signUpBottomBtn = document.getElementById("button-sign-up");
  const signUpForm = document.getElementById("signup_form");

  //FOOTER VARS
  // const footerContainer = document.getElementById("footer-container");
  // const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // termsAndServicesText.style.maxWidth = "368px"; // now in CSS
  // termsAndServicesText.style.color = "#545454"; // now in CSS
  // termsAndServicesText.style.fontSize = "14px"; // now in CSS
  signUpForm.append(termsAndServicesText);

  // STYLE LOGO
  // logoImg.style.minHeight = "48px"; // --> moving to CSS

  // STYLE THE LOGIN/SIGN UP TABS
  signUpSignInContainer.style.display = "flex";

  // const tabs = document.querySelector("#tabs");
  // tabs.style.backgroundColor = "#F3F3F3"; // CSS now
  // tabs.style.borderRadius = "100px"; // CSS now
  // tabs.style.display = "flex"; // CSS now
  // tabs.style.padding = "4px"; // CSS now

  loginTab.querySelector("span").textContent = "Log in";

  // loginTab.style.border = "0"; // CSS now
  // loginTab.style.display = "flex"; // CSS now
  // loginTab.style.padding = "8px 16px"; // CSS now
  // loginTab.style.alignItems = "center"; // CSS now
  // loginTab.style.borderRadius = "100px"; // CSS now
  loginTabText.style.color = "#8C8C8C";
  // loginTabText.style.fontWeight = "500"; // CSS now
  // loginTabText.style.fontSize = "16px"; // CSS now
  // loginTabText.style.lineHeight = "24px"; // CSS now
  // signInTab.style.display = "flex"; // CSS now
  // signInTab.style.alignItems = "center"; // CSS now
  // signInTab.style.padding = "8px 16px"; // CSS now
  signInTab.querySelector("span").textContent = "Sign up";
  signInTab.style.backgroundColor = "#3443F4";
  // signInTab.style.borderRadius = "100px"; // CSS now
  signInTabText.style.color = "#fff";
  // signInTabText.style.fontWeight = "500"; // CSS now
  // signInTabText.style.fontSize = "16px"; // CSS now
  // signInTabText.style.lineHeight = "24px"; // CSS now

  // STYLE THE SIGNUP TEXT CONTENT BOX
  loginContentContainer.style.width = "100%";

  orSignInWithGoogleContainer.style.width = "100%";
  orSignInWithGoogleContainer.style.padding = "0";

  orSignInWithGoogleList.style.padding = "0";
  orSignInWithGoogleItems.forEach((li) => li.style.padding = "0");

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
  orSignInWithTextSpan.textContent = "Or Sign Up With";
  googleBtn.textContent = "Continue with Google";

  // fbBtn.style.display = "none"; // now in CSS
  // googleBtn.style.backgroundColor = "#3443F4"; // now in CSS (actually dropped because doesn't do anything)
  // googleBtn.style.width = "100%"; // now in CSS
  // googleBtn.style.textAlign = "center"; // now in CSS

  // loginContent.style.border = "0"; // now in CSS
  // tabArrow.style.display = "none";// now in CSS

  document.querySelectorAll("label").forEach((label) => {
    label.style.marginBottom = "12px";
    label.style.fontWeight = "500";
    label.style.fontSize = "16px";
    label.style.lineHeight = "20px";

    if (label.getAttribute("for") === "id_password2") {
      label.querySelector(".input-label-text span").textContent =
        "Password confirm";
    }
  });

  document.querySelectorAll("input").forEach((input) => {
    input.style.borderRadius = "4px";
    input.style.borderColor = "rgb(220, 220, 220)";
    input.style.padding = "12px";
    input.style.lineHeight = "24px";

    if (input.getAttribute("id") === "id_password2") {
      input.setAttribute("placeholder", "Password confirm");
    }
  });

  //FOOTER STYLING
  // footerContainer.style.paddingLeft = 0; // now in CSS
  // footerContainer.style.paddingRight = 0; // now in CSS
  footerCols.forEach((col) => col.style.width = "212px");
}

function mobileCourseDetailsPageStyling() {
  const {
    // headerContainer,
    // headerFlexContainer,
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn,
    mainHeadingContainer,
    // mainVideoContainer,
    // backToCatalogBtn,
    // videoContainer,
    // signInHeaderText,
    // signInBtn,
    bodyContainer,
    // mobileBodyContent,
    // secondaryBodyContainer,
    curriculumListContainer,
    bodyColumns,
    curriculumListHeader,
    curriculumList,
    courseDetailCardListItems,
    checkboxIcon,
    registerBtnLink,
    registerBtnText,
    courseDetailsCardLink,
    // mainInfoCardContained
  } = getCourseDetailsPageElements()

  // const headerContainer = document.querySelector(".top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2");
  // const headerFlexContainer = document.querySelector(".row.dp-row-flex-v2");
  // const headingFloaterText = document.querySelector(".sj-floater-text");
  // const mainHeading = document.querySelector(".break-word");
  // const headingParagraph = document.querySelector(".sj-heading-paragraph");
  // const registerBtn = document.getElementById("purchase-button-wrapper-large");
  // const mainHeadingContainer = document.querySelector(".columns.text-center.large-6.dp-summary-wrapper.text-left-v2");
  // const mainVideoContainer = document.querySelector(".columns.large-6.text-center.dp-promo-image-wrapper");
  // const backToCatalogBtn = document.querySelector(".back-to-catalog");
  // const videoContainer = document.querySelector(".video-max");

  // SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  // const signInHeaderText = document.querySelector(".signin");

  // BODY VARIABLES
  // const bodyContainer = document.getElementById("dp-details");
  // const mobileBodyContent = document.querySelector(".row.show-for-small");
  // const secondaryBodyContainer = document.querySelector(".row.hide-for-small.padded-side-bottom");
  // const bodyColumns = secondaryBodyContainer.querySelectorAll(".columns");
  // const curriculumListContainer = document.querySelector(".dp-curriculum"); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  // const curriculumListHeader = curriculumListContainer.closest(".sj-curriculum-wrapper").querySelector("h3");
  // const curriculumList = curriculumListContainer.querySelectorAll("li");

  // CARD VARIABLES
  const courseDetailCardContainer = document.querySelectorAll(".course-details-card")[0];
  // const courseDetailCardListItems = courseDetailCardContainer.querySelectorAll("li");
  // const checkboxIcon = document.querySelector(".checkbox-icon");
  // const registerBtnLink = document.getElementById("purchase-button").getAttribute("href");
  // const registerBtnText = document.querySelector(".purchase-button-full-text").textContent;
  // const courseDetailsCardLink = document.querySelector(".course-details-card-link");

  // FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  // backToCatalogBtn.style.display = "none"; // set on CSS
  // mobileBodyContent.setAttribute("style", "display: none !important;"); // set on CSS

  // NAV STYLING
  // logoImg.style.minHeight = "48px"; // --> moved to CSS
  // if (signInHeaderText) {
  // signInHeaderText.style.display = "none"; // moved to CSS
  // signInBtn.style.marginRight = "24px"; // now in CSS
  // signInBtn.style.borderColor = "#3443F4"; // now in CSS
  // signInBtn.style.fontSize = "14px"; // now in CSS
  // signInBtn.style.lineHeight = "20px"; // now in CSS
  // signInBtn.style.backgroundColor = "#3443F4"; // now in CSS
  // signInBtn.style.color = "#fff"; // now in CSS

  // signInBtn.style.padding = "4px 8px"; // now in CSS
  // signInBtn.style.fontWeight = "500"; // now in CSS
  // }

  //headerContainer.style.margin = "0"; // now in CSS
  //headerContainer.style.maxWidth = "none"; // now in CSS
  //headerContainer.style.border = "0"; // now in CSS
  //headerContainer.style.background = "linear-gradient(146deg, rgba(245,246,255,1) 0%, rgba(254,231,254,1) 100%)"; // now in CSS
  // headerContainer.style.paddingTop = "48px"; // now in CSS
  // headerContainer.style.paddingBottom = "48px"; // now in CSS

  // headerFlexContainer.style.flexDirection = "column-reverse"; // now set in CSS
  // headerFlexContainer.style.flexWrap = "nowrap"; // now set in CSS
  // headerFlexContainer.style.justifyContent = "start"; // now set in CSS
  // headerFlexContainer.style.gap = "24px"; // now set in CSS
  // headerFlexContainer.style.maxWidth = "1188px"; // now set in CSS

  //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  // mainHeadingContainer.style.border = "0"; // now set on CSS
  // mainHeadingContainer.style.maxWidth = "none"; // now set on CSS
  // mainHeadingContainer.style.width = "100%"; // now set on CSS

  //  mainHeadingContainer.querySelector(".sj-course-info-wrapper").style.display = "none"; // now in CSS

  // headingFloaterText.style.display = "block"; // now set in CSS
  // headingFloaterText.style.marginBottom = "24px"; // now set in CSS

  // mainHeading.style.margin = "0 0 12px 0"; // now set in CSS
  // mainHeading.style.fontSize = "36px"; // now set in CSS
  // mainHeading.style.fontWeight = "600"; // now set in CSS
  // mainHeading.style.lineHeight = "43.2px"; // now set in CSS
  // mainHeading.style.letterSpacing = "-.02em"; // now set in CSS

  // headingParagraph.style.display = "block"; // now set in CSS
  // headingParagraph.style.margin = "0 0 24px 0"; // now set in CSS

  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  //VIDEO STYLING
  // mainVideoContainer.style.padding = "0"; // now set in CSS
  // mainVideoContainer.style.maxWidth = "none"; // now set in CSS
  // mainVideoContainer.style.width = "100%"; // now set in CSS
  // videoContainer.style.maxWidth = "none"; // now set in CSS
  // videoContainer.style.paddingLeft = "15px"; // now set in CSS
  // videoContainer.style.paddingRight = "15px"; // now set in CSS

  //COURSE DETAILS PAGE BODY STYLING
  // bodyContainer.style.padding = "0"; // now in CSS
  // bodyContainer.style.margin = "72px auto -10px auto"; // now in CSS
  // bodyContainer.style.maxWidth = "min(1152px, 90%)"; // now in CSS
  // bodyContainer.style.display = "grid"; // now in CSS
  // bodyContainer.style.gridTemplateColumns = "1fr"; // now in CSS
  // bodyContainer.style.columnGap = "24px"; // now in CSS

  // secondaryBodyContainer.style.padding = "0";
  // secondaryBodyContainer.style.maxWidth = "760px";
  // secondaryBodyContainer.setAttribute("style", "padding: 0; max-width: 760px; display: grid !important;"); // now in CSS

  bodyColumns.forEach((column) => fixColumn(column));

  //COURSE DETAILS CURRICULUM STYLING
  if (!initialLoadComplete) {
    const hasSections = curriculumListContainer.querySelector(".section")
      ? true
      : false;
    let curContainer = document.createElement("li");

    function styleGroupContainer(container) {
      container.style.border = "1px solid #DCDCDC";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    if (!hasSections) {
      styleGroupContainer(curContainer);
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
      // Check if current item contains 'section' class
      if (curListItem.classList.contains("section")) {
        // Push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);

        // Reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement("li");
        styleGroupContainer(curContainer);
        const newGroupHeading = document.createElement("div");
        newGroupHeading.innerHTML = curListItem.innerHTML;
        styleGroupHeading(newGroupHeading);
        curContainer.append(newGroupHeading);
      } else {
        // Normal/expected behaviour
        // Transfer inner html of current list item to new created div
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

    // LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    curriculumListHeader.style.display = "none";
    curriculumListContainer.style.padding = "0";

    // COURSE DETAILS CARD STYLING - ADD COURSE DETAILS CARD INTO RIGHT CONTAINER
    bodyContainer.append(courseDetailCardContainer);

    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      // iconClone.style.display = "block"; // now set on CSS
      // iconClone.style.flexShrink = "0"; // now set on CSS
      li.prepend(iconClone);
    });

    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute("href", registerBtnLink);
  }

  // COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  // courseDetailCardContainer.style.margin = "0 0 46px 0"; // now set in CSS
  // courseDetailCardContainer.style.justifySelf = "center"; // now set in CSS

  // FOOTER STYLING
  // footerContainer.style.paddingLeft = 0; // now in CSS
  // footerContainer.style.paddingRight = 0; // now in CSS
  footerCols.forEach((col) => col.style.width = "212px");
}

function mobileCurriculumPageNoCertificateStyling() {
  //HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper"); //DUPLICATE VAR
  const btn = document.getElementById("resume-button"); //DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); //DUPLICATE VAR

  // const backToCatalogLink = document.querySelector(".back-to-catalog");// handled in CSS
  // backToCatalogLink.style.display = "none"; // handled in CSS

  const curriculumPageHeader = document.querySelector(".top-row-grey.top-row-white-v2.padding-side.row-v2");
  const headerTextAndImgContainer = document.querySelector(".row.dp-row-flex-v2");
  const sjHeaderTextContainer = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper");
  const sjHeaderTextHeading = document.querySelector(".break-word");
  const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
  const sjHeaderTextProgressBar = document.querySelector(".progress-bar.button-border-color");
  const sjHeaderImgContainer = document.querySelector(".large-4.pull-8.columns.cp-promo-image-wrapper");
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");
  const resumeBtn = document.getElementById("resume-button");
  const btnText = resumeBtn.querySelector(".button span").textContent;
  const btnHref = resumeBtn.querySelector(".button").getAttribute("href");

  //BODY VARIABLES
  const bodyMainContainer = document.getElementById("cp-content");
  const InnerContentContainer = bodyMainContainer.querySelector(".columns");
  const tabsContainer = document.querySelector(".section-container.tabs");
  let [curriculumSection, aboutSection] = tabsContainer.querySelectorAll("section");
  const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
  const lessonListItems = document.querySelectorAll(".lesson-row");
  const curriculumParentContainer = document.getElementById("curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer = curriculumParentContainer.closest(".content");

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
  // logoImg.style.minHeight = "48px"; // --> moving to CSS

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
      // iconClone.style.display = "block"; // now set on CSS
      // iconClone.style.flexShrink = "0"; // now set on CSS
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
  curriculumPageHeader.style.backgroundImage = "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
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

    let curContainer = document.createElement("div");

    const hasSections = curriculumParentContainer.querySelector("h3")
      ? true
      : false;

    if (!hasSections) {
      curContainer.classList.add("curriculum-container")
      // styleGroupContainer(curContainer); // now CSS
    }

    // function styleGroupContainer(container) {
    //   container.style.border = "1px solid #DCDCDC";
    //   container.style.borderRadius = "8px";
    //   container.style.marginBottom = "48px";
    //   container.style.padding = "0";
    // } // now handled in CSS

    function styleListItem(lessonEl, isLastChild) {
      lessonEl.classList.add("curriculum-lesson")
      // lessonEl.style.padding = "24px"; // handled in CSS
      // lessonEl.style.fontSize = "16px"; // handled in CSS
      // lessonEl.style.fontWeight = "400"; // handled in CSS
      // lessonEl.style.lineHeight = "150%"; // handled in CSS
      if (!isLastChild) {
        lessonEl.style.borderBottom = "1px solid #DCDCDC";
      }
    }

    function styleGroupHeading(groupHeadingContainer) {
      groupHeadingContainer.classList.add("curriculum-group-container")
      // groupHeadingContainer.style.padding = "24px"; // handled in CSS
      // groupHeadingContainer.style.borderBottom = "1px solid #DCDCDC"; // handled in CSS

      //get actual group heading
      const groupHeading = groupHeadingContainer.querySelector("h3") || groupHeadingContainer;

      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.classList.add("curriculum-group-heading")

      // groupHeading.style.fontSize = "16px"; // handled in CSS
      // groupHeading.style.fontWeight = "500"; // handled in CSS
      // groupHeading.style.lineHeight = "125%"; // handled in CSS
      // groupHeading.style.letterSpacing = "-.16px"; // handled in CSS
      // groupHeading.style.margin = "0"; // handled in CSS
      // groupHeading.style.textWrap = "wrap"; // handled in CSS
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
        // Push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        // Reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        curContainer.classList.add("curriculum-container")
        // styleGroupContainer(curContainer); // now CSS

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
        // Normal/expected behaviour
        // Transfer inner html of current list item to new created div
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

  //FOOTER STYLING
  // footerContainer.style.paddingLeft = 0; // now in CSS
  // footerContainer.style.paddingRight = 0; // now in CSS
  footerCols.forEach((col) => col.style.width = "212px");
}

function mobileCurriculumPageYesCertificateStyling() {
  //HEADER VARIABLES
  const headingParagraph = document.querySelector(".sj-heading-paragraph");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const container = document.querySelector(
    ".large-8.push-4.columns.sj-summary.cp-summary-wrapper"
  ); //DUPLICATE VAR
  const mainHeading = document.querySelector(".break-word"); //DUPLICATE VAR

  // const backToCatalogLink = document.querySelector(".back-to-catalog");
  // backToCatalogLink.style.display = "none"; // now in CSS

  const curriculumPageHeader = document.querySelector(".top-row-grey.top-row-white-v2.padding-side.row-v2");
  const headerTextAndImgContainer = document.querySelector(".row.dp-row-flex-v2");
  const sjHeaderTextContainer = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper");
  const sjHeaderTextHeading = document.querySelector(".break-word");
  const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
  const sjHeaderTextProgressBar = document.querySelector(".progress-bar.button-border-color");
  const certificateEl = document.querySelector(".cp-certificate");
  const sjHeaderImgContainer = document.querySelector(".large-4.pull-8.columns.cp-promo-image-wrapper");
  const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
  const sjHeaderImg = document.querySelector(".cp-promo-image img");

  // BODY VARIABLES
  const bodyMainContainer = document.getElementById("cp-content");
  const InnerContentContainer = bodyMainContainer.querySelector(".columns");
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
  const curriculumParentContainer = document.getElementById("curriculum-list");
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer = curriculumParentContainer.closest(".content");

  //CARD VARIABLES
  const courseDetailsCard = document.querySelector(".course-details-card");
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
  const checkboxIcon = document.querySelector(".checkbox-icon");
  const courseDetailsCardLink = document.querySelector(".course-details-card-link");

  //FOOTER VARS
  const footerContainer = document.getElementById("footer-container");
  const footerCols = footerContainer.querySelectorAll(".global-footer-column");

  //NAV STYLING
  // logoImg.style.minHeight = "48px"; // --> moving to CSS

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = "grid";
  bodyMainContainer.style.gridTemplateColumns = "1fr";
  bodyMainContainer.style.width = "90%";

  courseDetailsCard.style.margin = "32px 0 56px 0";
  courseDetailsCard.style.justifySelf = "center";
  bodyMainContainer.append(courseDetailsCard);

  courseDetailsCardLink.style.display = "none";

  if (!initialLoadComplete) {
    courseDetailCardListItems.forEach((li) => {
      const iconClone = checkboxIcon.cloneNode(true);
      // iconClone.style.display = "block"; // now set on CSS
      // iconClone.style.flexShrink = "0"; // now set on CSS
      li.prepend(iconClone);
    });
  }

  bodyMainContainer.style.columnGap = "24px";
  InnerContentContainer.style.width = "100%";

  // STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = "600";
  sjHeaderTextHeading.style.fontSize = "36px";
  sjHeaderTextHeading.style.lineHeight = "43.2px";
  sjHeaderTextHeading.style.letterSpacing = "-0.5px";
  sjHeaderTextHeading.style.marginTop = "0";
  sjHeaderTextSubheading.style.display = "none";
  sjHeaderTextProgressBar.style.display = "none";

  // STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = "none";
  curriculumPageHeader.style.padding = "0";
  curriculumPageHeader.style.backgroundImage = "linear-gradient(315deg,#fde1fe,#f5f6fe 72%)";
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

    function styleGroupContainer(container) {
      container.style.border = "1px solid #DCDCDC";
      container.style.borderRadius = "8px";
      container.style.marginBottom = "48px";
      container.style.padding = "0";
    }

    function styleListItem(lessonEl, isLastChild) {
      lessonEl.classList.add("curriculum-lesson")
      // lessonEl.style.padding = "24px";// handled in CSS
      // lessonEl.style.fontSize = "16px";// handled in CSS
      // lessonEl.style.fontWeight = "400";// handled in CSS
      // lessonEl.style.lineHeight = "150%";// handled in CSS
      if (!isLastChild) {
        lessonEl.style.borderBottom = "1px solid #DCDCDC";
      }
    }

    function styleGroupHeading(groupHeadingContainer) {
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

    const curriculumItemsListNonLive = curriculumParentContainer.querySelectorAll(".curriculumItem");

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

  //FOOTER STYLING
  // footerContainer.style.paddingLeft = 0; // now in CSS
  // footerContainer.style.paddingRight = 0; // now in CSS
  footerCols.forEach((col) => col.style.width = "212px");
}

function mobileLessonPageStyling() {
  const {
    leftNav,
    mainLessonContentContainer,
    mainLessonContentSubContainer,
    mainLessonInnerContainer,
    // mainLessonMainContainer,
    lessonFooter,
    navOpenIcon,
    // hamburgerIcon,
    // xIcon,
    // lessonInnerContainer,
    copyIcon,
    lessonContentContainer,
    codeBlocks,
    // footerContainer,
    footerCols,
    parentEl,
    openIcon,
    // searchIcon,
    closeIcon,
    // navText,
    // lessonNavLinksContainer,
    backToCurriculumEl,
    links,
    sectionTitles,
  } = getLessonPageElements();

  //MAIN NAV STYLING
  // logoImg.style.minHeight = "48px"; // --> moving to CSS

  // lessonInnerContainer.style.maxWidth = "712px"; // handled in CSS
  // lessonInnerContainer.style.margin = "0 auto"; // handled in CSS

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  // STYLING TO ALIGN NAV ICON TO RIGHT CORNER AND STICKY
  // mainLessonContentContainer.style.position = "relative"; // handled in CSS
  // mainLessonContentContainer.style.display = "flex"; // handled in CSS
  // mainLessonContentContainer.style.flexDirection = "column"; // handled in CSS
  // mainLessonContentContainer.style.justifyContent = "space-between"; // handled in CSS

  mainLessonContentSubContainer.style.height = "auto";

  // mainLessonInnerContainer.style.margin = "0"; // handled in CSS
  // mainLessonInnerContainer.style.maxWidth = "none"; // handled in CSS
  // mainLessonInnerContainer.style.overflowX = "clip"; // handled in CSS
  // mainLessonMainContainer.style.position = "relative"; // handled in CSS
  // mainLessonMainContainer.style.zIndex = "0"; // handled in CSS
  // mainLessonMainContainer.style.paddingTop = "0"; // handled in CSS

  if (checkWindowWidth() >= 767) {
    navOpenIcon.style.top = "24px";
  } else {
    navOpenIcon.style.top = "56px";
  }
  // navOpenIcon.style.position = "sticky"; // handled in CSS
  // navOpenIcon.style.zIndex = "1"; // handled in CSS
  // navOpenIcon.style.paddingRight = "12px"; // handled in CSS
  // navOpenIcon.style.float = "right"; // handled in CSS

  // [hamburgerIcon, xIcon].forEach((el) => {
  //   el.style.padding = "6px";
  //   el.style.border = "1px solid gainsboro";
  //   el.style.borderRadius = "8px";
  //   el.style.background = "rgba(255, 255, 255, .8)";
  //   el.style.backdropFilter = "blur(1.5px)";
  // }); // handled in CSS

  ///////////////////////////////

  // lessonFooter.style.position = "relative"; // handled in CSS
  // lessonFooter.style.border = "0"; // handled in CSS
  // lessonFooter.style.backgroundColor = "transparent"; // handled in CSS

  // leftNav.style.position = "fixed"; // handled in CSS
  // leftNav.style.backgroundColor = "#f9f9f9"; // handled in CSS
  // leftNav.style.width = "320px"; // handled in CSS
  // leftNav.style.height = "100%"; // handled in CSS
  // leftNav.style.paddingBottom = "40px"; // handled in CSS

  // mainLessonContentContainer.style.height = "100vh"; // handled in CSS
  // mainLessonContentContainer.style.paddingBottom = "0"; // handled in CSS

  // HIDE FULL SCREEN BUTTON
  // fullScreenBtn.style.display = "none"; // --> CSS

  // SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  // footerContainer.style.marginTop = "0"; // moved to CSS for mobile
  // searchIcon.style.display = "none"; // in CSS now
  // navText.style.display = "none"; // in CSS now

  // HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains("cbp-spmenu-open")) {
    openIcon.style.display = "none";
  } else {
    closeIcon.style.display = "none";
  }

  // DEFAULT LEFT-NAV TO BE CLOSED ON OPEN
  document.querySelector("body").classList.remove("cbp-spmenu-open");
  leftNav.classList.remove("cbp-spmenu-open");
  openIcon.style.display = "inline-block";
  closeIcon.style.display = "none";

  // HANDLE CLICKS
  openIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    closeIcon.style.display = "inline-block";
  });
  closeIcon.addEventListener("click", (e) => {
    e.target.style.display = "none";
    openIcon.style.display = "inline-block";
  });

  document.getElementById("lpLeftNavBackground").addEventListener("click", () => {
    closeIcon.style.display = "none";
    openIcon.style.display = "inline-block";
  });

  // STYLING OF THE LEFT NAV LINKS
  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  // lessonNavLinksContainer.style.paddingBottom = "32px"; // now in CSS

  // STYLE EACH OF THE LESSON LINKS
  // links.forEach((link) => {
    // link.style.color = "#1C1C1C";
    // link.style.cursor = "pointer";

    // link.querySelector(".type-icon").style.display = "none"; // handled in CSS

    // const lessonLinkContainer = link.querySelector(".lesson-row");
    // lessonLinkContainer.style.display = "flex"; // handled in CSS
    // lessonLinkContainer.style.flexDirection = "row-reverse"; // handled in CSS
    // lessonLinkContainer.style.justifyContent = "space-between"; // handled in CSS
    // lessonLinkContainer.style.margin = "0 12px"; // handled in CSS
    // lessonLinkContainer.style.paddingLeft = "12px"; // handled in CSS
    // lessonLinkContainer.style.paddingRight = "12px"; // handled in CSS
    // lessonLinkContainer.style.fontSize = "14px"; // handled in CSS
    // lessonLinkContainer.style.lineHeight = "20px"; // handled in CSS
  // });

  //STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  sectionTitles.forEach((title) => {
    // title.style.backgroundColor = "transparent"; // handled in CSS
    // title.style.padding = "12px"; // handled in CSS
    // title.style.paddingLeft = "24px"; // handled in CSS
    // title.style.paddingRight = "24px"; // handled in CSS
    // title.style.marginTop = "12px"; // handled in CSS
    // title.style.marginBottom = "12px"; // handled in CSS
    // title.style.border = "0"; // handled in CSS
    // title.style.fontFamily = "Space Mono"; // handled in CSS
    // title.style.fontSize = "12px"; // handled in CSS
    // title.style.textTransform = "uppercase"; // handled in CSS
    // title.style.letterSpacing = ".05em"; // handled in CSS
  });

  //HANDLE CODE BLOCK CUSTOM STYLING

  function animateCopiedTooltip(tooltipEl) {
    tooltipEl.style.opacity = "1";

    setTimeout(() => {
      tooltipEl.style.opacity = "0";
    }, 400);
  }

  codeBlocks.forEach((el) => {
    // WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
    // el.style.padding = "0"; // handled in CSS
    // el.style.overflow = "visible"; // handled in CSS
    // el.style.position = "relative"; // handled in CSS

    const codeEl = el.querySelector("code");
    const copyText = codeEl.textContent;
    // codeEl.setAttribute(
    //   "style",
    //   "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
    // ); // handled in CSS

    // CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
    const container = document.createElement("div");
    container.classList.add("code-parent-container") // added as CSS now
    // container.style.display = "flex"; // handled as CSS
    // container.style.justifyContent = "end"; // handled as CSS
    // container.style.borderBottom = "1px solid gainsboro"; // handled as CSS
    // container.style.padding = "12px 24px"; // handled as CSS

    // CLONE COPYICON EL AND ADD TO CONTAINER
    const iconClone = copyIcon.cloneNode(true);
    iconClone.classList.add("code-icon") // added as CSS now
    // iconClone.style.display = "block"; // handled as CSS
    // iconClone.style.cursor = "pointer"; // handled as CSS
    container.append(iconClone);

    // CREATE 'COPIED' TOOLTIP
    const tooltipContainer = document.createElement("div");
    tooltipContainer.textContent = "Copied";
    tooltipContainer.classList.add("code-tooltip") // added as CSS now
    // tooltipContainer.style.position = "absolute"; // handled as CSS
    // tooltipContainer.style.top = "-24px"; // handled as CSS
    // tooltipContainer.style.right = "10px"; // handled as CSS
    // tooltipContainer.style.textShadow = "none"; // handled as CSS
    // tooltipContainer.style.backgroundColor = "#1c1c1c"; // handled as CSS
    // tooltipContainer.style.color = "#fff"; // handled as CSS
    // tooltipContainer.style.padding = "5px 10px"; // handled as CSS
    // tooltipContainer.style.borderRadius = "4px"; // handled as CSS
    // tooltipContainer.style.opacity = "0"; // handled as CSS
    // tooltipContainer.style.transition = "opacity .2s ease-in"; // handled as CSS

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
  });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => {
    el.setAttribute("target", "_blank");
  });

  // FOOTER STYLING
  // footerContainer.style.paddingLeft = 0; // in CSS now
  // footerContainer.style.paddingRight = 0; // in CSS now
  footerCols.forEach((col) => col.style.width = "212px");
}

function handlePageStyling(current) {
  const {
    page: {
      isCatalog,
      isCurriculum,
      isCourseDetailsPage,
      isLessons,
      isLogin,
      isSignUp,
      isPathDetail,
      isPathCatalog,
    },
    view,
  } = current;

  if (isCourseDetailsPage) {
    view === "desktop"
      ? desktopCourseDetailsPageStyling()
      : mobileCourseDetailsPageStyling();
  } else if (isPathDetail) {
    view === "desktop" ? desktopPathCourseDetailsPageStyling() : null;
  } else if (isPathCatalog) {
    view === "desktop" ? desktopPathCatalogPageStyling() : null;
  } else if (isLogin) {
    view === "desktop"
      ? desktopLoginPageStyling()
      : mobileLoginPageStyling();
  } else if (isSignUp) {
    view === "desktop"
      ? desktopSignUpPageStyling()
      : mobileSignUpPageStyling();
  } else if (isCurriculum) {
    const certificateEl = document.querySelector(".cp-certificate");

    if (!certificateEl) {
      view === "desktop"
        ? desktopCurriculumPageNoCertificateStyling()
        : mobileCurriculumPageNoCertificateStyling();
    } else {
      // CURRICULUM PAGE W COMPLETED CERTIFICATION GOES HERE [YESSS CERTIFICATION] <<<<<<<<<<< [CHECK TO MAKE SURE THIS WORKS; NOT TESTED]
      view === "desktop"
        ? desktopCurriculumPageYesCertificationStyling()
        : mobileCurriculumPageYesCertificateStyling();
    }
  } else if (isLessons) {
    view === "desktop"
      ? desktopLessonPageStyling()
      : mobileLessonPageStyling();
  } else if (isCatalog) {
    view === "desktop" ? desktopCatalogPageStyling() : null;
  }
}

function insertFooter(current) {
  const footerEl = document.getElementById("footer-container");

  footerEl.style.display = "flex";
  if (current.page.isLessons && current.view === "mobile") {
    footerEl.style.display = "none";
  }

  let contentContainer = current.page.isLessons ? document.querySelector(".sj-page-lesson") : document.getElementById("skilljar-content");
  contentContainer.append(footerEl);
}

function renderCourse() {
  const width = checkWindowWidth();

  if (width <= 991 && !(current.view === "mobile")) {
    current.view = "mobile";
    handlePageStyling(current);
  } else if (width > 991 && !(current.view === "desktop")) {
    current.view = "desktop";
    handlePageStyling(current);
  }

  // removeSJFooter(isLessonsPage);
  insertFooter(current);
  // makeContentVisible();
}

document.addEventListener("DOMContentLoaded", () => {
  // Handle first rendering
  renderCourse();
  initialLoadComplete = true;
});

window.addEventListener("resize", () => {
  // Handle resize rendering
  renderCourse();
});



// function makeContentVisible() { // --> CSS
//   const body = document.querySelector("body");

//   if (!body.classList.contains("sj-page-catalog")) {
//     body.setAttribute(
//       "style",
//       "visibility: visible !important; opacity: 1 !important"
//     );
//   }
// }

// function removeSJFooter(isLessonsPage = false) { // --> moving to CSS
// if (!isLessonsPage) {
//   document.getElementById("ep-footer").style.display = "none";
// }
// }