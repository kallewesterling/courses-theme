/*
  *************** CONSTANTS + GLOBALS ***************
*/
const inProd = false; // Set to true if in production environment

let current = {};

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
  *************** SKILLJAR THEME FUNCTIONS: Landing Page ***************
*/

/*
  * Function to apply styling to the desktop catalog page
  * This function modifies the catalog page by creating a new container for the catalog content,
  * appending a header, and moving the existing catalog courses into this new container.
  * @returns {void}
*/
function renderCatalog() { // fka catalogPageStyling
  inProd ? undefined : log("[renderCatalog] Called");

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
  *************** SKILLJAR THEME FUNCTIONS: Login/signup ***************
*/

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
function renderLogin() { // fka loginPageStyling
  inProd ? undefined : log("[renderLogin] Called");

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
function renderSignup() { // fka signUpPageStyling
  inProd ? undefined : log("[renderSignup] Called");

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


function renderCurriculum() { // fka desktopCurriculumPageNoCertificateStyling / mobileCurriculumPageNoCertificateStyling / desktopCurriculumPageYesCertificationStyling / mobileCurriculumPageYesCertificateStyling
  inProd ? undefined : log("[renderCurriculum] Called");
}


function renderCourseDetails() { // fka desktopCourseDetailsPageStyling / mobileCourseDetailsPageStyling
  inProd ? undefined : log("[renderCourseDetails] Called");
}


function renderLesson() { // fka desktopLessonPageStyling / mobileLessonPageStyling
  inProd ? undefined : log("[renderLesson] Called");
}


function renderPathDetails() { // fka desktopPathCourseDetailsPageStyling
    inProd ? undefined : log("[renderPathDetails] Called");
}


function renderPathCatalog() { // fka desktopPathCatalogPageStyling
    inProd ? undefined : log("[renderPathCatalog] Called");
}









function renderPage() {
  inProd ? undefined : log("[renderPage] Called");

  if (current.page === "catalog")
    renderCatalog();

  if (current.page === "login")
    renderLogin();

  if (current.page === "sign-up")
    renderSignup();

  if (current.page === "curriculum")
    renderCurriculum();

  if (current.page === "course-details")
    renderCourseDetails();

  if (current.page === "lesson")
    renderLesson();

  if (current.page === "path-details")
    renderPathDetails();

  if (current.page === "path-catalog")
    renderPathCatalog();

  /* Route to correct view */
//   if (current.isCourseDetailsPage) {
//     current.viewport === "desktop"
//       ? desktopCourseDetailsPageStyling()
//       : mobileCourseDetailsPageStyling();
//   } else if (current.isPageDetailPath) {
//     current.viewport === "desktop" ? desktopPathCourseDetailsPageStyling() : null;
//   } else if (current.isPageCatalogPath) {
//     current.viewport === "desktop" ? desktopPathCatalogPageStyling() : null;
//   } else if (current.isLoginPage) {
//     renderLogin(); // we use the same for both desktop and mobile
//   } else if (current.isSignUpPage) {
//     renderSignup(); // we use the same for both desktop and mobile
//   } else if (current.isCurriculumPage) {
//     const certificateEl = document.querySelector(".cp-certificate"); // ~

//     if (!certificateEl) {
//       current.viewport === "desktop"
//         ? desktopCurriculumPageNoCertificateStyling()
//         : mobileCurriculumPageNoCertificateStyling();
//     } else {
//       // CURRICULUM PAGE W COMPLETED CERTIFICATION GOES HERE [YESSS CERTIFICATION] <<<<<<<<<<< [CHECK TO MAKE SURE THIS WORKS; NOT TESTED]
//       current.viewport === "desktop"
//         ? desktopCurriculumPageYesCertificationStyling()
//         : mobileCurriculumPageYesCertificateStyling();
//     }
//   } else if (current.isLessonsPage) {
//     current.viewport === "desktop"
//       ? desktopLessonPageStyling()
//       : mobileLessonPageStyling();
//   } else if (current.isCatalogPage) {
//     catalogPageStyling(); // we use the same for both desktop and mobile
//   }

  /* Insert footer in the right place */
  let contentContainer = current.isLessonsPage ? document.querySelector(".sj-page-lesson") : document.querySelector("#skilljar-content"); // ~
  contentContainer.append(document.querySelector("#footer-container"));
}

document.addEventListener("DOMContentLoaded", () => {
  // Handle initial rendering
  inProd ? undefined : log("[DOMContentLoaded] Called");

  // Page is "catalog" if the page displays the catalog of courses (i.e. the landing page)
  if (elemExists("body.sj-page-catalog"))
    current.page = "catalog";

  // Page is "curriculum" if the page displays a course's curriculum which is not part of a learning path
  if (elemExists("body.sj-page-curriculum"))
    current.page = "curriculum";

  // Page is "course-details" if the page displays a course's details that is part of a learning path
  if (elemExists("body.sj-page-detail-course"))
    current.page = "course-details";
  
  // Page is "lesson" if the page displays one of a course's lesson
  if (elemExists("body.sj-page-lesson"))
    current.page = "lesson";
  
  // Page is "path-details" if the page displays a learning path's details
  if (elemExists("body.sj-page-detail-path"))
    current.page = "path-details";

  // Page is "path-catalog" if the page displays a catalog of learning paths
  if (elemExists("body.sj-page-series.sj-page-path"))
    current.page = "path-catalog";

  // Page is "login" if the page displays a login form
  if (elemExists("body.sj-page-login"))
    current.page = "login";

  // Page is "sign-up" if the page displays a sign up form
  if (elemExists("body.sj-page-signup"))
    current.page = "sign-up";
  
  current.viewport = getViewport();
  inProd ? undefined : log(`[DOMContentLoaded] current.page: ${current.page}; current viewport: ${current.viewport}`);
  
  renderPage();

  inProd ? undefined : log("[DOMContentLoaded] current.initialLoadComplete set to true");
  current.initialLoadComplete = true;
});

window.addEventListener("resize", () => {
  current.viewport = getViewport();
  
  inProd ? undefined : log(`[event:resize] current.viewport: ${current.viewport}`);
  
  renderPage();
});
