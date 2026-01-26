import { A, Q, el, text, getCorrectURL } from "../meta.mjs";
import { CG } from "../CG.mjs";
import { CONFIG } from "../static.mjs";
import { setStyle } from "../styling.mjs";
import { createClone } from "../icons.mjs";
import { logger } from "../logger.mjs";

// Shiki syntax highlighting
import * as shiki from "https://esm.sh/shiki@3.0.0";
import { h } from "https://esm.sh/hastscript@9?bundle";

/**
 * Copies text to the clipboard and animates a tooltip to indicate success.
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

function transformerSimpleLineNumbers(options = {}) {
  const {
    preClass = "has-line-numbers", // Class for the <pre> tag
    lineClass = "code-line", // Class for each line's <span>
    noContent = "no-content", // Class for lines with no content
  } = options;

  return {
    name: "@shikijs/transformer-simple-line-numbers",
    // Add a class to the <pre> element
    pre(node) {
      this.addClassToHast(node, preClass);
    },
    // Add a class to each line
    line(node, line) {
      this.addClassToHast(node, lineClass);
      node.properties["data-line"] = line;
      if (node.children.length === 0) {
        this.addClassToHast(node, noContent);
      }
    },
  };
}

/**
 * Adds a copy button to code blocks.
 * It is used as a transformer for Shiki to modify blocks.
 * @param {Object} options - Configuration options for the copy button.
 * @param {RegExp} [options.promptRE=/^\s*\$ /gm] - Regular expression to identify prompt characters to remove.
 * @returns {Object} - A Shiki transformer object.
 */
function addCopyButton({ promptRE = /^\s*\$ /gm } = {}) {
  return {
    name: "shiki-transformer-copy-button",
    pre(node) {
      const onclick = String.raw`
        (async (btn) => {
          const pre = btn.parentElement;
          const code = pre.querySelector('code');
          const raw  = code ? code.innerText : pre.innerText;
          const text = raw.replace(${promptRE.toString()}, '');
          try {
            await navigator.clipboard.writeText(text);
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
          } catch (e) {
            btn.classList.add('error');
            setTimeout(() => btn.classList.remove('error'), 2000);
          }
        })(this);
      `;
      node.children.push(
        h("button", { class: "copy", type: "button", onclick }, [
          h("span", { class: "ready" }),
          h("span", { class: "success" }),
        ]),
      );
    },
  };
}

const formatCode = async (code, lang, addCopy = true) => {
  // Apply Shiki highlighting
  const THEME = CONFIG.codeTheme || "github-light";

  const transformers = [
    transformerSimpleLineNumbers(),
    addCopy ? addCopyButton() : null,
  ].filter(Boolean);

  const formatted = await shiki.codeToHtml(
    // trim textContent to avoid extra newlines
    code.textContent.trim(),
    { lang, theme: THEME, transformers },
  );

  const parser = new DOMParser(),
    formattedElem = parser.parseFromString(formatted, "text/html");

  let newCode = Q("code", formattedElem);

  if (newCode) {
    // replace old code element with new highlighted one
    newCode.classList = code.classList; // preserve original classes
    code.replaceWith(newCode);
  }
};

function applyHighlights(codeEl, highlight) {
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const lineSpec = highlight.highlightLine?.trim();
  const contentSpec = highlight.highlightContent?.trim();

  // Ensure we have per-line wrappers to target.
  // If Shiki already outputs line wrappers (common), this won't break anything.
  // ensureLineSpans(codeEl);

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

      Array.from(A("span[data-line]", codeEl)).forEach((lineEl) => {
        if (re.test(lineEl.textContent)) {
          lineEl.classList.add("is-highlighted-line");
        }
      });
    }
  }
}

function parseLineSpec(spec) {
  // "3,5-7" -> Set{3,5,6,7}
  const out = new Set();
  for (const part of spec.split(",")) {
    const p = part.trim();
    if (!p) continue;

    const m = p.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;

    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    for (let i = Math.min(start, end); i <= Math.max(start, end); i++)
      out.add(i);
  }
  return out;
}

/**
 * This function processes a code block element by adding syntax highlighting and a copy button.
 * @param {HTMLElement} pre - The <pre> block element to process.
 * @returns {void}
 */
async function processPre(pre) {
  const codeEl = Q("code", pre);

  const languages = Array.from(codeEl.classList).filter((e) =>
    e.includes("language-"),
  );

  const language =
    languages.length === 0 ? "text" : languages[0].replace("language-", "");

  const highlight = {
    textContent: codeEl.textContent.trim(),
    language,
    highlightLine: pre.dataset?.highlightLine,
    highlightContent: pre.dataset?.highlightContent,

    get copyText() {
      return this.textContent.replace(/\r?\n\$ /g, " && ").replace(/^\$ /g, "");
    },
  };

  const container = el("div", { className: "code-block-controls" }, [
    createClone("copy"),
  ]);

  // create 'copied' tooltip
  const tooltipContainer = el("div", {
    textContent: "Copied",
    className: "tooltip-copied",
    style: "opacity: 0;",
  });

  // add event listener to cloned icon to copy block into clipboard
  container.firstChild.addEventListener(
    "click",
    toClipboard(highlight.copyText, tooltipContainer),
  );

  // add elements
  pre.append(tooltipContainer);
  pre.prepend(container);

  // Mark that copy icon was added to this code block
  pre.dataset.copyAdded = "true";

  // Apply Shiki highlighting
  await formatCode(codeEl, highlight.language, true);

  // Apply optional line/content highlighting
  // (we need to do this + requery after Shiki)
  if (highlight.highlightLine || highlight.highlightContent)
    applyHighlights(Q("code", pre), highlight);
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
                    el("div", { className: "badge", text: tag }),
                  ),
                )
              : undefined,

            // title
            el("h5", { className: "card-title", text: resource.title }),
          ].filter(Boolean),
        ),
      ]),
    ],
  );
}

/**
 * This function applies styling to the lesson page.
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
        codeBlocks: new Array(...A("pre:has(code):not(.language-ansi)")),
        inlineCodeBlocks: new Array(...A("code[data-lang")),
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
    ].filter(Boolean),
  );

  CG.dom.local.nav.toggleWrapper.append(setupLessonNav());

  CG.dom.local.lesson.content.inlineCodeBlocks.forEach((elem) =>
    formatCode(elem, elem.dataset.lang || "text", false),
  );

  CG.dom.local.lesson.content.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((elem) => processPre(elem));

  // Make section titles normal h3 elements
  Array.from(A("h3.sjwc-section-title")).map((elem) =>
    elem.classList.remove("sjwc-section-title"),
  );

  if (typeof resources !== "undefined") {
    const numBoxes = CG.dom.local.lesson.content.resources.boxes.length;

    if (typeof resources.resources !== "undefined" && numBoxes === 0) {
      logger.info(
        "No resource boxes found to add resources to. Adding automatically!",
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
}
