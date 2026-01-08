/**
 * Simple logger utility for console messages with styling.
 * Logs messages only if in staging or admin environment.
 * @returns {void}
 */
const logger = {
  enabled() {
    return (
      CG.env.isStaging || CG.env.isAdmin || CG.page.isSignup || CG.page.isLogin
    );
  },
  info(message, ...args) {
    if (!this.enabled()) return;
    const style = "color: var(--primary-blue-hex); font-weight: 600;";
    console.info(`%c[CG] ${message}`, style, ...args);
  },
  warn(message, ...args) {
    if (!this.enabled()) return;
    const style = "color: darkorange; font-weight: 600;";
    console.warn(`%c[CG] ${message}`, style, ...args);
  },
  error(message, ...args) {
    if (!this.enabled()) return;
    const style = "color: darkred; font-weight: 600;";
    console.error(`%c[CG] ${message}`, style, ...args);
  },
};

/**
 * This function hides the given element by setting its display style to "none".
 * @param {HTMLElement} element - The element to hide.
 * @returns {void}
 */
const hide = (element) => setStyle(element, { display: "none !important" });

/**
 * This function shows the body element by removing any display style overrides.
 * It sets the display style to undefined, allowing it to revert to its default behavior.
 * @returns {void}
 */
const showBody = () => setStyle(CG.dom.body, { display: undefined });

/**
 * Sets the text content of an HTML element.
 * @param {HTMLElement} element - The target HTML element.
 * @param {string} value - The text content to set.
 * @param {string} [auto=""] - The fallback text content if value is undefined or null.
 * @returns {void}
 */
const text = (element, value, auto = "") => {
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  } else if (element) {
    element.textContent = auto;
  } else {
    logger.warn(
      "text(): Element is null or undefined. Tried to set text to:",
      value
    );
  }
};

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
 * Shortcut to querySelector function.
 * @param {string} selector - The CSS selector to query.
 * @returns {HTMLElement|null} The first matching element or null if not found.
 */
const Q = (selector, root = document) => root.querySelector(selector);

/**
 * Shortcut to querySelectorAll function.
 * @param {string} selector - The CSS selector to query.
 * @returns {NodeListOf<HTMLElement>} A list of matching elements.
 */
const A = (selector, root = document) => root.querySelectorAll(selector);

/**
 * Shortcut to verifying the existence of an element.
 * @param {string} selector - The CSS selector to query.
 * @returns {HTMLElement|false} The first matching element or false if not found.
 */
const c = (selector) => Q(selector) || false;

/**
 * Add a breadcrumb to the global state
 * @param {string} label - The label for the breadcrumb
 * @param {string} href - The href for the breadcrumb
 * @param {boolean} prependBase - Whether to prepend the base URL to the href
 * @returns {void}
 */
function addCrumb(label, href, prependBase = false) {
  if (prependBase) href = `${CG.state.baseURL}${href}`;
  CG.state.crumbs.push([label, href]);
}

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
 * Removes elements from the DOM based on the provided selector(s).
 * @param {string|string[]} selector - A CSS selector string or an array of selector strings.
 * @returns {void}
 * @example
 * // Remove a single element
 * remove('.ad-banner');
 *
 * // Remove multiple elements
 * remove(['.ad-banner', '#popup', '.sponsored-content']);
 */
function remove(selector) {
  if (!selector) return;

  if (selector instanceof HTMLElement) {
    try {
      selector.remove();
    } catch (e) {
      console.warn("Could not remove element:", selector, e);
    }
    return;
  }

  if (Array.isArray(selector)) {
    selector.forEach((sel) => remove(sel));
    return;
  }

  A(selector).forEach((el) => {
    try {
      el.remove();
    } catch (e) {
      console.warn("Could not remove element:", el, e);
    }
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
  if (
    !CG.state.crumbs ||
    !Array.isArray(CG.state.crumbs) ||
    CG.state.crumbs.length === 0
  )
    return;

  if (!targetElement)
    targetElement = el("div", {
      id: "breadcrumbs",
      className: CG.page.isPathRegistered ? "row dp-row-flex-v2" : "",
    });

  const nav = el(
    "nav",
    {
      className: "breadcrumb",
      "aria-label": "Breadcrumb",
      role: "navigation",
    },
    [
      el(
        "ol",
        {},
        CG.state.crumbs.map(([text, href], ix, arr) => {
          const isLast = ix === arr.length - 1;
          const hasLink = href !== "#";
          const tag = isLast || !hasLink ? "span" : "a";
          return el("li", {}, [
            el(tag, {
              className: "crumb",
              text,
              href: href === "#" ? undefined : href,
              "aria-current": isLast ? "page" : undefined,
            }),
          ]);
        })
      ),
    ]
  );

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
    const card = (link) => {
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
            s.links.map((link) => card(link))
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
 * Extracts curriculum elements from the given container and organizes them into sections and lessons.
 * @param {HTMLElement} curriculumParentContainer - The container element holding the curriculum structure.
 * @returns {Array} An array of section elements with their respective lessons.
 */
function getCurriculumElements(curriculumParentContainer = null) {
  if (!curriculumParentContainer)
    curriculumParentContainer = CG.dom.curriculumContainer;

  let elements = Array.from(
      A("[class^='lesson-'],.section", curriculumParentContainer)
    ),
    currentSection = 0;

  const content = elements
    .filter((e) => !e.classList.contains("lesson-row"))
    .map((elem) => {
      const isHeader =
        elem.classList.contains("section") ||
        elem.classList.contains("lesson-section");

      currentSection += isHeader ? 1 : 0;

      return [
        currentSection,
        isHeader,
        elem.textContent.trim().split("\n")[0], // keep only first line
        elem.href || null,
        Q(".bullet i", elem),
      ];
    });

  const sections = [...new Set(content.map((d) => d[0]))];

  const output = sections
    .map((s) => [
      s,
      content.filter((d) => d[0] === s).filter((d) => d[1]),
      content.filter((d) => d[0] === s).filter((d) => !d[1]),
    ])
    .map((d) => {
      heading = d[1].length ? d[1][0][2] : "";
      return {
        section: d[0],
        heading,
        lessons: d[2],
        d,
      };
    });

  return output.map((d) => {
    const lessons = d.lessons.map((l) => {
      const text = l[2],
        icon = l[4],
        href = l[3] || CG.dom.header.href;

      return el(
        "a",
        {
          className: "curriculum-lesson no-select",
          text,
          href,
        },
        [icon].filter(Boolean)
      );
    });

    let headingElement;
    if (d.heading) {
      headingElement = el("h3", {
        className: "curriculum-header no-select",
        textContent: lessons.length > 1 ? d.heading : "Lessons",
      });
    } else if (!headingElement && lessons.length === 1) {
      headingElement = el("h3", { className: "curriculum-header no-select" }, [
        el("a", {
          textContent: lessons[0].text, // use first lesson as header if no section heading and only one lesson
          href: lessons[0].href,
        }),
      ]);

      lessons.shift(); // remove the first lesson since it's now the header
    } else if (!headingElement && sections.length === 1) {
      // we have multiple lessons but no heading, so add a generic one
      headingElement = el("h3", {
        className: "curriculum-header no-select",
        textContent: "Lessons",
      });
    } else {
      logger.warn(
        "Unexpected curriculum structure: no heading and multiple lessons"
      );
    }

    return el(
      "div",
      { className: "curriculum-wrapper" },
      [headingElement, ...lessons].filter(Boolean)
    );
  });
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
 * Sets the style of an element or a list of elements.
 * Accepts: HTMLElement, NodeList/HTMLCollection/Array of HTMLElements, or selector string.
 * Skips non-element values found in iterables (e.g., strings, nulls, Documents).
 * @returns {HTMLElement|HTMLElement[]|null}
 */
function setStyle(target, style) {
  const toKebab = (p) =>
    p.startsWith("--") ? p : p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

  const isElement = (n) =>
    !!n &&
    typeof n === "object" &&
    n.nodeType === 1 &&
    typeof n.style?.setProperty === "function";

  const apply = (elem) => {
    for (const [prop, raw] of Object.entries(style)) {
      const cssProp = toKebab(prop);

      // If undefined → unset
      if (raw === undefined) {
        elem.style.removeProperty(cssProp);
        continue;
      }

      let value = String(raw);
      let priority = "";

      if (/\s*!important\s*$/i.test(value)) {
        priority = "important";
        value = value.replace(/\s*!important\s*$/i, "");
      }

      if (value.trim()) {
        elem.style.setProperty(cssProp, value.trim(), priority);
      }
    }
    return elem;
  };

  // selector string → first match
  if (typeof target === "string") {
    const elem = Q(target);
    return elem ? apply(elem) : null;
  }

  // Iterable? (NodeList, HTMLCollection, Array, Set, etc.)
  const isIterable =
    target &&
    typeof target !== "string" &&
    typeof target[Symbol.iterator] === "function";

  if (isIterable && !(target instanceof Element)) {
    const elements = Array.from(target).filter(isElement);
    // Optional: warn if we dropped items (useful during dev)
    // if (elements.length !== Array.from(target).length) console.warn("setStyle: skipped non-element items in iterable");
    if (elements.length === 0) return null;
    elements.forEach(apply);
    return elements;
  }

  // Single element
  if (isElement(target)) return apply(target);

  return null;
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
 * This function modifies the header to include a link to Chainguard's main website.
 * It creates a mobile header and adds the link to both mobile and desktop headers.
 * @returns {void}
 */
function fixHeader() {
  const toChainguard = el("div", { id: "to-chainguard" }, [
    el("a", {
      href: getCorrectURL("https://www.chainguard.dev"),
      target: "_blank",
      rel: "noopener noreferrer",
      title: "Go to chainguard.dev",
      text: "Go to Chainguard →",
    }),
  ]);

  const mobileHeader = el("header", { id: "mobile-header", class: "headers" }, [
    el("div", { id: "mobile-header-left" }, []),
    el("div", { id: "mobile-header-right" }, [toChainguard]),
  ]);

  Q("#main-container").insertBefore(
    mobileHeader,
    CG.dom.bodyHeader.nextSibling
  );

  CG.dom.headerRight.insertBefore(
    toChainguard.cloneNode(true),
    CG.dom.headerRight.firstChild
  );

  CG.dom.mobileHeader = {
    container: mobileHeader,
    left: Q("#mobile-header-left"),
    right: Q("#mobile-header-right"),
  };
}


/**
 * Ensure the completion popup element exists, creating it if necessary.
 * @returns {HTMLElement} The completion popup element.
 */
function ensureCompletionPopup() {
  let elem = document.getElementById("completion-popup");
  if (elem) return elem;

  elem = el(
    "div",
    {
      id: "completion-popup",
      role: "dialog",
      "aria-modal": "true",
      "aria-hidden": "true",
    },
    [
      el("div", { id: "completion-content" }, [
        el(
          "div",
          {
            id: "completion-card",
            tabIndex: -1,
          },
          [
            el("h1", {
              id: "completion-title",
              textContent: `Hooray! You finished ${
                CG.state.course?.title ? CG.state.course?.title : "the course!"
              }`,
            }),
            el("p", {
              id: "completion-sub",
              textContent: "Seriously, nice work!",
            }),
            el("p", {
              id: "completion-notice",
              innerHTML: `You can close this popup by clicking outside of it or press ESC to dismiss. It will also disappear automatically in <span id="completion-countdown">${
                CONFIG.confetti.autoHideMs / 1000
              }</span> seconds.`,
            }),
          ]
        ),
      ]),
    ]
  );

  elem.addEventListener("click", () => hideCompletion(elem));
  document.body.appendChild(elem);

  // ESC to close
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" && elem.getAttribute("aria-hidden") === "false")
      hideCompletion(elem);
  });

  return elem;
}

/**
 * Show the completion popup with animation and focus management.
 * @param {HTMLElement} elem - The completion popup element to show.
 * @returns {void}
 */
function showCompletion(elem) {
  elem.setAttribute("aria-hidden", "false");
  setStyle(elem, { display: "block" });
  // Next paint to trigger transition
  requestAnimationFrame(() => setStyle(elem, { opacity: "1" }));
  // focus for accessibility
  const focusTarget = Q("#completion-card", elem);
  if (focusTarget) focusTarget.focus({ preventScroll: true });

  const countdownEl = Q("#completion-countdown", elem);
  if (countdownEl) {
    let remaining = CONFIG.confetti.autoHideMs / 1000;
    text(countdownEl, remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        text(countdownEl, remaining);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}

/**
 * Hide the completion popup with animation.
 * @param {HTMLElement} elem - The completion popup element to hide.
 * @returns {void}
 */
function hideCompletion(elem) {
  setStyle(elem, { opacity: "0" });
  const finish = () => {
    elem.setAttribute("aria-hidden", "true");
    setStyle(elem, { display: "none" });
    elem.removeEventListener("transitionend", finish);
  };
  elem.addEventListener("transitionend", finish);
  // Safety timeout in case transitionend doesn’t fire
  setTimeout(finish, 300);
}

/**
 * Shoot confetti bursts with stars, circles, and logos.
 * @returns {void}
 */
function shoot() {
  confetti({
    ...CONFIG.confetti.defaults,
    particleCount: CONFIG.confetti.particles.stars.counts,
    scalar: CONFIG.confetti.particles.stars.scalar,
    shapes: ["star"],
  });
  confetti({
    ...CONFIG.confetti.defaults,
    particleCount: CONFIG.confetti.particles.circles.counts,
    scalar: CONFIG.confetti.particles.circles.scalar,
    shapes: ["circle"],
  });
  confetti({
    ...CONFIG.confetti.defaults,
    particleCount: CONFIG.confetti.particles.logos.counts,
    scalar: CONFIG.confetti.particles.logos.scalar,
    shapes: ["image"],
    shapeOptions: {
      image: [
        {
          src: "https://cc.sj-cdn.net/instructor/l9kl0bllkdr4-chainguard/themes/2gr0n1rmedy35/favicon.1757695230.png",
          width: 32,
          height: 32,
        },
      ],
    },
  });
}
