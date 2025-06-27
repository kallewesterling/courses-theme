/*
  *************** CONSTANTS + GLOBALS ***************
*/
const inProd = false; // Set to true if in production environment

let current = {};
let globalCurriculumSection, globalAboutSection;

/*
  *************** UTILITY FUNCTIONS ***************
*/

/*
  * Function to log messages with a timestamp
  * This function logs the current timestamp in HH:MM:SS format followed by the message
  * to the console.
  * @param {string} msg - The message to log.
  * @returns {string} - Returns the current timestamp in HH:MM:SS format
*/
const log = (msg) => console.log((new Date).toISOString().slice(11, 19), msg);

/*
  * Function to check if an element exists in the DOM
  * @param {string} selector - The CSS selector of the element to check.
  * @param {Element} [parent=document] - The parent element to search within.
  * @returns {boolean} - Returns true if the element exists, otherwise false.
*/
const elemExists = (selector, parent = document) => parent.querySelector(selector) ? true : false;

/*
  * Function to get the current viewport type based on window width
  * @returns {string} - Returns "mobile" if window width is less than or equal
  * to 991px, otherwise returns "desktop".
*/
const getViewport = () => checkWindowWidth() <= 991 ? "mobile" : "desktop";

/*
  * Function to check the current window width
  * @returns {number} - Returns the current window width in pixels.
*/
const checkWindowWidth = () => (
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth
);

/*
  *************** SKILLJAR THEME FUNCTIONS ***************
*/

/*
  * Function to apply styling to the desktop catalog page
  * This function modifies the catalog page by creating a new container for the catalog content,
  * appending a header, and moving the existing catalog courses into this new container.
  * @returns {void}
*/
function catalogPageStyling() {
  inProd ? undefined : log("[catalogPageStyling] Called");

  if (!current.initialLoadComplete) {
    const catalogContentContainer = document.createElement("div");
    catalogContentContainer.id = "catalog-content-wrapper";

    const allCoursesHeader = document.createElement("h2");
    allCoursesHeader.textContent = "All Courses";
    
    catalogContentContainer.append(allCoursesHeader, document.querySelector("#catalog-courses"));
    document.querySelector("#catalog-content").append(catalogContentContainer);
  }
}

/*
  * Function to attach the access message to a specified parent element
  * This function appends the access message element to the specified parent element in the DOM.
  * @param {string} parent - The ID of the parent element to which the access message will be appended.
  * @returns {void}
*/
const attachAccessMessage = (parent) => document.querySelector(`#${parent}`).append(document.querySelector("#access-message"));

/*
  * Function to fix the form on the login and signup pages
  * This function modifies the text content of the Google login button and the sign-up tab text.
  * @returns {void}
*/
function fixForm() {
  inProd ? undefined : log("[fixForm] Called");

  document.querySelector("button#google_login").textContent = "Continue with Google";
  document.querySelector("#login-tab-right span").textContent = "Sign Up";
}

/*
  * Function to apply styling to the login and signup pages
  * This function modifies the text content of the login and signup buttons, and appends the terms and conditions message.
  * It also fixes the form by calling the fixForm function.
  * @returns {void}
*/
function renderLogin() {
  inProd ? undefined : log("[loginPageStyling] Called");

  // general fixes
  fixForm();

  // append T&C to login form
  attachAccessMessage("login_form");

  // fix text content
  document.querySelector("button#button-sign-in").textContent = "Log In";
  document.querySelector("#login-tab-left span span").textContent = "Log In";
  document.querySelector("h4.sj-text-sign-in-with span").textContent = "Or Log In With";
}

/*
  * Function to apply styling to the sign-up page.
  * This function modifies the text content of the sign-up button, login tab text, and input placeholders.
  * It also appends the terms and conditions message to the sign-up form.
  * @returns {void}
*/
function renderSignup() {
  inProd ? undefined : log("[signUpPageStyling] Called");

  // general fixes
  fixForm();

  // append T&C to signup form
  attachAccessMessage("signup_form");

  // fix text content
  document.querySelector("button#button-sign-up span").textContent = "Sign up";
  document.querySelector("#login-tab-left a span").textContent = "Log In";
  document.querySelector("h4.sj-text-sign-up-with span").textContent = "Or Sign Up With";

  // fix inputs
  document.querySelector("input#id_email").setAttribute("placeholder", "Work Email");
  document.querySelector("input#id_password2").setAttribute("placeholder", "Password Confirm");

  // fix labels
  document.querySelector('label[for="id_first_name"] span span').textContent = "First Name";
  document.querySelector('label[for="id_last_name"] span span').textContent = "Last Name";
  document.querySelector('label[for="id_email"]').textContent = "Work Email";
  document.querySelector("label[for=id_password2] .input-label-text span").textContent = "Password Confirm";
}

function courseCatalog(injectDescription = true, floaterText = "Course") {
  inProd ? undefined : log(`[courseCatalog] Called with injectDescription: ${injectDescription}, floaterText: ${floaterText}`);
  
  // get elements
  const mainHeadingContainer = document.querySelector(".dp-summary-wrapper, sj-summary");
  const headingFloaterText = document.querySelector(".sj-floater-text");
  const mainHeading = document.querySelector(".break-word");
  const headingParagraph = mainHeadingContainer.querySelector("h2");
  const registerBtn = document.querySelector("#purchase-button-wrapper-large");
  
  // fix text content
  headingFloaterText.textContent = floaterText;
  
  if (injectDescription)
    headingParagraph.textContent = skilljarCourse.short_description || ""; // eslint-disable-line no-undef

  // append elements to the main heading container
  mainHeadingContainer.append(
    headingFloaterText || "<!-- headingFloaterText -->",
    mainHeading        || "<!-- mainHeading -->",
    headingParagraph   || "<!-- headingParagraph -->",
    registerBtn        || "<!-- registerBtn -->"
  );
}

function dropElems() {
  // remove unwanted elements
  [
    // ...document.querySelectorAll(".lesson-item .type-icon"),
    ...document.querySelectorAll("li.lesson-modular"),
    ...document.querySelectorAll("li.lesson-web-package"),
    ...document.querySelectorAll("span.sj-lesson-time"), // lesson time, we don't use
  ].forEach((el) => el.remove());
}

function desktopCourseDetailsPageStyling() {
  /* 
  in our staging environment, this function is called on this page:
  https://chainguard-test.skilljar.com/secure-or-sorry-understanding-software-vulnerabilities
  */
  inProd ? undefined : log("[desktopCourseDetailsPageStyling] Called");

  courseCatalog();

  let [aboutSection, curriculumSection] = document.querySelectorAll("#dp-details .hide-for-small .columns");
  curriculumSection.id = "curriculum-section";
  aboutSection.id = "about-section";

  if (!current.initialLoadComplete) {
    inProd ? undefined : log("initalLoadComplete is false -->");
    let curContainer = document.createElement("li");
    
    const hasSections = elemExists(".section", document.querySelector(".dp-curriculum"));
    if (!hasSections) {
      curContainer.classList.add("module-list");
    }

    const curriculumListContainer = document.querySelector(".dp-curriculum"); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)! // ~

    curriculumListContainer.querySelectorAll("li").forEach((li) => {
      if (li.classList.contains("section")) {
        curriculumListContainer.append(curContainer);

        curContainer = document.createElement("li");
        curContainer.classList.add("module-list");

        const item = document.createElement("div");
        item.innerHTML = li.innerHTML;
        item.classList.add("module-list-heading");
        item.textContent = item?.textContent?.trim();        
        curContainer.append(item);
      } else {
        const item = document.createElement("div");
        item.innerHTML = li.innerHTML;
        item.classList.add("lesson-item");
        curContainer.append(item);
      }
      li.style.display = "none";
    });

    curriculumListContainer.append(curContainer);
  }

  //COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  const courseDetailCardContainer = document.querySelector(".course-details-card"); // ~
  if (courseDetailCardContainer) {
    document.querySelector("#dp-details").append(courseDetailCardContainer);
    if (!current.initialLoadComplete) {
      document.querySelectorAll(".course-details-card li").forEach((li) => {
        li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
      });
    }
  }

  const courseDetailsCardLink = document.querySelector(".course-details-card-link"); // ~
  if (courseDetailsCardLink) {
    const text = document.querySelector(".purchase-button-full-text").textContent.trim();
    const link = document.querySelector("a#purchase-button").getAttribute("href") || "";
    courseDetailsCardLink.textContent = text;
    courseDetailsCardLink.setAttribute("href", link);
  }

  dropElems();
}

/*
  * Function to apply styling to the course details page for learning paths
  * This function modifies the text content of the heading floater, main heading, and heading paragraph.
  * It also appends these elements to the summary wrapper.
  * @returns {void}
*/
function desktopPathCourseDetailsPageStyling() {
  inProd ? undefined : log("[desktopPathCourseDetailsPageStyling] Called");
  
  courseCatalog(false, "Learning Path"); // false to not inject description
  // const mainHeading = document.querySelector(".break-word"); // ~
  // const headingParagraph = document.querySelector(".sj-course-info-wrapper h2"); // ~
  // const registerBtn = document.querySelector("#purchase-button-wrapper-large"); // ~
  
  // document.querySelector(".dp-summary-wrapper").append(
  //   headingFloaterText,
  //   mainHeading,
  //   headingParagraph,
  //   registerBtn
  // );

  dropElems();
}

function desktopPathCatalogPageStyling() {
  inProd ? undefined : log("[desktopPathCatalogPageStyling] Called");
  const backArrowBtn = document.querySelector(".back-to-catalog"); // ~

  const mainContentContainer = document.querySelector("#catalog-content"); // ~
  const topContentContainer = mainContentContainer.querySelector(".path-curriculum-resume-wrapper"); // ~
  const coursesList = document.querySelectorAll("#catalog-courses .coursebox-container") // ~

  coursesList.forEach((course) => {
    // Outer border
    course.style.border = "2px solid #D0CFEE";
    course.style.borderRadius = "20px";

    // Inner border
    const innerContainer = course.querySelector(".course-overview"); // ~
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
  backArrowBtn.style.display = "none";

  // MAIN CONTENT STYLING
  mainContentContainer.style.margin = "96px auto";
  topContentContainer.style.display = "none";
}

function desktopLessonPageStyling() {
  inProd ? undefined : log("[desktopLessonPageStyling] Called");
  const leftNav = document.querySelector("#lp-left-nav"); // ~
  const mainLessonContentContainer = document.querySelector("#lp-wrapper"); // ~
  const mainLessonContentSubContainer = document.querySelector("#lp-content"); // ~
  const mainLessonInnerContainer = document.querySelector("#lesson-body"); // ~
  const mainLessonMainContainer = document.querySelector("#lesson-main"); // ~

  const lessonFooter = document.querySelector("#lp-footer"); // ~
  const navOpenIcon = document.querySelector("#left-nav-button"); // ~
  const hamburgerIcon = navOpenIcon.querySelector(".fa.fa-bars"); // ~
  const xIcon = navOpenIcon.querySelector(".fa.fa-times"); // ~

  const fullScreenBtn = document.querySelector(".toggle-fullscreen.focus-link-v2"); // ~
  // LESSON BODY VARS
  const lessonInnerContainer = document.querySelector("#lesson-main-inner"); // ~
  const copyIcon = document.querySelector(".copy-icon"); // ~
  const lessonContentContainer = document.querySelector("sjwc-lesson-content-item"); // ~
  const codeBlocks = lessonContentContainer.querySelectorAll("pre"); // ~

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

  leftNav.style.position = "absolute";
  leftNav.style.backgroundColor = "#f9f9f9";
  leftNav.style.width = "320px";
  leftNav.style.marginBottom = "0px";

  mainLessonContentContainer.style.height = "100vh";
  mainLessonContentContainer.style.overflowY = "auto";
  mainLessonContentContainer.style.paddingBottom = "0";

  // HIDE FULL SCREEN BUTTON
  fullScreenBtn.style.display = "none";

  // SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector(".sj-page-lesson"); // ~

  const openIcon = document.querySelector(".fa.fa-bars"); // ~
  const searchIcon = document.querySelector(".fa.fa-search"); // ~
  const closeIcon = document.querySelector(".fa.fa-times"); // ~
  const navText = document.querySelector(".burger-text.sj-text-lessons"); // ~

  searchIcon.style.display = "none";
  navText.style.display = "none";

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

  // STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.querySelector("#curriculum-list-2"); // ~
  const backToCurriculumEl = document.querySelector("#left-nav-return-text"); // ~
  const links = lessonNavLinksContainer.querySelectorAll("a"); // ~
  const sectionTitles = lessonNavLinksContainer.querySelectorAll(".section-title"); // ~

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  lessonNavLinksContainer.style.paddingBottom = "32px";

  // STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon"); // ~
    const lessonLinkContainer = link.querySelector(".lesson-row"); // ~

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

  function animateCopiedTooltip(tooltipEl) {
    inProd ? undefined : log("[animateCopiedTooltip] Called");
    tooltipEl.style.opacity = "1";

    setTimeout(() => {
      tooltipEl.style.opacity = "0";
    }, 400);
  }

  codeBlocks.forEach((el) => {
    // WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
    el.style.padding = "0";
    el.style.overflow = "visible";
    el.style.position = "relative";
    const codeEl = el.querySelector("code"); // ~

    codeEl.setAttribute(
      "style",
      "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
    );
    codeEl.style.display = "inline-block";
    codeEl.style.padding = "24px"; // !important
    codeEl.style.overflowX = "scroll";
    codeEl.style.width = "100%";
    const copyText = codeEl.textContent;

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
  });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => { // ~
    el.setAttribute("target", "_blank");
  });

  // LESSON CONTENT FOOTER
  const prevBtn = document.querySelector(".button-prev-title span"); // ~
  if (prevBtn) {
    prevBtn.style.color = "#14003d";
  }
}

function desktopCurriculumPageNoCertificateStyling() {
  /*
  in our staging environment, this function is called on this page:
  https://chainguard-test.skilljar.com/vulnerability-management-certification
  */
  inProd ? undefined : log("[desktopCurriculumPageNoCertificateStyling] Called");
  
  let [curriculumSection, aboutSection] = document.querySelectorAll(".section-container.tabs section"); // ~
  curriculumSection.id = "curriculum-section";
  aboutSection.id = "about-section";
  aboutSection.classList.add("active"); /* TODO: This may be causing some problem */

  const curriculumList = document.querySelector("#curriculum-list"); // ~
  // const curriculumOutsideContainer = curriculumList.closest(".content");

  const tabsContainer = document.querySelector(".section-container.tabs"); // ~
  if (current.initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const courseDetailsCard = document.querySelector(".course-details-card"); // ~
  const courseDetailsCardLink = document.querySelector(".course-details-card-link"); // ~
  
  if (courseDetailsCard) {
    const bodyMainContainer = document.querySelector("#cp-content"); // ~
    bodyMainContainer.append(courseDetailsCard);

    if (!document.querySelector("#resume-button")) {
      courseDetailsCardLink.style.display = "none";
    }
  }

  const btnText = document.querySelector("#resume-button .button span").textContent || "";
  const btnHref = document.querySelector("#resume-button .button").getAttribute("href") || "";
  if (courseDetailsCardLink && btnText && btnHref) {
    courseDetailsCardLink.textContent = btnText;
    courseDetailsCardLink.setAttribute("href", btnHref);
  }

  if (!current.initialLoadComplete) {
    document.querySelectorAll(".course-details-card li").forEach((li) => {
      li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
    });
  }

  courseCatalog();
  // const headingParagraph = document.querySelector(".sj-heading-paragraph"); // ~
  // headingParagraph.textContent = skilljarCourse.short_description;  // eslint-disable-line no-undef

  // const container = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper"); // ~
  // const headingFloaterText = document.querySelector(".sj-floater-text"); // ~
  // const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR // ~

  // container.append(
  //   headingFloaterText,
  //   mainHeading,
  //   headingParagraph,
  //   resumeBtn || ""
  // );

  // CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  
  if (!current.initialLoadComplete) {
    // add vars to global
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumList.querySelector("h3") ? true : false; // ~
    let curContainer = document.createElement("div");

    if (!hasSections) {
      curContainer.classList.add("module-list");
    }

    document.querySelector("#curriculum-list").childNodes.forEach((el) => {
      if (el?.tagName) {
        el.classList.add("curriculum-item");
      }
    });

    document.querySelectorAll("#curriculum-list .curriculum-item").forEach((el) => {
      if (el.tagName === "DIV") {
        // Yes? push curContainer into parent container
        curriculumList.append(curContainer);
        // reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        curContainer.classList.add("module-list");

        const newGroupHeadingContainer = document.createElement("div");
        newGroupHeadingContainer.classList.add("module-list-heading-container");

        const newGroupHeading = document.createElement("h3");
        newGroupHeading.textContent = el.querySelector("h3").textContent; // ~
        newGroupHeadingContainer.append(newGroupHeading);

        const groupHeading = newGroupHeadingContainer.querySelector("h3") || newGroupHeadingContainer; // ~
        groupHeading.classList.add("module-list-heading");
        groupHeading.textContent = groupHeading?.textContent?.trim();

        curContainer.append(newGroupHeadingContainer);
        el.style.display = "none";
      } else {
        const newListEl = document.createElement("div");
        newListEl.classList.add("lesson-item");

        el.querySelector(".title").style.textWrap = "wrap"; // ~

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumList.append(curContainer);

    // curriculumOutsideContainer.querySelector("h2").style.display = "none"; // ~
    // curriculumOutsideContainer.querySelector("hr").style.display = "none"; // ~

    globalCurriculumSection.setAttribute(
      "style",
      "padding: 0 !important; margin-top: 48px !important;"
    );
    globalAboutSection.setAttribute("style", "padding: 0 !important");
  }

  dropElems();
}

function desktopCurriculumPageYesCertificationStyling() {
  inProd ? undefined : log("[desktopCurriculumPageYesCertificationStyling] Called");
  
  let [curriculumSection, aboutSection] = document.querySelectorAll(".section-container.tabs section"); // ~
  curriculumSection.id = "curriculum-section";
  aboutSection.id = "about-section";
  
  const tabsContainer = document.querySelector(".section-container.tabs"); // ~
  if (current.initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const courseDetailsCard = document.querySelector(".course-details-card"); // ~

  // STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  const bodyMainContainer = document.querySelector("#cp-content"); // ~
  if (courseDetailsCard) {
    bodyMainContainer.append(courseDetailsCard);

    document.querySelector(".course-details-card-link").style.display = "none";
  }

  if (!current.initialLoadComplete) {
    document.querySelectorAll(".course-details-card li").forEach((li) => {
      li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
    });
  }

  // RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  courseCatalog(false); // false to not inject description
  // const container = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper"); // DUPLICATE VAR // ~  
  // const headingFloaterText = document.querySelector(".sj-floater-text"); // ~
  // const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR // ~
  // const headingParagraph = document.querySelector(".sj-heading-paragraph"); // ~
  // headingParagraph.textContent = skilljarCourse.short_description;  // eslint-disable-line no-undef
  
  // container.append(
  //   headingFloaterText,
  //   mainHeading,
  //   headingParagraph,
  // );
  
  const certificateEl = document.querySelector(".cp-certificate"); // ~
  document.querySelector(".sj-summary").append(certificateEl);

  // CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  aboutSection.classList.add("active");

  // NEW CURRICULUM DISPLAY STYLING
  if (!current.initialLoadComplete) {
    // set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    // Check if course has Sections/Modules/Parts
    const hasSections = elemExists("h3", document.querySelector("#curriculum-list"));
    let curContainer = document.createElement("div");

    if (!hasSections) {
      // styleGroupContainer(curContainer);
      curContainer.classList.add("module-list");
    }

    function styleGroupHeading(groupHeadingContainer) {
      inProd ? undefined : log("[styleGroupHeading] Called");
      groupHeadingContainer.classList.add("module-list-heading-container");

      // get actual group heading
      const groupHeading = groupHeadingContainer.querySelector("h3") || groupHeadingContainer; // ~
      groupHeading.classList.add("module-list-heading");
      groupHeading.textContent = groupHeading?.textContent?.trim();
    }

    document.querySelector("#curriculum-list").childNodes.forEach((el) => {
      if (el?.tagName) {
        el.classList.add("curriculum-item");
      }
    });

    const curriculumParentContainer = document.querySelector("#curriculum-list"); // ~

    document.querySelectorAll("#curriculum-list .curriculum-item").forEach((el) => {
      if (el.tagName === "DIV") {
        // Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        // reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        curContainer.classList.add("module-list");

        const newGroupHeadingContainer = document.createElement("div");
        newGroupHeadingContainer.classList.add("module-list-heading-container");
        
        const newGroupHeading = document.createElement("h3");
        newGroupHeading.textContent = el.querySelector("h3").textContent; // ~
        newGroupHeadingContainer.append(newGroupHeading);

        styleGroupHeading(newGroupHeadingContainer);

        curContainer.append(newGroupHeadingContainer);
        el.style.display = "none";
      } else {
        // else, normal/expected behaviour
        // transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        newListEl.classList.add("curriculum-item");
        newListEl.classList.add("lesson-item");
        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumParentContainer.append(curContainer);

    // curriculumOutsideContainer.querySelector("h2").style.display = "none"; // ~
    // curriculumOutsideContainer.querySelector("hr").style.display = "none"; // ~
  }

  dropElems();
}

function mobileCourseDetailsPageStyling() {
  /* 
  in our staging environment, this function is called on this page:
  https://chainguard-test.skilljar.com/secure-or-sorry-understanding-software-vulnerabilities
  */

  inProd ? undefined : log("[mobileCourseDetailsPageStyling] Called");
  
  courseCatalog();

  const curriculumListContainer = document.querySelector(".dp-curriculum"); // NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)! // ~
  const curriculumListHeader = curriculumListContainer
    .closest(".sj-curriculum-wrapper")
    .querySelector("h3"); // ~

  // CARD VARIABLES
  const courseDetailCardContainer = document.querySelectorAll(".course-details-card")[0]; // ~
  const courseDetailsCardLink = document.querySelector(".course-details-card-link"); // ~

  const secondaryBodyContainer = document.querySelector(".row.hide-for-small.padded-side-bottom"); // ~
  secondaryBodyContainer.style.padding = "0";
  secondaryBodyContainer.style.maxWidth = "760px";
  secondaryBodyContainer.style.display = "grid"; // !important;

  // COURSE DETAILS CURRICULUM STYLING
  if (!current.initialLoadComplete) {
    const hasSections = elemExists(".section", document.querySelector(".dp-curriculum")); // ~
    let curContainer = document.createElement("li");

    if (!hasSections) {
      curContainer.classList.add("module-list");
      curContainer.classList.add("module-list-gray-border");
    }

    function styleListItem(lessonEl) {
      inProd ? undefined : log("[styleListItem] Called");

      const lessonItemText = lessonEl.querySelector(".lesson-wrapper"); // ~
      lessonItemText.style.padding = "24px";
      lessonItemText.style.fontSize = "16px";
      lessonItemText.style.fontWeight = "400";
      lessonItemText.style.lineHeight = "150%";
    }

    function styleGroupHeading(groupHeading) {
      inProd ? undefined : log("[styleGroupHeading] Called");
      groupHeading.classList.add("module-list-heading");
      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.borderBottom = "1px solid #DCDCDC";
      curContainer.append(groupHeading);
    }

    document.querySelectorAll(".dp-curriculum li").forEach((li) => {
      // first check if current item contains 'section' class
      if (li.classList.contains("section")) {
        // Yes? push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);
        // reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement("li");
        curContainer.classList.add("module-list");
        curContainer.classList.add("module-list-gray-border");

        const newGroupHeading = document.createElement("div");
        newGroupHeading.innerHTML = li.innerHTML;
        styleGroupHeading(newGroupHeading);
        curContainer.append(newGroupHeading);
      } else {
        // else, normal/expected behaviour
        // transfer inner html of current list item to new created div
        const newListItem = document.createElement("div");
        newListItem.innerHTML = li.innerHTML;
        newListItem.classList.add("lesson-item");
        newListItem.classList.add("lesson-item-gray-border");
        styleListItem(newListItem);
        curContainer.append(newListItem);
      }
      li.style.display = "none";
    });

    // LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    curriculumListHeader.style.display = "none";
    curriculumListContainer.style.padding = "0";

    // COURSE DETAILS CARD STYLING
    // ADD COURSE DETAILS CARD INTO RIGHT CONTAINER
    const bodyContainer = document.querySelector("#dp-details"); // ~
    bodyContainer.append(courseDetailCardContainer);
    if (!current.initialLoadComplete) {
      document.querySelectorAll(".course-details-card li").forEach((li) => {
        li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
      });
    }

    const registerBtnLink = document
      .querySelector("#purchase-button")
      .getAttribute("href");
    const registerBtnText = document.querySelector(".purchase-button-full-text").textContent; // ~
    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute("href", registerBtnLink);
  }

  dropElems();
}

function mobileCurriculumPageNoCertificateStyling() {
  inProd ? undefined : log("[mobileCurriculumPageNoCertificateStyling] Called");  

  let [curriculumSection, aboutSection] = document.querySelectorAll(".section-container.tabs section");
  curriculumSection.id = "curriculum-section";
  aboutSection.id = "about-section";
  
  const curriculumList = document.querySelector("#curriculum-list"); // ~
  // const curriculumOutsideContainer = curriculumList.closest(".content");
  
  const tabsContainer = document.querySelector(".section-container.tabs"); // ~
  if (current.initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const bodyMainContainer = document.querySelector("#cp-content"); // ~
  const courseDetailsCard = document.querySelector(".course-details-card"); // ~
  bodyMainContainer.append(courseDetailsCard);
  
  const courseDetailsCardLink = document.querySelector(".course-details-card-link"); // ~
  if (courseDetailsCardLink) {
    const text = document.querySelector("#resume-button .button span").textContent; // ~
    const link = document.querySelector("#resume-button .button").getAttribute("href"); // ~
    courseDetailsCardLink.textContent = text;
    courseDetailsCardLink.setAttribute("href", link);
  }

  if (!current.initialLoadComplete) {
    document.querySelectorAll(".course-details-card li").forEach((li) => {;
      li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
    });
  }
  
  
  // RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  // const container = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper"); // DUPLICATE VAR // ~
  // const headingFloaterText = document.querySelector(".sj-floater-text"); // ~
  // const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR // ~
  // const headingParagraph = document.querySelector(".sj-heading-paragraph"); // ~
  // const btn = document.querySelector("#resume-button"); // ~
  
  // container.append(headingFloaterText, mainHeading, headingParagraph, btn);

  courseCatalog(false); // false to not inject description

  // CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  aboutSection.classList.add("active");
  curriculumSection.style.marginTop = "48px";

  aboutSection.querySelector("h3").style.fontWeight = "600"; // ~
  aboutSection.querySelector(".title").style.display = "none"; // ~
  aboutSection.querySelector(".content").style.border = "0"; // ~
  aboutSection.querySelector(".content").style.padding = "0"; // ~
  curriculumSection.querySelector(".title").style.display = "none"; // ~
  const curriculumSectionH2 = curriculumSection.querySelector("h2"); // ~
  if (curriculumSectionH2) {
    curriculumSectionH2.style.fontWeight = "600";
  }
  curriculumSection.querySelector(".content").style.border = "0"; // ~
  curriculumSection.querySelector(".content").style.padding = "0"; // ~

  if (!current.initialLoadComplete) {
    // set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    const hasSections = elemExists("h3", curriculumList); // ~
    let curContainer = document.createElement("div");

    if (!hasSections) {
      curContainer.classList.add("module-list");
      curContainer.classList.add("module-list-gray-border");
    }

    function styleGroupHeading(groupHeadingContainer) {
      inProd ? undefined : log("[styleGroupHeading] Called");
      groupHeadingContainer.classList.add("module-list-heading-container");
      // groupHeadingContainer.style.padding = "24px";
      groupHeadingContainer.style.borderBottom = "1px solid #DCDCDC";

      // get actual group heading
      const groupHeading = groupHeadingContainer.querySelector("h3") || groupHeadingContainer; // ~
      groupHeading.classList.add("module-list-heading");
      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.textWrap = "wrap";
    }

    document.querySelector("#curriculum-list").childNodes.forEach((el) => {
      if (el?.tagName) {
        el.classList.add("curriculum-item");
      }
    });

    document.querySelectorAll("#curriculum-list .curriculum-item").forEach((el) => {
      if (el.tagName === "DIV") {
        // Yes? push curContainer into parent container
        curriculumList.append(curContainer);
        // reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        curContainer.classList.add("module-list");
        curContainer.classList.add("module-list-gray-border");

        const newGroupHeadingContainer = document.createElement("div");
        newGroupHeadingContainer.classList.add("module-list-heading-container");
        
        const newGroupHeading = document.createElement("h3");
        newGroupHeading.textContent = el.querySelector("h3").textContent; // ~
        newGroupHeadingContainer.append(newGroupHeading);

        styleGroupHeading(newGroupHeadingContainer);

        curContainer.append(newGroupHeadingContainer);
        el.style.display = "none";
      } else {
        // else, normal/expected behaviour
        // transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        newListEl.classList.add("lesson-item");
        newListEl.classList.add("lesson-item-gray-border");
        el.querySelector(".title").style.textWrap = "wrap"; // ~
        inProd ? undefined : log("[mobileCurriculumPageNoCertificateStyling] Wrap ran");

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumList.append(curContainer);

    // curriculumOutsideContainer.querySelector("h2").style.display = "none"; // ~
    // curriculumOutsideContainer.querySelector("hr").style.display = "none"; // ~
  }

  dropElems();
}

function mobileCurriculumPageYesCertificateStyling() {
  inProd ? undefined : log("[mobileCurriculumPageYesCertificateStyling] Called");
  
  let [curriculumSection, aboutSection] = document.querySelectorAll(".section-container.tabs section");
  curriculumSection.id = "curriculum-section";
  aboutSection.id = "about-section";
  
  const tabsContainer = document.querySelector(".section-container.tabs"); // ~
  if (current.initialLoadComplete) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const curriculumList = document.querySelector("#curriculum-list"); // ~
  // const curriculumOutsideContainer = curriculumList.closest(".content");

  // CARD VARIABLES
  const courseDetailsCardLink = document.querySelector(".course-details-card-link"); // ~

  const bodyMainContainer = document.querySelector("#cp-content"); // ~
  const courseDetailsCard = document.querySelector(".course-details-card"); // ~
  bodyMainContainer.append(courseDetailsCard);

  courseDetailsCardLink.style.display = "none";

  if (!current.initialLoadComplete) {
    document.querySelectorAll(".course-details-card li").forEach((li) => {
      li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
    });
  }
  
  // RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  // const container = document.querySelector(".large-8.push-4.columns.sj-summary.cp-summary-wrapper"); // DUPLICATE VAR // ~
  // const headingFloaterText = document.querySelector(".sj-floater-text"); // ~
  // const mainHeading = document.querySelector(".break-word"); // ~
  // const headingParagraph = document.querySelector(".sj-heading-paragraph"); // ~
  
  // container.append(
  //   headingFloaterText,
  //   mainHeading,
  //   headingParagraph,
  // );

  courseCatalog(false); // false to not inject description
  
  const certificateEl = document.querySelector(".cp-certificate"); // ~
  document.querySelector(".sj-summary").append(certificateEl);

  // CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  aboutSection.classList.add("active");
  curriculumSection.style.marginTop = "48px";

  aboutSection.querySelector("h3").style.fontWeight = "600"; // ~
  aboutSection.querySelector(".title").style.display = "none"; // ~
  aboutSection.querySelector(".content").style.border = "0"; // ~
  aboutSection.querySelector(".content").style.padding = "0"; // ~
  curriculumSection.querySelector(".title").style.display = "none"; // ~
  curriculumSection.querySelector("h2").style.fontWeight = "600"; // ~
  curriculumSection.querySelector(".content").style.border = "0"; // ~
  curriculumSection.querySelector(".content").style.padding = "0"; // ~

  // NEW CURRICULUM DISPLAY STYLING
  if (!current.initialLoadComplete) {
    // set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    const hasSections = curriculumList.querySelector("h3") ? true : false; // ~
    let curContainer = document.createElement("div");

    if (!hasSections) {
      curContainer.classList.add("module-list");
      curContainer.classList.add("module-list-gray-border");
    }

    function styleGroupHeading(groupHeadingContainer) {
      inProd ? undefined : log("[styleGroupHeading] Called");
      groupHeadingContainer.classList.add("module-list-heading-container");
      groupHeadingContainer.style.borderBottom = "1px solid #DCDCDC";

      // get actual group heading
      const groupHeading = groupHeadingContainer.querySelector("h3") || groupHeadingContainer; // ~
      groupHeading.classList.add("module-list-heading");
      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.textWrap = "wrap";
    }

    document.querySelector("#curriculum-list").childNodes.forEach((el) => {
      if (el?.tagName) {
        el.classList.add("curriculum-item");
      }
    });

    document.querySelectorAll("#curriculum-list .curriculum-item").forEach((el) => {
      if (el.tagName === "DIV") {
        // Yes? push curContainer into parent container
        curriculumList.append(curContainer);
        // reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement("div");
        // styleGroupContainer(curContainer);
        curContainer.classList.add("module-list");
        curContainer.classList.add("module-list-gray-border");

        const newGroupHeadingContainer = document.createElement("div");
        newGroupHeadingContainer.classList.add("module-list-heading-container");
        
        const newGroupHeading = document.createElement("h3");
        newGroupHeading.textContent = el.querySelector("h3").textContent; // ~
        newGroupHeadingContainer.append(newGroupHeading);

        styleGroupHeading(newGroupHeadingContainer);

        curContainer.append(newGroupHeadingContainer);
        el.style.display = "none";
      } else {
        // else, normal/expected behaviour
        // transfer inner html of current list item to new created div
        const newListEl = document.createElement("div");
        newListEl.classList.add("lesson-item");
        newListEl.classList.add("lesson-item-gray-border");
        el.querySelector(".title").style.textWrap = "wrap"; // ~

        newListEl.append(el);
        curContainer.append(newListEl);
      }
    });

    curriculumList.append(curContainer);

    // curriculumOutsideContainer.querySelector("h2").style.display = "none"; // ~
    // curriculumOutsideContainer.querySelector("hr").style.display = "none"; // ~
  }

  dropElems();
}

function mobileLessonPageStyling() {
  inProd ? undefined : log("[mobileLessonPageStyling] Called");
  const leftNav = document.querySelector("#lp-left-nav"); // ~
  const mainLessonContentContainer = document.querySelector("#lp-wrapper"); // ~
  const mainLessonContentSubContainer = document.querySelector("#lp-content"); // ~
  const mainLessonInnerContainer = document.querySelector("#lesson-body"); // ~
  const mainLessonMainContainer = document.querySelector("#lesson-main"); // ~

  const lessonFooter = document.querySelector("#lp-footer"); // ~
  const navOpenIcon = document.querySelector("#left-nav-button"); // ~
  const hamburgerIcon = navOpenIcon.querySelector(".fa.fa-bars"); // ~
  const xIcon = navOpenIcon.querySelector(".fa.fa-times"); // ~
  const leftNavMobileOverlay = document.querySelector("#lpLeftNavBackground"); // ~
  const fullScreenBtn = document.querySelector(".toggle-fullscreen.focus-link-v2"); // ~
  // LESSON BODY VARS
  const lessonInnerContainer = document.querySelector("#lesson-main-inner"); // ~
  const copyIcon = document.querySelector(".copy-icon"); // ~
  const lessonContentContainer = document.querySelector("sjwc-lesson-content-item"); // ~
  const codeBlocks = lessonContentContainer.querySelectorAll("pre"); // ~

  // FOOTER VARS
  const footerContainer = document.querySelector("#footer-container"); // ~
  const footerCols = footerContainer.querySelectorAll(".global-footer-column"); // ~

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

  if (checkWindowWidth() >= 767) {
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

  leftNav.style.position = "fixed";
  leftNav.style.backgroundColor = "#f9f9f9";
  leftNav.style.width = "320px";
  leftNav.style.height = "100%";
  leftNav.style.paddingBottom = "40px";
  mainLessonContentContainer.style.height = "100vh";
  mainLessonContentContainer.style.paddingBottom = "0";

  // HIDE FULL SCREEN BUTTON
  fullScreenBtn.style.display = "none";

  // SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector(".sj-page-lesson"); // ~

  footerContainer.style.marginTop = "0";

  const openIcon = document.querySelector(".fa.fa-bars"); // ~
  const searchIcon = document.querySelector(".fa.fa-search"); // ~
  const closeIcon = document.querySelector(".fa.fa-times"); // ~
  const navText = document.querySelector(".burger-text.sj-text-lessons"); // ~

  searchIcon.style.display = "none";
  navText.style.display = "none";

  // HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains("cbp-spmenu-open")) {
    openIcon.style.display = "none";
  } else {
    closeIcon.style.display = "none";
  }

  // DEFAULT LEFT-NAV TO BE CLOSED ON OPEN
  document.querySelector("body").classList.remove("cbp-spmenu-open"); // ~
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
  leftNavMobileOverlay.addEventListener("click", () => {
    closeIcon.style.display = "none";
    openIcon.style.display = "inline-block";
  });

  // STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.querySelector("#curriculum-list-2"); // ~
  const backToCurriculumEl = document.querySelector("#left-nav-return-text"); // ~
  const links = lessonNavLinksContainer.querySelectorAll("a"); // ~
  const sectionTitles = lessonNavLinksContainer.querySelectorAll(".section-title"); // ~

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = "Back to Course Overview";
  }

  lessonNavLinksContainer.style.paddingBottom = "32px";

  // STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector(".type-icon"); // ~
    const lessonLinkContainer = link.querySelector(".lesson-row"); // ~

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

  function animateCopiedTooltip(tooltipEl) {
    inProd ? undefined : log("[animateCopiedTooltip] Called");
    tooltipEl.style.opacity = "1";

    setTimeout(() => {
      tooltipEl.style.opacity = "0";
    }, 400);
  }

  codeBlocks.forEach((el) => {
    // WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
    el.style.padding = "0";
    el.style.overflow = "visible";
    el.style.position = "relative";
    const codeEl = el.querySelector("code"); // ~
    codeEl.setAttribute(
      "style",
      "display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%"
    );
    const copyText = codeEl.textContent;

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
  });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll("a").forEach((el) => { // ~
    el.setAttribute("target", "_blank");
  });

  // FOOTER STYLING
  footerContainer.style.paddingLeft = 0;
  footerContainer.style.paddingRight = 0;
  footerCols.forEach((col) => {
    col.style.width = "212px";
  });
}

function renderPage() {
  inProd ? undefined : log("[renderPage] Called");

  /* Route to correct view */
  if (current.isCourseDetailsPage) {
    current.viewport === "desktop"
      ? desktopCourseDetailsPageStyling()
      : mobileCourseDetailsPageStyling();
  } else if (current.isPageDetailPath) {
    current.viewport === "desktop" ? desktopPathCourseDetailsPageStyling() : null;
  } else if (current.isPageCatalogPath) {
    current.viewport === "desktop" ? desktopPathCatalogPageStyling() : null;
  } else if (current.isLoginPage) {
    renderLogin(); // we use the same for both desktop and mobile
  } else if (current.isSignUpPage) {
    renderSignup(); // we use the same for both desktop and mobile
  } else if (current.isCurriculumPage) {
    const certificateEl = document.querySelector(".cp-certificate"); // ~

    if (!certificateEl) {
      current.viewport === "desktop"
        ? desktopCurriculumPageNoCertificateStyling()
        : mobileCurriculumPageNoCertificateStyling();
    } else {
      // CURRICULUM PAGE W COMPLETED CERTIFICATION GOES HERE [YESSS CERTIFICATION] <<<<<<<<<<< [CHECK TO MAKE SURE THIS WORKS; NOT TESTED]
      current.viewport === "desktop"
        ? desktopCurriculumPageYesCertificationStyling()
        : mobileCurriculumPageYesCertificateStyling();
    }
  } else if (current.isLessonsPage) {
    current.viewport === "desktop"
      ? desktopLessonPageStyling()
      : mobileLessonPageStyling();
  } else if (current.isCatalogPage) {
    catalogPageStyling(); // we use the same for both desktop and mobile
  }

  /* Insert footer in the right place */
  let contentContainer = current.isLessonsPage ? document.querySelector(".sj-page-lesson") : document.querySelector("#skilljar-content"); // ~
  contentContainer.append(document.querySelector("#footer-container"));
}

document.addEventListener("DOMContentLoaded", () => {
  // Handle initial rendering
  inProd ? undefined : log("[DOMContentLoaded] Called");

  // isCatalogPage is true if the page displays the catalog of courses (i.e. the landing page)
  current.isCatalogPage = elemExists("body.sj-page-catalog"); 
  
  // isCurriculumPage is true if the page displays a course's curriculum which is not part of a learning path
  current.isCurriculumPage = elemExists("body.sj-page-curriculum");
  
  // isCourseDetailsPage is true if the page displays a course's details that is part of a learning path
  current.isCourseDetailsPage = elemExists("body.sj-page-detail-course");
  
  // isLessonsPage is true if the page displays one of a course's lesson
  current.isLessonsPage = elemExists("body.sj-page-lesson");
  
  // isLoginPage is true if the page displays a login form
  current.isLoginPage = elemExists("body.sj-page-login");
  
  // isLoginPage is true if the page displays a sign up form
  current.isSignUpPage = elemExists("body.sj-page-signup");

  // isPageDetailPath is true if the page displays a learning path's details
  current.isPageDetailPath = elemExists("body.sj-page-detail-path");

  current.isPageCatalogPath = elemExists(".sj-page-catalog.sj-page-series.sj-page-path");
  
  current.viewport = getViewport();
  inProd ? undefined : log(`[DOMContentLoaded] current: ${current}`);
  
  renderPage();

  inProd ? undefined : log("[DOMContentLoaded] current.initialLoadComplete set to true");
  current.initialLoadComplete = true;
});

window.addEventListener("resize", () => {
  current.viewport = getViewport();
  
  inProd ? undefined : log(`[event:resize] current.viewport: ${current.viewport}`);
  
  renderPage();
});
