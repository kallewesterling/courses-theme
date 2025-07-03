// This file is for our new landing page design, for testing purposes currently.

// eventually have an API generator that creates this JSON data but for now manual:

const coursesData = {
  "courses": [
    {
      "title": "Chainguard's Superstar Support",
      "description": "Skip the stress and get answers fast. You’ll learn how to navigate Chainguard’s support like a superstar and keep your supply chain secure with zero ticket anxiety.",
      "duration": "<1h",
      "lessons": 5,
      "link": "chainguards-superstar-support",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Secure or Sorry: Understanding Software Vulnerabilities",
      "description": "Learn about vulnerability management, its importance, and how to practice it effectively in the wake of major software supply chain attacks.",
      "duration": "3-5h",
      "lessons": 18,
      "link": "secure-or-sorry-understanding-software-vulnerabilities",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Chainguard Containers Crash Course",
      "description": "Quickly learn setup, registry basics, vulnerability management, and support for Chainguard Containers. Ideal for quick onboarding.",
      "duration": "<1h",
      "lessons": 6,
      "link": "chainguard-containers-crash-course",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Securing the AI/ML Supply Chain",
      "description": "Unpack the threats, tools, and standards shaping MLSecOps and secure your AI/ML software supply chain.",
      "duration": "3-5h",
      "lessons": 18,
      "link": "securing-the-aiml-supply-chain",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Containers! Containers! Containers!",
      "description": "Go deep with your Chainguard Containers skills!",
      "duration": "<2h",
      "lessons": 9,
      "link": "containers-containers-containers",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Foundations of Software Supply Chain Security",
      "description": "Key concepts in supply chain security: vulnerabilities, SBOMs, scanning, code signing, and provenance.",
      "duration": "1-2h",
      "lessons": 7,
      "link": "foundations-of-software-supply-chain-security",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Migration Guidance",
      "description": "Guidance on migrating to Chainguard Containers, handling missing dependencies, and testing.",
      "duration": "<1h",
      "lessons": 3,
      "link": "migration-guidance",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Registry Rockstar",
      "description": "Administer the Chainguard Registry: manage user access, configure identity providers, ingest images, and utilize Chainguard Events.",
      "duration": "<1h",
      "lessons": 4,
      "link": "registry-rockstar",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Crush Your CVEs",
      "description": "Understand and manage CVEs to secure your software effectively.",
      "duration": "<1h",
      "lessons": 5,
      "link": "crush-your-cves",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Getting Started With Chainguard Containers",
      "description": "Set up, manage, scan, and update Chainguard Containers securely and efficiently.",
      "duration": "<2h",
      "lessons": 8,
      "link": "getting-started-with-chainguard-containers",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Build Your First Chainguard Container",
      "description": "Learn to build, test, and submit your first Chainguard container image.",
      "duration": "2h, excluding dev tool set up",
      "lessons": 9,
      "link": "build-your-first-chainguard-container",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Painless Vulnerability Management",
      "description": "Detailed overview of vulnerability management practices to protect your software supply chain.",
      "duration": "3-5h",
      "lessons": 18,
      "link": "painless-vulnerability-management",
      "image": "https://placehold.co/600x400"
    }
  ],
  learningPaths: [
    {
      "title": "Chainguard Vulnslayer",
      "description": "Earners of this badge understand the fundamentals of vulnerability management, its tools, and best practices.",
      "link": "chainguard-vulnslayer",
      "image": "https://placehold.co/600x400"
    },
    {
      "title": "Complete Guide To Chainguard Containers",
      "description": "New To Chainguard Containers? Learn how to implement, manage, and get the most out of Chainguard Containers. This learning path covers everything you need to secure your software supply chain and keep your systems free from known vulnerabilities. Complete all courses to earn a badge!",
      "link": "linkys-guide-to-chainguard-images",
      "image": "https://placehold.co/600x400"
    }
  ],
  featuredCourses: [
    "chainguards-superstar-support",
    "secure-or-sorry-understanding-software-vulnerabilities",
    "chainguard-containers-crash-course",
  ],
  featuredLearningPaths: [
    "chainguard-vulnslayer",
    "linkys-guide-to-chainguard-images"
  ],
  quickStartCourses: [
    "getting-started-with-chainguard-containers",
    "build-your-first-chainguard-container",
    "crush-your-cves"
  ],
  aiCourses: [
    "securing-the-aiml-supply-chain"
  ]
};

const elems = {
    collections: {}
};

const generateCard = (title, image, description, link, alt) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardImage = document.createElement("img");
    cardImage.src = image ? image : "https://placehold.co/600x400";
    cardImage.alt = alt ? alt : "Course Image";

    const cardTitle = document.createElement("h3");
    cardTitle.textContent = title ? title : "Course Title";

    const cardDescription = document.createElement("p");
    cardDescription.textContent = description ? description : "Short description of the course.";

    const cardLink = document.createElement("a");
    cardLink.href = link ? link : "#";
    cardLink.textContent = "Learn More";
    cardLink.classList.add("button", "button-secondary");

    card.append(cardImage, cardTitle, cardDescription, cardLink);
    
    return card;
}

const createButton = (text, href, primary = true) => {
    const button = document.createElement("a");
    button.textContent = text;
    button.href = href;
    button.classList.add("button");
    if (primary) {
        button.classList.add("button-primary");
    } else {
        button.classList.add("button-secondary");
    }
    return button;
}

const createHeaderContent = (title, subtitle, classes) => {
    const headerTitle = document.createElement("h1");
    headerTitle.textContent = title;
    headerTitle.classList.add("title");
    headerTitle.classList.add(...classes);
    const headerSubtitle = document.createElement("h2");
    headerSubtitle.textContent = subtitle;
    headerSubtitle.classList.add("subtitle");
    headerSubtitle.classList.add(...classes);
    return [headerTitle, headerSubtitle];
}

const createHeaders = (title, subtitle, wrap=true, classes=[]) => {
    if (wrap) {
        const headerWrapper = document.createElement("div");
        headerWrapper.classList.add("header-wrapper");
        headerWrapper.append(...createHeaderContent(title, subtitle, classes));
        return headerWrapper;
    } else {
        return createHeaderContent(title, subtitle, classes);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.info("Landing 2.0 script loaded");
    
    document.querySelector("body").classList.add("cg-v2");
    
    elems.header = document.querySelector(".page-content-block.html-content-block[data-index='0']");

    // create new header content
    const headers = createHeaders("Level Up Your Security Smarts", "Short, clear courses to boost your software security knowledge and badges you'll actually want to earn. Built for busy tech professionals.", false)
    
    // create call to action buttons
    const buttons = [
        createButton("Start with the fundamentals", "https://courses.securityjourney.com/", true),
        createButton("Explore our full catalog", "https://courses.securityjourney.com/collections", false)
    ];
    
    // append new content to header
    elems.header.innerHTML = ""; // clear existing content
    elems.header.append(...headers);
    elems.header.append(...buttons);

    const rows = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
    ];
    rows.forEach(row => row.classList.add("row"));

    // creating the rows

    //rows[0] = featuredCourses 
    rows[0].classList.add("featured-courses");
    const featuredCourseHeaders = createHeaders("Featured Courses", "A collection of our newest releases and recommended courses to get you started on your security journey.", false);
    const featuredCourses = coursesData.featuredCourses.map(courseId => {
        const course = coursesData.courses.find(c => c.link === courseId);
        return generateCard(course.title, course.image, course.description, `/${course.link}`, "Featured Course Image");
    });
    rows[0].append(...[...featuredCourseHeaders, ...featuredCourses]);

    //rows[1] = featuredLearningPaths
    rows[1].classList.add("featured-learning-paths");
    const featuredLearningPathHeaders = createHeaders("Featured Learning Paths", "Explore our curated learning paths designed to take you from beginner to advanced in various security domains. They also give you a badge when you complete them, which you can add to your LinkedIn profile.", false);
    const featuredLearningPaths = coursesData.featuredLearningPaths.map(pathId => {
        const path = coursesData.learningPaths.find(p => p.link === pathId);
        return generateCard(path.title, path.image, path.description, `/${path.link}`, "Featured Learning Path Image");
    });
    rows[1].append(...[...featuredLearningPathHeaders, ...featuredLearningPaths]);

    //rows[2] = quickStartCourses
    rows[2].classList.add("quick-start-courses");
    const quickStartHeaders = createHeaders("Chainguard Quick Start", "Get started with Chainguard's secure software supply chain tools. This course covers the basics of using Chainguard Enforce, a tool that helps you ensure your software supply chain is secure and compliant.", false);
    const quickStartCourses = coursesData.quickStartCourses.map(courseId => {
        const course = coursesData.courses.find(c => c.link === courseId);
        return generateCard(course.title, course.image, course.description, `/${course.link}`, "Quick Start Course Image");
    });
    rows[2].append(...[...quickStartHeaders, ...quickStartCourses]);

    //rows[3] = aiCourses
    rows[3].classList.add("ai-courses");
    const aiCourseHeaders = createHeaders("Artificial Intelligence Security", "Learn how to secure AI systems and applications. Our AI focused courses cover topics like secure AI development, AI threat modeling, and AI risk management.", false);
    const aiCourses = coursesData.aiCourses.map(courseId => {
        const course = coursesData.courses.find(c => c.link === courseId);
        return generateCard(course.title, course.image, course.description, `/${course.link}`, "AI Course Image");
    });
    rows[3].append(...[...aiCourseHeaders, ...aiCourses]);

    // append all rows to the main content area
    [...document.querySelectorAll(".tile-content-block")].forEach(elem => elem.remove())
    document.querySelector("#skilljar-content").append(...rows);
});

/*

Featured Courses
A collection of our newest releases and recommended courses to get you started on your security journey.
generateCard();

Featured Learning Paths
Explore our curated learning paths designed to take you from beginner to advanced in various security domains.
They also give you a badge when you complete them, which you can add to your LinkedIn profile.

Chainguard Quick Start
Get started with Chainguard's secure software supply chain tools. This course covers the basics of using Chainguard Enforce, a tool that helps you ensure your software supply chain is secure and compliant.

Artificial Intelligence Security
Learn how to secure AI systems and applications. Our AI focused courses cover topics like secure AI development, AI threat modeling, and AI risk management.

*/