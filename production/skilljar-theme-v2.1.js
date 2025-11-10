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

// UTM settings
const UTM = {
  SOURCE: "courses",
  MEDIUM: "referral",
  CAMPAIGN: "dev-enablement",
};

const DOMAIN = {
  prod: { url: "courses.chainguard.dev", id: "3glgawqmzatte" },
  stage: { url: "chainguard-test.skilljar.com", id: "ix1ljpxex6xd" },
};

// confetti defaults
const AUTOHIDE_COMPLETION = 6000;
const particles = {
  stars: { counts: 40, scalar: 1.2 },
  circles: { counts: 10, scalar: 0.75 },
  logos: { counts: 50, scalar: 3.0 },
};

const confettiDefaults = {
  spread: 360,
  ticks: 50,
  gravity: 1,
  decay: 0.94,
  startVelocity: 40,
  shapes: ["star"],
  colors: ["#C6FF50", "#50FFE1"],
};

// baseURL settings

let isInternal = false,
  isAdmin = false;

if (typeof skilljarUser !== "undefined") {
  isInternal = skilljarUser.email.includes("@chainguard.dev");
  isAdmin = skilljarUser.email === "kalle.westerling@chainguard.dev";
}

DOMAIN.current = isAdmin ? DOMAIN.stage : DOMAIN.prod;

const baseURL = `https://${DOMAIN.current.url}`;

// let initialLoadComplete = false,
let isStaging = false,
  userCourseJourney = {},
  course = {
    progress: {},
    path:
      typeof skilljarCourseSeries !== "undefined" ? skilljarCourseSeries : {},
    completed: false,
  },
  crumbs = [["Home", baseURL]];

if (window.location.hostname === "chainguard-test.skilljar.com") {
  isStaging = true;
}

// set up userCourseJourney global variable
if (Array.from(document.querySelectorAll(".coursebox-container")).length)
  userCourseJourney = {
    unregistered: Array.from(
      document.querySelectorAll(
        ".coursebox-container[data-course-status='unregistered']"
      )
    ).map((el) => Object.assign({ ...el.dataset })),
    registered: Array.from(
      document.querySelectorAll(
        ".coursebox-container[data-course-status='registered']"
      )
    ).map((el) => Object.assign({ ...el.dataset })),
    completed: Array.from(
      document.querySelectorAll(
        ".coursebox-container[data-course-status='complete']"
      )
    ).map((el) => Object.assign({ ...el.dataset })),
  };

if (typeof skilljarCourseSeries !== "undefined") {
  course.path.edit = `https://dashboard.skilljar.com/publishing/domains/${DOMAIN.current.id}/published-paths/${skilljarCourseSeries.id}/edit`;
  crumbs.push([
    skilljarCourseSeries.title,
    `${baseURL}/path/${skilljarCourseSeries.slug}`,
  ]);
}

if (typeof skilljarCourse !== "undefined") {
  course.id = skilljarCourse.id;
  course.publishedCourseId = skilljarCourse.publishedCourseId;
  course.tags = skilljarCourse.tags;
  course.title = skilljarCourse.title;
  course.short_description = skilljarCourse.short_description;
  course.long_description_html = skilljarCourse.long_description_html;
  course.edit = `https://dashboard.skilljar.com/course/${skilljarCourse.id}`;

  let courseURL = "#";
  if (typeof skilljarCourseSeries !== "undefined") {
    // courseURL = `${baseURL}/path/${skilljarCourseSeries.slug}/courses/${skilljarCourse.publishedCourseId}`;
  } else {
    // courseURL = `${baseURL}/courses/${skilljarCourse.publishedCourseId}`;
  }
  crumbs.push([skilljarCourse.title, courseURL]);
}

if (typeof skilljarCourseProgress !== "undefined") {
  course.progress = skilljarCourseProgress;
  course.completed = skilljarCourseProgress.completed_at !== "";
}

// path settings
const icons = {
  bookmark: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 963.4 963.4" xml:space="preserve" width="30" height="27"><path d="M114.3,59.2H69.7c-33.1,0-60,26.9-60,60V903.4c0,33.1,26.9,60,60,60h824c33.1,0,60-26.9,60-60V119.2c0-33.1-26.9-60-60-60   H568.9c0,0.3,0,0.5,0,0.8v420.3c0,25.6-10.2,49.2-28.8,66.5c-17,15.799-39.2,24.5-62.4,24.5c-12.4,0-24.4-2.5-35.7-7.301   c-11.899-5.1-22.399-12.6-31.2-22.301L341.601,466.1l-69.2,75.599C263.5,551.4,253,558.9,241.2,564   c-11.3,4.9-23.3,7.301-35.7,7.301c-23.2,0-45.4-8.701-62.4-24.5c-18.6-17.301-28.8-40.9-28.8-66.5V60   C114.3,59.7,114.3,59.4,114.3,59.2z"/><path d="M228.2,501.1l90.6-99.1c6.101-6.699,14.5-10.1,22.9-10.1s16.7,3.4,22.9,10.1l90.6,99.1c6.4,7,14.6,10.1,22.6,10.1   c15.9,0,31.301-12.299,31.301-31.099V60c0-0.3,0-0.5,0-0.8C508.7,26.4,482,0,449.101,0H234.3c-32.9,0-59.6,26.4-60,59.2   c0,0.3,0,0.5,0,0.8v420.3c0,18.799,15.3,31.1,31.3,31.1C213.6,511.301,221.7,508.199,228.2,501.1z"/></svg>`,
  burger: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M4 4h16v2H4V4Zm0 7h16v2H4v-2Zm0 7h16v2H4v-2Z"/></svg>`,
};

pathSections = {
  home: [
    isInternal
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
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="27" viewBox="0 0 30 27" fill="none"><path class="fill-current text-[#14003D] group-hover:text-white" fill-rule="evenodd" clip-rule="evenodd" d="M24.7199 16.1854C24.9569 15.368 25.0857 14.4724 25.0857 13.4982C25.0857 7.40502 20.047 0.546799 15.0146 0.546799C9.98217 0.546799 4.94345 7.40502 4.94345 13.4982C4.94345 14.8267 5.18298 16.0092 5.60976 17.0461L2.58476 16.876C1.35268 16.8067 0.217578 17.6851 0.409743 18.9041C0.484274 19.3769 0.626315 19.8608 0.879992 20.2788C0.0236265 20.8812 -0.326192 21.9885 0.367699 22.8564C1.06428 23.7277 2.08704 24.5305 3.49093 24.5305C5.01364 24.5305 5.93005 24.137 6.48659 23.6428C6.52721 23.8586 6.61101 24.0711 6.7433 24.2719C7.42673 25.3095 8.55862 26.4501 10.232 26.4501C13.0786 26.4501 13.3961 24.6622 13.5554 23.765C13.5679 23.6948 13.5794 23.6301 13.591 23.572L15.4933 22.6207L17.3956 23.572C17.4072 23.63 17.4187 23.6947 17.4312 23.7648L17.4312 23.765C17.5905 24.6622 17.908 26.4501 20.7546 26.4501C22.428 26.4501 23.5599 25.3095 24.2433 24.2719C24.2702 24.2311 24.2951 24.1898 24.318 24.1481C24.8542 24.38 25.5641 24.5305 26.506 24.5305C27.9099 24.5305 28.9327 23.7277 29.6292 22.8564C30.4824 21.7893 29.7577 20.3602 28.4536 19.9528L28.0227 19.8181C29.2881 19.1624 29.4743 17.9255 29.3387 16.8418C29.1856 15.6172 27.8516 15.0879 26.687 15.496L24.7199 16.1854ZM15.4951 22.603C15.494 22.603 15.4929 22.603 15.4917 22.6031L15.4933 22.6039L15.4951 22.603Z" fill="#14003D"></path></svg>`,
            },
            isAdmin
              ? {
                  isPath: true,
                  isCourse: false,
                  hasBadge: true,
                  icon: icons.burger,
                  title: "Chainguard Vulnslayer",
                  slug: "path/chainguard-vulnslayer",
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
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 2 5 13h6l-1.2 9L19 11h-6l.5-9z"/></svg>`,
        },
        {
          isPath: true,
          isCourse: false,
          hasBadge: false,
          title: "Chainguard Containers Onboarding Guide",
          slug: "path/chainguard-containers-onboarding-guide",
          description:
            "A full 14-course path taking you from container image basics through migration, debugging, and registry mirroring.",
          icon: icons.burger,
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
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M12 2 15 8 22 9 17 14l1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/></svg>`,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Dockerfile Converter",
          slug: "getting-started-with-chainguards-dockerfile-converter",
          description:
            "Convert Dockerfiles to secure, minimal Chainguard Containers with the Dockerfile Converter CLI.",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M12 2 15 8 22 9 17 14l1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/></svg>`,
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
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="25" viewBox="0 0 21 25" fill="none"><path class="fill-current text-[#14003D] group-hover:text-white" d="M10.5 0.309998L0.748047 3.967V11.3907C0.748047 17.5467 4.90484 23.2881 10.5 24.69C16.0953 23.2881 20.252 17.5467 20.252 11.3907V3.967L10.5 0.309998ZM17.814 11.3907C17.814 16.2667 14.7056 20.777 10.5 22.1545C6.2945 20.777 3.18605 16.2789 3.18605 11.3907V5.66141L10.5 2.91866L17.814 5.66141V11.3907Z" fill="#14003D"></path></svg>`,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: true,
          title: "Securing the AI/ML Supply Chain",
          slug: "securing-ai",
          description:
            "Unpack threats, tools, and standards shaping MLSecOps—protect models, datasets, and AI/ML pipelines.",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"><path class="fill-current text-[#14003D] group-hover:text-white" d="M14.9488 28.3542C14.2121 28.3542 13.5886 28.099 13.0782 27.5885C12.5677 27.0781 12.3125 26.4546 12.3125 25.7179V14.9488C12.3125 14.2121 12.5677 13.5885 13.0782 13.0781C13.5886 12.5677 14.2121 12.3125 14.9488 12.3125H25.7179C26.4546 12.3125 27.0782 12.5677 27.5886 13.0781C28.099 13.5885 28.3542 14.2121 28.3542 14.9488V25.7179C28.3542 26.4546 28.099 27.0781 27.5886 27.5885C27.0782 28.099 26.4546 28.3542 25.7179 28.3542H14.9488ZM14.9488 26.1667H25.7179C25.8302 26.1667 25.933 26.1199 26.0263 26.0263C26.1199 25.933 26.1667 25.8302 26.1667 25.7179V14.9488C26.1667 14.8365 26.1199 14.7337 26.0263 14.6404C25.933 14.5468 25.8302 14.5 25.7179 14.5H14.9488C14.8366 14.5 14.7337 14.5468 14.6404 14.6404C14.5468 14.7337 14.5 14.8365 14.5 14.9488V25.7179C14.5 25.8302 14.5468 25.933 14.6404 26.0263C14.7337 26.1199 14.8366 26.1667 14.9488 26.1667ZM6.47921 22.6889V9.11546C6.47921 8.37876 6.73442 7.7552 7.24483 7.24479C7.75525 6.73437 8.37881 6.47916 9.11551 6.47916H22.6889V8.66666H9.11551C9.00322 8.66666 8.90041 8.71345 8.80707 8.80703C8.7135 8.90036 8.66671 9.00317 8.66671 9.11546V22.6889H6.47921ZM0.645874 16.8556V3.28213C0.645874 2.54543 0.901082 1.92187 1.4115 1.41145C1.92192 0.901037 2.54547 0.645828 3.28218 0.645828H16.8556V2.83333H3.28218C3.16988 2.83333 3.06707 2.88012 2.97374 2.97369C2.88016 3.06703 2.83337 3.16984 2.83337 3.28213V16.8556H0.645874Z" fill="#14003D"></path></svg>`,
        },
      ],
    },
    isInternal
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
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"/></svg>`,
            },
          ],
        }
      : undefined,
  ].filter(Boolean),
  "chainguard-vulnslayer": [
    {
      eyebrow: "",
      title: "Painless Vulnerability Management",
      description: "",
      links: [
        {
          slug: "software-vulnerabilities-what-are-they",
          isPath: false,
          isCourse: true,
          icon: icons.bookmark,
          hasBadge: false,
          title: "Software Vulnerabilities: What Are They?",
          description:
            "Understand the basics of software vulnerabilities, including common types and their implications.",
        },
        {
          slug: "how-to-manage-cves",
          isPath: false,
          isCourse: true,
          icon: icons.bookmark,
          hasBadge: false,
          title: "How to Manage CVEs",
          description:
            "Learn effective strategies for managing Common Vulnerabilities and Exposures (CVEs) in your software.",
        },
        {
          slug: "more-secure-base-images",
          isPath: false,
          isCourse: true,
          icon: icons.bookmark,
          hasBadge: false,
          title: "More Secure Base Images",
          description:
            "Discover best practices for using Chainguard's secure base images in your containerized applications.",
        },
        {
          slug: "chainguard-containers-to-the-rescue",
          isPath: false,
          isCourse: true,
          icon: icons.bookmark,
          hasBadge: false,
          title: "Chainguard Containers To the Rescue!",
          description:
            "Explore how Chainguard Containers can help you mitigate vulnerabilities and enhance your security posture.",
        },
        {
          slug: "painless-vulnerability-management-final-exercise",
          isPath: false,
          isCourse: true,
          icon: icons.bookmark,
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
          hasBadge: false,
          title: "Chainguard Discovery: Partner Sales Foundations",
          slug: "path/chainguard-discovery-partner-sales-foundations",
          icon: icons.burger,
          description:
            "A comprehensive learning path designed to provide partners with the foundational knowledge needed to effectively sell Chainguard's products and solutions.",
        },
        {
          isPath: true,
          isCourse: false,
          hasBadge: false,
          title: "Chainguard Advanced: Partner Sales Accelerator",
          slug: "path/chainguard-advanced-partner-sales-accelerator",
          icon: icons.burger,
          description:
            "An advanced learning path aimed at equipping partners with the skills and knowledge to accelerate their sales efforts for Chainguard's products and solutions.",
        },
      ],
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
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Chainguard's Console",
          slug: "getting-started-with-chainguards-console",
          description:
            "Learn how to explore, manage, and provision container images through Chainguard’s Console.",
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "An Introduction to Chainguard's Shared Responsibility Model",
          slug: "shared-responsibility-model",
          description:
            "See how Chainguard divides security responsibilities so you can focus on building applications while we handle the undifferentiated heavy lifting.",
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Chainguard's Superstar Support",
          slug: "chainguards-superstar-support",
          description:
            "Skip the stress and get answers fast. Learn how to navigate Chainguard’s support like a superstar and keep your supply chain secure with zero ticket anxiety.",
          icon: icons.bookmark,
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
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Integrating SSO and IdPs with Chainguard Registry",
          slug: "integrating-sso-and-idps-with-chainguard-registry",
          description:
            "Connect your identity provider and streamline secure access to Chainguard’s registry.",
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Registry Mirroring with Chainguard",
          slug: "registry-mirroring",
          description:
            "Mirror Chainguard images and packages into your internal registry to simplify access, improve reliability, and strengthen control.",
          icon: icons.bookmark,
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
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Managing End-of-Life Grace Periods with Chainguard",
          slug: "managing-end-of-life-grace-periods-with-chainguard",
          description:
            "Navigate Chainguard’s EOL Grace Period to keep workloads secure while you plan upgrades.",
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Chainguard's Custom Assembly",
          slug: "getting-started-with-chainguards-custom-assembly",
          description:
            "Quickly and securely customize your Chainguard Images—no Dockerfile required.",
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Migrating to Chainguard Application Images",
          slug: "migrating-to-chainguard-application-images",
          description:
            "Replace vulnerable upstream images with secure, drop-in Chainguard application images in just a few steps.",
          icon: icons.bookmark,
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
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Debugging Chainguard Containers",
          slug: "debugging-chainguard-containers",
          description:
            "Practical strategies to debug Chainguard’s minimal, secure container images in Docker and Kubernetes—without breaking their security model.",
          icon: icons.bookmark,
        },
      ],
    },
  ],

  // Partner intro
  "chainguard-discovery-partner-sales-foundations": [
    {
      eyebrow: "XYZ XYZ XYZ",
      title: "Chainguard Value Proposition",
      description:
        "We can have a short description here for introduction to Chainguard's value prop or whatever this section will be",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Software Vulnerabilities: What Are They?",
          slug: "software-vulnerabilities-what-are-they",
          description:
            "Understand the basics of software vulnerabilities, including common types and their implications.",
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "How to Manage CVEs",
          slug: "how-to-manage-cves",
          description:
            "Learn best practices for managing Common Vulnerabilities and Exposures (CVEs) in your software supply chain.",
          icon: icons.bookmark,
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Chainguard Containers Crash Course",
          slug: "linkys-crash-course-on-chainguard-images",
          description:
            "A comprehensive introduction to Chainguard Containers and their benefits.",
          icon: icons.bookmark,
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
          icon: icons.bookmark,
        },
      ],
    },
    {
      eyebrow: "Something else here",
      title: "Federal Government Overview",
      description:
        "This is another description for the second section in this partner intro example",
      links: [
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Carahsoft: How to Quote Chainguard",
          slug: "getting-started-with-carahsoft-how-to-quote-chainguard",
          description:
            "Understand the basics of quoting Chainguard through Carahsoft.",
          icon: icons.bookmark,
        },
      ],
    },
  ],
};

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

  // Create the breadcrumb navigation elements
  const nav = Object.assign(document.createElement("nav"), {
    className: "breadcrumb",
    "aria-label": "Breadcrumb",
    role: "navigation",
  });

  const ol = document.createElement("ol");

  crumbs.forEach(([textContent, href], i) => {
    const li = document.createElement("li");
    let element;
    if (i < crumbs.length - 1 && href && href !== "#") {
      element = Object.assign(document.createElement("a"), {
        href,
        textContent,
        className: "crumb",
        title: textContent,
      });
    } else {
      element = Object.assign(document.createElement("span"), {
        textContent,
        className: "crumb",
        title: textContent,
        ariaCurrent: "page",
      });
    }
    li.appendChild(element);
    ol.appendChild(li);
  });

  nav.appendChild(ol);
  targetElement?.replaceChildren(nav);
}

/**
 * This function logs messages to the console with a specific style.
 * It only logs messages if the hostname includes "chainguard-test.skilljar.com".
 * It supports both string messages and objects.
 * @param {string|object} message - The message to log.
 * @param {...*} args - Additional arguments to log.
 * @return {void}
 * @example
 * log("This is a test message");
 * log({ key: "value" }, "Additional info");
 */
const log = (message, ...args) => {
  if ((!message || !isStaging) && !isAdmin) return;

  const style = "color: var(--primary-blue-hex); font-weight: 600;";

  if (typeof message === "string") {
    console.info(`%c${message}`, style, ...args);
  } else {
    console.info("%c", style, message, ...args);
  }
};

/*
 * TODO: docstring
 */
function makeSections(
  sections,
  parentSelector = "#skilljar-content",
  baseURL = "https://courses.chainguard.dev"
) {
  const registeredCourses = userCourseJourney.registered.map((d) => d.course);
  const completedCourses = userCourseJourney.completed.map((d) => d.course);

  sections.forEach((section) => {
    const sectionElement = Object.assign(document.createElement("section"), {
      className: "featured-courses",
    });

    if (section.classNames) {
      sectionElement.classList.add(...section.classNames);
    }

    const grid = Object.assign(document.createElement("div"), {
      className: "featured-courses__grid",
    });

    const intro = Object.assign(document.createElement("div"), {
      className: "featured-courses__intro",
    });

    const eyebrow = Object.assign(document.createElement("h2"), {
      className: "eyebrow",
      textContent: section.eyebrow || "",
    });

    const headline = Object.assign(document.createElement("p"), {
      className: "headline",
      textContent: section.title || "",
    });

    const subhead = Object.assign(document.createElement("p"), {
      className: "subhead",
      textContent: section.description || "",
    });

    // const cta = Object.assign(document.createElement("a"), {
    //     className: "btn btn--primary",
    //     href: "/",
    //     textContent: "Browse all courses",
    // });

    intro.append(...[eyebrow, headline, subhead /*cta*/]);
    grid.append(intro);

    sectionElement.append(
      ...[document.querySelector("#messages"), grid].filter(Boolean)
    );

    const cardsElem = Object.assign(document.createElement("div"), {
      className: "cards",
    });

    section.links.forEach((link) => {
      const isRegistered = registeredCourses.includes(link.slug);
      const isCompleted = completedCourses.includes(link.slug);

      article = Object.assign(document.createElement("article"), {
        className: `card ${isCompleted ? "card--completed" : ""} ${
          isRegistered ? "card--in-progress" : ""
        }`,
      });

      innerContainer = Object.assign(document.createElement("div"), {
        className: "card__inner",
      });

      if (isCompleted) {
        pill = Object.assign(document.createElement("span"), {
          className: "pill completed",
          textContent: "Completed",
        });
        innerContainer.append(pill);
      }

      if (isRegistered && !isCompleted) {
        pill = Object.assign(document.createElement("span"), {
          className: "pill in-progress",
          textContent: "In Progress",
        });
        innerContainer.append(pill);
      }

      iconContainer = Object.assign(document.createElement("div"), {
        className: "card__icon",
        innerHTML: link.icon || "",
      });

      titleEyebrow = Object.assign(document.createElement("h5"), {
        className: "card__eyebrow",
        textContent: link.isCourse ? "Course" : "Learning Path",
      });

      const price = Object.assign(document.createElement("span"), {
        textContent: " | Free",
      });

      titleEyebrow.append(price);

      title = Object.assign(document.createElement("h3"), {
        className: "card__title",
        textContent: link.title || "",
      });

      description = Object.assign(document.createElement("p"), {
        className: "card__text",
        textContent: link.description || "",
      });

      innerContainer.append(
        ...[iconContainer, titleEyebrow, title, description]
      );

      if (link.hasBadge && !isCompleted) {
        pill = Object.assign(document.createElement("span"), {
          className: "pill badged",
          textContent: "Get a Badge",
        });
        innerContainer.append(pill);
      }

      article.append(innerContainer);

      cardLink = Object.assign(document.createElement("a"), {
        className: "card__link",
        href: `${baseURL}/${link.slug}`,
        title: link.isCourse ? "Start course" : "Start path",
      });

      cardLink.append(article);

      cardsElem.append(cardLink);
    });

    grid.append(cardsElem);
    sectionElement.append(grid);
    document.querySelector(parentSelector).append(sectionElement);
  });
}

function createClone(type = "checkbox") {
  function createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  }

  const attrs = {
    className: `${type}-icon`,
    width: "20",
    height: "21",
    viewBox: "0 0 20 21",
    fill: "none",
    style:
      `display: block; fill: var(${
        type === "checkbox" ? "--answer-option" : "--primary-blue-hex"
      });` +
      (type === "copy" ? "cursor: pointer;" : "") +
      (type === "checkbox" ? "flex-shrink: 0;" : ""),
  };

  const svg = createSvgElement("svg", attrs);

  let path;
  switch (type) {
    case "checkbox":
      path = createSvgElement("path", {
        d: "M8.22948 14.021L5.02148 10.792L5.75048 10.042L8.22948 12.5L14.2505 6.5L14.9795 7.271L8.22948 14.021Z",
      });
      break;

    case "copy":
      path = createSvgElement("path", {
        d: "M5.12597 18.0835C4.75064 18.0835 4.43464 17.9548 4.17797 17.6975C3.9213 17.4408 3.79297 17.1248 3.79297 16.7495V6.3335H4.87597V16.7495C4.87597 16.8195 4.9003 16.8785 4.94897 16.9265C4.99764 16.9752 5.05664 16.9995 5.12597 16.9995H13.543V18.0835H5.12597ZM7.70897 15.4995C7.3343 15.4995 7.0183 15.3712 6.76097 15.1145C6.5043 14.8572 6.37597 14.5412 6.37597 14.1665V4.6875C6.37597 4.31216 6.5043 3.99283 6.76097 3.7295C7.0183 3.4655 7.3343 3.3335 7.70897 3.3335H15.189C15.5636 3.3335 15.883 3.4655 16.147 3.7295C16.411 3.99283 16.543 4.31216 16.543 4.6875V14.1665C16.543 14.5412 16.411 14.8572 16.147 15.1145C15.883 15.3712 15.5636 15.4995 15.189 15.4995H7.70897ZM7.70897 14.4165H15.189C15.2583 14.4165 15.3206 14.3922 15.376 14.3435C15.4313 14.2948 15.459 14.2358 15.459 14.1665V4.6875C15.459 4.61816 15.4313 4.5555 15.376 4.4995C15.3206 4.44416 15.2583 4.4165 15.189 4.4165H7.70897C7.63964 4.4165 7.58064 4.44416 7.53197 4.4995C7.4833 4.5555 7.45897 4.61816 7.45897 4.6875V14.1665C7.45897 14.2358 7.4833 14.2948 7.53197 14.3435C7.58064 14.3922 7.63964 14.4165 7.70897 14.4165Z",
      });
      break;
  }

  svg.appendChild(path);

  return svg;
}

function createResourceCard(resource) {
  // ---- Link with optional UTM ----
  let link;
  if (resource.addUTM) {
    const url = new URL(resource.link);
    url.searchParams.set("utm_source", "courses");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "dev-enablement");
    link = url.toString();
  } else {
    link = resource.link;
  }

  // ---- Outer link wrapper ----
  const linkWrapper = Object.assign(document.createElement("a"), {
    href: link,
    target: "_blank",
    className: "resource-link-wrapper", // style like a block if needed
  });

  // ---- Card container ----
  const card = Object.assign(document.createElement("div"), {
    className: "resource-card",
  });

  const cardWrapper = Object.assign(document.createElement("div"), {
    className: "card-body",
  });

  // ---- Badges before title ----
  if (Array.isArray(resource.tags) && resource.tags.length > 0) {
    const badgeContainer = Object.assign(document.createElement("div"), {
      className: "badge-container",
    });

    resource.tags.forEach((tag) => {
      const badge = Object.assign(document.createElement("div"), {
        className: "badge",
        textContent: tag,
      });
      badgeContainer.appendChild(badge);
    });

    cardWrapper.appendChild(badgeContainer);
  }

  // ---- Title ----
  const titleEl = Object.assign(document.createElement("h5"), {
    className: "card-title",
    textContent: resource.title,
  });
  cardWrapper.appendChild(titleEl);

  // ---- Assemble ----
  card.appendChild(cardWrapper);
  linkWrapper.appendChild(card);

  return linkWrapper;
}

const c = (selector) => (document.querySelector(selector) ? true : false);

const page = {
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
};

let v = {
  viewport: "", // "mobile" or "desktop"
  width: 0, // current viewport width

  // elements
  global: {
    body: document.querySelector("body"),
    logo: document.querySelector(".header-center-img"),
    footerContainer: document.querySelector("#footer-container"),
    footerCols: document.querySelectorAll(
      "#footer-container .global-footer-column"
    ),
    epFooter: document.querySelector("#ep-footer"),
    contentContainer: page.isLesson
      ? document.querySelector(".sj-page-lesson")
      : document.querySelector("#skilljar-content"),
  },
};

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
        elem.textContent.replace("optional", "").trim(),
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
    const wrapper = Object.assign(document.createElement("div"), {
      className: "curriculum-wrapper",
    });

    const header = Object.assign(document.createElement("div"), {
      className: "curriculum-header",
      textContent: section.heading,
    });

    const lessons = section.lessons.map((lesson, ix) => {
      const a = Object.assign(document.createElement("a"), {
        className: "curriculum-lesson" /* lesson-row */,
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
  console.info(
    "Creating course details card with details and options:",
    details,
    options
  );

  // Create main container
  const card = Object.assign(document.createElement("div"), {
    className: "course-details-card",
  });

  // Header
  const header = Object.assign(document.createElement("div"), {
    className: "course-details-card-header",
    textContent: "Course Details",
  });
  card.appendChild(header);

  // List
  const list = Object.assign(document.createElement("ul"), {
    className: "course-details-card-list",
  });

  // Audience
  const audienceItem = Object.assign(document.createElement("li"), {
    innerHTML: `<p>${details.audience}</p>`,
  });
  list.appendChild(audienceItem);

  // Time
  const timeItem = Object.assign(document.createElement("li"), {
    innerHTML: `<p>${details.time}</p>`,
  });
  list.appendChild(timeItem);

  // Lessons
  const lessonsItem = Object.assign(document.createElement("li"), {
    innerHTML: `<p>${details.lessons} Lessons</p>`,
  });
  list.appendChild(lessonsItem);

  card.appendChild(list);

  // Link
  const link = Object.assign(document.createElement("a"), {
    href: options.completed ? "#" : options.btnHref,
    textContent: options.completed ? "🎉 Completed" : options.btnText,
    className: `course-details-card-link ${
      options.completed ? "completed" : ""
    }`,
  });

  card.appendChild(link);

  if (options.completed) {
    card.append(
      Object.assign(document.createElement("p"), {
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
  return async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      animateCopiedTooltip(tooltipContainer);
    } catch (err) {
      console.error("Failed to copy codeblock to clipboard: ", err);
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

  const apply = (el) => {
    for (const [prop, raw] of Object.entries(style)) {
      const cssProp = toKebab(prop);

      // If undefined → unset
      if (raw === undefined) {
        el.style.removeProperty(cssProp);
        continue;
      }

      let value = String(raw);
      let priority = "";

      if (/\s*!important\s*$/i.test(value)) {
        priority = "important";
        value = value.replace(/\s*!important\s*$/i, "");
      }

      if (value.trim()) {
        el.style.setProperty(cssProp, value.trim(), priority);
      }
    }
    return el;
  };

  // selector string → first match
  if (typeof target === "string") {
    const el = document.querySelector(target);
    return el ? apply(el) : null;
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
function hide(element) {
  setStyle(element, { display: "none !important" });
}

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

/**
 * This function styles the group container for curriculum sections.
 * It sets the border, border radius, margin, and padding.
 * @param {HTMLElement} container - The container element to style.
 * @param {string} border - The border style to apply. Default is "b" for blue.
 * @return {void}
 */
// function styleGroupContainer(container, border = "b") {
//   log("Running styleGroupContainer with setStyle");
//   setStyle(container, {
//     border:
//       border === "b"
//         ? "2px solid var(--primary-blue-hex)"
//         : "1px solid var(--detail-medium-contrast)",
//     borderRadius: "8px",
//     marginBottom: "48px",
//     padding: "0",
//   });
// }

/**
 * This function styles the list item for lessons.
 * It hides the type icon, sets padding, font size, font weight, and line height.
 * If the item is not the last child, it adds a bottom border.
 * @param {HTMLElement} lessonItem - The list item element to style.
 * @param {boolean} isLastChild - Indicates if the item is the last child.
 * @param {boolean} hideIcon - Whether to hide the type icon. Default is true.
 * @param {string} border - The border style to apply. Default is "b" for blue.
 * @return {void}
 */
// function styleListItem(lessonItem, isLastChild, hideIcon = true, border = "b") {
//   log("Running styleListItem with setStyle");
//   if (hideIcon) {
//     hide(lessonItem.querySelector(".type-icon"));
//   }

//   setStyle(lessonItem, {
//     padding: "24px",
//     fontSize: "16px",
//     fontWeight: "400",
//     lineHeight: "150%",
//     borderBottom: isLastChild
//       ? "none"
//       : border === "b"
//       ? "2px solid var(--primary-blue-hex)"
//       : "1px solid var(--detail-medium-contrast)",
//   });
// }

/**
 * This function styles the group heading container.
 * It sets padding, border bottom, and styles the actual group heading.
 * @param {HTMLElement} groupHeadingContainer - The group heading container to style.
 */
// function styleGroupHeading(groupHeadingContainer, border = "b") {
//   log("Running styleGroupHeading with setStyle");
//   setStyle(groupHeadingContainer, {
//     padding: "24px",
//     margin: "0",
//     fontFamily: "Fusiona",
//     fontSize: "16px",
//     fontWeight: "500",
//     lineHeight: "125%",
//     letterSpacing: "-.16px",
//     borderBottom:
//       border === "b"
//         ? "2px solid var(--primary-blue-hex)"
//         : "1px solid var(--detail-medium-contrast)",
//   });
// }

/**
 * This function applies desktop-specific styling to a catalog page.
 */
function styleCatalog() {
  log("Running styleCatalog");
  let sectionName = "";

  v.local = {
    catalogBodyParentContainer: document.querySelector("#catalog-content"),
    catalogContainer: document.querySelector("#catalog-courses"),
  };

  if (page.isLanding) {
    sectionName = "home";
  } else if (skilljarCatalogPage.slug) {
    sectionName = skilljarCatalogPage.slug; // ex. "partners"
  }

  if (sectionName) {
    makeSections(pathSections[sectionName], "#skilljar-content", baseURL);

    document
      .querySelector("#skilljar-content")
      .append(v.global.footerContainer);

    v.local.catalogBodyParentContainer.append(v.local.catalogContainer);

    hide(v.local.catalogBodyParentContainer);
  }
}

/**
 * This function applies styling to the 404 error page.
 */
function style404() {
  console.log("Running style404");
}

/**
 * This function applies desktop-specific styling to the landing page.
 */
function styleLanding() {
  log("Running styleLanding");
}

/**
 * This function applies general styling to the course details page.
 */
function styleCourseDetails() {
  log("Running styleCourseDetails");

  v.local = {
    header: {
      container: document.querySelector(".top-row-grey"),
      floaterText: document.querySelector(".sj-floater-text"),
      mainHeading: document.querySelector(".break-word"),
      courseInfo:
        document.querySelector(".sj-course-info-wrapper") ||
        document.querySelector(".sj-heading-paragraph"),
      ctaBtnWrapper: document.querySelector("#purchase-button-wrapper-large"),
      registerBtn: document.querySelector("#purchase-button-wrapper-large a"),
      mainHeadingContainer: document.querySelector(".dp-summary-wrapper"),
    },
    body: {
      container: document.querySelector("#dp-details"),
    },
    curriculum: {
      container: document.querySelectorAll(".dp-curriculum")[0], // note: this is the desktop version
    },
    card: {
      details: document.querySelector(".course-details-card"),
      detailItems: document.querySelectorAll(".course-details-card li"),
      link: document.querySelector(".course-details-card-link"),
    },
  };

  const btnText = v.local.header.ctaBtnWrapper
    ? v.local.header.registerBtn.textContent
    : "Register";
  const btnHref = v.local.header.ctaBtnWrapper
    ? v.local.header.registerBtn.href
    : "#"; // TODO: fix this link

  if (typeof courseDetails !== "undefined") {
    v.local.card.details ? v.local.card.details.remove() : null; // remove existing card if present
    v.local.body.container.append(
      ...[
        createCourseDetailsCard(courseDetails, {
          btnText,
          btnHref,
          completed: course.completed,
        }),
      ].filter(Boolean)
    );
    v.local.card.link = document.querySelector(".course-details-card-link"); // re-query link
  }

  const curriculumElements = getCurriculumElements(
    v.local.curriculum.container
  );

  v.local.curriculum.container.innerHTML = ""; // Clear the container
  v.local.curriculum.container.append(...curriculumElements);

  // append card
  v.local.body.container.append(...[v.local.card.details].filter(Boolean));

  // add a breadcrumb to a div with id "breadcrumb" added to .dp-summary-wrapper
  const breadcrumb = Object.assign(document.createElement("div"), {
    id: "breadcrumb",
    className: "",
  });
  renderBreadcrumbs(breadcrumb, crumbs);

  // append elements to header
  v.local.header.mainHeadingContainer.append(
    ...[
      breadcrumb,
      v.local.header.floaterText,
      v.local.header.mainHeading,
      v.local.header.courseInfo,
      v.local.header.ctaBtnWrapper,
    ].filter(Boolean)
  );
}

/**
 * This function applies general styling to the path course details page.
 */
function stylePathCourseDetails() {
  log("Running stylePathCourseDetails");

  v.local = {
    header: {
      mainHeadingContainer: document.querySelector(".dp-summary-wrapper"),
      floaterText: document.querySelector(".sj-floater-text"),
      mainHeading: document.querySelector(".break-word"),
      courseInfo: document.querySelector(".sj-heading-paragraph"),
      ctaBtnWrapper: document.querySelector("#purchase-button-wrapper-large"),
    },
    catalog: document.querySelector(".catalog-center-width"),
  };

  // set content
  v.local.header.floaterText.textContent = "Learning Path";
  v.local.header.courseInfo.textContent =
    skilljarCourseSeries.short_description || "";

  // add a breadcrumb to a div with id "" added to .cp-summary-row-v2
  const breadcrumb = Object.assign(document.createElement("div"), {
    id: "breadcrumb",
    className: "",
  });
  renderBreadcrumbs(breadcrumb, crumbs);

  // move elements
  v.local.header.mainHeadingContainer.append(
    ...[
      breadcrumb,
      v.local.header.floaterText,
      v.local.header.mainHeading,
      v.local.header.courseInfo,
      v.local.header.ctaBtnWrapper,
    ].filter(Boolean)
  );

  if (pathSections[skilljarPath.slug]) {
    hide(".sj-courseboxes-v2");

    makeSections(
      pathSections[skilljarPath.slug],
      "#skilljar-content",
      `${baseURL}/path/${skilljarPath.slug}`
    );

    document
      .querySelector("#skilljar-content")
      .append(v.global.footerContainer);
  } else {
    console.warn(`Tried to load ${skilljarPath.slug} path unsuccessfully.`);
  }
}

/**
 * This function applies desktop-specific styling to the path catalog page.
 */
function stylePathCatalogPage() {
  log("Running stylePathCatalogPage");

  hide(".path-curriculum-resume-wrapper");

  const topRow = Object.assign(document.createElement("div"), {
    className: "top-row-grey top-row-white-v2 padding-top padding-side row-v2",
  });
  const topRowInner = Object.assign(document.createElement("div"), {
    className: "row dp-row-flex-v2",
  });
  const topRowLeft = Object.assign(document.createElement("div"), {
    className: "columns text-center large-6 dp-summary-wrapper text-left-v2",
  });
  const floaterText = Object.assign(document.createElement("div"), {
    className: "sj-floater-text",
    textContent: "Learning Path",
  });
  const mainHeading = Object.assign(document.createElement("h1"), {
    className: "break-word",
    textContent: skilljarCourseSeries.title || "",
  });
  const courseInfo = Object.assign(document.createElement("p"), {
    className: "sj-heading-paragraph",
    textContent: skilljarCourseSeries.short_description || "",
  });
  const ctaBtnWrapper = document.querySelector(
    ".path-curriculum-button-wrapper a"
  );
  const progressAnnotation = document.querySelector(
    "#path-curriculum-progress-bar-annotation"
  );
  const progressBar = document.querySelector("#path-curriculum-progress-bar");
  hide([progressAnnotation, progressBar]); // temporarily
  topRowLeft.append(
    ...[
      floaterText,
      mainHeading,
      courseInfo,
      ctaBtnWrapper,
      progressAnnotation,
      progressBar,
    ].filter(Boolean)
  );
  topRowInner.append(topRowLeft);

  const breadcrumb = Object.assign(document.createElement("div"), {
    className: "row dp-row-flex-v2",
    id: "breadcrumb",
  });
  renderBreadcrumbs(breadcrumb, crumbs);
  topRow.append(breadcrumb, topRowInner);

  const detailsBundle = Object.assign(document.createElement("div"), {
    id: "dp-details-bundle",
  });
  const detailsBundleRow = Object.assign(document.createElement("div"), {
    className: "row padding-side",
  });
  const detailsBundleCol = Object.assign(document.createElement("div"), {
    className: "columns",
  });
  const longDescription = Object.assign(document.createElement("div"), {
    className: "dp-long-description",
  });
  const longDescPara = Object.assign(document.createElement("p"));
  longDescPara.innerHTML = skilljarCourseSeries.long_description_html;
  longDescription.append(longDescPara);
  detailsBundleCol.append(longDescription);
  detailsBundleRow.append(detailsBundleCol);
  detailsBundle.append(detailsBundleRow);

  // prepend topRow and detailsBundle to content
  document
    .querySelector("#skilljar-content")
    .prepend(...[topRow, detailsBundle].filter(Boolean));

  if (pathSections[skilljarPath.slug]) {
    hide(".sj-courseboxes-v2");

    makeSections(
      pathSections[skilljarPath.slug],
      "#skilljar-content",
      `${baseURL}/path/${skilljarPath.slug}`
    );

    document
      .querySelector("#skilljar-content")
      .append(v.global.footerContainer);
  } else {
    console.warn(`Tried to load ${skilljarPath.slug} path unsuccessfully.`);
  }
}

function styleLesson() {
  log("Running styleLesson");

  /**
   * This function processes code blocks by adding a copy icon and functionality to copy the code to the clipboard.
   * It filters out code blocks that have the 'noCopy' or 'copyAdded' data attributes.
   * @param {NodeList} codeBlocks - A list of code block elements to process.
   * @return {void}
   */
  v.local = {
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
  if (v.local.nav.backToCurriculumText)
    v.local.nav.backToCurriculumText.textContent = "Back to Course Overview";

  // Makes lesson links pop up in new tab
  v.local.lesson.content.links.forEach((el) => {
    el.target = "_blank";
    // we also want to set some utm_source, utm_medium here if it's a link to a certain set of domains (domain name includes chainguard.dev)
    if (el.href.includes("chainguard.dev")) {
      const url = new URL(el.href);
      url.searchParams.set("utm_source", UTM.SOURCE);
      url.searchParams.set("utm_medium", UTM.MEDIUM);
      url.searchParams.set("utm_campaign", UTM.CAMPAIGN);
      el.href = url.toString();
    }
  });

  // move elements
  v.local.body.mainContainer.append(v.local.footer.container);
  v.local.body.innerContainer.prepend(
    ...[
      v.local.lesson.content.internalCourseWarning,
      v.local.nav.toggleWrapper,
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
  const prevBtn = Object.assign(document.createElement("a"), {
    className: "lesson-btn prev",
    rel: "prev",
    role: "button",
    href: prevHref,
    textContent: "← Previous",
    title: prevTitle,
  });
  if (prevTrack) prevBtn.setAttribute("data-track-click", prevTrack);

  const nextBtn = Object.assign(document.createElement("a"), {
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
  const btnWrapper = Object.assign(document.createElement("nav"), {
    className: "lesson-floater",
    role: "navigation",
    ariaLabel: "Lesson navigation",
  });

  btnWrapper.append(prevBtn, nextBtn);

  v.local.lesson.innerBody.append(document.createElement("hr"), btnWrapper);

  v.local.lesson.content.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((el) => {
      const codeEl = el.querySelector("code");
      const iconClone = createClone("copy");

      const copyText = codeEl.textContent
        .trim()
        .replace(/\r?\n\$ /g, " && ")
        .replace(/^\$ /g, "");

      const container = Object.assign(document.createElement("div"), {
        style: `display: flex; justify-content: end; border-bottom: 1px solid gainsboro; padding: 12px 24px;`,
      });

      // create 'copied' tooltip
      const tooltipContainer = Object.assign(document.createElement("div"), {
        textContent: "Copied",
        style: `position: absolute; top: -24px; right: 10px; text-shadow: none; background-color: var(--answer-option); color: var(--primary-white-hex); padding: 5px 10px; border-radius: 4px; opacity: 0; transition: opacity .2s ease-in;`,
      });

      // add elements
      container.append(iconClone);
      el.append(tooltipContainer);
      el.prepend(container);

      // add event listener to cloned icon to copy block into clipboard
      iconClone.addEventListener(
        "click",
        toClipboard(copyText, tooltipContainer)
      );

      // Mark that copy icon was added to this code block
      el.dataset.copyAdded = "true";
    });

  // Make section titles normal h3 elements
  Array.from(document.querySelectorAll("h3.sjwc-section-title")).map((el) =>
    el.classList.remove("sjwc-section-title")
  );

  if (typeof resources !== "undefined") {
    const numBoxes = v.local.lesson.content.resources.boxes.length;

    if (typeof resources.resources !== "undefined" && numBoxes === 0) {
      console.info(
        "No resource boxes found to add resources to. Adding automatically!"
      );
      const box = Object.assign(document.createElement("div"), {
        className: "resource-box",
      });
      const header = Object.assign(document.createElement("h3"), {
        textContent: "📘 More Resources",
      });
      const wrapper = Object.assign(document.createElement("div"), {
        className: "resource-wrapper",
      });

      box.append(header, wrapper);
      v.local.lesson.body.append(box);
    }

    if (v.local.lesson.content.resources && typeof resources !== "undefined") {
      if (typeof resources.resources !== "undefined" && numBoxes === 1) {
        // we have a list of resources and will drop that in the first box
        const cards = resources.resources.map((r) => createResourceCard(r));

        const box = v.local.lesson.content.resources.boxes[0];

        const wrapper = box.querySelector(".resource-wrapper");

        // Clear existing content
        wrapper.innerHTML = "";

        // Add cards
        wrapper.append(...cards);
      } else if (typeof resources.groups !== "undefined") {
        // we have groups of resources to drop in each box
        v.local.lesson.content.resources.boxes.forEach((box) => {
          if (!box.dataset.group) {
            console.warn(
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
  log("Running styleAuth");

  v.local = {
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

  if (page.isLogin) {
    v.local.loginText.textContent = "Log In";
    v.local.signupTabTextSpan.textContent = "Sign Up";
    v.local.altMethod.textContent = "Or Log In With";
    v.local.loginBtn.textContent = "Log In";
    v.local.googleBtn.textContent = "Continue with Google";

    v.local.loginForm.append(v.local.termsAndServices);
  } else {
    v.local.loginTabTextSpan.textContent = "Log In";
    v.local.signupTabText.textContent = "Sign Up";
    v.local.altMethod.textContent = "Or Sign Up With";
    v.local.fNameLabel.textContent = "First Name";
    v.local.googleBtn.textContent = "Continue with Google";
    v.local.lNameLabel.textContent = "Last Name";
    v.local.signupBtnText.textContent = "Sign Up";
    v.local.passwordConfirm.textContent = "Password Confirm";
    v.local.emailLabel.textContent = "Work Email";
    v.local.inputs.email.placeholder = "Work Email";
    v.local.inputs.password2.placeholder = "Password Confirm";

    v.local.signupForm.append(v.local.termsAndServices);
  }

  // hide existing login content
  hide([
    document.querySelector(".white-bg"),
    document.querySelector("#login-content"),
  ]);

  const authContainer = Object.assign(document.createElement("div"), {
    id: "auth-container",
    style: "flex-grow: 1; min-height: 100vh;",
  });

  // create new auth card
  const authCard = Object.assign(document.createElement("div"), {
    className: "auth-card",
  });

  // append existing elements to it
  const form = page.isLogin ? v.local.loginForm : v.local.signupForm;
  const orSignUpWith = page.isLogin
    ? document.querySelector(".sj-text-sign-in-with")
    : document.querySelector(".sj-text-sign-up-with");

  authCard.append(
    ...[form, orSignUpWith, v.local.googleBtn, v.local.termsAndServices]
  );

  authContainer.append(...[document.querySelector("#tabs"), authCard]);

  document
    .querySelector("#skilljar-content")
    .append(...[authContainer, v.global.footerContainer]);
}

function styleCurriculumPageNoCertificate() {
  log("Running styleCurriculumPageNoCertificate");

  v.local = {
    body: {
      mainContainer: document.querySelector("#cp-content"),
    },
    header: {
      mainHeadingContainer: document.querySelector(".cp-summary-wrapper"),
      floaterText: document.querySelector(".sj-floater-text"),
      mainHeading: document.querySelector(".break-word"),
      courseInfo: document.querySelector(".sj-heading-paragraph"),
      ctaBtnWrapper: document.querySelector("#resume-button"),
      ctaBtn: document.querySelector("#resume-button a"),
      ctaBtnText: document.querySelector("#resume-button a span"),
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

  v.local.tabs.aboutSection?.classList.add("active");

  v.local.tabs.aboutSection.id = "aboutSection";
  v.local.tabs.curriculumSection.id = "curriculumSection";

  v.local.tabs.container.append(
    v.local.tabs.aboutSection,
    v.local.tabs.curriculumSection
  );

  const btnText = v.local.header.ctaBtnWrapper
    ? v.local.header.ctaBtnText.textContent
    : "Resume";
  const btnHref = v.local.header.ctaBtnText
    ? v.local.header.ctaBtn.getAttribute("href")
    : "resume";

  if (typeof courseDetails !== "undefined") {
    v.local.card.details ? v.local.card.details.remove() : null; // remove existing card if present
    v.local.body.mainContainer.append(
      ...[
        createCourseDetailsCard(courseDetails, {
          btnText,
          btnHref,
          completed: course.completed,
        }),
      ].filter(Boolean)
    );
    v.local.card.link = document.querySelector(".course-details-card-link"); // re-query link
  }

  // update resume button text and href (with auto-value fallback)
  if (v.local.header.ctaBtnWrapper && v.local.card.link) {
    const btnText = v.local.header.ctaBtnText.textContent || "Resume";
    const btnHref = v.local.header.ctaBtn.getAttribute("href") || "resume";

    v.local.card.link.textContent = btnText;
    v.local.card.link.href = btnHref;
  } else if (v.local.card.link) {
    log("Hiding resume button as it could not be found");
    if (!course.completed) {
      hide(v.local.card.link); // Hide resume button if it doesn't exist
    }
  }

  const curriculumElements = getCurriculumElements(
    v.local.curriculum.container
  );

  v.local.curriculum.container.innerHTML = ""; // Clear the container
  v.local.curriculum.container.append(...curriculumElements);

  v.local.header.courseInfo.textContent = skilljarCourse.short_description;

  // add a breadcrumb to a div with id "" added to .cp-summary-row-v2
  const breadcrumb = Object.assign(document.createElement("div"), {
    id: "breadcrumb",
    className: "",
  });
  renderBreadcrumbs(breadcrumb, crumbs);

  // move elements
  v.local.body.mainContainer.append(...[v.local.card.details].filter(Boolean));
  v.local.header.mainHeadingContainer.append(
    ...[
      breadcrumb,
      v.local.header.floaterText,
      v.local.header.mainHeading,
      v.local.header.courseInfo,
      v.local.header.ctaBtnWrapper,
    ].filter(Boolean)
  );
}

/**
 * This function applies desktop-specific styling to the curriculum page when a certificate is available.
 * It modifies the layout and appearance of various elements on the page.
 */
// function styleCurriculumPageHasCertificationDesktop() {
//   // TODO: Clean up this function
//   log("Running styleCurriculumPageHasCertificationDesktop");
//   const courseDescription = skilljarCourse.short_description;

//   // HEADER VARIABLES
//   const headingParagraph = document.querySelector(".sj-heading-paragraph");
//   const headingFloaterText = document.querySelector(".sj-floater-text");
//   const container = document.querySelector(".cp-summary-wrapper"); // DUPLICATE VAR
//   const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR
//   const backToCatalogLink = document.querySelector(".back-to-catalog");

//   hide(backToCatalogLink);

//   const curriculumPageHeader = document.querySelector(".top-row-grey");
//   const headerTextAndImgContainer = document.querySelector(".dp-row-flex-v2");
//   const sjHeaderTextContainer = document.querySelector(".cp-summary-wrapper");
//   const sjHeaderTextHeading = document.querySelector(".break-word");
//   const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
//   const sjHeaderTextProgressBar = document.querySelector(
//     ".progress-bar.button-border-color"
//   );
//   const certificateEl = document.querySelector(".cp-certificate");
//   const sjHeaderImgContainer = document.querySelector(
//     ".large-4.pull-8.columns.cp-promo-image-wrapper"
//   );
//   const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
//   const sjHeaderImg = document.querySelector(".cp-promo-image img");

//   // BODY VARIABLES
//   const bodyMainContainer = document.querySelector("#cp-content");
//   const innerContentContainer = bodyMainContainer.querySelector(".columns");
//   const tabsContainer = document.querySelector(".section-container.tabs");
//   let [curriculumSection, aboutSection] =
//     tabsContainer.querySelectorAll("section");

//   // STYLE LOGO
//   v.global.logo.style.height = "24px";

//   // TEST
//   if (initialLoadComplete) {
//     curriculumSection = v.global.curriculumSection;
//     aboutSection = v.global.aboutSection;
//     tabsContainer.append(curriculumSection, aboutSection);
//   }

//   const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
//   const lessonListItems = document.querySelectorAll(".lesson-row");
//   const curriculumParentContainer = document.querySelector("#curriculum-list");
//   const curriculumItemsListLIVE = new Array(
//     ...curriculumParentContainer.childNodes
//   );
//   const curriculumOutsideContainer =
//     curriculumParentContainer.closest(".content");

//   // CARD VARIABLES
//   const courseDetailsCard = document.querySelector(".course-details-card");
//   // const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
//   const courseDetailsCardLink = document.querySelector(
//     ".course-details-card-link"
//   );

//   // STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
//   bodyMainContainer.style.display = "grid";
//   bodyMainContainer.style.marginTop = "96px";
//   bodyMainContainer.style.gridTemplateColumns =
//     "minmax(100px, 760px) minmax(100px, 368px)";

//   bodyMainContainer.append(...(courseDetailsCard ? [courseDetailsCard] : []));

//   courseDetailsCard.style.margin = "96px 0 46px 0";

//   hide(courseDetailsCardLink);

//   // if (!initialLoadComplete) {
//   //   courseDetailCardListItems.forEach((li) =>
//   //     li.prepend(createClone("checkbox"))
//   //   );
//   // }

//   bodyMainContainer.style.columnGap = "24px";
//   innerContentContainer.style.width = "100%";

//   // STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
//   sjHeaderTextHeading.style.fontWeight = "600";
//   sjHeaderTextHeading.style.fontSize = "36px";
//   sjHeaderTextHeading.style.lineHeight = "43.2px";
//   sjHeaderTextHeading.style.letterSpacing = "-0.5px";
//   sjHeaderTextHeading.style.marginTop = "0";
//   hide(sjHeaderTextSubheading);
//   hide(sjHeaderTextProgressBar);

//   // STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
//   curriculumPageHeader.style.maxWidth = "none";
//   curriculumPageHeader.style.padding = "0";
//   curriculumPageHeader.style.backgroundImage =
//     "linear-gradient(315deg, var(--gradient-start), var(--gradient-end) 72%)";
//   curriculumPageHeader.style.border = "0";

//   // STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
//   // TEXT CONTAINER
//   sjHeaderTextContainer.style.position = "static";
//   sjHeaderTextContainer.style.padding = "0";
//   sjHeaderTextContainer.style.maxWidth = "564px";
//   sjHeaderTextContainer.style.border = "0";
//   sjHeaderTextContainer.style.textAlign = "left";
//   // IMG CONTAINER
//   sjHeaderImgContainer.style.position = "static";
//   sjHeaderImgContainer.style.padding = "0";
//   sjHeaderImgContainer.style.width = "564px";
//   sjHeaderImgContainer.style.height = "auto";
//   sjHeaderImgDirectContainer.style.maxHeight = "none";
//   sjHeaderImg.style.maxHeight = "none";
//   sjHeaderImg.style.height = "auto";
//   sjHeaderImg.style.maxWidth = "100%";
//   // PARENT CONTAINER
//   headerTextAndImgContainer.style.margin = "96px 0";
//   headerTextAndImgContainer.style.justifyContent = "center";
//   headerTextAndImgContainer.style.flexWrap = "nowrap";
//   headerTextAndImgContainer.style.gap = "24px";

//   // RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
//   headingParagraph.textContent = courseDescription;
//   headingParagraph.style.display = "block";
//   headingFloaterText.style.display = "block";
//   container.append(
//     ...(headingFloaterText ? [headingFloaterText] : []),
//     ...(mainHeading ? [mainHeading] : []),
//     ...(headingParagraph ? [headingParagraph] : []),
//     ...(certificateEl ? [certificateEl] : [])
//   );

//   // CURRICULUM PAGE BODY STYLING
//   tabsContainer.append(curriculumSection);
//   tabsContainer.style.margin = "0 0 46px 0";
//   bodyMainContainer.style.paddingTop = "0";
//   bodyMainContainer.style.paddingBottom = "0";
//   aboutSection.classList.add("active");
//   curriculumSection.style.marginTop = "48px";

//   aboutSection.querySelector("h3").style.fontWeight = "600";
//   hide(aboutSection.querySelector(".title"));
//   aboutSection.querySelector(".content").style.border = "0";
//   aboutSection.querySelector(".content").style.padding = "0";
//   hide(curriculumSection.querySelector(".title"));
//   curriculumSection.querySelector("h2").style.fontWeight = "600";
//   curriculumSection.querySelector(".content").style.border = "0";
//   curriculumSection.querySelector(".content").style.padding = "0";

//   /*
//   ------------------------------
//   NEW CURRICULUM DISPLAY STYLING
//   ------------------------------
//   */
//   if (!initialLoadComplete) {
//     // Set global curriculum and about section vars
//     v.global.curriculumSection = curriculumSection;
//     v.global.aboutSection = aboutSection;

//     const hasSections = curriculumParentContainer.querySelector("h3")
//       ? true
//       : false;
//     let curContainer = document.createElement("div");

//     if (!hasSections) {
//       styleGroupContainer(curContainer);
//     }

//     curriculumItemsListLIVE.forEach((el) => {
//       if (el?.tagName) {
//         el.classList.add("curriculumItem");
//       }
//     });

//     const curriculumItemsListNonLive =
//       curriculumParentContainer.querySelectorAll(".curriculumItem");

//     curriculumItemsListNonLive.forEach((el, i, curArr) => {
//       if (el.tagName === "DIV") {
//         // Yes? push curContainer into parent container
//         curriculumParentContainer.append(curContainer);
//         // Reset curContainer while pushing current new heading & icon in there for the next iteration
//         curContainer = document.createElement("div");
//         styleGroupContainer(curContainer);

//         const newGroupHeading = document.createElement("div");
//         newGroupHeading.style.display = "flex";
//         newGroupHeading.style.gap = "12px";

//         newGroupHeading.textContent =
//           el.querySelector("h3")?.textContent?.trim() || "Module";

//         styleGroupHeading(newGroupHeading);

//         curContainer.append(newGroupHeading);
//         hide(el);
//       } else {
//         // Else, normal/expected behaviour
//         // Transfer inner html of current list item to new created div
//         const isLastChild = curArr[i + 1]
//           ? curArr[i + 1].tagName === "DIV"
//           : true;

//         const newListEl = document.createElement("div");
//         styleListItem(newListEl, isLastChild, false);

//         newListEl.append(el);
//         curContainer.append(newListEl);
//       }
//     });

//     curriculumParentContainer.append(curContainer);

//     hide(curriculumOutsideContainer.querySelector("h2"));
//     hide(curriculumOutsideContainer.querySelector("hr"));
//   }

//   // CURRICULUM ITSELF STYLING
//   hide(...pageIcons);

//   lessonListItems.forEach((item) => {
//     const titleEl = item.querySelector(".title");
//     item.style.display = "flex";
//     item.style.alignItems = "center";
//     item.style.gap = "12px";

//     item.querySelector(".bullet").style.position = "static";

//     titleEl.style.position = "static";
//     titleEl.style.color = "var(--answer-option)";
//     titleEl.style.display = "flex";
//     titleEl.style.alignItems = "center";
//     titleEl.style.margin = "0";
//     titleEl.style.transform = "translateY(2px)";
//   });
// }

/**
 * This function applies mobile-specific styling to the curriculum page when a certificate is present.
 * It modifies the layout and appearance of various elements on the page.
 */
// function styleCurriculumPageHasCertificationMobile() {
//   // TODO: Clean up this function
//   log("Running styleCurriculumPageHasCertificateMobile");

//   const headingParagraph = document.querySelector(".sj-heading-paragraph");
//   const headingFloaterText = document.querySelector(".sj-floater-text");
//   const container = document.querySelector(".cp-summary-wrapper"); // DUPLICATE VAR
//   const mainHeading = document.querySelector(".break-word"); // DUPLICATE VAR
//   const backToCatalogLink = document.querySelector(".back-to-catalog");

//   hide(backToCatalogLink);

//   const curriculumPageHeader = document.querySelector(".top-row-grey");
//   const headerTextAndImgContainer = document.querySelector(".dp-row-flex-v2");
//   const sjHeaderTextContainer = document.querySelector(".cp-summary-wrapper");
//   const sjHeaderTextHeading = document.querySelector(".break-word");
//   const sjHeaderTextSubheading = document.querySelector(".cp-lessons");
//   const sjHeaderTextProgressBar = document.querySelector(
//     ".progress-bar.button-border-color"
//   );
//   const certificateEl = document.querySelector(".cp-certificate");
//   const sjHeaderImgContainer = document.querySelector(
//     ".large-4.pull-8.columns.cp-promo-image-wrapper"
//   );
//   const sjHeaderImgDirectContainer = document.querySelector(".cp-promo-image");
//   const sjHeaderImg = document.querySelector(".cp-promo-image img");

//   // BODY VARIABLES
//   const bodyMainContainer = document.querySelector("#cp-content");
//   const innerContentContainer = bodyMainContainer.querySelector(".columns");
//   const tabsContainer = document.querySelector(".section-container.tabs");
//   let [curriculumSection, aboutSection] =
//     tabsContainer.querySelectorAll("section");

//   // TEST
//   if (initialLoadComplete) {
//     curriculumSection = v.global.curriculumSection;
//     aboutSection = v.global.aboutSection;
//     tabsContainer.append(curriculumSection, aboutSection);
//   }

//   const pageIcons = document.querySelectorAll(".type-icon.hide-for-small");
//   const lessonListItems = document.querySelectorAll(".lesson-row");
//   const curriculumParentContainer = document.querySelector("#curriculum-list");
//   const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
//   const curriculumOutsideContainer =
//     curriculumParentContainer.closest(".content");

//   // CARD VARIABLES
//   const courseDetailsCard = document.querySelector(".course-details-card");
//   // const courseDetailCardListItems = courseDetailsCard.querySelectorAll("li");
//   const courseDetailsCardLink = document.querySelector(
//     ".course-details-card-link"
//   );

//   // NAV STYLING
//   v.global.logo.style.maxHeight = "48px";

//   // STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
//   bodyMainContainer.style.display = "grid";
//   bodyMainContainer.style.gridTemplateColumns = "1fr";
//   bodyMainContainer.style.width = "90%";
//   bodyMainContainer.style.columnGap = "24px";

//   courseDetailsCard.style.margin = "32px 0 56px 0";
//   courseDetailsCard.style.justifySelf = "center";
//   bodyMainContainer.append(courseDetailsCard);

//   hide(courseDetailsCardLink);

//   // if (!initialLoadComplete) {
//   //   courseDetailCardListItems.forEach((li) =>
//   //     li.prepend(createClone("checkbox"))
//   //   );
//   // }

//   innerContentContainer.style.width = "100%";

//   // STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
//   sjHeaderTextHeading.style.fontWeight = "600";
//   sjHeaderTextHeading.style.fontSize = "36px";
//   sjHeaderTextHeading.style.lineHeight = "43.2px";
//   sjHeaderTextHeading.style.letterSpacing = "-0.5px";
//   sjHeaderTextHeading.style.marginTop = "0";
//   hide(sjHeaderTextSubheading);
//   hide(sjHeaderTextProgressBar);

//   // STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
//   curriculumPageHeader.style.maxWidth = "none";
//   curriculumPageHeader.style.padding = "0";
//   curriculumPageHeader.style.backgroundImage =
//     "linear-gradient(315deg, var(--gradient-start), var(--gradient-end) 72%)";
//   curriculumPageHeader.style.border = "0";

//   // STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
//   // TEXT CONTAINER
//   sjHeaderTextContainer.style.position = "static";
//   sjHeaderTextContainer.style.padding = "0";
//   sjHeaderTextContainer.style.maxWidth = "none";
//   sjHeaderTextContainer.style.width = "100%";
//   sjHeaderTextContainer.style.marginBottom = "32px";
//   sjHeaderTextContainer.style.border = "0";
//   sjHeaderTextContainer.style.textAlign = "left";
//   // IMG CONTAINER
//   sjHeaderImgContainer.style.position = "static";
//   sjHeaderImgContainer.style.padding = "0";
//   sjHeaderImgContainer.style.width = "90%";
//   sjHeaderImgContainer.style.maxWidth = "564px";
//   sjHeaderImgContainer.style.height = "auto";
//   sjHeaderImgDirectContainer.style.maxHeight = "none";
//   sjHeaderImg.style.maxHeight = "none";
//   sjHeaderImg.style.height = "auto";
//   sjHeaderImg.style.maxWidth = "100%";
//   // PARENT CONTAINER
//   container.style.width = "90%";
//   headerTextAndImgContainer.style.margin = "96px 0";
//   headerTextAndImgContainer.style.justifyContent = "center";
//   headerTextAndImgContainer.style.flexWrap = "wrap";
//   headerTextAndImgContainer.style.gap = "24px";

//   // RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
//   headingParagraph.style.display = "block";
//   headingFloaterText.style.display = "block";
//   container.append(
//     headingFloaterText,
//     mainHeading,
//     headingParagraph,
//     certificateEl
//   );
//   // CURRICULUM PAGE BODY STYLING
//   tabsContainer.append(curriculumSection);
//   tabsContainer.style.margin = "96px 0 46px 0";
//   bodyMainContainer.style.paddingTop = "0";
//   bodyMainContainer.style.paddingBottom = "0";
//   aboutSection.classList.add("active");
//   curriculumSection.style.marginTop = "48px";

//   aboutSection.querySelector("h3").style.fontWeight = "600";
//   hide(aboutSection.querySelector(".title"));
//   aboutSection.querySelector(".content").style.border = "0";
//   aboutSection.querySelector(".content").style.padding = "0";
//   hide(curriculumSection.querySelector(".title"));
//   curriculumSection.querySelector("h2").style.fontWeight = "600";
//   curriculumSection.querySelector(".content").style.border = "0";
//   curriculumSection.querySelector(".content").style.padding = "0";

//   /*
//   ------------------------------
//   NEW CURRICULUM DISPLAY STYLING
//   ------------------------------
//   */
//   if (!initialLoadComplete) {
//     // Set global curriculum and about section vars
//     v.global.curriculumSection = curriculumSection;
//     v.global.aboutSection = aboutSection;

//     const hasSections = curriculumParentContainer.querySelector("h3")
//       ? true
//       : false;
//     let curContainer = document.createElement("div");

//     if (!hasSections) {
//       styleGroupContainer(curContainer, "g");
//     }

//     curriculumItemsListLIVE.forEach((el) => {
//       if (el?.tagName) {
//         el.classList.add("curriculumItem");
//       }
//     });

//     const curriculumItemsListNonLive =
//       curriculumParentContainer.querySelectorAll(".curriculumItem");

//     curriculumItemsListNonLive.forEach((el, i, curArr) => {
//       if (el.tagName === "DIV") {
//         // Yes? push curContainer into parent container
//         curriculumParentContainer.append(curContainer);
//         // Reset curContainer while pushing current new heading & icon in there for the next iteration
//         curContainer = document.createElement("div");
//         styleGroupContainer(curContainer);

//         const newGroupHeading = document.createElement("div");
//         newGroupHeading.style.display = "flex";
//         newGroupHeading.style.gap = "12px";

//         newGroupHeading.textContent =
//           el.querySelector("h3")?.textContent?.trim() || "Module";

//         styleGroupHeading(newGroupHeading, "c");

//         curContainer.append(newGroupHeading);
//         hide(el);
//       } else {
//         // Else, normal/expected behaviour
//         // Transfer inner html of current list item to new created div
//         const isLastChild = curArr[i + 1]
//           ? curArr[i + 1].tagName === "DIV"
//           : true;

//         const newListEl = document.createElement("div");
//         styleListItem(newListEl, isLastChild, false, "g");

//         // Styling for mobile
//         el.querySelector(".title").style.textWrap = "wrap";

//         newListEl.append(el);
//         curContainer.append(newListEl);
//       }
//     });

//     curriculumParentContainer.append(curContainer);

//     hide(curriculumOutsideContainer.querySelector("h2"));
//     hide(curriculumOutsideContainer.querySelector("hr"));
//   }

//   // CURRICULUM ITSELF STYLING
//   lessonListItems.forEach((item) => {
//     const titleEl = item.querySelector(".title");
//     item.style.display = "flex";
//     item.style.alignItems = "center";
//     item.style.gap = "12px";

//     item.querySelector(".bullet").style.position = "static";

//     titleEl.style.position = "static";
//     titleEl.style.color = "var(--answer-option)";
//     titleEl.style.display = "flex";
//     titleEl.style.alignItems = "center";
//     titleEl.style.margin = "0";
//     titleEl.style.transform = "translateY(2px)";
//   });

//   hide([...pageIcons]);
// }

/**
 * This function handles the styling of the page based on the current page type.
 * It applies different styles for landing, login, signup, course details, curriculum pages,
 * lesson pages, catalog pages, and page details.
 *
 * It also checks for the presence of a certificate and applies styles accordingly.
 */
function handlePageStyling() {
  if (page.isLogin || page.isSignup)
    // we are on the login or signup page
    return styleAuth();

  if (page.isCourseDetails)
    // we are on a course page but not logged in
    return styleCourseDetails();

  if (page.isCurriculum)
    // && !page.hasCertificate)
    // we are on a course page (without a certificate) and logged in
    return styleCurriculumPageNoCertificate();

  if (page.isPageDetail)
    // we are on the page that shows courses for a given learning path
    return stylePathCourseDetails();

  if (page.isPageCatalog)
    // we are on a learning path and registered for it
    return stylePathCatalogPage();

  if (page.isLesson)
    // we are on a lesson page
    return styleLesson();

  if (page.isCatalog || page.isLanding)
    // we are on a catalog page (not currently in use)
    return styleCatalog();

  if (page.is404)
    // we are on a 404 page
    return style404();

  // if (page.isCurriculum && page.hasCertificate)
  //   // we are on a course page (with a certificate) and logged in
  //   // n.b. this function is not edited and/or tested (and not in use)
  //   return v.viewport === "desktop"
  //     ? styleCurriculumPageHasCertificationDesktop()
  //     : styleCurriculumPageHasCertificationMobile();
}

/**
 * This function renders the course page based on the current view (desktop or mobile).
 * It checks the window width and applies appropriate styles for different page types.
 */
function render() {
  v.width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // set current view based on width
  v.viewport = v.width <= 991 ? "mobile" : "desktop";

  setStyle(v.global.footerContainer, {
    display: "flex",
    paddingLeft: v.viewport === "desktop" ? "40px" : "0",
    paddingRight: v.viewport === "desktop" ? "40px" : "0",
  });

  setStyle(v.global.footerCols, {
    width: v.viewport === "desktop" ? "270px" : "212px",
  });

  v.global.contentContainer.append(v.global.footerContainer);

  handlePageStyling();

  !page.isLesson ? hide(v.global.epFooter) : null;
}

/**
  This event is fired when the DOM is fully loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
  It is a good place to run scripts that need to manipulate the DOM or set up event listeners.
*/
document.addEventListener("DOMContentLoaded", () => {
  // hide all
  hide(v.global.body);

  // DEBUG: adding "cg-staging" for staging server
  isStaging ? v.global.body.classList.add("cg-staging") : null;

  // DEBUG: adding info box for internal users
  if (isAdmin) {
    let innerHTML = [`<p style="margin:0">
        ${page.isLanding ? "styleLanding" : ""}
        ${page.isCourseDetails ? "styleCourseDetails" : ""}
        ${page.isPageDetail ? "stylePathCourseDetails" : ""}
        ${page.isLogin ? "styleAuth" : ""}
        ${page.isSignup ? "styleAuth" : ""}
        ${
          page.isCurriculum && !page.hasCertificate
            ? "styleCurriculumPageNoCertificate"
            : ""
        }
        ${
          page.isCurriculum && page.hasCertificate
            ? "styleCurriculumPageHasCertification"
            : ""
        }
        ${page.isLesson ? "styleLesson" : ""}
        ${page.isPageCatalog ? "stylePathCatalogPage" : ""}
      </p>`];

    // Add course edit link
    if (course.id) {
      innerHTML.append(`<p style="margin:0"><a href="https://dashboard.skilljar.com/course/${course.id}/">Edit Course</a></p>`);
    }

    // Add path edit link
    if (course.path.id && DOMAIN.current) {
      innerHTML.append(`<p style="margin:0"><a href="https://dashboard.skilljar.com/publishing/domains/${DOMAIN.current.id}/published-paths/${course.path.id}/edit">Edit Path</a></p>`);
    }

    const infoBoxes = innerHTML.map((innerHTML) => Object.assign(document.createElement("div"), {
      innerHTML,
      className: "info-box",
    }));
    document.querySelector(".search-container")?.remove();

    const headerContainer = document.querySelector("#header-right");
    infoBoxes.forEach(infoBox => {
      headerContainer.insertBefore(infoBox, headerContainer.firstChild);
    });
  } else {
    document.querySelector(".search-container")?.remove();
  }

  // render + set initalLoadComplete
  render();
  // initialLoadComplete = true;

  // show all
  setStyle(v.global.body, { display: undefined });
});

/* 
  This event is fired when the entire page is fully loaded, including all dependent resources such as stylesheets and images.
  It is a good place to run scripts that need to ensure all resources are available before executing.
*/
// window.addEventListener("resize", () => {
//   // no need to re-apply styles on resize for the following pages
//   if (page.isLanding) return;
//   if (page.isCourseDetails) return;
//   if (page.isPageDetail) return;
//   if (page.isLogin) return;
//   if (page.isSignup) return;
//   if (page.isCurriculum) return; // && !page.hasCertificate) return;
//   if (page.isLesson) return;
//   if (page.isPageCatalog) return;

//   render();
// });

// Make header white on scroll
// if (!page.isLesson) {
//   $(document).ready(function () {
//     v.global.scroll_pos = 0;
//     $(document).scroll(function () {
//       v.global.scroll_pos = $(this).scrollTop();
//       if (v.global.scroll_pos > 60) {
//         setStyle(document.querySelector("header"), {
//           backgroundColor: "white !important",
//         });
//       } else {
//         setStyle(document.querySelector("header"), {
//           backgroundColor: "transparent !important",
//         });
//       }
//     });
//   });
// }

/**
 * Inject overlay HTML once
 */
function ensureCompletionPopup() {
  let el = document.getElementById("completion-popup");
  if (el) return el;

  el = Object.assign(document.createElement("div"), {
    id: "completion-popup",
    role: "dialog",
    "aria-modal": "true",
    "aria-hidden": "true",
  });

  el.addEventListener("click", () => hideCompletion(el));

  const content = Object.assign(document.createElement("div"), {
    id: "completion-content",
  });
  const card = Object.assign(document.createElement("div"), {
    id: "completion-card",
    tabIndex: -1,
  });
  const h1 = Object.assign(document.createElement("h1"), {
    id: "completion-title",
    textContent: `Hooray! You finished ${
      course?.title ? course?.title : "the course!"
    }`,
  });
  const p = Object.assign(document.createElement("p"), {
    id: "completion-sub",
    textContent: "Seriously, nice work!",
  });
  const notice = Object.assign(document.createElement("p"), {
    id: "completion-notice",
    innerHTML: `You can close this popup by clicking outside of it or press ESC to dismiss. It will also disappear automatically in <span id="completion-countdown">${
      AUTOHIDE_COMPLETION / 1000
    }</span> seconds.`,
  });

  card.append(h1, p, notice);
  content.append(card);
  el.append(content);
  document.body.appendChild(el);

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.getAttribute("aria-hidden") === "false")
      hideCompletion(el);
  });

  return el;
}

/**
 * Show / hide with fade
 */
function showCompletion(el) {
  el.setAttribute("aria-hidden", "false");
  setStyle(el, { display: "block" });
  // Next paint to trigger transition
  requestAnimationFrame(() => setStyle(el, { opacity: "1" }));
  // focus for accessibility
  const focusTarget = el.querySelector("#completion-card");
  if (focusTarget) focusTarget.focus({ preventScroll: true });

  const countdownEl = el.querySelector("#completion-countdown");
  if (countdownEl) {
    let remaining = AUTOHIDE_COMPLETION / 1000;
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

function hideCompletion(el) {
  setStyle(el, { opacity: "0" });
  const finish = () => {
    el.setAttribute("aria-hidden", "true");
    setStyle(el, { display: "none" });
    el.removeEventListener("transitionend", finish);
  };
  el.addEventListener("transitionend", finish);
  // Safety timeout in case transitionend doesn’t fire
  setTimeout(finish, 300);
}

/**
 * Public trigger (call this from Skilljar when course completes)
 * Example usage:
 *   window.animateCompletion();
 */
window.animateCompletion = function animateCompletion() {
  const el = ensureCompletionPopup();
  showCompletion(el);

  // Confetti bursts
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);

  // Auto-hide
  setTimeout(() => hideCompletion(el), AUTOHIDE_COMPLETION);
};

function shoot() {
  confetti({
    ...confettiDefaults,
    particleCount: particles.stars.counts,
    scalar: particles.stars.scalar,
    shapes: ["star"],
  });
  confetti({
    ...confettiDefaults,
    particleCount: particles.circles.counts,
    scalar: particles.circles.scalar,
    shapes: ["circle"],
  });
  confetti({
    ...confettiDefaults,
    particleCount: particles.logos.counts,
    scalar: particles.logos.scalar,
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
