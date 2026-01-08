/**
 * This function applies styling to the 404 error page.
 * @returns {void}
 */
function notFoundView() {
  if (CG.page.isPartner404 && !CG.env.isLoggedIn) {
    Q(".message").append(
      ...[
        el("hr"),
        el("p", {
          classList: "sj-text-page-not-found-explanation",
          innerHTML: CG.data.partnerErrorMessage,
        }),
      ]
    );

    window.location.replace(
      `/auth/login?next=${encodeURIComponent(window.location.pathname)}`
    );
  }
}

/**
 * This function applies styling to the authentication (login/signup) pages.
 * @returns {void}
 */
function authView() {
  CG.dom.local.auth = {
      rows: [],

      inputs: {
        email: Q("#id_email") || Q("#id_login"),
        password: Q("#id_password") || Q("#id_password1"),

        // signup specific
        password2: Q("#id_password2"),
        fName: Q("#id_first_name"),
        lName: Q("#id_last_name"),
        accessCode: Q("#id_access_code"),
      },

      // login specific
      forgotPasswordLink: Q("a.forgot-password"),

      labels: {
        passwordConfirm: Q("label[for=id_password2] .input-label-text span"),
        fName: Q("label[for=id_first_name] span span"),
        lName: Q("label[for=id_last_name] span span"),
        email: Q("label[for=id_email]") || Q("label[for=id_login]"),
        accessCode: Q("label[for=id_access_code] span span"),
      },

      google: Q("#google_login"),
      TOS: Q("#access-message"),
      form: Q("#login_form") || Q("#signup_form"),
      btn: Q("#button-sign-in") || Q("#button-sign-up"),
      method: Q(".sj-text-sign-in-with") || Q(".sj-text-sign-up-with"),
      login: Q("#login-tab-left a span") || Q("#login-tab-left span span"),
      signup: Q("#login-tab-right a") || Q("#login-tab-right span"),

      get altMethod() {
        return Q("span", CG.dom.auth.method);
      },
    };
    
  text(CG.dom.local.auth.login, "Log In");
  text(CG.dom.local.auth.signup, "Sign Up");
  text(CG.dom.local.auth.google, "Continue with Google");
  text(CG.dom.local.auth.btn, CG.page.isLogin ? "Log In" : "Sign Up");
  text(CG.dom.local.auth.labels.email, "Work Email");

  placeholder(CG.dom.local.auth.inputs.email, "Work Email");

  if (CG.page.isSignup) {
    text(CG.dom.local.auth.labels.fName, "First Name");
    text(CG.dom.local.auth.labels.lName, "Last Name");
    placeholder(CG.dom.local.auth.inputs.fName, "First Name");
    placeholder(CG.dom.local.auth.inputs.lName, "Last Name");
    placeholder(CG.dom.local.auth.inputs.password2, "Password Confirm");
    text(CG.dom.local.auth.labels.passwordConfirm, "Password Confirm");
    text(CG.dom.local.auth.labels.accessCode, "Access Code (optional)");
  }

  const authContainer = el("div", { id: "auth-container" }, [
    Q("#tabs"),
    el("div", { className: "auth-card" }, [
      CG.dom.local.auth.form,
      el("div", { className: "divider" }, [el("span", { textContent: "or" })]),
      CG.dom.local.auth.google,
      CG.dom.local.auth.TOS,
    ]),
  ]);

  CG.dom.contentContainer.append(authContainer);

  // move "Forgot Password?" to after Password
  if (CG.page.isLogin && CG.dom.local.auth.inputs.password)
    CG.dom.local.auth.inputs.password.parentElement.append(
      CG.dom.local.auth.forgotPasswordLink
    );

  if (CG.page.isSignup) {
    // add aria-labels to inputs' parent .row elements
    A("input").forEach((elem) => {
      if (!elem.getAttribute("id")) return;

      CG.dom.local.auth.rows[elem.getAttribute("id")] = elem.closest(".row");
      CG.dom.local.auth.rows[elem.getAttribute("id")].setAttribute(
        "aria-label",
        elem.getAttribute("id")
      );
    });

    // move Access Code field to after Password Confirm
    CG.dom.local.auth.rows.id_password2.insertAdjacentElement(
      "afterend",
      CG.dom.local.auth.rows.id_access_code
    );

    // add focus listeners to fade in labels
    CG.dom.local.auth.inputs.accessCode.addEventListener("focus", () => {
      setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "1" });
    });

    CG.dom.local.auth.inputs.accessCode.addEventListener("blur", () => {
      if (CG.dom.local.auth.inputs.accessCode.value === "") {
        setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
      }
    });

    setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
  }

  remove(CG.dom.local.auth.method);
}

/**
 * This function applies styling to a catalog page (landing page only, regardless
 * of whether the user is logged in; and Learning Path catalog pages, if the user is logged in).
 * @returns {void}
 */
function catalogView() {
  CG.dom.body.prepend(el("div", { id: "cg-bg" }));
  CG.data.sections = pathSections[skilljarCatalogPage.slug]; // ex. "partners"

  if (!CG.data.sections) CG.data.sections = pathSections["home"];

  if (!pathSections[skilljarCatalogPage.slug] && !CG.page.isLanding)
    logger.warn("Could not determine catalog section name, defaulting to home");

  // hide existing content
  hide(Q("#catalog-content"));

  // remove search functionality
  remove([".catalog-left-nav", "#left-nav-button", ".back-to-catalog"]);

  // create new sections
  makeSections(CG.data.sections, "#skilljar-content", CG.state.baseURL);

  CG.dom.contentContainer.append(
    el("div", { className: "full-width", id: "cta-bottom" }, [
      createClone("chainguard", { width: "83", height: "72" }),
      el("h2", { text: "Want to learn more about Chainguard?" }),
      el("div", {}, [
        el(
          "a",
          {
            href: getCorrectURL("https://www.chainguard.dev/contact"),
            className: "button white",
            text: "Contact Us",
          },
          [createClone("rightArrow")]
        ),
        createClone("chainguard", { width: "83", height: "72" }),
      ]),
    ])
  );
}

/**
 * This function applies styling to the course details page when the user is
 * not logged in or logged in but not registered for the course.
 * @returns {void}
 */
function courseUnregisteredView() {
  CG.dom.local = {
    card: Q(".course-card"),
  };

  // Add course order
  let courseInfo = CG.dom.header.courseInfo || CG.el.headingParagraph;

  [...courseInfo.children]
    .filter((elem) => elem.textContent.search(/Course \d+ of \d+ in/) !== -1)
    .forEach((elem) => elem.classList.add("course-order"));

  // Add path registration info
  [...courseInfo.children]
    .filter(
      (elem) =>
        elem.textContent.search(
          /Register for the learning path to register for this course/
        ) !== -1
    )
    .forEach((elem) => elem.classList.add("path-registration"));

  CG.data.card =
    typeof courseDetails !== "undefined"
      ? createCourseDetailsCard(courseDetails, {
          btnText: CG.dom.header.ctaBtnWrapper
            ? CG.dom.header.registerBtn.textContent
            : "Register for Learning Path",
          btnHref: CG.dom.header.href,
          completed: CG.state.course.completed,
        })
      : CG.dom.local.card;

  // remove existing card if present
  CG.dom.local.card ? CG.dom.local.card.remove() : null;
  CG.dom.courseContainer.append(...[CG.data.card].filter(Boolean));

  // process curriculum elements
  try {
    CG.data.curriculumElements = getCurriculumElements();
    CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);
  } catch (error) {
    logger.error("Error processing curriculum elements:", error);
  }
}

/**
 * This function applies styling to the course details page when the user is
 * logged in and registered for the course.
 * @returns {void}
 */
function courseRegisteredView() {
  CG.dom.local = {
    card: {
      details: Q(".course-card"),
      link: Q(".course-card a"),
    },
    tabs: {
      container: Q(".tabs"),

      get curriculumSection() {
        return (
          Q("section #curriculum-section", this.container) ||
          Q("section:nth-child(1)", this.container)
        );
      },

      get aboutSection() {
        return (
          Q("section #about-section", this.container) ||
          Q("section:nth-child(2)", this.container)
        );
      },
    },
  };

  CG.dom.local.tabs.aboutSection?.classList.add("active");

  CG.dom.local.tabs.container.append(
    Object.assign(CG.dom.local.tabs.aboutSection, { id: "about-section" }),
    Object.assign(CG.dom.local.tabs.curriculumSection, { id: "curriculum-section" })
  );

  if (typeof courseDetails !== "undefined") {
    CG.dom.local.card.details ? CG.dom.local.card.details.remove() : null; // remove existing card if present
    CG.dom.courseContainer.append(
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

    // re-query link
    CG.dom.local.card.link = Q(".course-card a");
  }

  // update resume button text and href (with auto-value fallback)
  if (CG.dom.header.ctaBtnWrapper && CG.dom.local.card.link) {
    Object.assign(CG.dom.local.card.link, {
      textContent: CG.dom.header.ctaBtnText.textContent || "Resume",
      href: CG.dom.header.ctaBtn.getAttribute("href") || "resume",
    });
  } else if (CG.dom.local.card.link && !CG.state.course.completed) {
    logger.warn("Hiding resume button as it could not be found");
    hide(CG.dom.local.card.link); // Hide resume button if it doesn't exist
  }

  CG.data.curriculumElements = getCurriculumElements();
  CG.dom.curriculumContainer.replaceChildren(...CG.data.curriculumElements);

  // move elements
  CG.dom.courseContainer.append(...[CG.dom.local.card.details].filter(Boolean));
}

/**
 * This function applies styling to the Learning Path details page, when
 * the user is logged out or logged in but not registered for the Learning Path.
 * @returns {void}
 */
function pathUnregisteredView() {
  // make path sections
  tryPathSections();
}

/**
 * This function applies styling to the Learning Path details page, when
 * the user is logged in and registered for the Learning Path.
 * @returns {void}
 */
function pathRegisteredView() {
  hide([
    ".path-curriculum-resume-wrapper",
    "#path-curriculum-progress-bar-annotation",
    "#path-curriculum-progress-bar",
  ]);

  const topRow = el(
    "div",
    {
      className:
        "top-row-grey top-row-white-v2 padding-top padding-side row-v2",
    },
    [
      el("div", { className: "row dp-row-flex-v2" }, [
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
            Q(".path-curriculum-button-wrapper a"),
          ]
        ),
      ]),
    ]
  );

  const detailsBundle = el("div", { id: "dp-details-bundle" }, [
    el("div", { className: "row padding-side" }, [
      el("div", { className: "columns" }, [
        el("div", { className: "dp-long-description" }, [
          el("p", {
            innerHTML: skilljarCourseSeries.long_description_html,
          }),
        ]),
      ]),
    ]),
  ]);

  // prepend topRow and detailsBundle to content
  CG.dom.contentContainer.prepend(...[topRow, detailsBundle].filter(Boolean));

  // make path sections
  tryPathSections();
}

/**
 * This function applies styling to the lesson page.
 * @returns {void}
 */
function lessonView() {
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
        internalCourseWarning: Q("#internal-course-warning"),
        links: A("sjwc-lesson-content-item a"),
        resources: {
          boxes: A("sjwc-lesson-content-item .resource-box"),
          wrapper: Q(
            "sjwc-lesson-content-item .resource-box .resource-wrapper"
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
    ].filter(Boolean)
  );

  CG.dom.local.nav.toggleWrapper.append(setupLessonNav());

  CG.dom.local.lesson.content.codeBlocks
    .filter((d) => !d.dataset.noCopy && !d.dataset.copyAdded)
    .forEach((elem) => processCodeBlock(elem));

  // Make section titles normal h3 elements
  Array.from(A("h3.sjwc-section-title")).map((elem) =>
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

        const wrapper = Q(".resource-wrapper", box);

        // Add cards
        wrapper.replaceChildren(...cards);
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