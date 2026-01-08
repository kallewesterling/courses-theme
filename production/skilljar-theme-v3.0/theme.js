const pageHandlers = [
  { test: () => CG.page.isLogin || CG.page.isSignup, handler: authView },
  { test: () => CG.page.isCourseUnregistered, handler: courseUnregisteredView },
  {
    test: () => CG.page.isCourseRegistered,
    handler: courseRegisteredView,
  },
  { test: () => CG.page.isPathUnregistered, handler: pathUnregisteredView },
  { test: () => CG.page.isPathRegistered, handler: pathRegisteredView },
  { test: () => CG.page.isLesson, handler: lessonView },
  { test: () => CG.page.isCatalog || CG.page.isLanding, handler: catalogView }, // TODO: I don't think CG.page.isLanding is needed
  { test: () => CG.page.is404, handler: notFoundView },
];

/**
 * This router function handles the overall page styling by determining the
 * appropriate handler for the current page and executing it.
 *
 * It also manages the placement of breadcrumbs, header elements, footer,
 * and messages on course-related pages.
 * @returns {void}
 */
function handlePageStyling() {
  // find first matching handler
  const match = pageHandlers.find(({ test }) => test());

  // run handler if found
  if (match) {
    logger.info(`Running page styling handler: ${match.handler.name}`);
    match.handler();
  } else {
    logger.warn("No page styling handler matched for this page.");
  }

  if (CG.page.isCoursePage || CG.page.isPathRegistered) {
    // make breadcrumbs
    const breadcrumbs = renderBreadcrumbs();

    // append elements to header
    if (CG.page.isCoursePage) {
      CG.dom.header.wrapper.prepend(breadcrumbs);

      CG.dom.header.wrapper.append(
        ...[
          Q(".sj-floater-text") ||
            el("div", {
              className: "sj-floater-text",
              text: "Course",
            }),
          Q(".break-word"),
          CG.dom.header.courseInfo || CG.el.headingParagraph,
          CG.dom.header.ctaBtnWrapper,
        ].filter(Boolean)
      );
    } else if (CG.page.isPathRegistered) {
      Q(".top-row-grey").prepend(breadcrumbs);
    }
  }

  // move footer
  CG.dom.contentContainer.append(Q("#footer-container"));

  // move messages
  CG.dom.contentContainer.prepend(Q("#messages"));

  // hide Skilljar footer
  hide(Q("#ep-footer"));
}

document.addEventListener("DOMContentLoaded", () => {
  logger.info("CG Desktop Script Loaded");

  if (CG.page.isLesson)
    // if a lesson page, we need to move the nav button before we modify the header
    CG.dom.contentContainer.append(Q("#left-nav-button"));

  // replace logo
  CG.dom.headerLeft.replaceChildren(
    el("div", { id: "logo-wrapper" }, [
      el(
        "a",
        {
          className: "header-logo-link focus-link-v2",
          href: CG.state.baseURL,
        },
        [CONFIG.logo]
      ),
    ])
  );

  // remove search container
  remove(".search-container");

  // setup breadcrumbs
  addCrumb("Home", CG.state.baseURL);

  // admin debug heading
  if (CG.env.isAdmin) debugHeading();

  CG.dom.bodyHeader.classList.add("headers");

  // add chainguard link
  if (!CG.page.isSignup && !CG.page.isLogin) fixHeader();

  // add partner menu item
  if (CG.env.isPartner) addPartnerMenu();

  if (CG.env.hasCourseSeries) {
    addCrumb(
      skilljarCourseSeries.title,
      `/path/${skilljarCourseSeries.slug}`,
      true
    );
  }

  if (CG.env.hasCourse) {
    addCrumb(skilljarCourse.title, "#");
  }

  if (CG.page.inPartnerPath) {
    addCrumb("Partner Courses", "/page/partners", true);
  }

  handlePageStyling();

  // show all
  showBody();
});

/**
 * Animate the completion popup with confetti and auto-hide functionality.
 * @returns {void}
 */
window.animateCompletion = function animateCompletion() {
  const elem = ensureCompletionPopup();
  showCompletion(elem);

  // Confetti bursts
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);

  // Auto-hide
  setTimeout(() => hideCompletion(elem), CONFIG.confetti.autoHideMs);
};