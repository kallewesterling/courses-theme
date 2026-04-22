import { A, el } from "./utils.mjs";
import { setStyle } from "./styling.mjs";
import { CG } from "./CG.mjs";
import { pageHandlers } from "./router.mjs";
import { animateCompletion, shoot } from "./course-completion.mjs";
import { logger } from "./logger.mjs";

// static imports
import { config } from "../data/config.mjs";

// ── DEBUG_FLAGS ─────────────────────────────────────────────────────────────
const FLAGS_KEY = "DEBUG_FLAGS";
const DEFAULT_FLAGS = {
  disabled: false,
  logging: false,
  expose: false,
  useTestDomain: false,
};

function getFlags() {
  try {
    return { ...DEFAULT_FLAGS, ...JSON.parse(localStorage.getItem(FLAGS_KEY) || "{}") };
  } catch {
    return { ...DEFAULT_FLAGS };
  }
}

function setFlag(key, value) {
  localStorage.setItem(FLAGS_KEY, JSON.stringify({ ...getFlags(), [key]: value }));
}

// ── domain swapper ──────────────────────────────────────────────────────────
function updateLinks(useTestDomain) {
  A(
    `a[href*="${config.domains.prod.url}"], a[href*="${config.domains.stage.url}"]`
  ).forEach((link) => {
    const url = new URL(link.href);
    if (useTestDomain && url.hostname === config.domains.prod.url) {
      url.hostname = config.domains.stage.url;
    } else if (!useTestDomain && url.hostname === config.domains.stage.url) {
      url.hostname = config.domains.prod.url;
    }
    link.href = url.toString();
  });
}

// ── global exposure ─────────────────────────────────────────────────────────
const GLOBALS = { logger, animateCompletion, shoot, el, setStyle, CG };

function exposeGlobals()   { Object.assign(window, GLOBALS); }
function unexposeGlobals() { Object.keys(GLOBALS).forEach((k) => delete window[k]); }

// ── floating debug FAB ──────────────────────────────────────────────────────
function buildDebugFab() {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    #cg-debug-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: #6226fb;
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      font-family: Gellix, system-ui, sans-serif;
      letter-spacing: 0;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(98, 38, 251, 0.40);
      transition: transform 0.12s ease, box-shadow 0.12s ease;
    }
    #cg-debug-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 16px rgba(98, 38, 251, 0.55);
    }
    #cg-debug-panel {
      position: fixed;
      bottom: 64px;
      right: 20px;
      z-index: 99998;
      width: 232px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06);
      color: #1e293b;
      font-family: Gellix, system-ui, sans-serif;
      font-size: 13px;
    }
    #cg-debug-panel[hidden] { display: none; }
    .cg-dbg-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px 9px;
      border-bottom: 1px solid #f1f5f9;
    }
    .cg-dbg-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #64748b;
    }
    .cg-dbg-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      border: none;
      border-radius: 4px;
      background: none;
      color: #94a3b8;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
    }
    .cg-dbg-close:hover { background: #f1f5f9; color: #1e293b; }
    .cg-dbg-section {
      padding: 6px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .cg-dbg-section:last-child { border-bottom: none; }
    .cg-dbg-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      cursor: pointer;
      user-select: none;
    }
    .cg-dbg-row:hover { background: #f8fafc; }
    .cg-dbg-row input[type="checkbox"] {
      flex-shrink: 0;
      width: 13px;
      height: 13px;
      margin: 0;
      accent-color: #6226fb;
      cursor: pointer;
    }
    .cg-dbg-row-lbl { font-size: 12px; }
    .cg-dbg-note {
      padding: 1px 12px 5px 33px;
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .cg-dbg-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 8px 12px 6px;
    }
    .cg-dbg-kv { font-size: 11px; color: #94a3b8; }
    .cg-dbg-kv strong { color: #475569; font-weight: 600; }
    .cg-dbg-links {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 4px 12px 8px;
    }
    .cg-dbg-links a { font-size: 12px; color: #6226fb; text-decoration: none; }
    .cg-dbg-links a:hover { text-decoration: underline; }
  `;
  document.head.appendChild(styleEl);

  const flags = getFlags();
  const handler = pageHandlers.find(({ test }) => test)?.handler.name ?? "unknown";
  const envLabel = CG.env.isStaging ? "staging" : CG.env.isAdmin ? "admin" : "prod";

  function makeToggle(label, flagKey, note, onChange) {
    const id = `cg-dbg-${flagKey}`;
    const checkbox = el("input", { type: "checkbox", id });
    checkbox.checked = flags[flagKey];
    checkbox.addEventListener("change", () => {
      setFlag(flagKey, checkbox.checked);
      onChange?.(checkbox.checked);
    });
    const row = el("label", { className: "cg-dbg-row", for: id }, [
      checkbox,
      el("span", { className: "cg-dbg-row-lbl", textContent: label }),
    ]);
    return note
      ? [row, el("div", { className: "cg-dbg-note", textContent: note })]
      : [row];
  }

  const editLinks = [
    CG.state.course?.id
      ? el("a", { href: CG.state.course.edit, textContent: "Edit Course", target: "_blank" })
      : null,
    CG.state.course?.path?.id && CG.state.domain
      ? el("a", { href: CG.state.course.path.edit, textContent: "Edit Path", target: "_blank" })
      : null,
  ].filter(Boolean);

  const panel = el("div", { id: "cg-debug-panel" }, [
    el("div", { className: "cg-dbg-hd" }, [
      el("span", { className: "cg-dbg-title", textContent: "CG Debug" }),
      el("button", { className: "cg-dbg-close", textContent: "×", aria: { label: "Close" } }),
    ]),
    el("div", { className: "cg-dbg-section" }, [
      ...makeToggle("Disable debug", "disabled", "Takes effect on next page load"),
      ...makeToggle("Enable logging", "logging", null, (on) => {
        if (on) console.info("[CG] Logging enabled — reload for full output");
      }),
      ...makeToggle("Expose globals", "expose", "logger, el, CG, shoot, …", (on) =>
        on ? exposeGlobals() : unexposeGlobals()
      ),
      ...makeToggle("Use test domain", "useTestDomain", null, updateLinks),
    ]),
    el("div", { className: "cg-dbg-section" }, [
      el("div", { className: "cg-dbg-info" }, [
        el("div", { className: "cg-dbg-kv" }, [
          el("strong", { textContent: "Handler: " }),
          document.createTextNode(handler),
        ]),
        el("div", { className: "cg-dbg-kv" }, [
          el("strong", { textContent: "Env: " }),
          document.createTextNode(envLabel),
        ]),
      ]),
      ...(editLinks.length ? [el("div", { className: "cg-dbg-links" }, editLinks)] : []),
    ]),
  ]);
  panel.hidden = true;

  panel.querySelector(".cg-dbg-close").addEventListener("click", () => {
    panel.hidden = true;
  });

  const fab = el("button", {
    id: "cg-debug-fab",
    textContent: "D",
    aria: { label: "Open debug panel" },
  });
  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.hidden = !panel.hidden;
  });

  document.body.append(fab, panel);

  // apply initial domain state
  updateLinks(flags.useTestDomain);

  // close on outside click or Escape
  document.addEventListener(
    "click",
    (e) => {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== fab) {
        panel.hidden = true;
      }
    },
    { capture: true }
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) panel.hidden = true;
  });
}

/**
 * Adds a debug heading with environment information and a staging toggle.
 * @deprecated Use setupDebug() — the floating FAB supersedes this.
 * @returns {void}
 */
export function debugHeading() {}

/**
 * Sets up debug tooling. Reads and initialises DEBUG_FLAGS in localStorage,
 * builds the floating debug FAB, and (unless disabled) wires up logging,
 * global exposure, and environment logging.
 * @returns {void}
 */
export function setupDebug() {
  // first visit: seed flags based on environment
  if (localStorage.getItem(FLAGS_KEY) === null) {
    const auto = CG.env.isStaging || CG.env.isAdmin;
    localStorage.setItem(
      FLAGS_KEY,
      JSON.stringify({ ...DEFAULT_FLAGS, logging: auto, expose: auto })
    );
  }

  buildDebugFab();

  const flags = getFlags();
  if (flags.disabled) return;

  logger.info("Environment", CG.env);
  logger.info("State", CG.state);
  logger.info("Page", CG.page);

  if (flags.expose) exposeGlobals();
}
