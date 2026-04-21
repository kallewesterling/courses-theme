import { pathSections } from "../data/path-sections.mjs";
import { Q, el } from "./utils.mjs";
import { hide } from "./styling.mjs";
import { createClone } from "./icons.mjs";
import { CG } from "./CG.mjs";
import { logger } from "./logger.mjs";

// static imports
import { term } from "../data/messages.mjs";

/**
 * Generates and appends course sections to a specified parent element.
 * @param {Array} sections - An array of section objects containing details for each section.
 * @param {string} parentSelector - The CSS selector of the parent element to which sections will be appended.
 * @param {string} baseURL - The base URL for course links.
 * @returns {void}
 * @example
 * makeSections(sectionsData, '#main-content', 'https://courses.example.com');
 */
export function makeSections(
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
      const text = c ? term.completed : r ? term.inProgress : "";
      const pill =
        c || r
          ? el("span", { className: `pill ${className}`, text })
          : undefined;

      return el(
        "a",
        {
          className: "no-select",
          href: `${baseURL}/${link.slug}`,
          title: link.isCourse ? term.startCourse : term.startPath,
        },
        [
          el("article", { className }, [
            el(
              "div",
              { className: "inner" },
              [
                pill,
                el("div", { className: "icon" }, [createClone(link.icon)]),
                el("h5", { text: link.isCourse ? term.course : term.learningPath }, [
                  el("span", { textContent: " | Free" }),
                ]),
                el("h3", { text: link.title }),
                el("p", { text: link.description }),
                link.hasBadge && !c
                  ? el("span", {
                      className: "pill badged",
                      text: term.getBadge,
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
 * Attempts to load and display sections for the current learning path.
 * Logs a warning if the path sections are not found.
 * @returns {void}
 */
export function tryPathSections() {
  if (!pathSections[window.skilljarPath.slug]) {
    logger.warn(`Tried to load ${window.skilljarPath.slug} path unsuccessfully.`);
    return;
  }

  hide(".sj-courseboxes-v2");

  makeSections(
    pathSections[window.skilljarPath.slug],
    "#skilljar-content",
    `${CG.state.baseURL}/path/${window.skilljarPath.slug}`
  );
}
