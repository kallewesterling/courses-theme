const debug = (msg, level = 'log') => {
  if (location.hostname.indexOf('skilljar')) {
    if (level === "log") {
      console[level](msg);
    }
  }
};

let globalCurriculumSection, globalAboutSection;

const view = {
  isCatalogPage: document.querySelector('.sj-page-catalog.sj-page-catalog-root')
    ? true
    : false,
  isCurriculumPage: document.querySelector('.sj-page-curriculum')
    ? true
    : false,
  isCourseDetailsPage: document.querySelector(
    '.sj-page-detail.sj-page-detail-course'
  )
    ? true
    : false,
  isLessonsPage: document.querySelector('.sj-page-lesson') ? true : false,
  isLoginPage: document.querySelector('.sj-page-login') ? true : false,
  isSignUpPage: document.querySelector('.sj-page-signup') ? true : false,
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

const globalElements = {
  footer: document.querySelector('#footer-container'),
};

const pageElements = {
  catalog: {
    content: document.querySelector('#catalog-content'),
    courseContainer: document.querySelector('#catalog-courses'),
  },

  auth: {
    // pageElements.auth.tabs.loginBtn
    signupForm: document.querySelector('#signup_form'),
    loginForm: document.querySelector('#login_form'),
    termsAndServices: document.querySelector('#access-message'),
    email:
      document.querySelector('input#id_login') ||
      document.querySelector('input#id_email'),
    emailLabel:
      document.querySelector('label[for="id_login"]') ||
      document.querySelector('label[for="id_email"]'),
    actionBtn:
      document.querySelector('#button-sign-in') ||
      document.querySelector('#button-sign-up'),
    formPane: document.querySelectorAll('#login-content .large-6.columns')[0],
    buttonPane: document.querySelectorAll('#login-content .large-6.columns')[1],
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
  },

  lesson: {
    codeBlocks: [],
  }
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

function styleGroupHeading(container, variation = 'gray') {
  container.style.padding = '24px';
  container.style.borderBottom =
    variation === 'gray' ? '1px solid #DCDCDC' : '2px solid #3443f4';

  //get actual group heading
  const heading = container.querySelector('h3') || container;

  heading.textContent = heading?.textContent?.trim();
  heading.style.fontSize = '16px';
  heading.style.fontFamily = 'Fusiona';
  heading.style.fontWeight = '500';
  heading.style.lineHeight = '125%';
  heading.style.letterSpacing = '-.16px';
  heading.style.margin = '0';
  heading.style.textWrap = 'wrap';
}

//DESKTOP VIEW STYLINGS
function initCatalog() {
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
    catalogWrapper.append(header, pageElements.catalog.courseContainer);
    pageElements.catalog.content.append(catalogWrapper);

    view.loaded = true;
  }
}

function desktopCourseDetailsPageStyling() {
  const headerContainer = document.querySelector(
    '.top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2'
  );
  const headerFlexContainer = document.querySelector('.row.dp-row-flex-v2');
  const headingFloaterText = document.querySelector('.sj-floater-text');
  const mainHeading = document.querySelector('.break-word');
  const registerBtn = document.querySelector('#purchase-button-wrapper-large');
  const mainHeadingContainer = document.querySelector(
    '.columns.text-center.large-6.dp-summary-wrapper.text-left-v2'
  );
  const backToCatalogBtn = document.querySelector('.back-to-catalog');
  const videoContainer = document.querySelector('.video-max');
  const mainInfoCardContained = document.querySelector(
    '.sj-course-info-wrapper'
  );
  const headingParagraph = mainInfoCardContained.querySelector('h2');

  //SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector('.signin');
  //BODY VARIABLES
  const bodyContainer = document.querySelector('#dp-details');
  const mobileBodyContent = document.querySelector('.row.show-for-small');
  const secondaryBodyContainer = document.querySelector(
    '.row.hide-for-small.padded-side-bottom'
  );
  const bodyColumns = secondaryBodyContainer.querySelectorAll('.columns');
  const curriculumListContainer = document.querySelector('.dp-curriculum'); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  const curriculumListHeader = curriculumListContainer
    .closest('.sj-curriculum-wrapper')
    .querySelector('h3');
  const curriculumList = curriculumListContainer.querySelectorAll('li');

  //CARD VARIABLES
  const courseDetailCardContainer = secondaryBodyContainer.querySelector(
    '.course-details-card'
  );
  let courseDetailCardListItems;
  if (courseDetailCardContainer) {
    courseDetailCardListItems =
      courseDetailCardContainer.querySelectorAll('li');
  }
  const checkboxIcon = document.querySelector('.checkbox-icon');
  const registerBtnLink = document
    .querySelector('#purchase-button')
    .getAttribute('href');
  const registerBtnText = document.querySelector(
    '.purchase-button-full-text'
  ).textContent;
  const courseDetailsCardLink = document.querySelector(
    '.course-details-card-link'
  );

  backToCatalogBtn.style.display = 'none';
  mobileBodyContent.style.display = 'none';
  if (signInHeaderText) {
    signInHeaderText.style.display = 'none';
  }

  headerContainer.style.backgroundColor = '#D0CFEE';
  headerContainer.style.margin = '0';
  headerContainer.style.maxWidth = 'none';
  headerContainer.style.paddingTop = '96px';
  headerContainer.style.paddingBottom = '96px';
  headerContainer.style.border = '0';
  headerFlexContainer.style.flexDirection = 'row-reverse';
  headerFlexContainer.style.flexWrap = 'nowrap';
  headerFlexContainer.style.justifyContent = 'start';
  headerFlexContainer.style.gap = '24px';
  headerFlexContainer.style.maxWidth = '1188px';

  //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = '0';
  mainHeadingContainer.style.maxWidth = '564px';
  mainInfoCardContained.style.display = 'none';
  headingFloaterText.style.display = 'block';
  headingFloaterText.style.marginBottom = '24px';
  mainHeading.style.margin = '0 0 12px 0';
  mainHeading.style.fontSize = '36px';
  mainHeading.style.fontWeight = '600';
  mainHeading.style.lineHeight = '43.2px';
  mainHeading.style.letterSpacing = '-.02em';
  headingParagraph.style.display = 'block';
  headingParagraph.style.margin = '0 0 24px 0';
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  //VIDEO STYLING
  if (videoContainer && videoContainer.style) {
    videoContainer.style.maxWidth = 'none';
  }

  //COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = '0';
  bodyContainer.style.margin = '96px auto 46px auto';
  bodyContainer.style.maxWidth = 'min(1152px, 90%)';
  bodyContainer.style.display = 'grid';
  bodyContainer.style.gridTemplateColumns =
    'minmax(100px, 760px) minmax(100px, 368px)';
  bodyContainer.style.columnGap = '24px';

  secondaryBodyContainer.style.padding = '0';
  secondaryBodyContainer.style.maxWidth = '760px';
  bodyColumns.forEach((column) => {
    column.style.float = 'none';
    column.style.padding = '0';
    column.style.width = '100%';
    column.style.display = 'block';

    column.querySelector('h3').style.fontWeight = '600';

    if (column.classList.contains('large-7')) {
      column.style.marginBottom = '48px';
    }

    const innerCol = column.querySelector('.dp-curriculum');
    if (innerCol) {
      innerCol.style.margin = '0';
    }
  });

  //COURSE DETAILS CURRICULUM STYLING
  if (!view.loaded) {
    // Check if course has Sections/Modules/Parts
    const hasSections = curriculumListContainer.querySelector('.section')
      ? true
      : false;
    let curContainer = document.createElement('li');

    if (!hasSections) {
      styleGroupContainer(curContainer, 'blue');
    }

    function styleListItem(div, isLastChild) {
      //display none for icon w/ class 'type-icon'
      const icon = div.querySelector('.type-icon');
      icon.style.display = 'none';

      const lessonItemText = div.querySelector('.lesson-wrapper');
      lessonItemText.style.padding = '24px';
      lessonItemText.style.fontSize = '16px';
      lessonItemText.style.fontWeight = '400';
      lessonItemText.style.lineHeight = '150%';

      if (!isLastChild) {
        lessonItemText.style.borderBottom = '2px solid #3443F4';
      }
    }

    curriculumList.forEach((curListItem, i, arr) => {
      //first check if current item contains 'section' class
      if (curListItem.classList.contains('section')) {
        //Yes? push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);
        //reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement('li');
        styleGroupContainer(curContainer);
        const newGroupHeading = document.createElement('div');
        newGroupHeading.innerHTML = curListItem.innerHTML;
        styleGroupHeading(newGroupHeading, 'blue');
        curContainer.append(newGroupHeading);
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const div = document.createElement('div');
        div.innerHTML = curListItem.innerHTML;
        styleListItem(
          div,
          arr[i + 1] ? arr[i + 1].classList.contains('section') : true
        );
        curContainer.append(div);
      }
      curListItem.style.display = 'none';
    });

    //LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    curriculumListHeader.style.display = 'none';
    curriculumListContainer.style.padding = '0';
  }

  //COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  if (courseDetailCardContainer) {
    bodyContainer.append(courseDetailCardContainer);
    courseDetailCardContainer.style.margin = '0 0 46px 0';
    courseDetailCardContainer.style.justifySelf = 'center';
    courseDetailCardListItems.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });
  }

  if (courseDetailsCardLink) {
    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute('href', registerBtnLink);
  }
}

function desktopPathCourseDetailsPageStyling() {
  const headerContainer = document.querySelector(
    '.top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2'
  );
  const headerFlexContainer = document.querySelector('.row.dp-row-flex-v2');
  const headingFloaterText = document.querySelector('.sj-floater-text');
  const mainHeading = document.querySelector('.break-word');
  const registerBtn = document.querySelector('#purchase-button-wrapper-large');
  const registerBtnAnchor = document.querySelector('#purchase-button');
  const mainHeadingContainer = document.querySelector(
    '.columns.text-center.large-6.dp-summary-wrapper.text-left-v2'
  );
  const backToCatalogBtn = document.querySelector('.back-to-catalog');
  const mainInfoCardContained = document.querySelector(
    '.sj-course-info-wrapper'
  );
  const headingParagraph = mainInfoCardContained.querySelector('h2');

  //SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector('.signin');
  //BODY VARIABLES
  const bodyContainer = document.querySelector('#dp-details-bundle');
  const catalogContainer = document.querySelector('#catalog-courses');

  backToCatalogBtn.style.display = 'none';
  if (signInHeaderText) {
    signInHeaderText.style.display = 'none';
  }

  headerContainer.style.background =
    'url(https://images.ctfassets.net/l47ir7rfykkn/5zE7elBMFe1MmuhPIeWd9G/e09a10e4d4c081b9ca86a879b6984049/Main_BG.png)';
  headerContainer.style.backgroundSize = 'cover';
  headerContainer.style.backgroundPosition = 'center';
  headerContainer.style.backgroundRepeat = 'no-repeat';
  headerContainer.style.margin = '0';
  headerContainer.style.maxWidth = 'none';
  headerContainer.style.paddingTop = '96px';
  headerContainer.style.paddingBottom = '96px';
  headerContainer.style.border = '0';
  headerFlexContainer.style.flexDirection = 'row-reverse';
  headerFlexContainer.style.flexWrap = 'nowrap';
  headerFlexContainer.style.justifyContent = 'start';
  headerFlexContainer.style.gap = '24px';
  headerFlexContainer.style.maxWidth = '1188px';

  //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = '0';
  mainHeadingContainer.style.maxWidth = '600px';
  mainInfoCardContained.style.display = 'none';
  headingFloaterText.textContent = 'Learning Path';
  headingFloaterText.style.color = '#7AF0FE';
  headingFloaterText.style.display = 'block';
  headingFloaterText.style.marginBottom = '24px';
  mainHeading.style.color = '#fff';
  mainHeading.style.margin = '0 0 12px 0';
  mainHeading.style.fontSize = '36px';
  mainHeading.style.fontWeight = '600';
  mainHeading.style.lineHeight = '43.2px';
  mainHeading.style.letterSpacing = '-.02em';
  headingParagraph.style.color = '#fff';
  headingParagraph.style.display = 'block';
  headingParagraph.style.margin = '0 0 24px 0';
  registerBtnAnchor.style.borderColor = '#7AF0FE';
  registerBtnAnchor.style.color = '#fff';
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  //COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = '0';
  bodyContainer.style.margin = '96px auto 46px auto';
  bodyContainer.style.maxWidth = 'min(1152px, 90%)';
  catalogContainer.style.marginBottom = '85px';
}

function desktopPathCatalogPageStyling() {
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
  pageElements.lesson.codeBlocks = new Array(
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

  pageElements.lesson.codeBlocks
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

function desktopLoginPageStyling() {
  handleAuthStyle();
  const signUpTab = document.querySelector('#login-tab-right');

  //STYLE THE LOGIN/SIGN UP TABS
  pageElements.auth.tabs.loginBtnText.textContent = 'Log In';
  signUpTab.querySelector('span').textContent = 'Sign Up';

  pageElements.auth.actionBtn.textContent = 'Log In';

}

function desktopSignUpPageStyling() {
  handleAuthStyle(false);

  pageElements.auth.tabs.loginBtnText.textContent = 'Log In';
  pageElements.auth.tabs.signupBtnText.textContent = 'Sign up';

  pageElements.auth.firstNameLabel.textContent = 'First Name';
  pageElements.auth.lastNameLabel.textContent = 'Last Name';
  pageElements.auth.emailLabel.textContent = 'Work Email';
  pageElements.auth.email.setAttribute('placeholder', 'Work Email');

  const signUpBottomBtnParent =
    pageElements.auth.actionBtn?.closest('.text-center');
  if (signUpBottomBtnParent) {
    signUpBottomBtnParent.style.textAlign = 'left';
    signUpBottomBtnParent.classList.remove('text-center');
  }
  pageElements.auth.actionBtn.querySelector('span').textContent = 'Sign up';

  document.querySelector("label[for='id_password1'] .input-label-text span").textContent =
    'Password Confirm';

  document.querySelector("input#id_password1").setAttribute(
    'placeholder',
    'Password confirm'
  );
}

function desktopCurriculumPageNoCertificateStyling() {
  // eslint-disable-next-line no-undef
  const courseDescription = skilljarCourse.short_description;

  //HEADER VARIABLES
  const headingParagraph = document.querySelector('.sj-heading-paragraph');
  const headingFloaterText = document.querySelector('.sj-floater-text');
  const container = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  ); //DUPLICATE VAR
  const mainHeading = document.querySelector('.break-word'); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector('.back-to-catalog');

  backToCatalogLink.style.display = 'none';

  const curriculumPageHeader = document.querySelector(
    '.top-row-grey.top-row-white-v2.padding-side.row-v2'
  );
  const headerTextAndImgContainer = document.querySelector(
    '.row.dp-row-flex-v2'
  );
  const sjHeaderTextContainer = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  );
  const sjHeaderTextHeading = document.querySelector('.break-word');
  const sjHeaderTextSubheading = document.querySelector('.cp-lessons');
  const sjHeaderTextProgressBar = document.querySelector(
    '.progress-bar.button-border-color'
  );
  const sjHeaderImgContainer = document.querySelector(
    '.large-4.pull-8.columns.cp-promo-image-wrapper'
  );
  const sjHeaderImgDirectContainer = document.querySelector('.cp-promo-image');
  const sjHeaderImg = document.querySelector('.cp-promo-image img');
  const resumeBtn = document.querySelector('#resume-button');
  let btnText, btnHref;
  if (resumeBtn) {
    btnText = resumeBtn.querySelector('.button span').textContent;
    btnHref = resumeBtn.querySelector('.button').getAttribute('href');
  }

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
  const courseDetailsCard = document.querySelector('.course-details-card');
  let courseDetailCardListItems;
  if (courseDetailsCard) {
    courseDetailCardListItems = courseDetailsCard.querySelectorAll('li');
  }
  const checkboxIcon = document.querySelector('.checkbox-icon');
  const courseDetailsCardLink = document.querySelector(
    '.course-details-card-link'
  );

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.marginTop = '96px';
  bodyMainContainer.style.gridTemplateColumns =
    'minmax(100px, 760px) minmax(100px, 368px)';
  if (courseDetailsCard) {
    courseDetailsCard.style.margin = '96px 0 46px 0';
    bodyMainContainer.append(courseDetailsCard);

    if (!resumeBtn) {
      courseDetailsCardLink.style.display = 'none';
    }
  }

  if (courseDetailsCardLink && resumeBtn) {
    courseDetailsCardLink.textContent = btnText;
    courseDetailsCardLink.setAttribute('href', btnHref);
  }

  if (!view.loaded) {
    if (courseDetailCardListItems) {
      courseDetailCardListItems.forEach((li) => {
        const checkboxClone = checkboxIcon.cloneNode(true);
        li.prepend(checkboxClone);
      });
    }
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = '600';
  sjHeaderTextHeading.style.fontSize = '36px';
  sjHeaderTextHeading.style.lineHeight = '43.2px';
  sjHeaderTextHeading.style.letterSpacing = '-0.5px';
  sjHeaderTextHeading.style.marginTop = '0';
  sjHeaderTextSubheading.style.display = 'none';
  sjHeaderTextProgressBar.style.display = 'none';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = 'none';
  curriculumPageHeader.style.padding = '0';
  curriculumPageHeader.style.backgroundColor = '#D0CFEE';
  curriculumPageHeader.style.border = '0';

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
  headerTextAndImgContainer.style.margin = '96px 0';
  headerTextAndImgContainer.style.justifyContent = 'center';
  headerTextAndImgContainer.style.flexWrap = 'nowrap';
  headerTextAndImgContainer.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.textContent = courseDescription;
  headingParagraph.style.display = 'block';
  headingFloaterText.style.display = 'block';

  if (resumeBtn) {
    container.append(
      headingFloaterText,
      mainHeading,
      headingParagraph,
      resumeBtn
    );
  } else {
    container.append(headingFloaterText, mainHeading, headingParagraph);
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

        styleGroupHeading(newGroupHeading, 'blue');

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
  const headingFloaterText = document.querySelector('.sj-floater-text');
  const container = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  ); //DUPLICATE VAR
  const mainHeading = document.querySelector('.break-word'); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector('.back-to-catalog');

  backToCatalogLink.style.display = 'none';

  const curriculumPageHeader = document.querySelector(
    '.top-row-grey.top-row-white-v2.padding-side.row-v2'
  );
  const headerTextAndImgContainer = document.querySelector(
    '.row.dp-row-flex-v2'
  );
  const sjHeaderTextContainer = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  );
  const sjHeaderTextHeading = document.querySelector('.break-word');
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
  const courseDetailsCard = document.querySelector('.course-details-card');
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll('li');
  const checkboxIcon = document.querySelector('.checkbox-icon');
  const courseDetailsCardLink = document.querySelector(
    '.course-details-card-link'
  );

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.marginTop = '96px';
  bodyMainContainer.style.gridTemplateColumns =
    'minmax(100px, 760px) minmax(100px, 368px)';
  if (courseDetailsCard) {
    courseDetailsCard.style.margin = '96px 0 46px 0';
    bodyMainContainer.append(courseDetailsCard);

    courseDetailsCardLink.style.display = 'none';
  }

  if (!view.loaded) {
    courseDetailCardListItems.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = '600';
  sjHeaderTextHeading.style.fontSize = '36px';
  sjHeaderTextHeading.style.lineHeight = '43.2px';
  sjHeaderTextHeading.style.letterSpacing = '-0.5px';
  sjHeaderTextHeading.style.marginTop = '0';
  sjHeaderTextSubheading.style.display = 'none';
  sjHeaderTextProgressBar.style.display = 'none';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = 'none';
  curriculumPageHeader.style.padding = '0';
  curriculumPageHeader.style.backgroundImage =
    'linear-gradient(315deg,#fde1fe,#f5f6fe 72%)';
  curriculumPageHeader.style.border = '0';

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
  headerTextAndImgContainer.style.margin = '96px 0';
  headerTextAndImgContainer.style.justifyContent = 'center';
  headerTextAndImgContainer.style.flexWrap = 'nowrap';
  headerTextAndImgContainer.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.textContent = courseDescription;
  headingParagraph.style.display = 'block';
  headingFloaterText.style.display = 'block';

  container.append(
    headingFloaterText,
    mainHeading,
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

        styleGroupHeading(newGroupHeading, 'blue');

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

function handleAuthStyle(login = true) {
  // Set the Google login button text
  Object.assign(document.querySelector('#google_login'), {
    textContent: 'Continue with Google',
  });

  if (login) {
    // Set the correct CTA for login
    Object.assign(document.querySelector('.sj-text-sign-in-with span'), {
      textContent: 'Or Log In With',
    });

    // Add the T&C text to the login form
    pageElements.auth.loginForm.append(pageElements.auth.termsAndServices);

    // Set Login button text
    pageElements.auth.actionBtn.textContent = 'Log In';
  } else {
    // Set the correct CTA for signup
    Object.assign(document.querySelector('.sj-text-sign-up-with span'), {
      textContent: 'Or Sign Up With',
    });

    // Add the T&C text to the signup form
    pageElements.auth.signupForm.append(pageElements.auth.termsAndServices);

    // Add Work Email to email signup
    Object.assign(pageElements.auth.email, { placeholder: 'Work Email' });

    // Set Sign Up button text
    pageElements.auth.actionBtn.textContent = 'Sign Up';
  }
}

//MOBILE VIEW STYLINGS
function mobileLoginPageStyling() {
  handleAuthStyle();

  pageElements.auth.tabs.loginBtnText.textContent = 'Log in';
  pageElements.auth.tabs.signupBtnText.textContent = 'Sign up';

  pageElements.auth.actionBtn.textContent = 'Log in';
}

function mobileSignUpPageStyling() {
  handleAuthStyle(false);

  const signUpBottomBtn = document.querySelector('#button-sign-up');

  //STYLE THE LOGIN/SIGN UP TABS
  pageElements.auth.tabs.loginBtnText.textContent = 'Log in';
  pageElements.auth.tabs.signupBtnText.textContent = 'Sign up';

  pageElements.auth.firstNameLabel.textContent = 'First Name';
  pageElements.auth.lastNameLabel.textContent = 'Last Name';
  pageElements.auth.emailLabel.textContent = 'Work Email';
  pageElements.auth.email.setAttribute('placeholder', 'Work Email');

  const signUpBottomBtnParent = signUpBottomBtn?.closest('.text-center');
  if (signUpBottomBtnParent) {
    signUpBottomBtnParent.style.textAlign = 'left';
    signUpBottomBtnParent.classList.remove('text-center');
  }

  signUpBottomBtn.querySelector('span').textContent = 'Sign up';

  document.querySelector("label[for='id_password2']").textContent =
    'Password Confirm';

  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.style.borderRadius = '4px';
    input.style.borderColor = 'rgb(220, 220, 220)';
    input.style.padding = '12px';
    input.style.lineHeight = '24px';

    if (input.getAttribute('id') === 'id_password2') {
      input.setAttribute('placeholder', 'Password confirm');
    }
  });
}

function mobileCourseDetailsPageStyling() {
  const headerContainer = document.querySelector(
    '.top-row-grey.top-row-white-v2.padding-top.padding-side.row-v2'
  );
  const headerFlexContainer = document.querySelector('.row.dp-row-flex-v2');
  const headingFloaterText = document.querySelector('.sj-floater-text');
  const mainHeading = document.querySelector('.break-word');
  const headingParagraph = document.querySelector('.sj-heading-paragraph');
  const registerBtn = document.querySelector('#purchase-button-wrapper-large');
  const mainHeadingContainer = document.querySelector(
    '.columns.text-center.large-6.dp-summary-wrapper.text-left-v2'
  );
  const mainVideoContainer = document.querySelector(
    '.columns.large-6.text-center.dp-promo-image-wrapper'
  );
  const backToCatalogBtn = document.querySelector('.back-to-catalog');
  const videoContainer = document.querySelector('.video-max');
  //SIGN IN VARIABLES (WHEN USER NOT LOGGED IN)
  const signInHeaderText = document.querySelector('.signin');
  //BODY VARIABLES
  const bodyContainer = document.querySelector('#dp-details');
  const mobileBodyContent = document.querySelector('.row.show-for-small');
  const secondaryBodyContainer = document.querySelector(
    '.row.hide-for-small.padded-side-bottom'
  );
  const bodyColumns = secondaryBodyContainer.querySelectorAll('.columns');
  const curriculumListContainer = document.querySelector('.dp-curriculum'); //NOTE: THERE ARE 2 DP-CURRICULUMS. ONE IS DESKTOP AND OTHER IS FOR MOBILE (STILL TABED)!
  const curriculumListHeader = curriculumListContainer
    .closest('.sj-curriculum-wrapper')
    .querySelector('h3');
  const curriculumList = curriculumListContainer.querySelectorAll('li');

  //CARD VARIABLES
  const courseDetailCardContainer = document.querySelectorAll(
    '.course-details-card'
  )[0];
  const courseDetailCardListItems =
    courseDetailCardContainer.querySelectorAll('li');
  const checkboxIcon = document.querySelector('.checkbox-icon');
  const registerBtnLink = document
    .querySelector('#purchase-button')
    .getAttribute('href');
  const registerBtnText = document.querySelector(
    '.purchase-button-full-text'
  ).textContent;
  const courseDetailsCardLink = document.querySelector(
    '.course-details-card-link'
  );

  backToCatalogBtn.style.display = 'none';
  mobileBodyContent.setAttribute('style', 'display: none !important;');

  if (signInHeaderText) {
    signInHeaderText.style.display = 'none';
  }

  headerContainer.style.background =
    'linear-gradient(146deg, rgba(245,246,255,1) 0%, rgba(254,231,254,1) 100%)';
  headerContainer.style.margin = '0';
  headerContainer.style.maxWidth = 'none';
  headerContainer.style.paddingTop = '48px';
  headerContainer.style.paddingBottom = '48px';
  headerContainer.style.border = '0';
  headerFlexContainer.style.flexDirection = 'column-reverse';
  headerFlexContainer.style.flexWrap = 'nowrap';
  headerFlexContainer.style.justifyContent = 'start';
  headerFlexContainer.style.gap = '24px';
  headerFlexContainer.style.maxWidth = '1188px';

  //RENDERING OF COURSE DETAILS PAGE TEXT HEADING ON LEFT
  mainHeadingContainer.style.border = '0';
  mainHeadingContainer.style.maxWidth = 'none';
  mainHeadingContainer.style.width = '100%';
  mainHeadingContainer.querySelector('.sj-course-info-wrapper').style.display =
    'none';
  headingFloaterText.style.display = 'block';
  headingFloaterText.style.marginBottom = '24px';
  mainHeading.style.margin = '0 0 12px 0';
  mainHeading.style.fontSize = '36px';
  mainHeading.style.fontWeight = '600';
  mainHeading.style.lineHeight = '43.2px';
  mainHeading.style.letterSpacing = '-.02em';
  headingParagraph.style.display = 'block';
  headingParagraph.style.margin = '0 0 24px 0';
  mainHeadingContainer.append(
    headingFloaterText,
    mainHeading,
    headingParagraph,
    registerBtn
  );

  //VIDEO STYLING
  mainVideoContainer.style.padding = '0';
  mainVideoContainer.style.maxWidth = 'none';
  mainVideoContainer.style.width = '100%';
  videoContainer.style.maxWidth = 'none';
  videoContainer.style.paddingLeft = '15px';
  videoContainer.style.paddingRight = '15px';

  //COURSE DETAILS PAGE BODY STYLING
  bodyContainer.style.padding = '0';
  bodyContainer.style.margin = '72px auto -10px auto';
  bodyContainer.style.maxWidth = 'min(1152px, 90%)';
  bodyContainer.style.display = 'grid';
  bodyContainer.style.gridTemplateColumns = '1fr';
  bodyContainer.style.columnGap = '24px';

  secondaryBodyContainer.setAttribute(
    'style',
    'padding: 0; max-width: 760px; display: grid !important;'
  );
  bodyColumns.forEach((column) => {
    column.style.float = 'none';
    column.style.padding = '0';
    column.style.width = '100%';
    column.style.display = 'block';

    column.querySelector('h3').style.fontWeight = '600';

    if (column.classList.contains('large-7')) {
      column.style.marginBottom = '48px';
    }

    const innerCol = column.querySelector('.dp-curriculum');
    if (innerCol) {
      innerCol.style.margin = '0';
    }
  });

  //COURSE DETAILS CURRICULUM STYLING
  if (!view.loaded) {
    const hasSections = curriculumListContainer.querySelector('.section')
      ? true
      : false;
    let curContainer = document.createElement('li');

    if (!hasSections) {
      styleGroupContainer(curContainer);
    }

    function styleListItem(div, isLastChild) {
      //display none for icon w/ class 'type-icon'
      const icon = div.querySelector('.type-icon');
      icon.style.display = 'none';

      const lessonItemText = div.querySelector('.lesson-wrapper');
      lessonItemText.style.padding = '24px';
      lessonItemText.style.fontSize = '16px';
      lessonItemText.style.fontWeight = '400';
      lessonItemText.style.lineHeight = '150%';

      if (!isLastChild) {
        lessonItemText.style.borderBottom = '1px solid #DCDCDC';
      }
    }

    function styleGroupHeading(groupHeading) {
      groupHeading.textContent = groupHeading?.textContent?.trim();
      groupHeading.style.fontSize = '16px';
      groupHeading.style.fontWeight = '500';
      groupHeading.style.lineHeight = '125%';
      groupHeading.style.letterSpacing = '-.16px';
      groupHeading.style.padding = '24px';
      groupHeading.style.borderBottom = '1px solid #DCDCDC';
      curContainer.append(groupHeading);
    }

    curriculumList.forEach((curListItem, i, arr) => {
      //first check if current item contains 'section' class
      if (curListItem.classList.contains('section')) {
        //Yes? push curContainer into curriculumListContainer
        curriculumListContainer.append(curContainer);
        //reset curContainer while pushing current 'section' in there for the next iteration
        curContainer = document.createElement('li');
        styleGroupContainer(curContainer);
        const newGroupHeading = document.createElement('div');
        newGroupHeading.innerHTML = curListItem.innerHTML;
        styleGroupHeading(newGroupHeading);
        curContainer.append(newGroupHeading);
      } else {
        // else, normal/expected behaviour
        //transfer inner html of current list item to new created div
        const div = document.createElement('div');
        div.innerHTML = curListItem.innerHTML;
        styleListItem(
          div,
          arr[i + 1] ? arr[i + 1].classList.contains('section') : true
        );
        curContainer.append(div);
      }
      curListItem.style.display = 'none';
    });

    //LAST, unpushed SECTION; push it out to curriculumListContainer
    curriculumListContainer.append(curContainer);

    curriculumListHeader.style.display = 'none';
    curriculumListContainer.style.padding = '0';

    //COURSE DETAILS CARD STYLING
    //ADD COURSE DETAILS CARD INTO RIGHT CONTAINER
    bodyContainer.append(courseDetailCardContainer);

    courseDetailCardListItems.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });

    courseDetailsCardLink.textContent = registerBtnText;
    courseDetailsCardLink.setAttribute('href', registerBtnLink);
  }

  //COURSE DETAILS GRID STRUCTURE STYLING - ADDING DETAILS CARD ON RIGHT SIDE
  courseDetailCardContainer.style.margin = '0 0 46px 0';
  courseDetailCardContainer.style.justifySelf = 'center';

}

function mobileCurriculumPageNoCertificateStyling() {
  //HEADER VARIABLES
  const headingParagraph = document.querySelector('.sj-heading-paragraph');
  const headingFloaterText = document.querySelector('.sj-floater-text');
  const container = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  ); //DUPLICATE VAR
  const btn = document.querySelector('#resume-button'); //DUPLICATE VAR
  const mainHeading = document.querySelector('.break-word'); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector('.back-to-catalog');

  backToCatalogLink.style.display = 'none';

  const curriculumPageHeader = document.querySelector(
    '.top-row-grey.top-row-white-v2.padding-side.row-v2'
  );
  const headerTextAndImgContainer = document.querySelector(
    '.row.dp-row-flex-v2'
  );
  const sjHeaderTextContainer = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  );
  const sjHeaderTextHeading = document.querySelector('.break-word');
  const sjHeaderTextSubheading = document.querySelector('.cp-lessons');
  const sjHeaderTextProgressBar = document.querySelector(
    '.progress-bar.button-border-color'
  );
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
  const courseDetailsCard = document.querySelector('.course-details-card');
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll('li');
  const checkboxIcon = document.querySelector('.checkbox-icon');
  const courseDetailsCardLink = document.querySelector(
    '.course-details-card-link'
  );

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.gridTemplateColumns = '1fr';
  bodyMainContainer.style.width = '90%';

  courseDetailsCard.style.margin = '32px 0 56px 0';
  courseDetailsCard.style.justifySelf = 'center';
  bodyMainContainer.append(courseDetailsCard);

  if (courseDetailsCardLink) {
    courseDetailsCardLink.textContent = btnText;
    courseDetailsCardLink.setAttribute('href', btnHref);
  }

  if (!view.loaded) {
    courseDetailCardListItems.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = '600';
  sjHeaderTextHeading.style.fontSize = '36px';
  sjHeaderTextHeading.style.lineHeight = '43.2px';
  sjHeaderTextHeading.style.letterSpacing = '-0.5px';
  sjHeaderTextHeading.style.marginTop = '0';
  sjHeaderTextSubheading.style.display = 'none';
  sjHeaderTextProgressBar.style.display = 'none';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = 'none';
  curriculumPageHeader.style.padding = '0';
  curriculumPageHeader.style.backgroundImage =
    'linear-gradient(315deg,#fde1fe,#f5f6fe 72%)';
  curriculumPageHeader.style.border = '0';

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
  headerTextAndImgContainer.style.margin = '96px 0';
  headerTextAndImgContainer.style.justifyContent = 'center';
  headerTextAndImgContainer.style.flexWrap = 'wrap';
  headerTextAndImgContainer.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.style.display = 'block';
  headingFloaterText.style.display = 'block';
  container.append(headingFloaterText, mainHeading, headingParagraph, btn);

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

        styleGroupHeading(newGroupHeading);

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
  const headingFloaterText = document.querySelector('.sj-floater-text');
  const container = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  ); //DUPLICATE VAR
  const mainHeading = document.querySelector('.break-word'); //DUPLICATE VAR
  const backToCatalogLink = document.querySelector('.back-to-catalog');

  backToCatalogLink.style.display = 'none';

  const curriculumPageHeader = document.querySelector(
    '.top-row-grey.top-row-white-v2.padding-side.row-v2'
  );
  const headerTextAndImgContainer = document.querySelector(
    '.row.dp-row-flex-v2'
  );
  const sjHeaderTextContainer = document.querySelector(
    '.large-8.push-4.columns.sj-summary.cp-summary-wrapper'
  );
  const sjHeaderTextHeading = document.querySelector('.break-word');
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
  const courseDetailsCard = document.querySelector('.course-details-card');
  const courseDetailCardListItems = courseDetailsCard.querySelectorAll('li');
  const checkboxIcon = document.querySelector('.checkbox-icon');
  const courseDetailsCardLink = document.querySelector(
    '.course-details-card-link'
  );

  //STYLING OF CURRICULUM PAGE GRID AND DETAILS CARD
  bodyMainContainer.style.display = 'grid';
  bodyMainContainer.style.gridTemplateColumns = '1fr';
  bodyMainContainer.style.width = '90%';

  courseDetailsCard.style.margin = '32px 0 56px 0';
  courseDetailsCard.style.justifySelf = 'center';
  bodyMainContainer.append(courseDetailsCard);

  courseDetailsCardLink.style.display = 'none';

  if (!view.loaded) {
    courseDetailCardListItems.forEach((li) => {
      const checkboxClone = checkboxIcon.cloneNode(true);
      li.prepend(checkboxClone);
    });
  }

  bodyMainContainer.style.columnGap = '24px';
  InnerContentContainer.style.width = '100%';

  //STYLING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  sjHeaderTextHeading.style.fontWeight = '600';
  sjHeaderTextHeading.style.fontSize = '36px';
  sjHeaderTextHeading.style.lineHeight = '43.2px';
  sjHeaderTextHeading.style.letterSpacing = '-0.5px';
  sjHeaderTextHeading.style.marginTop = '0';
  sjHeaderTextSubheading.style.display = 'none';
  sjHeaderTextProgressBar.style.display = 'none';

  //STYLING OF CURRICULUM PAGE TEXT HEADER BACKGROUND CONTAINER
  curriculumPageHeader.style.maxWidth = 'none';
  curriculumPageHeader.style.padding = '0';
  curriculumPageHeader.style.backgroundImage =
    'linear-gradient(315deg,#fde1fe,#f5f6fe 72%)';
  curriculumPageHeader.style.border = '0';

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
  headerTextAndImgContainer.style.margin = '96px 0';
  headerTextAndImgContainer.style.justifyContent = 'center';
  headerTextAndImgContainer.style.flexWrap = 'wrap';
  headerTextAndImgContainer.style.gap = '24px';

  //RENDERING OF CURRICULUM PAGE TEXT HEADING ON LEFT
  headingParagraph.style.display = 'block';
  headingFloaterText.style.display = 'block';
  container.append(
    headingFloaterText,
    mainHeading,
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

        styleGroupHeading(newGroupHeading);

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
  pageElements.lesson.codeBlocks = new Array(
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

  pageElements.lesson.codeBlocks
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
    initCatalog();
  } else if (view.isCourseDetailsPage) {
    view.viewport === 'desktop'
      ? desktopCourseDetailsPageStyling()
      : mobileCourseDetailsPageStyling();
  } else if (view.isPageDetailPath) {
    view.viewport === 'desktop' ? desktopPathCourseDetailsPageStyling() : null;
  } else if (view.isPageCatalogPath) {
    view.viewport === 'desktop' ? desktopPathCatalogPageStyling() : null;
  } else if (view.isLoginPage) {
    view.viewport === 'desktop'
      ? desktopLoginPageStyling()
      : mobileLoginPageStyling();
  } else if (view.isSignUpPage) {
    view.viewport === 'desktop'
      ? desktopSignUpPageStyling()
      : mobileSignUpPageStyling();
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
  globalElements.footer.style.display = 'flex';

  if (view.isLessonsPage && view.viewport === 'mobile') {
    globalElements.footer.style.display = 'none';
  }

  let contentContainer = view.isLessonsPage
    ? document.querySelector('.sj-page-lesson')
    : document.querySelector('#skilljar-content');

  contentContainer.append(globalElements.footer);

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
