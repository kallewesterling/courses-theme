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

// hide all before making adjustments
document.querySelector("body").style.setProperty("display", "none");

/**
 * Simple logger utility for console messages with styling.
 * Logs messages only if in staging or admin environment.
 */
const logger = {
  enabled() {
    return (
      CG.env.isStaging || CG.env.isAdmin || CG.page.isSignup || CG.page.isLogin
    );
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

/**
 * This function hides the given element by setting its display style to "none".
 * @param {HTMLElement} element - The element to hide.
 */
const hide = (element) => setStyle(element, { display: "none !important" });

/**
 * This function shows the body element by removing any display style overrides.
 * It sets the display style to undefined, allowing it to revert to its default behavior.
 * @returns {void}
 */
const showBody = () => setStyle(CG.dom.body, { display: undefined });

/**
 * Sets the text content of an HTML element.
 * @param {HTMLElement} element - The target HTML element.
 * @param {string} value - The text content to set.
 * @param {string} [auto=""] - The fallback text content if value is undefined or null.
 * @returns {void}
 */
const text = (element, value, auto = "") => {
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  } else if (element) {
    element.textContent = auto;
  } else {
    logger.warn(
      "text(): Element is null or undefined. Tried to set text to:",
      value
    );
  }
};

/**
 * Sets the placeholder attribute of an HTML element.
 * @param {HTMLElement} element - The target HTML element.
 * @param {string} value - The placeholder text to set.
 * @returns {void}
 */
const placeholder = (element, value) => {
  if (element && value !== undefined && value !== null) {
    element.setAttribute("placeholder", value);
  } else {
    logger.warn(
      "placeholder(): Element is null or undefined. Tried to set placeholder to:",
      value
    );
  }
};

/**
 * Shortcut to querySelector function.
 * @param {string} selector - The CSS selector to query.
 * @returns {HTMLElement|null} The first matching element or null if not found.
 */
const Q = (selector, root = document) => root.querySelector(selector);

/**
 * Shortcut to querySelectorAll function.
 * @param {string} selector - The CSS selector to query.
 * @returns {NodeListOf<HTMLElement>} A list of matching elements.
 */
const A = (selector, root = document) => root.querySelectorAll(selector);

/**
 * Shortcut to verifying the existence of an element.
 * @param {string} selector - The CSS selector to query.
 * @returns {HTMLElement|false} The first matching element or false if not found.
 */
const c = (selector) => Q(selector) || false;

const CONFIG = {
  logo: el(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "38 45 402 41",
      fill: "#6226FB",
      class: "header-center-img header-logo-svg loading",
      alt: "Go home",
      "data-was-processed": "true",
    },
    [
      el("path", {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M73.1585 67.6636C73.4859 66.5314 73.6637 65.2907 73.6637 63.9412C73.6637 55.5005 66.7016 46 59.748 46C52.7944 46 45.8322 55.5005 45.8322 63.9412C45.8322 65.7815 46.1631 67.4196 46.7528 68.856L42.573 68.6204C40.8706 68.5244 39.3022 69.7413 39.5677 71.4298C39.6707 72.0848 39.8669 72.7552 40.2175 73.3341C39.0342 74.1686 38.5508 75.7027 39.5096 76.905C40.4721 78.1118 41.8853 79.2239 43.8251 79.2239C45.9291 79.2239 47.1954 78.6787 47.9644 77.9941C48.0205 78.2931 48.1363 78.5875 48.3191 78.8657C49.2634 80.3031 50.8274 81.883 53.1396 81.883C57.073 81.883 57.5116 79.4063 57.7318 78.1635C57.749 78.0662 57.7649 77.9765 57.781 77.8961L60.4095 76.5782L63.038 77.8961C63.0541 77.9765 63.07 78.066 63.0871 78.1633C63.3074 79.4061 63.7459 81.883 67.6794 81.883C69.9914 81.883 71.5556 80.3031 72.4999 78.8657C72.537 78.8093 72.5714 78.7521 72.6029 78.6942C73.3441 79.0154 74.325 79.2239 75.6263 79.2239C77.5662 79.2239 78.9794 78.1118 79.942 76.905C81.1207 75.4266 80.1194 73.4471 78.3174 72.8826L77.7221 72.6961C79.4704 71.7875 79.7277 70.0743 79.5405 68.573C79.3289 66.8766 77.4855 66.1434 75.8764 66.7087L73.1585 67.6636ZM60.412 76.5539H60.4073L60.4095 76.5551L60.412 76.5539Z",
      }),
      el("path", {
        d: "M104.707 78.1485C96.7215 78.1485 91.6155 72.9526 91.6155 63.7923C91.6155 55.1324 97.3741 49.821 104.975 49.821C111.54 49.821 116.262 53.5929 116.954 59.9819H111.732C111.233 56.4795 108.93 54.0932 104.975 54.0932C100.215 54.0932 96.7983 57.7496 96.7983 63.7923C96.7983 70.0659 100.177 73.8764 104.86 73.8764C108.853 73.8764 111.502 71.2976 112.039 67.7181H117.069C116.416 73.9534 111.924 78.1485 104.707 78.1485ZM120.729 77.4557V50.5138H125.413V59.5201C125.413 60.0589 125.375 60.6363 125.259 61.3675C126.296 59.4816 128.062 58.0575 131.018 58.0575C135.164 58.0575 137.621 60.9827 137.621 65.6013V77.4557H132.937V66.2941C132.937 63.5229 131.594 61.7909 129.406 61.7909C127.102 61.7909 125.413 63.8308 125.413 66.448V77.4557H120.729ZM147.701 78.1485C144.437 78.1485 141.251 75.993 141.251 72.2984C141.251 68.0645 144.514 66.602 148.545 66.0631L151.233 65.7167C152.768 65.5243 153.306 64.947 153.306 64.0233C153.306 62.7146 152.231 61.56 150.234 61.56C148.046 61.56 146.664 62.7916 146.472 64.7545H141.635C141.942 60.8287 145.128 58.0575 149.966 58.0575C155.686 58.0575 157.989 61.1366 157.989 66.4095V77.4557H153.651V76.6859C153.651 76.07 153.728 75.4928 153.843 74.8769C152.845 76.7245 150.925 78.1485 147.701 78.1485ZM148.967 74.6846C151.463 74.6846 153.459 72.837 153.459 70.1815V68.1415C153.037 68.5264 152.384 68.7188 151.233 68.9498L149.697 69.2577C147.508 69.681 146.011 70.4124 146.011 72.1058C146.011 73.7608 147.317 74.6846 148.967 74.6846ZM162.569 77.4557V58.6733H167.253V77.4557H162.569ZM162.454 55.8252V50.8987H167.33V55.8252H162.454ZM172.092 77.4557V58.6733H176.776V59.5201C176.776 60.0589 176.737 60.6363 176.622 61.3675C177.659 59.4816 179.424 58.0575 182.381 58.0575C186.527 58.0575 188.984 60.9827 188.984 65.6013V77.4557H184.3V66.2941C184.3 63.5229 182.956 61.7909 180.768 61.7909C178.465 61.7909 176.776 63.8308 176.776 66.448V77.4557H172.092ZM201.981 86C196.453 86 193.305 83.0365 193.305 78.7644H198.065C198.142 80.9966 199.562 82.3053 202.096 82.3053C204.553 82.3053 206.626 80.8427 206.626 78.0329V75.993C206.626 75.1465 206.664 74.3766 206.78 73.6454C205.666 75.3388 203.862 76.7629 200.944 76.7629C196.069 76.7629 192.537 73.3375 192.537 67.4102C192.537 61.56 196.606 58.0575 200.714 58.0575C204.015 58.0575 205.666 59.4046 206.78 61.3675C206.664 60.7132 206.626 60.2129 206.626 59.5201V58.6733H211.31V76.8784C211.31 83.0365 207.509 86 201.981 86ZM202.134 73.0296C204.898 73.0296 206.895 70.6817 206.895 67.4102C206.895 64.1387 204.898 61.7909 202.134 61.7909C199.293 61.7909 197.297 64.1387 197.297 67.4102C197.297 70.6817 199.293 73.0296 202.134 73.0296ZM222.633 78.1485C218.87 78.1485 215.914 75.5697 215.914 70.6048V58.6733H220.636V69.8735C220.636 72.4907 221.788 74.3766 224.053 74.3766C226.433 74.3766 228.122 72.606 228.122 69.8349V58.6733H232.806V77.4557H228.161V76.6859C228.161 76.1086 228.238 75.4544 228.353 74.8769C227.393 76.6859 225.742 78.1485 222.633 78.1485ZM243.077 78.1485C239.814 78.1485 236.628 75.993 236.628 72.2984C236.628 68.0645 239.891 66.602 243.922 66.0631L246.609 65.7167C248.145 65.5243 248.683 64.947 248.683 64.0233C248.683 62.7146 247.608 61.56 245.611 61.56C243.423 61.56 242.041 62.7916 241.849 64.7545H237.012C237.319 60.8287 240.505 58.0575 245.342 58.0575C251.063 58.0575 253.366 61.1366 253.366 66.4095V77.4557H249.028V76.6859C249.028 76.07 249.105 75.4928 249.22 74.8769C248.222 76.7245 246.302 78.1485 243.077 78.1485ZM244.344 74.6846C246.84 74.6846 248.836 72.837 248.836 70.1815V68.1415C248.414 68.5264 247.761 68.7188 246.609 68.9498L245.074 69.2577C242.886 69.681 241.388 70.4124 241.388 72.1058C241.388 73.7608 242.694 74.6846 244.344 74.6846ZM257.946 77.4557V58.6733H262.63V60.0974C262.63 60.7902 262.591 61.3675 262.476 62.0603C263.474 59.9435 265.164 58.0575 267.966 58.0575C268.35 58.0575 268.657 58.096 268.964 58.173V62.7146C268.657 62.6377 268.235 62.5607 267.621 62.5607C264.741 62.5607 262.63 64.0233 262.63 68.1415V77.4557H257.946ZM278.892 78.1485C273.939 78.1485 270.33 74.7616 270.33 68.1415C270.33 61.406 274.592 58.0575 278.968 58.0575C281.886 58.0575 283.689 59.5586 284.765 61.3675C284.611 60.6747 284.611 60.0974 284.611 59.5201V50.5138H289.295V77.4557H284.611V76.6859C284.611 76.0316 284.611 75.5314 284.765 74.8769C284.036 76.2626 282.346 78.1485 278.892 78.1485ZM280.004 74.4536C282.808 74.4536 284.881 71.8748 284.881 68.103C284.881 64.2542 282.808 61.7909 280.004 61.7909C277.202 61.7909 275.091 64.3696 275.091 68.103C275.091 71.9904 277.202 74.4536 280.004 74.4536Z",
      }),
      el("path", {
        d: "M315.566 78.3906C312.897 78.3906 310.475 77.7656 308.301 76.5156C306.139 75.2656 304.44 73.5404 303.203 71.3398C301.979 69.1393 301.367 66.6914 301.367 63.9961C301.367 61.3008 301.979 58.8529 303.203 56.6523C304.44 54.4518 306.139 52.7266 308.301 51.4766C310.475 50.2266 312.897 49.6016 315.566 49.6016C317.741 49.6016 319.798 50.0443 321.738 50.9297C323.678 51.8021 325.286 53.026 326.562 54.6016C327.852 56.1641 328.626 57.9089 328.887 59.8359H322.285C321.908 58.5208 321.094 57.4466 319.844 56.6133C318.607 55.7799 317.181 55.3633 315.566 55.3633C313.262 55.3633 311.328 56.1901 309.766 57.8438C308.216 59.4844 307.441 61.5352 307.441 63.9961C307.441 66.457 308.216 68.5143 309.766 70.168C311.328 71.8216 313.262 72.6484 315.566 72.6484C317.194 72.6484 318.633 72.1927 319.883 71.2812C321.146 70.3698 321.96 69.2109 322.324 67.8047H328.965C328.431 70.9167 326.914 73.4622 324.414 75.4414C321.927 77.4076 318.978 78.3906 315.566 78.3906ZM339.845 57.9609C341.265 57.9609 342.599 58.2214 343.849 58.7422C345.112 59.263 346.193 59.9792 347.091 60.8906C348.003 61.7891 348.719 62.8763 349.24 64.1523C349.774 65.4154 350.041 66.763 350.041 68.1953C350.041 70.1094 349.591 71.8477 348.693 73.4102C347.808 74.9727 346.584 76.1966 345.021 77.082C343.472 77.9544 341.746 78.3906 339.845 78.3906C336.942 78.3906 334.513 77.4206 332.56 75.4805C330.607 73.5404 329.63 71.112 329.63 68.1953C329.63 65.2786 330.607 62.8438 332.56 60.8906C334.513 58.9375 336.942 57.9609 339.845 57.9609ZM339.845 63.3516C338.504 63.3516 337.384 63.8138 336.486 64.7383C335.601 65.6497 335.158 66.8021 335.158 68.1953C335.158 69.5495 335.601 70.6888 336.486 71.6133C337.384 72.5378 338.504 73 339.845 73C341.16 73 342.267 72.5378 343.166 71.6133C344.064 70.6888 344.513 69.5495 344.513 68.1953C344.513 66.8021 344.064 65.6497 343.166 64.7383C342.28 63.8138 341.173 63.3516 339.845 63.3516ZM365.003 58.3516H370.648V78H365.003V75.4023C363.766 77.3945 361.995 78.3906 359.691 78.3906C357.178 78.3906 355.198 77.5964 353.753 76.0078C352.321 74.4193 351.605 72.2318 351.605 69.4453V58.3516H357.249V68.7227C357.249 70.0247 357.601 71.0664 358.304 71.8477C359.007 72.6159 359.951 73 361.136 73C362.295 73 363.226 72.6159 363.929 71.8477C364.645 71.0664 365.003 70.0247 365.003 68.7227V58.3516ZM383.735 57.9609C384.139 57.9609 384.77 58.0391 385.63 58.1953V63.3125C384.835 63.1302 384.152 63.0391 383.579 63.0391C382.134 63.0391 380.949 63.4883 380.024 64.3867C379.113 65.2721 378.657 66.5807 378.657 68.3125V78H373.012V58.3516H378.657V60.5977C379.868 58.8398 381.561 57.9609 383.735 57.9609ZM394.108 78.3906C391.517 78.3906 389.401 77.7721 387.76 76.5352C386.133 75.2852 385.221 73.5599 385.026 71.3594H390.436C390.488 72.0234 390.833 72.5573 391.471 72.9609C392.109 73.3646 392.897 73.5664 393.834 73.5664C394.668 73.5664 395.312 73.4362 395.768 73.1758C396.237 72.9154 396.471 72.5508 396.471 72.082C396.471 71.6523 396.269 71.3008 395.866 71.0273C395.462 70.7539 394.935 70.5521 394.284 70.4219C393.633 70.2786 392.91 70.1419 392.116 70.0117C391.334 69.8815 390.553 69.6992 389.772 69.4648C388.991 69.2305 388.274 68.931 387.623 68.5664C386.972 68.2018 386.445 67.668 386.041 66.9648C385.638 66.2487 385.436 65.3958 385.436 64.4062C385.436 62.5443 386.139 61.0078 387.545 59.7969C388.965 58.5729 390.859 57.9609 393.229 57.9609C395.468 57.9609 397.389 58.5339 398.991 59.6797C400.592 60.8255 401.51 62.4401 401.745 64.5234H396.061C396.022 64.0026 395.735 63.5599 395.202 63.1953C394.668 62.8307 393.971 62.6484 393.112 62.6484C392.435 62.6484 391.888 62.7656 391.471 63C391.067 63.2214 390.866 63.5534 390.866 63.9961C390.866 64.3997 391.067 64.7253 391.471 64.9727C391.888 65.207 392.422 65.3828 393.073 65.5C393.724 65.6172 394.44 65.7344 395.221 65.8516C396.002 65.9688 396.784 66.151 397.565 66.3984C398.359 66.6458 399.082 66.9779 399.733 67.3945C400.384 67.7982 400.911 68.3971 401.315 69.1914C401.732 69.9857 401.94 70.9362 401.94 72.043C401.94 73.8398 401.185 75.3503 399.674 76.5742C398.177 77.7852 396.321 78.3906 394.108 78.3906ZM422.098 67.5117C422.098 68.2018 422.059 68.8724 421.98 69.5234H407.391C407.586 70.7995 408.139 71.8216 409.051 72.5898C409.962 73.3451 411.076 73.7227 412.391 73.7227C413.471 73.7227 414.35 73.5143 415.027 73.0977C415.717 72.668 416.141 72.1016 416.297 71.3984H421.824C421.499 73.5078 420.49 75.2005 418.797 76.4766C417.104 77.7526 415.021 78.3906 412.547 78.3906C410.646 78.3906 408.901 77.9414 407.312 77.043C405.737 76.1315 404.493 74.888 403.582 73.3125C402.671 71.724 402.215 69.9792 402.215 68.0781C402.215 65.2266 403.198 62.8307 405.164 60.8906C407.143 58.9375 409.565 57.9609 412.43 57.9609C414.174 57.9609 415.789 58.3776 417.273 59.2109C418.758 60.0443 419.93 61.1966 420.789 62.668C421.661 64.1393 422.098 65.7539 422.098 67.5117ZM407.664 65.9297H416.219C416.141 64.9531 415.711 64.1393 414.93 63.4883C414.148 62.8372 413.23 62.5117 412.176 62.5117C411.069 62.5117 410.125 62.7982 409.344 63.3711C408.562 63.944 408.003 64.7969 407.664 65.9297ZM431.455 78.3906C428.864 78.3906 426.748 77.7721 425.107 76.5352C423.479 75.2852 422.568 73.5599 422.373 71.3594H427.783C427.835 72.0234 428.18 72.5573 428.818 72.9609C429.456 73.3646 430.244 73.5664 431.181 73.5664C432.015 73.5664 432.659 73.4362 433.115 73.1758C433.584 72.9154 433.818 72.5508 433.818 72.082C433.818 71.6523 433.616 71.3008 433.213 71.0273C432.809 70.7539 432.282 70.5521 431.63 70.4219C430.979 70.2786 430.257 70.1419 429.463 70.0117C428.681 69.8815 427.9 69.6992 427.119 69.4648C426.338 69.2305 425.621 68.931 424.97 68.5664C424.319 68.2018 423.792 67.668 423.388 66.9648C422.985 66.2487 422.783 65.3958 422.783 64.4062C422.783 62.5443 423.486 61.0078 424.892 59.7969C426.311 58.5729 428.206 57.9609 430.576 57.9609C432.815 57.9609 434.736 58.5339 436.338 59.6797C437.939 60.8255 438.857 62.4401 439.091 64.5234H433.408C433.369 64.0026 433.082 63.5599 432.548 63.1953C432.015 62.8307 431.318 62.6484 430.459 62.6484C429.782 62.6484 429.235 62.7656 428.818 63C428.414 63.2214 428.213 63.5534 428.213 63.9961C428.213 64.3997 428.414 64.7253 428.818 64.9727C429.235 65.207 429.768 65.3828 430.42 65.5C431.071 65.6172 431.787 65.7344 432.568 65.8516C433.349 65.9688 434.13 66.151 434.912 66.3984C435.706 66.6458 436.429 66.9779 437.08 67.3945C437.731 67.7982 438.258 68.3971 438.662 69.1914C439.078 69.9857 439.287 70.9362 439.287 72.043C439.287 73.8398 438.532 75.3503 437.021 76.5742C435.524 77.7852 433.668 78.3906 431.455 78.3906Z",
      }),
    ]
  ),
  utm: UTM,
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
      attrs: {
        height: "20",
        width: "21",
      },
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
        viewBox: "0 0 24 24",
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
        viewBox: "0 0 24 24",
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
        viewBox: "0 0 24 24",
      },
      paths: ["M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"],
    },
    rightArrow: {
      attrs: {
        viewBox: "0 0 14 14",
        width: "20",
        height: "20",
        fill: "white",
        ariaHidden: "true",
      },
      paths: [
        "M11.2 5.6L11.2 2.8L8.4 2.8L8.4 5.6L11.2 5.6Z",
        "M11.2 11.2L11.2 8.4L8.4 8.4L8.4 11.2L11.2 11.2Z",
        "M8.4 2.8L8.4 -2.44784e-07L5.6 -3.67176e-07L5.6 2.8L8.4 2.8Z",
        "M8.4 14L8.4 11.2L5.6 11.2L5.6 14L8.4 14Z",
        "M8.4 8.4L8.4 5.6L5.6 5.6L5.6 8.4L8.4 8.4Z",
        "M14 8.4L14 5.6L11.2 5.6L11.2 8.4L14 8.4Z",
        "M2.8 8.4L2.8 5.6L-2.15213e-06 5.6L-2.27452e-06 8.4L2.8 8.4Z",
      ],
    },
  },
};

const CG = {
  env: {
    isStaging: window.location.href.includes("chainguard-test"),
    hasUser: typeof skilljarUser !== "undefined",
    hasGroups: typeof skilljarUserStudentGroups !== "undefined",
    hasCourseSeries: typeof skilljarCourseSeries !== "undefined",
    hasCourse: typeof skilljarCourse !== "undefined",
    hasCatalogPage: typeof skilljarCatalogPage !== "undefined",
    hasCourseProgress: typeof skilljarCourseProgress !== "undefined",
    hasCourseBoxes: [...A(".coursebox-container")].length > 0,

    get isAdmin() {
      if (!this.hasUser) return false;

      return CG.state.user.email === "kalle.westerling@chainguard.dev";
    },

    get isInternal() {
      if (!this.hasUser) return false;

      if (CG.state.user.email.includes("@chainguard.dev")) return true;

      if (!this.hasGroups) return false;

      return skilljarUserStudentGroups
        .map((d) => d.id)
        .includes("a7iai6t7agi9");
    },

    get isPartner() {
      if (!this.hasUser) return false;

      // all internal users get partner access
      if (CG.state.user.email.includes("@chainguard.dev")) return true;

      if (!this.hasGroups) return false;

      return skilljarUserStudentGroups
        .map((d) => d.id)
        .includes("1axsvmzhtbb95");
    },

    get isOnlyPartner() {
      return this.isPartner && skilljarUserStudentGroups.length === 1;
    },
  },
  page: {
    isCatalog: c(".sj-page-catalog"),
    isLanding: c(".sj-page-catalog-root"),
    isSignedUp: c(".sj-page-curriculum"),
    isCourseDetails: c(".sj-page-detail-course"),
    isLesson: c(".sj-page-lesson"),
    isLogin: c(".sj-page-login"),
    isSignup: c(".sj-page-signup"),
    isPageDetail: c(".sj-page-detail-bundle.sj-page-detail-path"),
    isPageCatalog: c(".sj-page-series.sj-page-path"),
    is404: c(".sj-page-error-404"),
    // hasCertificate: c(".cp-certificate"),
    isPartner404:
      [
        "/page/partners",
        ...Object.keys(CONFIG.partners).map((d) => `/path/${d}`),
      ].find((d) => window.location.href.includes(d)) || false,

    get isCoursePage() {
      return this.isPageDetail || this.isCourseDetails || this.isSignedUp;
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
    crumbs: [],

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
          id: skilljarCourse.id,
          publishedCourseId: skilljarCourse.publishedCourseId,
          tags: skilljarCourse.tags,
          title: skilljarCourse.title,
          short_description: skilljarCourse.short_description,
          long_description_html: skilljarCourse.long_description_html,
          edit: `https://dashboard.skilljar.com/course/${skilljarCourse.id}`,
        }
      );

      if (CG.env.hasCourseProgress) {
        course.progress = skilljarCourseProgress;
        course.completed = skilljarCourseProgress.completed_at !== "";
      }

      if (CG.env.hasCourseSeries) {
        course.path = Object.assign(skilljarCourseSeries, {
          edit: `https://dashboard.skilljar.com/publishing/domains/${CG.state.domain.id}/published-paths/${skilljarCourseSeries.id}/edit`,
        });
      }

      return course;
    },

    get baseURL() {
      return `https://${this.domain.url}`;
    },

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

    get isRegistered() {
      return (slug) => this.courses.registered.includes(slug);
    },

    get isCompleted() {
      return (slug) => this.courses.completed.includes(slug);
    },
  },
  el: {
    floaterText: el("div", {
      className: "sj-floater-text",
      text: "Course",
    }),

    get shortDescription() {
      if (!CG.env.hasCourse && !CG.env.hasCourseSeries) return "";

      if (CG.env.hasCourseSeries) return skilljarCourseSeries.short_description;

      if (CG.env.hasCourse) return skilljarCourse.short_description;

      return "";
    },

    get headingParagraph() {
      return el("div", {
        className: "sj-heading-paragraph",
        text: this.shortDescription,
      });
    },
  },
  dom: {
    body: document.body,
    bodyHeader: Q("#header"),
    headerLeft: Q("#header-left"),
    headerRight: Q("#header-right"),
    footerContainer: Q("#footer-container"),
    epFooter: Q("#ep-footer"),
    messages: Q("#messages"),
    courseBoxes: [...A(".coursebox-container")],
    catalogContent: Q("#catalog-content"),
    catalogCourses: Q("#catalog-courses"),
    mainContainer: Q("#main-container"),

    get contentContainer() {
      return CG.page.isLesson ? Q(".sj-page-lesson") : Q("#skilljar-content");
    },

    header: {
      wrapper: Q(".cp-summary-wrapper") || Q(".dp-summary-wrapper"),
      floaterText: Q(".sj-floater-text"),
      mainHeading: Q(".break-word"),
      courseInfo: Q(".sj-course-info-wrapper") || Q(".sj-heading-paragraph"),
      ctaBtnWrapper: Q("#resume-button") || Q("#purchase-button-wrapper-large"),
      registerBtn: Q("#purchase-button-wrapper-large a"),
      ctaBtn: Q("#resume-button a"),
      ctaBtnText: Q("#resume-button a span"),
    },
    courseContainer: Q("#dp-details") || Q("#cp-content"),
    curriculumContainer: A(".dp-curriculum")[0] || Q("#curriculum-list"),

    tabs: {
      container: Q(".tabs"),

      get curriculumSection() {
        return (
          Q("section #curriculumSection", CG.dom.tabs.container) ||
          Q("section:nth-child(1)", CG.dom.tabs.container)
        );
      },

      get aboutSection() {
        return (
          Q("section #aboutSection", CG.dom.tabs.container) ||
          Q("section:nth-child(2)", CG.dom.tabs.container)
        );
      },
    },

    local: {},

    auth: {
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
      loginForm: Q("#login_form"),
      loginText: Q("#login-tab-left span span"),
      signupTabTextSpan: Q("#login-tab-right span"),
      forgotPasswordLink: Q("a.forgot-password"),

      // signup specific
      loginTabTextSpan: Q("#login-tab-left a span"),
      signupForm: Q("#signup_form"),
      signupTabText: Q("#login-tab-right a") || Q("#login-tab-right span"),

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

      button: Q("#button-sign-in") || Q("#button-sign-up"),

      method: Q(".sj-text-sign-in-with") || Q(".sj-text-sign-up-with"),

      login: Q("#login-tab-left a span") || Q("#login-tab-left span span"),

      signup: Q("#login-tab-right a") || Q("#login-tab-right span"),

      get altMethod() {
        return Q("span", CG.dom.auth.method);
      },
    },
  },

  data: {
    partnerErrorMessage: `If you are a partner and trying to access our Partner courses, you have to first <a href="/auth/login?next=%2Fpage%2Fpartners">sign in or sign up for our Courses platform</a>.`,
  },
};

/**
 * Add a breadcrumb to the global state
 * @param {string} label - The label for the breadcrumb
 * @param {string} href - The href for the breadcrumb
 * @param {boolean} prependBase - Whether to prepend the base URL to the href
 */
function addCrumb(label, href, prependBase = false) {
  if (prependBase) href = `${CG.state.baseURL}${href}`;
  CG.state.crumbs.push([label, href]);
}

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

/**
 * Update all links on the page to use either the production or staging domain.
 * @param {boolean} useTestDomain - If true, update links to use the staging domain; otherwise, use the production domain.
 * @example
 * // Update links to use the staging domain
 * updateLinks(true);
 *
 * // Update links to use the production domain
 * updateLinks(false);
 */
function updateLinks(useTestDomain) {
  const links = A(
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
    } else if (!useTestDomain && url.hostname === CONFIG.domains.stage.url) {
      url.hostname = CONFIG.domains.prod.url;
    }
    link.href = url.toString();
  });
}

/**
 * Add a "Partner Courses" menu item to the header if the user is a partner.
 */
function addPartnerMenu() {
  const partnerItem = el("a", {
    href: "/page/partners",
    text: "Partner Courses",
  });
  CG.dom.headerLeft.appendChild(partnerItem);
  CG.dom.mobileHeader.left.appendChild(partnerItem.cloneNode(true));
}

/**
 * Adds a debug heading with environment information and a staging toggle.
 */
function debugHeading() {
  // adding a dropdown info circle
  const infoCircle = el(
    "div",
    { class: "align-vertical info-circle-wrapper" },
    [el("div", { class: "info-circle", text: "I" })]
  );
  CG.dom.headerRight.insertBefore(infoCircle, CG.dom.headerRight.firstChild);

  let dropdownOptions = [
    el("span", {
      text: "Handler: " + pageHandlers.find(({ test }) => test).handler.name,
    }),
    el("input", {
      type: "checkbox",
      id: "cg-baseurl-staging",
      checked: CG.env.isStaging ? true : false,
    }),

    // Add course edit link
    CG.state.course.id
      ? el("a", { href: CG.state.course.edit, text: "Edit Course" })
      : null,

    // Add path edit link
    CG.state.course.path.id && CG.state.domain
      ? el("a", { href: CG.state.course.path.edit, text: "Edit Path" })
      : null,
  ]
    .filter(Boolean)
    .map((html) => el("li", {}, [html]));

  const dropdownMenu = el(
    "ul",
    { class: "info-circle-menu", hidden: true },
    dropdownOptions
  );

  CG.dom.headerRight.parentElement.insertBefore(
    dropdownMenu,
    CG.dom.headerRight.parentElement.firstChild
  );

  const trigger = Q(".info-circle-wrapper");
  const dropdown = Q(".info-circle-menu");

  trigger.addEventListener("click", () => {
    const x = trigger.getBoundingClientRect().x;

    const dropdownWidth = 200;
    const alignmentFactor = 0.7;

    const left = x - dropdownWidth * alignmentFactor;

    dropdown.style.left = `${left}px`;

    dropdown.hidden = !dropdown.hidden;
  });

  const checkbox = Q("#cg-baseurl-staging");

  // initial state update if needed
  updateLinks(checkbox.checked);

  // toggle behavior
  checkbox.addEventListener("change", function () {
    updateLinks(this.checked);
  });
}

/**
 * Removes elements from the DOM based on the provided selector(s).
 * @param {string|string[]} selector - A CSS selector string or an array of selector strings.
 * @example
 * // Remove a single element
 * remove('.ad-banner');
 *
 * // Remove multiple elements
 * remove(['.ad-banner', '#popup', '.sponsored-content']);
 */
function remove(selector) {
  if (!selector) return;

  if (selector instanceof HTMLElement) {
    try {
      selector.remove();
    } catch (e) {
      console.warn("Could not remove element:", selector, e);
    }
    return;
  }

  if (Array.isArray(selector)) {
    selector.forEach((sel) => remove(sel));
    return;
  }

  A(selector).forEach((el) => {
    try {
      el.remove();
    } catch (e) {
      console.warn("Could not remove element:", el, e);
    }
  });
}

/**
 * Renders a breadcrumb navigation element.
 * @param {HTMLElement} [targetElement] - The target element to render the breadcrumbs into. If not provided, a new div will be created.
 * @return {HTMLElement} The rendered breadcrumb navigation element.
 * @example
 * renderBreadcrumbs('#breadcrumb-container');
 */
function renderBreadcrumbs(targetElement) {
  if (
    !CG.state.crumbs ||
    !Array.isArray(CG.state.crumbs) ||
    CG.state.crumbs.length === 0
  )
    return;

  if (!targetElement)
    targetElement = el("div", {
      id: "breadcrumbs",
      className: CG.page.isPageCatalog ? "row dp-row-flex-v2" : "",
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
        CG.state.crumbs.map(([text, href], ix, arr) => {
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

  targetElement?.replaceChildren(nav);

  return targetElement;
}

/**
 * Generates and appends course sections to a specified parent element.
 * @param {Array} sections - An array of section objects containing details for each section.
 * @param {string} parentSelector - The CSS selector of the parent element to which sections will be appended.
 * @param {string} baseURL - The base URL for course links.
 * @example
 * makeSections(sectionsData, '#main-content', 'https://courses.example.com');
 */
function makeSections(
  sections,
  parentSelector = "#skilljar-content",
  baseURL = "https://courses.chainguard.dev"
) {
  const reg = (slug) => (CG.state.isRegistered(slug) ? "in-progress" : "");
  const compl = (slug) => (CG.state.isCompleted(slug) ? "completed" : "");

  sections.forEach((s) => {
    const card = (link) => {
      const r = reg(link.slug);
      const c = compl(link.slug);
      const className = `${c} ${r}`;
      const text = c ? "Completed" : r ? "In Progress" : "";
      const pill =
        c || r
          ? el("span", { className: `pill ${className}`, text })
          : undefined;

      return el(
        "a",
        {
          className: "no-select",
          href: `${baseURL}/${link.slug}`,
          title: link.isCourse ? "Start course" : "Start path",
        },
        [
          el("article", { className }, [
            el(
              "div",
              { className: "inner" },
              [
                pill,
                el("div", { className: "icon" }, [createClone(link.icon)]),
                el("h5", { text: link.isCourse ? "Course" : "Learning Path" }, [
                  el("span", { textContent: " | Free" }),
                ]),
                el("h3", { text: link.title }),
                el("p", { text: link.description }),
                link.hasBadge && !c
                  ? el("span", {
                      className: "pill badged",
                      text: "Get a Badge",
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
            s.links.map((link) => card(link))
          ),
        ]),
      ].filter(Boolean)
    );

    Q(parentSelector).append(section);
  });
}

/**
 * Creates an SVG icon element based on the specified type and attributes.
 * @param {string} type - The type of icon to create (e.g., "checkbox", "burger").
 * @param {Object} attrs - Additional attributes to apply to the SVG element.
 * @returns {SVGElement} The created SVG icon element.
 */
function createClone(
  type = "checkbox",
  attrs = {
    // xmlns: "http://www.w3.org/2000/svg",
    // width: "20",
    // height: "21",
    // viewBox: "0 0 20 21",
    // fill: "none",
  }
) {
  if (!CONFIG.icons[type]) {
    logger.error(`Icon type "${type}" not found in CONFIG.icons`);
    return null;
  }

  if (CONFIG.icons[type].attrs) {
    attrs = { ...CONFIG.icons[type].attrs, ...attrs };
  }

  if (!attrs["className"]) attrs.className = `clone-icon ${type}-icon`;

  const paths = CONFIG.icons[type].paths.map((d) => el("path", { d }));
  return el("svg", attrs, paths);
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

/**
 * Extracts curriculum elements from the given container and organizes them into sections and lessons.
 * @param {HTMLElement} curriculumParentContainer - The container element holding the curriculum structure.
 * @returns {Array} An array of section elements with their respective lessons.
 */
function getCurriculumElements(curriculumParentContainer = null) {
  if (!curriculumParentContainer)
    curriculumParentContainer = CG.dom.curriculumContainer;

  let elements = Array.from(
      A("[class^='lesson-'],.section", curriculumParentContainer)
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

  const output = sections
    .map((s) => [
      s,
      content.filter((d) => d[0] === s).filter((d) => d[1]),
      content.filter((d) => d[0] === s).filter((d) => !d[1]),
    ])
    .map((d) => {
      heading = d[1].length ? d[1][0][2] : "";
      return {
        section: d[0],
        heading,
        lessons: d[2],
        d,
      };
    });

  return output.map((d) => {
    const lessons = d.lessons.map((l) => {
      const text = l[2],
        icon = l[4],
        href = l[3] || "#";

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

    let headingElement;
    if (d.heading) {
      headingElement = el("h3", {
        className: "curriculum-header no-select",
        textContent: lessons.length > 1 ? d.heading : "Lessons",
      });
    } else if (!headingElement && lessons.length === 1) {
      headingElement = el("h3", { className: "curriculum-header no-select" }, [
        el("a", {
          textContent: lessons[0].text, // use first lesson as header if no section heading and only one lesson
          href: lessons[0].href,
        }),
      ]);

      lessons.shift(); // remove the first lesson since it's now the header
    } else {
      logger.warn(
        "Unexpected curriculum structure: no heading and multiple lessons"
      );
    }

    return el(
      "div",
      { className: "curriculum-wrapper" },
      [headingElement, ...lessons].filter(Boolean)
    );
  });
}

/**
 * Creates a course details card element with provided details and options.
 * @param {Object} details - An object containing course details.
 * @param {string} details.audience - The target audience for the course.
 * @param {string} details.time - The estimated time to complete the course.
 * @param {number} details.lessons - The number of lessons in the course.
 * @param {Object} options - An object containing options for the card.
 * @param {string} [options.btnText="Register"] - The text for the action button.
 * @param {string} [options.btnHref="#"] - The URL for the action button.
 * @param {boolean} [options.completed=false] - Indicates if the course is completed.
 * @returns {HTMLElement} The created course details card element.
 */
function createCourseDetailsCard(
  details,
  options = {
    btnText: "Register",
    btnHref: "#",
    completed: false,
  }
) {
  // Create main container
  const card = el("div", { className: "course-card" }, [
    el("h3", {
      className: "no-select",
      textContent: "Course Details",
    }),
    el("ul", { className: "no-select" }, [
      el("li", {}, [el("p", { text: details.audience })]),
      el("li", {}, [el("p", { text: details.time })]),
      el("li", {}, [el("p", { text: details.lessons + " Lessons" })]),
    ]),
  ]);

  // Link
  const link = el("a", {
    href: options.completed ? "#" : options.btnHref,
    textContent: options.completed ? "🎉 Completed" : options.btnText,
    className: `button ${options.completed ? "completed" : ""}`,
  });

  // add margin to link button
  setStyle(link, { marginLeft: "20px", marginRight: "20px" });

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
 * Creates a function to copy text to the clipboard and animate a tooltip.
 * @param {string} copyText - The text to copy to the clipboard.
 * @param {HTMLElement} tooltipContainer - The element to animate as a tooltip.
 * @return {Function} - A function that, when called, will copy the text and animate the tooltip.
 */
function toClipboard(copyText, tooltipContainer) {
  /**
   * Animates the tooltip by changing its opacity.
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
    const elem = Q(target);
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
 * Attempts to load and display sections for the current learning path.
 * Logs a warning if the path sections are not found.
 */
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
 * This function applies desktop-specific styling to a catalog page.
 */
function styleCatalog() {
  CG.dom.body.prepend(el("div", { id: "cg-bg" }));
  CG.data.sections = pathSections[skilljarCatalogPage.slug]; // ex. "partners"

  if (!CG.data.sections) CG.data.sections = pathSections["home"];

  if (!pathSections[skilljarCatalogPage.slug] && !CG.page.isLanding)
    logger.warn("Could not determine catalog section name, defaulting to home");

  // hide existing content
  hide(CG.dom.catalogContent);

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
 * This function applies styling to the 404 error page.
 */
function style404() {
  if (CG.page.isPartner404 && !CG.env.hasUser) {
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
 * This function applies general styling to the course details page.
 */
function styleCourseDetails() {
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

  let btnHref = "#";
  if (CG.dom.header.ctaBtnWrapper) {
    btnHref = CG.dom.header.registerBtn.href;
  } else {
    const links = [...A("p", courseInfo)]
      .filter((d) => d.textContent.toLowerCase().includes("learning path"))
      .map((p) => [...A("a", p)].filter((a) => a.innerHTML === "learning path"))
      .flat();

    if (links.length > 0) {
      btnHref = CONFIG.partners[skilljarCourseSeries.slug]?.checkout
        ? `/checkout/${CONFIG.partners[skilljarCourseSeries.slug]?.checkout}`
        : links[0].href;
    }
  }

  CG.data.card =
    typeof courseDetails !== "undefined"
      ? createCourseDetailsCard(courseDetails, {
          btnText: CG.dom.header.ctaBtnWrapper
            ? CG.dom.header.registerBtn.textContent
            : "Register for Learning Path",
          btnHref,
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
 * This function applies general styling to the path course details page.
 */
function stylePathCourseDetails() {
  // make path sections
  tryPathSections();
}

/**
 * This function applies desktop-specific styling to the path catalog page.
 */
function stylePathCatalogPage() {
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
 * Sets up floating lesson navigation buttons based on existing footer controls.
 * @returns {HTMLElement} The navigation wrapper element containing the previous and next buttons.
 */
function setupLessonNav() {
  // 1) Find canonical footer controls
  const footerPrev = Q("#lp-footer .prev-lesson-button");
  const footerNext = Q("#lp-footer .next-lesson-link");

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
    onclick: (e) => e.stopPropagation(),
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
    onclick: (e) => e.stopPropagation(),
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

  return btnWrapper;
}

/**
 * This function processes a code block element by adding a copy icon and functionality to copy the code to the clipboard.
 * @param {HTMLElement} elem - The code block element to process.
 * @return {void}
 */
function processCodeBlock(elem) {
  const codeEl = Q("code", elem);
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
  iconClone.addEventListener("click", toClipboard(copyText, tooltipContainer));

  // Mark that copy icon was added to this code block
  elem.dataset.copyAdded = "true";
}

/**
 * This function processes code blocks by adding a copy icon and functionality to copy the code to the clipboard.
 * It filters out code blocks that have the 'noCopy' or 'copyAdded' data attributes.
 * @param {NodeList} codeBlocks - A list of code block elements to process.
 * @return {void}
 */
function styleLesson() {
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

/**
 * This function applies styling to the authentication (login/signup) pages.
 */
function styleAuth() {
  text(CG.dom.auth.login, "Log In");
  text(CG.dom.auth.signup, "Sign Up");
  text(CG.dom.auth.google, "Continue with Google");
  text(CG.dom.auth.button, CG.page.isLogin ? "Log In" : "Sign Up");
  text(CG.dom.auth.labels.email, "Work Email");

  placeholder(CG.dom.auth.inputs.email, "Work Email");

  if (CG.page.isSignup) {
    text(CG.dom.auth.labels.fName, "First Name");
    text(CG.dom.auth.labels.lName, "Last Name");
    placeholder(CG.dom.auth.inputs.fName, "First Name");
    placeholder(CG.dom.auth.inputs.lName, "Last Name");
    placeholder(CG.dom.auth.inputs.password2, "Password Confirm");
    text(CG.dom.auth.labels.passwordConfirm, "Password Confirm");
    text(CG.dom.auth.labels.accessCode, "Access Code (optional)");
  }

  const authContainer = el("div", { id: "auth-container" }, [
    Q("#tabs"),
    el("div", { className: "auth-card" }, [
      CG.dom.auth.form,
      el("div", { className: "divider" }, [el("span", { textContent: "or" })]),
      CG.dom.auth.google,
      CG.dom.auth.TOS,
    ]),
  ]);

  CG.dom.contentContainer.append(authContainer);

  // move "Forgot Password?" to after Password
  if (CG.page.isLogin && CG.dom.auth.inputs.password)
    CG.dom.auth.inputs.password.parentElement.append(
      CG.dom.auth.forgotPasswordLink
    );

  if (CG.page.isSignup) {
    // add aria-labels to inputs' parent .row elements
    A("input").forEach((elem) => {
      if (!elem.getAttribute("id")) return;

      CG.dom.auth.rows[elem.getAttribute("id")] = elem.closest(".row");
      CG.dom.auth.rows[elem.getAttribute("id")].setAttribute(
        "aria-label",
        elem.getAttribute("id")
      );
    });

    // move Access Code field to after Password Confirm
    CG.dom.auth.rows.id_password2.insertAdjacentElement(
      "afterend",
      CG.dom.auth.rows.id_access_code
    );

    // add focus listeners to fade in labels
    CG.dom.auth.inputs.accessCode.addEventListener("focus", () => {
      setStyle(CG.dom.auth.rows.id_access_code, { opacity: "1" });
    });

    CG.dom.auth.inputs.accessCode.addEventListener("blur", () => {
      if (CG.dom.auth.inputs.accessCode.value === "") {
        setStyle(CG.dom.auth.rows.id_access_code, { opacity: "0.4" });
      }
    });

    setStyle(CG.dom.auth.rows.id_access_code, { opacity: "0.4" });
  }

  remove(CG.dom.auth.method);
}

/**
 * This function applies styling to the curriculum page.
 */
function styleCurriculumPage() {
  CG.dom.local = {
    card: {
      details: Q(".course-card"),
      link: Q(".course-card a"),
    },
  };

  CG.dom.tabs.aboutSection?.classList.add("active");

  CG.dom.tabs.container.append(
    Object.assign(CG.dom.tabs.aboutSection, { id: "aboutSection" }),
    Object.assign(CG.dom.tabs.curriculumSection, { id: "curriculumSection" })
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

const pageHandlers = [
  { test: () => CG.page.isLogin || CG.page.isSignup, handler: styleAuth },
  { test: () => CG.page.isCourseDetails, handler: styleCourseDetails },
  {
    test: () => CG.page.isSignedUp,
    handler: styleCurriculumPage,
  },
  { test: () => CG.page.isPageDetail, handler: stylePathCourseDetails },
  { test: () => CG.page.isPageCatalog, handler: stylePathCatalogPage },
  { test: () => CG.page.isLesson, handler: styleLesson },
  { test: () => CG.page.isCatalog || CG.page.isLanding, handler: styleCatalog },
  { test: () => CG.page.is404, handler: style404 },
];

/**
 * This function handles the overall page styling by determining the appropriate handler for the current page and executing it.
 * It also manages the placement of breadcrumbs, header elements, footer, and messages on course-related pages.
 */
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

  if (CG.page.isCoursePage || CG.page.isPageCatalog) {
    // make breadcrumbs
    const breadcrumbs = renderBreadcrumbs();

    // append elements to header
    if (CG.page.isCoursePage) {
      CG.dom.header.wrapper.prepend(breadcrumbs);

      CG.dom.header.wrapper.append(
        ...[
          CG.dom.header.floaterText || CG.el.floaterText,
          CG.dom.header.mainHeading,
          CG.dom.header.courseInfo || CG.el.headingParagraph,
          CG.dom.header.ctaBtnWrapper,
        ].filter(Boolean)
      );
    } else if (CG.page.isPageCatalog) {
      Q(".top-row-grey").prepend(breadcrumbs);
    }
  }

  // move footer
  CG.dom.contentContainer.append(CG.dom.footerContainer);

  // move messages
  CG.dom.contentContainer.prepend(CG.dom.messages);

  // hide Skilljar footer
  hide(CG.dom.epFooter);
}

/**
 * This function modifies the header to include a link to Chainguard's main website.
 * It creates a mobile header and adds the link to both mobile and desktop headers.
 */
function fixHeader() {
  const toChainguard = el("div", { id: "to-chainguard" }, [
    el("a", {
      href: getCorrectURL("https://www.chainguard.dev"),
      target: "_blank",
      rel: "noopener noreferrer",
      title: "Go to chainguard.dev",
      text: "Go to Chainguard →",
    }),
  ]);

  const mobileHeader = el("header", { id: "mobile-header", class: "headers" }, [
    el("div", { id: "mobile-header-left" }, []),
    el("div", { id: "mobile-header-right" }, [toChainguard]),
  ]);

  CG.dom.mainContainer.insertBefore(
    mobileHeader,
    CG.dom.bodyHeader.nextSibling
  );

  CG.dom.headerRight.insertBefore(
    toChainguard.cloneNode(true),
    CG.dom.headerRight.firstChild
  );

  CG.dom.mobileHeader = {
    container: mobileHeader,
    left: Q("#mobile-header-left"),
    right: Q("#mobile-header-right"),
  };
}

document.addEventListener("load", () => {
  logger.info("CG Desktop Script Loaded (load event)");
});

document.addEventListener("DOMContentLoaded", () => {
  logger.info("CG Desktop Script Loaded");

  if (CG.page.isLesson)
    // if a lesson page, we need to move the nav button before we modify the header
    CG.dom.contentContainer.append(Q("#left-nav-button"));

  // replace logo
  CG.dom.headerLeft.replaceChildren(
    el("div", { id: "logo-wrapper" }, [
      el(
        "a",
        {
          className: "header-logo-link focus-link-v2",
          href: CG.state.baseURL,
        },
        [CONFIG.logo]
      ),
    ])
  );

  // remove search container
  remove(".search-container");

  // setup breadcrumbs
  addCrumb("Home", CG.state.baseURL);

  // admin debug heading
  if (CG.env.isAdmin) debugHeading();

  CG.dom.bodyHeader.classList.add("headers");

  // add chainguard link
  if (!CG.page.isSignup && !CG.page.isLogin) fixHeader();

  // add partner menu item
  if (CG.env.isPartner) addPartnerMenu();

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

  handlePageStyling();

  // show all
  showBody();
});

/**
 * Ensure the completion popup element exists, creating it if necessary.
 * @returns {HTMLElement} The completion popup element.
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
 * Show the completion popup with animation and focus management.
 * @param {HTMLElement} elem - The completion popup element to show.
 */
function showCompletion(elem) {
  elem.setAttribute("aria-hidden", "false");
  setStyle(elem, { display: "block" });
  // Next paint to trigger transition
  requestAnimationFrame(() => setStyle(elem, { opacity: "1" }));
  // focus for accessibility
  const focusTarget = Q("#completion-card", elem);
  if (focusTarget) focusTarget.focus({ preventScroll: true });

  const countdownEl = Q("#completion-countdown", elem);
  if (countdownEl) {
    let remaining = CONFIG.confetti.autoHideMs / 1000;
    text(countdownEl, remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        text(countdownEl, remaining);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}

/**
 * Hide the completion popup with animation.
 * @param {HTMLElement} elem - The completion popup element to hide.
 */
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
 * Animate the completion popup with confetti and auto-hide functionality.
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

/**
 * Shoot confetti bursts with stars, circles, and logos.
 */
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
