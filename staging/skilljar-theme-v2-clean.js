/*
*************** CONSTANTS + GLOBALS ***************
*/
const inProd = false, // Set to true if in production environment
      current = {};

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
const log = (msg) => inProd ? undefined : console.log((new Date).toISOString().slice(11, 19), msg);

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
const checkWindowWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

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
    log("[renderCatalog] Called");

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
    log("[fixForm] Called");

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
    log("[renderLogin] Called");

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
    log("[renderSignup] Called");

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

/*
  *************** SKILLJAR THEME UTILITY FUNCTIONS ***************
*/

function renderAllStart() {
    log("[renderAllStart] Called");
}

function renderAllEnd() {
    log("[renderAllEnd] Called");

    // Insert footer in the right place
    if (current.page === "lesson")
        document.querySelector(".sj-page-lesson").append(document.querySelector("#footer-container"));
    else
        document.querySelector("#skilljar-content").append(document.querySelector("#footer-container"));
}

/*
  *************** SKILLJAR THEME FUNCTIONS: Curriculum and course/path info ***************
*/

function renderCommonStart() {
    log("[renderCommonStart] Called");

    renderAllStart(); // before anything else
    
    // set ids for elements
    document.querySelector("#skilljar-content .top-row-grey").id = "cta";
    if (document.querySelectorAll("#dp-details .hide-for-small .columns")) {
        let [aboutSection, curriculumSection] = document.querySelectorAll("#dp-details .hide-for-small .columns");
        curriculumSection.id = "curriculum-section";
        aboutSection.id = "about-section";
    }

    // move elements to the right place
    const courseDetailCardContainer = document.querySelector(".course-details-card");
    if (courseDetailCardContainer)
        document.querySelector("#dp-details").append(courseDetailCardContainer);
    
    // add checkbox icon to course details card
    if (!current.initialLoadComplete)
        document.querySelectorAll(".course-details-card li").forEach((li) => {
            li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
        });
}

function renderCommonEnd() {
    log("[renderCommonEnd] Called");

    renderAllEnd(); // after everything else
}

function renderCurriculum() { // fka desktopCurriculumPageNoCertificateStyling / mobileCurriculumPageNoCertificateStyling / desktopCurriculumPageYesCertificationStyling / mobileCurriculumPageYesCertificateStyling
    log("[renderCurriculum] Called");

    renderCommonStart();

    // ...

    renderCommonEnd();
}


function renderCourseDetails() { // fka desktopCourseDetailsPageStyling / mobileCourseDetailsPageStyling
    log("[renderCourseDetails] Called");

    renderCommonStart();

    // ...

    renderCommonEnd();
}


function renderPathDetails() { // fka desktopPathCourseDetailsPageStyling
    log("[renderPathDetails] Called");

    renderCommonStart();

    // ...

    renderCommonEnd();
}


function renderPathCatalog() { // fka desktopPathCatalogPageStyling
    log("[renderPathCatalog] Called");

    renderCommonStart();

    // ...

    renderCommonEnd();
}


/*
  *************** SKILLJAR THEME FUNCTIONS: Lesson ***************
*/

function renderLessonStart() {
    log("[renderLessonStart] Called");

    renderAllStart(); // before anything else

    // ...
}


function renderLessonEnd() {
    log("[renderLessonEnd] Called");

    // ...
    
    renderAllEnd(); // after everything else
}


function renderLesson() { // fka desktopLessonPageStyling / mobileLessonPageStyling
    log("[renderLesson] Called");
    renderLessonStart();
    
    // ...

    renderLessonEnd();
}


/*
  *************** ROUTING and GENERAL ***************
*/

function renderPage() {
  log("[renderPage] Called");

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
}

document.addEventListener("DOMContentLoaded", () => {
  // Handle initial rendering
  log("[DOMContentLoaded] Called");

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
  log(`[DOMContentLoaded] current.page: ${current.page}; current viewport: ${current.viewport}`);
  
  renderPage();

  log("[DOMContentLoaded] current.initialLoadComplete set to true");
  current.initialLoadComplete = true;
});

window.addEventListener("resize", () => {
  current.viewport = getViewport();
  
  log(`[event:resize] current.viewport: ${current.viewport}`);
  
  renderPage();
});
