const debug = (msg, level = 'log') => {
  if (location.hostname.indexOf('skilljar')) {
    if (level === 'log') {
      console.log(msg);
    }
  }
};

let globalCurriculumSection, globalAboutSection;

const view = {
  isCurriculumPage: document.querySelector('.sj-page-curriculum')
    ? true
    : false,
  isLessonsPage: document.querySelector('.sj-page-lesson') ? true : false,
  isPageDetailPath: document.querySelector(
    '.sj-page-detail.sj-page-detail-bundle.sj-page-detail-path'
  )
    ? true
    : false,
  isPageCatalogPath: document.querySelector(
    '.sj-page-catalog.sj-page-series.sj-page-path'
  )
    ? true
    : false,
  size: 0,
  viewport: 'desktop',
  loaded: false,
};

const elems = {
  global: {
    footer: document.querySelector('#footer-container'),
  },

  catalog: {
    content: document.querySelector('#catalog-content'),
    courseContainer: document.querySelector('#catalog-courses'),
  },

  auth: {
    signupForm: document.querySelector('#signup_form'),
    loginForm: document.querySelector('#login_form'),
    termsAndServices: document.querySelector('#access-message'),
    email:
      document.querySelector('input#id_login') ||
      document.querySelector('input#id_email'),
    password: document.querySelector('input#id_password1'),
    emailLabel:
      document.querySelector('label[for="id_login"]') ||
      document.querySelector('label[for="id_email"]'),
    actionBtn:
      document.querySelector('#button-sign-in') ||
      document.querySelector('#button-sign-up'),
    formPane: document.querySelectorAll('#login-content .large-6.columns')[0],
    buttonPane: document.querySelectorAll('#login-content .large-6.columns')[1],
    googleLoginBtn: document.querySelector('#google_login'),
    googleCTA:
      document.querySelector('.sj-text-sign-in-with span') ||
      document.querySelector('.sj-text-sign-up-with span'),
    tabs: {
      loginBtn: document.querySelector('#login-tab-left'),
      signupBtn: document.querySelector('#login-tab-right'),
      loginBtnText: document.querySelector(
        '#login-tab-left .sj-text-sign-in span'
      ),
      signupBtnText:
        document.querySelector('#login-tab-right.sj-text-sign-up span') ||
        document.querySelector('a.sj-text-sign-up span'),
    },
    firstNameLabel: document.querySelector(
      'label[for="id_first_name"] span span'
    ),
    lastNameLabel: document.querySelector(
      'label[for="id_last_name"] span span'
    ),
    passwordConfirmLabel: document.querySelector("label[for='id_password2']"),
  },

  lesson: {
    codeBlocks: [],
  },
};

function styleGroupContainer(container, variation = 'gray') {
  container.style.border =
    variation === 'gray' ? '1px solid #DCDCDC' : '2px solid #3443f4';
  container.style.borderRadius = '8px';
  container.style.marginBottom = '48px';
  container.style.padding = '0';
}

function styleListItem(div, isLastChild, variation = 'gray') {
  div.style.padding = '24px';
  div.style.fontSize = '16px';
  div.style.fontWeight = '400';
  div.style.lineHeight = '150%';
  if (!isLastChild) {
    div.style.borderBottom =
      variation === 'gray' ? '1px solid #DCDCDC' : '2px solid #3443f4';
  }
}

/*
 * Handles the styling of the catalog page.
 * This function is called when the catalog page is loaded.
 */
function handleCatalogStyle() {
  if (!view.loaded) {
    debug('initCatalog called');

    // Create catalog wrapper and header
    const catalogWrapper = Object.assign(document.createElement('div'), {
      id: 'catalog-wrapper',
    });
    const header = Object.assign(document.createElement('h2'), {
      textContent: 'All Courses',
    });

    // Append header and wrapper to the catalog content
    catalogWrapper.append(header, elems.catalog.courseContainer);
    elems.catalog.content.append(catalogWrapper);

    view.loaded = true;
  }
}

/*
 * Handles the styling of the authentication page.
 * This function is called when the authentication page is loaded.
 */
function handleAuthStyle(login = true) {
  debug('handleAuthStyle called with login:', login);

  // Set the correct button texts
  elems.auth.googleLoginBtn.textContent = 'Continue with Google';
  elems.auth.tabs.loginBtnText.textContent = 'Log In';
  elems.auth.tabs.signupBtnText.textContent = 'Sign Up';

  if (login) {
    // Set the correct CTA for login
    elems.auth.googleCTA.textContent = 'Or Log In With';

    // Add the T&C text to the login form
    elems.auth.loginForm.append(elems.auth.termsAndServices);

    // Set Login button text
    elems.auth.actionBtn.textContent = 'Log In';
  } else {
    // Set the correct CTA for signup
    elems.auth.googleCTA.textContent = 'Or Sign Up With';

    // Add the T&C text to the signup form
    elems.auth.signupForm.append(elems.auth.termsAndServices);

    // Add Work Email to email signup
    Object.assign(elems.auth.email, { placeholder: 'Work Email' });

    // Set Sign Up button text
    elems.auth.actionBtn.textContent = 'Sign Up';

    // Set text labels
    elems.auth.firstNameLabel.textContent = 'First Name';
    elems.auth.lastNameLabel.textContent = 'Last Name';
    elems.auth.emailLabel.textContent = 'Work Email';
    elems.auth.passwordConfirmLabel.textContent = 'Password Confirm';

    // Set placeholders
    elems.auth.email.setAttribute('placeholder', 'Work Email');
    elems.auth.password.setAttribute('placeholder', 'Password');

    const parent = elems.auth.actionBtn.closest('.text-center');
    if (parent) {
      parent.style.textAlign = 'left';
      parent.classList.remove('text-center');
    }
  }

  view.loaded = true;
}

elems.courseDetails = {
  header: document.querySelector('.top-row-grey'),
  meta: {
    container: document.querySelector('.dp-row-flex-v2'),
    textWrapper: document.querySelector('.dp-summary-wrapper'),
    category: document.querySelector('.sj-floater-text'),
    name: document.querySelector('.break-word'),
    description: document.querySelector('.sj-course-info-wrapper h2'),
    CTA: document.querySelector('#purchase-button-wrapper-large'),
    action: document.querySelector('#purchase-button'),
  },
  card: {
    container: document.querySelectorAll('.course-details-card')[0],
    items: document.querySelectorAll('.course-details-card li'),
    link: document.querySelector('.course-details-card-link'),
  },
  info: {
    container: document.querySelector('#dp-details'),
  },
  curriculumRaw: [],
  curriculumRawHTML: [],
};

/*
 * Builds the curriculum section of the course details page.
 * It extracts sections and lessons from the existing curriculum list,
 * cleans up unnecessary elements, and appends them to the curriculum container.
 * @returns {HTMLElement} The updated curriculum container.
 */
function buildCurriculum() {
  debug('buildCurriculum called');

  // Set up variables
  let container =
      document.querySelector('ul.dp-curriculum') ||
      document.querySelector('div#curriculum-list'),
    sections = [],
    currentIndex = -1;

  // Build `sections`
  const selector =
    container.tagName === 'UL'
      ? 'li'
      : 'div.lesson-section, div.lesson-modular';

  container.querySelectorAll(selector).forEach((e) => {
    // Drop all unneeded elements
    e.querySelector('svg')?.remove();
    e.querySelector('div.type-icon')?.remove();
    e.querySelector('span.sj-lesson-time')?.remove();

    const text = e.textContent.trim(); // Extract the text content

    if (
      e.classList.contains('section') ||
      e.classList.contains('lesson-section')
    ) {
      sections.push({ header: text, lessons: [] });
      currentIndex++;
    } else {
      if (!sections.map((d) => d.lessons).includes(text))
        sections[currentIndex].lessons.push(text);
    }

    e.remove(); // Remove the element from the DOM
  });

  elems.courseDetails.curriculumRaw = sections;

  sections.forEach((section) => {
    // Set up the section item
    const li = document.createElement('li');

    // Add the section header
    const headerElem = Object.assign(document.createElement('div'), {
      textContent: section.header,
      classList: ['section'],
    });
    li.append(headerElem);

    // Add lessons to section
    section.lessons.forEach((lesson) => {
      const lessonElem = Object.assign(document.createElement('div'), {
        textContent: lesson,
        classList: ['lesson'],
      });
      li.append(lessonElem);
    });

    // Append the section to the container
    container.append(li);
  });

  let return_val = container;
  if (container.tagName !== 'UL')
    return_val = Object.assign(document.createElement('ul'), {
      id: 'curriculum-list',
      classList: ['dp-curriculum'],
      innerHTML: container.innerHTML,
    });

  elems.courseDetails.curriculumRawHTML = return_val;
  return return_val;
}

/*
 * Builds the course details card on the course details page.
 * It checks if the card container exists, appends it to the course details info container,
 * and sets the link text and href based on the action button.
 * @returns {void}
 */
function buildCourseDetailsCard() {
  if (elems.courseDetails.card.container) {
    debug('buildCourseDetailsCard called & container exists');
    // Set the card's link
    if (elems.courseDetails.card.link) {
      Object.assign(elems.courseDetails.card.link, {
        textContent: elems.courseDetails.meta.action.textContent || 'Register',
        href: elems.courseDetails.meta.action.getAttribute('href') || '#',
      });
    }

    // Add card container to the course details container
    elems.courseDetails.info.container.append(
      elems.courseDetails.card.container
    );
  }
}

/*
 * Handles the styling of the course details page.
 * This function is called when the course details page is loaded.
 * It checks if the view is loaded, and if not,
 * it styles the course details page elements,
 * builds the curriculum section,
 * and builds the course details card.
 * @returns {void}
 */
function handleCourseDetailsStyle() {
  debug('handleCourseDetailsStyle called');

  if (!view.loaded) {
    debug('view.loaded is false, styling curriculum');

    // Drop the show for small content
    document.querySelector('.row.show-for-small')?.remove();

    // Put meta elements in the right place
    elems.courseDetails.meta.textWrapper.append(
      elems.courseDetails.meta.category,
      elems.courseDetails.meta.name,
      elems.courseDetails.meta.description,
      elems.courseDetails.meta.CTA
    );

    // Fix Curriculum
    buildCurriculum();

    // Fix Course Details card
    buildCourseDetailsCard();
  }
}

function pathCourseDetailsPageStyling() {
  const backToCatalogBtn = document.querySelector('.back-to-catalog');
  const mainInfoCardContained = document.querySelector(
    '.sj-course-info-wrapper'
  );

  //SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector('.signin');
  //BODY VARIABLES
  const bodyContainer = document.querySelector('#dp-details-bundle');
  const catalogContainer = document.querySelector('#catalog-courses');

  backToCatalogBtn.style.display = 'none';
  if (signInHeaderText) {
    signInHeaderText.style.display = 'none';
  }

  elems.courseDetails.meta.container.style.flexDirection = 'row-reverse';
  elems.courseDetails.meta.container.style.flexWrap = 'nowrap';
  elems.courseDetails.meta.container.style.justifyContent = 'start';
  elems.courseDetails.meta.container.style.gap = '24px';
  elems.courseDetails.meta.container.style.maxWidth = '1188px';

  //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  elems.courseDetails.meta.textWrapper.style.border = '0';
  elems.courseDetails.meta.textWrapper.style.maxWidth = '600px';
  mainInfoCardContained.style.display = 'none';
  elems.courseDetails.meta.category.textContent = 'Learning Path';
  elems.courseDetails.meta.category.style.color = '#7AF0FE';
  elems.courseDetails.meta.category.style.display = 'block';
  elems.courseDetails.meta.category.style.marginBottom = '24px';
  elems.courseDetails.meta.name.style.color = '#fff';
  elems.courseDetails.meta.name.style.margin = '0 0 12px 0';
  elems.courseDetails.meta.name.style.fontSize = '36px';
  elems.courseDetails.meta.name.style.fontWeight = '600';
  elems.courseDetails.meta.name.style.lineHeight = '43.2px';
  elems.courseDetails.meta.name.style.letterSpacing = '-.02em';
  elems.courseDetails.meta.description.style.color = '#fff';
  elems.courseDetails.meta.description.style.display = 'block';
  elems.courseDetails.meta.description.style.margin = '0 0 24px 0';
  elems.courseDetails.meta.action.style.borderColor = '#7AF0FE';
  elems.courseDetails.meta.action.style.color = '#fff';
  elems.courseDetails.meta.textWrapper.append(
    elems.courseDetails.meta.category,
    elems.courseDetails.meta.name,
    elems.courseDetails.meta.description,
    elems.courseDetails.meta.CTA
  );

  //COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = '0';
  bodyContainer.style.margin = '96px auto 46px auto';
  bodyContainer.style.maxWidth = 'min(1152px, 90%)';
  catalogContainer.style.marginBottom = '85px';
}

function pathCatalogPageStyling() {
  const backArrowBtn = document.querySelector('.back-to-catalog');

  const mainContentContainer = document.querySelector('#catalog-content');
  const topContentContainer = mainContentContainer.querySelector(
    '.path-curriculum-resume-wrapper'
  );
  const coursesList = document
    .querySelector('#catalog-courses')
    .querySelectorAll('.coursebox-container');

  coursesList.forEach((course) => {
    //Outer border
    course.style.border = '2px solid #D0CFEE';
    course.style.borderRadius = '20px';

    //Inner border
    const innerContainer = course.querySelector('.course-overview');
    if (innerContainer) {
      innerContainer.style.borderTop = '2px solid #D0CFEE';
    }

    course.addEventListener('mouseover', () => {
      course.style.borderColor = '#3443f4';
      if (innerContainer) {
        innerContainer.style.borderColor = '#3443f4';
      }
    });
    course.addEventListener('mouseout', () => {
      course.style.borderColor = '#D0CFEE';
      if (innerContainer) {
        innerContainer.style.borderColor = '#D0CFEE';
      }
    });
  });

  //PAGE NAV STYLING
  backArrowBtn.style.display = 'none';

  //MAIN CONTENT STYLING
  mainContentContainer.style.margin = '96px auto';
  topContentContainer.style.display = 'none';
}

function desktopLessonPageStyling() {
  const leftNav = document.querySelector('#lp-left-nav');
  const mainLessonContentContainer = document.querySelector('#lp-wrapper');
  const mainLessonContentSubContainer = document.querySelector('#lp-content');
  const mainLessonInnerContainer = document.querySelector('#lesson-body');
  const mainLessonMainContainer = document.querySelector('#lesson-main');

  const lessonFooter = document.querySelector('#lp-footer');
  const navOpenIcon = document.querySelector('#left-nav-button');
  const hamburgerIcon = navOpenIcon.querySelector('.fa.fa-bars');
  const xIcon = navOpenIcon.querySelector('.fa.fa-times');

  const fullScreenBtn = document.querySelector(
    '.toggle-fullscreen.focus-link-v2 '
  );
  //LESSON BODY VARS
  const lessonInnerContainer = document.querySelector('#lesson-main-inner');
  const copyIcon = document.querySelector('.copy-icon');
  const lessonContentContainer = document.querySelector(
    'sjwc-lesson-content-item'
  );
  elems.lesson.codeBlocks = new Array(
    ...document.querySelectorAll('pre:has(code):not(.language-ansi)')
  );

  lessonInnerContainer.style.maxWidth = '712px';
  lessonInnerContainer.style.margin = '0 auto';

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  //STYLING TO ALIGN NAV ICON TO LEFT CORNER AND STICKY
  mainLessonContentContainer.style.position = 'relative';
  mainLessonContentContainer.style.display = 'flex';
  mainLessonContentContainer.style.flexDirection = 'column';
  mainLessonContentContainer.style.justifyContent = 'space-between';

  mainLessonContentSubContainer.style.height = 'auto';

  mainLessonInnerContainer.style.margin = '0';
  mainLessonInnerContainer.style.maxWidth = 'none';
  mainLessonMainContainer.style.position = 'relative';
  mainLessonMainContainer.style.zIndex = '0';
  mainLessonMainContainer.style.paddingTop = '0';

  navOpenIcon.style.position = 'sticky';
  navOpenIcon.style.top = '12px';
  navOpenIcon.style.zIndex = '1';
  hamburgerIcon.style.padding = '12px';
  xIcon.style.padding = '12px';
  navOpenIcon.style.float = 'none';
  [hamburgerIcon, xIcon].forEach((el) => {
    xIcon.style.padding = '12px';
    el.style.padding = '12px';
    el.style.border = 'none';
    el.style.borderRadius = '8px';
    el.style.background = 'rgba(255, 255, 255, .8)';
    el.style.backdropFilter = 'blur(1.5px)';
  });

  ///////////////////////////////

  lessonFooter.style.position = 'relative';
  lessonFooter.style.border = '0';
  lessonFooter.style.backgroundColor = 'transparent';

  leftNav.style.position = 'absolute';
  leftNav.style.backgroundColor = '#f9f9f9';
  leftNav.style.width = '320px';
  leftNav.style.marginBottom = '0px';

  mainLessonContentContainer.style.height = '100vh';
  mainLessonContentContainer.style.overflowY = 'auto';
  mainLessonContentContainer.style.paddingBottom = '0';

  //HIDE FULL SCREEN BUTTON
  fullScreenBtn.style.display = 'none';

  //SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector('.sj-page-lesson');

  const openIcon = document.querySelector('.fa.fa-bars');
  const searchIcon = document.querySelector('.fa.fa-search');
  const closeIcon = document.querySelector('.fa.fa-times');
  const navText = document.querySelector('.burger-text.sj-text-lessons');

  searchIcon.style.display = 'none';
  navText.style.display = 'none';

  //HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains('cbp-spmenu-open')) {
    openIcon.style.display = 'none';
  } else {
    closeIcon.style.display = 'none';
  }

  //HANDLE CLICKS
  openIcon.addEventListener('click', (e) => {
    e.target.style.display = 'none';
    closeIcon.style.display = 'inline-block';
  });
  closeIcon.addEventListener('click', (e) => {
    e.target.style.display = 'none';
    openIcon.style.display = 'inline-block';
  });

  //STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.querySelector('#curriculum-list-2');
  const backToCurriculumEl = document.querySelector('#left-nav-return-text');
  const links = lessonNavLinksContainer.querySelectorAll('a');
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll('.section-title');

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = 'Back to Course Overview';
  }

  lessonNavLinksContainer.style.paddingBottom = '32px';

  //STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector('.type-icon');
    const lessonLinkContainer = link.querySelector('.lesson-row');

    link.style.color = '#14003d';
    link.style.cursor = 'pointer';
    pageIcon.style.display = 'none';
    lessonLinkContainer.style.display = 'flex';
    lessonLinkContainer.style.flexDirection = 'row-reverse';
    lessonLinkContainer.style.justifyContent = 'space-between';
    lessonLinkContainer.style.margin = '0 12px';
    lessonLinkContainer.style.paddingLeft = '12px';
    lessonLinkContainer.style.paddingRight = '12px';
    lessonLinkContainer.style.fontSize = '14px';
    lessonLinkContainer.style.lineHeight = '20px';
  });

  //STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  sectionTitles.forEach((title) => {
    title.style.backgroundColor = 'transparent';
    title.style.padding = '12px';
    title.style.paddingLeft = '24px';
    title.style.paddingRight = '24px';
    title.style.marginTop = '12px';
    title.style.marginBottom = '12px';
    title.style.border = '0';
    title.style.fontFamily = 'Fusiona';
    title.style.fontSize = '16px';
    title.style.fontWeight = '700';
  });

  //HANDLE CODE BLOCK CUSTOM STYLING

  function animateCopiedTooltip(tooltipEl) {
    tooltipEl.style.opacity = '1';

    setTimeout(() => {
      tooltipEl.style.opacity = '0';
    }, 400);
  }

  elems.lesson.codeBlocks
    .filter((d) => !d.dataset.noCopy)
    .forEach((el) => {
      //WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
      el.style.padding = '0';
      el.style.overflow = 'visible';
      el.style.position = 'relative';
      const codeEl = el.querySelector('code');
      codeEl.setAttribute(
        'style',
        'display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%'
      );
      const copyText = codeEl.textContent.trim().replace(/^\$ /g, '');

      //CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.justifyContent = 'end';
      container.style.borderBottom = '1px solid gainsboro';
      container.style.padding = '12px 24px';

      //CLONE COPYICON EL AND ADD TO CONTAINER
      const iconClone = copyIcon.cloneNode(true);
      iconClone.style.display = 'block';
      iconClone.style.cursor = 'pointer';

      //ADD EVENT LISTENER TO CLONED ICON TO COPY CODE BLOCK INTO CLIPBOARD
      iconClone.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(copyText);
          animateCopiedTooltip(tooltipContainer);
        } catch (err) {
          console.error('Failed to copy codeblock to clipboard: ', err);
        }
      });

      container.append(iconClone);

      //CREATE 'COPIED' TOOLTIP
      const tooltipContainer = document.createElement('div');
      tooltipContainer.textContent = 'Copied';
      tooltipContainer.style.position = 'absolute';
      tooltipContainer.style.top = '-24px';
      tooltipContainer.style.right = '10px';
      tooltipContainer.style.textShadow = 'none';
      tooltipContainer.style.backgroundColor = '#1c1c1c';
      tooltipContainer.style.color = '#fff';
      tooltipContainer.style.padding = '5px 10px';
      tooltipContainer.style.borderRadius = '4px';
      tooltipContainer.style.opacity = '0';
      tooltipContainer.style.transition = 'opacity .2s ease-in';

      el.append(tooltipContainer);

      //ADD CONTAINER AS FIRST CHILD IN EL
      el.prepend(container);
    });

  //Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll('a').forEach((el) => {
    el.setAttribute('target', '_blank');
  });

  //LESSON CONTENT FOOTER
  const prevBtn = document.querySelector('.button-prev-title span');
  if (prevBtn) {
    prevBtn.style.color = '#14003d';
  }
}

function desktopCurriculumPageNoCertificateStyling() {
  // Fix Curriculum
  const curriculumUl = buildCurriculum();

  // const contents = document.querySelectorAll('section > .content');
  // contents[0].remove; // we can drop curriculum

  // const curriculumWrap = Object.assign(document.createElement('div'), {
  //   classList: 'columns sj-curriculum-wrapper large-4',
  // });

  // curriculumWrap.append(curriculumUl);

  // const aboutWrap = Object.assign(document.createElement('div'), {
  //   classList: 'columns large-7',
  // });
  // aboutWrap.append(
  //   ...new Array(...document.querySelector('section > .content').children)
  // );

  // document.querySelector('#cp-content').append(...[aboutWrap, curriculumWrap]);
  // document.querySelector('.tabs-wrapper-v2').remove();
  // document.querySelector('div#curriculum-list').remove();

  //HEADER VARIABLES
  const headingParagraph = document.querySelector('.sj-heading-paragraph');
  const container = document.querySelector('.cp-summary-wrapper'); //DUPLICATE VAR

  const sjHeaderTextContainer = document.querySelector('.cp-summary-wrapper');
  const sjHeaderImgContainer = document.querySelector(
    '.cp-promo-image-wrapper'
  );
  const sjHeaderImgDirectContainer = document.querySelector('.cp-promo-image');
  const sjHeaderImg = document.querySelector('.cp-promo-image img');
  const resumeBtn = document.querySelector('#resume-button');

  const btnText = resumeBtn
    ? resumeBtn.querySelector('.button span').textContent
    : 'Resume';
  const btnHref = resumeBtn
    ? resumeBtn.querySelector('.button').getAttribute('href')
    : '#';

  //BODY VARIABLES
  const bodyMainContainer = document.querySelector('#cp-content');
  const InnerContentContainer = bodyMainContainer.querySelector('.columns');
  const tabsContainer = document.querySelector('.section-container.tabs');
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll('section');
  const pageIcons = document.querySelectorAll('.type-icon.hide-for-small');
  const lessonListItems = document.querySelectorAll('.lesson-row');
  const curriculumParentContainer = document.querySelector('#curriculum-list');
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest('.content');

  //TEST
  if (view.loaded) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  //CARD VARIABLES
  const checkboxIcon = document.querySelector('.checkbox-icon');

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.marginTop = '96px';
  bodyMainContainer.style.gridTemplateColumns =
    'minmax(100px, 760px) minmax(100px, 368px)';
  if (elems.courseDetails.card.container) {
    elems.courseDetails.card.container.style.margin = '96px 0 46px 0';
    bodyMainContainer.append(elems.courseDetails.card.container);

    if (!resumeBtn) {
      elems.courseDetails.card.link.style.display = 'none';
    }
  }

  if (elems.courseDetails.card.link && resumeBtn) {
    elems.courseDetails.card.link.textContent = btnText;
    elems.courseDetails.card.link.setAttribute('href', btnHref);
  }

  if (!view.loaded) {
    if (elems.courseDetails.card.items) {
      elems.courseDetails.card.items.forEach((li) => {
        const checkboxClone = checkboxIcon.cloneNode(true);
        li.prepend(checkboxClone);
      });
    }
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  elems.courseDetails.meta.name.style.fontWeight = '600';
  elems.courseDetails.meta.name.style.fontSize = '36px';
  elems.courseDetails.meta.name.style.lineHeight = '43.2px';
  elems.courseDetails.meta.name.style.letterSpacing = '-0.5px';
  elems.courseDetails.meta.name.style.marginTop = '0';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  elems.courseDetails.header.style.maxWidth = 'none';
  elems.courseDetails.header.style.padding = '0';
  elems.courseDetails.header.style.backgroundColor = '#D0CFEE';
  elems.courseDetails.header.style.border = '0';

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = 'static';
  sjHeaderTextContainer.style.padding = '0';
  sjHeaderTextContainer.style.maxWidth = '564px';
  sjHeaderTextContainer.style.border = '0';
  sjHeaderTextContainer.style.textAlign = 'left';
  if (resumeBtn) {
    resumeBtn.style.marginLeft = '0';
    resumeBtn.style.marginRight = '0';
  }
  //IMG CONTAINER
  sjHeaderImgContainer.style.position = 'static';
  sjHeaderImgContainer.style.padding = '0';
  sjHeaderImgContainer.style.width = '564px';
  sjHeaderImgContainer.style.height = 'auto';
  sjHeaderImgDirectContainer.style.maxHeight = 'none';
  sjHeaderImg.style.maxHeight = 'none';
  sjHeaderImg.style.height = 'auto';
  sjHeaderImg.style.maxWidth = '100%';
  //PARENT CONTAINER
  elems.courseDetails.meta.container.style.margin = '96px 0';
  elems.courseDetails.meta.container.style.justifyContent = 'center';
  elems.courseDetails.meta.container.style.flexWrap = 'nowrap';
  elems.courseDetails.meta.container.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.textContent = skilljarCourse.short_description; // eslint-disable-line no-undef
  headingParagraph.style.display = 'block';
  elems.courseDetails.meta.category.style.display = 'block';

  if (resumeBtn) {
    container.append(
      elems.courseDetails.meta.category,
      elems.courseDetails.meta.name,
      headingParagraph,
      resumeBtn
    );
  } else {
    container.append(
      elems.courseDetails.meta.category,
      elems.courseDetails.meta.name,
      headingParagraph
    );
  }

  //CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = '0 0 46px 0';
  bodyMainContainer.style.paddingTop = '0';
  bodyMainContainer.style.paddingBottom = '0';
  if (aboutSection) {
    aboutSection.classList.add('active');
  }
  curriculumSection.style.marginTop = '48px';

  if (aboutSection) {
    aboutSection.querySelector('h3').style.fontWeight = '600';
    aboutSection.querySelector('.title').style.display = 'none';
    aboutSection.querySelector('.content').style.border = '0';
    aboutSection.querySelector('.content').style.padding = '0';
  }
  curriculumSection.querySelector('.title').style.display = 'none';
  curriculumSection.querySelector('h2').style.fontWeight = '600';
  curriculumSection.querySelector('.content').style.border = '0';
  curriculumSection.querySelector('.content').style.padding = '0';

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!view.loaded) {
    //add vars to global
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumParentContainer.querySelector('h3')
      ? true
      : false;
    let curContainer = document.createElement('div');

    if (!hasSections) {
      styleGroupContainer(curContainer, 'blue');
    }

    curriculumItemsListLIVE.forEach((el) => {
      if (el?.tagName) {
        el.classList.add('curriculumItem');
      }
    });

    const curriculumItemsListNonLive =
      curriculumParentContainer.querySelectorAll('.curriculumItem');

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === 'DIV') {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement('div');
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement('div');
        newGroupHeading.style.display = 'flex';
        newGroupHeading.style.gap = '12px';
        const groupH3Tag = document.createElement('h3');

        groupH3Tag.textContent = el.querySelector('h3').textContent;
        newGroupHeading.append(groupH3Tag);

        // styleGroupHeading(newGroupHeading, 'blue');
        // note: set as class instead

        curContainer.append(newGroupHeading);
        el.style.display = 'none';
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const div = document.createElement('div');
        styleListItem(
          div,
          curArr[i + 1] ? curArr[i + 1].tagName === 'DIV' : true
        );

        el.querySelector('.title').style.textWrap = 'wrap';

        div.append(el);
        curContainer.append(div);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector('h2').style.display = 'none';
    curriculumOutsideContainer.querySelector('hr').style.display = 'none';

    globalCurriculumSection.setAttribute(
      'style',
      'padding: 0 !important; margin-top: 48px !important;'
    );
    globalAboutSection.setAttribute('style', 'padding: 0 !important');
  }

  //CURRICULUM ITSELF STYLING
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute('style', 'display:none !important');
  });
  lessonListItems.forEach((item) => {
    const titleEl = item.querySelector('.title');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '12px';

    item.querySelector('.bullet').style.position = 'static';

    titleEl.style.position = 'static';
    titleEl.style.color = '#1C1C1C';
    titleEl.style.display = 'flex';
    titleEl.style.alignItems = 'center';
    titleEl.style.margin = '0';
    titleEl.style.transform = 'translateY(2px)';
  });

  curriculumSection.setAttribute(
    'style',
    'padding: 0 !important; margin-top: 48px !important;'
  );
  aboutSection.setAttribute('style', 'padding: 0 !important');
}

function desktopCurriculumPageYesCertificationStyling() {
  // eslint-disable-next-line no-undef
  const courseDescription = skilljarCourse.short_description;

  //HEADER VARIABLES
  const headingParagraph = document.querySelector('.sj-heading-paragraph');
  const container = document.querySelector('.cp-summary-wrapper'); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector('.back-to-catalog');

  backToCatalogLink.style.display = 'none';

  const sjHeaderTextContainer = document.querySelector('.cp-summary-wrapper');
  const certificateEl = document.querySelector('.cp-certificate');
  const sjHeaderImgContainer = document.querySelector(
    '.large-4.pull-8.columns.cp-promo-image-wrapper'
  );
  const sjHeaderImgDirectContainer = document.querySelector('.cp-promo-image');
  const sjHeaderImg = document.querySelector('.cp-promo-image img');

  //BODY VARIABLES
  const bodyMainContainer = document.querySelector('#cp-content');
  const InnerContentContainer = bodyMainContainer.querySelector('.columns');
  const tabsContainer = document.querySelector('.section-container.tabs');
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll('section');

  //TEST
  if (view.loaded) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const pageIcons = document.querySelectorAll('.type-icon.hide-for-small');
  const lessonListItems = document.querySelectorAll('.lesson-row');
  const curriculumParentContainer = document.querySelector('#curriculum-list');
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest('.content');

  //CARD VARIABLES
  const checkboxIcon = document.querySelector('.checkbox-icon');

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.marginTop = '96px';
  bodyMainContainer.style.gridTemplateColumns =
    'minmax(100px, 760px) minmax(100px, 368px)';
  if (elems.courseDetails.card.container) {
    elems.courseDetails.card.container.style.margin = '96px 0 46px 0';
    bodyMainContainer.append(elems.courseDetails.card.container);

    elems.courseDetails.card.link.style.display = 'none';
  }

  if (!view.loaded) {
    elems.courseDetails.card.items.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  elems.courseDetails.meta.name.style.fontWeight = '600';
  elems.courseDetails.meta.name.style.fontSize = '36px';
  elems.courseDetails.meta.name.style.lineHeight = '43.2px';
  elems.courseDetails.meta.name.style.letterSpacing = '-0.5px';
  elems.courseDetails.meta.name.style.marginTop = '0';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  elems.courseDetails.header.style.maxWidth = 'none';
  elems.courseDetails.header.style.padding = '0';
  elems.courseDetails.header.style.backgroundImage =
    'linear-gradient(315deg,#fde1fe,#f5f6fe 72%)';
  elems.courseDetails.header.style.border = '0';

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = 'static';
  sjHeaderTextContainer.style.padding = '0';
  sjHeaderTextContainer.style.maxWidth = '564px';
  sjHeaderTextContainer.style.border = '0';
  sjHeaderTextContainer.style.textAlign = 'left';
  //IMG CONTAINER
  sjHeaderImgContainer.style.position = 'static';
  sjHeaderImgContainer.style.padding = '0';
  sjHeaderImgContainer.style.width = '564px';
  sjHeaderImgContainer.style.height = 'auto';
  sjHeaderImgDirectContainer.style.maxHeight = 'none';
  sjHeaderImg.style.maxHeight = 'none';
  sjHeaderImg.style.height = 'auto';
  sjHeaderImg.style.maxWidth = '100%';
  //PARENT CONTAINER
  elems.courseDetails.meta.container.style.margin = '96px 0';
  elems.courseDetails.meta.container.style.justifyContent = 'center';
  elems.courseDetails.meta.container.style.flexWrap = 'nowrap';
  elems.courseDetails.meta.container.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.textContent = courseDescription;
  headingParagraph.style.display = 'block';
  elems.courseDetails.meta.category.style.display = 'block';

  container.append(
    elems.courseDetails.meta.category,
    elems.courseDetails.meta.name,
    headingParagraph,
    certificateEl
  );

  //CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = '0 0 46px 0';
  bodyMainContainer.style.paddingTop = '0';
  bodyMainContainer.style.paddingBottom = '0';
  aboutSection.classList.add('active');
  curriculumSection.style.marginTop = '48px';

  aboutSection.querySelector('h3').style.fontWeight = '600';
  aboutSection.querySelector('.title').style.display = 'none';
  aboutSection.querySelector('.content').style.border = '0';
  aboutSection.querySelector('.content').style.padding = '0';
  curriculumSection.querySelector('.title').style.display = 'none';
  curriculumSection.querySelector('h2').style.fontWeight = '600';
  curriculumSection.querySelector('.content').style.border = '0';
  curriculumSection.querySelector('.content').style.padding = '0';

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!view.loaded) {
    //set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    const hasSections = curriculumParentContainer.querySelector('h3')
      ? true
      : false;
    let curContainer = document.createElement('div');

    if (!hasSections) {
      styleGroupContainer(curContainer, 'blue');
    }

    curriculumItemsListLIVE.forEach((el) => {
      if (el?.tagName) {
        el.classList.add('curriculumItem');
      }
    });

    const curriculumItemsListNonLive =
      curriculumParentContainer.querySelectorAll('.curriculumItem');

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === 'DIV') {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement('div');
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement('div');
        newGroupHeading.style.display = 'flex';
        newGroupHeading.style.gap = '12px';
        const groupH3Tag = document.createElement('h3');

        groupH3Tag.textContent = el.querySelector('h3').textContent;
        newGroupHeading.append(groupH3Tag);

        // styleGroupHeading(newGroupHeading, 'blue');
        // note: set as class instead

        curContainer.append(newGroupHeading);
        el.style.display = 'none';
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const div = document.createElement('div');
        styleListItem(
          div,
          curArr[i + 1] ? curArr[i + 1].tagName === 'DIV' : true,
          'blue'
        );
        div.append(el);
        curContainer.append(div);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector('h2').style.display = 'none';
    curriculumOutsideContainer.querySelector('hr').style.display = 'none';
  }

  //CURRICULUM ITSELF STYLING
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute('style', 'display:none !important');
  });
  lessonListItems.forEach((item) => {
    const titleEl = item.querySelector('.title');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '12px';

    item.querySelector('.bullet').style.position = 'static';

    titleEl.style.position = 'static';
    titleEl.style.color = '#1C1C1C';
    titleEl.style.display = 'flex';
    titleEl.style.alignItems = 'center';
    titleEl.style.margin = '0';
    titleEl.style.transform = 'translateY(2px)';
  });
}

function mobileCurriculumPageNoCertificateStyling() {
  //HEADER VARIABLES
  const headingParagraph = document.querySelector('.sj-heading-paragraph');
  const container = document.querySelector('.cp-summary-wrapper'); //DUPLICATE VAR
  const btn = document.querySelector('#resume-button'); //DUPLICATE VAR

  const sjHeaderTextContainer = document.querySelector('.cp-summary-wrapper');
  const sjHeaderImgContainer = document.querySelector(
    '.large-4.pull-8.columns.cp-promo-image-wrapper'
  );
  const sjHeaderImgDirectContainer = document.querySelector('.cp-promo-image');
  const sjHeaderImg = document.querySelector('.cp-promo-image img');
  const resumeBtn = document.querySelector('#resume-button');
  const btnText = resumeBtn.querySelector('.button span').textContent;
  const btnHref = resumeBtn.querySelector('.button').getAttribute('href');

  //BODY VARIABLES
  const bodyMainContainer = document.querySelector('#cp-content');
  const InnerContentContainer = bodyMainContainer.querySelector('.columns');
  const tabsContainer = document.querySelector('.section-container.tabs');
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll('section');
  const pageIcons = document.querySelectorAll('.type-icon.hide-for-small');
  const lessonListItems = document.querySelectorAll('.lesson-row');
  const curriculumParentContainer = document.querySelector('#curriculum-list');
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest('.content');

  //TEST
  if (view.loaded) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  //CARD VARIABLES
  const checkboxIcon = document.querySelector('.checkbox-icon');

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.gridTemplateColumns = '1fr';
  bodyMainContainer.style.width = '90%';

  elems.courseDetails.card.container.style.margin = '32px 0 56px 0';
  elems.courseDetails.card.container.style.justifySelf = 'center';
  bodyMainContainer.append(elems.courseDetails.card.container);

  if (elems.courseDetails.card.link) {
    elems.courseDetails.card.link.textContent = btnText;
    elems.courseDetails.card.link.setAttribute('href', btnHref);
  }

  if (!view.loaded) {
    elems.courseDetails.card.items.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  elems.courseDetails.meta.name.style.fontWeight = '600';
  elems.courseDetails.meta.name.style.fontSize = '36px';
  elems.courseDetails.meta.name.style.lineHeight = '43.2px';
  elems.courseDetails.meta.name.style.letterSpacing = '-0.5px';
  elems.courseDetails.meta.name.style.marginTop = '0';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  elems.courseDetails.header.style.maxWidth = 'none';
  elems.courseDetails.header.style.padding = '0';
  elems.courseDetails.header.style.backgroundImage =
    'linear-gradient(315deg,#fde1fe,#f5f6fe 72%)';
  elems.courseDetails.header.style.border = '0';

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = 'static';
  sjHeaderTextContainer.style.padding = '0';
  sjHeaderTextContainer.style.maxWidth = 'none';
  sjHeaderTextContainer.style.width = '100%';
  sjHeaderTextContainer.style.marginBottom = '32px';

  sjHeaderTextContainer.style.border = '0';
  sjHeaderTextContainer.style.textAlign = 'left';
  resumeBtn.style.marginLeft = '0';
  resumeBtn.style.marginRight = '0';
  //IMG CONTAINER
  sjHeaderImgContainer.style.position = 'static';
  sjHeaderImgContainer.style.padding = '0';
  sjHeaderImgContainer.style.width = '90%';
  sjHeaderImgContainer.style.maxWidth = '564px';
  sjHeaderImgContainer.style.height = 'auto';
  sjHeaderImgDirectContainer.style.maxHeight = 'none';
  sjHeaderImg.style.maxHeight = 'none';
  sjHeaderImg.style.height = 'auto';
  sjHeaderImg.style.maxWidth = '100%';
  //PARENT CONTAINER
  container.style.width = '90%';
  elems.courseDetails.meta.container.style.margin = '96px 0';
  elems.courseDetails.meta.container.style.justifyContent = 'center';
  elems.courseDetails.meta.container.style.flexWrap = 'wrap';
  elems.courseDetails.meta.container.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.style.display = 'block';
  container.append(
    elems.courseDetails.meta.category,
    elems.courseDetails.meta.name,
    headingParagraph,
    btn
  );

  //CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = '96px 0 46px 0';
  bodyMainContainer.style.paddingTop = '0';
  bodyMainContainer.style.paddingBottom = '0';
  aboutSection.classList.add('active');
  curriculumSection.style.marginTop = '48px';

  aboutSection.querySelector('h3').style.fontWeight = '600';
  aboutSection.querySelector('.title').style.display = 'none';
  aboutSection.querySelector('.content').style.border = '0';
  aboutSection.querySelector('.content').style.padding = '0';
  curriculumSection.querySelector('.title').style.display = 'none';
  const curriculumSectionH2 = curriculumSection.querySelector('h2');
  if (curriculumSectionH2) {
    curriculumSectionH2.style.fontWeight = '600';
  }
  curriculumSection.querySelector('.content').style.border = '0';
  curriculumSection.querySelector('.content').style.padding = '0';

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!view.loaded) {
    //set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    const hasSections = curriculumParentContainer.querySelector('h3')
      ? true
      : false;
    let curContainer = document.createElement('div');

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    curriculumItemsListLIVE.forEach((el) => {
      if (el?.tagName) {
        el.classList.add('curriculumItem');
      }
    });

    const curriculumItemsListNonLive =
      curriculumParentContainer.querySelectorAll('.curriculumItem');

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === 'DIV') {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement('div');
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement('div');
        newGroupHeading.style.display = 'flex';
        newGroupHeading.style.gap = '12px';
        const groupH3Tag = document.createElement('h3');

        groupH3Tag.textContent = el.querySelector('h3').textContent;
        newGroupHeading.append(groupH3Tag);

        // styleGroupHeading(newGroupHeading);
        // note: set as class instead

        curContainer.append(newGroupHeading);
        el.style.display = 'none';
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const div = document.createElement('div');
        styleListItem(
          div,
          curArr[i + 1] ? curArr[i + 1].tagName === 'DIV' : true
        );
        //styling for mobile
        el.querySelector('.title').style.textWrap = 'wrap';

        div.append(el);
        curContainer.append(div);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector('h2').style.display = 'none';
    curriculumOutsideContainer.querySelector('hr').style.display = 'none';
  }

  //CURRICULUM ITSELF STYLING
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute('style', 'display:none !important');
  });
  lessonListItems.forEach((item) => {
    const titleEl = item.querySelector('.title');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '12px';

    item.querySelector('.bullet').style.position = 'static';

    titleEl.style.position = 'static';
    titleEl.style.color = '#1C1C1C';
    titleEl.style.display = 'flex';
    titleEl.style.alignItems = 'center';
    titleEl.style.margin = '0';
    titleEl.style.transform = 'translateY(2px)';
  });
}

function mobileCurriculumPageYesCertificateStyling() {
  //HEADER VARIABLES
  const headingParagraph = document.querySelector('.sj-heading-paragraph');
  const container = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  ); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector('.back-to-catalog');

  backToCatalogLink.style.display = 'none';

  const sjHeaderTextContainer = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  );
  const sjHeaderTextSubheading = document.querySelector('.cp-lessons');
  const sjHeaderTextProgressBar = document.querySelector(
    '.progress-bar.button-border-color'
  );
  const certificateEl = document.querySelector('.cp-certificate');
  const sjHeaderImgContainer = document.querySelector(
    '.large-4.pull-8.columns.cp-promo-image-wrapper'
  );
  const sjHeaderImgDirectContainer = document.querySelector('.cp-promo-image');
  const sjHeaderImg = document.querySelector('.cp-promo-image img');

  //BODY VARIABLES
  const bodyMainContainer = document.querySelector('#cp-content');
  const InnerContentContainer = bodyMainContainer.querySelector('.columns');
  const tabsContainer = document.querySelector('.section-container.tabs');
  let [curriculumSection, aboutSection] =
    tabsContainer.querySelectorAll('section');

  //TEST
  if (view.loaded) {
    curriculumSection = globalCurriculumSection;
    aboutSection = globalAboutSection;
    tabsContainer.append(curriculumSection, aboutSection);
  }

  const pageIcons = document.querySelectorAll('.type-icon.hide-for-small');
  const lessonListItems = document.querySelectorAll('.lesson-row');
  const curriculumParentContainer = document.querySelector('#curriculum-list');
  const curriculumItemsListLIVE = curriculumParentContainer.childNodes;
  const curriculumOutsideContainer =
    curriculumParentContainer.closest('.content');

  //CARD VARIABLES
  const checkboxIcon = document.querySelector('.checkbox-icon');

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.gridTemplateColumns = '1fr';
  bodyMainContainer.style.width = '90%';

  elems.courseDetails.card.container.style.margin = '32px 0 56px 0';
  elems.courseDetails.card.container.style.justifySelf = 'center';
  bodyMainContainer.append(elems.courseDetails.card.container);

  elems.courseDetails.card.link.style.display = 'none';

  if (!view.loaded) {
    elems.courseDetails.card.items.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  elems.courseDetails.meta.name.style.fontWeight = '600';
  elems.courseDetails.meta.name.style.fontSize = '36px';
  elems.courseDetails.meta.name.style.lineHeight = '43.2px';
  elems.courseDetails.meta.name.style.letterSpacing = '-0.5px';
  elems.courseDetails.meta.name.style.marginTop = '0';
  sjHeaderTextSubheading.style.display = 'none';
  sjHeaderTextProgressBar.style.display = 'none';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  elems.courseDetails.header.style.maxWidth = 'none';
  elems.courseDetails.header.style.padding = '0';
  elems.courseDetails.header.style.backgroundImage =
    'linear-gradient(315deg,#fde1fe,#f5f6fe 72%)';
  elems.courseDetails.header.style.border = '0';

  //STYLING OF CURRICULUM PAGE TWO HEADER CONTAINERS
  //TEXT CONTAINER
  sjHeaderTextContainer.style.position = 'static';
  sjHeaderTextContainer.style.padding = '0';
  sjHeaderTextContainer.style.maxWidth = 'none';
  sjHeaderTextContainer.style.width = '100%';
  sjHeaderTextContainer.style.marginBottom = '32px';

  sjHeaderTextContainer.style.border = '0';
  sjHeaderTextContainer.style.textAlign = 'left';

  //IMG CONTAINER
  sjHeaderImgContainer.style.position = 'static';
  sjHeaderImgContainer.style.padding = '0';
  sjHeaderImgContainer.style.width = '90%';
  sjHeaderImgContainer.style.maxWidth = '564px';
  sjHeaderImgContainer.style.height = 'auto';
  sjHeaderImgDirectContainer.style.maxHeight = 'none';
  sjHeaderImg.style.maxHeight = 'none';
  sjHeaderImg.style.height = 'auto';
  sjHeaderImg.style.maxWidth = '100%';
  //PARENT CONTAINER
  container.style.width = '90%';
  elems.courseDetails.meta.container.style.margin = '96px 0';
  elems.courseDetails.meta.container.style.justifyContent = 'center';
  elems.courseDetails.meta.container.style.flexWrap = 'wrap';
  elems.courseDetails.meta.container.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.style.display = 'block';
  elems.courseDetails.meta.category.style.display = 'block';
  container.append(
    elems.courseDetails.meta.category,
    elems.courseDetails.meta.name,
    headingParagraph,
    certificateEl
  );
  //CURRICULUM PAGE BODY STYLING
  tabsContainer.append(curriculumSection);
  tabsContainer.style.margin = '96px 0 46px 0';
  bodyMainContainer.style.paddingTop = '0';
  bodyMainContainer.style.paddingBottom = '0';
  aboutSection.classList.add('active');
  curriculumSection.style.marginTop = '48px';

  aboutSection.querySelector('h3').style.fontWeight = '600';
  aboutSection.querySelector('.title').style.display = 'none';
  aboutSection.querySelector('.content').style.border = '0';
  aboutSection.querySelector('.content').style.padding = '0';
  curriculumSection.querySelector('.title').style.display = 'none';
  curriculumSection.querySelector('h2').style.fontWeight = '600';
  curriculumSection.querySelector('.content').style.border = '0';
  curriculumSection.querySelector('.content').style.padding = '0';

  /////////////////////////////////
  //NEW CURRICULUM DISPLAY STYLING
  /////////////////////////////////
  if (!view.loaded) {
    //set global curriculum and about section vars
    globalCurriculumSection = curriculumSection;
    globalAboutSection = aboutSection;

    const hasSections = curriculumParentContainer.querySelector('h3')
      ? true
      : false;
    let curContainer = document.createElement('div');

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    curriculumItemsListLIVE.forEach((el) => {
      if (el?.tagName) {
        el.classList.add('curriculumItem');
      }
    });

    const curriculumItemsListNonLive =
      curriculumParentContainer.querySelectorAll('.curriculumItem');

    curriculumItemsListNonLive.forEach((el, i, curArr) => {
      if (el.tagName === 'DIV') {
        //Yes? push curContainer into parent container
        curriculumParentContainer.append(curContainer);
        //reset curContainer while pushing current new heading & icon in there for the next iteration
        curContainer = document.createElement('div');
        styleGroupContainer(curContainer);

        const newGroupHeading = document.createElement('div');
        newGroupHeading.style.display = 'flex';
        newGroupHeading.style.gap = '12px';
        const groupH3Tag = document.createElement('h3');

        groupH3Tag.textContent = el.querySelector('h3').textContent;
        newGroupHeading.append(groupH3Tag);

        // styleGroupHeading(newGroupHeading);
        // note: set as class instead

        curContainer.append(newGroupHeading);
        el.style.display = 'none';
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const div = document.createElement('div');
        styleListItem(
          div,
          curArr[i + 1] ? curArr[i + 1].tagName === 'DIV' : true
        );
        //styling for mobile
        el.querySelector('.title').style.textWrap = 'wrap';

        div.append(el);
        curContainer.append(div);
      }
    });

    curriculumParentContainer.append(curContainer);

    curriculumOutsideContainer.querySelector('h2').style.display = 'none';
    curriculumOutsideContainer.querySelector('hr').style.display = 'none';
  }

  //CURRICULUM ITSELF STYLING
  pageIcons.forEach((pageIcon) => {
    pageIcon.setAttribute('style', 'display:none !important');
  });
  lessonListItems.forEach((item) => {
    const titleEl = item.querySelector('.title');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '12px';

    item.querySelector('.bullet').style.position = 'static';

    titleEl.style.position = 'static';
    titleEl.style.color = '#1C1C1C';
    titleEl.style.display = 'flex';
    titleEl.style.alignItems = 'center';
    titleEl.style.margin = '0';
    titleEl.style.transform = 'translateY(2px)';
  });
}

function mobileLessonPageStyling() {
  const leftNav = document.querySelector('#lp-left-nav');
  const mainLessonContentContainer = document.querySelector('#lp-wrapper');
  const mainLessonContentSubContainer = document.querySelector('#lp-content');
  const mainLessonInnerContainer = document.querySelector('#lesson-body');
  const mainLessonMainContainer = document.querySelector('#lesson-main');

  const lessonFooter = document.querySelector('#lp-footer');
  const navOpenIcon = document.querySelector('#left-nav-button');
  const hamburgerIcon = navOpenIcon.querySelector('.fa.fa-bars');
  const xIcon = navOpenIcon.querySelector('.fa.fa-times');
  const leftNavMobileOverlay = document.querySelector('#lpLeftNavBackground');
  const fullScreenBtn = document.querySelector(
    '.toggle-fullscreen.focus-link-v2 '
  );
  /// LESSON BODY VARS
  const lessonInnerContainer = document.querySelector('#lesson-main-inner');
  const copyIcon = document.querySelector('.copy-icon');
  const lessonContentContainer = document.querySelector(
    'sjwc-lesson-content-item'
  );
  elems.lesson.codeBlocks = new Array(
    ...document.querySelectorAll('pre:has(code):not(.language-ansi)')
  ).filter((d) => !d.dataset['no-copy']);

  lessonInnerContainer.style.maxWidth = '712px';
  lessonInnerContainer.style.margin = '0 auto';

  mainLessonContentContainer.append(lessonFooter);
  mainLessonInnerContainer.prepend(navOpenIcon);

  //STYLING TO ALIGN NAV ICON TO RIGHT CORNER AND STICKY
  mainLessonContentContainer.style.position = 'relative';
  mainLessonContentContainer.style.display = 'flex';
  mainLessonContentContainer.style.flexDirection = 'column';
  mainLessonContentContainer.style.justifyContent = 'space-between';

  mainLessonContentSubContainer.style.height = 'auto';

  mainLessonInnerContainer.style.margin = '0';
  mainLessonInnerContainer.style.maxWidth = 'none';
  mainLessonInnerContainer.style.overflowX = 'clip';
  mainLessonMainContainer.style.position = 'relative';
  mainLessonMainContainer.style.zIndex = '0';
  mainLessonMainContainer.style.paddingTop = '0';

  navOpenIcon.style.position = 'sticky';
  if (view.size >= 767) {
    navOpenIcon.style.top = '24px';
  } else {
    navOpenIcon.style.top = '56px';
  }
  navOpenIcon.style.zIndex = '1';
  navOpenIcon.style.paddingRight = '12px';
  navOpenIcon.style.float = 'right';
  [hamburgerIcon, xIcon].forEach((el) => {
    el.style.padding = '12px';
    el.style.border = '1px solid gainsboro';
    el.style.borderRadius = '8px';
    el.style.background = 'rgba(255, 255, 255, .8)';
    el.style.padding = '6px';
    el.style.backdropFilter = 'blur(1.5px)';
  });

  ///////////////////////////////

  lessonFooter.style.position = 'relative';
  lessonFooter.style.border = '0';
  lessonFooter.style.backgroundColor = 'transparent';

  leftNav.style.position = 'fixed';
  leftNav.style.backgroundColor = '#f9f9f9';
  leftNav.style.width = '320px';
  leftNav.style.height = '100%';
  leftNav.style.paddingBottom = '40px';
  mainLessonContentContainer.style.height = '100vh';
  mainLessonContentContainer.style.paddingBottom = '0';

  //HIDE FULL SCREEN BUTTON
  fullScreenBtn.style.display = 'none';

  //SECOND PAGE OF STYLING INSTRUCTIONS FROM 1ST VERSION
  const parentEl = document.querySelector('.sj-page-lesson');

  const openIcon = document.querySelector('.fa.fa-bars');
  const searchIcon = document.querySelector('.fa.fa-search');
  const closeIcon = document.querySelector('.fa.fa-times');
  const navText = document.querySelector('.burger-text.sj-text-lessons');

  searchIcon.style.display = 'none';
  navText.style.display = 'none';

  //HANDLE FIRST RENDER CASE WHEN EITHER NAV IS OPEN OR CLOSED
  if (parentEl.classList.contains('cbp-spmenu-open')) {
    openIcon.style.display = 'none';
  } else {
    closeIcon.style.display = 'none';
  }

  //DEFAULT LEFT-NAV TO BE CLOSED ON OPEN
  document.body.classList.remove('cbp-spmenu-open');
  leftNav.classList.remove('cbp-spmenu-open');
  openIcon.style.display = 'inline-block';
  closeIcon.style.display = 'none';

  //HANDLE CLICKS
  openIcon.addEventListener('click', (e) => {
    e.target.style.display = 'none';
    closeIcon.style.display = 'inline-block';
  });
  closeIcon.addEventListener('click', (e) => {
    e.target.style.display = 'none';
    openIcon.style.display = 'inline-block';
  });
  leftNavMobileOverlay.addEventListener('click', () => {
    closeIcon.style.display = 'none';
    openIcon.style.display = 'inline-block';
  });

  //STYLING OF THE LEFT NAV LINKS
  const lessonNavLinksContainer = document.querySelector('#curriculum-list-2');
  const backToCurriculumEl = document.querySelector('#left-nav-return-text');
  const links = lessonNavLinksContainer.querySelectorAll('a');
  const sectionTitles =
    lessonNavLinksContainer.querySelectorAll('.section-title');

  if (backToCurriculumEl) {
    backToCurriculumEl.textContent = 'Back to Course Overview';
  }

  lessonNavLinksContainer.style.paddingBottom = '32px';

  //STYLE EACH OF THE LESSON LINKS
  links.forEach((link) => {
    const pageIcon = link.querySelector('.type-icon');
    const lessonLinkContainer = link.querySelector('.lesson-row');

    link.style.color = '#1C1C1C';
    link.style.cursor = 'pointer';
    pageIcon.style.display = 'none';
    lessonLinkContainer.style.display = 'flex';
    lessonLinkContainer.style.flexDirection = 'row-reverse';
    lessonLinkContainer.style.justifyContent = 'space-between';
    lessonLinkContainer.style.margin = '0 12px';
    lessonLinkContainer.style.paddingLeft = '12px';
    lessonLinkContainer.style.paddingRight = '12px';
    lessonLinkContainer.style.fontSize = '14px';
    lessonLinkContainer.style.lineHeight = '20px';
  });

  //STYLE EACH OF THE LESSON LINK HEADER (THE MODULE NAMES)
  sectionTitles.forEach((title) => {
    title.style.backgroundColor = 'transparent';
    title.style.padding = '12px';
    title.style.paddingLeft = '24px';
    title.style.paddingRight = '24px';
    title.style.marginTop = '12px';
    title.style.marginBottom = '12px';
    title.style.border = '0';
    title.style.fontFamily = 'Space Mono';
    title.style.fontSize = '12px';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '.05em';
  });

  //HANDLE CODE BLOCK CUSTOM STYLING

  function animateCopiedTooltip(tooltipEl) {
    tooltipEl.style.opacity = '1';

    setTimeout(() => {
      tooltipEl.style.opacity = '0';
    }, 400);
  }

  elems.lesson.codeBlocks
    .filter((d) => !d.dataset.noCopy)
    .forEach((el) => {
      //WILL NEED TO CLEAN UP THE STYLING OF EL!!!!!!!!!!
      el.style.padding = '0';
      el.style.overflow = 'visible';
      el.style.position = 'relative';
      const codeEl = el.querySelector('code');
      codeEl.setAttribute(
        'style',
        'display: inline-block; padding: 24px !important; overflow-x: scroll; width: 100%'
      );
      const copyText = codeEl.textContent.trim().replace(/^\$ /g, '');

      //CREATE PARENT CONTAINER & STYLE AS FLEX CONTAINER, COL DIR, AND ALIGN INTEMS START (OR END)
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.justifyContent = 'end';
      container.style.borderBottom = '1px solid gainsboro';
      container.style.padding = '12px 24px';

      //CLONE COPYICON EL AND ADD TO CONTAINER
      const copyClone = copyIcon.cloneNode(true);
      copyClone.style.display = 'block';
      copyClone.style.cursor = 'pointer';

      //ADD EVENT LISTENER TO CLONED ICON TO COPY CODE BLOCK INTO CLIPBOARD
      copyClone.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(copyText);
          animateCopiedTooltip(tooltipContainer);
        } catch (err) {
          console.error('Failed to copy codeblock to clipboard: ', err);
        }
      });

      container.append(copyClone);

      //CREATE 'COPIED' TOOLTIP
      const tooltipContainer = document.createElement('div');
      tooltipContainer.textContent = 'Copied';
      tooltipContainer.style.position = 'absolute';
      tooltipContainer.style.top = '-24px';
      tooltipContainer.style.right = '10px';
      tooltipContainer.style.textShadow = 'none';
      tooltipContainer.style.backgroundColor = '#1c1c1c';
      tooltipContainer.style.color = '#fff';
      tooltipContainer.style.padding = '5px 10px';
      tooltipContainer.style.borderRadius = '4px';
      tooltipContainer.style.opacity = '0';
      tooltipContainer.style.transition = 'opacity .2s ease-in';

      el.append(tooltipContainer);

      //ADD CONTAINER AS FIRST CHILD IN EL
      el.prepend(container);
    });

  // Makes lesson links pop up in new tab
  lessonContentContainer.querySelectorAll('a').forEach((el) => {
    el.setAttribute('target', '_blank');
  });
}

function handlePageStyling() {
  debug('handlePageStyling called with view.current:', view.current);

  if (view.current === 'catalog') {
    handleCatalogStyle();
  } else if (view.current === 'login') {
    handleAuthStyle();
  } else if (view.current === 'signup') {
    handleAuthStyle(false);
  }

  if (view.current === 'courseDetails') {
    handleCourseDetailsStyle();
  } else if (view.isPageDetailPath) {
    pathCourseDetailsPageStyling();
  } else if (view.isPageCatalogPath) {
    pathCatalogPageStyling();
  } else if (view.isCurriculumPage) {
    const certificateEl = document.querySelector('.cp-certificate');

    if (!certificateEl) {
      view.viewport === 'desktop'
        ? desktopCurriculumPageNoCertificateStyling()
        : mobileCurriculumPageNoCertificateStyling();
    } else {
      //CURRICULUM PAGE W COMPLETED CERTIFICATION GOES HERE [YESSS CERTIFICATION] <<<<<<<<<<< [CHECK TO MAKE SURE THIS WORKS; NOT TESTED]
      view.viewport === 'desktop'
        ? desktopCurriculumPageYesCertificationStyling()
        : mobileCurriculumPageYesCertificateStyling();
    }
  } else if (view.isLessonsPage) {
    view.viewport === 'desktop'
      ? desktopLessonPageStyling()
      : mobileLessonPageStyling();
  }
}

function renderCourse() {
  view.width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  view.viewport = view.width <= 991 ? 'mobile' : 'desktop';
  handlePageStyling();

  // Insert footer
  elems.global.footer.style.display = 'flex';

  if (view.isLessonsPage && view.viewport === 'mobile') {
    elems.global.footer.style.display = 'none';
  }

  let contentContainer = view.isLessonsPage
    ? document.querySelector('.sj-page-lesson')
    : document.querySelector('#skilljar-content');

  contentContainer.append(elems.global.footer);

  // Make sure body is visible after rendering
  if (!document.body.classList.contains('sj-page-catalog')) {
    document.body.setAttribute(
      'style',
      'visibility: visible !important; opacity: 1 !important'
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('sj-page-catalog'))
    view.current = 'catalog';

  if (document.body.classList.contains('sj-page-curriculum'))
    view.current = 'curriculum'; // not logged in

  if (document.body.classList.contains('sj-page-detail-course'))
    view.current = 'courseDetails'; // not logged in

  if (document.body.classList.contains('sj-page-lesson'))
    view.current = 'lesson';

  if (document.body.classList.contains('sj-page-login')) view.current = 'login';

  if (document.body.classList.contains('sj-page-signup'))
    view.current = 'signup';

  if (document.body.classList.contains('sj-page-detail-bundle'))
    view.current = 'pathDetails';

  if (document.body.classList.contains('sj-page-catalog-path'))
    view.current = 'pathCatalog';

  if (document.body.classList.contains('sj-page-path'))
    view.current = 'pagePath';

  renderCourse();

  view.loaded = true;
});

window.addEventListener('resize', () => {
  renderCourse();
});
