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
 * Sets the placeholder attribute of an HTML element.
 * @param {HTMLElement} element - The target HTML element.
 * @param {string} value - The placeholder text to set.
 * @returns {void}
 */
const placeholder = (element, value) => {
  if (element && value !== undefined && value !== null) {
    element.setAttribute("placeholder", value);
  } else {
    logger.warn(
      "placeholder(): Element is null or undefined. Tried to set placeholder to:",
      value
    );
  }
};

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
 * Add a "Partner Courses" menu item to the header if the user is a partner.
 * @returns {void}
 */
function addPartnerMenu() {
  const partnerItem = el("a", {
    href: "/page/partners",
    text: "Partner Courses",
  });
  CG.dom.headerLeft.appendChild(partnerItem);
  CG.dom.mobileHeader.left.appendChild(partnerItem.cloneNode(true));
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

/**
 * Renders a breadcrumb navigation element.
 * @param {HTMLElement} [targetElement] - The target element to render the breadcrumbs into. If not provided, a new div will be created.
 * @returns {HTMLElement} The rendered breadcrumb navigation element.
 * @example
 * renderBreadcrumbs('#breadcrumb-container');
 */
function renderBreadcrumbs(targetElement) {
  targetElement?.replaceChildren(nav);

  return targetElement;
}

/**
 * Generates and appends course sections to a specified parent element.
 * @param {Array} sections - An array of section objects containing details for each section.
 * @param {string} parentSelector - The CSS selector of the parent element to which sections will be appended.
 * @param {string} baseURL - The base URL for course links.
 * @returns {void}
 * @example
 * makeSections(sectionsData, '#main-content', 'https://courses.example.com');
 */
function makeSections(
  sections,
  parentSelector = "#skilljar-content",
  baseURL = "https://courses.chainguard.dev"
) {
  const reg = (slug) => (CG.state.isRegistered(slug) ? "in-progress" : "");
  const compl = (slug) => (CG.state.isCompleted(slug) ? "completed" : "");

  sections.forEach((s) => {
    if (s.internalSection && !CG.env.isInternal) return;

    const card = (link) => {
      if (link.internalOnly && !CG.env.isInternal) return null;
      if (link.adminOnly && !CG.env.isAdmin) return null;

      const r = reg(link.slug);
      const c = compl(link.slug);
      const className = `${c} ${r}`;
      const text = c ? "Completed" : r ? "In Progress" : "";
      const pill =
        c || r
          ? el("span", { className: `pill ${className}`, text })
          : undefined;

      return el(
        "a",
        {
          className: "no-select",
          href: `${baseURL}/${link.slug}`,
          title: link.isCourse ? "Start course" : "Start path",
        },
        [
          el("article", { className }, [
            el(
              "div",
              { className: "inner" },
              [
                pill,
                el("div", { className: "icon" }, [createClone(link.icon)]),
                el("h5", { text: link.isCourse ? "Course" : "Learning Path" }, [
                  el("span", { textContent: " | Free" }),
                ]),
                el("h3", { text: link.title }),
                el("p", { text: link.description }),
                link.hasBadge && !c
                  ? el("span", {
                      className: "pill badged",
                      text: "Get a Badge",
                    })
                  : undefined,
              ].filter(Boolean)
            ),
          ]),
        ]
      );
    };

    const section = el(
      "section",
      {
        className: `featured-courses ${s.classNames?.join(" ") || ""}`,
      },
      [
        el("div", { className: "grid" }, [
          // Intro
          el("div", { className: "intro" }, [
            s.eyebrow
              ? el("h2", { className: "eyebrow", text: s.eyebrow })
              : null,
            el("p", { className: "headline", text: s.title }),
            el("p", { className: "subhead", text: s.description }),
          ]),

          // Courses grid
          el(
            "div",
            { className: "cards" },
            s.links.map((link) => card(link)).filter(Boolean)
          ),
        ]),
      ].filter(Boolean)
    );

    Q(parentSelector).append(section);
  });
}

/**
 * Creates an SVG icon element based on the specified type and attributes.
 * @param {string} type - The type of icon to create (e.g., "checkbox", "burger").
 * @param {Object} attrs - Additional attributes to apply to the SVG element.
 * @returns {SVGElement} The created SVG icon element.
 */
function createClone(
  type = "checkbox",
  attrs = {
    // xmlns: "http://www.w3.org/2000/svg",
    // width: "20",
    // height: "21",
    // viewBox: "0 0 20 21",
    // fill: "none",
  }
) {
  if (!CONFIG.icons[type]) {
    logger.error(`Icon type "${type}" not found in CONFIG.icons`);
    return null;
  }

  if (CONFIG.icons[type].attrs) {
    attrs = { ...CONFIG.icons[type].attrs, ...attrs };
  }

  if (!attrs["className"]) attrs.className = `clone-icon ${type}-icon`;

  const paths = CONFIG.icons[type].paths.map((d) => el("path", { d }));
  return el("svg", attrs, paths);
}

/**
 * Creates a resource card element.
 * @param {Object} resource - The resource object containing details for the card.
 * @param {string} resource.link - The URL link for the resource.
 * @param {string} resource.title - The title of the resource.
 * @param {Array<string>} [resource.tags] - An array of tags associated with the resource.
 * @returns {HTMLElement} The created resource card element.
 */
function createResourceCard(
  resource = { link: "#", title: "Resources", tags: [] }
) {
  return el(
    "a",
    {
      href: getCorrectURL(resource.link),
      target: "_blank",
      className: "resource-link-wrapper",
    },
    [
      el("div", { className: "resource-card" }, [
        el(
          "div",
          { className: "card-body" },
          [
            Array.isArray(resource.tags) && resource.tags.length > 0
              ? el(
                  "div",
                  { className: "badge-container" },
                  resource.tags.map((tag) =>
                    el("div", { className: "badge", text: tag })
                  )
                )
              : undefined,

            // title
            el("h5", { className: "card-title", text: resource.title }),
          ].filter(Boolean)
        ),
      ]),
    ]
  );
}

/**
 * Creates a course details card element with provided details and options.
 * @param {Object} details - An object containing course details.
 * @param {string} details.audience - The target audience for the course.
 * @param {string} details.time - The estimated time to complete the course.
 * @param {number} details.lessons - The number of lessons in the course.
 * @param {Object} options - An object containing options for the card.
 * @param {string} [options.btnText="Register"] - The text for the action button.
 * @param {string} [options.btnHref="#"] - The URL for the action button.
 * @param {boolean} [options.completed=false] - Indicates if the course is completed.
 * @returns {HTMLElement} The created course details card element.
 */
function createCourseDetailsCard(
  details,
  options = {
    btnText: "Register",
    btnHref: "#",
    completed: false,
  }
) {
  // Create main container
  const card = el("div", { className: "course-card" }, [
    el("h3", {
      className: "no-select",
      textContent: "Course Details",
    }),
    el("ul", { className: "no-select" }, [
      el("li", {}, [el("p", { text: details.audience })]),
      el("li", {}, [el("p", { text: details.time })]),
      el("li", {}, [el("p", { text: details.lessons + " Lessons" })]),
    ]),
  ]);

  // Link
  const link = el("a", {
    href: options.completed ? "#" : options.btnHref,
    textContent: options.completed ? "🎉 Completed" : options.btnText,
    className: `button ${options.completed ? "completed" : ""}`,
  });

  // add margin to link button
  setStyle(link, { marginLeft: "20px", marginRight: "20px" });

  card.appendChild(link);

  if (options.completed) {
    card.append(
      el("p", {
        textContent: "Click on any lesson that you want to revisit.",
        className: "completed-subtext",
      })
    );
  }

  return card;
}

/**
 * Creates a function to copy text to the clipboard and animate a tooltip.
 * @param {string} copyText - The text to copy to the clipboard.
 * @param {HTMLElement} tooltipContainer - The element to animate as a tooltip.
 * @returns {Function} - A function that, when called, will copy the text and animate the tooltip.
 */
function toClipboard(copyText, tooltipContainer) {
  /**
   * Animates the tooltip by changing its opacity.
   * @param {HTMLElement} tooltipEl - The tooltip element to animate.
   */
  function animateCopiedTooltip(tooltipEl) {
    setStyle(tooltipEl, { opacity: "1" });

    setTimeout(() => {
      setStyle(tooltipEl, { opacity: "0" });
    }, 400);
  }

  return async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      animateCopiedTooltip(tooltipContainer);
    } catch (err) {
      logger.error("Failed to copy codeblock to clipboard: ", err);
    }
  };
}

/**
 * Attempts to load and display sections for the current learning path.
 * Logs a warning if the path sections are not found.
 * @returns {void}
 */
function tryPathSections() {
  if (!pathSections[skilljarPath.slug]) {
    logger.warn(`Tried to load ${skilljarPath.slug} path unsuccessfully.`);
    return;
  }

  hide(".sj-courseboxes-v2");

  makeSections(
    pathSections[skilljarPath.slug],
    "#skilljar-content",
    `${CG.state.baseURL}/path/${skilljarPath.slug}`
  );
}

/**
 * This function applies styling to the 404 error page.
 * @returns {void}
 */
function notFoundView() {
  if (CG.page.isPartner404 && !CG.env.isLoggedIn) {
    Q(".message").append(
      ...[
        el("hr"),
        el("p", {
          classList: "sj-text-page-not-found-explanation",
          innerHTML: CG.data.partnerErrorMessage,
        }),
      ]
    );

    window.location.replace(
      `/auth/login?next=${encodeURIComponent(window.location.pathname)}`
    );
  }
}

/**
 * This function applies styling to the authentication (login/signup) pages.
 * @returns {void}
 */
function authView() {
  CG.dom.local.auth = {
    rows: [],

    inputs: {
      email: Q("#id_email") || Q("#id_login"),
      password: Q("#id_password") || Q("#id_password1"),

      // signup specific
      password2: Q("#id_password2"),
      fName: Q("#id_first_name"),
      lName: Q("#id_last_name"),
      accessCode: Q("#id_access_code"),
    },

    // login specific
    forgotPasswordLink: Q("a.forgot-password"),

    labels: {
      passwordConfirm: Q("label[for=id_password2] .input-label-text span"),
      fName: Q("label[for=id_first_name] span span"),
      lName: Q("label[for=id_last_name] span span"),
      email: Q("label[for=id_email]") || Q("label[for=id_login]"),
      accessCode: Q("label[for=id_access_code] span span"),
    },

    google: Q("#google_login"),
    TOS: Q("#access-message"),
    form: Q("#login_form") || Q("#signup_form"),
    btn: Q("#button-sign-in") || Q("#button-sign-up"),
    method: Q(".sj-text-sign-in-with") || Q(".sj-text-sign-up-with"),
    login: Q("#login-tab-left a span") || Q("#login-tab-left span span"),
    signup: Q("#login-tab-right a") || Q("#login-tab-right span"),

    get altMethod() {
      return Q("span", CG.dom.auth.method);
    },
  };

  text(CG.dom.local.auth.login, "Log In");
  text(CG.dom.local.auth.signup, "Sign Up");
  text(CG.dom.local.auth.google, "Continue with Google");
  text(CG.dom.local.auth.btn, CG.page.isLogin ? "Log In" : "Sign Up");
  text(CG.dom.local.auth.labels.email, "Work Email");

  placeholder(CG.dom.local.auth.inputs.email, "Work Email");

  if (CG.page.isSignup) {
    text(CG.dom.local.auth.labels.fName, "First Name");
    text(CG.dom.local.auth.labels.lName, "Last Name");
    placeholder(CG.dom.local.auth.inputs.fName, "First Name");
    placeholder(CG.dom.local.auth.inputs.lName, "Last Name");
    placeholder(CG.dom.local.auth.inputs.password2, "Password Confirm");
    text(CG.dom.local.auth.labels.passwordConfirm, "Password Confirm");
    text(CG.dom.local.auth.labels.accessCode, "Access Code (optional)");
  }

  const authContainer = el("div", { id: "auth-container" }, [
    Q("#tabs"),
    el("div", { className: "auth-card" }, [
      CG.dom.local.auth.form,
      el("div", { className: "divider" }, [el("span", { textContent: "or" })]),
      CG.dom.local.auth.google,
      CG.dom.local.auth.TOS,
    ]),
  ]);

  CG.dom.contentContainer.append(authContainer);

  // move "Forgot Password?" to after Password
  if (CG.page.isLogin && CG.dom.local.auth.inputs.password)
    CG.dom.local.auth.inputs.password.parentElement.append(
      CG.dom.local.auth.forgotPasswordLink
    );

  if (CG.page.isSignup) {
    // add aria-labels to inputs' parent .row elements
    A("input").forEach((elem) => {
      if (!elem.getAttribute("id")) return;

      CG.dom.local.auth.rows[elem.getAttribute("id")] = elem.closest(".row");
      CG.dom.local.auth.rows[elem.getAttribute("id")].setAttribute(
        "aria-label",
        elem.getAttribute("id")
      );
    });

    // move Access Code field to after Password Confirm
    CG.dom.local.auth.rows.id_password2.insertAdjacentElement(
      "afterend",
      CG.dom.local.auth.rows.id_access_code
    );

    // add focus listeners to fade in labels
    CG.dom.local.auth.inputs.accessCode.addEventListener("focus", () => {
      setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "1" });
    });

    CG.dom.local.auth.inputs.accessCode.addEventListener("blur", () => {
      if (CG.dom.local.auth.inputs.accessCode.value === "") {
        setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
      }
    });

    setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
  }

  remove(CG.dom.local.auth.method);
}

/**
 * This function applies styling to a catalog page (landing page only, regardless
 * of whether the user is logged in; and Learning Path catalog pages, if the user is logged in).
 * @returns {void}
 */
function catalogView() {
  CG.dom.body.prepend(el("div", { id: "cg-bg" }));
  CG.data.sections = pathSections[skilljarCatalogPage.slug]; // ex. "partners"

  if (!CG.data.sections) CG.data.sections = pathSections["home"];

  if (!pathSections[skilljarCatalogPage.slug] && !CG.page.isLanding)
    logger.warn("Could not determine catalog section name, defaulting to home");

  // hide existing content
  hide(Q("#catalog-content"));

  // remove search functionality
  remove([".catalog-left-nav", "#left-nav-button", ".back-to-catalog"]);

  // create new sections
  makeSections(CG.data.sections, "#skilljar-content", CG.state.baseURL);

  CG.dom.contentContainer.append(
    el("div", { className: "full-width", id: "cta-bottom" }, [
      createClone("chainguard", { width: "83", height: "72" }),
      el("h2", { text: "Want to learn more about Chainguard?" }),
      el("div", {}, [
        el(
          "a",
          {
            href: getCorrectURL("https://www.chainguard.dev/contact"),
            className: "button white",
            text: "Contact Us",
          },
          [createClone("rightArrow")]
        ),
        createClone("chainguard", { width: "83", height: "72" }),
      ]),
    ])
  );
}

/**
 * This function applies styling to the course details page when the user is
 * not logged in or logged in but not registered for the course.
 * @returns {void}
 */
function courseUnregisteredView() {
  CG.dom.local = {
    card: Q(".course-card"),
  };

  // Add course order
  let courseInfo = CG.dom.header.courseInfo || CG.el.headingParagraph;

  [...courseInfo.children]
    .filter((elem) => elem.textContent.search(/Course \d+ of \d+ in/) !== -1)
    .forEach((elem) => elem.classList.add("course-order"));

  // Add path registration info
  [...courseInfo.children]
    .filter(
      (elem) =>
        elem.textContent.search(
          /Register for the learning path to register for this course/
        ) !== -1
    )
    .forEach((elem) => elem.classList.add("path-registration"));

  if (typeof courseDetails !== "undefined") {
    CG.dom.local.card ? CG.dom.local.card.remove() : null;

    CG.dom.courseContainer.append(
      ...[
        createCourseDetailsCard(courseDetails, {
          btnText: CG.dom.header.ctaBtnWrapper
            ? CG.dom.header.registerBtn.textContent
            : "Register for Learning Path",
          btnHref: CG.dom.header.href,
          completed: CG.state.course.completed,
        }),
      ].filter(Boolean)
    );
  }

  // process curriculum elements
  try {
    CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);
  } catch (error) {
    logger.error("Error processing curriculum elements:", error);
  }
}

/**
 * This function applies styling to the course details page when the user is
 * logged in and registered for the course.
 * @returns {void}
 */
function courseRegisteredView() {
  CG.dom.local = {
    card: Q(".course-card"),
    _card: {
      details: Q(".course-card"),
      link: Q(".course-card a"),
    },
    tabs: {
      container: Q(".tabs"),

      get curriculumSection() {
        return (
          Q("section #curriculum-section", this.container) ||
          Q("section:nth-child(1)", this.container)
        );
      },

      get aboutSection() {
        return (
          Q("section #about-section", this.container) ||
          Q("section:nth-child(2)", this.container)
        );
      },
    },
  };

  CG.dom.local.tabs.aboutSection?.classList.add("active");

  CG.dom.local.tabs.container.append(
    Object.assign(CG.dom.local.tabs.aboutSection, { id: "about-section" }),
    Object.assign(CG.dom.local.tabs.curriculumSection, {
      id: "curriculum-section",
    })
  );

  if (typeof courseDetails !== "undefined") {
    CG.dom.local.card ? CG.dom.local.card.remove() : null;

    CG.dom.courseContainer.append(
      ...[
        createCourseDetailsCard(courseDetails, {
          btnText: CG.dom.header.ctaBtnWrapper
            ? CG.dom.header.ctaBtnText.textContent
            : "Resume",
          btnHref: CG.dom.header.href,
          completed: CG.state.course.completed,
        }),
      ].filter(Boolean)
    );

    // re-query link
    CG.dom.local._card.link = Q(".course-card a");
  }

  // update resume button text and href (with auto-value fallback)
  if (CG.dom.header.ctaBtnWrapper && CG.dom.local._card.link) {
    Object.assign(CG.dom.local._card.link, {
      textContent: CG.dom.header.ctaBtnText.textContent || "Resume",
      href: CG.dom.header.ctaBtn.getAttribute("href") || "resume",
    });
  } else if (CG.dom.local._card.link && !CG.state.course.completed) {
    logger.warn("Hiding resume button as it could not be found");
    hide(CG.dom.local.card.link); // Hide resume button if it doesn't exist
  }

  CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);

  // move elements
  CG.dom.courseContainer.append(
    ...[CG.dom.local._card.details].filter(Boolean)
  );
}

/**
 * This function applies styling to the Learning Path details page, when
 * the user is logged out or logged in but not registered for the Learning Path.
 * @returns {void}
 */
function pathUnregisteredView() {
  // make path sections
  tryPathSections();
}

/**
 * This function applies styling to the Learning Path details page, when
 * the user is logged in and registered for the Learning Path.
 * @returns {void}
 */
function pathRegisteredView() {
  hide([
    ".path-curriculum-resume-wrapper",
    "#path-curriculum-progress-bar-annotation",
    "#path-curriculum-progress-bar",
  ]);

  const topRow = el(
    "div",
    {
      className:
        "top-row-grey top-row-white-v2 padding-top padding-side row-v2",
    },
    [
      el("div", { className: "row dp-row-flex-v2" }, [
        el(
          "div",
          {
            className:
              "columns text-center large-6 dp-summary-wrapper text-left-v2",
          },
          [
            el("div", {
              className: "sj-floater-text",
              textContent: "Learning Path",
            }),
            el("h1", {
              className: "break-word",
              textContent: skilljarCourseSeries.title || "",
            }),
            el("p", {
              className: "sj-heading-paragraph",
              textContent: skilljarCourseSeries.short_description || "",
            }),
            Q(".path-curriculum-button-wrapper a"),
          ]
        ),
      ]),
    ]
  );

  const detailsBundle = el("div", { id: "dp-details-bundle" }, [
    el("div", { className: "row padding-side" }, [
      el("div", { className: "columns" }, [
        el("div", { className: "dp-long-description" }, [
          el("p", {
            innerHTML: skilljarCourseSeries.long_description_html,
          }),
        ]),
      ]),
    ]),
  ]);

  // prepend topRow and detailsBundle to content
  CG.dom.contentContainer.prepend(...[topRow, detailsBundle].filter(Boolean));

  // make path sections
  tryPathSections();
}

/**
 * Sets up floating lesson navigation buttons based on existing footer controls.
 * @returns {HTMLElement} The navigation wrapper element containing the previous and next buttons.
 */
function setupLessonNav() {
  // 1) Find canonical footer controls
  const footerPrev = Q("#lp-footer .prev-lesson-button");
  const footerNext = Q("#lp-footer .next-lesson-link");

  // 2) Extract Prev
  const prevHref = footerPrev?.getAttribute("href") || "#";
  const prevTitle = footerPrev?.getAttribute("title") || "Previous Lesson";
  const prevTrack = footerPrev?.getAttribute("data-track-click");

  // 3) Extract Next (Skilljar style: onNextLessonClick('<url>'))
  const up = footerNext?.getAttribute("onmouseup") || "";
  const kd = footerNext?.getAttribute("onkeydown") || "";
  const nextMatch = (up || kd).match(/onNextLessonClick\('([^']+)'\)/);
  const nextUrl = nextMatch ? nextMatch[1] : null;
  const nextTitle = footerNext?.getAttribute("title") || "Next Lesson";
  const nextTrack = footerNext?.getAttribute("data-track-click");

  // 4) Build buttons
  const prevBtn = el("a", {
    className: "lesson-btn prev",
    rel: "prev",
    role: "button",
    href: prevHref,
    textContent: "← Previous",
    title: prevTitle,
    onclick: (e) => e.stopPropagation(),
  });
  if (prevTrack) prevBtn.setAttribute("data-track-click", prevTrack);

  const nextBtn = el("a", {
    className: "lesson-btn next",
    rel: "next",
    role: "button",
    // give it a real href for middle-click/open-in-new-tab
    href: nextUrl || "#",
    textContent: "Next →",
    title: nextTitle,
    tabindex: 0,
    onclick: (e) => e.stopPropagation(),
  });
  if (nextTrack) nextBtn.setAttribute("data-track-click", nextTrack);

  // 5) Behavior: call onNextLessonClick just like Skilljar
  function goNext(e) {
    if (!nextUrl) return;
    e?.preventDefault();
    if (typeof window.onNextLessonClick === "function") {
      window.onNextLessonClick(nextUrl);
    } else {
      window.location.href = nextUrl;
    }
  }
  nextBtn.addEventListener("click", goNext);
  nextBtn.addEventListener("mouseup", goNext);
  nextBtn.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "Enter" || k === " " || k === "Spacebar" || k === "ArrowRight") {
      goNext(e);
    }
  });

  // Disable/hide if missing
  if (!footerPrev) {
    prevBtn.style.display = "none";
  }
  if (!footerNext || !nextUrl) {
    nextBtn.style.display = "none";
  }

  // 6) Build wrapper
  const btnWrapper = el("nav", {
    className: "lesson-floater",
    role: "navigation",
    ariaLabel: "Lesson navigation",
  });

  btnWrapper.append(prevBtn, nextBtn);

  return btnWrapper;
}

/**
 * This function processes a code block element by adding a copy icon and functionality to copy the code to the clipboard.
 * @param {HTMLElement} elem - The code block element to process.
 * @returns {void}
 */
function processCodeBlock(elem) {
  const codeEl = Q("code", elem);
  const iconClone = createClone("copy");

  const copyText = codeEl.textContent
    .trim()
    .replace(/\r?\n\$ /g, " && ")
    .replace(/^\$ /g, "");

  const container = el("div", {
    style: `display: flex; justify-content: end; border-bottom: 1px solid gainsboro; padding: 12px 24px;`,
  });

  // create 'copied' tooltip
  const tooltipContainer = el("div", {
    textContent: "Copied",
    style: `position: absolute; top: -24px; right: 10px; text-shadow: none; background-color: var(--answer-option); color: var(--primary-white-hex); padding: 5px 10px; border-radius: 4px; opacity: 0; transition: opacity .2s ease-in;`,
  });

  // add elements
  container.append(iconClone);
  elem.append(tooltipContainer);
  elem.prepend(container);

  // add event listener to cloned icon to copy block into clipboard
  iconClone.addEventListener("click", toClipboard(copyText, tooltipContainer));

  // Mark that copy icon was added to this code block
  elem.dataset.copyAdded = "true";
}

/**
 * This function applies styling to the lesson page.
 * @returns {void}
 */
function lessonView() {
  CG.dom.local = {
    body: {
      mainContainer: Q("#lp-wrapper"),
      innerContainer: Q("#lesson-body"),
    },
    lesson: {
      body: Q("#lesson-body"),
      innerBody: Q("#lesson-main-inner"),
      content: {
        codeBlocks: new Array(...A("pre:has(code):not(.language-ansi)")),
        internalCourseWarning: Q("#internal-course-warning"),
        links: A("sjwc-lesson-content-item a"),
        resources: {
          boxes: A("sjwc-lesson-content-item .resource-box"),
          wrapper: Q(
            "sjwc-lesson-content-item .resource-box .resource-wrapper"
          ),
        },
      },
    },
    nav: {
      menu: Q("#lp-left-nav"),
      toggleWrapper: Q("#left-nav-button"),
      backToCurriculumText: Q("#left-nav-return-text"),
      backBtn: Q("#returnToOverview"),
    },
    footer: {
      container: Q("#lp-footer"),
    },
  };

  // content
  if (CG.dom.local.nav.backToCurriculumText) {
    text(CG.dom.local.nav.backToCurriculumText, "← Back to Course Description");
    CG.dom.local.nav.menu.prepend(CG.dom.local.nav.backBtn);
  }

  // Makes lesson links pop up in new tab
  CG.dom.local.lesson.content.links.forEach((elem) => {
    elem.target = "_blank";
    if (elem.href.includes("chainguard.dev")) {
      // set utm_* info if the link is internal (domain name includes chainguard.dev)
      elem.href = getCorrectURL(elem.href);
    }
  });

  // move elements
  CG.dom.local.body.mainContainer.append(CG.dom.local.footer.container);
  CG.dom.local.body.innerContainer.prepend(
    ...[
      CG.dom.local.lesson.content.internalCourseWarning,
      CG.dom.local.nav.toggleWrapper,
    ].filter(Boolean)
  );

  CG.dom.local.nav.toggleWrapper.append(setupLessonNav());

  CG.dom.local.lesson.content.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((elem) => processCodeBlock(elem));

  // Make section titles normal h3 elements
  Array.from(A("h3.sjwc-section-title")).map((elem) =>
    elem.classList.remove("sjwc-section-title")
  );

  if (typeof resources !== "undefined") {
    const numBoxes = CG.dom.local.lesson.content.resources.boxes.length;

    if (typeof resources.resources !== "undefined" && numBoxes === 0) {
      logger.info(
        "No resource boxes found to add resources to. Adding automatically!"
      );
      const box = el("div", { className: "resource-box" });
      const header = el("h3", { textContent: "📘 More Resources" });
      const wrapper = el("div", { className: "resource-wrapper" });

      box.append(header, wrapper);
      CG.dom.local.lesson.body.append(box);
    }

    if (
      CG.dom.local.lesson.content.resources &&
      typeof resources !== "undefined"
    ) {
      if (typeof resources.resources !== "undefined" && numBoxes === 1) {
        // we have a list of resources and will drop that in the first box
        const cards = resources.resources.map((r) => createResourceCard(r));

        const box = CG.dom.local.lesson.content.resources.boxes[0];

        const wrapper = Q(".resource-wrapper", box);

        // Add cards
        wrapper.replaceChildren(...cards);
      } else if (typeof resources.groups !== "undefined") {
        // we have groups of resources to drop in each box
        CG.dom.local.lesson.content.resources.boxes.forEach((box) => {
          if (!box.dataset.group) {
            logger.warn(
              "Resource box is missing data-group attribute, skipping:",
              box
            );
            return;
          }

          const cards = resources.groups[box.dataset.group].map((r) =>
            createResourceCard(r)
          );

          const wrapper = Q(".resource-wrapper", box);

          // Add cards
          if (resources.groups[box.dataset.group]) {
            wrapper.replaceChildren(...cards);
          }
        });
      }
    }
  }
}

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

  // hide Skilljar footer
  hide(Q("#ep-footer"));
}

document.addEventListener("DOMContentLoaded", () => {
  logger.info("CG Desktop Script Loaded");

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
      container: mobileHeader,
      left: Q("#mobile-header-left"),
      right: Q("#mobile-header-right"),
    };
  } else if (CG.env.isPartner) {
    // add partner menu item
    addPartnerMenu();
  }

  handlePageStyling();

  // show all
  showBody();
});
