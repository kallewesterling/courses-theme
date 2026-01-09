/* eslint-disable no-undef */

/*
 * Chainguard Courses Theme v3.0
 * This script applies custom styles and functionality to Chainguard's Skilljar platform.
 * It includes features like curriculum styling, lesson navigation, and responsive design adjustments.
 * It also provides utility functions for clipboard operations and element styling.
 *
 * This script is designed to be run in the context of a Skilljar page.
 *
 * @version 3.0
 * @date 2026-01-10
 * @author Chainguard
 * @license MIT
 * @see {@link https://courses.chainguard.com|Chainguard Courses}
 */

// hide all before making adjustments
document.querySelector("body").style.setProperty("display", "none");

/**
 * Update all links on the page to use either the production or staging domain.
 * @param {boolean} useTestDomain - If true, update links to use the staging domain; otherwise, use the production domain.
 * @returns {void}
 * @example
 * // Update links to use the staging domain
 * updateLinks(true);
 *
 * // Update links to use the production domain
 * updateLinks(false);
 */
function updateLinks(useTestDomain) {
  const links = A(
    'a[href*="' +
      CONFIG.domains.prod.url +
      '"], a[href*="' +
      CONFIG.domains.stage.url +
      '"]'
  );
  links.forEach((link) => {
    const url = new URL(link.href);
    if (useTestDomain && url.hostname === CONFIG.domains.prod.url) {
      url.hostname = CONFIG.domains.stage.url;
    } else if (!useTestDomain && url.hostname === CONFIG.domains.stage.url) {
      url.hostname = CONFIG.domains.prod.url;
    }
    link.href = url.toString();
  });
}

/**
 * Adds a debug heading with environment information and a staging toggle.
 * @returns {void}
 */
function debugHeading() {
  // adding a dropdown info circle
  const infoCircle = el(
    "div",
    { class: "align-vertical info-circle-wrapper" },
    [el("div", { class: "info-circle", text: "I" })]
  );
  CG.dom.headerRight.insertBefore(infoCircle, CG.dom.headerRight.firstChild);

  let dropdownOptions = [
    el("span", {
      text: "Handler: " + pageHandlers.find(({ test }) => test).handler.name,
    }),
    el("input", {
      type: "checkbox",
      id: "cg-baseurl-staging",
      checked: CG.env.isStaging ? true : false,
    }),

    // Add course edit link
    CG.state.course.id
      ? el("a", { href: CG.state.course.edit, text: "Edit Course" })
      : null,

    // Add path edit link
    CG.state.course.path.id && CG.state.domain
      ? el("a", { href: CG.state.course.path.edit, text: "Edit Path" })
      : null,
  ]
    .filter(Boolean)
    .map((html) => el("li", {}, [html]));

  const dropdownMenu = el(
    "ul",
    { class: "info-circle-menu", hidden: true },
    dropdownOptions
  );

  CG.dom.headerRight.parentElement.insertBefore(
    dropdownMenu,
    CG.dom.headerRight.parentElement.firstChild
  );

  const trigger = Q(".info-circle-wrapper");
  const dropdown = Q(".info-circle-menu");

  trigger.addEventListener("click", () => {
    const x = trigger.getBoundingClientRect().x;

    const dropdownWidth = 200;
    const alignmentFactor = 0.7;

    const left = x - dropdownWidth * alignmentFactor;

    dropdown.style.left = `${left}px`;

    dropdown.hidden = !dropdown.hidden;
  });

  const checkbox = Q("#cg-baseurl-staging");

  // initial state update if needed
  updateLinks(checkbox.checked);

  // toggle behavior
  checkbox.addEventListener("change", function () {
    updateLinks(this.checked);
  });
}

// /**
//  * Renders a breadcrumb navigation element.
//  * @param {HTMLElement} [targetElement] - The target element to render the breadcrumbs into. If not provided, a new div will be created.
//  * @returns {HTMLElement} The rendered breadcrumb navigation element.
//  * @example
//  * renderBreadcrumbs('#breadcrumb-container');
//  */
// function renderBreadcrumbs(targetElement) {
//   targetElement?.replaceChildren(nav);

//   return targetElement;
// }

// /**
//  * Generates and appends course sections to a specified parent element.
//  * @param {Array} sections - An array of section objects containing details for each section.
//  * @param {string} parentSelector - The CSS selector of the parent element to which sections will be appended.
//  * @param {string} baseURL - The base URL for course links.
//  * @returns {void}
//  * @example
//  * makeSections(sectionsData, '#main-content', 'https://courses.example.com');
//  */
// function makeSections(
//   sections,
//   parentSelector = "#skilljar-content",
//   baseURL = "https://courses.chainguard.dev"
// ) {
//   const reg = (slug) => (CG.state.isRegistered(slug) ? "in-progress" : "");
//   const compl = (slug) => (CG.state.isCompleted(slug) ? "completed" : "");

//   sections.forEach((s) => {
//     if (s.internalSection && !CG.env.isInternal) return;

//     const card = (link) => {
//       if (link.internalOnly && !CG.env.isInternal) return null;
//       if (link.adminOnly && !CG.env.isAdmin) return null;

//       const r = reg(link.slug);
//       const c = compl(link.slug);
//       const className = `${c} ${r}`;
//       const text = c ? "Completed" : r ? "In Progress" : "";
//       const pill =
//         c || r
//           ? el("span", { className: `pill ${className}`, text })
//           : undefined;

//       return el(
//         "a",
//         {
//           className: "no-select",
//           href: `${baseURL}/${link.slug}`,
//           title: link.isCourse ? "Start course" : "Start path",
//         },
//         [
//           el("article", { className }, [
//             el(
//               "div",
//               { className: "inner" },
//               [
//                 pill,
//                 el("div", { className: "icon" }, [createClone(link.icon)]),
//                 el("h5", { text: link.isCourse ? "Course" : "Learning Path" }, [
//                   el("span", { textContent: " | Free" }),
//                 ]),
//                 el("h3", { text: link.title }),
//                 el("p", { text: link.description }),
//                 link.hasBadge && !c
//                   ? el("span", {
//                       className: "pill badged",
//                       text: "Get a Badge",
//                     })
//                   : undefined,
//               ].filter(Boolean)
//             ),
//           ]),
//         ]
//       );
//     };

//     const section = el(
//       "section",
//       {
//         className: `featured-courses ${s.classNames?.join(" ") || ""}`,
//       },
//       [
//         el("div", { className: "grid" }, [
//           // Intro
//           el("div", { className: "intro" }, [
//             s.eyebrow
//               ? el("h2", { className: "eyebrow", text: s.eyebrow })
//               : null,
//             el("p", { className: "headline", text: s.title }),
//             el("p", { className: "subhead", text: s.description }),
//           ]),

//           // Courses grid
//           el(
//             "div",
//             { className: "cards" },
//             s.links.map((link) => card(link)).filter(Boolean)
//           ),
//         ]),
//       ].filter(Boolean)
//     );

//     Q(parentSelector).append(section);
//   });
// }

// /**
//  * Creates an SVG icon element based on the specified type and attributes.
//  * @param {string} type - The type of icon to create (e.g., "checkbox", "burger").
//  * @param {Object} attrs - Additional attributes to apply to the SVG element.
//  * @returns {SVGElement} The created SVG icon element.
//  */
// function createClone(
//   type = "checkbox",
//   attrs = {
//     // xmlns: "http://www.w3.org/2000/svg",
//     // width: "20",
//     // height: "21",
//     // viewBox: "0 0 20 21",
//     // fill: "none",
//   }
// ) {
//   if (!CONFIG.icons[type]) {
//     logger.error(`Icon type "${type}" not found in CONFIG.icons`);
//     return null;
//   }

//   if (CONFIG.icons[type].attrs) {
//     attrs = { ...CONFIG.icons[type].attrs, ...attrs };
//   }

//   if (!attrs["className"]) attrs.className = `clone-icon ${type}-icon`;

//   const paths = CONFIG.icons[type].paths.map((d) => el("path", { d }));
//   return el("svg", attrs, paths);
// }

// /**
//  * Creates a resource card element.
//  * @param {Object} resource - The resource object containing details for the card.
//  * @param {string} resource.link - The URL link for the resource.
//  * @param {string} resource.title - The title of the resource.
//  * @param {Array<string>} [resource.tags] - An array of tags associated with the resource.
//  * @returns {HTMLElement} The created resource card element.
//  */
// function createResourceCard(
//   resource = { link: "#", title: "Resources", tags: [] }
// ) {
//   return el(
//     "a",
//     {
//       href: getCorrectURL(resource.link),
//       target: "_blank",
//       className: "resource-link-wrapper",
//     },
//     [
//       el("div", { className: "resource-card" }, [
//         el(
//           "div",
//           { className: "card-body" },
//           [
//             Array.isArray(resource.tags) && resource.tags.length > 0
//               ? el(
//                   "div",
//                   { className: "badge-container" },
//                   resource.tags.map((tag) =>
//                     el("div", { className: "badge", text: tag })
//                   )
//                 )
//               : undefined,

//             // title
//             el("h5", { className: "card-title", text: resource.title }),
//           ].filter(Boolean)
//         ),
//       ]),
//     ]
//   );
// }

// /**
//  * Creates a function to copy text to the clipboard and animate a tooltip.
//  * @param {string} copyText - The text to copy to the clipboard.
//  * @param {HTMLElement} tooltipContainer - The element to animate as a tooltip.
//  * @returns {Function} - A function that, when called, will copy the text and animate the tooltip.
//  */
// function toClipboard(copyText, tooltipContainer) {
//   /**
//    * Animates the tooltip by changing its opacity.
//    * @param {HTMLElement} tooltipEl - The tooltip element to animate.
//    */
//   function animateCopiedTooltip(tooltipEl) {
//     setStyle(tooltipEl, { opacity: "1" });

//     setTimeout(() => {
//       setStyle(tooltipEl, { opacity: "0" });
//     }, 400);
//   }

//   return async () => {
//     try {
//       await navigator.clipboard.writeText(copyText);
//       animateCopiedTooltip(tooltipContainer);
//     } catch (err) {
//       logger.error("Failed to copy codeblock to clipboard: ", err);
//     }
//   };
// }

/**
 * Attempts to load and display sections for the current learning path.
 * Logs a warning if the path sections are not found.
 * @returns {void}
//  */
// function tryPathSections() {
//   if (!pathSections[skilljarPath.slug]) {
//     logger.warn(`Tried to load ${skilljarPath.slug} path unsuccessfully.`);
//     return;
//   }

//   hide(".sj-courseboxes-v2");

//   makeSections(
//     pathSections[skilljarPath.slug],
//     "#skilljar-content",
//     `${CG.state.baseURL}/path/${skilljarPath.slug}`
//   );
// }

// /**
//  * Sets up floating lesson navigation buttons based on existing footer controls.
//  * @returns {HTMLElement} The navigation wrapper element containing the previous and next buttons.
//  */
// function setupLessonNav() {
//   // 1) Find canonical footer controls
//   const footerPrev = Q("#lp-footer .prev-lesson-button");
//   const footerNext = Q("#lp-footer .next-lesson-link");

//   // 2) Extract Prev
//   const prevHref = footerPrev?.getAttribute("href") || "#";
//   const prevTitle = footerPrev?.getAttribute("title") || "Previous Lesson";
//   const prevTrack = footerPrev?.getAttribute("data-track-click");

//   // 3) Extract Next (Skilljar style: onNextLessonClick('<url>'))
//   const up = footerNext?.getAttribute("onmouseup") || "";
//   const kd = footerNext?.getAttribute("onkeydown") || "";
//   const nextMatch = (up || kd).match(/onNextLessonClick\('([^']+)'\)/);
//   const nextUrl = nextMatch ? nextMatch[1] : null;
//   const nextTitle = footerNext?.getAttribute("title") || "Next Lesson";
//   const nextTrack = footerNext?.getAttribute("data-track-click");

//   // 4) Build buttons
//   const prevBtn = el("a", {
//     className: "lesson-btn prev",
//     rel: "prev",
//     role: "button",
//     href: prevHref,
//     textContent: "← Previous",
//     title: prevTitle,
//     onclick: (e) => e.stopPropagation(),
//   });
//   if (prevTrack) prevBtn.setAttribute("data-track-click", prevTrack);

//   const nextBtn = el("a", {
//     className: "lesson-btn next",
//     rel: "next",
//     role: "button",
//     // give it a real href for middle-click/open-in-new-tab
//     href: nextUrl || "#",
//     textContent: "Next →",
//     title: nextTitle,
//     tabindex: 0,
//     onclick: (e) => e.stopPropagation(),
//   });
//   if (nextTrack) nextBtn.setAttribute("data-track-click", nextTrack);

//   // 5) Behavior: call onNextLessonClick just like Skilljar
//   function goNext(e) {
//     if (!nextUrl) return;
//     e?.preventDefault();
//     if (typeof window.onNextLessonClick === "function") {
//       window.onNextLessonClick(nextUrl);
//     } else {
//       window.location.href = nextUrl;
//     }
//   }
//   nextBtn.addEventListener("click", goNext);
//   nextBtn.addEventListener("mouseup", goNext);
//   nextBtn.addEventListener("keydown", (e) => {
//     const k = e.key;
//     if (k === "Enter" || k === " " || k === "Spacebar" || k === "ArrowRight") {
//       goNext(e);
//     }
//   });

//   // Disable/hide if missing
//   if (!footerPrev) {
//     prevBtn.style.display = "none";
//   }
//   if (!footerNext || !nextUrl) {
//     nextBtn.style.display = "none";
//   }

//   // 6) Build wrapper
//   const btnWrapper = el("nav", {
//     className: "lesson-floater",
//     role: "navigation",
//     ariaLabel: "Lesson navigation",
//   });

//   btnWrapper.append(prevBtn, nextBtn);

//   return btnWrapper;
// }

// /**
//  * This function processes a code block element by adding a copy icon and functionality to copy the code to the clipboard.
//  * @param {HTMLElement} elem - The code block element to process.
//  * @returns {void}
//  */
// function processCodeBlock(elem) {
//   const codeEl = Q("code", elem);
//   const iconClone = createClone("copy");

//   const copyText = codeEl.textContent
//     .trim()
//     .replace(/\r?\n\$ /g, " && ")
//     .replace(/^\$ /g, "");

//   const container = el("div", {
//     style: `display: flex; justify-content: end; border-bottom: 1px solid gainsboro; padding: 12px 24px;`,
//   });

//   // create 'copied' tooltip
//   const tooltipContainer = el("div", {
//     textContent: "Copied",
//     style: `position: absolute; top: -24px; right: 10px; text-shadow: none; background-color: var(--answer-option); color: var(--primary-white-hex); padding: 5px 10px; border-radius: 4px; opacity: 0; transition: opacity .2s ease-in;`,
//   });

//   // add elements
//   container.append(iconClone);
//   elem.append(tooltipContainer);
//   elem.prepend(container);

//   // add event listener to cloned icon to copy block into clipboard
//   iconClone.addEventListener("click", toClipboard(copyText, tooltipContainer));

//   // Mark that copy icon was added to this code block
//   elem.dataset.copyAdded = "true";
// }

// /**
//  * This function applies styling to the lesson page.
//  * @returns {void}
//  */
// function lessonView() {
//   CG.dom.local = {
//     body: {
//       mainContainer: Q("#lp-wrapper"),
//       innerContainer: Q("#lesson-body"),
//     },
//     lesson: {
//       body: Q("#lesson-body"),
//       innerBody: Q("#lesson-main-inner"),
//       content: {
//         codeBlocks: new Array(...A("pre:has(code):not(.language-ansi)")),
//         internalCourseWarning: Q("#internal-course-warning"),
//         links: A("sjwc-lesson-content-item a"),
//         resources: {
//           boxes: A("sjwc-lesson-content-item .resource-box"),
//           wrapper: Q(
//             "sjwc-lesson-content-item .resource-box .resource-wrapper"
//           ),
//         },
//       },
//     },
//     nav: {
//       menu: Q("#lp-left-nav"),
//       toggleWrapper: Q("#left-nav-button"),
//       backToCurriculumText: Q("#left-nav-return-text"),
//       backBtn: Q("#returnToOverview"),
//     },
//     footer: {
//       container: Q("#lp-footer"),
//     },
//   };

//   // content
//   if (CG.dom.local.nav.backToCurriculumText) {
//     text(CG.dom.local.nav.backToCurriculumText, "← Back to Course Description");
//     CG.dom.local.nav.menu.prepend(CG.dom.local.nav.backBtn);
//   }

//   // Makes lesson links pop up in new tab
//   CG.dom.local.lesson.content.links.forEach((elem) => {
//     elem.target = "_blank";
//     if (elem.href.includes("chainguard.dev")) {
//       // set utm_* info if the link is internal (domain name includes chainguard.dev)
//       elem.href = getCorrectURL(elem.href);
//     }
//   });

//   // move elements
//   CG.dom.local.body.mainContainer.append(CG.dom.local.footer.container);
//   CG.dom.local.body.innerContainer.prepend(
//     ...[
//       CG.dom.local.lesson.content.internalCourseWarning,
//       CG.dom.local.nav.toggleWrapper,
//     ].filter(Boolean)
//   );

//   CG.dom.local.nav.toggleWrapper.append(setupLessonNav());

//   CG.dom.local.lesson.content.codeBlocks
//     .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
//     .forEach((elem) => processCodeBlock(elem));

//   // Make section titles normal h3 elements
//   Array.from(A("h3.sjwc-section-title")).map((elem) =>
//     elem.classList.remove("sjwc-section-title")
//   );

//   if (typeof resources !== "undefined") {
//     const numBoxes = CG.dom.local.lesson.content.resources.boxes.length;

//     if (typeof resources.resources !== "undefined" && numBoxes === 0) {
//       logger.info(
//         "No resource boxes found to add resources to. Adding automatically!"
//       );
//       const box = el("div", { className: "resource-box" });
//       const header = el("h3", { textContent: "📘 More Resources" });
//       const wrapper = el("div", { className: "resource-wrapper" });

//       box.append(header, wrapper);
//       CG.dom.local.lesson.body.append(box);
//     }

//     if (
//       CG.dom.local.lesson.content.resources &&
//       typeof resources !== "undefined"
//     ) {
//       if (typeof resources.resources !== "undefined" && numBoxes === 1) {
//         // we have a list of resources and will drop that in the first box
//         const cards = resources.resources.map((r) => createResourceCard(r));

//         const box = CG.dom.local.lesson.content.resources.boxes[0];

//         const wrapper = Q(".resource-wrapper", box);

//         // Add cards
//         wrapper.replaceChildren(...cards);
//       } else if (typeof resources.groups !== "undefined") {
//         // we have groups of resources to drop in each box
//         CG.dom.local.lesson.content.resources.boxes.forEach((box) => {
//           if (!box.dataset.group) {
//             logger.warn(
//               "Resource box is missing data-group attribute, skipping:",
//               box
//             );
//             return;
//           }

//           const cards = resources.groups[box.dataset.group].map((r) =>
//             createResourceCard(r)
//           );

//           const wrapper = Q(".resource-wrapper", box);

//           // Add cards
//           if (resources.groups[box.dataset.group]) {
//             wrapper.replaceChildren(...cards);
//           }
//         });
//       }
//     }
//   }
// }

// const pageHandlers = [
//   { test: () => CG.page.isLogin || CG.page.isSignup, handler: authView },
//   { test: () => CG.page.isCourseUnregistered, handler: courseUnregisteredView },
//   {
//     test: () => CG.page.isCourseRegistered,
//     handler: courseRegisteredView,
//   },
//   { test: () => CG.page.isPathUnregistered, handler: pathUnregisteredView },
//   { test: () => CG.page.isPathRegistered, handler: pathRegisteredView },
//   { test: () => CG.page.isLesson, handler: lessonView },
//   { test: () => CG.page.isCatalog || CG.page.isLanding, handler: catalogView }, // TODO: I don't think CG.page.isLanding is needed
//   { test: () => CG.page.is404, handler: notFoundView },
// ];

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
  // const match = pageHandlers.find(({ test }) => test());

  // // run handler if found
  // if (match) {
  //   logger.info(`Running page styling handler: ${match.handler.name}`);
  //   match.handler();
  // } else {
  //   logger.warn("No page styling handler matched for this page.");
  // }

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
}

document.addEventListener("DOMContentLoaded", () => {
  // logger.info("CG Desktop Script Loaded");

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
  handlePageStyling();

  // show all
  showBody();
});
