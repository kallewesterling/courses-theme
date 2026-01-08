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
          isPath: true,
          isCourse: false,
          hasBadge: true,
          icon: "burger",
          title: "Painless Vulnerability Management",
          slug: "path/painless-vulnerability-management",
          description:
            "Learn how to manage vulnerabilities effectively using Chainguard's tools and best practices.",
        },
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
