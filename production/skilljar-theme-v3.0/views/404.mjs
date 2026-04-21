import { Q, el } from "../utils.mjs";
import { CG } from "../CG.mjs";

// static imports
import { partnerErrorMessage } from "../data/messages.mjs";

/**
 * This function applies styling to the 404 error page.
 * @returns {void}
 */
export function notFoundView() {
  if (CG.page.isPartner404 && !CG.env.isLoggedIn) {
    Q(".message").append(
      ...[
        el("hr"),
        el("p", {
          classList: "sj-text-page-not-found-explanation",
          innerHTML: partnerErrorMessage,
        }),
      ]
    );

    window.location.replace(
      `/auth/login?next=${encodeURIComponent(window.location.pathname)}`
    );
  }
}
