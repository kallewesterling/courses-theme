import { A, Q, el, sanitizeUrl, toTitleCase } from "../utils.mjs";
import { CG } from "../CG.mjs";
import { setStyle } from "../styling.mjs";
import { createClone } from "../icons.mjs";
import { logger } from "../logger.mjs";
import { shoot } from "../course-completion.mjs";
import { showTooltip, scheduleHide } from "../tooltip.mjs";
import {
  addLineNumberSpans,
  parseLineSpec,
  cleanCommandPrompt,
} from "../code-utils.mjs";

// Shiki syntax highlighting
import * as shiki from "https://esm.sh/shiki@3.0.0";

// static imports
import { config } from "../../data/config.mjs";
import { term, completion } from "../../data/messages.mjs";

/**
 * Builds resource boxes on the lesson page based on the presence of resources or
 * groups in the global `resources` object. It checks for existing resource boxes
 * in the DOM and populates them with resource cards, or creates a new resource
 * box if necessary.
 * @returns {void}
 */
function buildResourceBox() {
  const elems = {
    get boxes() {
      return A("sjwc-lesson-content-item .resource-box");
    },

    get lastBodyItem() {
      return A("sjwc-lesson-content-item").pop();
    },

    get numBoxes() {
      return this.boxes.length;
    },
  };

  const hasResources = typeof resources.resources !== "undefined";
  const hasGroups = typeof resources.groups !== "undefined";

  if (hasResources && elems.numBoxes === 0) {
    logger.info(
      "No resource boxes found to add resources to. Adding automatically!",
    );

    elems.lastBodyItem.append(
      el("div", { className: "resource-box" }, [
        el("h3", { textContent: "📘 More Resources" }),
        el("div", { className: "resource-wrapper" }),
      ]),
    );
  }

  if (elems.boxes && hasResources) {
    if (hasResources && elems.numBoxes === 1) {
      // we have a list of resources and will drop that in the first box
      const cards = resources.resources.map((r) => createResourceCard(r));

      const box = elems.boxes[0];

      const wrapper = Q(".resource-wrapper", box);

      // Add cards
      wrapper.replaceChildren(...cards);
    } else if (hasGroups) {
      // we have groups of resources to drop in each box
      elems.boxes.forEach((box) => {
        if (!box.dataset.group) {
          logger.warn(
            "Resource box is missing data-group attribute, skipping:",
            box,
          );
          return;
        }

        const cards = resources.groups[box.dataset.group].map((r) =>
          createResourceCard(r),
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

/**
 * Adds a copy button to a code block.
 * @param {HTMLElement} pre - The <pre> element containing the code block.
 * @param {HTMLElement} codeEl - The <code> element containing the code.
 * @returns {void}
 */
function addCopyButton(pre, codeEl) {
  const copyIcon = createClone("copy");
  const container = el("div", { className: "code-block-controls" }, [copyIcon]);

  copyIcon.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(cleanCommandPrompt(codeEl));
      showTooltip(copyIcon, "Copied");
      setTimeout(scheduleHide, 800);
    } catch (err) {
      logger.error("Failed to copy codeblock to clipboard: ", err);
    }
  });

  pre.prepend(container);
  pre.dataset.copyAdded = "true";
}

/**
 * Shiki transformer to add line number spans to code blocks.
 * @param {Object} options - Configuration options for the transformer.
 * @param {string} options.preClass - Class to add to the <code> element.
 * @param {string} options.lineClass - Class to add to each line's <span>.
 * @param {string} options.noContent - Class to add to lines with no content.
 * @returns {Object} The Shiki transformer object.
 */

/**
 * Formats code using Shiki syntax highlighting.
 * @param {HTMLElement} code - The <code> element containing the code to format.
 * @param {string} lang - The programming language of the code.
 * @returns {Promise<void>} A promise that resolves when formatting is complete.
 */
const formatCode = async (code, lang) => {
  const parser = new DOMParser();

  // Apply Shiki highlighting
  const formatted = await shiki.codeToHtml(
    // trim textContent to avoid extra newlines
    code.textContent.trim(),
    {
      lang,
      theme: config.codeTheme || "github-light",
      transformers: [addLineNumberSpans()],
    },
  );

  let newCode = Q("code", parser.parseFromString(formatted, "text/html"));

  if (newCode) {
    // replace old code element with new highlighted one
    newCode.classList = code.classList; // preserve original classes
    code.replaceWith(newCode);
  }
};

/**
 * Applies line and content highlights to a code block.
 * @param {HTMLElement} codeEl - The <code> element containing the code.
 * @param {Object} highlight - Highlighting specifications.
 * @param {string} [highlight.highlightLine] - Line numbers to highlight (e.g., "3,5-7").
 * @param {string} [highlight.highlightContent] - Content patterns to highlight (e.g., "cosign|chainctl").
 * @returns {void}
 */
function applyHighlights(codeEl, highlight) {
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const lineSpec = highlight.highlightLine?.trim();
  const contentSpec = highlight.highlightContent?.trim();

  // Highlight lines like "3" or "3,5-7"
  if (lineSpec) {
    const lineNums = parseLineSpec(lineSpec);
    lineNums.forEach((n) => {
      const lineEl = Q(`span[data-line="${n}"]`, codeEl);
      if (lineEl) lineEl.classList.add("is-highlighted-line");
    });
  }

  // Highlight content like "cosign|chainctl" (treat as OR)
  if (contentSpec) {
    const terms = contentSpec
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((term) => {
        if (term.includes("[LINE-END]")) {
          const raw = term.replace("[LINE-END]", "");
          return `${escapeRegExp(raw)}(?=\\s*$)`;
        }
        return escapeRegExp(term);
      });

    if (terms.length) {
      const re = new RegExp(`(${terms.join("|")})`);

      A("span[data-line]", codeEl).forEach((lineEl) => {
        if (re.test(lineEl.textContent)) {
          lineEl.classList.add("is-highlighted-line");
        }
      });
    }
  }
}

/**
 * Processes a code block element by adding syntax highlighting and a copy button.
 * @param {HTMLElement} pre - The <pre> block element to process.
 * @returns {void}
 */
async function processPre(pre) {
  const elems = {
    pre,

    get codeEl() {
      return Q("code", this.pre);
    },

    get codeClasses() {
      return this.codeEl ? Array.from(this.codeEl.classList) : [];
    },

    get preClasses() {
      return this.pre ? Array.from(this.pre.classList) : [];
    },

    get language() {
      return (
        this.pre.dataset.lang ||
        this.codeEl.dataset.lang ||
        this.codeClasses.find((c) => c.startsWith("language-"))?.replace("language-", "") ||
        this.preClasses.find((c) => c.startsWith("language-"))?.replace("language-", "") ||
        "text"
      );
    },

    get content() {
      return this.codeEl.textContent.trim();
    }
  }

  const highlight = {
    highlightLine: pre.dataset?.highlightLine,
    highlightContent: pre.dataset?.highlightContent,
  };

  addCopyButton(pre, elems.codeEl);

  if (elems.language)
    Q(".code-block-controls", pre).prepend(
      el("span", {
        className: "language-label",
        textContent: toTitleCase(elems.language),
      }),
    );

  // Apply Shiki highlighting
  await formatCode(elems.codeEl, elems.language);

  // Apply optional line/content highlighting
  if (highlight.highlightLine || highlight.highlightContent)
    applyHighlights(elems.codeEl, highlight); // TODO: keep an eye here (reload works? we need to reload after Shiki)
}

/**
 * Sets up floating lesson navigation buttons based on existing footer controls.
 * @returns {HTMLElement} The navigation wrapper element containing the previous and next buttons.
 */
function setupLessonNav() {
  const elems = {
    footerPrev: Q("#lp-footer .prev-lesson-button"),
    footerNext: Q("#lp-footer .next-lesson-link"),

    footer: {
      prev: Q("#lp-footer .prev-lesson-button"),
      next: Q("#lp-footer .next-lesson-link"),

      nextAttrs: {
        get href() {
          const up = this.next?.getAttribute("onmouseup") || "";
          const kd = this.next?.getAttribute("onkeydown") || "";
          const match = (up || kd).match(/onNextLessonClick\('([^']+)'\)/);
          return match ? match[1] : "#";
        },
      },
    }
  }

  const attrs = {
    prev: {
      href: elems.footer.prev?.getAttribute("href") || "#",
      title: elems.footer.prev?.getAttribute("title") || "Previous Lesson",
      track: elems.footer.prev?.getAttribute("data-track-click"),
    },
    next: {
      up: elems.footer.next?.getAttribute("onmouseup") || "",
      kd: elems.footer.next?.getAttribute("onkeydown") || "",
      title: elems.footer.next?.getAttribute("title") || "Next Lesson",
      track: elems.footer.next?.getAttribute("data-track-click"),
    },
  };

  const match = (attrs.next.up || attrs.next.kd).match(/onNextLessonClick\('([^']+)'\)/);
  attrs.next.href = match ? match[1] : "#";

  // Build buttons
  const prevBtn = el("a", {
    className: "lesson-btn prev",
    rel: "prev",
    role: "button",
    href: attrs.prev.href,
    textContent: "← Previous",
    title: attrs.prev.title,
    onclick: (e) => e.stopPropagation(),
    dataset: { trackClick: attrs.prev.track || "" }, // TODO: keep an eye on this
  });

  const nextBtn = el("a", {
    className: "lesson-btn next",
    rel: "next",
    role: "button",
    // give it a real href for middle-click/open-in-new-tab
    href: attrs.next.href,
    textContent: "Next →",
    title: attrs.next.title,
    tabindex: 0,
    onclick: (e) => e.stopPropagation(),
    dataset: { trackClick: attrs.next.track || "" }, // TODO: keep an eye on this
    on: {
      click: (e) => goNext(e),
      mouseup: (e) => goNext(e),
      keydown: (e) => {
        const k = e.key;
        if (k === "Enter" || k === " " || k === "Spacebar" || k === "ArrowRight") {
          goNext(e);
        }
      },
    }
  });

  // Add behavior: call onNextLessonClick just like Skilljar
  function goNext(e) {
    if (!attrs.next.href) return;
    e?.preventDefault();
    if (typeof window.onNextLessonClick === "function") {
      window.onNextLessonClick(attrs.next.href);
    } else {
      window.location.href = attrs.next.href;
    }
  }

  // Disable/hide if missing
  if (!elems.footer.prev || !attrs.prev.href) {
    setStyle(prevBtn, { display: "none" });
  }
  if (!elems.footer.next || !attrs.next.href) {
    setStyle(nextBtn, { display: "none" });
  }

  return el("nav", {
    className: "lesson-floater",
    role: "navigation",
    aria: { label: "Lesson navigation" },
  }, [prevBtn, nextBtn]);
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
  resource = { link: "#", title: "Resources", tags: [] },
) {
  const cards = [
    Array.isArray(resource.tags) && resource.tags.length > 0
      ? el(
        "div",
        { className: "badge-container" },
        resource.tags.map((tag) =>
          el("div", { className: "badge", text: tag }),
        ),
      )
      : undefined,

    // title
    el("h5", { className: "card-title", text: resource.title }),
  ];
  
  return el(
    "a",
    {
      href: sanitizeUrl(resource.link),
      target: "_blank",
      className: "resource-link-wrapper",
    },
    [
      el("div", { className: "resource-card" }, [
        el(
          "div",
          { className: "card-body" },
          cards.filter(Boolean),
        ),
      ]),
    ],
  );
}

/**
 * Applies styling to the lesson page.
 * @returns {void}
 */
export function lessonView() {
  CG.dom.local = {
    body: {
      mainContainer: Q("#lp-wrapper"),
      innerContainer: Q("#lesson-body"),
    },
    lesson: {
      body: Q("#lesson-body"),
      innerBody: Q("#lesson-main-inner"),
      content: {
        codeBlocks: A("pre:has(code):not(.language-ansi)"),
        inlineCodeBlocks: A("code[data-lang]"),
        internalCourseWarning: Q("#internal-course-warning"),
        links: A("sjwc-lesson-content-item a"),
        resources: {
          boxes: A("sjwc-lesson-content-item .resource-box"),
          wrapper: Q(
            "sjwc-lesson-content-item .resource-box .resource-wrapper",
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

  // Makes lesson links pop up in new tab
  CG.dom.local.lesson.content.links.forEach((elem) => {
    elem.target = "_blank";
    elem.href = sanitizeUrl(elem.href);
  });

  // Build the nav toggle bar: use Skilljar's if present, otherwise create our own
  if (!CG.dom.local.nav.toggleWrapper) {
    const navBar = el("a", {
      id: "left-nav-button", href: "#", aria: {
        label: "Toggle course navigation",
        on: {
          click: (e) => {
            e.preventDefault();
            document.body.classList.toggle("cbp-spmenu-open");
          }
        }
      }
    }, [
      el("i", { className: "fa fa-bars" }),
      el("i", { className: "fa fa-times" }),
    ]);
    CG.dom.local.nav.toggleWrapper = navBar;
  }

  // Open the sidebar by default on desktop
  if (window.matchMedia("(min-width: 992px)").matches) {
    document.body.classList.add("cbp-spmenu-open");
  }

  // Close the nav when tapping the backdrop on mobile
  CG.dom.local.body.mainContainer.addEventListener("click", (e) => {
    if (!window.matchMedia("(min-width: 992px)").matches &&
      document.body.classList.contains("cbp-spmenu-open") &&
      !CG.dom.local.nav.menu.contains(e.target) &&
      !CG.dom.local.nav.toggleWrapper.contains(e.target)) {
      document.body.classList.remove("cbp-spmenu-open");
    }
  });

  // move elements
  CG.dom.local.body.mainContainer.append(CG.dom.local.footer.container);
  CG.dom.local.body.innerContainer.prepend(
    ...[
      CG.dom.local.lesson.content.internalCourseWarning,
      CG.dom.local.nav.toggleWrapper,
    ].filter(Boolean),
  );

  CG.dom.local.nav.toggleWrapper.append(setupLessonNav());

  CG.dom.local.lesson.content.inlineCodeBlocks.forEach((elem) =>
    formatCode(elem, elem.dataset.lang || "text"),
  );

  CG.dom.local.lesson.content.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((elem) => processPre(elem));

  // Make section titles normal h3 elements
  A("h3.sjwc-section-title").forEach((elem) =>
    elem.classList.remove("sjwc-section-title"),
  );

  if (typeof resources !== "undefined") buildResourceBox();

  slugifyHeadings();
  buildNavSubItems();
  buildNavCourseLink();
  buildNavScrollShell();
  buildCompletionBadge();
  buildEndBanner();
  buildHeaderCourseLink();
}

/**
 * Generates URL-friendly slugs for all <h3> headings in the lesson content that don't already have an ID.
 * The slugs are created by taking the text content of the heading, converting it to lowercase, replacing
 * spaces with hyphens, and removing special characters. If multiple headings have the same text, a unique
 * suffix is added to ensure all IDs are distinct.
 * @returns {void}
 */
function slugifyHeadings() {
  const inner = CG.dom.local.lesson.innerBody;
  if (!inner) return;

  const seen = new Set();
  A("h3", inner).forEach((h) => {
    if (h.id) return;

    let slug = h.textContent
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (seen.has(slug)) {
      let i = 2;
      while (seen.has(`${slug}-${i}`)) i++;
      slug = `${slug}-${i}`;
    }

    seen.add(slug);
    h.id = slug;
  });
}

/**
 * Wraps all current children of #lp-left-nav in a .nav-scroll-inner div so
 * they scroll independently of the completion badge that gets appended after.
 * @returns {void}
 */
function buildNavScrollShell() {
  const nav = CG.dom.local.nav.menu;
  if (!nav) return;
  const scrollInner = el("div", { className: "nav-scroll-inner" });
  while (nav.firstChild) scrollInner.appendChild(nav.firstChild);
  nav.appendChild(scrollInner);
}

/**
 * Prepends a compact course-title back-link to the top of the left nav,
 * replacing Skilljar's "Back to Course Description" button.
 * @returns {void}
 */
function buildNavCourseLink() {
  const title = CG.state.course.title;
  const href = CG.dom.local.nav.backBtn?.href;
  if (!title || !href) return;

  const link = el("a", { className: "nav-course-link", href: sanitizeUrl(href), aria: { label: "Back to Course Description" } }, [
    el("span", { className: "nav-course-link-arrow", textContent: "←" }),
    el("span", { className: "nav-course-link-title", textContent: title }),
  ]);

  CG.dom.local.nav.menu.prepend(link);
}

/**
 * Builds h3 sub-item links under the active lesson in the left nav.
 * Replaces the separate right-side TOC; scroll-spy highlights the current section.
 * @returns {void}
 */
function buildNavSubItems() {
  const inner = CG.dom.local.lesson.innerBody;
  const nav = CG.dom.local.nav.menu;
  if (!inner || !nav) return;

  const headings = A("h3[id]", inner);
  if (headings.length < 2) return;

  const activeLesson = Q(".lesson-row.lesson-active", nav)?.closest("a.lesson");
  if (!activeLesson) return;

  const scrollEl = Q("#lp-wrapper");
  const OFFSET = 120;

  const sublinks = [];
  const subItems = headings.map((h) => {
    const a = el("a", { className: "nav-subitem", href: `#${h.id}`, textContent: h.textContent });
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const rect = h.getBoundingClientRect();
      const containerRect = scrollEl.getBoundingClientRect();
      scrollEl.scrollTo({
        top: scrollEl.scrollTop + (rect.top - containerRect.top) - OFFSET,
        behavior: "smooth",
      });
    });
    sublinks.push(a);
    return a;
  });

  activeLesson.after(el("div", { className: "nav-subitems" }, subItems));

  function updateActive() {
    const threshold = scrollEl.getBoundingClientRect().top + OFFSET + 10;
    let active = headings[0];
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= threshold) active = h;
      else break;
    }
    sublinks.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === `#${active.id}`);
    });
  }

  scrollEl.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
}

/**
 * Builds an end-of-lesson banner that appears at the bottom of the lesson content when the user reaches the end.
 * The banner includes a message indicating that the user has reached the end of the lesson, and a button to mark
 * the lesson as complete and continue to the next lesson. The next lesson's URL and title are extracted from the
 * existing footer controls.
 * @returns {void}
 */
function buildEndBanner() {
  const inner = CG.dom.local.lesson.innerBody;
  if (!inner) return;

  const activeLesson = Q(".lesson-row.lesson-active", CG.dom.local.nav.menu)?.closest("a.lesson");
  if (activeLesson?.querySelector(".fa-check-circle")) return;

  const footerNext = Q("#lp-footer .next-lesson-link");
  if (!footerNext) return;

  const up = footerNext.getAttribute("onmouseup") || "";
  const kd = footerNext.getAttribute("onkeydown") || "";
  const nextMatch = (up || kd).match(/onNextLessonClick\('([^']+)'\)/);
  const nextUrl = nextMatch ? nextMatch[1] : null;
  const nextTitle = footerNext.getAttribute("title") || "";

  function goNext(e) {
    e?.preventDefault();
    if (typeof window.onNextLessonClick === "function" && nextUrl) {
      window.onNextLessonClick(nextUrl);
    } else if (nextUrl) {
      window.location.href = nextUrl;
    }
  }

  const btn = el("a", {
    className: "btn-complete",
    href: nextUrl || "#",
    role: "button",
    tabindex: 0,
  }, [
    el("i", { className: "fa fa-check-circle" }),
    el("span", { textContent: "Mark complete & continue" }),
  ]);
  btn.setAttribute("aria-label", "Mark lesson complete and continue");
  btn.addEventListener("click", goNext);
  btn.addEventListener("mouseup", goNext);
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") goNext(e);
  });

  const subtitle = nextTitle ? `Up next: ${nextTitle}` : "You've reached the end of this lesson";

  const banner = el("div", { className: "lesson-end-banner" }, [
    el("div", { className: "end-icon" }, [
      el("i", { className: "fa fa-flag-checkered" }),
    ]),
    el("div", { className: "end-text" }, [
      el("p", { className: "end-title", textContent: "You've reached the end of this lesson" }),
      el("p", { className: "end-subtitle", textContent: subtitle }),
    ]),
    el("div", { className: "end-actions" }, [btn]),
  ]);

  inner.append(banner);
}

/**
 * Builds a course link in the header that allows users to navigate back to the course overview page. The function
 * checks for the presence of the header right container and the course title and URL, and if all necessary
 * information is available, it creates a link element and prepends it to the header right container.
 * @returns {void}
 */
function buildHeaderCourseLink() {
  const title = CG.state.course.title;
  const href = CG.dom.local.nav.backBtn?.href;
  if (!title || !href) return;

  const link = el("div", { id: "header-course-link" }, [
    el("a", { href: sanitizeUrl(href), textContent: title }),
  ]);

  CG.dom.bodyHeader.append(link);
}

/**
 * Appends a course-completion badge to the bottom of the left nav when all lessons
 * are done. Clicking the badge fires a confetti burst (canvas-confetti loaded lazily);
 * the "Browse more courses" CTA navigates normally.
 * @returns {void}
 */
function buildCompletionBadge() {
  if (!CG.state.course.completed) return;

  const nav = CG.dom.local.nav.menu;
  if (!nav) return;

  const href = "/"; // CG.dom.local.nav.backBtn?.href

  const cta = el("a", {
    className: "completion-badge-cta",
    href, // : href ? sanitizeUrl(href) : "/catalog",
    textContent: term.browseMore,
  });

  const badge = el("div", { className: "completion-badge no-select" }, [
    el("div", { className: "completion-badge-icon", textContent: completion.badge.icon }),
    el("div", { className: "completion-badge-title", textContent: completion.badge.title }),
    el("div", { className: "completion-badge-subtitle", textContent: completion.badge.subtitle }),
    cta,
  ]);

  badge.addEventListener("click", (e) => {
    if (e.target.closest(".completion-badge-cta")) return;
    shoot("big", { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  });

  nav.append(badge);
}
