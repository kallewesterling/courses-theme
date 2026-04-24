import { el, sanitizeUrl } from "./utils.mjs";
import { logger } from "./logger.mjs";

// static imports
import { footerData } from "../data/footer.mjs";

/**
 * Generates the footer HTML and appends it to the specified container.
 * @param {Object} data - The footer data object.
 * @param {string} containerId - The ID of the container to append the footer to.
 * @returns {void}
 */
export function generateFooter(
  data = footerData,
  containerId = "footer-container",
  appendElement = false,
) {
  const container = document.getElementById(containerId);
  if (!container && !appendElement) {
    logger.error(`generateFooter: #${containerId} not found in DOM`);
    return;
  } else if (!container && appendElement) {
    logger.warn(
      `generateFooter: #${containerId} not found in DOM, creating and appending to body...`,
    );
    const newContainer = el("div", { id: containerId });
    
    // add it after div id="skilljar-content"
    const contentDiv = document.getElementById("skilljar-content");
    if (contentDiv) {
      contentDiv.insertAdjacentElement("afterend", newContainer);
    } else {
      logger.error(
        `generateFooter: #skilljar-content not found in DOM, cannot append footer container.`,
      );
      return;
    }
    return generateFooter(data, containerId, appendElement); // call again now that container exists
  }
  container.innerHTML = "";

  const copyrightContent = [
    el("p", { text: data.copyright.text }),
    el(
      "div",
      { className: "legal-links" },
      data.copyright.links
        .map((l) => el("a", { href: sanitizeUrl(l.href), text: l.label }))

        // in-between every link we want a | separator except after the last one
        .reduce((acc, elem, idx, arr) => {
          acc.push(elem);
          if (idx < arr.length - 1) {
            acc.push(el("span", { text: " | " }));
          }
          return acc;
        }, []),
    ),
  ];

  const fc = el("div", { className: "footer-content-container" }, [
    el("div", { className: "primary-col" }, [
      el("div", { className: "tagline" }, [
        el("a", {
          href: sanitizeUrl(data.logo.href),
          target: "_blank",
          innerHTML: data.logo.svg,
          class: "small-logo",
        }),
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
                href: sanitizeUrl(data.contact.href),
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
                  ].map((d) => el("path", { d })),
                ),
              ],
            ),
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
            href: sanitizeUrl(link.href),
            target: "_blank",
            text: link.label,
          }),
        ),
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
            href: sanitizeUrl(data.logo.href),
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
              href: sanitizeUrl(s.href),
              target: "_blank",
              innerHTML: s.svg,
            }),
          ),
        )
      : undefined,
  ]);
  container.appendChild(bottomBar);
  container.appendChild(el("hr", { className: "copyright-separator" }));

  const copyrightFooter = el(
    "div",
    { className: "footer-copyright" },
    copyrightContent,
  );
  container.appendChild(copyrightFooter);
}
