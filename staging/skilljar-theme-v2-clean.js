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
    current.page = "catalog";

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
    current.page = "login";

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
    current.page = "sign-up";

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
    
    // get needed info
    const btn = document.querySelector("a#purchase-button");
    current.cardText = btn.textContent.trim();
    current.cardLink = btn.href || "";
    console.log(current);

    // set ids for elements
    document.querySelector("#skilljar-content .top-row-grey").id = "cta";
    document.querySelector("#dp-details .hide-for-small").id = "course-info";
    if (document.querySelectorAll("#dp-details #course-info .columns")) {
        let [aboutSection, curriculumSection] = document.querySelectorAll("#dp-details .hide-for-small .columns");
        curriculumSection.id = "curriculum-section";
        aboutSection.id = "about-section";
    }

    // remove the "hide for small" class from the course details section
    document.querySelector("#dp-details #course-info").classList.remove("hide-for-small");

    // move elements to the right place
    const courseDetailsCard = document.querySelector(".course-details-card");
    if (courseDetailsCard)
        document.querySelector("#dp-details").append(courseDetailsCard);
    
    // add checkbox icon to course details card
    document.querySelectorAll(".course-details-card li").forEach((li) => {
        li.prepend(document.querySelector(".checkbox-icon").cloneNode(true));
    });

    // fix link on course details card
    const courseDetailsCardLink = document.querySelector(".course-details-card-link");
    courseDetailsCardLink.textContent = current.cardText;
    courseDetailsCardLink.href = current.cardLink;
}

function renderCommonEnd() {
    log("[renderCommonEnd] Called");

    // drop the "show for small" element
    document.querySelector("#dp-details .show-for-small").remove();

    // remove .sj-course-info-wrapper
    document.querySelector(".sj-course-info-wrapper").remove();

    renderAllEnd(); // after everything else
}

function renderCurriculum() { // fka desktopCurriculumPageNoCertificateStyling / mobileCurriculumPageNoCertificateStyling / desktopCurriculumPageYesCertificationStyling / mobileCurriculumPageYesCertificateStyling
    log("[renderCurriculum] Called");
    current.page = "curriculum";

    renderCommonStart();

    // ...

    renderCommonEnd();
}


function renderCourseDetails() { // fka desktopCourseDetailsPageStyling / mobileCourseDetailsPageStyling
    log("[renderCourseDetails] Called");
    current.page = "course-details";

    renderCommonStart();

    // ...

    renderCommonEnd();
}


function renderPathDetails() { // fka desktopPathCourseDetailsPageStyling
    log("[renderPathDetails] Called");
    current.page = "path-details";

    renderCommonStart();

    // ...

    renderCommonEnd();
}


function renderPathCatalog() { // fka desktopPathCatalogPageStyling
    log("[renderPathCatalog] Called");
    current.page = "path-catalog";

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
    current.page = "lesson";

    renderLessonStart();
    
    // ...

    renderLessonEnd();
}


/*
  *************** ROUTING and GENERAL ***************
*/

document.addEventListener("DOMContentLoaded", () => {
    // Handle initial rendering
    log("[DOMContentLoaded] Called");

    current.viewport = getViewport();
    log(`[DOMContentLoaded] Current viewport: ${current.viewport}`);

    // The page displays the catalog of courses (i.e. the landing page)
    if (elemExists("body.sj-page-catalog"))
        renderCatalog();

    // The page displays a course's curriculum which is not part of a learning path
    if (elemExists("body.sj-page-curriculum"))
        renderCurriculum();

    // The page displays a course's details that is part of a learning path
    if (elemExists("body.sj-page-detail-course"))
        renderCourseDetails();
  
    // The page displays one of a course's lesson
    if (elemExists("body.sj-page-lesson"))
        renderLesson();
  
    // The page displays a learning path's details
    if (elemExists("body.sj-page-detail-path"))
        renderPathDetails();

    // The page displays a catalog of learning paths
    if (elemExists("body.sj-page-series.sj-page-path"))
        renderPathCatalog();

    // The page displays a login form
    if (elemExists("body.sj-page-login"))
        renderLogin();

    // The page displays a sign up form
    if (elemExists("body.sj-page-signup"))
        renderSignup();

    log("[DOMContentLoaded] current.initialLoadComplete set to true");
    current.initialLoadComplete = true;
});

/*
Dropping the following as we should not need to re-render on resize
This is because the page should be responsive and adapt to the viewport
size without needing a re-render.
*/
// window.addEventListener("resize", () => {
//   current.viewport = getViewport();
  
//   log(`[event:resize] current.viewport: ${current.viewport}`);
  
//   renderPage();
// });
