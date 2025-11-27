/* eslint-disable no-undef */

/*
 * Chainguard Courses Theme v2.1
 * This script applies custom styles and functionality to Chainguard's Skilljar platform.
 * It includes features like curriculum styling, lesson navigation, and responsive design adjustments.
 * It also provides utility functions for clipboard operations and element styling.
 *
 * This script is designed to be run in the context of a Skilljar page.
 *
 * @version 2.1
 * @date 2025-08-21
 * @author Chainguard
 * @license MIT
 * @see {@link https://courses.chainguard.com|Chainguard Courses}
 */

const c = (selector) => (document.querySelector(selector) ? true : false);

const CONFIG = {
  utm: {
    utm_source: "courses",
    utm_medium: "referral",
    utm_campaign: "dev-enablement",
  },
  domains: {
    prod: { url: "courses.chainguard.dev", id: "3glgawqmzatte" },
    stage: { url: "chainguard-test.skilljar.com", id: "ix1ljpxex6xd" },
  },
  partners: {
    "chainguard-discovery-partner-sales-foundations": {
      id: "53njmyk25y3v",
      checkout: "19bn1isfg4c3t",
    },
    "chainguard-advanced-partner-sales-accelerator": {
      id: "1w57muf27zdg1",
      checkout: "3em1yw57v5d30",
    },
  },
  confetti: {
    autoHideMs: 6000,
    particles: {
      stars: { count: 40, scalar: 1.2 },
      circles: { count: 10, scalar: 0.75 },
      logos: { count: 50, scalar: 3.0 },
    },
    defaults: {
      spread: 360,
      ticks: 50,
      gravity: 1,
      decay: 0.94,
      startVelocity: 40,
      shapes: ["star"],
      colors: ["#C6FF50", "#50FFE1"],
    },
  },
  icons: {
    checkbox: {
      paths: [
        "M8.22948 14.021L5.02148 10.792L5.75048 10.042L8.22948 12.5L14.2505 6.5L14.9795 7.271L8.22948 14.021Z",
      ],
    },
    copy: {
      paths: [
        "M5.12597 18.0835C4.75064 18.0835 4.43464 17.9548 4.17797 17.6975C3.9213 17.4408 3.79297 17.1248 3.79297 16.7495V6.3335H4.87597V16.7495C4.87597 16.8195 4.9003 16.8785 4.94897 16.9265C4.99764 16.9752 5.05664 16.9995 5.12597 16.9995H13.543V18.0835H5.12597ZM7.70897 15.4995C7.3343 15.4995 7.0183 15.3712 6.76097 15.1145C6.5043 14.8572 6.37597 14.5412 6.37597 14.1665V4.6875C6.37597 4.31216 6.5043 3.99283 6.76097 3.7295C7.0183 3.4655 7.3343 3.3335 7.70897 3.3335H15.189C15.5636 3.3335 15.883 3.4655 16.147 3.7295C16.411 3.99283 16.543 4.31216 16.543 4.6875V14.1665C16.543 14.5412 16.411 14.8572 16.147 15.1145C15.883 15.3712 15.5636 15.4995 15.189 15.4995H7.70897ZM7.70897 14.4165H15.189C15.2583 14.4165 15.3206 14.3922 15.376 14.3435C15.4313 14.2948 15.459 14.2358 15.459 14.1665V4.6875C15.459 4.61816 15.4313 4.5555 15.376 4.4995C15.3206 4.44416 15.2583 4.4165 15.189 4.4165H7.70897C7.63964 4.4165 7.58064 4.44416 7.53197 4.4995C7.4833 4.5555 7.45897 4.61816 7.45897 4.6875V14.1665C7.45897 14.2358 7.4833 14.2948 7.53197 14.3435C7.58064 14.3922 7.63964 14.4165 7.70897 14.4165Z",
      ],
    },
    bookmark: {
      attrs: {
        version: "1.1",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        viewBox: "0 0 963.4 963.4",
        xmlSpace: "preserve",
        width: "24",
        height: "24",
      },
      paths: [
        "M114.3,59.2H69.7c-33.1,0-60,26.9-60,60V903.4c0,33.1,26.9,60,60,60h824c33.1,0,60-26.9,60-60V119.2c0-33.1-26.9-60-60-60   H568.9c0,0.3,0,0.5,0,0.8v420.3c0,25.6-10.2,49.2-28.8,66.5c-17,15.799-39.2,24.5-62.4,24.5c-12.4,0-24.4-2.5-35.7-7.301   c-11.899-5.1-22.399-12.6-31.2-22.301L341.601,466.1l-69.2,75.599C263.5,551.4,253,558.9,241.2,564   c-11.3,4.9-23.3,7.301-35.7,7.301c-23.2,0-45.4-8.701-62.4-24.5c-18.6-17.301-28.8-40.9-28.8-66.5V60   C114.3,59.7,114.3,59.4,114.3,59.2z",
        "M228.2,501.1l90.6-99.1c6.101-6.699,14.5-10.1,22.9-10.1s16.7,3.4,22.9,10.1l90.6,99.1c6.4,7,14.6,10.1,22.6,10.1   c15.9,0,31.301-12.299,31.301-31.099V60c0-0.3,0-0.5,0-0.8C508.7,26.4,482,0,449.101,0H234.3c-32.9,0-59.6,26.4-60,59.2   c0,0.3,0,0.5,0,0.8v420.3c0,18.799,15.3,31.1,31.3,31.1C213.6,511.301,221.7,508.199,228.2,501.1z",
      ],
    },
    burger: {
      attrs: {
        width: "24",
        height: "24",
      },
      paths: ["M4 4h16v2H4V4Zm0 7h16v2H4v-2Zm0 7h16v2H4v-2Z"],
    },
    chainguard: {
      attrs: {
        width: "30",
        height: "27",
        viewBox: "0 0 30 27",
      },
      paths: [
        "M24.7199 16.1854C24.9569 15.368 25.0857 14.4724 25.0857 13.4982C25.0857 7.40502 20.047 0.546799 15.0146 0.546799C9.98217 0.546799 4.94345 7.40502 4.94345 13.4982C4.94345 14.8267 5.18298 16.0092 5.60976 17.0461L2.58476 16.876C1.35268 16.8067 0.217578 17.6851 0.409743 18.9041C0.484274 19.3769 0.626315 19.8608 0.879992 20.2788C0.0236265 20.8812 -0.326192 21.9885 0.367699 22.8564C1.06428 23.7277 2.08704 24.5305 3.49093 24.5305C5.01364 24.5305 5.93005 24.137 6.48659 23.6428C6.52721 23.8586 6.61101 24.0711 6.7433 24.2719C7.42673 25.3095 8.55862 26.4501 10.232 26.4501C13.0786 26.4501 13.3961 24.6622 13.5554 23.765C13.5679 23.6948 13.5794 23.6301 13.591 23.572L15.4933 22.6207L17.3956 23.572C17.4072 23.63 17.4187 23.6947 17.4312 23.7648L17.4312 23.765C17.5905 24.6622 17.908 26.4501 20.7546 26.4501C22.428 26.4501 23.5599 25.3095 24.2433 24.2719C24.2702 24.2311 24.2951 24.1898 24.318 24.1481C24.8542 24.38 25.5641 24.5305 26.506 24.5305C27.9099 24.5305 28.9327 23.7277 29.6292 22.8564C30.4824 21.7893 29.7577 20.3602 28.4536 19.9528L28.0227 19.8181C29.2881 19.1624 29.4743 17.9255 29.3387 16.8418C29.1856 15.6172 27.8516 15.0879 26.687 15.496L24.7199 16.1854ZM15.4951 22.603C15.494 22.603 15.4929 22.603 15.4917 22.6031L15.4933 22.6039L15.4951 22.603Z",
      ],
    },
    lightning: {
      attrs: {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
      },
      paths: ["M13.5 2 5 13h6l-1.2 9L19 11h-6l.5-9z"],
    },
    star: {
      attrs: {
        width: "24",
        height: "24",
      },
      paths: ["M12 2 15 8 22 9 17 14l1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"],
    },
    shield: {
      attrs: {
        width: "21",
        height: "25",
        viewBox: "0 0 21 25",
      },
      paths: [
        "M10.5 0.309998L0.748047 3.967V11.3907C0.748047 17.5467 4.90484 23.2881 10.5 24.69C16.0953 23.2881 20.252 17.5467 20.252 11.3907V3.967L10.5 0.309998ZM17.814 11.3907C17.814 16.2667 14.7056 20.777 10.5 22.1545C6.2945 20.777 3.18605 16.2789 3.18605 11.3907V5.66141L10.5 2.91866L17.814 5.66141V11.3907Z",
      ],
    },
    frames: {
      attrs: {
        width: "29",
        height: "29",
        viewBox: "0 0 29 29",
      },
      paths: [
        "M14.9488 28.3542C14.2121 28.3542 13.5886 28.099 13.0782 27.5885C12.5677 27.0781 12.3125 26.4546 12.3125 25.7179V14.9488C12.3125 14.2121 12.5677 13.5885 13.0782 13.0781C13.5886 12.5677 14.2121 12.3125 14.9488 12.3125H25.7179C26.4546 12.3125 27.0782 12.5677 27.5886 13.0781C28.099 13.5885 28.3542 14.2121 28.3542 14.9488V25.7179C28.3542 26.4546 28.099 27.0781 27.5886 27.5885C27.0782 28.099 26.4546 28.3542 25.7179 28.3542H14.9488ZM14.9488 26.1667H25.7179C25.8302 26.1667 25.933 26.1199 26.0263 26.0263C26.1199 25.933 26.1667 25.8302 26.1667 25.7179V14.9488C26.1667 14.8365 26.1199 14.7337 26.0263 14.6404C25.933 14.5468 25.8302 14.5 25.7179 14.5H14.9488C14.8366 14.5 14.7337 14.5468 14.6404 14.6404C14.5468 14.7337 14.5 14.8365 14.5 14.9488V25.7179C14.5 25.8302 14.5468 25.933 14.6404 26.0263C14.7337 26.1199 14.8366 26.1667 14.9488 26.1667ZM6.47921 22.6889V9.11546C6.47921 8.37876 6.73442 7.7552 7.24483 7.24479C7.75525 6.73437 8.37881 6.47916 9.11551 6.47916H22.6889V8.66666H9.11551C9.00322 8.66666 8.90041 8.71345 8.80707 8.80703C8.7135 8.90036 8.66671 9.00317 8.66671 9.11546V22.6889H6.47921ZM0.645874 16.8556V3.28213C0.645874 2.54543 0.901082 1.92187 1.4115 1.41145C1.92192 0.901037 2.54547 0.645828 3.28218 0.645828H16.8556V2.83333H3.28218C3.16988 2.83333 3.06707 2.88012 2.97374 2.97369C2.88016 3.06703 2.83337 3.16984 2.83337 3.28213V16.8556H0.645874Z",
      ],
    },
    classBurger: {
      attrs: {
        width: "24",
        height: "24",
      },
      paths: ["M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"],
    },
  },
};

const CG = {
  env: {
    isInternal: false,
    isAdmin: false,
    isPartner: false,
    isOnlyPartner: false,
    isStaging: window.location.href.includes("chainguard-test"),
    hasUser: typeof skilljarUser !== "undefined",
    hasGroups: typeof skilljarUserStudentGroups !== "undefined",
    hasCourseSeries: typeof skilljarCourseSeries !== "undefined",
    hasCourse: typeof skilljarCourse !== "undefined",
    hasCatalogPage: typeof skilljarCatalogPage !== "undefined",
    hasCourseProgress: typeof skilljarCourseProgress !== "undefined",
    hasCourseBoxes:
      [...document.querySelectorAll(".coursebox-container")].length > 0,
  },
  page: {
    isCatalog: c(".sj-page-catalog"),
    isLanding: c(".sj-page-catalog-root"),
    isCurriculum: c(".sj-page-curriculum"),
    isCourseDetails: c(".sj-page-detail-course"),
    isLesson: c(".sj-page-lesson"),
    isLogin: c(".sj-page-login"),
    isSignup: c(".sj-page-signup"),
    isPageDetail: c(".sj-page-detail-bundle.sj-page-detail-path"),
    isPageCatalog: c(".sj-page-series.sj-page-path"),
    is404: c(".sj-page-error-404"),
    // hasCertificate: c(".cp-certificate"),
    isPartner404: [
      "/page/partners",
      ...Object.keys(CONFIG.partners).map((d) => `/path/${d}`),
    ].find((d) => window.location.href.includes(d)),
  },
  state: {
    domain: CONFIG.domains.prod,
    baseURL: `https://${CONFIG.domains.prod.url}`,
    course: { progress: {}, path: {}, completed: false },
    crumbs: [],

    get user() {
      return skilljarUser;
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
  },
  dom: {
    body: document.body,
    footerContainer: document.querySelector("#footer-container"),
    epFooter: document.querySelector("#ep-footer"),
    messages: document.querySelector("#messages"),
    courseBoxes: [...document.querySelectorAll(".coursebox-container")],
    catalogContent: document.querySelector("#catalog-content"),
    catalogCourses: document.querySelector("#catalog-courses"),

    get contentContainer() {
      return CG.page.isLesson
        ? document.querySelector(".sj-page-lesson")
        : document.querySelector("#skilljar-content");
    },

    header: {
      wrapper:
        document.querySelector(".cp-summary-wrapper") ||
        document.querySelector(".dp-summary-wrapper"),
      floaterText: document.querySelector(".sj-floater-text"),
      mainHeading: document.querySelector(".break-word"),
      courseInfo:
        document.querySelector(".sj-course-info-wrapper") ||
        document.querySelector(".sj-heading-paragraph"),
      ctaBtnWrapper:
        document.querySelector("#resume-button") ||
        document.querySelector("#purchase-button-wrapper-large"),
      registerBtn: document.querySelector("#purchase-button-wrapper-large a"),
      ctaBtn: document.querySelector("#resume-button a"),
      ctaBtnText: document.querySelector("#resume-button a span"),
    },
    courseContainer: document.querySelector("#dp-details"),
    curriculumContainer: document.querySelectorAll(".dp-curriculum")[0],
  },
};

function addCrumb(label, href, prependBase = false) {
  if (prependBase) href = `${CG.state.baseURL}${href}`;
  CG.state.crumbs.push([label, href]);
}

if (CG.env.hasUser) {
  if (CG.state.user.email.includes("@chainguard.dev")) {
    CG.env.isInternal = true;
    CG.env.isPartner = true; // internal users get partner access
  }
  if (CG.state.user.email === "kalle.westerling@chainguard.dev") {
    CG.env.isAdmin = true;
    CG.state.domain = CONFIG.domains.stage;
    CG.state.baseURL = `https://${CG.state.domain.url}`;
  }
}

if (CG.env.hasGroups) {
  CG.env.isInternal = skilljarUserStudentGroups
    .map((d) => d.id)
    .includes("a7iai6t7agi9");

  CG.env.isPartner = skilljarUserStudentGroups
    .map((d) => d.id)
    .includes("1axsvmzhtbb95");

  if (CG.env.isPartner && skilljarUserStudentGroups.length === 1) {
    CG.env.isOnlyPartner = true;
  }
}

if (CG.env.hasCourseSeries) {
  CG.state.course.path = Object.assign(skilljarCourseSeries, {
    edit: `https://dashboard.skilljar.com/publishing/domains/${CG.state.domain.id}/published-paths/${skilljarCourseSeries.id}/edit`,
  });
}

if (CG.env.hasCourse) {
  CG.state.course.id = skilljarCourse.id;
  CG.state.course.publishedCourseId = skilljarCourse.publishedCourseId;
  CG.state.course.tags = skilljarCourse.tags;
  CG.state.course.title = skilljarCourse.title;
  CG.state.course.short_description = skilljarCourse.short_description;
  CG.state.course.long_description_html = skilljarCourse.long_description_html;
  CG.state.course.edit = `https://dashboard.skilljar.com/course/${skilljarCourse.id}`;
}

if (CG.env.hasCourseProgress) {
  CG.state.course.progress = skilljarCourseProgress;
  CG.state.course.completed = skilljarCourseProgress.completed_at !== "";
}

CG.page.inPartnerPath =
  Object.values(CONFIG.partners)
    .map((a) => a.id === CG.state.course.path.id)
    .filter(Boolean).length > 0;

pathSections = {
  home: [
    CG.env.isInternal
      ? {
          eyebrow: "🔓 Internal Training",
          title: "For Chainguardians",
          description:
            "Because you are logged in with a Chainguard email address, you can access internal training materials and resources to enhance your skills and knowledge about Chainguard's products and services.",
          links: [
            {
              isPath: false,
              isCourse: true,
              hasBadge: false,
              title: "Build Your First Chainguard Container",
              slug: "build-your-first-chainguard-container",
              description:
                "This course is designed to teach new Chainguard engineers how to build container images.",
              icon: "chainguard",
            },
            CG.env.isAdmin
              ? {
                  isPath: true,
                  isCourse: false,
                  hasBadge: true,
                  icon: "burger",
                  title: "Painless Vulnerability Management",
                  slug: "path/painless-vulnerability-management",
                  description:
                    "Learn how to manage vulnerabilities effectively using Chainguard's tools and best practices. Currently, this is an internal learning path as we haven't rolled it out publicly yet.",
                }
              : undefined,
          ].filter(Boolean),
          classNames: ["internal"],
        }
      : undefined,
    {
      eyebrow: "Chainguard Fundamentals",
      title: "Get Started with Containers",
      description:
        "Begin your Chainguard journey with essentials. Learn how containers work, how to use Chainguard securely, and gain confidence through guided onboarding.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Chainguard Containers Crash Course",
          slug: "linkys-crash-course-on-chainguard-images",
          description:
            "A fast, focused overview to get you started—from setup and registry basics to vulnerability management and support.",
          icon: "lightning",
        },
        {
          isPath: true,
          isCourse: false,
          hasBadge: false,
          title: "Chainguard Containers Onboarding Guide",
          slug: "path/chainguard-containers-onboarding-guide",
          description:
            "A full 14-course path taking you from container image basics through migration, debugging, and registry mirroring.",
          icon: "burger",
        },
      ],
    },
    {
      eyebrow: "Tools & Customization",
      title: "Make Chainguard Your Own",
      description:
        "Take control with customization tools. Learn to tailor Chainguard containers to your workflows and modernize Dockerfiles into secure, minimal builds.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Custom Assembly",
          slug: "getting-started-with-chainguards-custom-assembly",
          description:
            "Quickly and securely customize your Chainguard Images—no Dockerfile required.",
          icon: "star",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Dockerfile Converter",
          slug: "getting-started-with-chainguards-dockerfile-converter",
          description:
            "Convert Dockerfiles to secure, minimal Chainguard Containers with the Dockerfile Converter CLI.",
          icon: "star",
        },
      ],
    },
    {
      eyebrow: "Security & Compliance",
      title: "Stay Ahead of Risks",
      description:
        "Level up your security practices. Understand vulnerabilities, compliance frameworks like SLSA, and secure emerging areas like AI/ML.",
      links: [
        // {
        //   isPath: false,
        //   isCourse: true,
        //   hasBadge: true,
        //   title: "Painless Vulnerability Management",
        //   slug: "vulnerability-management-certification",
        //   description:
        //     "Covers what vulnerability management is, why it matters, and how to practice it effectively.",
        //   icon: `<svg xmlns="http://www.w3.org/2000/svg" width="29" height="31" viewBox="0 0 29 31" fill="none"><path class="fill-current text-[#14003D] group-hover:text-white" d="M14.5 30.9948C12.5855 30.9948 10.7855 30.6307 9.1002 29.9025C7.41461 29.1743 5.94825 28.1867 4.70113 26.9395C3.45402 25.6924 2.46636 24.2261 1.73817 22.5405C1.00997 20.8551 0.645874 19.0552 0.645874 17.1406C0.645874 14.5849 1.29179 12.2207 2.58363 10.048C3.87572 7.8756 5.64443 6.18357 7.88978 4.97194C7.92357 5.32169 7.96756 5.6751 8.02176 6.03215C8.07596 6.38919 8.16468 6.79959 8.2879 7.26334C6.58481 8.34203 5.24995 9.75077 4.28332 11.4896C3.31669 13.2284 2.83337 15.1121 2.83337 17.1406C2.83337 20.3976 3.96358 23.1563 6.224 25.4167C8.48442 27.6771 11.2431 28.8073 14.5 28.8073C17.757 28.8073 20.5157 27.6771 22.7761 25.4167C25.0365 23.1563 26.1667 20.3976 26.1667 17.1406C26.1667 15.1121 25.6811 13.2223 24.7098 11.4714C23.7386 9.72039 22.3891 8.30557 20.6615 7.22689C20.785 6.77262 20.8761 6.36926 20.9349 6.01683C20.9938 5.6644 21.0475 5.3161 21.0961 4.97194C23.3417 6.18357 25.1127 7.87195 26.4092 10.0371C27.7059 12.202 28.3542 14.5698 28.3542 17.1406C28.3542 19.0552 27.9901 20.8551 27.2619 22.5405C26.5337 24.2261 25.5461 25.6924 24.299 26.9395C23.0518 28.1867 21.5855 29.1743 19.8999 29.9025C18.2145 30.6307 16.4146 30.9948 14.5 30.9948ZM14.5 25.1615C12.2751 25.1615 10.3821 24.3809 8.82093 22.8198C7.25978 21.2586 6.47921 19.3656 6.47921 17.1406C6.47921 15.9273 6.73308 14.7826 7.24082 13.7066C7.74832 12.6306 8.47044 11.7169 9.40718 10.9653C9.50999 11.2643 9.61791 11.5924 9.73093 11.9497C9.84419 12.3067 9.98954 12.7395 10.167 13.248C9.67916 13.7883 9.30716 14.3894 9.05098 15.0512C8.7948 15.713 8.66671 16.4095 8.66671 17.1406C8.66671 18.7448 9.23789 20.1181 10.3802 21.2604C11.5226 22.4028 12.8959 22.974 14.5 22.974C16.1042 22.974 17.4775 22.4028 18.6198 21.2604C19.7622 20.1181 20.3334 18.7448 20.3334 17.1406C20.3334 16.4003 20.203 15.7038 19.9422 15.0512C19.6814 14.3988 19.307 13.7978 18.8189 13.248C18.9572 12.8423 19.061 12.5329 19.1302 12.3198C19.1995 12.1066 19.3416 11.6504 19.5564 10.9511C20.5024 11.7029 21.233 12.6191 21.7483 13.6997C22.2634 14.7803 22.5209 15.9273 22.5209 17.1406C22.5209 19.3656 21.7403 21.2586 20.1792 22.8198C18.618 24.3809 16.725 25.1615 14.5 25.1615ZM13.3221 11.6719C12.4228 8.9589 11.8475 7.10329 11.5961 6.10506C11.3446 5.10659 11.2188 4.16706 11.2188 3.28647C11.2188 2.36845 11.5362 1.59213 12.1711 0.95751C12.8057 0.322649 13.582 0.00521851 14.5 0.00521851C15.4181 0.00521851 16.1944 0.322649 16.829 0.95751C17.4639 1.59213 17.7813 2.36845 17.7813 3.28647C17.7813 4.16706 17.6555 5.10659 17.4039 6.10506C17.1526 7.10329 16.5773 8.9589 15.678 11.6719H13.3221ZM14.5 19.6927C13.7915 19.6927 13.189 19.4446 12.6924 18.9482C12.1961 18.4517 11.948 17.8491 11.948 17.1406C11.948 16.4321 12.1961 15.8296 12.6924 15.333C13.189 14.8367 13.7915 14.5886 14.5 14.5886C15.2085 14.5886 15.8111 14.8367 16.3076 15.333C16.804 15.8296 17.0521 16.4321 17.0521 17.1406C17.0521 17.8491 16.804 18.4517 16.3076 18.9482C15.8111 19.4446 15.2085 19.6927 14.5 19.6927Z" fill="#14003D"></path></svg>`,
        // },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Get Spicy with SLSA",
          slug: "get-spicy-with-slsa-securing-your-supply-chain-one-level-at-a-time",
          description:
            "Understand SLSA, how Chainguard helps you meet it, and why it matters now more than ever.",
          icon: "shield",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: true,
          title: "Securing the AI/ML Supply Chain",
          slug: "securing-ai",
          description:
            "Unpack threats, tools, and standards shaping MLSecOps—protect models, datasets, and AI/ML pipelines.",
          icon: "frames",
        },
      ],
    },
    CG.env.isInternal
      ? {
          eyebrow: "Deep-Dive Paths",
          title: "Master Containers",
          description:
            "Go beyond the basics with this in-depth learning path. Gain expertise in managing Chainguard Containers across the full software supply chain.",
          links: [
            {
              isPath: true,
              isCourse: false,
              hasBadge: false,
              title: "Complete Guide to Chainguard Containers",
              slug: "path/linkys-guide-to-chainguard-images",
              description:
                "This learning path is being sunset. An 8-course path covering implementation, management, and best practices for Chainguard Containers.",
              icon: "classBurger",
            },
          ],
        }
      : undefined,
  ].filter(Boolean),
  "painless-vulnerability-management": [
    {
      eyebrow: "",
      title: "Painless Vulnerability Management",
      description: "",
      links: [
        {
          slug: "software-vulnerabilities-what-are-they",
          isPath: false,
          isCourse: true,
          icon: "bookmark",
          hasBadge: false,
          title: "Software Vulnerabilities: What Are They?",
          description:
            "Understand the basics of software vulnerabilities, including common types and their implications.",
        },
        {
          slug: "how-to-manage-cves",
          isPath: false,
          isCourse: true,
          icon: "bookmark",
          hasBadge: false,
          title: "How to Manage CVEs",
          description:
            "Learn effective strategies for managing Common Vulnerabilities and Exposures (CVEs) in your software.",
        },
        {
          slug: "more-secure-base-images",
          isPath: false,
          isCourse: true,
          icon: "bookmark",
          hasBadge: false,
          title: "More Secure Base Images",
          description:
            "Discover best practices for using Chainguard's secure base images in your containerized applications.",
        },
        {
          slug: "chainguard-containers-to-the-rescue",
          isPath: false,
          isCourse: true,
          icon: "bookmark",
          hasBadge: false,
          title: "Chainguard Containers To the Rescue!",
          description:
            "Explore how Chainguard Containers can help you mitigate vulnerabilities and enhance your security posture.",
        },
        {
          slug: "painless-vulnerability-management-final-exercise",
          isPath: false,
          isCourse: true,
          icon: "bookmark",
          hasBadge: false,
          title: "Painless Vulnerability Management: Final Exercise",
          description:
            "Apply what you've learned in this comprehensive exercise on vulnerability management.",
        },
      ],
    },
  ],
  partners: [
    {
      eyebrow: "Partner Training",
      title: "Chainguard Partner Sales Training",
      description:
        "Equip your sales team with the knowledge they need to effectively sell Chainguard's products and solutions.",
      links: [
        {
          isPath: true,
          isCourse: false,
          hasBadge: true,
          title: "Chainguard Discovery: Partner Sales Foundations",
          slug: "path/chainguard-discovery-partner-sales-foundations",
          icon: "burger",
          description:
            "A comprehensive learning path designed to provide partners with the foundational knowledge needed to effectively sell Chainguard's products and solutions.",
        },
        CG.env.isInternal
          ? {
              isPath: true,
              isCourse: false,
              hasBadge: false,
              title: "Chainguard Advanced: Partner Sales Accelerator",
              slug: "path/chainguard-advanced-partner-sales-accelerator",
              icon: "burger",
              description:
                "An advanced learning path aimed at equipping partners with the skills and knowledge to accelerate their sales efforts for Chainguard's products and solutions.",
            }
          : undefined,
      ].filter(Boolean),
    },
  ],
  "chainguard-containers-onboarding-guide": [
    {
      eyebrow: "Admin Onboarding",
      title: "Platform Admin Kickoff",
      description:
        "Start here to get oriented: kickoff, Console basics, our shared responsibility model, and how to work with Support.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title:
            "Kickoff Guide to Chainguard: Getting Started with Our Platform",
          slug: "kickoff-guide-to-chainguard",
          description:
            "A fast, guided kickoff to help you hit the ground running with Chainguard.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Chainguard's Console",
          slug: "getting-started-with-chainguards-console",
          description:
            "Learn how to explore, manage, and provision container images through Chainguard’s Console.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "An Introduction to Chainguard's Shared Responsibility Model",
          slug: "shared-responsibility-model",
          description:
            "See how Chainguard divides security responsibilities so you can focus on building applications while we handle the undifferentiated heavy lifting.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Chainguard's Superstar Support",
          slug: "chainguards-superstar-support",
          description:
            "Skip the stress and get answers fast. Learn how to navigate Chainguard’s support like a superstar and keep your supply chain secure with zero ticket anxiety.",
          icon: "bookmark",
        },
      ],
    },

    {
      eyebrow: "Technical Onboarding",
      title: "Secure Image Setup & Ops",
      description:
        "Hands-on setup and operations: secure image basics, SSO/IdP integration, registry mirroring, update strategy, EOL planning, customization, migrations, and debugging.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Chainguard 101: Secure Container Images Basics",
          slug: "chainguard-101",
          description:
            "Learn how to build, run, and maintain apps on secure, minimal Chainguard Containers with confidence.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Integrating SSO and IdPs with Chainguard Registry",
          slug: "integrating-sso-and-idps-with-chainguard-registry",
          description:
            "Connect your identity provider and streamline secure access to Chainguard’s registry.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Registry Mirroring with Chainguard",
          slug: "registry-mirroring",
          description:
            "Mirror Chainguard images and packages into your internal registry to simplify access, improve reliability, and strengthen control.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title:
            "Keeping Up With Latest: Update Strategies for Chainguard Images",
          slug: "keeping-up-with-latest",
          description:
            "Stay secure and compliant by keeping your Chainguard images up to date—without the chaos.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Managing End-of-Life Grace Periods with Chainguard",
          slug: "managing-end-of-life-grace-periods-with-chainguard",
          description:
            "Navigate Chainguard’s EOL Grace Period to keep workloads secure while you plan upgrades.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Chainguard's Custom Assembly",
          slug: "getting-started-with-chainguards-custom-assembly",
          description:
            "Quickly and securely customize your Chainguard Images—no Dockerfile required.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Migrating to Chainguard Application Images",
          slug: "migrating-to-chainguard-application-images",
          description:
            "Replace vulnerable upstream images with secure, drop-in Chainguard application images in just a few steps.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Mastering Base Image Migrations With Chainguard",
          slug: "mastering-base-image-migrations-with-chainguard",
          description:
            "Migrate real apps from “it works on Debian” to minimal, secure Chainguard base images.",
          icon: ``,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Containers 102: Practical Image Migration Skills",
          slug: "containers-102",
          description:
            "Hands-on tactics to keep images small, secure, and portable while you migrate to Chainguard.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Debugging Chainguard Containers",
          slug: "debugging-chainguard-containers",
          description:
            "Practical strategies to debug Chainguard’s minimal, secure container images in Docker and Kubernetes—without breaking their security model.",
          icon: "bookmark",
        },
      ],
    },
  ],

  // Partner intro
  "chainguard-discovery-partner-sales-foundations": [
    {
      eyebrow: "Vulnerability Management",
      title: "Chainguard Value Proposition",
      description:
        "Lay the foundations for your understanding of how to best position Chainguard in the open source space with consideration for vulnerability management pain.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Software Vulnerabilities: What Are They?",
          slug: "software-vulnerabilities-what-are-they",
          description:
            "Understand the basics of software vulnerabilities, including common types and their implications.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "How to Manage CVEs",
          slug: "how-to-manage-cves",
          description:
            "Learn best practices for managing Common Vulnerabilities and Exposures (CVEs) in your software supply chain.",
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Chainguard Containers Crash Course",
          slug: "linkys-crash-course-on-chainguard-images",
          description:
            "A comprehensive introduction to Chainguard Containers and their benefits.",
          icon: "bookmark",
        },
      ],
    },
    {
      eyebrow: "Pitching Chainguard",
      title: "How to Effectively Pitch Chainguard",
      description:
        "Learn strategies and best practices for effectively pitching Chainguard to potential customers.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Pitching the Chainguard Way",
          slug: "pitching-the-chainguard-way",
          description:
            "A walk-through of key points for pitching Chainguard solutions.",
          icon: "bookmark",
        },
      ],
    },
    {
      eyebrow: "Selling Chainguard",
      title: "Quoting Chainguard Products",
      description:
        "Learn how to effectively quote Chainguard products and solutions to customers.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Partner Guide to Chainguard Pricing",
          slug: "partner-guide-to-chainguard-pricing",
          description:
            "Understand the basics of quoting Chainguard products and solutions to customers.",
          icon: "bookmark",
        },
      ],
    },
    {
      eyebrow: "Show off your skills",
      title: "Claim your badge",
      description:
        "After completing this learning path, don't forget to claim your Chainguard Partner Sales Foundations badge to showcase your expertise.",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: true,
          title: "Chainguard Discovery: Partner Sales Feedback and Support",
          slug: "chainguard-discovery-partner-sales-feedback-and-support",
          description:
            "Provide feedback, find support resources, and claim your badge after completing the Chainguard Partner Sales Foundations learning path.",
          icon: "bookmark",
        },
      ],
    },
  ],
};

const showBody = () => setStyle(CG.dom.body, { display: undefined });

function debugHeading() {
  let innerHTML = [];

  if (CG.env.isPartner) {
    innerHTML.push(
      `<p style="margin:0"><a href="/page/partners">Partner Courses</a></p>`
    );
  }

  // DEBUG: adding info box for internal users
  if (CG.env.isAdmin) {
    innerHTML.push(`<p style="margin:0">
        ${CG.page.isLanding ? "styleLanding" : ""}
        ${CG.page.isCourseDetails ? "styleCourseDetails" : ""}
        ${CG.page.isPageDetail ? "stylePathCourseDetails" : ""}
        ${CG.page.isLogin ? "styleAuth" : ""}
        ${CG.page.isSignup ? "styleAuth" : ""}
        ${
          CG.page.isCurriculum && !CG.page.hasCertificate
            ? "styleCurriculumPageNoCertificate"
            : ""
        }
        ${
          CG.page.isCurriculum && CG.page.hasCertificate
            ? "styleCurriculumPageHasCertification"
            : ""
        }
        ${CG.page.isLesson ? "styleLesson" : ""}
        ${CG.page.isPageCatalog ? "stylePathCatalogPage" : ""}
      </p>`);

    innerHTML.push(`<input type="checkbox" id="cg-baseurl-staging" />`);

    // Add course edit link
    if (CG.state.course.id) {
      innerHTML.push(
        `<p style="margin:0"><a href="${CG.state.course.edit}">Edit Course</a></p>`
      );
    }

    // Add path edit link
    if (CG.state.course.path.id && CG.state.domain) {
      innerHTML.push(
        `<p style="margin:0"><a href="${CG.state.course.path.edit}">Edit Path</a></p>`
      );
    }
  }

  if (innerHTML.length) {
    const infoBoxes = innerHTML.map((innerHTML) =>
      el("div", {
        innerHTML,
        className: "info-box",
      })
    );

    const headerContainer = document.querySelector("#header-right");
    infoBoxes.forEach((infoBox) => {
      headerContainer.insertBefore(infoBox, headerContainer.firstChild);
    });
  }
}

/*
 * Renders a breadcrumb navigation element.
 * @param {HTMLElement} targetElement - The target element to replace with the breadcrumb navigation.
 * @param {Array} crumbs - An array of arrays, where each sub-array contains two elements: the label (string) and the href (string) for each breadcrumb item.
 *                         The last item in the array is considered the current page and will not be a link.
 * @example
 * renderBreadcrumbs('#breadcrumb-container', [
 *   ['Home', '/'],
 *   ['Section', '/section'],
 *   ['Current Page', '']
 * ]);
 */
function renderBreadcrumbs(targetElement, crumbs) {
  if (
    !targetElement ||
    !crumbs ||
    !Array.isArray(crumbs) ||
    crumbs.length === 0
  )
    return;

  const nav = el(
    "nav",
    {
      className: "breadcrumb",
      ariaLabel: "Breadcrumb",
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
              ariaCurrent: isLast ? "page" : undefined,
            }),
          ]);
        })
      ),
    ]
  );

  targetElement?.replaceChildren(nav);
}

/**
 * TODO: docstring
 */
const logger = {
  enabled() {
    return CG.env.isStaging || CG.env.isAdmin;
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

/*
 * TODO: docstring
 */
function makeSections(
  sections,
  parentSelector = "#skilljar-content",
  baseURL = "https://courses.chainguard.dev"
) {
  sections.forEach((section) => {
    const sectionElement = el(
      "section",
      {
        className: `featured-courses ${section.classNames?.join(" ") || ""}`,
      },
      [
        el("div", { className: "featured-courses__grid" }, [
          // Intro
          el("div", { className: "featured-courses__intro" }, [
            el("h2", { className: "eyebrow", text: section.eyebrow }),
            el("p", { className: "headline", text: section.title }),
            el("p", { className: "subhead", text: section.description }),
          ]),

          // Courses grid
          el(
            "div",
            { className: "cards" },
            section.links.map((link) => {
              const isRegistered = CG.state.courses.registered.includes(
                link.slug
              )
                ? "card--in-progress"
                : "";
              const isCompleted = CG.state.courses.completed.includes(link.slug)
                ? "card--completed"
                : "";

              return el(
                "a",
                {
                  className: "card__link",
                  href: `${baseURL}/${link.slug}`,
                  title: link.isCourse ? "Start course" : "Start path",
                },
                [
                  el(
                    "article",
                    {
                      className: `card ${isCompleted} ${isRegistered}`,
                    },
                    [
                      el(
                        "div",
                        {
                          className: "card__inner",
                        },
                        [
                          isCompleted
                            ? el("span", {
                                className: "pill completed",
                                textContent: "Completed",
                              })
                            : undefined,
                          isRegistered && !isCompleted
                            ? el("span", {
                                className: "pill in-progress",
                                textContent: "In Progress",
                              })
                            : undefined,
                          el(
                            "div",
                            {
                              className: "card__icon",
                            },
                            [createClone(link.icon)]
                          ),
                          el(
                            "h5",
                            {
                              className: "card__eyebrow",
                              text: link.isCourse ? "Course" : "Learning Path",
                            },
                            [el("span", { textContent: " | Free" })]
                          ),
                          el("h3", {
                            className: "card__title",
                            text: link.title,
                          }),
                          el("p", {
                            className: "card__text",
                            text: link.description,
                          }),
                          link.hasBadge && !isCompleted
                            ? el("span", {
                                className: "pill badged",
                                text: "Get a Badge",
                              })
                            : undefined,
                        ].filter(Boolean)
                      ),
                    ]
                  ),
                ]
              );
            })
          ),
        ]),
      ].filter(Boolean)
    );

    document.querySelector(parentSelector).append(sectionElement);
  });
}

function createClone(
  type = "checkbox",
  attrs = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "21",
    viewBox: "0 0 20 21",
    // fill: "none",
  }
) {
  if (!CONFIG.icons[type]) {
    logger.error(`Icon type "${type}" not found in CONFIG.icons`);
    return null;
  }

  if (CONFIG.icons[type].attrs) {
    attrs = CONFIG.icons[type].attrs;
  }

  if (!attrs["className"]) attrs.className = `clone-icon ${type}-icon`;

  return el(
    "svg",
    attrs,
    CONFIG.icons[type].paths.map((d) => el("path", { d }))
  );
}

function getCorrectURL(link) {
  let url = new URL(link);

  // add UTM params for tracking if specified
  CONFIG.utm ? Object.assign(url.searchParams, CONFIG.utm) : undefined;

  return url.toString();
}

const createResourceCard = (resource) =>
  el(
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

function getCurriculumElements(curriculumParentContainer) {
  let currentSection = 0,
    elements = Array.from(
      curriculumParentContainer.querySelectorAll("[class^='lesson-'],.section")
    ),
    a;

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
        elem.querySelector(".bullet i"),
      ];
    });

  if (!currentSection) {
    // we have no sections, only a list of lessons
    a = [
      {
        section: 1,
        heading: "Lessons",
        lessons: content.map((d) => d[2]),
        links: content.map((d) => d[3]),
        bullets: content.map((d) => d[4]),
      },
    ];
  } else {
    a = new Array(currentSection).fill(0).map((_, i) => ({
      section: i + 1,
      heading: content.filter((d) => d[1] && d[0] === i + 1)[0][2],
      lessons: content.filter((d) => !d[1] && d[0] === i + 1).map((d) => d[2]),
      links: content.filter((d) => !d[1] && d[0] === i + 1).map((d) => d[3]),
      bullets: content.filter((d) => !d[1] && d[0] === i + 1).map((d) => d[4]),
    }));
  }

  return a.map((section) => {
    const wrapper = el("div", {
      className: "curriculum-wrapper",
    });

    const header = el("div", {
      className: "curriculum-header no-select",
      textContent: section.heading,
    });

    const lessons = section.lessons.map((lesson, ix) => {
      const a = el("a", {
        className: "curriculum-lesson no-select" /* lesson-row */,
        textContent: lesson,
        href: section.links[ix] || "#",
      });

      if (section.bullets[ix]) a.prepend(section.bullets[ix]);

      return a;
    });

    wrapper.append(header, ...lessons);

    return wrapper;
  });
}

function createCourseDetailsCard(
  details,
  options = {
    btnText: "Register",
    btnHref: "#",
    completed: false,
  }
) {
  logger.info(
    "Creating course details card with details and options:",
    details,
    options
  );

  // Create main container
  const card = el("div", {
    className: "course-details-card",
  });

  // Header
  const header = el("div", {
    className: "course-details-card-header no-select",
    textContent: "Course Details",
  });
  card.appendChild(header);

  // List
  const list = el("ul", {
    className: "course-details-card-list no-select",
  });

  // Audience
  const audienceItem = el("li", {
    innerHTML: `<p>${details.audience}</p>`,
  });
  list.appendChild(audienceItem);

  // Time
  const timeItem = el("li", {
    innerHTML: `<p>${details.time}</p>`,
  });
  list.appendChild(timeItem);

  // Lessons
  const lessonsItem = el("li", {
    innerHTML: `<p>${details.lessons} Lessons</p>`,
  });
  list.appendChild(lessonsItem);

  card.appendChild(list);

  // Link
  const link = el("a", {
    href: options.completed ? "#" : options.btnHref,
    textContent: options.completed ? "🎉 Completed" : options.btnText,
    className: `button ${
      options.completed ? "completed" : "" // course-details-card-link
    }`,
  });

  // add margin to link button
  setStyle(link, {
    marginLeft: "20px",
    marginRight: "20px",
  });

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
 * This function copies the given text to the clipboard and animates a tooltip indicating success.
 * @param {string} copyText - The text to copy to the clipboard.
 * @param {HTMLElement} tooltipContainer - The element to animate as a tooltip.
 * @return {Function} - A function that, when called, will copy the text and animate the tooltip.
 */
function toClipboard(copyText, tooltipContainer) {
  /**
   * This function animates the tooltip that appears when code is copied.
   * It sets the opacity to 1, waits for 400ms, and then sets the opacity to 0.
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
    const elem = document.querySelector(target);
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
 * This function hides the given element by setting its display style to "none".
 * @param {HTMLElement} element - The element to hide.
 */
const hide = (element) => setStyle(element, { display: "none !important" });

/**
 * This function applies desktop-specific styling to a catalog page.
 */
function styleCatalog() {
  logger.info("Running styleCatalog");
  let sections = pathSections[skilljarCatalogPage.slug]; // ex. "partners"

  if (!sections) sections = pathSections["home"];

  if (!pathSections[skilljarCatalogPage.slug] && !CG.page.isLanding)
    logger.warn("Could not determine catalog section name, defaulting to home");

  // hide existing content
  hide(CG.dom.catalogContent);

  // create new sections
  makeSections(sections, "#skilljar-content", CG.state.baseURL);
}

/**
 * This function applies styling to the 404 error page.
 */
function style404() {
  logger.info("Running style404");

  if (CG.page.isPartner404) {
    document.querySelector(".message").append(
      ...[
        el("hr"),
        el("p", {
          classList: "sj-text-page-not-found-explanation",
          innerHTML: `If you are a partner and trying to access our Partner courses, you have to first <a href="/auth/login?next=%2Fpage%2Fpartners">sign in or sign up for our Courses platform</a>.`,
        }),
      ]
    );
  }
}

/**
 * This function applies general styling to the course details page.
 */
function styleCourseDetails() {
  logger.info("Running styleCourseDetails");

  CG.dom.local = {
    card: {
      details: document.querySelector(".course-details-card"),
      detailItems: document.querySelectorAll(".course-details-card li"),
      link: document.querySelector(".course-details-card-link"),
    },
  };

  // Add course order
  [...CG.dom.header.courseInfo.children]
    .filter((elem) => elem.textContent.search(/Course \d+ of \d+ in/) !== -1)
    .forEach((elem) => elem.classList.add("course-order"));

  // Add path registration info
  [...CG.dom.header.courseInfo.children]
    .filter(
      (elem) =>
        elem.textContent.search(
          /Register for the learning path to register for this course/
        ) !== -1
    )
    .forEach((elem) => elem.classList.add("path-registration"));

  let btnHref = "#";
  if (CG.dom.header.ctaBtnWrapper) {
    btnHref = CG.dom.header.registerBtn.href;
  } else {
    const links = [...CG.dom.header.courseInfo.querySelectorAll("p")]
      .filter((d) => d.textContent.toLowerCase().includes("learning path"))
      .map((p) =>
        [...p.querySelectorAll("a")].filter(
          (a) => a.innerHTML === "learning path"
        )
      )
      .flat();

    if (links.length > 0) {
      btnHref = CONFIG.partners[skilljarCourseSeries.slug]?.checkout
        ? `/checkout/${CONFIG.partners[skilljarCourseSeries.slug]?.checkout}`
        : links[0].href;
    }
  }

  if (typeof courseDetails !== "undefined") {
    CG.dom.local.card.details ? CG.dom.local.card.details.remove() : null; // remove existing card if present
    CG.dom.courseContainer.append(
      ...[
        createCourseDetailsCard(courseDetails, {
          btnText: CG.dom.header.ctaBtnWrapper
            ? CG.dom.header.registerBtn.textContent
            : "Register for Learning Path",
          btnHref,
          completed: CG.state.course.completed,
        }),
      ].filter(Boolean)
    );
    CG.dom.local.card.link = document.querySelector(
      ".course-details-card-link"
    ); // re-query link
  }

  try {
    const curriculumElements = getCurriculumElements(
      CG.dom.curriculumContainer
    );

    CG.dom.curriculumContainer.innerHTML = ""; // Clear the container
    CG.dom.curriculumContainer.append(...curriculumElements);
  } catch (error) {
    logger.error("Error processing curriculum elements:", error);
  }

  // append card
  CG.dom.courseContainer.append(...[CG.dom.local.card.details].filter(Boolean));

  // append elements to header
  CG.dom.header.wrapper.append(
    ...[
      CG.dom.header.floaterText,
      CG.dom.header.mainHeading,
      CG.dom.header.courseInfo,
      CG.dom.header.ctaBtnWrapper,
    ].filter(Boolean)
  );
}

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
 * This function applies general styling to the path course details page.
 */
function stylePathCourseDetails() {
  logger.info("Running stylePathCourseDetails");

  // set content
  CG.dom.header.floaterText.textContent = "Learning Path";
  CG.dom.header.courseInfo.textContent =
    skilljarCourseSeries.short_description || "";

  // move elements
  CG.dom.header.wrapper.append(
    ...[
      CG.dom.header.floaterText,
      CG.dom.header.mainHeading,
      CG.dom.header.courseInfo,
      CG.dom.header.ctaBtnWrapper,
    ].filter(Boolean)
  );

  // make path sections
  tryPathSections();
}

/**
 * This function applies desktop-specific styling to the path catalog page.
 */
function stylePathCatalogPage() {
  logger.info("Running stylePathCatalogPage");

  hide([
    ".path-curriculum-resume-wrapper",
    "#path-curriculum-progress-bar-annotation",
    "#path-curriculum-progress-bar",
  ]);

  const topRow = el("div", {
    className: "top-row-grey top-row-white-v2 padding-top padding-side row-v2",
  });

  const topRowInner = el(
    "div",
    {
      className: "row dp-row-flex-v2",
    },
    [
      // top row left
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
          document.querySelector(".path-curriculum-button-wrapper a"),
        ]
      ),
    ]
  );

  const breadcrumb = el("div", {
    className: "row dp-row-flex-v2",
    id: "breadcrumb",
  });
  renderBreadcrumbs(breadcrumb, CG.state.crumbs);
  topRow.append(breadcrumb, topRowInner);

  const detailsBundle = el(
    "div",
    {
      id: "dp-details-bundle",
    },
    [
      el(
        "div",
        {
          className: "row padding-side",
        },
        [
          el(
            "div",
            {
              className: "columns",
            },
            [
              el(
                "div",
                {
                  className: "dp-long-description",
                },
                [
                  el("p", {
                    innerHTML: skilljarCourseSeries.long_description_html,
                  }),
                ]
              ),
            ]
          ),
        ]
      ),
    ]
  );

  // prepend topRow and detailsBundle to content
  CG.dom.contentContainer.prepend(...[topRow, detailsBundle].filter(Boolean));

  // make path sections
  tryPathSections();
}

function styleLesson() {
  logger.info("Running styleLesson");

  /**
   * This function processes code blocks by adding a copy icon and functionality to copy the code to the clipboard.
   * It filters out code blocks that have the 'noCopy' or 'copyAdded' data attributes.
   * @param {NodeList} codeBlocks - A list of code block elements to process.
   * @return {void}
   */
  CG.dom.local = {
    body: {
      mainContainer: document.querySelector("#lp-wrapper"),
      innerContainer: document.querySelector("#lesson-body"),
    },
    lesson: {
      body: document.querySelector("#lesson-body"),
      innerBody: document.querySelector("#lesson-main-inner"),
      content: {
        codeBlocks: new Array(
          ...document.querySelectorAll("pre:has(code):not(.language-ansi)")
        ),
        internalCourseWarning: document.querySelector(
          "#internal-course-warning"
        ),
        links: document.querySelectorAll("sjwc-lesson-content-item a"),
        resources: {
          boxes: document.querySelectorAll(
            "sjwc-lesson-content-item .resource-box"
          ),
          wrapper: document.querySelector(
            "sjwc-lesson-content-item .resource-box .resource-wrapper"
          ),
        },
      },
    },
    nav: {
      toggleWrapper: document.querySelector("#left-nav-button"),
      backToCurriculumText: document.querySelector("#left-nav-return-text"),
    },
    footer: {
      container: document.querySelector("#lp-footer"),
    },
  };

  // content
  if (CG.dom.local.nav.backToCurriculumText)
    CG.dom.local.nav.backToCurriculumText.textContent =
      "Back to Course Overview";

  // Makes lesson links pop up in new tab
  CG.dom.local.lesson.content.links.forEach((elem) => {
    elem.target = "_blank";
    // we also want to set some utm_source, utm_medium here if it's a link to a certain set of domains (domain name includes chainguard.dev)
    if (elem.href.includes("chainguard.dev")) {
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

  // 1) Find canonical footer controls
  const footerPrev = document.querySelector("#lp-footer .prev-lesson-button");
  const footerNext = document.querySelector("#lp-footer .next-lesson-link");

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

  CG.dom.local.lesson.innerBody.append(el("hr"), btnWrapper);

  CG.dom.local.lesson.content.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((elem) => {
      const codeEl = elem.querySelector("code");
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
      iconClone.addEventListener(
        "click",
        toClipboard(copyText, tooltipContainer)
      );

      // Mark that copy icon was added to this code block
      elem.dataset.copyAdded = "true";
    });

  // Make section titles normal h3 elements
  Array.from(document.querySelectorAll("h3.sjwc-section-title")).map((elem) =>
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

        const wrapper = box.querySelector(".resource-wrapper");

        // Clear existing content
        wrapper.innerHTML = "";

        // Add cards
        wrapper.append(...cards);
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

          const wrapper = box.querySelector(".resource-wrapper");

          // Clear existing content
          wrapper.innerHTML = "";

          // Add cards
          if (resources.groups[box.dataset.group]) {
            wrapper.append(...cards);
          }
        });
      }
    }
  }
}

function styleAuth() {
  logger.info("Running styleAuth");

  CG.dom.local = {
    googleBtn: document.querySelector("#google_login"),
    termsAndServices: document.querySelector("#access-message"),
    altMethod:
      document.querySelector(".sj-text-sign-in-with span") ||
      document.querySelector(".sj-text-sign-up-with span"),

    inputs: {
      password2: document.querySelector("#id_password2"), // signup specific
      email: document.querySelector("#id_email"), // signup specific
    },

    // login specific
    loginBtn: document.querySelector("#button-sign-in"),
    loginForm: document.querySelector("#login_form"),
    loginText: document.querySelector("#login-tab-left span span"),
    signupTabTextSpan: document.querySelector("#login-tab-right span"),

    // signup-specific
    loginTabTextSpan: document.querySelector("#login-tab-left a span"),
    signupForm: document.querySelector("#signup_form"),
    signupTabText:
      document.querySelector("#login-tab-right a") ||
      document.querySelector("#login-tab-right span"),
    passwordConfirm: document.querySelector(
      "label[for=id_password2] .input-label-text span"
    ),
    fNameLabel: document.querySelector('label[for="id_first_name"] span span'),
    lNameLabel: document.querySelector('label[for="id_last_name"] span span'),
    emailLabel: document.querySelector('label[for="id_email"]'),
    signupBtnText: document.querySelector("#button-sign-up span"),
  };

  if (CG.page.isLogin) {
    CG.dom.local.loginText.textContent = "Log In";
    CG.dom.local.signupTabTextSpan.textContent = "Sign Up";
    CG.dom.local.altMethod.textContent = "Or Log In With";
    CG.dom.local.loginBtn.textContent = "Log In";
    CG.dom.local.googleBtn.textContent = "Continue with Google";

    CG.dom.local.loginForm.append(CG.dom.local.termsAndServices);
  } else {
    CG.dom.local.loginTabTextSpan.textContent = "Log In";
    CG.dom.local.signupTabText.textContent = "Sign Up";
    CG.dom.local.altMethod.textContent = "Or Sign Up With";
    CG.dom.local.fNameLabel.textContent = "First Name";
    CG.dom.local.googleBtn.textContent = "Continue with Google";
    CG.dom.local.lNameLabel.textContent = "Last Name";
    CG.dom.local.signupBtnText.textContent = "Sign Up";
    CG.dom.local.passwordConfirm.textContent = "Password Confirm";
    CG.dom.local.emailLabel.textContent = "Work Email";
    CG.dom.local.inputs.email.placeholder = "Work Email";
    CG.dom.local.inputs.password2.placeholder = "Password Confirm";

    CG.dom.local.signupForm.append(CG.dom.local.termsAndServices);
  }

  // hide existing login content
  hide([
    document.querySelector(".white-bg"),
    document.querySelector("#login-content"),
  ]);

  const authContainer = el(
    "div",
    {
      id: "auth-container",
      style: "flex-grow: 1; min-height: 100vh;",
    },
    [
      document.querySelector("#tabs"),
      el("div", { className: "auth-card" }, [
        CG.page.isLogin ? CG.dom.local.loginForm : CG.dom.local.signupForm,
        CG.page.isLogin
          ? document.querySelector(".sj-text-sign-in-with")
          : document.querySelector(".sj-text-sign-up-with"),
        CG.dom.local.googleBtn,
        CG.dom.local.termsAndServices,
      ]),
    ]
  );

  CG.dom.contentContainer.append(authContainer);
}

function styleCurriculumPageNoCertificate() {
  logger.info("Running styleCurriculumPageNoCertificate");

  CG.dom.local = {
    body: {
      mainContainer: document.querySelector("#cp-content"),
    },
    curriculum: {
      container: document.querySelector("#curriculum-list"),
    },
    tabs: {
      container: document.querySelector(".tabs"),
      curriculumSection:
        document.querySelector(".tabs section #curriculumSection") ||
        document.querySelector(".tabs section:nth-child(1)"),
      aboutSection:
        document.querySelector(".tabs section #aboutSection") ||
        document.querySelector(".tabs section:nth-child(2)"),
    },
    card: {
      details: document.querySelector(".course-details-card"),
      detailItems: document.querySelectorAll(".course-details-card li"),
      link: document.querySelector(".course-details-card-link"),
    },
  };

  CG.dom.local.tabs.aboutSection?.classList.add("active");

  CG.dom.local.tabs.aboutSection.id = "aboutSection";
  CG.dom.local.tabs.curriculumSection.id = "curriculumSection";

  CG.dom.local.tabs.container.append(
    CG.dom.local.tabs.aboutSection,
    CG.dom.local.tabs.curriculumSection
  );

  if (typeof courseDetails !== "undefined") {
    CG.dom.local.card.details ? CG.dom.local.card.details.remove() : null; // remove existing card if present
    CG.dom.local.body.mainContainer.append(
      ...[
        createCourseDetailsCard(courseDetails, {
          btnText: CG.dom.header.ctaBtnWrapper
            ? CG.dom.header.ctaBtnText.textContent
            : "Resume",
          btnHref: CG.dom.header.ctaBtnText
            ? CG.dom.header.ctaBtn.getAttribute("href")
            : "resume",
          completed: CG.state.course.completed,
        }),
      ].filter(Boolean)
    );
    CG.dom.local.card.link = document.querySelector(
      ".course-details-card-link"
    ); // re-query link
  }

  // update resume button text and href (with auto-value fallback)
  if (CG.dom.header.ctaBtnWrapper && CG.dom.local.card.link) {
    const btnText = CG.dom.header.ctaBtnText.textContent || "Resume";
    const btnHref = CG.dom.header.ctaBtn.getAttribute("href") || "resume";

    CG.dom.local.card.link.textContent = btnText;
    CG.dom.local.card.link.href = btnHref;
  } else if (CG.dom.local.card.link) {
    logger.warn("Hiding resume button as it could not be found");
    if (!CG.state.course.completed) {
      hide(CG.dom.local.card.link); // Hide resume button if it doesn't exist
    }
  }

  const curriculumElements = getCurriculumElements(
    CG.dom.local.curriculum.container
  );

  CG.dom.local.curriculum.container.innerHTML = ""; // Clear the container
  CG.dom.local.curriculum.container.append(...curriculumElements);

  CG.dom.header.courseInfo.textContent = skilljarCourse.short_description;

  // move elements
  CG.dom.local.body.mainContainer.append(
    ...[CG.dom.local.card.details].filter(Boolean)
  );
  CG.dom.header.wrapper.append(
    ...[
      CG.dom.header.floaterText,
      CG.dom.header.mainHeading,
      CG.dom.header.courseInfo,
      CG.dom.header.ctaBtnWrapper,
    ].filter(Boolean)
  );
}

const pageHandlers = [
  { test: () => CG.page.isLogin || CG.page.isSignup, handler: styleAuth },
  { test: () => CG.page.isCourseDetails, handler: styleCourseDetails },
  {
    test: () => CG.page.isCurriculum,
    handler: styleCurriculumPageNoCertificate,
  },
  { test: () => CG.page.isPageDetail, handler: stylePathCourseDetails },
  { test: () => CG.page.isPageCatalog, handler: stylePathCatalogPage },
  { test: () => CG.page.isLesson, handler: styleLesson },
  { test: () => CG.page.isCatalog || CG.page.isLanding, handler: styleCatalog },
  { test: () => CG.page.is404, handler: style404 },
];

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

  if (CG.page.isPageDetail || CG.page.isCourseDetails || CG.page.isCurriculum) {
    // make breadcrumbs
    const breadcrumb = el("div", { id: "breadcrumb" }); // CG.page.isPageDetail
    renderBreadcrumbs(breadcrumb, CG.state.crumbs);
    CG.dom.header.wrapper.prepend(breadcrumb);

    // append elements to header
    CG.dom.header.wrapper.append(
      ...[
        CG.dom.header.floaterText,
        CG.dom.header.mainHeading,
        CG.dom.header.courseInfo,
        CG.dom.header.ctaBtnWrapper,
      ].filter(Boolean)
    );
  }

  // move footer
  CG.dom.contentContainer.append(CG.dom.footerContainer);

  // move messages
  CG.dom.contentContainer.prepend(CG.dom.messages);

  // hide Skilljar footer
  hide(CG.dom.epFooter);
}

/**
  This event is fired when the DOM is fully loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
  It is a good place to run scripts that need to manipulate the DOM or set up event listeners.
*/
document.addEventListener("DOMContentLoaded", () => {
  // hide all
  hide(CG.dom.body);

  // remove search container
  document.querySelector(".search-container")?.remove();

  // setup breadcrumbs
  addCrumb("Home", CG.state.baseURL);

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

  debugHeading();

  handlePageStyling();

  // show all
  showBody();
});

/**
 * Inject overlay HTML once
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
 * Show / hide with fade
 */
function showCompletion(elem) {
  elem.setAttribute("aria-hidden", "false");
  setStyle(elem, { display: "block" });
  // Next paint to trigger transition
  requestAnimationFrame(() => setStyle(elem, { opacity: "1" }));
  // focus for accessibility
  const focusTarget = elem.querySelector("#completion-card");
  if (focusTarget) focusTarget.focus({ preventScroll: true });

  const countdownEl = elem.querySelector("#completion-countdown");
  if (countdownEl) {
    let remaining = CONFIG.confetti.autoHideMs / 1000;
    countdownEl.textContent = remaining;
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        countdownEl.textContent = remaining;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}

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
 * Public trigger (call this from Skilljar when course completes)
 * Example usage:
 *   window.animateCompletion();
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

document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("cg-baseurl-staging");
  if (CG.env.isStaging) checkbox.checked = true;

  if (checkbox) {
    function updateLinks(useTestDomain) {
      const links = document.querySelectorAll(
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
        } else if (
          !useTestDomain &&
          url.hostname === CONFIG.domains.stage.url
        ) {
          url.hostname = CONFIG.domains.prod.url;
        }
        link.href = url.toString();
      });
    }

    // initial state update if needed
    updateLinks(checkbox.checked);

    // toggle behavior
    checkbox.addEventListener("change", function () {
      updateLinks(this.checked);
    });
  }
});
