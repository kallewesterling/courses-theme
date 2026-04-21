import { CG } from "./CG.mjs";
import { logger } from "./logger.mjs";
import { Q, el } from "./utils.mjs";
import { debugHeading } from "./debug.mjs";
import {
  pathUnregisteredView,
  pathRegisteredView,
  courseUnregisteredView,
  courseRegisteredView,
  lessonView,
  authView,
  catalogView,
  notFoundView,
} from "./views/index.mjs";

/**
 * An array of page handlers that map specific page conditions to their corresponding view functions.
 * Each handler contains a test function to determine if the current page matches the condition,
 * and a handler function to execute if the condition is met.
 */
export const pageHandlers = [
  { test: () => CG.page.isLogin || CG.page.isSignup, handler: authView },
  { test: () => CG.page.isCourseUnregistered, handler: courseUnregisteredView },
  {
    test: () => CG.page.isCourseRegistered,
    handler: courseRegisteredView,
  },
  { test: () => CG.page.isPathUnregistered, handler: pathUnregisteredView },
  { test: () => CG.page.isPathRegistered, handler: pathRegisteredView },
  { test: () => CG.page.isLesson, handler: lessonView },
  { test: () => CG.page.isLanding || CG.page.isCatalog, handler: catalogView },
  { test: () => CG.page.is404, handler: notFoundView },
];

/**
 * Main routing function that checks the current page against defined handlers and executes the appropriate view function.
 * It iterates through the `pageHandlers` array, testing each handler's condition against the current page state.
 * If a match is found, it logs the handler being executed and calls the corresponding view function.
 * If no handlers match the current page, it logs a warning message.
 * @returns {void}
 */
export function route() {
  // find first matching handler
  const match = pageHandlers.find(({ test }) => test());

  // run handler if found
  if (match) {
    logger.info(`Running page styling handler: ${match.handler.name}`);
    match.handler();
  } else {
    logger.warn("No page styling handler matched for this page.");
  }
}

/* 
 * Pre-route setup function to prepare the DOM and environment before routing logic is applied.
 * This function handles tasks such as moving navigation buttons, adding header elements, and setting up admin debug features.
 * It ensures that the necessary DOM structure and elements are in place before the main routing logic is executed.
 */
export function preRoute() {
  // set body classes
  if (CG.page.isCourseRegistered) {
    CG.dom.body.classList.add("course-registered-view");

    if (CG.state.course.completed)
      CG.dom.body.classList.add("course-completed-view");
  }
  
  if (CG.page.isCourseUnregistered)
    CG.dom.body.classList.add("course-unregistered-view");

  if (CG.page.isLesson)
    // if a lesson page, we need to move the nav button before we modify the header
    CG.dom.contentContainer.append(Q("#left-nav-button"));

  // admin debug heading
  if (CG.env.isAdmin) debugHeading();

  if (!CG.page.isSignup && !CG.page.isLogin) {
    // add chainguard link + mobile header
    Q("#main-container").insertBefore(
      CG.el.mobileHeader,
      CG.dom.bodyHeader.nextSibling
    );

    CG.dom.headerRight.insertBefore(
      CG.el.toChainguard,
      CG.dom.headerRight.firstChild
    );

    CG.dom.mobileHeader = {
      container: Q("header#mobile-header"),
      left: Q("#mobile-header-left"),
      right: Q("#mobile-header-right"),
    };
  } else if (CG.env.isPartner) {
    // add partner menu item
    const partnerItem = el("a", {
      href: "/page/partners",
      text: "Partner Courses",
    });
    CG.dom.headerLeft.appendChild(partnerItem);
    CG.dom.mobileHeader.left.appendChild(partnerItem.cloneNode(true));
  }
}

/*
 * Post-route setup function to finalize the DOM adjustments after routing logic has been applied.
 * This function handles tasks such as appending breadcrumbs, adjusting header elements based on the page type, and moving the footer and messages to their final positions.
 * It ensures that the page is fully set up with the correct elements and structure after the main routing logic has executed.
 */
export function postRoute() {
  // append breadcrumbs above the header band (.top-row-grey) on course/path pages
  if (CG.page.isCoursePage || CG.page.isPathRegistered) {
    Q(".top-row-grey")?.before(CG.state.breadcrumbs.nav);
  }

  // move footer
  CG.dom.contentContainer.append(Q("#footer-container"));

  // move messages
  CG.dom.contentContainer.prepend(Q("#messages"));
}