const UTM = {
  utm_source: "courses",
  utm_medium: "referral",
  utm_campaign: "dev-enablement",
};

function getCorrectURL(link) {
  let url = new URL(link);

  // add UTM params for tracking if specified

  UTM
    ? Object.entries(UTM).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      })
    : undefined;

  return url.toString();
}

const el = (tag, props = {}, children = []) => {
  if (!tag) return null;
  const svgTags =
    tag === "svg" ||
    tag === "path" ||
    tag === "g" ||
    tag === "defs" ||
    tag === "clipPath";

  let n;
  if (svgTags) {
    n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  } else {
    n = document.createElement(tag);
  }
  for (const [k, v] of Object.entries(props)) {
    if (!v) continue;
    if (k === "className" && !svgTags) n.className = v;
    else if (k === "className" && svgTags) n.className.baseVal = v;
    else if (k === "textContent") n.textContent = v;
    else if (k === "text") n.textContent = v;
    else if (k === "innerHTML") n.innerHTML = v;
    else n.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children])
    .filter(Boolean)
    .forEach((child) => n.appendChild(child));
  return n;
};

const footerData = {
  logo: {
    href: "https://www.chainguard.dev/?utm_source=courses",
    svg: `<svg height="20" viewBox="0 0 1051 170" fill="#14003D" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M142.381 93.4236C143.741 88.7319 144.48 83.5906 144.48 77.9985C144.48 43.0218 115.557 3.65353 86.6691 3.65353C57.7816 3.65353 28.8578 43.0218 28.8578 77.9985C28.8578 85.6245 30.2328 92.4122 32.6826 98.3645L15.3182 97.3881C8.24572 96.9904 1.72988 102.033 2.83296 109.03C3.2608 111.744 4.07615 114.522 5.53233 116.921C0.616539 120.379 -1.39152 126.736 2.59162 131.718C6.59018 136.719 12.4611 141.327 20.5199 141.327C29.2607 141.327 34.5212 139.068 37.7159 136.231C37.9491 137.47 38.4301 138.69 39.1895 139.843C43.1126 145.799 49.61 152.346 59.2157 152.346C75.5561 152.346 77.3785 142.083 78.293 136.933C78.3645 136.53 78.4305 136.158 78.4974 135.825L89.4171 130.364L100.337 135.825C100.404 136.158 100.47 136.529 100.541 136.932L100.541 136.933C101.456 142.083 103.278 152.346 119.619 152.346C129.224 152.346 135.722 145.799 139.645 139.843C139.799 139.609 139.942 139.372 140.073 139.132C143.152 140.463 147.227 141.327 152.633 141.327C160.692 141.327 166.563 136.719 170.562 131.718C175.459 125.592 171.299 117.389 163.813 115.05L161.34 114.277C168.603 110.512 169.672 103.413 168.894 97.1917C168.015 90.1624 160.357 87.1238 153.672 89.4665L142.381 93.4236ZM89.4275 130.263C89.4211 130.263 89.4146 130.263 89.4081 130.263L89.4171 130.268L89.4275 130.263Z"></path><path d="M273.444 136.871C240.27 136.871 219.058 115.34 219.058 77.3815C219.058 41.4966 242.981 19.4871 274.56 19.4871C301.833 19.4871 321.45 35.117 324.321 61.5921H302.63C300.557 47.0787 290.988 37.1904 274.56 37.1904C254.784 37.1904 240.589 52.3418 240.589 77.3815C240.589 103.378 254.624 119.168 274.082 119.168C290.669 119.168 301.673 108.482 303.906 93.6494H324.799C322.088 119.487 303.428 136.871 273.444 136.871ZM340.007 134V22.3579H359.464V59.6783C359.464 61.9111 359.305 64.3035 358.826 67.3337C363.132 59.5188 370.469 53.6177 382.75 53.6177C399.974 53.6177 410.182 65.7389 410.182 84.8775V134H390.724V87.7483C390.724 76.2651 385.142 69.0881 376.051 69.0881C366.482 69.0881 359.464 77.541 359.464 88.3862V134H340.007ZM452.055 136.871C438.498 136.871 425.261 127.939 425.261 112.629C425.261 95.0848 438.817 89.0242 455.564 86.7914L466.728 85.356C473.107 84.5585 475.34 82.1662 475.34 78.3385C475.34 72.9158 470.875 68.1312 462.581 68.1312C453.49 68.1312 447.749 73.2348 446.951 81.3687H426.856C428.132 65.1009 441.369 53.6177 461.465 53.6177C485.228 53.6177 494.798 66.3768 494.798 88.2268V134H476.776V130.81C476.776 128.258 477.095 125.866 477.573 123.314C473.426 130.97 465.452 136.871 452.055 136.871ZM457.318 122.517C467.685 122.517 475.978 114.861 475.978 103.857V95.4037C474.224 96.9986 471.512 97.7961 466.728 98.753L460.348 100.029C451.257 101.783 445.037 104.814 445.037 111.831C445.037 118.689 450.46 122.517 457.318 122.517ZM513.824 134V56.1695H533.282V134H513.824ZM513.346 44.3674V23.9528H533.601V44.3674H513.346ZM553.385 134V56.1695H572.843V59.6783C572.843 61.9111 572.683 64.3035 572.205 67.3337C576.511 59.5188 583.847 53.6177 596.128 53.6177C613.353 53.6177 623.56 65.7389 623.56 84.8775V134H604.102V87.7483C604.102 76.2651 598.52 69.0881 589.429 69.0881C579.86 69.0881 572.843 77.541 572.843 88.3862V134H553.385ZM677.554 169.406C654.588 169.406 641.51 157.126 641.51 139.423H661.287C661.605 148.673 667.507 154.096 678.033 154.096C688.24 154.096 696.852 148.035 696.852 136.392V127.939C696.852 124.431 697.012 121.241 697.49 118.211C692.865 125.228 685.369 131.129 673.248 131.129C652.993 131.129 638.32 116.935 638.32 92.3735C638.32 68.1312 655.226 53.6177 672.291 53.6177C686.007 53.6177 692.865 59.1998 697.49 67.3337C697.012 64.6224 696.852 62.5491 696.852 59.6783V56.1695H716.31V131.608C716.31 157.126 700.521 169.406 677.554 169.406ZM678.192 115.659C689.675 115.659 697.969 105.93 697.969 92.3735C697.969 78.8169 689.675 69.0881 678.192 69.0881C666.39 69.0881 658.097 78.8169 658.097 92.3735C658.097 105.93 666.39 115.659 678.192 115.659ZM763.349 136.871C747.719 136.871 735.439 126.185 735.439 105.611V56.1695H755.056V102.581C755.056 113.426 759.841 121.241 769.25 121.241C779.139 121.241 786.156 113.904 786.156 102.421V56.1695H805.614V134H786.316V130.81C786.316 128.418 786.635 125.707 787.113 123.314C783.126 130.81 776.268 136.871 763.349 136.871ZM848.284 136.871C834.728 136.871 821.49 127.939 821.49 112.629C821.49 95.0848 835.047 89.0242 851.793 86.7914L862.957 85.356C869.337 84.5585 871.57 82.1662 871.57 78.3385C871.57 72.9158 867.104 68.1312 858.811 68.1312C849.72 68.1312 843.978 73.2348 843.181 81.3687H823.085C824.361 65.1009 837.599 53.6177 857.694 53.6177C881.458 53.6177 891.027 66.3768 891.027 88.2268V134H873.005V130.81C873.005 128.258 873.324 125.866 873.803 123.314C869.656 130.97 861.682 136.871 848.284 136.871ZM853.548 122.517C863.914 122.517 872.208 114.861 872.208 103.857V95.4037C870.453 96.9986 867.742 97.7961 862.957 98.753L856.578 100.029C847.487 101.783 841.267 104.814 841.267 111.831C841.267 118.689 846.69 122.517 853.548 122.517ZM910.054 134V56.1695H929.512V62.0706C929.512 64.9414 929.352 67.3337 928.874 70.2045C933.02 61.4327 940.038 53.6177 951.68 53.6177C953.275 53.6177 954.551 53.7772 955.827 54.0962V72.9158C954.551 72.5969 952.797 72.2779 950.245 72.2779C938.283 72.2779 929.512 78.3385 929.512 95.4037V134H910.054ZM997.069 136.871C976.495 136.871 961.503 122.836 961.503 95.4037C961.503 67.4932 979.206 53.6177 997.388 53.6177C1009.51 53.6177 1017 59.8378 1021.47 67.3337C1020.83 64.4629 1020.83 62.0706 1020.83 59.6783V22.3579H1040.29V134H1020.83V130.81C1020.83 128.099 1020.83 126.026 1021.47 123.314C1018.44 129.056 1011.42 136.871 997.069 136.871ZM1001.69 121.56C1013.34 121.56 1021.95 110.874 1021.95 95.2443C1021.95 79.2954 1013.34 69.0881 1001.69 69.0881C990.051 69.0881 981.279 79.7739 981.279 95.2443C981.279 111.353 990.051 121.56 1001.69 121.56Z"></path></svg>`,
  },
  socials: [
    {
      href: "https://www.linkedin.com/company/chainguard-dev/?utm_source=courses",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M6.93866 0.54776H18.0816C19.6971 0.548746 21.2462 1.18917 22.3888 2.32844C23.5314 3.46772 24.174 5.01275 24.1758 6.62429V17.7458C24.174 19.3574 23.5314 20.9024 22.3888 22.0417C21.2462 23.1809 19.6971 23.8214 18.0816 23.8223H6.93866C5.32319 23.8214 3.77407 23.1809 2.6315 22.0417C1.48892 20.9024 0.846243 19.3574 0.844513 17.7458V6.62429C0.846243 5.01275 1.48892 3.46772 2.6315 2.32844C3.77407 1.18917 5.32319 0.548746 6.93866 0.54776Z" fill="#14003D" class="fill-[#14003D] dark:fill-white"></path><path d="M5.21951 9.74698H8.28983V19.8509H5.21951V9.74698Z" fill="white" class="fill-white dark:fill-[#14003D]"></path><path d="M10.2475 12.8723C10.2475 11.81 10.2475 10.5197 10.2195 9.58685H13.1966C13.267 10.0764 13.3075 10.5698 13.318 11.0643C13.7659 10.1985 14.7178 9.28799 16.9669 9.28799C19.4307 9.28799 20.2239 11.0569 20.2239 14.239V19.8426H17.1536V14.5918C17.1536 13.051 16.5376 11.9618 15.539 11.9618C13.8125 11.9618 13.3086 13.065 13.3086 15.3506V19.8426H10.2382V12.8723H10.2475Z" fill="white" class="fill-white dark:fill-[#14003D]"></path><path d="M6.38628 8.09361C6.74022 8.09325 7.08614 7.9882 7.38025 7.79177C7.67436 7.59534 7.90353 7.31635 8.03872 6.99003C8.17391 6.66372 8.20905 6.30473 8.13977 5.95848C8.07049 5.61222 7.89985 5.29425 7.64945 5.04471C7.39904 4.79517 7.08011 4.6253 6.73294 4.55655C6.38578 4.4878 6.02595 4.52326 5.69899 4.65846C5.37202 4.79366 5.09267 5.02255 4.89606 5.31615C4.69946 5.60976 4.59451 5.95491 4.59451 6.30799C4.59464 6.54261 4.6411 6.77489 4.73122 6.9916C4.82133 7.2083 4.95331 7.40518 5.11969 7.57099C5.28608 7.7368 5.48359 7.86831 5.70092 7.95798C5.91825 8.04765 6.15109 8.09374 6.38628 8.09361Z" fill="white" class="fill-white dark:fill-[#14003D]"></path></svg>`,
    },
    {
      href: "https://www.youtube.com/@chainguard?utm_source=courses",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="22" viewBox="0 0 32 22" fill="none"><g clip-path="url(#clip0_560_16954)"><path class="dark:fill-white" d="M30.939 3.76117C30.765 3.10659 30.4251 2.51003 29.9533 2.03124C29.4815 1.55244 28.8944 1.20823 28.2508 1.03307C25.8804 0.387922 16.3768 0.387924 16.3768 0.387924C16.3768 0.387924 6.87064 0.387922 4.50282 1.03307C3.85919 1.20823 3.27207 1.55244 2.80028 2.03124C2.32848 2.51003 1.98856 3.10659 1.81459 3.76117C0.967769 8.67513 0.967769 13.7016 1.81459 18.6156C1.98856 19.2701 2.32848 19.8667 2.80028 20.3455C3.27207 20.8243 3.85919 21.1685 4.50282 21.3437C6.87325 21.9888 16.3768 21.9888 16.3768 21.9888C16.3768 21.9888 25.883 21.9888 28.2508 21.3437C28.8944 21.1685 29.4815 20.8243 29.9533 20.3455C30.4251 19.8667 30.765 19.2701 30.939 18.6156C31.7858 13.7016 31.7858 8.67513 30.939 3.76117ZM13.3341 15.8155V6.55948L21.232 11.1884L13.3341 15.8155Z" fill="#14003D"></path></g><defs><clipPath id="clip0_560_16954"><rect width="30.4" height="21.6" fill="white" transform="translate(0.820099 0.384995)"></rect></clipPath></defs></svg>`,
    },
    {
      href: "https://x.com/chainguard_dev?utm_source=courses",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style="/*! fill: black; */"><path d="M23.2 4.12826V20.2492C23.199 21.1972 22.8229 22.106 22.1544 22.776C21.4859 23.4459 20.5796 23.8223 19.6346 23.8223H3.56538C2.62042 23.8223 1.71412 23.4459 1.04559 22.776C0.377057 22.106 0.000985747 21.1972 1.9325e-06 20.2492V4.12826C-0.00048586 3.65823 0.0913754 3.19271 0.270334 2.75832C0.449292 2.32393 0.711839 1.92918 1.04296 1.59665C1.37409 1.26411 1.7673 1.00031 2.20011 0.820325C2.63292 0.64034 3.09685 0.547699 3.56538 0.547699L19.6346 0.547699C20.1032 0.547699 20.5671 0.64034 20.9999 0.820325C21.4327 1.00031 21.8259 1.26411 22.157 1.59665C22.4882 1.92918 22.7507 2.32393 22.9297 2.75832C23.1086 3.19271 23.2005 3.65823 23.2 4.12826Z" class="fill-[#14003D] dark:fill-white" style="fill: black;"></path><path d="M12.9469 11.4018L12.4476 10.6765L9.1811 5.92856H5.625L10.4562 13.0198L10.9545 13.7506L14.1635 18.4614H17.7939L12.9469 11.4018ZM11.49 13.1204L10.9925 12.3895L7.12836 6.71802H8.76629L11.9215 11.3003L12.4207 12.0265L16.2961 17.6626H14.5895L11.49 13.1204Z" class="fill-white dark:fill-[#14003D]" style="fill: white;"></path><path d="M10.7773 12.3836L11.2747 13.1145L10.7438 13.741L6.75345 18.4518H5.625L10.2455 13.0102L10.7773 12.3836Z" class="fill-white dark:fill-[#14003D]" style="fill: white;"></path><path d="M17.5451 5.92856L12.9051 11.4046L12.3743 12.0302L11.875 11.3041L12.4058 10.6785L16.4398 5.93043L17.5451 5.92856Z" class="fill-white dark:fill-[#14003D]" style="fill: white;"></path></svg>`,
    },
    {
      href: "https://github.com/chainguard-dev?utm_source=courses",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><g clip-path="url(#clip0_560_16956)"><path class="dark:fill-white" d="M20.9876 0.584808H4.11487C3.27582 0.584808 2.47114 0.918119 1.87784 1.51142C1.28454 2.10471 0.951233 2.9094 0.951233 3.74844L0.951233 20.6212C0.951233 21.4602 1.28454 22.2649 1.87784 22.8582C2.47114 23.4515 3.27582 23.7848 4.11487 23.7848H20.9876C21.8266 23.7848 22.6313 23.4515 23.2246 22.8582C23.8179 22.2649 24.1512 21.4602 24.1512 20.6212V3.74844C24.1512 2.9094 23.8179 2.10471 23.2246 1.51142C22.6313 0.918119 21.8266 0.584808 20.9876 0.584808ZM14.8251 19.1119C14.4534 19.183 14.3268 18.9589 14.3268 18.7731C14.3268 18.5411 14.3361 17.7752 14.3361 16.8222C14.3361 16.1539 14.1001 15.7175 13.847 15.504C15.4591 15.3287 17.1543 14.7263 17.1543 11.9897C17.165 11.2793 16.8983 10.5927 16.4109 10.0757C16.4834 9.89513 16.7286 9.17013 16.3384 8.1894C16.3384 8.1894 15.732 7.99826 14.3611 8.91967C13.1739 8.59979 11.9233 8.59979 10.7361 8.91967C9.34937 7.99694 8.74169 8.1894 8.74169 8.1894C8.34623 9.17276 8.59669 9.89776 8.67182 10.0757C8.18321 10.5911 7.91545 11.277 7.92573 11.9871C7.92573 14.7157 9.61828 15.3287 11.2212 15.5066C10.9583 15.7586 10.7954 16.0971 10.7625 16.4597C10.3472 16.6416 9.29664 16.9566 8.65337 15.8678C8.65337 15.8678 8.2711 15.1824 7.54346 15.1336C7.54346 15.1336 6.8356 15.1244 7.49205 15.5659C7.49205 15.5659 7.96923 15.7861 8.29878 16.6073C8.29878 16.6073 8.72455 17.9927 10.7414 17.5643C10.7414 18.1575 10.7493 18.6057 10.7493 18.7757C10.7493 18.9458 10.6175 19.1844 10.255 19.1171C7.37869 18.1786 5.30123 15.5093 5.30123 12.3614C5.30123 8.42667 8.54528 5.24326 12.5512 5.24326C16.5572 5.24326 19.8012 8.43326 19.8012 12.368C19.8012 15.504 17.7264 18.1759 14.8251 19.1119Z" fill="#14003D"></path></g><defs><clipPath id="clip0_560_16956"><rect width="23.2" height="23.2" fill="white" transform="translate(0.864532 0.584991)"></rect></clipPath></defs></svg>`,
    },
  ],
  contact: {
    href: "https://www.chainguard.dev/contact?utm_source=courses",
    label: "Talk to an expert",
  },
  copyright: {
    text: "©2025 Chainguard. All Rights Reserved.",
    links: [
      {
        label: "Privacy",
        href: "https://www.chainguard.dev/legal/privacy-notice?utm_source=courses",
      },
      {
        label: "Terms",
        href: "https://www.chainguard.dev/legal/terms-of-use?utm_source=courses",
      },
    ],
  },
  columns: [
    {
      className: "product-col",
      groups: [
        {
          title: "Product",
          links: [
            {
              label: "Chainguard Containers",
              href: "https://www.chainguard.dev/containers",
            },
            {
              label: "Chainguard Libraries",
              href: "https://www.chainguard.dev/libraries",
            },
            { label: "Chainguard VMs", href: "https://www.chainguard.dev/vms" },
            {
              label: "Images Directory",
              href: "https://images.chainguard.dev/",
            },
            {
              label: "Integrations",
              href: "https://www.chainguard.dev/scanners",
            },
            { label: "Pricing", href: "https://www.chainguard.dev/pricing" },
          ],
        },
      ],
    },
    {
      className: "solutions-col",
      groups: [
        {
          title: "Solutions",
          links: [
            {
              label: "FedRAMP",
              href: "https://www.chainguard.dev/solutions/fedramp",
            },
            {
              label: "PCI DSS",
              href: "https://www.chainguard.dev/solutions/pci",
            },
            {
              label: "CMMC 2.0",
              href: "https://www.chainguard.dev/solutions/cmmc",
            },
            {
              label: "Golden Images",
              href: "https://www.chainguard.dev/solutions/golden-images",
            },
            {
              label: "CVE Remediation",
              href: "https://www.chainguard.dev/solutions/cve-remediation",
            },
            {
              label: "Public Sector",
              href: "https://www.chainguard.dev/solutions/public-sector",
            },
            {
              label: "Startups",
              href: "https://www.chainguard.dev/solutions/startups",
            },
          ],
        },
      ],
    },
    {
      className: "resources-col",
      groups: [
        {
          title: "Resources",
          links: [
            {
              label: "Events & Webinars",
              href: "https://www.chainguard.dev/events",
            },
            {
              label: "Supply Chain Security 101",
              href: "https://www.chainguard.dev/supply-chain-security-101",
            },
            {
              label: "Chainguard Courses",
              href: "https://courses.chainguard.dev/",
            },
            { label: "Documentation", href: "https://edu.chainguard.dev/" },
            { label: "Trust Center", href: "https://edu.chainguard.dev/" },
            {
              label: "Chainguard Slack Community",
              href: "https://communityinviter.com/apps/chainguardcommunity/invite",
            },
          ],
        },
        {
          title: "Customers",
          links: [
            {
              label: "Customer Stories",
              href: "https://www.chainguard.dev/customers",
            },
            {
              label: "Chainguard Reviews",
              href: "https://www.chainguard.dev/chainguard-love",
            },
          ],
        },
      ],
    },
    {
      className: "company-col",
      groups: [
        {
          title: "Company",
          links: [
            {
              label: "About Us",
              href: "https://www.chainguard.dev/supply-chain-security-101",
            },
            { label: "Blog", href: "https://www.chainguard.dev/unchained" },
            { label: "Partners", href: "https://www.chainguard.dev/partners" },
            { label: "Newsroom", href: "https://www.chainguard.dev/newsroom" },
            { label: "Careers", href: "https://www.chainguard.dev/careers" },
            {
              label: "Legal",
              href: "https://www.chainguard.dev/legal/acceptable-use-policy",
            },
          ],
        },
      ],
    },
  ],
};

function generateFooter(data, containerId = "footer-container") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const copyrightContent = [
    el("p", { text: data.copyright.text }),
    el(
      "div",
      { className: "legal-links" },
      data.copyright.links
        .map((l) => el("a", { href: getCorrectURL(l.href), text: l.label }))

        // in-between every link we want a | separator except after the last one
        .reduce((acc, elem, idx, arr) => {
          acc.push(elem);
          if (idx < arr.length - 1) {
            acc.push(el("span", { text: " | " }));
          }
          return acc;
        }, [])
    ),
  ];

  const fc = el("div", { className: "footer-content-container" }, [
    el("div", { className: "primary-col" }, [
      el("div", { className: "tagline" }, [
        el("p", { text: "The trusted source for open source" }),
      ]),

      data.contact
        ? el(
            "div",
            { className: "ctas" },
            el(
              "a",
              {
                className: "button",
                href: getCorrectURL(data.contact.href),
                target: "_blank",
                text: data.contact.label,
              },
              [
                el(
                  "svg",
                  {
                    viewBox: "0 0 14 14",
                    width: "14",
                    height: "14",
                    fill: "white",
                    ariaHidden: "true",
                  },
                  [
                    "M11.2 5.6L11.2 2.8L8.4 2.8L8.4 5.6L11.2 5.6Z",
                    "M11.2 11.2L11.2 8.4L8.4 8.4L8.4 11.2L11.2 11.2Z",
                    "M8.4 2.8L8.4 -2.44784e-07L5.6 -3.67176e-07L5.6 2.8L8.4 2.8Z",
                    "M8.4 14L8.4 11.2L5.6 11.2L5.6 14L8.4 14Z",
                    "M8.4 8.4L8.4 5.6L5.6 5.6L5.6 8.4L8.4 8.4Z",
                    "M14 8.4L14 5.6L11.2 5.6L11.2 8.4L14 8.4Z",
                    "M2.8 8.4L2.8 5.6L-2.15213e-06 5.6L-2.27452e-06 8.4L2.8 8.4Z",
                  ].map((d) => el("path", { d }))
                ),
              ]
            )
          )
        : undefined,

      data.copyright
        ? el("div", { className: "copyright" }, copyrightContent)
        : undefined,
    ]),
  ]);

  // Columns
  (data.columns || []).forEach((col) => {
    const colDiv = el("div", {
      className: `footer-col ${col.className || ""}`,
    });
    (col.groups || []).forEach((g) => {
      const gDiv = el("div", { className: g.className || "" });
      if (g.title) gDiv.appendChild(el("h2", { text: g.title }));
      (g.links || []).forEach((link) =>
        gDiv.appendChild(
          el("a", {
            href: getCorrectURL(link.href),
            target: "_blank",
            text: link.label,
          })
        )
      );
      colDiv.appendChild(gDiv);
    });
    fc.appendChild(colDiv);
  });

  container.appendChild(fc);

  const hr = el("hr");
  container.appendChild(hr);

  const bottomBar = el("div", { className: "footer-bottom-bar" }, [
    // logo
    data.logo
      ? el("div", { className: "logo-container" }, [
          el("a", {
            href: getCorrectURL(data.logo.href),
            target: "_blank",
            innerHTML: data.logo.svg,
          }),
        ])
      : undefined,

    // socials
    data.socials?.length
      ? el(
          "div",
          { className: "social-icons" },
          data.socials.map((s) =>
            el("a", {
              href: getCorrectURL(s.href),
              target: "_blank",
              innerHTML: s.svg,
            })
          )
        )
      : undefined,
  ]);
  container.appendChild(bottomBar);
  container.appendChild(el("hr", { className: "copyright-separator" }));

  const copyrightFooter = el(
    "div",
    { className: "footer-copyright" },
    copyrightContent
  );
  container.appendChild(copyrightFooter);
}

// Run
generateFooter(footerData);
