import { CG } from "./CG.mjs";

/**
 * Simple logger utility for console messages with styling.
 * Logs messages only if in staging or admin environment.
 * @returns {void}
 */
export const logger = {
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
