export const pathSections = {
  home: [
    {
      internalSection: true,
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
        {
          adminOnly: true,
          isPath: true,
          isCourse: false,
          hasBadge: true,
          icon: "burger",
          title: "Painless Vulnerability Management",
          slug: "path/painless-vulnerability-management",
          description:
            "Learn how to manage vulnerabilities effectively using Chainguard's tools and best practices. Currently, this is an internal learning path as we haven't rolled it out publicly yet.",
        },
      ],
      classNames: ["internal"],
    },
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

    {
      internalSection: true,
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
    },
  ],
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
        {
          internalOnly: true,
          isPath: true,
          isCourse: false,
          hasBadge: false,
          title: "Chainguard Advanced: Partner Sales Accelerator",
          slug: "path/chainguard-advanced-partner-sales-accelerator",
          icon: "burger",
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
          icon: "bookmark",
        },
        {
          isPath: false,
          isCourse: true,
          hasBadge: false,
          title: "Getting Started with Chainguard's Console",
          slug: "getting-started-with-chainguards-console",
          description:
            "Learn how to explore, manage, and provision container images through Chainguard's Console.",
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
            "Skip the stress and get answers fast. Learn how to navigate Chainguard's support like a superstar and keep your supply chain secure with zero ticket anxiety.",
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
            "Connect your identity provider and streamline secure access to Chainguard's registry.",
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
            "Navigate Chainguard's EOL Grace Period to keep workloads secure while you plan upgrades.",
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
            "Migrate real apps from \u201cit works on Debian\u201d to minimal, secure Chainguard base images.",
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
            "Practical strategies to debug Chainguard's minimal, secure container images in Docker and Kubernetes—without breaking their security model.",
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
