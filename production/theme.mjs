import { Q, el, remove } from "./skilljar-theme-v3.0/meta.mjs";
import { CG } from "./skilljar-theme-v3.0/CG.mjs";
import { footerData } from "./skilljar-theme-v3.0/static.mjs";
import { animateCompletion } from "./skilljar-theme-v3.0/course-completion.mjs";
import { generateFooter } from "./skilljar-theme-v3.0/footer.mjs";
import { hide, showBody } from "./skilljar-theme-v3.0/styling.mjs";
import { logger } from "./skilljar-theme-v3.0/logger.mjs";
import { route } from "./skilljar-theme-v3.0/router.mjs";
import { debugHeading } from "./skilljar-theme-v3.0/debug.mjs";

document.addEventListener("load", () => {
  logger.info("CG Modular Script Loaded");

  document.querySelector("body").style.setProperty("display", "none");
});

document.addEventListener("DOMContentLoaded", () => {
  logger.info("CG Modular Script Loaded");

  // Clean up DOM: remove elements + set class names
  remove(".search-container");
  CG.dom.bodyHeader.classList.add("headers");
  hide(Q("#ep-footer")); // hide Skilljar footer

  generateFooter(footerData);
  window.animateCompletion = animateCompletion;

  if (CG.page.isLesson)
    // if a lesson page, we need to move the nav button before we modify the header
    CG.dom.contentContainer.append(Q("#left-nav-button"));

  // replace logo
  CG.dom.headerLeft.replaceChildren(CG.el.logo);

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

  route();

  // last changes after styles are applied by `route()`

  if (CG.page.isCoursePage || CG.page.isPathRegistered) {
    // append breadcrumbs
    Q(".top-row-grey").prepend(CG.state.breadcrumbs.nav);

    // append elements to header
    if (CG.page.isCoursePage) {
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
    }
  }

  // move footer
  CG.dom.contentContainer.append(Q("#footer-container"));

  // move messages
  CG.dom.contentContainer.prepend(Q("#messages"));

  // show all
  showBody();
});
