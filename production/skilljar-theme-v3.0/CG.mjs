import { CONFIG } from "./static.mjs";
import { c, A, Q, el } from "./meta.mjs";
import { logger } from "./logger.mjs";

export const CG = {
  env: {
    isStaging: window.location.href.includes("chainguard-test"),
    isLoggedIn: typeof skilljarUser !== "undefined",
    hasGroups: typeof skilljarUserStudentGroups !== "undefined",
    hasCourseSeries: typeof skilljarCourseSeries !== "undefined",
    hasCourse: typeof skilljarCourse !== "undefined",
    hasCatalogPage: typeof skilljarCatalogPage !== "undefined",
    hasCourseProgress: typeof skilljarCourseProgress !== "undefined",
    hasCourseBoxes: [...A(".coursebox-container")].length > 0,

    get isAdmin() {
      if (!this.isLoggedIn) return false;

      return CG.state.user.email === "kalle.westerling@chainguard.dev";
    },

    get isInternal() {
      if (!this.isLoggedIn) return false;

      if (CG.state.user.email.includes("@chainguard.dev")) return true;

      if (!this.hasGroups) return false;

      return window.skilljarUserStudentGroups
        .map((d) => d.id)
        .includes("a7iai6t7agi9");
    },

    get isPartner() {
      if (!this.isLoggedIn) return false;

      // all internal users get partner access
      if (CG.state.user.email.includes("@chainguard.dev")) return true;

      if (!this.hasGroups) return false;

      return window.skilljarUserStudentGroups
        .map((d) => d.id)
        .includes("1axsvmzhtbb95");
    },

    get isOnlyPartner() {
      return this.isPartner && window.skilljarUserStudentGroups.length === 1;
    },
  },
  page: {
    isLogin: c(".sj-page-login"),
    isSignup: c(".sj-page-signup"),
    is404: c(".sj-page-error-404"),
    isCatalog: c(".sj-page-catalog"),
    isLanding: c(".sj-page-catalog-root"),
    isCourseUnregistered: c(".sj-page-detail-course"),
    isCourseRegistered: c(".sj-page-curriculum"),
    isPathUnregistered: c(".sj-page-detail-path"), // Removed: .sj-page-detail-bundle
    isPathRegistered: c(".sj-page-path"), // Removed: .sj-page-series
    isLesson: c(".sj-page-lesson"),
    isPartner404:
      [
        "/page/partners",
        ...Object.keys(CONFIG.partners).map((d) => `/path/${d}`),
      ].find((d) => window.location.href.includes(d)) || false,

    get isCoursePage() {
      return (
        this.isPathUnregistered ||
        this.isCourseUnregistered ||
        this.isCourseRegistered
      );
    },

    get inPartnerPath() {
      return (
        Object.values(CONFIG.partners)
          .map((a) => a.id === CG.state.course.path.id)
          .filter(Boolean).length > 0
      );
    },
  },
  state: {
    breadcrumbs: {
      _data: [],

      addCrumb(label, href, prependBase = false) {
        if (prependBase) href = `${CG.state.baseURL}${href}`;
        this._data.push([label, href]);
      },

      get data() {
        this._data = [];

        this.addCrumb("Home", CG.state.baseURL);

        if (CG.env.hasCourseSeries)
          this.addCrumb(
            window.skilljarCourseSeries.title,
            `/path/${window.skilljarCourseSeries.slug}`,
            true
          );

        if (CG.env.hasCourse) this.addCrumb(window.skilljarCourse.title, "#");

        if (CG.page.inPartnerPath)
          this.addCrumb("Partner Courses", "/page/partners", true);

        return this._data;
      },

      get length() {
        return this.data.length;
      },

      get nav() {
        if (!this.data || !Array.isArray(this.data) || this.data.length === 0)
          return undefined;

        const targetElement = el("div", {
          id: "breadcrumbs",
          className: "row dp-row-flex-v2",
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
              this.data.map(([text, href], ix, arr) => {
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

        targetElement?.appendChild(nav);

        return targetElement;
      },
    },

    get shortDescription() {
      if (!CG.env.hasCourse && !CG.env.hasCourseSeries) return "";

      if (CG.env.hasCourseSeries)
        return window.skilljarCourseSeries.short_description;

      if (CG.env.hasCourse) return window.skilljarCourse.short_description;

      return "";
    },

    get domain() {
      if (CG.env.isAdmin) return CONFIG.domains.stage;

      return CONFIG.domains.prod;
    },

    get course() {
      if (!CG.env.hasCourse)
        return { progress: {}, path: {}, completed: false };

      let course = Object.assign(
        { progress: {}, path: {}, completed: false },
        {
          id: window.skilljarCourse.id,
          publishedCourseId: window.skilljarCourse.publishedCourseId,
          tags: window.skilljarCourse.tags,
          title: window.skilljarCourse.title,
          short_description: window.skilljarCourse.short_description,
          long_description_html: window.skilljarCourse.long_description_html,
          edit: `https://dashboard.skilljar.com/course/${window.skilljarCourse.id}`,
        }
      );

      if (CG.env.hasCourseProgress) {
        course.progress = window.skilljarCourseProgress;
        course.completed = window.skilljarCourseProgress.completed_at !== "";
      }

      if (CG.env.hasCourseSeries) {
        course.path = Object.assign(window.skilljarCourseSeries, {
          edit: `https://dashboard.skilljar.com/publishing/domains/${CG.state.domain.id}/published-paths/${window.skilljarCourseSeries.id}/edit`,
        });
      }

      return course;
    },

    get baseURL() {
      return `https://${this.domain.url}`;
    },

    get user() {
      return window.skilljarUser;
    },

    get unregistered() {
      if (!CG.dom.courseBoxes) logger.warn("No course boxes found");
      return CG.dom.courseBoxes.filter(
        (d) => d.dataset.courseStatus === "unregistered"
      );
    },

    get registered() {
      if (!CG.dom.courseBoxes) logger.warn("No course boxes found");
      return CG.dom.courseBoxes.filter(
        (d) => d.dataset.courseStatus === "registered"
      );
    },

    get completed() {
      if (!CG.dom.courseBoxes) logger.warn("No course boxes found");
      return CG.dom.courseBoxes.filter(
        (d) => d.dataset.courseStatus === "complete"
      );
    },

    get courses() {
      return {
        unregistered: this.unregistered.map((elem) => elem.dataset.course),
        registered: this.registered.map((elem) => elem.dataset.course),
        completed: this.completed.map((elem) => elem.dataset.course),
      };
    },

    get isRegistered() {
      return (slug) => this.courses.registered.includes(slug);
    },

    get isCompleted() {
      return (slug) => this.courses.completed.includes(slug);
    },
  },
  el: {
    get headingParagraph() {
      return el("div", {
        className: "sj-heading-paragraph",
        text: CG.state.shortDescription,
      });
    },
  },
  dom: {
    local: {},
    body: document.body,
    bodyHeader: Q("#header"),
    headerLeft: Q("#header-left"),
    headerRight: Q("#header-right"),
    courseBoxes: [...A(".coursebox-container")],

    get contentContainer() {
      return CG.page.isLesson ? Q(".sj-page-lesson") : Q("#skilljar-content");
    },

    header: {
      wrapper: Q(".cp-summary-wrapper") || Q(".dp-summary-wrapper"),
      courseInfo: Q(".sj-course-info-wrapper") || Q(".sj-heading-paragraph"),
      ctaBtnWrapper: Q("#resume-button") || Q("#purchase-button-wrapper-large"),
      registerBtn: Q("#purchase-button-wrapper-large a"),
      ctaBtn: Q("#resume-button a"),
      ctaBtnText: Q("#resume-button a span"),
      btn:
        Q("a.resume-button") ||
        Q("a.purchase-button") ||
        Q("a#path-curriculum-resume-button"),

      get links() {
        if (!this.courseInfo) return [];

        return [...A("p", this.courseInfo)]
          .filter((d) => d.textContent.toLowerCase().includes("learning path"))
          .map((p) =>
            [...A("a", p)].filter((a) => a.innerHTML === "learning path")
          )
          .flat();
      },

      get href() {
        if (this.btn) return this.btn.href;

        const checkout =
          CONFIG.partners[window.skilljarCourseSeries.slug]?.checkout;

        if (this.links.length > 0 && checkout) {
          return `/checkout/${checkout}`;
        } else if (this.links.length > 0) {
          return this.links[0].href;
        }

        return "#";
      },
    },
    courseContainer: Q("#dp-details") || Q("#cp-content"),
    curriculumContainer: A("ul.dp-curriculum")[0] || Q("div#curriculum-list"),
  },

  data: {
    partnerErrorMessage: `If you are a partner and trying to access our Partner courses, you have to first <a href="/auth/login?next=%2Fpage%2Fpartners">sign in or sign up for our Courses platform</a>.`,
    UTM: {
      utm_source: "courses",
      utm_medium: "referral",
      utm_campaign: "dev-enablement",
    },

    get curriculumSections() {
      if (!CG.dom.curriculumContainer) return [];

      let elements = Array.from(
          A("[class^='lesson-'],.section", CG.dom.curriculumContainer)
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

      return sections
        .map((s) => [
          s,
          content.filter((d) => d[0] === s).filter((d) => d[1]),
          content.filter((d) => d[0] === s).filter((d) => !d[1]),
        ])
        .map((d) => {
          const heading = d[1].length ? d[1][0][2] : "";

          return {
            section: d[0],
            heading,
            lessons: d[2],
            d,
          };
        });
    },

    get curriculumElements() {
      let sections = CG.data.curriculumSections;

      const getLessons = (lessons) =>
        lessons.map((l) => {
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

      const getSectionHeading = (heading, lessons) => {
        if (heading) {
          return el("h3", {
            className: "curriculum-header no-select",
            textContent: lessons.length > 1 ? heading : "Lessons",
          });
        } else if (lessons.length === 1) {
          return el("h3", { className: "curriculum-header no-select" }, [
            el("a", {
              textContent: lessons[0].text, // use first lesson as header if no section heading and only one lesson
              href: lessons[0].href,
            }),
          ]);
        } else if (lessons.length > 1) {
          return el("h3", {
            className: "curriculum-header no-select",
            textContent: "Lessons",
          });
        } else {
          logger.warn(
            "Unexpected curriculum structure: no heading and multiple lessons"
          );
          return null;
        }
      };

      return sections.map((d) => {
        const lessons = getLessons(d.lessons);

        const headingElement = getSectionHeading(d.heading, lessons);

        return el(
          "div",
          { className: "curriculum-wrapper" },
          [headingElement, ...lessons].filter(Boolean)
        );
      });
    },
  },
};
